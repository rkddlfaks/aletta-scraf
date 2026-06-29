"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function deleteProduct(id: number) {
  await prisma.product.delete({
    where: { id },
  });
  revalidatePath("/", "layout"); // Revalidate all pages
  revalidatePath("/admin/produk");
}

export async function createProduct(formData: FormData) {
  try {
    const name = formData.get("name") as string;
    const sku = formData.get("sku") as string;
    const category = formData.get("category") as string;
    const price = parseInt(formData.get("price") as string, 10);
    const cost = parseInt(formData.get("cost") as string, 10) || 0;
    const current_stock = parseInt(formData.get("current_stock") as string, 10);
    const min_stock = parseInt(formData.get("min_stock") as string, 10);
    const unit = formData.get("unit") as string || "pcs";
    const badge = formData.get("badge") as string;
    const description = formData.get("description") as string;
    const is_active = formData.get("is_active") === "on";
    
    const images = formData.getAll("images[]") as string[];
    const mainImage = images.length > 0 ? images[0] : null;

    // Verify SKU uniqueness manually if needed, or let Prisma handle it
    const existing = await prisma.product.findUnique({ where: { sku } });
    if (existing) {
      return { success: false, error: "SKU sudah digunakan oleh produk lain." };
    }

    await prisma.product.create({
      data: {
        name, sku, category, price, cost, current_stock, min_stock, unit, badge, image_url: mainImage, description, is_active,
        images: {
          create: images.map((url, i) => ({
            url,
            is_primary: i === 0
          }))
        }
      }
    });

    revalidatePath("/", "layout"); // Revalidate all pages
    revalidatePath("/admin/produk");
    
    return { success: true, message: "Produk berhasil ditambahkan!" };
  } catch (error: any) {
    console.error("Failed to create product:", error);
    return { success: false, error: error.message || "Gagal menyimpan produk ke database." };
  }
}

export async function updateProduct(id: number, formData: FormData) {
  try {
    const name = formData.get("name") as string;
    const sku = formData.get("sku") as string;
    const category = formData.get("category") as string;
    const price = parseInt(formData.get("price") as string, 10);
    const cost = parseInt(formData.get("cost") as string, 10) || 0;
    const current_stock = parseInt(formData.get("current_stock") as string, 10);
    const min_stock = parseInt(formData.get("min_stock") as string, 10);
    const unit = formData.get("unit") as string || "pcs";
    const badge = formData.get("badge") as string;
    const description = formData.get("description") as string;
    const is_active = formData.get("is_active") === "on";

    const images = formData.getAll("images[]") as string[];
    const mainImage = images.length > 0 ? images[0] : null;

    // Verify SKU uniqueness manually if it changed
    const existing = await prisma.product.findUnique({ where: { sku } });
    if (existing && existing.id !== id) {
      return { success: false, error: "SKU sudah digunakan oleh produk lain." };
    }

    await prisma.product.update({
      where: { id },
      data: {
        name, sku, category, price, cost, current_stock, min_stock, unit, badge, image_url: mainImage, description, is_active,
        images: {
          deleteMany: {},
          create: images.map((url, i) => ({
            url,
            is_primary: i === 0
          }))
        }
      }
    });

    revalidatePath("/", "layout"); // Revalidate all pages
    revalidatePath("/admin/produk");
    revalidatePath("/admin/dashboard");
    
    return { success: true, message: "Produk berhasil diperbarui!" };
  } catch (error: any) {
    console.error("Failed to update product:", error);
    return { success: false, error: error.message || "Gagal memperbarui produk di database." };
  }
}

export async function updateStock(id: number, difference: number) {
  await prisma.product.update({
    where: { id },
    data: {
      current_stock: { increment: difference }
    }
  });
  revalidatePath("/admin/produk");
  revalidatePath("/admin/dashboard");
}
