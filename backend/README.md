# StockWise Backend

Backend Express.js + PostgreSQL untuk frontend StockWise.

## Setup

1. Buat database PostgreSQL:

```sql
CREATE DATABASE stockwise;
```

2. Jalankan schema:

```bash
psql "postgres://postgres:postgres@localhost:5432/stockwise" -f db/schema.sql
```

3. Install dependency backend:

```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

API berjalan di `http://localhost:5000/api`.

## Endpoint Utama

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `GET /api/products`
- `POST /api/products`
- `PATCH /api/products/:id`
- `DELETE /api/products/:id`
- `GET /api/transactions`
- `POST /api/transactions`
- `GET /api/settings/threshold`
- `PATCH /api/settings/threshold`
- `GET /api/dashboard/summary`
- `GET /api/reports/stock?range=daily|weekly|monthly`
- `GET /api/predictions/stock`

Semua endpoint selain register, login, dan health memakai header:

```http
Authorization: Bearer <token>
```

## Catatan Integrasi Frontend

Format response list produk sudah menyertakan alias camelCase agar cocok dengan state lama frontend:

```json
{
  "id": 1,
  "name": "Tepung Terigu",
  "sku": "SKU-001",
  "category": "Lainnya",
  "price": 25000,
  "stock": 50
}
```

Format transaksi:

```json
{
  "id": 1,
  "productId": 1,
  "type": "in",
  "qty": 10,
  "note": "Supplier: PT A | No. Faktur: INV-001",
  "date": "07/06/2026, 23.20"
}
```
