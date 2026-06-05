import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function NotificationBell({ products, threshold }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // Filter produk yang stoknya sudah menyentuh atau di bawah threshold
  const lowStockItems = products.filter((p) => p.stock <= (threshold || 5));
  const hasNotifications = lowStockItems.length > 0;

  // Menutup dropdown otomatis jika mengklik di luar area komponen
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Tombol Lonceng */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 bg-white border border-gray-200 hover:bg-gray-50 rounded-xl text-gray-500 relative cursor-pointer transition-colors shadow-2xs focus:outline-none"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
          <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
        </svg>
        
        {/* Dot Merah Pengingat Aktif */}
        {hasNotifications && (
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full animate-ping"></span>
        )}
        {hasNotifications && (
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-rose-500 rounded-full"></span>
        )}
      </button>

      {/* BOX DROPDOWN NOTIFIKASI STANDARD ELEGAN */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white border border-gray-100 rounded-2xl shadow-xl z-50 overflow-hidden transform origin-top-right transition-all">
          {/* Header Internal */}
          <div className="px-4 py-3 bg-gray-50/80 border-b border-gray-100 flex justify-between items-center">
            <span className="text-xs font-bold text-gray-700">Notifications</span>
            {hasNotifications && (
              <span className="text-[10px] bg-rose-50 text-rose-600 font-extrabold px-1.5 py-0.5 rounded">
                {lowStockItems.length} Low Stock
              </span>
            )}
          </div>

          {/* List Isi Notifikasi */}
          <div className="max-h-64 overflow-y-auto divide-y divide-gray-50">
            {!hasNotifications ? (
              <div className="p-6 text-center text-xs text-gray-400 italic">
                Semua stok barang aman. Tidak ada notifikasi baru.
              </div>
            ) : (
              lowStockItems.map((item) => (
                <div 
                  key={item.id} 
                  className="p-4 hover:bg-gray-50/50 transition-colors flex items-start gap-3 cursor-pointer"
                  onClick={() => {
                    setIsOpen(false);
                    navigate("/products");
                  }}
                >
                  <div className="w-2 h-2 rounded-full bg-rose-500 mt-1.5 shrink-0" />
                  <div className="space-y-0.5 flex-1">
                    <p className="text-xs font-bold text-gray-800 line-clamp-1">{item.name}</p>
                    <p className="text-[10px] text-gray-400 font-medium">SKU: {item.sku}</p>
                    <p className="text-[11px] font-semibold text-rose-600 pt-0.5">
                      Sisa stok kritis: <span className="font-black">{item.stock} Unit</span>
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Dropdown */}
          <div className="p-2 bg-gray-50/50 border-t border-gray-50 text-center">
            <button 
              onClick={() => {
                setIsOpen(false);
                navigate("/products");
              }}
              className="text-[11px] font-bold text-indigo-600 hover:text-indigo-700 w-full py-1 block transition-colors"
            >
              Lihat Semua Detail Produk
            </button>
          </div>
        </div>
      )}
    </div>
  );
}