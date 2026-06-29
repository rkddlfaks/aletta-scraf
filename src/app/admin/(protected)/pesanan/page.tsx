import { prisma } from "@/lib/prisma";
import { OrderFilters } from "@/components/admin/OrderFilters";
import { ExportReportButton } from "@/components/admin/ExportReportButton";
import { OrderTable } from "@/components/admin/OrderTable";
import { Prisma } from "@prisma/client";
import { Suspense } from "react";

export default async function OrderListPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string; date?: string; customDate?: string; page?: string }>;
}) {
  const resolvedParams = await searchParams;
  const q = resolvedParams.q || "";
  const status = resolvedParams.status || "";
  const date = resolvedParams.date || "";
  const customDate = resolvedParams.customDate || "";
  
  // Pagination parsing
  const currentPage = parseInt(resolvedParams.page || "1", 10);
  const pageSize = 10;
  const skip = (currentPage - 1) * pageSize;

  // Build where clause
  const where: Prisma.OrderWhereInput = {};

  if (q) {
    where.OR = [
      { order_number: { contains: q } },
      { customer_name: { contains: q } },
    ];
  }

  if (status) {
    where.status = status;
  }

  if (date) {
    const now = new Date();
    let startDate = new Date();
    
    if (date === "today") {
      startDate.setHours(0, 0, 0, 0);
      where.created_at = { gte: startDate };
    } else if (date === "7days") {
      startDate.setDate(now.getDate() - 7);
      where.created_at = { gte: startDate };
    } else if (date === "thismonth") {
      startDate.setDate(1);
      startDate.setHours(0, 0, 0, 0);
      where.created_at = { gte: startDate };
    } else if (date === "custom" && customDate) {
      const parsedDate = new Date(customDate);
      if (!isNaN(parsedDate.getTime())) {
        parsedDate.setHours(0, 0, 0, 0);
        const endOfDay = new Date(parsedDate);
        endOfDay.setHours(23, 59, 59, 999);
        where.created_at = { gte: parsedDate, lte: endOfDay };
      }
    }
  }

  // Fetch paginated data and total count
  const [orders, totalOrders] = await Promise.all([
    prisma.order.findMany({
      where,
      orderBy: { created_at: "desc" },
      skip,
      take: pageSize,
      include: {
        items: {
          include: {
            product: true
          }
        }
      }
    }),
    prisma.order.count({ where })
  ]);

  const totalPages = Math.ceil(totalOrders / pageSize);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-serif font-bold text-gray-900">Pesanan Masuk</h1>
          <p className="text-muted-foreground mt-1">Kelola transaksi dan status pengiriman.</p>
        </div>
      </div>

      <Suspense fallback={<div className="h-16 bg-gray-100 rounded-xl mb-6 animate-pulse"></div>}>
        <OrderFilters />
      </Suspense>

      <OrderTable orders={orders} totalPages={totalPages} currentPage={currentPage} />
      
      <ExportReportButton />
    </div>
  );
}
