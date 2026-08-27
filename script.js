const header = document.querySelector('[data-header]');
const progress = document.querySelector('[data-scroll-progress]');
const menuButton = document.querySelector('[data-menu-button]');
const mobileMenu = document.querySelector('[data-mobile-menu]');
const revealItems = document.querySelectorAll('.reveal-on-scroll');
const copyButton = document.querySelector('[data-copy-email]');
const toast = document.querySelector('[data-toast]');
const floatingLinks = document.querySelectorAll('[data-floating-nav] a');

function updateScrollState() {
  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  const percent = scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0;
  header?.classList.toggle('scrolled', window.scrollY > 24);
  if (progress) progress.style.width = `${percent}%`;
}

function closeMenu() {
  menuButton?.setAttribute('aria-expanded', 'false');
  mobileMenu?.classList.remove('open');
}

menuButton?.addEventListener('click', () => {
  const open = menuButton.getAttribute('aria-expanded') === 'true';
  menuButton.setAttribute('aria-expanded', String(!open));
  mobileMenu?.classList.toggle('open', !open);
});

mobileMenu?.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeMenu));
document.addEventListener('keydown', (event) => { if (event.key === 'Escape') closeMenu(); });
window.addEventListener('scroll', updateScrollState, { passive: true });
updateScrollState();

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12, rootMargin: '0px 0px -5% 0px' },
);

revealItems.forEach((item) => observer.observe(item));

let toastTimer;
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

const navSections = [...floatingLinks]
  .map((link) => document.querySelector(link.getAttribute('href')))
  .filter(Boolean);

const navObserver = new IntersectionObserver(
  (entries) => {
    const visible = entries
      .filter((entry) => entry.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

    if (!visible) return;
    floatingLinks.forEach((link) => {
      link.classList.toggle('active', link.getAttribute('href') === `#${visible.target.id}`);
    });
  },
  { threshold: [0.15, 0.35, 0.6], rootMargin: '-18% 0px -55% 0px' },
);

navSections.forEach((section) => navObserver.observe(section));
