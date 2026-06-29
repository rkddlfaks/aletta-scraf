"use client";

import { useState } from "react";
import { updateOrderStatus } from "@/app/actions/order";
import { Loader2, AlertTriangle, CheckCircle, Info } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface OrderStatusSelectProps {
  orderId: number;
  initialStatus: string;
}

export function OrderStatusSelect({ orderId, initialStatus }: OrderStatusSelectProps) {
  const [status, setStatus] = useState(initialStatus);
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [pendingStatus, setPendingStatus] = useState("");

  const [shippingProvider, setShippingProvider] = useState("");
  const [trackingNumber, setTrackingNumber] = useState("");

  const statuses = [
    { value: "PENDING", label: "Menunggu", color: "text-amber-700 bg-amber-100 font-black border border-amber-300 shadow-sm" },
    { value: "PAID", label: "Lunas", color: "text-green-700 bg-green-100 font-black border border-green-300 shadow-sm" },
    { value: "PROCESSING", label: "Diproses", color: "text-blue-700 bg-blue-100 font-black border border-blue-300 shadow-sm" },
    { value: "SHIPPED", label: "Dikirim", color: "text-indigo-700 bg-indigo-100 font-black border border-indigo-300 shadow-sm" },
    { value: "COMPLETED", label: "Selesai", color: "text-emerald-700 bg-emerald-100 font-black border border-emerald-300 shadow-sm" },
    { value: "CANCELLED", label: "Batal", color: "text-red-700 bg-red-100 font-black border border-red-300 shadow-sm" },
  ];

  const doUpdate = async (newStatus: string) => {
    setIsLoading(true);
    const result = await updateOrderStatus(orderId, newStatus, shippingProvider, trackingNumber);
    
    if (result.success) {
      setStatus(newStatus);
    } else {
      alert(result.error || "Terjadi kesalahan");
    }
    
    setIsLoading(false);
    setShowModal(false);
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value;
    
    // Peringatan ganda untuk status krusial (Foolproof)
    if (newStatus === "CANCELLED" || newStatus === "COMPLETED" || newStatus === "SHIPPED") {
      setPendingStatus(newStatus);
      setShowModal(true);
    } else {
      doUpdate(newStatus);
    }
  };

  const currentStatusConfig = statuses.find(s => s.value === status) || statuses[0];
  const pendingStatusConfig = statuses.find(s => s.value === pendingStatus) || statuses[0];

  return (
    <>
      <div className="relative inline-block w-full max-w-[140px]">
        {isLoading && (
          <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none z-10 text-gray-500">
            <Loader2 size={16} className="animate-spin" />
          </div>
        )}
        <select
          value={status}
          onChange={handleStatusChange}
          disabled={isLoading}
          className={`w-full appearance-none rounded-md py-2 pl-3 pr-8 text-xs transition-colors cursor-pointer outline-none focus:ring-2 focus:ring-pink-300 ${currentStatusConfig.color} ${isLoading ? 'opacity-50' : ''}`}
        >
          {statuses.map(s => (
            <option key={s.value} value={s.value} className="text-gray-900 bg-white font-medium">
              {s.label}
            </option>
          ))}
        </select>
        
        {/* Custom Arrow for select */}
        {!isLoading && (
           <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
             <svg className="w-4 h-4 fill-current opacity-60" viewBox="0 0 20 20">
               <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
             </svg>
           </div>
        )}
      </div>

      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => !isLoading && setShowModal(false)}
              className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm"
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-md bg-white rounded-2xl shadow-xl border border-gray-100 p-6 overflow-hidden"
            >
              {pendingStatus === "CANCELLED" && <div className="absolute top-0 left-0 w-full h-1.5 bg-red-500"></div>}
              {pendingStatus === "COMPLETED" && <div className="absolute top-0 left-0 w-full h-1.5 bg-emerald-500"></div>}
              {pendingStatus === "SHIPPED" && <div className="absolute top-0 left-0 w-full h-1.5 bg-indigo-500"></div>}
              
              <div className="flex items-center gap-4 mb-5 mt-2">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${pendingStatus === "CANCELLED" ? "bg-red-100 text-red-600" : pendingStatus === "COMPLETED" ? "bg-emerald-100 text-emerald-600" : "bg-indigo-100 text-indigo-600"}`}>
                  {pendingStatus === "CANCELLED" ? <AlertTriangle size={24} /> : pendingStatus === "COMPLETED" ? <CheckCircle size={24} /> : <Info size={24} />}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">
                    Ubah Status ke <span className={pendingStatusConfig.color.split(' ')[0]}>{pendingStatusConfig.label}</span>?
                  </h3>
                </div>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-xl mb-6 border border-gray-100">
                {pendingStatus === "CANCELLED" ? (
                  <p className="text-sm text-gray-700">
                    Apakah Anda yakin ingin membatalkan pesanan ini? Jika pelanggan sudah membayar, <span className="font-bold text-red-600">uang harus dikembalikan secara manual</span> kepada pelanggan.
                  </p>
                ) : pendingStatus === "COMPLETED" ? (
                  <p className="text-sm text-gray-700">
                    Apakah pesanan sudah dipastikan <span className="font-bold">diterima dengan baik</span> oleh pelanggan? Mengubah status ke Selesai akan menutup transaksi ini.
                  </p>
                ) : (
                  <div className="space-y-4">
                    <p className="text-sm text-gray-700 mb-2">
                      Silakan masukkan detail pengiriman agar pelanggan bisa melacak pesanan mereka:
                    </p>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-gray-700">Ekspedisi (Kurir)</label>
                      <input 
                        type="text" 
                        placeholder="Contoh: JNE, J&T, Sicepat" 
                        value={shippingProvider}
                        onChange={e => setShippingProvider(e.target.value)}
                        className="w-full text-sm px-3 py-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-300"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-gray-700">Nomor Resi</label>
                      <input 
                        type="text" 
                        placeholder="Contoh: JP1234567890" 
                        value={trackingNumber}
                        onChange={e => setTrackingNumber(e.target.value)}
                        className="w-full text-sm px-3 py-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-300 uppercase"
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => setShowModal(false)}
                  disabled={isLoading}
                  className="px-5 py-2.5 text-gray-600 font-medium bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors disabled:opacity-50"
                >
                  Kembali
                </button>
                <button
                  onClick={() => doUpdate(pendingStatus)}
                  disabled={isLoading || (pendingStatus === "SHIPPED" && (!shippingProvider || !trackingNumber))}
                  className={`px-5 py-2.5 text-white font-medium rounded-xl transition-colors disabled:opacity-50 flex items-center gap-2 ${pendingStatus === "CANCELLED" ? "bg-red-600 hover:bg-red-700" : pendingStatus === "COMPLETED" ? "bg-emerald-600 hover:bg-emerald-700" : "bg-indigo-600 hover:bg-indigo-700"}`}
                >
                  {isLoading ? "Menyimpan..." : "Ya, Lanjutkan"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
