'use client';
import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';


const getUrgencyOptions = (t: any) => [
  { value: 'normal', label: t('urgency_normal'), desc: t('urgency_normal_desc'), color: '#2563eb' },
  { value: 'urgent', label: t('urgency_urgent'), desc: t('urgency_urgent_desc'), color: '#d97706' },
  { value: 'critical', label: t('urgency_critical'), desc: t('urgency_critical_desc'), color: '#dc2626' },
];

export default function ContactForm({ preselectedPlan }: { preselectedPlan?: string }) {
  const t = useTranslations();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [service, setService] = useState(preselectedPlan || '');
  const [message, setMessage] = useState('');
  const [urgency, setUrgency] = useState('normal');

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

  const inputCls = 'w-full px-5 py-4 border border-gray-200 rounded-xl text-sm text-navy focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all bg-gray-50 hover:bg-white';
  const labelCls = 'block text-sm font-semibold text-navy mb-2';

  return (
    <section id="contact" className="py-24 bg-soft">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <div className="text-xs font-semibold uppercase tracking-widest text-primary mb-3">{t('contact_tag')}</div>
          <h2 className="font-display tracking-tight font-semibold text-navy" style={{ fontSize: 'clamp(28px, 4vw, 44px)' }}>{t('contact_title')}</h2>
        </div>
        <form
          onSubmit={handleSubmit}
          className="max-w-xl mx-auto apple-card p-8 sm:p-12"
        >
          {/* Urgency selector */}
          <div className="mb-6">
            <label className={labelCls}>{t('urgency_label')}</label>
            <div className="flex flex-col gap-2">
              {getUrgencyOptions(t).map((opt: any) => (
                <label
                  key={opt.value}
                  className={`flex items-center gap-3 p-3.5 rounded-xl border-2 cursor-pointer transition-all ${urgency === opt.value ? 'border-opacity-100' : 'border-gray-200 hover:border-gray-300'}`}
                  style={urgency === opt.value ? { borderColor: opt.color, background: opt.color + '08' } : {}}
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
                    className="w-4 h-4 rounded-full border-2 shrink-0 transition-all"
                    style={urgency === opt.value ? { borderColor: opt.color, background: opt.color } : { borderColor: '#d1d5db' }}
                  />
                  <div className="flex-1">
                    <div className="font-semibold text-navy text-sm" style={urgency === opt.value ? { color: opt.color } : {}}>
                      {opt.label}
                    </div>
                    <div className="text-xs text-gray-400">{opt.desc}</div>
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
            <select value={service} onChange={e => setService(e.target.value)} className={inputCls}>
              <option value="">{t('form_service_ph')}</option>
              <optgroup label={t('form_consult_group')}>
                <option>{t('form_consult_free')}</option>
                <option>{t('form_consult_phone')}</option>
                <option>{t('form_consult_full')}</option>
                <option>{t('form_consult_hour')}</option>
              </optgroup>
              <optgroup label={t('form_notary_group')}>
                <option>{t('form_notary_poa1')}</option>
                <option>{t('form_notary_poa2')}</option>
                <option>{t('form_notary_poa3')}</option>
                <option>{t('form_notary_poa4')}</option>
                <option>{t('form_notary_stmt')}</option>
                <option>{t('form_notary_inherit')}</option>
              </optgroup>
              <option>{t('form_express1')}</option>
              <option>{t('form_express2')}</option>
              <option>{t('form_express3')}</option>
              <option>{t('form_other')}</option>
            </select>
          </div>
          <div className="mb-5">
            <label className={labelCls}>{t('form_situation')}</label>
            <textarea value={message} onChange={e => setMessage(e.target.value)} placeholder={t('form_situation_ph')} rows={4} className={inputCls + ' resize-none'} />
          </div>
          <label className="flex items-start gap-3 mb-6 text-sm text-gray-500 cursor-pointer">
            <input type="checkbox" required className="mt-0.5 accent-primary" />
            {t('form_rodo')}
          </label>
          <button
            type="submit"
            className="w-full gradient-btn text-white font-bold py-4 rounded-full text-sm transition-premium hover-lift shadow-[0_8px_20px_rgba(37,99,235,0.3)]"
            style={urgency === 'critical' ? { background: 'linear-gradient(135deg, #dc2626, #b91c1c)' } : {}}
          >
            {urgency === 'critical' ? t('form_submit_critical') : t('form_submit')}
          </button>
        </form>
      </div>
    </section>
  );
}
