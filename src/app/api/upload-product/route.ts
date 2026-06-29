import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import path from "path";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const files = formData.getAll("files") as File[];

    if (!files || files.length === 0) {
      return NextResponse.json({ success: false, error: "Tidak ada file yang diunggah" }, { status: 400 });
    }

    const urls: string[] = [];

    for (const file of files) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      // Create unique filename
      const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
      const filename = `products/product-${uniqueSuffix}${path.extname(file.name)}`;
      
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
        
      urls.push(publicUrlData.publicUrl);
    }

    return NextResponse.json({ success: true, urls });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ success: false, error: "Gagal mengunggah gambar" }, { status: 500 });
  }
}
