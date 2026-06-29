import { prisma } from "@/lib/prisma";
import { Settings } from "lucide-react";
import { SettingsForm } from "@/components/admin/SettingsForm";

export default async function SettingsPage() {
  let setting = await prisma.storeSetting.findFirst();

  if (!setting) {
    // default
    setting = {
      id: 0,
      promo_text: "🔥 PROMO SPESIAL: Beli 3 Scarf Medis Gratis Ongkir! Promo Berakhir Hari Ini.",
      is_promo_active: true,
      whatsapp_number: "6281234567890",
      updated_at: new Date()
    };
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Settings className="text-pink-600" />
          Pengaturan Toko
        </h1>
        <p className="text-gray-500 mt-1">Atur banner promo dan nomor WhatsApp utama toko Anda.</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 md:p-8">
        <SettingsForm initialData={setting} />
      </div>
    </div>
  );
}
