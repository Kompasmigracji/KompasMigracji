import React, { useEffect, useRef } from 'react';
import { useTheme } from '../lib/ThemeContext';

const N = 200;

function mkStars(w, h) {
  return Array.from({ length: N }, () => ({
    x: Math.random() * w,
    y: Math.random() * h,
    r: Math.random() * 1.4 + 0.15,
    base: Math.random() * 0.5 + 0.2,
    phase: Math.random() * Math.PI * 2,
    freq: Math.random() * 0.7 + 0.2,
  }));
}

export default function StarField() {
  const { dark } = useTheme();
  const ref = useRef(null);

  useEffect(() => {
    if (!dark) return;
    const c = ref.current;
    if (!c) return;
    const ctx = c.getContext('2d');

    let raf, t = 0, shootClock = 0, shoot = null;

    const resize = () => {
      c.width  = window.innerWidth;
      c.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    let stars = mkStars(c.width, c.height);
    const onResize = () => { stars = mkStars(c.width, c.height); };
    window.addEventListener('resize', onResize);

    const spawnShoot = () => {
      shoot = {
        x:    c.width * 0.05 + Math.random() * c.width * 0.7,
        y:    Math.random() * c.height * 0.45,
        vx:   7 + Math.random() * 6,
        vy:   3.5 + Math.random() * 3,
        tail: 140 + Math.random() * 90,
        life: 1,
        decay: 0.022 + Math.random() * 0.014,
      };
    };

    const draw = () => {
      t         += 0.016;
      shootClock += 0.016;
      ctx.clearRect(0, 0, c.width, c.height);

      // Twinkling stars
      for (const s of stars) {
        const a = Math.min(1, Math.max(0, s.base + Math.sin(t * s.freq + s.phase) * 0.3));

        if (s.r > 1.0) {
          const g = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, s.r * 4.5);
          g.addColorStop(0, `rgba(180,205,255,${a * 0.45})`);
          g.addColorStop(1, 'rgba(0,0,0,0)');
          ctx.beginPath();
          ctx.arc(s.x, s.y, s.r * 4.5, 0, Math.PI * 2);
          ctx.fillStyle = g;
          ctx.fill();
        }

        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(215,228,255,${a})`;
        ctx.fill();
      }

      // Shooting star
      if (!shoot && shootClock > 4.5 + Math.random() * 3.5) {
        spawnShoot();
        shootClock = 0;
      }

      if (shoot) {
        const angle = Math.atan2(shoot.vy, shoot.vx);
        const len   = shoot.tail * shoot.life;
        const tx    = shoot.x - Math.cos(angle) * len;
        const ty    = shoot.y - Math.sin(angle) * len;
        const grad  = ctx.createLinearGradient(shoot.x, shoot.y, tx, ty);
        grad.addColorStop(0,   `rgba(255,255,255,${shoot.life})`);
        grad.addColorStop(0.25, `rgba(180,210,255,${shoot.life * 0.7})`);
        grad.addColorStop(1,   'rgba(0,0,0,0)');

        ctx.beginPath();
        ctx.moveTo(shoot.x, shoot.y);
        ctx.lineTo(tx, ty);
        ctx.strokeStyle = grad;
        ctx.lineWidth   = 1.8;
        ctx.stroke();

        shoot.x    += shoot.vx;
        shoot.y    += shoot.vy;
        shoot.life -= shoot.decay;
        if (shoot.life <= 0 || shoot.x > c.width + 80 || shoot.y > c.height + 80) {
          shoot = null;
        }
      }

      raf = requestAnimationFrame(draw);
    };

    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      window.removeEventListener('resize', onResize);
    };
  }, [dark]);

  if (!dark) return null;

  return (
    <canvas
      ref={ref}
      style={{
        position: 'fixed',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 0,
        animation: 'sf-fade 1s ease both',
      }}
    />
  );
}
