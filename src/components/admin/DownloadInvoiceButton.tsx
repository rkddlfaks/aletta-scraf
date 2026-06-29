"use client";

import { Download } from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

interface OrderItem {
  id: number;
  quantity: number;
  price: number;
  product: {
    name: string;
  };
}

interface Order {
  order_number: string;
  created_at: Date;
  customer_name: string;
  customer_phone: string;
  shipping_address: string;
  city: string;
  postal_code: string;
  total_amount: number;
  status: string;
  items: OrderItem[];
}

export function DownloadInvoiceButton({ order }: { order: Order }) {
  const isEnabled = ["PAID", "PROCESSING", "SHIPPED", "COMPLETED"].includes(order.status);

  const handleDownload = () => {
    if (!isEnabled) return;

    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    // -- COLORS --
    const primaryColor: [number, number, number] = [219, 39, 119]; // Pink 600
    const lightPink: [number, number, number] = [253, 242, 248]; // Pink 50
    const darkGray: [number, number, number] = [55, 65, 81];
    const lightGray: [number, number, number] = [156, 163, 175];

    // -- HEADER BG --
    doc.setFillColor(lightPink[0], lightPink[1], lightPink[2]);
    doc.rect(0, 0, pageWidth, 45, 'F');
    
    // -- HEADER ACCENT LINE --
    doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.rect(0, 0, pageWidth, 2, 'F');

    // -- BRANDING / LOGO NATIVE DRAW --
    // Outer circle
    doc.setFillColor(252, 225, 232); // #FCE1E8
    doc.circle(24, 22, 10, 'F');
    // Inner stroke
    doc.setDrawColor(184, 184, 184); // #B8B8B8
    doc.setLineWidth(0.5);
    doc.circle(24, 22, 9, 'S');
    // AS Text
    doc.setFont("times", "bold");
    doc.setFontSize(14);
    doc.setTextColor(160, 160, 160);
    doc.text("AS", 24, 26, { align: "center" });

    // Brand Name
    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.text("ALETTA SCARF", 38, 26);
    
    doc.setFont("helvetica", "italic");
    doc.setFontSize(10);
    doc.setTextColor(darkGray[0], darkGray[1], darkGray[2]);
    doc.text("Premium Fashion & Accessories", 38, 32);
    
    // -- INVOICE TEXT --
    doc.setFont("helvetica", "bold");
    doc.setFontSize(28);
    doc.setTextColor(244, 114, 182); // Pink 400
    doc.text("INVOICE", pageWidth - 14, 26, { align: "right" });
    
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(darkGray[0], darkGray[1], darkGray[2]);
    doc.text(`# ${order.order_number}`, pageWidth - 14, 34, { align: "right" });

    // -- DATES & DETAILS --
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.text("Tanggal Pemesanan:", 14, 60);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(darkGray[0], darkGray[1], darkGray[2]);
    doc.text(new Date(order.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }), 14, 66);
    
    // -- CUSTOMER --
    doc.setFont("helvetica", "bold");
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.text("Ditagihkan Kepada:", pageWidth - 90, 60);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(darkGray[0], darkGray[1], darkGray[2]);
    doc.text(order.customer_name, pageWidth - 90, 66);
    doc.text(`WA: ${order.customer_phone}`, pageWidth - 90, 71);
    const addressLines = doc.splitTextToSize(`${order.shipping_address}, ${order.city}, ${order.postal_code}`, 76);
    doc.text(addressLines, pageWidth - 90, 76);

    // -- TABLE --
    const tableData = order.items.map((item, index) => [
      (index + 1).toString(),
      item.product.name,
      `${item.quantity}x`,
      `Rp ${item.price.toLocaleString("id-ID")}`,
      `Rp ${(item.quantity * item.price).toLocaleString("id-ID")}`
    ]);

    autoTable(doc, {
      startY: 95,
      head: [["No", "Deskripsi Produk", "Qty", "Harga Satuan", "Total Harga"]],
      body: tableData,
      theme: 'plain',
      headStyles: { 
        fillColor: lightPink, 
        textColor: primaryColor,
        fontStyle: 'bold',
        halign: 'center',
        valign: 'middle',
      },
      bodyStyles: {
        textColor: darkGray,
        valign: 'middle'
      },
      alternateRowStyles: {
        fillColor: [255, 255, 255]
      },
      styles: { 
        font: "helvetica", 
        fontSize: 10,
        cellPadding: { top: 6, bottom: 6, left: 4, right: 4 }, // Lebihkan atas/bawah agar tidak dempet
        lineColor: [253, 232, 243], // Pink 100
        lineWidth: { bottom: 0.5 }
      },
      columnStyles: {
        0: { cellWidth: 18, halign: 'center' },
        1: { halign: 'left' },
        2: { cellWidth: 20, halign: 'center' },
        3: { cellWidth: 35, halign: 'right' },
        4: { cellWidth: 35, halign: 'right' },
      }
    });

    // -- SUMMARY --
    const finalY = (doc as any).lastAutoTable.finalY + 15;
    
    // Background for total
    doc.setFillColor(lightPink[0], lightPink[1], lightPink[2]);
    doc.roundedRect(pageWidth - 80, finalY - 8, 66, 22, 3, 3, 'F');

    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(darkGray[0], darkGray[1], darkGray[2]);
    doc.text("Grand Total", pageWidth - 75, finalY + 4);
    
    doc.setFontSize(14);
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.text(`Rp ${order.total_amount.toLocaleString("id-ID")}`, pageWidth - 18, finalY + 4, { align: "right" });

    // -- FOOTER --
    doc.setFont("helvetica", "italic");
    doc.setFontSize(10);
    doc.setTextColor(lightGray[0], lightGray[1], lightGray[2]);
    // Ornament text with flowers
    doc.text("✿ Terima kasih telah berbelanja di Aletta Scarf! ✿", pageWidth / 2, pageHeight - 20, { align: "center" });

    doc.save(`Invoice_${order.order_number}.pdf`);
  };

  return (
    <button
      onClick={handleDownload}
      disabled={!isEnabled}
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium text-xs transition-all duration-300 w-full justify-center mt-2 ${
        isEnabled 
          ? "bg-pink-50 text-pink-700 hover:bg-pink-100 border border-pink-200 shadow-sm cursor-pointer" 
          : "bg-gray-50 text-gray-400 border border-gray-200 cursor-not-allowed opacity-70"
      }`}
      title={!isEnabled ? "Tersedia jika pesanan lunas" : "Download PDF Invoice"}
    >
      <Download size={14} />
      Cetak Invoice
    </button>
  );
}
