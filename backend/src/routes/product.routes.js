import { Router } from "express";
import { query } from "../config/db.js";
import { validate } from "../middleware/validate.js";
import { productSchemas } from "../validators/schemas.js";
import { notFound } from "../utils/httpError.js";
import { productDto } from "../utils/formatters.js";

const router = Router();

router.get("/", validate(productSchemas.list), async (req, res, next) => {
  try {
    const { search, category } = req.query;
    const params = [req.user.businessId];
    const where = ["business_id = $1", "is_active = TRUE"];

    if (search) {
      params.push(`%${search}%`);
      where.push(`(name ILIKE $${params.length} OR sku ILIKE $${params.length})`);
    }

    if (category && category !== "Semua") {
      params.push(category);
      where.push(`category = $${params.length}`);
    }

    const result = await query(
      `SELECT * FROM products
       WHERE ${where.join(" AND ")}
       ORDER BY name ASC`,
      params,
    );

    res.json({ data: result.rows.map(productDto) });
  } catch (error) {
    next(error);
  }
});

router.post("/", validate(productSchemas.create), async (req, res, next) => {
  try {
    const { name, sku, category, price, stock } = req.body;
    const result = await query(
      `INSERT INTO products (business_id, name, sku, category, price, stock)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [req.user.businessId, name, sku, category, price, stock],
    );

    res.status(201).json({ data: productDto(result.rows[0]) });
  } catch (error) {
    next(error);
  }
});

router.get("/:id", validate(productSchemas.id), async (req, res, next) => {
  try {
    const result = await query(
      `SELECT * FROM products
       WHERE id = $1 AND business_id = $2 AND is_active = TRUE`,
      [req.params.id, req.user.businessId],
    );

    if (result.rowCount === 0) throw notFound("Product not found");
    res.json({ data: productDto(result.rows[0]) });
  } catch (error) {
    next(error);
  }
});

router.patch("/:id", validate(productSchemas.update), async (req, res, next) => {
  try {
    const fields = [];
    const params = [];

    for (const [key, column] of Object.entries({
      name: "name",
      sku: "sku",
      category: "category",
      price: "price",
      stock: "stock",
    })) {
      if (req.body[key] !== undefined) {
        params.push(req.body[key]);
        fields.push(`${column} = $${params.length}`);
      }
    }

    if (fields.length === 0) {
      return res.status(400).json({ message: "No update fields provided" });
    }

    params.push(req.params.id, req.user.businessId);
    const result = await query(
      `UPDATE products
       SET ${fields.join(", ")}, updated_at = now()
       WHERE id = $${params.length - 1} AND business_id = $${params.length} AND is_active = TRUE
       RETURNING *`,
      params,
    );

    if (result.rowCount === 0) throw notFound("Product not found");
    res.json({ data: productDto(result.rows[0]) });
  } catch (error) {
    next(error);
  }
});

router.delete("/:id", validate(productSchemas.id), async (req, res, next) => {
  try {
    const result = await query(
      `UPDATE products
       SET is_active = FALSE, updated_at = now()
       WHERE id = $1 AND business_id = $2 AND is_active = TRUE
       RETURNING id`,
      [req.params.id, req.user.businessId],
    );

    if (result.rowCount === 0) throw notFound("Product not found");
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

export default router;
