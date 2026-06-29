"use client";

import Link from "next/link";
import { ShoppingBag, Menu, X } from "lucide-react";
import { useCartStore } from "@/store/useCartStore";
import { useState, useEffect } from "react";

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const getTotalItems = useCartStore((state) => state.getTotalItems);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-pink-100">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="text-2xl font-serif font-bold text-pink-900 tracking-tight">
              Aletta Scarf
            </Link>
          </div>
          
          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            <Link href="/" className="text-gray-600 hover:text-pink-700 transition-colors font-medium">Beranda</Link>
            <Link href="/produk" className="text-gray-600 hover:text-pink-700 transition-colors font-medium">Koleksi</Link>
          </nav>

          <div className="flex items-center gap-4">
            <Link href="/keranjang" className="relative p-2 text-gray-600 hover:text-pink-700 transition-colors group">
              <ShoppingBag size={24} className="group-hover:fill-pink-50 transition-all" />
              {mounted && getTotalItems() > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-pink-600 rounded-full">
                  {getTotalItems()}
                </span>
              )}
            </Link>
            
            <button 
              className="md:hidden p-2 text-gray-600"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-b border-pink-100">
          <div className="px-4 pt-2 pb-4 space-y-1">
            <Link 
              href="/" 
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-pink-700 hover:bg-pink-50"
              onClick={() => setIsMenuOpen(false)}
            >
              Beranda
            </Link>
            <Link 
              href="/produk" 
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-pink-700 hover:bg-pink-50"
              onClick={() => setIsMenuOpen(false)}
            >
              Koleksi
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
