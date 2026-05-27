'use client';
import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { supabase } from '@/lib/supabase';

export default function ContactForm({ preselectedPlan }: { preselectedPlan?: string }) {
  const t = useTranslations();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [service, setService] = useState(preselectedPlan || '');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const p = new URLSearchParams(window.location.search).get('plan');
    if (p) setService(p);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (supabase) { try { await supabase.from('leads').insert({ first_name: name.trim(), contact: phone.trim(), situation: message.trim(), service, source: 'site' }); } catch {} }
    const text =
      `Kompas Migracji — Новий запит\nІм'я: ${name}\nТелефон: ${phone}\nПослуга: ${service}\nПовідомлення: ${message}`;
    window.open(`https://wa.me/48729271848?text=${encodeURIComponent(text)}`, '_blank');
  };

  const inputCls = 'w-full px-4 py-3 border border-gray-200 rounded-lg text-sm text-navy focus:outline-none focus:border-primary transition-colors bg-white';
  const labelCls = 'block text-sm font-semibold text-navy mb-2';

  return (
    <section id="contact" className="py-24 bg-soft">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <div className="text-xs font-semibold uppercase tracking-widest text-primary mb-3">{t('contact_tag')}</div>
          <h2 className="font-serif font-light text-navy" style={{ fontSize: 'clamp(28px, 4vw, 44px)' }}>{t('contact_title')}</h2>
        </div>
        <form
          onSubmit={handleSubmit}
          className="max-w-xl mx-auto bg-white border border-gray-200 rounded-2xl p-8 shadow-sm"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
            <div>
              <label className={labelCls}>Ім&apos;я</label>
              <input required value={name} onChange={e => setName(e.target.value)} placeholder="Іван Петренко" className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Телефон WhatsApp</label>
              <input required value={phone} onChange={e => setPhone(e.target.value)} placeholder="+48 xxx xxx xxx" className={inputCls} />
            </div>
          </div>
          <div className="mb-5">
            <label className={labelCls}>Послуга</label>
            <select value={service} onChange={e => setService(e.target.value)} className={inputCls}>
              <option value="">Оберіть послугу</option>
              <optgroup label="Консультації">
                <option>Безкоштовна консультація (2 хв)</option>
                <option>Консультація телефонічна (150 zł)</option>
                <option>Консультація + узасаднення (450 zł)</option>
                <option>Юридична година (300 zł)</option>
              </optgroup>
              <optgroup label="Нотаріальні послуги">
                <option>Разова довіреність (250 zł)</option>
                <option>Довіреність на транспортний засіб (350 zł)</option>
                <option>Довіреність на нерухомість (450 zł)</option>
                <option>Довіреність на представлення інтересів (450 zł)</option>
                <option>Заява (380 zł)</option>
                <option>Комплект «Спадщина» (720 zł)</option>
              </optgroup>
              <option>Прискорення карти побуту (комітет) (300 zł)</option>
              <option>Прискорення карти побуту (апеляція) (900 zł)</option>
              <option>Прискорення Резидента ЄС (900 zł)</option>
              <option>Інше</option>
            </select>
          </div>
          <div className="mb-5">
            <label className={labelCls}>Опис ситуації</label>
            <textarea value={message} onChange={e => setMessage(e.target.value)} placeholder="Коротко опишіть що сталося..." rows={4} className={inputCls + ' resize-none'} />
          </div>
          <label className="flex items-start gap-3 mb-6 text-sm text-gray-500 cursor-pointer">
            <input type="checkbox" required className="mt-0.5 accent-primary" />
            Я погоджуюсь з обробкою персональних даних згідно з RODO
          </label>
          <button type="submit" className="w-full gradient-btn text-white font-semibold py-3.5 rounded-lg text-sm transition-all hover:opacity-90 hover:shadow-lg">
            Відправити через WhatsApp →
          </button>
        </form>
      </div>
    </section>
  );
}
