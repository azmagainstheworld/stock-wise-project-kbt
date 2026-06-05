import React, { useContext } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { DataContext } from "../context/DataContext";

export default function Sidebar({ role, isOpen, setIsOpen }) {
  const navigate = useNavigate();
  const { setUser } = useContext(DataContext);

  function handleLogoutClick() {
    if (window.confirm("Apakah Anda yakin ingin keluar dari StockWise?")) {
      setUser(null);
      setIsOpen(false);
      navigate("/login");
    }
  }

  return (
    <>
      {/* Overlay Hitam Transparan saat Mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/40 z-30 lg:hidden transition-opacity"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Aside Menggunakan Warna Gelap Pekat Sesuai Gambar Referensi */}
      <aside className={`
        fixed inset-y-0 left-0 z-40 w-64 bg-[#0f172a] p-6 flex flex-col gap-6 
        transform transition-transform duration-300 ease-in-out
        lg:translate-x-0 lg:static lg:h-screen
        ${isOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full"}
      `}>
        {/* Identitas Brand */}
        <div className="text-xl font-black tracking-wider text-white mt-12 lg:mt-0 px-3 flex items-center gap-2">
          <div className="w-6 h-6 rounded bg-indigo-500 flex items-center justify-center text-xs">W</div>
          <span>StockWise</span>
        </div>

        {/* Daftar Menu Alur Lama yang Tetap Dipertahankan */}
        <nav className="flex flex-col gap-1" onClick={() => setIsOpen(false)}>
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              `px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                isActive
                  ? "bg-[#1e293b] text-white shadow-xs font-semibold border-l-4 border-indigo-500 rounded-l-none"
                  : "text-[#9ca3af] hover:bg-[#1e293b]/50 hover:text-white"
              }`
            }
          >
            Dashboard
          </NavLink>

          <NavLink
            to="/products"
            className={({ isActive }) =>
              `px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                isActive
                  ? "bg-[#1e293b] text-white shadow-xs font-semibold border-l-4 border-indigo-500 rounded-l-none"
                  : "text-[#9ca3af] hover:bg-[#1e293b]/50 hover:text-white"
              }`
            }
          >
            Products
          </NavLink>

          <NavLink
            to="/barang-masuk"
            className={({ isActive }) =>
              `px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                isActive
                  ? "bg-[#1e293b] text-white shadow-xs font-semibold border-l-4 border-indigo-500 rounded-l-none"
                  : "text-[#9ca3af] hover:bg-[#1e293b]/50 hover:text-white"
              }`
            }
          >
            Barang Masuk
          </NavLink>

          <NavLink
            to="/barang-keluar"
            className={({ isActive }) =>
              `px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                isActive
                  ? "bg-[#1e293b] text-white shadow-xs font-semibold border-l-4 border-indigo-500 rounded-l-none"
                  : "text-[#9ca3af] hover:bg-[#1e293b]/50 hover:text-white"
              }`
            }
          >
            Barang Keluar
          </NavLink>

          {role === "Owner" && (
            <>
              <NavLink
                to="/reports"
                className={({ isActive }) =>
                  `px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? "bg-[#1e293b] text-white shadow-xs font-semibold border-l-4 border-indigo-500 rounded-l-none"
                      : "text-[#9ca3af] hover:bg-[#1e293b]/50 hover:text-white"
                  }`
                }
              >
                Reports
              </NavLink>
              <NavLink
                to="/prediction"
                className={({ isActive }) =>
                  `px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? "bg-[#1e293b] text-white shadow-xs font-semibold border-l-4 border-indigo-500 rounded-l-none"
                      : "text-[#9ca3af] hover:bg-[#1e293b]/50 hover:text-white"
                  }`
                }
              >
                Prediction
              </NavLink>
            </>
          )}

          {/* Tombol Logout Sesuai Permintaan: Berada Pas Di Bawah Menu Navigasi */}
          <button
            onClick={handleLogoutClick}
            className="mt-6 flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-rose-400 hover:bg-rose-500/10 transition-all duration-200 cursor-pointer w-full text-left"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
            </svg>
            <span>Log Out</span>
          </button>
        </nav>
      </aside>
    </>
  );
}