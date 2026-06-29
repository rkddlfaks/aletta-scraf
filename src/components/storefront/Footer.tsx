"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function Footer() {
  const pathname = usePathname();
  const isDark = pathname?.startsWith('/mukena');

  return (
    <footer className={`${isDark ? 'bg-zinc-950 text-amber-50' : 'bg-pink-900 text-pink-50'} transition-colors duration-500`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className={`text-2xl font-serif font-bold mb-4 ${isDark ? 'text-amber-500' : ''}`}>
              {isDark ? "Rizki Berlian's" : "Aletta Scarf"}
            </h3>
            <p className={`text-sm max-w-xs ${isDark ? 'text-amber-100/60' : 'text-pink-100/80'}`}>
              {isDark 
                ? "Koleksi mukena premium eksklusif untuk kenyamanan beribadah Anda." 
                : "Hijab medis premium dengan inovasi lubang telinga. Dirancang khusus untuk kenyamanan tenaga kesehatan muslimah."}
            </p>
          </div>
          
          <div>
            <h4 className={`text-lg font-semibold mb-4 ${isDark ? 'text-amber-200' : ''}`}>Tautan Cepat</h4>
            <ul className={`space-y-2 text-sm ${isDark ? 'text-amber-100/60' : 'text-pink-100/80'}`}>
              <li><Link href="/" className={`transition-colors ${isDark ? 'hover:text-amber-400' : 'hover:text-white'}`}>Beranda</Link></li>
              <li><Link href="/produk" className={`transition-colors ${isDark ? 'hover:text-amber-400' : 'hover:text-white'}`}>Koleksi Scarf</Link></li>
              <li><Link href="/mukena" className={`transition-colors ${isDark ? 'hover:text-amber-400' : 'hover:text-white'}`}>Koleksi Mukena</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className={`text-lg font-semibold mb-4 ${isDark ? 'text-amber-200' : ''}`}>Hubungi Kami</h4>
            <ul className={`space-y-2 text-sm ${isDark ? 'text-amber-100/60' : 'text-pink-100/80'}`}>
              <li>Yogyakarta, Indonesia</li>
              <li>Instagram: {isDark ? "@rizkiberlian" : "@alettascarf"}</li>
              <li>Tersedia pengiriman ke seluruh Indonesia</li>
            </ul>
          </div>
        </div>
        
        <div className={`border-t mt-12 pt-8 text-center text-sm ${isDark ? 'border-zinc-800 text-amber-100/40' : 'border-pink-800 text-pink-100/60'}`}>
          <p>&copy; {new Date().getFullYear()} {isDark ? "Rizki Berlian's" : "Aletta Scarf"}. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
