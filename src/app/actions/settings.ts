"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function updateStoreSettings(formData: FormData) {
  const promo_text = formData.get("promo_text") as string;
  const whatsapp_number = formData.get("whatsapp_number") as string;
  const is_promo_active = formData.get("is_promo_active") === "on";

  try {
    const setting = await prisma.storeSetting.findFirst();

    if (setting) {
      await prisma.storeSetting.update({
        where: { id: setting.id },
        data: { promo_text, whatsapp_number, is_promo_active }
      });
    } else {
      await prisma.storeSetting.create({
        data: { promo_text, whatsapp_number, is_promo_active }
      });
    }

    revalidatePath("/");
    revalidatePath("/admin/pengaturan");
    return { success: true };
  } catch (error) {
    console.error("Failed to update store settings:", error);
    return { success: false, error: "Gagal menyimpan pengaturan" };
  }
}
