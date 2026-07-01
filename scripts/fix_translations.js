const fs = require('fs');

const pl = {
  "faq_panic_q_0": "Jestem w panice i nie wiem co robić. Od czego zacząć?",
  "faq_panic_a_0": "Zrób jeden krok — napisz do nas na WhatsApp lub zadzwoń. Sami sprawdzimy od czego zacząć w twojej sytuacji. Pierwsza konsultacja jest darmowa i bez zobowiązań.",
  "faq_panic_q_1": "Nie mam pieniędzy. Czy możecie mi pomóc?",
  "faq_panic_a_1": "Tak. Zaczynamy od darmowej 2-minutowej oceny. Mamy system płatności ratalnej dla trudnych spraw. Pieniądze nie powinny być powodem pozostania bez pomocy.",
  "faq_panic_q_2": "Odmówiono mi Karty Pobytu. Czy to koniec?",
  "faq_panic_a_2": "Nie. Masz 14 dni na odwołanie. Skontaktuj się z nami jak najszybciej.",
  "urgency_normal": "Zwykły",
  "urgency_normal_desc": "Odpowiemy w ciągu 24 godz.",
  "urgency_urgent": "Pilnie (3-7 dni)",
  "urgency_urgent_desc": "Priorytetowe przetwarzanie",
  "urgency_critical": "KRYTYCZNIE — dzisiaj",
  "urgency_critical_desc": "Odpowiemy w ciągu 2 godz.",
  "urgency_label": "Pilność sytuacji",
  "form_submit_critical": "🚨 Wyślij — PILNIE",
  "team_tag": "NASI KONSULTANCI",
  "team_title": "Kto Cię konsultuje",
  "reviews_tag": "MÓWIĄ O NAS",
  "reviews_title": "Opinie klientów",
  "review_olena_name": "Olena K.",
  "review_olena_text": "Dzięki nim uzyskałam kartę w 3 miesiące, mimo początkowej odmowy. Polecam!",
  "first_steps_tag": "Pierwsze kroki",
  "first_steps_title": "Co zrobić w pierwsze 24 godziny",
  "guarantee_tag": "Nasze gwarancje",
  "guarantee_title": "Możesz nam zaufać",
  "badge_urgent": "PILNE",
  "badge_top": "TOP",
  "badge_important": "WAŻNE",
  "service_get_help": "→ Uzyskaj pomoc teraz",
  "faq_panic_whatsapp": "Napisz na WhatsApp →",
  "faq_panic_call": "Zadzwoń"
};

const uk = {
  "faq_panic_q_0": "Я в паніці і не знаю що робити. З чого почати?",
  "faq_panic_a_0": "Зробіть один крок — напишіть нам у WhatsApp або зателефонуйте. Ми самі розберемося з чого починати у вашій ситуації. Вам не потрібно нічого знати заздалегідь — для цього і існуємо ми. Перша консультація безкоштовна і без зобов'язань.",
  "faq_panic_q_1": "У мене немає грошей. Чи можете ви мені допомогти?",
  "faq_panic_a_1": "Так. Починаємо з безкоштовної 2-хвилинної оцінки. Якщо потрібна платна допомога — підберемо план, який відповідає вашому бюджету. Також маємо гнучку систему оплати частинами для складних справ. Гроші не мають бути причиною, щоб залишитися без допомоги.",
  "faq_panic_q_2": "Мені відмовили у Karcie pobytu. Це кінець?",
  "faq_panic_a_2": "Ні. Відмова — це не кінець. Є право на оскарження рішення протягом 14 днів. Ми маємо досвід успішного оскарження відмов. Зв'яжіться з нами якомога швидше — часові рамки важливі.",
  "urgency_normal": "Звичайний",
  "urgency_normal_desc": "Відповімо протягом 24 год",
  "urgency_urgent": "Терміново (3-7 днів)",
  "urgency_urgent_desc": "Пріоритетна обробка",
  "urgency_critical": "КРИТИЧНО — сьогодні",
  "urgency_critical_desc": "Відповімо протягом 2 год",
  "urgency_label": "Терміновість ситуації",
  "form_submit_critical": "🚨 Відправити — ТЕРМІНОВО",
  "team_tag": "НАШІ КОНСУЛЬТАНТИ",
  "team_title": "Хто вас консультує",
  "reviews_tag": "ПРО НАС ГОВОРЯТЬ",
  "reviews_title": "Відгуки клієнтів",
  "review_olena_name": "Олена К.",
  "review_olena_text": "Дуже допомогли! Завдяки їм отримала карту швидше, незважаючи на відмову.",
  "first_steps_tag": "Перші кроки",
  "first_steps_title": "Що зробити в перші 24 години",
  "guarantee_tag": "Наші гарантії",
  "guarantee_title": "Можете нам довіряти",
  "badge_urgent": "ТЕРМІНОВО",
  "badge_top": "ТОП",
  "badge_important": "ВАЖЛИВО",
  "service_get_help": "→ Отримати допомогу зараз",
  "faq_panic_whatsapp": "Написати в WhatsApp →",
  "faq_panic_call": "Зателефонувати"
};

