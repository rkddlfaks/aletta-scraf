import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  try {
    const res = await prisma.product.create({
      data: {
        name: "Test",
        sku: "TEST-01",
        category: "Test",
        price: 100,
        cost: 50,
        current_stock: 10,
        min_stock: 1,
        unit: "pcs",
        badge: "New",
        image_url: "https://example.com/test.jpg",
        description: "Test description",
        is_active: true,
        images: {
          create: [{ url: "https://example.com/test.jpg", is_primary: true }]
        }
      }
    });
    console.log("Success:", res);
    
    // Clean up
    await prisma.product.delete({ where: { id: res.id } });
  } catch (err) {
    console.error("Error creating:", err);
  } finally {
    await prisma.$disconnect();
  }
}
main();
