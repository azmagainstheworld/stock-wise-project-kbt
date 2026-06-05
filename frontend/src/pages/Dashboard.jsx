import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { DataContext } from "../context/DataContext";
import StockChart from "../components/StockChart";
import NotificationBell from "../components/NotificationBell"; // Tambahkan ini

export default function Dashboard() {
  const { products, transactions, user, threshold } = useContext(DataContext);
  const navigate = useNavigate();

  // 1. Hitung Real-time Data untuk Summary Cards
  const totalProduk = products.length;
  
  const totalMasukHariIni = transactions
    .filter(tx => tx.type === "in")
    .reduce((sum, tx) => sum + tx.qty, 0);

  const totalKeluarHariIni = transactions
    .filter(tx => tx.type === "out")
    .reduce((sum, tx) => sum + tx.qty, 0);

  // Ambil list produk yang stoknya di bawah threshold peringatan
  const lowStockItems = products.filter(p => p.stock <= (threshold || 5));
  const lowStockCount = lowStockItems.length;

  // 2. Ambil 4 Transaksi Terakhir secara Dinamis untuk "Recent Activity"
  const recentActivities = [...transactions]
    .reverse()
    .slice(0, 4);

  // 3. Data Dummy Grafik Penjualan 7 Hari Terakhir
  const chartData = [
    { date: "12/5", stock: 4000000 },
    { date: "13/5", stock: 6000000 },
    { date: "14/5", stock: 8500000 },
    { date: "15/5", stock: 7500000 },
    { date: "16/5", stock: 9000000 },
    { date: "17/5", stock: 14000000 },
    { date: "18/5", stock: 12500000 },
  ];

  return (
    <div className="space-y-6 pb-10">
      {/* HEADER UTAMA */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-black text-gray-800 tracking-tight">Dashboard</h1>
          <p className="text-xs text-gray-400 mt-0.5">Welcome back! Here's what's happening today.</p>
        </div>

        {/* AREA NOTIFIKASI & AVATAR PROFILE */}
        <div className="flex items-center gap-3">
          
          {/* GANTI BUTTON LONCENG LAMA KAMU DENGAN KOMPONEN BARU INI */}
          <NotificationBell products={products} threshold={threshold} />

          <div className="w-9 h-9 bg-indigo-600 text-white font-bold text-sm rounded-xl flex items-center justify-center shadow-xs">
            {user?.name?.charAt(0).toUpperCase() || "A"}
          </div>
        </div>
        
      </div>

      {/* BARIS 1: 4 KARTU RINGKASAN (SUMMARY CARDS) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Card 1: Total Produk */}
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-2xs flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Total Products</p>
            <p className="text-2xl font-black text-gray-800">{totalProduk}</p>
          </div>
        </div>

        {/* Card 2: Barang Masuk */}
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-2xs flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Items Received</p>
            <p className="text-2xl font-black text-gray-800">{totalMasukHariIni}</p>
          </div>
        </div>

        {/* Card 3: Barang Keluar */}
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-2xs flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Items Dispatched</p>
            <p className="text-2xl font-black text-gray-800">{totalKeluarHariIni}</p>
          </div>
        </div>

        {/* Card 4: Low Stock Alert */}
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-2xs flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Low Stock Alert</p>
            <p className="text-2xl font-black text-gray-800">{lowStockCount}</p>
          </div>
        </div>
      </div>

      {/* BARIS 2: GRAFIK PENJUALAN UTAMA */}
      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-2xs">
        <div className="mb-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400">Penjualan 7 Hari Terakhir</h3>
          <div className="flex items-baseline gap-2 mt-0.5">
            <span className="text-2xl font-black text-gray-800">Rp 12.500.000</span>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">+12.5%</span>
          </div>
        </div>
        <div className="bg-gray-50/60 p-4 rounded-xl border border-gray-50">
          <StockChart data={chartData} />
        </div>
      </div>

      {/* BARIS 3: ASIMETRIS KEBIRUAN GRID SIFAT PERSIS FIGMA */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* KOLOM KIRI (LEBAR 2/3): RECENT ACTIVITY */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-gray-100 shadow-2xs flex flex-col justify-between">
          <div>
            <h3 className="text-base font-black text-gray-800 mb-4 tracking-tight">Recent Activity</h3>
            <div className="space-y-3">
              {recentActivities.length === 0 ? (
                <p className="text-xs text-gray-400 italic py-4 text-center">Belum ada aktivitas transaksi terekam harian.</p>
              ) : (
                recentActivities.map((tx) => {
                  const targetProd = products.find(p => p.id === tx.productId);
                  const isStockIn = tx.type === "in";
                  return (
                    <div key={tx.id} className="flex items-center justify-between p-3.5 bg-gray-50/80 border border-gray-100 rounded-xl hover:bg-gray-50 transition-colors">
                      <div className="flex items-center gap-3">
                        <span className="text-lg">{isStockIn ? "📥" : "📤"}</span>
                        <div>
                          <p className="text-sm font-bold text-gray-800">{targetProd?.name || "Varian Terhapus"}</p>
                          <p className="text-xs text-gray-400 font-medium">SKU: {targetProd?.sku || "-"}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`text-sm font-black ${isStockIn ? "text-emerald-600" : "text-rose-600"}`}>
                          {isStockIn ? `+${tx.qty}` : `-${tx.qty}`} Unit
                        </p>
                        <p className="text-[10px] text-gray-400 font-mono mt-0.5">{tx.date?.split(" ")[0] || "Hari ini"}</p>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* KOLOM KANAN (LEBAR 1/3): LOW STOCK ALERT DENGAN RED PROGRESS BAR */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-base font-black text-gray-800 tracking-tight">Low Stock Alert</h3>
              <button onClick={() => navigate("/products")} className="text-xs font-bold text-indigo-600 hover:underline cursor-pointer">
                View All
              </button>
            </div>

            <div className="space-y-3.5">
              {lowStockItems.length === 0 ? (
                <p className="text-xs text-emerald-600 bg-emerald-50/50 border border-emerald-100 p-4 rounded-xl font-medium text-center italic">
                  ✓ Semua amunisi stok gudang dalam kondisi aman!
                </p>
              ) : (
                lowStockItems.slice(0, 3).map((item) => {
                  // Hitung persentase bar (Maksimal diukur dari batas aman threshold + 10)
                  const safetyLimit = (threshold || 5) + 10;
                  const currentPercentage = Math.min(100, (item.stock / safetyLimit) * 100);

                  return (
                    <div key={item.id} className="p-3.5 bg-gray-50/80 border border-gray-100 rounded-xl space-y-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-sm font-bold text-gray-800 line-clamp-1">{item.name}</p>
                          <p className="text-[11px] text-gray-400 font-mono mt-0.5">SKU: {item.sku}</p>
                        </div>
                      </div>
                      
                      {/* Progress Bar Merah Sesuai Gambar Figma */}
                      <div className="space-y-1 pt-1">
                        <div className="flex justify-between text-[10px] font-bold">
                          <span className="text-rose-600">Stock: {item.stock}</span>
                          <span className="text-gray-400">Alert Limit: {threshold || 5}</span>
                        </div>
                        <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-rose-500 rounded-full transition-all duration-500"
                            style={{ width: `${currentPercentage}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}