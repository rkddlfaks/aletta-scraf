"use client";

import { Product } from "@prisma/client";
import { useCartStore } from "@/store/useCartStore";
import { Plus, Check, ShoppingBag, Eye, X } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createPortal } from "react-dom";

type ProductWithImages = Product & { images?: { url: string }[] };

export function ProductCard({ product, theme = "light" }: { product: ProductWithImages, theme?: "light" | "dark" }) {
  const addItem = useCartStore(state => state.addItem);
  const [added, setAdded] = useState(false);
  const [particles, setParticles] = useState<{id: number}[]>([]);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const isDark = theme === "dark";

  const handleAddToCart = (e: React.MouseEvent) => {
    if (product.current_stock <= 0) return;
    
    addItem(product);
    setAdded(true);
    
    // Memicu partikel terbang
    const newParticle = { id: Date.now() };
    setParticles(prev => [...prev, newParticle]);
    
    setTimeout(() => {
      setParticles(prev => prev.filter(p => p.id !== newParticle.id));
    }, 1000);

    setTimeout(() => {
      setAdded(false);
      useCartStore.getState().openCart();
    }, 500);
  };

  const isOutOfStock = product.current_stock <= 0;

  // Combine image_url and images array
  const galleryImages = Array.from(new Set([product.image_url, ...(product.images?.map(i => i.url) || [])])).filter(Boolean) as string[];
  const currentImage = galleryImages.length > 0 ? galleryImages[currentImageIndex] : null;

  return (
    <div className={`group rounded-xl shadow-sm border overflow-hidden flex flex-col h-full transition-all hover:shadow-md ${
      isDark ? "bg-zinc-900 border-zinc-800 hover:border-amber-900/50" : "bg-white border-gray-100 hover:border-pink-200"
    }`}>
      <div 
        className={`aspect-[4/5] relative overflow-hidden flex items-center justify-center cursor-pointer ${
          isDark ? "bg-zinc-800" : "bg-gray-100"
        }`}
        onClick={() => setIsQuickViewOpen(true)}
      >
        {/* Placeholder image */}
        {product.image_url ? (
          <img 
            src={product.image_url} 
            alt={product.name} 
            className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className={`w-full h-full flex flex-col items-center justify-center ${
            isDark ? "bg-zinc-900/50 text-zinc-700" : "bg-pink-50/50 text-pink-200"
          }`}>
            <span className="font-serif text-2xl font-bold opacity-30">ALETTA</span>
            <span className="text-sm font-medium tracking-widest opacity-30 mt-1">SCARF</span>
          </div>
        )}
        
        {/* Quick View Button on Hover */}
        <button
          onClick={() => setIsQuickViewOpen(true)}
          className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[1px] z-10"
        >
          <div className="bg-white text-gray-900 rounded-full py-2 px-4 font-semibold text-sm flex items-center gap-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
            <Eye size={16} />
            Quick View
          </div>
        </button>

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2 z-20">
          {product.badge && (
            <span className="bg-pink-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm">
              {product.badge}
            </span>
          )}
          {isOutOfStock && (
            <span className="bg-gray-800 text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm">
              Habis
            </span>
          )}
        </div>
      </div>

      {isMounted && createPortal(
        <AnimatePresence>
          {isQuickViewOpen && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsQuickViewOpen(false)}
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className={`relative w-full max-w-3xl rounded-2xl shadow-2xl flex flex-col md:flex-row max-h-[90vh] md:max-h-[80vh] overflow-y-auto md:overflow-hidden bg-white dark:bg-zinc-900`}
              >
                <button
                  onClick={() => setIsQuickViewOpen(false)}
                  className={`absolute top-4 right-4 z-10 p-2 rounded-full bg-white/80 dark:bg-zinc-800/80 text-gray-500 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-white shadow-sm backdrop-blur-md`}
                >
                  <X size={20} />
                </button>

                <div className={`w-full md:w-1/2 flex flex-col shrink-0 bg-gray-100 dark:bg-zinc-800`}>
                  <div className="w-full flex-1 relative group min-h-[300px] md:min-h-[400px]">
                    {currentImage ? (
                      <>
                        <img
                          src={currentImage}
                          alt={product.name}
                          className="absolute inset-0 w-full h-full object-contain p-4 md:p-8"
                        />
                        {galleryImages.length > 1 && (
                          <>
                            <button
                              onClick={(e) => { e.stopPropagation(); setCurrentImageIndex((prev) => (prev === 0 ? galleryImages.length - 1 : prev - 1)); }}
                              className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 p-2 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
                            </button>
                            <button
                              onClick={(e) => { e.stopPropagation(); setCurrentImageIndex((prev) => (prev === galleryImages.length - 1 ? 0 : prev + 1)); }}
                              className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 p-2 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
                            </button>
                            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-black/50 text-white text-[10px] font-bold px-2 py-1 rounded-full backdrop-blur-sm">
                              {currentImageIndex + 1} / {galleryImages.length}
                            </div>
                          </>
                        )}
                      </>
                    ) : (
                      <div className="w-full h-full flex items-center justify-center opacity-30">
                        <span className="font-serif text-3xl font-bold dark:text-white">ALETTA</span>
                      </div>
                    )}
                  </div>
                  {galleryImages.length > 1 && (
                    <div className="flex gap-2 p-4 overflow-x-auto [&::-webkit-scrollbar]:hidden bg-black/5 dark:bg-white/5">
                      {galleryImages.map((img, idx) => (
                        <button 
                          key={idx}
                          onClick={() => setCurrentImageIndex(idx)}
                          className={`w-16 h-16 shrink-0 rounded-lg overflow-hidden border-2 transition-all ${
                            currentImageIndex === idx ? "border-pink-600 dark:border-amber-500" : "border-transparent opacity-60 hover:opacity-100"
                          }`}
                        >
                          <img src={img} alt="Thumbnail" className="w-full h-full object-contain" />
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <div className="w-full md:w-1/2 flex flex-col h-auto md:h-full max-h-full overflow-hidden">
                  <div className="p-6 md:p-8 flex flex-col flex-1 min-h-0">
                    <div className={`text-sm mb-2 font-semibold text-pink-600 dark:text-amber-500`}>
                      {product.category}
                    </div>
                    <h2 className={`text-2xl font-bold mb-4 leading-tight text-gray-900 dark:text-white`}>
                      {product.name}
                    </h2>
                    <div className={`text-2xl font-black mb-6 text-pink-700 dark:text-amber-500`}>
                      Rp {product.price.toLocaleString("id-ID")}
                    </div>

                    <div className={`prose prose-sm max-w-none mb-8 flex-1 overflow-y-auto pr-2 dark:prose-invert`}>
                      <h4 className="font-semibold mb-2 text-gray-900 dark:text-white">Detail Produk:</h4>
                      {product.description ? (
                        <p className="whitespace-pre-line text-sm leading-relaxed opacity-80 text-gray-700 dark:text-gray-300">
                          {product.description}
                        </p>
                      ) : (
                        <p className="text-sm italic opacity-60 text-gray-700 dark:text-gray-300">Deskripsi belum tersedia.</p>
                      )}
                    </div>

                    <div className="mt-auto shrink-0 pt-6 border-t border-gray-200 dark:border-zinc-800">
                      <div className="flex gap-3">
                        <button
                          onClick={(e) => {
                            handleAddToCart(e);
                            setIsQuickViewOpen(false);
                          }}
                          disabled={isOutOfStock}
                          className={`w-14 shrink-0 py-3.5 rounded-xl flex items-center justify-center gap-2 font-bold transition-all ${
                            isOutOfStock 
                              ? "bg-gray-100 text-gray-400 dark:bg-zinc-800 dark:text-zinc-500 cursor-not-allowed" 
                              : "bg-pink-50 text-pink-700 hover:bg-pink-100 dark:bg-zinc-800 dark:text-amber-500 dark:hover:bg-zinc-700"
                          }`}
                        >
                          <ShoppingBag size={20} />
                        </button>
                        <button
                          onClick={(e) => {
                            if (isOutOfStock) return;
                            useCartStore.getState().addItem(product);
                            window.location.href = "/keranjang";
                          }}
                          disabled={isOutOfStock}
                          className={`flex-[2] py-3.5 rounded-xl flex items-center justify-center font-bold transition-all ${
                            isOutOfStock 
                              ? "bg-gray-200 text-gray-400 dark:bg-zinc-900 dark:text-zinc-600 dark:border dark:border-zinc-800 cursor-not-allowed"
                              : "bg-pink-950 hover:bg-pink-800 text-white shadow-lg shadow-pink-900/20 dark:bg-amber-500 dark:hover:bg-amber-400 dark:text-zinc-950"
                          }`}
                        >
                          Beli Langsung
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>,
        document.body
      )}

      <div 
        className="p-3 md:p-5 flex flex-col flex-1 relative cursor-pointer"
        onClick={() => setIsQuickViewOpen(true)}
      >
        <div className={`text-[10px] md:text-xs mb-1 ${isDark ? "text-amber-500/70" : "text-gray-500"}`}>{product.category}</div>
        <h3 className={`font-bold text-xs md:text-base mb-1 leading-snug line-clamp-2 ${isDark ? "text-amber-50" : "text-gray-900"}`}>{product.name}</h3>
        <p className={`font-bold mt-auto pt-1 md:pt-2 text-sm md:text-base ${isDark ? "text-amber-500" : "text-pink-700"}`}>
          Rp {product.price.toLocaleString("id-ID")}
        </p>
        
        <div className="relative mt-3 md:mt-4 w-full" onClick={(e) => e.stopPropagation()}>
          {/* Animasi Partikel Terbang */}
          <AnimatePresence>
            {particles.map(p => (
              <motion.div
                key={p.id}
                initial={{ opacity: 1, scale: 0.5, y: 0, x: "50%" }}
                animate={{ 
                  opacity: 0, 
                  scale: [1.2, 1], 
                  y: -200, 
                  x: "150%" 
                }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className={`absolute top-0 right-1/2 pointer-events-none z-50 drop-shadow-md ${isDark ? "text-amber-500" : "text-pink-600"}`}
              >
                <div className={`relative flex items-center justify-center w-8 h-8 rounded-full border ${isDark ? "bg-zinc-800 border-zinc-700" : "bg-pink-100 border-pink-200"}`}>
                  <span className={`text-xs font-bold ${isDark ? "text-amber-500" : "text-pink-700"}`}>+1</span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          <div className="flex gap-1.5 md:gap-2">
            <button
              onClick={handleAddToCart}
              disabled={isOutOfStock}
              className={`flex-none w-8 md:w-auto md:flex-1 py-1.5 md:py-2.5 rounded-md md:rounded-lg flex items-center justify-center gap-2 text-xs md:text-sm font-bold transition-all ${
                added 
                  ? (isDark ? "bg-amber-600 text-white" : "bg-green-500 text-white")
                  : isOutOfStock 
                    ? (isDark ? "bg-zinc-800 text-zinc-500 cursor-not-allowed" : "bg-gray-100 text-gray-400 cursor-not-allowed") 
                    : (isDark ? "bg-zinc-800 text-amber-500 hover:bg-amber-900/50 hover:text-amber-100 border border-zinc-700 hover:border-amber-700" : "bg-pink-50 text-pink-700 hover:bg-pink-600 hover:text-white")
              }`}
              title="Tambah ke Keranjang"
            >
              {added ? <Check size={16} className="md:w-[18px] md:h-[18px]" /> : isOutOfStock ? "Habis" : <Plus size={16} className="md:w-[18px] md:h-[18px]" />}
            </button>
            <button
              onClick={(e) => {
                if (isOutOfStock) return;
                useCartStore.getState().addItem(product);
                window.location.href = "/keranjang";
              }}
              disabled={isOutOfStock}
              className={`flex-1 py-1.5 md:py-2.5 rounded-md md:rounded-lg flex items-center justify-center gap-1 md:gap-2 text-[10px] md:text-sm whitespace-nowrap font-bold transition-all ${
                isOutOfStock 
                  ? (isDark ? "bg-zinc-900 text-zinc-600 border border-zinc-800 cursor-not-allowed" : "bg-gray-200 text-gray-400 cursor-not-allowed")
                  : (isDark ? "bg-amber-500 hover:bg-amber-400 text-zinc-950" : "bg-pink-950 hover:bg-pink-800 text-white shadow-md shadow-pink-900/20")
              }`}
            >
              Beli Langsung
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
