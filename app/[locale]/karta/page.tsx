'use client';

import { useState, useEffect } from 'react';
import { useLocale } from 'next-intl';
import { supabase } from '@/lib/supabase';
import { useRouter, usePathname } from 'next/navigation';
import ChatBot from '@/components/ChatBot';
import P24PaymentSteps from '@/components/P24PaymentSteps';

const ORANGE = '#f97316';
const MINT   = '#86efac';
const DARK   = '#1c1c1c';
const GRAY   = '#6b7280';
const LIGHT  = '#374151';
const LGRAY  = '#e5e7eb';

const small: React.CSSProperties = { fontSize: 10, fontWeight: 700, letterSpacing: '0.13em', textTransform: 'uppercase', margin: 0 };

const LANGS = {
  ua: {
    flag: '🇺🇦', label: 'Українська',
    ticker: ['ПРИСКОРЕННЯ КАРТИ ПОБУТУ ', '✦', ' 355 ЗЛ — 1 ЮРИДИЧНА ГОДИНА'],
    order: 'Замовити →',
    tag: 'ПОСЛУГА ПРИСКОРЕННЯ',
    h1: ['Втомився', 'чекати?'],
    pains: [
      { pre: 'Подав документи — і тиша. Уженд не відповідає.', bold: ' Тижні стали місяцями.' },
      { pre: 'Потрапив у воєводство де розглядають роками.', bold: ' Застряг. Не можеш рухатися.' },
      { pre: "Прив'язаний до одного роботодавця.", bold: ' Не можеш змінити роботу. Не можеш рости.' },
      { pre: 'Без карти —', bold: ' немає кредиту, немає іпотеки.', post: ' Ти "тимчасовий" у власному житті.' },
      { pre: "Хочеш поїхати до сім'ї —", bold: ' боїшся залишити справу без нагляду.' },
      { pre: 'Живеш у підвішеному стані', bold: ' вже рік. Або два.', post: ' Кінця не видно.' },
    ],
    notNormal: 'Це не нормально.',
    notNormalSub: "І ти не зобов'язаний з цим миритися.",
    bq: ['Система має інструменти. Закон має строки. Уженд ', "зобов'язаний", ' відповідати. Вони просто розраховують на те, що ти цього не знаєш.'],
    weKnow: 'Ми знаємо.',
    howTag: 'ЯК ЦЕ ПРАЦЮЄ',
    steps: [
      { n: '01', title: "Оплата — і ми зв'язуємося", pre: 'Ти оплачуєш юридичну годину. Ми збираємо деталі твоєї справи.', bold: ' Якщо не зможемо взятися — повертаємо гроші за 1 день.' },
      { n: '02', title: 'Унікальний пакет документів', pre: 'Ти отримуєш готовий пакет під твою справу.', bold: ' Роздрукував. Підписав. Надіслав.', post: ' Більше нічого від тебе не потрібно.' },
      { n: '03', title: 'Справа виходить на комітет рішень', pre: 'Протягом двох місяців — результат. Якщо уженд мовчить —', bold: ' скарга на бездіяльність.', post: ' Якщо знову мовчить — суд. Три етапи. Ми знаємо кожен.' },
    ],
    pricingTag: 'ТАРИФИ',
    p1tag: 'КАРТА ПОБУТУ', p1name: 'Пакет Прискорення', p1price: '355 ЗЛ', p1sub: '= 1 юридична година',
    p1f: ['Консультація по твоїй справі', 'Скарга на бездіяльність уженду', 'Унікальний пакет документів', 'Підготовка до суду — якщо потрібно'],
    p2tag: 'КАРТА РЕЗИДЕНТА ЄС', p2name: 'Пакет Резидент', p2price: '900 ЗЛ', p2sub: '= 2 юридичні години',
    p2f: ['Все те саме + складніша стратегія', 'Багатоетапний план виводу на рішення', 'Повний статус на 3+ роки', 'Підготовка до суду: 4 год. окремо'],
    gTitle: 'Гарантія — 1 день',
    gText: ["Якщо після оплати з'ясується, що ми не можемо взяти твою справу — ", 'повертаємо кошти за один день.', ' Жодної корупції. Жодних схем. Виключно по закону — знаємо де тиснути, знаємо що писати.'],
    fTitle: 'Олександр Василишин — чому ця стратегія працює і чому їй слід довіряти',
    fSub: 'Засновник Kompas Migracji · 8 років у міграційному праві · Особисто відповідає на дзвінки',
    ctaH: ['Твоя справа.', 'Наш хід.'],
    ctaSub: 'Напиши або зателефонуй — розберемося з твоєю ситуацією',
    ctaBtn: 'Замовити зараз',
    callTag: 'ЗАТЕЛЕФОНУВАТИ', callDesc: 'Особиста консультація від Олександра Василишина. Пн–Нд: 10:00 — 22:00',
    quote: 'Закладаю власну репутацію. Якщо щось не так — дзвоніть. Беру трубку завжди. — Олександр',
    ft1tag: 'ПРО ПРОЕКТ', ft1desc: "Захист українців від дискримінації. Єдине вікно з розв'язання усіх бюрократичних завдань — нотаріус, адвокат, медіатор, юридичний асистент.",
    ft2tag: 'ОСОБИСТІ КОНСУЛЬТАЦІЇ', ft2name: 'Олександр Василишин', ft2desc: 'Побудова дорожньої карти в еміграції.\nПн–Нд: 10:00 — 22:00',
    ft3tag: 'ЕКСТРЕНА ЮРИДИЧНА ДОПОМОГА', ft3sub: 'Цілодобово · 24/7',
    copy: 'Жодної корупції · Виключно по закону · Для українців в ЄС',
  },

  pl: {
    flag: '🇵🇱', label: 'Polski',
    ticker: ['PRZYSPIESZENIE KARTY POBYTU ', '✦', ' 355 ZŁ — 1 GODZINA PRAWNA'],
    order: 'Zamów →',
    tag: 'USŁUGA PRZYSPIESZENIA',
    h1: ['Zmęczony', 'czekaniem?'],
    pains: [
      { pre: 'Złożyłeś dokumenty — i cisza. Urząd nie odpowiada.', bold: ' Tygodnie stały się miesiącami.' },
      { pre: 'Trafiłeś do województwa gdzie rozpatrują latami.', bold: ' Utknąłeś. Nie możesz się ruszyć.' },
      { pre: 'Jesteś przywiązany do jednego pracodawcy.', bold: ' Nie możesz zmienić pracy. Nie możesz rosnąć.' },
      { pre: 'Bez karty —', bold: ' nie ma kredytu, nie ma hipoteki.', post: ' Jesteś "tymczasowy" we własnym życiu.' },
      { pre: 'Chcesz pojechać do rodziny —', bold: ' boisz się zostawić sprawę bez nadzoru.' },
      { pre: 'Żyjesz w zawieszeniu', bold: ' już rok. Albo dwa.', post: ' Końca nie widać.' },
    ],
    notNormal: 'To nie jest normalne.',
    notNormalSub: 'I nie musisz się z tym godzić.',
    bq: ['System ma narzędzia. Prawo ma terminy. Urząd ', 'jest zobowiązany', ' odpowiadać. Po prostu liczą na to, że tego nie wiesz.'],
    weKnow: 'My wiemy.',
    howTag: 'JAK TO DZIAŁA',
    steps: [
      { n: '01', title: 'Płatność — i kontaktujemy się', pre: 'Płacisz za godzinę prawną. Zbieramy szczegóły Twojej sprawy.', bold: ' Jeśli nie możemy się podjąć — zwracamy pieniądze w 1 dzień.' },
      { n: '02', title: 'Unikalny pakiet dokumentów', pre: 'Otrzymujesz gotowy pakiet pod Twoją sprawę.', bold: ' Wydrukuj. Podpisz. Wyślij.', post: ' Nic więcej od Ciebie nie potrzeba.' },
      { n: '03', title: 'Sprawa trafia do komitetu decyzyjnego', pre: 'W ciągu dwóch miesięcy — wynik. Jeśli urząd milczy —', bold: ' skarga na bezczynność.', post: ' Jeśli znów milczy — sąd. Trzy etapy. Znamy każdy.' },
    ],
    pricingTag: 'CENNIK',
    p1tag: 'KARTA POBYTU', p1name: 'Pakiet Przyspieszenia', p1price: '355 ZŁ', p1sub: '= 1 godzina prawna',
    p1f: ['Konsultacja Twojej sprawy', 'Skarga na bezczynność urzędu', 'Unikalny pakiet dokumentów', 'Przygotowanie do sądu — jeśli potrzeba'],
    p2tag: 'KARTA REZYDENTA UE', p2name: 'Pakiet Rezydent', p2price: '900 ZŁ', p2sub: '= 2 godziny prawne',
    p2f: ['Wszystko to samo + bardziej złożona strategia', 'Wieloetapowy plan prowadzący do decyzji', 'Pełny status na 3+ lata', 'Przygotowanie do sądu: 4 godz. osobno'],
    gTitle: 'Gwarancja — 1 dzień',
    gText: ['Jeśli po płatności okaże się, że nie możemy podjąć Twojej sprawy — ', 'zwracamy środki w jeden dzień.', ' Zero korupcji. Zero schematów. Wyłącznie zgodnie z prawem — wiemy gdzie naciskać, wiemy co pisać.'],
    fTitle: 'Oleksandr Vasylyshyn — dlaczego ta strategia działa i dlaczego można jej ufać',
    fSub: 'Założyciel Kompas Migracji · 8 lat w prawie migracyjnym · Osobiście odbiera telefony',
    ctaH: ['Twoja sprawa.', 'Nasz ruch.'],
    ctaSub: 'Napisz lub zadzwoń — zajmiemy się Twoją sytuacją',
    ctaBtn: 'Zamów teraz',
    callTag: 'ZADZWOŃ', callDesc: 'Osobista konsultacja Oleksandra Vasylyshyna. Pon–Nd: 10:00 — 22:00',
    quote: 'Stawiam swoją reputację. Jeśli coś nie tak — dzwońcie. Zawsze odbieram. — Oleksandr',
    ft1tag: 'O PROJEKCIE', ft1desc: 'Ochrona Ukraińców przed dyskryminacją. Jedno okienko rozwiązujące wszystkie zadania biurokratyczne — notariusz, prawnik, mediator, asystent prawny.',
    ft2tag: 'KONSULTACJE OSOBISTE', ft2name: 'Oleksandr Vasylyshyn', ft2desc: 'Budowanie mapy drogowej w emigracji.\nPon–Nd: 10:00 — 22:00',
    ft3tag: 'PILNA POMOC PRAWNA', ft3sub: 'Całą dobę · 24/7',
    copy: 'Zero korupcji · Wyłącznie zgodnie z prawem · Dla Ukraińców w UE',
  },

  ru: {
    flag: '🇷🇺', label: 'Русский',
    ticker: ['УСКОРЕНИЕ КАРТЫ ПОБЫТУ ', '✦', ' 355 ЗЛ — 1 ЮРИДИЧЕСКИЙ ЧАС'],
    order: 'Заказать →',
    tag: 'УСЛУГА УСКОРЕНИЯ',
    h1: ['Устал', 'ждать?'],
    pains: [
      { pre: 'Подал документы — и тишина. Ужонд не отвечает.', bold: ' Недели стали месяцами.' },
      { pre: 'Попал в воеводство, где рассматривают годами.', bold: ' Застрял. Не можешь двигаться.' },
      { pre: 'Привязан к одному работодателю.', bold: ' Не можешь сменить работу. Не можешь расти.' },
      { pre: 'Без карты —', bold: ' нет кредита, нет ипотеки.', post: ' Ты "временный" в собственной жизни.' },
      { pre: 'Хочешь поехать к семье —', bold: ' боишься оставить дело без присмотра.' },
      { pre: 'Живёшь в подвешенном состоянии', bold: ' уже год. Или два.', post: ' Конца не видно.' },
    ],
    notNormal: 'Это ненормально.',
    notNormalSub: 'И ты не обязан с этим мириться.',
    bq: ['Система имеет инструменты. Закон имеет сроки. Ужонд ', 'обязан', ' отвечать. Они просто рассчитывают на то, что ты этого не знаешь.'],
    weKnow: 'Мы знаем.',
    howTag: 'КАК ЭТО РАБОТАЕТ',
    steps: [
      { n: '01', title: 'Оплата — и мы связываемся', pre: 'Ты оплачиваешь юридический час. Мы собираем детали твоего дела.', bold: ' Если не сможем взяться — возвращаем деньги за 1 день.' },
      { n: '02', title: 'Уникальный пакет документов', pre: 'Ты получаешь готовый пакет под твоё дело.', bold: ' Распечатал. Подписал. Отправил.', post: ' Больше ничего от тебя не нужно.' },
      { n: '03', title: 'Дело выходит на комитет решений', pre: 'В течение двух месяцев — результат. Если ужонд молчит —', bold: ' жалоба на бездействие.', post: ' Если снова молчит — суд. Три этапа. Мы знаем каждый.' },
    ],
    pricingTag: 'ТАРИФЫ',
    p1tag: 'КАРТА ПОБЫТУ', p1name: 'Пакет Ускорения', p1price: '355 ЗЛ', p1sub: '= 1 юридический час',
    p1f: ['Консультация по твоему делу', 'Жалоба на бездействие ужонда', 'Уникальный пакет документов', 'Подготовка к суду — если нужно'],
    p2tag: 'КАРТА РЕЗИДЕНТА ЕС', p2name: 'Пакет Резидент', p2price: '900 ЗЛ', p2sub: '= 2 юридических часа',
    p2f: ['Всё то же + более сложная стратегия', 'Многоэтапный план выхода на решение', 'Полный статус на 3+ года', 'Подготовка к суду: 4 ч. отдельно'],
    gTitle: 'Гарантия — 1 день',
    gText: ['Если после оплаты выяснится, что мы не можем взять твоё дело — ', 'возвращаем средства за один день.', ' Никакой коррупции. Никаких схем. Исключительно по закону — знаем где давить, знаем что писать.'],
    fTitle: 'Александр Василишин — почему эта стратегия работает и почему ей стоит доверять',
    fSub: 'Основатель Kompas Migracji · 8 лет в миграционном праве · Лично отвечает на звонки',
    ctaH: ['Твоё дело.', 'Наш ход.'],
    ctaSub: 'Напиши или позвони — разберёмся с твоей ситуацией',
    ctaBtn: 'Заказать сейчас',
    callTag: 'ЗАТЕЛЕФОНУВАТИ', callDesc: 'Личная консультация Александра Василишина. Пн–Вс: 10:00 — 22:00',
    quote: 'Ставлю собственную репутацию. Если что-то не так — звоните. Беру трубку всегда. — Александр',
    ft1tag: 'О ПРОЕКТЕ', ft1desc: 'Защита украинцев от дискриминации. Единое окно для решения всех бюрократических задач — нотариус, адвокат, медиатор, юридический ассистент.',
    ft2tag: 'ЛИЧНЫЕ КОНСУЛЬТАЦИИ', ft2name: 'Александр Василишин', ft2desc: 'Построение дорожной карты в эмиграции.\nПн–Вс: 10:00 — 22:00',
    ft3tag: 'СРОЧНАЯ ЮРИДИЧЕСКАЯ ПОМОЩЬ', ft3sub: 'Круглосуточно · 24/7',
    copy: 'Никакой коррупции · Исключительно по закону · Для украинцев в ЕС',
  },

  en: {
    flag: '🇬🇧', label: 'English',
    ticker: ['RESIDENCE CARD ACCELERATION ', '✦', ' 355 PLN — 1 LEGAL HOUR'],
    order: 'Order →',
    tag: 'ACCELERATION SERVICE',
    h1: ['Tired of', 'waiting?'],
    pains: [
      { pre: 'You filed documents — and silence. The office does not respond.', bold: ' Weeks became months.' },
      { pre: 'You ended up in a district that processes for years.', bold: ' Stuck. You cannot move forward.' },
      { pre: 'You are tied to one employer.', bold: ' You cannot change jobs. You cannot grow.' },
      { pre: 'Without the card —', bold: ' no credit, no mortgage.', post: ' You are "temporary" in your own life.' },
      { pre: 'You want to visit your family —', bold: ' you are afraid to leave your case unattended.' },
      { pre: 'You have been living in limbo for', bold: ' a year. Or two.', post: ' No end in sight.' },
    ],
    notNormal: 'This is not normal.',
    notNormalSub: 'And you do not have to accept it.',
    bq: ['The system has tools. The law has deadlines. The office ', 'is obligated', ' to respond. They simply count on you not knowing this.'],
    weKnow: 'We know.',
    howTag: 'HOW IT WORKS',
    steps: [
      { n: '01', title: 'Payment — and we get in touch', pre: 'You pay for a legal hour. We gather details of your case.', bold: ' If we cannot take it — we refund within 1 day.' },
      { n: '02', title: 'Unique document package', pre: 'You receive a ready-made package tailored to your case.', bold: ' Print. Sign. Send.', post: ' Nothing more is needed from you.' },
      { n: '03', title: 'Case reaches the decision committee', pre: 'Within two months — a result. If the office is silent —', bold: ' complaint for inaction.', post: ' If silent again — court. Three stages. We know each one.' },
    ],
    pricingTag: 'PRICING',
    p1tag: 'RESIDENCE CARD', p1name: 'Acceleration Package', p1price: '355 PLN', p1sub: '= 1 legal hour',
    p1f: ['Consultation on your case', 'Complaint for office inaction', 'Unique document package', 'Court preparation — if needed'],
    p2tag: 'EU RESIDENT CARD', p2name: 'Resident Package', p2price: '900 PLN', p2sub: '= 2 legal hours',
    p2f: ['Everything above + complex strategy', 'Multi-step plan leading to decision', 'Full status for 3+ years', 'Court preparation: 4 hrs separately'],
    gTitle: 'Guarantee — 1 day',
    gText: ['If after payment it turns out we cannot take your case — ', 'we refund within one day.', ' Zero corruption. Zero schemes. Strictly by the law — we know where to press, we know what to write.'],
    fTitle: 'Oleksandr Vasylyshyn — why this strategy works and why it can be trusted',
    fSub: 'Founder of Kompas Migracji · 8 years in immigration law · Personally answers calls',
    ctaH: ['Your case.', 'Our move.'],
    ctaSub: 'Write or call — we will sort out your situation',
    ctaBtn: 'Order now',
    callTag: 'CALL US', callDesc: 'Personal consultation from Oleksandr Vasylyshyn. Mon–Sun: 10:00 — 22:00',
    quote: 'I stake my own reputation. If something is wrong — call. I always answer. — Oleksandr',
    ft1tag: 'ABOUT', ft1desc: 'Protecting Ukrainians from discrimination. A one-stop window for all bureaucratic tasks — notary, lawyer, mediator, legal assistant.',
    ft2tag: 'PERSONAL CONSULTATIONS', ft2name: 'Oleksandr Vasylyshyn', ft2desc: 'Building a roadmap in emigration.\nMon–Sun: 10:00 — 22:00',
    ft3tag: 'EMERGENCY LEGAL AID', ft3sub: '24/7',
    copy: 'Zero corruption · Strictly by the law · For Ukrainians in the EU',
  },

  rom: {
    flag: '🇷🇴', label: 'Română',
    ticker: ['ACCELERAREA CĂRȚII DE ȘEDERE ', '✦', ' 355 ZŁ — 1 ORĂ JURIDICĂ'],
    order: 'Comandă →',
    tag: 'SERVICIU DE ACCELERARE',
    h1: ['Obosit', 'să aștepți?'],
    pains: [
      { pre: 'Ai depus documentele — și tăcere. Oficiul nu răspunde.', bold: ' Săptămânile au devenit luni.' },
      { pre: 'Ai nimerit într-un voievodat unde dosarele se analizează ani întregi.', bold: ' Ești blocat. Nu poți avansa.' },
      { pre: 'Ești legat de un singur angajator.', bold: ' Nu poți schimba locul de muncă. Nu poți crește.' },
      { pre: 'Fără carte —', bold: ' nu ai credit, nu ai ipotecă.', post: ' Ești „temporar” în propria ta viață.' },
      { pre: 'Vrei să-ți vizitezi familia —', bold: ' ți-e teamă să lași dosarul nesupravegheat.' },
      { pre: 'Trăiești în incertitudine', bold: ' de un an. Sau doi.', post: ' Nu se vede sfârșitul.' },
    ],
    notNormal: 'Asta nu este normal.',
    notNormalSub: 'Și nu ești obligat să accepți asta.',
    bq: ['Sistemul are instrumente. Legea are termene. Oficiul ', 'este obligat', ' să răspundă. Ei doar contează pe faptul că tu nu știi asta.'],
    weKnow: 'Noi știm.',
    howTag: 'CUM FUNCȚIONEAZĂ',
    steps: [
      { n: '01', title: 'Plata — și te contactăm', pre: 'Plătești o oră juridică. Adunăm detaliile dosarului tău.', bold: ' Dacă nu putem prelua cazul — returnăm banii în 1 zi.' },
      { n: '02', title: 'Pachet unic de documente', pre: 'Primești un pachet gata pregătit pentru cazul tău.', bold: ' Printezi. Semnezi. Trimiți.', post: ' Nimic altceva nu este necesar din partea ta.' },
      { n: '03', title: 'Dosarul ajunge la comitetul de decizie', pre: 'În două luni — rezultat. Dacă oficiul tace —', bold: ' plângere pentru inacțiune.', post: ' Dacă tace din nou — instanța. Trei etape. Le cunoaștem pe fiecare.' },
    ],
    pricingTag: 'TARIFE',
    p1tag: 'CARTE DE ȘEDERE', p1name: 'Pachetul Accelerare', p1price: '355 ZŁ', p1sub: '= 1 oră juridică',
    p1f: ['Consultație pe dosarul tău', 'Plângere pentru inacțiunea oficiului', 'Pachet unic de documente', 'Pregătire pentru instanță — dacă e nevoie'],
    p2tag: 'CARTE DE REZIDENT UE', p2name: 'Pachetul Rezident', p2price: '900 ZŁ', p2sub: '= 2 ore juridice',
    p2f: ['Tot ce e mai sus + strategie mai complexă', 'Plan în mai multe etape până la decizie', 'Statut complet pentru 3+ ani', 'Pregătire pentru instanță: 4 ore separat'],
    gTitle: 'Garanție — 1 zi',
    gText: ['Dacă după plată se dovedește că nu putem prelua dosarul tău — ', 'returnăm banii într-o singură zi.', ' Zero corupție. Zero scheme. Strict conform legii — știm unde să apăsăm, știm ce să scriem.'],
    fTitle: 'Oleksandr Vasylyshyn — de ce funcționează această strategie și de ce merită încredere',
    fSub: 'Fondatorul Kompas Migracji · 8 ani în dreptul migrației · Răspunde personal la telefon',
    ctaH: ['Dosarul tău.', 'Mutarea noastră.'],
    ctaSub: 'Scrie sau sună — ne ocupăm de situația ta',
    ctaBtn: 'Comandă acum',
    callTag: 'SUNĂ-NE', callDesc: 'Consultație personală de la Oleksandr Vasylyshyn. Lun–Dum: 10:00 — 22:00',
    quote: 'Îmi pun în joc propria reputație. Dacă ceva nu e în regulă — sunați. Răspund întotdeauna. — Oleksandr',
    ft1tag: 'DESPRE PROIECT', ft1desc: 'Protecția ucrainenilor împotriva discriminării. Un ghișeu unic pentru toate sarcinile birocratice — notar, avocat, mediator, asistent juridic.',
    ft2tag: 'CONSULTAȚII PERSONALE', ft2name: 'Oleksandr Vasylyshyn', ft2desc: 'Construirea unei foi de parcurs în emigrare.\nLun–Dum: 10:00 — 22:00',
    ft3tag: 'ASISTENȚĂ JURIDICĂ DE URGENȚĂ', ft3sub: 'Non-stop · 24/7',
    copy: 'Zero corupție · Strict conform legii · Pentru ucraineni în UE',
  },
};

