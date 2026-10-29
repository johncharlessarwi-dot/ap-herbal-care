// ============================================
// A.P HERBAL CARE — main.js
// ============================================

// --- Navbar scroll effect ---
const navbar = document.getElementById('navbar');
if (navbar) {
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
  }, { passive: true });
}

// --- Accessible mobile navigation ---
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');

if (hamburger && navLinks) {
  // Keep the menu's state available to assistive technology.
  hamburger.setAttribute('aria-controls', navLinks.id || 'navLinks');
  hamburger.setAttribute('aria-expanded', 'false');
  hamburger.setAttribute('aria-label', 'Fungua menyu');

  const setMenuOpen = (isOpen, { returnFocus = false } = {}) => {
    navLinks.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-expanded', String(isOpen));
    hamburger.setAttribute('aria-label', isOpen ? 'Funga menyu' : 'Fungua menyu');
    document.body.style.overflow = isOpen ? 'hidden' : '';

    if (isOpen) {
      const firstLink = navLinks.querySelector('a[href]');
      firstLink?.focus();
    } else if (returnFocus) {
      hamburger.focus();
    }
  };

  hamburger.addEventListener('click', () => {
    const isOpen = hamburger.getAttribute('aria-expanded') !== 'true';
    setMenuOpen(isOpen);
  });

  // Close the menu after a visitor chooses a destination.
  navLinks.querySelectorAll('a[href]').forEach(link => {
    link.addEventListener('click', () => setMenuOpen(false));
  });

  // Escape provides a predictable keyboard exit from the open menu.
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && hamburger.getAttribute('aria-expanded') === 'true') {
      setMenuOpen(false, { returnFocus: true });
    }
  });

  // If the viewport changes to desktop while the menu is open, reset its state.
  window.addEventListener('resize', () => {
    if (window.innerWidth > 768 && hamburger.getAttribute('aria-expanded') === 'true') {
      setMenuOpen(false);
    }
  }, { passive: true });
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
    const linkFile = href.split('/').pop().split('#')[0] || '';
    const isHome = currentPath === 'index.html' || currentPath === '';
    const isLinkHome = linkFile === 'index.html' || linkFile === '' || href === '/' || href === './';

    if ((isHome && isLinkHome) || (linkFile && linkFile === currentPath)) {
      link.classList.add('active');
      link.setAttribute('aria-current', 'page');
    } else {
      link.removeAttribute('aria-current');
    }
  });
}
setActiveNav();

// --- Scroll fade-in animations (for pages that have the elements) ---
const fadeEls = document.querySelectorAll(
  '.service-card, .contact-card, .why-point, .about-text, .about-visual, .product-card'
);

if (fadeEls.length && 'IntersectionObserver' in window) {
  fadeEls.forEach(el => el.classList.add('fade-in'));

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const siblings = Array.from(entry.target.parentElement.children);
          const idx = siblings.indexOf(entry.target);
          window.setTimeout(() => entry.target.classList.add('visible'), idx * 70);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
  );

  fadeEls.forEach(el => observer.observe(el));
} else {
  // Content remains visible in browsers without IntersectionObserver.
  fadeEls.forEach(el => el.classList.add('visible'));
}

// --- Smooth active nav highlight on scroll (only on pages with sections) ---
const sections = document.querySelectorAll('section[id], header[id]');
const navAnchors = document.querySelectorAll('.nav-links a');

if (sections.length && navAnchors.length && 'IntersectionObserver' in window) {
  const sectionObserver = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          navAnchors.forEach(anchor => {
            anchor.classList.remove('active');
            if (anchor.getAttribute('href')?.startsWith('#')) {
              anchor.removeAttribute('aria-current');
            }
          });
          const match = document.querySelector(`.nav-links a[href="#${entry.target.id}"]`);
          if (match) {
            match.classList.add('active');
            match.setAttribute('aria-current', 'location');
          }
        }
      });
    },
    { threshold: 0.4 }
  );

  sections.forEach(section => sectionObserver.observe(section));
}
