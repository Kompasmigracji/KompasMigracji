/* Cinematic engine v6 INFINITY — starfield, lightning, hyper transitions */
(function () {
  const deck = document.getElementById('deck');
  const slides = [...document.querySelectorAll('.slide')];
  const progress = document.getElementById('progress');
  const counter = document.getElementById('slide-counter');
  const chapterEl = document.getElementById('chapter-title');
  const sceneEl = document.getElementById('scene-num');
  const flashEl = document.getElementById('wow-flash');
  const shockEl = document.getElementById('shockwave');
  const supernovaEl = document.getElementById('supernova');
  const speedLinesEl = document.getElementById('speed-lines');
  const pulseRingEl = document.getElementById('pulse-ring');
  const canvas = document.getElementById('particles');
  const bokehCanvas = document.getElementById('bokeh');
  const auroraCanvas = document.getElementById('aurora');
  const neuralCanvas = document.getElementById('neural-net');
  const starCanvas = document.getElementById('starfield');
  const lightningCanvas = document.getElementById('lightning');
  const rainCanvas = document.getElementById('data-rain');
  let idx = 0;
  let elapsed = 0;

  setTimeout(() => deck.classList.add('curtains-open'), 150);
  setTimeout(() => deck.classList.add('ui-visible'), 900);
  setTimeout(() => { if (flashEl) flashEl.classList.add('burst'); }, 120);

  if (speedLinesEl) {
    for (let i = 0; i < 14; i++) {
      const line = document.createElement('div');
      line.className = 'speed-line';
      line.style.top = `${8 + i * 6}%`;
      line.style.animationDelay = `${i * 0.04}s`;
      speedLinesEl.appendChild(line);
    }
  }

  /* ── Starfield ── */
  if (starCanvas) {
    const ctx = starCanvas.getContext('2d');
    starCanvas.width = 1920; starCanvas.height = 1080;
    const stars = Array.from({ length: 220 }, () => ({
      x: Math.random() * 1920, y: Math.random() * 1080,
      z: Math.random() * 2 + 0.5, size: Math.random() * 2 + 0.5,
    }));
    function starsDraw() {
      ctx.fillStyle = 'rgba(0,0,0,0.15)'; ctx.fillRect(0, 0, 1920, 1080);
      for (const s of stars) {
        s.z += 0.02; if (s.z > 3) s.z = 0.5;
        const sx = (s.x - 960) * (s.z * 0.5) + 960;
        const sy = (s.y - 540) * (s.z * 0.5) + 540;
        const alpha = Math.min(1, s.z / 2);
        ctx.beginPath(); ctx.arc(sx, sy, s.size * s.z, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(245,230,168,${alpha * 0.7})`; ctx.fill();
      }
      requestAnimationFrame(starsDraw);
    }
    starsDraw();
  }

  /* ── Data rain ── */
  if (rainCanvas) {
    const ctx = rainCanvas.getContext('2d');
    rainCanvas.width = 1920; rainCanvas.height = 1080;
    const cols = Array.from({ length: 40 }, (_, i) => ({
      x: i * 48 + 24, y: Math.random() * 1080, speed: 4 + Math.random() * 8,
      chars: '01∞AIКМШЄ',
    }));
    function rainDraw() {
      ctx.fillStyle = 'rgba(0,0,0,0.08)'; ctx.fillRect(0, 0, 1920, 1080);
      ctx.font = '14px monospace';
      for (const c of cols) {
        c.y += c.speed; if (c.y > 1100) c.y = -20;
        const ch = c.chars[Math.floor(Math.random() * c.chars.length)];
        ctx.fillStyle = `rgba(0,245,255,${0.15 + Math.random() * 0.2})`;
        ctx.fillText(ch, c.x, c.y);
      }
      requestAnimationFrame(rainDraw);
    }
    rainDraw();
  }

  /* ── Lightning burst ── */
  let lightningT = 0;
  function drawLightning() {
    if (!lightningCanvas) return;
    const ctx = lightningCanvas.getContext('2d');
    lightningCanvas.width = 1920; lightningCanvas.height = 1080;
    ctx.clearRect(0, 0, 1920, 1080);
    if (lightningT > 0) {
      lightningT--;
      ctx.strokeStyle = `rgba(0,245,255,${lightningT / 8})`;
      ctx.lineWidth = 2 + Math.random() * 3;
      ctx.shadowColor = '#00f5ff'; ctx.shadowBlur = 20;
      let x = 200 + Math.random() * 1520, y = 0;
      ctx.beginPath(); ctx.moveTo(x, y);
      for (let i = 0; i < 12; i++) {
        x += (Math.random() - 0.5) * 120; y += 80 + Math.random() * 40;
        ctx.lineTo(x, y);
      }
      ctx.stroke();
    }
    requestAnimationFrame(drawLightning);
  }
  drawLightning();

  /* ── Aurora ── */
  if (auroraCanvas) {
    const ctx = auroraCanvas.getContext('2d');
    auroraCanvas.width = 1920; auroraCanvas.height = 1080;
    let t = 0;
    function aurora() {
      t += 0.007;
      ctx.clearRect(0, 0, 1920, 1080);
      for (let i = 0; i < 4; i++) {
        ctx.beginPath();
        for (let x = 0; x <= 1920; x += 6) {
          const y = 180 + i * 60 + Math.sin(x * 0.004 + t + i * 0.5) * 70;
          x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        }
        ctx.lineTo(1920, 1080); ctx.lineTo(0, 1080); ctx.closePath();
        const g = ctx.createLinearGradient(0, 0, 1920, 400);
        const pal = [['rgba(0,245,255,0.06)','rgba(212,175,55,0.04)'],['rgba(165,28,48,0.07)','rgba(0,245,255,0.05)'],['rgba(212,175,55,0.06)','rgba(255,107,157,0.04)'],['rgba(0,245,255,0.04)','rgba(165,28,48,0.03)']];
        g.addColorStop(0, pal[i][0]); g.addColorStop(1, pal[i][1]);
        ctx.fillStyle = g; ctx.fill();
      }
      requestAnimationFrame(aurora);
    }
    aurora();
  }

  /* ── Neural network ── */
  if (neuralCanvas) {
    const ctx = neuralCanvas.getContext('2d');
    neuralCanvas.width = 1920; neuralCanvas.height = 1080;
    const nodes = Array.from({ length: 64 }, () => ({
      x: Math.random() * 1920, y: Math.random() * 1080,
      vx: (Math.random() - 0.5) * 0.5, vy: (Math.random() - 0.5) * 0.5, r: Math.random() * 2.5 + 1,
    }));
    function neural() {
      ctx.clearRect(0, 0, 1920, 1080);
      for (const n of nodes) {
        n.x += n.vx; n.y += n.vy;
        if (n.x < 0 || n.x > 1920) n.vx *= -1;
        if (n.y < 0 || n.y > 1080) n.vy *= -1;
      }
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x, dy = nodes[i].y - nodes[j].y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < 200) {
            ctx.strokeStyle = `rgba(0,245,255,${0.18 * (1 - d / 200)})`;
            ctx.lineWidth = 0.6;
            ctx.beginPath(); ctx.moveTo(nodes[i].x, nodes[i].y); ctx.lineTo(nodes[j].x, nodes[j].y); ctx.stroke();
          }
        }
      }
      for (const n of nodes) {
        ctx.beginPath(); ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(0,245,255,0.6)'; ctx.fill();
      }
      requestAnimationFrame(neural);
    }
    neural();
  }

  function initParticles(canvasEl, count, type) {
    if (!canvasEl) return;
    const ctx = canvasEl.getContext('2d');
    canvasEl.width = 1920; canvasEl.height = 1080;
    const pts = Array.from({ length: count }, () => ({
      x: Math.random() * 1920, y: Math.random() * 1080,
      r: type === 'bokeh' ? Math.random() * 100 + 50 : Math.random() * 3 + 0.5,
      speed: Math.random() * 0.5 + 0.1, alpha: Math.random() * 0.4 + 0.1,
      drift: (Math.random() - 0.5) * 0.4, phase: Math.random() * Math.PI * 2,
    }));
    function draw() {
      ctx.clearRect(0, 0, 1920, 1080);
      for (const p of pts) {
        p.y -= p.speed; p.x += p.drift + Math.sin(p.phase) * 0.25; p.phase += 0.012;
        if (p.y < -100) { p.y = 1180; p.x = Math.random() * 1920; }
        if (type === 'bokeh') {
          const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r);
          g.addColorStop(0, `rgba(212,175,55,${p.alpha * 0.2})`);
          g.addColorStop(1, 'rgba(212,175,55,0)');
          ctx.fillStyle = g; ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.fill();
        } else {
          ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(245,230,168,${p.alpha})`; ctx.fill();
        }
      }
      requestAnimationFrame(draw);
    }
    draw();
  }
  initParticles(canvas, 220, 'dust');
  initParticles(bokehCanvas, 20, 'bokeh');

  function animateCounters(slide) {
    slide.querySelectorAll('[data-count]').forEach((el) => {
      const target = +el.dataset.count;
      const suffix = el.dataset.suffix || '';
      const prefix = el.dataset.prefix || '';
      const dur = 900; const start = performance.now();
      function step(now) {
        const t = Math.min((now - start) / dur, 1);
        el.textContent = prefix + Math.round(target * (1 - Math.pow(1 - t, 4))) + suffix;
        if (t < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    });
  }

  document.querySelectorAll('.slide.finale').forEach((slide) => {
    const burst = document.createElement('div');
    burst.className = 'confetti-burst';
    for (let i = 0; i < 120; i++) {
      const piece = document.createElement('div');
      piece.className = 'confetti-piece';
      piece.style.left = `${Math.random() * 100}%`;
      piece.style.animationDelay = `${Math.random() * 2}s`;
      piece.style.animationDuration = `${1.5 + Math.random() * 2}s`;
      burst.appendChild(piece);
    }
    slide.appendChild(burst);
  });

  function wowTransition() {
    lightningT = 10;
    if (flashEl) { flashEl.classList.remove('burst'); void flashEl.offsetWidth; flashEl.classList.add('burst'); }
    if (shockEl) { shockEl.classList.remove('fire'); void shockEl.offsetWidth; shockEl.classList.add('fire'); }
    if (pulseRingEl) { pulseRingEl.classList.remove('fire'); void pulseRingEl.offsetWidth; pulseRingEl.classList.add('fire'); }
    if (speedLinesEl) { speedLinesEl.classList.add('active'); setTimeout(() => speedLinesEl.classList.remove('active'), 600); }
  }

  function showSlide(i) {
    if (i > 0) wowTransition();
    const isFinale = i === slides.length - 1;
    if (isFinale && supernovaEl) {
      supernovaEl.classList.remove('burst'); void supernovaEl.offsetWidth;
      setTimeout(() => supernovaEl.classList.add('burst'), 300);
    }
    slides.forEach((s, j) => {
      s.classList.toggle('active', j === i);
      s.classList.toggle('exit', j === i - 1);
    });
    const slide = slides[i];
    const total = String(slides.length).padStart(2, '0');
    if (counter) counter.textContent = `${i + 1} / ${slides.length}`;
    if (chapterEl) chapterEl.textContent = slide.dataset.chapter || '';
    if (sceneEl) sceneEl.textContent = `SCENE ${String(i + 1).padStart(2, '0')} — ${total}`;
    setTimeout(() => animateCounters(slide), 200);
    slide.querySelectorAll('.hologram').forEach((el) => {
      el.classList.add('chromatic-burst');
      setTimeout(() => el.classList.remove('chromatic-burst'), 500);
    });
  }

  function tick() {
    const dur = +slides[idx].dataset.ms || 7000;
    elapsed += 100;
    const total = slides.reduce((a, s) => a + (+s.dataset.ms || 7000), 0);
    const before = slides.slice(0, idx).reduce((a, s) => a + (+s.dataset.ms || 7000), 0);
    if (progress) progress.style.width = `${((before + elapsed) / total) * 100}%`;
    if (elapsed >= dur) {
      elapsed = 0; idx++;
      if (idx >= slides.length) idx = slides.length - 1;
      else showSlide(idx);
    }
  }

  showSlide(0);
  setInterval(tick, 100);
  window.VIDEO_DONE_MS = +deck.dataset.totalMs || 73500;
})();
