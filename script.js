/* ════════════════════════════════════════════════
   UTPREKSHA KASHYAP — DATA ANALYST PORTFOLIO
   script.js  |  All interactive functionality
════════════════════════════════════════════════ */

/* Force light theme always */
document.documentElement.setAttribute('data-theme','light');

/* ──────────────────────────────────────────────
   1. LOADING SCREEN
────────────────────────────────────────────── */
window.addEventListener('load', () => {
  const loader = document.getElementById('loader');
  setTimeout(() => {
    loader.classList.add('hidden');
    document.body.style.overflow = 'auto';
    // Kick off entrance animations after load
    initReveal();
    initCounters();
    initSkillBars();
    initMiniBars();
  }, 1800);
});

// Prevent scroll during load
document.body.style.overflow = 'hidden';

/* ──────────────────────────────────────────────
   2. CUSTOM CURSOR
────────────────────────────────────────────── */
const cursorDot  = document.getElementById('cursorDot');
const cursorRing = document.getElementById('cursorRing');

let mouseX = 0, mouseY = 0;
let ringX = 0, ringY = 0;

document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  cursorDot.style.left = mouseX + 'px';
  cursorDot.style.top  = mouseY + 'px';
});

// Smooth ring follow using RAF
function animateRing() {
  ringX += (mouseX - ringX) * 0.13;
  ringY += (mouseY - ringY) * 0.13;
  cursorRing.style.left = ringX + 'px';
  cursorRing.style.top  = ringY + 'px';
  requestAnimationFrame(animateRing);
}
animateRing();

// Scale ring on interactive elements
document.querySelectorAll('a, button, .glass-card, .project-card').forEach(el => {
  el.addEventListener('mouseenter', () => cursorRing.style.transform = 'translate(-50%,-50%) scale(1.6)');
  el.addEventListener('mouseleave', () => cursorRing.style.transform = 'translate(-50%,-50%) scale(1)');
});

