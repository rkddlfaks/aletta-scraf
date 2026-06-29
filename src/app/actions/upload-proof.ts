"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import fs from "fs/promises";
import path from "path";

export async function uploadPaymentProof(formData: FormData) {
  try {
    const orderNumber = formData.get("order_number") as string;
    const phone = formData.get("customer_phone") as string;
    const file = formData.get("file") as File;

    if (!orderNumber || !phone || !file) {
      return { success: false, error: "Data tidak lengkap" };
    }

    // Verify order exists and phone matches
    const order = await prisma.order.findUnique({
      where: { order_number: orderNumber }
    });

    if (!order) {
      return { success: false, error: "Pesanan tidak ditemukan" };
    }

    // Simple phone normalization for checking
    const normalPhone = phone.replace(/[^0-9]/g, '');
    const orderPhone = order.customer_phone.replace(/[^0-9]/g, '');

    if (normalPhone !== orderPhone) {
      return { success: false, error: "Nomor WhatsApp tidak cocok dengan pesanan" };
    }

    if (order.status !== "PENDING") {
      return { success: false, error: "Pesanan ini sudah tidak dalam status Menunggu Pembayaran" };
    }

    // Read file data
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Create unique filename
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.name) || '.jpg';
    const filename = `proof-${orderNumber}-${uniqueSuffix}${ext}`;
    
    // Ensure upload dir exists
    const uploadDir = path.join(process.cwd(), "public/uploads");
    try {
      await fs.access(uploadDir);
    } catch {
      await fs.mkdir(uploadDir, { recursive: true });
    }

    const filepath = path.join(uploadDir, filename);
    await fs.writeFile(filepath, buffer);

    const publicUrl = `/uploads/${filename}`;

    // Update database
    await prisma.order.update({
      where: { id: order.id },
      data: { payment_proof: publicUrl }
    });

    revalidatePath("/admin/pesanan");
    revalidatePath("/lacak-pesanan");

    return { success: true, url: publicUrl };
  } catch (error) {
    console.error("Upload error:", error);
    return { success: false, error: "Gagal mengunggah bukti pembayaran" };
  }
}
