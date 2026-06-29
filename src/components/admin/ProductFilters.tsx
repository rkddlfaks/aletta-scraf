"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useState, useEffect } from "react";
import { Search, Filter, Layers, AlertCircle } from "lucide-react";

export function ProductFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Local state for immediate UI feedback before URL updates
  const [query, setQuery] = useState(searchParams.get("q") || "");
  const [category, setCategory] = useState(searchParams.get("category") || "");
  const [status, setStatus] = useState(searchParams.get("status") || "");
  const [stock, setStock] = useState(searchParams.get("stock") || "");

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      updateFilters({ q: query, category, status, stock });
    }, 500); // 500ms debounce
    return () => clearTimeout(timer);
  }, [query]);

  const handleDropdownChange = (name: string, value: string) => {
    if (name === "category") setCategory(value);
    if (name === "status") setStatus(value);
    if (name === "stock") setStock(value);

    updateFilters({ 
      q: query, 
      category: name === "category" ? value : category,
      status: name === "status" ? value : status,
      stock: name === "stock" ? value : stock,
    });
  };

  const updateFilters = useCallback(
    (params: { q: string; category: string; status: string; stock: string }) => {
      const current = new URLSearchParams(Array.from(searchParams.entries()));
      
      if (params.q) current.set("q", params.q);
      else current.delete("q");

      if (params.category) current.set("category", params.category);
      else current.delete("category");

      if (params.status) current.set("status", params.status);
      else current.delete("status");

      if (params.stock) current.set("stock", params.stock);
      else current.delete("stock");

      const search = current.toString();
      const queryString = search ? `?${search}` : "";
      router.push(`/admin/produk${queryString}`);
    },
    [router, searchParams]
  );

  return (
    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4 mb-6">
      {/* Search Input */}
      <div className="relative flex-1 min-w-[200px]">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search size={18} className="text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Cari produk atau SKU..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-300 focus:border-pink-300 outline-none transition-all text-sm"
        />
      </div>

      {/* Filters Container */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Category Dropdown */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Layers size={16} className="text-gray-400" />
          </div>
          <select
            value={category}
            onChange={(e) => handleDropdownChange("category", e.target.value)}
            className="w-full sm:w-44 pl-9 pr-8 py-2 border border-gray-200 rounded-lg appearance-none bg-white focus:ring-2 focus:ring-pink-300 focus:border-pink-300 outline-none transition-all text-sm text-gray-700 cursor-pointer"
          >
            <option value="">Semua Kategori</option>
            <option value="Mukena Premium">Mukena Premium</option>
            <option value="Hijab Medis">Hijab Medis</option>
            <option value="Ciput">Ciput</option>
            <option value="Ikat Rambut">Ikat Rambut</option>
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none text-gray-400">
            <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" /></svg>
          </div>
        </div>

        {/* Status Dropdown */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Filter size={16} className="text-gray-400" />
          </div>
          <select
            value={status}
            onChange={(e) => handleDropdownChange("status", e.target.value)}
            className="w-full sm:w-36 pl-9 pr-8 py-2 border border-gray-200 rounded-lg appearance-none bg-white focus:ring-2 focus:ring-pink-300 focus:border-pink-300 outline-none transition-all text-sm text-gray-700 cursor-pointer"
          >
            <option value="">Semua Status</option>
            <option value="active">Aktif</option>
            <option value="inactive">Nonaktif</option>
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none text-gray-400">
            <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" /></svg>
          </div>
        </div>

        {/* Stock Dropdown */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <AlertCircle size={16} className="text-gray-400" />
          </div>
          <select
            value={stock}
            onChange={(e) => handleDropdownChange("stock", e.target.value)}
            className="w-full sm:w-36 pl-9 pr-8 py-2 border border-gray-200 rounded-lg appearance-none bg-white focus:ring-2 focus:ring-pink-300 focus:border-pink-300 outline-none transition-all text-sm text-gray-700 cursor-pointer"
          >
            <option value="">Semua Stok</option>
            <option value="low">Stok Menipis</option>
            <option value="safe">Stok Aman</option>
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none text-gray-400">
            <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" /></svg>
          </div>
        </div>
      </div>
    </div>
  );
}
