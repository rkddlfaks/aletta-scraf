"use client";

import { useCartStore } from "@/store/useCartStore";

import { ShoppingBag } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

export function MobileStickyCart() {
  const { items, openCart } = useCartStore();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;
  if (items.length === 0) return null;

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] z-[90]"
      >
        <button
          onClick={openCart}
          className="w-full bg-pink-700 text-white rounded-2xl p-4 shadow-xl flex items-center justify-between font-bold"
        >
          <div className="flex items-center gap-3">
            <div className="relative">
              <ShoppingBag size={24} />
              <span className="absolute -top-1 -right-2 bg-white text-pink-700 text-[10px] w-5 h-5 flex items-center justify-center rounded-full">
                {totalItems}
              </span>
            </div>
            <div className="text-left flex flex-col">
              <span className="text-xs text-pink-200">Total Keranjang</span>
              <span className="text-sm">Rp {totalPrice.toLocaleString("id-ID")}</span>
            </div>
          </div>
          <div className="bg-pink-600/50 px-4 py-2 rounded-xl text-sm border border-pink-500/50">
            Lihat
          </div>
        </button>
      </motion.div>
    </AnimatePresence>
  );
}
