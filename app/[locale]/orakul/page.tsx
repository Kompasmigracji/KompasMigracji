 'use client';
import { useRef, useEffect, useState } from 'react';
import Link from 'next/link';
import { useLocale } from 'next-intl';

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Archivo:wght@400;500;600;700;900&display=swap');

.e-pg *,.e-pg *::before,.e-pg *::after{box-sizing:border-box;margin:0;padding:0}

.e-pg{
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
  background:var(--nav-bg);
  backdrop-filter:blur(12px);
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
  background-image:url('https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?auto=format&fit=crop&w=1920&q=95');
  background-size:cover;background-position:center;
  filter:var(--section-filter);
  z-index:1;
}
[data-theme="dark"] .e-hero::before{
  filter:brightness(0.55) contrast(0.95);
}
[data-theme="light"] .e-hero::before{
  filter:brightness(0.98) contrast(0.98);
}
.e-hero-inner{
  position:relative;z-index:2;
  text-align:center;max-width:1000px;width:100%;padding:0 1.5rem;
}

/* GIANT LOGO */
.e-logo-wrap{
  position:relative;width:300px;height:300px;
  margin:0 auto .5rem;
  display:flex;align-items:center;justify-content:center;
}
.e-logo-canvas{
  position:absolute;top:0;left:0;
  width:300px;height:300px;
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
  background:var(--badge-bg);
  border:1px solid var(--border);border-radius:50px;
  margin-bottom:1.4rem;backdrop-filter:blur(6px);
  box-shadow:0 6px 30px rgba(0,0,0,0.12);
}
.e-badge h2{font-size:.95rem;font-weight:700;color:var(--text-main)}
.e-badge span{color:var(--union-blue)}

.e-hero-title{font-size:clamp(2.1rem,5vw,3.4rem);font-weight:700;line-height:1.1;margin-bottom:1.1rem}
.e-hero-desc{
  color:var(--hero-desc-color);font-size:clamp(1.05rem,2vw,1.25rem);font-weight:500;
  max-width:700px;margin:0 auto 2.5rem;text-shadow:0 2px 8px rgba(0,0,0,.6);
}
[data-theme="light"] .e-hero-desc{
  text-shadow:0 2px 8px rgba(0,0,0,.08);
}
[data-theme="dark"] .e-hero-desc{
  text-shadow:0 2px 8px rgba(0,0,0,.6);
}

