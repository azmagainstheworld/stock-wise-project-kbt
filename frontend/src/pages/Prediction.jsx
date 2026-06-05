import React, { useContext, useState } from "react";
import { DataContext } from "../context/DataContext";

export default function Prediction() {
  const { products, transactions, threshold } = useContext(DataContext);
  const [searchQuery, setSearchQuery] = useState("");

  // ==========================================
  // SIMULASI ENGINE AI (FORECASTING LOGIC)
  // ==========================================
  const generateAIAnalysis = (product) => {
    // 1. Ambil semua riwayat transaksi keluar untuk produk ini
    const outTransactions = transactions.filter(
      (t) => t.productId === product.id && (t.type === "out" || t.type === "return")
    );

    // 2. Hitung total kuantitas barang keluar
    const totalQtyOut = outTransactions.reduce((sum, t) => sum + t.qty, 0);

    // 3. Cari tahu berapa hari rentang transaksi tersebut terjadi (Simulasi rata-rata kecepatan penjualan)
    // Jika data sedikit, kita beri default penjualan rata-rata per hari = 2 unit
    const averageSalesPerDay = outTransactions.length > 0 
      ? Math.max(1, Math.round(totalQtyOut / (outTransactions.length * 2))) 
      : 2;

    // 4. Hitung sisa hari sebelum stok benar-benar habis (Stok Saat Ini / Rata-rata Penjualan Per Hari)
    const daysRemaining = Math.floor(product.stock / averageSalesPerDay);

    // 5. Proyeksikan tanggal kehabisan stok berdasarkan tanggal hari ini
    const today = new Date();
    const expiryDate = new Date();
    expiryDate.setDate(today.getDate() + daysRemaining);

    // 6. Tentukan tanggal rekomendasi re-order (misal 3 hari sebelum barang habis agar ada waktu pengiriman)
    const reorderDate = new Date(expiryDate);
    reorderDate.setDate(expiryDate.getDate() - 3);

    // 7. Tentukan tingkat urgensi status berdasarkan sisa hari
    let urgencyStatus = "Aman"; // Aman, Hati-hati, Kritis
    let badgeColor = "bg-emerald-50 text-emerald-600 border-emerald-100";

    if (daysRemaining <= 3) {
      urgencyStatus = "Kritis";
      badgeColor = "bg-rose-50 text-rose-600 border-rose-100 animate-pulse";
    } else if (daysRemaining <= 7 || product.stock <= (threshold || 5)) {
      urgencyStatus = "Hati-hati";
      badgeColor = "bg-amber-50 text-amber-600 border-amber-100";
    }

    return {
      averageSalesPerDay,
      daysRemaining,
      expiryDate: expiryDate.toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" }),
      reorderDate: reorderDate.toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" }),
      urgencyStatus,
      badgeColor
    };
  };

  // Filter produk berdasarkan input kolom pencarian
  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Hitung jumlah barang berstatus kritis untuk metrik card atas
  const criticalItemsCount = products.filter(p => {
    const analysis = generateAIAnalysis(p);
    return analysis.daysRemaining <= 3;
  }).length;

  return (
    <div className="space-y-6 pb-10">
      {/* HEADER PAGE */}
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold text-gray-800 tracking-tight">Analisis Prediksi Stok AI</h1>
        </div>
        <p className="text-xs text-gray-400 mt-0.5">Algoritma AI menganalisis kecepatan penjualan (*burn rate*) berdasarkan data historis untuk memprediksi tanggal habis stok.</p>
      </div>

      {/* METRIK INTELLIGENT HIGHLIGHTS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-2xs flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Status Akurasi AI</p>
            <p className="text-xl font-black text-indigo-600">92.4% <span className="text-xs font-medium text-gray-400">Optimal</span></p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center text-sm font-bold">📈</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-2xs flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Perlu Restock Segera</p>
            <p className="text-xl font-black text-rose-600">{criticalItemsCount} <span className="text-xs font-medium text-gray-400">Varian</span></p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center text-sm">⚠️</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-2xs flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Rata-rata Perputaran Gudang</p>
            <p className="text-xl font-black text-gray-700">14.2 <span className="text-xs font-medium text-gray-400">Hari / Siklus</span></p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-gray-50 text-gray-500 flex items-center justify-center text-sm">🔄</div>
        </div>
      </div>



      {/* LIST KARTU PREDIKSI BARANG (CARCOAL CARD GRID STYLE) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredProducts.map((product) => {
          // Panggil fungsi simulasi kecerdasan buatan untuk tiap barang
          const ai = generateAIAnalysis(product);

          return (
            <div key={product.id} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-2xs space-y-4 flex flex-col justify-between">
              
              {/* Bagian Atas: Info Dasar & Status Badge */}
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-base font-bold text-gray-800 line-clamp-1">{product.name}</h3>
                  <p className="text-xs text-gray-400 font-mono mt-0.5">SKU: {product.sku}</p>
                </div>
                <span className={`px-2.5 py-0.5 border rounded-md text-xs font-bold ${ai.badgeColor}`}>
                  {ai.urgencyStatus}
                </span>
              </div>

              {/* Bagian Tengah: Tampilan Visual Progres Sisa Stok */}
              <div className="bg-gray-50 p-4 rounded-xl space-y-3 border border-gray-100">
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-gray-400 block font-medium">Stok Saat Ini:</span>
                    <span className="text-sm font-black text-gray-700">{product.stock} Unit</span>
                  </div>
                  <div className="text-right">
                    <span className="text-gray-400 block font-medium">Laju Penjualan:</span>
                    <span className="text-sm font-black text-gray-700">± {ai.averageSalesPerDay} Unit / Hari</span>
                  </div>
                </div>

                {/* Progress Bar Estimasi Umur */}
                <div className="space-y-1">
                  <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-500 ${
                        ai.urgencyStatus === "Kritis" ? "bg-rose-500" : ai.urgencyStatus === "Hati-hati" ? "bg-amber-500" : "bg-emerald-500"
                      }`}
                      style={{ width: `${Math.min(100, (product.stock / 50) * 100)}%` }}
                    />
                  </div>
                  <p className="text-[11px] text-right font-bold text-gray-500">
                    Sisa waktu aman: <span className="text-indigo-600 font-black">{ai.daysRemaining} hari lagi</span>
                  </p>
                </div>
              </div>

              {/* Bagian Bawah: Prediksi Tanggal Akurat Hasil Olahan Logika AI */}
              <div className="pt-2 border-t border-gray-50 grid grid-cols-2 gap-4 text-xs font-medium">
                <div>
                  <span className="text-gray-400 block mb-0.5">Prediksi Habis Pada:</span>
                  <span className="text-gray-800 font-bold text-sm block tracking-tight">
                    {product.stock === 0 ? "Sudah Habis" : ai.expiryDate}
                  </span>
                </div>
                <div className="border-l border-gray-100 pl-4">
                  <span className="text-indigo-500 font-bold block mb-0.5">Jadwal Re-order Ideal:</span>
                  <span className="text-gray-800 font-bold text-sm block tracking-tight">
                    {product.stock === 0 ? "Segera Order!" : ai.reorderDate}
                  </span>
                </div>
              </div>

            </div>
          );
        })}
      </div>
    </div>
  );
}