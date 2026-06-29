import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { ProductCard } from "@/components/storefront/ProductCard";
import { ArrowRight, Stethoscope, Heart, ShieldCheck } from "lucide-react";

export default async function HomePage() {
  const featuredProducts = await prisma.product.findMany({
    where: { is_active: true },
    take: 4,
    orderBy: { created_at: 'desc' }
  });

  return (
    <div className="flex flex-col w-full">
      {/* Hero Section */}
      <section className="relative bg-pink-50 py-20 overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-2xl">
            <span className="inline-block px-3 py-1 bg-pink-100 text-pink-800 text-sm font-semibold rounded-full mb-6">
              #SahabatCoassMuslimah
            </span>
            <h1 className="text-5xl md:text-6xl font-serif font-bold text-pink-900 leading-tight mb-6">
              Hijab Medis Premium untuk Kenyamanan Anda
            </h1>
            <p className="text-lg text-gray-700 mb-8 max-w-xl">
              Inovasi lubang telinga yang dirancang khusus agar pemakaian stetoskop menjadi lebih mudah tanpa perlu melepas kerudung.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/produk" className="bg-pink-700 hover:bg-pink-800 text-white px-8 py-3 rounded-full font-medium transition-colors flex items-center gap-2">
                Lihat Koleksi <ArrowRight size={20} />
              </Link>
            </div>
          </div>
        </div>
        {/* Decorative background shape */}
        <div className="absolute top-0 right-0 w-1/2 h-full bg-pink-100 rounded-l-full opacity-50 -z-0 translate-x-1/3"></div>
      </section>

      {/* Features */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center p-6">
              <div className="w-16 h-16 bg-pink-50 rounded-full flex items-center justify-center text-pink-600 mb-4">
                <Stethoscope size={32} />
              </div>
              <h3 className="text-xl font-bold font-serif text-gray-900 mb-2">Inovasi Lubang Telinga</h3>
              <p className="text-gray-600">Akses mudah menggunakan stetoskop tanpa merusak kerapian hijab.</p>
            </div>
            <div className="flex flex-col items-center text-center p-6">
              <div className="w-16 h-16 bg-pink-50 rounded-full flex items-center justify-center text-pink-600 mb-4">
                <Heart size={32} />
              </div>
              <h3 className="text-xl font-bold font-serif text-gray-900 mb-2">Bahan Premium</h3>
              <p className="text-gray-600">Material menyerap keringat dan nyaman dipakai seharian saat dinas.</p>
            </div>
            <div className="flex flex-col items-center text-center p-6">
              <div className="w-16 h-16 bg-pink-50 rounded-full flex items-center justify-center text-pink-600 mb-4">
                <ShieldCheck size={32} />
              </div>
              <h3 className="text-xl font-bold font-serif text-gray-900 mb-2">Kualitas Terjamin</h3>
              <p className="text-gray-600">Jahitan rapi dengan quality control ketat untuk kepuasan Anda.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-end mb-10">
            <div>
              <h2 className="text-3xl font-serif font-bold text-gray-900">Koleksi Terbaru</h2>
              <p className="text-gray-600 mt-2">Temukan produk favorit untuk menemani aktivitas harian Anda.</p>
            </div>
            <Link href="/produk" className="hidden md:flex items-center gap-2 text-pink-700 font-medium hover:underline">
              Lihat Semua <ArrowRight size={18} />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          
          <div className="mt-8 text-center md:hidden">
            <Link href="/produk" className="inline-flex items-center gap-2 text-pink-700 font-medium hover:underline">
              Lihat Semua <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
