import React, { useContext, useState } from "react";
import { DataContext } from "../context/DataContext";

export default function Reports() {
  const { products, transactions } = useContext(DataContext);
  const [range, setRange] = useState("daily");

  // Agregasi Data Transaksi yang disempurnakan (termasuk tipe 'return')
  const summary = {
    in: transactions
      .filter((t) => t.type === "in")
      .reduce((s, t) => s + t.qty, 0),
    out: transactions
      .filter((t) => t.type === "out" || t.type === "return")
      .reduce((s, t) => s + t.qty, 0),
  };

  const totalStokAkhir = products.reduce((s, p) => s + p.stock, 0);

  return (
    <div className="space-y-6 pb-10">
      {/* HEADER PAGE */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 tracking-tight">Laporan Stok Otomatis</h1>
          <p className="text-xs text-gray-400 mt-0.5">Analisis mutasi persediaan barang masuk dan keluar secara real-time</p>
        </div>

        {/* Filter Rentang Waktu Elegan */}
        <div className="relative">
          <select
            value={range}
            onChange={(e) => setRange(e.target.value)}
            className="pl-4 pr-10 py-2 bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-indigo-500 text-xs font-bold text-gray-600 shadow-2xs appearance-none cursor-pointer"
          >
            <option value="daily">Rentang: Harian</option>
            <option value="weekly">Rentang: Mingguan</option>
            <option value="monthly">Rentang: Bulanan</option>
          </select>
          <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-gray-400">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-3 h-3">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
            </svg>
          </div>
        </div>
      </div>

      {/* BARIS 1: KARTU RINGKASAN METRIK (SUMMARY CARDS) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {/* Total Barang Masuk */}
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-2xs flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Total Barang Masuk</p>
            <p className="text-2xl font-black text-emerald-600">+{summary.in} <span className="text-xs font-medium text-gray-400">Unit</span></p>
          </div>
        </div>

        {/* Total Barang Keluar */}
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-2xs flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Total Barang Keluar</p>
            <p className="text-2xl font-black text-rose-600">-{summary.out} <span className="text-xs font-medium text-gray-400">Unit</span></p>
          </div>
        </div>

        {/* Sisa Stok Akhir */}
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-2xs flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Sisa Stok Akhir</p>
            <p className="text-2xl font-black text-indigo-600">{totalStokAkhir} <span className="text-xs font-medium text-gray-400">Unit</span></p>
          </div>
        </div>
      </div>

      {/* BARIS 2: TABEL RIWAYAT MUTASI BARANG */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-2xs p-2">
        <div className="px-4 py-3 border-b border-gray-50 flex justify-between items-center">
          <h3 className="text-sm font-bold text-gray-700">Riwayat Log Mutasi Barang</h3>
          <span className="text-[11px] bg-gray-100 text-gray-500 font-bold px-2 py-0.5 rounded-md">
            {transactions.length} Records
          </span>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="text-xs uppercase bg-gray-50 text-gray-400 font-bold tracking-wider">
              <tr>
                <th className="px-6 py-4 rounded-l-xl">Waktu & Tanggal</th>
                <th className="px-6 py-4">Nama Produk</th>
                <th className="px-6 py-4">Jenis Transaksi</th>
                <th className="px-6 py-4 rounded-r-xl">Kuantitas</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {transactions.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-xs text-gray-400 italic">
                    Belum ada rekaman riwayat log mutasi barang.
                  </td>
                </tr>
              ) : (
                [...transactions].reverse().map((tx) => {
                  const linkedProd = products.find((p) => p.id === tx.productId);
                  
                  // badge kustomisasi untuk jenis transaksi harian
                  let typeBadge = "";
                  if (tx.type === "in") typeBadge = "bg-emerald-50 text-emerald-600 border-emerald-100";
                  else if (tx.type === "out") typeBadge = "bg-rose-50 text-rose-600 border-rose-100";
                  else typeBadge = "bg-amber-50 text-amber-600 border-amber-100";

                  return (
                    <tr key={tx.id} className="hover:bg-gray-50/80 transition-colors">
                      <td className="px-6 py-4 text-xs text-gray-400 font-mono">{tx.date}</td>
                      <td className="px-6 py-4 font-semibold text-gray-800">
                        {linkedProd ? linkedProd.name : "Varian Barang Terhapus"}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-0.5 border rounded-md text-[11px] font-bold ${typeBadge}`}>
                          {tx.type === "in" ? "Masuk" : tx.type === "out" ? "Keluar" : "Retur Rusak"}
                        </span>
                      </td>
                      <td className={`px-6 py-4 font-black ${tx.type === "in" ? "text-emerald-600" : "text-rose-600"}`}>
                        {tx.type === "in" ? `+${tx.qty}` : `-${tx.qty}`} Unit
                      </td>
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