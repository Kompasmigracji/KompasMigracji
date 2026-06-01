'use client';
import { useRef, useEffect, useState } from 'react';
import Link from 'next/link';
import { useLocale } from 'next-intl';

const CSS = `
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}

/* ── DARK (default) ─────────────────────────────── */
.o-pg{
  --bg0:#0c1220;--bg1:#111827;--card:#1e2a3a;
  --brd:rgba(148,163,184,.12);
  --cu:#c27840;--cuL:#e09651;
  --sv:#94a3b8;--svB:#cbd5e1;
  --tx:#e2e8f0;--mu:#64748b;--wh:#f8fafc;
  --bar:rgba(12,18,32,.88);
  --hero-r:rgba(26,42,85,.55);
  --alt:rgba(17,24,39,.55);
  --sbg:rgba(26,32,50,.65);
  --star-op:1;
  min-height:100vh;background:var(--bg0);color:var(--tx);
  font-family:'Inter','Syne',system-ui,sans-serif;
  position:relative;overflow-x:hidden;
  transition:background .3s,color .3s;
}

/* ── LIGHT ───────────────────────────────────────── */
.o-pg.o-light{
  --bg0:#f5f2ee;--bg1:#ede9e2;--card:#ffffff;
  --brd:rgba(0,0,0,.09);
  --cu:#b56828;--cuL:#c97f40;
  --sv:#5c6b7a;--svB:#1f2937;
  --tx:#1f2937;--mu:#9ca3af;--wh:#111827;
  --bar:rgba(245,242,238,.92);
  --hero-r:rgba(180,145,90,.12);
  --alt:rgba(235,228,218,.45);
  --sbg:rgba(255,255,255,.85);
  --star-op:0;
}

/* NAV */
.o-stars{position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:0;opacity:var(--star-op);transition:opacity .4s}
.o-bar{position:fixed;top:0;left:0;right:0;z-index:100;display:flex;align-items:center;justify-content:space-between;padding:12px 24px;background:var(--bar);backdrop-filter:blur(14px);border-bottom:1px solid var(--brd);gap:12px}
.o-back{color:var(--sv);text-decoration:none;font-size:13px;font-weight:500;letter-spacing:.02em;transition:color .2s}
.o-back:hover{color:var(--cuL)}
.o-logo{font-size:12px;font-weight:700;letter-spacing:.1em;color:var(--cu);white-space:nowrap}
.o-toggle{display:flex;align-items:center;justify-content:center;width:34px;height:34px;border-radius:8px;border:1.5px solid var(--brd);background:transparent;cursor:pointer;color:var(--sv);font-size:16px;transition:border-color .2s,color .2s,background .2s;flex-shrink:0}
.o-toggle:hover{border-color:var(--cu);color:var(--cu)}

/* HERO */
.o-hero{position:relative;z-index:1;min-height:100vh;display:flex;align-items:center;justify-content:center;padding:100px 24px 64px;background:radial-gradient(ellipse 80% 55% at 50% 45%,var(--hero-r) 0%,transparent 72%)}
.o-hero-inner{max-width:680px;width:100%;text-align:center}
.o-badge{display:inline-block;font-size:11px;font-weight:600;letter-spacing:.12em;text-transform:uppercase;color:var(--cu);border:1px solid rgba(194,120,64,.35);border-radius:20px;padding:5px 16px;margin-bottom:28px}
.o-h1{font-size:clamp(44px,8.5vw,84px);font-weight:800;line-height:1.04;letter-spacing:-.03em;color:var(--wh);margin-bottom:20px}
.o-cu{color:var(--cu)}
.o-lead{font-size:clamp(15px,2vw,18px);color:var(--sv);line-height:1.65;margin:0 auto 36px;max-width:500px}
.o-ctas{display:flex;gap:12px;justify-content:center;flex-wrap:wrap;margin-bottom:52px}
.o-bp{padding:14px 30px;border-radius:8px;border:none;cursor:pointer;font-size:15px;font-weight:700;font-family:inherit;background:var(--cu);color:#fff;text-decoration:none;transition:background .2s,transform .15s;display:inline-block}
.o-bp:hover{background:var(--cuL);transform:translateY(-1px)}
.o-bs{padding:14px 30px;border-radius:8px;cursor:pointer;font-size:15px;font-weight:700;font-family:inherit;background:transparent;color:var(--svB);border:1.5px solid var(--brd);text-decoration:none;transition:border-color .2s,color .2s,transform .15s;display:inline-block}
.o-bs:hover{border-color:var(--sv);color:var(--wh);transform:translateY(-1px)}
.o-stats{display:flex;border:1px solid var(--brd);border-radius:12px;overflow:hidden;background:var(--sbg);backdrop-filter:blur(10px)}
.o-stat{flex:1;padding:18px 10px;text-align:center;border-right:1px solid var(--brd)}
.o-stat:last-child{border-right:none}
.o-sn{font-size:26px;font-weight:900;color:var(--cu);letter-spacing:-.02em;line-height:1}
.o-sl{font-size:11px;color:var(--mu);margin-top:5px;letter-spacing:.04em}

/* SECTIONS */
.o-sec{position:relative;z-index:1;padding:80px 24px}
.o-wrap{max-width:880px;margin:0 auto}
.o-sec-alt{background:var(--alt)}
.o-ey{font-size:11px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:var(--cu);margin-bottom:12px}
.o-h2{font-size:clamp(28px,5vw,44px);font-weight:800;letter-spacing:-.025em;color:var(--wh);line-height:1.15;margin-bottom:14px}
.o-sub{font-size:16px;color:var(--sv);line-height:1.6;max-width:540px;margin-bottom:40px}

/* STEPS */
.o-steps{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:16px;margin-bottom:36px}
.o-step{background:var(--card);border:1px solid var(--brd);border-radius:12px;padding:24px 20px;transition:background .3s,border-color .3s}
.o-stn{font-size:11px;font-weight:800;letter-spacing:.1em;color:var(--cu);margin-bottom:10px;font-family:monospace}
.o-step h3{font-size:16px;font-weight:700;color:var(--wh);margin-bottom:6px}
.o-step p{font-size:14px;color:var(--sv);line-height:1.55}

/* BULLETS */
.o-list{display:flex;flex-direction:column;gap:12px;margin-bottom:36px}
.o-li{display:flex;align-items:flex-start;gap:12px;font-size:15px;color:var(--svB);line-height:1.55}
.o-li-dot{color:var(--cu);flex-shrink:0;margin-top:2px;font-size:12px}

/* EMPLOYER NUMS */
.o-enums{display:grid;grid-template-columns:repeat(3,1fr);gap:16px;margin-bottom:36px}
.o-enum{text-align:center;background:var(--card);border:1px solid var(--brd);border-radius:12px;padding:26px 12px;transition:background .3s}
.o-enn{font-size:32px;font-weight:900;color:var(--cu);letter-spacing:-.03em;line-height:1}
.o-enl{font-size:12px;color:var(--mu);margin-top:6px}

/* FORM */
.o-fs{position:relative;z-index:1;padding:80px 24px;background:radial-gradient(ellipse 60% 50% at 50% 50%,rgba(194,120,64,.07) 0%,transparent 70%)}
.o-fbox{max-width:460px;margin:0 auto;background:var(--card);border:1px solid rgba(194,120,64,.2);border-radius:16px;padding:36px 32px;transition:background .3s}
.o-ft{font-size:22px;font-weight:800;color:var(--wh);margin-bottom:5px}
.o-fsub{font-size:14px;color:var(--mu);margin-bottom:24px}
.o-roles{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:20px}
.o-role{padding:10px 12px;border-radius:8px;cursor:pointer;text-align:center;font-size:13px;font-weight:600;font-family:inherit;border:1.5px solid var(--brd);background:transparent;color:var(--sv);transition:all .15s}
.o-ra{border-color:var(--cu);background:rgba(194,120,64,.12);color:var(--cuL)}
.o-inp{width:100%;padding:11px 14px;border-radius:8px;background:var(--bg0);border:1.5px solid var(--brd);color:var(--tx);font-size:14px;font-family:inherit;outline:none;transition:border-color .15s,background .3s;margin-bottom:12px}
.o-inp:focus{border-color:rgba(194,120,64,.5)}
.o-inp::placeholder{color:var(--mu)}
.o-sub-btn{width:100%;padding:13px;border-radius:8px;border:none;background:var(--cu);color:#fff;font-size:15px;font-weight:700;font-family:inherit;cursor:pointer;transition:background .2s;margin-top:4px}
.o-sub-btn:hover:not(:disabled){background:var(--cuL)}
.o-sub-btn:disabled{opacity:.5;cursor:not-allowed}
.o-ok{text-align:center;padding:24px 0}
.o-ok-ico{font-size:40px;color:var(--cu);margin-bottom:14px}
.o-ok h3{font-size:18px;font-weight:700;color:var(--wh);margin-bottom:8px}
.o-ok p{font-size:14px;color:var(--sv)}

/* FOOTER */
.o-foot{position:relative;z-index:1;text-align:center;padding:30px 24px;border-top:1px solid var(--brd)}
.o-foot-logo{font-size:11px;color:var(--mu);letter-spacing:.1em;margin-bottom:8px}
.o-foot a{color:var(--mu);text-decoration:none;font-size:13px}
.o-foot a:hover{color:var(--sv)}

@media(max-width:600px){
  .o-stats{flex-direction:column}
  .o-stat{border-right:none;border-bottom:1px solid var(--brd)}
  .o-stat:last-child{border-bottom:none}
  .o-fbox{padding:28px 18px}
}
`;

