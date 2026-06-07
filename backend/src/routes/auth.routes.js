import bcrypt from "bcryptjs";
import { Router } from "express";
import { query, withTransaction } from "../config/db.js";
import { validate } from "../middleware/validate.js";
import { authSchemas } from "../validators/schemas.js";
import { HttpError } from "../utils/httpError.js";
import { signToken } from "../utils/auth.js";
import { userDto } from "../utils/formatters.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

router.post("/register", validate(authSchemas.register), async (req, res, next) => {
  try {
    const { name, shopName, businessType, email, password, role } = req.body;
    const passwordHash = await bcrypt.hash(password, 10);

    const user = await withTransaction(async (client) => {
      const businessResult = await client.query(
        `INSERT INTO businesses (shop_name, business_type)
         VALUES ($1, $2)
         RETURNING id, shop_name, business_type`,
        [shopName, businessType],
      );

      const business = businessResult.rows[0];

      await client.query(
        `INSERT INTO business_settings (business_id, stock_threshold)
         VALUES ($1, 5)`,
        [business.id],
      );

      const userResult = await client.query(
        `INSERT INTO users (business_id, name, email, password_hash, role)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING id, business_id, name, email, role`,
        [business.id, name || shopName, email, passwordHash, role],
      );

      return {
        ...userResult.rows[0],
        shop_name: business.shop_name,
        business_type: business.business_type,
      };
    });

    res.status(201).json({ token: signToken(user), user: userDto(user) });
  } catch (error) {
    next(error);
  }
});

router.post("/login", validate(authSchemas.login), async (req, res, next) => {
  try {
    const { email, password, role } = req.body;
    const result = await query(
      `SELECT u.id, u.business_id, u.name, u.email, u.password_hash, u.role, b.shop_name, b.business_type
       FROM users u
       JOIN businesses b ON b.id = u.business_id
       WHERE u.email = $1`,
      [email],
    );

    if (result.rowCount === 0) {
      throw new HttpError(401, "Email atau password salah");
    }

    const user = result.rows[0];
    const valid = await bcrypt.compare(password, user.password_hash);

    if (!valid || (role && user.role !== role)) {
      throw new HttpError(401, "Email, password, atau role salah");
    }

    res.json({ token: signToken(user), user: userDto(user) });
  } catch (error) {
    next(error);
  }
});

router.get("/me", requireAuth, (req, res) => {
  res.json({ user: req.user });
});

export default router;
