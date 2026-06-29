"use client";

import { Trash2 } from "lucide-react";
import { useTransition } from "react";

export function DeleteProductButton({ id, onDelete }: { id: number, onDelete: (id: number) => Promise<void> }) {
  const [isPending, startTransition] = useTransition();

  return (
    <button
      disabled={isPending}
      className="p-2 text-red-600 hover:bg-red-50 rounded-md transition-colors disabled:opacity-50"
      title="Hapus Produk"
      onClick={() => {
        if (confirm("Yakin ingin menghapus produk ini?")) {
          startTransition(() => {
            onDelete(id);
          });
        }
      }}
    >
      <Trash2 size={18} />
    </button>
  );
}
