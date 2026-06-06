# PRD: Lumen Landing Page

## Context

Lumen is Colombia's first scholar program, partnered with Universidad de Los Andes (Colombia's #1 university). It provides full tuition + ancillary support, mentorship, career prep, and community for low-income, first-generation, high-potential students pursuing STEM, Law, Economics, and Business. Founded by Maria Paz Rios (Blackstone), it currently supports 11 scholars across two generations (2024, 2025) with a 0% dropout rate and a 4.3 average GPA vs. a 3.9 program average.

The project lives at `/Users/bensonyan/dev/lumen` — Vite + React 19 + TypeScript + Tailwind v4. The goal is a single-page marketing site.

**Inspiration:** [oakhcft.com](https://www.oakhcft.com/) — editorial typography, alternating cream/white sections, big-stat blocks, italics for emphasis, generous whitespace, deep-navy footer. Reference screenshot at `/Users/bensonyan/dev/oakhcft-fullpage.png`. The live DOM has been inspected for concrete pattern details (see *Inspiration Pattern Library*).

**Audience:** Multi-stakeholder, equal weight — prospective scholars, donors/sponsors, corporate partners, general awareness.

**Language:** English only (copy structure should not block adding `i18n` later).

**Testimonials:** Lorem ipsum placeholders for now (real quotes pending consent).

---

## Asset Inventory

| Folder | What's in it | Use |
|---|---|---|
| [src/assets/NUEVAS/](src/assets/NUEVAS/) | `11 ESTUDIANTES LUMEN.JPG` (official 11-scholar group portrait), `.psd` source (84 MB — do **not** ship), `DSC00093/106/110.JPG` candids | Hero image is the 11-scholar group portrait. Candids fill atmospheric slots |
| [src/assets/Primera/Nuevos/](src/assets/Primera/Nuevos/) | Generación 2024 headshots: Jose Maturana, Juan Ángel Aicardy, Juan Pablo Contreras, Julian Rodriguez, Sebastián Martínez, Valerie Suárez | Scholars tabbed carousel — use the `Nuevos/` (higher-res) versions |
| [src/assets/Segunda/Nuevos/](src/assets/Segunda/Nuevos/) | Generación 2025 headshots: Daniel Álzate, Juan Daniel Gonzalo, Mateo Arcila, Santiago Rubiano, Valentina Salgado | Scholars tabbed carousel |
| [src/assets/anexo/](src/assets/anexo/) | Event/travel photos (scholars at KFUPM, Saudi Arabia) | Reinforces "education-based social mobility" via mobility imagery — use sparingly |

`Primera`/`Segunda` map to Generación 2024 / 2025. When wiring into components, strip diacritics and Spanish words from filenames (e.g. `scholars/segunda/mateo-arcila.jpg`).

Logo assets in [public/](public/): `logo-navy.svg` (primary, navy wordmark on transparent) and `logo-white.svg` (white wordmark on baked-in navy background, for dark sections). Extracted from `logo Lumen.ai` via `pdftocairo` (the `.ai` is PDF-compatible), then viewBox-cropped to isolate each variant from the stacked artboard. The `.ai` brand spec page also documents the canonical brand colors: **navy `#012269`** and **cobalt `#1723a9`** — slightly different from the `#012851` / `#1f31d2` currently in the CSS tokens. Reconcile when convenient.

---

## Phase 1: Foundation Scaffolding ✅ **Shipped**

A single-page design-system showcase that proves the foundation works. Currently live at `/`. Files: [src/App.tsx](src/App.tsx), [src/index.css](src/index.css), [index.html](index.html), [vite.config.ts](vite.config.ts).

Confirmed working:
- Kulim Park loads from Google Fonts (all 5 weights × italic, true italic glyphs).
- All color tokens render in palette swatches.
- Typography scale renders every size × weight × italic combination.
- Emphasis patterns (italic / weight-contrast / combined) render correctly.
- Arrow buttons render in three variants (navy-on-white, white-on-navy, cobalt-on-cream) with default + hover states.

The showcase page will be replaced by the landing page in Phase 2. Until then, it serves as the living design-system reference.

---

## Phase 2: Landing Page (next)

### Goals

1. Establish Lumen as a credible, professional institution worthy of donor and partner trust.
2. Communicate the differentiated value vs. tuition-only scholarship programs (mentorship, network, community).
3. Provide clear pathways for each audience (apply, donate, partner, learn more).
4. Showcase the Universidad de Los Andes partnership and the caliber of the Lumen board.

### Non-goals

- Application portal, donor portal, login, or any authenticated experience.
- CMS / blog infrastructure (any news section is a static list).
- Spanish localization (deferred).
- Mobile app, formal accessibility audit beyond reasonable defaults.

### Information Architecture

Single page, anchor-linked nav. Each section maps to a specific Oak pattern (details in *Inspiration Pattern Library* below).

1. **Sticky header** *(Oak: `navbar` with logo + text nav)* — Lumen wordmark + hex icon left; nav right: *Program · Scholars · Board · Get Involved*; primary arrow-button CTA "Support Lumen".
2. **Hero** *(Oak: `home-hero` split + drag carousel below)* — left: headline "Colombia's first scholar program for *education-based social mobility*." (italic accent on the final phrase) + 2-sentence sub-paragraph. Right: hero photo from [src/assets/NUEVAS/](src/assets/NUEVAS/). Below the split, a draggable horizontal carousel of scholar mini-cards. Section background carries a faded watermark of the Lumen hex icon.
3. **Stats band** *(Oak: split heading + 2×2 stat grid)* — left: heading "Uncommon scholars. *Uncommon outcomes.*" + context paragraph. Right: 2×2 grid showing `11` Scholars · `0%` Dropout · `4.3` Avg GPA · `2` Generations. Cream-soft background.
4. **Universidad de Los Andes partnership** *(Oak: editorial split, image with offset block)* — left: copy + 6-cell mini stat grid from the pitch deck (1948 founded, #1 in Colombia, #6 in LatAm, 110K+ graduates, ~2,000 faculty, 44 programs). Right: aerial Bogotá campus photo with offset colored block behind it.
5. **Mission / Vision / Values** *(Oak: text-forward intro)* — Vision pull-quote: "Education-based social mobility." Mission: three numbered commitments (full STEM+ access; early-career positioning + curated talent; identity-driven community). Values strip: Resilience · Excellence · Integrity · Community.
6. **How Lumen is differentiated** *(Oak: asymmetric `grid-3` card layout)* — six cards in a 3-column grid where the first card spans 2 rows. Each card pairs a challenge with Lumen's response (Inform, Prepare, Connect, Mentor, Support, Identity). Cards alternate cream/navy backgrounds.
7. **The Lumen Funnel** *(Oak: single-column editorial visual)* — stylized funnel: 8,065 applicants → 2,534 → 483 → 82 → 11 Lumens.
8. **Scholars** *(Oak: tabbed testimonial carousel)* — left: tab list of scholar names from [src/assets/Primera/Nuevos/](src/assets/Primera/Nuevos/) and [src/assets/Segunda/Nuevos/](src/assets/Segunda/Nuevos/). Active scholar shows a lorem ipsum quote, name, major, city. Right: swappable portrait. Optional atmospheric strip from [src/assets/anexo/](src/assets/anexo/) below.
9. **Board of Admissions** *(Oak: clean 3-column card grid)* — six cards with photo, name, role, current company, location, credentials/logos. Matches the pitch deck layout.
10. **Get involved** *(Oak: 3-column closing CTAs with arrow buttons)* — three blocks: *For Students* (Apply) · *For Donors* (Give) · *For Companies* (Partner).
11. **Footer** *(Oak: dark footer with logo + 3-column links)* — navy background. Logo, short tagline, nav links, contact email, social icons placeholder, "© 2026 Lumen · Universidad de Los Andes".

### Critical Files (Phase 2)

- [src/App.tsx](src/App.tsx) — replace the showcase composition with the landing-page composition (section components imported from `src/components/`).
- `src/components/` — one component per section: `Header.tsx`, `Hero.tsx`, `Stats.tsx`, `Andes.tsx`, `Mission.tsx`, `Differentiated.tsx`, `Funnel.tsx`, `Scholars.tsx`, `Board.tsx`, `GetInvolved.tsx`, `Footer.tsx`.
- `src/components/primitives/` — reusable building blocks: `ArrowButton.tsx` (P3), `WatermarkLogo.tsx` (P2), `OffsetImage.tsx` (P5), `SectionBg.tsx` (P9).
- For the hero carousel (P4), use a lightweight horizontal scroller with native `scroll-snap-x mandatory` + drag-to-scroll on pointer events. **Do not** add a Swiper dependency.
- For the scholar tab switcher (P8), local React state — no router, no library.
- [index.html](index.html) — update `<title>` to "Lumen · Education-based social mobility" when Phase 2 ships.

---

## Inspiration Pattern Library

Concrete Oak HC/FT patterns extracted from the live DOM, with notes on how Lumen adapts each.

| # | Pattern | Oak behavior | Lumen adaptation |
|---|---|---|---|
| P1 | **Italic accent in heading** | Editorial headline with italic `<span>` on a key phrase | Same — Kulim Park ships true italic via Google Fonts. Optionally combine with weight contrast (Light → Bold) for stronger emphasis |
| P2 | **Watermark brand mark** | Faded full-bleed SVG logo dropped into the colored section background | Use the 6-petal Lumen hex icon faded into navy or cream section backgrounds |
| P3 | **Long-arrow CTA button** | Text label + thin long horizontal arrow SVG; no fill, no border | The *only* CTA style. Skip filled buttons entirely |
| P4 | **Drag carousel under hero** | Mini-cards with name + tagline; draggable, snapping | Featured Scholars carousel — name, major, hometown |
| P5 | **Split content with offset image** | Image with a small colored block offset behind it for editorial depth | Andes campus photo + Generación photos use this offset treatment |
| P6 | **2×2 stat grid with accent number** | Big number in colored accent, label in body para | Navy accent for numbers; balanced 2×2 layout |
| P7 | **Asymmetric 3-grid** | First card spans 2 rows; all cards use a tinted background | Use for the "How Lumen is Differentiated" section |
| P8 | **Tabbed testimonial with swappable portrait** | Name tabs across the top; clicking switches quote on the left + portrait on the right | Tabs = scholar names |
| P9 | **Alternating section-bg stripes** | Full-bleed colored band sits behind each section to create rhythm | Navy → cream → white → cream-soft cadence |
| P10 | **Editorial line-breaks in headings** | Headings hard-break with `<br>` for typographic rhythm | Use for hero and section H2s |

---

## Design System

### Colors (Tailwind v4 `@theme` tokens in [src/index.css](src/index.css))

| Token | Value | Use |
|---|---|---|
| `--color-navy` | `#012851` (primary brand) | Headings, footer, hero section bg, button text |
| `--color-navy-soft` | `#1a4178` | Hover states, accents on navy backgrounds |
| `--color-cobalt` | `#1f31d2` | Sparing accent — single stat number, focus ring |
| `--color-cream` | `#f4ede0` | Primary section backgrounds |
| `--color-cream-soft` | `#faf6ec` | Alternating section background |
| `--color-ink` | `#0a0a14` | Body text |
| `--color-muted` | `#6b6b78` | Secondary text, captions |
| `bg-white` | `#ffffff` | Default surface |

> Brand ships two blues: deep navy (primary, formal) and cobalt (energetic accent). Default to navy; reserve cobalt for sparing moments where the navy palette feels too monochrome.

### Typography

Single brand family: **Kulim Park** via Google Fonts. Weights 200, 300, 400, 600, 700 — each in normal *and* italic.

Loaded in [index.html](index.html):
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Kulim+Park:ital,wght@0,200;0,300;0,400;0,600;0,700;1,200;1,300;1,400;1,600;1,700&display=swap" rel="stylesheet">
```

| Token | Use | Size | Default weight |
|---|---|---|---|
| `text-display` | Hero headline | `clamp(2.75rem, 5.5vw, 5rem)`, line-height 1.05 | 300 Light surround + 700 Bold or italic accent |
| `text-h2` | Section H2s with `<br>` breaks | `clamp(2rem, 3.5vw, 3.5rem)`, line-height 1.1 | 600 SemiBold |
| `text-h3` | Subheads, testimonial quotes | `clamp(1.375rem, 2.2vw, 2rem)` | 600 SemiBold |
| `text-stat` | Stat numbers | `clamp(3rem, 5vw, 4.5rem)` | 700 Bold, navy color |
| `text-lead` | Hero sub-paragraph, stat labels | `1.375rem` | 400 Regular |
| `text-body` | Body copy | `1.0625rem`, line-height 1.55 | 400 Regular |
| `text-meta` | Dates, captions, footer fine print | `0.8125rem`, tracking-wider uppercase | 600 SemiBold |

Local `.ttf` files in [public/Fonts/](public/Fonts/) remain as a self-host fallback — not referenced by default. The annual report cover uses a display serif that was **not** packaged in the brand kit; do not introduce a second family.

### Buttons (pattern P3)

Single style:
- Text label + long horizontal arrow SVG (24px wide, stroke 1.5).
- No fill, no border. Uppercase, tracking-widest, font-semibold.
- Hover: translates right by 4px, text color deepens to `ink` (no blue wash).
- Use everywhere a CTA appears.

### Imagery

Use portrait-friendly photos (group portraits, Lumen-branded scholars). Avoid landscape crops. Aerial Andes campus shot for the partnership section. International travel photos from `anexo/` for atmospheric strips.

### Section rhythm

Alternate white → cream → white → cream-soft so the page reads as paginated editorial layouts (P9). Full-bleed colored bands sit behind each section beyond the max-width container.

---

## Verification (Phase 2)

1. `pnpm dev` and open `http://localhost:5173` (or whichever port Vite picks). Walk top to bottom; confirm each section renders with real content.
2. Use Playwright to take full-page screenshots at 1440px and 390px viewports — verify the editorial feel translates and the navy/cream alternation reads cleanly.
3. Confirm all anchor nav links scroll to the correct section.
4. Confirm no Phase 1 design-system content remains.
5. Visual diff against the Oak reference screenshot at `/Users/bensonyan/dev/oakhcft-fullpage.png` for layout cadence.

---

## Open items

- **SVG export from `logo Lumen.ai`** — currently using PNG; needed for crisp scaling.
- Real testimonial quotes + consent from named scholars.
- Final list of individual scholar headshots (more incoming).
- Footer: domain + contact email.
- Decide whether to add a `/news` or `/press` stub.
- Sample exact cobalt hex from `lumen alta-02.png` (currently approximated to `#1f31d2`).
