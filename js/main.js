/* ============================================================
   PORTFOLIO – main.js
   Author  : Abhishek Pandey
   Version : 2.0  |  Feb 2026
   ============================================================ */

'use strict';

/* ══ 1. LOADER ══════════════════════════════════════════════ */
window.addEventListener('load', () => {
  const loader = document.getElementById('loader');
  setTimeout(() => {
    loader.classList.add('fade-out');
    setTimeout(() => loader.remove(), 700);
  }, 1500);
});

/* ══ 2. PARTICLE CANVAS ═════════════════════════════════════ */
(function initParticles() {
  const canvas = document.getElementById('particle-canvas');
  const ctx    = canvas.getContext('2d');
  let W, H;

  const resize = () => {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  };
  resize();
  window.addEventListener('resize', resize);

  const COUNT = 90;
  const pts = Array.from({ length: COUNT }, () => ({
    x  : Math.random() * window.innerWidth,
    y  : Math.random() * window.innerHeight,
    vx : (Math.random() - .5) * .45,
    vy : (Math.random() - .5) * .45,
    r  : Math.random() * 1.8 + .8,
  }));

  let mx = -9999, my = -9999;
  document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });

  function loop() {
    ctx.clearRect(0, 0, W, H);
    const dark    = document.documentElement.dataset.theme !== 'light';
    const ptClr   = dark ? '99,179,237' : '49,130,206';
    const lineClr = dark ? '99,179,237' : '49,130,206';

    pts.forEach(p => {
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0) p.x = W; if (p.x > W) p.x = 0;
      if (p.y < 0) p.y = H; if (p.y > H) p.y = 0;

      // mouse repel
      const dx = p.x - mx, dy = p.y - my;
      const d  = Math.hypot(dx, dy);
      if (d < 130) { p.vx += (dx / d) * .07; p.vy += (dy / d) * .07; }
      const spd = Math.hypot(p.vx, p.vy);
      if (spd > 1.6) { p.vx /= spd * .92; p.vy /= spd * .92; }

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${ptClr},.65)`;
      ctx.fill();
    });

    // connecting lines
    for (let i = 0; i < pts.length; i++) {
      for (let j = i + 1; j < pts.length; j++) {
        const d = Math.hypot(pts[i].x - pts[j].x, pts[i].y - pts[j].y);
        if (d < 135) {
          ctx.beginPath();
          ctx.moveTo(pts[i].x, pts[i].y);
          ctx.lineTo(pts[j].x, pts[j].y);
          ctx.strokeStyle = `rgba(${lineClr},${(.28 * (1 - d / 135)).toFixed(2)})`;
          ctx.lineWidth   = .7;
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(loop);
  }
  loop();
})();

/* ══ 3. CURSOR GLOW ═════════════════════════════════════════ */
(function initCursorGlow() {
  const el = document.createElement('div');
  el.className = 'cursor-glow';
  document.body.appendChild(el);
  document.addEventListener('mousemove', e => {
    el.style.left = e.clientX + 'px';
    el.style.top  = e.clientY + 'px';
  });
})();

/* ══ 4. TYPED TEXT ══════════════════════════════════════════ */
(function initTyped() {
  const roles = [
    'BI Developer 💻',
    'Data Engineer 🌐',
    'Problem Solver 🧩',
    'Cloud Enthusiast ☁️',
    'Open Source Contributor 🔓',
    'Automation Architect 🔗',
  ];
  const el = document.getElementById('typed-text');
  if (!el) return;
  let ri = 0, ci = 0, deleting = false;

  function tick() {
    const cur = roles[ri];
    if (!deleting) {
      el.textContent = cur.slice(0, ++ci);
      if (ci === cur.length) {
        setTimeout(() => { deleting = true; tick(); }, 1900);
        return;
      }
    } else {
      el.textContent = cur.slice(0, --ci);
      if (ci === 0) { deleting = false; ri = (ri + 1) % roles.length; }
    }
    setTimeout(tick, deleting ? 50 : 92);
  }
  tick();
})();

/* ══ 5. COUNTER ANIMATION ═══════════════════════════════════ */
function animateCounters() {
  document.querySelectorAll('[data-target]').forEach(el => {
    const target = +el.dataset.target;
    let cur = 0;
    const step = Math.ceil(target / 50);
    const id = setInterval(() => {
      cur = Math.min(cur + step, target);
      el.textContent = cur + '+';
      if (cur >= target) clearInterval(id);
    }, 35);
  });
}

/* ══ 6. INTERSECTION OBSERVER HELPERS ══════════════════════ */
function makeObserver(selector, className, options = {}) {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add(className);
        obs.unobserve(e.target);
      }
    });
  }, { threshold: .12, ...options });
  document.querySelectorAll(selector).forEach(el => obs.observe(el));
}

// Scroll reveal
makeObserver('.reveal',       'visible');
makeObserver('.reveal-left',  'visible');
makeObserver('.reveal-right', 'visible');

// Counter trigger (hero)
const heroObs = new IntersectionObserver(entries => {
  if (entries[0].isIntersecting) { animateCounters(); heroObs.disconnect(); }
}, { threshold: .3 });
const heroEl = document.getElementById('hero');
if (heroEl) heroObs.observe(heroEl);

// Skill bars
const skillObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.querySelectorAll('.skill-fill').forEach(bar => {
        bar.style.width = bar.dataset.width + '%';
        setTimeout(() => bar.classList.add('animated'), 900);
      });
      skillObs.unobserve(e.target);
    }
  });
}, { threshold: .2 });
document.querySelectorAll('.skills-bars').forEach(el => skillObs.observe(el));

/* ══ 7. ACTIVE NAV HIGHLIGHT ════════════════════════════════ */
(function initNavHighlight() {
  const sections  = document.querySelectorAll('section[id]');
  const navLinks  = document.querySelectorAll('.nav-links a');
  const navbar    = document.getElementById('navbar');

  window.addEventListener('scroll', () => {
    // scrolled shadow
    navbar.classList.toggle('scrolled', window.scrollY > 20);

    // active link
    let cur = '';
    sections.forEach(s => {
      if (window.scrollY >= s.offsetTop - 130) cur = s.id;
    });
    navLinks.forEach(a => {
      a.classList.toggle('active', a.getAttribute('href') === `#${cur}`);
    });
  }, { passive: true });
})();

