import { prisma } from "@/lib/prisma";
import { updateProduct } from "@/app/actions/product";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { notFound } from "next/navigation";
import { EditProductForm } from "@/components/admin/EditProductForm";

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const id = parseInt(resolvedParams.id, 10);
  const product = await prisma.product.findUnique({ 
    where: { id },
    include: { images: true }
  });

  if (!product) notFound();

  // We bind the ID to the server action to update the specific product
  const updateProductWithId = updateProduct.bind(null, id);

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/produk" className="text-gray-500 hover:text-pink-700 transition-colors">
          <ArrowLeft size={24} />
        </Link>
        <div>
          <h1 className="text-3xl font-serif font-bold text-gray-900">Edit Produk</h1>
          <p className="text-muted-foreground mt-1">Ubah detail produk {product.name}.</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <EditProductForm product={product} updateAction={updateProductWithId} />
      </div>
    </div>
  );
}
