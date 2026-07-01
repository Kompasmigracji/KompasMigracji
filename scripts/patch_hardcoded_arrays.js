const fs = require('fs');
const path = require('path');

const uk = {
  "team_bio_1": "10 років у міграційному праві Польщі. Особисто веде кожну консультацію та завжди бере трубку.",
  "team_bio_2": "Засновник Kompas Migracji — єдиного вікна для вирішення всіх бюрократичних завдань українців в ЄС.",
  "team_founder_title": "Засновник · Міграційний юрист",
  "team_name": "Олександр Василишин",
  "team_stat_years_label": "років досвіду",
  "team_stat_cases_label": "справ закрито",
  "team_stat_support_label": "на звʼязку",
  "team_btn_consultation": "Записатися на консультацію",

  "fs_s1_t": "Зв'яжіться з нами",
  "fs_s1_d": "WhatsApp, Viber або телефон — відповідаємо протягом 2 годин. Пишіть українською — зрозуміємо.",
  "fs_s2_t": "Підготуйте документи",
  "fs_s2_d": "Паспорт, свідоцтво про народження, підтвердження тимчасового захисту (якщо є). Відсутні документи — допоможемо отримати.",
  "fs_s3_t": "Безкоштовна оцінка ситуації",
  "fs_s3_d": "2 хвилини розмови достатньо, щоб ми сказали вам що саме робити і скільки це коштує. Без зобов'язань.",
  "fs_s4_t": "План дій",
  "fs_s4_d": "Ви отримаєте чіткий план: що, коли і в якій послідовності. Без несподіванок і прихованих витрат.",
  "fs_s5_t": "Виконання під наглядом",
  "fs_s5_d": "Ведемо вас крок за кроком. На кожному етапі ми на зв'язку та інформуємо про прогрес.",
  "fs_step_label": "Крок",
  "fs_now_label": "Зараз",
  "fs_btn": "Розпочати зараз — WhatsApp",
  "fs_footer": "Безкоштовно · Без зобов'язань · Відповідаємо протягом 2 год",

  "guar_i1_t": "Повна конфіденційність",
  "guar_i1_d": "Ваші дані захищені відповідно до RODO. Ми ніколи не передаємо інформацію про клієнтів третім особам.",
  "guar_i2_t": "Тільки законні методи",
  "guar_i2_d": "Працюємо виключно в рамках польського та європейського права. Нуль корупції, нуль обхідних шляхів.",
  "guar_i3_t": "Прозорі ціни",
  "guar_i3_d": "Ціна узгоджується до початку роботи. Без прихованих платежів і несподіванок наприкінці.",
  "guar_i4_t": "Завжди на зв'язку",
  "guar_i4_d": "Відповідаємо протягом 2 годин в робочі дні. Ви в курсі кожного кроку вашої справи.",
  "guar_fail_title": "Не зможемо допомогти? Скажемо чесно.",
  "guar_fail_desc": "Якщо ваша ситуація потребує інших спеціалістів — направимо вас до потрібних людей. Ваше благополуччя важливіше за наш прибуток.",
  "guar_fail_btn": "Задати питання безкоштовно →",

  "rev1_t": "Роботодавець відмовлявся виплачувати зарплату за два місяці. Завдяки юридичній консультації і правильно складеній заяві — отримав усе до копійки. Дякую!",
  "rev1_a": "Олексій Н.",
  "rev1_d": "квітень 2026",
  "rev2_t": "Зупинила поліція, хотіли вилучити права через технічну помилку в базі. Олександр підключився швидко — права залишилися при мені. Врятував ситуацію буквально за день.",
  "rev2_a": "Сергій М.",
  "rev2_d": "березень 2026",
  "rev3_t": "Після розлучення не могли домовитися про аліменти. Юридична консультація допомогла знайти рішення без суду — мирно і справедливо для обох сторін.",
  "rev3_a": "Наталія В.",
  "rev3_d": "лютий 2026",
  "rev4_t": "Спірний спадок між кількома родичами тягнувся місяцями. Олександр розклав усе по поличках, склав необхідні документи — і ми нарешті домовилися. Рекомендую всім.",
  "rev4_a": "Людмила Г.",
  "rev4_d": "травень 2026",
  "rev_real_text": "Реальні відгуки на"
};

