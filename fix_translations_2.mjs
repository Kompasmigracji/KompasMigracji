import fs from 'fs';
import path from 'path';

const additionalUK = {
  close_without_help: "Закрити без допомоги",
  success_title: "Дякуємо! Ми зв'яжемося з вами",
  success_subtitle: "Очікуйте повідомлення протягом 2 годин у робочий час",
  whatsapp_now: "Написати у WhatsApp зараз",
  phone: "Телефон"
};

const additionalRU = {
  close_without_help: "Закрыть без помощи",
  success_title: "Спасибо! Мы свяжемся с вами",
  success_subtitle: "Ожидайте сообщения в течение 2 часов в рабочее время",
  whatsapp_now: "Написать в WhatsApp сейчас",
  phone: "Телефон"
};

const additionalEN = {
  close_without_help: "Close without help",
  success_title: "Thank you! We will contact you",
  success_subtitle: "Expect a message within 2 hours during business hours",
  whatsapp_now: "Message on WhatsApp now",
  phone: "Phone"
};

const additionalPL = {
  close_without_help: "Zamknij bez pomocy",
  success_title: "Dziękujemy! Skontaktujemy się z Tobą",
  success_subtitle: "Spodziewaj się wiadomości w ciągu 2 godzin w godzinach pracy",
  whatsapp_now: "Napisz na WhatsApp teraz",
  phone: "Telefon"
};

const additions = { uk: additionalUK, ru: additionalRU, en: additionalEN, pl: additionalPL };

for (const lang of ['uk', 'ru', 'en', 'pl']) {
  const filePath = path.join(process.cwd(), 'messages', `${lang}.json`);
  const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  data.ExitPopup = { ...data.ExitPopup, ...additions[lang] };
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}
