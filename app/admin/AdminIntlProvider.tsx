'use client';

import { useEffect, useState } from 'react';
import { NextIntlClientProvider } from 'next-intl';
import enMessages from '@/messages/en.json';
import plMessages from '@/messages/pl.json';
import ukMessages from '@/messages/uk.json';
import ruMessages from '@/messages/ru.json';

const LOCALE_MESSAGES = {
  en: enMessages,
  pl: plMessages,
  uk: ukMessages,
  ru: ruMessages,
} as const;

const DEFAULT_LOCALE = 'ru';

export default function AdminIntlProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocale] = useState(DEFAULT_LOCALE);
  const [messages, setMessages] = useState(LOCALE_MESSAGES[DEFAULT_LOCALE]);

  useEffect(() => {
    const savedLang = localStorage.getItem('kc-lang');
    if (savedLang && savedLang in LOCALE_MESSAGES) {
      setLocale(savedLang as keyof typeof LOCALE_MESSAGES);
      setMessages(LOCALE_MESSAGES[savedLang as keyof typeof LOCALE_MESSAGES]);
    }
  }, []);

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      {children}
    </NextIntlClientProvider>
  );
}
