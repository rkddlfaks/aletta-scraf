"use client";

import { useState } from "react";
import { UploadCloud, CheckCircle2, Loader2 } from "lucide-react";
import { compressImageToWebp } from "@/lib/imageCompression";

export function PaymentUpload({ orderNumber, currentProof }: { orderNumber: string, currentProof: string | null }) {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(!!currentProof);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setIsUploading(true);
    
    try {
      const compressedFile = await compressImageToWebp(file);
      
      const formData = new FormData();
      formData.append("file", compressedFile);
      formData.append("orderNumber", orderNumber);
      const res = await fetch("/api/upload-proof", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (data.success) {
        setIsSuccess(true);
      } else {
        alert(data.error || "Gagal mengunggah bukti transfer.");
      }
    } catch (error) {
      alert("Terjadi kesalahan jaringan.");
    } finally {
      setIsUploading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-2xl p-6 text-center">
        <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 size={32} />
        </div>
        <h3 className="text-xl font-bold text-green-900 mb-2">Bukti Transfer Diterima</h3>
        <p className="text-green-700">Terima kasih! Bukti transfer Anda sedang diverifikasi oleh admin. Kami akan segera memproses pesanan Anda setelah pembayaran tervalidasi.</p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6">
      <h3 className="font-bold text-gray-900 mb-4 text-lg text-left">Unggah Bukti Transfer</h3>
      
      <div className="flex items-center justify-center w-full mb-4">
        <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-48 border-2 border-gray-300 border-dashed rounded-xl cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <UploadCloud className="w-10 h-10 mb-3 text-gray-400" />
            <p className="mb-2 text-sm text-gray-500"><span className="font-semibold">Klik untuk unggah</span> atau seret file ke sini</p>
            <p className="text-xs text-gray-400">PNG, JPG, JPEG (Maks. 5MB)</p>
            {file && (
              <div className="mt-4 px-4 py-2 bg-pink-100 text-pink-700 rounded-lg text-sm font-semibold truncate max-w-full">
                File terpilih: {file.name}
              </div>
            )}
          </div>
          <input id="dropzone-file" type="file" className="hidden" accept="image/png, image/jpeg, image/jpg" onChange={handleFileChange} />
        </label>
      </div> 

      <button 
        onClick={handleUpload}
        disabled={!file || isUploading}
        className="w-full bg-pink-700 hover:bg-pink-800 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-xl transition-colors flex justify-center items-center gap-2"
      >
        {isUploading ? (
          <><Loader2 className="animate-spin" size={20} /> Mengunggah...</>
        ) : (
          "Kirim Bukti Transfer"
        )}
      </button>
    </div>
  );
}
