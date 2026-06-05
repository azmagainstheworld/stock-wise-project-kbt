import React, { useContext, useState } from "react";
import { DataContext } from "../context/DataContext";
import DoubleBorderCard from "../components/DoubleBorderCard";
import ModalThreshold from "../components/ModalThreshold";

export default function Products() {
  const { products, addProduct, threshold, setThreshold } = useContext(DataContext);
  const [modalOpen, setModalOpen] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("Semua");

  const [name, setName] = useState("");
  const [sku, setSku] = useState("");
  const [price, setPrice] = useState("");

  const categories = ["Semua", "Obat", "Vitamin", "Alat Kesehatan", "Lainnya"];

  const handleSubmit = (e) => {
    e.preventDefault();
    addProduct({ name, sku, price: Number(price), stock: 0 });
    setName(""); setSku(""); setPrice("");
  };

  const filteredProducts = products.filter((prod) => {
    return prod.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
           prod.sku.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <div className="space-y-6 pb-10">
      {/* Header Halaman Modern */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 tracking-tight">Katalog Master Produk</h1>
          <p className="text-xs text-gray-400 mt-0.5">Kelola seluruh basis data blueprint barang Anda</p>
        </div>
        <button 
          onClick={() => setModalOpen(true)}
          className="px-4 py-2 bg-indigo-600 text-white text-xs font-semibold rounded-xl hover:bg-indigo-700 transition-all cursor-pointer shadow-xs shadow-indigo-600/10"
        >
          Set Threshold
        </button>
      </div>

      {/* Form Card Putih Bersih Minimalis */}
      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-xs">
        <h3 className="text-sm font-bold text-gray-700 mb-4">Daftarkan Varian Produk Baru</h3>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-4 gap-3 items-center">
          <input 
            type="text" 
            placeholder="Nama Varian Barang" 
            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-indigo-500 focus:bg-white text-sm text-gray-700 placeholder-gray-400 transition-all"
            value={name} onChange={(e) => setName(e.target.value)} required
          />
          <input 
            type="text" 
            placeholder="Kode SKU / Barcode Baru" 
            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-indigo-500 focus:bg-white text-sm text-gray-700 placeholder-gray-400 font-mono transition-all"
            value={sku} onChange={(e) => setSku(e.target.value)} required
          />
          <input 
            type="number" 
            placeholder="Harga Jual Patokan (Rp)" 
            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-indigo-500 focus:bg-white text-sm text-gray-700 placeholder-gray-400 transition-all"
            value={price} onChange={(e) => setPrice(e.target.value)} required
          />
          <button 
            type="submit" 
            className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl text-sm transition-all shadow-md shadow-indigo-600/10 cursor-pointer"
          >
            + Buat Katalog
          </button>
        </form>
      </div>

      {/* Cari & Filter Tab */}
      <div className="space-y-4">
        <div className="relative flex items-center">
          <span className="absolute left-4 text-gray-400">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.604 10.604z" />
            </svg>
          </span>
          <input
            type="text"
            placeholder="Cari di dalam master katalog produk..."
            className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-2xl focus:outline-none focus:border-indigo-500 text-sm text-gray-700 placeholder-gray-400 shadow-xs"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                activeCategory === cat ? "bg-indigo-600 text-white shadow-xs" : "bg-white border border-gray-100 text-gray-500 hover:bg-gray-50"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Komponen Tabel Data Model Baru */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-xs p-2">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="text-xs uppercase bg-gray-50 text-gray-400 font-bold tracking-wider">
              <tr>
                <th className="px-6 py-4 rounded-l-xl">Nama Item</th>
                <th className="px-6 py-4">SKU / Barcode</th>
                <th className="px-6 py-4">Harga Jual Patokan</th>
                <th className="px-6 py-4 rounded-r-xl">Total Stok Gudang</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredProducts.map((prod) => (
                <tr key={prod.id} className="hover:bg-gray-50/80 transition-colors">
                  <td className="px-6 py-4 font-semibold text-gray-800">{prod.name}</td>
                  <td className="px-6 py-4 text-gray-400 font-mono text-xs">{prod.sku}</td>
                  <td className="px-6 py-4 text-gray-700 font-medium">Rp {prod.price.toLocaleString("id-ID")}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-md text-xs font-bold ${
                      prod.stock <= threshold ? "bg-rose-50 text-rose-600" : "bg-emerald-50 text-emerald-600"
                    }`}>
                      {prod.stock} Unit
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <ModalThreshold open={modalOpen} value={threshold} onClose={() => setModalOpen(false)} onSave={(val) => { setThreshold(val); setModalOpen(false); }} />
    </div>
  );
}