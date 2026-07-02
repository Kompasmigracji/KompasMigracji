"use client";
// F2: Subscription plans page — public marketing page with P24 checkout
import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import P24PaymentSteps from "@/components/P24PaymentSteps";
import { useLocale } from "next-intl";

const BRAND = "#D8232A";

interface Plan {
  id: number;
  slug: string;
  name: string;
  price_pln: number;
  price_eur: number;
  billing_cycle: string;
  features: string[];
  is_popular: boolean;
}

const PLAN_ICONS: Record<string, string> = {
  basic: "&#x1F4D6;",
  standard: "&#x2B50;",
  premium: "&#x1F451;",
};

const TRANSLATED_FEATURES: Record<string, Record<string, string>> = {
  pl: {
    "Konsultacja online 30 min": "Konsultacja online 30 min",
    "Dostep do poradnikow PDF": "Dostęp do poradników PDF",
    "Bot Telegram 24/7": "Bot Telegram 24/7",
    "Status sprawy online": "Status sprawy online",
    "Wszystko z Basic": "Wszystko z Basic",
    "Konsultacja 60 min/mies.": "Konsultacja 60 min/mies.",
    "Dedykowany doradca": "Dedykowany doradca",
    "Priorytetowa obsluga": "Priorytetowa obsługa",
    "Powiadomienia Telegram": "Powiadomienia Telegram",
    "Wszystko z Standard": "Wszystko z Standard",
    "Nieograniczone konsultacje": "Nieograniczone konsultacje",
    "Reprezentacja prawna": "Reprezentacja prawna",
    "Przygotowanie dokumentow": "Przygotowanie dokumentów",
    "Gwarancja rezultatu": "Gwarancja rezultatu"
  },
  uk: {
    "Konsultacja online 30 min": "Онлайн-консультація 30 хв",
    "Dostep do poradnikow PDF": "Доступ до PDF-посібників",
    "Bot Telegram 24/7": "Telegram-бот 24/7",
    "Status sprawy online": "Статус справи онлайн",
    "Wszystko z Basic": "Все з тарифу Basic",
    "Konsultacja 60 min/mies.": "Консультація 60 хв/міс.",
    "Dedykowany doradca": "Персональний консультант",
    "Priorytetowa obsluga": "Пріоритетне обслуговування",
    "Powiadomienia Telegram": "Сповіщення в Telegram",
    "Wszystko z Standard": "Все з тарифу Standard",
    "Nieograniczone konsultacje": "Необмежені консультації",
    "Reprezentacja prawna": "Юридичне представництво",
    "Przygotowanie dokumentow": "Підготовка документів",
    "Gwarancja rezultatu": "Гарантія результату"
  },
  ru: {
    "Konsultacja online 30 min": "Онлайн-консультация 30 мин",
    "Dostep do poradnikow PDF": "Доступ к PDF-руководствам",
    "Bot Telegram 24/7": "Telegram-бот 24/7",
    "Status sprawy online": "Статус дела онлайн",
    "Wszystko z Basic": "Всё из тарифа Basic",
    "Konsultacja 60 min/mies.": "Консультация 60 мин/мес.",
    "Dedykowany doradca": "Выделенный консультант",
    "Priorytetowa obsluga": "Приоритетное обслуживание",
    "Powiadomienia Telegram": "Уведомления в Telegram",
    "Wszystko z Standard": "Всё из тарифа Standard",
    "Nieograniczone konsultacje": "Безлимитные консультации",
    "Reprezentacja prawna": "Юридическое представительство",
    "Przygotowanie dokumentow": "Подготовка документов",
    "Gwarancja rezultatu": "Гарантия результата"
  },
  en: {
    "Konsultacja online 30 min": "Online consultation 30 min",
    "Dostep do poradnikow PDF": "Access to PDF guides",
    "Bot Telegram 24/7": "Telegram bot 24/7",
    "Status sprawy online": "Online case status",
    "Wszystko z Basic": "Everything from Basic",
    "Konsultacja 60 min/mies.": "Consultation 60 min/month",
    "Dedykowany doradca": "Dedicated advisor",
    "Priorytetowa obsluga": "Priority support",
    "Powiadomienia Telegram": "Telegram notifications",
    "Wszystko z Standard": "Everything from Standard",
    "Nieograniczone konsultacje": "Unlimited consultations",
    "Reprezentacja prawna": "Legal representation",
    "Przygotowanie dokumentow": "Preparation of documents",
    "Gwarancja rezultatu": "Guarantee of result"
  }
};

