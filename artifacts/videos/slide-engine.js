/* Cinematic engine v4 — neural net, aurora, WOW transitions */
(function () {
  const deck = document.getElementById('deck');
  const slides = [...document.querySelectorAll('.slide')];
  const progress = document.getElementById('progress');
  const counter = document.getElementById('slide-counter');
  const chapterEl = document.getElementById('chapter-title');
  const sceneEl = document.getElementById('scene-num');
  const flashEl = document.getElementById('wow-flash');
  const shockEl = document.getElementById('shockwave');
  const canvas = document.getElementById('particles');
  const bokehCanvas = document.getElementById('bokeh');
  const auroraCanvas = document.getElementById('aurora');
  const neuralCanvas = document.getElementById('neural-net');
  let idx = 0;
  let elapsed = 0;

  setTimeout(() => deck.classList.add('curtains-open'), 300);
  setTimeout(() => deck.classList.add('ui-visible'), 1600);
  setTimeout(() => { if (flashEl) { flashEl.classList.add('burst'); } }, 200);

  /* ── Aurora borealis ── */
  if (auroraCanvas) {
    const ctx = auroraCanvas.getContext('2d');
    auroraCanvas.width = 1920; auroraCanvas.height = 1080;
    let t = 0;
    function aurora() {
      t += 0.004;
      ctx.clearRect(0, 0, 1920, 1080);
      for (let i = 0; i < 3; i++) {
        ctx.beginPath();
        for (let x = 0; x <= 1920; x += 8) {
          const y = 200 + i * 80 + Math.sin(x * 0.003 + t + i) * 60 + Math.sin(x * 0.007 + t * 1.3) * 30;
          x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        }
        ctx.lineTo(1920, 1080); ctx.lineTo(0, 1080); ctx.closePath();
        const g = ctx.createLinearGradient(0, 0, 1920, 400);
        const colors = [['rgba(0,245,255,0.04)','rgba(212,175,55,0.02)'],['rgba(165,28,48,0.05)','rgba(0,245,255,0.03)'],['rgba(212,175,55,0.04)','rgba(255,107,157,0.02)']];
        g.addColorStop(0, colors[i][0]); g.addColorStop(1, colors[i][1]);
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
    const nodes = Array.from({ length: 48 }, () => ({
      x: Math.random() * 1920, y: Math.random() * 1080,
      vx: (Math.random() - 0.5) * 0.3, vy: (Math.random() - 0.5) * 0.3,
      r: Math.random() * 2 + 1,
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
          if (d < 180) {
            ctx.strokeStyle = `rgba(0,245,255,${0.12 * (1 - d / 180)})`;
            ctx.lineWidth = 0.5;
            ctx.beginPath(); ctx.moveTo(nodes[i].x, nodes[i].y); ctx.lineTo(nodes[j].x, nodes[j].y); ctx.stroke();
          }
        }
      }
      for (const n of nodes) {
        ctx.beginPath(); ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(0,245,255,0.5)'; ctx.fill();
      }
      requestAnimationFrame(neural);
    }
    neural();
  }

  /* ── Particles ── */
  function initParticles(canvasEl, count, type) {
    if (!canvasEl) return;
    const ctx = canvasEl.getContext('2d');
    canvasEl.width = 1920; canvasEl.height = 1080;
    const pts = Array.from({ length: count }, () => ({
      x: Math.random() * 1920, y: Math.random() * 1080,
      r: type === 'bokeh' ? Math.random() * 80 + 40 : Math.random() * 2 + 0.3,
      speed: Math.random() * 0.25 + 0.05, alpha: Math.random() * 0.35 + 0.05,
      drift: (Math.random() - 0.5) * 0.2, phase: Math.random() * Math.PI * 2,
    }));
    function draw() {
      ctx.clearRect(0, 0, 1920, 1080);
      for (const p of pts) {
        p.y -= p.speed; p.x += p.drift + Math.sin(p.phase) * 0.15; p.phase += 0.008;
        if (p.y < -100) { p.y = 1180; p.x = Math.random() * 1920; }
        if (type === 'bokeh') {
          const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r);
          g.addColorStop(0, `rgba(212,175,55,${p.alpha * 0.15})`);
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
  initParticles(canvas, 150, 'dust');
  initParticles(bokehCanvas, 14, 'bokeh');

  function animateCounters(slide) {
    slide.querySelectorAll('[data-count]').forEach((el) => {
      const target = +el.dataset.count;
      const suffix = el.dataset.suffix || '';
      const prefix = el.dataset.prefix || '';
      const dur = 1800; const start = performance.now();
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
    for (let i = 0; i < 80; i++) {
      const piece = document.createElement('div');
      piece.className = 'confetti-piece';
      piece.style.left = `${Math.random() * 100}%`;
      piece.style.animationDelay = `${Math.random() * 3}s`;
      piece.style.animationDuration = `${2.5 + Math.random() * 2.5}s`;
      burst.appendChild(piece);
    }
    slide.appendChild(burst);
  });

  function wowTransition() {
    if (flashEl) { flashEl.classList.remove('burst'); void flashEl.offsetWidth; flashEl.classList.add('burst'); }
    if (shockEl) { shockEl.classList.remove('fire'); void shockEl.offsetWidth; shockEl.classList.add('fire'); }
  }

  function showSlide(i) {
    if (i > 0) wowTransition();
    slides.forEach((s, j) => {
      s.classList.toggle('active', j === i);
      s.classList.toggle('exit', j === i - 1);
    });
    const slide = slides[i];
    const total = String(slides.length).padStart(2, '0');
    if (counter) counter.textContent = `${i + 1} / ${slides.length}`;
    if (chapterEl) chapterEl.textContent = slide.dataset.chapter || '';
    if (sceneEl) sceneEl.textContent = `SCENE ${String(i + 1).padStart(2, '0')} — ${total}`;
    setTimeout(() => animateCounters(slide), 400);
  }

  function tick() {
    const dur = +slides[idx].dataset.ms || 9000;
    elapsed += 100;
    const total = slides.reduce((a, s) => a + (+s.dataset.ms || 9000), 0);
    const before = slides.slice(0, idx).reduce((a, s) => a + (+s.dataset.ms || 9000), 0);
    if (progress) progress.style.width = `${((before + elapsed) / total) * 100}%`;
    if (elapsed >= dur) {
      elapsed = 0; idx++;
      if (idx >= slides.length) idx = slides.length - 1;
      else showSlide(idx);
    }
  }

  showSlide(0);
  setInterval(tick, 100);
  window.VIDEO_DONE_MS = +deck.dataset.totalMs || 110000;
})();
