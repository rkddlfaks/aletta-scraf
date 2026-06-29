import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { Package, MapPin, Phone } from "lucide-react";
import { PrintHeader } from "@/components/admin/PrintHeader";

// For thermal label printing, usually 100mm x 150mm (A6)
// We will use standard print CSS for this.

export default async function CetakLabelPage({
  searchParams,
}: {
  searchParams: Promise<{ ids?: string }>;
}) {
  const resolvedParams = await searchParams;
  const idsParam = resolvedParams.ids || "";
  
  if (!idsParam) return notFound();

  const ids = idsParam.split(",").map(id => parseInt(id, 10)).filter(id => !isNaN(id));

  if (ids.length === 0) return notFound();

  const orders = await prisma.order.findMany({
    where: {
      id: { in: ids }
    },
    include: {
      items: {
        include: {
          product: true
        }
      }
    }
  });

  if (orders.length === 0) return notFound();

  return (
    <div className="bg-gray-100 min-h-screen text-black print:bg-white print:min-h-0">
      <PrintHeader />

      <div className="max-w-[10cm] mx-auto print:max-w-none print:m-0 space-y-6 print:space-y-0">
        {orders.map((order, index) => (
          <div 
            key={order.id} 
            className="bg-white p-4 border border-gray-300 rounded-lg shadow-sm print:shadow-none print:border-none print:rounded-none w-[10cm] h-[15cm] relative mx-auto"
            style={{ pageBreakAfter: "always" }}
          >
            {/* LABEL HEADER */}
            <div className="flex justify-between items-start border-b-2 border-black pb-3 mb-3">
              <div>
                <h1 className="text-2xl font-serif font-black tracking-tight">ALETTA SCARF</h1>
                <p className="text-[10px] uppercase font-bold text-gray-500">Premium Prayer Gown</p>
              </div>
              <div className="text-right">
                <div className="text-xs uppercase font-bold bg-black text-white px-2 py-1 rounded inline-block">
                  Label Pengiriman
                </div>
              </div>
            </div>

            {/* ORDER INFO */}
            <div className="text-center border-2 border-dashed border-gray-300 py-3 mb-4 bg-gray-50">
              <div className="text-[10px] text-gray-500 uppercase font-bold tracking-widest mb-1">Nomor Pesanan</div>
              <div className="font-mono text-xl font-bold tracking-wider">{order.order_number}</div>
              <div className="text-[10px] mt-1 text-gray-500">
                {new Date(order.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
              </div>
            </div>

            {/* SHIPPING INFO - RECIPIENT */}
            <div className="mb-4">
              <div className="text-[10px] uppercase font-bold text-gray-500 mb-1 border-b border-gray-200 pb-1">PENERIMA</div>
              <div className="flex items-start gap-2 mt-2">
                <MapPin size={14} className="mt-0.5 shrink-0" />
                <div>
                  <div className="font-bold text-sm uppercase">{order.customer_name}</div>
                  <div className="text-xs mt-1 leading-relaxed">{order.shipping_address}</div>
                  <div className="text-xs mt-0.5">{order.city} {order.postal_code}</div>
                </div>
              </div>
              <div className="flex items-center gap-2 mt-2">
                <Phone size={14} className="shrink-0" />
                <div className="text-xs font-bold">{order.customer_phone}</div>
              </div>
            </div>

            {/* SHIPPING INFO - SENDER */}
            <div className="mb-4 border-t border-gray-200 pt-3">
              <div className="text-[10px] uppercase font-bold text-gray-500 mb-1 border-b border-gray-200 pb-1">PENGIRIM</div>
              <div className="mt-2">
                <div className="font-bold text-xs uppercase">Aletta Scarf Official</div>
                <div className="text-[10px] mt-0.5">Kab. Purwakarta, Jawa Barat</div>
                <div className="text-[10px] font-bold mt-0.5">0812-3456-7890</div>
              </div>
            </div>

            {/* ITEMS LIST (Simplified for shipping label) */}
            <div className="border-t-2 border-black pt-3">
              <div className="text-[10px] uppercase font-bold text-gray-500 mb-2 flex items-center gap-1">
                <Package size={12} /> Isi Paket ({order.items.reduce((sum, item) => sum + item.quantity, 0)} Pcs)
              </div>
              <ul className="text-[10px] space-y-1">
                {order.items.map(item => (
                  <li key={item.id} className="flex justify-between">
                    <span className="truncate pr-2">{item.product.name}</span>
                    <span className="font-bold whitespace-nowrap">{item.quantity}x</span>
                  </li>
                ))}
              </ul>
              <div className="text-[9px] text-gray-400 mt-2 italic text-center w-full absolute bottom-4 left-0">
                Terima kasih telah berbelanja di Aletta Scarf
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <style dangerouslySetInnerHTML={{__html: `
        @media print {
          @page {
            size: 100mm 150mm; /* A6 label size */
            margin: 0;
          }
          body {
            margin: 0;
            padding: 0;
            background: white;
          }
        }
      `}} />
    </div>
  );
}