const T: Record<string, any> = {
  pl: {
    heroTag: "Subskrypcje Kompas Migracji",
    heroTitle: "Profesjonalna pomoc w cenie kawy dziennie",
    heroSub: "Wybierz plan dopasowany do Twoich potrzeb. Można anulować w dowolnym momencie. Bez ukrytych opłat.",
    heroFeatures: ["Bezpieczna płatność", "Dedykowany doradca", "Bez zobowiązań"],
    loading: "Ładowanie planów...",
    popular: "Najpopularniejszy",
    monthly: "miesięcznie",
    choosePlan: "Wybierz plan",
    secureSSL: "Bezpieczna płatność SSL",
    vatIncluded: "Faktura VAT w cenie",
    cancelAnytime: "Anuluj w dowolnym momencie",
    support7days: "Wsparcie 7 dni w tygodniu",
    p24Title: "Jak działa proces płatności",
    p24Step1Title: "Wybór planu",
    p24Step1Desc: "Wybierz plan Basic, Standard lub Premium i kliknij „Wybierz plan”.",
    p24Step2Title: "Dane klienta",
    p24Step2Desc: "Podaj imię, e-mail i telefon — potrzebne do rejestracji i faktury.",
    p24Step3Title: "Płatność PayU",
    p24Step3Desc: "Bezpieczna płatność przez PayU — karta, BLIK, przelew. SSL 256-bit.",
    p24Step4Title: "Dostęp natychmiastowy",
    p24Step4Desc: "Po płatności doradca skontaktuje się w ciągu 2 godzin. Subskrypcja jest aktywna.",
    faqTitle: "Najczęściej zadawane pytania",
    faq: [
      ["Czy mogę anulować subskrypcję?", "Tak, możesz anulować w dowolnym momencie bez żadnych kar. Dostęp pozostaje aktywny do końca opłaconego okresu."],
      ["Jak szybko skontaktuje się doradca?", "W ciągu 24 godzin od zakupu, a w dni robocze nawet do 2 godzin."],
      ["Czy otrzymam fakturę VAT?", "Tak, faktura VAT jest wystawiana automatycznie po każdej płatności."],
      ["Czy to działa również dla spraw w toku?", "Absolutnie — subskrypcja obejmuje również bieżące sprawy."]
    ],
    modalTitle: "Plan",
    modalPriceLabel: "/mies.",
    inputName: "Imię i nazwisko *",
    inputEmail: "Email *",
    inputPhone: "Telefon (opcjonalnie)",
    agreeRODO: "Zapoznałem/am się z Regulaminem Sklepu i akceptuję jego warunki",
    subscribing: "Przekierowujemy do płatności...",
    footerDisclaimer: "Bezpieczna płatność przez PayU • Można anulować w dowolnym momencie",
    serverError: "Błąd serwera",
    networkError: "Błąd sieci"
  },
  uk: {
    heroTag: "Підписки Компас Міграції",
    heroTitle: "Професійна допомога за ціною чашки кави на день",
    heroSub: "Оберіть тариф, який відповідає вашим потребам. Скасувати можна в будь-який момент. Без прихованих платежів.",
    heroFeatures: ["Безпечна оплата", "Персональний консультант", "Без зобов'язань"],
    loading: "Завантаження тарифних планів...",
    popular: "Найпопулярніший",
    monthly: "щомісяця",
    choosePlan: "Обрати тариф",
    secureSSL: "Безпечна оплата SSL",
    vatIncluded: "ПДВ-фактура включена",
    cancelAnytime: "Скасувати в будь-який момент",
    support7days: "Підтримка 7 днів на тиждень",
    p24Title: "Як працює процес оплати",
    p24Step1Title: "Вибір тарифу",
    p24Step1Desc: "Оберіть тариф Basic, Standard або Premium та натисніть «Обрати тариф».",
    p24Step2Title: "Дані клієнта",
    p24Step2Desc: "Вкажіть ім'я, e-mail та телефон — вони потрібні для реєстрації та виписки фактури.",
    p24Step3Title: "Оплата PayU",
    p24Step3Desc: "Безпечна оплата через PayU — карткою, BLIK або переказом. SSL 256-біт.",
    p24Step4Title: "Миттєвий доступ",
    p24Step4Desc: "Після оплати спеціаліст зв'яжеться з вами протягом 2 годин. Підписка активована.",
    faqTitle: "Часті запитання",
    faq: [
      ["Чи можу я скасувати підписку?", "Так, ви можете скасувати підписку в будь-який момент без жодних штрафів. Доступ залишається активним до кінця оплаченого періоду."],
      ["Як швидко зі мною зв'яжеться консультант?", "Протягом 24 годин після купівлі, а в робочі дні — протягом 2 годин."],
      ["Чи отримаю я фактуру ПДВ (faktura VAT)?", "Так, фактура VAT виписується автоматично після кожного платежу."],
      ["Чи діє це для справ, які вже в процесі?", "Безумовно — підписка покриває також і ваші поточні справи."]
    ],
    modalTitle: "Тариф",
    modalPriceLabel: "/міс.",
    inputName: "Ім'я та прізвище *",
    inputEmail: "Email *",
    inputPhone: "Телефон (необов'язково)",
    agreeRODO: "Я ознайомився(-лася) з Регламентом магазину та приймаю його умови",
    subscribing: "Перенаправляємо на сторінку оплати...",
    footerDisclaimer: "Безпечна оплата через PayU • Можна скасувати в будь-який момент",
    serverError: "Помилка сервера",
    networkError: "Помилка мережі"
  },
  ru: {
    heroTag: "Подписки Компас Миграции",
    heroTitle: "Профессиональная помощь по цене чашки кофе в день",
    heroSub: "Выберите план, подходящий под ваши нужды. Можно отменить в любой момент. Без скрытых платежей.",
    heroFeatures: ["Безопасная оплата", "Выделенный консультант", "Без обязательств"],
    loading: "Загрузка тарифных планов...",
    popular: "Самый популярный",
    monthly: "в месяц",
    choosePlan: "Выбрать тариф",
    secureSSL: "Безопасная оплата SSL",
    vatIncluded: "НДС-фактура включена",
    cancelAnytime: "Отмена в любой момент",
    support7days: "Поддержка 7 дней в неделю",
    p24Title: "Как работает процесс оплаты",
    p24Step1Title: "Выбор тарифа",
    p24Step1Desc: "Выберите тариф Basic, Standard или Premium и нажмите «Выбрать тариф».",
    p24Step2Title: "Данные клиента",
    p24Step2Desc: "Укажите имя, e-mail и телефон — это нужно для регистрации и выставления счета.",
    p24Step3Title: "Оплата PayU",
    p24Step3Desc: "Безопасный платеж через PayU — карта, BLIK, перевод. SSL 256-бит.",
    p24Step4Title: "Мгновенный доступ",
    p24Step4Desc: "После оплаты специалист свяжется с вами в течение 2 часов. Подписка активна.",
    faqTitle: "Часто задаваемые вопросы",
    faq: [
      ["Могу ли я отменить подписку?", "Да, вы можете отменить подписку в любой момент без каких-либо штрафов. Доступ остается активным до конца оплаченного периода."],
      ["Как быстро со мной свяжется консультант?", "В течение 24 часов после покупки, в рабочие дни — до 2 часов."],
      ["Предоставляется ли счет-фактура НДС (faktura VAT)?", "Да, фактура VAT выставляется автоматически после каждого платежа."],
      ["Действует ли это для дел, которые уже в процессе?", "Абсолютно — подписка покрывает также и ваши текущие дела."]
    ],
    modalTitle: "Тариф",
    modalPriceLabel: "/мес.",
    inputName: "Имя и фамилия *",
    inputEmail: "Email *",
    inputPhone: "Телефон (необязательно)",
    agreeRODO: "Я ознакомился(-лась) с Регламентом магазина и принимаю его условия",
    subscribing: "Перенаправляем на страницу оплаты...",
    footerDisclaimer: "Безопасная оплата через PayU • Можно отменить в любой момент",
    serverError: "Ошибка сервера",
    networkError: "Ошибка сети"
  },
  en: {
    heroTag: "Kompas Migracji Subscriptions",
    heroTitle: "Professional support for the price of a daily coffee",
    heroSub: "Choose the plan that suits you best. Cancel anytime. No hidden fees.",
    heroFeatures: ["Secure payment", "Dedicated advisor", "No commitment"],
    loading: "Loading plans...",
    popular: "Most Popular",
    monthly: "monthly",
    choosePlan: "Choose Plan",
    secureSSL: "Secure SSL payment",
    vatIncluded: "VAT invoice included",
    cancelAnytime: "Cancel at any time",
    support7days: "7 days a week support",
    p24Title: "How the payment process works",
    p24Step1Title: "Select plan",
    p24Step1Desc: "Choose Basic, Standard, or Premium plan and click 'Choose Plan'.",
    p24Step2Title: "Client details",
    p24Step2Desc: "Enter name, email, and phone — required for registration and invoice.",
    p24Step3Title: "PayU Payment",
    p24Step3Desc: "Secure payment via PayU — card, BLIK, bank transfer. 256-bit SSL.",
    p24Step4Title: "Immediate access",
    p24Step4Desc: "A specialist will contact you within 2 hours. Your subscription is active.",
    faqTitle: "Frequently Asked Questions",
    faq: [
      ["Can I cancel my subscription?", "Yes, you can cancel at any time without any penalties. Access remains active until the end of the paid period."],
      ["How quickly will the advisor contact me?", "Within 24 hours of purchase, and within 2 hours on business days."],
      ["Will I receive a VAT invoice?", "Yes, a VAT invoice is automatically issued after each payment."],
      ["Does this cover ongoing cases?", "Absolutely — the subscription covers current cases as well."]
    ],
    modalTitle: "Plan",
    modalPriceLabel: "/mo.",
    inputName: "Full name *",
    inputEmail: "Email *",
    inputPhone: "Phone (optional)",
    agreeRODO: "I have read the Store Regulations and accept its terms",
    subscribing: "Redirecting to payment...",
    footerDisclaimer: "Secure payment via PayU • Cancel at any time",
    serverError: "Server error",
    networkError: "Network error"
  }
};

