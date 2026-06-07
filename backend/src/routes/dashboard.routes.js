import { Router } from "express";
import { query } from "../config/db.js";
import { productDto, transactionDto } from "../utils/formatters.js";

const router = Router();

router.get("/summary", async (req, res, next) => {
  try {
    const [settings, productStats, transactionStats, lowStock, recent, chart] = await Promise.all([
      query(
        `SELECT stock_threshold FROM business_settings WHERE business_id = $1`,
        [req.user.businessId],
      ),
      query(
        `SELECT COUNT(*)::int AS total_products, COALESCE(SUM(stock), 0)::int AS total_stock
         FROM products
         WHERE business_id = $1 AND is_active = TRUE`,
        [req.user.businessId],
      ),
      query(
        `SELECT
          COALESCE(SUM(quantity) FILTER (WHERE type = 'in' AND occurred_at >= date_trunc('day', now())), 0)::int AS total_in_today,
          COALESCE(SUM(quantity) FILTER (WHERE type = 'out' AND occurred_at >= date_trunc('day', now())), 0)::int AS total_out_today,
          COALESCE(SUM(quantity * p.price) FILTER (WHERE st.type = 'out' AND st.occurred_at >= now() - interval '7 days'), 0)::numeric AS sales_value_7_days
         FROM stock_transactions st
         JOIN products p ON p.id = st.product_id
         WHERE st.business_id = $1`,
        [req.user.businessId],
      ),
      query(
        `SELECT p.*
         FROM products p
         CROSS JOIN business_settings bs
         WHERE p.business_id = $1
           AND bs.business_id = p.business_id
           AND p.is_active = TRUE
           AND p.stock <= bs.stock_threshold
         ORDER BY p.stock ASC, p.name ASC
         LIMIT 10`,
        [req.user.businessId],
      ),
      query(
        `SELECT st.*, p.name AS product_name, p.sku
         FROM stock_transactions st
         JOIN products p ON p.id = st.product_id
         WHERE st.business_id = $1
         ORDER BY st.occurred_at DESC, st.id DESC
         LIMIT 4`,
        [req.user.businessId],
      ),
      query(
        `SELECT
          to_char(days.day, 'DD/MM') AS date,
          COALESCE(SUM(st.quantity * p.price) FILTER (WHERE st.type = 'out'), 0)::numeric AS sales
         FROM generate_series(
           date_trunc('day', now()) - interval '6 days',
           date_trunc('day', now()),
           interval '1 day'
         ) AS days(day)
         LEFT JOIN stock_transactions st
           ON st.business_id = $1
          AND st.occurred_at >= days.day
          AND st.occurred_at < days.day + interval '1 day'
         LEFT JOIN products p ON p.id = st.product_id
         GROUP BY days.day
         ORDER BY days.day ASC`,
        [req.user.businessId],
      ),
    ]);

    const threshold = settings.rows[0]?.stock_threshold ?? 5;

    res.json({
      threshold,
      totalProducts: productStats.rows[0].total_products,
      totalStock: productStats.rows[0].total_stock,
      totalInToday: transactionStats.rows[0].total_in_today,
      totalOutToday: transactionStats.rows[0].total_out_today,
      salesValue7Days: Number(transactionStats.rows[0].sales_value_7_days),
      lowStockCount: lowStock.rowCount,
      lowStockItems: lowStock.rows.map(productDto),
      recentActivities: recent.rows.map(transactionDto),
      chartData: chart.rows.map((row) => ({
        date: row.date,
        stock: Number(row.sales),
      })),
    });
  } catch (error) {
    next(error);
  }
});

export default router;
