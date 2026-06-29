"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";

export async function updateOrderStatus(
  orderId: number, 
  newStatus: string,
  shippingProvider?: string,
  trackingNumber?: string
) {
  const session = await auth();
  if (!session) {
    throw new Error("Unauthorized");
  }

  // Define valid statuses
  const validStatuses = ["PENDING", "PAID", "PROCESSING", "SHIPPED", "COMPLETED", "CANCELLED"];
  if (!validStatuses.includes(newStatus)) {
    throw new Error("Invalid status");
  }

  try {
    // If status is transitioning to PAID, we should deduct stock
    const currentOrder = await prisma.order.findUnique({
      where: { id: orderId },
      include: { items: true }
    });

    if (!currentOrder) {
      throw new Error("Order not found");
    }

    // Only deduct stock if transitioning FROM PENDING TO PAID/PROCESSING/SHIPPED
    // A more robust system would handle stock locks at checkout, but this is a simple approach
    const isPaying = currentOrder.status === "PENDING" && ["PAID", "PROCESSING", "SHIPPED"].includes(newStatus);
    
    // Build update data
    const updateData: any = { status: newStatus };
    if (newStatus === "SHIPPED" && shippingProvider && trackingNumber) {
      updateData.shipping_provider = shippingProvider;
      updateData.tracking_number = trackingNumber;
    }

    // Update the order status
    await prisma.order.update({
      where: { id: orderId },
      data: updateData
    });

    // Deduct stock if payment is confirmed
    if (isPaying) {
      for (const item of currentOrder.items) {
        await prisma.product.update({
          where: { id: item.product_id },
          data: {
            current_stock: { decrement: item.quantity },
            sold_count: { increment: item.quantity }
          }
        });
      }
    }

    revalidatePath("/admin/pesanan");
    revalidatePath("/admin/dashboard");
    revalidatePath("/admin/produk");
    
    return { success: true };
  } catch (error) {
    console.error("Failed to update order status:", error);
    return { success: false, error: "Gagal memperbarui status pesanan" };
  }
}

export async function deleteOrder(orderId: number) {
  const session = await auth();
  if (!session) {
    throw new Error("Unauthorized");
  }

  try {
    // Cascading delete will handle OrderItems
    await prisma.order.delete({
      where: { id: orderId }
    });

    revalidatePath("/admin/pesanan");
    revalidatePath("/admin/dashboard");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete order:", error);
    return { success: false, error: "Gagal menghapus pesanan" };
  }
}
