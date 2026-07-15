import fs from 'fs';
import path from 'path';

const uk = {
  title: "Не залишайтеся наодинці з цим",
  subtitle: "Залиште свій email — ми зв'яжемося з вами та дамо безкоштовну оцінку вашої ситуації",
  name: "Ваше ім'я (необов'язково)",
  email: "Ваш email *",
  sending: "Відправляємо...",
  submit: "Отримати безкоштовну оцінку →",
  or_contact: "або зв'яжіться прямо зараз:"
};

const ru = {
  title: "Не оставайтесь наедине с этим",
  subtitle: "Оставьте свой email — мы свяжемся с вами и дадим бесплатную оценку вашей ситуации",
  name: "Ваше имя (необязательно)",
  email: "Ваш email *",
  sending: "Отправляем...",
  submit: "Получить бесплатную оценку →",
  or_contact: "или свяжитесь прямо сейчас:"
};

const en = {
  title: "Don't face this alone",
  subtitle: "Leave your email — we will contact you and provide a free assessment of your situation",
  name: "Your name (optional)",
  email: "Your email *",
  sending: "Sending...",
  submit: "Get a free assessment →",
  or_contact: "or contact us right now:"
};

const pl = {
  title: "Nie zostawaj z tym sam",
  subtitle: "Zostaw swój email — skontaktujemy się z Tobą i dokonamy bezpłatnej oceny Twojej sytuacji",
  name: "Twoje imię (opcjonalnie)",
  email: "Twój email *",
  sending: "Wysyłanie...",
  submit: "Zdobądź bezpłatną ocenę →",
  or_contact: "lub skontaktuj się teraz:"
};

const translations = { uk, ru, en, pl };

for (const lang of ['uk', 'ru', 'en', 'pl']) {
  const filePath = path.join(process.cwd(), 'messages', `${lang}.json`);
  const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  data.ExitPopup = translations[lang];
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}
