# API Reference

Semua route API dilindungi oleh autentikasi Bearer JWT, kecuali `POST /auth/login` dan `POST /auth/register`.

## Autentikasi (`/auth`)

- **POST `/auth/register`**
  - Payload: `{ shopName, businessType, email, password, role }`
  - Deskripsi: Mendaftarkan toko/bisnis baru beserta user pertama (Owner) atau meregistrasikan staff ke dalam sebuah bisnis.
  
- **POST `/auth/login`**
  - Payload: `{ email, password }`
  - Deskripsi: Menghasilkan token JWT untuk sesi pengguna.
  
- **GET `/auth/me`**
  - Header: `Authorization: Bearer <token>`
  - Deskripsi: Mengambil informasi sesi saat ini (berguna untuk *auto-login* saat _refresh page_ di React).

## Produk (`/products`)

- **GET `/products`**
  - Deskripsi: Mengambil seluruh daftar barang/katalog yang aktif untuk bisnis dari akun yang terotentikasi.
  
- **POST `/products`**
  - Payload: `{ name, sku, category, price, stock }`
  - Deskripsi: Mendaftarkan barang baru ke dalam katalog. Nilai `stock` tidak direkomendasikan diubah secara langsung melainkan melalui mekanisme `/transactions`.

## Transaksi / Mutasi Barang (`/transactions`)

- **POST `/transactions`**
  - Payload: `{ productId, type, qty, supplier, invoice, customer, note, date }`
  - Deskripsi: Mencatat riwayat pergerakan stok ('in', 'out', 'return'). Endpoint ini otomatis menggunakan _database transaction_ (BEGIN/COMMIT) untuk menambah atau mengurangi kolom `stock` di tabel `products`. Akan merespon dengan status `409 Conflict` jika sisa stok kurang dari nilai `qty` keluar.

## Pengaturan Bisnis (`/settings`)

- **GET `/settings/threshold`**
  - Deskripsi: Membaca pengaturan batas stok kritis.
  
- **PUT `/settings/threshold`**
  - Payload: `{ threshold }`
  - Deskripsi: Memperbarui batas minimum stok (hanya boleh dilakukan oleh peran 'Owner').

## Endpoint Agregasi Khusus

1. **GET `/dashboard/summary`**
   - Deskripsi: Menghasilkan perhitungan yang dioptimalkan dari backend untuk `totalProducts`, `totalStock`, mutasi barang masuk/keluar hari ini, nilai penjualan `salesValue7Days`, daftar barang dengan `lowStockItems`, dan log transaksi terakhir.

2. **GET `/reports/stock?range=[daily|weekly|monthly]`**
   - Deskripsi: Mengambil rangkuman stok dan laporan mutasi barang berdasarkan rentang filter (berguna untuk laporan yang harus diekspor/ditampilkan dalam grid).

3. **GET `/predictions/stock`**
   - Deskripsi: Memproses riwayat penjualan yang ada di server dan menghitung rata-rata kecepatan penjualan harian per SKU untuk memberikan rekomendasi _re-order date_ dan mendeteksi level kelangkaan _Kritis_, _Hati-hati_, atau _Aman_.
