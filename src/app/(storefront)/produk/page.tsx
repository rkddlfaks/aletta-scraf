import { prisma } from "@/lib/prisma";
import { ProductCard } from "@/components/storefront/ProductCard";
import Link from "next/link";
import { Filter } from "lucide-react";

export default async function CatalogPage({
  searchParams,
}: {
  searchParams: { category?: string; sort?: string };
}) {
  const category = searchParams.category || "Semua";
  const sort = searchParams.sort || "newest";

  // Build query
  const where = { is_active: true, ...(category !== "Semua" && { category }) };
  let orderBy: any = { created_at: "desc" };

  if (sort === "price-asc") orderBy = { price: "asc" };
  else if (sort === "price-desc") orderBy = { price: "desc" };
  else if (sort === "bestseller") orderBy = { sold_count: "desc" };

  const products = await prisma.product.findMany({
    where,
    orderBy,
  });

  const categories = ["Semua", "Hijab Medis", "Ciput", "Mukena Premium", "Ikat Rambut"];

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mb-4">Koleksi Aletta Scarf</h1>
          <p className="text-gray-600 max-w-2xl">
            Temukan berbagai pilihan hijab medis premium dan aksesoris pendukung untuk kenyamanan Anda saat bertugas.
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar Filters */}
          <aside className="w-full md:w-64 shrink-0">
            <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm sticky top-24">
              <div className="flex items-center gap-2 font-semibold text-gray-900 mb-4 pb-4 border-b border-gray-100">
                <Filter size={18} /> Filter
              </div>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-900 mb-3">Kategori</h3>
                  <div className="space-y-2">
                    {categories.map(cat => (
                      <Link 
                        key={cat} 
                        href={`/produk?category=${cat}&sort=${sort}`}
                        className={`block text-sm py-1 transition-colors ${category === cat ? 'text-pink-700 font-medium' : 'text-gray-600 hover:text-pink-600'}`}
                      >
                        {cat}
                      </Link>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-900 mb-3">Urutkan</h3>
                  <div className="space-y-2">
                    <Link href={`/produk?category=${category}&sort=newest`} className={`block text-sm py-1 transition-colors ${sort === 'newest' ? 'text-pink-700 font-medium' : 'text-gray-600 hover:text-pink-600'}`}>
                      Terbaru
                    </Link>
                    <Link href={`/produk?category=${category}&sort=bestseller`} className={`block text-sm py-1 transition-colors ${sort === 'bestseller' ? 'text-pink-700 font-medium' : 'text-gray-600 hover:text-pink-600'}`}>
                      Terlaris
                    </Link>
                    <Link href={`/produk?category=${category}&sort=price-asc`} className={`block text-sm py-1 transition-colors ${sort === 'price-asc' ? 'text-pink-700 font-medium' : 'text-gray-600 hover:text-pink-600'}`}>
                      Harga: Rendah ke Tinggi
                    </Link>
                    <Link href={`/produk?category=${category}&sort=price-desc`} className={`block text-sm py-1 transition-colors ${sort === 'price-desc' ? 'text-pink-700 font-medium' : 'text-gray-600 hover:text-pink-600'}`}>
                      Harga: Tinggi ke Rendah
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </aside>

          {/* Product Grid */}
          <div className="flex-1">
            {products.length === 0 ? (
              <div className="bg-white rounded-xl border border-gray-200 p-12 text-center shadow-sm">
                <p className="text-gray-500 mb-4">Tidak ada produk yang ditemukan untuk filter ini.</p>
                <Link href="/produk" className="text-pink-700 font-medium hover:underline">
                  Reset Filter
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
