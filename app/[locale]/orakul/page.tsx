'use client';
import { useRef, useEffect, useState } from 'react';
import Link from 'next/link';
import { useLocale } from 'next-intl';

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Archivo:wght@400;500;600;700;900&display=swap');

*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}

.e-pg{
  --bg-soft:#f1f3f7;
  --bg-panel:#ffffff;
  --text-main:#0f172a;
  --text-muted:#475569;
  --union-blue:#1d4ed8;
  --welding-flash:#00e5ff;
  --border:rgba(15,23,42,0.08);
  background:var(--bg-soft);
  color:var(--text-main);
  font-family:'Archivo',system-ui,sans-serif;
  min-height:100vh;
  overflow-x:hidden;
}

/* WELD BLINK */
.e-weld{
  display:inline-block;
  background:linear-gradient(90deg,#0f172a 0%,#00bcff 40%,#ffffff 50%,#00bcff 60%,#0f172a 100%);
  background-size:200% auto;
  -webkit-background-clip:text;
  -webkit-text-fill-color:transparent;
  background-clip:text;
  animation:weldLight 5s ease-in-out infinite;
}
@keyframes weldLight{
  0%{background-position:200% center}
  50%{background-position:-200% center}
  100%{background-position:200% center}
}

/* NAV */
.e-nav{
  position:fixed;top:0;left:0;right:0;
  height:76px;
  background:rgba(255,255,255,0.88);
  backdrop-filter:blur(20px);
  border-bottom:1px solid var(--border);
  z-index:1000;
  display:flex;align-items:center;justify-content:space-between;
  padding:0 2rem;gap:1rem;
}
.e-nav-logo{font-weight:700;font-size:1.1rem;color:var(--text-main);text-decoration:none;white-space:nowrap}
.e-nav-logo span{color:var(--text-muted);font-weight:500;font-size:0.8rem}
.e-nav-back{flex:1;font-size:0.88rem;color:var(--text-muted);text-decoration:none;font-weight:600;transition:color .2s;white-space:nowrap}
.e-nav-back:hover{color:var(--union-blue)}
.e-nav-spacer{flex:1}

/* HERO */
.e-hero{
  position:relative;
  min-height:100vh;
  padding-top:106px;padding-bottom:60px;
  display:flex;flex-direction:column;align-items:center;justify-content:center;
  overflow:hidden;
  background-image:url('https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?auto=format&fit=crop&w=1920&q=95');
  background-size:cover;background-position:center;
}
.e-hero::before{
  content:'';position:absolute;inset:0;
  background:
    radial-gradient(circle at center,rgba(16,24,48,.3) 0%,rgba(15,23,42,.82) 80%),
    linear-gradient(180deg,rgba(241,243,247,.75) 0%,rgba(15,23,42,.35) 40%,rgba(241,243,247,.92) 100%);
  z-index:1;
}
.e-hero-inner{
  position:relative;z-index:2;
  text-align:center;max-width:1000px;width:100%;padding:0 1.5rem;
}

/* GIANT LOGO */
.e-logo-wrap{
  position:relative;width:320px;height:190px;
  margin:0 auto .5rem;
  display:flex;align-items:center;justify-content:center;
}
.e-logo-canvas{
  position:absolute;top:0;left:0;
  width:320px;height:190px;
  pointer-events:none;z-index:3;
}
.e-logo-txt{
  font-family:'Archivo',sans-serif;font-weight:900;font-size:5.5rem;
  letter-spacing:-.02em;position:relative;z-index:2;user-select:none;
  background:linear-gradient(180deg,#718096 0%,#cbd5e1 35%,#475569 50%,#94a3b8 65%,#1e293b 100%);
  -webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;
  filter:url(#weld-seam);
  text-shadow:0 1px 0 #94a3b8,0 2px 0 #64748b,0 3px 0 #475569,0 4px 0 #334155,0 5px 0 #1e293b,0 8px 15px rgba(0,229,255,.3),0 15px 25px rgba(0,0,0,.5);
}

.e-badge{
  display:inline-block;padding:.65rem 1.6rem;
  background:rgba(255,255,255,.95);
  border:1px solid rgba(29,78,216,.3);border-radius:50px;
  margin-bottom:1.4rem;backdrop-filter:blur(10px);
  box-shadow:0 4px 25px rgba(0,229,255,.15);
}
.e-badge h2{font-size:.95rem;font-weight:700;color:#1e3a8a}
.e-badge span{color:#2563eb}

.e-hero-title{font-size:clamp(2.1rem,5vw,3.4rem);font-weight:700;line-height:1.1;margin-bottom:1.1rem}
.e-hero-desc{
  color:#f8fafc;font-size:clamp(1.05rem,2vw,1.25rem);font-weight:500;
  max-width:700px;margin:0 auto 2.5rem;text-shadow:0 2px 8px rgba(0,0,0,.6);
}

.e-role-cards{display:flex;gap:20px;width:100%;max-width:900px;margin:0 auto}
.e-role-card{
  flex:1;background:rgba(255,255,255,.95);backdrop-filter:blur(10px);
  border:1px solid rgba(255,255,255,.8);border-radius:16px;padding:2.2rem 1.8rem;
  cursor:pointer;box-shadow:0 10px 30px rgba(0,0,0,.15);
  transition:transform .3s cubic-bezier(.16,1,.3,1),box-shadow .3s;
  text-align:left;text-decoration:none;display:block;
}
.e-role-card:hover{transform:translateY(-5px);box-shadow:0 20px 40px rgba(0,229,255,.25)}
.e-role-icon{font-size:2.4rem;margin-bottom:.7rem;display:block}
.e-role-card h3{font-size:1.5rem;font-weight:700;margin-bottom:.4rem;color:#0f172a}
.e-role-card p{color:#334155;font-size:1rem;font-weight:500}

/* SECTIONS */
.e-section{padding:6rem 0;border-top:1px solid var(--border);background:var(--bg-panel)}
.e-section-alt{background:var(--bg-soft)}
.e-wrap{max-width:1120px;margin:0 auto;padding:0 1.5rem}
.e-grid-2{display:grid;grid-template-columns:1fr 1fr;gap:4rem;margin-top:2.5rem}
.e-sec-head h2{font-size:2.4rem;font-weight:700;margin-bottom:.6rem}
.e-sec-head p{color:var(--text-muted);font-size:1.1rem;font-weight:500}

.e-list{list-style:none;margin-top:1.5rem}
.e-list li{position:relative;padding-left:2rem;margin-bottom:1rem;font-size:1.05rem;font-weight:500}
.e-list li::before{content:'✓';position:absolute;left:0;color:var(--union-blue);font-weight:900;font-size:1.1rem}

.e-geo{display:flex;flex-wrap:wrap;gap:.75rem;margin-top:1.5rem}
.e-chip{background:var(--bg-panel);border:1px solid var(--border);padding:.6rem 1.2rem;border-radius:50px;font-size:.9rem;font-weight:600}

/* STATS */
.e-stats{display:grid;grid-template-columns:repeat(3,1fr);gap:14px;margin-bottom:2rem}
.e-stat{background:var(--bg-panel);border:1px solid var(--border);border-radius:12px;padding:1.4rem 1rem;text-align:center}
.e-stat-n{font-size:2.2rem;font-weight:900;color:var(--union-blue);letter-spacing:-.03em;line-height:1}
.e-stat-l{font-size:.82rem;color:var(--text-muted);margin-top:4px}

/* FORM BOX */
.e-form-box{background:var(--bg-soft);border:1px solid var(--border);border-radius:16px;padding:2.5rem}
.e-form-title{font-size:1.3rem;font-weight:700;margin-bottom:1.5rem}
.e-inp{
  width:100%;padding:1rem;background:var(--bg-panel);
  border:1px solid var(--border);border-radius:10px;
  margin-bottom:1rem;font-size:1rem;outline:none;
  color:var(--text-main);font-family:inherit;
  transition:border-color .15s;
}
.e-inp:focus{border-color:var(--union-blue)}
.e-inp::placeholder{color:var(--text-muted)}
.e-submit-btn{
  width:100%;padding:1rem;border-radius:10px;border:none;
  cursor:pointer;background:var(--union-blue);color:#fff;
  font-weight:700;font-size:1rem;font-family:inherit;
  transition:filter .15s;margin-top:4px;
  box-shadow:0 4px 14px rgba(29,78,216,.2);
}
.e-submit-btn:hover:not(:disabled){filter:brightness(1.08);box-shadow:0 0 18px rgba(0,229,255,.35)}
.e-submit-btn:disabled{opacity:.5;cursor:not-allowed}
.e-ok{text-align:center;padding:1.5rem 0}
.e-ok-ico{font-size:3rem;margin-bottom:1rem;color:var(--union-blue)}
.e-ok h3{font-size:1.3rem;font-weight:700;margin-bottom:.5rem}
.e-ok p{font-size:.95rem;color:var(--text-muted)}

/* BTN */
.e-btn{
  display:inline-block;padding:1rem 2.2rem;border-radius:10px;border:none;
  cursor:pointer;background:var(--union-blue);color:#fff;font-weight:700;
  font-size:1rem;font-family:inherit;text-decoration:none;
  transition:filter .2s;box-shadow:0 4px 14px rgba(29,78,216,.2);
}
.e-btn:hover{filter:brightness(1.08);box-shadow:0 0 18px rgba(0,229,255,.4)}

/* ABOUT */
.e-about{padding:6rem 0;background:var(--bg-soft);border-top:1px solid var(--border)}
.e-about-box{max-width:800px;margin:0 auto;text-align:center}
.e-about-box h3{font-size:2rem;margin-bottom:1.5rem;font-weight:700}
.e-about-box p{color:var(--text-muted);font-size:1.1rem;font-weight:500;margin-bottom:1.2rem;line-height:1.7}

/* FOOTER */
.e-footer{padding:3rem 0;border-top:1px solid var(--border);text-align:center;color:var(--text-muted);font-size:.9rem;background:var(--bg-panel)}
.e-footer a{color:var(--text-muted);text-decoration:none;display:inline-block;margin-top:.5rem}
.e-footer a:hover{color:var(--union-blue)}

@media(max-width:900px){
  .e-role-cards{flex-direction:column;gap:12px}
  .e-grid-2{grid-template-columns:1fr;gap:2rem}
}
@media(max-width:600px){
  .e-stats{grid-template-columns:1fr 1fr}
  .e-form-box{padding:1.8rem 1.2rem}
  .e-nav-logo span{display:none}
}

/* CURSOR */
.e-pg{cursor:none}
#e-arc{
  position:fixed;top:0;left:0;z-index:9999;
  width:14px;height:14px;border-radius:50%;
  background:radial-gradient(circle,#fff,#7efcff 40%,rgba(0,80,255,.65) 70%,transparent);
  box-shadow:0 0 14px 5px rgba(0,220,255,.9),0 0 42px 10px rgba(0,100,255,.5);
  transform:translate(-50%,-50%);pointer-events:none;
  transition:width .15s,height .15s;
}
#e-arc.big{width:30px;height:30px}
#e-sparks{position:fixed;inset:0;z-index:500;pointer-events:none}
@media(hover:none){.e-pg{cursor:auto}#e-arc{display:none}}
/* MANIFESTO */
.e-manifesto{
  margin-top:2rem;padding:1.8rem 0 0;
  border-top:1px solid rgba(0,229,255,0.25);
  font-size:1.18rem;font-style:italic;font-weight:600;
  color:var(--text-main);line-height:1.85;white-space:pre-line;
  background:linear-gradient(135deg,var(--text-main) 60%,var(--welding-flash));
  -webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;
}
/* WELD QUOTE */
.e-weld-quote{
  margin:0 0 2.5rem;padding:1.2rem 1.8rem;
  border-left:4px solid var(--welding-flash);
  background:rgba(0,229,255,0.06);border-radius:0 12px 12px 0;
  font-size:1.05rem;font-style:italic;color:var(--text-muted);line-height:1.7;
}
/* LANG SWITCHER */
.e-lang-sw{display:flex;gap:4px;align-items:center}
.e-lang-btn{padding:3px 8px;border-radius:20px;border:1.5px solid var(--border);background:transparent;color:var(--text-muted);font-size:0.73rem;font-weight:700;cursor:pointer;font-family:inherit;transition:all .2s;letter-spacing:.03em}
.e-lang-btn.act{background:var(--union-blue);color:#fff;border-color:var(--union-blue)}
.e-lang-btn:hover:not(.act){border-color:var(--union-blue);color:var(--union-blue)}
/* SECTION ROLE ACCENTS */
.e-section-workers{border-top:4px solid var(--union-blue)!important}
.e-section-employers{border-top:4px solid #d97706!important}
.e-section-employers .e-stat-n{color:#d97706}
.e-section-employers .e-list li::before{color:#d97706}
.e-role-badge{display:inline-flex;align-items:center;gap:.4rem;padding:.28rem .9rem;border-radius:50px;font-size:.7rem;font-weight:800;letter-spacing:.1em;text-transform:uppercase;margin-bottom:.85rem}
.e-role-badge-w{background:rgba(29,78,216,.09);color:var(--union-blue);border:1.5px solid rgba(29,78,216,.2)}
.e-role-badge-e{background:rgba(217,119,6,.1);color:#92400e;border:1.5px solid rgba(217,119,6,.3)}
/* TEXTAREA */
.e-textarea{
  width:100%;padding:1rem;background:var(--bg-panel);
  border:1px solid var(--border);border-radius:10px;
  margin-bottom:1rem;font-size:1rem;outline:none;font-family:inherit;
  resize:vertical;min-height:88px;color:var(--text-main);line-height:1.5;
}
.e-textarea::placeholder{color:var(--text-muted)}
.e-textarea:focus{border-color:var(--union-blue);box-shadow:0 0 0 3px rgba(29,78,216,.08)}
/* ROLE DIVIDER STRIP */
.e-role-strip{display:flex;align-items:stretch;border-top:2px solid rgba(29,78,216,.18);border-bottom:2px solid rgba(217,119,6,.22)}
.e-role-strip-w{flex:1;display:flex;align-items:center;justify-content:flex-end;gap:.55rem;padding:.95rem 2.5rem;font-size:.73rem;font-weight:800;letter-spacing:.1em;text-transform:uppercase;color:var(--union-blue);background:rgba(29,78,216,.04)}
.e-role-strip-e{flex:1;display:flex;align-items:center;justify-content:flex-start;gap:.55rem;padding:.95rem 2.5rem;font-size:.73rem;font-weight:800;letter-spacing:.1em;text-transform:uppercase;color:#92400e;background:rgba(217,119,6,.05)}
.e-role-strip-mid{display:flex;flex-direction:column;align-items:center;justify-content:center;width:44px;gap:3px;background:var(--bg-soft)}
.e-role-strip-line{width:1px;height:22px;background:linear-gradient(180deg,rgba(29,78,216,.4),rgba(217,119,6,.4))}
.e-role-strip-dot{width:7px;height:7px;border-radius:50%;background:conic-gradient(var(--union-blue) 50%,#d97706 50%)}
`;

type LangKey = 'uk' | 'en' | 'ru' | 'pl';
interface PageTrans {
  badge: string; h1: string; heroDesc: string;
  card1Title: string; card1Desc: string;
  card2Title: string; card2Desc: string;
  workersTitle: string; workersDesc: string; workersItems: string[];
  wFormTitle: string; wNamePlh: string; wPhonePlh: string; wEmailPlh: string; wMsgPlh: string;
  wBtn: string; wSendingBtn: string; wSentTitle: string; wSentDesc: string;
  employersTitle: string; employersDesc: string;
  stat1: string; stat2: string; stat3: string; employersItems: string[];
  eFormTitle: string; eNamePlh: string; ePhonePlh: string; eEmailPlh: string; eMsgPlh: string;
  eBtn: string; eSendingBtn: string; eSentTitle: string; eSentDesc: string;
  aboutTitle: string; aboutP1: string; aboutP2: string;
  quote: string; quote2: string;
}
const TRANSLATIONS: Record<LangKey, PageTrans> = {
  uk: {
    badge: 'На підтримці проєкту Компас Міграції',
    h1: 'Європейський Союз Зварювальників',
    heroDesc: 'Технологічна екосистема розвитку важкої промисловості в ЄС та безкомпромісної соціально-правової опіки за промисловими працівниками.',
    card1Title: 'Шукаю роботу',
    card1Desc: 'Стабільність, високі контракти, європейське житло та соціальна опіка над вашою родиною.',
    card2Title: 'Шукаю персонал',
    card2Desc: 'Ми відбираємо лише тих, кого самі б взяли в бригаду. Це наш єдиний критерій.',
    workersTitle: 'Професійний захист та опіка',
    workersDesc: "Ми будуємо безпечне майбутнє для вашої кар'єри та спокій близьких.",
    workersItems: [
      'Легальні контракти на провідних індустріальних заводах ЄС',
      "Повне медичне та юридичне забезпечення сім'ї працівника",
      'Організація захисного проживання європейського рівня',
      'Підвищення розрядів та міжнародна сертифікація',
      'Координатор на місці — платимо ми, не ви',
      '111 MMA · 131 MIG · 135 MAG · 141 TIG та монтажники',
    ],
    wFormTitle: 'Крок 1: Залишити заявку',
    wNamePlh: "Ваше ім'я",
    wPhonePlh: 'Телефон або WhatsApp',
    wEmailPlh: "Email (необов'язково)",
    wMsgPlh: 'Коротко про себе — досвід, країна, місто',
    wBtn: 'Знайти роботу',
    wSendingBtn: 'Надсилання...',
    wSentTitle: 'Заявку отримано',
    wSentDesc: 'Координатор зв’яжеться з вами протягом 24 годин.',
    employersTitle: 'Розвиток промислового потенціалу',
    employersDesc: 'Інтеграція перевірених людських ресурсів та AI-систем моніторингу у вашу виробничу потужність.',
    stat1: 'перевірених майстрів',
    stat2: 'офіційні контракти',
    stat3: 'прихованих витрат',
    employersItems: [
      'Сертифіковані майстри методів MIG, MAG, TIG, MMA',
      'Повне адміністрування відряджень, житла та податків',
      'Кожен майстер прибуває з документами, медоглядом та підтвердженим розрядом — нуль адмін-клопоту',
      "Координатор на об'єкті: нуль простоїв та непорозумінь",
      'Гарантована заміна при необхідності',
    ],
    eFormTitle: 'Надіслати запит',
    eNamePlh: "Ім'я або назва компанії",
    ePhonePlh: 'Телефон або WhatsApp',
    eEmailPlh: 'Email компанії',
    eMsgPlh: 'Опишіть потребу — кількість майстрів, регіон, строки',
    eBtn: 'Надіслати запит',
    eSendingBtn: 'Надсилання...',
    eSentTitle: 'Запит отримано',
    eSentDesc: 'Координатор зв’яжеться з вами протягом 24 годин.',
    aboutTitle: 'Промислова екосистема EWU',
    aboutP1: 'European Welding Union — це платформа, яка виводить розвиток європейської промисловості на новий рівень завдяки синергії цифрових технологій та турботи про людей.',
    aboutP2: 'У довгостроковому партнерстві з проєктом «Компас Міграції» (співзасновник — Олександр Василишин), ми створюємо непорушний соціально-юридичний щит для робітників, захищаючи інтереси їхніх сімей в ЄС.',
    quote: 'Шов ляже ідеально, коли поспішати нікуди. Простота — це складність, яку вже ніхто не помічає.',
    quote2: 'Той, хто варить цю систему ночами, поки Європа спить,\nщоб удень вона працювала за всіх.',
  },
  en: {
    badge: 'Supported by the Kompas Migracji project',
    h1: 'European Welding Union',
    heroDesc: 'A technological ecosystem for the development of heavy industry in the EU and uncompromising social-legal protection for industrial workers.',
    card1Title: 'Looking for work',
    card1Desc: 'Stability, high-value contracts, European accommodation and social care for your family.',
    card2Title: 'Looking for staff',
    card2Desc: 'We only send people we would take into our own crew. That is our only standard.',
    workersTitle: 'Professional Protection & Care',
    workersDesc: 'We build a safe future for your career and peace of mind for your loved ones.',
    workersItems: [
      'Legal contracts at leading EU industrial plants',
      "Full medical and legal coverage for the worker's family",
      'European-standard protected accommodation',
      'Qualification upgrades and international certification',
      'On-site coordinator — paid by us, not you',
      '111 MMA · 131 MIG · 135 MAG · 141 TIG and fitters',
    ],
    wFormTitle: 'Step 1: Submit your application',
    wNamePlh: 'Your name',
    wPhonePlh: 'Phone or WhatsApp',
    wEmailPlh: 'Email (optional)',
    wMsgPlh: 'About yourself — experience, country, city',
    wBtn: 'Find work',
    wSendingBtn: 'Sending...',
    wSentTitle: 'Application received',
    wSentDesc: 'A coordinator will contact you within 24 hours.',
    employersTitle: 'Developing Industrial Potential',
    employersDesc: 'Integrating vetted human resources and AI monitoring systems into your production capacity.',
    stat1: 'vetted masters',
    stat2: 'official contracts',
    stat3: 'hidden costs',
    employersItems: [
      'Certified MIG, MAG, TIG, MMA welding specialists',
      'Full administration of secondments, housing and taxes',
      'Every master arrives with documents, medical clearance and a certified grade — zero admin overhead',
      'On-site coordinator: zero downtime or misunderstandings',
      'Guaranteed replacement when needed',
    ],
    eFormTitle: 'Send a request',
    eNamePlh: 'Name or company name',
    ePhonePlh: 'Phone or WhatsApp',
    eEmailPlh: 'Company email',
    eMsgPlh: 'Describe your need — number of specialists, region, timeline',
    eBtn: 'Send request',
    eSendingBtn: 'Sending...',
    eSentTitle: 'Request received',
    eSentDesc: 'A coordinator will contact you within 24 hours.',
    aboutTitle: 'EWU Industrial Ecosystem',
    aboutP1: 'European Welding Union is a platform that takes European industry development to the next level through the synergy of digital technologies and care for people.',
    aboutP2: 'In long-term partnership with the Kompas Migracji project (co-founder — Oleksandr Vasylyshyn), we create an unbreakable social-legal shield for workers, protecting the interests of their families in the EU.',
    quote: 'The weld will lie perfectly when there is no rush. Simplicity is the complexity that no one notices anymore.',
    quote2: 'The one who welds this system through the nights, while Europe sleeps,\nso that by day it works for everyone.',
  },
  ru: {
    badge: 'При поддержке проекта Kompas Migracji',
    h1: 'Европейский Союз Сварщиков',
    heroDesc: 'Технологическая экосистема развития тяжёлой промышленности в ЕС и безоговорочная социально-правовая защита промышленных работников.',
    card1Title: 'Ищу работу',
    card1Desc: 'Стабильность, высокие контракты, европейское жильё и социальная опека над вашей семьёй.',
    card2Title: 'Ищу персонал',
    card2Desc: 'Мы отбираем только тех, кого сами взяли бы в бригаду. Это наш единственный критерий.',
    workersTitle: 'Профессиональная защита и опека',
    workersDesc: 'Мы строим безопасное будущее для вашей карьеры и спокойствие близких.',
    workersItems: [
      'Легальные контракты на ведущих индустриальных заводах ЕС',
      'Полное медицинское и юридическое обеспечение семьи работника',
      'Организация защищённого жилья европейского уровня',
      'Повышение разрядов и международная сертификация',
      'Координатор на месте — платим мы, не вы',
      '111 MMA · 131 MIG · 135 MAG · 141 TIG и монтажники',
    ],
    wFormTitle: 'Шаг 1: Оставить заявку',
    wNamePlh: 'Ваше имя',
    wPhonePlh: 'Телефон или WhatsApp',
    wEmailPlh: 'Email (необязательно)',
    wMsgPlh: 'Кратко о себе — опыт, страна, город',
    wBtn: 'Найти работу',
    wSendingBtn: 'Отправка...',
    wSentTitle: 'Заявка получена',
    wSentDesc: 'Координатор свяжется с вами в течение 24 часов.',
    employersTitle: 'Развитие промышленного потенциала',
    employersDesc: 'Интеграция проверенных кадров и AI-систем мониторинга в вашу производственную мощность.',
    stat1: 'проверенных мастеров',
    stat2: 'официальные контракты',
    stat3: 'скрытых расходов',
    employersItems: [
      'Сертифицированные сварщики методов MIG, MAG, TIG, MMA',
      'Полное администрирование командировок, жилья и налогов',
      'Каждый мастер прибывает с документами, медосмотром и подтверждённым разрядом — ноль административных хлопот',
      'Координатор на объекте: ноль простоев и недоразумений',
      'Гарантированная замена при необходимости',
    ],
    eFormTitle: 'Отправить запрос',
    eNamePlh: 'Имя или название компании',
    ePhonePlh: 'Телефон или WhatsApp',
    eEmailPlh: 'Email компании',
    eMsgPlh: 'Опишите потребность — количество мастеров, регион, сроки',
    eBtn: 'Отправить запрос',
    eSendingBtn: 'Отправка...',
    eSentTitle: 'Запрос получен',
    eSentDesc: 'Координатор свяжется с вами в течение 24 часов.',
    aboutTitle: 'Промышленная экосистема EWU',
    aboutP1: 'European Welding Union — это платформа, которая выводит развитие европейской промышленности на новый уровень благодаря синергии цифровых технологий и заботы о людях.',
    aboutP2: 'В долгосрочном партнёрстве с проектом «Kompas Migracji» (сооснователь — Александр Василишин), мы создаём несокрушимый социально-юридический щит для рабочих, защищая интересы их семей в ЕС.',
    quote: 'Шов ляжет идеально, когда некуда спешить. Простота — это сложность, которую уже никто не замечает.',
    quote2: 'Тот, кто варит эту систему по ночам, пока Европа спит,\nчтобы днём она работала за всех.',
  },
  pl: {
    badge: 'We współpracy z projektem Kompas Migracji',
    h1: 'Europejski Związek Spawaczy',
    heroDesc: 'Technologiczny ekosystem rozwoju przemysłu ciężkiego w UE oraz bezwarunkowa ochrona społeczno-prawna pracowników przemysłowych.',
    card1Title: 'Szukam pracy',
    card1Desc: 'Stabilność, atrakcyjne kontrakty, europejskie zakwaterowanie i opieka społeczna nad Twoją rodziną.',
    card2Title: 'Szukam pracowników',
    card2Desc: 'Wysyłamy tylko tych, których sami wzięlibyśmy do brygady. To nasz jedyny standard.',
    workersTitle: 'Profesjonalna ochrona i wsparcie',
    workersDesc: 'Budujemy bezpieczną przyszłość dla Twojej kariery i spokój Twoich bliskich.',
    workersItems: [
      'Legalne kontrakty w wiodących zakładach przemysłowych UE',
      'Pełne ubezpieczenie medyczne i prawne dla rodziny pracownika',
      'Organizacja zakwaterowania na europejskim poziomie',
      'Podnoszenie kwalifikacji i certyfikacja międzynarodowa',
      'Koordynator na miejscu — płacimy my, nie Ty',
      '111 MMA · 131 MIG · 135 MAG · 141 TIG oraz monterzy',
    ],
    wFormTitle: 'Krok 1: Zostaw zgłoszenie',
    wNamePlh: 'Twoje imię i nazwisko',
    wPhonePlh: 'Telefon lub WhatsApp',
    wEmailPlh: 'Email (opcjonalnie)',
    wMsgPlh: 'O sobie — doświadczenie, kraj, miasto',
    wBtn: 'Znajdź pracę',
    wSendingBtn: 'Wysyłanie...',
    wSentTitle: 'Zgłoszenie otrzymane',
    wSentDesc: 'Koordynator skontaktuje się z Tobą w ciągu 24 godzin.',
    employersTitle: 'Rozwój potencjału przemysłowego',
    employersDesc: 'Integracja sprawdzonych zasobów ludzkich i systemów monitoringu AI z Twoją mocą produkcyjną.',
    stat1: 'sprawdzonych mistrzów',
    stat2: 'oficjalne kontrakty',
    stat3: 'ukrytych kosztów',
    employersItems: [
      'Certyfikowani spawacze metodami MIG, MAG, TIG, MMA',
      'Pełna administracja delegacji, zakwaterowania i podatków',
      'Każdy mistrz przybywa z dokumentami, orzeczeniem lekarskim i potwierdzonym stopniem — zero biurokracji',
      'Koordynator na obiekcie: zero przestojów i nieporozumień',
      'Gwarantowana wymiana w razie potrzeby',
    ],
    eFormTitle: 'Wyślij zapytanie',
    eNamePlh: 'Imię lub nazwa firmy',
    ePhonePlh: 'Telefon lub WhatsApp',
    eEmailPlh: 'Email firmy',
    eMsgPlh: 'Opisz potrzebę — liczba specjalistów, region, termin',
    eBtn: 'Wyślij zapytanie',
    eSendingBtn: 'Wysyłanie...',
    eSentTitle: 'Zapytanie otrzymane',
    eSentDesc: 'Koordynator skontaktuje się z Tobą w ciągu 24 godzin.',
    aboutTitle: 'Ekosystem przemysłowy EWU',
    aboutP1: 'European Welding Union to platforma, która wynosi rozwój europejskiego przemysłu na nowy poziom dzięki synergii technologii cyfrowych i troski o ludzi.',
    aboutP2: 'W długoterminowym partnerstwie z projektem «Kompas Migracji» (współzałożyciel — Oleksandr Vasylyshyn), tworzymy niezłomną tarczę społeczno-prawną dla pracowników, chroniąc interesy ich rodzin w UE.',
    quote: 'Spoina będzie idealna, gdy nie ma pośpiechu. Prostota to złożoność, której już nikt nie zauważa.',
    quote2: 'Ten, kto spawa ten system nocami, gdy Europa śpi,\nby we dnie działał dla wszystkich.',
  },
};

export default function OrakulPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sparksRef = useRef<HTMLCanvasElement>(null);
  const arcRef = useRef<HTMLDivElement>(null);
  const locale = useLocale();
  const [lang, setLang] = useState<LangKey>(() => (['uk','en','ru','pl'] as LangKey[]).includes(locale as LangKey) ? locale as LangKey : 'uk');
  const T = TRANSLATIONS[lang];

  const [wName, setWName] = useState('');
  const [wPhone, setWPhone] = useState('');
  const [wEmail, setWEmail] = useState('');
  const [wMsg, setWMsg] = useState('');
  const [wSent, setWSent] = useState(false);
  const [wSending, setWSending] = useState(false);

  const [eName, setEName] = useState('');
  const [ePhone, setEPhone] = useState('');
  const [eEmail, setEEmail] = useState('');
  const [eMsg, setEMsg] = useState('');
  const [eSent, setESent] = useState(false);
  const [eSending, setESending] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const W = 320, H = 190;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    ctx.scale(dpr, dpr);
    const c = ctx;

    const stars = Array.from({ length: 12 }, (_, i) => ({
      angle: (i * Math.PI * 2) / 12,
      speed: 0.007,
    }));

    function drawStar(cx: number, cy: number, spikes: number, outer: number, inner: number) {
      let rot = Math.PI / 2 * 3;
      const step = Math.PI / spikes;
      c.beginPath();
      c.moveTo(cx, cy - outer);
      for (let i = 0; i < spikes; i++) {
        c.lineTo(cx + Math.cos(rot) * outer, cy + Math.sin(rot) * outer);
        rot += step;
        c.lineTo(cx + Math.cos(rot) * inner, cy + Math.sin(rot) * inner);
        rot += step;
      }
      c.lineTo(cx, cy - outer);
      c.closePath();
      c.fillStyle = '#38bdf8';
      c.shadowColor = '#00e5ff';
      c.shadowBlur = 6;
      c.fill();
      c.shadowBlur = 0;
    }

    let raf: number;
    function animate() {
      c.clearRect(0, 0, W, H);
      const cx = W / 2, cy = H / 2 - 5, rx = 135, ry = 42, tilt = -0.25;
      stars.forEach(s => {
        s.angle += s.speed;
        const bx = Math.cos(s.angle) * rx, by = Math.sin(s.angle) * ry;
        const px = cx + bx * Math.cos(tilt) - by * Math.sin(tilt);
        const py = cy + bx * Math.sin(tilt) + by * Math.cos(tilt);
        const m = 1 + Math.sin(s.angle) * 0.35;
        drawStar(px, py, 5, 6 * m, 2.5 * m);
      });
      raf = requestAnimationFrame(animate);
    }
    animate();
    return () => cancelAnimationFrame(raf);
  }, []);

  useEffect(() => {
    const cv = sparksRef.current;
    const arc = arcRef.current;
    if (!cv || !arc) return;
    const ctx = cv.getContext('2d');
    if (!ctx) return;
    const c = ctx;
    const cvs = cv;
    const arcs = arc;

    let W = 0, H = 0;
    function resize() { W = cvs.width = window.innerWidth; H = cvs.height = window.innerHeight; }
    resize();
    window.addEventListener('resize', resize);

    interface Particle { x: number; y: number; vx: number; vy: number; life: number; r: number; grav: number; }
    const P: Particle[] = [];
    let pmx = W / 2, pmy = H / 2;

    function emitSpark(x: number, y: number, n: number, pow: number) {
      for (let i = 0; i < n; i++) {
        const a = Math.random() * Math.PI * 2, s = Math.random() * pow + 1;
        P.push({ x, y, vx: Math.cos(a) * s, vy: Math.sin(a) * s - 1, life: 1, r: Math.random() * 1.8 + 0.6, grav: 0.06 + Math.random() * 0.05 });
      }
    }

    let raf2: number;
    function tick() {
      c.clearRect(0, 0, W, H);
      c.globalCompositeOperation = 'lighter';
      for (let i = P.length - 1; i >= 0; i--) {
        const p = P[i];
        p.vx *= 0.96; p.vy = p.vy * 0.96 + p.grav; p.x += p.vx; p.y += p.vy; p.life -= 0.018;
        if (p.y > H - 2 && p.vy > 0) { p.vy *= -0.35; p.vx *= 0.5; }
        if (p.life <= 0) { P.splice(i, 1); continue; }
        const t = p.life;
        c.beginPath();
        c.fillStyle = `rgba(${Math.floor(60 + 195 * t)},${Math.floor(180 + 75 * t)},255,${t})`;
        c.shadowBlur = 14; c.shadowColor = `rgba(0,200,255,${t})`;
        c.arc(p.x, p.y, p.r * t, 0, Math.PI * 2); c.fill();
      }
      c.globalCompositeOperation = 'source-over'; c.shadowBlur = 0;
      raf2 = requestAnimationFrame(tick);
    }
    tick();

    function onMouseMove(e: MouseEvent) {
      const dx = e.clientX - pmx, dy = e.clientY - pmy;
      const sp = Math.min(Math.hypot(dx, dy), 40);
      emitSpark(e.clientX, e.clientY, Math.floor(sp / 4) + 1, 3);
      pmx = e.clientX; pmy = e.clientY;
      arcs.style.left = e.clientX + 'px';
      arcs.style.top = e.clientY + 'px';
    }
    function onMouseDown(e: MouseEvent) { emitSpark(e.clientX, e.clientY, 45, 6.5); arcs.classList.add('big'); }
    function onMouseUp() { arcs.classList.remove('big'); }

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mouseup', onMouseUp);
    return () => {
      cancelAnimationFrame(raf2);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
    };
  }, []);

  const submitWorker = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!wName.trim() || !wPhone.trim()) return;
    setWSending(true);
    try {
      await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          first_name: wName.trim(),
          contact: wPhone.trim(),
          email: wEmail.trim() || undefined,
          message: wMsg.trim() || undefined,
          service: 'EWU — Зварювальник',
          situation: 'Заявка з сторінки Оракул. Роль: worker',
          source: 'orakul',
        }),
      });
    } catch { /* show success regardless */ }
    setWSending(false);
    setWSent(true);
  };

  const submitEmployer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!eName.trim() || !ePhone.trim()) return;
    setESending(true);
    try {
      await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          first_name: eName.trim(),
          contact: ePhone.trim(),
          email: eEmail.trim() || undefined,
          message: eMsg.trim() || undefined,
          service: 'EWU — Роботодавець',
          situation: 'Заявка з сторінки Оракул. Роль: employer',
          source: 'orakul',
        }),
      });
    } catch { /* show success regardless */ }
    setESending(false);
    setESent(true);
  };

  return (
    <>
      <style>{CSS}</style>

      <canvas ref={sparksRef} id="e-sparks" />
      <div ref={arcRef} id="e-arc" />

      <svg style={{ position: 'absolute', width: 0, height: 0 }}>
        <defs>
          <filter id="weld-seam">
            <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="4" result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="3" xChannelSelector="R" yChannelSelector="G" result="displaced" />
            <feSpecularLighting in="displaced" specularExponent="35" specularConstant="1.2" lightingColor="#64748b" result="specular">
              <feDistantLight azimuth="45" elevation="55" />
            </feSpecularLighting>
            <feComposite in="SourceGraphic" in2="specular" operator="arithmetic" k1="0" k2="1" k3="1" k4="0" />
          </filter>
        </defs>
      </svg>

      <div className="e-pg">

        {/* NAV */}
        <nav className="e-nav">
          <Link href={`/${locale}`} className="e-nav-back">← Kompas Migracji</Link>
          <span className="e-nav-logo">EWU <span>| European Welding Union</span></span>
          <div className="e-lang-sw">
            {(['uk','en','ru','pl'] as LangKey[]).map(l => (
              <button key={l} className={`e-lang-btn${lang === l ? ' act' : ''}`} onClick={() => setLang(l)}>
                {l.toUpperCase()}
              </button>
            ))}
          </div>
        </nav>

        {/* HERO */}
        <section className="e-hero">
          <div className="e-hero-inner">
            <div className="e-logo-wrap">
              <canvas ref={canvasRef} className="e-logo-canvas" />
              <div className="e-logo-txt">EWU</div>
            </div>

            <div className="e-badge">
              <h2>{T.badge}</h2>
            </div>

            <h1 className="e-hero-title">
              <span className="e-weld">{T.h1}</span>
            </h1>
            <p className="e-hero-desc">{T.heroDesc}</p>

            <div className="e-role-cards">
              <a href="#workers" className="e-role-card">
                <span className="e-role-icon">🔧</span>
                <h3>{T.card1Title}</h3>
                <p>{T.card1Desc}</p>
              </a>
              <a href="#employers" className="e-role-card">
                <span className="e-role-icon">🏭</span>
                <h3>{T.card2Title}</h3>
                <p>{T.card2Desc}</p>
              </a>
            </div>
          </div>
        </section>

        {/* FOR WORKERS */}
        <section id="workers" className="e-section e-section-alt e-section-workers">
          <div className="e-wrap">
            <div className="e-sec-head">
              <div className="e-role-badge e-role-badge-w">🔧 {T.card1Title}</div>
              <h2>{T.workersTitle}</h2>
              <p>{T.workersDesc}</p>
            </div>
            <blockquote className="e-weld-quote">{T.quote}</blockquote>
            <div className="e-grid-2">
              <div>
                <ul className="e-list" style={{ marginTop: '2rem' }}>
                  {T.workersItems.map((item, i) => <li key={i}>{item}</li>)}
                </ul>
                <div className="e-geo">
                  <span className="e-chip">🇩🇪 Німеччина</span>
                  <span className="e-chip">🇪🇸 Іспанія</span>
                  <span className="e-chip">🇫🇷 Франція</span>
                  <span className="e-chip">🇵🇹 Португалія</span>
                  <span className="e-chip">🇧🇪 Бельгія</span>
                  <span className="e-chip">🇩🇰 Данія</span>
                  <span className="e-chip">🇳🇴 Норвегія</span>
                  <span className="e-chip">🇳🇱 Нідерланди</span>
                  <span className="e-chip">🇵🇱 Польща</span>
                </div>
              </div>

              <div className="e-form-box">
                {wSent ? (
                  <div className="e-ok">
                    <div className="e-ok-ico">✓</div>
                    <h3>{T.wSentTitle}</h3>
                    <p>{T.wSentDesc}</p>
                  </div>
                ) : (
                  <>
                    <div className="e-form-title">{T.wFormTitle}</div>
                    <form onSubmit={submitWorker}>
                      <input className="e-inp" placeholder={T.wNamePlh} value={wName} onChange={e => setWName(e.target.value)} required />
                      <input className="e-inp" placeholder={T.wPhonePlh} value={wPhone} onChange={e => setWPhone(e.target.value)} required />
                      <input className="e-inp" type="email" placeholder={T.wEmailPlh} value={wEmail} onChange={e => setWEmail(e.target.value)} />
                      <textarea className="e-textarea" placeholder={T.wMsgPlh} value={wMsg} onChange={e => setWMsg(e.target.value)} />
                      <button className="e-submit-btn" type="submit" disabled={wSending || !wName.trim() || !wPhone.trim()}>
                        {wSending ? T.wSendingBtn : T.wBtn}
                      </button>
                    </form>
                  </>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* ROLE DIVIDER */}
        <div className="e-role-strip" aria-hidden="true">
          <div className="e-role-strip-w">🔧 {T.card1Title}</div>
          <div className="e-role-strip-mid">
            <div className="e-role-strip-line" />
            <div className="e-role-strip-dot" />
            <div className="e-role-strip-line" />
          </div>
          <div className="e-role-strip-e">🏭 {T.card2Title}</div>
        </div>

        {/* FOR EMPLOYERS */}
        <section id="employers" className="e-section e-section-employers">
          <div className="e-wrap">
            <div className="e-sec-head">
              <div className="e-role-badge e-role-badge-e">🏭 {T.card2Title}</div>
              <h2>{T.employersTitle}</h2>
              <p>{T.employersDesc}</p>
            </div>
            <div className="e-grid-2">
              <div>
                <div className="e-stats" style={{ marginTop: '2rem' }}>
                  <div className="e-stat">
                    <div className="e-stat-n">40K+</div>
                    <div className="e-stat-l">{T.stat1}</div>
                  </div>
                  <div className="e-stat">
                    <div className="e-stat-n">100%</div>
                    <div className="e-stat-l">{T.stat2}</div>
                  </div>
                  <div className="e-stat">
                    <div className="e-stat-n">0</div>
                    <div className="e-stat-l">{T.stat3}</div>
                  </div>
                </div>
                <ul className="e-list">
                  {T.employersItems.map((item, i) => <li key={i}>{item}</li>)}
                </ul>
              </div>

              <div className="e-form-box">
                {eSent ? (
                  <div className="e-ok">
                    <div className="e-ok-ico">✓</div>
                    <h3>{T.eSentTitle}</h3>
                    <p>{T.eSentDesc}</p>
                  </div>
                ) : (
                  <>
                    <div className="e-form-title">{T.eFormTitle}</div>
                    <form onSubmit={submitEmployer}>
                      <input className="e-inp" placeholder={T.eNamePlh} value={eName} onChange={e => setEName(e.target.value)} required />
                      <input className="e-inp" placeholder={T.ePhonePlh} value={ePhone} onChange={e => setEPhone(e.target.value)} required />
                      <input className="e-inp" type="email" placeholder={T.eEmailPlh} value={eEmail} onChange={e => setEEmail(e.target.value)} />
                      <textarea className="e-textarea" placeholder={T.eMsgPlh} value={eMsg} onChange={e => setEMsg(e.target.value)} />
                      <button className="e-submit-btn" type="submit" disabled={eSending || !eName.trim() || !ePhone.trim()}>
                        {eSending ? T.eSendingBtn : T.eBtn}
                      </button>
                    </form>
                  </>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* ABOUT */}
        <section className="e-about">
          <div className="e-wrap">
            <div className="e-about-box">
              <h3>{T.aboutTitle}</h3>
              <p>{T.aboutP1}</p>
              <p style={{ fontWeight: 600 }}>{T.aboutP2}</p>
              <p className="e-manifesto">{T.quote2}</p>
            </div>
          </div>
        </section>

        <footer className="e-footer">
          <p>© 2026 European Welding Union | Partner of «Kompas Migracji»</p>
          <Link href={`/${locale}`}>← kompasmigracji.com</Link>
        </footer>

      </div>
    </>
  );
}
