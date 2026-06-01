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
  background:radial-gradient(circle,#fff,#ffd27a 40%,rgba(255,77,18,.6) 70%,transparent);
  box-shadow:0 0 16px 4px rgba(255,140,40,.85),0 0 40px 8px rgba(255,77,18,.45);
  transform:translate(-50%,-50%);pointer-events:none;
  transition:width .15s,height .15s;
}
#e-arc.big{width:30px;height:30px}
#e-sparks{position:fixed;inset:0;z-index:500;pointer-events:none}
@media(hover:none){.e-pg{cursor:auto}#e-arc{display:none}}
`;

export default function OrakulPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sparksRef = useRef<HTMLCanvasElement>(null);
  const arcRef = useRef<HTMLDivElement>(null);
  const locale = useLocale();

  const [wName, setWName] = useState('');
  const [wPhone, setWPhone] = useState('');
  const [wSent, setWSent] = useState(false);
  const [wSending, setWSending] = useState(false);

  const [eName, setEName] = useState('');
  const [ePhone, setEPhone] = useState('');
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
      c.fillStyle = '#f59e0b';
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
        c.fillStyle = `rgba(255,${120 + Math.floor(135 * t)},${Math.floor(40 * t)},${t})`;
        c.shadowBlur = 12; c.shadowColor = `rgba(255,150,50,${t})`;
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
      arc.style.left = e.clientX + 'px';
      arc.style.top = e.clientY + 'px';
    }
    function onMouseDown(e: MouseEvent) { emitSpark(e.clientX, e.clientY, 45, 6.5); arc.classList.add('big'); }
    function onMouseUp() { arc.classList.remove('big'); }

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
          <div className="e-nav-spacer" />
        </nav>

        {/* HERO */}
        <section className="e-hero">
          <div className="e-hero-inner">
            <div className="e-logo-wrap">
              <canvas ref={canvasRef} className="e-logo-canvas" />
              <div className="e-logo-txt">EWU</div>
            </div>

            <div className="e-badge">
              <h2>На підтримці проєкту <span>Компас Міграції</span></h2>
            </div>

            <h1 className="e-hero-title">
              <span className="e-weld">Європейський Союз Зварювальників</span>
            </h1>
            <p className="e-hero-desc">
              Технологічна екосистема розвитку важкої промисловості в ЄС та безкомпромісної соціально-правової опіки за промисловими працівниками.
            </p>

            <div className="e-role-cards">
              <a href="#workers" className="e-role-card">
                <span className="e-role-icon">🔧</span>
                <h3>Шукаю роботу</h3>
                <p>Стабільність, високі контракти, європейське житло та соціальна опіка над вашою родиною.</p>
              </a>
              <a href="#employers" className="e-role-card">
                <span className="e-role-icon">🏭</span>
                <h3>Шукаю персонал</h3>
                <p>Залучення майстрів, цифрова перевірка швів нейромережами та масштабування промислових ліній.</p>
              </a>
            </div>
          </div>
        </section>

        {/* FOR WORKERS */}
        <section id="workers" className="e-section e-section-alt">
          <div className="e-wrap">
            <div className="e-sec-head">
              <h2>Професійний захист та опіка</h2>
              <p>Ми будуємо безпечне майбутнє для вашої кар&apos;єри та спокій близьких.</p>
            </div>
            <div className="e-grid-2">
              <div>
                <ul className="e-list" style={{ marginTop: '2rem' }}>
                  <li>Легальні контракти на провідних індустріальних заводах ЄС</li>
                  <li>Повне медичне та юридичне забезпечення сім&apos;ї працівника</li>
                  <li>Організація захисного проживання європейського рівня</li>
                  <li>Підвищення розрядів та міжнародна сертифікація</li>
                  <li>Координатор на місці — платимо ми, не ви</li>
                  <li>111 MMA · 131 MIG · 135 MAG · 141 TIG та монтажники</li>
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
                    <h3>Заявку отримано</h3>
                    <p>Координатор зв&apos;яжеться з вами протягом 24 годин.</p>
                  </div>
                ) : (
                  <>
                    <div className="e-form-title">Крок 1: Залишити заявку</div>
                    <form onSubmit={submitWorker}>
                      <input className="e-inp" placeholder="Ваше ім'я" value={wName} onChange={e => setWName(e.target.value)} required />
                      <input className="e-inp" placeholder="Телефон або WhatsApp" value={wPhone} onChange={e => setWPhone(e.target.value)} required />
                      <button className="e-submit-btn" type="submit" disabled={wSending || !wName.trim() || !wPhone.trim()}>
                        {wSending ? 'Надсилання...' : 'Знайти роботу'}
                      </button>
                    </form>
                  </>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* FOR EMPLOYERS */}
        <section id="employers" className="e-section">
          <div className="e-wrap">
            <div className="e-sec-head">
              <h2>Розвиток промислового потенціалу</h2>
              <p>Інтеграція перевірених людських ресурсів та AI-систем моніторингу у вашу виробничу потужність.</p>
            </div>
            <div className="e-grid-2">
              <div>
                <div className="e-stats" style={{ marginTop: '2rem' }}>
                  <div className="e-stat">
                    <div className="e-stat-n">40K+</div>
                    <div className="e-stat-l">перевірених майстрів</div>
                  </div>
                  <div className="e-stat">
                    <div className="e-stat-n">100%</div>
                    <div className="e-stat-l">офіційні контракти</div>
                  </div>
                  <div className="e-stat">
                    <div className="e-stat-n">0</div>
                    <div className="e-stat-l">прихованих витрат</div>
                  </div>
                </div>
                <ul className="e-list">
                  <li>Сертифіковані майстри методів MIG, MAG, TIG, MMA</li>
                  <li>Повне адміністрування відряджень, житла та податків</li>
                  <li>Цифровий аудит зварювальних швів нейромережами</li>
                  <li>Координатор на об&apos;єкті: нуль простоїв та непорозумінь</li>
                  <li>Гарантована заміна при необхідності</li>
                </ul>
              </div>

              <div className="e-form-box">
                {eSent ? (
                  <div className="e-ok">
                    <div className="e-ok-ico">✓</div>
                    <h3>Запит отримано</h3>
                    <p>Координатор зв&apos;яжеться з вами протягом 24 годин.</p>
                  </div>
                ) : (
                  <>
                    <div className="e-form-title">Надіслати запит</div>
                    <form onSubmit={submitEmployer}>
                      <input className="e-inp" placeholder="Ім'я або назва компанії" value={eName} onChange={e => setEName(e.target.value)} required />
                      <input className="e-inp" placeholder="Телефон або WhatsApp" value={ePhone} onChange={e => setEPhone(e.target.value)} required />
                      <button className="e-submit-btn" type="submit" disabled={eSending || !eName.trim() || !ePhone.trim()}>
                        {eSending ? 'Надсилання...' : 'Надіслати запит'}
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
              <h3>Промислова екосистема EWU</h3>
              <p>European Welding Union — це платформа, яка виводить розвиток європейської промисловості на новий рівень завдяки синергії цифрових технологій та турботи про людей.</p>
              <p style={{ fontWeight: 600 }}>
                У довгостроковому партнерстві з проєктом «Компас Міграції» (співзасновник — Олександр Василишин), ми створюємо непорушний соціально-юридичний щит для робітників, захищаючи інтереси їхніх сімей в ЄС.
              </p>
            </div>
          </div>
        </section>

        <footer className="e-footer">
          <p>© 2026 European Welding Union | Partner of «Migration Compass»</p>
          <Link href={`/${locale}`}>← kompasmigracji.com</Link>
        </footer>

      </div>
    </>
  );
}
