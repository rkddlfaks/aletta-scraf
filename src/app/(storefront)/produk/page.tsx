import { prisma } from "@/lib/prisma";
import { ProductCard } from "@/components/storefront/ProductCard";
import { ProductFilter } from "@/components/storefront/ProductFilter";
import Link from "next/link";

export default async function CatalogPage({
  searchParams,
}: {
  searchParams: { category?: string; sort?: string };
}) {
  const category = searchParams.category || "Semua";
  const sort = searchParams.sort || "newest";

  // Build query: Exclude Mukena Premium from this page
  const baseWhere = { is_active: true, category: { not: "Mukena Premium" } };
  const where = category !== "Semua" ? { ...baseWhere, category } : baseWhere;

  let orderBy: any = { created_at: "desc" };

  if (sort === "price-asc") orderBy = { price: "asc" };
  else if (sort === "price-desc") orderBy = { price: "desc" };
  else if (sort === "bestseller") orderBy = { sold_count: "desc" };

  const products = await prisma.product.findMany({
    where,
    orderBy,
    include: { images: true }
  });

  const categories = ["Semua", "Hijab Medis", "Ciput", "Ikat Rambut"];

  return (
    <div className="bg-gray-50 min-h-screen pt-40 pb-12">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mb-4">Koleksi Aletta Scarf</h1>
          <p className="text-gray-600 max-w-2xl">
            Temukan berbagai pilihan hijab medis premium dan aksesoris pendukung untuk kenyamanan Anda saat bertugas.
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar Filters */}
          {/* Sidebar Filters */}
          <ProductFilter 
            currentCategory={category} 
            currentSort={sort} 
            categories={categories} 
          />

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
              <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6">
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
