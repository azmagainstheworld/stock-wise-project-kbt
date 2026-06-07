import { Router } from "express";
import { query } from "../config/db.js";
import { validate } from "../middleware/validate.js";
import { settingsSchemas } from "../validators/schemas.js";

const router = Router();

router.get("/threshold", async (req, res, next) => {
  try {
    const result = await query(
      `SELECT stock_threshold
       FROM business_settings
       WHERE business_id = $1`,
      [req.user.businessId],
    );

    res.json({ threshold: result.rows[0]?.stock_threshold ?? 5 });
  } catch (error) {
    next(error);
  }
});

router.patch("/threshold", validate(settingsSchemas.threshold), async (req, res, next) => {
  try {
    const result = await query(
      `INSERT INTO business_settings (business_id, stock_threshold)
       VALUES ($1, $2)
       ON CONFLICT (business_id)
       DO UPDATE SET stock_threshold = EXCLUDED.stock_threshold, updated_at = now()
       RETURNING stock_threshold`,
      [req.user.businessId, req.body.threshold],
    );

    res.json({ threshold: result.rows[0].stock_threshold });
  } catch (error) {
    next(error);
  }
});

export default router;
