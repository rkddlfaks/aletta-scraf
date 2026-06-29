import { prisma } from "@/lib/prisma";
import { formatCurrency } from "@/lib/utils";
import Link from "next/link";
import { Package, AlertTriangle, Layers, TrendingUp, ShoppingBag, ArrowRight, Wallet, Clock } from "lucide-react";

export default async function DashboardPage() {
  // Fetch stats
  const totalProducts = await prisma.product.count();
  const allProducts = await prisma.product.findMany({
    orderBy: { created_at: "desc" }
  });
  
  const totalStock = allProducts.reduce((sum, p) => sum + p.current_stock, 0);
  
  // Products per category
  const categories = allProducts.reduce((acc, p) => {
    acc[p.category] = (acc[p.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Low stock products
  const lowStockProducts = allProducts.filter(p => p.current_stock <= p.min_stock);

  // Fetch Orders for Revenue & Status
  const allOrders = await prisma.order.findMany({
    include: { items: true }
  });
  
  const successfulOrders = allOrders.filter(o => 
    ["PAID", "PROCESSING", "SHIPPED", "COMPLETED"].includes(o.status)
  );

  // Calculate Revenue (only from PAID, SHIPPED, COMPLETED)
  const revenue = successfulOrders.reduce((sum, o) => sum + o.total_amount, 0);

  // Calculate Total Cost (Modal)
  const totalCost = successfulOrders.reduce((sum, o) => {
    const orderCost = o.items.reduce((itemSum, item) => itemSum + (item.cost * item.quantity), 0);
    return sum + orderCost;
  }, 0);

  // Calculate Profit (Laba Kotor)
  const profit = revenue - totalCost;

  // Active Orders (Need Attention)
  const activeOrders = allOrders.filter(o => ["PENDING", "PAID", "PROCESSING"].includes(o.status));

  return (
    <div className="space-y-8 pb-10">
      {/* Header Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-pink-600 to-rose-500 rounded-[2.5rem] p-8 sm:p-12 text-white shadow-lg">
        {/* Abstract Blobs for Banner */}
        <div className="absolute top-[-50%] right-[-10%] w-[300px] h-[300px] bg-white/20 rounded-full blur-3xl mix-blend-overlay pointer-events-none"></div>
        <div className="absolute bottom-[-50%] left-[-10%] w-[300px] h-[300px] bg-pink-300/30 rounded-full blur-3xl mix-blend-overlay pointer-events-none"></div>
        
        <div className="relative z-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
          <div>
            <h1 className="text-4xl sm:text-5xl font-serif font-bold tracking-tight mb-2">Selamat Datang!</h1>
            <p className="text-pink-100 text-lg max-w-lg leading-relaxed">
              Pantau pergerakan stok, kelola pesanan, dan lihat ringkasan laba penjualan butik Aletta Scarf Anda hari ini.
            </p>
          </div>
          <Link href="/admin/pesanan" className="bg-white text-pink-600 hover:bg-pink-50 px-6 py-3.5 rounded-full font-bold shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex items-center gap-2 whitespace-nowrap">
            <Package size={20} /> Kelola Pesanan
          </Link>
        </div>
      </div>

      {/* Stats Cards (Carousel on Mobile) */}
      <div className="flex overflow-x-auto sm:grid sm:grid-cols-2 lg:grid-cols-5 gap-4 pb-4 sm:pb-0 snap-x snap-mandatory [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] -mx-4 px-4 sm:mx-0 sm:px-0">
        <div className="snap-center shrink-0 w-[85vw] sm:w-auto bg-white rounded-[2rem] p-5 border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgba(219,39,119,0.08)] transition-all duration-300 group cursor-default">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-br from-green-100 to-green-50 rounded-2xl text-green-600 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300 shadow-inner">
              <Wallet size={24} />
            </div>
            <div>
              <p className="text-[10px] sm:text-xs font-bold text-gray-400 uppercase tracking-wider mb-0.5">Omzet Penjualan</p>
              <h3 className="text-xl font-black text-gray-900">Rp {(revenue / 1000000).toFixed(1)}<span className="text-xs font-semibold text-gray-400">Jt</span></h3>
            </div>
          </div>
        </div>

        <div className="snap-center shrink-0 w-[85vw] sm:w-auto bg-white rounded-[2rem] p-5 border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgba(16,185,129,0.08)] transition-all duration-300 group cursor-default">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-br from-emerald-100 to-emerald-50 rounded-2xl text-emerald-600 group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-300 shadow-inner">
              <TrendingUp size={24} />
            </div>
            <div>
              <p className="text-[10px] sm:text-xs font-bold text-gray-400 uppercase tracking-wider mb-0.5">Laba Kotor</p>
              <h3 className="text-xl font-black text-gray-900">Rp {(profit / 1000000).toFixed(1)}<span className="text-xs font-semibold text-gray-400">Jt</span></h3>
            </div>
          </div>
        </div>

        <div className="snap-center shrink-0 w-[85vw] sm:w-auto bg-white rounded-[2rem] p-5 border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgba(219,39,119,0.08)] transition-all duration-300 group cursor-default">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-br from-amber-100 to-amber-50 rounded-2xl text-amber-600 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300 shadow-inner">
              <Clock size={24} />
            </div>
            <div>
              <p className="text-[10px] sm:text-xs font-bold text-gray-400 uppercase tracking-wider mb-0.5">Pesanan Aktif</p>
              <h3 className="text-xl font-black text-gray-900">{activeOrders.length} <span className="text-xs font-semibold text-gray-400">antrean</span></h3>
            </div>
          </div>
        </div>

        <div className="snap-center shrink-0 w-[85vw] sm:w-auto bg-white rounded-[2rem] p-5 border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgba(219,39,119,0.08)] transition-all duration-300 group cursor-default">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-br from-pink-100 to-pink-50 rounded-2xl text-pink-600 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300 shadow-inner">
              <ShoppingBag size={24} />
            </div>
            <div>
              <p className="text-[10px] sm:text-xs font-bold text-gray-400 uppercase tracking-wider mb-0.5">Total Produk</p>
              <h3 className="text-xl font-black text-gray-900">{totalProducts} <span className="text-xs font-semibold text-gray-400">item</span></h3>
            </div>
          </div>
        </div>
        
        <div className="snap-center shrink-0 w-[85vw] sm:w-auto bg-white rounded-[2rem] p-5 border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgba(239,68,68,0.08)] transition-all duration-300 group cursor-default">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-br from-red-100 to-red-50 rounded-2xl text-red-600 group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-300 shadow-inner">
              <AlertTriangle size={24} />
            </div>
            <div>
              <p className="text-[10px] sm:text-xs font-bold text-gray-400 uppercase tracking-wider mb-0.5">Stok Menipis</p>
              <h3 className="text-xl font-black text-red-600">{lowStockProducts.length} <span className="text-xs font-semibold text-red-400">peringatan</span></h3>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* To-Do List Section (Foolproof UX) */}
        <div className="lg:col-span-12 bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
          <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
            <span className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 shadow-inner">
              <span className="font-black text-lg">!</span>
            </span>
            Tugas Hari Ini
          </h3>
          
          <div className="flex overflow-x-auto md:grid md:grid-cols-3 gap-4 pb-4 md:pb-0 snap-x snap-mandatory [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] -mx-4 px-4 md:mx-0 md:px-0">
            {/* Task 1: Pending */}
            <Link 
              href="/admin/pesanan?status=PENDING" 
              className="snap-center shrink-0 w-[85vw] md:w-auto group relative overflow-hidden bg-amber-50 rounded-2xl p-5 border border-amber-100 hover:border-amber-300 transition-colors"
            >
              <div className="flex justify-between items-start mb-2">
                <div className="p-2 bg-white rounded-xl text-amber-600 shadow-sm"><Clock size={20} /></div>
                <div className="bg-amber-200 text-amber-800 text-xs font-bold px-2 py-1 rounded-md">Menunggu Transfer</div>
              </div>
              <h4 className="font-bold text-gray-900 text-lg mt-3">Follow-up Pembayaran</h4>
              <p className="text-sm text-gray-600 mt-1">Ada <span className="font-bold text-amber-600">{allOrders.filter(o => o.status === "PENDING").length} pesanan</span> yang belum dibayar.</p>
              <div className="mt-4 flex items-center gap-1 text-sm font-bold text-amber-600 group-hover:translate-x-1 transition-transform">
                Proses Sekarang <ArrowRight size={16} />
              </div>
            </Link>

            {/* Task 2: Paid */}
            <Link 
              href="/admin/pesanan?status=PAID" 
              className="snap-center shrink-0 w-[85vw] md:w-auto group relative overflow-hidden bg-green-50 rounded-2xl p-5 border border-green-100 hover:border-green-300 transition-colors"
            >
              <div className="flex justify-between items-start mb-2">
                <div className="p-2 bg-white rounded-xl text-green-600 shadow-sm"><Package size={20} /></div>
                <div className="bg-green-200 text-green-800 text-xs font-bold px-2 py-1 rounded-md">Siap Kirim</div>
              </div>
              <h4 className="font-bold text-gray-900 text-lg mt-3">Packing Barang</h4>
              <p className="text-sm text-gray-600 mt-1">Ada <span className="font-bold text-green-600">{allOrders.filter(o => o.status === "PAID").length} pesanan</span> lunas yang harus dipacking.</p>
              <div className="mt-4 flex items-center gap-1 text-sm font-bold text-green-600 group-hover:translate-x-1 transition-transform">
                Proses Sekarang <ArrowRight size={16} />
              </div>
            </Link>

            {/* Task 3: Low Stock */}
            <Link 
              href="/admin/produk?stock=low" 
              className="snap-center shrink-0 w-[85vw] md:w-auto group relative overflow-hidden bg-red-50 rounded-2xl p-5 border border-red-100 hover:border-red-300 transition-colors"
            >
              <div className="flex justify-between items-start mb-2">
                <div className="p-2 bg-white rounded-xl text-red-600 shadow-sm"><AlertTriangle size={20} /></div>
                <div className="bg-red-200 text-red-800 text-xs font-bold px-2 py-1 rounded-md">Stok Habis</div>
              </div>
              <h4 className="font-bold text-gray-900 text-lg mt-3">Cek Gudang</h4>
              <p className="text-sm text-gray-600 mt-1">Ada <span className="font-bold text-red-600">{lowStockProducts.length} produk</span> yang stoknya menipis.</p>
              <div className="mt-4 flex items-center gap-1 text-sm font-bold text-red-600 group-hover:translate-x-1 transition-transform">
                Cek Sekarang <ArrowRight size={16} />
              </div>
            </Link>
          </div>
        </div>
        
        {/* Low Stock Alerts (Bigger emphasis) */}
        <div className="lg:col-span-7 bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-red-50 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none"></div>
          
          <div className="flex justify-between items-center mb-8 relative z-10">
            {lowStockProducts.length > 0 ? (
              <h3 className="text-xl font-bold text-gray-900 flex items-center gap-3">
                <span className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-red-600 shadow-inner"><AlertTriangle size={18} /></span>
                Perhatian: Stok Menipis
              </h3>
            ) : (
              <h3 className="text-xl font-bold text-gray-900 flex items-center gap-3">
                <span className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600 shadow-inner"><Package size={18} /></span>
                Status Stok Gudang
              </h3>
            )}
            <Link href="/admin/produk" className="text-sm font-bold text-pink-600 hover:text-pink-700 bg-pink-50 hover:bg-pink-100 px-4 py-2 rounded-full flex items-center gap-1 transition-colors">
              Lihat Semua <ArrowRight size={16} />
            </Link>
          </div>

          {lowStockProducts.length > 0 ? (
            <div className="space-y-4 relative z-10">
              {lowStockProducts.map(p => (
                <div key={p.id} className="group flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-gray-50/80 hover:bg-red-50/50 rounded-2xl border border-gray-100 hover:border-red-100 transition-colors gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-white rounded-xl border border-gray-200 shadow-sm flex items-center justify-center overflow-hidden shrink-0">
                      {p.image_url ? (
                        <img src={p.image_url} alt={p.name} className="w-full h-full object-cover" />
                      ) : (
                        <Package size={24} className="text-gray-300" />
                      )}
                    </div>
                    <div>
                      <Link href={`/admin/produk/${p.id}/edit`} className="font-bold text-gray-900 group-hover:text-red-700 transition-colors text-lg">
                        {p.name}
                      </Link>
                      <p className="text-xs font-mono font-medium text-gray-500 mt-0.5 bg-white px-2 py-0.5 rounded shadow-sm inline-block">{p.sku} • {p.category}</p>
                    </div>
                  </div>
                  <div className="text-left sm:text-right flex flex-row sm:flex-col items-center sm:items-end gap-3 sm:gap-0 w-full sm:w-auto">
                    <div className="bg-red-100 text-red-700 font-bold px-3 py-1.5 rounded-lg text-sm mb-0 sm:mb-1 shadow-sm border border-red-200">
                      Sisa {p.current_stock} {p.unit}
                    </div>
                    <p className="text-xs font-bold text-gray-400">Min. {p.min_stock}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center relative z-10 bg-green-50/50 rounded-2xl border border-green-100 border-dashed">
              <div className="w-20 h-20 bg-white text-green-500 rounded-full shadow-sm flex items-center justify-center mb-4">
                <TrendingUp size={36} />
              </div>
              <p className="font-bold text-xl text-gray-900 mb-1">Stok Sangat Aman</p>
              <p className="text-sm font-medium text-gray-500 max-w-xs leading-relaxed">Saat ini tidak ada produk yang jumlahnya berada di bawah batas minimum yang ditentukan.</p>
            </div>
          )}
        </div>

        {/* Categories Distribution */}
        <div className="lg:col-span-5 bg-gradient-to-br from-white to-pink-50/40 rounded-[2.5rem] p-8 border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative overflow-hidden">
          <div className="absolute bottom-0 right-0 w-40 h-40 bg-pink-100 rounded-full blur-3xl -mr-10 -mb-10 pointer-events-none"></div>

          <h3 className="text-xl font-bold text-gray-900 mb-8 flex items-center gap-3 relative z-10">
            <span className="w-10 h-10 rounded-full bg-pink-100 flex items-center justify-center text-pink-600 shadow-inner"><Layers size={18} /></span>
            Distribusi Kategori
          </h3>
          
          <div className="space-y-6 relative z-10">
            {Object.entries(categories).map(([cat, count]) => {
              const percentage = Math.round((count / totalProducts) * 100) || 0;
              return (
                <div key={cat} className="group">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-bold text-gray-700 group-hover:text-pink-700 transition-colors">{cat}</span>
                    <span className="font-black text-gray-900">{count} <span className="text-xs font-semibold text-gray-400">item</span></span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden shadow-inner">
                    <div 
                      className="bg-gradient-to-r from-pink-400 to-pink-600 h-3 rounded-full transition-all duration-1000 ease-out group-hover:opacity-80" 
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
            
            {Object.keys(categories).length === 0 && (
              <p className="text-center text-gray-500 italic font-medium py-10">Katalog kosong.</p>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
