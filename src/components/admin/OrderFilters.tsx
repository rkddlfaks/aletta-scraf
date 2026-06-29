"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useState, useEffect } from "react";
import { Search, Filter, Calendar } from "lucide-react";

export function OrderFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Local state for immediate UI feedback before URL updates
  const [query, setQuery] = useState(searchParams.get("q") || "");
  const [status, setStatus] = useState(searchParams.get("status") || "");
  const [dateRange, setDateRange] = useState(searchParams.get("date") || "");
  const [customDate, setCustomDate] = useState(searchParams.get("customDate") || "");

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      updateFilters({ q: query, status, date: dateRange, customDate });
    }, 500); // 500ms debounce
    return () => clearTimeout(timer);
  }, [query, customDate]); // Trigger on query or customDate change

  // Handle dropdown changes instantly
  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value;
    setStatus(newStatus);
    updateFilters({ q: query, status: newStatus, date: dateRange, customDate });
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newDate = e.target.value;
    setDateRange(newDate);
    updateFilters({ q: query, status, date: newDate, customDate });
  };

  const updateFilters = useCallback(
    (params: { q: string; status: string; date: string; customDate: string }) => {
      const current = new URLSearchParams(Array.from(searchParams.entries()));
      
      if (params.q) current.set("q", params.q);
      else current.delete("q");

      if (params.status) current.set("status", params.status);
      else current.delete("status");

      if (params.date) current.set("date", params.date);
      else current.delete("date");

      if (params.date === "custom" && params.customDate) {
        current.set("customDate", params.customDate);
      } else {
        current.delete("customDate");
      }

      const search = current.toString();
      const queryStr = search ? `?${search}` : "";
      router.push(`/admin/pesanan${queryStr}`);
    },
    [router, searchParams]
  );

  return (
    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4 mb-6">
      {/* Search Input */}
      <div className="relative flex-1">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search size={18} className="text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Cari nama atau no. pesanan..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-300 focus:border-pink-300 outline-none transition-all text-sm"
        />
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Status Dropdown */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Filter size={16} className="text-gray-400" />
          </div>
          <select
            value={status}
            onChange={handleStatusChange}
            className="w-full sm:w-48 pl-9 pr-8 py-2 border border-gray-200 rounded-lg appearance-none bg-white focus:ring-2 focus:ring-pink-300 focus:border-pink-300 outline-none transition-all text-sm text-gray-700 cursor-pointer"
          >
            <option value="">Semua Status</option>
            <option value="PENDING">Menunggu</option>
            <option value="PAID">Lunas</option>
            <option value="PROCESSING">Diproses</option>
            <option value="SHIPPED">Dikirim</option>
            <option value="COMPLETED">Selesai</option>
            <option value="CANCELLED">Dibatalkan</option>
          </select>
          {/* Custom Arrow */}
          <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none text-gray-400">
            <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
              <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
            </svg>
          </div>
        </div>

        {/* Date Dropdown */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Calendar size={16} className="text-gray-400" />
          </div>
          <select
            value={dateRange}
            onChange={handleDateChange}
            className="w-full sm:w-48 pl-9 pr-8 py-2 border border-gray-200 rounded-lg appearance-none bg-white focus:ring-2 focus:ring-pink-300 focus:border-pink-300 outline-none transition-all text-sm text-gray-700 cursor-pointer"
          >
            <option value="">Semua Waktu</option>
            <option value="today">Hari Ini</option>
            <option value="7days">7 Hari Terakhir</option>
            <option value="thismonth">Bulan Ini</option>
            <option value="custom">Pilih Tanggal</option>
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none text-gray-400">
            <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
              <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
            </svg>
          </div>
        </div>
        
        {/* Custom Date Picker (shows only if dateRange === 'custom') */}
        {dateRange === "custom" && (
          <div className="relative animate-in fade-in slide-in-from-left-2 duration-300">
            <input
              type="date"
              value={customDate}
              onChange={(e) => setCustomDate(e.target.value)}
              className="w-full sm:w-40 px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-300 focus:border-pink-300 outline-none transition-all text-sm text-gray-700"
            />
          </div>
        )}
      </div>
    </div>
  );
}
