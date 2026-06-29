import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { supabase } from "@/lib/supabase";
import path from "path";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const orderNumber = formData.get("orderNumber") as string | null;

    if (!file || !orderNumber) {
      return NextResponse.json({ success: false, error: "Data tidak lengkap" }, { status: 400 });
    }

    const order = await prisma.order.findUnique({ where: { order_number: orderNumber } });
    if (!order) {
      return NextResponse.json({ success: false, error: "Pesanan tidak ditemukan" }, { status: 404 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Create unique filename
    const filename = `proofs/${orderNumber}-${Date.now()}${path.extname(file.name)}`;

    // Upload to Supabase Storage
    const { data, error } = await supabase
      .storage
      .from('aletta-storage')
      .upload(filename, buffer, {
        contentType: file.type,
        upsert: false
      });

    if (error) {
      console.error("Supabase storage error:", error);
      throw error;
    }

    // Get public URL
    const { data: publicUrlData } = supabase
      .storage
      .from('aletta-storage')
      .getPublicUrl(filename);
      
    const fileUrl = publicUrlData.publicUrl;

    // Update database
    await prisma.order.update({
      where: { order_number: orderNumber },
      data: { payment_proof: fileUrl, payment_method: "QRIS/Transfer" }
    });

    return NextResponse.json({ success: true, url: fileUrl });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ success: false, error: "Gagal mengunggah file" }, { status: 500 });
  }
}
