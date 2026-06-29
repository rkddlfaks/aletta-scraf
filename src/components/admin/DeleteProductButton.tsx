"use client";

import { Trash2, AlertTriangle } from "lucide-react";
import { useTransition, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function DeleteProductButton({ id, onDelete, productName = "produk ini" }: { id: number, onDelete: (id: number) => Promise<void>, productName?: string }) {
  const [isPending, startTransition] = useTransition();
  const [showModal, setShowModal] = useState(false);

  const handleDelete = () => {
    startTransition(async () => {
      await onDelete(id);
      setShowModal(false);
    });
  };

  return (
    <>
      <button
        disabled={isPending}
        className="p-2 text-red-600 hover:bg-red-50 rounded-md transition-colors disabled:opacity-50"
        title="Hapus Produk"
        onClick={() => setShowModal(true)}
      >
        <Trash2 size={18} />
      </button>

      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => !isPending && setShowModal(false)}
              className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm"
            />
            
            {/* Modal Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-md bg-white rounded-2xl shadow-xl border border-gray-100 p-6 overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-1.5 bg-red-500"></div>
              
              <div className="flex items-center gap-4 mb-6 mt-2">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center shrink-0">
                  <AlertTriangle className="text-red-600" size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Hapus Produk?</h3>
                  <p className="text-gray-500 text-sm mt-1">
                    Tindakan ini tidak dapat dibatalkan.
                  </p>
                </div>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-xl mb-8 border border-gray-100">
                <p className="text-sm text-gray-700">
                  Apakah Anda benar-benar yakin ingin menghapus <span className="font-bold text-gray-900">{productName}</span> dari katalog secara permanen?
                </p>
              </div>

              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => setShowModal(false)}
                  disabled={isPending}
                  className="px-5 py-2.5 text-gray-600 font-medium bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors disabled:opacity-50"
                >
                  Batal
                </button>
                <button
                  onClick={handleDelete}
                  disabled={isPending}
                  className="px-5 py-2.5 text-white font-medium bg-red-600 hover:bg-red-700 rounded-xl transition-colors disabled:opacity-50 flex items-center gap-2"
                >
                  {isPending ? "Menghapus..." : "Ya, Hapus Produk"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
