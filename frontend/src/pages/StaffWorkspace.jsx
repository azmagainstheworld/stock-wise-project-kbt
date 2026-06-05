import React from "react";
import DoubleBorderCard from "../components/DoubleBorderCard";

export default function StaffWorkspace() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Workspace Staff</h1>
      <DoubleBorderCard>
        <p>
          Fitur terbatas untuk Staff. Menu laporan dan prediksi tidak tersedia.
        </p>
      </DoubleBorderCard>
    </div>
  );
}
