/* ============================================================
   S & W Plumbing — one consolidated motion layer.
   Ported from the design export's motion-enhancers.js +
   per-page DCLogic into a single module. GSAP + ScrollTrigger
   + Lenis, all behind prefers-reduced-motion.

   Rules kept from the brief:
   - transform/opacity only (60fps)
   - everything gated behind reduced-motion
   - the phone CTA is never blocked by motion (it is real markup,
     visible and tappable from first paint; motion only enhances)
   ============================================================ */
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const fine = window.matchMedia('(pointer:fine)').matches;
const desktop = window.innerWidth > 860;

declare global {
  interface Window {
    __swpLenis?: Lenis;
    __swpMotionReady?: boolean;
  }
}

const EASE = 'expo.out';

function intro(): boolean {
  const ov = document.getElementById('swp-intro');
  if (!ov) return false;
  let seen = false;
  try {
    seen = !!sessionStorage.getItem('swpIntroSeen');
  } catch {
    /* ignore */
  }
  if (reduce || seen) {
    ov.style.display = 'none';
    return false;
  }
  try {
    sessionStorage.setItem('swpIntroSeen', '1');
  } catch {
    /* ignore */
  }
  requestAnimationFrame(() => {
    const d = document.getElementById('swp-intro-drop');
    if (d) d.style.strokeDashoffset = '0';
    const s = document.getElementById('swp-intro-s');
    if (s) s.style.strokeDashoffset = '0';
    const w = document.getElementById('swp-intro-word');
    if (w) {
      w.style.opacity = '1';
      w.style.transform = 'translateY(0)';
    }
  });
  window.setTimeout(() => {
    ov.style.transform = 'translateY(-100%)';
  }, 1050);
  window.setTimeout(() => {
    ov.style.display = 'none';
  }, 2100);
  return true;
}

