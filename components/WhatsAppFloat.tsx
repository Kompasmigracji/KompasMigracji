'use client';
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const WA_URL = "https://wa.me/48729271848?text=Потребую+допомоги+з+міграційним+питанням+в+Польщі";

export default function WhatsAppFloat() {
  const [visible, setVisible] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => {
      setVisible(true);
      setShowTooltip(true);
    }, 4000);
    const t2 = setTimeout(() => setShowTooltip(false), 10000);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, x: -50, scale: 0.8 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ type: "spring", damping: 20, stiffness: 200 }}
          className="fixed bottom-24 left-5 sm:left-8 z-[55] flex flex-row-reverse items-center gap-3 pointer-events-none"
        >
          <AnimatePresence>
            {showTooltip && (
              <motion.div
                initial={{ opacity: 0, x: -20, scale: 0.9 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: -10, scale: 0.9 }}
                className="bg-[#0f1115]/90 backdrop-blur-xl border border-black/10 rounded-2xl p-3 shadow-2xl pointer-events-auto"
              >
                <div className="font-bold text-gray-900 text-sm whitespace-nowrap">Потрібна допомога?</div>
                <div className="text-xs text-green-400 mt-0.5">Відповідаємо протягом 2 год</div>
              </motion.div>
            )}
          </AnimatePresence>

          <motion.a
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            href={WA_URL}
            target="_blank"
            rel="noreferrer"
            aria-label="Написати нам у WhatsApp"
            className="group relative flex items-center gap-2.5 bg-[#25D366] text-gray-900 rounded-full px-5 py-3 shadow-[0_0_20px_rgba(37,211,102,0.3)] pointer-events-auto overflow-hidden no-underline"
          >
            {/* Glow ring */}
            <div className="absolute inset-0 rounded-full border-2 border-black/20 opacity-0 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500" />
            
            {/* Shimmer */}
            <div className="absolute inset-0 w-full h-full transform -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent animate-[shimmer_3s_infinite]" />
            
            {/* Ambient Pulse */}
            <div className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-20 group-hover:opacity-0 transition-opacity" />

            <svg width={22} height={22} viewBox="0 0 24 24" fill="currentColor" className="relative z-10 drop-shadow-md">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347" />
            </svg>
            <span className="relative z-10 font-bold text-[15px] whitespace-nowrap drop-shadow-md">Написати зараз</span>
          </motion.a>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
