import { z } from "zod";

const idParam = z.object({
  id: z.coerce.number().int().positive(),
});

export const authSchemas = {
  register: z.object({
    body: z.object({
      name: z.string().trim().min(1).max(120).optional(),
      shopName: z.string().trim().min(1).max(160),
      businessType: z.string().trim().min(1).max(80).default("FMCG"),
      email: z.string().trim().email().max(180),
      password: z.string().min(6).max(120),
      role: z.enum(["Owner", "Staff"]).default("Owner"),
    }),
  }),
  login: z.object({
    body: z.object({
      email: z.string().trim().email(),
      password: z.string().min(1),
      role: z.enum(["Owner", "Staff"]).optional(),
    }),
  }),
};

export const productSchemas = {
  list: z.object({
    query: z.object({
      search: z.string().optional(),
      category: z.string().optional(),
    }),
  }),
  create: z.object({
    body: z.object({
      name: z.string().trim().min(1).max(180),
      sku: z.string().trim().min(1).max(100),
      category: z.string().trim().max(80).default("Lainnya"),
      price: z.coerce.number().nonnegative().default(0),
      stock: z.coerce.number().int().nonnegative().default(0),
    }),
  }),
  update: z.object({
    params: idParam,
    body: z.object({
      name: z.string().trim().min(1).max(180).optional(),
      sku: z.string().trim().min(1).max(100).optional(),
      category: z.string().trim().max(80).optional(),
      price: z.coerce.number().nonnegative().optional(),
      stock: z.coerce.number().int().nonnegative().optional(),
    }),
  }),
  id: z.object({
    params: idParam,
  }),
};

export const transactionSchemas = {
  list: z.object({
    query: z.object({
      type: z.enum(["in", "out", "return"]).optional(),
      range: z.enum(["daily", "weekly", "monthly"]).optional(),
      limit: z.coerce.number().int().positive().max(200).optional(),
    }),
  }),
  create: z.object({
    body: z.object({
      productId: z.coerce.number().int().positive(),
      type: z.enum(["in", "out", "return"]),
      qty: z.coerce.number().int().positive(),
      supplier: z.string().trim().max(160).optional(),
      invoice: z.string().trim().max(120).optional(),
      customer: z.string().trim().max(160).optional(),
      note: z.string().trim().max(1000).optional(),
      occurredAt: z.coerce.date().optional(),
    }),
  }),
};

export const settingsSchemas = {
  threshold: z.object({
    body: z.object({
      threshold: z.coerce.number().int().nonnegative(),
    }),
  }),
};

export const reportSchemas = {
  stock: z.object({
    query: z.object({
      range: z.enum(["daily", "weekly", "monthly"]).default("daily"),
    }),
  }),
};
