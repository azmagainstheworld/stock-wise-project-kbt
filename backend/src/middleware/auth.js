import { query } from "../config/db.js";
import { HttpError } from "../utils/httpError.js";
import { verifyToken } from "../utils/auth.js";
import { userDto } from "../utils/formatters.js";

export async function requireAuth(req, _res, next) {
  try {
    const header = req.headers.authorization || "";
    const [scheme, token] = header.split(" ");

    if (scheme !== "Bearer" || !token) {
      throw new HttpError(401, "Authorization token is required");
    }

    const payload = verifyToken(token);
    const result = await query(
      `SELECT u.id, u.business_id, u.name, u.email, u.role, b.shop_name, b.business_type
       FROM users u
       JOIN businesses b ON b.id = u.business_id
       WHERE u.id = $1`,
      [payload.sub],
    );

    if (result.rowCount === 0) {
      throw new HttpError(401, "Invalid session");
    }

    req.user = userDto(result.rows[0]);
    next();
  } catch (error) {
    next(error.status ? error : new HttpError(401, "Invalid or expired token"));
  }
}

export function requireRole(...roles) {
  return (req, _res, next) => {
    if (!roles.includes(req.user?.role)) {
      return next(new HttpError(403, "You do not have access to this resource"));
    }
    next();
  };
}
