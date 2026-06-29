"use client";

import Link from "next/link";
import { ShoppingBag, Menu, X } from "lucide-react";
import { useCartStore } from "@/store/useCartStore";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";

const NavLink = ({ href, children, isDark }: { href: string; children: React.ReactNode, isDark: boolean }) => {
  return (
    <Link href={href} className={`relative transition-colors font-medium group py-2 px-1 outline-none [-webkit-tap-highlight-color:transparent] ${isDark ? 'text-amber-100 hover:text-amber-500' : 'text-gray-600 hover:text-pink-700'}`}>
      {children}
      <span className={`absolute left-0 bottom-0 w-full h-[2px] rounded-full scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-center ${isDark ? 'bg-amber-500' : 'bg-pink-400'}`} />
    </Link>
  );
};

export function Navbar() {
  const pathname = usePathname();
  const isDark = pathname?.startsWith('/mukena');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const totalItems = useCartStore((state) => state.items.reduce((acc, item) => acc + item.quantity, 0));
  
  useEffect(() => {
    setMounted(true);
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header 
      className={`fixed z-50 left-0 right-0 transition-all duration-500 ease-out ${
        isScrolled 
          ? `top-4 mx-4 md:mx-auto md:w-[95%] lg:w-[90%] rounded-full backdrop-blur-2xl backdrop-saturate-150 border shadow-[0_8px_32px_rgba(0,0,0,0.1)] ${isDark ? 'bg-zinc-900/60 border-zinc-700' : 'bg-white/40 border-white/60 shadow-[0_8px_32px_rgba(255,192,203,0.2)]'}` 
          : `top-6 mx-4 md:mx-auto md:w-[95%] lg:w-[90%] rounded-full backdrop-blur-sm border shadow-sm ${isDark ? 'bg-zinc-950/80 border-zinc-800' : 'bg-white/95 border-pink-100'}`
      }`}
    >
      <div className="px-6 md:px-10 transition-all duration-500">
        <div className={`flex items-center justify-between transition-all duration-500 ${isScrolled ? "h-16 md:h-20" : "h-20 md:h-24"}`}>
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-4">
              <img src="/logo.svg" alt="Aletta Scarf Logo" className="h-12 w-12 drop-shadow-sm" />
              <span className={`text-2xl md:text-3xl font-serif font-bold tracking-tight hidden sm:block drop-shadow-sm ${isDark ? 'text-amber-500' : 'text-pink-900'}`}>
                Aletta Scarf
              </span>
            </Link>
          </div>
          
          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-12">
            <NavLink href="/" isDark={isDark}>Beranda</NavLink>
            <NavLink href="/produk" isDark={isDark}>Koleksi Scarf</NavLink>
            <NavLink href="/mukena" isDark={isDark}>Koleksi Mukena</NavLink>
            <NavLink href="/lacak-pesanan" isDark={isDark}>Lacak Pesanan</NavLink>
          </nav>

          <div className="flex items-center gap-6">
            <button 
              onClick={() => useCartStore.getState().toggleCart()} 
              className={`relative p-2 transition-colors group outline-none ${isDark ? 'text-amber-500 hover:text-amber-400' : 'text-pink-900 hover:text-pink-700'}`}
            >
              <motion.div
                key={mounted ? totalItems : 0}
                initial={{ scale: 1 }}
                animate={{ scale: [1, 1.3, 0.9, 1.1, 1], rotate: [0, -10, 10, -5, 0] }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
              >
                <ShoppingBag size={26} className={`transition-all drop-shadow-sm ${isDark ? 'group-hover:fill-amber-500/20' : 'group-hover:fill-pink-700'}`} />
              </motion.div>

              {mounted && totalItems > 0 && (
                <motion.span 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className={`absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-[10px] font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 rounded-full shadow-md ${isDark ? 'bg-amber-600' : 'bg-pink-600'}`}
                >
                  {totalItems}
                </motion.span>
              )}
            </button>
            
            <button 
              className={`md:hidden p-2 transition-colors drop-shadow-sm ${isDark ? 'text-amber-500 hover:text-amber-400' : 'text-pink-900 hover:text-pink-700'}`}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={isMenuOpen ? "close" : "open"}
                  initial={{ opacity: 0, rotate: -90 }}
                  animate={{ opacity: 1, rotate: 0 }}
                  exit={{ opacity: 0, rotate: 90 }}
                  transition={{ duration: 0.2 }}
                >
                  {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
                </motion.div>
              </AnimatePresence>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className={`absolute top-full left-0 right-0 mt-3 backdrop-blur-3xl border rounded-2xl md:hidden overflow-hidden z-50 ${
              isDark ? 'bg-zinc-900/95 border-zinc-700 shadow-xl' : 'bg-white/95 border-white/60 shadow-[0_8px_32px_rgba(0,0,0,0.08),inset_0_1px_1px_rgba(255,255,255,0.8)]'
            }`}
          >
            <div className="px-4 py-4 space-y-2">
              <Link 
                href="/" 
                className={`block px-4 py-3 rounded-xl text-base font-bold transition-colors outline-none [-webkit-tap-highlight-color:transparent] ${isDark ? 'text-amber-500 hover:text-amber-400 hover:bg-zinc-800' : 'text-pink-900 hover:text-pink-700 hover:bg-white/60'}`}
                onClick={() => setIsMenuOpen(false)}
              >
                Beranda
              </Link>
              <Link 
                href="/produk" 
                className={`block px-4 py-3 rounded-xl text-base font-bold transition-colors outline-none [-webkit-tap-highlight-color:transparent] ${isDark ? 'text-amber-500 hover:text-amber-400 hover:bg-zinc-800' : 'text-pink-900 hover:text-pink-700 hover:bg-white/60'}`}
                onClick={() => setIsMenuOpen(false)}
              >
                Koleksi Scarf
              </Link>
              <Link 
                href="/mukena" 
                className={`block px-4 py-3 rounded-xl text-base font-bold transition-colors outline-none [-webkit-tap-highlight-color:transparent] ${isDark ? 'text-amber-500 hover:text-amber-400 hover:bg-zinc-800' : 'text-pink-900 hover:text-pink-700 hover:bg-white/60'}`}
                onClick={() => setIsMenuOpen(false)}
              >
                Koleksi Mukena
              </Link>
              <Link 
                href="/lacak-pesanan" 
                className={`block px-4 py-3 rounded-xl text-base font-bold transition-colors outline-none [-webkit-tap-highlight-color:transparent] ${isDark ? 'text-amber-500 hover:text-amber-400 hover:bg-zinc-800' : 'text-pink-900 hover:text-pink-700 hover:bg-white/60'}`}
                onClick={() => setIsMenuOpen(false)}
              >
                Lacak Pesanan
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
