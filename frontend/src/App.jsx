import React, { useContext, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { DataContext } from "./context/DataContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Sidebar from "./components/Sidebar";

import Register from "./pages/Register";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import StaffWorkspace from "./pages/StaffWorkspace";
import Products from "./pages/Products";
import BarangMasuk from "./pages/BarangMasuk";
import BarangKeluar from "./pages/BarangKeluar";
import Reports from "./pages/Reports";
import Prediction from "./pages/Prediction";

export default function App() {
  const { user } = useContext(DataContext);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const LayoutWrapper = ({ children }) => {
    return (
      <div className="w-screen h-screen bg-[#f8fafc] flex relative overflow-hidden">
        {/* Tombol Burger Bar Mobile */}
        <div className="lg:hidden absolute top-4 left-4 z-50">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2.5 rounded-xl bg-white border border-gray-200 text-gray-700 shadow-xs cursor-pointer"
          >
            {sidebarOpen ? (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              </svg>
            )}
          </button>
        </div>

        {/* Sidebar Komponen */}
        <Sidebar role={user?.role} isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

        {/* Konten Utama Terisolasi dengan Background Cerah Panze Studio */}
        <main className="flex-1 h-full overflow-y-auto p-6 lg:p-10 pt-20 lg:pt-10 bg-[#f8fafc]">
          {children}
        </main>
      </div>
    );
  };

  return (
    <Routes>
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />

      <Route path="/dashboard" element={<ProtectedRoute allowedRoles={["Owner"]}><LayoutWrapper><Dashboard /></LayoutWrapper></ProtectedRoute>} />
      <Route path="/products" element={<ProtectedRoute><LayoutWrapper><Products /></LayoutWrapper></ProtectedRoute>} />
      <Route path="/barang-masuk" element={<ProtectedRoute><LayoutWrapper><BarangMasuk /></LayoutWrapper></ProtectedRoute>} />
      <Route path="/barang-keluar" element={<ProtectedRoute><LayoutWrapper><BarangKeluar /></LayoutWrapper></ProtectedRoute>} />
      <Route path="/workspace" element={<ProtectedRoute><LayoutWrapper><StaffWorkspace /></LayoutWrapper></ProtectedRoute>} />
      <Route path="/reports" element={<ProtectedRoute allowedRoles={["Owner"]}><LayoutWrapper><Reports /></LayoutWrapper></ProtectedRoute>} />
      <Route path="/prediction" element={<ProtectedRoute allowedRoles={["Owner"]}><LayoutWrapper><Prediction /></LayoutWrapper></ProtectedRoute>} />

      <Route path="/" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}