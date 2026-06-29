"use client";

import { useEffect } from "react";

export function PrintHeader() {
  useEffect(() => {
    // Beri sedikit jeda agar font dan CSS termuat sempurna sebelum dialog print muncul
    const timer = setTimeout(() => {
      window.print();
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="max-w-2xl mx-auto p-4 print:hidden">
      <div className="bg-blue-50 text-blue-800 p-4 rounded-xl border border-blue-200 flex justify-between items-center mb-6">
        <div>
          <h2 className="font-bold">Mode Cetak Label</h2>
          <p className="text-sm text-blue-600">Tekan Ctrl+P (Windows) atau Cmd+P (Mac) jika dialog cetak tidak muncul otomatis.</p>
        </div>
        <button 
          onClick={() => window.print()} 
          className="bg-blue-600 hover:bg-blue-700 transition-colors text-white px-4 py-2 rounded-lg font-medium text-sm"
        >
          Cetak Ulang
        </button>
      </div>
    </div>
  );
}
