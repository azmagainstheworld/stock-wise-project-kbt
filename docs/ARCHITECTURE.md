# System Architecture

StockWise dibangun menggunakan arsitektur modern berbasis **Client-Server**.

## 1. Frontend (Client)
- **Framework:** React + Vite
- **Routing:** React Router v6
- **Styling:** Tailwind CSS (Vanilla CSS untuk styling kustom)
- **State Management:** React Context API (`DataContext.jsx`)
- **HTTP Client:** Axios dengan JWT Interceptors (`utils/api.js`)

Frontend sepenuhnya bertindak sebagai presentasi, di mana seluruh agregasi dan analisis data berat (seperti Forecasting AI dan Rekap Laporan) diserahkan ke backend untuk memastikan antarmuka tetap ringan dan responsif.

## 2. Backend (Server)
- **Framework:** Node.js dengan Express.js
- **Database:** PostgreSQL
- **Query Builder/Driver:** `pg` (Node Postgres)
- **Authentication:** JSON Web Token (JWT) dengan `bcrypt` untuk hashing password.
- **Middleware:** `cors` dan custom auth middleware untuk validasi _role_ pengguna.

## 3. Komunikasi Data (API)
Komunikasi data antara Frontend dan Backend dilakukan menggunakan arsitektur RESTful JSON.
Seluruh endpoint dilindungi menggunakan header `Authorization: Bearer <token>`, kecuali endpoint publik seperti login dan register.

### Alur Kerja (Workflow)
1. **Otentikasi:** Klien mengirimkan kredensial. Backend memvalidasi menggunakan `bcrypt` dan merespon dengan token JWT yang berlaku.
2. **Auto-Login:** Pada proses *mount*, frontend menggunakan endpoint `/auth/me` untuk memastikan token JWT yang tersimpan masih valid dan mengambil informasi sesi pengguna.
3. **Fetching Paralel:** Jika berhasil masuk, `DataContext` akan mengambil daftar produk, dan preferensi pengaturan (threshold) secara paralel.
4. **Agregasi Khusus:** Halaman *Dashboard*, *Reports*, dan *Prediction* tidak melakukan manipulasi array raksasa pada *client*. Semua perhitungan dilakukan menggunakan *query* database terpusat yang dioptimalkan dengan indeks di PostgreSQL.
