"use client";

import { useState } from "react";
import Link from "next/link";
import { Filter, ChevronDown } from "lucide-react";

interface ProductFilterProps {
  currentCategory: string;
  currentSort: string;
  categories: string[];
  basePath?: string;
  theme?: "light" | "dark";
}

export function ProductFilter({ currentCategory, currentSort, categories, basePath = "/produk", theme = "light" }: ProductFilterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const isDark = theme === "dark";

  return (
    <div className={`w-full md:w-64 shrink-0 rounded-2xl md:bg-white md:shadow-sm md:border ${isDark ? "md:bg-zinc-900 md:border-zinc-800" : "md:bg-white md:border-gray-100"} overflow-hidden h-fit sticky top-24`}>
      {/* Mobile Toggle */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between p-4 md:hidden rounded-xl border ${isDark ? "bg-zinc-900 border-zinc-800 text-amber-50" : "bg-white border-gray-200 text-gray-900"} font-bold`}
      >
        <span className="flex items-center gap-2">
          <Filter size={18} className={isDark ? "text-amber-500" : "text-pink-600"} />
          Filter
        </span>
          <ChevronDown 
            size={18} 
            className={`text-gray-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} 
          />
        </button>

        {/* Desktop Header */}
        <div className={`hidden md:flex items-center gap-2 p-5 pb-4 font-semibold border-b ${isDark ? "text-amber-50 border-zinc-800" : "text-gray-900 border-gray-100"}`}>
          <Filter size={18} className={isDark ? "text-amber-500" : "text-pink-600"} /> Filter
        </div>
        
        {/* Filter Content */}
        <div className={`${isOpen ? 'block' : 'hidden'} md:block px-5 pb-5 pt-2 md:pt-5 space-y-6 border-t md:border-t-0 ${isDark ? "border-zinc-800" : "border-gray-100"}`}>
          {categories.length > 0 && (
            <div>
              <h3 className={`text-sm font-bold mb-3 uppercase tracking-wider ${isDark ? "text-amber-500/70" : "text-gray-900"}`}>Kategori</h3>
              <div className="space-y-1.5">
                {categories.map(cat => (
                  <Link 
                    key={cat} 
                    href={`${basePath}?category=${cat}&sort=${currentSort}`}
                    onClick={() => setIsOpen(false)}
                    className={`block text-sm py-1.5 px-2 rounded-lg transition-colors ${
                      currentCategory === cat 
                        ? (isDark ? "bg-amber-900/40 text-amber-500 font-bold" : "bg-pink-50 text-pink-700 font-bold")
                        : (isDark ? "text-gray-400 hover:bg-zinc-800 hover:text-amber-500 font-medium" : "text-gray-600 hover:bg-gray-50 hover:text-pink-600 font-medium")
                    }`}
                  >
                    {cat}
                  </Link>
                ))}
              </div>
            </div>
          )}

          {categories.length > 0 && <div className={`h-px w-full my-4 ${isDark ? "bg-zinc-800" : "bg-gray-100"}`}></div>}

          <div>
            <h3 className={`text-sm font-bold mb-3 uppercase tracking-wider ${isDark ? "text-amber-500/70" : "text-gray-900"}`}>Urutkan</h3>
            <div className="space-y-1.5">
              {[
                { value: 'newest', label: 'Terbaru' },
                { value: 'bestseller', label: 'Terlaris' },
                { value: 'price-asc', label: 'Harga: Rendah ke Tinggi' },
                { value: 'price-desc', label: 'Harga: Tinggi ke Rendah' }
              ].map(sortOption => (
                <Link 
                  key={sortOption.value}
                  href={`${basePath}?category=${currentCategory}&sort=${sortOption.value}`}
                  onClick={() => setIsOpen(false)}
                  className={`block text-sm py-1.5 px-2 rounded-lg transition-colors ${
                    currentSort === sortOption.value 
                      ? (isDark ? "bg-amber-900/40 text-amber-500 font-bold" : "bg-pink-50 text-pink-700 font-bold")
                      : (isDark ? "text-gray-400 hover:bg-zinc-800 hover:text-amber-500 font-medium" : "text-gray-600 hover:bg-gray-50 hover:text-pink-600 font-medium")
                  }`}
                >
                  {sortOption.label}
                </Link>
              ))}
            </div>
          </div>
        </div>

    </div>
  );
}
