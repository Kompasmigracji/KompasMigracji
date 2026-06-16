/* Professional cinematic engine v3 */
(function () {
  const deck = document.getElementById('deck');
  const slides = [...document.querySelectorAll('.slide')];
  const progress = document.getElementById('progress');
  const counter = document.getElementById('slide-counter');
  const chapterEl = document.getElementById('chapter-title');
  const sceneEl = document.getElementById('scene-num');
  const canvas = document.getElementById('particles');
  const bokehCanvas = document.getElementById('bokeh');
  let idx = 0;
  let elapsed = 0;

  setTimeout(() => deck.classList.add('curtains-open'), 400);
  setTimeout(() => deck.classList.add('ui-visible'), 1800);

  /* ── Dual particle systems ── */
  function initParticles(canvasEl, count, type) {
    if (!canvasEl) return;
    const ctx = canvasEl.getContext('2d');
    canvasEl.width = 1920;
    canvasEl.height = 1080;
    const pts = Array.from({ length: count }, () => ({
      x: Math.random() * 1920,
      y: Math.random() * 1080,
      r: type === 'bokeh' ? Math.random() * 80 + 40 : Math.random() * 2 + 0.3,
      speed: Math.random() * 0.25 + 0.05,
      alpha: Math.random() * 0.35 + 0.05,
      drift: (Math.random() - 0.5) * 0.2,
      phase: Math.random() * Math.PI * 2,
    }));

    function draw() {
      ctx.clearRect(0, 0, 1920, 1080);
      for (const p of pts) {
        p.y -= p.speed;
        p.x += p.drift + Math.sin(p.phase) * 0.15;
        p.phase += 0.008;
        if (p.y < -100) { p.y = 1180; p.x = Math.random() * 1920; }

        if (type === 'bokeh') {
          const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r);
          g.addColorStop(0, `rgba(212,175,55,${p.alpha * 0.15})`);
          g.addColorStop(1, 'rgba(212,175,55,0)');
          ctx.fillStyle = g;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
          ctx.fill();
        } else {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(245,230,168,${p.alpha})`;
          ctx.fill();
        }
      }
      requestAnimationFrame(draw);
    }
    draw();
  }
  initParticles(canvas, 120, 'dust');
  initParticles(bokehCanvas, 12, 'bokeh');

  /* ── Animated stat counters ── */
  function animateCounters(slide) {
    slide.querySelectorAll('[data-count]').forEach((el) => {
      const target = +el.dataset.count;
      const suffix = el.dataset.suffix || '';
      const prefix = el.dataset.prefix || '';
      const dur = 1800;
      const start = performance.now();
      function step(now) {
        const t = Math.min((now - start) / dur, 1);
        const ease = 1 - Math.pow(1 - t, 4);
        const val = Math.round(target * ease);
        el.textContent = prefix + val + suffix;
        if (t < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    });
  }

  /* ── Confetti ── */
  document.querySelectorAll('.slide.finale').forEach((slide) => {
    const burst = document.createElement('div');
    burst.className = 'confetti-burst';
    for (let i = 0; i < 60; i++) {
      const piece = document.createElement('div');
      piece.className = 'confetti-piece';
      piece.style.left = `${Math.random() * 100}%`;
      piece.style.animationDelay = `${Math.random() * 2.5}s`;
      piece.style.animationDuration = `${2.5 + Math.random() * 2}s`;
      burst.appendChild(piece);
    }
    slide.appendChild(burst);
  });

  /* ── Slide transitions ── */
  function showSlide(i) {
    slides.forEach((s, j) => {
      const on = j === i;
      s.classList.toggle('active', on);
      s.classList.toggle('exit', j === i - 1);
      if (!on) s.classList.remove('exit');
    });

    const slide = slides[i];
    const ch = slide.dataset.chapter || '';
    const total = String(slides.length).padStart(2, '0');
    const num = String(i + 1).padStart(2, '0');

    if (counter) counter.textContent = `${i + 1} / ${slides.length}`;
    if (chapterEl) chapterEl.textContent = ch;
    if (sceneEl) sceneEl.textContent = `SCENE ${num} — ${total}`;

    setTimeout(() => animateCounters(slide), 400);
  }

  function tick() {
    const dur = +slides[idx].dataset.ms || 9000;
    elapsed += 100;
    const total = slides.reduce((a, s) => a + (+s.dataset.ms || 9000), 0);
    const before = slides.slice(0, idx).reduce((a, s) => a + (+s.dataset.ms || 9000), 0);
    if (progress) progress.style.width = `${((before + elapsed) / total) * 100}%`;

    if (elapsed >= dur) {
      elapsed = 0;
      idx++;
      if (idx >= slides.length) idx = slides.length - 1;
      else showSlide(idx);
    }
  }

  showSlide(0);
  setInterval(tick, 100);
  window.VIDEO_DONE_MS = +deck.dataset.totalMs || 100000;
})();
