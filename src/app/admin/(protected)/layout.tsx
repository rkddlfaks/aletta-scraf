import { auth, signOut } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { LayoutDashboard, Package, LogOut } from "lucide-react";

export default async function ProtectedAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session) {
    redirect("/admin/login");
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-2xl font-serif font-bold text-pink-900">Aletta Scarf</h2>
          <p className="text-sm text-muted-foreground mt-1">Admin Panel</p>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          <Link 
            href="/admin/dashboard" 
            className="flex items-center gap-3 px-4 py-3 text-gray-700 rounded-lg hover:bg-pink-50 hover:text-pink-900 transition-colors"
          >
            <LayoutDashboard size={20} />
            <span className="font-medium">Dashboard</span>
          </Link>
          <Link 
            href="/admin/produk" 
            className="flex items-center gap-3 px-4 py-3 text-gray-700 rounded-lg hover:bg-pink-50 hover:text-pink-900 transition-colors"
          >
            <Package size={20} />
            <span className="font-medium">Manajemen Produk</span>
          </Link>
        </nav>

        <div className="p-4 border-t border-gray-200">
          <form action={async () => {
            "use server";
            await signOut({ redirectTo: "/admin/login" });
          }}>
            <button className="flex w-full items-center gap-3 px-4 py-3 text-red-600 rounded-lg hover:bg-red-50 transition-colors">
              <LogOut size={20} />
              <span className="font-medium">Logout</span>
            </button>
          </form>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        {children}
      </main>
    </div>
  );
}
