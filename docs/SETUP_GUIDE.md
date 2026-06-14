# Panduan Pengaturan dan Instalasi (Setup Guide)

Dokumen ini menjelaskan cara menjalankan aplikasi StockWise di lingkungan pengembangan lokal (Local Development).

## Prasyarat
- **Node.js** v18 atau yang lebih baru.
- **PostgreSQL** versi 13 atau yang lebih baru.
- (Opsional) pgAdmin atau DBeaver untuk melihat database.

## 1. Setup Backend
Masuk ke direktori `backend` dan jalankan proses ini:

```bash
cd backend
npm install
```

### Konfigurasi `.env`
Salin template dari `.env.example` ke `.env` (atau buat file baru) dan isi nilai konfigurasi berikut:

```ini
PORT=5000
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=password_database_anda
DB_NAME=stockwise_db
JWT_SECRET=rahasia_super_aman_untuk_token_jwt
```

### Setup Database
Pastikan layanan PostgreSQL berjalan di mesin Anda.
1. Buat database `stockwise_db`.
2. Anda dapat menggunakan alat SQL GUI untuk menjalankan script `backend/db/schema.sql` dan (opsional) `backend/db/seed.sql`.
3. Alternatif lain jika Anda telah melakukan setup skrip inisialisasi, aplikasi secara otomatis membaca schema jika tersedia logika db-migration.

### Menjalankan Backend Server
```bash
npm run backend:dev
```
Backend akan menyala di `http://localhost:5000`.

## 2. Setup Frontend
Buka terminal baru, masuk ke direktori `frontend`.

```bash
cd frontend
npm install
```

### Menjalankan Frontend Server (Vite)
Karena klien Vite secara otomatis mem-proxy atau dihubungkan ke `http://localhost:5000/api` (berdasarkan konfigurasi di `api.js` atau vite config jika ada), cukup jalankan:

```bash
npm run dev
```

Aplikasi frontend biasanya akan menyala di `http://localhost:5173`.
Kunjungi URL tersebut melalui peramban (browser) web modern Anda.

## 3. Langkah Pengujian Awal
1. Kunjungi halaman `http://localhost:5173/register`
2. Daftarkan bisnis Anda menggunakan nama toko dan akun bertipe `Owner`.
3. Anda akan langsung dialihkan ke `Dashboard`.
4. Masuk ke halaman **Produk** dan daftarkan minimal satu barang.
5. Cobalah gunakan fitur **Barang Masuk** dan **Barang Keluar** dan pantau dampaknya pada grafik analitik, halaman **Laporan**, dan estimasi AI pada **Prediksi**.
