import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-pink-900 text-pink-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-2xl font-serif font-bold mb-4">Aletta Scarf</h3>
            <p className="text-pink-100/80 text-sm max-w-xs">
              Hijab medis premium dengan inovasi lubang telinga. Dirancang khusus untuk kenyamanan tenaga kesehatan muslimah.
            </p>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Tautan Cepat</h4>
            <ul className="space-y-2 text-sm text-pink-100/80">
              <li><Link href="/" className="hover:text-white transition-colors">Beranda</Link></li>
              <li><Link href="/produk" className="hover:text-white transition-colors">Koleksi Lengkap</Link></li>
              <li><Link href="/keranjang" className="hover:text-white transition-colors">Keranjang Belanja</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Hubungi Kami</h4>
            <ul className="space-y-2 text-sm text-pink-100/80">
              <li>Yogyakarta, Indonesia</li>
              <li>Instagram: @alettascarf</li>
              <li>Tersedia pengiriman ke seluruh Indonesia</li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-pink-800 mt-12 pt-8 text-center text-sm text-pink-100/60">
          <p>&copy; {new Date().getFullYear()} Aletta Scarf. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
