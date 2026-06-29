"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Lock, ArrowRight, Loader2 } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (res?.error) {
        setError("Email atau password salah");
      } else {
        router.push("/admin/dashboard");
        router.refresh();
      }
    } catch (err) {
      setError("Terjadi kesalahan. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center bg-pink-50 overflow-hidden font-sans">
      {/* Animated Background Blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40vw] h-[40vw] bg-pink-300 rounded-full mix-blend-multiply filter blur-[100px] opacity-40 animate-blob"></div>
      <div className="absolute top-[20%] right-[-10%] w-[40vw] h-[40vw] bg-rose-200 rounded-full mix-blend-multiply filter blur-[100px] opacity-40 animate-blob animation-delay-2000"></div>
      <div className="absolute bottom-[-20%] left-[20%] w-[40vw] h-[40vw] bg-pink-400 rounded-full mix-blend-multiply filter blur-[100px] opacity-30 animate-blob animation-delay-4000"></div>

      {/* Login Card */}
      <motion.div 
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 w-full max-w-md px-4 sm:px-6"
      >
        <div className="bg-white/60 backdrop-blur-3xl p-8 sm:p-10 rounded-[2.5rem] shadow-[0_20px_60px_-15px_rgba(255,192,203,0.5),inset_0_1px_1px_rgba(255,255,255,1)] border border-white/80">
          
          <div className="text-center mb-10">
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, type: "spring", stiffness: 200, damping: 20 }}
              className="inline-flex items-center justify-center w-24 h-24 bg-white rounded-full shadow-md border border-pink-100 mb-6 relative overflow-hidden"
            >
              <img src="/logo.svg" alt="Aletta Scarf Logo" className="w-14 h-14 object-contain drop-shadow-sm" />
            </motion.div>
            <h1 className="text-3xl font-serif font-bold text-pink-900 mb-2">Aletta Scarf</h1>
            <p className="text-pink-700/70 font-medium tracking-wide text-sm uppercase">Portal Manajemen Admin</p>
          </div>

          <AnimatePresence>
            {error && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-red-50/80 backdrop-blur-md border border-red-100 text-red-600 px-4 py-3 rounded-2xl mb-6 text-sm text-center font-medium shadow-sm overflow-hidden"
              >
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-bold text-pink-900 mb-2 ml-1">Email Administrator</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-pink-400 group-focus-within:text-pink-600 transition-colors">
                  <Mail size={20} />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-11 pr-4 py-3.5 bg-white/70 border border-pink-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-pink-500/20 focus:border-pink-500 focus:bg-white transition-all text-gray-900 placeholder:text-gray-400 shadow-sm"
                  placeholder="admin@alettascarf.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-pink-900 mb-2 ml-1">Password</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-pink-400 group-focus-within:text-pink-600 transition-colors">
                  <Lock size={20} />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-11 pr-4 py-3.5 bg-white/70 border border-pink-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-pink-500/20 focus:border-pink-500 focus:bg-white transition-all text-gray-900 placeholder:text-gray-400 shadow-sm"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="w-full mt-8 bg-gradient-to-r from-pink-600 to-pink-800 hover:from-pink-700 hover:to-pink-900 text-white font-bold py-4 px-4 rounded-2xl transition-all disabled:opacity-70 disabled:cursor-not-allowed shadow-[0_8px_20px_rgba(219,39,119,0.3)] flex items-center justify-center gap-2 group"
            >
              {loading ? (
                <><Loader2 size={20} className="animate-spin" /> Memproses...</>
              ) : (
                <>Masuk ke Dashboard <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" /></>
              )}
            </motion.button>
          </form>
          
        </div>
        
        <p className="text-center text-pink-600/60 mt-8 text-sm font-medium">
          &copy; {new Date().getFullYear()} Aletta Scarf. All rights reserved.
        </p>
      </motion.div>
    </div>
  );
}
