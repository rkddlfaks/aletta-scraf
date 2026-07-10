"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";

export async function updateBulkOrderStatuses(orderIds: number[], newStatus: string) {
  const session = await auth();
  if (!session) {
    throw new Error("Unauthorized");
  }

  const validStatuses = ["PENDING", "PAID", "PROCESSING", "SHIPPED", "COMPLETED", "CANCELLED"];
  if (!validStatuses.includes(newStatus)) {
    throw new Error("Invalid status");
  }

  if (!orderIds || orderIds.length === 0) {
    return { success: false, error: "Tidak ada pesanan yang dipilih" };
  }

  try {
    for (const id of orderIds) {
      const order = await prisma.order.findUnique({
        where: { id },
        include: { items: true }
      });

      if (!order) continue;

      const isPaying = order.status === "PENDING" && ["PAID", "PROCESSING", "SHIPPED"].includes(newStatus);

      await prisma.order.update({
        where: { id },
        data: { status: newStatus }
      });

      if (isPaying) {
        for (const item of order.items) {
          if (item.product_id) {
            await prisma.product.update({
              where: { id: item.product_id },
              data: {
                current_stock: { decrement: item.quantity },
                sold_count: { increment: item.quantity }
              }
            });
          }
        }
      }
    }

    revalidatePath("/admin/pesanan");
    revalidatePath("/admin/dashboard");
    revalidatePath("/admin/produk");
    
    return { success: true };
  } catch (error) {
    console.error("Failed to update bulk orders:", error);
    return { success: false, error: "Gagal memperbarui pesanan secara massal" };
  }
}
