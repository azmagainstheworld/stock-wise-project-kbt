# Database Schema

Aplikasi StockWise menggunakan PostgreSQL sebagai database relational. 

## Tipe Data Custom (ENUM)
- `user_role`: ENUM ('Owner', 'Staff')
- `transaction_type`: ENUM ('in', 'out', 'return')

---

## 1. Tabel `businesses`
Menyimpan data pendaftaran entitas bisnis / UMKM.
- `id` (UUID, Primary Key)
- `shop_name` (VARCHAR 160, Not Null)
- `business_type` (VARCHAR 80, Default 'FMCG')
- `created_at` (TIMESTAMPTZ)
- `updated_at` (TIMESTAMPTZ)

## 2. Tabel `users`
Menyimpan data otentikasi dan identitas staf/pemilik toko.
- `id` (UUID, Primary Key)
- `business_id` (UUID, Foreign Key -> `businesses.id`, ON DELETE CASCADE)
- `name` (VARCHAR 120, Not Null)
- `email` (VARCHAR 180, UNIQUE)
- `password_hash` (TEXT, Not Null)
- `role` (`user_role`, Default 'Staff')
- `created_at`, `updated_at` (TIMESTAMPTZ)

## 3. Tabel `business_settings`
Menyimpan konfigurasi khusus untuk satu entitas bisnis, seperti batas minimum stok peringatan.
- `business_id` (UUID, Primary Key, Foreign Key -> `businesses.id`, ON DELETE CASCADE)
- `stock_threshold` (INTEGER, Default 5, CHECK >= 0)
- `updated_at` (TIMESTAMPTZ)

## 4. Tabel `products`
Katalog master barang untuk setiap bisnis.
- `id` (BIGSERIAL, Primary Key)
- `business_id` (UUID, Foreign Key -> `businesses.id`, ON DELETE CASCADE)
- `name` (VARCHAR 180, Not Null)
- `sku` (VARCHAR 100, Not Null)
- `category` (VARCHAR 80, Default 'Lainnya')
- `price` (NUMERIC 14,2, Default 0)
- `stock` (INTEGER, Default 0) - *Ini adalah field yang akan diperbarui secara otomatis ketika terjadi mutasi barang.*
- `is_active` (BOOLEAN, Default TRUE)
- `created_at`, `updated_at` (TIMESTAMPTZ)
- **Constraint:** UNIQUE (`business_id`, `sku`)

## 5. Tabel `stock_transactions`
Menyimpan riwayat mutasi / pergerakan barang.
- `id` (BIGSERIAL, Primary Key)
- `business_id` (UUID, Foreign Key -> `businesses.id`, ON DELETE CASCADE)
- `product_id` (BIGINT, Foreign Key -> `products.id`, ON DELETE RESTRICT)
- `actor_user_id` (UUID, Foreign Key -> `users.id`, ON DELETE SET NULL)
- `type` (`transaction_type`: 'in', 'out', 'return')
- `quantity` (INTEGER, CHECK > 0)
- `supplier` (VARCHAR 160, Optional) - *Untuk barang masuk*
- `invoice_number` (VARCHAR 120, Optional) - *Untuk barang masuk*
- `customer` (VARCHAR 160, Optional) - *Untuk barang keluar/retur*
- `note` (TEXT, Optional)
- `occurred_at` (TIMESTAMPTZ)
- `created_at` (TIMESTAMPTZ)

---

## Indeks
- `idx_products_business_active`: Untuk query produk yang masih aktif.
- `idx_products_business_sku`: Untuk validasi SKU.
- `idx_stock_transactions_business_time`: Untuk laporan agregat level bisnis (Dashboard & Reports).
- `idx_stock_transactions_product_time`: Untuk riwayat transaksi tiap barang (Forecasting AI).
