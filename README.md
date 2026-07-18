# Illusions GT Auto Spa — Website

A bespoke, single-page website for **Illusions GT Auto Spa**, the elite auto detailing
studio co-located with Illusions of Georgetown salon at 1629 Wisconsin Ave NW,
Washington, D.C.

Built as a fully static site — no framework, no build step — so it loads fast,
costs nothing to host, and is easy to maintain.

## Stack

| Layer | Choice | Why |
| --- | --- | --- |
| Markup | Semantic HTML5 | SEO, accessibility, zero dependencies |
| Styling | Hand-written CSS (`css/style.css`) | Custom black/gold/teal design system, fully responsive |
| Behavior | Vanilla JS (`js/main.js`) | Scroll reveals, before/after slider, carousel, form — ~6 KB, no libraries |
| Fonts | Sora + Manrope (Google Fonts) | Elegant modern sans-serif pairing |

## Features

- **Animated hero** — staggered word reveal, bespoke SVG car silhouette with a
  travelling gold light sweep, drifting ambient glows.
- **Scroll-triggered reveals** — `IntersectionObserver`-driven, with automatic
  stagger for card grids. Content is never hidden if JS fails.
- **Interactive before/after slider** — pointer, touch, and keyboard driven,
  with a one-time "nudge" animation so visitors notice it.
- **Testimonial carousel** — auto-advancing, pauses on hover, dot navigation.
- **Contact form** — floating labels; posts to a form backend if configured,
  otherwise falls back to a pre-filled email draft.
- **Mobile-first responsiveness** — slide-down mobile menu, fluid type via
  `clamp()`, touch-friendly targets, simplified layouts under 760px.
- **Performance** — lazy-loaded map embed, deferred JS, no image payloads
  (visuals are inline SVG/CSS), font preconnect.
- **Accessibility & motion** — `prefers-reduced-motion` support, ARIA labels,
  keyboard-operable slider and menus, visible focus states.
- **SEO** — meta description, Open Graph tags, canonical URL, and
  `LocalBusiness`/`AutoWash` JSON-LD structured data with address, phone,
  and social profiles.

## Project structure

```
index.html          # All page content (single page, anchor navigation)
css/style.css       # Design system + all styling and keyframe animations
js/main.js          # All interactivity (vanilla JS, IIFE, no globals)
assets/favicon.svg  # Monogram favicon
```

## Local preview

Any static server works:

```bash
# Python
python3 -m http.server 8080

# or Node
npx serve .
```

Then open <http://localhost:8080>.

## Deployment

The site is 100% static — deploy the repository root to any static host:

- **GitHub Pages**: Settings → Pages → deploy from branch (root). Done.
- **Netlify / Vercel / Cloudflare Pages**: connect the repo; no build command,
  publish directory = `/`.
- **Any web server**: copy the files to the web root.

### Post-launch checklist

1. **Real photography** — the About section and two gallery cards now use
   real shop photos (`assets/*-web.jpg`, optimized versions of the uploaded
   originals). Still on placeholders: the before/after slider panes inside
   `#baSlider` (needs two same-angle before/after shots; the slider logic
   works unchanged with `<img>` elements) and the two remaining gallery
   cards. To add more photos, drop originals in `assets/` and create
   compressed `-web.jpg` versions (~800–1100px wide, JPEG q82).
2. **Contact form backend** — add `action="https://formspree.io/f/YOUR_ID"`
   (or any endpoint) to `<form id="contactForm">`. Until then, submissions
   open a pre-filled email to illusionsgtautospa@gmail.com.
3. **Domain** — update the `canonical` and Open Graph URLs in `index.html`
   once the production domain is live.
4. **Social preview image** — add an `og:image` meta tag once brand
   photography is available.
