"use client";

import { Product } from "@prisma/client";
import { useCartStore } from "@/store/useCartStore";
import { Plus, Check } from "lucide-react";
import { useState } from "react";

export function ProductCard({ product }: { product: Product }) {
  const addItem = useCartStore(state => state.addItem);
  const [added, setAdded] = useState(false);

  const handleAddToCart = () => {
    if (product.current_stock <= 0) return;
    
    addItem(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const isOutOfStock = product.current_stock <= 0;

  return (
    <div className="group bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col h-full transition-all hover:shadow-md hover:border-pink-200">
      <div className="aspect-[4/5] bg-gray-100 relative overflow-hidden flex items-center justify-center">
        {/* Placeholder image */}
        {product.image_url ? (
          <img 
            src={product.image_url} 
            alt={product.name} 
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full bg-pink-50/50 flex flex-col items-center justify-center text-pink-200">
            <span className="font-serif text-2xl font-bold opacity-30">ALETTA</span>
            <span className="text-sm font-medium tracking-widest opacity-30 mt-1">SCARF</span>
          </div>
        )}
        
        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
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

      <div className="p-5 flex flex-col flex-1">
        <div className="text-xs text-gray-500 mb-1">{product.category}</div>
        <h3 className="font-bold text-gray-900 mb-1 leading-snug line-clamp-2">{product.name}</h3>
        <p className="font-medium text-pink-700 mt-auto pt-2">
          Rp {product.price.toLocaleString("id-ID")}
        </p>
        
        <button
          onClick={handleAddToCart}
          disabled={isOutOfStock}
          className={`mt-4 w-full py-2.5 rounded-lg flex items-center justify-center gap-2 text-sm font-medium transition-all ${
            added 
              ? "bg-green-500 text-white" 
              : isOutOfStock 
                ? "bg-gray-100 text-gray-400 cursor-not-allowed" 
                : "bg-pink-50 text-pink-700 hover:bg-pink-600 hover:text-white"
          }`}
        >
          {added ? (
            <><Check size={18} /> Ditambahkan</>
          ) : isOutOfStock ? (
            "Stok Habis"
          ) : (
            <><Plus size={18} /> Tambah ke Keranjang</>
          )}
        </button>
      </div>
    </div>
  );
}
