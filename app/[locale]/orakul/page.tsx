'use client';
import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { useLocale } from 'next-intl';

export default function OrakulPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const arcRef = useRef<HTMLDivElement>(null);
  const bootRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLSpanElement>(null);
  const morphRef = useRef<HTMLSpanElement>(null);
  const locale = useLocale();

  useEffect(() => {
    // Boot hide
    const bootTimer = setTimeout(() => {
      if (bootRef.current) bootRef.current.style.cssText += ';opacity:0;visibility:hidden';
    }, 2100);

    // Canvas sparks
    const cv = canvasRef.current;
    if (!cv) return;
    const ctx = cv.getContext('2d')!;
    let W = 0, H = 0;
    const resize = () => { W = cv.width = innerWidth; H = cv.height = innerHeight; };
    resize();
    window.addEventListener('resize', resize);

    interface Particle { x: number; y: number; vx: number; vy: number; life: number; r: number; grav: number; }
    const P: Particle[] = [];
    let pmx = W / 2, pmy = H / 2;

    const spark = (x: number, y: number, n: number, pow: number) => {
      for (let i = 0; i < n; i++) {
        const a = Math.random() * Math.PI * 2, s = Math.random() * pow + 1;
        P.push({ x, y, vx: Math.cos(a) * s, vy: Math.sin(a) * s - 1, life: 1, r: Math.random() * 1.8 + 0.6, grav: 0.06 + Math.random() * 0.05 });
      }
    };

    let rafId: number;
    const tick = () => {
      ctx.clearRect(0, 0, W, H);
      ctx.globalCompositeOperation = 'lighter';
      for (let i = P.length - 1; i >= 0; i--) {
        const p = P[i];
        p.vx *= 0.96; p.vy = p.vy * 0.96 + p.grav; p.x += p.vx; p.y += p.vy; p.life -= 0.018;
        if (p.y > H - 2 && p.vy > 0) { p.vy *= -0.35; p.vx *= 0.5; }
        if (p.life <= 0) { P.splice(i, 1); continue; }
        const t = p.life, r = 255, g = 120 + Math.floor(135 * t), b = Math.floor(40 * t);
        ctx.beginPath();
        ctx.fillStyle = `rgba(${r},${g},${b},${t})`;
        ctx.shadowBlur = 12; ctx.shadowColor = `rgba(255,150,50,${t})`;
        ctx.arc(p.x, p.y, p.r * t, 0, 7); ctx.fill();
      }
      ctx.globalCompositeOperation = 'source-over'; ctx.shadowBlur = 0;
      rafId = requestAnimationFrame(tick);
    };
    tick();

    const onMove = (e: MouseEvent) => {
      const dx = e.clientX - pmx, dy = e.clientY - pmy;
      const sp = Math.min(Math.hypot(dx, dy), 40);
      spark(e.clientX, e.clientY, Math.floor(sp / 4) + 1, 3);
      pmx = e.clientX; pmy = e.clientY;
      if (arcRef.current) { arcRef.current.style.left = e.clientX + 'px'; arcRef.current.style.top = e.clientY + 'px'; }
    };
    const onDown = (e: MouseEvent) => { spark(e.clientX, e.clientY, 45, 6.5); if (arcRef.current) arcRef.current.classList.add('ewu-big'); };
    const onUp = () => { if (arcRef.current) arcRef.current.classList.remove('ewu-big'); };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mousedown', onDown);
    window.addEventListener('mouseup', onUp);

    // Morphing word
    const words = ['МАЙСТЕР', 'ШОВ', 'РУКИ', 'ТРУД', 'МАЙСТЕР', 'ТИ'];
    let mi = 0;
    const morphInterval = setInterval(() => {
      if (!morphRef.current) return;
      morphRef.current.classList.add('ewu-flick');
      setTimeout(() => {
        mi = (mi + 1) % words.length;
        if (morphRef.current) { morphRef.current.textContent = words[mi]; morphRef.current.classList.remove('ewu-flick'); }
      }, 180);
    }, 1900);

    // Live uptime timer
    const startMs = new Date('2026-05-01T00:00:00Z').getTime();
    const pad = (n: number) => String(n).padStart(2, '0');
    const timerInterval = setInterval(() => {
      if (!timerRef.current) return;
      const d = Date.now() - startMs;
      const h = Math.floor(d / 3.6e6), m = Math.floor(d / 6e4) % 60, s = Math.floor(d / 1e3) % 60;
      timerRef.current.textContent = `${pad(h)}:${pad(m)}:${pad(s)}`;
    }, 1000);

    // Scroll reveal
    const io = new IntersectionObserver(es => es.forEach(x => { if (x.isIntersecting) x.target.classList.add('ewu-on'); }), { threshold: 0.15 });
    document.querySelectorAll('.ewu-reveal').forEach(el => io.observe(el));

    // Counter animation
    document.querySelectorAll<HTMLElement>('[data-ewu-c]').forEach(el => {
      const end = +el.dataset.ewuC!;
      const suffix = el.dataset.ewuSuffix || '';
      let n = 0;
      const step = () => { n += Math.ceil(end / 30); if (n >= end) { el.textContent = end + suffix; return; } el.textContent = n + suffix; requestAnimationFrame(step); };
      const cio = new IntersectionObserver((e, o) => { if (e[0].isIntersecting) { step(); o.disconnect(); } });
      cio.observe(el);
    });

    // Demo progress bar
    let bp = 0;
    const demoIo = new IntersectionObserver((e, o) => {
      if (e[0].isIntersecting) {
        const tk = setInterval(() => {
          bp += 8; if (bp >= 100) { bp = 100; clearInterval(tk); }
          const fill = '▓'.repeat(Math.floor(bp / 8.4)), emp = '░'.repeat(12 - Math.floor(bp / 8.4));
          if (barRef.current) barRef.current.textContent = `[${fill}${emp}] ${bp}%`;
        }, 120);
        o.disconnect();
      }
    }, { threshold: 0.5 });
    const demoEl = document.querySelector('.ewu-demo');
    if (demoEl) demoIo.observe(demoEl);

    // Magnetic buttons
    const mags = document.querySelectorAll<HTMLElement>('.ewu-mag');
    const onMagMove = function (this: HTMLElement, e: Event) {
      const me = e as MouseEvent; const r = this.getBoundingClientRect();
      this.style.transform = `translate(${(me.clientX - r.left - r.width / 2) * 0.25}px,${(me.clientY - r.top - r.height / 2) * 0.4}px)`;
    };
    const onMagLeave = function (this: HTMLElement) { this.style.transform = ''; };
    mags.forEach(b => { b.addEventListener('mousemove', onMagMove); b.addEventListener('mouseleave', onMagLeave); });

    return () => {
      clearTimeout(bootTimer);
      clearInterval(morphInterval);
      clearInterval(timerInterval);
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mousedown', onDown);
      window.removeEventListener('mouseup', onUp);
      io.disconnect();
      demoIo.disconnect();
      mags.forEach(b => { b.removeEventListener('mousemove', onMagMove); b.removeEventListener('mouseleave', onMagLeave); });
    };
  }, []);

  return (
    <>
      <style>{`
        .ewu-page{background:#050608;color:#eef1f5;font-family:'Archivo',system-ui,sans-serif;overflow-x:hidden;cursor:none;line-height:1.5;min-height:100vh}
        .ewu-page *{box-sizing:border-box;margin:0;padding:0}
        .ewu-page h1,.ewu-page h2,.ewu-page h3,.ewu-disp{font-family:'Big Shoulders Display','Archivo',sans-serif;letter-spacing:-.005em;text-transform:uppercase;font-weight:900;line-height:.86}
        .ewu-mono{font-family:'JetBrains Mono','Courier New',monospace}
        /* boot */
        #ewu-boot{position:fixed;inset:0;z-index:99999;background:#050608;display:flex;align-items:center;justify-content:center;font-family:'JetBrains Mono',monospace;color:#22e0d6;font-size:.85rem;letter-spacing:.05em;transition:opacity .6s,visibility .6s}
        #ewu-boot .lines p{opacity:0;margin:.4rem 0;animation:ewu-btn .35s forwards}
        #ewu-boot .lines p:nth-child(1){animation-delay:.05s}#ewu-boot .lines p:nth-child(2){animation-delay:.4s}#ewu-boot .lines p:nth-child(3){animation-delay:.75s}#ewu-boot .lines p:nth-child(4){animation-delay:1.1s;color:#ffb24d}#ewu-boot .lines p:nth-child(5){animation-delay:1.45s;color:#fff}
        @keyframes ewu-btn{to{opacity:1}}
        .ewu-scan{display:inline-block;width:8px;height:14px;background:#22e0d6;margin-left:4px;animation:ewu-blink .6s infinite}
        @keyframes ewu-blink{50%{opacity:0}}
        /* cursor */
        #ewu-arc{position:fixed;top:0;left:0;z-index:9999;width:14px;height:14px;border-radius:50%;background:radial-gradient(circle,#fff,#ffd27a 40%,rgba(255,77,18,.6) 70%,transparent);box-shadow:0 0 16px 4px rgba(255,140,40,.85),0 0 40px 8px rgba(255,77,18,.45);transform:translate(-50%,-50%);pointer-events:none;transition:width .15s,height .15s}
        #ewu-arc.ewu-big{width:30px;height:30px}
        /* scanlines */
        .ewu-scanline{position:fixed;inset:0;z-index:2;pointer-events:none;opacity:.5;background:repeating-linear-gradient(0deg,transparent 0 3px,rgba(0,0,0,.16) 3px 4px)}
        /* bar */
        .ewu-bar{position:sticky;top:0;z-index:50;display:flex;justify-content:space-between;align-items:center;padding:.7rem 1.4rem;font-family:'JetBrains Mono',monospace;font-size:.72rem;color:#79838f;background:rgba(5,6,8,.6);backdrop-filter:blur(12px);border-bottom:1px solid rgba(255,255,255,.08)}
        .ewu-bar b{color:#eef1f5}
        .ewu-live{display:inline-flex;gap:.5rem;align-items:center;color:#22e0d6}
        .ewu-dot{width:7px;height:7px;border-radius:50%;background:#22e0d6;box-shadow:0 0 10px #22e0d6;animation:ewu-pulse 1.6s infinite}
        @keyframes ewu-pulse{0%,100%{opacity:1}50%{opacity:.2}}
        /* layout */
        .ewu-wrap{max-width:1200px;margin:0 auto;padding:0 1.5rem}
        .ewu-btn{position:relative;display:inline-block;padding:1.05rem 2rem;border-radius:100px;font-weight:700;text-decoration:none;font-size:1rem;transition:transform .1s;will-change:transform;color:inherit;font-family:'Archivo',sans-serif;cursor:pointer;border:none}
        .ewu-btn-fire{background:linear-gradient(100deg,#ffb24d,#ff4d12);color:#190a02;box-shadow:0 0 60px -14px #ff4d12}
        .ewu-btn-ion{border:1px solid rgba(34,224,214,.4);color:#22e0d6;background:rgba(34,224,214,.05)}
        /* hero */
        .ewu-hero{position:relative;min-height:100vh;display:flex;align-items:center;padding:5rem 0 3rem}
        .ewu-heat{position:absolute;inset:-25%;z-index:0;filter:blur(80px);opacity:.55;background:radial-gradient(40% 45% at 70% 25%,#ff4d12 0,transparent 60%),radial-gradient(45% 45% at 18% 85%,#1c3fff 0,transparent 60%),radial-gradient(35% 40% at 55% 65%,#22e0d6 0,transparent 55%);animation:ewu-drift 18s ease-in-out infinite alternate}
        @keyframes ewu-drift{from{transform:translate(0,0) scale(1)}to{transform:translate(-3%,2%) scale(1.1)}}
        .ewu-hudgrid{position:absolute;inset:0;z-index:0;opacity:.32;background-image:linear-gradient(rgba(255,255,255,.08) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.08) 1px,transparent 1px);background-size:64px 64px;-webkit-mask:radial-gradient(70% 70% at 50% 45%,#000,transparent);mask:radial-gradient(70% 70% at 50% 45%,#000,transparent)}
        .ewu-tag{display:inline-flex;gap:.7rem;align-items:center;font-family:'JetBrains Mono',monospace;font-size:.74rem;color:#22e0d6;border:1px solid rgba(34,224,214,.25);border-radius:100px;padding:.42rem .9rem;margin-bottom:2rem}
        h1.ewu-king{font-family:'Big Shoulders Display','Archivo',sans-serif;font-size:clamp(4rem,16vw,13rem);margin:0;letter-spacing:-.01em;font-weight:900;text-transform:uppercase;line-height:.86}
        h1.ewu-king .row{display:block;overflow:hidden}
        .ewu-morph{position:relative;display:inline-block;min-width:6ch;background:linear-gradient(180deg,#fff7e8,#ffb24d 50%,#ff4d12);-webkit-background-clip:text;background-clip:text;color:transparent;filter:drop-shadow(0 0 28px rgba(255,90,20,.45))}
        .ewu-morph.ewu-flick{animation:ewu-glitch .25s steps(2)}
        @keyframes ewu-glitch{0%{transform:translate(0)}20%{transform:translate(-2px,1px) skewX(-2deg);filter:hue-rotate(20deg) brightness(1.4) drop-shadow(0 0 12px #ff4d12)}40%{transform:translate(2px,-1px) skewX(2deg);filter:brightness(.6)}60%{transform:translate(-1px,0)}80%{filter:brightness(1.6)}100%{transform:translate(0)}}
        .ewu-tez{background:linear-gradient(180deg,#fff7e8,#ffb24d 50%,#ff4d12);-webkit-background-clip:text;background-clip:text;color:transparent;filter:drop-shadow(0 0 28px rgba(255,90,20,.4));animation:ewu-flicker 4.5s infinite}
        @keyframes ewu-flicker{0%,96%,100%{opacity:1}97%{opacity:.4}98%{opacity:1}}
        .ewu-lead{font-size:clamp(1.1rem,2vw,1.4rem);color:#79838f;max-width:54ch;margin:2.2rem 0;line-height:1.55}
        .ewu-lead b{color:#eef1f5;font-weight:500}
        .ewu-lead .ewu-hit{color:#ffb24d}
        .ewu-cta{display:flex;gap:1rem;flex-wrap:wrap}
        .ewu-metrics{display:flex;gap:2.6rem;margin-top:3.5rem;flex-wrap:wrap}
        .ewu-metric .ewu-num{font-family:'Big Shoulders Display','Archivo',sans-serif;font-size:clamp(2rem,4.5vw,3.2rem);font-weight:900;background:linear-gradient(120deg,#22e0d6,#39a0ff);-webkit-background-clip:text;background-clip:text;color:transparent;line-height:1}
        .ewu-metric .ewu-lbl{font-family:'JetBrains Mono',monospace;font-size:.72rem;color:#79838f;text-transform:uppercase;letter-spacing:.1em;margin-top:.4rem}
        /* marquee */
        .ewu-marquee{position:relative;border-top:1px solid rgba(255,255,255,.08);border-bottom:1px solid rgba(255,255,255,.08);padding:1.4rem 0;overflow:hidden;background:#070809;mask:linear-gradient(90deg,transparent,#000 8%,#000 92%,transparent)}
        .ewu-marquee-track{display:flex;gap:3.5rem;animation:ewu-scroll 38s linear infinite;width:max-content;font-family:'Big Shoulders Display','Archivo',sans-serif;font-weight:900;font-size:2.2rem;text-transform:uppercase;color:#eef1f5;white-space:nowrap;letter-spacing:.02em}
        .ewu-marquee-track span{display:inline-flex;align-items:center;gap:3.5rem}
        .ewu-marquee-track .ewu-acc{color:#ff4d12}.ewu-marquee-track .ewu-ion{color:#22e0d6}
        @keyframes ewu-scroll{from{transform:translateX(0)}to{transform:translateX(-50%)}}
        /* live */
        .ewu-live-blk{padding:6rem 0;text-align:center}
        .ewu-eyebrow{font-family:'JetBrains Mono',monospace;font-size:.74rem;color:#ff4d12;letter-spacing:.2em;text-transform:uppercase;margin-bottom:1rem}
        .ewu-timer{font-family:'Big Shoulders Display','Archivo',sans-serif;font-size:clamp(3rem,11vw,8rem);font-weight:900;background:linear-gradient(180deg,#fff7e8,#ffb24d,#ff4d12);-webkit-background-clip:text;background-clip:text;color:transparent;filter:drop-shadow(0 0 30px rgba(255,90,20,.35));line-height:1;letter-spacing:.01em}
        .ewu-live-cap{font-family:'JetBrains Mono',monospace;color:#79838f;max-width:50ch;margin:1.4rem auto 0;font-size:.95rem;line-height:1.6}
        /* manifesto */
        .ewu-manifest{padding:8rem 0}
        .ewu-maxim{font-family:'Big Shoulders Display','Archivo',sans-serif;font-weight:900;font-size:clamp(2.4rem,8vw,6rem);line-height:.9;letter-spacing:-.01em;text-transform:uppercase;margin:5rem 0;max-width:18ch}
        .ewu-maxim em{font-style:normal;background:linear-gradient(180deg,#ffb24d,#ff4d12);-webkit-background-clip:text;background-clip:text;color:transparent}
        .ewu-maxim .ghost{color:#2a2f37}
        .ewu-maxim .small{display:block;font-family:'Archivo',sans-serif;font-size:1rem;font-weight:500;color:#79838f;text-transform:none;letter-spacing:0;margin-top:1rem;max-width:50ch;line-height:1.55;font-style:italic}
        /* terminal */
        .ewu-term{background:#080a0d;border:1px solid rgba(255,255,255,.08);border-radius:14px;overflow:hidden;font-family:'JetBrains Mono',monospace;font-size:.9rem;line-height:1.7;max-width:760px;margin:2rem auto 0;box-shadow:0 30px 80px -30px rgba(255,90,20,.25)}
        .ewu-term-head{display:flex;gap:.5rem;padding:.7rem 1rem;border-bottom:1px solid rgba(255,255,255,.08);background:#0b0e12;align-items:center}
        .ewu-term-head i{width:10px;height:10px;border-radius:50%;background:#333;display:inline-block}
        .ewu-term-head i:nth-child(1){background:#ff5f56}.ewu-term-head i:nth-child(2){background:#ffbd2e}.ewu-term-head i:nth-child(3){background:#27c93f}
        .ewu-term-head span{margin-left:auto;color:#79838f;font-size:.72rem}
        .ewu-term-body{padding:1.4rem 1.6rem;color:#cdd5df;min-height:280px}
        .ewu-cmd{color:#22e0d6}.ewu-ok{color:#27c93f}.ewu-warn{color:#ffb24d}
        .ewu-res{color:#ffb24d;font-family:'Big Shoulders Display','Archivo',sans-serif;font-size:1.6rem;font-weight:900;letter-spacing:.02em;margin-top:.6rem;display:inline-block}
        /* sections */
        .ewu-sec{padding:7rem 0}
        h2.ewu-h2{font-family:'Big Shoulders Display','Archivo',sans-serif;font-weight:900;font-size:clamp(2rem,5.5vw,3.8rem);margin-bottom:1.4rem;text-transform:uppercase;line-height:.9;letter-spacing:-.01em}
        .ewu-sub{color:#79838f;max-width:62ch;font-size:1.05rem;line-height:1.65}
        .ewu-reveal{opacity:0;transform:translateY(40px);transition:.9s cubic-bezier(.2,.7,.2,1)}
        .ewu-reveal.ewu-on{opacity:1;transform:none}
        /* protocols */
        .ewu-proto{display:grid;gap:1px;background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.08);border-radius:16px;overflow:hidden;grid-template-columns:repeat(auto-fit,minmax(230px,1fr));margin-top:2.5rem}
        .ewu-pcard{background:#0c0f14;padding:2.2rem 1.8rem;position:relative;transition:.3s;overflow:hidden}
        .ewu-pcard::before{content:"";position:absolute;inset:0;background:radial-gradient(120% 80% at 100% 0,rgba(255,77,18,.16),transparent 60%);opacity:0;transition:.3s}
        .ewu-pcard:hover::before{opacity:1}.ewu-pcard:hover{transform:translateY(-5px)}
        .ewu-pcode{font-family:'Big Shoulders Display','Archivo',sans-serif;font-size:4.2rem;font-weight:900;line-height:1;background:linear-gradient(180deg,#ffb24d,#ff4d12);-webkit-background-clip:text;background-clip:text;color:transparent}
        .ewu-pname{font-family:'JetBrains Mono',monospace;color:#22e0d6;font-size:.95rem;margin:.6rem 0 .4rem;font-weight:600}
        .ewu-pdesc{color:#79838f;font-size:.92rem}
        .ewu-pnote{margin-top:1.6rem;color:#79838f;font-family:'JetBrains Mono',monospace;font-size:.82rem}
        /* care */
        .ewu-care-grid{display:grid;gap:1.2rem;grid-template-columns:repeat(auto-fit,minmax(250px,1fr));margin-top:2.5rem}
        .ewu-ccard{background:linear-gradient(180deg,#0c0f14,#080a0d);border:1px solid rgba(255,255,255,.08);border-radius:16px;padding:2rem 1.9rem;transition:.3s}
        .ewu-ccard:hover{border-color:rgba(255,77,18,.4);transform:translateY(-4px)}
        .ewu-ccard .ewu-idx{font-family:'JetBrains Mono',monospace;font-size:.74rem;color:#ff4d12;margin-bottom:.8rem}
        .ewu-ccard h3{font-family:'Big Shoulders Display','Archivo',sans-serif;font-weight:900;font-size:1.7rem;margin-bottom:.6rem;text-transform:uppercase;letter-spacing:.01em}
        .ewu-ccard p{color:#79838f;font-size:.95rem;line-height:1.55}
        /* pipeline */
        .ewu-pipe{display:grid;gap:1px;background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.08);border-radius:16px;overflow:hidden;margin-top:2.5rem}
        .ewu-step{background:#0c0f14;padding:1.9rem 2rem;display:flex;gap:1.6rem;align-items:center;transition:.25s}
        .ewu-step:hover{background:#11151b;padding-left:2.6rem}
        .ewu-step .ewu-n{font-family:'JetBrains Mono',monospace;font-size:1rem;color:#22e0d6;border:1px solid rgba(34,224,214,.3);border-radius:8px;padding:.4rem .65rem;min-width:3.2ch;text-align:center}
        .ewu-step .ewu-ttl{font-family:'Big Shoulders Display','Archivo',sans-serif;font-size:1.7rem;font-weight:900;text-transform:uppercase;letter-spacing:.02em;margin-right:.2rem}
        .ewu-step .ewu-d{color:#79838f;font-size:.97rem}
        /* employers */
        .ewu-emp{position:relative;border-radius:22px;overflow:hidden;margin-top:6rem;border:1px solid rgba(255,77,18,.25);background:radial-gradient(60% 100% at 100% 0,rgba(255,77,18,.2),transparent 60%),#0c0f14}
        .ewu-emp .inner{padding:4rem 2.4rem}
        .ewu-emp p{color:#79838f;font-size:1.06rem;max-width:60ch;margin:1.2rem 0 2rem;line-height:1.6}
        /* footer */
        .ewu-foot{padding:5rem 0 3rem;border-top:1px solid rgba(255,255,255,.08);margin-top:6rem;text-align:center}
        .ewu-foot .sig{font-family:'Big Shoulders Display','Archivo',sans-serif;font-weight:900;font-size:1.6rem;letter-spacing:.02em}
        .ewu-foot .q{color:#79838f;font-style:italic;margin:.8rem 0;font-family:'JetBrains Mono',monospace;font-size:.85rem}
        .ewu-foot a{color:#22e0d6;text-decoration:none;font-family:'JetBrains Mono',monospace;font-size:.82rem}
        @media(max-width:560px){.ewu-metrics{gap:1.6rem}.ewu-sec{padding:4.5rem 0}.ewu-manifest{padding:4rem 0}.ewu-maxim{margin:2.5rem 0}}
        @media(hover:none){.ewu-page{cursor:auto}#ewu-arc{display:none}}
      `}</style>

      {/* Boot splash */}
      <div id="ewu-boot" ref={bootRef}>
        <div className="lines">
          <p>{'>'} ⚡ SYSTEM_021 / EWU NEURAL NET</p>
          <p>{'>'} INITIALIZING SPARK ENGINE...</p>
          <p>{'>'} LOADING ORAKUL CORE v021.0</p>
          <p>{'>'} CONNECTED · ZWIĄZEK UKRAIŃSKICH SPAWACZY</p>
          <p>{'>'} ONLINE.<span className="ewu-scan" /></p>
        </div>
      </div>

      <div className="ewu-page">
        <canvas ref={canvasRef} id="ewu-sparks" style={{ position: 'fixed', inset: 0, zIndex: 1, pointerEvents: 'none' }} />
        <div ref={arcRef} id="ewu-arc" />
        <div className="ewu-scanline" />

        {/* Top bar */}
        <div className="ewu-bar">
          <span className="ewu-mono"><b>EWU</b> / SYSTEM_021</span>
          <span className="ewu-live ewu-mono"><span className="ewu-dot" />NEURAL NET · LIVE</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span className="ewu-mono">PL · ES · EU</span>
            <Link href={`/${locale}`} style={{ color: '#22e0d6', textDecoration: 'none', fontFamily: "'JetBrains Mono',monospace", fontSize: '.72rem', border: '1px solid rgba(34,224,214,.25)', borderRadius: '100px', padding: '.3rem .8rem', transition: 'all .2s' }}>← Kompas</Link>
          </div>
        </div>

        {/* Hero */}
        <section className="ewu-hero">
          <div className="ewu-heat" />
          <div className="ewu-hudgrid" />
          <div className="ewu-wrap" style={{ position: 'relative', zIndex: 5 }}>
            <span className="ewu-tag ewu-mono">⚡ ZWIĄZEK UKRAIŃSKICH SPAWACZY · NEURAL RECRUITMENT</span>
            <h1 className="ewu-king">
              <span className="row"><span className="ewu-morph" ref={morphRef}>МАЙСТЕР</span></span>
              <span className="row">ЦЕ ПІДПИС.</span>
              <span className="row"><span className="ewu-tez">ДА ТАК.</span></span>
            </h1>
            <p className="ewu-lead">
              <span className="ewu-hit">Одне фото шва.</span>{' '}
              <span className="ewu-hit">60 секунд.</span>{' '}
              <b>Завод у Європі.</b><br />
              Без агентів-кидал. Без дрібного шрифту. Без посередників, які крадуть з твоєї ставки.
            </p>
            <div className="ewu-cta">
              <button className="ewu-btn ewu-btn-fire ewu-mag">▶ Запустити ОРАКУЛ</button>
              <button className="ewu-btn ewu-btn-ion ewu-mag">// Я роботодавець</button>
            </div>
            <div className="ewu-metrics">
              <div className="ewu-metric"><div className="ewu-num" data-ewu-c="40" data-ewu-suffix="K+">0</div><div className="ewu-lbl">тис. майстрів</div></div>
              <div className="ewu-metric"><div className="ewu-num" data-ewu-c="60" data-ewu-suffix="">0</div><div className="ewu-lbl">сек. на оцінку</div></div>
              <div className="ewu-metric"><div className="ewu-num">021</div><div className="ewu-lbl">рівень системи</div></div>
              <div className="ewu-metric"><div className="ewu-num">0</div><div className="ewu-lbl">кидалова</div></div>
            </div>
          </div>
        </section>

        {/* Marquee */}
        <div className="ewu-marquee">
          <div className="ewu-marquee-track">
            <span>
              <b>111 MMA</b><span className="ewu-acc">◆</span><b>131 MIG</b><span className="ewu-acc">◆</span><b>135 MAG</b><span className="ewu-acc">◆</span><b>141 TIG</b>
              <span className="ewu-ion">PA · PB · PC · PF · 6G</span>
              <b>НАРФ</b><span className="ewu-acc">◆</span><b>ТРУБА</b><span className="ewu-acc">◆</span><b>БАЛКА</b>
              <span className="ewu-ion">RT · UT · WPS · EN ISO 9606</span>
              <b>ВАРШАВА</b><span className="ewu-acc">◆</span><b>БАРСЕЛОНА</b><span className="ewu-acc">◆</span><b>HAMBURG</b><span className="ewu-acc">◆</span><b>BILBAO</b>
            </span>
            <span>
              <b>111 MMA</b><span className="ewu-acc">◆</span><b>131 MIG</b><span className="ewu-acc">◆</span><b>135 MAG</b><span className="ewu-acc">◆</span><b>141 TIG</b>
              <span className="ewu-ion">PA · PB · PC · PF · 6G</span>
              <b>НАРФ</b><span className="ewu-acc">◆</span><b>ТРУБА</b><span className="ewu-acc">◆</span><b>БАЛКА</b>
              <span className="ewu-ion">RT · UT · WPS · EN ISO 9606</span>
              <b>ВАРШАВА</b><span className="ewu-acc">◆</span><b>БАРСЕЛОНА</b><span className="ewu-acc">◆</span><b>HAMBURG</b><span className="ewu-acc">◆</span><b>BILBAO</b>
            </span>
          </div>
        </div>

        {/* Live uptime */}
        <section className="ewu-live-blk ewu-wrap ewu-reveal">
          <div className="ewu-eyebrow ewu-mono">// UPTIME · БЕЗПЕРЕРВНА РОБОТА</div>
          <div className="ewu-timer" ref={timerRef}>00:00:00</div>
          <p className="ewu-live-cap">Поки Європа спить, мережа варить.<br />ОРАКУЛ не лягає. Не п&apos;є. Не розчарується через тебе.</p>
        </section>

        {/* Manifesto */}
        <section className="ewu-manifest ewu-wrap">
          <div className="ewu-maxim ewu-reveal">
            Шов — це <em>підпис.</em><br /><span className="ghost">Машина</span> читає його за тебе.
            <span className="small">Геометрія валика, провар кореня, підрізи, шлак. Машина бачить руку за секунди. Балакун не пройде. Майстер пройде завжди.</span>
          </div>
          <div className="ewu-maxim ewu-reveal">
            Координатор — <em>не з твоєї зарплати.</em>
            <span className="small">Він наш. Платимо ми. Дивно для конкурентів, які про це навіть вголос не говорять. Норма — для нас.</span>
          </div>
          <div className="ewu-maxim ewu-reveal">
            Ти говориш <em>фото.</em><br />Машина — <em>руч.</em>
            <span className="small">Ти продаєш руки. Ми продаємо тебе достойно. Досвід — каже. Мережа на твоєму боці. Завжди.</span>
          </div>
        </section>

        {/* Demo terminal */}
        <section className="ewu-sec ewu-wrap ewu-reveal ewu-demo">
          <div className="ewu-eyebrow ewu-mono">// LIVE_INFERENCE — оцінка шва за 60 секунд</div>
          <h2 className="ewu-h2">ОРАКУЛ дивиться,<br />як майстер</h2>
          <div className="ewu-term">
            <div className="ewu-term-head"><i /><i /><i /><span>orakul@ewu // weld_inference.v021</span></div>
            <div className="ewu-term-body">
              <span className="ewu-cmd">$ orakul --analyze seam_2026_05.jpg --model 021</span><br /><br />
              {'>'} LOADING IMAGE ............... <span className="ewu-ok">OK</span><br />
              {'>'} DETECTING METHOD ........... <span className="ewu-ok">141 TIG</span><br />
              {'>'} POSITION ................... <span className="ewu-ok">6G (труба, all-position)</span><br />
              {'>'} ANALYZING ROOT ............. <span ref={barRef}>[░░░░░░░░░░░░] 0%</span><br />
              {'>'} ПРОВАР КОРЕНЯ ............. <span className="ewu-ok">ВІДМІННО</span><br />
              {'>'} ПІДРІЗИ / UNDERCUT ....... <span className="ewu-ok">НЕ ВИЯВЛЕНО</span><br />
              {'>'} ШЛАК / SLAG INCLUSIONS ... <span className="ewu-ok">НЕ ВИЯВЛЕНО</span><br />
              {'>'} RIPPLES UNIFORMITY ......... <span className="ewu-ok">96.4%</span><br />
              {'>'} RT/UT READINESS ............ <span className="ewu-ok">PASS</span><br /><br />
              {'>'} <span className="ewu-warn">VERDICT:</span><br />
              <span className="ewu-res">МАЙСТЕР РЕКОМЕНДУЄТЬСЯ. ✓</span><br />
              <span className="ewu-cmd">_</span>
            </div>
          </div>
        </section>

        {/* Protocols */}
        <section className="ewu-sec ewu-wrap ewu-reveal">
          <div className="ewu-eyebrow ewu-mono">// SUPPORTED_PROTOCOLS</div>
          <h2 className="ewu-h2">Машина читає руку,<br />яку неможливо підробити</h2>
          <p className="ewu-sub">Завантаж фото шва — нейромережа бачить геометрію, провар, дефекти. Те, що відрізняє майстра від балакуна. За секунди.</p>
          <div className="ewu-proto">
            <div className="ewu-pcard"><div className="ewu-pcode">111</div><div className="ewu-pname ewu-mono">MMA</div><div className="ewu-pdesc">ручне дугове · електрод</div></div>
            <div className="ewu-pcard"><div className="ewu-pcode">131</div><div className="ewu-pname ewu-mono">MIG</div><div className="ewu-pdesc">інертний газ · неіржа, алюміній</div></div>
            <div className="ewu-pcard"><div className="ewu-pcode">135</div><div className="ewu-pname ewu-mono">MAG</div><div className="ewu-pdesc">активний газ · вуглецева сталь</div></div>
            <div className="ewu-pcard"><div className="ewu-pcode">141</div><div className="ewu-pname ewu-mono">TIG</div><div className="ewu-pdesc">вольфрам · корінь, труби</div></div>
          </div>
          <p className="ewu-pnote ewu-mono">+ монтажники · слюсарі · працівники верфей · бригади // PA–PF, 6G // EN ISO 9606</p>
        </section>

        {/* Care */}
        <section className="ewu-sec ewu-wrap ewu-reveal">
          <div className="ewu-eyebrow ewu-mono">// PROTOKÓŁ_OPIEKI</div>
          <h2 className="ewu-h2">Опіка — це інфраструктура,<br />а не реклама</h2>
          <p className="ewu-sub">Конкурент, що кине на зарплаті, про це навіть вголос не скаже. Але не здогадається, що так можна. Ми вшили це в систему.</p>
          <div className="ewu-care-grid">
            <div className="ewu-ccard"><div className="ewu-idx ewu-mono">01</div><h3>Прозоро</h3><p>Договір чистий. Без дрібного шрифту. Без зборів. Без сюрпризів в кінці місяця.</p></div>
            <div className="ewu-ccard"><div className="ewu-idx ewu-mono">02</div><h3>Чесно</h3><p>Ставку виторгували за тебе. Переговини провели ми. Ти приходиш на готове.</p></div>
            <div className="ewu-ccard"><div className="ewu-idx ewu-mono">03</div><h3>Оплачено</h3><p>Координатор не з твоєї зарплати. Він наш. На обʼєкті допоможе з усім.</p></div>
            <div className="ewu-ccard"><div className="ewu-idx ewu-mono">04</div><h3>Порядок</h3><p>Досвід — каже. Мережа на твоєму боці. Завжди. Без відмазок.</p></div>
          </div>
        </section>

        {/* Pipeline */}
        <section className="ewu-sec ewu-wrap ewu-reveal">
          <div className="ewu-eyebrow ewu-mono">// EXECUTION_PIPELINE</div>
          <h2 className="ewu-h2">Чотири кроки<br />до контракту</h2>
          <div className="ewu-pipe">
            <div className="ewu-step"><span className="ewu-n ewu-mono">01</span><span className="ewu-ttl">Пишеш</span><span className="ewu-d">ОРАКУЛу, як другу. Жодного опитника.</span></div>
            <div className="ewu-step"><span className="ewu-n ewu-mono">02</span><span className="ewu-d">Машина бачить твою руку. Підпис без слів.</span><span className="ewu-ttl">Видаєш фото</span></div>
            <div className="ewu-step"><span className="ewu-n ewu-mono">03</span><span className="ewu-ttl">Домовляємось</span><span className="ewu-d">Обʼєкт. Ставка. Документи. Все по-чесному.</span></div>
            <div className="ewu-step"><span className="ewu-n ewu-mono">04</span><span className="ewu-ttl">Працюєш</span><span className="ewu-d">Координатор поруч. Завод задоволений. Ти — теж.</span></div>
          </div>
        </section>

        {/* Employers */}
        <section className="ewu-wrap ewu-reveal" id="ewu-emp">
          <div className="ewu-emp"><div className="inner">
            <div className="ewu-eyebrow ewu-mono">// DLA_PRACODAWCÓW</div>
            <h2 className="ewu-h2">Stabilny zespół.<br />Zero rotacji.<br />Pełen cykl.</h2>
            <p>Sprawdzeni spawacze 111/131/135/141, monterzy i brygady — z weryfikacją AI po zdjęciach prac, legalizacją pobytu, opieką koordynatora i gwarancją zastępstwa. Mniej przestojów. Niższe koszty. Przewidywalny wynik.</p>
            <button className="ewu-btn ewu-btn-fire ewu-mag">Połącz się z siecią →</button>
          </div></div>
        </section>

        <footer className="ewu-foot ewu-wrap">
          <div className="sig">⚡ EWU · SYSTEM 021</div>
          <div className="q ewu-mono">&ldquo;Шов лежить ідеально, коли поспішати нікуди.&rdquo;</div>
          <Link href={`/${locale}`} className="ewu-foot a">← kompasmigracji.com</Link>
        </footer>
      </div>
    </>
  );
}
