import { prisma } from "@/lib/prisma";
import { UlasanTable } from "@/components/admin/UlasanTable";
import { MessageSquareHeart } from "lucide-react";

export default async function AdminUlasanPage() {
  const testimonials = await prisma.testimonial.findMany({
    orderBy: { created_at: 'desc' },
    include: {
      order: {
        select: { order_number: true }
      }
    }
  });

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <MessageSquareHeart className="text-pink-600" />
          Kelola Ulasan Pelanggan
        </h1>
        <p className="text-gray-500 mt-1">Setujui ulasan yang masuk agar tampil di halaman utama (Beranda) toko Anda.</p>
      </div>

      <UlasanTable testimonials={testimonials} />
    </div>
  );
}
