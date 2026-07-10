"use client";
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function MemberMarketplacePage() {
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("Всі");
  const [claimedOffer, setClaimedOffer] = useState(null);

  useEffect(() => {
    fetch("/api/member/partners")
      .then((res) => res.json())
      .then((data) => {
        setPartners(data.partners || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const categories = ["Всі", ...new Set(partners.map(p => p.category))];
  const filteredPartners = activeCategory === "Всі" ? partners : partners.filter(p => p.category === activeCategory);

  const handleClaim = (offer, partnerName) => {
    setClaimedOffer({ ...offer, partnerName });
    setTimeout(() => {
      setClaimedOffer(null);
    }, 5000);
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white p-4 md:p-8 relative overflow-hidden font-sans">
      
      {/* Background ambient lights */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-600/20 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/20 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10 space-y-10">
        
        {/* Header */}
        <div className="space-y-4">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-medium text-emerald-400 uppercase tracking-wider">Ексклюзивно для членів профспілки</span>
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-black tracking-tight bg-gradient-to-br from-white to-white/40 bg-clip-text text-transparent"
          >
            Партнерський Маркетплейс
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-white/50 text-lg md:text-xl max-w-2xl"
          >
            Перевірені юристи, надійні орендодавці, медичні центри та банки. Отримуйте спеціальні знижки та промокоди завдяки вашому членству в Компас Профспілок.
          </motion.p>
        </div>

        {/* Categories */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="flex flex-wrap gap-3"
        >
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 backdrop-blur-md ${
                activeCategory === cat 
                ? "bg-white text-black shadow-[0_0_20px_rgba(255,255,255,0.3)] scale-105" 
                : "bg-white/5 text-white/70 hover:bg-white/10 hover:text-white border border-white/10"
              }`}
            >
              {cat}
            </button>
          ))}
        </motion.div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-32">
            <div className="w-10 h-10 border-4 border-white/10 border-t-white rounded-full animate-spin" />
          </div>
        )}

        {/* Partners Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <AnimatePresence>
            {filteredPartners.map((partner, idx) => (
              <motion.div
                key={partner.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3, delay: idx * 0.05 }}
                className="group p-1 rounded-3xl bg-gradient-to-b from-white/10 to-white/5 hover:from-white/20 hover:to-white/10 transition-all duration-500"
              >
                <div className="h-full bg-[#0a0a0a]/90 backdrop-blur-xl p-6 md:p-8 rounded-[22px] border border-white/5 flex flex-col">
                  
                  {/* Partner Header */}
                  <div className="flex justify-between items-start mb-6">
                    <div className="flex gap-4 items-center">
                      <div className="w-16 h-16 rounded-2xl overflow-hidden bg-white/10 border border-white/10 p-1 flex-shrink-0">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={partner.logo_url} alt={partner.name} className="w-full h-full object-cover rounded-xl" />
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-white group-hover:text-blue-400 transition-colors">{partner.name}</h2>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs font-semibold px-2 py-0.5 rounded bg-white/10 text-white/80">{partner.category}</span>
                          <span className="flex items-center gap-1 text-xs text-yellow-400 font-medium">
                            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                            {partner.rating}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="hidden md:flex items-center gap-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-3 py-1.5 rounded-full">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                      <span className="text-xs font-semibold">Перевірено</span>
                    </div>
                  </div>

                  <p className="text-white/60 text-sm leading-relaxed mb-8 flex-1">
                    {partner.description}
                  </p>

                  {/* Offers List */}
                  <div className="space-y-3 mt-auto">
                    {partner.offers.map(offer => (
                      <div key={offer.id} className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-xl bg-white/5 border border-white/10 group-hover:bg-white/10 transition-colors">
                        <div className="flex-1 text-center sm:text-left">
                          <div className="font-bold text-white text-lg">{offer.title}</div>
                        </div>
                        <button 
                          onClick={() => handleClaim(offer, partner.name)}
                          className="w-full sm:w-auto px-6 py-2.5 rounded-lg bg-white text-black font-bold text-sm hover:scale-105 transition-transform shadow-[0_0_15px_rgba(255,255,255,0.2)]"
                        >
                          Отримати
                        </button>
                      </div>
                    ))}
                  </div>

                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* Claim Modal/Toast overlay */}
      <AnimatePresence>
        {claimedOffer && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-[#111] border border-white/20 p-8 rounded-3xl max-w-md w-full shadow-2xl relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-500" />
              <h3 className="text-2xl font-bold text-white mb-2">Промокод активовано! 🎉</h3>
              <p className="text-white/60 mb-6">Ви обрали пропозицію від <strong className="text-white">{claimedOffer.partnerName}</strong>: <br/>"{claimedOffer.title}"</p>
              
              <div className="p-4 bg-white/5 border border-white/10 rounded-xl mb-6 text-center">
                <div className="text-xs text-white/50 uppercase font-bold tracking-wider mb-2">Ваш унікальний код</div>
                <div className="text-3xl font-mono font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                  {claimedOffer.promo_code}
                </div>
              </div>

              <div className="flex gap-3">
                <button 
                  onClick={() => setClaimedOffer(null)}
                  className="flex-1 py-3 rounded-xl bg-white/10 text-white font-semibold hover:bg-white/20 transition-colors"
                >
                  Закрити
                </button>
                <button className="flex-1 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold hover:shadow-lg hover:shadow-blue-500/25 transition-all">
                  Перейти на сайт
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
