/* ============================
   JAVASCRIPT - script.js
   Anil Shevkar Portfolio
   ============================ */

'use strict';

// ============================================================
//  1. PARTICLE SYSTEM
// ============================================================
const canvas = document.getElementById('particle-canvas');
const ctx    = canvas.getContext('2d');

let particles = [];
let mouse     = { x: null, y: null };

function resizeCanvas() {
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

class Particle {
  constructor() { this.reset(); }

  reset() {
    this.x     = Math.random() * canvas.width;
    this.y     = Math.random() * canvas.height;
    this.size  = Math.random() * 1.8 + 0.3;
    this.speedX = (Math.random() - 0.5) * 0.35;
    this.speedY = (Math.random() - 0.5) * 0.35;
    this.life  = Math.random();
    this.color = this._pickColor();
  }

  _pickColor() {
    const palette = [
      'rgba(79,142,247,',
      'rgba(168,85,247,',
      'rgba(34,211,238,',
      'rgba(16,185,129,',
    ];
    return palette[Math.floor(Math.random() * palette.length)];
  }

  draw() {
    this.life += 0.003;
    const alpha = Math.sin(this.life * Math.PI) * 0.6;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = this.color + alpha + ')';
    ctx.fill();
  }

  update() {
    this.x += this.speedX;
    this.y += this.speedY;

    // Mouse repulsion
    if (mouse.x && mouse.y) {
      const dx   = this.x - mouse.x;
      const dy   = this.y - mouse.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 120) {
        const force = (120 - dist) / 120;
        this.x += (dx / dist) * force * 1.5;
        this.y += (dy / dist) * force * 1.5;
      }
    }

    if (this.life >= 1 || this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) {
      this.reset();
    }
  }
}

// Init particles
const PARTICLE_COUNT = 120;
for (let i = 0; i < PARTICLE_COUNT; i++) particles.push(new Particle());

// Draw connecting lines between close particles
function drawConnections() {
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx   = particles[i].x - particles[j].x;
      const dy   = particles[i].y - particles[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 100) {
        const alpha = (1 - dist / 100) * 0.12;
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.strokeStyle = `rgba(79,142,247,${alpha})`;
        ctx.lineWidth   = 0.8;
        ctx.stroke();
      }
    }
  }
}

function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawConnections();
  particles.forEach(p => { p.update(); p.draw(); });
  requestAnimationFrame(animateParticles);
}
animateParticles();

window.addEventListener('mousemove', e => { mouse.x = e.clientX; mouse.y = e.clientY; });
window.addEventListener('mouseleave', () => { mouse.x = null; mouse.y = null; });


// ============================================================
//  2. CUSTOM CURSOR
// ============================================================
const cursorDot      = document.getElementById('cursor');
const cursorFollower = document.getElementById('cursor-follower');

let followerX = 0, followerY = 0;
let cursorX   = 0, cursorY   = 0;

document.addEventListener('mousemove', e => {
  cursorX = e.clientX;
  cursorY = e.clientY;
  cursorDot.style.left = cursorX + 'px';
  cursorDot.style.top  = cursorY + 'px';
});

function animateCursor() {
  followerX += (cursorX - followerX) * 0.12;
  followerY += (cursorY - followerY) * 0.12;
  cursorFollower.style.left = followerX + 'px';
  cursorFollower.style.top  = followerY + 'px';
  requestAnimationFrame(animateCursor);
}
animateCursor();

// Cursor states on interactive elements
document.querySelectorAll('a, button, input, textarea').forEach(el => {
  el.addEventListener('mouseenter', () => cursorDot.style.transform = 'translate(-50%,-50%) scale(2)');
  el.addEventListener('mouseleave', () => cursorDot.style.transform = 'translate(-50%,-50%) scale(1)');
});


// ============================================================
//  3. TYPED TEXT ANIMATION
// ============================================================
const phrases = [
  'SAP ABAP Consultant',
  'ALV Report Developer',
  'OData & Fiori Engineer',
  'S/4HANA Explorer',
  'Enterprise Solution Builder',
];

let phraseIdx  = 0;
let charIdx    = 0;
let isDeleting = false;
const typedEl  = document.getElementById('typed-text');

function type() {
  const phrase  = phrases[phraseIdx];
  const current = isDeleting ? phrase.slice(0, charIdx - 1) : phrase.slice(0, charIdx + 1);

  typedEl.textContent = current;
  isDeleting ? charIdx-- : charIdx++;

  let delay = isDeleting ? 45 : 95;

  if (!isDeleting && charIdx === phrase.length) {
    delay = 1800;
    isDeleting = true;
  } else if (isDeleting && charIdx === 0) {
    isDeleting = false;
    phraseIdx  = (phraseIdx + 1) % phrases.length;
    delay      = 400;
  }

  setTimeout(type, delay);
}
type();


