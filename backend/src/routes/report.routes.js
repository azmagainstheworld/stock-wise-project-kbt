import { Router } from "express";
import { query } from "../config/db.js";
import { validate } from "../middleware/validate.js";
import { reportSchemas } from "../validators/schemas.js";
import { transactionDto } from "../utils/formatters.js";

const router = Router();

function rangeCondition(range) {
  if (range === "weekly") return "AND st.occurred_at >= date_trunc('week', now())";
  if (range === "monthly") return "AND st.occurred_at >= date_trunc('month', now())";
  return "AND st.occurred_at >= date_trunc('day', now())";
}

router.get("/stock", validate(reportSchemas.stock), async (req, res, next) => {
  try {
    const condition = rangeCondition(req.query.range);

    const [summary, rows] = await Promise.all([
      query(
        `SELECT
          COALESCE(SUM(st.quantity) FILTER (WHERE st.type = 'in'), 0)::int AS total_in,
          COALESCE(SUM(st.quantity) FILTER (WHERE st.type IN ('out', 'return')), 0)::int AS total_out,
          (SELECT COALESCE(SUM(stock), 0)::int FROM products WHERE business_id = $1 AND is_active = TRUE) AS total_stock_end,
          COUNT(st.id)::int AS total_records
         FROM stock_transactions st
         WHERE st.business_id = $1
         ${condition}`,
        [req.user.businessId],
      ),
      query(
        `SELECT st.*, p.name AS product_name, p.sku
         FROM stock_transactions st
         JOIN products p ON p.id = st.product_id
         WHERE st.business_id = $1
         ${condition}
         ORDER BY st.occurred_at DESC, st.id DESC`,
        [req.user.businessId],
      ),
    ]);

    res.json({
      range: req.query.range,
      summary: {
        in: summary.rows[0].total_in,
        out: summary.rows[0].total_out,
        totalStockEnd: summary.rows[0].total_stock_end,
        totalRecords: summary.rows[0].total_records,
      },
      transactions: rows.rows.map(transactionDto),
    });
  } catch (error) {
    next(error);
  }
});

export default router;
