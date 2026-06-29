import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { PaymentUpload } from "./PaymentUpload";

export default async function CheckoutSuccessPage({ params }: { params: Promise<{ orderNumber: string }> }) {
  const resolvedParams = await params;
  const orderNumber = resolvedParams.orderNumber;

  const order = await prisma.order.findUnique({
    where: { order_number: orderNumber },
    include: { items: { include: { product: true } } }
  });

  if (!order) {
    notFound();
  }

  // Generate WhatsApp text
  let message = `Halo Aletta Scarf, saya sudah melakukan pesanan dan ingin konfirmasi.\n\n`;
  message += `*Nomor Pesanan:* ${order.order_number}\n`;
  message += `*Nama:* ${order.customer_name}\n`;
  message += `*Total Transfer:* Rp ${order.total_amount.toLocaleString("id-ID")}\n\n`;
  message += "Tolong dicek ya kak. Terima kasih!";
  
  const waNumber = "6281234567890"; // Using default if setting is not fetched for simplicity
  const waUrl = `https://wa.me/${waNumber}?text=${encodeURIComponent(message)}`;

  return (
    <div className="bg-gray-50 min-h-screen pt-32 pb-20">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 text-center">
          <div className="w-20 h-20 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
          </div>
          
          <h1 className="text-3xl font-serif font-bold text-gray-900 mb-2">Pesanan Berhasil Dibuat!</h1>
          <p className="text-gray-600 mb-2">Nomor Pesanan Anda:</p>
          <div className="text-2xl font-mono font-bold text-pink-700 bg-pink-50 inline-block px-6 py-2 rounded-xl mb-8">
            {order.order_number}
          </div>

          <div className="bg-gray-50 rounded-2xl p-6 mb-8 text-left border border-gray-100">
            <h3 className="font-bold text-gray-900 mb-4 text-lg">Instruksi Pembayaran</h3>
            <p className="text-gray-600 mb-4">
              Silakan lakukan pembayaran sebesar <strong className="text-xl text-pink-700">Rp {order.total_amount.toLocaleString("id-ID")}</strong> menggunakan kode QRIS di bawah ini, atau transfer ke rekening BCA kami.
            </p>
            
            <div className="flex flex-col md:flex-row gap-6 items-center justify-center bg-white p-6 rounded-xl border border-gray-100 mb-4">
              {/* QRIS Placeholder (User should replace with real QRIS later) */}
              <div className="w-48 h-48 bg-gray-100 rounded-xl flex flex-col items-center justify-center border-2 border-dashed border-gray-300">
                <span className="text-gray-400 font-bold text-xl">QRIS</span>
                <span className="text-gray-400 text-sm">Aletta Scarf</span>
              </div>
              <div className="text-left">
                <p className="font-bold text-gray-900">Transfer Bank Alternatif:</p>
                <p className="text-gray-600">BCA: 1234567890</p>
                <p className="text-gray-600">a/n Aletta Scarf</p>
              </div>
            </div>
            
            <div className="bg-amber-50 text-amber-800 p-4 rounded-xl text-sm">
              Setelah melakukan transfer, harap <strong>unggah foto bukti transfer</strong> Anda di bawah ini agar pesanan dapat segera kami proses.
            </div>
          </div>

          <PaymentUpload orderNumber={order.order_number} currentProof={order.payment_proof} />

          <div className="mt-8 pt-8 border-t border-gray-100">
            <p className="text-gray-500 mb-4 text-sm">Ada kendala? Hubungi admin kami via WhatsApp.</p>
            <a 
              href={waUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-xl font-bold transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
              Konfirmasi via WhatsApp
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