const en = {
  "faq_panic_q_0": "I am in panic and do not know what to do. Where to start?",
  "faq_panic_a_0": "Take one step — write us on WhatsApp or call. We will figure out where to start. The first consultation is free.",
  "faq_panic_q_1": "I have no money. Can you help me?",
  "faq_panic_a_1": "Yes. We start with a free 2-minute assessment. We have an installment system for difficult cases.",
  "faq_panic_q_2": "I got a refusal for Karta Pobytu. Is this the end?",
  "faq_panic_a_2": "No. You have 14 days to appeal. Contact us as soon as possible.",
  "urgency_normal": "Normal",
  "urgency_normal_desc": "Reply within 24h",
  "urgency_urgent": "Urgent (3-7 days)",
  "urgency_urgent_desc": "Priority processing",
  "urgency_critical": "CRITICAL — today",
  "urgency_critical_desc": "Reply within 2h",
  "urgency_label": "Urgency of the situation",
  "form_submit_critical": "🚨 Submit — URGENT",
  "team_tag": "OUR CONSULTANTS",
  "team_title": "Who is consulting you",
  "reviews_tag": "THEY TALK ABOUT US",
  "reviews_title": "Client reviews",
  "review_olena_name": "Olena K.",
  "review_olena_text": "Helped me get my residence card despite initial refusal. Highly recommended!",
  "first_steps_tag": "First steps",
  "first_steps_title": "What to do in the first 24 hours",
  "guarantee_tag": "Our guarantees",
  "guarantee_title": "You can trust us",
  "badge_urgent": "URGENT",
  "badge_top": "TOP",
  "badge_important": "IMPORTANT",
  "service_get_help": "→ Get help now",
  "faq_panic_whatsapp": "Write on WhatsApp →",
  "faq_panic_call": "Call"
};

const ru = {
  "faq_panic_q_0": "Я в панике и не знаю что делать. С чего начать?",
  "faq_panic_a_0": "Сделайте один шаг — напишите нам в WhatsApp или позвоните. Мы сами разберемся с чего начинать. Первая консультация бесплатна.",
  "faq_panic_q_1": "У меня нет денег. Вы можете мне помочь?",
  "faq_panic_a_1": "Да. Начинаем с бесплатной оценки. У нас есть система оплаты частями для сложных дел. Деньги не должны быть причиной остаться без помощи.",
  "faq_panic_q_2": "Мне отказали в Karcie pobytu. Это конец?",
  "faq_panic_a_2": "Нет. Отказ — это не конец. Есть право на обжалование в течение 14 дней. Свяжитесь с нами как можно скорее.",
  "urgency_normal": "Обычная",
  "urgency_normal_desc": "Ответим в течение 24 ч",
  "urgency_urgent": "Срочно (3-7 дней)",
  "urgency_urgent_desc": "Приоритетная обработка",
  "urgency_critical": "КРИТИЧЕСКИ — сегодня",
  "urgency_critical_desc": "Ответим в течение 2 ч",
  "urgency_label": "Срочность ситуации",
  "form_submit_critical": "🚨 Отправить — СРОЧНО",
  "team_tag": "НАШИ КОНСУЛЬТАНТЫ",
  "team_title": "Кто вас консультирует",
  "reviews_tag": "О НАС ГОВОРЯТ",
  "reviews_title": "Отзывы клиентов",
  "review_olena_name": "Олена К.",
  "review_olena_text": "Очень помогли! Благодаря им получила карту быстрее, несмотря на отказ.",
  "first_steps_tag": "Первые шаги",
  "first_steps_title": "Что сделать в первые 24 часа",
  "guarantee_tag": "Наши гарантии",
  "guarantee_title": "Вы можете нам доверять",
  "badge_urgent": "СРОЧНО",
  "badge_top": "ТОП",
  "badge_important": "ВАЖНО",
  "service_get_help": "→ Получить помощь сейчас",
  "faq_panic_whatsapp": "Написать в WhatsApp →",
  "faq_panic_call": "Позвонить"
};

const langs = { pl, uk, en, ru };

for (const lang in langs) {
  const filePath = `./messages/${lang}.json`;
  let fileContent = fs.readFileSync(filePath, 'utf8');
  const json = JSON.parse(fileContent);
  const newKeys = langs[lang];
  for (const key in newKeys) {
    json[key] = newKeys[key];
  }
  fs.writeFileSync(filePath, JSON.stringify(json, null, 2), 'utf8');
}

console.log("JSON translation files updated successfully!");
