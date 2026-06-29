import { Navbar } from "@/components/storefront/Navbar";
import { Footer } from "@/components/storefront/Footer";
import { MiniCart } from "@/components/storefront/MiniCart";
import { FloatingWhatsApp } from "@/components/storefront/FloatingWhatsApp";
import { MobileStickyCart } from "@/components/storefront/MobileStickyCart";
import { prisma } from "@/lib/prisma";

export default async function StorefrontLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const setting = await prisma.storeSetting.findFirst();
  const whatsapp = setting?.whatsapp_number || "6281234567890";

  return (
    <>
      <Navbar />
      <MiniCart />
      <main className="flex-1 flex flex-col">
        {children}
      </main>
      <Footer />
      <FloatingWhatsApp phoneNumber={whatsapp} />
      <MobileStickyCart />
    </>
  );
}