function CheckIcon() {
  return (
    <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function Modal({ plan, onClose, locale }: { plan: Plan; onClose: () => void; locale: string }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [agreed, setAgreed] = useState(false);

  const t = T[locale] || T.pl;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !agreed) return;
    setLoading(true);
    setError("");
    try {
      const r = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planSlug: plan.slug, name, email, phone }),
      });
      const d = await r.json();
      if (d.redirectUrl) {
        window.location.href = d.redirectUrl;
      } else {
        setError(d.error || t.serverError);
        setLoading(false);
      }
    } catch {
      setError(t.networkError);
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        position: "fixed", inset: 0, zIndex: 9998,
        background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: 16, fontFamily: "'Segoe UI', Arial, sans-serif",
      }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div style={{
        background: "#fff", borderRadius: 16, maxWidth: 440, width: "100%",
        padding: "32px 28px", boxShadow: "0 24px 60px rgba(0,0,0,0.25)",
        position: "relative",
      }}>
        <button onClick={onClose} style={{
          position: "absolute", top: 14, right: 14, background: "none",
          border: "none", cursor: "pointer", fontSize: 20, color: "#9CA3AF",
        }}>&#x2715;</button>

        <div style={{ textAlign: "center", marginBottom: 20 }}>
          <div style={{ fontSize: 32, marginBottom: 4 }} dangerouslySetInnerHTML={{ __html: PLAN_ICONS[plan.slug] || "&#x1F4B3;" }} />
          <div style={{ fontSize: 18, fontWeight: 800, color: "#111" }}>{t.modalTitle} {plan.name}</div>
          <div style={{ fontSize: 28, fontWeight: 800, color: BRAND, margin: "6px 0" }}>
            {plan.price_pln} PLN<span style={{ fontSize: 14, fontWeight: 500, color: "#6B7280" }}>{t.modalPriceLabel}</span>
          </div>
        </div>

        <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {[
            { val: name, set: setName, ph: t.inputName, type: "text" },
            { val: email, set: setEmail, ph: t.inputEmail, type: "email" },
            { val: phone, set: setPhone, ph: t.inputPhone, type: "tel" },
          ].map((f, i) => (
            <input
              key={i}
              type={f.type}
              placeholder={f.ph}
              value={f.val}
              onChange={e => f.set(e.target.value)}
              required={f.ph.endsWith("*")}
              style={{
                padding: "11px 14px", borderRadius: 8, border: "1.5px solid #E5E7EB",
                fontSize: 14, color: "#111", outline: "none", background: "#F9FAFB",
                fontFamily: "inherit",
              }}
            />
          ))}
          {error && <div style={{ fontSize: 12, color: "#EF4444" }}>{error}</div>}

          <label style={{ display: "flex", gap: 10, alignItems: "flex-start", cursor: "pointer", userSelect: "none", margin: "4px 0 2px" }}>
            <input
              type="checkbox"
              checked={agreed}
              onChange={e => setAgreed(e.target.checked)}
              style={{ marginTop: 3, accentColor: BRAND, width: 16, height: 16, flexShrink: 0, cursor: "pointer" }}
            />
            <span style={{ fontSize: 12, color: "#6B7280", lineHeight: 1.6 }}>
              {locale === "pl" ? (
                <>
                  Zapoznałem/am się z{" "}
                  <a href="/regulamin" target="_blank" rel="noreferrer" style={{ color: BRAND, textDecoration: "none", fontWeight: 600 }} onClick={e => e.stopPropagation()}>
                    Regulaminem Sklepu
                  </a>{" "}
                  i akceptuję jego warunki
                </>
              ) : locale === "uk" ? (
                <>
                  Я ознайомився(-лася) з{" "}
                  <a href="/regulamin" target="_blank" rel="noreferrer" style={{ color: BRAND, textDecoration: "none", fontWeight: 600 }} onClick={e => e.stopPropagation()}>
                    Регламентом магазину
                  </a>{" "}
                  та приймаю його умови
                </>
              ) : locale === "ru" ? (
                <>
                  Я ознакомился(-лась) с{" "}
                  <a href="/regulamin" target="_blank" rel="noreferrer" style={{ color: BRAND, textDecoration: "none", fontWeight: 600 }} onClick={e => e.stopPropagation()}>
                    Регламентом магазина
                  </a>{" "}
                  и принимаю его условия
                </>
              ) : (
                <>
                  I have read the{" "}
                  <a href="/regulamin" target="_blank" rel="noreferrer" style={{ color: BRAND, textDecoration: "none", fontWeight: 600 }} onClick={e => e.stopPropagation()}>
                    Store Regulations
                  </a>{" "}
                  and accept its terms
                </>
              )}
            </span>
          </label>

          <button
            type="submit"
            disabled={!name.trim() || !email.trim() || loading || !agreed}
            style={{
              padding: "13px 0", borderRadius: 9, background: BRAND, color: "#fff",
              fontWeight: 700, fontSize: 15, border: "none", cursor: "pointer",
              opacity: (!name.trim() || !email.trim() || loading || !agreed) ? 0.6 : 1,
            }}
          >
            {loading ? t.subscribing : `${t.choosePlan} ${plan.name} — ${plan.price_pln} PLN/${locale === "uk" ? "міс." : locale === "ru" ? "мес." : locale === "en" ? "mo." : "mies."}`}
          </button>
        </form>

        <p style={{ textAlign: "center", fontSize: 11, color: "#9CA3AF", margin: "12px 0 0" }}>
          {t.footerDisclaimer}
        </p>
      </div>
    </div>
  );
}

