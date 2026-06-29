"use client";

import { useCartStore } from "@/store/useCartStore";
import { motion, AnimatePresence } from "framer-motion";
import { X, Trash2, ShoppingBag, Plus, Minus, ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export function MiniCart() {
  const { isCartOpen, closeCart, items, removeItem, updateQuantity, getTotalPrice } = useCartStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-[100dvh] w-full max-w-md bg-white shadow-2xl z-[101] flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-pink-100">
              <h2 className="text-xl font-serif font-bold text-pink-950 flex items-center gap-2">
                <ShoppingBag className="text-pink-600" />
                Keranjang Belanja
              </h2>
              <button 
                onClick={closeCart}
                className="p-2 bg-pink-50 hover:bg-pink-100 text-pink-800 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-pink-50/30">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-4 text-pink-900/50">
                  <ShoppingBag size={64} className="opacity-20" />
                  <p className="font-medium text-lg text-pink-900/60">Keranjang Anda masih kosong</p>
                  <button 
                    onClick={closeCart}
                    className="mt-4 text-pink-600 font-bold underline underline-offset-4"
                  >
                    Lanjut Belanja
                  </button>
                </div>
              ) : (
                items.map((item) => (
                  <div key={item.product.id} className="flex gap-4 bg-white p-4 rounded-2xl shadow-sm border border-pink-100/50 relative group">
                    <div className="relative w-24 h-24 rounded-xl overflow-hidden bg-pink-50 shrink-0 border border-pink-100">
                      <Image 
                        src={item.product.image_url || '/placeholder.jpg'} 
                        alt={item.product.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start gap-2">
                          <h3 className="font-bold text-pink-950 text-sm line-clamp-2 leading-tight">
                            {item.product.name}
                          </h3>
                          <button 
                            onClick={() => removeItem(item.product.id)}
                            className="text-gray-400 hover:text-red-500 transition-colors p-1"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                        <p className="text-xs text-pink-600/80 font-medium mt-1">{item.product.category}</p>
                      </div>
                      
                      <div className="flex items-center justify-between mt-3">
                        <div className="font-bold text-pink-900">
                          Rp {item.product.price.toLocaleString("id-ID")}
                        </div>
                        
                        <div className="flex items-center gap-3 bg-pink-50 rounded-lg px-2 py-1">
                          <button 
                            onClick={() => updateQuantity(item.product.id, Math.max(1, item.quantity - 1))}
                            className="text-pink-700 hover:text-pink-950 disabled:opacity-30"
                            disabled={item.quantity <= 1}
                          >
                            <Minus size={14} />
                          </button>
                          <span className="text-sm font-bold w-4 text-center text-pink-950">{item.quantity}</span>
                          <button 
                            onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                            className="text-pink-700 hover:text-pink-950"
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer / Checkout Button */}
            {items.length > 0 && (
              <div className="p-6 bg-white border-t border-pink-100 shadow-[0_-10px_40px_rgba(255,192,203,0.15)]">
                <div className="flex justify-between items-end mb-6">
                  <span className="text-pink-900/60 font-medium">Total Harga</span>
                  <div className="text-2xl font-black text-pink-950">
                    Rp {getTotalPrice().toLocaleString("id-ID")}
                  </div>
                </div>
                
                <Link 
                  href="/keranjang" 
                  onClick={closeCart}
                  className="w-full bg-pink-950 hover:bg-pink-900 text-white font-bold rounded-2xl py-4 flex items-center justify-center gap-2 transition-all hover:gap-3 group shadow-lg shadow-pink-900/20"
                >
                  Checkout Sekarang
                  <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
                </Link>
                <button 
                  onClick={closeCart}
                  className="w-full mt-4 text-sm font-bold text-pink-900/60 hover:text-pink-900 transition-colors"
                >
                  Lanjut Belanja
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
