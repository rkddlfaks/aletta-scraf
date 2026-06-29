"use client";

import { useState, useCallback } from "react";
import { UploadCloud, X, Loader2, Image as ImageIcon } from "lucide-react";
import Image from "next/image";

interface ProductImageUploaderProps {
  initialUrls?: string[];
}

export function ProductImageUploader({ initialUrls = [] }: ProductImageUploaderProps) {
  const [urls, setUrls] = useState<string[]>(initialUrls);
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const handleUpload = async (files: FileList | File[]) => {
    if (!files || files.length === 0) return;

    setIsUploading(true);
    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append("files", files[i]);
    }

    try {
      const res = await fetch("/api/upload-product", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (data.success && data.urls) {
        setUrls((prev) => [...prev, ...data.urls]);
      } else {
        alert(data.error || "Gagal mengunggah gambar.");
      }
    } catch (error) {
      alert("Terjadi kesalahan jaringan.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleUpload(e.dataTransfer.files);
    }
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleUpload(e.target.files);
    }
  };

  const removeImage = (indexToRemove: number) => {
    setUrls(urls.filter((_, index) => index !== indexToRemove));
  };

  return (
    <div className="space-y-4">
      {/* Hidden inputs to pass urls to server action */}
      {urls.map((url, i) => (
        <input key={i} type="hidden" name="images[]" value={url} />
      ))}

      <div 
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`relative border-2 border-dashed rounded-xl p-8 transition-colors ${
          isDragging ? "border-pink-500 bg-pink-50" : "border-gray-300 bg-gray-50 hover:bg-gray-100"
        } flex flex-col items-center justify-center text-center cursor-pointer`}
      >
        <input 
          type="file" 
          multiple 
          accept="image/png, image/jpeg, image/jpg, image/webp" 
          onChange={handleFileChange} 
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
          disabled={isUploading}
        />
        
        {isUploading ? (
          <div className="flex flex-col items-center text-pink-600">
            <Loader2 className="w-10 h-10 mb-3 animate-spin" />
            <p className="font-semibold text-sm">Mengunggah Gambar...</p>
          </div>
        ) : (
          <div className="flex flex-col items-center text-gray-500 pointer-events-none">
            <UploadCloud className="w-10 h-10 mb-3 text-gray-400" />
            <p className="text-sm font-semibold mb-1 text-gray-700">Tarik & Lepas gambar di sini</p>
            <p className="text-xs">atau klik untuk memilih file dari perangkat Anda</p>
            <p className="text-[11px] mt-3 bg-gray-200 text-gray-600 px-2 py-1 rounded">Bisa pilih beberapa gambar sekaligus</p>
          </div>
        )}
      </div>

      {urls.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-700">Preview Galeri ({urls.length})</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {urls.map((url, index) => (
              <div key={index} className="relative group rounded-xl overflow-hidden border border-gray-200 aspect-square bg-gray-100 flex items-center justify-center">
                <Image 
                  src={url} 
                  alt={`Preview ${index}`} 
                  fill
                  className="object-cover"
                />
                {index === 0 && (
                  <div className="absolute top-2 left-2 bg-pink-600 text-white text-[10px] font-bold px-2 py-1 rounded shadow-sm z-10">
                    Gambar Utama
                  </div>
                )}
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white p-1.5 rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-opacity z-10"
                  title="Hapus gambar"
                >
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
