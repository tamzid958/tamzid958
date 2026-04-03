const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
);

document.querySelectorAll('[data-reveal]').forEach((el) => revealObserver.observe(el));

const siteHeader = document.querySelector('.site-header');
const scrollProgress = document.querySelector('.scroll-progress');

window.addEventListener(
  'scroll',
  () => {
    const scrollY = window.scrollY;

    if (siteHeader) {
      siteHeader.classList.toggle('is-scrolled', scrollY > 10);
    }

    if (scrollProgress) {
      const maxScroll = document.body.scrollHeight - window.innerHeight;
      const pct = maxScroll > 0 ? (scrollY / maxScroll) * 100 : 0;
      scrollProgress.style.width = `${pct}%`;
    }
  },
  { passive: true }
);

const cursor = document.getElementById('cursor');

if (cursor) {
  cursor.style.opacity = '0';

  document.addEventListener('mousemove', (e) => {
    cursor.style.transform = `translate(${e.clientX}px, ${e.clientY}px) translate(-50%, -50%)`;
    cursor.style.opacity = '1';
  });

  document.addEventListener('mouseleave', () => {
    cursor.style.opacity = '0';
  });

  document.addEventListener('mouseenter', () => {
    cursor.style.opacity = '1';
  });
}

const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

const parseCountTarget = (text) => {
  const raw = text.trim();
  const match = raw.match(/^(\d+)([+%]?)$/);
  if (!match) return null;

  const numStr = match[1];
  const suffix = match[2] || '';
  const value = parseInt(numStr, 10);
  const padded = numStr.length === 2 && numStr[0] === '0';

  return { value, suffix, padded };
};

const animateCount = (el, target, suffix, padded, duration) => {
  const start = performance.now();

  const step = (now) => {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased = easeOutCubic(progress);
    const current = Math.round(eased * target);
    const display = padded ? String(current).padStart(2, '0') : String(current);
    el.textContent = `${display}${suffix}`;

    if (progress < 1) {
      requestAnimationFrame(step);
    }
  };

  requestAnimationFrame(step);
};

const countObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const parsed = parseCountTarget(el.textContent);
        if (parsed) {
          animateCount(el, parsed.value, parsed.suffix, parsed.padded, 1200);
        }
        countObserver.unobserve(el);
      }
    });
  },
  { threshold: 0.5 }
);

document.querySelectorAll('.track-grid span').forEach((el) => {
  if (parseCountTarget(el.textContent)) {
    countObserver.observe(el);
  }
});

const navLinks = document.querySelectorAll('.site-nav a[href^="#"]');
const sections = document.querySelectorAll('main section[id]');

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach((link) => {
          link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
        });
      }
    });
  },
  {
    rootMargin: '-30% 0px -60% 0px',
    threshold: 0,
  }
);

sections.forEach((section) => sectionObserver.observe(section));
