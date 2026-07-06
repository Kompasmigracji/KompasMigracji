'use client';
import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { motion, useMotionTemplate, useMotionValue } from 'framer-motion';
import { MouseEvent } from 'react';

const getUrgencyOptions = (t: any) => [
  { value: 'normal', label: t('urgency_normal'), desc: t('urgency_normal_desc'), color: '#3b82f6' }, // blue-500
  { value: 'urgent', label: t('urgency_urgent'), desc: t('urgency_urgent_desc'), color: '#f59e0b' }, // amber-500
  { value: 'critical', label: t('urgency_critical'), desc: t('urgency_critical_desc'), color: '#ef4444' }, // red-500
];

export default function ContactForm({ preselectedPlan }: { preselectedPlan?: string }) {
  const t = useTranslations();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [service, setService] = useState(preselectedPlan || '');
  const [message, setMessage] = useState('');
  const [urgency, setUrgency] = useState('normal');

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  function handleMouseMove({ currentTarget, clientX, clientY }: MouseEvent) {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  useEffect(() => {
    const p = new URLSearchParams(window.location.search).get('plan');
    if (p) setService(p);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const situationWithUrgency = `[${urgency.toUpperCase()}] ${message.trim()}`;
    try {
      await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          contact: phone.trim(),
          situation: situationWithUrgency,
          service,
          source: 'site',
        }),
      });
    } catch (e) {
      console.error(e);
    }
    const text =
      `Kompas Migracji — Новий запит [${urgency.toUpperCase()}]\nІм’я: ${name}\nТелефон: ${phone}\nПослуга: ${service}\nПовідомлення: ${message}`;
    window.open(`https://wa.me/48729271848?text=${encodeURIComponent(text)}`, '_blank');
  };

  const inputCls = 'w-full px-5 py-4 border border-black/10 dark:border-white/10 rounded-xl text-sm text-gray-900 dark:text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all bg-white/60 dark:bg-white/5 backdrop-blur-md placeholder-gray-500 dark:placeholder-gray-400';
  const labelCls = 'block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2';

  return (
    <section id="contact" className="py-24 sm:py-32 relative bg-[#f5f5f7] dark:bg-[#0a0a0a] overflow-hidden text-gray-900 dark:text-white">
      {/* Glows */}
      <div className="absolute top-1/4 right-0 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[150px] pointer-events-none translate-x-1/2" />
      <div className="absolute bottom-1/4 left-0 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[150px] pointer-events-none -translate-x-1/2" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/60 border border-black/10 text-xs font-semibold uppercase tracking-widest text-blue-400 mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
            {t('contact_tag')}
          </div>
          <h2 className="font-display tracking-tight font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-white/70" style={{ fontSize: 'clamp(28px, 4vw, 44px)', letterSpacing: '-0.02em' }}>
            {t('contact_title')}
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.8 }}
          onMouseMove={handleMouseMove}
          className="max-w-xl mx-auto relative group rounded-[2rem] bg-white/60 dark:bg-white/5 border border-black/10 dark:border-white/10 backdrop-blur-2xl shadow-2xl p-[1px] overflow-hidden"
        >
          <motion.div
            className="pointer-events-none absolute -inset-px opacity-0 transition duration-300 group-hover:opacity-100 z-0"
            style={{
              background: useMotionTemplate`
                radial-gradient(
                  600px circle at ${mouseX}px ${mouseY}px,
                  rgba(59, 130, 246, 0.2),
                  transparent 80%
                )
              `,
            }}
          />

          <form onSubmit={handleSubmit} className="relative z-10 p-8 sm:p-12 bg-white/80 dark:bg-[#1a1a1a]/80 backdrop-blur-md rounded-[2rem]">
            {/* Urgency selector */}
            <div className="mb-8">
              <label className={labelCls}>{t('urgency_label')}</label>
              <div className="flex flex-col gap-3">
                {getUrgencyOptions(t).map((opt: any) => (
                  <label
                    key={opt.value}
                    className="flex items-center gap-4 p-4 rounded-xl border border-black/10 dark:border-white/10 cursor-pointer transition-all hover:bg-white/60 dark:hover:bg-white/5"
                    style={urgency === opt.value ? { borderColor: opt.color, background: `rgba(${opt.value === 'critical' ? '239,68,68' : opt.value === 'urgent' ? '245,158,11' : '59,130,246'}, 0.1)` } : {}}
                  >
                    <input
                      type="radio"
                      name="urgency"
                      value={opt.value}
                      checked={urgency === opt.value}
                      onChange={() => setUrgency(opt.value)}
                      className="sr-only"
                    />
                    <div
                      className="w-5 h-5 rounded-full border-2 shrink-0 transition-all flex items-center justify-center"
                      style={urgency === opt.value ? { borderColor: opt.color } : { borderColor: 'rgba(255,255,255,0.2)' }}
                    >
                      {urgency === opt.value && <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: opt.color }} />}
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-gray-900 dark:text-white text-sm mb-1" style={urgency === opt.value ? { color: opt.color } : {}}>
                        {opt.label}
                      </div>
                      <div className="text-xs text-gray-500">{opt.desc}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
              <div>
                <label className={labelCls}>{t('form_name')}</label>
                <input required value={name} onChange={e => setName(e.target.value)} placeholder={t('form_name_ph')} className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>{t('form_phone')}</label>
                <input required value={phone} onChange={e => setPhone(e.target.value)} placeholder={t('form_phone_ph')} className={inputCls} />
              </div>
            </div>
            
            <div className="mb-5">
              <label className={labelCls}>{t('form_service')}</label>
              <select value={service} onChange={e => setService(e.target.value)} className={`${inputCls} appearance-none bg-no-repeat`} style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 24 24\' stroke=\'%239ca3af\'%3E%3Cpath stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'2\' d=\'M19 9l-7 7-7-7\'%3E%3C/path%3E%3C/svg%3E")', backgroundPosition: 'right 1rem center', backgroundSize: '1.2em' }}>
                <option value="" className="bg-[#111]">{t('form_service_ph')}</option>
                <optgroup label={t('form_consult_group')} className="bg-[#111]">
                  <option className="bg-[#111]">{t('form_consult_free')}</option>
                  <option className="bg-[#111]">{t('form_consult_phone')}</option>
                  <option className="bg-[#111]">{t('form_consult_full')}</option>
                  <option className="bg-[#111]">{t('form_consult_hour')}</option>
                </optgroup>
                <optgroup label={t('form_notary_group')} className="bg-[#111]">
                  <option className="bg-[#111]">{t('form_notary_poa1')}</option>
                  <option className="bg-[#111]">{t('form_notary_poa2')}</option>
                  <option className="bg-[#111]">{t('form_notary_poa3')}</option>
                  <option className="bg-[#111]">{t('form_notary_poa4')}</option>
                  <option className="bg-[#111]">{t('form_notary_stmt')}</option>
                  <option className="bg-[#111]">{t('form_notary_inherit')}</option>
                </optgroup>
                <option className="bg-[#111]">{t('form_express1')}</option>
                <option className="bg-[#111]">{t('form_express2')}</option>
                <option className="bg-[#111]">{t('form_express3')}</option>
                <option className="bg-[#111]">{t('form_other')}</option>
              </select>
            </div>
            
            <div className="mb-6">
              <label className={labelCls}>{t('form_situation')}</label>
              <textarea value={message} onChange={e => setMessage(e.target.value)} placeholder={t('form_situation_ph')} rows={4} className={inputCls + ' resize-none'} />
            </div>
            
            <label className="flex items-start gap-3 mb-8 text-sm text-gray-500 cursor-pointer group">
              <input type="checkbox" required className="mt-1 w-4 h-4 rounded border-gray-600 text-blue-500 focus:ring-blue-500 bg-black/50" />
              <span className="group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors">{t('form_rodo')}</span>
            </label>
            
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="w-full text-white font-bold py-4 rounded-xl text-sm transition-all shadow-[0_0_20px_rgba(59,130,246,0.3)] relative overflow-hidden"
              style={urgency === 'critical' ? { background: 'linear-gradient(135deg, #dc2626, #991b1b)', boxShadow: '0 0 20px rgba(220,38,38,0.4)' } : { background: 'linear-gradient(135deg, #2563eb, #1d4ed8)' }}
            >
              {/* Highlight sweep effect */}
              <div className="absolute inset-0 w-full h-full transform -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent hover:animate-[shimmer_1.5s_infinite]" />
              <span className="relative z-10">{urgency === 'critical' ? t('form_submit_critical') : t('form_submit')}</span>
            </motion.button>
          </form>
        </motion.div>
      </div>
    </section>
  );
}