function navCondense() {
  const nav = document.getElementById('swp-nav');
  if (!nav) return;
  const onScroll = () => {
    if (window.scrollY > 24) nav.classList.add('is-scrolled');
    else nav.classList.remove('is-scrolled');
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

function progressBar() {
  const bar = document.getElementById('swp-progress');
  if (!bar) return;
  const onScroll = () => {
    const h = document.documentElement.scrollHeight - window.innerHeight;
    const p = h > 0 ? (window.scrollY / h) * 100 : 0;
    bar.style.width = Math.max(0, Math.min(100, p)) + '%';
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

/** Cinematic drifting canvas (the soft lime blobs behind hero / CTA). */
function startCanvas(id: string) {
  const canvas = document.getElementById(id) as HTMLCanvasElement | null;
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  let W = 0,
    H = 0;
  const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
  const resize = () => {
    const r = canvas.getBoundingClientRect();
    W = canvas.width = Math.max(1, Math.floor(r.width * dpr));
    H = canvas.height = Math.max(1, Math.floor(r.height * dpr));
  };
  resize();
  window.addEventListener('resize', resize);

  const blobs = [
    { x: 0.3, y: 0.42, r: 0.62, c: [127, 203, 0], a: 0.16, sx: 0.000045, sy: 0.000061, ph: 0 },
    { x: 0.72, y: 0.6, r: 0.5, c: [182, 255, 60], a: 0.1, sx: 0.000037, sy: 0.000052, ph: 2 },
    { x: 0.52, y: 0.18, r: 0.42, c: [70, 120, 20], a: 0.14, sx: 0.000058, sy: 0.000041, ph: 4 },
    { x: 0.15, y: 0.8, r: 0.4, c: [182, 255, 60], a: 0.07, sx: 0.00005, sy: 0.000066, ph: 1 },
  ];

  const drawFrame = (t: number) => {
    ctx.globalCompositeOperation = 'source-over';
    ctx.fillStyle = '#0A0C0E';
    ctx.fillRect(0, 0, W, H);
    ctx.globalCompositeOperation = 'lighter';
    const maxR = Math.max(W, H);
    blobs.forEach((b) => {
      const cx = (b.x + Math.sin(t * b.sx + b.ph) * 0.14) * W;
      const cy = (b.y + Math.cos(t * b.sy + b.ph) * 0.14) * H;
      const rad = b.r * maxR;
      const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, rad);
      g.addColorStop(0, `rgba(${b.c[0]},${b.c[1]},${b.c[2]},${b.a})`);
      g.addColorStop(1, `rgba(${b.c[0]},${b.c[1]},${b.c[2]},0)`);
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, W, H);
    });
    ctx.globalCompositeOperation = 'source-over';
  };

  if (reduce) {
    drawFrame(8000);
    return;
  }

  let raf = 0;
  let running = true;
  let last = 0;
  const loop = (now: number) => {
    if (!running) return;
    if (now - last > 24) {
      drawFrame(now);
      last = now;
    }
    raf = requestAnimationFrame(loop);
  };
  raf = requestAnimationFrame(loop);
  const io = new IntersectionObserver(
    (es) => {
      es.forEach((e) => {
        if (e.isIntersecting && !running) {
          running = true;
          raf = requestAnimationFrame(loop);
        } else if (!e.isIntersecting) {
          running = false;
          cancelAnimationFrame(raf);
        }
      });
    },
    { threshold: 0.01 }
  );
  io.observe(canvas);
}

/** Magnetic buttons + custom cursor + card tilt (desktop pointer:fine only). */
function pointerFx() {
  if (reduce || !fine || !desktop) return;

  // magnetic
  document.querySelectorAll<HTMLElement>('[data-magnetic]').forEach((el) => {
    el.addEventListener('mousemove', (e) => {
      const r = el.getBoundingClientRect();
      const x = e.clientX - (r.left + r.width / 2);
      const y = e.clientY - (r.top + r.height / 2);
      el.style.transform = `translate(${x * 0.28}px,${y * 0.4}px)`;
    });
    el.addEventListener('mouseleave', () => {
      el.style.transform = 'translate(0,0)';
    });
  });

  // tilt cards
  document.querySelectorAll<HTMLElement>('[data-tilt]').forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const r = card.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;
      card.style.transform = `perspective(900px) rotateY(${px * 7}deg) rotateX(${-py * 7}deg) translateY(-6px)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(900px) rotateY(0deg) rotateX(0deg) translateY(0)';
    });
  });

  // custom cursor
  const ring = document.getElementById('swp-cursor');
  const dot = document.getElementById('swp-cursor-dot');
  if (ring && dot) {
    let mx = window.innerWidth / 2,
      my = window.innerHeight / 2;
    let rx = mx,
      ry = my,
      dx = mx,
      dy = my;
    window.addEventListener('mousemove', (e) => {
      mx = e.clientX;
      my = e.clientY;
    });
    const loop = () => {
      rx += (mx - rx) * 0.35;
      ry += (my - ry) * 0.35;
      dx += (mx - dx) * 0.16;
      dy += (my - dy) * 0.16;
      ring.style.transform = `translate(${rx}px,${ry}px) translate(-50%,-50%)`;
      dot.style.transform = `translate(${dx}px,${dy}px) translate(-50%,-50%)`;
      requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
    document.querySelectorAll('a,button,[data-tilt]').forEach((el) => {
      el.addEventListener('mouseenter', () => {
        ring.style.width = '52px';
        ring.style.height = '52px';
        ring.style.background = 'rgba(182,255,60,0.12)';
      });
      el.addEventListener('mouseleave', () => {
        ring.style.width = '34px';
        ring.style.height = '34px';
        ring.style.background = 'transparent';
      });
    });
  }
}

/** Expandable service cards (Services page). Keyboard + ARIA accessible. */
function serviceExpanders() {
  document.querySelectorAll<HTMLElement>('[data-expand]').forEach((card) => {
    const detail = card.querySelector<HTMLElement>('[data-detail]');
    const chev = card.querySelector<HTMLElement>('[data-chev]');
    if (!detail) return;
    const toggle = () => {
      const open = card.getAttribute('aria-expanded') === 'true';
      card.setAttribute('aria-expanded', open ? 'false' : 'true');
      detail.style.maxHeight = open ? '0px' : detail.scrollHeight + 40 + 'px';
      if (chev) chev.style.transform = open ? 'rotate(0deg)' : 'rotate(180deg)';
      if (chev) chev.style.color = open ? 'var(--muted-2)' : 'var(--lime)';
    };
    card.addEventListener('click', (e) => {
      // don't toggle when the inner "Call to book" link is clicked
      if ((e.target as HTMLElement).closest('a')) return;
      toggle();
    });
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggle();
      }
    });
  });
}

function initGsap(introPlaying: boolean) {
  gsap.registerPlugin(ScrollTrigger);

  // Lenis smooth scroll
  if (!reduce) {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });
    window.__swpLenis = lenis;
    const raf = (t: number) => {
      lenis.raf(t);
      requestAnimationFrame(raf);
    };
    requestAnimationFrame(raf);
    lenis.on('scroll', ScrollTrigger.update);
  }

  // anchor links → smooth scroll via Lenis
  document.querySelectorAll<HTMLAnchorElement>('a[href^="#"]').forEach((a) => {
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href')!.slice(1);
      const t = document.getElementById(id);
      if (!t) return;
      e.preventDefault();
      const top = t.getBoundingClientRect().top + window.scrollY - 64;
      if (window.__swpLenis) window.__swpLenis.scrollTo(top);
      else window.scrollTo({ top, behavior: reduce ? 'auto' : 'smooth' });
    });
  });

  if (reduce) {
    document.documentElement.classList.add('motion-failsafe');
    return;
  }

  const dly = introPlaying ? 1.0 : 0.15;

  // HERO masked lines (line-mask reveal, rise out from behind an edge)
  const heroLines = gsap.utils.toArray<HTMLElement>('.hero-mask .reveal-line > span');
  if (heroLines.length) {
    gsap.set(heroLines, { yPercent: 120 });
    gsap.to(heroLines, { yPercent: 0, duration: 1.1, ease: EASE, stagger: 0.09, delay: dly });
  }

  // hero supporting elements
  const heroEls = gsap.utils.toArray<HTMLElement>('[data-hero]');
  if (heroEls.length) {
    gsap.set(heroEls, { opacity: 0, y: 24 });
    gsap.to(heroEls, { opacity: 1, y: 0, duration: 0.9, stagger: 0.1, ease: EASE, delay: dly + 0.35 });
  }

  // hero water line
  const wl = document.getElementById('swp-waterline');
  if (wl) gsap.fromTo(wl, { scaleX: 0 }, { scaleX: 1, duration: 1.4, ease: 'power3.inOut', delay: dly + 0.5 });

  // generic single reveals
  gsap.utils.toArray<HTMLElement>('[data-reveal]').forEach((el) => {
    gsap.fromTo(
      el,
      { opacity: 0, y: 44 },
      { opacity: 1, y: 0, duration: 0.95, ease: EASE, scrollTrigger: { trigger: el, start: 'top 86%' } }
    );
  });

  // staggered children groups (trust strip, service cards, etc.)
  gsap.utils.toArray<HTMLElement>('[data-anim-children]').forEach((group) => {
    const kids = Array.from(group.children) as HTMLElement[];
    gsap.fromTo(
      kids,
      { opacity: 0, y: 40 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: EASE,
        stagger: 0.08,
        scrollTrigger: { trigger: group, start: 'top 85%' },
      }
    );
  });

  // scroll-SCRUBBED signature water lines (the Apple move)
  gsap.utils.toArray<HTMLElement>('[data-waterline]').forEach((el) => {
    gsap.fromTo(
      el,
      { scaleX: 0 },
      { scaleX: 1, ease: 'none', scrollTrigger: { trigger: el, start: 'top 92%', end: 'top 52%', scrub: true } }
    );
  });

  // scroll-scrubbed process connector line
  gsap.utils.toArray<HTMLElement>('[data-process-line]').forEach((el) => {
    gsap.fromTo(
      el,
      { scaleX: 0 },
      { scaleX: 1, ease: 'none', scrollTrigger: { trigger: el, start: 'top 80%', end: 'bottom 50%', scrub: true } }
    );
  });

  // count up
  gsap.utils.toArray<HTMLElement>('[data-countup]').forEach((el) => {
    const target = parseFloat(el.getAttribute('data-countup') || '0') || 0;
    const suffix = el.getAttribute('data-suffix') || '';
    const obj = { v: 0 };
    gsap.to(obj, {
      v: target,
      duration: 1.8,
      ease: 'power2.out',
      scrollTrigger: { trigger: el, start: 'top 88%' },
      onUpdate: () => {
        el.textContent = Math.round(obj.v) + suffix;
      },
    });
  });

  // map pins pop
  const pins = gsap.utils.toArray<HTMLElement>('[data-pin]');
  if (pins.length) {
    gsap.set(pins, { scale: 0, transformOrigin: 'center center' });
    gsap.to(pins, {
      scale: 1,
      duration: 0.6,
      stagger: 0.06,
      ease: 'back.out(2.2)',
      scrollTrigger: { trigger: pins[0], start: 'top 90%' },
    });
  }

  // suburb chips stagger
  const chips = gsap.utils.toArray<HTMLElement>('[data-chip]');
  if (chips.length) {
    gsap.fromTo(
      chips,
      { opacity: 0, y: 20, scale: 0.96 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.5,
        ease: EASE,
        stagger: 0.04,
        scrollTrigger: { trigger: chips[0], start: 'top 90%' },
      }
    );
  }

  // parallax glow
  gsap.utils.toArray<HTMLElement>('[data-parallax-bg]').forEach((pbg) => {
    gsap.to(pbg, {
      yPercent: 24,
      ease: 'none',
      scrollTrigger: { trigger: pbg, start: 'top bottom', end: 'bottom top', scrub: true },
    });
  });
}

function init() {
  const introPlaying = intro();
  navCondense();
  progressBar();
  startCanvas('swp-hero-canvas');
  startCanvas('swp-cta-canvas');
  pointerFx();
  serviceExpanders();
  initGsap(introPlaying);
  window.__swpMotionReady = true;
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init, { once: true });
} else {
  init();
}