const pl = {
  "team_bio_1": "10 lat w prawie migracyjnym Polski. Osobiście prowadzi każdą konsultację i zawsze odbiera telefon.",
  "team_bio_2": "Założyciel Kompas Migracji — jednego okienka do rozwiązywania wszystkich zadań biurokratycznych obcokrajowców w UE.",
  "team_founder_title": "Założyciel · Prawnik Migracyjny",
  "team_name": "Oleksandr Vasylyshyn",
  "team_stat_years_label": "lat doświadczenia",
  "team_stat_cases_label": "zakończonych spraw",
  "team_stat_support_label": "w kontakcie",
  "team_btn_consultation": "Zapisz się na konsultację",

  "fs_s1_t": "Skontaktuj się z nami",
  "fs_s1_d": "WhatsApp, Viber lub telefon — odpowiadamy w ciągu 2 godzin. Możesz pisać po ukraińsku, rosyjsku lub polsku.",
  "fs_s2_t": "Przygotuj dokumenty",
  "fs_s2_d": "Paszport, akt urodzenia, potwierdzenie ochrony tymczasowej (jeśli dotyczy). Jeśli brakuje dokumentów — pomożemy.",
  "fs_s3_t": "Bezpłatna ocena",
  "fs_s3_d": "2 minuty rozmowy wystarczą, abyśmy powiedzieli Ci co robić i ile to kosztuje. Bez zobowiązań.",
  "fs_s4_t": "Plan działania",
  "fs_s4_d": "Otrzymasz jasny plan: co, kiedy i w jakiej kolejności. Żadnych niespodzianek i ukrytych kosztów.",
  "fs_s5_t": "Nadzorowana realizacja",
  "fs_s5_d": "Prowadzimy Cię krok po kroku. Jesteśmy w stałym kontakcie i informujemy o postępach.",
  "fs_step_label": "Krok",
  "fs_now_label": "Teraz",
  "fs_btn": "Zacznij teraz — WhatsApp",
  "fs_footer": "Bezpłatnie · Bez zobowiązań · Odpowiadamy w 2 godziny",

  "guar_i1_t": "Pełna poufność",
  "guar_i1_d": "Twoje dane są chronione zgodnie z RODO. Nigdy nie przekazujemy informacji o klientach osobom trzecim.",
  "guar_i2_t": "Tylko legalne metody",
  "guar_i2_d": "Działamy wyłącznie w ramach polskiego i europejskiego prawa. Zero korupcji, zero dróg na skróty.",
  "guar_i3_t": "Przejrzyste ceny",
  "guar_i3_d": "Cena jest ustalana przed rozpoczęciem pracy. Bez ukrytych opłat i niespodzianek na końcu.",
  "guar_i4_t": "Zawsze w kontakcie",
  "guar_i4_d": "Odpowiadamy w ciągu 2 godzin w dni robocze. Jesteś na bieżąco z każdym krokiem Twojej sprawy.",
  "guar_fail_title": "Nie będziemy w stanie pomóc? Powiemy Ci szczerze.",
  "guar_fail_desc": "Jeśli Twoja sytuacja wymaga innych specjalistów — skierujemy Cię do odpowiednich osób. Twoje dobro jest dla nas ważniejsze niż zysk.",
  "guar_fail_btn": "Zadaj pytanie za darmo →",

  "rev1_t": "Pracodawca odmawiał wypłaty za dwa miesiące. Dzięki konsultacji prawnej i poprawnie napisanemu pismu odzyskałem wszystko co do grosza. Dziękuję!",
  "rev1_a": "Ołeksij N.",
  "rev1_d": "kwiecień 2026",
  "rev2_t": "Zatrzymała mnie policja, chcieli zabrać prawo jazdy przez błąd w systemie. Oleksandr szybko zainterweniował - prawo jazdy zostało. Uratował sytuację w jeden dzień.",
  "rev2_a": "Serhij M.",
  "rev2_d": "marzec 2026",
  "rev3_t": "Po rozwodzie nie mogliśmy się dogadać w sprawie alimentów. Pomoc prawna pozwoliła znaleźć rozwiązanie bez sądu - pokojowo i sprawiedliwie dla obu stron.",
  "rev3_a": "Natalia W.",
  "rev3_d": "luty 2026",
  "rev4_t": "Sporny spadek między krewnymi ciągnął się miesiącami. Oleksandr uporządkował to, przygotował dokumenty i w końcu się porozumieliśmy. Polecam każdemu.",
  "rev4_a": "Ludmiła G.",
  "rev4_d": "maj 2026",
  "rev_real_text": "Prawdziwe opinie na"
};

