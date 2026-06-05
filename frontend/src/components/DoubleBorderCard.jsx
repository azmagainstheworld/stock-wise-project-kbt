import React from "react";

export default function DoubleBorderCard({ children, className }) {
  return (
    <div className={`double-border-outer shadow-sm ${className || ""}`}>
      {/* padding diubah dari p-5 menjadi menyesuaikan style CSS */}
      <div className="double-border-inner text-gray-800">
        {children}
      </div>
    </div>
  );
}