/* ──────────────────────────────────────────────
   3. PARTICLE BACKGROUND
────────────────────────────────────────────── */
(function initParticles() {
  const canvas = document.getElementById('particleCanvas');
  const ctx    = canvas.getContext('2d');

  let W, H, particles = [];

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', () => { resize(); buildParticles(); });

  const COLORS = ['rgba(233,30,140,', 'rgba(142,36,170,', 'rgba(244,143,177,'];
  const COUNT  = Math.min(80, Math.floor(window.innerWidth / 18));

  class Particle {
    constructor() { this.reset(true); }
    reset(initial = false) {
      this.x    = Math.random() * W;
      this.y    = initial ? Math.random() * H : H + 10;
      this.r    = Math.random() * 1.8 + 0.4;
      this.vy   = -(Math.random() * 0.35 + 0.1);
      this.vx   = (Math.random() - 0.5) * 0.25;
      this.col  = COLORS[Math.floor(Math.random() * COLORS.length)];
      this.alpha= Math.random() * 0.5 + 0.15;
      this.life = 0;
      this.maxLife = Math.random() * 400 + 200;
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      this.life++;
      if (this.y < -10 || this.life > this.maxLife) this.reset();
    }
    draw() {
      const progress = this.life / this.maxLife;
      const fade = progress < 0.1 ? progress * 10
                 : progress > 0.8 ? (1 - progress) * 5
                 : 1;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = this.col + (this.alpha * fade) + ')';
      ctx.fill();
    }
  }

  function buildParticles() {
    particles = Array.from({ length: COUNT }, () => new Particle());
  }
  buildParticles();

  // Connection lines between nearby particles
  function drawConnections() {
    const DIST = 120;
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const d  = Math.sqrt(dx * dx + dy * dy);
        if (d < DIST) {
          const op = (1 - d / DIST) * 0.18;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(233,30,140,${op})`;
          ctx.lineWidth   = 0.6;
          ctx.stroke();
        }
      }
    }
  }

  function loop() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => { p.update(); p.draw(); });
    drawConnections();
    requestAnimationFrame(loop);
  }
  loop();
})();

/* ──────────────────────────────────────────────
   4. NAVIGATION — scroll behaviour & mobile menu
────────────────────────────────────────────── */
const navbar    = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const mobileMenu= document.getElementById('mobileMenu');

// Navbar shadow on scroll
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
  toggleBackTop();
});

// Hamburger toggle
hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  mobileMenu.classList.toggle('open');
});

// Close mobile menu on link click
document.querySelectorAll('.mob-link').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    mobileMenu.classList.remove('open');
  });
});

// Highlight active nav link on scroll
const sections  = document.querySelectorAll('section[id]');
const navAnchors= document.querySelectorAll('.nav-links a');

function highlightNav() {
  const scrollY = window.scrollY + 100;
  sections.forEach(sec => {
    if (scrollY >= sec.offsetTop && scrollY < sec.offsetTop + sec.offsetHeight) {
      navAnchors.forEach(a => a.classList.remove('active'));
      const match = document.querySelector(`.nav-links a[href="#${sec.id}"]`);
      if (match) match.classList.add('active');
    }
  });
}
window.addEventListener('scroll', highlightNav, { passive: true });

// Inject .active style dynamically (keeps CSS clean)
const navStyle = document.createElement('style');
navStyle.textContent = `.nav-links a.active { color:var(--neon-cyan); background:rgba(255,105,180,.08); }`;
document.head.appendChild(navStyle);

;

/* ──────────────────────────────────────────────
   6. TYPING EFFECT
────────────────────────────────────────────── */
(function initTyping() {
  const el     = document.getElementById('typedText');
  const roles  = [
    'Aspiring Data Analyst',
    'Python Enthusiast',
    'Power BI Developer',
    'SQL Query Writer',
    'Excel Wizard',
    'B.Sc. CS Student'
  ];
  let ri = 0, ci = 0, deleting = false;

  function type() {
    const word = roles[ri];
    if (!deleting) {
      el.textContent = word.slice(0, ++ci);
      if (ci === word.length) {
        deleting = true;
        setTimeout(type, 1800);
        return;
      }
      setTimeout(type, 85);
    } else {
      el.textContent = word.slice(0, --ci);
      if (ci === 0) {
        deleting = false;
        ri = (ri + 1) % roles.length;
        setTimeout(type, 400);
        return;
      }
      setTimeout(type, 45);
    }
  }
  type();
})();

/* ──────────────────────────────────────────────
   7. SCROLL REVEAL ANIMATION
────────────────────────────────────────────── */
function initReveal() {
  const reveals = document.querySelectorAll('.reveal');
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        // Stagger siblings
        const siblings = [...entry.target.parentElement.querySelectorAll('.reveal')];
        const idx = siblings.indexOf(entry.target);
        entry.target.style.transitionDelay = `${idx * 0.08}s`;
        entry.target.classList.add('visible');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  reveals.forEach(el => io.observe(el));
}

/* ──────────────────────────────────────────────
   8. STAT COUNTERS
────────────────────────────────────────────── */
function initCounters() {
  const counters = document.querySelectorAll('.stat-num[data-target]');
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el     = entry.target;
      const target = parseInt(el.dataset.target, 10);
      let   current= 0;
      const step   = target / 60;
      const tick   = () => {
        current = Math.min(current + step, target);
        el.textContent = Math.floor(current);
        if (current < target) requestAnimationFrame(tick);
        else el.textContent = target + (target >= 10 ? '+' : '+');
      };
      tick();
      io.unobserve(el);
    });
  }, { threshold: 0.5 });

  counters.forEach(c => io.observe(c));
}

/* ──────────────────────────────────────────────
   9. SKILL PROGRESS BARS
────────────────────────────────────────────── */
function initSkillBars() {
  const bars = document.querySelectorAll('.skill-bar-fill[data-w]');
  const io   = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const w  = el.getAttribute('data-w');
      el.style.setProperty('--skill-w', w);
      // Small delay for stagger feel
      setTimeout(() => el.classList.add('animated'), 100);
      io.unobserve(el);
    });
  }, { threshold: 0.3 });
  bars.forEach(b => io.observe(b));
}

/* ──────────────────────────────────────────────
   10. ABOUT MINI BAR FILLS
────────────────────────────────────────────── */
function initMiniBars() {
  const fills = document.querySelectorAll('.mini-bar-fill');
  const io    = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      setTimeout(() => entry.target.classList.add('animated'), 200);
      io.unobserve(entry.target);
    });
  }, { threshold: 0.4 });
  fills.forEach(f => io.observe(f));
}

/* ──────────────────────────────────────────────
   11. BACK TO TOP BUTTON
────────────────────────────────────────────── */
const backTop = document.getElementById('backTop');

function toggleBackTop() {
  backTop.classList.toggle('visible', window.scrollY > 400);
}

backTop.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

/* ──────────────────────────────────────────────
   12. CONTACT FORM (client-side demo)
────────────────────────────────────────────── */
const formSubmit = document.getElementById('formSubmit');
const formNote   = document.getElementById('formNote');

formSubmit.addEventListener('click', () => {
  const name  = document.getElementById('cName').value.trim();
  const email = document.getElementById('cEmail').value.trim();
  const msg   = document.getElementById('cMsg').value.trim();

  if (!name || !email || !msg) {
    formNote.style.color = '#ff6b6b';
    formNote.textContent = '// Please fill in all fields.';
    return;
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    formNote.style.color = '#ff6b6b';
    formNote.textContent = '// Invalid email address.';
    return;
  }

  // Simulate sending
  formSubmit.textContent = 'Sending…';
  formSubmit.disabled = true;

  setTimeout(() => {
    formNote.style.color = 'var(--neon-soft)';
    formNote.textContent = '// Message sent! I\'ll get back to you soon 🚀';
    formSubmit.textContent = 'Send Message →';
    formSubmit.disabled = false;
    document.getElementById('cName').value  = '';
    document.getElementById('cEmail').value = '';
    document.getElementById('cMsg').value   = '';
  }, 1400);
});

/* ──────────────────────────────────────────────
   13. PARALLAX — floating cubes on mouse move
────────────────────────────────────────────── */
document.addEventListener('mousemove', (e) => {
  const xRatio = (e.clientX / window.innerWidth  - 0.5) * 2;
  const yRatio = (e.clientY / window.innerHeight - 0.5) * 2;

  document.querySelectorAll('.cube').forEach((cube, i) => {
    const depth  = (i + 1) * 6;
    const tx = xRatio * depth;
    const ty = yRatio * depth;
    cube.style.transform = `translate(${tx}px, ${ty}px) rotateX(${ty}deg) rotateY(${tx}deg)`;
  });
});

/* ──────────────────────────────────────────────
   14. SMOOTH SECTION ENTRY (hero stagger)
────────────────────────────────────────────── */
window.addEventListener('load', () => {
  setTimeout(() => {
    const heroContent = document.querySelector('.hero-content');
    if (heroContent) heroContent.classList.add('visible');
  }, 1900);
});

/* ──────────────────────────────────────────────
   15. GLOWING CARD SPOTLIGHT EFFECT
    (neon glow follows mouse inside each card)
────────────────────────────────────────────── */
document.querySelectorAll('.glass-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x    = e.clientX - rect.left;
    const y    = e.clientY - rect.top;
    card.style.setProperty('--mx', x + 'px');
    card.style.setProperty('--my', y + 'px');
  });
});

// Inject spotlight CSS rule
const spotStyle = document.createElement('style');
spotStyle.textContent = `
  .glass-card {
    position: relative;
    overflow: hidden;
  }
  .glass-card::after {
    content: '';
    position: absolute;
    width: 240px;
    height: 240px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(233,30,140,0.07) 0%, transparent 70%);
    top: calc(var(--my, -9999px) - 120px);
    left: calc(var(--mx, -9999px) - 120px);
    pointer-events: none;
    transition: top 0.04s, left 0.04s;
    z-index: 0;
  }
  .glass-card > * { position: relative; z-index: 1; }
`;
document.head.appendChild(spotStyle);

/* ──────────────────────────────────────────────
   16. FLOATING 3D CHART ELEMENTS
    (Add animated data-points drifting in hero)
────────────────────────────────────────────── */
(function addDataDots() {
  const hero = document.querySelector('.hero');
  if (!hero) return;
  const DOT_COUNT = 12;
  for (let i = 0; i < DOT_COUNT; i++) {
    const dot = document.createElement('div');
    dot.classList.add('data-dot');
    dot.style.cssText = `
      position:absolute;
      width:${Math.random()*6+3}px;
      height:${Math.random()*6+3}px;
      border-radius:50%;
      left:${Math.random()*90+5}%;
      top:${Math.random()*80+10}%;
      background:${Math.random()>.5 ? 'rgba(233,30,140,' : 'rgba(142,36,170,'}${Math.random()*.45+.15});
      box-shadow: 0 0 8px rgba(255,105,180,0.4);
      animation: floatDot ${Math.random()*6+5}s ease-in-out infinite alternate;
      animation-delay:${Math.random()*4}s;
      pointer-events:none;
      z-index:1;
    `;
    hero.appendChild(dot);
  }

  const dotAnim = document.createElement('style');
  dotAnim.textContent = `
    @keyframes floatDot {
      0%   { transform: translateY(0px) scale(1);   opacity:.6; }
      100% { transform: translateY(-22px) scale(1.3); opacity:1; }
    }
  `;
  document.head.appendChild(dotAnim);
})();

/* ──────────────────────────────────────────────
   17. TILT EFFECT on Project Cards
────────────────────────────────────────────── */
document.querySelectorAll('.project-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect  = card.getBoundingClientRect();
    const x     = e.clientX - rect.left - rect.width  / 2;
    const y     = e.clientY - rect.top  - rect.height / 2;
    const tiltX = -(y / rect.height) * 10;
    const tiltY =  (x / rect.width)  * 10;
    card.style.transform = `perspective(800px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateY(-8px)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
    card.style.transition = 'transform 0.5s cubic-bezier(0.16,1,0.3,1)';
  });
  card.addEventListener('mouseenter', () => {
    card.style.transition = 'transform 0.1s linear';
  });
});

