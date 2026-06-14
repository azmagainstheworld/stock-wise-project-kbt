import React, { useContext, useState } from "react";
import { DataContext } from "../context/DataContext";

export default function BarangMasuk() {
  const { products, transactions, addTransaction } = useContext(DataContext);
  
  const [productId, setProductId] = useState(products[0]?.id || "");
  const [qty, setQty] = useState(1);
  const [supplier, setSupplier] = useState("");
  const [invoice, setInvoice] = useState("");
  const [note, setNote] = useState("");

  const [loading, setLoading] = useState(false);

  const selectedProduct = products.find(p => p.id === Number(productId));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!productId) return alert("Pilih produk terlebih dahulu!");

    setLoading(true);
    try {
      await addTransaction({
        productId: Number(productId),
        type: "in",
        qty: Number(qty),
        note: `Supplier: ${supplier || "-"} | No. Faktur: ${invoice || "-"} | Catatan: ${note || "-"}`,
        date: new Date().toLocaleString("id-ID"),
      });

      // Reset Form
      setQty(1); setSupplier(""); setInvoice(""); setNote("");
      alert("Barang masuk berhasil dicatat!");
    } catch (err) {
      alert(err.response?.data?.message || "Terjadi kesalahan saat menyimpan transaksi");
    } finally {
      setLoading(false);
    }
  };

  // Filter riwayat khusus Barang Masuk saja (type === "in")
  const historyMasuk = transactions.filter(tx => tx.type === "in");

  return (
    <div className="space-y-6 pb-10">
      {/* HEADER PAGE */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800 tracking-tight"> Pencatatan Barang Masuk (Restock)</h1>
        <p className="text-xs text-gray-400 mt-0.5">Catat penambahan persediaan barang harian dari supplier ke gudang</p>
      </div>

      {/* FORM INPUT BARANG MASUK (LUAS TANPA KOTAK DETAIL SAMPING) */}
      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-xs">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-400 mb-1">Nama Supplier</label>
              <input 
                type="text" 
                placeholder="Contoh: PT. Sehat Abadi" 
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-indigo-500 focus:bg-white text-sm text-gray-700 placeholder-gray-400 transition-all" 
                value={supplier} 
                onChange={e => setSupplier(e.target.value)} 
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-400 mb-1">No. Faktur / Invoice</label>
              <input 
                type="text" 
                placeholder="Contoh: INV-2024-0012" 
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-indigo-500 focus:bg-white text-sm text-gray-700 placeholder-gray-400 transition-all" 
                value={invoice} 
                onChange={e => setInvoice(e.target.value)} 
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-400 mb-1">Pilih Produk</label>
            <select 
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-indigo-500 text-sm text-gray-700 cursor-pointer" 
              value={productId} 
              onChange={e => setProductId(e.target.value)}
            >
              <option value="">-- Pilih Barang di Gudang --</option>
              {products.map(p => (
                <option key={p.id} value={p.id}>
                  {p.name} (Sisa Stok: {p.stock} Unit)
                </option>
              ))}
            </select>
          </div>

          {/* Counter Jumlah Kuantitas */}
          <div className="flex items-center justify-between bg-gray-50 p-3 rounded-xl border border-gray-200">
            <div className="flex flex-col">
              <span className="text-sm font-bold text-gray-700">Jumlah Masuk</span>
              {selectedProduct && (
                <span className="text-[11px] text-gray-400 font-medium mt-0.5">Stok gudang saat ini: {selectedProduct.stock} unit</span>
              )}
            </div>
            <div className="flex items-center gap-3">
              <button 
                type="button" 
                onClick={() => setQty(Math.max(1, qty - 1))} 
                className="w-9 h-9 rounded-xl bg-white border border-gray-200 font-bold flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors shadow-xs cursor-pointer"
              >
                -
              </button>
              <span className="text-sm font-black text-gray-800 w-10 text-center">{qty}</span>
              <button 
                type="button" 
                onClick={() => setQty(qty + 1)} 
                className="w-9 h-9 rounded-xl bg-white border border-gray-200 font-bold flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors shadow-xs cursor-pointer"
              >
                +
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-400 mb-1">Catatan Tambahan</label>
            <textarea 
              rows={2} 
              placeholder="Keterangan pembelian barang harian dari pihak penyuplai..." 
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-indigo-500 focus:bg-white text-sm text-gray-700 placeholder-gray-400 transition-all" 
              value={note} 
              onChange={e => setNote(e.target.value)} 
            />
          </div>

          <div className="flex justify-end pt-2">
            <button 
              type="submit" 
              disabled={loading}
              className={`w-full sm:w-auto px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-sm transition-all shadow-md shadow-indigo-600/10 cursor-pointer ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {loading ? "Menyimpan..." : "Simpan"}
            </button>
          </div>
        </form>
      </div>

      {/* TABEL RIWAYAT LAPORAN MUTASI MASUK */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-xs p-2">
        <div className="px-4 py-3 border-b border-gray-50">
          <h3 className="text-sm font-bold text-gray-700">Laporan Riwayat Mutasi Masuk</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="text-xs uppercase bg-gray-50 text-gray-400 font-bold tracking-wider">
              <tr>
                <th className="px-6 py-4 rounded-l-xl">Waktu Tanggal</th>
                <th className="px-6 py-4">Nama Produk</th>
                <th className="px-6 py-4">Jumlah Masuk</th>
                <th className="px-6 py-4 rounded-r-xl">Keterangan Dokumen</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {historyMasuk.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-xs text-gray-400 italic">
                    Belum ada rekaman data transaksi barang masuk harian.
                  </td>
                </tr>
              ) : (
                historyMasuk.map((tx) => {
                  const prod = products.find(p => p.id === tx.productId);
                  return (
                    <tr key={tx.id} className="hover:bg-gray-50/80 transition-colors">
                      <td className="px-6 py-4 text-xs text-gray-400 font-mono">{tx.date}</td>
                      <td className="px-6 py-4 font-semibold text-gray-800">{prod?.name || "Produk Terhapus"}</td>
                      <td className="px-6 py-4 font-black text-emerald-600">+{tx.qty} Unit</td>
                      <td className="px-6 py-4 text-xs text-gray-500 font-medium">{tx.note}</td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}