import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Package, AlertTriangle, Layers } from "lucide-react";

export default async function DashboardPage() {
  // Fetch stats
  const totalProducts = await prisma.product.count();
  const allProducts = await prisma.product.findMany();
  
  const totalStock = allProducts.reduce((sum, p) => sum + p.current_stock, 0);
  
  // Products per category
  const categories = allProducts.reduce((acc, p) => {
    acc[p.category] = (acc[p.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Low stock products
  const lowStockProducts = allProducts.filter(p => p.current_stock <= p.min_stock);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-serif font-bold text-gray-900">Dashboard</h1>
        <p className="text-muted-foreground mt-1">Ringkasan inventaris toko Anda.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4">
          <div className="p-4 bg-pink-50 rounded-full text-pink-700">
            <Package size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Total Produk</p>
            <h3 className="text-2xl font-bold text-gray-900">{totalProducts}</h3>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4">
          <div className="p-4 bg-blue-50 rounded-full text-blue-700">
            <Layers size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Total Stok Gudang</p>
            <h3 className="text-2xl font-bold text-gray-900">{totalStock} item</h3>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4">
          <div className="p-4 bg-amber-50 rounded-full text-amber-600">
            <AlertTriangle size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Stok Menipis</p>
            <h3 className="text-2xl font-bold text-gray-900">{lowStockProducts.length} produk</h3>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Categories */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Produk per Kategori</h3>
          {Object.keys(categories).length > 0 ? (
            <ul className="space-y-3">
              {Object.entries(categories).map(([cat, count]) => (
                <li key={cat} className="flex justify-between items-center">
                  <span className="text-gray-700">{cat}</span>
                  <span className="font-medium bg-gray-100 text-gray-800 py-1 px-3 rounded-full text-sm">
                    {count}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 italic text-sm">Belum ada kategori.</p>
          )}
        </div>

        {/* Low Stock Alerts */}
        <div className="bg-white p-6 rounded-xl border border-red-100 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <AlertTriangle size={20} className="text-red-500" />
            Peringatan Stok Menipis
          </h3>
          {lowStockProducts.length > 0 ? (
            <div className="space-y-4">
              {lowStockProducts.map(p => (
                <div key={p.id} className="flex justify-between items-center border-b border-gray-100 pb-3 last:border-0">
                  <div>
                    <Link href={`/admin/produk/${p.id}/edit`} className="font-medium text-pink-700 hover:underline">
                      {p.name}
                    </Link>
                    <p className="text-sm text-gray-500">SKU: {p.sku}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-red-600">{p.current_stock} {p.unit}</p>
                    <p className="text-xs text-gray-500">Min: {p.min_stock}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 italic text-sm">Semua stok produk aman.</p>
          )}
        </div>
      </div>
    </div>
  );
}
