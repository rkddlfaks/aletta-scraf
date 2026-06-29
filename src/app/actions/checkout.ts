"use server";

import { prisma } from "@/lib/prisma";

export interface CheckoutData {
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  shipping_address: string;
  city: string;
  postal_code: string;
  items: {
    product_id: number;
    quantity: number;
    price: number;
  }[];
  total_amount: number;
}

export async function createOrder(data: CheckoutData) {
  try {
    // Generate order number (e.g., ALT-A9X2F)
    const randomStr = Math.random().toString(36).substring(2, 7).toUpperCase();
    const orderNumber = `ALT-${randomStr}`;

    // Fetch latest products to get their cost prices
    const productIds = data.items.map(i => i.product_id);
    const products = await prisma.product.findMany({
      where: { id: { in: productIds } },
      select: { id: true, cost: true }
    });

    // Map products to their cost
    const costMap = products.reduce((acc, p) => {
      acc[p.id] = p.cost;
      return acc;
    }, {} as Record<number, number>);

    const order = await prisma.order.create({
      data: {
        order_number: orderNumber,
        customer_name: data.customer_name,
        customer_email: data.customer_email || null,
        customer_phone: data.customer_phone,
        shipping_address: data.shipping_address,
        city: data.city,
        postal_code: data.postal_code,
        total_amount: data.total_amount,
        status: "PENDING",
        items: {
          create: data.items.map(item => ({
            product_id: item.product_id,
            quantity: item.quantity,
            price: item.price,
            cost: costMap[item.product_id] || 0 // Store historical cost snapshot
          }))
        }
      }
    });

    return { success: true, orderId: order.id, orderNumber: order.order_number };
  } catch (error) {
    console.error("Failed to create order:", error);
    return { success: false, error: "Gagal membuat pesanan, silakan coba lagi." };
  }
}