type LangKey = keyof typeof LANGS;

const PAY_TEXT = {
  ua: { btn: 'Оплатити через Przelewy24', firstNameLabel: "Ім'я (латиницею)", firstNamePh: 'Ivan', lastNameLabel: 'Прізвище (латиницею)', lastNamePh: 'Petrenko', phoneLabel: 'Контактний телефон', phonePh: '+48 123 456 789', emailLabel: 'Email для чеку', emailPh: 'example@gmail.com', go: 'Перейти до оплати Przelewy24', cancel: 'Скасувати', loading: 'Перенаправлення...', errFirstName: "Введіть ім'я латиницею (напр. Ivan)", errLastName: 'Введіть прізвище латиницею (напр. Petrenko)', errPhone: 'Введіть контактний номер телефону', errEmail: 'Введіть коректний email', errNet: "Помилка з'єднання. Спробуйте ще раз.", regText: 'Оплачуючи, ви погоджуєтесь з' },
  pl: { btn: 'Zapłać przez Przelewy24', firstNameLabel: 'Imię (łacińskie litery)', firstNamePh: 'Ivan', lastNameLabel: 'Nazwisko (łacińskie litery)', lastNamePh: 'Petrenko', phoneLabel: 'Telefon kontaktowy', phonePh: '+48 123 456 789', emailLabel: 'Twój email na paragon', emailPh: 'example@gmail.com', go: 'Przejdź do płatności Przelewy24', cancel: 'Anuluj', loading: 'Przekierowanie...', errFirstName: 'Wpisz imię łacińskimi literami (np. Ivan)', errLastName: 'Wpisz nazwisko łacińskimi literami (np. Petrenko)', errPhone: 'Wpisz numer telefonu kontaktowego', errEmail: 'Wpisz poprawny email', errNet: 'Błąd połączenia. Spróbuj ponownie.', regText: 'Dokonując płatności, akceptujesz' },
  ru: { btn: 'Оплатить через Przelewy24', firstNameLabel: 'Имя (латиницей)', firstNamePh: 'Ivan', lastNameLabel: 'Фамилия (латиницей)', lastNamePh: 'Petrenko', phoneLabel: 'Контактный телефон', phonePh: '+48 123 456 789', emailLabel: 'Ваш email для чека', emailPh: 'example@gmail.com', go: 'Перейти к оплате Przelewy24', cancel: 'Отмена', loading: 'Перенаправление...', errFirstName: 'Введите имя латиницей (напр. Ivan)', errLastName: 'Введите фамилию латиницей (напр. Petrenko)', errPhone: 'Введите контактный номер телефона', errEmail: 'Введите корректный email', errNet: 'Ошибка соединения. Попробуйте снова.', regText: 'Оплачивая, вы соглашаетесь с' },
  en: { btn: 'Pay via Przelewy24', firstNameLabel: 'First name (Latin)', firstNamePh: 'Ivan', lastNameLabel: 'Last name (Latin)', lastNamePh: 'Petrenko', phoneLabel: 'Contact phone', phonePh: '+48 123 456 789', emailLabel: 'Your email for receipt', emailPh: 'example@gmail.com', go: 'Proceed to Przelewy24 payment', cancel: 'Cancel', loading: 'Redirecting...', errFirstName: 'Enter first name in Latin (e.g. Ivan)', errLastName: 'Enter last name in Latin (e.g. Petrenko)', errPhone: 'Enter your contact phone number', errEmail: 'Enter a valid email', errNet: 'Connection error. Please try again.', regText: 'By paying, you agree to the' },
  rom: { btn: 'Plătiți via Przelewy24', firstNameLabel: 'Nume (Latin)', firstNamePh: 'Ivan', lastNameLabel: 'Prenume (Latin)', lastNamePh: 'Petrenko', phoneLabel: 'Telefon contact', phonePh: '+48 123 456 789', emailLabel: 'Email pentru chitanță', emailPh: 'example@gmail.com', go: 'Treceți la plata Przelewy24', cancel: 'Anulare', loading: 'Redirecționare...', errFirstName: 'Introduceți numele în latină (ex. Ivan)', errLastName: 'Introduceți prenumele în latină (ex. Petrenko)', errPhone: 'Introduceți numărul de telefon', errEmail: 'Introduceți un email valid', errNet: 'Eroare de conexiune. Încercați din nou.', regText: 'Plătind, sunteți de acord cu' },
};

