"use client";

import { useState } from "react";

export function PriceInput({ 
  defaultValue = "", 
  name = "price" 
}: { 
  defaultValue?: string | number,
  name?: string 
}) {
  const [displayValue, setDisplayValue] = useState(
    defaultValue ? Number(defaultValue).toLocaleString("id-ID") : ""
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Menghapus semua karakter kecuali angka
    const rawValue = e.target.value.replace(/\D/g, "");
    
    if (rawValue === "") {
      setDisplayValue("");
    } else {
      // Format ke ribuan gaya Indonesia (menggunakan titik)
      setDisplayValue(Number(rawValue).toLocaleString("id-ID"));
    }
  };

  // Nilai mentah (tanpa titik) untuk disubmit ke database
  const rawNumber = displayValue.replace(/\D/g, "");

  return (
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500 font-medium">
        Rp
      </div>
      <input
        type="text"
        inputMode="numeric"
        value={displayValue}
        onChange={handleChange}
        required
        placeholder="150.000"
        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-md focus:ring-2 focus:ring-pink-300 outline-none transition-all"
      />
      {/* Hidden input agar form action tetap menerima nilai integer murni */}
      <input type="hidden" name={name} value={rawNumber} />
    </div>
  );
}
