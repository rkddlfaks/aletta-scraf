"use client";

import { updateStoreSettings } from "@/app/actions/settings";
import { StoreSetting } from "@prisma/client";
import { Save, Smartphone, MessageCircle, CheckCircle2, AlertCircle } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export function SettingsForm({ initialData }: { initialData: StoreSetting }) {
  const [isPending, setIsPending] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error", text: string } | null>(null);
  const router = useRouter();

  async function action(formData: FormData) {
    setIsPending(true);
    setMessage(null);
    try {
      const res = await updateStoreSettings(formData);
      if (res.success) {
        setMessage({ type: "success", text: "Pengaturan berhasil disimpan!" });
        router.refresh();
      } else {
        setMessage({ type: "error", text: "Gagal menyimpan pengaturan." });
      }
    } catch (e) {
      setMessage({ type: "error", text: "Terjadi kesalahan sistem." });
    } finally {
      setIsPending(false);
      // Sembunyikan pesan setelah 3 detik
      setTimeout(() => setMessage(null), 3000);
    }
  }

  return (
    <form action={action} className="space-y-8">
      
      {message && (
        <div className={`p-4 rounded-xl flex items-center gap-3 font-medium ${
          message.type === "success" ? "bg-green-50 text-green-700 border border-green-200" : "bg-red-50 text-red-700 border border-red-200"
        }`}>
          {message.type === "success" ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
          {message.text}
        </div>
      )}

      {/* Promo Section */}
      <section className="space-y-4">
        <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2 border-b border-gray-100 pb-2">
          <MessageCircle size={20} className="text-pink-600" />
          Pita Promo (Ticker)
        </h2>
        <p className="text-sm text-gray-500 mb-4">Teks berjalan atau pita pengumuman di bagian paling atas website.</p>
        
        <div className="space-y-3">
          <label className="text-sm font-medium text-gray-700">Teks Promo</label>
          <input 
            type="text" 
            name="promo_text" 
            defaultValue={initialData.promo_text || ""} 
            className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:ring-2 focus:ring-pink-500 outline-none transition-all"
            placeholder="Misal: Gratis Ongkir seluruh Indonesia!"
          />
        </div>

        <label className="flex items-center gap-3 cursor-pointer mt-4">
          <input 
            type="checkbox" 
            name="is_promo_active" 
            defaultChecked={initialData.is_promo_active} 
            className="w-5 h-5 text-pink-600 rounded border-gray-300 focus:ring-pink-500"
          />
          <span className="font-medium text-gray-700">Tampilkan Pita Promo di Website</span>
        </label>
      </section>

      {/* WhatsApp Section */}
      <section className="space-y-4 pt-6 border-t border-gray-100">
        <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2 border-b border-gray-100 pb-2">
          <Smartphone size={20} className="text-pink-600" />
          Nomor WhatsApp Admin
        </h2>
        <p className="text-sm text-gray-500 mb-4">Nomor yang akan dihubungi oleh pelanggan saat menekan tombol Chat atau Checkout.</p>
        
        <div className="space-y-3">
          <label className="text-sm font-medium text-gray-700">Nomor Telepon (Format: 628...)</label>
          <input 
            type="text" 
            name="whatsapp_number" 
            required
            defaultValue={initialData.whatsapp_number} 
            className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:ring-2 focus:ring-pink-500 outline-none transition-all"
            placeholder="Cth: 6281234567890"
          />
          <p className="text-xs text-gray-400">Pastikan menggunakan kode negara 62 tanpa tanda + atau angka 0 di depan.</p>
        </div>
      </section>

      <div className="pt-6 border-t border-gray-100 flex justify-end">
        <button 
          type="submit" 
          disabled={isPending}
          className={`font-bold py-3 px-8 rounded-xl transition-colors flex items-center gap-2 shadow-md ${
            isPending ? "bg-gray-400 text-white cursor-not-allowed" : "bg-pink-700 hover:bg-pink-800 text-white"
          }`}
        >
          <Save size={20} />
          {isPending ? "Menyimpan..." : "Simpan Pengaturan"}
        </button>
      </div>
    </form>
  );
}
