"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Package, ShoppingCart, LogOut, ChevronLeft, ChevronRight, Menu, X, MessageSquareHeart } from "lucide-react";
import { useState, useEffect } from "react";
import { signOut } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";

export function AdminSidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const pathname = usePathname();

  const handleLogout = async () => {
    await signOut({ callbackUrl: "/admin/login" });
  };

  const navItems = [
    { href: "/admin/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { href: "/admin/produk", icon: Package, label: "Produk" },
    { href: "/admin/pesanan", icon: ShoppingCart, label: "Pesanan" },
    { href: "/admin/ulasan", icon: MessageSquareHeart, label: "Ulasan" },
  ];

  // Close mobile sidebar on route change
  useEffect(() => {
    setIsMobileOpen(false);
  }, [pathname]);

  return (
    <>
      {/* Mobile Top Bar */}
      <div className="md:hidden bg-white border-b border-gray-200 p-4 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <img src="/logo.svg" alt="Aletta Scarf" className="h-8 w-8 drop-shadow-sm" />
          <h2 className="text-lg font-serif font-bold text-pink-900 leading-tight">Admin</h2>
        </div>
        <button 
          onClick={() => setIsMobileOpen(true)}
          className="p-2 text-gray-600 hover:text-pink-600 transition-colors"
        >
          <Menu size={24} />
        </button>
      </div>

      {/* Mobile Overlay */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsMobileOpen(false)}
            className="md:hidden fixed inset-0 bg-black/50 z-40"
          />
        )}
      </AnimatePresence>

      <motion.aside 
        initial={false}
        animate={{ width: isCollapsed ? 80 : 256 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className={`bg-white border-r border-gray-100 shadow-sm flex flex-col relative shrink-0 z-50 min-h-screen 
          fixed md:sticky top-0 left-0 h-screen transition-transform duration-300 ease-in-out
          ${isMobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}
      >
        {/* Mobile Close Button */}
        <button 
          onClick={() => setIsMobileOpen(false)}
          className="md:hidden absolute right-4 top-6 p-2 text-gray-400 hover:text-pink-600"
        >
          <X size={24} />
        </button>

        {/* Desktop Toggle Button */}
        <button 
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="hidden md:block absolute -right-3.5 top-9 bg-white border border-gray-200 text-gray-400 rounded-full p-1.5 shadow-md hover:text-pink-600 hover:border-pink-300 transition-colors z-30"
        >
          {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>

        {/* Header */}
        <div className={`p-6 border-b border-gray-100 flex items-center ${isCollapsed ? 'justify-center hidden md:flex' : 'gap-3'} h-[96px] transition-all`}>
          <img src="/logo.svg" alt="Aletta Scarf" className={`h-10 w-10 shrink-0 drop-shadow-sm ${isCollapsed ? 'hidden md:block' : ''}`} />
          <AnimatePresence>
            {!isCollapsed && (
              <motion.div 
                initial={{ opacity: 0, width: 0 }} 
                animate={{ opacity: 1, width: "auto" }} 
                exit={{ opacity: 0, width: 0 }}
                className="overflow-hidden whitespace-nowrap"
              >
                <h2 className="text-xl font-serif font-bold text-pink-900 leading-tight mt-1">Aletta Scarf</h2>
                <p className="text-xs text-pink-600/70 font-semibold uppercase tracking-wider mt-0.5">Admin Panel</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        
        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2 overflow-hidden mt-2">
          {navItems.map((item) => {
            const isActive = pathname.startsWith(item.href);
            return (
              <Link 
                key={item.href}
                href={item.href} 
                className={`flex items-center gap-3 px-4 py-3 rounded-2xl transition-all ${
                  isActive 
                    ? 'bg-gradient-to-r from-pink-50 to-rose-50 text-pink-700 font-bold shadow-sm border border-pink-100/50' 
                    : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900 font-medium border border-transparent'
                } ${isCollapsed ? 'md:justify-center md:px-0' : ''}`}
                title={isCollapsed ? item.label : undefined}
              >
                <item.icon size={22} className={`${isActive ? 'text-pink-600' : 'text-gray-400'} shrink-0`} />
                <AnimatePresence>
                  {!isCollapsed && (
                    <motion.span 
                      initial={{ opacity: 0 }} 
                      animate={{ opacity: 1 }} 
                      exit={{ opacity: 0 }}
                      className="whitespace-nowrap"
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>
              </Link>
            );
          })}
        </nav>

        {/* Footer / Logout */}
        <div className="p-4 border-t border-gray-100">
          <button 
            onClick={handleLogout}
            className={`flex w-full items-center gap-3 px-4 py-3 text-red-600 rounded-2xl hover:bg-red-50 transition-colors font-bold border border-transparent hover:border-red-100 ${isCollapsed ? 'md:justify-center md:px-0' : ''}`}
            title={isCollapsed ? "Logout" : undefined}
          >
            <LogOut size={22} className="shrink-0" />
            <AnimatePresence>
              {!isCollapsed && (
                <motion.span 
                  initial={{ opacity: 0 }} 
                  animate={{ opacity: 1 }} 
                  exit={{ opacity: 0 }}
                  className="whitespace-nowrap"
                >
                  Logout
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        </div>
      </motion.aside>
    </>
  );
}
