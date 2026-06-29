"use server";

import { prisma } from "@/lib/prisma";

export async function submitTestimonial(data: {
  order_number: string;
  rating: number;
  content: string;
  role?: string;
}) {
  try {
    if (!data.order_number || !data.content || !data.rating) {
      return { success: false, error: "Data ulasan tidak lengkap" };
    }

    const order = await prisma.order.findUnique({
      where: { order_number: data.order_number },
      include: { testimonial: true }
    });

    if (!order) {
      return { success: false, error: "Pesanan tidak ditemukan" };
    }

    if (order.status !== "COMPLETED") {
      return { success: false, error: "Ulasan hanya bisa diberikan untuk pesanan yang sudah selesai" };
    }

    if (order.testimonial) {
      return { success: false, error: "Anda sudah memberikan ulasan untuk pesanan ini" };
    }

    await prisma.testimonial.create({
      data: {
        order_id: order.id,
        customer_name: order.customer_name, // inherit from order
        role: data.role || "Pelanggan",
        rating: data.rating,
        content: data.content,
        is_approved: false // Requires admin approval
      }
    });

    return { success: true };
  } catch (error) {
    console.error("Failed to submit testimonial:", error);
    return { success: false, error: "Gagal mengirim ulasan, silakan coba lagi." };
  }
}
