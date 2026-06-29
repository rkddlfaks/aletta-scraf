"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Package, LogOut, Menu, X, MessageSquareHeart, Settings } from "lucide-react";
import { useState, useEffect } from "react";
import { signOut } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";

export function AdminNavbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  const handleLogout = async () => {
    await signOut({ callbackUrl: "/admin/login" });
  };

  const navItems = [
    { href: "/admin/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { href: "/admin/pesanan", icon: Package, label: "Pesanan Masuk" },
    { href: "/admin/produk", icon: Package, label: "Katalog Produk" },
    { href: "/admin/ulasan", icon: MessageSquareHeart, label: "Ulasan Pelanggan" },
    { href: "/admin/pengaturan", icon: Settings, label: "Pengaturan" },
  ];

  // Auto-close menu when route changes (for mobile/burger menu)
  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  return (
    <>
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo & Brand */}
            <div className="flex items-center gap-3">
              <img src="/logo.svg" alt="Aletta Scarf" className="h-10 w-10 drop-shadow-sm" />
              <div>
                <h2 className="text-xl font-serif font-bold text-pink-900 leading-tight">Aletta Scarf</h2>
                <p className="text-xs text-pink-600/80 font-bold uppercase tracking-wider">Admin Panel</p>
              </div>
            </div>

            {/* Desktop Navigation (Direct Links) */}
            <nav className="hidden xl:flex items-center gap-2">
              {navItems.map((item) => {
                const isActive = pathname.startsWith(item.href);
                return (
                  <Link 
                    key={item.href}
                    href={item.href} 
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-full transition-all ${
                      isActive 
                        ? 'bg-pink-50 text-pink-700 font-bold shadow-sm border border-pink-100' 
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 font-medium border border-transparent'
                    }`}
                  >
                    <item.icon size={18} className={isActive ? 'text-pink-600' : 'text-gray-400'} />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
              
              <div className="h-8 w-px bg-gray-200 mx-2"></div>
              
              <button 
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2.5 text-red-600 rounded-full hover:bg-red-50 transition-colors font-bold border border-transparent hover:border-red-100"
              >
                <LogOut size={18} />
                <span>Logout</span>
              </button>
            </nav>

            {/* Burger Menu Button (Mobile & Desktop Fallback) */}
            <div className="xl:hidden flex items-center">
              <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 -mr-2 text-gray-600 hover:text-pink-600 hover:bg-pink-50 rounded-lg transition-colors"
              >
                {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Fullscreen Burger Menu Overlay (Mobile & Tablet) */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMenuOpen(false)}
              className="xl:hidden fixed inset-0 bg-black/20 z-40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="xl:hidden fixed top-20 left-0 right-0 bg-white border-b border-gray-200 shadow-xl z-50 rounded-b-3xl overflow-hidden"
            >
              <nav className="p-4 flex flex-col gap-2">
                {navItems.map((item) => {
                  const isActive = pathname.startsWith(item.href);
                  return (
                    <Link 
                      key={item.href}
                      href={item.href} 
                      className={`flex items-center gap-4 px-6 py-4 rounded-2xl transition-all text-lg ${
                        isActive 
                          ? 'bg-gradient-to-r from-pink-50 to-rose-50 text-pink-700 font-bold border border-pink-100' 
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 font-medium border border-transparent'
                      }`}
                    >
                      <item.icon size={24} className={isActive ? 'text-pink-600' : 'text-gray-400'} />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
                
                <div className="h-px bg-gray-100 my-2 mx-4"></div>
                
                <button 
                  onClick={handleLogout}
                  className="flex items-center gap-4 px-6 py-4 text-red-600 rounded-2xl hover:bg-red-50 transition-colors font-bold text-lg text-left"
                >
                  <LogOut size={24} />
                  <span>Logout Keluar</span>
                </button>
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
