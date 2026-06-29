"use client";

import { createProduct } from "@/app/actions/product";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { PriceInput } from "@/components/admin/PriceInput";
import { ProductImageUploader } from "@/components/admin/ProductImageUploader";
import { useState } from "react";

export default function AddProductPage() {
  const [category, setCategory] = useState("");
  const [sku, setSku] = useState("");

  const generateSku = (selectedCategory: string) => {
    let prefix = "PRD-";
    switch (selectedCategory) {
      case "Hijab Medis": prefix = "HJM-"; break;
      case "Ciput": prefix = "CPT-"; break;
      case "Mukena Premium": prefix = "MKP-"; break;
      case "Ikat Rambut": prefix = "IKR-"; break;
    }
    // Generate 4 karakter acak (angka & huruf)
    const randomSuffix = Math.random().toString(36).substring(2, 6).toUpperCase();
    return prefix + randomSuffix;
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setCategory(val);
    if (val) {
      setSku(generateSku(val));
    } else {
      setSku("");
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/produk" className="text-gray-500 hover:text-pink-700 transition-colors">
          <ArrowLeft size={24} />
        </Link>
        <div>
          <h1 className="text-3xl font-serif font-bold text-gray-900">Tambah Produk</h1>
          <p className="text-muted-foreground mt-1">Masukkan detail produk baru ke dalam katalog.</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <form action={createProduct} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Nama Produk *</label>
              <input type="text" name="name" required className="w-full px-4 py-2 border border-gray-200 rounded-md focus:ring-2 focus:ring-pink-300 outline-none" />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Kategori *</label>
              <select 
                name="category" 
                required 
                value={category}
                onChange={handleCategoryChange}
                className="w-full px-4 py-2 border border-gray-200 rounded-md focus:ring-2 focus:ring-pink-300 outline-none bg-white"
              >
                <option value="">Pilih Kategori</option>
                <option value="Hijab Medis">Hijab Medis</option>
                <option value="Ciput">Ciput</option>
                <option value="Mukena Premium">Mukena Premium</option>
                <option value="Ikat Rambut">Ikat Rambut</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex justify-between">
                SKU *
                <span className="text-xs text-pink-600 font-normal bg-pink-50 px-2 py-0.5 rounded">Otomatis dari Kategori</span>
              </label>
              <input 
                type="text" 
                name="sku" 
                required 
                value={sku}
                onChange={(e) => setSku(e.target.value)}
                placeholder="Contoh: HJM-A1B2"
                className="w-full px-4 py-2 border border-gray-200 rounded-md focus:ring-2 focus:ring-pink-300 outline-none uppercase" 
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Harga Jual *</label>
              <PriceInput name="price" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Harga Modal *</label>
              <PriceInput name="cost" />
              <p className="text-[11px] text-gray-400 mt-1">*Hanya untuk Anda, digunakan sistem menghitung Laba Bersih.</p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Stok Saat Ini *</label>
              <input type="number" name="current_stock" required min="0" defaultValue="0" className="w-full px-4 py-2 border border-gray-200 rounded-md focus:ring-2 focus:ring-pink-300 outline-none" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Stok Minimum *</label>
              <input type="number" name="min_stock" required min="0" defaultValue="5" className="w-full px-4 py-2 border border-gray-200 rounded-md focus:ring-2 focus:ring-pink-300 outline-none" />
              <p className="text-[11px] text-gray-400 mt-1">*Jika stok menyentuh angka ini, produk akan masuk kategori "Stok Menipis".</p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Satuan</label>
              <input type="text" name="unit" defaultValue="pcs" className="w-full px-4 py-2 border border-gray-200 rounded-md focus:ring-2 focus:ring-pink-300 outline-none" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Badge (Opsional)</label>
              <input type="text" name="badge" placeholder="Contoh: Best Seller, New" className="w-full px-4 py-2 border border-gray-200 rounded-md focus:ring-2 focus:ring-pink-300 outline-none" />
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-medium text-gray-700">Gambar Produk</label>
              <ProductImageUploader />
            </div>
            
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-medium text-gray-700">Deskripsi Detail Produk (Opsional)</label>
              <textarea name="description" rows={4} placeholder="Bahan ringan, tidak nerawang, ukuran 115x115cm..." className="w-full px-4 py-2 border border-gray-200 rounded-md focus:ring-2 focus:ring-pink-300 outline-none resize-y" />
              <p className="text-[11px] text-gray-400 mt-1">*Digunakan untuk fitur Quick View di halaman depan.</p>
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" name="is_active" defaultChecked className="w-4 h-4 text-pink-600 focus:ring-pink-500 rounded border-gray-300" />
                <span className="text-sm font-medium text-gray-700">Produk Aktif (Tampil di Toko)</span>
              </label>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
            <Link href="/admin/produk" className="px-6 py-2 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-md font-medium transition-colors">
              Batal
            </Link>
            <button type="submit" className="px-6 py-2 bg-pink-700 hover:bg-pink-800 text-white rounded-md font-medium transition-colors">
              Simpan Produk
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
