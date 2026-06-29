"use client";

import { useCartStore } from "@/store/useCartStore";
import Link from "next/link";
import { ArrowLeft, Trash2, Minus, Plus, ShoppingBag, AlertCircle } from "lucide-react";
import { useState, useEffect } from "react";
import { CheckoutModal } from "@/components/storefront/CheckoutModal";

export default function CartPage() {
  const { items, updateQuantity, removeItem, removeItems, clearCart, getTotalPrice } = useCartStore();
  const [mounted, setMounted] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(new Set(items.map((item) => item.product.id)));
    } else {
      setSelectedIds(new Set());
    }
  };

  const handleSelectItem = (id: number, checked: boolean) => {
    const newSelected = new Set(selectedIds);
    if (checked) {
      newSelected.add(id);
    } else {
      newSelected.delete(id);
    }
    setSelectedIds(newSelected);
  };

  const handleDeleteSelected = () => {
    if (selectedIds.size === 0) return;
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    removeItems(Array.from(selectedIds));
    setSelectedIds(new Set());
    setShowDeleteModal(false);
  };

  const [showCheckoutModal, setShowCheckoutModal] = useState(false);

  const handleCheckoutClick = () => {
    if (items.length === 0) return;
    setShowCheckoutModal(true);
  };

  if (!mounted) return null;

  const isAllSelected = items.length > 0 && selectedIds.size === items.length;

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/produk" className="text-gray-500 hover:text-pink-700 transition-colors">
            <ArrowLeft size={24} />
          </Link>
          <h1 className="text-3xl font-serif font-bold text-gray-900">Keranjang Belanja</h1>
        </div>

        {items.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <div className="w-20 h-20 bg-pink-50 rounded-full flex items-center justify-center text-pink-300 mx-auto mb-6">
              <ShoppingBag size={40} />
            </div>
            <h2 className="text-xl font-medium text-gray-900 mb-2">Keranjang Anda Kosong</h2>
            <p className="text-gray-500 mb-8">Belum ada produk di dalam keranjang belanja Anda.</p>
            <Link href="/produk" className="bg-pink-700 hover:bg-pink-800 text-white px-8 py-3 rounded-full font-medium transition-colors">
              Mulai Belanja
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              {/* Batch Actions Bar */}
              <div className="bg-white px-4 py-3 sm:px-6 rounded-xl shadow-sm border border-gray-200 flex items-center justify-between">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={isAllSelected}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    className="w-5 h-5 text-pink-600 focus:ring-pink-500 border-gray-300 rounded cursor-pointer"
                  />
                  <span className="text-sm font-medium text-gray-700">Pilih Semua ({items.length})</span>
                </label>

                {selectedIds.size > 0 && (
                  <button 
                    onClick={handleDeleteSelected}
                    className="text-sm text-red-600 hover:text-red-700 font-medium flex items-center gap-1.5 transition-colors"
                  >
                    <Trash2 size={16} />
                    Hapus Terpilih ({selectedIds.size})
                  </button>
                )}
              </div>

              {/* Cart Items */}
              {items.map((item) => (
                <div key={item.product.id} className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-200 flex flex-col sm:flex-row gap-4 sm:gap-6">
                  
                  <div className="flex items-center sm:items-start gap-4 sm:gap-6 w-full sm:w-auto">
                    {/* Item Checkbox */}
                    <input 
                      type="checkbox" 
                      checked={selectedIds.has(item.product.id)}
                      onChange={(e) => handleSelectItem(item.product.id, e.target.checked)}
                      className="w-5 h-5 text-pink-600 focus:ring-pink-500 border-gray-300 rounded cursor-pointer mt-1"
                    />

                    {/* Image Placeholder */}
                    <div className="w-20 h-20 sm:w-24 sm:h-24 bg-pink-50 rounded-lg flex-shrink-0 flex items-center justify-center overflow-hidden">
                      {item.product.image_url ? (
                        <img src={item.product.image_url} alt={item.product.name} className="w-full h-full object-cover" />
                      ) : (
                        <span className="font-serif text-xs font-bold text-pink-200 opacity-50">ALETTA</span>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex-1 flex flex-col justify-between mt-2 sm:mt-0">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-bold text-gray-900 text-lg leading-tight">{item.product.name}</h3>
                        <p className="text-sm text-gray-500 mt-1">{item.product.category}</p>
                      </div>
                      <button 
                        onClick={() => removeItem(item.product.id)}
                        className="text-gray-400 hover:text-red-500 transition-colors p-1 hidden sm:block"
                        title="Hapus"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                    
                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden bg-white">
                        <button 
                          onClick={() => updateQuantity(item.product.id, Math.max(1, item.quantity - 1))}
                          className="px-3 py-1.5 text-gray-600 hover:bg-gray-50 transition-colors"
                        >
                          <Minus size={16} />
                        </button>
                        <span className="px-4 py-1.5 text-sm font-medium min-w-[3rem] text-center border-x border-gray-200">
                          {item.quantity}
                        </span>
                        <button 
                          onClick={() => {
                            if (item.quantity < item.product.current_stock) {
                              updateQuantity(item.product.id, item.quantity + 1);
                            } else {
                              alert(`Maksimal stok yang tersedia adalah ${item.product.current_stock}`);
                            }
                          }}
                          className="px-3 py-1.5 text-gray-600 hover:bg-gray-50 transition-colors"
                        >
                          <Plus size={16} />
                        </button>
                      </div>
                      <p className="font-bold text-pink-700">
                        Rp {(item.product.price * item.quantity).toLocaleString("id-ID")}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 sticky top-24">
                <h3 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-4 mb-4">Ringkasan Belanja</h3>
                
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-gray-600">
                    <span>Total Harga ({items.reduce((acc, item) => acc + item.quantity, 0)} Barang)</span>
                    <span>Rp {getTotalPrice().toLocaleString("id-ID")}</span>
                  </div>
                </div>
                
                <div className="border-t border-gray-100 pt-4 mb-6">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-gray-900">Total Belanja</span>
                    <span className="font-bold text-xl text-pink-700">Rp {getTotalPrice().toLocaleString("id-ID")}</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-2 text-right">Belum termasuk ongkos kirim</p>
                </div>
                
                <button 
                  onClick={handleCheckoutClick}
                  className="w-full bg-pink-700 hover:bg-pink-800 text-white py-3 rounded-xl font-bold transition-colors flex items-center justify-center gap-2 shadow-lg"
                >
                  Lanjutkan Checkout
                </button>
                
                <button 
                  onClick={clearCart}
                  className="w-full mt-3 py-2 text-sm text-gray-500 hover:text-gray-700 font-medium transition-colors"
                >
                  Kosongkan Semua Keranjang
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <CheckoutModal 
        isOpen={showCheckoutModal} 
        onClose={() => setShowCheckoutModal(false)} 
      />

      {/* Custom Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 animate-in zoom-in-95 duration-200">
            <div className="w-12 h-12 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-4">
              <AlertCircle size={24} />
            </div>
            <h3 className="text-xl font-serif font-bold text-gray-900 mb-2">Hapus Produk?</h3>
            <p className="text-gray-600 mb-6 leading-relaxed">
              Apakah Anda yakin ingin menghapus <b>{selectedIds.size} produk</b> yang telah Anda pilih dari keranjang belanja?
            </p>
            <div className="flex gap-3 justify-end">
              <button 
                onClick={() => setShowDeleteModal(false)}
                className="px-5 py-2.5 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors"
              >
                Batal
              </button>
              <button 
                onClick={confirmDelete}
                className="px-5 py-2.5 rounded-lg text-sm font-medium bg-red-600 text-white hover:bg-red-700 transition-colors"
              >
                Ya, Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
