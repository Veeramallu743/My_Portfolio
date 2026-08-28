# Veer Mallu Panchumarthi — Portfolio

Personal portfolio of **Veer Mallu Panchumarthi**, a Senior AI Engineer working on
production-ready Generative AI, Agentic AI, RAG, machine learning, FastAPI and GCP
systems.

**Live site:** https://veeramallu743.github.io/My_Portfolio/
**Repository:** https://github.com/Veeramallu743/My_Portfolio
**Published from:** the `Portfolio` branch (GitHub Pages → *Deploy from branch* → `Portfolio` / root).

---

## Main features

- Single-page portfolio: hero, career highlight strip, about, selected work,
  experience timeline, stack, and contact — in that order.
- Dark navy / blue / sand visual language with restrained, purposeful motion.
- Fully responsive, mobile-first layout (verified 320 → 1920 px).
- Fixed top navigation: a `VM` brand mark, a pill nav (Home · About · Work ·
  Experience · Stack · Contact) with a gradient active pill and `aria-current`,
  and inline-SVG profile icons (GitHub, LinkedIn, email). On phones the pill row
  becomes a horizontally scrollable strip that keeps the active pill in view.
- The résumé (`assets/resume.pdf`) is offered from the hero call-to-action and the
  contact block, alongside a printable HTML version (`assets/resume.html`).
- One-click "copy email" with a real clipboard fallback and honest success / failure
  feedback.
- Optimised, responsive imagery (`<picture>` WebP + JPEG, each well under 150 KB).
- Complete SEO / social metadata: canonical URL, Open Graph + Twitter cards with
  absolute image URLs, JSON-LD `Person` structured data, `robots.txt`, `sitemap.xml`,
  and favicons (SVG, 16/32 PNG, `.ico`, apple-touch-icon).

## Tech

No build step, no dependencies — semantic HTML, modern CSS, and a single small
vanilla-JS file. `main.py` is an optional zero-dependency static file server for
local preview.

## Local preview

Any static server works. The bundled one:

```bash
python main.py                 # http://127.0.0.1:8000
python main.py --port 5000     # custom port
```

or with Python's built-in server:

```bash
python -m http.server 8000
```

Then open <http://127.0.0.1:8000/>.

## File structure

```
My_Portfolio/
├── index.html          # the page (all content + metadata)
├── styles.css          # all styling, mobile-first with min/media queries
├── script.js           # progressive-enhancement interactions (IIFE, feature-detected)
├── main.py             # optional local static server (stdlib only)
├── favicon.ico         # root fallback favicon
├── robots.txt          # crawl policy + sitemap reference
├── sitemap.xml         # single-URL sitemap
├── README.md
├── docs/
│   └── github-profile-README.md   # copy into a repo named "Veeramallu743" for the GitHub profile
└── assets/
    ├── veer-mallu-panchumarthi.webp / .jpg   # hero portrait (900×1125)
    ├── og-reference-ui.jpg / .webp           # social preview image (1200×630)
    ├── og-classic.jpg / .webp                # alternate social preview (unused)
    ├── favicon.svg, favicon-16x16.png, favicon-32x32.png, favicon.ico
    ├── apple-touch-icon.png                  # 180×180
    ├── resume.pdf                            # downloadable résumé
    └── resume.html                           # printable résumé
```

## Responsive & accessibility features

**Responsive**

- Mobile-first CSS; layout verified at 320, 360, 375, 390, 768, 1024, 1280, 1440 and
  1920 px, in portrait and landscape.
- No horizontal overflow at any width; hero headline (incl. "Production-Ready") never
  clips or forces a scrollbar.
- Project cards collapse cleanly from two columns to one; about, timeline, stack,
  education and contact all have dedicated single-column mobile layouts.
- On phones the header becomes two rows (brand + icons, then the scrollable pill
  nav) and the hero clears it.
- `env(safe-area-inset-*)` support so the header respects notches and home
  indicators; `viewport-fit=cover`.

**Accessibility**

- Skip-to-content link, one `<h1>`, logical `h2`/`h3` hierarchy, landmark regions.
- All content is visible with JavaScript disabled — the reveal animation is gated on a
  `js` class added by an inline script, and there is an `IntersectionObserver`
  fallback for browsers without it.
- Visible keyboard focus styles on every interactive element; `<details>` panels work
  with Enter/Space.
- Active section exposed with `aria-current`; decorative graphics use `aria-hidden`;
  links, images, tag lists and controls have accessible names.
- Honours `prefers-reduced-motion` (pauses the ticker and all reveals) and
  `prefers-contrast: more` (stronger text, borders and focus).
- Touch targets: the pill nav, profile icons, brand mark and primary actions are all
  ≥ 44 px.

## Performance

- Portrait and social images recompressed to WebP + JPEG, each < 100 KB (originals
  were ~1.1–1.9 MB).
- `width`/`height` on the portrait to reserve space; `fetchpriority="high"` +
  `decoding="async"`.
- Scroll work is throttled with `requestAnimationFrame`; no external libraries or
  web fonts.
