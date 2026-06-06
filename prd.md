# PRD: Lumen Landing Page

## Context

Lumen is Colombia's first scholar program, partnered with Universidad de Los Andes (Colombia's #1 university). It provides full tuition + ancillary support, mentorship, career prep, and community for low-income, first-generation, high-potential students pursuing STEM, Law, Economics, and Business. Founded by Maria Paz Rios (Blackstone), it currently supports 11 scholars across two generations (2024, 2025) with a 0% dropout rate and a 4.3 average GPA vs. a 3.9 program average.

The project lives at `/Users/bensonyan/dev/lumen` — a Vite + React 19 + TypeScript + Tailwind v4 scaffold that currently still shows the Vite starter. The work is to replace `src/App.tsx` with a single-page marketing site. Source assets (annual report PDF, pitch deck PDF, group photos) live in [src/assets/](src/assets/). More scholar headshots will be dropped in later.

**Inspiration:** [oakhcft.com](https://www.oakhcft.com/) — editorial serif typography, alternating sage/cream sections, big-stat blocks, italics for emphasis, generous whitespace, deep-navy footer. Lumen adapts this template into a deep-navy + cream palette. Reference screenshot at `/Users/bensonyan/dev/oakhcft-fullpage.png`; the live DOM has been inspected for concrete pattern details (see *Inspiration Pattern Library* below).

**Audience:** Multi-stakeholder, equal weight — prospective scholars, donors/sponsors, corporate partners, general awareness.

**Language:** English only.

**Testimonials:** Lorem ipsum placeholders for now (real quotes pending consent).

---

## Goals

1. Establish Lumen as a credible, professional institution worthy of donor and partner trust.
2. Communicate the differentiated value of Lumen vs. tuition-only scholarship programs (mentorship, network, community).
3. Provide clear pathways for each audience to engage (apply, donate, partner, learn more).
4. Showcase the institutional partnership with Universidad de Los Andes and the caliber of the Lumen board.

## Non-goals

- Application portal, donor portal, login, or any authenticated experience.
- CMS / blog infrastructure (any news section is a static list).
- Spanish localization (deferred; copy structure should not block adding `i18n` later).
- Mobile app, formal accessibility audit beyond reasonable defaults.

---

## Information Architecture

Single page, anchor-linked nav. Each section maps to a specific Oak pattern called out below; details of those patterns are in *Inspiration Pattern Library*.

1. **Sticky header** *(Oak: `navbar` with logo SVG + text nav)* — Lumen wordmark + hex icon on left; nav links right: *Program · Scholars · Board · Get Involved*; primary arrow-button CTA "Support Lumen".
2. **Hero** *(Oak: `home-hero` split + drag carousel below)* — left column: headline "Colombia's first scholar program for **education-based social mobility**." with **weight-contrast accent** (surrounding text Light 300, final phrase Bold 700), plus a 2-sentence sub-paragraph in Regular. Right column: large photo (Generación 2025 group portrait). Below the split, a draggable horizontal carousel of scholar cards (name + major + city). Section background carries a faded watermark of the Lumen hex icon.
3. **Stats band** *(Oak: "Uncommon commitment" — split heading + 2×2 stat grid)* — left: heading "Uncommon scholars. **Uncommon outcomes.**" (weight-contrast accent on the second sentence) + 1-paragraph context. Right: 2×2 grid showing `11` Scholars · `0%` Dropout · `4.3` Avg GPA · `2` Generations (numbers in Bold navy, labels in Regular muted). Cream-soft background.
4. **Universidad de Los Andes partnership** *(Oak: editorial split, image with offset block)* — left copy ("Our institutional partner") + 6-cell mini stat grid from the pitch deck (1948 founded, #1 in Colombia, #6 in LatAm, 110K+ graduates, ~2,000 faculty, 44 programs). Right: aerial Bogotá campus photo with offset colored block behind it for editorial depth.
5. **Mission / Vision / Values** *(Oak: text-forward "Ideas" intro pattern)* — Vision pull-quote: "Education-based social mobility." Mission: three numbered commitments (full STEM+ access; early-career positioning + curated talent; identity-driven community). Values strip beneath: Resilience · Excellence · Integrity · Community.
6. **How Lumen is differentiated** *(Oak: asymmetric `grid-3` card layout)* — six cards in a 3-column grid where the first card spans 2 rows. Each card pairs a challenge ("Lack of awareness", "Lack of preparation", etc.) with Lumen's response (Inform, Prepare, Connect, Mentor, Support, Identity). Cards alternate cream/navy backgrounds.
7. **The Lumen Funnel** *(Oak: single-column editorial visual)* — stylized funnel graphic stepping from 8,065 applicants → 2,534 → 483 → 82 → 11 Lumens. Reinforces selectivity. Caption beneath in muted sans.
8. **Scholars** *(Oak: tabbed testimonial carousel)* — left column: tab list of scholar names (Daniel A. · Daniel G. · Mateo · …); active scholar shows a lorem ipsum quote, name, major, city. Right column: swappable portrait of the active scholar. Below the tabbed block: a static photo grid of the two generation group photos already in [src/assets/](src/assets/).
9. **Board of Admissions** *(Oak: clean 3-column card grid)* — six cards with photo, name, role, current company, location, and small credential/logo strip beneath. Matches the layout from the pitch deck.
10. **Get involved** *(Oak: 3-column closing CTAs with arrow buttons)* — three editorial blocks: *For Students* (Apply) · *For Donors* (Give) · *For Companies* (Partner). Each has a one-line value prop and an arrow-button CTA.
11. **Footer** *(Oak: dark footer with logo + 3-column links)* — navy background. Lumen logo, short tagline, nav links, contact email, social icons placeholder, "© 2026 Lumen · Universidad de Los Andes".

---

## Inspiration Pattern Library

These are the concrete Oak HC/FT patterns extracted from the live DOM, with notes on how Lumen adapts each.

| # | Pattern | Oak behavior | Lumen adaptation |
|---|---|---|---|
| P1 | **Emphasis in heading** | Oak: editorial serif with `<span>` italic on a key phrase | **Adapted:** Kulim Park has no italic, so emphasis is **weight contrast** — set the surrounding text in Light (300) and the accented phrase in Bold (700) within the same line. Optional: shift the accent phrase to cobalt for extra pop |
| P2 | **Watermark brand mark** | Faded full-bleed SVG logo dropped into the colored `sections-bg` behind a section | Use the 6-petal Lumen hex icon faded into navy or cream section backgrounds |
| P3 | **Long-arrow CTA button** | Text label + thin long horizontal arrow SVG; no fill, no border — outline-button feel | Use this as the *only* CTA style. Skip filled buttons entirely |
| P4 | **Drag carousel under hero** | Swiper `dragdeal-w` of mini-cards with name + tagline + decorative motif; draggable, snapping | Featured Scholars carousel — name, major, hometown; drag to reveal more |
| P5 | **Split content with offset image** | Image with a small colored block offset behind it (`img-shift-bg`) for editorial depth | Andes campus photo + Generación photos use this offset treatment |
| P6 | **2×2 stat grid with accent number** | Big number in colored accent (`fs-sm is-green`), label in larger body para (`fs-pl`) | Use navy accent for numbers; balanced 2×2 layout for the Lumen stats and Andes stats |
| P7 | **Asymmetric 3-grid** | First card spans 2 rows (tall), rest are standard; all cards use a tinted background | Use for the "How Lumen is Differentiated" section so the lead differentiator gets visual weight |
| P8 | **Tabbed testimonial with swappable portrait** | Company-name tabs across the top; clicking switches both the quote on the left and a large portrait on the right | Tabs = scholar names; switches quote + portrait |
| P9 | **Alternating `sections-bg` stripes** | Full-bleed colored band sits absolutely behind each section to create the cream/sage rhythm | Navy stripe → cream → white → cream-soft cadence, full-bleed beyond `max-width` container |
| P10 | **Editorial line-breaks in headings** | Headings hard-break with `<br>` for typographic rhythm, even on desktop | Use this for hero and section H2s; don't rely purely on auto-wrap |

---

## Design System

**Colors** (Tailwind v4 `@theme` tokens in [src/index.css](src/index.css)):

| Token | Value | Use |
|---|---|---|
| `--color-navy` | `#012851` (Lumen brand navy — primary, confirmed) | Primary brand, headings, footer, hero section bg |
| `--color-navy-soft` | `#1a4178` | Hover states, accents on navy backgrounds |
| `--color-cobalt` | `~#1F31D2` (sampled from alta-02 / alta-04 PNG variants) | Optional bright accent (use sparingly — e.g., stat numbers, focus rings) |
| `--color-cream` | `#f4ede0` | Section backgrounds (matches PDF banner cream) |
| `--color-cream-soft` | `#faf6ec` | Alternating section background |
| `--color-ink` | `#0a0a14` | Body text |
| `--color-muted` | `#6b6b78` | Secondary text, captions |
| `--color-bg` | `#ffffff` | Default surface |

> The brand ships in **two blues** — deep navy (`#012851`, primary, used on the annual report cover and the Universidad de Los Andes co-mark) and a bright cobalt (`~#1F31D2`, secondary, used as an alternate logo treatment). Default everywhere to navy; reserve cobalt for a sparing accent if the navy palette feels too monochrome (e.g., a single stat number or a focus ring).

**Typography** — single brand family, **Kulim Park**, self-hosted from [public/Fonts/](public/Fonts/). The user has supplied four weights: Light (300), Regular (400), SemiBold (600), Bold (700). No italic variants ship, so emphasis is achieved via **weight contrast and color**, not italics (this updates pattern P1 below).

Declare in [src/index.css](src/index.css) with `@font-face` rules pointing at `/Fonts/KulimPark-{Light,Regular,SemiBold,Bold}.ttf`, then expose as the single Tailwind v4 `--font-sans` token.

| Token | Use | Size guide | Weight |
|---|---|---|---|
| `text-display` | Hero headline | `clamp(44px, 5.5vw, 80px)`, line-height 1.05 | 700 Bold (key phrase) / 300 Light (remainder) |
| `text-h2` | Section H2s with `<br>` line breaks | `clamp(32px, 3.5vw, 56px)`, line-height 1.1 | 600 SemiBold |
| `text-h3` | Subheads, testimonial quotes | `clamp(22px, 2.2vw, 32px)` | 600 SemiBold |
| `text-stat` | Stat numbers | `clamp(48px, 5vw, 72px)` | 700 Bold, navy color |
| `text-lead` | Hero sub-paragraph, stat labels | 20–22px | 400 Regular |
| `text-body` | Body copy | 16–18px, line-height 1.55 | 400 Regular |
| `text-meta` | Dates, captions, footer fine print | 13–14px, tracking-wide uppercase | 600 SemiBold |

- Use hard `<br>` for editorial line breaks in headings (pattern P10), not relying on natural wrap.
- The annual report cover uses a display serif for "Informe anual" — that face was **not** packaged in the brand kit. Stay on Kulim Park exclusively; do not introduce a second family.

**Buttons** — single style, pattern P3:
- Text label + long horizontal arrow SVG to the right.
- No fill, no border. Hover: text + arrow shift right ~4px; text color deepens (no blue wash).
- Use everywhere a CTA appears: header, hero, "Get Involved", section "see more" links.

**Imagery:** Use portrait-friendly group photos from the annual report. Avoid landscape crops that don't compose well. Aerial Andes campus shot for the partnership section.

**Hover behavior:** Use foreground tokens (text color shifts), not primary/blue washes.

**Section rhythm:** Alternate white → cream → white → cream-soft so the page reads as paginated editorial layouts.

---

## Critical Files

- [src/App.tsx](src/App.tsx) — replace Vite starter with the landing page composition (section components imported from `src/components/`).
- [src/index.css](src/index.css) — replace existing CSS variables with a Tailwind v4 `@theme` block defining the color tokens, font families, and font imports.
- [src/components/](src/components/) — one component per section: `Header.tsx`, `Hero.tsx`, `Stats.tsx`, `Andes.tsx`, `Mission.tsx`, `Differentiated.tsx`, `Funnel.tsx`, `Scholars.tsx`, `Board.tsx`, `GetInvolved.tsx`, `Footer.tsx`.
- `src/components/primitives/` — small reusable building blocks: `ArrowButton.tsx` (pattern P3), `WatermarkLogo.tsx` (pattern P2), `OffsetImage.tsx` (pattern P5), `SectionBg.tsx` (pattern P9 full-bleed colored stripe).
- For the hero carousel (pattern P4), use a lightweight horizontal scroller with native `scroll-snap-x mandatory` + drag-to-scroll on pointer events. **Do not** add a Swiper dependency — keep it dependency-free.
- For the scholar tab switcher (pattern P8), local React state — no router, no library.
- [index.html](index.html) — update `<title>` to "Lumen · Education-based social mobility" and add a meta description.
- [src/assets/](src/assets/) — strip out the Vite starter (`react.svg`, `vite.svg`, `hero.png`). Brand assets now present:
  - `lumen alta_Mesa de trabajo 1.png` — navy logo on white (primary, use in header)
  - `lumen alta-02.png` — cobalt logo on white (alt)
  - `lumen alta-03.png` — white logo on navy (use in dark sections / footer)
  - `lumen alta-04.png` — white logo on cobalt (alt)
  - `logo Lumen.ai` — Illustrator source. **Action item:** export an optimized SVG (or use a converter) so the header logo scales crisply. Until then, use the high-res PNG.
- [public/Fonts/](public/Fonts/) — Kulim Park `.ttf` files. Referenced via `@font-face` from `src/index.css`. Path in CSS: `/Fonts/KulimPark-{weight}.ttf` (note **capital F** in the directory name; case-sensitive on production).

The starter `App.css` should be deleted.

---

## Verification

1. `pnpm dev` and load `http://localhost:5173`. Walk the page top to bottom; confirm each section renders with real (or clearly placeholder) content.
2. Use Playwright to take a full-page screenshot at 1440px and 390px viewports — verify the Oak-style editorial feel translates, and the navy/cream alternation reads cleanly.
3. Confirm all anchor nav links scroll to the correct section.
4. Confirm no Vite starter content remains (no React/Vite logos, no "Count is" button).
5. Visual diff against the reference screenshot at `/Users/bensonyan/dev/oakhcft-fullpage.png` for layout cadence and whitespace.

---

## Open items for follow-up

- Lumen brand navy: **`#012851`** (confirmed). Cobalt accent: sample exact hex from `lumen alta-02.png` during implementation (~`#1F31D2`).
- **Export Lumen logo as SVG** from `logo Lumen.ai` (Illustrator). Implementation can start with the PNG, but a vector logo is needed before launch for crisp header rendering at all sizes.
- Real testimonial quotes + consent from named scholars (currently lorem ipsum).
- Final list of individual scholar headshots (the user mentioned more pictures incoming).
- Decide whether to add a `/news` or `/press` stub later.
- Domain + contact email for the footer.
