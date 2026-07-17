'use client';
import { useTranslations } from 'next-intl';
import { motion, useMotionTemplate, useMotionValue } from 'framer-motion';
import { MouseEvent } from 'react';

function GuaranteeCard({ item, i }: { item: any, i: number }) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  function handleMouseMove({ currentTarget, clientX, clientY }: MouseEvent) {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.6, delay: i * 0.1 }}
      onMouseMove={handleMouseMove}
      className="group relative flex items-start gap-5 p-8 rounded-3xl bg-white/60 border border-black/10 backdrop-blur-xl overflow-hidden"
    >
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-3xl opacity-0 transition duration-300 group-hover:opacity-100"
        style={{
          background: useMotionTemplate`
            radial-gradient(
              250px circle at ${mouseX}px ${mouseY}px,
              rgba(139, 92, 246, 0.15),
              transparent 80%
            )
          `,
        }}
      />
      <div className="w-14 h-14 shrink-0 rounded-2xl flex items-center justify-center text-3xl bg-gradient-to-br from-purple-500/20 to-blue-500/20 shadow-inner shadow-white/10 border border-black/10 relative z-10">
        <span className="drop-shadow-lg">{item.icon}</span>
      </div>
      <div className="relative z-10">
        <h3 className="font-display font-semibold text-xl text-gray-900 mb-2">{item.title}</h3>
        <p className="text-sm text-gray-500 leading-relaxed">{item.desc}</p>
      </div>
    </motion.div>
  );
}

export default function GuaranteeSection() {
  const t = useTranslations();
  const items = [
    { icon: '🔒', title: t('guar_i1_t'), desc: t('guar_i1_d') },
    { icon: '⚖️', title: t('guar_i2_t'), desc: t('guar_i2_d') },
    { icon: '💰', title: t('guar_i3_t'), desc: t('guar_i3_d') },
    { icon: '📞', title: t('guar_i4_t'), desc: t('guar_i4_d') },
  ];

  return (
    <section className="py-24 sm:py-32 relative bg-[#f5f5f7] text-gray-900 overflow-hidden">
      {/* Glows */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[150px] pointer-events-none translate-x-1/3 -translate-y-1/3" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none -translate-x-1/4 translate-y-1/4" />

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16 sm:mb-24"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/60 border border-black/10 text-xs font-semibold uppercase tracking-widest text-purple-400 mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-pulse" />
            {t('guarantee_tag')}
          </div>
          <h2 className="font-display tracking-tight font-bold text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-gray-900/70" style={{ fontSize: 'clamp(32px, 5vw, 56px)', letterSpacing: '-0.03em' }}>
            {t('guarantee_title')}
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
          {items.map((item, i) => (
            <GuaranteeCard key={i} item={item} i={i} />
          ))}
        </div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative rounded-[2.5rem] p-[1px] overflow-hidden"
        >
          {/* Animated gradient border */}
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500 via-blue-500 to-purple-500 opacity-30" />
          
          <div className="relative rounded-[2.5rem] bg-white/90 backdrop-blur-2xl p-10 sm:p-16 text-center shadow-2xl">
            <div className="text-5xl mb-6 drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">🤝</div>
            <h3 className="font-display tracking-tight text-3xl sm:text-4xl font-bold mb-4 text-gray-900">
              {t('guar_fail_title')}
            </h3>
            <p className="text-gray-500 text-lg max-w-2xl mx-auto leading-relaxed mb-10">
              {t('guar_fail_desc')}
            </p>
            <a
              href="#contact"
              className="inline-block px-10 py-5 rounded-full bg-white text-black text-sm font-bold no-underline hover:scale-105 transition-transform shadow-[0_0_30px_rgba(255,255,255,0.2)]"
            >
              {t('guar_fail_btn')}
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