export default function PlansPage() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [selected, setSelected] = useState<Plan | null>(null);
  const [loading, setLoading] = useState(true);

  const locale = useLocale();
  const t = T[locale] || T.pl;

  useEffect(() => {
    fetch("/api/plans")
      .then(r => r.json())
      .then(d => { setPlans(d.plans || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const getTranslatedFeature = (f: string) => {
    const langDict = TRANSLATED_FEATURES[locale] || TRANSLATED_FEATURES.pl;
    // Strip accents and clean up for safe database-returned matches
    const key = f.trim();
    return langDict[key] || key;
  };

  return (
    <>
      <Header />
      <main style={{ minHeight: "100vh", background: "#F0F2F5", fontFamily: "'Segoe UI', Arial, sans-serif" }}>

        {/* Hero */}
        <section style={{
          background: "linear-gradient(135deg, #1a1a2e 0%, #D8232A 100%)",
          padding: "72px 16px 80px",
          textAlign: "center", color: "#fff",
        }}>
          <div style={{ fontSize: 13, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.12em",
            color: "rgba(255,255,255,0.7)", marginBottom: 12 }}>
            {t.heroTag}
          </div>
          <h1 style={{ fontSize: 42, fontWeight: 800, margin: "0 0 16px", lineHeight: 1.15 }}>
            {locale === "pl" ? (
              <>Profesjonalna pomoc<br />w cenie kawy dziennie</>
            ) : locale === "uk" ? (
              <>Професійна допомога<br />за ціною кави на день</>
            ) : locale === "ru" ? (
              <>Профессиональная помощь<br />по цене кофе в день</>
            ) : (
              <>Professional support<br />for the price of a daily coffee</>
            )}
          </h1>
          <p style={{ fontSize: 17, color: "rgba(255,255,255,0.85)", maxWidth: 560, margin: "0 auto 24px", lineHeight: 1.7 }}>
            {t.heroSub}
          </p>
          <div style={{ display: "inline-flex", gap: 24, fontSize: 13, color: "rgba(255,255,255,0.75)", flexWrap: "wrap", justifyContent: "center" }}>
            {t.heroFeatures.map((feat: string) => (
              <span key={feat} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ color: "#10B981" }}>&#x2713;</span> {feat}
              </span>
            ))}
          </div>
        </section>

        {/* Plans grid */}
        <section style={{ maxWidth: 1000, margin: "0 auto", padding: "60px 16px" }}>
          {loading ? (
            <div style={{ textAlign: "center", color: "#6B7280", fontWeight: 600, fontSize: 18 }}>{t.loading}</div>
          ) : (
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: 24, alignItems: "start",
            }}>
              {plans.map(plan => (
                <div
                  key={plan.slug}
                  style={{
                    background: "#fff",
                    borderRadius: 16,
                    border: plan.is_popular ? `2px solid ${BRAND}` : "2px solid #E5E7EB",
                    padding: "28px 24px",
                    boxShadow: plan.is_popular ? "0 8px 32px rgba(216,35,42,0.15)" : "0 2px 12px rgba(0,0,0,0.06)",
                    position: "relative",
                  }}
                >
                  {plan.is_popular && (
                    <div style={{
                      position: "absolute", top: -14, left: "50%", transform: "translateX(-50%)",
                      background: BRAND, color: "#fff", fontSize: 11, fontWeight: 700,
                      padding: "4px 14px", borderRadius: 20, textTransform: "uppercase", letterSpacing: "0.08em",
                    }}>
                      {t.popular}
                    </div>
                  )}

                  <div style={{ textAlign: "center", marginBottom: 20 }}>
                    <div style={{ fontSize: 32, marginBottom: 8 }} dangerouslySetInnerHTML={{ __html: PLAN_ICONS[plan.slug] || "&#x1F4B3;" }} />
                    <div style={{ fontSize: 20, fontWeight: 700, color: "#111" }}>{plan.name}</div>
                    <div style={{ fontSize: 36, fontWeight: 800, color: BRAND, margin: "8px 0 2px" }}>
                      {plan.price_pln} PLN
                    </div>
                    <div style={{ fontSize: 13, color: "#6B7280" }}>
                      {t.monthly} &middot; ~{plan.price_eur} EUR
                    </div>
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 24 }}>
                    {(Array.isArray(plan.features) ? plan.features : []).map((f, i) => (
                      <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
                        <CheckIcon />
                        <span style={{ fontSize: 13.5, color: "#374151", lineHeight: 1.5 }}>
                          {getTranslatedFeature(f)}
                        </span>
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={() => setSelected(plan)}
                    style={{
                      width: "100%", padding: "13px 0", borderRadius: 10,
                      background: plan.is_popular ? BRAND : "#111",
                      color: "#fff", fontWeight: 700, fontSize: 15,
                      border: "none", cursor: "pointer", transition: "opacity 0.2s",
                    }}
                    onMouseEnter={e => (e.currentTarget.style.opacity = "0.88")}
                    onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
                  >
                    {t.choosePlan} {plan.name}
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Trust badges */}
          <div style={{
            display: "flex", gap: 32, justifyContent: "center", flexWrap: "wrap",
            marginTop: 52, padding: "28px 0", borderTop: "1px solid #E5E7EB",
          }}>
            {[
              { icon: "&#x1F512;", text: t.secureSSL },
              { icon: "&#x1F4C4;", text: t.vatIncluded },
              { icon: "&#x21A9;&#xFE0F;", text: t.cancelAnytime },
              { icon: "&#x1F4DE;", text: t.support7days },
            ].map((b, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "#6B7280" }}>
                <span style={{ fontSize: 20 }} dangerouslySetInnerHTML={{ __html: b.icon }} />
                {b.text}
              </div>
            ))}
          </div>
        </section>

        {/* PayU payment steps */}
        <P24PaymentSteps
          title={t.p24Title}
          steps={[
            { n: "01", icon: <span style={{ fontSize: 28 }}>📋</span>, title: t.p24Step1Title, desc: t.p24Step1Desc },
            { n: "02", icon: <span style={{ fontSize: 28 }}>👤</span>, title: t.p24Step2Title, desc: t.p24Step2Desc },
            { n: "03", icon: <span style={{ fontSize: 28 }}>💳</span>, title: t.p24Step3Title, desc: t.p24Step3Desc },
            { n: "04", icon: <span style={{ fontSize: 28 }}>✅</span>, title: t.p24Step4Title, desc: t.p24Step4Desc },
          ]}
        />

        {/* FAQ */}
        <section style={{ background: "#fff", padding: "56px 16px" }}>
          <div style={{ maxWidth: 700, margin: "0 auto" }}>
            <h2 style={{ textAlign: "center", fontSize: 24, fontWeight: 700, marginBottom: 36 }}>
              {t.faqTitle}
            </h2>
            {t.faq.map(([q, a]: [string, string], i: number) => (
              <div key={i} style={{ marginBottom: 20, padding: "16px 20px", background: "#F9FAFB", borderRadius: 10 }}>
                <div style={{ fontWeight: 700, fontSize: 14, color: "#111", marginBottom: 6 }}>{q}</div>
                <div style={{ fontSize: 13, color: "#6B7280", lineHeight: 1.6 }}>{a}</div>
              </div>
            ))}
          </div>
        </section>
      </main>

      <Footer />
      <WhatsAppFloat />
      {selected && <Modal plan={selected} onClose={() => setSelected(null)} locale={locale} />}
    </>
  );
}
