import pkg from '@prisma/client';
const { PrismaClient } = pkg;
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const adminEmail = 'admin@alettascarf.com';
  
  // Check if admin exists
  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail }
  });

  if (!existingAdmin) {
    const password_hash = await bcrypt.hash('admin123', 10);
    await prisma.user.create({
      data: {
        email: adminEmail,
        password_hash,
        name: 'Aletta Owner',
      }
    });
    console.log('Admin user created: admin@alettascarf.com / admin123');
  } else {
    console.log('Admin user already exists.');
  }

  // Seed sample products
  const productsCount = await prisma.product.count();
  if (productsCount === 0) {
    await prisma.product.createMany({
      data: [
        {
          name: 'Hijab Medis Asha',
          sku: 'HJ-ASHA-01',
          category: 'Hijab Medis',
          price: 125000,
          current_stock: 50,
          min_stock: 10,
          badge: 'Best Seller',
          is_active: true
        },
        {
          name: 'Hijab Medis Naya',
          sku: 'HJ-NAYA-01',
          category: 'Hijab Medis',
          price: 135000,
          current_stock: 30,
          min_stock: 10,
          badge: 'New',
          is_active: true
        },
        {
          name: 'Ciput Rajut Premium',
          sku: 'CP-PREM-01',
          category: 'Ciput',
          price: 35000,
          current_stock: 100,
          min_stock: 20,
          is_active: true
        }
      ]
    });
    console.log('Sample products created.');
  }
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
