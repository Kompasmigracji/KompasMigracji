"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence, useMotionValue, useMotionTemplate } from "framer-motion";

const STORAGE_KEY = "km_exit_popup_shown";

export default function ExitPopup() {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const t = useTranslations("ExitPopup");
  const cardRef = useRef<HTMLDivElement>(null);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const spotlightBackground = useMotionTemplate`radial-gradient(400px circle at ${mouseX}px ${mouseY}px, rgba(59,130,246,0.5), transparent 80%)`;

  const show = useCallback(() => {
    if (typeof window !== "undefined" && sessionStorage.getItem(STORAGE_KEY)) return;
    setOpen(true);
    if (typeof window !== "undefined") sessionStorage.setItem(STORAGE_KEY, "1");
  }, []);

  useEffect(() => {
    const onLeave = (e: MouseEvent) => {
      if (e.clientY <= 0) show();
    };
    const timer = setTimeout(show, 40000);
    document.addEventListener("mouseleave", onLeave);
    return () => {
      document.removeEventListener("mouseleave", onLeave);
      clearTimeout(timer);
    };
  }, [show]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const { left, top } = cardRef.current.getBoundingClientRect();
    mouseX.set(e.clientX - left);
    mouseY.set(e.clientY - top);
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setLoading(true);
    try {
      await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim() || "Klient",
          contact: email.trim(),
          source: "exit_popup",
          situation: "Безкоштовна консультація — вихідне вікно",
        }),
      });
      setSent(true);
    } catch {}
    setLoading(false);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md"
          onClick={e => { if (e.target === e.currentTarget) setOpen(false); }}
        >
          <motion.div
            ref={cardRef}
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            onMouseMove={handleMouseMove}
            className="relative w-full max-w-md bg-white rounded-3xl overflow-hidden border border-black/10 shadow-[0_30px_100px_rgba(0,0,0,0.1)]"
          >
            {/* Spotlight */}
            <motion.div
              className="absolute inset-0 z-0 pointer-events-none opacity-20"
              style={{ background: spotlightBackground }}
            />

            <div className="relative z-10 p-8">
              <button
                onClick={() => setOpen(false)}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/60 flex items-center justify-center text-gray-500 hover:text-white hover:bg-white/80 transition-colors"
                aria-label="Закрити"
              >
                ✕
              </button>

              {!sent ? (
                <>
                  <div className="text-center mb-6">
                    <div className="w-16 h-16 mx-auto bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-2xl flex items-center justify-center mb-4 border border-black/5">
                      <span className="text-3xl">🤝</span>
                    </div>
                    <h2 className="text-2xl font-display font-bold text-gray-900 mb-2 tracking-tight">
                      {t('title')}
                    </h2>
                    <p className="text-sm text-gray-500">
                      {t('subtitle')}
                    </p>
                  </div>

                  <form onSubmit={submit} className="flex flex-col gap-3">
                    <input
                      type="text"
                      placeholder={t('name')}
                      value={name}
                      onChange={e => setName(e.target.value)}
                      className="w-full bg-white/60 border border-black/10 rounded-xl px-4 py-3.5 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all text-sm"
                    />
                    <input
                      type="text"
                      placeholder={t('email_ph')}
                      required
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      className="w-full bg-white/60 border border-black/10 rounded-xl px-4 py-3.5 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all text-sm"
                    />
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full mt-2 relative overflow-hidden group bg-blue-600 rounded-xl px-4 py-3.5 text-white font-bold text-sm transition-all hover:scale-[1.02] active:scale-95 shadow-[0_0_20px_rgba(37,99,235,0.3)] disabled:opacity-50 disabled:hover:scale-100"
                    >
                      <div className="absolute inset-0 w-full h-full transform -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:animate-[shimmer_1.5s_infinite]" />
                      <span className="relative z-10">{loading ? t('btn_loading') : t('btn')}</span>
                    </button>
                    
                    <p className="text-center text-[11px] text-gray-500 mt-2">
                      {t('disclaimer')}
                    </p>
                  </form>
                </>
              ) : (
                <div className="text-center py-8">
                  <div className="w-20 h-20 mx-auto bg-green-500/20 rounded-full flex items-center justify-center mb-6">
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                      <polyline points="22 4 12 14.01 9 11.01"></polyline>
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{t('success_title')}</h3>
                  <p className="text-gray-500 text-sm">{t('success_desc')}</p>
                  <button
                    onClick={() => setOpen(false)}
                    className="mt-8 px-6 py-2.5 rounded-full bg-white/80 text-gray-900 font-medium hover:bg-white/20 transition-colors text-sm"
                  >
                    Закрити
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