/* ──────────────────────────────────────────────
   18. CERTIFICATE CARD TILT (lighter)
────────────────────────────────────────────── */
document.querySelectorAll('.cert-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect  = card.getBoundingClientRect();
    const x     = e.clientX - rect.left - rect.width  / 2;
    const y     = e.clientY - rect.top  - rect.height / 2;
    const tiltX = -(y / rect.height) * 7;
    const tiltY =  (x / rect.width)  * 7;
    card.style.transform = `perspective(700px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateY(-5px)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
    card.style.transition = 'transform 0.5s cubic-bezier(0.16,1,0.3,1)';
  });
  card.addEventListener('mouseenter', () => {
    card.style.transition = 'transform 0.12s linear';
  });
});

/* ──────────────────────────────────────────────
   19. NAV LINK SMOOTH SCROLL (fallback for older browsers)
────────────────────────────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

/* ──────────────────────────────────────────────
   20. ACHIEVEMENT CARDS — pulse on hover
────────────────────────────────────────────── */
document.querySelectorAll('.ach-icon-wrap').forEach(icon => {
  icon.closest('.ach-card').addEventListener('mouseenter', () => {
    icon.style.animation = 'achPulse 0.4s ease';
  });
  icon.closest('.ach-card').addEventListener('animationend', () => {
    icon.style.animation = '';
  }, { once: true });
});

const achAnim = document.createElement('style');
achAnim.textContent = `
  @keyframes achPulse {
    0%   { transform: scale(1); }
    50%  { transform: scale(1.25) rotate(-5deg); }
    100% { transform: scale(1); }
  }
`;
document.head.appendChild(achAnim);

/* ──────────────────────────────────────────────
   21. SCROLL PROGRESS BAR (top of page)
────────────────────────────────────────────── */
(function addProgressBar() {
  const bar = document.createElement('div');
  bar.id = 'scrollProgress';
  bar.style.cssText = `
    position:fixed; top:0; left:0; height:3px; width:0%;
    background:linear-gradient(90deg, #e91e8c, #8e24aa);
    z-index:9999; pointer-events:none;
    transition:width 0.1s linear;
    box-shadow: 0 0 10px rgba(233,30,140,0.5);
  `;
  document.body.appendChild(bar);

  window.addEventListener('scroll', () => {
    const docH   = document.documentElement.scrollHeight - window.innerHeight;
    const pct    = docH > 0 ? (window.scrollY / docH) * 100 : 0;
    bar.style.width = pct + '%';
  }, { passive: true });
})();

/* ──────────────────────────────────────────────
   22. GLITCH EFFECT on hero name (subtle)
────────────────────────────────────────────── */
(function heroGlitch() {
  const glitchCSS = document.createElement('style');
  glitchCSS.textContent = `
    .hero-name {
      position: relative;
    }
    .hero-name::before,
    .hero-name::after {
      content: attr(data-text);
      position: absolute;
      top: 0; left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
    }
    .hero-name::before {
      color: var(--neon-cyan);
      animation: glitch1 6s infinite;
      clip-path: polygon(0 30%, 100% 30%, 100% 50%, 0 50%);
    }
    .hero-name::after {
      color: var(--neon-purple);
      animation: glitch2 6s infinite;
      clip-path: polygon(0 55%, 100% 55%, 100% 75%, 0 75%);
    }
    @keyframes glitch1 {
      0%,92%,100% { transform:none; opacity:0; }
      93%          { transform:translate(-2px,1px); opacity:.25; }
      95%          { transform:translate(2px,-1px); opacity:.25; }
      97%          { transform:none; opacity:0; }
    }
    @keyframes glitch2 {
      0%,94%,100% { transform:none; opacity:0; }
      95%          { transform:translate(2px,1px); opacity:.2; }
      97%          { transform:translate(-2px,-1px); opacity:.2; }
      99%          { transform:none; opacity:0; }
    }
  `;
  document.head.appendChild(glitchCSS);

  // Set data-text attribute for the pseudo-elements
  const heroName = document.querySelector('.hero-name');
  if (heroName) heroName.setAttribute('data-text', heroName.textContent);
})();

/* ──────────────────────────────────────────────
   23. SECTION GLOW PULSE (ambient background)
────────────────────────────────────────────── */
(function sectionGlow() {
  const glowCSS = document.createElement('style');
  glowCSS.textContent = `
    .section::before {
      content: '';
      position: absolute;
      width: 500px; height: 500px;
      border-radius: 50%;
      background: radial-gradient(circle, rgba(255,105,180,0.06) 0%, transparent 70%);
      top: 10%; left: -100px;
      pointer-events: none;
      animation: ambientGlow 8s ease-in-out infinite alternate;
    }
    .section::after {
      content: '';
      position: absolute;
      width: 400px; height: 400px;
      border-radius: 50%;
      background: radial-gradient(circle, rgba(200,80,192,0.07) 0%, transparent 70%);
      bottom: 10%; right: -80px;
      pointer-events: none;
      animation: ambientGlow 10s ease-in-out infinite alternate-reverse;
    }
    @keyframes ambientGlow {
      0%   { transform: translateY(0) scale(1); opacity:.6; }
      100% { transform: translateY(-30px) scale(1.15); opacity:1; }
    }
  `;
  document.head.appendChild(glowCSS);
})();

/* ──────────────────────────────────────────────
   24. KEYBOARD ACCESSIBILITY — close mobile menu on Escape
────────────────────────────────────────────── */
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && mobileMenu.classList.contains('open')) {
    hamburger.classList.remove('open');
    mobileMenu.classList.remove('open');
  }
});

/* ──────────────────────────────────────────────
   25. PERFORMANCE — passive scroll listeners
    (already applied above where needed)
────────────────────────────────────────────── */
console.log('%c[UK] Portfolio Loaded 🚀', 'color:#ff69b4;font-family:monospace;font-size:14px;font-weight:bold;');
console.log('%cUtpreksha Kashyap — Aspiring Data Analyst', 'color:#c850c0;font-family:monospace;font-size:11px;');