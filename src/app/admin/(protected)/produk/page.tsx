import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Plus, Edit } from "lucide-react";
import { DeleteProductButton } from "@/components/admin/DeleteProductButton";
import { deleteProduct } from "@/app/actions/product";
import { ProductFilters } from "@/components/admin/ProductFilters";
import { Prisma } from "@prisma/client";
import { Suspense } from "react";

export default async function ProductListPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; category?: string; status?: string; stock?: string }>;
}) {
  const resolvedParams = await searchParams;
  const q = resolvedParams.q || "";
  const category = resolvedParams.category || "";
  const status = resolvedParams.status || "";
  const stock = resolvedParams.stock || "";

  const where: Prisma.ProductWhereInput = {};

  if (q) {
    where.OR = [
      { name: { contains: q } },
      { sku: { contains: q } },
    ];
  }

  if (category) {
    where.category = category;
  }

  if (status === "active") {
    where.is_active = true;
  } else if (status === "inactive") {
    where.is_active = false;
  }

  // Note: Filtering by stock vs min_stock is harder in Prisma without raw queries,
  // but we can fetch all filtered by other conditions, then filter in memory if stock param exists,
  // OR use Prisma field references if it's a modern Prisma version: `where.current_stock = { lte: prisma.product.fields.min_stock }`
  // Actually, standard Prisma doesn't support comparing two columns in `where` easily unless using raw queries.
  // We'll fetch all and filter in JS if stock is used, since product catalog is usually small.
  // Wait, let's just do it in JS for `stock` parameter to be safe.

  const rawProducts = await prisma.product.findMany({
    where,
    orderBy: { created_at: "desc" }
  });

  const products = stock === "low" 
    ? rawProducts.filter(p => p.current_stock <= p.min_stock)
    : stock === "safe"
    ? rawProducts.filter(p => p.current_stock > p.min_stock)
    : rawProducts;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-serif font-bold text-gray-900">Manajemen Produk</h1>
          <p className="text-muted-foreground mt-1">Kelola data katalog dan stok.</p>
        </div>
        <Link 
          href="/admin/produk/tambah" 
          className="bg-pink-700 hover:bg-pink-800 text-white px-4 py-2 rounded-md font-medium flex items-center gap-2 transition-colors whitespace-nowrap"
        >
          <Plus size={20} /> Tambah Produk
        </Link>
      </div>

      <Suspense fallback={<div className="h-16 bg-gray-100 rounded-xl mb-6 animate-pulse"></div>}>
        <ProductFilters />
      </Suspense>

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
                      <DeleteProductButton id={p.id} productName={p.name} onDelete={deleteProduct} />
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
