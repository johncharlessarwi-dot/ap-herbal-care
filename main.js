// ============================================
// A.P HERBAL CARE — main.js
// ============================================

// --- Navbar scroll effect ---
const navbar = document.getElementById('navbar');
if (navbar) {
  window.addEventListener('scroll', () => {
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });
}

// --- Mobile hamburger menu ---
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');

if (hamburger && navLinks) {
  hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('open');
    document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
  });

  // Close nav on link click
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      document.body.style.overflow = '';
    });
  });
}

// --- Current page nav highlighting (multi-page support) ---
function setActiveNav() {
  const links = document.querySelectorAll('.nav-links a');
  if (!links.length) return;

  let currentPath = window.location.pathname.split('/').pop() || 'index.html';
  if (currentPath === '') currentPath = 'index.html';

  links.forEach(link => {
    link.classList.remove('active');
    const href = link.getAttribute('href') || '';
    // Handle absolute root, index, or matching filename (ignore hashes)
    const linkFile = href.split('/').pop().split('#')[0] || '';
    const isHome = (currentPath === 'index.html' || currentPath === '');
    const isLinkHome = (linkFile === 'index.html' || linkFile === '' || href === '/' || href === './');

    if ((isHome && isLinkHome) || (linkFile && linkFile === currentPath)) {
      link.classList.add('active');
    }
  });
}
setActiveNav();

// --- Scroll fade-in animations (for pages that have the elements) ---
const fadeEls = document.querySelectorAll(
  '.service-card, .contact-card, .why-point, .about-text, .about-visual, .product-card'
);

if (fadeEls.length) {
  fadeEls.forEach(el => el.classList.add('fade-in'));

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const siblings = Array.from(entry.target.parentElement.children);
          const idx = siblings.indexOf(entry.target);
          setTimeout(() => {
            entry.target.classList.add('visible');
          }, idx * 70);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
  );

  fadeEls.forEach(el => observer.observe(el));
}

// --- Smooth active nav highlight on scroll (only on pages with sections) ---
const sections = document.querySelectorAll('section[id], header[id]');
const navAnchors = document.querySelectorAll('.nav-links a');

if (sections.length && navAnchors.length) {
  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          navAnchors.forEach(a => a.classList.remove('active'));
          const match = document.querySelector(`.nav-links a[href="#${entry.target.id}"]`);
          if (match) match.classList.add('active');
        }
      });
    },
    { threshold: 0.4 }
  );

  sections.forEach(s => sectionObserver.observe(s));
}

// Optional: style for .active if not in css yet (fallback)
document.querySelectorAll('.nav-links a.active').forEach(a => {
  // ensure visible active state; CSS will enhance
});