.e-role-cards{display:flex;gap:20px;width:100%;max-width:900px;margin:0 auto}
.e-role-card{
  flex:1;background:var(--card-bg);backdrop-filter:blur(10px);
  border:1px solid var(--border);border-radius:16px;padding:2.2rem 1.8rem;
  cursor:pointer;box-shadow:0 10px 30px rgba(0,0,0,.15);
  transition:transform .3s cubic-bezier(.16,1,.3,1),box-shadow .3s;
  text-align:left;text-decoration:none;display:block;
}
.e-role-card:hover{transform:translateY(-5px);box-shadow:0 20px 40px rgba(0,229,255,.25)}
.e-role-icon{font-size:2.4rem;margin-bottom:.7rem;display:block}
.e-role-card h3{font-size:1.5rem;font-weight:700;margin-bottom:.4rem;color:#0f172a}
.e-role-card p{color:#334155;font-size:1rem;font-weight:500}

.e-wrap{max-width:1120px;margin:0 auto;padding:0 1.5rem;position:relative;z-index:1}

/* SECTIONS */
.e-section{padding:6rem 0;border-top:1px solid rgba(255,255,255,0.06);position:relative;overflow:hidden;color:#fff}
.e-section::before{content:'';position:absolute;inset:0;background-image:url('https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?auto=format&fit=crop&w=1920&q=95');background-size:cover;background-position:center;filter:brightness(0.55) contrast(0.95);z-index:-1}
.e-section-alt{position:relative;background:transparent;color:#fff}
.e-section-alt::before{content:'';position:absolute;inset:0;background-image:url('https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?auto=format&fit=crop&w=1920&q=95');background-size:cover;background-position:center;filter:brightness(0.6) contrast(0.95);z-index:-1}
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
.e-form-box{background:var(--bg-panel);border:1px solid var(--border);border-radius:16px;padding:2.5rem}
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
  width:100%;padding:1rem;border-radius:10px;border:2px solid var(--btn-border);
  cursor:pointer;background:var(--union-blue);color:#fff;
  font-weight:700;font-size:1rem;font-family:inherit;
  transition:filter .15s,box-shadow .15s;margin-top:4px;
  box-shadow:0 4px 14px rgba(29,78,216,.2);
}
.e-submit-btn:hover:not(:disabled){filter:brightness(1.08);box-shadow:0 6px 20px rgba(0,0,0,.45)}
.e-submit-btn:disabled{opacity:.5;cursor:not-allowed}
.e-ok{text-align:center;padding:1.5rem 0}
.e-ok-ico{font-size:3rem;margin-bottom:1rem;color:var(--union-blue)}
.e-ok h3{font-size:1.3rem;font-weight:700;margin-bottom:.5rem}
.e-ok p{font-size:.95rem;color:var(--text-muted)}

/* BTN */
.e-btn{
  display:inline-block;padding:1rem 2.2rem;border-radius:10px;border:2px solid var(--btn-border);
  cursor:pointer;background:var(--union-blue);color:#fff;font-weight:700;
  font-size:1rem;font-family:inherit;text-decoration:none;
  transition:filter .2s,box-shadow .15s;box-shadow:0 4px 14px rgba(29,78,216,.2);
}
.e-btn:hover{filter:brightness(1.08);box-shadow:0 6px 20px rgba(0,0,0,.45)}

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

/* WATERMARK */
.e-wm{
  position:fixed;bottom:18px;left:18px;z-index:8000;
  display:flex;align-items:center;gap:7px;
  padding:6px 12px 6px 8px;
  background:rgba(6,9,18,.55);
  border:1px solid rgba(0,229,255,.18);
  border-radius:50px;
  backdrop-filter:blur(12px);
  opacity:.28;
  transition:opacity .3s,box-shadow .3s;
  pointer-events:none;
  user-select:none;
}
.e-wm:hover{opacity:.72;box-shadow:0 0 18px rgba(0,229,255,.22)}
.e-wm-ico{flex-shrink:0;display:flex;align-items:center}
.e-wm-txt{
  font-family:-apple-system,BlinkMacSystemFont,'SF Pro Text','Helvetica Neue',Arial,sans-serif;
  font-size:.68rem;font-weight:700;letter-spacing:.04em;
  background:linear-gradient(90deg,#93c5fd,#00e5ff 55%,#60a5fa);
  -webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;
  white-space:nowrap;
}
.e-wm-copy{
  font-size:.55rem;font-weight:500;color:rgba(148,194,251,.45);
  font-family:inherit;letter-spacing:.02em;margin-top:1px;
}
@media(max-width:480px){.e-wm{bottom:80px}}
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

/* ── ORAKUL CHAT WIDGET ── */
.oc-btn{
  position:fixed;bottom:26px;right:26px;z-index:9990;
  display:flex;align-items:center;gap:.45rem;
  padding:.65rem 1.25rem;border-radius:50px;border:none;cursor:pointer;
  background:linear-gradient(135deg,#1d4ed8,#0ea5e9);
  color:#fff;font-weight:600;font-size:.84rem;
  font-family:-apple-system,BlinkMacSystemFont,'SF Pro Text','Helvetica Neue',Arial,sans-serif;
  letter-spacing:-.01em;
  box-shadow:0 0 22px -4px rgba(14,165,233,.55),0 4px 14px rgba(0,0,0,.22);
  transition:transform .2s;
  animation:oc-btn-glow 3s ease-in-out infinite;
}
@keyframes oc-btn-glow{
  0%,100%{box-shadow:0 0 18px -4px rgba(29,78,216,.5),0 4px 14px rgba(0,0,0,.2)}
  50%{box-shadow:0 0 44px -2px rgba(0,229,255,.9),0 0 80px rgba(0,100,255,.28),0 4px 18px rgba(0,0,0,.25)}
}
.oc-btn:hover{transform:translateY(-2px);animation:none;box-shadow:0 0 40px -2px rgba(0,229,255,.95),0 8px 20px rgba(0,0,0,.25)}
.oc-btn-dot{width:7px;height:7px;border-radius:50%;background:#7fffb2;box-shadow:0 0 6px #7fffb2;animation:oc-pulse 2s infinite}
@keyframes oc-pulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.6;transform:scale(.7)}}

.oc-panel{
  position:fixed;bottom:84px;right:26px;z-index:9991;
  width:386px;height:572px;
  background:#ffffff;backdrop-filter:blur(22px);
  border:1px solid rgba(29,78,216,.12);border-radius:22px;
  display:flex;flex-direction:column;overflow:hidden;
  box-shadow:0 24px 64px rgba(29,78,216,.12),0 8px 24px rgba(0,0,0,.1),0 0 0 1px rgba(29,78,216,.06);
  animation:oc-in .24s cubic-bezier(.16,1,.3,1);
  font-family:-apple-system,BlinkMacSystemFont,'SF Pro Text','Helvetica Neue',Arial,sans-serif;
}
@keyframes oc-in{from{opacity:0;transform:translateY(16px) scale(.97)}to{opacity:1;transform:none}}

.oc-head{
  padding:.85rem 1.2rem;flex-shrink:0;
  background:linear-gradient(135deg,#1d4ed8,#0ea5e9);
  border-bottom:none;
  display:flex;align-items:center;gap:.65rem;
}
.oc-head-sym{
  width:34px;height:34px;border-radius:50%;flex-shrink:0;
  background:rgba(255,255,255,.18);
  border:1.5px solid rgba(255,255,255,.35);
  display:flex;align-items:center;justify-content:center;
  font-size:.85rem;font-weight:900;color:#fff;
}
.oc-head-info{flex:1;min-width:0}
.oc-head-name{font-weight:600;font-size:.93rem;color:#fff;letter-spacing:-.01em}
.oc-head-sub{font-size:.7rem;color:rgba(255,255,255,.75);font-weight:400;margin-top:1px;letter-spacing:0}
.oc-close{background:none;border:none;cursor:pointer;color:rgba(255,255,255,.5);font-size:1.1rem;line-height:1;padding:.2rem .3rem;border-radius:6px;transition:color .15s;margin-left:auto}
.oc-close:hover{color:#fff}

.oc-msgs{
  flex:1;overflow-y:auto;padding:1rem .85rem;display:flex;flex-direction:column;gap:.6rem;
  scrollbar-width:thin;scrollbar-color:rgba(29,78,216,.12) transparent;
  background:#f8fafc;
}
.oc-msg{display:flex;gap:.45rem;align-items:flex-end}
.oc-msg-assistant{justify-content:flex-start}
.oc-msg-user{justify-content:flex-end}
.oc-avatar{
  width:26px;height:26px;border-radius:50%;flex-shrink:0;
  background:linear-gradient(135deg,#1d4ed8,#0ea5e9);
  border:1.5px solid rgba(29,78,216,.2);
  display:flex;align-items:center;justify-content:center;
  font-size:.62rem;font-weight:900;color:#fff;letter-spacing:-.02em;
}
.oc-bubble{
  max-width:80%;padding:.55rem .9rem;border-radius:14px;
  font-size:.84rem;line-height:1.5;font-family:inherit;
  letter-spacing:-.005em;
  white-space:pre-wrap;word-break:break-word;
}
.oc-bubble-assistant{
  background:#fff;color:#1e293b!important;
  border:1px solid rgba(29,78,216,.09);border-bottom-left-radius:4px;
  box-shadow:0 1px 4px rgba(0,0,0,.04);
}
.oc-bubble-user{
  background:linear-gradient(135deg,#1d4ed8,#2563eb);color:#fff!important;
  border-bottom-right-radius:4px;
}
.oc-typing{display:flex;gap:4px;align-items:center;padding:.3rem .2rem}
.oc-dot{width:5px;height:5px;border-radius:50%;background:rgba(29,78,216,.4);animation:oc-blink 1.2s infinite}
.oc-dot:nth-child(2){animation-delay:.2s}
.oc-dot:nth-child(3){animation-delay:.4s}
@keyframes oc-blink{0%,100%{opacity:.25;transform:scale(.8)}50%{opacity:1;transform:scale(1)}}
.oc-saved{text-align:center;font-size:.7rem;color:rgba(29,78,216,.6);padding:.3rem}

.oc-input-row{
  padding:.75rem .85rem;border-top:1px solid rgba(29,78,216,.08);
  display:flex;gap:.5rem;align-items:center;flex-shrink:0;
  background:#ffffff;
}
.oc-input{
  flex:1;background:#f1f5f9;border:1px solid rgba(29,78,216,.15);
  border-radius:22px;padding:.55rem .95rem;color:#0f172a!important;
  font-size:.84rem;font-family:inherit;letter-spacing:-.005em;outline:none;transition:border-color .15s,background .15s;
}
.oc-input:focus{border-color:rgba(29,78,216,.45);background:#ffffff;box-shadow:0 0 0 3px rgba(29,78,216,.08)}
.oc-input::placeholder{color:#94a3b8}
.oc-send{
  width:34px;height:34px;border-radius:50%;border:none;cursor:pointer;flex-shrink:0;
  background:linear-gradient(135deg,#1d4ed8,#0ea5e9);color:#fff;
  display:flex;align-items:center;justify-content:center;
  transition:transform .15s,opacity .15s;
}
.oc-send:hover:not(:disabled){transform:scale(1.1)}
.oc-send:disabled{opacity:.35;cursor:not-allowed}
@media(max-width:440px){
  .oc-panel{width:calc(100vw - 16px);right:8px;bottom:78px}
  .oc-btn{bottom:16px;right:16px}
}

/* ── EWU ANIMATED BADGE ── */
.ewu-svg-main{animation:ewu-glow-breath 4s ease-in-out infinite}
@keyframes ewu-glow-breath{
  0%,100%{filter:drop-shadow(0 0 12px rgba(0,100,200,.22))}
  50%{filter:drop-shadow(0 0 44px rgba(0,229,255,.75)) drop-shadow(0 0 88px rgba(0,80,200,.3))}
}
.ewu-arc{animation:ewu-arc-flicker 2.8s ease-in-out infinite}
@keyframes ewu-arc-flicker{
  0%,100%{opacity:.88}
  7%{opacity:1;filter:brightness(2.3)}8%{opacity:.35;filter:brightness(.4)}
  22%{opacity:.93;filter:brightness(1.5)}50%{opacity:.82}
  63%{opacity:1;filter:brightness(2.5)}64%{opacity:.25;filter:brightness(.32)}
  80%{opacity:.91}
}
.ewu-ring-rot{animation:ewu-ring-spin 38s linear infinite;transform-origin:160px 160px}
@keyframes ewu-ring-spin{to{transform:rotate(360deg)}}
@keyframes ewu-sp1{0%{opacity:1;transform:translate(0,0) scale(1)}100%{opacity:0;transform:translate(22px,-30px) scale(0)}}
@keyframes ewu-sp2{0%{opacity:.9;transform:translate(0,0) scale(1)}100%{opacity:0;transform:translate(-20px,-26px) scale(0)}}
@keyframes ewu-sp3{0%{opacity:1;transform:translate(0,0) scale(1)}100%{opacity:0;transform:translate(32px,-12px) scale(0)}}
@keyframes ewu-sp4{0%{opacity:.85;transform:translate(0,0) scale(1)}100%{opacity:0;transform:translate(-28px,-16px) scale(0)}}
@keyframes ewu-sp5{0%{opacity:1;transform:translate(0,0) scale(1)}100%{opacity:0;transform:translate(12px,-36px) scale(0)}}
@keyframes ewu-sp6{0%{opacity:.9;transform:translate(0,0) scale(1)}100%{opacity:0;transform:translate(30px,-6px) scale(0)}}
.ewu-sp1{animation:ewu-sp1 1.1s 0s ease-out infinite;transform-box:fill-box;transform-origin:center}
.ewu-sp2{animation:ewu-sp2 1.3s .4s ease-out infinite;transform-box:fill-box;transform-origin:center}
.ewu-sp3{animation:ewu-sp3 0.9s .7s ease-out infinite;transform-box:fill-box;transform-origin:center}
.ewu-sp4{animation:ewu-sp4 1.5s .2s ease-out infinite;transform-box:fill-box;transform-origin:center}
.ewu-sp5{animation:ewu-sp5 1.0s .9s ease-out infinite;transform-box:fill-box;transform-origin:center}
.ewu-sp6{animation:ewu-sp6 1.2s .5s ease-out infinite;transform-box:fill-box;transform-origin:center}
@keyframes ewu-smoke-a{0%{opacity:.14;transform:translateY(0) scaleX(1)}100%{opacity:0;transform:translateY(-24px) scaleX(1.7)}}
@keyframes ewu-smoke-b{0%{opacity:.10;transform:translateY(0) scaleX(1)}100%{opacity:0;transform:translateY(-18px) scaleX(1.5)}}
.ewu-smoke1{animation:ewu-smoke-a 3.2s 0s ease-out infinite;transform-box:fill-box;transform-origin:center bottom}
.ewu-smoke2{animation:ewu-smoke-b 2.8s .9s ease-out infinite;transform-box:fill-box;transform-origin:center bottom}
.ewu-mini{display:inline-flex;align-items:center;justify-content:center;vertical-align:middle;flex-shrink:0;animation:ewu-mini-pulse 2.5s ease-in-out infinite}
@keyframes ewu-mini-pulse{0%,100%{filter:drop-shadow(0 0 2px rgba(0,140,220,.5))}50%{filter:drop-shadow(0 0 9px rgba(0,229,255,.95))}}
/* ROLE CARDS WITH PHOTO BG */
.e-role-card{position:relative;overflow:hidden;border:1px solid rgba(0,229,255,.2)!important}
.e-role-card-bg{position:absolute;inset:0;background-size:cover;background-position:center;transition:transform .45s cubic-bezier(.16,1,.3,1);z-index:0}
.e-role-card:hover .e-role-card-bg{transform:scale(1.07)}
.e-role-card-overlay{position:absolute;inset:0;z-index:1;background:linear-gradient(165deg,rgba(8,14,36,.75) 0%,rgba(4,8,22,.88) 100%)}
.e-role-card-content{position:relative;z-index:2}
.e-pg.pg-dark .e-role-card h3{color:#e8f2ff!important}
.e-pg.pg-dark .e-role-card p{color:rgba(180,210,255,.82)!important}

/* ══ PAGE THEME VARS ══ */
.e-pg{
  --bg-soft:#f5f5f7;--bg-panel:#ffffff;--text-main:#1d1d1f;--text-muted:#6e6e73;
  --union-blue:#0066cc;--welding-flash:#0066cc;--border:rgba(0,0,0,.07);
  --nav-bg:rgba(255,255,255,.82);--badge-bg:rgba(255,255,255,.96);
  --card-bg:#ffffff;--btn-border:transparent;--hero-desc-color:#3a3a3c;
  background:#f5f5f7;
}

/* ══ HERO OVERLAY (shared) ══ */
.e-hero-overlay{
  position:absolute;inset:0;z-index:2;pointer-events:none;
  transition:opacity .5s;
}
.e-hero-inner{position:relative;z-index:3;text-align:center;max-width:1000px;width:100%;padding:0 1.5rem}

/* ── Light hero ── */
.e-pg:not(.pg-dark) .e-hero-overlay{
  background:linear-gradient(180deg,rgba(248,248,252,.91) 0%,rgba(244,244,248,.86) 100%);
}
.e-pg:not(.pg-dark) .e-hero::before{
  opacity:.2;filter:brightness(1.1) contrast(.82) saturate(.45);
}

/* ── Light sections ── */
.e-pg:not(.pg-dark) .e-section{
  background:#f5f5f7;color:#1d1d1f;border-top:1px solid rgba(0,0,0,.06);
}
.e-pg:not(.pg-dark) .e-section::before{display:none}
.e-pg:not(.pg-dark) .e-section-alt{
  background:#ffffff;color:#1d1d1f;border-top:1px solid rgba(0,0,0,.06);
}
.e-pg:not(.pg-dark) .e-section-alt::before{display:none}
.e-pg:not(.pg-dark) .e-about{background:#ffffff}

/* ── Light role cards ── */
.e-pg:not(.pg-dark) .e-role-card{border:1px solid rgba(0,0,0,.09)!important;box-shadow:0 4px 20px rgba(0,0,0,.08)}
.e-pg:not(.pg-dark) .e-role-card:hover{box-shadow:0 14px 38px rgba(0,102,204,.16)!important;transform:translateY(-5px)}
.e-pg:not(.pg-dark) .e-role-card-overlay{background:linear-gradient(180deg,rgba(255,255,255,.72) 0%,rgba(248,248,252,.92) 55%,rgba(255,255,255,.97) 100%)}
.e-pg:not(.pg-dark) .e-role-card h3{color:#1d1d1f!important;text-shadow:none!important}
.e-pg:not(.pg-dark) .e-role-card p{color:#3a3a3c!important;text-shadow:none!important}

/* ══ DARK (SPACE SCREENSAVER) ══ */
.e-pg.pg-dark{
  --bg-soft:#000008;--bg-panel:rgba(8,12,40,.86);--text-main:#e8f0ff;--text-muted:#7080a0;
  --union-blue:#00e5ff;--welding-flash:#00e5ff;--border:rgba(0,200,255,.12);
  --nav-bg:rgba(0,3,20,.82);--badge-bg:rgba(0,5,25,.78);
  --card-bg:rgba(6,10,30,.9);--btn-border:transparent;--hero-desc-color:#b8d0ff;
  background:
    radial-gradient(ellipse at 50% 0%,#0d1b4e 0%,#050815 42%,#000008 100%) fixed,
    radial-gradient(ellipse at 85% 100%,rgba(80,5,120,.4) 0%,transparent 48%) fixed,
    radial-gradient(ellipse at 8% 58%,rgba(0,40,130,.32) 0%,transparent 48%) fixed;
}

/* Dark hero */
.e-pg.pg-dark .e-hero{
  background-image:none;
  background:radial-gradient(ellipse at 50% 30%,#0d1b4e 0%,#030818 55%,#000008 100%);
}
.e-pg.pg-dark .e-hero::before{
  background-image:url('https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?auto=format&fit=crop&w=1920&q=95');
  filter:brightness(.18) contrast(.88) saturate(.45) hue-rotate(200deg);
  opacity:1;
}
.e-pg.pg-dark .e-hero-overlay{
  background:
    radial-gradient(1.5px 1.5px at 8% 12%,rgba(255,255,255,.9) 0%,transparent 100%),
    radial-gradient(1px 1px at 22% 8%,rgba(255,255,255,.7) 0%,transparent 100%),
    radial-gradient(2px 2px at 58% 5%,rgba(255,255,255,.95) 0%,transparent 100%),
    radial-gradient(1px 1px at 86% 14%,rgba(255,255,255,.75) 0%,transparent 100%),
    radial-gradient(1.5px 1.5px at 44% 22%,rgba(255,255,255,.8) 0%,transparent 100%),
    radial-gradient(1px 1px at 72% 32%,rgba(255,255,255,.65) 0%,transparent 100%),
    radial-gradient(2px 2px at 18% 42%,rgba(200,210,255,.85) 0%,transparent 100%),
    radial-gradient(1px 1px at 93% 28%,rgba(255,255,255,.7) 0%,transparent 100%),
    radial-gradient(1.5px 1.5px at 36% 52%,rgba(255,255,255,.8) 0%,transparent 100%),
    radial-gradient(1px 1px at 55% 18%,rgba(255,255,255,.6) 0%,transparent 100%),
    radial-gradient(2px 2px at 78% 62%,rgba(180,200,255,.9) 0%,transparent 100%),
    radial-gradient(1px 1px at 12% 75%,rgba(255,255,255,.7) 0%,transparent 100%),
    radial-gradient(1.5px 1.5px at 62% 82%,rgba(255,255,255,.75) 0%,transparent 100%),
    radial-gradient(1px 1px at 28% 88%,rgba(255,255,255,.65) 0%,transparent 100%),
    radial-gradient(2px 2px at 95% 78%,rgba(200,180,255,.85) 0%,transparent 100%),
    radial-gradient(1px 1px at 48% 95%,rgba(255,255,255,.55) 0%,transparent 100%),
    radial-gradient(2px 2px at 15% 24%,rgba(220,220,255,.8) 0%,transparent 100%),
    radial-gradient(1px 1px at 68% 48%,rgba(255,255,255,.6) 0%,transparent 100%),
    radial-gradient(1.5px 1.5px at 3% 65%,rgba(255,255,255,.72) 0%,transparent 100%),
    radial-gradient(2px 2px at 82% 92%,rgba(200,220,255,.8) 0%,transparent 100%),
    radial-gradient(ellipse at 40% 45%,rgba(0,50,180,.28) 0%,transparent 50%),
    radial-gradient(ellipse at 80% 25%,rgba(80,0,180,.18) 0%,transparent 40%),
    radial-gradient(ellipse at 15% 80%,rgba(0,30,120,.2) 0%,transparent 40%),
    linear-gradient(to bottom,rgba(0,0,20,.45) 0%,rgba(0,0,10,.25) 100%);
  animation:nebula-breathe 8s ease-in-out infinite;
}
@keyframes nebula-breathe{0%,100%{opacity:.82}50%{opacity:1}}

/* Dark sections */
.e-pg.pg-dark .e-section,.e-pg.pg-dark .e-section-alt{
  background:transparent;color:#e8f0ff;border-top-color:rgba(0,229,255,.08);
}
.e-pg.pg-dark .e-section::before,.e-pg.pg-dark .e-section-alt::before{display:block}
.e-pg.pg-dark .e-about{background:rgba(3,5,20,.95);border-top-color:rgba(0,229,255,.08)}
.e-pg.pg-dark .e-footer{background:rgba(2,3,14,.98)}

/* Dark role cards */
.e-pg.pg-dark .e-role-card-overlay{background:linear-gradient(165deg,rgba(8,14,36,.75) 0%,rgba(4,8,22,.88) 100%)}
.e-pg.pg-dark .e-role-card h3{color:#e8f2ff!important}
.e-pg.pg-dark .e-role-card p{color:rgba(180,210,255,.82)!important}
.e-pg.pg-dark .e-role-card{border:1px solid rgba(0,229,255,.2)!important}
.e-pg.pg-dark .e-role-card:hover{box-shadow:0 20px 40px rgba(0,229,255,.25)!important}

/* Dark weld gradient */
.e-pg.pg-dark .e-weld{
  background:linear-gradient(90deg,#c8deff 0%,#00e5ff 40%,#ffffff 50%,#00e5ff 60%,#c8deff 100%);
  background-size:200% auto;-webkit-background-clip:text;background-clip:text;
}

/* ══ THEME TOGGLE BUTTON ══ */
.e-theme-btn{
  width:34px;height:34px;border-radius:50%;
  border:1.5px solid var(--border);background:var(--bg-panel);
  cursor:pointer;display:flex;align-items:center;justify-content:center;
  transition:all .22s;flex-shrink:0;color:var(--text-main);
  box-shadow:0 2px 8px rgba(0,0,0,.06);
}
.e-theme-btn:hover{transform:scale(1.12);border-color:var(--union-blue)}


/* ══ EXIT POPUP ══ */
.e-exit-overlay{
  position:fixed;inset:0;z-index:2000;
  background:rgba(0,0,0,.65);backdrop-filter:blur(6px);
  display:flex;align-items:center;justify-content:center;padding:20px;
  animation:fade-in .25s ease;
}
@keyframes fade-in{from{opacity:0}to{opacity:1}}
.e-exit-box{
  background:var(--bg-panel);border:1px solid var(--border);
  border-radius:20px;max-width:420px;width:100%;padding:2.2rem;
  position:relative;box-shadow:0 20px 60px rgba(0,0,0,.35);
  animation:pop-in .3s cubic-bezier(.16,1,.3,1) both;
}
@keyframes pop-in{from{opacity:0;transform:scale(.9)}to{opacity:1;transform:none}}
.e-exit-close{
  position:absolute;top:14px;right:14px;
  background:none;border:none;cursor:pointer;
  color:var(--text-muted);font-size:1.3rem;line-height:1;
  width:28px;height:28px;display:flex;align-items:center;justify-content:center;
  border-radius:50%;transition:background .18s;
}
.e-exit-close:hover{background:rgba(0,0,0,.08)}
.e-exit-emoji{font-size:2.2rem;margin-bottom:.6rem}
.e-exit-title{font-size:1.3rem;font-weight:800;color:var(--text-main);margin-bottom:.4rem}
.e-exit-sub{font-size:.9rem;color:var(--text-muted);margin-bottom:1.2rem;line-height:1.5}
.e-exit-row{display:flex;gap:8px}
.e-exit-inp{
  flex:1;padding:11px 14px;border-radius:10px;
  border:1.5px solid var(--border);background:var(--bg-soft);
  color:var(--text-main);font-size:.9rem;outline:none;
  transition:border-color .18s;
}
.e-exit-inp:focus{border-color:var(--union-blue)}
.e-exit-btn{
  padding:11px 18px;border-radius:10px;border:none;
  background:var(--union-blue);color:#fff;font-weight:700;font-size:.88rem;
  cursor:pointer;white-space:nowrap;transition:opacity .18s;
}
.e-exit-btn:hover{opacity:.88}
.e-exit-ok{text-align:center;padding:.8rem 0;color:#16a34a;font-weight:700;font-size:1.05rem}

/* ══ SOCIAL PROOF STRIP ══ */
.e-social-strip{
  display:flex;align-items:center;justify-content:center;gap:1.5rem;
  flex-wrap:wrap;padding:1rem 1.5rem;
  background:var(--bg-panel);border-top:1px solid var(--border);
  border-bottom:1px solid var(--border);
  font-size:.85rem;color:var(--text-muted);
}
.e-social-pill{
  display:flex;align-items:center;gap:.5rem;font-weight:600;color:var(--text-main);
}
.e-social-pill span.num{color:var(--union-blue);font-weight:800;font-size:1rem}

/* ══ FAQ ══ */
.e-faq{padding:5rem 0;background:var(--bg-panel)}
.e-faq-title{text-align:center;font-size:clamp(22px,3vw,36px);font-weight:800;color:var(--text-main);margin-bottom:.5rem}
.e-faq-sub{text-align:center;color:var(--text-muted);margin-bottom:2.5rem;font-size:.95rem}
.e-faq-list{max-width:720px;margin:0 auto;display:flex;flex-direction:column;gap:.75rem}
.e-faq-item{
  border:1px solid var(--border);border-radius:12px;overflow:hidden;
  background:var(--bg-soft);transition:border-color .2s;
}
.e-faq-item.open{border-color:var(--union-blue)}
.e-faq-q{
  width:100%;display:flex;align-items:center;justify-content:space-between;gap:1rem;
  padding:1rem 1.2rem;background:none;border:none;
  text-align:left;cursor:pointer;font-weight:700;font-size:.95rem;color:var(--text-main);
  transition:color .2s;
}
.e-faq-q:hover{color:var(--union-blue)}
.e-faq-chevron{font-size:.75rem;transition:transform .25s;flex-shrink:0;color:var(--union-blue)}
.e-faq-item.open .e-faq-chevron{transform:rotate(180deg)}
.e-faq-a{
  max-height:0;overflow:hidden;transition:max-height .3s ease,padding .3s ease;
  padding:0 1.2rem;color:var(--text-muted);font-size:.9rem;line-height:1.6;
}
.e-faq-item.open .e-faq-a{max-height:300px;padding:0 1.2rem 1.2rem}
/* ── AI ACADEMY (PREMIUM TIER) ── */
.e-academy{padding:8rem 0;position:relative;background:transparent;z-index:2;overflow:hidden}
.e-academy::before{content:'';position:absolute;inset:0;background:radial-gradient(ellipse at 50% 0%, rgba(0,229,255,0.08) 0%, transparent 60%);pointer-events:none}
.e-ac-title{font-size:clamp(2.5rem, 5vw, 3.8rem);font-weight:900;text-align:center;margin-bottom:1rem;letter-spacing:-.03em;
  background:linear-gradient(180deg,#ffffff 0%,#b4d5ff 100%);-webkit-background-clip:text;-webkit-text-fill-color:transparent;
  filter:drop-shadow(0 4px 24px rgba(0,229,255,.25))}
.e-ac-sub{text-align:center;color:var(--text-muted);margin-bottom:5rem;font-size:1.25rem;font-weight:500;max-width:600px;margin-inline:auto}

.e-terms-list{max-width:820px;margin:0 auto;display:flex;flex-direction:column;gap:1.5rem;padding:0 1.5rem}
.e-terms-item{
  display:flex;gap:1.25rem;align-items:flex-start;
  background:rgba(8,12,32,.4);backdrop-filter:blur(24px);-webkit-backdrop-filter:blur(24px);
  border:1px solid rgba(0,229,255,.15);border-radius:20px;padding:1.75rem 2rem;
  box-shadow:0 20px 40px rgba(0,0,0,.4),inset 0 1px 0 rgba(255,255,255,.1);
}
.e-terms-num{
  flex-shrink:0;width:2.75rem;height:2.75rem;border-radius:50%;
  background:linear-gradient(135deg,#00e5ff 0%,#0055ff 100%);
  color:#fff;font-weight:900;font-size:1.1rem;
  display:flex;align-items:center;justify-content:center;
}
.e-terms-body{flex:1}
.e-terms-title2{font-size:1.15rem;font-weight:800;color:#fff;margin-bottom:.5rem}
.e-terms-sub{margin:0;padding-left:1.1rem;color:rgba(180,210,255,.75);font-size:.95rem;line-height:1.7}
.e-terms-sub li{margin-bottom:.25rem}
.e-terms-single{color:rgba(180,210,255,.75);font-size:.95rem;line-height:1.7;margin:0}

/* ── RATES BY COUNTRY ── */
.e-rates{padding:5rem 0;background:transparent;position:relative;z-index:2}
.e-rates-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:1.25rem;max-width:1080px;margin:0 auto;padding:0 1.5rem}
.e-rates-card{
  display:flex;align-items:center;gap:1rem;
  background:rgba(8,12,32,.4);backdrop-filter:blur(24px);-webkit-backdrop-filter:blur(24px);
  border:1px solid rgba(0,229,255,.15);border-radius:18px;padding:1.25rem 1.5rem;
  transition:border-color .3s,transform .3s;
}
.e-rates-card:hover{border-color:rgba(0,229,255,.4);transform:translateY(-4px)}
.e-rates-flag{font-size:2rem;flex-shrink:0}
.e-rates-body{flex:1}
.e-rates-country{font-weight:800;color:#fff;font-size:1.05rem;margin-bottom:.25rem}
.e-rates-rate{color:rgba(180,210,255,.75);font-size:.9rem;line-height:1.5}
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
  socialStrip: string[];
  faqTitle: string; faqSub: string;
  faqItems: { q: string; a: string }[];
  exitTitle: string; exitSub: string; exitPlh: string; exitBtn: string; exitOk: string;
  chatInputPlh: string; chatLeadSaved: string; chatBtnLabel: string;
}
const TRANSLATIONS: Record<LangKey, any> = {
  uk: {
    badge: '',
    h1: 'Європейський Союз Зварювальників',
    heroDesc: 'Європейський Союз Зварювальників (EWU) — міжнародна індустріальна платформа, яка об\'єднує професійних майстрів та провідних роботодавців Європейського Союзу.',
    card1Title: 'Для спеціалістів:',
    card1Desc: 'Офіційне працевлаштування, повний правовий захист, європейське житло та соціальна опіка для вас і вашої сім\'ї.',
    card2Title: 'Для роботодавців:',
    card2Desc: 'Перевірені майстри з європейськими контрактами, документами та атестацією — нуль клопоту та простоїв.',
    workersTitle: 'Професійний захист та опіка',
    workersDesc: "Гарантуємо офіційне працевлаштування, повний правовий захист, супровід з сертифікацією та 100% чесні виплати та правовий захист і підтримку у всіх сферах життя.",
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
    employersDesc: 'Оперативно комплектуємо об\'єкти перевіреними зварювальниками та монтерами з підтвердженою кваліфікацією та готовим пакетом документів.',
    stat1: 'аудиторія',
    stat2: 'офіційні контракти',
    stat3: 'прозорість потоків грошей',
    employersItems: [
      'Сертифіковані майстри методів MIG, MAG, TIG, MMA',
      'Повне адміністрування відряджень, житла та податків',
      'Кожен майстер прибуває з документами, медоглядом та підтвердженим розрядом — нуль адмін-клопоту',
      "Координатор на об'єкті: нуль простоїв та непорозумінь",
      'Гарантована заміна при необхідності',
    ],
    eFormTitle: 'Заповни анкету і ми зв’яжемось з тобою',
    eNamePlh: "Ім'я або назва компанії",
    ePhonePlh: 'Телефон або WhatsApp',
    eEmailPlh: 'Email компанії',
    eMsgPlh: 'Опишіть потребу — кількість майстрів, регіон, строки',
    eBtn: 'Надіслати запит',
    eSendingBtn: 'Надсилання...',
    eSentTitle: 'Запит отримано',
    eSentDesc: 'Координатор зв’яжеться з вами протягом 24 годин.',
    aboutTitle: 'Промислова екосистема EWU',
    aboutP1: 'Європейський Союз Зварювальників (EWU) — міжнародна індустріальна платформа, що об\'єднує професійних майстрів та провідних роботодавців ЄС.',
    aboutP2: 'У довгостроковому партнерстві з проєктом «Компас Міграції» (співзасновник — Олександр Василишин), ми створюємо непорушний соціально-юридичний щит для робітників, захищаючи інтереси їхніх сімей в ЄС.',
    quote: 'Шов ляже ідеально, коли поспішати нікуди. Простота — це складність, яку вже ніхто не помічає.',
    quote2: 'Ми — ті, хто надійним швом поєднує роботодавців із виконавцями!',
    socialStrip: ['аудиторія', 'офіційні контракти', 'відповідь координатора', 'країв ЄС'],
    faqTitle: 'Часті запитання',
    faqSub: 'Відповіді на найпоширеніші питання зварювальників та роботодавців',
    faqItems: [
      { q: 'Які документи потрібні для роботи зварювальником в ЄС?', a: 'Паспорт, диплом або посвідчення зварювальника, медична довідка. EWU допомагає з підтвердженням розряду та міжнародною атестацією — весь процес під нашим супроводом.' },
      { q: 'Чи є офіційне працевлаштування (UoP)?', a: '100% — UoP (Umowa o pracę) або UoZ з повним медичним страхуванням та ZUS. Жодних «сірих» схем. Координатор надає підтвердження до підписання контракту.' },
      { q: 'Скільки заробляє зварювальник у Польщі / ЄС?', a: 'Ставка залежить від країни: у Польщі — 40–45 zł/год (сильні спеціалісти та JDG — 55–85 zł/год), у Німеччині — близько 23 €/год, у Бельгії — 21–45 €/год, у Нідерландах — близько 34 €/год, у Франції — близько 19 €/год, в Англії — близько 14 £/год. Детальна вилка обговорюється з координатором під вашу кваліфікацію та метод зварювання.' },
      { q: 'Як швидко EWU знаходить роботу?', a: 'Координатор зв\'язується протягом 24 годин після заявки. Підбір позиції займає 3–14 робочих днів залежно від методу та регіону.' },
      { q: 'Чи потрібно знати польську або іншу мову?', a: 'Базове розуміння — плюс, але не обов\'язково. На кожному об\'єкті є координатор-перекладач. Мовний бар\'єр не перешкода для початку роботи.' },
      { q: 'Ми — компанія. Як швидко отримати бригаду зварювальників?', a: 'Надішліть запит через форму. Координатор зв\'язується протягом доби, обговорює кількість, методи та терміни. Перша група може прибути вже через 7–14 днів.' },
    ],
    exitTitle: 'Залишайтесь на зв\'язку!',
    exitSub: 'Залиш email або телефон — координатор EWU зв\'яжеться з вами протягом 24 годин з персональною пропозицією.',
    exitPlh: 'Email або телефон WhatsApp',
    exitBtn: 'Надіслати',
    exitOk: '✅ Дякуємо! Координатор зателефонує вам.',
    chatInputPlh: 'Написати...',
    chatLeadSaved: '✓ Заявку збережено — менеджер зв\'яжеться з тобою',
    chatBtnLabel: 'Оракул',
  },
  en: {
    badge: '',
    h1: 'European Welding Union',
    heroDesc: 'European Welding Union (EWU) — an international industrial platform that unites professional welders and leading employers across the EU.',
    card1Title: 'For specialists:',
    card1Desc: 'Official employment, full legal protection, European accommodation and social care for you and your family.',
    card2Title: 'For employers:',
    card2Desc: 'Vetted welders with European contracts, documents and certification — zero hassle and downtime.',
    workersTitle: 'Professional Protection & Care',
    workersDesc: 'We guarantee official employment, full legal protection, certification support, 100% fair payments, and assistance in all areas of life.',
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
    employersDesc: 'We rapidly staff projects with vetted welders and fitters who have certified qualifications and a complete set of documents.',
    stat1: 'audience',
    stat2: 'official contracts',
    stat3: 'money flow transparency',
    employersItems: [
      'Certified MIG, MAG, TIG, MMA welding specialists',
      'Full administration of secondments, housing and taxes',
      'Every master arrives with documents, medical clearance and a certified grade — zero admin overhead',
      'On-site coordinator: zero downtime or misunderstandings',
      'Guaranteed replacement when needed',
    ],
    eFormTitle: 'Fill out the form and we will contact you',
    eNamePlh: 'Name or company name',
    ePhonePlh: 'Phone or WhatsApp',
    eEmailPlh: 'Company email',
    eMsgPlh: 'Describe your need — number of specialists, region, timeline',
    eBtn: 'Send request',
    eSendingBtn: 'Sending...',
    eSentTitle: 'Request received',
    eSentDesc: 'A coordinator will contact you within 24 hours.',
    aboutTitle: 'EWU Industrial Ecosystem',
    aboutP1: 'European Welding Union (EWU) — an international industrial platform uniting professional welders and leading employers across the EU.',
    aboutP2: 'In long-term partnership with the Kompas Migracji project (co-founder — Oleksandr Vasylyshyn), we create an unbreakable social-legal shield for workers, protecting the interests of their families in the EU.',
    quote: 'The weld will lie perfectly when there is no rush. Simplicity is the complexity that no one notices anymore.',
    quote2: 'We are the ones who connect employers and workers with a reliable seam.',
    socialStrip: ['audience', 'official contracts', 'coordinator response', 'EU countries'],
    faqTitle: 'Frequently Asked Questions',
    faqSub: 'Answers to the most common questions from welders and employers',
    faqItems: [
      { q: 'What documents are required to work as a welder in the EU?', a: 'Passport, welding diploma or certificate, medical clearance. EWU assists with grade confirmation and international certification — the entire process is guided by us.' },
      { q: 'Is there official employment (UoP)?', a: '100% — UoP (Umowa o pracę) or UoZ with full medical insurance and ZUS. No grey schemes. The coordinator provides confirmation before signing the contract.' },
      { q: 'How much does a welder earn in Poland / EU?', a: 'Rates vary by country: Poland — PLN 40–45/h typical (strong specialists and JDG — PLN 55–85/h), Germany — about €23/h, Belgium — €21–45/h, Netherlands — about €34/h, France — about €19/h, UK — about £14/h. The exact range is discussed with a coordinator based on your qualification and welding method.' },
      { q: 'How quickly does EWU find work?', a: 'The coordinator contacts you within 24 hours of your application. Position selection takes 3–14 working days depending on method and region.' },
      { q: 'Do I need to know Polish or another language?', a: 'A basic understanding is a plus, but not required. Each site has a coordinator-translator. A language barrier is not an obstacle to starting work.' },
      { q: 'We are a company. How quickly can we get a team of welders?', a: 'Submit a request via the form. The coordinator contacts you within a day, discusses numbers, methods and timelines. The first group can arrive within 7–14 days.' },
    ],
    exitTitle: 'Stay in touch!',
    exitSub: 'Leave your email or phone — EWU coordinator will contact you within 24 hours with a personal offer.',
    exitPlh: 'Email or WhatsApp number',
    exitBtn: 'Send',
    exitOk: '✅ Thank you! A coordinator will call you.',
    chatInputPlh: 'Type a message...',
    chatLeadSaved: '✓ Application saved — a manager will contact you',
    chatBtnLabel: 'Orakul',
  },
  ru: {
    badge: '',
    h1: 'Европейский Союз Сварщиков',
    heroDesc: 'Европейский Союз Сварщиков (EWU) — международная индустриальная платформа, объединяющая профессиональных мастеров и ведущих работодателей Евросоюза.',
    card1Title: 'Для специалистов:',
    card1Desc: 'Официальное трудоустройство, полная правовая защита, европейское жилье и социальная опека для вас и вашей семьи.',
    card2Title: 'Для работодателей:',
    card2Desc: 'Проверенные мастера с европейскими контрактами, документами и аттестацией — ноль хлопот и простоев.',
    workersTitle: 'Профессиональная защита и опека',
    workersDesc: 'Гарантируем официальное трудоустройство, полную правовую защиту, сопровождение при сертификации, 100% честные выплаты и поддержку во всех сферах жизни.',
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
    employersDesc: 'Оперативно комплектуем объекты проверенными сварщиками и монтажниками с подтверждённой квалификацией и готовым пакетом документов.',
    stat1: 'аудитория',
    stat2: 'официальные контракты',
    stat3: 'прозрачность денежных потоков',
    employersItems: [
      'Сертифицированные сварщики методов MIG, MAG, TIG, MMA',
      'Полное администрирование командировок, жилья и налогов',
      'Каждый мастер прибывает с документами, медосмотром и подтверждённым разрядом — ноль административных хлопот',
      'Координатор на объекте: ноль простоев и недоразумений',
      'Гарантированная замена при необходимости',
    ],
    eFormTitle: 'Заполни анкету и мы свяжемся с тобой',
    eNamePlh: 'Имя или название компании',
    ePhonePlh: 'Телефон или WhatsApp',
    eEmailPlh: 'Email компании',
    eMsgPlh: 'Опишите потребность — количество мастеров, регион, сроки',
    eBtn: 'Отправить запрос',
    eSendingBtn: 'Отправка...',
    eSentTitle: 'Запрос получен',
    eSentDesc: 'Координатор свяжется с вами в течение 24 часов.',
    aboutTitle: 'Промышленная экосистема EWU',
    aboutP1: 'Европейский Союз Сварщиков (EWU) — международная индустриальная платформа, объединяющая профессиональных мастеров и ведущих работодателей ЕС.',
    aboutP2: 'В долгосрочном партнёрстве с проектом «Kompas Migracji» (сооснователь — Александр Василишин), мы создаём несокрушимый социально-юридический щит для рабочих, защищая интересы их семей в ЕС.',
    quote: 'Шов ляжет идеально, когда некуда спешить. Простота — это сложность, которую уже никто не замечает.',
    quote2: 'Мы — те, кто надежным швом объединяет работодателей с исполнителями!',
    socialStrip: ['аудитория', 'официальные контракты', 'ответ координатора', 'стран ЕС'],
    faqTitle: 'Часто задаваемые вопросы',
    faqSub: 'Ответы на самые популярные вопросы сварщиков и работодателей',
    faqItems: [
      { q: 'Какие документы нужны для работы сварщиком в ЕС?', a: 'Паспорт, диплом или удостоверение сварщика, медицинская справка. EWU помогает с подтверждением разряда и международной аттестацией — весь процесс под нашим сопровождением.' },
      { q: 'Есть ли официальное трудоустройство (UoP)?', a: '100% — UoP (Umowa o pracę) или UoZ с полным медицинским страхованием и ZUS. Никаких «серых» схем. Координатор предоставляет подтверждение до подписания контракта.' },
      { q: 'Сколько зарабатывает сварщик в Польше / ЕС?', a: 'Ставка зависит от страны: в Польше — 40–45 zł/час (сильные специалисты и JDG — 55–85 zł/час), в Германии — около 23 €/час, в Бельгии — 21–45 €/час, в Нидерландах — около 34 €/час, во Франции — около 19 €/час, в Англии — около 14 £/час. Точная вилка обсуждается с координатором под вашу квалификацию и метод сварки.' },
      { q: 'Как быстро EWU находит работу?', a: 'Координатор связывается в течение 24 часов после заявки. Подбор позиции занимает 3–14 рабочих дней в зависимости от метода и региона.' },
      { q: 'Нужно ли знать польский или другой язык?', a: 'Базовое понимание — плюс, но не обязательно. На каждом объекте есть координатор-переводчик. Языковой барьер не помеха для начала работы.' },
      { q: 'Мы — компания. Как быстро получить бригаду сварщиков?', a: 'Отправьте запрос через форму. Координатор связывается в течение суток, обсуждает количество, методы и сроки. Первая группа может прибыть уже через 7–14 дней.' },
    ],
    exitTitle: 'Оставайтесь на связи!',
    exitSub: 'Оставьте email или телефон — координатор EWU свяжется с вами в течение 24 часов с персональным предложением.',
    exitPlh: 'Email или телефон WhatsApp',
    exitBtn: 'Отправить',
    exitOk: '✅ Спасибо! Координатор позвонит вам.',
    chatInputPlh: 'Написать...',
    chatLeadSaved: '✓ Заявка сохранена — менеджер свяжется с тобой',
    chatBtnLabel: 'Оракул',
  },
  pl: {
    badge: '',
    h1: 'Europejski Związek Spawaczy',
    heroDesc: 'Europejski Związek Spawaczy (EWU) — międzynarodowa platforma przemysłowa, która łączy profesjonalnych mistrzów spawalniczych i wiodących pracodawców Unii Europejskiej.',
    card1Title: 'Dla specjalistów:',
    card1Desc: 'Oficjalne zatrudnienie, pełna ochrona prawna, europejskie zakwaterowanie i opieka społeczna dla ciebie i twojej rodziny.',
    card2Title: 'Dla pracodawców:',
    card2Desc: 'Sprawdzeni spawacze z europejskimi umowami, dokumentami i certyfikacją — zero biurokracji i przestojów.',
    workersTitle: 'Profesjonalna ochrona i wsparcie',
    workersDesc: 'Gwarantujemy oficjalne zatrudnienie, pełną ochronę prawną, wsparcie przy certyfikacji, 100% uczciwe wynagrodzenia oraz wsparcie we wszystkich sferach życia.',
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
    employersDesc: 'Szybko kompletujemy obiekty sprawdzonymi spawaczami i monterami z potwierdzonymi kwalifikacjami i gotowym pakietem dokumentów.',
    stat1: 'audytorium',
    stat2: 'oficjalne kontrakty',
    stat3: 'przejrzystość przepływów pieniężnych',
    employersItems: [
      'Certyfikowani spawacze metodami MIG, MAG, TIG, MMA',
      'Pełna administracja delegacji, zakwaterowania i podatków',
      'Każdy mistrz przybywa z dokumentami, orzeczeniem lekarskim i potwierdzonym stopniem — zero biurokracji',
      'Koordynator na obiekcie: zero przestojów i nieporozumień',
      'Gwarantowana wymiana w razie potrzeby',
    ],
    eFormTitle: 'Wypełnij ankietę i skontaktujemy się z Tobą',
    eNamePlh: 'Imię lub nazwa firmy',
    ePhonePlh: 'Telefon lub WhatsApp',
    eEmailPlh: 'Email firmy',
    eMsgPlh: 'Opisz potrzebę — liczba specjalistów, region, termin',
    eBtn: 'Wyślij zapytanie',
    eSendingBtn: 'Wysyłanie...',
    eSentTitle: 'Zapytanie otrzymane',
    eSentDesc: 'Koordynator skontaktuje się z Tobą w ciągu 24 godzin.',
    aboutTitle: 'Ekosystem przemysłowy EWU',
    aboutP1: 'Europejski Związek Spawaczy (EWU) — międzynarodowa platforma przemysłowa łącząca profesjonalnych spawaczy i wiodących pracodawców w UE.',
    aboutP2: 'W długoterminowym partnerstwie z projektem «Kompas Migracji» (współzałożyciel — Oleksandr Vasylyshyn), tworzymy niezłomną tarczę społeczno-prawną dla pracowników, chroniąc interesy ich rodzin w UE.',
    quote: 'Spoina będzie idealna, gdy nie ma pośpiechu. Prostota to złożoność, której już nikt nie zauważa.',
    quote2: 'Jesteśmy tymi, którzy mocnym szwem łączą pracodawców z wykonawcami!',
    socialStrip: ['audytorium', 'oficjalne kontrakty', 'odpowiedź koordynatora', 'krajów UE'],
    faqTitle: 'Często zadawane pytania',
    faqSub: 'Odpowiedzi na najczęstsze pytania spawaczy i pracodawców',
    faqItems: [
      { q: 'Jakie dokumenty są potrzebne do pracy spawacza w UE?', a: 'Paszport, dyplom lub świadectwo spawacza, zaświadczenie lekarskie. EWU pomaga z potwierdzeniem klasy i certyfikacją międzynarodową — cały proces pod naszą opieką.' },
      { q: 'Czy jest oficjalne zatrudnienie (UoP)?', a: '100% — UoP (Umowa o pracę) lub UoZ z pełnym ubezpieczeniem zdrowotnym i ZUS. Żadnych szarych schematów. Koordynator dostarcza potwierdzenie przed podpisaniem umowy.' },
      { q: 'Ile zarabia spawacz w Polsce / UE?', a: 'Stawka zależy od kraju: w Polsce — 40–45 zł/h (mocni specjaliści i JDG — 55–85 zł/h), w Niemczech — ok. 23 €/h, w Belgii — 21–45 €/h, w Holandii — ok. 34 €/h, we Francji — ok. 19 €/h, w Anglii — ok. 14 £/h. Dokładne widełki omawiane są z koordynatorem na podstawie kwalifikacji i metody spawania.' },
      { q: 'Jak szybko EWU znajduje pracę?', a: 'Koordynator kontaktuje się w ciągu 24 godzin od zgłoszenia. Dobór stanowiska zajmuje 3–14 dni roboczych w zależności od metody i regionu.' },
      { q: 'Czy trzeba znać język polski lub inny?', a: 'Podstawowa znajomość to plus, ale nie jest wymagana. Na każdym obiekcie jest koordynator-tłumacz. Bariera językowa nie jest przeszkodą do rozpoczęcia pracy.' },
      { q: 'Jesteśmy firmą. Jak szybko możemy otrzymać brygadę spawaczy?', a: 'Wyślij zapytanie przez formularz. Koordynator kontaktuje się w ciągu jednego dnia, omawia liczbę, metody i terminy. Pierwsza grupa może przybyć już po 7–14 dniach.' },
    ],
    exitTitle: 'Pozostań w kontakcie!',
    exitSub: 'Zostaw email lub telefon — koordynator EWU skontaktuje się z Tobą w ciągu 24 godzin z indywidualną ofertą.',
    exitPlh: 'Email lub numer WhatsApp',
    exitBtn: 'Wyślij',
    exitOk: '✅ Dziękujemy! Koordynator oddzwoni do Ciebie.',
    chatInputPlh: 'Napisz wiadomość...',
    chatLeadSaved: '✓ Zgłoszenie zapisane — menedżer skontaktuje się z Tobą',
    chatBtnLabel: 'Orakul',
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

  // ── Chat state ──
  interface ChatMsg { role: 'user' | 'assistant'; content: string }
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMsgs, setChatMsgs] = useState<ChatMsg[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const [leadSaved, setLeadSaved] = useState(false);
  const [pageTheme, setPageTheme] = useState<'light'|'dark'>('dark');
  const [exitPopup, setExitPopup] = useState(false);
  const [exitEmail, setExitEmail] = useState('');
  const [exitSent, setExitSent] = useState(false);
  const [faqOpen, setFaqOpen] = useState<number|null>(null);
  const msgsEndRef = useRef<HTMLDivElement>(null);

  const T_TERMS = {
    uk: {
      title: 'Комерційні умови співпраці', sub: 'Прозорі умови для компаній, які замовляють персонал через EWU',
      items: [
        { title: 'Вартість послуги', lines: ['перший працівник — 2 500 zł нетто', 'другий працівник — 2 500 zł нетто', 'третій і кожний наступний — 5 000 zł нетто'] },
        { title: 'Момент виникнення оплати', lines: ['рахунок виставляється після 3 календарних днів роботи працівника'] },
        { title: 'Термін оплати', lines: ['стандартний термін — 7 днів від дати виставлення рахунку'] },
        { title: 'Знижки', lines: ['можливі знижки при комплексному підборі персоналу (повний комплект працівників)'] },
        { title: 'Гарантія', lines: ['гарантія на працівника — 30 календарних днів', 'якщо працівник самостійно залишає роботу або не проходить випробувальний термін протягом 30 днів, виконавець одноразово надає безкоштовну заміну'] },
      ],
    },
    pl: {
      title: 'Komercyjne warunki współpracy', sub: 'Przejrzyste warunki dla firm zamawiających personel przez EWU',
      items: [
        { title: 'Koszt usługi', lines: ['pierwszy pracownik — 2 500 zł netto', 'drugi pracownik — 2 500 zł netto', 'trzeci i każdy kolejny — 5 000 zł netto'] },
        { title: 'Moment powstania płatności', lines: ['faktura wystawiana jest po 3 dniach kalendarzowych pracy pracownika'] },
        { title: 'Termin płatności', lines: ['standardowy termin — 7 dni od daty wystawienia faktury'] },
        { title: 'Rabaty', lines: ['możliwe rabaty przy kompleksowej obsłudze kompletu personelu'] },
        { title: 'Gwarancja', lines: ['gwarancja na pracownika — 30 dni kalendarzowych', 'jeśli pracownik samodzielnie odejdzie z pracy lub nie przejdzie okresu próbnego w ciągu 30 dni, wykonawca jednorazowo zapewnia bezpłatne zastępstwo'] },
      ],
    },
    ru: {
      title: 'Коммерческие условия сотрудничества', sub: 'Прозрачные условия для компаний-заказчиков персонала через EWU',
      items: [
        { title: 'Стоимость услуги', lines: ['первый работник — 2 500 zł нетто', 'второй работник — 2 500 zł нетто', 'третий и каждый следующий — 5 000 zł нетто'] },
        { title: 'Момент возникновения оплаты', lines: ['счёт выставляется после 3 календарных дней работы сотрудника'] },
        { title: 'Срок оплаты', lines: ['стандартный срок — 7 дней от даты выставления счёта'] },
        { title: 'Скидки', lines: ['возможны скидки при комплексном подборе персонала (полный комплект работников)'] },
        { title: 'Гарантия', lines: ['гарантия на работника — 30 календарных дней', 'если работник самостоятельно покидает работу или не проходит испытательный срок в течение 30 дней, исполнитель один раз бесплатно предоставляет замену'] },
      ],
    },
    en: {
      title: 'Commercial Terms of Cooperation', sub: 'Transparent terms for companies ordering staff through EWU',
      items: [
        { title: 'Service cost', lines: ['first worker — PLN 2,500 net', 'second worker — PLN 2,500 net', 'third and each subsequent worker — PLN 5,000 net'] },
        { title: 'When payment is due', lines: ["the invoice is issued after 3 calendar days of the worker's employment"] },
        { title: 'Payment term', lines: ['standard term — 7 days from the invoice date'] },
        { title: 'Discounts', lines: ['possible discounts for full-team staffing (a complete set of personnel)'] },
        { title: 'Guarantee', lines: ["30 calendar days' guarantee per worker", 'if a worker voluntarily leaves or fails the probation period within 30 days, the contractor provides one free replacement'] },
      ],
    },
  }[lang] || {
    title: 'Комерційні умови співпраці', sub: 'Прозорі умови для компаній, які замовляють персонал через EWU',
    items: [
      { title: 'Вартість послуги', lines: ['перший працівник — 2 500 zł нетто', 'другий працівник — 2 500 zł нетто', 'третій і кожний наступний — 5 000 zł нетто'] },
      { title: 'Момент виникнення оплати', lines: ['рахунок виставляється після 3 календарних днів роботи працівника'] },
      { title: 'Термін оплати', lines: ['стандартний термін — 7 днів від дати виставлення рахунку'] },
      { title: 'Знижки', lines: ['можливі знижки при комплексному підборі персоналу (повний комплект працівників)'] },
      { title: 'Гарантія', lines: ['гарантія на працівника — 30 календарних днів', 'якщо працівник самостійно залишає роботу або не проходить випробувальний термін протягом 30 днів, виконавець одноразово надає безкоштовну заміну'] },
    ],
  };

  const T_RATES = {
    uk: {
      title: 'Орієнтовні ставки по країнах ЄС', sub: 'За відповідями нашої аудиторії зварювальників',
      rows: [
        { flag: '🇵🇱', country: 'Польща', rate: '40–45 zł/год — типова ставка, 55–85 zł/год — сильні спеціалісти або JDG' },
        { flag: '🇩🇪', country: 'Німеччина', rate: 'близько 23 €/год' },
        { flag: '🇧🇪', country: 'Бельгія', rate: 'близько 21–45 €/год (залежно від форми роботи)' },
        { flag: '🇳🇱', country: 'Нідерланди', rate: 'близько 34 €/год' },
        { flag: '🇫🇷', country: 'Франція', rate: 'близько 19 €/год' },
        { flag: '🇬🇧', country: 'Англія', rate: 'близько 14 £/год' },
      ],
    },
    pl: {
      title: 'Orientacyjne stawki w krajach UE', sub: 'Na podstawie odpowiedzi naszej społeczności spawaczy',
      rows: [
        { flag: '🇵🇱', country: 'Polska', rate: '40–45 zł/h — typowa stawka, 55–85 zł/h — mocni specjaliści lub JDG' },
        { flag: '🇩🇪', country: 'Niemcy', rate: 'ok. 23 €/h' },
        { flag: '🇧🇪', country: 'Belgia', rate: 'ok. 21–45 €/h (zależnie od formy pracy)' },
        { flag: '🇳🇱', country: 'Holandia', rate: 'ok. 34 €/h' },
        { flag: '🇫🇷', country: 'Francja', rate: 'ok. 19 €/h' },
        { flag: '🇬🇧', country: 'Anglia', rate: 'ok. 14 £/h' },
      ],
    },
    ru: {
      title: 'Ориентировочные ставки по странам ЕС', sub: 'По ответам нашей аудитории сварщиков',
      rows: [
        { flag: '🇵🇱', country: 'Польша', rate: '40–45 zł/час — типовая ставка, 55–85 zł/час — сильные специалисты или JDG' },
        { flag: '🇩🇪', country: 'Германия', rate: 'около 23 €/час' },
        { flag: '🇧🇪', country: 'Бельгия', rate: 'около 21–45 €/час (в зависимости от формы работы)' },
        { flag: '🇳🇱', country: 'Нидерланды', rate: 'около 34 €/час' },
        { flag: '🇫🇷', country: 'Франция', rate: 'около 19 €/час' },
        { flag: '🇬🇧', country: 'Англия', rate: 'около 14 £/час' },
      ],
    },
    en: {
      title: 'Estimated Rates Across the EU', sub: 'Based on our welder community survey',
      rows: [
        { flag: '🇵🇱', country: 'Poland', rate: 'PLN 40–45/h typical, PLN 55–85/h for strong specialists or JDG' },
        { flag: '🇩🇪', country: 'Germany', rate: 'about €23/h' },
        { flag: '🇧🇪', country: 'Belgium', rate: 'about €21–45/h (depending on work form)' },
        { flag: '🇳🇱', country: 'Netherlands', rate: 'about €34/h' },
        { flag: '🇫🇷', country: 'France', rate: 'about €19/h' },
        { flag: '🇬🇧', country: 'UK', rate: 'about £14/h' },
      ],
    },
  }[lang] || {
    title: 'Орієнтовні ставки по країнах ЄС', sub: 'За відповідями нашої аудиторії зварювальників',
    rows: [
      { flag: '🇵🇱', country: 'Польща', rate: '40–45 zł/год — типова ставка, 55–85 zł/год — сильні спеціалісти або JDG' },
      { flag: '🇩🇪', country: 'Німеччина', rate: 'близько 23 €/год' },
      { flag: '🇧🇪', country: 'Бельгія', rate: 'близько 21–45 €/год (залежно від форми роботи)' },
      { flag: '🇳🇱', country: 'Нідерланди', rate: 'близько 34 €/год' },
      { flag: '🇫🇷', country: 'Франція', rate: 'близько 19 €/год' },
      { flag: '🇬🇧', country: 'Англія', rate: 'близько 14 £/год' },
    ],
  };

  const GREET: Record<LangKey, string> = {
    uk: 'Привіт! Я — Оракул ⟁\n\nОпераційний розум мережі EWU для зварювальників і роботодавців.\n\nТи шукаєш роботу чи підбираєш персонал?',
    ru: 'Привет! Я — Оракул ⟁\n\nОперативный разум сети EWU.\n\nТы ищешь работу или подбираешь персонал?',
    pl: 'Cześć! Jestem Orakul ⟁\n\nOperacyjny umysł sieci EWU.\n\nSzukasz pracy czy szukasz personelu?',
    en: "Hi! I'm Orakul ⟁\n\nThe operational intelligence of the EWU network.\n\nAre you looking for work or hiring staff?",
  };

  const openChat = () => {
    if (chatMsgs.length === 0) {
      setChatMsgs([{ role: 'assistant', content: GREET[lang] }]);
    }
    setChatOpen(true);
  };

  useEffect(() => {
    msgsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMsgs, chatLoading]);

  const sendChat = async () => {
    const text = chatInput.trim();
    if (!text || chatLoading) return;
    const newMsgs: ChatMsg[] = [...chatMsgs, { role: 'user', content: text }];
    setChatMsgs(newMsgs);
    setChatInput('');
    setChatLoading(true);
    try {
      const res = await fetch('/api/orakul/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMsgs }),
      });
      if (!res.ok || !res.body) throw new Error('error');
      const reader = res.body.getReader();
      const dec = new TextDecoder();
      let botText = '';
      setChatMsgs(prev => [...prev, { role: 'assistant', content: '' }]);
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const lines = dec.decode(value).split('\n');
        for (const line of lines) {
          if (!line.startsWith('data: ')) continue;
          const raw = line.slice(6);
          if (raw === '[DONE]') continue;
          try {
            const d = JSON.parse(raw);
            if (d.text) {
              botText += d.text;
              const clean = botText
                .replace(/\[КАНДИДАТ_ГОТОВИЙ\][\s\S]*$/, '')
                .replace(/\[РОБОТОДАВЕЦЬ_ГОТОВИЙ\][\s\S]*$/, '')
                .trim();
              setChatMsgs(prev => [...prev.slice(0, -1), { role: 'assistant', content: clean }]);
            }
            if (d.error) {
              setChatMsgs(prev => [...prev.slice(0, -1), { role: 'assistant', content: `⚠️ Помилка: ${d.error}` }]);
            }
            if (d.lead_saved) setLeadSaved(true);
          } catch { /* skip */ }
        }
      }
    } catch {
      setChatMsgs(prev => [...prev, { role: 'assistant', content: '⚠️ Помилка з\'єднання. Спробуй ще раз.' }]);
    } finally {
      setChatLoading(false);
    }
  };

  useEffect(() => {
    let shown = false;
    const handler = (e: MouseEvent) => {
      if (e.clientY <= 0 && !shown && !exitSent) {
        shown = true;
        setTimeout(() => setExitPopup(true), 300);
      }
    };
    document.addEventListener('mouseleave', handler);
    return () => document.removeEventListener('mouseleave', handler);
  }, [exitSent]);

  const submitExitEmail = async () => {
    if (!exitEmail.trim()) return;
    try {
      await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          first_name: 'Анонім',
          contact: exitEmail.trim(),
          email: exitEmail.trim(),
          service: 'EWU — Exit Intent',
          situation: 'Лід з exit-intent popup на сторінці Оракул',
          source: 'orakul-exit',
        }),
      });
    } catch { /* show success regardless */ }
    setExitSent(true);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const W = 300, H = 300;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    ctx.scale(dpr, dpr);
    const c = ctx;

    const stars = Array.from({ length: 14 }, (_, i) => ({
      angle: (i * Math.PI * 2) / 14,
      speed: 0.006,
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
      c.fill();
    }

    let raf: number;
    function animate() {
      c.clearRect(0, 0, W, H);
      const cx = W / 2, cy = H / 2, rx = 142, ry = 46, tilt = -0.18;
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
    // Cursor-follow effect is meaningless on touch and was a real perf cost
    // (full-screen canvas + per-particle glow) on phones with no mouse to drive it.
    if (typeof window.matchMedia === 'function' && window.matchMedia('(pointer: coarse)').matches) return;
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
        c.arc(p.x, p.y, p.r * t, 0, Math.PI * 2); c.fill();
      }
      c.globalCompositeOperation = 'source-over';
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
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Service",
        "name": "European Welding Union — EWU",
        "description": "Міжнародна платформа працевлаштування зварювальників в ЄС. Офіційні контракти, правовий захист, сертифікація.",
        "provider": { "@type": "Organization", "name": "Kompas Migracji", "url": "https://www.kompasmigracji.com" },
        "areaServed": "EU",
        "serviceType": "Recruitment",
        "mainEntityOfPage": "https://www.kompasmigracji.com/uk/orakul",
        "potentialAction": { "@type": "ReserveAction", "target": "https://www.kompasmigracji.com/uk/orakul#workers" },
        "faq": [
          { "@type": "Question", "name": "Чи є офіційне працевлаштування?", "acceptedAnswer": { "@type": "Answer", "text": "100% UoP або UoZ з повним медичним страхуванням та ZUS." } },
          { "@type": "Question", "name": "Скільки заробляє зварювальник у Польщі?", "acceptedAnswer": { "@type": "Answer", "text": "У Польщі — 40–45 zł/год типова ставка, сильні спеціалісти та JDG — 55–85 zł/год." } },
          { "@type": "Question", "name": "Як швидко EWU знаходить роботу?", "acceptedAnswer": { "@type": "Answer", "text": "Координатор зв'язується протягом 24 годин після заявки." } },
        ],
      })}} />

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
          {/* Mini EWU icon gradients — shared across all mini icons */}
          <radialGradient id="mi-bg" cx="38%" cy="28%" r="82%">
            <stop offset="0%" stopColor="#1a2a50"/>
            <stop offset="100%" stopColor="#060912"/>
          </radialGradient>
          <linearGradient id="mi-ring" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#60a5fa"/>
            <stop offset="50%" stopColor="#00e5ff"/>
            <stop offset="100%" stopColor="#1d4ed8"/>
          </linearGradient>
          <linearGradient id="mi-txt" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#f0f9ff"/>
            <stop offset="40%" stopColor="#ffffff"/>
            <stop offset="100%" stopColor="#93c5fd"/>
          </linearGradient>
          <radialGradient id="mi-arc" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9"/>
            <stop offset="40%" stopColor="#00e5ff" stopOpacity="0.6"/>
            <stop offset="100%" stopColor="#0040ff" stopOpacity="0"/>
          </radialGradient>
          <filter id="mi-blur" x="-80%" y="-80%" width="260%" height="260%">
            <feGaussianBlur stdDeviation="1.2"/>
          </filter>
        </defs>
      </svg>

      <div className={`e-pg${pageTheme === 'dark' ? ' pg-dark' : ''}`}>

        {/* NAV */}
        <nav className="e-nav">
          <Link href={`/${locale}`} className="e-nav-back">← Kompas Migracji</Link>
          <span className="e-nav-logo" style={{display:'flex',alignItems:'center',gap:'8px'}}>
            <svg width="34" height="34" viewBox="0 0 34 34" fill="none" xmlns="http://www.w3.org/2000/svg" style={{flexShrink:0}}>
              <defs>
                <radialGradient id="nb-bg" cx="38%" cy="28%" r="80%">
                  <stop offset="0%" stopColor="#1a2a50"/>
                  <stop offset="100%" stopColor="#060912"/>
                </radialGradient>
                <linearGradient id="nb-ring" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#60a5fa"/>
                  <stop offset="45%" stopColor="#00e5ff"/>
                  <stop offset="100%" stopColor="#1d4ed8"/>
                </linearGradient>
                <linearGradient id="nb-txt" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#f0f9ff"/>
                  <stop offset="50%" stopColor="#ffffff"/>
                  <stop offset="100%" stopColor="#93c5fd"/>
                </linearGradient>
                <radialGradient id="nb-glow" cx="50%" cy="5%" r="70%">
                  <stop offset="0%" stopColor="#00e5ff" stopOpacity="0.6"/>
                  <stop offset="100%" stopColor="#00e5ff" stopOpacity="0"/>
                </radialGradient>
                <filter id="nb-tf" x="-20%" y="-30%" width="140%" height="160%">
                  <feDropShadow dx="0" dy="0" stdDeviation="0.7" floodColor="#00e5ff" floodOpacity="0.5"/>
                </filter>
                <clipPath id="nb-clip">
                  <circle cx="17" cy="17" r="15.5"/>
                </clipPath>
              </defs>
              <circle cx="17.3" cy="17.4" r="15" fill="rgba(0,0,0,0.25)"/>
              <circle cx="17" cy="17" r="15.5" fill="url(#nb-bg)"/>
              <circle cx="17" cy="17" r="15.5" stroke="url(#nb-ring)" strokeWidth="1.5"/>
              <circle cx="17" cy="17" r="14.2" stroke="#1d4ed8" strokeWidth="0.5" opacity={0.3}/>
              {Array.from({length:16},(_,i)=>{
                const a=(i*Math.PI*2)/16;
                const isM=i%4===0;
                const r2=isM?13.2:14;
                return <line key={i}
                  x1={17+15.5*Math.sin(a)} y1={17-15.5*Math.cos(a)}
                  x2={17+r2*Math.sin(a)} y2={17-r2*Math.cos(a)}
                  stroke={isM?'#00e5ff':'#1d4ed8'}
                  strokeWidth={isM?1:0.6}
                  opacity={isM?0.8:0.3}
                />;
              })}
              <ellipse cx="17" cy="5" rx="12" ry="8" fill="url(#nb-glow)" clipPath="url(#nb-clip)"/>
              <line x1="13.5" y1="5" x2="15.5" y2="13.5" stroke="#2d3f5a" strokeWidth="1" strokeLinecap="round"/>
              <line x1="13.2" y1="3.8" x2="13.8" y2="5.5" stroke="#4a5f7a" strokeWidth="1.5" strokeLinecap="round"/>
              <line x1="20.5" y1="5" x2="18.5" y2="13.5" stroke="#2d3f5a" strokeWidth="1" strokeLinecap="round"/>
              <line x1="20.8" y1="3.8" x2="20.2" y2="5.5" stroke="#4a5f7a" strokeWidth="1.5" strokeLinecap="round"/>
              <path d="M15,13.5 L16,11.5 L17,13.5 L17.7,11 L18.8,13.5 L19.8,11.5 L21,13.5"
                stroke="#00e5ff" strokeWidth="0.9" fill="none" strokeLinejoin="round"/>
              <circle cx="17" cy="9" r="0.7" fill="#00e5ff" opacity={0.8}/>
              <text x="17" y="22.5" textAnchor="middle"
                fontFamily="'Arial Black',sans-serif"
                fontWeight="900" fontSize="8.5"
                fill="url(#nb-txt)" filter="url(#nb-tf)" letterSpacing="-0.2">EWU</text>
              <line x1="10" y1="26" x2="14.5" y2="26" stroke="#1d4ed8" strokeWidth="0.5" opacity={0.45}/>
              <circle cx="17" cy="26" r="0.6" fill="#00e5ff" opacity={0.6}/>
              <line x1="19.5" y1="26" x2="24" y2="26" stroke="#1d4ed8" strokeWidth="0.5" opacity={0.45}/>
            </svg>
            EWU <span>| European Welding Union</span>
          </span>
          <div style={{display:'flex',gap:'8px',alignItems:'center'}}>
            <div className="e-lang-sw">
              {(['uk','en','ru','pl'] as LangKey[]).map(l => (
                <button key={l} className={`e-lang-btn${lang === l ? ' act' : ''}`} onClick={() => setLang(l)}>
                  {l.toUpperCase()}
                </button>
              ))}
            </div>
            <button
              className="e-theme-btn"
              onClick={() => setPageTheme(t => t === 'light' ? 'dark' : 'light')}
              title={pageTheme === 'light' ? 'Темна тема' : 'Світла тема'}
            >
              {pageTheme === 'light' ? (
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
                </svg>
              ) : (
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <circle cx="12" cy="12" r="5"/>
                  <line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/>
                  <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
                  <line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/>
                  <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
                </svg>
              )}
            </button>
          </div>
        </nav>

        {/* HERO */}
        <section className="e-hero">
          <div className="e-hero-overlay" aria-hidden="true" />
          <div className="e-hero-inner">
            <div className="e-logo-wrap">
              <canvas ref={canvasRef} className="e-logo-canvas" />
              <svg className="ewu-svg-main" width="300" height="300" viewBox="0 0 320 320" fill="none" xmlns="http://www.w3.org/2000/svg" style={{position:'relative',zIndex:2,userSelect:'none'}}>
                <defs>
                  <radialGradient id="ewu-bg-g" cx="35%" cy="25%" r="80%">
                    <stop offset="0%" stopColor="#16223c"/>
                    <stop offset="55%" stopColor="#080e1c"/>
                    <stop offset="100%" stopColor="#030508"/>
                  </radialGradient>
                  <linearGradient id="ewu-ring-g" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#3a5070"/>
                    <stop offset="20%" stopColor="#7090b0"/>
                    <stop offset="50%" stopColor="#b0c8de"/>
                    <stop offset="80%" stopColor="#5a7898"/>
                    <stop offset="100%" stopColor="#2a3c50"/>
                  </linearGradient>
                  {/* 3D steel gradient for EWU text */}
                  <linearGradient id="ewu-steel" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#5a6a78"/>
                    <stop offset="12%" stopColor="#9ab4c8"/>
                    <stop offset="28%" stopColor="#ccdde8"/>
                    <stop offset="42%" stopColor="#eaf2f8"/>
                    <stop offset="50%" stopColor="#ffffff"/>
                    <stop offset="58%" stopColor="#d8e8f4"/>
                    <stop offset="72%" stopColor="#8898a8"/>
                    <stop offset="86%" stopColor="#3e4e5c"/>
                    <stop offset="100%" stopColor="#1c2830"/>
                  </linearGradient>
                  <radialGradient id="ewu-arc-g" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#ffffff"/>
                    <stop offset="22%" stopColor="#a0eeff" stopOpacity="0.95"/>
                    <stop offset="55%" stopColor="#00b4ff" stopOpacity="0.6"/>
                    <stop offset="100%" stopColor="#0030ff" stopOpacity="0"/>
                  </radialGradient>
                  <filter id="ewu-blur3" x="-60%" y="-60%" width="220%" height="220%">
                    <feGaussianBlur stdDeviation="3"/>
                  </filter>
                  <filter id="ewu-blur9" x="-120%" y="-120%" width="340%" height="340%">
                    <feGaussianBlur stdDeviation="9"/>
                  </filter>
                  {/* Bevel/emboss for 3D steel text */}
                  <filter id="ewu-bevel" x="-8%" y="-25%" width="116%" height="150%">
                    <feGaussianBlur in="SourceAlpha" stdDeviation="2.5" result="blur"/>
                    <feSpecularLighting in="blur" surfaceScale="6" specularConstant="0.9" specularExponent="28" lightingColor="#cce8ff" result="spec">
                      <fePointLight x="100" y="40" z="120"/>
                    </feSpecularLighting>
                    <feComposite in="spec" in2="SourceAlpha" operator="in" result="spec2"/>
                    <feBlend in="SourceGraphic" in2="spec2" mode="screen" result="blended"/>
                    <feDropShadow dx="0" dy="5" stdDeviation="5" floodColor="#000820" floodOpacity="0.9" in="blended"/>
                    <feDropShadow dx="0" dy="0" stdDeviation="8" floodColor="#0055cc" floodOpacity="0.45"/>
                  </filter>
                  <clipPath id="ewu-cc">
                    <circle cx="160" cy="160" r="149"/>
                  </clipPath>
                </defs>

                {/* Drop shadow */}
                <circle cx="163" cy="165" r="150" fill="rgba(0,0,0,0.5)"/>
                {/* Background */}
                <circle cx="160" cy="160" r="150" fill="url(#ewu-bg-g)"/>

                <g clipPath="url(#ewu-cc)">
                  {/* ─── WELDER SILHOUETTE ─── */}
                  <g fill="#0b0f16">
                    {/* Helmet dome */}
                    <ellipse cx="110" cy="50" rx="38" ry="22" fill="#0b0f16"/>
                    {/* Helmet main body */}
                    <rect x="72" y="54" width="76" height="40" rx="6" fill="#0b0f16"/>
                    {/* Visor dark glass */}
                    <rect x="77" y="57" width="66" height="33" rx="5" fill="#060a12"/>
                    {/* Visor blue tint */}
                    <rect x="78" y="58" width="64" height="11" rx="3" fill="rgba(0,50,180,0.22)"/>
                    {/* Visor glass highlight */}
                    <line x1="80" y1="62" x2="96" y2="62" stroke="rgba(120,200,255,0.28)" strokeWidth="1.5" strokeLinecap="round"/>
                    {/* Chin guard */}
                    <rect x="79" y="89" width="62" height="16" rx="4" fill="#0b0f16"/>
                    {/* Neck */}
                    <rect x="94" y="103" width="34" height="15" rx="4" fill="#0b0f16"/>
                    {/* Torso */}
                    <rect x="62" y="114" width="108" height="76" rx="12" fill="#0b0f16"/>
                    {/* Right shoulder */}
                    <ellipse cx="166" cy="124" rx="20" ry="15" fill="#0b0f16"/>
                    {/* Left shoulder */}
                    <ellipse cx="70" cy="124" rx="17" ry="15" fill="#0b0f16"/>
                    {/* Right arm + torch (extends toward arc zone) */}
                    <path d="M 172,126 C 182,132 194,140 206,150" stroke="#0b0f16" strokeWidth="24" strokeLinecap="round" fill="none"/>
                    <path d="M 200,146 C 207,152 212,158 216,164" stroke="#0b0f16" strokeWidth="14" strokeLinecap="round" fill="none"/>
                    {/* Torch tip */}
                    <path d="M 214,162 L 220,169" stroke="#0b0f16" strokeWidth="9" strokeLinecap="round"/>
                    {/* Left arm hanging */}
                    <path d="M 62,132 C 52,148 50,166 55,182" stroke="#0b0f16" strokeWidth="18" strokeLinecap="round" fill="none"/>
                    {/* Welding cable back */}
                    <path d="M 220,168 C 226,176 224,186 217,183 C 209,180 204,170 200,164" stroke="#141c28" strokeWidth="4" strokeLinecap="round" fill="none"/>
                  </g>

                  {/* ─── WELD ARC FLASH ─── */}
                  <ellipse cx="218" cy="166" rx="72" ry="60" fill="url(#ewu-arc-g)" className="ewu-arc" filter="url(#ewu-blur9)" opacity="0.5"/>
                  <ellipse cx="218" cy="166" rx="28" ry="22" fill="url(#ewu-arc-g)" className="ewu-arc" filter="url(#ewu-blur9)" opacity="0.85"/>
                  <ellipse cx="218" cy="166" rx="10" ry="8" fill="url(#ewu-arc-g)" className="ewu-arc" filter="url(#ewu-blur3)"/>
                  <circle cx="218" cy="166" r="4.5" fill="#e8f8ff" className="ewu-arc" filter="url(#ewu-blur3)"/>
                  <circle cx="218" cy="166" r="2" fill="#ffffff" className="ewu-arc"/>

                  {/* ─── ORANGE SPARKS ─── */}
                  <g transform="translate(218,166)">
                    <circle r="2.5" fill="#ff8800" className="ewu-sp1"/>
                    <circle r="2" fill="#ffcc44" className="ewu-sp2"/>
                    <circle r="1.5" fill="#ff5500" className="ewu-sp3"/>
                    <circle r="2" fill="#ffaa22" className="ewu-sp4"/>
                    <circle r="1.5" fill="#ffee44" className="ewu-sp5"/>
                    <circle r="2.5" fill="#ff7700" className="ewu-sp6"/>
                  </g>

                  {/* ─── SMOKE ─── */}
                  <ellipse cx="218" cy="150" rx="11" ry="5.5" fill="rgba(90,120,150,0.18)" className="ewu-smoke1"/>
                  <ellipse cx="210" cy="141" rx="8" ry="4" fill="rgba(90,120,150,0.12)" className="ewu-smoke2"/>
                </g>

                {/* ─── OUTER METAL RING ─── */}
                <circle cx="160" cy="160" r="150" stroke="url(#ewu-ring-g)" strokeWidth="7" fill="none"/>
                <circle cx="160" cy="160" r="143" stroke="rgba(60,100,140,0.2)" strokeWidth="0.8" fill="none"/>

                {/* ─── ROTATING TICKS ─── */}
                <g className="ewu-ring-rot">
                  {Array.from({length:64},(_,i)=>{
                    const a=(i*Math.PI*2)/64;
                    const isM=i%16===0,isN=i%8===0&&!isM,isS=i%4===0&&!isN&&!isM;
                    const r2=isM?134:isN?138:isS?141:144;
                    const sw=isM?2.4:isN?1.4:isS?0.8:0.5;
                    const op=isM?0.95:isN?0.55:isS?0.3:0.14;
                    const sc=isM?'#00e5ff':isN?'#4a88c0':'#2a4e70';
                    return <line key={i}
                      x1={160+150*Math.sin(a)} y1={160-150*Math.cos(a)}
                      x2={160+r2*Math.sin(a)} y2={160-r2*Math.cos(a)}
                      stroke={sc} strokeWidth={sw} opacity={op}
                    />;
                  })}
                </g>

                {/* Bolt accents */}
                {Array.from({length:16},(_,i)=>{
                  const a=(i*Math.PI*2)/16;
                  const isB=i%4===0;
                  return <circle key={i}
                    cx={160+150*Math.sin(a)} cy={160-150*Math.cos(a)}
                    r={isB?3.5:2} fill={isB?'#182436':'#0e1828'}
                    stroke={isB?'#3a5878':'#1e3050'} strokeWidth={isB?1.2:0.7}
                  />;
                })}

                {/* ─── 3D STEEL EWU TEXT ─── */}
                {/* Deep shadow layer */}
                <text x="163" y="263" textAnchor="middle"
                  fontFamily="'Arial Black','Impact',sans-serif"
                  fontWeight="900" fontSize="108" fill="#000820"
                  letterSpacing="-4" opacity="0.7">EWU</text>
                {/* Blue glow halo */}
                <text x="160" y="260" textAnchor="middle"
                  fontFamily="'Arial Black','Impact',sans-serif"
                  fontWeight="900" fontSize="108" fill="#0055dd"
                  letterSpacing="-4" filter="url(#ewu-blur9)" className="ewu-arc" opacity="0.5">EWU</text>
                {/* Main 3D steel text with bevel */}
                <text x="160" y="260" textAnchor="middle"
                  fontFamily="'Arial Black','Impact',sans-serif"
                  fontWeight="900" fontSize="108"
                  fill="url(#ewu-steel)"
                  filter="url(#ewu-bevel)"
                  letterSpacing="-4">EWU</text>

                {/* ─── GROUND SYMBOL ─── */}
                <line x1="144" y1="276" x2="176" y2="276" stroke="#1d4ed8" strokeWidth="1.8" opacity={0.55}/>
                <line x1="150" y1="281" x2="170" y2="281" stroke="#1d4ed8" strokeWidth="1.2" opacity={0.4}/>
                <line x1="155" y1="286" x2="165" y2="286" stroke="#1d4ed8" strokeWidth="0.9" opacity={0.28}/>
                <line x1="160" y1="271" x2="160" y2="276" stroke="#1d4ed8" strokeWidth="1.8" opacity={0.55}/>

                {/* ─── SUBTITLE ─── */}
                <text x="160" y="304" textAnchor="middle"
                  fontFamily="'Archivo',system-ui,sans-serif" fontWeight="700" fontSize="7.8"
                  fill="#4a7ab0" letterSpacing="3.5" opacity={0.75}>EUROPEAN WELDING UNION</text>

                <circle cx="160" cy="12" r="2.5" fill="#00e5ff" filter="url(#ewu-blur3)" opacity={0.4}/>
              </svg>
            </div>

            {T.badge ? (
              <div className="e-badge">
                <h2>{T.badge}</h2>
              </div>
            ) : null}

            <h1 className="e-hero-title">
              <span className="e-weld">{T.h1}</span>
            </h1>
            <p className="e-hero-desc">{T.heroDesc}</p>

            <div className="e-role-cards">
              <a href="#workers" className="e-role-card">
                <div className="e-role-card-bg" style={{backgroundImage:"url('https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=800&q=85')"}}/>
                <div className="e-role-card-overlay"/>
                <div className="e-role-card-content">
                  <span className="e-role-icon" style={{display:'block',marginBottom:'.7rem'}}>
                    <svg className="ewu-mini" width="40" height="40" viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="12" r="11" fill="url(#mi-bg)"/>
                      <circle cx="12" cy="12" r="11" stroke="url(#mi-ring)" strokeWidth="1.2" fill="none"/>
                      <ellipse cx="12" cy="8.5" rx="5.5" ry="3.5" fill="url(#mi-arc)" className="ewu-arc" opacity="0.5" filter="url(#mi-blur)"/>
                      <text x="12" y="15.5" textAnchor="middle" fontFamily="'Bebas Neue','Archivo Black',sans-serif" fontWeight="700" fontSize="6" fill="url(#mi-txt)" letterSpacing="-0.3">EWU</text>
                    </svg>
                  </span>
                  <h3>{T.card1Title}</h3>
                  <p>{T.card1Desc}</p>
                </div>
              </a>
              <a href="#employers" className="e-role-card">
                <div className="e-role-card-bg" style={{backgroundImage:"url('https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=800&q=85')"}}/>
                <div className="e-role-card-overlay"/>
                <div className="e-role-card-content">
                  <span className="e-role-icon" style={{display:'block',marginBottom:'.7rem'}}>
                    <svg className="ewu-mini" width="40" height="40" viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="12" r="11" fill="url(#mi-bg)"/>
                      <circle cx="12" cy="12" r="11" stroke="url(#mi-ring)" strokeWidth="1.2" fill="none"/>
                      <ellipse cx="12" cy="8.5" rx="5.5" ry="3.5" fill="url(#mi-arc)" className="ewu-arc" opacity="0.5" filter="url(#mi-blur)"/>
                      <text x="12" y="15.5" textAnchor="middle" fontFamily="'Bebas Neue','Archivo Black',sans-serif" fontWeight="700" fontSize="6" fill="url(#mi-txt)" letterSpacing="-0.3">EWU</text>
                    </svg>
                  </span>
                  <h3>{T.card2Title}</h3>
                  <p>{T.card2Desc}</p>
                </div>
              </a>
            </div>
          </div>
        </section>

        {/* FOR WORKERS */}
        <section id="workers" className="e-section e-section-alt e-section-workers">
          <div className="e-wrap">
            <div className="e-sec-head">
              <div className="e-role-badge e-role-badge-w" style={{display:'inline-flex',alignItems:'center',gap:'.4rem'}}>
                <svg className="ewu-mini" width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="11" fill="url(#mi-bg)"/>
                  <circle cx="12" cy="12" r="11" stroke="url(#mi-ring)" strokeWidth="1.2" fill="none"/>
                  <text x="12" y="15.5" textAnchor="middle" fontFamily="'Arial Black',sans-serif" fontWeight="900" fontSize="6" fill="url(#mi-txt)" letterSpacing="-0.3">EWU</text>
                </svg>
                {T.card1Title}
              </div>
              <h2>{T.workersTitle}</h2>
              <p>{T.workersDesc}</p>
            </div>
            <blockquote className="e-weld-quote">{T.quote}</blockquote>
            <div className="e-grid-2">
              <div>
                <ul className="e-list" style={{ marginTop: '2rem' }}>
                  {T.workersItems.map((item: any, i: number) => <li key={i}>{item}</li>)}
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
          <div className="e-role-strip-w" style={{gap:'.5rem'}}>
            <svg className="ewu-mini" width="16" height="16" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="11" fill="url(#mi-bg)"/>
              <circle cx="12" cy="12" r="11" stroke="url(#mi-ring)" strokeWidth="1.2" fill="none"/>
              <text x="12" y="15.5" textAnchor="middle" fontFamily="'Bebas Neue','Archivo Black',sans-serif" fontWeight="700" fontSize="6" fill="url(#mi-txt)" letterSpacing="-0.3">EWU</text>
            </svg>
            {T.card1Title}
          </div>
          <div className="e-role-strip-mid">
            <div className="e-role-strip-line" />
            <div className="e-role-strip-dot" />
            <div className="e-role-strip-line" />
          </div>
          <div className="e-role-strip-e" style={{gap:'.5rem'}}>
            <svg className="ewu-mini" width="16" height="16" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="11" fill="url(#mi-bg)"/>
              <circle cx="12" cy="12" r="11" stroke="url(#mi-ring)" strokeWidth="1.2" fill="none"/>
              <text x="12" y="15.5" textAnchor="middle" fontFamily="'Bebas Neue','Archivo Black',sans-serif" fontWeight="700" fontSize="6" fill="url(#mi-txt)" letterSpacing="-0.3">EWU</text>
            </svg>
            {T.card2Title}
          </div>
        </div>

        {/* FOR EMPLOYERS */}
        <section id="employers" className="e-section e-section-employers">
          <div className="e-wrap">
            <div className="e-sec-head">
              <div className="e-role-badge e-role-badge-e" style={{display:'inline-flex',alignItems:'center',gap:'.4rem'}}>
                <svg className="ewu-mini" width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="11" fill="url(#mi-bg)"/>
                  <circle cx="12" cy="12" r="11" stroke="url(#mi-ring)" strokeWidth="1.2" fill="none"/>
                  <text x="12" y="15.5" textAnchor="middle" fontFamily="'Arial Black',sans-serif" fontWeight="900" fontSize="6" fill="url(#mi-txt)" letterSpacing="-0.3">EWU</text>
                </svg>
                {T.card2Title}
              </div>
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
                    <div className="e-stat-n">100%</div>
                    <div className="e-stat-l">{T.stat3}</div>
                  </div>
                </div>
                <ul className="e-list">
                  {T.employersItems.map((item: any, i: number) => <li key={i}>{item}</li>)}
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

        {/* ── SOCIAL PROOF STRIP ── */}
        <div className="e-social-strip">
          <div className="e-social-pill">✅ <span className="num">40K+</span> {T.socialStrip[0]}</div>
          <div className="e-social-pill">📋 <span className="num">100%</span> {T.socialStrip[1]}</div>
          <div className="e-social-pill">⚡ <span className="num">24h</span> {T.socialStrip[2]}</div>
          <div className="e-social-pill">🌍 <span className="num">12+</span> {T.socialStrip[3]}</div>
        </div>

        {/* ── COMMERCIAL TERMS ── */}
        <section className="e-academy">
          <div className="e-wrap">
            <h2 className="e-ac-title">{T_TERMS.title}</h2>
            <p className="e-ac-sub">{T_TERMS.sub}</p>
            <div className="e-terms-list">
              {T_TERMS.items.map((item, i) => (
                <div key={i} className="e-terms-item">
                  <div className="e-terms-num">{i + 1}</div>
                  <div className="e-terms-body">
                    <h3 className="e-terms-title2">{item.title}</h3>
                    {item.lines.length > 1 ? (
                      <ul className="e-terms-sub">
                        {item.lines.map((line, j) => <li key={j}>{line}</li>)}
                      </ul>
                    ) : (
                      <p className="e-terms-single">{item.lines[0]}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── RATES BY COUNTRY ── */}
        <section className="e-rates">
          <div className="e-wrap">
            <h2 className="e-ac-title">{T_RATES.title}</h2>
            <p className="e-ac-sub">{T_RATES.sub}</p>
            <div className="e-rates-grid">
              {T_RATES.rows.map((row, i) => (
                <div key={i} className="e-rates-card">
                  <span className="e-rates-flag">{row.flag}</span>
                  <div className="e-rates-body">
                    <div className="e-rates-country">{row.country}</div>
                    <div className="e-rates-rate">{row.rate}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── FAQ ── */}
        <section className="e-faq">
          <div className="e-wrap">
            <h2 className="e-faq-title">{T.faqTitle}</h2>
            <p className="e-faq-sub">{T.faqSub}</p>
            <div className="e-faq-list">
              {T.faqItems.map((item: any, i: number) => (
                <div key={i} className={`e-faq-item${faqOpen === i ? ' open' : ''}`}>
                  <button className="e-faq-q" onClick={() => setFaqOpen(faqOpen === i ? null : i)}>
                    <span>{item.q}</span>
                    <span className="e-faq-chevron">▼</span>
                  </button>
                  <div className="e-faq-a">{item.a}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <footer className="e-footer">
          <p>© 2026 European Welding Union | Partner of «Kompas Migracji»</p>
          <Link href={`/${locale}`}>← kompasmigracji.com</Link>
        </footer>


      </div>

      {exitPopup && (
        <div className="e-exit-overlay" onClick={e => { if (e.target === e.currentTarget) setExitPopup(false); }}>
          <div className="e-exit-box">
            <button className="e-exit-close" onClick={() => setExitPopup(false)}>✕</button>
            {exitSent ? (
              <div className="e-exit-ok">{T.exitOk}</div>
            ) : (
              <>
                <div className="e-exit-emoji">👷</div>
                <div className="e-exit-title">{T.exitTitle}</div>
                <div className="e-exit-sub">{T.exitSub}</div>
                <div className="e-exit-row">
                  <input
                    className="e-exit-inp"
                    type="text"
                    placeholder={T.exitPlh}
                    value={exitEmail}
                    onChange={e => setExitEmail(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && submitExitEmail()}
                  />
                  <button className="e-exit-btn" onClick={submitExitEmail}>{T.exitBtn}</button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* ── WATERMARK ── */}
      <div className="e-wm">
        <span className="e-wm-ico">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="wm-flame" x1="10" y1="18" x2="10" y2="1" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#1d4ed8"/>
                <stop offset="40%" stopColor="#0ea5e9"/>
                <stop offset="100%" stopColor="#00e5ff"/>
              </linearGradient>
              <radialGradient id="wm-core" cx="50%" cy="70%" r="50%">
                <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9"/>
                <stop offset="100%" stopColor="#00e5ff" stopOpacity="0"/>
              </radialGradient>
            </defs>
            {/* Phoenix flame body */}
            <path d="M10 17.5 C7 17.5 4.5 15 4.5 12 C4.5 9.5 6 8 7 7 C6.5 9 7.5 10 8.5 10 C8 8.5 8.5 6 10 3 C10 3 10.5 5.5 11 6.5 C11.8 5 12 3.5 12 3.5 C13.5 5.5 14 8 13.5 10 C14.5 9.5 15 8.5 15 7 C16.5 8.5 16.5 10.5 16.5 12 C16.5 15 14 17.5 10 17.5Z"
              fill="url(#wm-flame)" opacity="0.9"/>
            {/* Inner glow core */}
            <path d="M10 15.5 C8.5 15.5 7 14 7 12.5 C7 11.5 7.5 10.8 8.2 10.5 C8 11.5 8.8 12 9.2 12 C9 11 9.2 9.5 10 8 C10 8 10.5 9.5 10.8 10.5 C11.2 9.8 11.5 9 11.5 8 C12.3 9.2 12.5 10.8 12 12 C12.5 11.8 13 11 13 10.5 C13.8 11.2 13.5 12.5 13 12.5 C13 14 11.5 15.5 10 15.5Z"
              fill="url(#wm-core)" opacity="0.6"/>
            {/* Wing left */}
            <path d="M4.5 10 C3 9 2 7 3 5.5 C3.5 7 5 7.5 5.5 8 C4.5 6.5 5 5 5 5 C6.5 6 7 8 6.5 9.5 C5.8 9.2 5.1 9.4 4.5 10Z"
              fill="#60a5fa" opacity="0.55"/>
            {/* Wing right */}
            <path d="M15.5 10 C17 9 18 7 17 5.5 C16.5 7 15 7.5 14.5 8 C15.5 6.5 15 5 15 5 C13.5 6 13 8 13.5 9.5 C14.2 9.2 14.9 9.4 15.5 10Z"
              fill="#60a5fa" opacity="0.55"/>
          </svg>
        </span>
        <div>
          <div className="e-wm-txt">iPhoenix®</div>
          <div className="e-wm-copy">Design &amp; Dev</div>
        </div>
      </div>

      {/* ── CHAT WIDGET ── */}
      {chatOpen && (
        <div className="oc-panel">
          <div className="oc-head">
            <div className="oc-head-sym" style={{background:'none',border:'none'}}>
              <svg className="ewu-mini" width="30" height="30" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="11" fill="url(#mi-bg)"/>
                <circle cx="12" cy="12" r="11" stroke="url(#mi-ring)" strokeWidth="1.2" fill="none"/>
                <ellipse cx="12" cy="8.5" rx="5" ry="3" fill="url(#mi-arc)" className="ewu-arc" opacity="0.45" filter="url(#mi-blur)"/>
                <text x="12" y="15.5" textAnchor="middle" fontFamily="'Arial Black',sans-serif" fontWeight="900" fontSize="6" fill="url(#mi-txt)" letterSpacing="-0.3">EWU</text>
              </svg>
            </div>
            <div className="oc-head-info">
              <div className="oc-head-name">ОРАКУЛ · EWU</div>
              <div className="oc-head-sub">AI-рекрутинг · зварювальники</div>
            </div>
            <button className="oc-close" onClick={() => setChatOpen(false)}>✕</button>
          </div>

          <div className="oc-msgs">
            {chatMsgs.map((m, i) => (
              <div key={i} className={`oc-msg oc-msg-${m.role}`}>
                {m.role === 'assistant' && (
                  <div className="oc-avatar" style={{background:'none',border:'none',padding:0}}>
                    <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="12" r="11" fill="url(#mi-bg)"/>
                      <circle cx="12" cy="12" r="11" stroke="url(#mi-ring)" strokeWidth="1.2" fill="none"/>
                      <text x="12" y="15.5" textAnchor="middle" fontFamily="'Arial Black',sans-serif" fontWeight="900" fontSize="5.8" fill="url(#mi-txt)" letterSpacing="-0.3">EWU</text>
                    </svg>
                  </div>
                )}
                <div className={`oc-bubble oc-bubble-${m.role}`}>{m.content || ' '}</div>
              </div>
            ))}
            {chatLoading && (
              <div className="oc-msg oc-msg-assistant">
                <div className="oc-avatar" style={{background:'none',border:'none',padding:0}}>
                  <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="11" fill="url(#mi-bg)"/>
                    <circle cx="12" cy="12" r="11" stroke="url(#mi-ring)" strokeWidth="1.2" fill="none"/>
                    <text x="12" y="15.5" textAnchor="middle" fontFamily="'Arial Black',sans-serif" fontWeight="900" fontSize="5.8" fill="url(#mi-txt)" letterSpacing="-0.3">EWU</text>
                  </svg>
                </div>
                <div className="oc-bubble oc-bubble-assistant">
                  <div className="oc-typing">
                    <div className="oc-dot"/><div className="oc-dot"/><div className="oc-dot"/>
                  </div>
                </div>
              </div>
            )}
            {leadSaved && <div className="oc-saved">{T.chatLeadSaved}</div>}
            <div ref={msgsEndRef} />
          </div>

          <div className="oc-input-row">
            <input
              className="oc-input"
              placeholder={T.chatInputPlh}
              value={chatInput}
              onChange={e => setChatInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendChat(); } }}
              disabled={chatLoading}
            />
            <button className="oc-send" onClick={sendChat} disabled={chatLoading || !chatInput.trim()} aria-label="Надіслати">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
              </svg>
            </button>
          </div>
        </div>
      )}

      <button className="oc-btn" onClick={() => chatOpen ? setChatOpen(false) : openChat()} aria-label="Оракул AI чат">
        <span className="oc-btn-dot"/>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" style={{flexShrink:0}}>
          <circle cx="12" cy="12" r="11" fill="url(#mi-bg)"/>
          <circle cx="12" cy="12" r="11" stroke="url(#mi-ring)" strokeWidth="1.2" fill="none"/>
          <ellipse cx="12" cy="8.5" rx="5" ry="3" fill="url(#mi-arc)" className="ewu-arc" opacity="0.5" filter="url(#mi-blur)"/>
          <text x="12" y="15.5" textAnchor="middle" fontFamily="'Arial Black',sans-serif" fontWeight="900" fontSize="5.8" fill="url(#mi-txt)" letterSpacing="-0.3">EWU</text>
        </svg>
        {T.chatBtnLabel}
      </button>
    </>
  );
}