// ============================================================
//  4. NAVBAR: SCROLL BEHAVIOUR + ACTIVE LINK
// ============================================================
const navbar   = document.getElementById('navbar');
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');

window.addEventListener('scroll', () => {
  // Scrolled class
  navbar.classList.toggle('scrolled', window.scrollY > 30);

  // Active section
  let current = '';
  sections.forEach(section => {
    if (window.scrollY >= section.offsetTop - 140) {
      current = section.id;
    }
  });
  navLinks.forEach(link => {
    link.classList.toggle('active', link.dataset.section === current);
  });
});


// ============================================================
//  5. HAMBURGER MENU
// ============================================================
const hamburger = document.getElementById('hamburger');
const navMenu   = document.getElementById('nav-links');

hamburger.addEventListener('click', () => {
  navMenu.classList.toggle('open');
  const spans = hamburger.querySelectorAll('span');
  if (navMenu.classList.contains('open')) {
    spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
    spans[1].style.opacity   = '0';
    spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
  } else {
    spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
  }
});

navLinks.forEach(link => {
  link.addEventListener('click', () => {
    navMenu.classList.remove('open');
    hamburger.querySelectorAll('span').forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
  });
});


// ============================================================
//  6. SCROLL REVEAL ANIMATION
// ============================================================
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('revealed');
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right')
        .forEach(el => revealObserver.observe(el));


// ============================================================
//  7. SKILL BAR ANIMATION
// ============================================================
const barObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.skill-bar-fill').forEach(bar => {
        const width = bar.dataset.width;
        bar.style.width = width + '%';
      });
      barObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });

const profSection = document.querySelector('.proficiency-section');
if (profSection) barObserver.observe(profSection);


// ============================================================
//  8. COUNTER ANIMATION (HERO STATS)
// ============================================================
function animateCounter(el, target, duration = 1600) {
  let start   = 0;
  const step  = target / (duration / 16);
  const timer = setInterval(() => {
    start += step;
    if (start >= target) { start = target; clearInterval(timer); }
    el.textContent = Math.floor(start);
  }, 16);
}

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('[data-target]').forEach(el => {
        animateCounter(el, parseInt(el.dataset.target));
      });
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

const heroStats = document.querySelector('.hero-stats');
if (heroStats) counterObserver.observe(heroStats);


