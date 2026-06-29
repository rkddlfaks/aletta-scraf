"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function deleteProduct(id: number) {
  await prisma.product.delete({
    where: { id },
  });
  revalidatePath("/admin/produk");
}

export async function createProduct(formData: FormData) {
  const name = formData.get("name") as string;
  const sku = formData.get("sku") as string;
  const category = formData.get("category") as string;
  const price = parseInt(formData.get("price") as string, 10);
  const current_stock = parseInt(formData.get("current_stock") as string, 10);
  const min_stock = parseInt(formData.get("min_stock") as string, 10);
  const unit = formData.get("unit") as string || "pcs";
  const badge = formData.get("badge") as string;
  const image_url = formData.get("image_url") as string;
  const is_active = formData.get("is_active") === "on";

  await prisma.product.create({
    data: {
      name, sku, category, price, current_stock, min_stock, unit, badge, image_url, is_active
    }
  });

  revalidatePath("/admin/produk");
  redirect("/admin/produk");
}

export async function updateProduct(id: number, formData: FormData) {
  const name = formData.get("name") as string;
  const sku = formData.get("sku") as string;
  const category = formData.get("category") as string;
  const price = parseInt(formData.get("price") as string, 10);
  const current_stock = parseInt(formData.get("current_stock") as string, 10);
  const min_stock = parseInt(formData.get("min_stock") as string, 10);
  const unit = formData.get("unit") as string || "pcs";
  const badge = formData.get("badge") as string;
  const image_url = formData.get("image_url") as string;
  const is_active = formData.get("is_active") === "on";

  await prisma.product.update({
    where: { id },
    data: {
      name, sku, category, price, current_stock, min_stock, unit, badge, image_url, is_active
    }
  });

  revalidatePath("/admin/produk");
  revalidatePath("/admin/dashboard");
  redirect("/admin/produk");
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
