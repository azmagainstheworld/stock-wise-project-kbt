export function toNumber(value) {
  if (value === null || value === undefined) return value;
  return Number(value);
}

export function productDto(row) {
  return {
    id: Number(row.id),
    name: row.name,
    sku: row.sku,
    category: row.category,
    price: Number(row.price),
    stock: Number(row.stock),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function transactionDto(row) {
  return {
    id: Number(row.id),
    productId: Number(row.product_id),
    productName: row.product_name,
    sku: row.sku,
    type: row.type,
    qty: Number(row.quantity),
    supplier: row.supplier,
    invoice: row.invoice_number,
    customer: row.customer,
    note: row.note,
    date: new Intl.DateTimeFormat("id-ID", {
      dateStyle: "short",
      timeStyle: "short",
      timeZone: "Asia/Makassar",
    }).format(new Date(row.occurred_at)),
    occurredAt: row.occurred_at,
  };
}

export function userDto(row) {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    role: row.role,
    businessId: row.business_id,
    shopName: row.shop_name,
    businessType: row.business_type,
  };
}
