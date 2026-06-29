"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

export function CartTransitionOverlay() {
  const pathname = usePathname();
  const [prevPath, setPrevPath] = useState(pathname);
  const [isExitingCart, setIsExitingCart] = useState(false);

  useEffect(() => {
    if (prevPath === "/keranjang" && pathname !== "/keranjang") {
      setIsExitingCart(true);
      const timer = setTimeout(() => setIsExitingCart(false), 800);
      return () => clearTimeout(timer);
    }
    setPrevPath(pathname);
  }, [pathname, prevPath]);

  return (
    <AnimatePresence>
      {isExitingCart && (
        <motion.div
          initial={{ clipPath: "circle(150% at 92% 45px)", opacity: 1 }}
          animate={{ clipPath: "circle(0% at 92% 45px)", opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7, ease: [0.25, 1, 0.5, 1] }}
          className="fixed inset-0 z-[100] bg-pink-200/40 backdrop-blur-md pointer-events-none shadow-2xl"
        />
      )}
    </AnimatePresence>
  );
}
