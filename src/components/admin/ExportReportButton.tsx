"use client";

import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { FileSpreadsheet, Loader2 } from "lucide-react";
import { exportOrdersCSV } from "@/app/actions/report";

export function ExportReportButton() {
  const searchParams = useSearchParams();
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    try {
      setIsExporting(true);
      
      const q = searchParams.get("q") || "";
      const status = searchParams.get("status") || "";
      const date = searchParams.get("date") || "";
      const customDate = searchParams.get("customDate") || "";

      const result = await exportOrdersCSV({ q, status, date, customDate });

      if (result.success && result.csvData) {
        // Create a Blob from the CSV String
        const blob = new Blob([result.csvData], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        
        // Create a link to download it
        const link = document.createElement("a");
        link.href = url;
        
        const timestamp = new Date().toISOString().slice(0,10);
        link.setAttribute("download", `Laporan_Pesanan_Aletta_${timestamp}.csv`);
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        alert("Gagal membuat laporan: " + result.error);
      }
    } catch (err) {
      console.error(err);
      alert("Terjadi kesalahan saat memproses laporan.");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="flex justify-end mt-4 px-4 sm:px-6">
      <button
        onClick={handleExport}
        disabled={isExporting}
        className="flex items-center gap-2 bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 px-4 py-2 rounded-lg font-medium text-sm transition-all shadow-sm"
      >
        {isExporting ? (
          <Loader2 size={18} className="animate-spin" />
        ) : (
          <FileSpreadsheet size={18} />
        )}
        Tarik Laporan (Excel/CSV)
      </button>
    </div>
  );
}
