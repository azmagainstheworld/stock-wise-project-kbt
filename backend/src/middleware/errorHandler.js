import { ZodError } from "zod";

export function errorHandler(error, _req, res, _next) {
  if (error instanceof ZodError) {
    return res.status(422).json({
      message: "Validation failed",
      errors: error.flatten(),
    });
  }

  if (error.code === "23505") {
    return res.status(409).json({ message: "Data already exists" });
  }

  const status = error.status || 500;
  const message = status === 500 ? "Internal server error" : error.message;

  if (status === 500) {
    console.error(error);
  }

  return res.status(status).json({
    message,
    details: error.details,
  });
}
