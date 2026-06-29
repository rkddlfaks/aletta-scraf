import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Plus, Edit, Trash2 } from "lucide-react";
import { DeleteProductButton } from "@/components/admin/DeleteProductButton";
import { deleteProduct } from "@/app/actions/product";

export default async function ProductListPage() {
  const products = await prisma.product.findMany({
    orderBy: { created_at: "desc" }
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-serif font-bold text-gray-900">Manajemen Produk</h1>
          <p className="text-muted-foreground mt-1">Kelola data katalog dan stok.</p>
        </div>
        <Link 
          href="/admin/produk/tambah" 
          className="bg-pink-700 hover:bg-pink-800 text-white px-4 py-2 rounded-md font-medium flex items-center gap-2 transition-colors"
        >
          <Plus size={20} /> Tambah Produk
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-gray-50 border-b border-gray-200 text-gray-700 uppercase text-xs">
              <tr>
                <th className="px-6 py-4 font-semibold">Produk</th>
                <th className="px-6 py-4 font-semibold">SKU / Kategori</th>
                <th className="px-6 py-4 font-semibold">Harga</th>
                <th className="px-6 py-4 font-semibold">Stok</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {products.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                    Belum ada produk. Silakan tambahkan produk baru.
                  </td>
                </tr>
              ) : products.map(p => (
                <tr key={p.id} className="hover:bg-gray-50/50">
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900">{p.name}</div>
                    {p.badge && <span className="inline-block mt-1 text-xs bg-pink-100 text-pink-800 px-2 py-0.5 rounded-sm">{p.badge}</span>}
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-mono text-xs bg-gray-100 px-1.5 py-0.5 rounded text-gray-600 w-fit mb-1">{p.sku}</div>
                    <div className="text-gray-500">{p.category}</div>
                  </td>
                  <td className="px-6 py-4">
                    Rp {p.price.toLocaleString("id-ID")}
                  </td>
                  <td className="px-6 py-4">
                    <div className={`font-medium ${p.current_stock <= p.min_stock ? 'text-red-600' : 'text-gray-700'}`}>
                      {p.current_stock} {p.unit}
                    </div>
                    {p.current_stock <= p.min_stock && (
                      <div className="text-xs text-red-500 mt-0.5">Low Stock</div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    {p.is_active ? (
                      <span className="text-green-700 bg-green-50 px-2.5 py-1 rounded-full text-xs font-medium border border-green-200">Aktif</span>
                    ) : (
                      <span className="text-gray-600 bg-gray-100 px-2.5 py-1 rounded-full text-xs font-medium border border-gray-200">Nonaktif</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link 
                        href={`/admin/produk/${p.id}/edit`}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                        title="Edit Produk"
                      >
                        <Edit size={18} />
                      </Link>
                      <DeleteProductButton id={p.id} onDelete={deleteProduct} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
