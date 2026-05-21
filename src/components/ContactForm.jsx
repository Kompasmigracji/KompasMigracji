import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
export default function ContactForm({ preselectedPlan }) {
  const { t } = useTranslation();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [service, setService] = useState(preselectedPlan || '');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const p = new URLSearchParams(window.location.search).get('plan');
    if (p) setService(p);
  }, []);

  const waNumber = '48729271848';

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { supabase } = await import('../lib/supabase');
    if (supabase) await supabase.from('leads').insert({ name, phone, service, message, source: 'main' });
    const text =
      `Kompas Migracji — Новий запит\n` +
      `Ім'я: ${name}\n` +
      `Телефон: ${phone}\n` +
      `Послуга: ${service}\n` +
      `Повідомлення: ${message}`;
    window.open(`https://wa.me/${waNumber}?text=${encodeURIComponent(text)}`, '_blank');
  };

  const inputCls = 'w-full px-4 py-3 border border-gray-200 rounded-lg text-sm text-navy focus:outline-none focus:border-primary transition-colors bg-white';
  const labelCls = 'block text-sm font-semibold text-navy mb-2';

  return (
    <form
      id="contact"
      onSubmit={handleSubmit}
      className="max-w-xl mx-auto bg-white border border-gray-200 rounded-2xl p-8 shadow-sm"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
        <div>
          <label className={labelCls}>Ім'я</label>
          <input
            required
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Іван Петренко"
            className={inputCls}
          />
        </div>
        <div>
          <label className={labelCls}>Телефон WhatsApp</label>
          <input
            required
            value={phone}
            onChange={e => setPhone(e.target.value)}
            placeholder="+48 xxx xxx xxx"
            className={inputCls}
          />
        </div>
      </div>

      <div className="mb-5">
        <label className={labelCls}>Послуга</label>
        <select
          value={service}
          onChange={e => setService(e.target.value)}
          className={inputCls}
        >
          <option value="">Оберіть послугу</option>
          <option>Безкоштовна консультація (2 хв)</option>
          <option>Консультація 15 хв (150 zł)</option>
          <option>Юридична година (450 zł)</option>
          <option>Пакет Прискорення — Карта побуту (450 zł)</option>
          <option>Пакет Резидент — Карта ЄС (900 zł)</option>
          <option>Інше</option>
        </select>
      </div>

      <div className="mb-5">
        <label className={labelCls}>Опис ситуації</label>
        <textarea
          value={message}
          onChange={e => setMessage(e.target.value)}
          placeholder="Коротко опишіть що сталося..."
          rows={4}
          className={inputCls + ' resize-none'}
        />
      </div>

      <label className="flex items-start gap-3 mb-6 text-sm text-gray-500 cursor-pointer">
        <input type="checkbox" required className="mt-0.5 accent-primary" />
        Я погоджуюсь з обробкою персональних даних згідно з RODO
      </label>

      <button
        type="submit"
        className="w-full gradient-btn text-white font-semibold py-3.5 rounded-lg text-sm transition-all hover:opacity-90 hover:shadow-lg"
      >
        Відправити через WhatsApp →
      </button>
    </form>
  );
}
