/* =============================================================
   main.js — interactions du portfolio
   Chargé avec "defer" : le DOM est prêt quand ce script s'exécute.
   ============================================================= */

// Année courante dans le footer
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

// Menu mobile (ouverture / fermeture)
const burger = document.getElementById('burger');
const menu = document.getElementById('menu');
if (burger && menu) {
  burger.addEventListener('click', () => menu.classList.toggle('open'));
  menu.querySelectorAll('a').forEach((a) =>
    a.addEventListener('click', () => menu.classList.remove('open'))
  );
}

// Bascule du thème clair / sombre (mémorisée dans localStorage)
const themeToggle = document.getElementById('themeToggle');
if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    const isDark = document.documentElement.classList.toggle('dark');
    try { localStorage.setItem('theme', isDark ? 'dark' : 'light'); } catch (e) {}
  });
}

// Bordure de la barre de navigation au défilement
const header = document.getElementById('top');
if (header) {
  const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 20);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

// Logo : retour en haut de page (l'ancre #top ne défile pas car l'en-tête est en position:fixed)
const brand = document.querySelector('.brand');
if (brand && (brand.getAttribute('href') === '#' || brand.getAttribute('href') === '#top')) {
  brand.addEventListener('click', (e) => {
    e.preventDefault();
    const reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' });
  });
}

// Apparition des blocs au scroll
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in');
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12, rootMargin: '0px 0px -8% 0px' }
);
document.querySelectorAll('.reveal').forEach((el) => revealObserver.observe(el));

// Apparition échelonnée des éléments du hero
document.querySelectorAll('[data-stg]').forEach((el, i) => {
  setTimeout(() => el.classList.add('in'), 120 + i * 100);
});

// Surlignage du lien de navigation correspondant à la section visible
const navLinks = Array.from(document.querySelectorAll('.nav-links a[href^="#"]'));
const linkById = {};
navLinks.forEach((link) => {
  const id = link.getAttribute('href').slice(1);
  if (id) linkById[id] = link;
});
const sectionSpy = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        navLinks.forEach((l) => l.classList.remove('active'));
        if (linkById[entry.target.id]) linkById[entry.target.id].classList.add('active');
      }
    });
  },
  { rootMargin: '-45% 0px -50% 0px' }
);
document.querySelectorAll('main section[id]').forEach((s) => sectionSpy.observe(s));
