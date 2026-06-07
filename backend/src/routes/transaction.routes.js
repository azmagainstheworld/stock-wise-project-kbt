import { Router } from "express";
import { query, withTransaction } from "../config/db.js";
import { validate } from "../middleware/validate.js";
import { transactionSchemas } from "../validators/schemas.js";
import { HttpError, notFound } from "../utils/httpError.js";
import { productDto, transactionDto } from "../utils/formatters.js";

const router = Router();

function rangeSql(range) {
  if (range === "daily") return "AND st.occurred_at >= date_trunc('day', now())";
  if (range === "weekly") return "AND st.occurred_at >= date_trunc('week', now())";
  if (range === "monthly") return "AND st.occurred_at >= date_trunc('month', now())";
  return "";
}

function buildDefaultNote(payload) {
  if (payload.note) return payload.note;
  if (payload.type === "in") {
    return `Supplier: ${payload.supplier || "-"} | No. Faktur: ${payload.invoice || "-"} | Catatan: -`;
  }
  return `Pelanggan/Tujuan: ${payload.customer || "-"} | Alasan: ${
    payload.type === "out" ? "Penjualan" : "Retur Rusak"
  } | Catatan: -`;
}

router.get("/", validate(transactionSchemas.list), async (req, res, next) => {
  try {
    const params = [req.user.businessId];
    let typeFilter = "";

    if (req.query.type) {
      params.push(req.query.type);
      typeFilter = `AND st.type = $${params.length}`;
    }

    params.push(req.query.limit || 100);
    const result = await query(
      `SELECT st.*, p.name AS product_name, p.sku
       FROM stock_transactions st
       JOIN products p ON p.id = st.product_id
       WHERE st.business_id = $1
       ${typeFilter}
       ${rangeSql(req.query.range)}
       ORDER BY st.occurred_at DESC, st.id DESC
       LIMIT $${params.length}`,
      params,
    );

    res.json({ data: result.rows.map(transactionDto) });
  } catch (error) {
    next(error);
  }
});

router.post("/", validate(transactionSchemas.create), async (req, res, next) => {
  try {
    const payload = req.body;

    const result = await withTransaction(async (client) => {
      const productResult = await client.query(
        `SELECT * FROM products
         WHERE id = $1 AND business_id = $2 AND is_active = TRUE
         FOR UPDATE`,
        [payload.productId, req.user.businessId],
      );

      if (productResult.rowCount === 0) throw notFound("Product not found");

      const product = productResult.rows[0];
      const delta = payload.type === "in" ? payload.qty : -payload.qty;
      const nextStock = Number(product.stock) + delta;

      if (nextStock < 0) {
        throw new HttpError(409, `Stok tidak mencukupi. Sisa stok saat ini ${product.stock} unit.`);
      }

      const transactionResult = await client.query(
        `INSERT INTO stock_transactions (
          business_id, product_id, actor_user_id, type, quantity,
          supplier, invoice_number, customer, note, occurred_at
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, COALESCE($10, now()))
        RETURNING *`,
        [
          req.user.businessId,
          payload.productId,
          req.user.id,
          payload.type,
          payload.qty,
          payload.supplier || null,
          payload.invoice || null,
          payload.customer || null,
          buildDefaultNote(payload),
          payload.occurredAt || null,
        ],
      );

      const updatedProductResult = await client.query(
        `UPDATE products
         SET stock = $1, updated_at = now()
         WHERE id = $2
         RETURNING *`,
        [nextStock, payload.productId],
      );

      const txWithProduct = {
        ...transactionResult.rows[0],
        product_name: product.name,
        sku: product.sku,
      };

      return {
        transaction: transactionDto(txWithProduct),
        product: productDto(updatedProductResult.rows[0]),
      };
    });

    res.status(201).json({ data: result });
  } catch (error) {
    next(error);
  }
});

export default router;
