import React, { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { DataContext } from "../context/DataContext";

export default function Register() {
  const { handleRegister } = useContext(DataContext);
  const [form, setForm] = useState({
    shopName: "",
    businessType: "FMCG",
    email: "",
    password: "",
    role: "Owner",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  async function submit(e) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await handleRegister(form);
      navigate(form.role === "Owner" ? "/dashboard" : "/workspace");
    } catch (err) {
      setError(err.response?.data?.message || "Terjadi kesalahan saat pendaftaran");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-screen h-screen m-0 p-0 flex items-center justify-center bg-[#f8fafc] font-sans fixed inset-0 overflow-hidden">
      {/* Kartu Floating Putih Bersih dengan Shadow Lembut Modern */}
      <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100 w-full max-w-sm mx-4 flex flex-col justify-between max-h-[90vh] overflow-y-auto no-scrollbar">
        
        <div>
          {/* HEADER JUDUL DENGAN AKSEN INDIGO */}
          <div className="flex flex-col items-center mb-5 text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center text-white text-xs font-black shadow-md shadow-indigo-600/20">
                W
              </div>
              <span className="text-xl font-black text-gray-800 tracking-tight">StockWise</span>
            </div>
            <div className="text-left w-full">
              <h2 className="text-2xl font-black text-gray-800 tracking-tight">Sign Up</h2>
              <p className="text-xs text-gray-400 mt-0.5 font-semibold">Buat profil bisnis UMKM Anda</p>
            </div>
          </div>

          {/* FORM REGISTRASI INDIGO STYLE */}
          <form onSubmit={submit} className="space-y-3.5">
            
            {error && (
              <div className="bg-rose-50 text-rose-600 p-3 rounded-xl text-xs font-bold border border-rose-100">
                {error}
              </div>
            )}
            
            {/* Input Nama Toko */}
            <div className="relative flex items-center">
              <span className="absolute left-4 text-sm text-gray-400">🏢</span>
              <input
                type="text"
                placeholder="Nama Toko / Usaha"
                required
                value={form.shopName}
                onChange={(e) => setForm({ ...form, shopName: e.target.value })}
                className="w-full pl-11 pr-4 py-2.5 bg-gray-50/80 border border-gray-200 rounded-xl focus:outline-none focus:border-indigo-500 focus:bg-white text-sm text-gray-700 placeholder-gray-400 transition-all font-medium"
              />
            </div>

            {/* Input Email */}
            <div className="relative flex items-center">
              <span className="absolute left-4 text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                </svg>
              </span>
              <input
                type="email"
                placeholder="Alamat Email Resmi"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full pl-11 pr-4 py-2.5 bg-gray-50/80 border border-gray-200 rounded-xl focus:outline-none focus:border-indigo-500 focus:bg-white text-sm text-gray-700 placeholder-gray-400 transition-all font-medium"
              />
            </div>

            {/* Input Password */}
            <div className="relative flex items-center">
              <span className="absolute left-4 text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                </svg>
              </span>
              <input
                type="password"
                placeholder="Buat Password Kuat"
                required
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="w-full pl-11 pr-4 py-2.5 bg-gray-50/80 border border-gray-200 rounded-xl focus:outline-none focus:border-indigo-500 focus:bg-white text-sm text-gray-700 placeholder-gray-400 transition-all font-medium"
              />
            </div>

            {/* Dropdown Jenis Bisnis */}
            <div className="relative flex items-center">
              <select
                value={form.businessType}
                onChange={(e) => setForm({ ...form, businessType: e.target.value })}
                className="w-full pl-11 pr-4 py-2.5 bg-gray-50/80 border border-gray-200 rounded-xl focus:outline-none focus:border-indigo-500 text-sm text-gray-500 transition-all cursor-pointer font-semibold appearance-none"
              >
                <option value="FMCG">Jenis Bisnis: FMCG / Kelontong</option>
                <option value="Cafe">Jenis Bisnis: Cafe / Restoran</option>
              </select>
            </div>

            {/* Dropdown Peran Akun */}
            <div className="relative flex items-center">
              <select
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
                className="w-full pl-11 pr-4 py-2.5 bg-gray-50/80 border border-gray-200 rounded-xl focus:outline-none focus:border-indigo-500 text-sm text-gray-500 transition-all cursor-pointer font-semibold appearance-none"
              >
                <option value="Owner">Daftar sebagai: Owner Toko</option>
                <option value="Staff">Daftar sebagai: Staff Karyawan</option>
              </select>
            </div>

            {/* Tombol Submit Daftar Indigo */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl transition-all duration-200 text-sm shadow-md shadow-indigo-600/10 mt-4 cursor-pointer ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {loading ? "Memproses..." : "Sign Up"}
            </button>
          </form>
        </div>

        {/* FOOTER LINK LOGIN */}
        <div className="text-center text-xs text-gray-400 mt-5 pt-4 border-t border-gray-50">
          Sudah memiliki akun?{" "}
          <Link to="/login" className="text-indigo-600 font-bold hover:underline">
            Masuk Sekarang
          </Link>
        </div>

      </div>
    </div>
  );
}