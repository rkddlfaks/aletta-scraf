"use client";

import { useCartStore } from "@/store/useCartStore";
import Link from "next/link";
import { ArrowLeft, Trash2, Minus, Plus, ShoppingBag } from "lucide-react";
import { useState, useEffect } from "react";

export default function CartPage() {
  const { items, updateQuantity, removeItem, clearCart, getTotalPrice } = useCartStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleCheckout = () => {
    if (items.length === 0) return;

    let message = "Halo Aletta Scarf, saya ingin memesan:\n\n";
    items.forEach((item, index) => {
      message += `${index + 1}. ${item.product.name} (SKU: ${item.product.sku})\n`;
      message += `   Jumlah: ${item.quantity} ${item.product.unit}\n`;
      message += `   Harga: Rp ${(item.product.price * item.quantity).toLocaleString("id-ID")}\n\n`;
    });
    
    message += `*Total Belanja: Rp ${getTotalPrice().toLocaleString("id-ID")}*\n\n`;
    message += "Mohon info ketersediaan dan ongkos kirim. Terima kasih!";

    const waNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "6281234567890";
    const encodedMessage = encodeURIComponent(message);
    const waUrl = `https://wa.me/${waNumber}?text=${encodedMessage}`;
    
    // Clear cart after redirect to WA? Better to let user clear it or not.
    // We just open WA.
    window.open(waUrl, '_blank');
  };

  if (!mounted) return null;

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/produk" className="text-gray-500 hover:text-pink-700 transition-colors">
            <ArrowLeft size={24} />
          </Link>
          <h1 className="text-3xl font-serif font-bold text-gray-900">Keranjang Belanja</h1>
        </div>

        {items.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <div className="w-20 h-20 bg-pink-50 rounded-full flex items-center justify-center text-pink-300 mx-auto mb-6">
              <ShoppingBag size={40} />
            </div>
            <h2 className="text-xl font-medium text-gray-900 mb-2">Keranjang Anda Kosong</h2>
            <p className="text-gray-500 mb-8">Belum ada produk di dalam keranjang belanja Anda.</p>
            <Link href="/produk" className="bg-pink-700 hover:bg-pink-800 text-white px-8 py-3 rounded-full font-medium transition-colors">
              Mulai Belanja
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              {items.map((item) => (
                <div key={item.product.id} className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-200 flex flex-col sm:flex-row gap-6">
                  {/* Image Placeholder */}
                  <div className="w-full sm:w-24 h-24 bg-pink-50 rounded-lg flex-shrink-0 flex items-center justify-center overflow-hidden">
                    {item.product.image_url ? (
                      <img src={item.product.image_url} alt={item.product.name} className="w-full h-full object-cover" />
                    ) : (
                      <span className="font-serif text-sm font-bold text-pink-200 opacity-50">ALETTA</span>
                    )}
                  </div>
                  
                  <div className="flex-1 flex flex-col justify-between">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-bold text-gray-900 text-lg leading-tight">{item.product.name}</h3>
                        <p className="text-sm text-gray-500 mt-1">{item.product.category}</p>
                      </div>
                      <button 
                        onClick={() => removeItem(item.product.id)}
                        className="text-gray-400 hover:text-red-500 transition-colors p-1"
                        title="Hapus"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                    
                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden bg-white">
                        <button 
                          onClick={() => updateQuantity(item.product.id, Math.max(1, item.quantity - 1))}
                          className="px-3 py-1.5 text-gray-600 hover:bg-gray-50 transition-colors"
                        >
                          <Minus size={16} />
                        </button>
                        <span className="px-4 py-1.5 text-sm font-medium min-w-[3rem] text-center border-x border-gray-200">
                          {item.quantity}
                        </span>
                        <button 
                          onClick={() => {
                            if (item.quantity < item.product.current_stock) {
                              updateQuantity(item.product.id, item.quantity + 1);
                            } else {
                              alert(`Maksimal stok yang tersedia adalah ${item.product.current_stock}`);
                            }
                          }}
                          className="px-3 py-1.5 text-gray-600 hover:bg-gray-50 transition-colors"
                        >
                          <Plus size={16} />
                        </button>
                      </div>
                      <p className="font-bold text-pink-700">
                        Rp {(item.product.price * item.quantity).toLocaleString("id-ID")}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 sticky top-24">
                <h3 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-4 mb-4">Ringkasan Belanja</h3>
                
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-gray-600">
                    <span>Total Harga ({items.reduce((acc, item) => acc + item.quantity, 0)} Barang)</span>
                    <span>Rp {getTotalPrice().toLocaleString("id-ID")}</span>
                  </div>
                </div>
                
                <div className="border-t border-gray-100 pt-4 mb-6">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-gray-900">Total Belanja</span>
                    <span className="font-bold text-xl text-pink-700">Rp {getTotalPrice().toLocaleString("id-ID")}</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-2 text-right">Belum termasuk ongkos kirim</p>
                </div>
                
                <button 
                  onClick={handleCheckout}
                  className="w-full bg-pink-700 hover:bg-pink-800 text-white py-3 rounded-xl font-bold transition-colors flex items-center justify-center gap-2"
                >
                  Pesan via WhatsApp
                </button>
                
                <button 
                  onClick={clearCart}
                  className="w-full mt-3 py-2 text-sm text-gray-500 hover:text-gray-700 font-medium transition-colors"
                >
                  Kosongkan Keranjang
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
