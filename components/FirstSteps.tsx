'use client';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import SpotlightCard from '@/components/SpotlightCard';

export default function FirstSteps() {
  const t = useTranslations();
  const steps = [
    {
      num: '1',
      icon: '📞',
      title: t('fs_s1_t'),
      desc: t('fs_s1_d'),
      highlight: true,
    },
    {
      num: '2',
      icon: '📋',
      title: t('fs_s2_t'),
      desc: t('fs_s2_d'),
      highlight: false,
    },
    {
      num: '3',
      icon: '🔍',
      title: t('fs_s3_t'),
      desc: t('fs_s3_d'),
      highlight: false,
    },
    {
      num: '4',
      icon: '📅',
      title: t('fs_s4_t'),
      desc: t('fs_s4_d'),
      highlight: false,
    },
    {
      num: '5',
      icon: '✅',
      title: t('fs_s5_t'),
      desc: t('fs_s5_d'),
      highlight: false,
    },
  ];

  return (
    <section className="relative py-32 overflow-hidden bg-[#050505] border-y border-white/5">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[60vw] rounded-full bg-blue-500/10 blur-[120px] pointer-events-none" />

      <div className="relative max-w-5xl mx-auto px-6 z-10">
        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-xs font-bold uppercase tracking-widest text-blue-500 mb-4"
          >
            {t('first_steps_tag')}
          </motion.div>
          
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="font-display text-4xl sm:text-5xl font-bold text-white tracking-tight"
          >
            {t('first_steps_title')} <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">{t('first_steps_highlight')}</span>
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="mt-6 max-w-2xl mx-auto text-lg text-gray-400"
          >
            {t('first_steps_desc')}
          </motion.p>
        </div>

        <div className="relative grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {steps.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={i === 0 ? "md:col-span-2 lg:col-span-2" : ""}
            >
              <SpotlightCard className={`h-full flex flex-col p-8 sm:p-10 ${step.highlight ? 'ring-1 ring-blue-500/30 bg-blue-900/10' : ''}`}>
                <div className="flex flex-wrap items-center gap-3 mb-6">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl border ${step.highlight ? 'bg-blue-500/20 border-blue-500/30' : 'bg-white/5 border-white/10'}`}>
                    {step.icon}
                  </div>
                  <div className="flex flex-col">
                    <span className={`text-sm font-bold uppercase tracking-wider ${step.highlight ? 'text-blue-400' : 'text-gray-500'}`}>
                      {t('fs_step_label')} {step.num}
                    </span>
                    {step.highlight && (
                      <span className="text-[10px] font-semibold text-blue-400 bg-blue-500/20 px-2 py-0.5 rounded-full mt-1 w-fit">
                        {t('fs_now_label')}
                      </span>
                    )}
                  </div>
                </div>
                
                <h3 className="font-display font-bold text-white text-xl sm:text-2xl mb-4">{step.title}</h3>
                <p className="text-gray-400 leading-relaxed text-sm sm:text-base flex-1">{step.desc}</p>
              </SpotlightCard>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="text-center mt-20"
        >
          <a
            href="https://wa.me/48729271848?text=Я+щойно+приїхав+до+Польщі+і+потребую+допомоги+з+міграційним+питанням"
            target="_blank"
            rel="noreferrer"
            className="group relative inline-flex items-center gap-3 px-8 py-5 rounded-full text-white font-bold text-lg bg-[#25D366] overflow-hidden no-underline hover:scale-105 transition-transform"
          >
            <div className="absolute inset-0 w-full h-full transform -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent group-hover:animate-[shimmer_1.5s_infinite]" />
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="relative z-10 drop-shadow-md">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347"/>
            </svg>
            <span className="relative z-10 drop-shadow-md">{t('fs_btn')}</span>
          </a>
          <p className="text-sm text-gray-500 mt-6">{t('fs_footer')}</p>
        </motion.div>
      </div>
    </section>
  );
}