const en = {
  "team_bio_1": "10 years in Polish migration law. Personally leads every consultation and always answers the phone.",
  "team_bio_2": "Founder of Kompas Migracji — a one-stop shop for solving all bureaucratic tasks for foreigners in the EU.",
  "team_founder_title": "Founder · Migration Lawyer",
  "team_name": "Oleksandr Vasylyshyn",
  "team_stat_years_label": "years of experience",
  "team_stat_cases_label": "cases closed",
  "team_stat_support_label": "support",
  "team_btn_consultation": "Book a consultation",

  "fs_s1_t": "Contact us",
  "fs_s1_d": "WhatsApp, Viber or phone — we reply within 2 hours. You can write in English, Ukrainian or Russian.",
  "fs_s2_t": "Prepare documents",
  "fs_s2_d": "Passport, birth certificate, temporary protection (if any). If documents are missing, we will help you get them.",
  "fs_s3_t": "Free evaluation",
  "fs_s3_d": "A 2-minute conversation is enough for us to tell you what to do and how much it costs. No obligations.",
  "fs_s4_t": "Action plan",
  "fs_s4_d": "You will receive a clear plan: what, when, and in what order. No surprises and hidden costs.",
  "fs_s5_t": "Supervised execution",
  "fs_s5_d": "We guide you step by step. We are in touch at every stage and inform you about the progress.",
  "fs_step_label": "Step",
  "fs_now_label": "Now",
  "fs_btn": "Start now — WhatsApp",
  "fs_footer": "Free · No obligations · We reply within 2h",

  "guar_i1_t": "Full confidentiality",
  "guar_i1_d": "Your data is protected according to GDPR. We never share client information with third parties.",
  "guar_i2_t": "Only legal methods",
  "guar_i2_d": "We operate exclusively within Polish and European law. Zero corruption, zero shortcuts.",
  "guar_i3_t": "Transparent pricing",
  "guar_i3_d": "The price is agreed before work starts. No hidden fees and surprises at the end.",
  "guar_i4_t": "Always in touch",
  "guar_i4_d": "We reply within 2 hours on business days. You are updated on every step of your case.",
  "guar_fail_title": "Can't we help? We'll tell you honestly.",
  "guar_fail_desc": "If your situation requires other specialists, we will refer you to the right people. Your well-being is more important to us than profit.",
  "guar_fail_btn": "Ask a question for free →",

  "rev1_t": "The employer refused to pay a salary for two months. Thanks to the consultation and a correct request - I got every penny. Thank you!",
  "rev1_a": "Oleksii N.",
  "rev1_d": "April 2026",
  "rev2_t": "Stopped by the police, they wanted to take my license due to a system error. Oleksandr reacted quickly - I kept my license. Saved the situation in one day.",
  "rev2_a": "Serhii M.",
  "rev2_d": "March 2026",
  "rev3_t": "After a divorce, we couldn't agree on child support. Legal help let us find a solution without a court - peacefully and fairly for both sides.",
  "rev3_a": "Nataliia V.",
  "rev3_d": "February 2026",
  "rev4_t": "A disputed inheritance between relatives dragged on for months. Oleksandr organized everything and we finally agreed. Highly recommend.",
  "rev4_a": "Liudmyla H.",
  "rev4_d": "May 2026",
  "rev_real_text": "Real reviews on"
};

