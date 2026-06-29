"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function toggleTestimonialApproval(id: number, currentStatus: boolean) {
  try {
    await prisma.testimonial.update({
      where: { id },
      data: { is_approved: !currentStatus }
    });
    
    revalidatePath("/admin/ulasan");
    revalidatePath("/");
    
    return { success: true };
  } catch (error) {
    console.error("Failed to toggle testimonial status:", error);
    return { success: false, error: "Gagal merubah status ulasan" };
  }
}

export async function deleteTestimonial(id: number) {
  try {
    await prisma.testimonial.delete({
      where: { id }
    });
    
    revalidatePath("/admin/ulasan");
    revalidatePath("/");
    
    return { success: true };
  } catch (error) {
    console.error("Failed to delete testimonial:", error);
    return { success: false, error: "Gagal menghapus ulasan" };
  }
}
