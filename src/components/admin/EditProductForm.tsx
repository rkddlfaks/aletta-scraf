"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Link from "next/link";
import { PriceInput } from "@/components/admin/PriceInput";
import { ProductImageUploader } from "@/components/admin/ProductImageUploader";

export function EditProductForm({ product, updateAction }: { product: any, updateAction: (formData: FormData) => Promise<any> }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    startTransition(async () => {
      const result = await updateAction(formData);
      if (result?.success) {
        toast.success(result.message || "Produk berhasil diperbarui!");
        router.push("/admin/produk");
      } else {
        toast.error(result?.error || "Terjadi kesalahan.");
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Nama Produk *</label>
          <input type="text" name="name" defaultValue={product.name} required className="w-full px-4 py-2 border border-gray-200 rounded-md focus:ring-2 focus:ring-pink-300 outline-none" />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">SKU *</label>
          <input type="text" name="sku" defaultValue={product.sku} required className="w-full px-4 py-2 border border-gray-200 rounded-md focus:ring-2 focus:ring-pink-300 outline-none" />
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Kategori *</label>
          <select name="category" defaultValue={product.category} required className="w-full px-4 py-2 border border-gray-200 rounded-md focus:ring-2 focus:ring-pink-300 outline-none bg-white">
            <option value="">Pilih Kategori</option>
            <option value="Hijab Medis">Hijab Medis</option>
            <option value="Ciput">Ciput</option>
            <option value="Mukena Premium">Mukena Premium</option>
            <option value="Ikat Rambut">Ikat Rambut</option>
          </select>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Harga Jual *</label>
          <PriceInput name="price" defaultValue={product.price} />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Harga Modal *</label>
          <PriceInput name="cost" defaultValue={product.cost} />
          <p className="text-[11px] text-gray-400 mt-1">*Hanya untuk Anda, digunakan sistem menghitung Laba Bersih.</p>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Stok Saat Ini *</label>
          <input type="number" name="current_stock" defaultValue={product.current_stock} required min="0" className="w-full px-4 py-2 border border-gray-200 rounded-md focus:ring-2 focus:ring-pink-300 outline-none" />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Stok Minimum *</label>
          <input type="number" name="min_stock" defaultValue={product.min_stock} required min="0" className="w-full px-4 py-2 border border-gray-200 rounded-md focus:ring-2 focus:ring-pink-300 outline-none" />
          <p className="text-[11px] text-gray-400 mt-1">*Jika stok menyentuh angka ini, produk akan masuk kategori "Stok Menipis".</p>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Satuan</label>
          <input type="text" name="unit" defaultValue={product.unit} className="w-full px-4 py-2 border border-gray-200 rounded-md focus:ring-2 focus:ring-pink-300 outline-none" />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Badge (Opsional)</label>
          <input type="text" name="badge" defaultValue={product.badge || ""} placeholder="Contoh: Best Seller, New" className="w-full px-4 py-2 border border-gray-200 rounded-md focus:ring-2 focus:ring-pink-300 outline-none" />
        </div>

        <div className="space-y-2 md:col-span-2">
          <label className="text-sm font-medium text-gray-700">Gambar Produk</label>
          <ProductImageUploader initialUrls={product.images.length > 0 ? product.images.map((img: any) => img.url) : (product.image_url ? [product.image_url] : [])} />
        </div>

        <div className="space-y-2 md:col-span-2">
          <label className="text-sm font-medium text-gray-700">Deskripsi Detail Produk (Opsional)</label>
          <textarea name="description" defaultValue={product.description || ""} rows={4} placeholder="Bahan ringan, tidak nerawang, ukuran 115x115cm..." className="w-full px-4 py-2 border border-gray-200 rounded-md focus:ring-2 focus:ring-pink-300 outline-none resize-y" />
          <p className="text-[11px] text-gray-400 mt-1">*Digunakan untuk fitur Quick View di halaman depan.</p>
        </div>

        <div className="space-y-2 md:col-span-2">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" name="is_active" defaultChecked={product.is_active} className="w-4 h-4 text-pink-600 focus:ring-pink-500 rounded border-gray-300" />
            <span className="text-sm font-medium text-gray-700">Produk Aktif (Tampil di Toko)</span>
          </label>
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
        <Link href="/admin/produk" className="px-6 py-2 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-md font-medium transition-colors">
          Batal
        </Link>
        <button type="submit" disabled={isPending} className="px-6 py-2 bg-pink-700 hover:bg-pink-800 disabled:bg-pink-300 text-white rounded-md font-medium transition-colors flex items-center gap-2">
          {isPending ? "Menyimpan..." : "Simpan Perubahan"}
        </button>
      </div>
    </form>
  );
}