function Tag({ color, children }: { color: string; children: React.ReactNode }) {
  return <p style={{ ...small, color, marginBottom: 12 }}>{children}</p>;
}

function MixedText({ pre, bold, post, size = 15, lineHeight = 1.7 }: { pre: string; bold: string; post?: string; size?: number; lineHeight?: number }) {
  return (
    <p style={{ margin: 0, fontSize: size, lineHeight, color: LIGHT }}>
      <span style={{ color: LIGHT }}>{pre}</span>
      <strong style={{ color: DARK, fontWeight: 700 }}>{bold}</strong>
      {post && <span style={{ color: LIGHT }}>{post}</span>}
    </p>
  );
}

const LOCALE_TO_LANG: Record<string, LangKey> = { uk: 'ua', pl: 'pl', ru: 'ru', en: 'en', rom: 'rom' };

export default function KartaPage(): React.JSX.Element {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [lang, setLang] = useState<LangKey>(() => LOCALE_TO_LANG[locale] ?? 'ua');
  const t = LANGS[lang];
  const pt = PAY_TEXT[lang];

  const [payStep, setPayStep] = useState<{ pkg: string; amount: number; desc: string } | null>(null);
  const [payFirstName, setPayFirstName] = useState('');
  const [payLastName,  setPayLastName]  = useState('');
  const [payPhone,     setPayPhone]     = useState('');
  const [payEmail, setPayEmail] = useState('');
  const [payLoading, setPayLoading] = useState(false);
  const [payError, setPayError] = useState('');
  const [payAgreed, setPayAgreed] = useState(false);

  useEffect(() => setMounted(true), []);
  useEffect(() => { setLang(LOCALE_TO_LANG[locale] ?? 'ua'); }, [locale]);

  const openPay = (pkg: string, amount: number, desc: string): void => {
    setPayStep({ pkg, amount, desc });
    setPayFirstName(''); setPayLastName(''); setPayPhone('');
    setPayEmail(''); setPayError(''); setPayAgreed(false);
  };

  const closePay = (): void => {
    setPayStep(null);
    setPayFirstName(''); setPayLastName(''); setPayPhone('');
    setPayEmail(''); setPayError(''); setPayLoading(false);
  };

  const proceedPay = async () => {
    const hasCyrillic = /[а-яА-ЯіІїЇєЄ]/;
    if (!payFirstName.trim() || payFirstName.trim().length < 2 || hasCyrillic.test(payFirstName)) {
      setPayError(pt.errFirstName); return;
    }
    if (!payLastName.trim() || payLastName.trim().length < 2 || hasCyrillic.test(payLastName)) {
      setPayError(pt.errLastName); return;
    }
    if (!payPhone.trim() || payPhone.replace(/\D/g, '').length < 9) {
      setPayError(pt.errPhone); return;
    }
    if (!payEmail || !/\S+@\S+\.\S+/.test(payEmail)) {
      setPayError(pt.errEmail);
      return;
    }
    setPayLoading(true);
    setPayError('');
    try {
      if (!payStep) {
        setPayError(pt.errNet);
        setPayLoading(false);
        return;
      }
      const res = await fetch('/api/payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: payStep.amount, description: payStep.desc, email: payEmail, firstName: payFirstName.trim(), lastName: payLastName.trim(), phone: payPhone.trim(), lang, source: 'karta' }),
      });
      const data = await res.json();
      if (data.redirectUrl) {
        window.location.href = data.redirectUrl;
      } else {
        setPayError(data.error || pt.errNet);
        setPayLoading(false);
      }
    } catch {
      setPayError(pt.errNet);
      setPayLoading(false);
    }
  };

  const changeLanguage = (newKey: LangKey): void => {
    const nextLocale = Object.keys(LOCALE_TO_LANG).find(key => LOCALE_TO_LANG[key] === newKey) || 'uk';
    if (!pathname) return;
    const newPath = pathname.startsWith(`/${locale}`) ? pathname.replace(`/${locale}`, `/${nextLocale}`) : `/${nextLocale}${pathname}`;
    router.push(newPath);
  };

  const handleOrder = async (): Promise<void> => {
    const msgs: Record<LangKey, string> = {
      ua: 'Хочу замовити Пакет Прискорення — Карта побуту',
      pl: 'Chcę zamówić Pakiet Przyspieszenia — Karta pobytu',
      ru: 'Хочу заказать Пакет Ускорения — Карта побыту',
      en: 'I want to order the Acceleration Package — Residence Card',
      rom: 'Vreau să comand Pachetul de Accelerare — Cartea de rezidență',
    };
    if (supabase) { try { await fetch('/api/lead', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name: 'Анонім (Клік)', contact: 'WhatsApp', service: 'Пакет Прискорення — Карта побуту', message: msgs[lang], source: 'site' }) }); } catch {} }
    window.open(`https://wa.me/48729271848?text=${encodeURIComponent(msgs[lang])}`, '_blank');
  };

  if (!mounted) return <div style={{ background: '#fff', minHeight: '100vh' }} />;

  return (
    <>
      <style>{`
        @keyframes karta-scroll {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .karta-ticker { animation: karta-scroll 30s linear infinite; display: inline-block; white-space: nowrap; }
        .karta-card:hover { border-color: ${ORANGE} !important; }
        .karta-cta-btn {
          display: inline-block;
          background: ${ORANGE};
          color: #fff;
          font-size: 15px;
          font-weight: 700;
          letter-spacing: 0.02em;
          padding: 14px 36px;
          border-radius: 8px;
          border: none;
          cursor: pointer;
          transition: opacity 0.2s;
          text-decoration: none;
        }
        .karta-cta-btn:hover { opacity: 0.88; }
        #karta-root { overflow-x: hidden; }
        #karta-root p, #karta-root span, #karta-root li {
          word-break: break-word;
          overflow-wrap: break-word;
        }
        #karta-root * { box-sizing: border-box; }
        @media (max-width: 480px) {
          .karta-step-num { font-size: 28px !important; margin-bottom: 6px !important; }
          .karta-pkg-name { font-size: 16px !important; }
          .karta-hero-h1 { letter-spacing: -0.035em !important; }
        }
      `}</style>

      <div id="karta-root" style={{ fontFamily: "'Syne', sans-serif", background: '#fff', color: DARK }}>

        {/* LANG BAR */}
        <div style={{ borderBottom: `1px solid ${LGRAY}`, padding: '10px 24px', display: 'flex', justifyContent: 'flex-end', gap: 6 }}>
          {(Object.entries(LANGS) as [LangKey, typeof LANGS.ua][]).map(([key, val]) => (
            <button key={key} onClick={() => changeLanguage(key)} style={{
              padding: '4px 12px',
              border: `1.5px solid ${lang === key ? ORANGE : LGRAY}`,
              borderRadius: 6,
              background: lang === key ? '#fff7ed' : 'transparent',
              color: lang === key ? ORANGE : GRAY,
              fontSize: 11, fontWeight: 700,
              letterSpacing: '0.05em',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}>
              {val.flag} {val.label}
            </button>
          ))}
        </div>

        {/* TICKER */}
        <div style={{ background: DARK, overflow: 'hidden', padding: '8px 0' }}>
          <div className="karta-ticker">
            {Array.from({ length: 8 }).map((_, i) => (
              <span key={i} style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.14em', color: '#fff', marginRight: 48 }}>
                {t.ticker[0]}<span style={{ color: ORANGE }}>{t.ticker[1]}</span>{t.ticker[2]}
              </span>
            ))}
          </div>
        </div>

        {/* NAV */}
        <div style={{ borderBottom: `1px solid ${LGRAY}`, padding: '14px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: 17, fontWeight: 700, letterSpacing: '-0.01em' }}>
            <span style={{ color: ORANGE }}>Kompas </span><span style={{ color: DARK }}>Migracji</span>
          </span>
          <button onClick={handleOrder} style={{
            background: 'transparent', border: 'none',
            color: GRAY, fontSize: 13, fontWeight: 600,
            cursor: 'pointer', letterSpacing: '0.02em',
          }}>
            {t.order}
          </button>
        </div>

        {/* CONTENT */}
        <div style={{ maxWidth: 860, margin: '0 auto', padding: '0 24px' }}>

          {/* HERO */}
          <section style={{ padding: '48px 0 32px' }}>
            <Tag color={ORANGE}>{t.tag}</Tag>
            <h1 className="karta-hero-h1" style={{ fontSize: 'clamp(34px, 10vw, 86px)', fontWeight: 900, lineHeight: 0.95, letterSpacing: '-0.04em', margin: 0 }}>
              <span style={{ display: 'block', color: DARK }}>{t.h1[0]}</span>
              <span style={{ display: 'block', color: ORANGE }}>{t.h1[1]}</span>
            </h1>
          </section>

          {/* PAIN POINTS */}
          <section style={{ borderTop: `1px solid ${LGRAY}` }}>
            {t.pains.map((p, i) => (
              <div key={i} style={{ borderBottom: `1px solid ${LGRAY}`, padding: '16px 0', display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                <span style={{ color: ORANGE, fontWeight: 800, flexShrink: 0, lineHeight: '1.7', fontSize: 14 }}>—</span>
                <MixedText pre={p.pre} bold={p.bold} post={p.post} size={14} />
              </div>
            ))}
          </section>

          {/* NOT NORMAL */}
          <section style={{ padding: '32px 0 0' }}>
            <p style={{ margin: '0 0 2px', fontWeight: 800, fontSize: 14, color: DARK }}>{t.notNormal}</p>
            <p style={{ margin: '0 0 28px', fontWeight: 700, fontSize: 14, color: ORANGE }}>{t.notNormalSub}</p>

            <div style={{ display: 'grid', gridTemplateColumns: '3px 1fr', gap: 20, marginBottom: 48 }}>
              <div style={{ background: MINT, borderRadius: 2 }} />
              <div>
                <p style={{ margin: '0 0 14px', fontSize: 13, color: '#4b5563', lineHeight: 1.8 }}>
                  <span style={{ color: '#4b5563' }}>{t.bq[0]}</span>
                  <strong style={{ color: DARK }}>{t.bq[1]}</strong>
                  <span style={{ color: '#4b5563' }}>{t.bq[2]}</span>
                </p>
                <p style={{ margin: 0, fontSize: 30, fontWeight: 800, color: MINT, lineHeight: 1.1, letterSpacing: '-0.02em' }}>
                  {t.weKnow}
                </p>
              </div>
            </div>
          </section>

          {/* HOW IT WORKS */}
          <section>
            <Tag color={GRAY}>{t.howTag}</Tag>
            <div style={{ borderTop: `2px solid ${LGRAY}`, marginBottom: 0 }} />
            {t.steps.map((s, i) => (
              <div key={i} style={{ borderBottom: `1px solid ${LGRAY}`, padding: '24px 0' }}>
                <p className="karta-step-num" style={{ fontSize: 40, fontWeight: 900, color: '#d1d5db', margin: '0 0 8px', lineHeight: 1, letterSpacing: '-0.02em' }}>{s.n}</p>
                <p style={{ fontSize: 14, fontWeight: 700, margin: '0 0 6px', color: DARK, lineHeight: 1.4 }}>{s.title}</p>
                <MixedText pre={s.pre} bold={s.bold} post={s.post} size={13} />
              </div>
            ))}
          </section>

          {/* PRICING */}
          <section style={{ paddingTop: 44, paddingBottom: 52 }}>
            <Tag color={GRAY}>{t.pricingTag}</Tag>
            <div style={{ borderTop: `2px solid ${ORANGE}`, marginBottom: 36 }} />

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 40 }}>
              {/* pkg 1 */}
              <div style={{ position: 'relative' }}>
                <span style={{ display: 'inline-block', background: 'linear-gradient(135deg, #f97316, #dc2626)', color: '#fff', fontSize: 10, fontWeight: 700, letterSpacing: '0.12em', padding: '3px 12px', borderRadius: 999, textTransform: 'uppercase', marginBottom: 8 }}>
                  АКЦІЯ
                </span>
                <Tag color={ORANGE}>{t.p1tag}</Tag>
                <p className="karta-pkg-name" style={{ fontSize: 20, fontWeight: 800, margin: '0 0 2px', color: DARK }}>{t.p1name}</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, margin: '4px 0 2px' }}>
                  <span style={{ fontSize: 18, fontWeight: 700, color: '#9ca3af', textDecoration: 'line-through' }}>600</span>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={ORANGE} strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                </div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 7, margin: '0 0 2px' }}>
                  <span style={{ fontSize: 'clamp(64px, 16vw, 96px)', fontWeight: 900, color: ORANGE, letterSpacing: '-0.045em', lineHeight: 0.88 }}>
                    {t.p1price.split(' ')[0]}
                  </span>
                  <span style={{ fontSize: 'clamp(28px, 6vw, 42px)', fontWeight: 900, color: ORANGE, letterSpacing: '-0.02em' }}>
                    {t.p1price.split(' ').slice(1).join(' ')}
                  </span>
                </div>
                <p style={{ fontSize: 12, color: GRAY, margin: '0 0 20px' }}>{t.p1sub}</p>
                <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 24px', display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {t.p1f.map((f, i) => (
                    <li key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', fontSize: 13, color: LIGHT }}>
                      <span style={{ color: ORANGE, flexShrink: 0, fontWeight: 700, lineHeight: '1.6' }}>→</span>
                      <span style={{ color: LIGHT }}>{f}</span>
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => openPay('p1', 35500, t.p1name)}
                  style={{ width: '100%', padding: '13px 0', borderRadius: 10, border: 'none', cursor: 'pointer', background: ORANGE, color: '#fff', fontWeight: 700, fontSize: 14, fontFamily: "'Syne', sans-serif", letterSpacing: '0.01em', transition: 'opacity 0.2s' }}
                  onMouseEnter={e => { e.currentTarget.style.opacity = '0.88'; }}
                  onMouseLeave={e => { e.currentTarget.style.opacity = '1'; }}
                >
                  {pt.btn}
                </button>
                <p style={{ fontSize: 11, color: GRAY, textAlign: 'center', margin: '8px 0 0' }}>
                  {pt.regText}{' '}
                  <a href="/regulamin" target="_blank" rel="noreferrer" style={{ color: GRAY, textDecoration: 'underline' }}>
                    Regulamin
                  </a>
                </p>
              </div>
              {/* pkg 2 */}
              <div>
                <Tag color={MINT}>{t.p2tag}</Tag>
                <p className="karta-pkg-name" style={{ fontSize: 20, fontWeight: 800, margin: '0 0 2px', color: DARK }}>{t.p2name}</p>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 7, margin: '4px 0 2px' }}>
                  <span style={{ fontSize: 'clamp(64px, 16vw, 96px)', fontWeight: 900, color: MINT, letterSpacing: '-0.045em', lineHeight: 0.88 }}>
                    {t.p2price.split(' ')[0]}
                  </span>
                  <span style={{ fontSize: 'clamp(28px, 6vw, 42px)', fontWeight: 900, color: MINT, letterSpacing: '-0.02em' }}>
                    {t.p2price.split(' ').slice(1).join(' ')}
                  </span>
                </div>
                <p style={{ fontSize: 12, color: GRAY, margin: '0 0 20px' }}>{t.p2sub}</p>
                <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 24px', display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {t.p2f.map((f, i) => (
                    <li key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', fontSize: 13, color: LIGHT }}>
                      <span style={{ color: MINT, flexShrink: 0, fontWeight: 700, lineHeight: '1.6' }}>→</span>
                      <span style={{ color: LIGHT }}>{f}</span>
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => openPay('p2', 90000, t.p2name)}
                  style={{ width: '100%', padding: '13px 0', borderRadius: 10, border: 'none', cursor: 'pointer', background: '#1e293b', color: '#fff', fontWeight: 700, fontSize: 14, fontFamily: "'Syne', sans-serif", letterSpacing: '0.01em', transition: 'opacity 0.2s' }}
                  onMouseEnter={e => { e.currentTarget.style.opacity = '0.82'; }}
                  onMouseLeave={e => { e.currentTarget.style.opacity = '1'; }}
                >
                  {pt.btn}
                </button>
                <p style={{ fontSize: 11, color: GRAY, textAlign: 'center', margin: '8px 0 0' }}>
                  {pt.regText}{' '}
                  <a href="/regulamin" target="_blank" rel="noreferrer" style={{ color: GRAY, textDecoration: 'underline' }}>
                    Regulamin
                  </a>
                </p>
              </div>
            </div>
          </section>

          {/* GUARANTEE */}
          <section style={{ paddingBottom: 52 }}>
            <div style={{ border: `1px solid ${LGRAY}`, borderRadius: 16, padding: '36px 24px', textAlign: 'center' }}>
              <div style={{ fontSize: 36, marginBottom: 14 }}>🛡️</div>
              <p style={{ fontSize: 'clamp(20px, 4vw, 34px)', fontWeight: 900, color: MINT, margin: '0 0 16px', lineHeight: 1.1, letterSpacing: '-0.02em' }}>
                {t.gTitle}
              </p>
              <p style={{ fontSize: 13, color: GRAY, maxWidth: 500, margin: '0 auto', lineHeight: 1.8 }}>
                <span style={{ color: GRAY }}>{t.gText[0]}</span>
                <strong style={{ color: DARK }}>{t.gText[1]}</strong>
                <span style={{ color: GRAY }}>{t.gText[2]}</span>
              </p>
            </div>
          </section>

          {/* FOUNDER */}
          <section style={{ paddingBottom: 52 }}>
            <div style={{ border: `1px solid ${LGRAY}`, borderRadius: 16, overflow: 'hidden' }}>
              <div style={{ background: '#fafafa', padding: '36px 24px', textAlign: 'center' }}>
                <div style={{ width: 60, height: 60, borderRadius: '50%', border: `2px solid ${ORANGE}`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', fontSize: 20, color: ORANGE, cursor: 'pointer' }}>▶</div>
                <p style={{ fontWeight: 700, fontSize: 14, margin: '0 0 8px', color: DARK, maxWidth: 420, marginLeft: 'auto', marginRight: 'auto', lineHeight: 1.5 }}>
                  {t.fTitle}
                </p>
                <p style={{ fontSize: 12, color: GRAY, margin: 0 }}>{t.fSub}</p>
              </div>
            </div>
          </section>

          {/* CTA */}
          <section style={{ borderTop: `1px solid ${LGRAY}`, paddingTop: 52, paddingBottom: 48, textAlign: 'center' }}>
            <h2 style={{ fontSize: 'clamp(30px, 8vw, 68px)', fontWeight: 900, lineHeight: 1.0, letterSpacing: '-0.04em', margin: '0 0 14px' }}>
              <span style={{ display: 'block', color: DARK }}>{t.ctaH[0]}</span>
              <span style={{ display: 'block', color: ORANGE }}>{t.ctaH[1]}</span>
            </h2>
            <p style={{ fontSize: 14, color: GRAY, margin: '0 0 28px' }}>{t.ctaSub}</p>
            <button onClick={handleOrder} className="karta-cta-btn">{t.ctaBtn}</button>
          </section>

          {/* CONTACT */}
          <section style={{ paddingBottom: 56, textAlign: 'center' }}>
            <p style={{ fontSize: 13, color: '#9ca3af', fontStyle: 'italic', lineHeight: 1.75, maxWidth: 500, margin: '0 auto' }}>
              {t.quote}
            </p>
          </section>

        </div>

        {/* Przelewy24 payment steps */}
        <div style={{ margin: '0 -24px' }}>
          <P24PaymentSteps
            title={locale === 'ua' ? 'Як працює процес оплати' : locale === 'ru' ? 'Как работает процесс оплаты' : 'Jak działa proces płatności'}
            steps={[
              { n:'01', icon:<span style={{fontSize:28}}>🛒</span>, title: locale === 'ua' ? 'Вибір послуги' : 'Wybór usługi',        desc: locale === 'ua' ? 'Обери пакет Прискорення або Резидент і натисни «Замовити».' : 'Wybierz pakiet Przyspieszenie lub Rezydent i kliknij «Zamów».' },
              { n:'02', icon:<span style={{fontSize:28}}>👤</span>, title: locale === 'ua' ? 'Дані клієнта' : 'Dane klienta',          desc: locale === 'ua' ? 'Вкажи ім\'я, телефон та email — для квитанції та зв\'язку.' : 'Podaj imię, telefon i email — do rachunku i kontaktu.' },
              { n:'03', icon:<span style={{fontSize:28}}>💳</span>, title: locale === 'ua' ? 'Оплата Przelewy24' : 'Płatność Przelewy24', desc: locale === 'ua' ? 'Безпечна оплата через Przelewy24 — картка, BLIK, переказ. SSL 256-bit.' : 'Bezpieczna płatność przez Przelewy24 — karta, BLIK, przelew. SSL 256-bit.' },
              { n:'04', icon:<span style={{fontSize:28}}>✅</span>, title: locale === 'ua' ? 'Підтвердження' : 'Potwierdzenie',        desc: locale === 'ua' ? 'Отримуєш квитанцію, фахівець зв\'язується протягом 2 годин.' : 'Otrzymujesz paragon, specjalista kontaktuje się w ciągu 2 godzin.' },
            ]}
          />
        </div>

        {/* FOOTER */}
        <footer style={{ borderTop: `1px solid ${LGRAY}`, padding: '36px 24px', maxWidth: 860, margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 28, marginBottom: 28 }}>
            <div>
              <Tag color={ORANGE}>{t.ft1tag}</Tag>
              <p style={{ fontWeight: 700, fontSize: 14, margin: '0 0 6px', color: DARK }}>Kompas Migracji</p>
              <p style={{ fontSize: 12, color: GRAY, margin: 0, lineHeight: 1.7 }}>{t.ft1desc}</p>
            </div>
            <div>
              <Tag color={ORANGE}>{t.ft2tag}</Tag>
              <p style={{ fontWeight: 700, fontSize: 13, margin: '0 0 4px', color: DARK }}>{t.ft2name}</p>
              <p style={{ fontSize: 12, color: GRAY, margin: '0 0 20px', lineHeight: 1.65, whiteSpace: 'pre-line' }}>{t.ft2desc}</p>
              <Tag color={ORANGE}>{t.ft3tag}</Tag>
              <a href="https://wa.me/48729271848" target="_blank" rel="noreferrer" style={{ display: 'block', fontSize: 24, fontWeight: 900, color: DARK, margin: '10px 0 4px', letterSpacing: '-0.03em', lineHeight: 1, fontFamily: "'Syne', sans-serif", textDecoration: 'none', whiteSpace: 'nowrap' }}>
                +48 729 271 848
              </a>
              <p style={{ fontSize: 11, color: GRAY, margin: '0 0 18px', letterSpacing: '0.06em', textTransform: 'uppercase' }}>{t.ft3sub}</p>
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'stretch' }}>
                <a href="https://wa.me/48729271848" target="_blank" rel="noreferrer" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8, background: '#25d366', color: '#fff', fontSize: 13, fontWeight: 700, letterSpacing: '0.02em', padding: '11px 22px', borderRadius: 10, textDecoration: 'none', whiteSpace: 'nowrap', boxShadow: '0 2px 8px rgba(37,211,102,0.35)' }}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                  WhatsApp
                </a>
              </div>
            </div>
          </div>

          <div style={{ borderTop: `1px solid ${LGRAY}`, paddingTop: 20 }}>
            <p style={{ fontSize: 10, fontWeight: 700, color: '#9ca3af', margin: '0 0 14px', letterSpacing: '0.08em' }}>DOMUS V Sp. z o.o.</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px 28px', marginBottom: 10 }}>
              {[['NIP', '5223350030'], ['KRS', '0001198474'], ['ADRES SIEDZIBY', 'ul. Dzieci Warszawy 27c/49, 02-495 Warszawa']].map(([label, val]) => (
                <div key={label}>
                  <p style={{ fontSize: 9, color: '#9ca3af', margin: '0 0 2px', letterSpacing: '0.08em' }}>{label}</p>
                  <p style={{ fontSize: 11, fontWeight: 700, color: GRAY, margin: 0 }}>{val}</p>
                </div>
              ))}
            </div>
            <div style={{ marginBottom: 20 }}>
              <p style={{ fontSize: 9, color: '#9ca3af', margin: '0 0 2px', letterSpacing: '0.08em' }}>NR KONTA</p>
              <p style={{ fontSize: 11, fontWeight: 700, color: GRAY, margin: 0 }}>10 1050 1025 1000 0090 8594 6938</p>
            </div>
            <p style={{ fontSize: 11, color: '#9ca3af', textAlign: 'center', margin: 0, lineHeight: 2 }}>
              <span style={{ color: ORANGE }}>Kompas Migracji</span> · DOMUS V Sp. z o.o. © 2026<br />
              {t.copy}
            </p>
          </div>
        </footer>

      </div>

      {/* PAYMENT MODAL */}
      {payStep && (
        <div onClick={closePay} style={{ position: 'fixed', inset: 0, zIndex: 10000, background: 'rgba(0,0,0,0.55)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
          <div onClick={e => e.stopPropagation()} style={{ background: '#fff', borderRadius: 16, padding: '32px 28px', width: '100%', maxWidth: 420, fontFamily: "'Inter', system-ui, sans-serif" }}>
            <svg width="110" height="28" viewBox="0 0 110 28" fill="none" aria-label="Przelewy24" style={{ marginBottom: 8 }}>
              <rect width="110" height="28" rx="5" fill="#D8232A"/>
              <text x="55" y="20" textAnchor="middle" fill="#fff" fontFamily="'Arial Black',Arial,sans-serif" fontSize="12" fontWeight="900" letterSpacing="0.3">przelewy24</text>
            </svg>
            <p style={{ fontSize: 18, fontWeight: 800, color: DARK, margin: '0 0 4px' }}>{payStep.desc}</p>
            <p style={{ fontSize: 26, fontWeight: 900, color: payStep.pkg === 'p1' ? ORANGE : '#1e293b', margin: '0 0 24px', letterSpacing: '-0.02em' }}>
              {payStep.pkg === 'p1' ? '355 PLN' : '900 PLN'}
            </p>

            {/* Ім'я */}
            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: GRAY, marginBottom: 6 }}>{pt.firstNameLabel}</label>
            <input type="text" value={payFirstName} onChange={e => setPayFirstName(e.target.value)}
              placeholder={pt.firstNamePh} autoFocus
              style={{ width: '100%', padding: '11px 14px', borderRadius: 10, fontSize: 14, border: '1.5px solid #e2e8f0', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box', marginBottom: 12 }}
            />
            {/* Прізвище */}
            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: GRAY, marginBottom: 6 }}>{pt.lastNameLabel}</label>
            <input type="text" value={payLastName} onChange={e => setPayLastName(e.target.value)}
              placeholder={pt.lastNamePh}
              style={{ width: '100%', padding: '11px 14px', borderRadius: 10, fontSize: 14, border: '1.5px solid #e2e8f0', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box', marginBottom: 12 }}
            />
            {/* Телефон */}
            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: GRAY, marginBottom: 6 }}>{pt.phoneLabel}</label>
            <input type="tel" value={payPhone} onChange={e => setPayPhone(e.target.value)}
              placeholder={pt.phonePh}
              style={{ width: '100%', padding: '11px 14px', borderRadius: 10, fontSize: 14, border: '1.5px solid #e2e8f0', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box', marginBottom: 12 }}
            />
            {/* Email */}
            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: GRAY, marginBottom: 6 }}>{pt.emailLabel}</label>
            <input
              type="email" value={payEmail} onChange={e => setPayEmail(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && proceedPay()}
              placeholder={pt.emailPh}
              style={{ width: '100%', padding: '11px 14px', borderRadius: 10, fontSize: 14, border: `1.5px solid ${payError ? '#ef4444' : '#e2e8f0'}`, outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box', marginBottom: payError ? 6 : 20 }}
            />
            {payError && <p style={{ fontSize: 12, color: '#ef4444', margin: '0 0 16px' }}>{payError}</p>}

            <label style={{ display: 'flex', gap: 10, alignItems: 'flex-start', cursor: 'pointer', margin: '0 0 16px', userSelect: 'none' }}>
              <input type="checkbox" checked={payAgreed} onChange={e => setPayAgreed(e.target.checked)}
                style={{ marginTop: 3, accentColor: ORANGE, width: 16, height: 16, flexShrink: 0, cursor: 'pointer' }}
              />
              <span style={{ fontSize: 12, color: GRAY, lineHeight: 1.6 }}>
                {pt.regText}{' '}
                <a href="/regulamin" target="_blank" rel="noreferrer" style={{ color: ORANGE, textDecoration: 'none', fontWeight: 600 }} onClick={e => e.stopPropagation()}>
                  Regulamin
                </a>
              </span>
            </label>

            <button onClick={proceedPay} disabled={payLoading || !payAgreed}
              style={{ width: '100%', padding: '13px 0', borderRadius: 10, border: 'none', cursor: payLoading || !payAgreed ? 'not-allowed' : 'pointer', background: payLoading || !payAgreed ? '#e2e8f0' : ORANGE, color: payLoading || !payAgreed ? GRAY : '#fff', fontWeight: 700, fontSize: 14, fontFamily: 'inherit', marginBottom: 10, transition: 'background 0.15s' }}
            >
              {payLoading ? pt.loading : pt.go}
            </button>
            <button onClick={closePay} disabled={payLoading}
              style={{ width: '100%', padding: '11px 0', borderRadius: 10, border: `1.5px solid #e2e8f0`, background: 'transparent', color: GRAY, fontWeight: 600, fontSize: 14, fontFamily: 'inherit', cursor: 'pointer' }}
            >
              {pt.cancel}
            </button>
            <p style={{ fontSize: 10, color: '#94a3b8', textAlign: 'center', margin: '14px 0 0' }}>🔒 Безпечна оплата · Przelewy24 · SSL</p>
          </div>
        </div>
      )}

      <ChatBot />
    </>
  );
}
