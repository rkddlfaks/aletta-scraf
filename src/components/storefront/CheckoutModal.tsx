"use client";

import { useState } from "react";
import { createOrder } from "@/app/actions/checkout";
import { useCartStore } from "@/store/useCartStore";
import { X, Loader2, Truck, CheckCircle2 } from "lucide-react";

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CheckoutModal({ isOpen, onClose }: CheckoutModalProps) {
  const { items, getTotalPrice, clearCart } = useCartStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const [formData, setFormData] = useState({
    customer_name: "",
    customer_email: "",
    customer_phone: "",
    shipping_address: "",
    city: "",
    postal_code: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const generateWhatsAppUrl = (orderNumber: string) => {
    let message = `Halo Aletta Scarf, saya ingin mengkonfirmasi pesanan saya.\n\n`;
    message += `*Nomor Invoice:* ${orderNumber}\n`;
    message += `*Nama:* ${formData.customer_name}\n`;
    message += `*No. WA:* ${formData.customer_phone}\n\n`;
    
    message += `*Daftar Pesanan:*\n`;
    items.forEach((item, index) => {
      message += `${index + 1}. ${item.product.name}\n`;
      message += `   Jumlah: ${item.quantity} x Rp ${item.product.price.toLocaleString("id-ID")}\n`;
    });
    
    message += `\n*Total Belanja: Rp ${getTotalPrice().toLocaleString("id-ID")}*\n\n`;
    message += `*Alamat Pengiriman:*\n${formData.shipping_address}\n${formData.city}, ${formData.postal_code}\n\n`;
    message += "Mohon info ketersediaan dan ongkos kirim. Terima kasih!";

    const waNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "6281234567890";
    return `https://wa.me/${waNumber}?text=${encodeURIComponent(message)}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const payload = {
      ...formData,
      total_amount: getTotalPrice(),
      items: items.map(i => ({
        product_id: i.product.id,
        quantity: i.quantity,
        price: i.product.price
      }))
    };

    const result = await createOrder(payload);

    if (result.success && result.orderNumber) {
      setIsSuccess(true);
      clearCart();
      
      setTimeout(() => {
        window.location.href = `/checkout/success/${result.orderNumber}`;
      }, 1500);
    } else {
      alert(result.error || "Terjadi kesalahan. Silakan coba lagi.");
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  if (isSuccess) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
        <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-8 text-center animate-in zoom-in-95 duration-300">
          <div className="w-20 h-20 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 size={40} className="animate-bounce" />
          </div>
          <h2 className="text-2xl font-serif font-bold text-gray-900 mb-2">Pesanan Dibuat!</h2>
          <p className="text-gray-600 mb-6">Mengarahkan Anda ke halaman konfirmasi pembayaran...</p>
          <div className="flex justify-center">
            <Loader2 className="animate-spin text-pink-600" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-300 flex flex-col max-h-[90vh]">
        
        <div className="flex justify-between items-center p-6 border-b border-gray-100 shrink-0">
          <h2 className="text-xl font-serif font-bold text-gray-900 flex items-center gap-2">
            <Truck className="text-pink-600" /> Informasi Pengiriman
          </h2>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto">
          <form id="checkout-form" onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Nama Lengkap *</label>
              <input 
                required 
                type="text" 
                name="customer_name" 
                value={formData.customer_name} 
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none transition-all"
                placeholder="Cth: Siti Aminah"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">No. WhatsApp *</label>
                <input 
                  required 
                  type="tel" 
                  name="customer_phone" 
                  value={formData.customer_phone} 
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none transition-all"
                  placeholder="Cth: 08123456789"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Email (Opsional)</label>
                <input 
                  type="email" 
                  name="customer_email" 
                  value={formData.customer_email} 
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none transition-all"
                  placeholder="Cth: siti@email.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Alamat Lengkap *</label>
              <textarea 
                required 
                name="shipping_address" 
                value={formData.shipping_address} 
                onChange={handleChange}
                rows={3}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none transition-all resize-none"
                placeholder="Nama Jalan, Gedung, No. Rumah, RT/RW, Kecamatan..."
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Kota/Kabupaten *</label>
                <input 
                  required 
                  type="text" 
                  name="city" 
                  value={formData.city} 
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none transition-all"
                  placeholder="Cth: Bandung"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Kode Pos *</label>
                <input 
                  required 
                  type="text" 
                  name="postal_code" 
                  value={formData.postal_code} 
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none transition-all"
                  placeholder="Cth: 40111"
                />
              </div>
            </div>
          </form>
        </div>

        <div className="p-6 border-t border-gray-100 bg-gray-50 shrink-0">
          <div className="flex justify-between items-center mb-4">
            <span className="text-gray-600 font-medium">Total Tagihan</span>
            <span className="text-2xl font-black text-pink-700">Rp {getTotalPrice().toLocaleString("id-ID")}</span>
          </div>
          <button 
            type="submit" 
            form="checkout-form"
            disabled={isSubmitting}
            className="w-full bg-pink-700 hover:bg-pink-800 disabled:bg-pink-400 text-white py-4 rounded-xl font-bold transition-colors flex items-center justify-center gap-2 text-lg shadow-lg"
          >
            {isSubmitting ? (
              <><Loader2 className="animate-spin" size={24} /> Memproses...</>
            ) : (
              "Lanjutkan ke Pembayaran"
            )}
          </button>
        </div>
        
      </div>
    </div>
  );
}