export default function OrakulPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const locale = useLocale();
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [role, setRole] = useState<'worker' | 'employer'>('worker');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const draw = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (let i = 0; i < 160; i++) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        const r = Math.random() * 1.0 + 0.2;
        const a = Math.random() * 0.45 + 0.08;
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fillStyle = Math.random() > 0.85
          ? `rgba(194,120,64,${a * 0.7})`
          : `rgba(148,163,184,${a})`;
        ctx.fill();
      }
    };
    draw();
    window.addEventListener('resize', draw);
    return () => window.removeEventListener('resize', draw);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) return;
    setSending(true);
    try {
      await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          first_name: name.trim(),
          contact: phone.trim(),
          service: role === 'employer' ? 'EWU — Роботодавець' : 'EWU — Зварювальник',
          situation: `Заявка з сторінки Оракул. Роль: ${role}`,
          source: 'orakul',
        }),
      });
    } catch { /* show success regardless */ }
    setSending(false);
    setSent(true);
  };

  const isLight = theme === 'light';

  return (
    <>
      <style>{CSS}</style>
      <div className={`o-pg${isLight ? ' o-light' : ''}`}>
        <canvas ref={canvasRef} className="o-stars" />

        {/* Nav */}
        <div className="o-bar">
          <Link href={`/${locale}`} className="o-back">← Kompas Migracji</Link>
          <span className="o-logo">⚡ EWU</span>
          <button
            className="o-toggle"
            onClick={() => setTheme(isLight ? 'dark' : 'light')}
            title={isLight ? 'Темна тема' : 'Світла тема'}
          >
            {isLight ? '🌙' : '☀️'}
          </button>
        </div>

        {/* HERO */}
        <section className="o-hero">
          <div className="o-hero-inner">
            <div className="o-badge">Związek Ukraińskich Spawaczy · Польща</div>
            <h1 className="o-h1">
              Зварювальники<br />
              для <span className="o-cu">Європи</span>
            </h1>
            <p className="o-lead">
              Перевірені майстри. Легальна робота.<br />
              Координатор включений — не з вашої ставки.
            </p>
            <div className="o-ctas">
              <a href="#apply" className="o-bp">Шукаю роботу</a>
              <a href="#employers" className="o-bs">Шукаю персонал</a>
            </div>
            <div className="o-stats">
              <div className="o-stat">
                <div className="o-sn">40K+</div>
                <div className="o-sl">майстрів у базі</div>
              </div>
              <div className="o-stat">
                <div className="o-sn">6</div>
                <div className="o-sl">країн Європи</div>
              </div>
              <div className="o-stat">
                <div className="o-sn">100%</div>
                <div className="o-sl">офіційна зайнятість</div>
              </div>
            </div>
          </div>
        </section>

        {/* FOR WORKERS */}
        <section className="o-sec o-sec-alt">
          <div className="o-wrap">
            <div className="o-ey">Для зварювальників</div>
            <h2 className="o-h2">Три кроки<br />до роботи в Європі</h2>
            <p className="o-sub">Без агентів-посередників. Координатор від нас — безкоштовно для вас.</p>
            <div className="o-steps">
              <div className="o-step">
                <div className="o-stn">01</div>
                <h3>Залишаєш заявку</h3>
                <p>Ім&apos;я і телефон. Зв&apos;яжемося протягом 24 годин.</p>
              </div>
              <div className="o-step">
                <div className="o-stn">02</div>
                <h3>Координатор з&apos;єднується</h3>
                <p>Обговорюємо спеціалізацію, країну, умови. Підбираємо об&apos;єкт під вас.</p>
              </div>
              <div className="o-step">
                <div className="o-stn">03</div>
                <h3>Виїжджаєш на об&apos;єкт</h3>
                <p>Договір підписаний. Офіційна ставка. Координатор поруч на місці.</p>
              </div>
            </div>
            <div className="o-list">
              <div className="o-li"><span className="o-li-dot">◆</span>Координатор включений — платимо ми, не ви</div>
              <div className="o-li"><span className="o-li-dot">◆</span>Договір чистий: без дрібного шрифту та прихованих зборів</div>
              <div className="o-li"><span className="o-li-dot">◆</span>111 MMA · 131 MIG · 135 MAG · 141 TIG та монтажники</div>
              <div className="o-li"><span className="o-li-dot">◆</span>Повна легалізація перебування в пакеті</div>
            </div>
            <a href="#apply" className="o-bp">Залишити заявку</a>
          </div>
        </section>

        {/* FOR EMPLOYERS */}
        <section className="o-sec" id="employers">
          <div className="o-wrap">
            <div className="o-ey">Для роботодавців</div>
            <h2 className="o-h2">Перевірений персонал.<br />Без клопоту.</h2>
            <p className="o-sub">Підбір, легалізація, координатор на об&apos;єкті — повний цикл під ключ.</p>
            <div className="o-enums">
              <div className="o-enum">
                <div className="o-enn">40K+</div>
                <div className="o-enl">перевірених майстрів</div>
              </div>
              <div className="o-enum">
                <div className="o-enn">48год</div>
                <div className="o-enl">на підбір кандидатів</div>
              </div>
              <div className="o-enum">
                <div className="o-enn">0</div>
                <div className="o-enl">прихованих витрат</div>
              </div>
            </div>
            <div className="o-list">
              <div className="o-li"><span className="o-li-dot">◆</span>Підтверджені кваліфікації: 111/131/135/141, EN ISO 9606</div>
              <div className="o-li"><span className="o-li-dot">◆</span>Легалізація та документи — наша відповідальність</div>
              <div className="o-li"><span className="o-li-dot">◆</span>Координатор на об&apos;єкті: нуль простоїв та непорозумінь</div>
              <div className="o-li"><span className="o-li-dot">◆</span>Гарантована заміна при необхідності</div>
            </div>
            <a href="#apply" className="o-bp" onClick={() => setRole('employer')}>Знайти персонал</a>
          </div>
        </section>

        {/* FORM */}
        <section className="o-fs" id="apply">
          <div className="o-fbox">
            {sent ? (
              <div className="o-ok">
                <div className="o-ok-ico">✓</div>
                <h3>Заявку отримано</h3>
                <p>Координатор зв&apos;яжеться з вами протягом 24 годин.</p>
              </div>
            ) : (
              <>
                <div className="o-ft">Залишити заявку</div>
                <div className="o-fsub">Безкоштовно. Без обов&apos;язань. Конфіденційно.</div>
                <div className="o-roles">
                  <button type="button" className={`o-role${role === 'worker' ? ' o-ra' : ''}`} onClick={() => setRole('worker')}>
                    Зварювальник
                  </button>
                  <button type="button" className={`o-role${role === 'employer' ? ' o-ra' : ''}`} onClick={() => setRole('employer')}>
                    Роботодавець
                  </button>
                </div>
                <form onSubmit={handleSubmit}>
                  <input className="o-inp" placeholder={role === 'worker' ? "Ваше ім'я" : "Ім'я або назва компанії"} value={name} onChange={e => setName(e.target.value)} required />
                  <input className="o-inp" placeholder="Телефон або WhatsApp" value={phone} onChange={e => setPhone(e.target.value)} required />
                  <button className="o-sub-btn" type="submit" disabled={sending || !name.trim() || !phone.trim()}>
                    {sending ? 'Надсилання...' : role === 'worker' ? 'Знайти роботу' : 'Знайти персонал'}
                  </button>
                </form>
              </>
            )}
          </div>
        </section>

        <footer className="o-foot">
          <div className="o-foot-logo">⚡ EWU · Związek Ukraińskich Spawaczy</div>
          <Link href={`/${locale}`}>← kompasmigracji.com</Link>
        </footer>
      </div>
    </>
  );
}
