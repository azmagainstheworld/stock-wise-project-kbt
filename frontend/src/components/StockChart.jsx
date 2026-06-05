import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function StockChart({ data }) {
  // Fungsi pemformat angka agar ribuan/jutaan lebih rapi (Opsional & Sangat Direkomendasikan)
  const formatYAxis = (value) => {
    if (value >= 1000000) return `${value / 1000000}M`; // Contoh: 15.000.000 menjadi 15M
    if (value >= 1000) return `${value / 1000}K`;
    return value;
  };

  return (
    <div className="w-full h-72">
      <ResponsiveContainer width="100%" h-full>
        {/* PERBAIKAN 1: Tambahkan margin left yang cukup (misal: left: 20 atau 30) */}
        <LineChart
          data={data}
          margin={{ top: 10, right: 20, left: 25, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
          <XAxis 
            dataKey="date" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#94a3b8', fontSize: 12 }}
            dy={10}
          />
          {/* PERBAIKAN 2: Tambahkan properti width murni pada YAxis agar teks panjang tidak menjebol container */}
          <YAxis 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#94a3b8', fontSize: 12 }}
            width={75} // Memberikan ruang lebar 75px khusus untuk menampung teks angka jutaan
            tickFormatter={formatYAxis} // Menghidupkan format ringkas ("M" atau "K") biar elegan seperti Figma
          />
          <Tooltip 
            formatter={(value) => [`Rp ${value.toLocaleString("id-ID")}`, "Penjualan"]}
            contentStyle={{ backgroundColor: '#ffffff', borderRadius: '0.75rem', borderColor: '#f1f5f9' }}
          />
          <Line
            type="monotone"
            dataKey="stock"
            stroke="#334155" // Slate-700 sesuai tema premium barumu
            strokeWidth={3}
            dot={false}
            activeDot={{ r: 6, fill: '#4f46e5', strokeWidth: 0 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}