/* Cinematic slide engine — curtains, particles, progression */
(function () {
  const deck = document.getElementById('deck');
  const slides = [...document.querySelectorAll('.slide')];
  const progress = document.getElementById('progress');
  const counter = document.getElementById('slide-counter');
  const canvas = document.getElementById('particles');
  let idx = 0;
  let elapsed = 0;

  // Open curtains after brief pause
  setTimeout(() => deck.classList.add('curtains-open'), 600);

  // Golden particle field
  if (canvas) {
    const ctx = canvas.getContext('2d');
    canvas.width = 1920;
    canvas.height = 1080;
    const particles = Array.from({ length: 80 }, () => ({
      x: Math.random() * 1920,
      y: Math.random() * 1080,
      r: Math.random() * 2.5 + 0.5,
      speed: Math.random() * 0.4 + 0.1,
      alpha: Math.random() * 0.5 + 0.1,
      drift: (Math.random() - 0.5) * 0.3,
    }));

    function drawParticles() {
      ctx.clearRect(0, 0, 1920, 1080);
      for (const p of particles) {
        p.y -= p.speed;
        p.x += p.drift;
        if (p.y < -5) { p.y = 1090; p.x = Math.random() * 1920; }
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(212, 175, 55, ${p.alpha})`;
        ctx.fill();
      }
      requestAnimationFrame(drawParticles);
    }
    drawParticles();
  }

  // Confetti for finale slides
  document.querySelectorAll('.slide.finale').forEach((slide) => {
    const burst = document.createElement('div');
    burst.className = 'confetti-burst';
    for (let i = 0; i < 40; i++) {
      const piece = document.createElement('div');
      piece.className = 'confetti-piece';
      piece.style.left = `${Math.random() * 100}%`;
      piece.style.animationDelay = `${Math.random() * 2}s`;
      piece.style.animationDuration = `${2 + Math.random() * 2}s`;
      burst.appendChild(piece);
    }
    slide.appendChild(burst);
  });

  function showSlide(i) {
    slides.forEach((s, j) => s.classList.toggle('active', j === i));
    if (counter) counter.textContent = `${i + 1} / ${slides.length}`;
  }

  function tick() {
    const dur = +slides[idx].dataset.ms || 8000;
    elapsed += 100;
    const total = slides.reduce((a, s) => a + (+s.dataset.ms || 8000), 0);
    const before = slides.slice(0, idx).reduce((a, s) => a + (+s.dataset.ms || 8000), 0);
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
  window.VIDEO_DONE_MS = +deck.dataset.totalMs || 90000;
})();
