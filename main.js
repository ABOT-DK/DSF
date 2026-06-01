
/* ── Navbar: shadow on scroll ───────────────────── */
const navbar   = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const mobileNav = document.getElementById('mobileNav');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 20);
});

/* ── Mobile nav toggle ──────────────────────────── */
hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  mobileNav.classList.toggle('open');
});

/* Close mobile nav when a link is clicked */
document.querySelectorAll('.mobile-nav__link').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    mobileNav.classList.remove('open');
  });
});

/* ── Active nav link on scroll (scroll spy) ─────── */
const sections = document.querySelectorAll('section[id]');
const navLinks  = document.querySelectorAll('.navbar__link');

const spyObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinks.forEach(l => l.classList.remove('active'));
      const active = document.querySelector(`.navbar__link[href="#${entry.target.id}"]`);
      if (active) active.classList.add('active');
    }
  });
}, { rootMargin: '-40% 0px -55% 0px' });

sections.forEach(s => spyObserver.observe(s));

/* ── Fade-in on scroll ──────────────────────────── */
const fadeTargets = document.querySelectorAll(
  '.stats__item, .story-card, .team-card, .testimonial-card, ' +
  '.hero__content, .about__text-col, .about__cta-col, ' +
  '.mission__inner, .contact__cta-card, .contact__form-col'
);

fadeTargets.forEach((el, i) => {
  el.classList.add('fade-in');
  el.style.transitionDelay = `${(i % 4) * 80}ms`;
});

const fadeObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      fadeObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

fadeTargets.forEach(el => fadeObserver.observe(el));

/* ── Animated stat counters ─────────────────────── */
const statNums = document.querySelectorAll('.stats__num');

function animateCount(el) {
  const raw    = el.textContent.trim();
  const hasPlusSign = raw.endsWith('+');
  const target = parseInt(raw.replace(/[^0-9]/g, ''), 10);
  const duration = 1400;
  const startTime = performance.now();

  function step(now) {
    const elapsed  = now - startTime;
    const progress = Math.min(elapsed / duration, 1);
    // ease-out cubic
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = Math.round(eased * target);
    el.textContent = current.toLocaleString() + (hasPlusSign ? '+' : '');
    if (progress < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

const counterObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCount(entry.target);
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

statNums.forEach(el => counterObserver.observe(el));

/* ── Send Message toast ─────────────────────────── */
const sendBtn  = document.getElementById('sendBtn');
const textarea = document.querySelector('.contact__textarea');

sendBtn.addEventListener('click', () => {
  const msg = textarea.value.trim();
  if (!msg) {
    shakeEl(textarea);
    return;
  }
  showToast('Message sent! We\'ll be in touch soon. 💚');
  textarea.value = '';
});

function shakeEl(el) {
  el.style.animation = 'none';
  el.offsetHeight; // reflow
  el.style.animation = 'shake .4s ease';
  setTimeout(() => el.style.animation = '', 400);
}

function showToast(text) {
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = text;
  document.body.appendChild(toast);
  // force reflow
  toast.offsetHeight;
  toast.classList.add('toast--visible');
  setTimeout(() => {
    toast.classList.remove('toast--visible');
    setTimeout(() => toast.remove(), 400);
  }, 3500);
}

/* ── Inject toast + shake keyframes ─────────────── */
const style = document.createElement('style');
style.textContent = `
  .toast {
    position: fixed;
    bottom: 2rem;
    left: 50%;
    transform: translateX(-50%) translateY(20px);
    background: #1b3a2d;
    color: #f0ebe3;
    padding: .9rem 2rem;
    border-radius: 999px;
    font-family: 'DM Sans', sans-serif;
    font-size: .92rem;
    opacity: 0;
    transition: opacity .35s, transform .35s;
    pointer-events: none;
    z-index: 999;
    white-space: nowrap;
  }
  .toast--visible {
    opacity: 1;
    transform: translateX(-50%) translateY(0);
  }
  @keyframes shake {
    0%,100% { transform: translateX(0); }
    20%      { transform: translateX(-8px); }
    40%      { transform: translateX(8px); }
    60%      { transform: translateX(-5px); }
    80%      { transform: translateX(5px); }
  }
`;
document.head.appendChild(style);
