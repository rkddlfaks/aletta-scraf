import { prisma } from "@/lib/prisma";
import { ProductCard } from "@/components/storefront/ProductCard";
import { ProductFilter } from "@/components/storefront/ProductFilter";
import Link from "next/link";

export default async function MukenaPage({
  searchParams,
}: {
  searchParams: { sort?: string };
}) {
  const sort = searchParams.sort || "newest";

  // Build query: ONLY fetch Mukena Premium
  const where = { is_active: true, category: "Mukena Premium" };
  let orderBy: any = { created_at: "desc" };

  if (sort === "price-asc") orderBy = { price: "asc" };
  else if (sort === "price-desc") orderBy = { price: "desc" };
  else if (sort === "bestseller") orderBy = { sold_count: "desc" };

  const products = await prisma.product.findMany({
    where,
    orderBy,
    include: { images: true }
  });

  return (
    <div className="bg-zinc-950 min-h-screen pt-40 pb-12 relative overflow-hidden">
      {/* Decorative Gold Glows for Premium Vibe */}
      <div className="absolute top-0 inset-x-0 h-[500px] bg-gradient-to-b from-amber-900/20 to-transparent pointer-events-none" />
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-amber-600/10 blur-[100px] rounded-full pointer-events-none" />
      <div className="absolute top-80 -left-40 w-96 h-96 bg-amber-600/10 blur-[100px] rounded-full pointer-events-none" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="mb-12 text-center md:text-left">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-amber-200 mb-4 drop-shadow-sm tracking-tight">
            Rizki Berlian's
            <span className="block text-2xl md:text-3xl mt-2 text-amber-500/80 font-medium tracking-widest uppercase">Premium Prayer Gown</span>
          </h1>
          <div className="h-1 w-24 bg-gradient-to-r from-amber-400 to-amber-600 rounded-full mb-6 mx-auto md:mx-0"></div>
          <p className="text-amber-100/60 max-w-2xl text-lg md:text-xl font-light">
            Koleksi mukena premium eksklusif untuk kenyamanan beribadah Anda, dirancang khusus dengan sentuhan elegan dan material mewah.
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar Filters - No Categories, only Sort */}
          <ProductFilter 
            currentCategory="Semua" 
            currentSort={sort} 
            categories={[]} 
            basePath="/mukena"
            theme="dark"
          />

          {/* Product Grid */}
          <div className="flex-1">
            {products.length === 0 ? (
              <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-12 text-center shadow-sm">
                <p className="text-zinc-500 mb-4">Koleksi Mukena belum tersedia saat ini.</p>
                <Link href="/" className="text-amber-600 font-medium hover:text-amber-500 transition-colors hover:underline">
                  Kembali ke Beranda
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
                {products.map(product => (
                  <ProductCard key={product.id} product={product} theme="dark" />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
