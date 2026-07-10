"use server";

import { prisma } from "@/lib/prisma";

export async function trackOrder(orderNumber: string, phone: string) {
  try {
    if (!orderNumber || !phone) {
      return { success: false, error: "Nomor pesanan dan nomor WhatsApp wajib diisi" };
    }

    const order = await prisma.order.findUnique({
      where: { order_number: orderNumber },
      include: {
        items: {
          include: {
            product: true
          }
        },
        testimonial: true
      }
    });

    if (!order) {
      return { success: false, error: "Pesanan tidak ditemukan. Pastikan nomor pesanan benar." };
    }

    const normalPhone = phone.replace(/[^0-9]/g, '');
    const orderPhone = order.customer_phone.replace(/[^0-9]/g, '');

    if (normalPhone !== orderPhone) {
      return { success: false, error: "Nomor WhatsApp tidak cocok dengan pesanan ini." };
    }

    return { 
      success: true, 
      order: {
        order_number: order.order_number,
        status: order.status,
        created_at: order.created_at,
        total_amount: order.total_amount,
        shipping_provider: order.shipping_provider,
        tracking_number: order.tracking_number,
        payment_proof: order.payment_proof,
        has_testimonial: !!order.testimonial,
        items: order.items.map(item => ({
          name: item.product?.name || 'Produk Dihapus',
          quantity: item.quantity
        }))
      }
    };
  } catch (error) {
    console.error("Track order error:", error);
    return { success: false, error: "Terjadi kesalahan sistem." };
  }
}