const ru = {
  "team_bio_1": "10 лет в миграционном праве Польши. Лично ведет каждую консультацию и всегда берет трубку.",
  "team_bio_2": "Основатель Kompas Migracji — единого окна для решения всех бюрократических задач иностранцев в ЕС.",
  "team_founder_title": "Основатель · Миграционный юрист",
  "team_name": "Александр Василишин",
  "team_stat_years_label": "лет опыта",
  "team_stat_cases_label": "дел закрыто",
  "team_stat_support_label": "на связи",
  "team_btn_consultation": "Записаться на консультацию",

  "fs_s1_t": "Свяжитесь с нами",
  "fs_s1_d": "WhatsApp, Viber или телефон — отвечаем в течение 2 часов. Пишите на русском или украинском — мы поймем.",
  "fs_s2_t": "Подготовьте документы",
  "fs_s2_d": "Паспорт, свидетельство о рождении, подтверждение временной защиты (если есть). Если чего-то нет — поможем получить.",
  "fs_s3_t": "Бесплатная оценка",
  "fs_s3_d": "2 минуты разговора достаточно, чтобы мы сказали, что делать и сколько это стоит. Без обязательств.",
  "fs_s4_t": "План действий",
  "fs_s4_d": "Вы получите четкий план: что, когда и в какой последовательности. Без сюрпризов и скрытых расходов.",
  "fs_s5_t": "Выполнение под контролем",
  "fs_s5_d": "Ведем вас шаг за шагом. На каждом этапе мы на связи и информируем о прогрессе.",
  "fs_step_label": "Шаг",
  "fs_now_label": "Сейчас",
  "fs_btn": "Начать сейчас — WhatsApp",
  "fs_footer": "Бесплатно · Без обязательств · Отвечаем за 2 часа",

  "guar_i1_t": "Полная конфиденциальность",
  "guar_i1_d": "Ваши данные защищены в соответствии с RODO. Мы никогда не передаем информацию о клиентах третьим лицам.",
  "guar_i2_t": "Только законные методы",
  "guar_i2_d": "Работаем исключительно в рамках польского и европейского права. Ноль коррупции, ноль обходных путей.",
  "guar_i3_t": "Прозрачные цены",
  "guar_i3_d": "Цена согласовывается до начала работы. Без скрытых платежей и сюрпризов в конце.",
  "guar_i4_t": "Всегда на связи",
  "guar_i4_d": "Отвечаем в течение 2 часов в рабочие дни. Вы в курсе каждого шага вашего дела.",
  "guar_fail_title": "Не сможем помочь? Скажем честно.",
  "guar_fail_desc": "Если ваша ситуация требует других специалистов — направим вас к нужным людям. Ваше благополучие важнее нашей прибыли.",
  "guar_fail_btn": "Задать вопрос бесплатно →",

  "rev1_t": "Работодатель отказывался выплачивать зарплату за два месяца. Благодаря юридической консультации и правильно составленному заявлению — получил все до копейки. Спасибо!",
  "rev1_a": "Алексей Н.",
  "rev1_d": "апрель 2026",
  "rev2_t": "Остановила полиция, хотели изъять права из-за технической ошибки в базе. Александр подключился быстро — права остались при мне. Спас ситуацию за один день.",
  "rev2_a": "Сергей М.",
  "rev2_d": "март 2026",
  "rev3_t": "После развода не могли договориться об алиментах. Юридическая консультация помогла найти решение без суда — мирно и справедливо для обеих сторон.",
  "rev3_a": "Наталья В.",
  "rev3_d": "февраль 2026",
  "rev4_t": "Спорное наследство между родственниками тянулось месяцами. Александр разложил все по полочкам, составил документы — и мы наконец договорились. Рекомендую всем.",
  "rev4_a": "Людмила Г.",
  "rev4_d": "май 2026",
  "rev_real_text": "Реальные отзывы на"
};

const translations = { uk, pl, en, ru };

for (const lang in translations) {
  const filePath = path.join(__dirname, `../messages/${lang}.json`);
  let fileContent = fs.readFileSync(filePath, 'utf8');
  const json = JSON.parse(fileContent);
  const newKeys = translations[lang];
  for (const key in newKeys) {
    json[key] = newKeys[key];
  }
  fs.writeFileSync(filePath, JSON.stringify(json, null, 2), 'utf8');
}
console.log('Translations successfully patched!');
