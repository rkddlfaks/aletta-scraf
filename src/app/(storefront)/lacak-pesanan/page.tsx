"use client";

import { useState } from "react";
import { trackOrder } from "@/app/actions/track-order";
import { uploadPaymentProof } from "@/app/actions/upload-proof";
import { submitTestimonial } from "@/app/actions/submit-testimonial";
import { Search, Package, Clock, CheckCircle, Truck, AlertTriangle, UploadCloud, Loader2, Star, MessageSquareHeart } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function TrackOrderPage() {
  const [orderNumber, setOrderNumber] = useState("");
  const [phone, setPhone] = useState("");
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [order, setOrder] = useState<any>(null);

  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [uploadSuccess, setUploadSuccess] = useState(false);

  // Review state
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewData, setReviewData] = useState({ rating: 5, content: "", role: "" });
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [reviewMessage, setReviewMessage] = useState({ type: "", text: "" });

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setOrder(null);
    setUploadSuccess(false);
    setUploadError("");

    const res = await trackOrder(orderNumber, phone);
    if (res.success) {
      setOrder(res.order);
    } else {
      setError(res.error || "Gagal melacak pesanan");
    }
    setIsLoading(false);
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!order) return;
    setIsSubmittingReview(true);
    setReviewMessage({ type: "", text: "" });

    const res = await submitTestimonial({
      order_number: order.order_number,
      rating: reviewData.rating,
      content: reviewData.content,
      role: reviewData.role
    });

    if (res.success) {
      setReviewMessage({ type: "success", text: "Terima kasih banyak atas ulasan yang Anda berikan!" });
      setShowReviewForm(false);
      setOrder({ ...order, has_testimonial: true });
    } else {
      setReviewMessage({ type: "error", text: res.error || "Gagal mengirim ulasan." });
    }
    setIsSubmittingReview(false);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !order) return;
    
    // Check file type and size (max 5MB)
    if (!file.type.startsWith('image/')) {
      setUploadError("Hanya file gambar (JPG/PNG) yang diperbolehkan.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setUploadError("Ukuran file maksimal 5MB.");
      return;
    }

    setIsUploading(true);
    setUploadError("");
    setUploadSuccess(false);

    const formData = new FormData();
    formData.append("order_number", order.order_number);
    formData.append("customer_phone", phone);
    formData.append("file", file);

    const res = await uploadPaymentProof(formData);
    if (res.success) {
      setUploadSuccess(true);
      setOrder({ ...order, payment_proof: res.url });
    } else {
      setUploadError(res.error || "Gagal mengunggah foto.");
    }
    
    setIsUploading(false);
  };

  const getStatusDisplay = (status: string) => {
    switch(status) {
      case "PENDING": return { label: "Menunggu Pembayaran", color: "bg-amber-100 text-amber-700 border-amber-200", icon: <Clock size={20} /> };
      case "PAID": return { label: "Lunas (Menunggu Dikirim)", color: "bg-blue-100 text-blue-700 border-blue-200", icon: <CheckCircle size={20} /> };
      case "PROCESSING": return { label: "Sedang Diproses", color: "bg-indigo-100 text-indigo-700 border-indigo-200", icon: <Package size={20} /> };
      case "SHIPPED": return { label: "Sedang Dikirim", color: "bg-purple-100 text-purple-700 border-purple-200", icon: <Truck size={20} /> };
      case "COMPLETED": return { label: "Selesai", color: "bg-emerald-100 text-emerald-700 border-emerald-200", icon: <CheckCircle size={20} /> };
      case "CANCELLED": return { label: "Dibatalkan", color: "bg-red-100 text-red-700 border-red-200", icon: <AlertTriangle size={20} /> };
      default: return { label: status, color: "bg-gray-100 text-gray-700 border-gray-200", icon: <Package size={20} /> };
    }
  };

  return (
    <div className="min-h-screen bg-pink-50/30 pt-32 pb-24">
      <div className="container mx-auto px-4 max-w-2xl">
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-pink-950 mb-3">Lacak Pesanan</h1>
          <p className="text-pink-900/60">Masukkan Nomor Invoice dan No. WhatsApp Anda untuk melihat status pengiriman.</p>
        </div>

        {/* Search Form */}
        <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-pink-100 mb-8">
          <form onSubmit={handleTrack} className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-pink-950 mb-1.5">Nomor Invoice</label>
              <input 
                type="text" 
                value={orderNumber}
                onChange={e => setOrderNumber(e.target.value)}
                placeholder="Contoh: ALT-A9X2F"
                className="w-full px-4 py-3 rounded-xl border border-pink-100 bg-pink-50/50 outline-none focus:ring-2 focus:ring-pink-300 transition-all font-mono"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-pink-950 mb-1.5">Nomor WhatsApp</label>
              <input 
                type="text" 
                value={phone}
                onChange={e => setPhone(e.target.value)}
                placeholder="Contoh: 08123456789"
                className="w-full px-4 py-3 rounded-xl border border-pink-100 bg-pink-50/50 outline-none focus:ring-2 focus:ring-pink-300 transition-all"
                required
              />
            </div>
            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full bg-pink-700 hover:bg-pink-800 text-white font-bold py-3.5 rounded-xl transition-all shadow-md shadow-pink-700/20 flex items-center justify-center gap-2 mt-2 disabled:opacity-70"
            >
              {isLoading ? <Loader2 className="animate-spin" size={20} /> : <Search size={20} />}
              {isLoading ? "Mencari..." : "Lacak Sekarang"}
            </button>
          </form>

          <AnimatePresence>
            {error && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 p-4 bg-red-50 text-red-600 rounded-xl border border-red-100 text-sm font-medium flex items-center gap-2"
              >
                <AlertTriangle size={18} /> {error}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Order Result */}
        <AnimatePresence>
          {order && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-3xl shadow-lg shadow-pink-900/5 border border-pink-100 overflow-hidden"
            >
              <div className="p-6 md:p-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-6 border-b border-pink-50">
                  <div>
                    <div className="text-sm font-bold text-pink-900/40 mb-1 uppercase tracking-wider">Nomor Invoice</div>
                    <div className="text-xl font-mono font-black text-pink-950">{order.order_number}</div>
                  </div>
                  <div className={`px-4 py-2 rounded-full border flex items-center gap-2 font-bold w-fit ${getStatusDisplay(order.status).color}`}>
                    {getStatusDisplay(order.status).icon}
                    {getStatusDisplay(order.status).label}
                  </div>
                </div>

                {/* Tracking Info if Shipped */}
                {order.tracking_number && (
                  <div className="bg-indigo-50 border border-indigo-100 p-5 rounded-2xl mb-6">
                    <h3 className="font-bold text-indigo-900 mb-2 flex items-center gap-2">
                      <Truck size={18} /> Info Pengiriman
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-xs text-indigo-700/60 font-bold mb-1 uppercase tracking-wider">Ekspedisi</div>
                        <div className="font-medium text-indigo-900">{order.shipping_provider}</div>
                      </div>
                      <div>
                        <div className="text-xs text-indigo-700/60 font-bold mb-1 uppercase tracking-wider">Nomor Resi</div>
                        <div className="font-mono font-bold text-indigo-900 text-lg">{order.tracking_number}</div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Items */}
                <div className="mb-6">
                  <h3 className="font-bold text-pink-950 mb-3">Daftar Belanja</h3>
                  <div className="space-y-3">
                    {order.items.map((item: any, i: number) => (
                      <div key={i} className="flex justify-between items-center text-sm bg-pink-50/50 p-3 rounded-xl border border-pink-50">
                        <span className="font-medium text-pink-900">{item.name}</span>
                        <span className="font-bold text-pink-700 bg-pink-100 px-2 py-0.5 rounded-md">{item.quantity}x</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-between items-center pt-4 border-t border-pink-50 mb-8">
                  <span className="font-bold text-pink-900/60">Total Pembayaran</span>
                  <span className="text-2xl font-black text-pink-950">Rp {order.total_amount.toLocaleString('id-ID')}</span>
                </div>

                {/* Upload Payment Proof Section */}
                {order.status === "PENDING" && (
                  <div className="bg-amber-50 border border-amber-200 p-6 rounded-2xl">
                    <h3 className="font-bold text-amber-900 mb-2 flex items-center gap-2">
                      <Clock size={18} /> Menunggu Pembayaran
                    </h3>
                    <p className="text-sm text-amber-800/80 mb-4">
                      Silakan lakukan pembayaran sesuai total di atas. Jika sudah, unggah foto bukti transfer di bawah ini agar pesanan Anda segera diproses.
                    </p>
                    
                    {order.payment_proof ? (
                      <div className="bg-white p-4 rounded-xl border border-amber-100 flex items-center gap-3 text-green-700 font-medium">
                        <CheckCircle size={20} className="text-green-500" />
                        Bukti pembayaran sudah diunggah. Menunggu verifikasi admin.
                      </div>
                    ) : (
                      <div>
                        <input 
                          type="file" 
                          id="proof-upload" 
                          className="hidden" 
                          accept="image/*"
                          onChange={handleFileUpload}
                          disabled={isUploading}
                        />
                        <label 
                          htmlFor="proof-upload"
                          className={`flex items-center justify-center gap-2 w-full py-3 px-4 bg-white border-2 border-dashed border-amber-300 text-amber-700 rounded-xl font-bold cursor-pointer hover:bg-amber-100 transition-colors ${isUploading ? 'opacity-50 pointer-events-none' : ''}`}
                        >
                          {isUploading ? <Loader2 className="animate-spin" size={20} /> : <UploadCloud size={20} />}
                          {isUploading ? "Mengunggah..." : "Unggah Bukti Transfer"}
                        </label>
                        
                        {uploadError && <p className="text-red-500 text-xs mt-2 font-medium">{uploadError}</p>}
                        {uploadSuccess && <p className="text-green-600 text-xs mt-2 font-medium">Berhasil diunggah!</p>}
                      </div>
                    )}
                  </div>
                )}

                {/* Testimonial Section */}
                {order.status === "COMPLETED" && (
                  <div className="bg-pink-50 border border-pink-100 p-6 rounded-2xl mt-8">
                    {!order.has_testimonial ? (
                      !showReviewForm ? (
                        <div className="text-center">
                          <h3 className="font-bold text-pink-900 mb-2">Bagaimana pesanan Anda?</h3>
                          <p className="text-sm text-pink-700/80 mb-4">Ulasan Anda sangat berarti bagi kami dan pelanggan lainnya.</p>
                          <button 
                            onClick={() => setShowReviewForm(true)}
                            className="bg-pink-700 hover:bg-pink-800 text-white font-bold py-2.5 px-6 rounded-xl transition-colors inline-flex items-center gap-2"
                          >
                            <Star size={18} /> Beri Ulasan Sekarang
                          </button>
                        </div>
                      ) : (
                        <form onSubmit={handleSubmitReview} className="space-y-4 animate-in fade-in zoom-in-95 duration-300 text-left">
                          <div className="flex justify-between items-center mb-2">
                            <h3 className="font-bold text-pink-950 flex items-center gap-2">
                              <MessageSquareHeart size={20} className="text-pink-600" /> Tulis Ulasan Anda
                            </h3>
                            <button type="button" onClick={() => setShowReviewForm(false)} className="text-sm text-pink-500 hover:text-pink-700">Batal</button>
                          </div>
                          
                          <div>
                            <label className="block text-sm font-bold text-pink-900 mb-1.5">Rating</label>
                            <div className="flex gap-2">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                  key={star}
                                  type="button"
                                  onClick={() => setReviewData({...reviewData, rating: star})}
                                  className="focus:outline-none"
                                >
                                  <Star 
                                    size={28} 
                                    className={`transition-colors ${star <= reviewData.rating ? "fill-amber-400 text-amber-400" : "text-gray-300"}`} 
                                  />
                                </button>
                              ))}
                            </div>
                          </div>
                          
                          <div>
                            <label className="block text-sm font-bold text-pink-900 mb-1.5">Profesi / Peran (Opsional)</label>
                            <input 
                              type="text" 
                              value={reviewData.role}
                              onChange={e => setReviewData({...reviewData, role: e.target.value})}
                              placeholder="Cth: Dokter Umum, Perawat IGD..."
                              className="w-full px-4 py-2.5 rounded-xl border border-pink-200 focus:ring-2 focus:ring-pink-500 outline-none transition-all"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-bold text-pink-900 mb-1.5">Kesan & Pesan *</label>
                            <textarea 
                              required
                              value={reviewData.content}
                              onChange={e => setReviewData({...reviewData, content: e.target.value})}
                              rows={3}
                              placeholder="Bagaimana kualitas produk kami?"
                              className="w-full px-4 py-3 rounded-xl border border-pink-200 focus:ring-2 focus:ring-pink-500 outline-none transition-all resize-none"
                            />
                          </div>

                          <button 
                            type="submit" 
                            disabled={isSubmittingReview}
                            className="w-full bg-pink-950 hover:bg-pink-900 text-white font-bold py-3 rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
                          >
                            {isSubmittingReview ? <Loader2 className="animate-spin" size={20} /> : <CheckCircle size={20} />}
                            {isSubmittingReview ? "Mengirim..." : "Kirim Ulasan"}
                          </button>
                        </form>
                      )
                    ) : (
                      <div className="text-center text-green-700 font-medium flex flex-col items-center gap-2">
                        <CheckCircle size={32} className="text-green-500 mb-2" />
                        Terima kasih! Anda sudah memberikan ulasan untuk pesanan ini.
                      </div>
                    )}
                  </div>
                )}
                {reviewMessage.text && (
                  <p className={`text-sm text-center font-bold mt-4 ${reviewMessage.type === 'error' ? 'text-red-500' : 'text-green-600'}`}>
                    {reviewMessage.text}
                  </p>
                )}

              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