/* ══ 8. THEME TOGGLE ════════════════════════════════════════ */
(function initTheme() {
  const btn  = document.getElementById('themeToggle');
  const root = document.documentElement;
  let dark   = true;

  // persist preference
  const saved = localStorage.getItem('portfolio-theme');
  if (saved === 'light') { dark = false; root.dataset.theme = 'light'; btn.innerHTML = '<i class="fas fa-sun"></i>'; }

  btn.addEventListener('click', () => {
    dark = !dark;
    root.dataset.theme = dark ? 'dark' : 'light';
    btn.innerHTML      = dark ? '<i class="fas fa-moon"></i>' : '<i class="fas fa-sun"></i>';
    localStorage.setItem('portfolio-theme', dark ? 'dark' : 'light');
    showToast(dark ? '🌙 Dark mode on' : '☀️ Light mode on');
  });
})();

/* ══ 9. MOBILE MENU ═════════════════════════════════════════ */
(function initMobileMenu() {
  const btn  = document.getElementById('menuToggle');
  const menu = document.getElementById('mobileMenu');
  const icon = btn.querySelector('i');

  btn.addEventListener('click', () => {
    const open = menu.classList.toggle('open');
    icon.className = open ? 'fas fa-times' : 'fas fa-bars';
  });
  menu.querySelectorAll('a').forEach(a =>
    a.addEventListener('click', () => {
      menu.classList.remove('open');
      icon.className = 'fas fa-bars';
    })
  );
})();

