'use client';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { motion, useMotionTemplate, useMotionValue } from 'framer-motion';
import { MouseEvent } from 'react';

const PHOTO = 'https://yt3.ggpht.com/lu2REm3NMXphDWjWEz1mM9Ja8fUjdLNxMLr6pNHw5nPIcoK_vTFi9a9IAc8o173f5lGhhKlwl8LO=s1024-rw-nd-v1';

export default function Team() {
  const t = useTranslations();
  
  const STATS = [
    { val: '10+',   label: t('team_stat_years_label') },
    { val: '1200+', label: t('team_stat_cases_label') },
    { val: '24/7',  label: t('team_stat_support_label') },
  ];

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  function handleMouseMove({ currentTarget, clientX, clientY }: MouseEvent) {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  return (
    <section className="py-24 sm:py-32 relative bg-[#f5f5f7] overflow-hidden text-gray-900">
      {/* Glow backgrounds */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[150px] pointer-events-none translate-x-1/3 -translate-y-1/3" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none -translate-x-1/4 translate-y-1/4" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16 sm:mb-24"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/60 border border-black/10 text-xs font-semibold uppercase tracking-widest text-purple-400 mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-pulse" />
            {t('team_tag')}
          </div>
          <h2 className="font-display tracking-tight font-bold text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-gray-900/70" style={{ fontSize: 'clamp(32px, 5vw, 56px)', letterSpacing: '-0.03em' }}>
            {t('team_title')}
          </h2>
        </motion.div>

        <div className="max-w-4xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.8 }}
            onMouseMove={handleMouseMove}
            className="group relative overflow-hidden flex flex-col md:flex-row rounded-[2rem] bg-white/60 border border-black/10 shadow-2xl backdrop-blur-2xl"
          >
            <motion.div
              className="pointer-events-none absolute -inset-px rounded-[2rem] opacity-0 transition duration-300 group-hover:opacity-100 z-20"
              style={{
                background: useMotionTemplate`
                  radial-gradient(
                    600px circle at ${mouseX}px ${mouseY}px,
                    rgba(147, 51, 234, 0.15),
                    transparent 80%
                  )
                `,
              }}
            />

            <div className="md:w-[350px] flex-shrink-0 relative h-80 md:h-auto overflow-hidden">
              <motion.div 
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                className="w-full h-full"
              >
                <Image 
                  src={PHOTO} 
                  alt="Олександр Василишин" 
                  width={400} 
                  height={500} 
                  className="w-full h-full object-cover object-top" 
                />
              </motion.div>
              {/* Overlay gradient for dark mode transition */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-black/20 to-transparent md:bg-gradient-to-r md:from-transparent md:via-black/20 md:to-[#0a0a0a]" />
            </div>

            <div className="p-8 md:p-12 flex flex-col justify-between relative z-30">
              <div>
                <div className="text-xs font-semibold uppercase tracking-widest text-purple-400 mb-3">{t('team_founder_title')}</div>
                <h3 className="text-3xl sm:text-4xl font-display font-bold tracking-tight text-gray-900 mb-6 leading-tight">{t('team_name')}</h3>
                <p className="text-gray-500 leading-relaxed mb-8 text-sm sm:text-base">
                  {t('team_bio_1')}
                  <br /><br />
                  {t('team_bio_2')}
                </p>
                <div className="grid grid-cols-3 gap-6 border-t border-black/10 pt-8 mb-10">
                  {STATS.map((s, i) => (
                    <motion.div 
                      key={s.label}
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 + (i * 0.1) }}
                      className="text-center"
                    >
                      <div className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400 mb-1">{s.val}</div>
                      <div className="text-xs text-gray-500 uppercase tracking-wider font-semibold">{s.label}</div>
                    </motion.div>
                  ))}
                </div>
              </div>
              <a
                href="https://wa.me/48729271848"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-3 bg-white text-black font-bold text-sm py-4 px-8 rounded-full hover:scale-105 transition-transform duration-300 shadow-xl shadow-white/10"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="#25d366">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                {t('team_btn_consultation')}
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
