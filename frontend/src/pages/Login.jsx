import React, { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { DataContext } from "../context/DataContext";

export default function Login() {
  const { handleLogin } = useContext(DataContext);
  const [form, setForm] = useState({ email: "", password: "", role: "Owner" });
  const navigate = useNavigate();

  function submit(e) {
    e.preventDefault();
    // TODO: Integrasi API Express JS dengan Axios
    handleLogin({ role: form.role, shopName: "My Shop", email: form.email });
    if (form.role === "Owner") navigate("/dashboard");
    else navigate("/workspace");
  }

  return (
    <div className="w-screen h-screen m-0 p-0 flex items-center justify-center bg-[#f8fafc] font-sans fixed inset-0 overflow-hidden">
      {/* Kartu Floating Putih Bersih dengan Shadow Lembut Sesuai Desain Baru */}
      <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100 w-full max-w-sm mx-4 flex flex-col justify-between">
        
        <div>
          {/* LOGO & BRANDING DENGAN AKSEN INDIGO */}
          <div className="flex flex-col items-center mb-6 text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center text-white text-xs font-black shadow-md shadow-indigo-600/20">
                W
              </div>
              <span className="text-xl font-black text-gray-800 tracking-tight">StockWise</span>
            </div>
            <div className="text-left w-full">
              <h2 className="text-2xl font-black text-gray-800 tracking-tight">Sign In</h2>
              <p className="text-xs text-gray-400 mt-0.5 font-semibold">Masuk ke akun manajemen Anda</p>
            </div>
          </div>

          {/* FORM ISIAN */}
          <form onSubmit={submit} className="space-y-4">
            
            {/* Input Email */}
            <div className="relative flex items-center">
              <span className="absolute left-4 text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                </svg>
              </span>
              <input
                type="email"
                placeholder="Email atau username"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full pl-11 pr-4 py-3 bg-gray-50/80 border border-gray-200 rounded-xl focus:outline-none focus:border-indigo-500 focus:bg-white text-sm text-gray-700 placeholder-gray-400 transition-all font-medium"
              />
            </div>

            {/* Input Password */}
            <div>
              <div className="relative flex items-center">
                <span className="absolute left-4 text-gray-400">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                  </svg>
                </span>
                <input
                  type="password"
                  placeholder="Password"
                  required
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className="w-full pl-11 pr-4 py-3 bg-gray-50/80 border border-gray-200 rounded-xl focus:outline-none focus:border-indigo-500 focus:bg-white text-sm text-gray-700 placeholder-gray-400 transition-all font-medium"
                />
              </div>
              <div className="text-right mt-1.5">
                <a href="#" className="text-xs font-bold text-gray-400 hover:text-indigo-600 transition-colors">Lupa password?</a>
              </div>
            </div>

            {/* Dropdown Pilihan Peran Masuk */}
            <div className="relative flex items-center">
              <span className="absolute left-4 text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.65-2.42 12.048 12.048 0 01-6.18 0 3 3 0 00-4.65 2.42 9.094 9.094 0 003.741.479M4.5 19.5h15a.75.75 0 00.75-.75V18a6 6 0 00-6-6H9a6 6 0 00-6 6v.75a.75.75 0 00.75.75z" />
                </svg>
              </span>
              <select
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
                className="w-full pl-11 pr-4 py-3 bg-gray-50/80 border border-gray-200 rounded-xl focus:outline-none focus:border-indigo-500 text-sm text-gray-500 transition-all cursor-pointer font-semibold appearance-none"
              >
                <option value="Owner">Masuk sebagai: Owner</option>
                <option value="Staff">Masuk sebagai: Staff</option>
              </select>
            </div>

            {/* Tombol Masuk Utama Indigo Modern */}
            <button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl transition-all duration-200 text-sm shadow-md shadow-indigo-600/10 mt-4 cursor-pointer"
            >
              Sign In
            </button>
          </form>
        </div>

        {/* FOOTER LINK DAFTAR SINKRON WARNA */}
        <div className="text-center text-xs text-gray-400 mt-6 pt-4 border-t border-gray-50">
          Belum punya akun?{" "}
          <Link to="/register" className="text-indigo-600 font-bold hover:underline">
            Daftar sekarang
          </Link>
        </div>

      </div>
    </div>
  );
}