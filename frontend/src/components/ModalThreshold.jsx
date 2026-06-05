import React, { useState } from "react";

export default function ModalThreshold({ open, value, onClose, onSave }) {
  const [val, setVal] = useState(value);
  if (!open) return null;
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50">
      <div className="bg-white p-6 rounded-lg w-96">
        <h3 className="text-lg font-semibold mb-3">Set Batas Minimum Stok</h3>
        <input
          className="w-full border p-2 rounded mb-4"
          placeholder="Batas minimum (unit)"
          value={val}
          onChange={(e) => setVal(Number(e.target.value))}
        />
        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="px-3 py-1">
            Batal
          </button>
          <button
            onClick={() => onSave(val)}
            className="px-3 py-1 bg-[#4B4237] text-white rounded"
          >
            Simpan
          </button>
        </div>
      </div>
    </div>
  );
}