// ============================================================
//  9. GLOWING CARD MOUSE TRACK (skill & about cards)
// ============================================================
function addCardGlowEffect(selector) {
  document.querySelectorAll(selector).forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x    = ((e.clientX - rect.left) / rect.width)  * 100;
      const y    = ((e.clientY - rect.top)  / rect.height) * 100;
      card.style.setProperty('--mouse-x', x + '%');
      card.style.setProperty('--mouse-y', y + '%');
      card.style.background = `
        radial-gradient(circle at ${x}% ${y}%, rgba(79,142,247,0.08) 0%, transparent 60%),
        var(--bg-card)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.background = '';
    });
  });
}

addCardGlowEffect('.skill-category');
addCardGlowEffect('.about-card');
addCardGlowEffect('.edu-card');
addCardGlowEffect('.timeline-card');


// ============================================================
//  10. FLOATING BADGES PARALLAX ON HERO
// ============================================================
window.addEventListener('mousemove', e => {
  const mx = (e.clientX / window.innerWidth  - 0.5) * 20;
  const my = (e.clientY / window.innerHeight - 0.5) * 20;
  document.querySelectorAll('.floating-badge').forEach((badge, i) => {
    const depth = (i + 1) * 0.4;
    badge.style.transform = `translate(${mx * depth}px, ${my * depth}px)`;
  });
  const hex = document.querySelector('.avatar-hex');
  if (hex) hex.style.transform = `translateY(-16px) rotateY(${mx * 0.3}deg) rotateX(${-my * 0.3}deg)`;
});


// ============================================================
//  11. CONTACT FORM (visual demo – no backend)
// ============================================================
const contactForm = document.getElementById('contact-form');
const formSuccess = document.getElementById('form-success');

if (contactForm) {
  contactForm.addEventListener('submit', e => {
    e.preventDefault();
    const btn = contactForm.querySelector('.btn-submit');
    btn.disabled      = true;
    btn.style.opacity = '0.7';
    btn.querySelector('span').textContent = 'Sending…';

    setTimeout(() => {
      btn.disabled      = false;
      btn.style.opacity = '';
      btn.querySelector('span').textContent = 'Send Message';
      formSuccess.style.display = 'block';
      contactForm.reset();
      setTimeout(() => { formSuccess.style.display = 'none'; }, 5000);
    }, 1400);
  });
}


// ============================================================
//  12. SMOOTH SECTION ENTRANCE GLOW ON HERO NAME
// ============================================================
const heroName = document.getElementById('hero-name');
if (heroName) {
  setTimeout(() => { heroName.style.opacity = '1'; heroName.style.transform = 'none'; }, 100);
}


// ============================================================
//  13. SCROLL PROGRESS INDICATOR
// ============================================================
const progressBar = document.createElement('div');
progressBar.id    = 'scroll-progress';
Object.assign(progressBar.style, {
  position:   'fixed',
  top:        '0',
  left:       '0',
  height:     '3px',
  width:      '0%',
  background: 'linear-gradient(90deg,#4f8ef7,#a855f7,#22d3ee)',
  zIndex:     '9999',
  transition: 'width 0.1s linear',
  boxShadow:  '0 0 8px rgba(79,142,247,0.8)',
});
document.body.appendChild(progressBar);

window.addEventListener('scroll', () => {
  const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
  const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
  progressBar.style.width = ((scrollTop / docHeight) * 100) + '%';
});


// ============================================================
//  14. TILT EFFECT ON EDU & ABOUT CARDS
// ============================================================
function addTiltEffect(selector, intensity = 8) {
  document.querySelectorAll(selector).forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect    = card.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top  + rect.height / 2;
      const rotateX = ((e.clientY - centerY) / (rect.height / 2)) * -intensity;
      const rotateY = ((e.clientX - centerX) / (rect.width  / 2)) *  intensity;
      card.style.transform    = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
      card.style.transition   = 'transform 0.1s ease';
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform  = '';
      card.style.transition = 'transform 0.5s ease, box-shadow 0.4s ease, border-color 0.4s ease';
    });
  });
}

addTiltEffect('.edu-card',   6);
addTiltEffect('.about-card', 5);


// ============================================================
//  15. GLITCHY TEXT ON NAME (subtle, looping)
// ============================================================
const accentGlow = document.querySelector('.accent-glow');
if (accentGlow) {
  function glitch() {
    const chars  = 'ABCD£$#ŜΨΛΔΩ';
    const orig   = 'Shevkar';
    let  glitched = '';
    for (let i = 0; i < orig.length; i++) {
      glitched += Math.random() < 0.15
        ? chars[Math.floor(Math.random() * chars.length)]
        : orig[i];
    }
    accentGlow.textContent = glitched;
    setTimeout(() => { accentGlow.textContent = orig; }, 80);
  }
  setInterval(glitch, 3500);
}


// ============================================================
//  16. SECTION BACKGROUND PARALLAX
// ============================================================
window.addEventListener('scroll', () => {
  const heroImg = document.querySelector('.hero-bg-img');
  if (heroImg) {
    heroImg.style.transform = `translateY(${window.scrollY * 0.3}px)`;
  }
});


// ============================================================
//  17. TAG HOVER RIPPLE
// ============================================================
document.querySelectorAll('.tag').forEach(tag => {
  tag.addEventListener('click', e => {
    const ripple = document.createElement('span');
    Object.assign(ripple.style, {
      position:    'absolute',
      borderRadius:'50%',
      width:       '0',
      height:      '0',
      background:  'rgba(255,255,255,0.3)',
      transform:   'translate(-50%,-50%)',
      animation:   'ripple 0.6s ease-out forwards',
      left:        (e.offsetX) + 'px',
      top:         (e.offsetY) + 'px',
      pointerEvents: 'none',
    });
    tag.style.position = 'relative';
    tag.style.overflow = 'hidden';
    tag.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);
  });
});

// Inject ripple keyframe
const rippleStyle = document.createElement('style');
rippleStyle.textContent = `
  @keyframes ripple {
    to { width: 100px; height: 100px; opacity: 0; }
  }
  @keyframes fadeSlideUp {
    from { opacity: 0; transform: translateY(20px); }
    to   { opacity: 1; transform: translateY(0); }
  }
`;
document.head.appendChild(rippleStyle);


// ============================================================
//  18. INITIALISE HERO REVEAL WITH STAGGER
// ============================================================
document.querySelectorAll('.hero .reveal-up').forEach((el, i) => {
  el.style.animationDelay = (i * 0.12) + 's';
  el.style.animation      = `fadeSlideUp 0.7s ease forwards`;
  el.style.opacity        = '0';
});

const heroRight = document.querySelector('.reveal-right');
if (heroRight) {
  setTimeout(() => { heroRight.classList.add('revealed'); }, 400);
}

console.log('%c⚡ Anil Shevkar Portfolio loaded!', 'color:#4f8ef7;font-size:1.1rem;font-weight:bold;');
console.log('%cSAP ABAP Consultant | Pune, India', 'color:#a855f7;font-size:0.9rem;');
