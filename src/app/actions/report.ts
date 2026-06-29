"use server";

import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export async function exportOrdersCSV(params: { q: string; status: string; date: string; customDate: string }) {
  try {
    const where: Prisma.OrderWhereInput = {};

    if (params.q) {
      where.OR = [
        { order_number: { contains: params.q } },
        { customer_name: { contains: params.q } },
      ];
    }

    if (params.status) {
      where.status = params.status;
    }

    if (params.date) {
      const now = new Date();
      let startDate = new Date();
      
      if (params.date === "today") {
        startDate.setHours(0, 0, 0, 0);
        where.created_at = { gte: startDate };
      } else if (params.date === "7days") {
        startDate.setDate(now.getDate() - 7);
        where.created_at = { gte: startDate };
      } else if (params.date === "thismonth") {
        startDate.setDate(1);
        startDate.setHours(0, 0, 0, 0);
        where.created_at = { gte: startDate };
      } else if (params.date === "custom" && params.customDate) {
        const parsedDate = new Date(params.customDate);
        if (!isNaN(parsedDate.getTime())) {
          parsedDate.setHours(0, 0, 0, 0);
          const endOfDay = new Date(parsedDate);
          endOfDay.setHours(23, 59, 59, 999);
          where.created_at = { gte: parsedDate, lte: endOfDay };
        }
      }
    }

    const orders = await prisma.order.findMany({
      where,
      orderBy: { created_at: "desc" },
      include: {
        items: {
          include: {
            product: true
          }
        }
      }
    });

    // Create CSV header
    const headers = [
      "Order Number",
      "Tanggal Pemesanan",
      "Nama Pelanggan",
      "Nomor WA",
      "Kota Pengiriman",
      "Total Belanja (Rp)",
      "Total Modal (Rp)",
      "Status",
      "Detail Item"
    ];

    let csvContent = headers.join(",") + "\n";

    orders.forEach(order => {
      const dateStr = new Date(order.created_at).toLocaleString("id-ID");
      
      // Calculate Cost
      const totalCost = order.items.reduce((sum, item) => sum + (item.cost * item.quantity), 0);
      
      // Combine items into a single string for the CSV cell
      const itemsDetail = order.items.map(i => `${i.quantity}x ${i.product.name.replace(/,/g, '')}`).join(" | ");

      // Escape quotes and wrap strings in quotes if they contain commas
      const row = [
        `"${order.order_number}"`,
        `"${dateStr}"`,
        `"${order.customer_name}"`,
        `"${order.customer_phone}"`,
        `"${order.city}"`,
        order.total_amount,
        totalCost,
        order.status,
        `"${itemsDetail}"`
      ];

      csvContent += row.join(",") + "\n";
    });

    return { success: true, csvData: csvContent };
  } catch (error: any) {
    console.error("Export Error:", error);
    return { success: false, error: error.message || "Failed to generate CSV" };
  }
}
