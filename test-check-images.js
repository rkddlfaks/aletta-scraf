import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function main() {
  const products = await prisma.product.findMany({ include: { images: true } });
  console.log(JSON.stringify(products.map(p => ({ id: p.id, name: p.name, imgCount: p.images.length })), null, 2));
  await prisma.$disconnect();
}
main();