/* ══ 10. PROJECT FILTER + SEARCH ════════════════════════════ */
(function initProjects() {
  const pills  = document.querySelectorAll('.filter-pill');
  const cards  = document.querySelectorAll('.project-card');
  const search = document.getElementById('projectSearch');

  function applyFilter() {
    const active = document.querySelector('.filter-pill.active')?.dataset.filter || 'all';
    const query  = search ? search.value.toLowerCase().trim() : '';

    cards.forEach(card => {
      const catMatch   = active === 'all' || card.dataset.cat === active;
      const title      = card.querySelector('.project-title')?.textContent.toLowerCase() || '';
      const desc       = card.querySelector('.project-desc')?.textContent.toLowerCase()  || '';
      const stackText  = [...card.querySelectorAll('.stack-pill')].map(p => p.textContent.toLowerCase()).join(' ');
      const textMatch  = !query || title.includes(query) || desc.includes(query) || stackText.includes(query);

      card.classList.toggle('hidden', !(catMatch && textMatch));
    });
  }

  pills.forEach(pill => {
    pill.addEventListener('click', () => {
      pills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      applyFilter();
    });
  });

  if (search) search.addEventListener('input', applyFilter);
})();

/* ══ 11. SCROLL TO TOP ══════════════════════════════════════ */
(function initScrollTop() {
  const btn      = document.getElementById('scroll-top');
  const progress = document.getElementById('scroll-progress');

  window.addEventListener('scroll', () => {
    btn.classList.toggle('show', window.scrollY > 450);

    // scroll progress bar
    if (progress) {
      const total  = document.documentElement.scrollHeight - window.innerHeight;
      const pct    = total > 0 ? (window.scrollY / total) * 100 : 0;
      progress.style.width = pct + '%';
    }
  }, { passive: true });

  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
})();

/* ══ 12. CONTACT FORM ═══════════════════════════════════════ */
// Form removed – contact is now handled via WhatsApp
// Character counter kept in case it's reused elsewhere

/* ══ 13. TOAST NOTIFICATIONS ════════════════════════════════ */
function showToast(msg, duration = 3000) {
  let toast = document.querySelector('.toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'toast';
    document.body.appendChild(toast);
  }
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), duration);
}

/* ══ 14. RESUME DOWNLOAD ════════════════════════════════════ */
// Only the hero "Download CV" button triggers a file download
document.querySelectorAll('.download-cv').forEach(btn => {
  btn.addEventListener('click', e => {
    e.preventDefault();
    const link = document.createElement('a');
    link.href     = 'assets/resume.pdf';
    link.download = 'Resume.pdf';
    link.click();
    showToast('📄 Downloading resume…');
  });
});

// About section "View Resume" — opens PDF in a new tab (no duplicate download)
const viewResumeBtn = document.querySelector('.info-list .btn-primary');
if (viewResumeBtn) {
  viewResumeBtn.addEventListener('click', e => {
    e.preventDefault();
    window.open('assets/resume.pdf', '_blank');
    showToast('📄 Opening resume…');
  });
}

/* ══ 15. SMOOTH SECTION SCROLL (offset for fixed nav) ══════ */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const navH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h'));
    window.scrollTo({ top: target.offsetTop - navH, behavior: 'smooth' });
  });
});

/* ══ 16. STAGGER REVEAL DELAYS ══════════════════════════════ */
document.querySelectorAll('.certs-grid .cert-card, .tech-grid .tech-item, .traits-grid .trait-card').forEach((el, i) => {
  el.style.transitionDelay = `${i * 0.07}s`;
});

/* ══ 17. COPY EMAIL TO CLIPBOARD ════════════════════════════ */
document.querySelectorAll('[data-copy]').forEach(el => {
  el.addEventListener('click', () => {
    navigator.clipboard.writeText(el.dataset.copy).then(() => {
      showToast('📋 Copied to clipboard!');
    });
  });
});

/* ══ 18. PROJECT CARD 3-D TILT ══════════════════════════════ */
(function initCardTilt() {
  const cards = document.querySelectorAll('.project-card');
  const MAX_TILT = 8; // degrees

  cards.forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect   = card.getBoundingClientRect();
      const cx     = rect.left + rect.width  / 2;
      const cy     = rect.top  + rect.height / 2;
      const dx     = (e.clientX - cx) / (rect.width  / 2);
      const dy     = (e.clientY - cy) / (rect.height / 2);
      const rotateX =  dy * -MAX_TILT;
      const rotateY =  dx *  MAX_TILT;
      card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
})();
