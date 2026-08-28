const header = document.querySelector('[data-header]');
const hero = document.querySelector('.hero');
const progress = document.querySelector('[data-scroll-progress]');
const floatingNav = document.querySelector('[data-floating-nav]');
const floatingLinks = [...document.querySelectorAll('[data-floating-nav] a')];
const revealItems = document.querySelectorAll('.reveal-on-scroll');
const copyButton = document.querySelector('[data-copy-email]');
const toast = document.querySelector('[data-toast]');

const navSections = floatingLinks
  .map((link) => document.querySelector(link.getAttribute('href')))
  .filter(Boolean);

let scrollFramePending = false;
let toastTimer;

function setActiveSection(section) {
  if (!section) return;
  floatingLinks.forEach((link) => {
    const isActive = link.getAttribute('href') === `#${section.id}`;
    link.classList.toggle('active', isActive);
    if (isActive) link.setAttribute('aria-current', 'page');
    else link.removeAttribute('aria-current');
  });
}

function updateActiveNavigation() {
  if (!navSections.length) return;

  const nearPageEnd = window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 8;
  if (nearPageEnd) {
    setActiveSection(document.querySelector('#contact'));
    return;
  }

  const activationLine = window.scrollY + window.innerHeight * 0.34;
  let currentSection = navSections[0];

  navSections.forEach((section) => {
    if (section.offsetTop <= activationLine) currentSection = section;
  });

  setActiveSection(currentSection);
}

function updateScrollState() {
  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  const percent = scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0;
  const headerHeight = header?.offsetHeight ?? 0;
  const heroBottom = hero ? hero.offsetTop + hero.offsetHeight - headerHeight : 0;
  const heroHasPassed = !hero || window.scrollY >= heroBottom;

  header?.classList.toggle('scrolled', window.scrollY > 24);
  floatingNav?.classList.toggle('is-visible', heroHasPassed);
  floatingNav?.setAttribute('aria-hidden', String(!heroHasPassed));
  if (floatingNav) floatingNav.inert = !heroHasPassed;
  if (progress) progress.style.width = `${percent}%`;

  updateActiveNavigation();
  scrollFramePending = false;
}

function requestScrollUpdate() {
  if (scrollFramePending) return;
  scrollFramePending = true;
  window.requestAnimationFrame(updateScrollState);
}

window.addEventListener('scroll', requestScrollUpdate, { passive: true });
window.addEventListener('resize', requestScrollUpdate, { passive: true });

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12, rootMargin: '0px 0px -5% 0px' },
);

revealItems.forEach((item) => revealObserver.observe(item));

const navObserver = new IntersectionObserver(
  updateActiveNavigation,
  { threshold: [0, 0.01], rootMargin: '-24% 0px -66% 0px' },
);

navSections.forEach((section) => navObserver.observe(section));

copyButton?.addEventListener('click', async () => {
  const email = copyButton.dataset.email;
  if (!email) return;

  try {
    await navigator.clipboard.writeText(email);
  } catch {
    const helper = document.createElement('textarea');
    helper.value = email;
    helper.setAttribute('readonly', '');
    helper.style.position = 'fixed';
    helper.style.opacity = '0';
    document.body.appendChild(helper);
    helper.select();
    document.execCommand('copy');
    helper.remove();
  }

  if (toast) {
    toast.classList.add('visible');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('visible'), 2200);
  }
});

const year = document.querySelector('[data-year]');
if (year) year.textContent = String(new Date().getFullYear());

updateScrollState();
