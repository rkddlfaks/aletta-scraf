import { createProduct } from "@/app/actions/product";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function AddProductPage() {
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
              <label className="text-sm font-medium text-gray-700">SKU *</label>
              <input type="text" name="sku" required className="w-full px-4 py-2 border border-gray-200 rounded-md focus:ring-2 focus:ring-pink-300 outline-none" />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Kategori *</label>
              <select name="category" required className="w-full px-4 py-2 border border-gray-200 rounded-md focus:ring-2 focus:ring-pink-300 outline-none bg-white">
                <option value="">Pilih Kategori</option>
                <option value="Hijab Medis">Hijab Medis</option>
                <option value="Ciput">Ciput</option>
                <option value="Mukena Premium">Mukena Premium</option>
                <option value="Ikat Rambut">Ikat Rambut</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Harga (Rp) *</label>
              <input type="number" name="price" required min="0" className="w-full px-4 py-2 border border-gray-200 rounded-md focus:ring-2 focus:ring-pink-300 outline-none" />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Stok Saat Ini *</label>
              <input type="number" name="current_stock" required min="0" defaultValue="0" className="w-full px-4 py-2 border border-gray-200 rounded-md focus:ring-2 focus:ring-pink-300 outline-none" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Stok Minimum *</label>
              <input type="number" name="min_stock" required min="0" defaultValue="5" className="w-full px-4 py-2 border border-gray-200 rounded-md focus:ring-2 focus:ring-pink-300 outline-none" />
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
              <label className="text-sm font-medium text-gray-700">URL Gambar (Opsional)</label>
              <input type="url" name="image_url" placeholder="https://contoh.com/gambar.jpg" className="w-full px-4 py-2 border border-gray-200 rounded-md focus:ring-2 focus:ring-pink-300 outline-none" />
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
