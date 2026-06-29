"use client";

import { toggleTestimonialApproval, deleteTestimonial } from "@/app/actions/ulasan";
import { Star, CheckCircle, XCircle, Trash2 } from "lucide-react";
import { useState } from "react";

export function UlasanTable({ testimonials }: { testimonials: any[] }) {
  const [loadingId, setLoadingId] = useState<number | null>(null);

  const handleToggle = async (id: number, currentStatus: boolean) => {
    setLoadingId(id);
    await toggleTestimonialApproval(id, currentStatus);
    setLoadingId(null);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Hapus ulasan ini permanen?")) return;
    setLoadingId(id);
    await deleteTestimonial(id);
    setLoadingId(null);
  };

  if (testimonials.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center text-gray-500">
        Belum ada ulasan dari pelanggan.
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200 text-gray-600 text-sm">
              <th className="p-4 font-semibold">Pelanggan</th>
              <th className="p-4 font-semibold">Pesanan</th>
              <th className="p-4 font-semibold">Rating & Ulasan</th>
              <th className="p-4 font-semibold">Status Tampil</th>
              <th className="p-4 font-semibold">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {testimonials.map((t) => (
              <tr key={t.id} className={`transition-colors hover:bg-gray-50/50 ${loadingId === t.id ? 'opacity-50' : ''}`}>
                <td className="p-4">
                  <div className="font-bold text-gray-900">{t.customer_name}</div>
                  <div className="text-xs text-gray-500">{t.role || 'Pelanggan'}</div>
                  <div className="text-xs text-gray-400 mt-1">{new Date(t.created_at).toLocaleDateString('id-ID')}</div>
                </td>
                <td className="p-4">
                  <span className="font-mono text-sm text-pink-700 bg-pink-50 px-2 py-1 rounded-md">{t.order.order_number}</span>
                </td>
                <td className="p-4 max-w-xs">
                  <div className="flex text-amber-400 mb-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={14} className={i < t.rating ? "fill-current" : "text-gray-300"} />
                    ))}
                  </div>
                  <p className="text-sm text-gray-700 italic line-clamp-3">"{t.content}"</p>
                </td>
                <td className="p-4">
                  {t.is_approved ? (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700">
                      <CheckCircle size={14} /> Ditampilkan
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-gray-100 text-gray-600">
                      <XCircle size={14} /> Disembunyikan
                    </span>
                  )}
                </td>
                <td className="p-4">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleToggle(t.id, t.is_approved)}
                      disabled={loadingId === t.id}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                        t.is_approved 
                          ? "bg-gray-100 text-gray-600 hover:bg-gray-200" 
                          : "bg-blue-50 text-blue-700 hover:bg-blue-100"
                      }`}
                    >
                      {t.is_approved ? "Sembunyikan" : "Tampilkan"}
                    </button>
                    <button
                      onClick={() => handleDelete(t.id)}
                      disabled={loadingId === t.id}
                      className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      title="Hapus"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
