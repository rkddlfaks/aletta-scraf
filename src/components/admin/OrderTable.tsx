"use client";

import { useState } from "react";
import { PackageSearch, Clock, MessageCircle, FileText, Image as ImageIcon, X, CheckSquare, Square, Printer, CheckCircle } from "lucide-react";
import { OrderStatusSelect } from "@/components/admin/OrderStatusSelect";
import { DownloadInvoiceButton } from "@/components/admin/DownloadInvoiceButton";
import { Pagination } from "@/components/admin/Pagination";
import { updateBulkOrderStatuses } from "@/app/actions/bulk-orders";

interface OrderTableProps {
  orders: any[];
  totalPages: number;
  currentPage: number;
}

export function OrderTable({ orders, totalPages, currentPage }: OrderTableProps) {
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [proofModalOpen, setProofModalOpen] = useState(false);
  const [proofUrl, setProofUrl] = useState("");
  
  const [isUpdatingBulk, setIsUpdatingBulk] = useState(false);

  const toggleAll = () => {
    if (selectedIds.length === orders.length && orders.length > 0) {
      setSelectedIds([]);
    } else {
      setSelectedIds(orders.map(o => o.id));
    }
  };

  const toggleOne = (id: number) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(i => i !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const handleBulkUpdate = async (status: string) => {
    if (selectedIds.length === 0) return;
    
    if (confirm(`Anda yakin ingin mengubah ${selectedIds.length} pesanan menjadi ${status}?`)) {
      setIsUpdatingBulk(true);
      const res = await updateBulkOrderStatuses(selectedIds, status);
      if (res.success) {
        setSelectedIds([]);
      } else {
        alert(res.error || "Gagal mengubah status massal");
      }
      setIsUpdatingBulk(false);
    }
  };

  const handlePrintLabels = () => {
    if (selectedIds.length === 0) return;
    window.open(`/admin/pesanan/cetak-label?ids=${selectedIds.join(",")}`, "_blank");
  };

  const openProof = (url: string) => {
    setProofUrl(url);
    setProofModalOpen(true);
  };

  return (
    <>
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden relative">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-gray-50/50 border-b border-gray-100 text-gray-500 uppercase text-[11px] tracking-wider font-bold">
              <tr>
                <th className="px-4 py-4 w-10">
                  <button onClick={toggleAll} className="text-gray-400 hover:text-pink-600 transition-colors">
                    {orders.length > 0 && selectedIds.length === orders.length ? <CheckSquare size={18} className="text-pink-600" /> : <Square size={18} />}
                  </button>
                </th>
                <th className="px-2 py-4">No. Pesanan / Tgl</th>
                <th className="px-6 py-4">Kustomer / Pengiriman</th>
                <th className="px-6 py-4">Item Pembelian</th>
                <th className="px-6 py-4 text-right">Total (Rp)</th>
                <th className="px-6 py-4 w-40">Status Pembayaran</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {orders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center justify-center text-gray-400">
                      <PackageSearch size={48} className="mb-4 opacity-50" />
                      <p className="text-lg font-medium text-gray-600">Belum ada pesanan</p>
                      <p className="text-sm mt-1">Pesanan dari pembeli akan muncul di sini.</p>
                    </div>
                  </td>
                </tr>
              ) : orders.map(order => (
                <tr key={order.id} className={`transition-colors ${selectedIds.includes(order.id) ? 'bg-pink-50/50' : 'hover:bg-gray-50/50'}`}>
                  <td className="px-4 py-4 align-top">
                    <button onClick={() => toggleOne(order.id)} className="text-gray-400 hover:text-pink-600 transition-colors mt-0.5">
                      {selectedIds.includes(order.id) ? <CheckSquare size={18} className="text-pink-600" /> : <Square size={18} />}
                    </button>
                  </td>
                  <td className="px-2 py-4 align-top">
                    <div className="font-mono text-xs font-bold text-gray-900 bg-gray-100 px-2 py-1 rounded w-fit mb-2">
                      {order.order_number}
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-gray-500">
                      <Clock size={12} />
                      {new Date(order.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </td>
                  <td className="px-6 py-4 align-top max-w-[250px]">
                    <div className="font-bold text-gray-900 mb-1 flex items-center gap-2">
                      {order.customer_name}
                      {/* PAYMENT PROOF VIEWER BUTTON */}
                      {order.payment_proof && (
                        <button 
                          onClick={() => openProof(order.payment_proof)}
                          className="bg-blue-100 text-blue-700 hover:bg-blue-200 p-1 rounded transition-colors"
                          title="Lihat Bukti Transfer"
                        >
                          <ImageIcon size={14} />
                        </button>
                      )}
                    </div>
                    <div className="flex items-center gap-2 mb-1.5">
                      <div className="text-xs text-gray-600 font-medium">WA: {order.customer_phone}</div>
                      <a 
                        href={`https://wa.me/${order.customer_phone.replace(/[^0-9]/g, '').replace(/^0/, '62')}?text=${encodeURIComponent(
                          (() => {
                            const base = `Halo Kak ${order.customer_name}, terima kasih telah memesan dari Aletta Scarf (Order: ${order.order_number}).`;
                            switch (order.status) {
                              case "PENDING": return `${base} Apakah ada kendala dalam proses pembayaran? Kami siap membantu!`;
                              case "PAID":
                              case "PROCESSING": return `${base} Pembayaran sudah kami terima. Mohon menunggu ya, barang sedang kami packing!`;
                              case "SHIPPED": return `${base} Pesanan Kakak sudah dikirim menggunakan ekspedisi ${order.shipping_provider || '-'} dengan nomor resi ${order.tracking_number || '-'}.`;
                              case "COMPLETED": return `${base} Terima kasih banyak telah berbelanja di Aletta Scarf! Ditunggu pesanan selanjutnya ya kak.`;
                              case "CANCELLED": return `${base} Mohon maaf pesanan ini telah dibatalkan.`;
                              default: return base;
                            }
                          })()
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-green-100 hover:bg-green-200 text-green-700 p-1 rounded-md transition-colors"
                        title="Chat WhatsApp"
                      >
                        <MessageCircle size={14} />
                      </a>
                    </div>
                    <div className="text-xs text-gray-500 line-clamp-2" title={`${order.shipping_address}, ${order.city} ${order.postal_code}`}>
                      {order.shipping_address}, {order.city}
                    </div>
                    {order.tracking_number && (
                      <div className="mt-2 text-[11px] bg-indigo-50 text-indigo-700 px-2 py-1.5 rounded border border-indigo-100 font-medium w-fit">
                        <div className="flex items-center gap-1"><PackageSearch size={10} /> Resi: <span className="font-bold">{order.tracking_number}</span></div>
                        <div className="text-indigo-500">{order.shipping_provider}</div>
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 align-top min-w-[200px]">
                    <ul className="space-y-2">
                      {order.items.map((item: any) => (
                        <li key={item.id} className="flex gap-2 text-xs">
                          <span className="font-bold text-gray-900">{item.quantity}x</span>
                          <span className="text-gray-700">{item.product.name}</span>
                        </li>
                      ))}
                    </ul>
                  </td>
                  <td className="px-6 py-4 align-top text-right">
                    <div className="font-bold text-gray-900 text-sm">
                      {order.total_amount.toLocaleString("id-ID")}
                    </div>
                  </td>
                  <td className="px-6 py-4 align-top">
                    <OrderStatusSelect orderId={order.id} initialStatus={order.status} />
                    <DownloadInvoiceButton order={order} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Pagination totalPages={totalPages} currentPage={currentPage} />
      </div>

      {/* FLOATING ACTION BAR FOR BULK ACTIONS */}
      {selectedIds.length > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-gray-900 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-6 z-50 animate-in slide-in-from-bottom-10 fade-in border border-gray-700">
          <div className="flex items-center gap-3">
            <div className="bg-pink-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm">
              {selectedIds.length}
            </div>
            <span className="font-medium text-sm">Pesanan Dipilih</span>
          </div>
          
          <div className="w-px h-8 bg-gray-700"></div>
          
          <div className="flex items-center gap-3">
            <button 
              onClick={() => handleBulkUpdate("PAID")}
              disabled={isUpdatingBulk}
              className="flex items-center gap-2 bg-green-600 hover:bg-green-500 px-4 py-2 rounded-xl text-sm font-bold transition-colors disabled:opacity-50"
            >
              <CheckCircle size={16} /> Set Lunas
            </button>
            <button 
              onClick={handlePrintLabels}
              className="flex items-center gap-2 bg-white text-gray-900 hover:bg-gray-100 px-4 py-2 rounded-xl text-sm font-bold transition-colors"
            >
              <Printer size={16} /> Cetak Label
            </button>
            
            <button 
              onClick={() => setSelectedIds([])}
              className="p-2 hover:bg-gray-800 rounded-xl transition-colors ml-2 text-gray-400 hover:text-white"
            >
              <X size={20} />
            </button>
          </div>
        </div>
      )}

      {/* PAYMENT PROOF MODAL */}
      {proofModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm" onClick={() => setProofModalOpen(false)}></div>
          <div className="relative bg-white rounded-3xl overflow-hidden shadow-2xl max-w-lg w-full max-h-[90vh] flex flex-col animate-in zoom-in-95">
            <div className="flex justify-between items-center p-5 border-b border-gray-100">
              <h3 className="font-bold text-lg text-gray-900 flex items-center gap-2">
                <ImageIcon className="text-blue-500" /> Bukti Transfer
              </h3>
              <button onClick={() => setProofModalOpen(false)} className="text-gray-400 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 p-2 rounded-full transition-colors">
                <X size={20} />
              </button>
            </div>
            <div className="p-6 bg-gray-50 flex-1 overflow-auto flex justify-center items-center">
              <img src={proofUrl} alt="Bukti Pembayaran" className="max-w-full rounded-xl shadow-sm border border-gray-200" />
            </div>
            <div className="p-5 border-t border-gray-100 bg-white">
              <p className="text-sm text-gray-500 text-center">Pastikan nominal transfer sesuai dengan total pesanan sebelum mengubah status menjadi Lunas.</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
