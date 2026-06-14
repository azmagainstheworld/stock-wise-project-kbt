import React, { useEffect, useState } from "react";
import api from "../utils/api";

export default function Prediction() {
  const [searchQuery, setSearchQuery] = useState("");
  const [predictionData, setPredictionData] = useState({
    accuracyLabel: "92.4% Optimal",
    criticalItemsCount: 0,
    averageCycleDays: 0,
    data: []
  });
  const [loading, setLoading] = useState(true);
  const [isAiLoading, setIsAiLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    api.get("/predictions/stock?useAi=false")
      .then(res => setPredictionData(res.data))
      .catch(err => console.error("Error fetching predictions", err))
      .finally(() => setLoading(false));
  }, []);

  const handleRunAi = () => {
    setIsAiLoading(true);
    api.get("/predictions/stock?useAi=true")
      .then(res => setPredictionData(res.data))
      .catch(err => console.error("Error running AI predictions", err))
      .finally(() => setIsAiLoading(false));
  };

  // Filter produk berdasarkan input kolom pencarian
  const filteredProducts = predictionData.data.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Hitung jumlah barang berstatus kritis untuk metrik card atas
  const criticalItemsCount = predictionData.criticalItemsCount;

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="w-8 h-8 rounded-full border-4 border-gray-200 border-t-indigo-600 animate-spin"></div>
      </div>
    );
  }

  if (isAiLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6">
        <div className="relative flex justify-center items-center">
          <div className="absolute animate-ping w-20 h-20 rounded-full bg-indigo-500 opacity-20"></div>
          <div className="w-16 h-16 rounded-full border-4 border-indigo-50 border-t-indigo-600 animate-spin z-10 shadow-lg"></div>
          <div className="absolute w-10 h-10 bg-white rounded-full flex items-center justify-center z-20 text-indigo-600 font-black text-xl shadow-sm">
            AI
          </div>
        </div>
        <div className="text-center space-y-2">
          <h2 className="text-xl font-black text-gray-800 tracking-tight animate-pulse">Gemini sedang menganalisis...</h2>
          <p className="text-sm text-gray-500 max-w-sm mx-auto">Memproses data riwayat transaksi dan kalkulasi burn-rate untuk hasil prediksi stok paling akurat.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-10">
      {/* HEADER PAGE */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-gray-800 tracking-tight">Analisis Prediksi Stok AI</h1>
          </div>
          <p className="text-xs text-gray-400 mt-0.5">Algoritma memprediksi tanggal habis stok berdasarkan kecepatan penjualan historis.</p>
        </div>
        <button 
          onClick={handleRunAi}
          disabled={isAiLoading}
          className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-md shadow-indigo-200 transition-all flex items-center gap-2 active:scale-95 disabled:opacity-50"
        >
          <span>✨</span> Jalankan Analisis AI
        </button>
      </div>

      {/* METRIK INTELLIGENT HIGHLIGHTS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-2xs flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Status Akurasi AI</p>
            <p className="text-xl font-black text-indigo-600">
              {predictionData.accuracyLabel.split(' ')[0]} 
              <span className="text-xs font-medium text-gray-400 ml-1">
                {predictionData.accuracyLabel.split(' ').slice(1).join(' ')}
              </span>
            </p>
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
            <p className="text-xl font-black text-gray-700">{predictionData.averageCycleDays} <span className="text-xs font-medium text-gray-400">Hari / Siklus</span></p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-gray-50 text-gray-500 flex items-center justify-center text-sm">🔄</div>
        </div>
      </div>



      {/* LIST KARTU PREDIKSI BARANG (CARCOAL CARD GRID STYLE) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredProducts.map((product) => {
          let badgeColor = "bg-emerald-50 text-emerald-600 border-emerald-100";
          if (product.urgencyStatus === "Kritis") {
            badgeColor = "bg-rose-50 text-rose-600 border-rose-100 animate-pulse";
          } else if (product.urgencyStatus === "Hati-hati") {
            badgeColor = "bg-amber-50 text-amber-600 border-amber-100";
          }

          return (
            <div key={product.id} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-2xs space-y-4 flex flex-col justify-between">
              
              {/* Bagian Atas: Info Dasar & Status Badge */}
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-base font-bold text-gray-800 line-clamp-1">{product.name}</h3>
                  <p className="text-xs text-gray-400 font-mono mt-0.5">SKU: {product.sku}</p>
                </div>
                <span className={`px-2.5 py-0.5 border rounded-md text-xs font-bold ${badgeColor}`}>
                  {product.urgencyStatus}
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
                    <span className="text-sm font-black text-gray-700">± {product.averageSalesPerDay} Unit / Hari</span>
                  </div>
                </div>

                {/* Progress Bar Estimasi Umur */}
                <div className="space-y-1">
                  <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-500 ${
                        product.urgencyStatus === "Kritis" ? "bg-rose-500" : product.urgencyStatus === "Hati-hati" ? "bg-amber-500" : "bg-emerald-500"
                      }`}
                      style={{ width: `${Math.min(100, (product.stock / 50) * 100)}%` }}
                    />
                  </div>
                  <p className="text-[11px] text-right font-bold text-gray-500">
                    Sisa waktu aman: <span className="text-indigo-600 font-black">{product.daysRemaining} hari lagi</span>
                  </p>
                </div>
              </div>

              {/* Bagian Bawah: Prediksi Tanggal Akurat Hasil Olahan Logika AI */}
              <div className="pt-2 border-t border-gray-50 grid grid-cols-2 gap-4 text-xs font-medium">
                <div>
                  <span className="text-gray-400 block mb-0.5">Prediksi Habis Pada:</span>
                  <span className="text-gray-800 font-bold text-sm block tracking-tight">
                    {product.stock === 0 ? "Sudah Habis" : product.expiryDate}
                  </span>
                </div>
                <div className="border-l border-gray-100 pl-4">
                  <span className="text-indigo-500 font-bold block mb-0.5">Jadwal Re-order Ideal:</span>
                  <span className="text-gray-800 font-bold text-sm block tracking-tight">
                    {product.stock === 0 ? "Segera Order!" : product.reorderDate}
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