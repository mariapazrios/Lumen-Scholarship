# Lumen — Session Reference

> Full product spec is in [prd.md](prd.md). This file is the quick-reference for every Claude session.

## What this is

Marketing site for **Lumen**, Colombia's first scholar program (partnered with Universidad de Los Andes). Pages via a tiny hash router (no react-router). Inspired by [oakhcft.com](https://www.oakhcft.com/).

Mostly static, plus a small backend for the two gated portals: three edge functions in [api/](api/README.md) over a Neon Postgres database (`neon-aureolin-elephant`, attached to the Vercel project as `POSTGRES_URL`). It exists so board ratings are shared between members rather than trapped in one browser, and so admissions essays are served to an authenticated session instead of shipping in the client bundle. **Never put scholar essays or grades back into `src/data/`** — they belong in `lumen_documents`. Grades followed the essays out on 2026-08-05, as `kind='scholar-grades'`: one JSON row per scholar carrying the program, cumulative PGA, term series and Saber 11, fetched by `useScholarGrades()` in [src/lib/grades.ts](src/lib/grades.ts). Anything in `src/data/` ships in the public bundle whatever the passcode does, and the repo is public.

## Tech stack

- Vite 8 + React 19 + TypeScript + Tailwind v4
- Package manager: **pnpm**
- Tailwind wired via `@tailwindcss/vite` plugin in [vite.config.ts](vite.config.ts)
- No router, no UI library, no Swiper — keep dependencies minimal

## Dev commands

```bash
pnpm dev      # starts Vite (may fall back to 5174 if 5173 is busy)
pnpm build    # tsc -b && vite build
pnpm lint     # eslint .
```

## Colors

Two layers, both defined as Tailwind tokens in [src/index.css](src/index.css):

**Semantic roles — prefer these in components.**

| Token | Maps to | When to use |
|---|---|---|
| `background` | white | Default page bg (already on `<body>`) |
| `foreground` | `ink` | Default text (inherited from `<html>`); also the hover target |
| `surface` | `cream` | Cream section bg |
| `surface-soft` | `cream-soft` | Alternating section bg |
| `primary` | `navy` | Dark section bg (hero, etc.) |
| `primary-hover` | `navy-soft` | Hover state on primary bg |
| `primary-foreground` | white | Text on `bg-primary` |
| `accent` | `cobalt` | **Sparing** accent only |
| `muted` | gray | Captions, meta text |

Usage pattern: set `bg-primary text-primary-foreground` on a dark section root and let children inherit — don't repeat `text-white` on every child. Use opacity (`text-primary-foreground/70`) for muted variants within dark sections.

**Brand palette — the underlying hex values.**

| Token | Hex |
|---|---|
| `navy` | `#012851` |
| `navy-soft` | `#1a4178` |
| `cobalt` | `#1f31d2` |
| `cream` | `#f4ede0` |
| `cream-soft` | `#faf6ec` |
| `ink` | `#0a0a14` |
| `muted` | `#6b6b78` |

Reference brand tokens directly only when the role isn't obvious (e.g. the design-system showcase that documents the palette).

## Typography

**Cambria**, set in [src/index.css](src/index.css) as `Cambria, Caladea, Georgia, "Times New Roman", serif`. Cambria is a licensed Microsoft font that cannot be self-hosted; it resolves locally on Windows and on macOS with Office. **Caladea** (Google Fonts, loaded in [index.html](index.html)) is metrically compatible and covers everyone else, so line breaks hold either way.

Cambria ships only **regular and bold**, both with true italics. Weight utilities below 400 (`font-light`, `font-extralight`) therefore render as regular, and 600 renders as bold. Lean on **italic** for emphasis rather than fine weight steps. Do not add a second family.

Size tokens (in `@theme`):
- `text-display` — hero headline (clamp 44→80px)
- `text-h2` — section H2s (clamp 32→56px)
- `text-h3` — subheads (clamp 22→32px)
- `text-stat` — stat numbers (clamp 48→72px)
- `text-lead` — sub-paragraphs (22px)
- `text-body` — body copy (17px, lh 1.55)
- `text-meta` — captions, uppercase tracked (13px)

## Hard conventions

These come from accumulated decisions — don't relitigate without reason.

1. **Buttons:** one style only — text + long horizontal arrow SVG, no fill, no border. Hover translates right ~4px and deepens text to `ink`. Skip filled buttons entirely. (Pattern P3)
2. **Hover states:** use foreground (text color) shifts, never primary/blue washes.
3. **Emphasis in headings:** italic (Cambria ships true italics). Weight contrast is limited to regular vs bold. (Pattern P1)
4. **Section rhythm:** alternate white → cream → white → cream-soft. Full-bleed colored bands behind each section beyond the max-width container. (Pattern P9)
5. **Imagery:** portrait-friendly only. No landscape crops that don't compose well.
6. **Editorial line breaks:** use hard `<br>` in headings instead of relying on auto-wrap. (Pattern P10)
7. **Carousel:** native `scroll-snap-x mandatory` + pointer-event drag. **Do not** add Swiper.

Full pattern library (P1–P10) is in [prd.md](prd.md) under *Inspiration Pattern Library*.

## Assets

- **Logo:** [public/logo-navy.svg](public/logo-navy.svg) (primary, on white) and [public/logo-white.svg](public/logo-white.svg) (white wordmark on baked-in navy background — drop into dark sections). Both extracted from the `.ai` brand kit via `pdftocairo` (the `.ai` is PDF-compatible) with viewBox-cropped to the relevant variant.
- **Hero photo:** `src/assets/NUEVAS/11 ESTUDIANTES LUMEN.JPG` (the official 11-scholar group portrait). The 84 MB `.psd` source in the same folder must **never** be shipped.
- **Scholar headshots:** [src/assets/Primera/Nuevos/](src/assets/Primera/Nuevos/) (Generación 2024) and [src/assets/Segunda/Nuevos/](src/assets/Segunda/Nuevos/) (Generación 2025). Always use the `Nuevos/` subfolders — they're the higher-res reshoots.
- **Atmospheric:** [src/assets/anexo/](src/assets/anexo/) — international travel photos (KFUPM trip). Use sparingly.
- When wiring scholar photos into components, strip diacritics + Spanish words from filenames (e.g. `mateo-arcila.jpg`).
- Local Kulim Park `.ttf`s in [public/Fonts/](public/Fonts/) are a self-host fallback. **Not referenced by default** — Google Fonts loads them.

## Project phases

- **Phase 1 (retired):** Design-system showcase page. Replaced by Phase 2; the token/pattern documentation lives on in [prd.md](prd.md) and this file.
- **Phase 2 (shipped):** Full marketing site with a dependency-free **hash router** in [src/App.tsx](src/App.tsx). Routes: `#/` (Home), `#/scholars`, `#/team`, `#/get-involved`, `#/apply` (passcode-gated essay prompts; code lives in [src/pages/Apply.tsx](src/pages/Apply.tsx), stored in sessionStorage — client-side soft gate only); `#/scholars/<slug>` deep-links to a profile. Titles update per route and language.
  - **Bilingual (EN/ES):** every user-facing string is localized. `src/lib/i18n.ts` holds `LangContext` + `useLang()` (`t()` for strings, `tl()` for lists); App owns the state (localStorage `lumen-lang`, defaults from `navigator.language`); the header has an EN|ES toggle. Data files carry `{ en, es }` objects. Never add English-only copy.
  - **Copy rules:** NO em dashes anywhere (use commas, colons, or periods). Say **"STEM+"**: the program funds engineering and the sciences plus economics and business, and MPR reversed the earlier "never STEM+" rule on 2026-08-05. Factual tone, not salesy.
  - **Majors supported** is what the programme funds, which is NOT the roster: most of the list has no Lumen in it. Since 2026-08-05 it is the university's full offering in these areas, taken from `uniandes.edu.co/es/oferta-academica/pregrados` and `ingenieria.uniandes.edu.co/es/programas/pregrado`: all six sciences (Biología, Física, Geociencias, Matemáticas, Microbiología, Química), all ten engineering programmes (including Ciencia de Datos, which sits in the engineering faculty without the Ingeniería prefix), plus Economía, Administración de Empresas and Derecho. **Medicina is deliberately excluded** even though Uniandes files it under the sciences: it runs past the ten semesters and one summer the scholarship covers. Grouped in `MAJOR_GROUPS` in `Mission.tsx`; `AdmissionsProcess` states the same scope as prose without enumerating, so the two cannot drift.
  - **Pages** in `src/pages/`: `Home` (Hero with per-generation scholar rows → Mission/Vision → Stats charts → Andes → Colombia map → Video), `Scholars` (alphabetical directory with hover bio cards + full profiles), `Team` (Lumen Board + Andes support team), `GetInvolved` (admissions funnel/steps + sponsorship tiers/affiliates).
  - **GetInvolved framing (MPR, 2026-08-05):** the pitch is **privileged access to elite talent**, never getting ahead of a hiring market. "Before the market competes for them" was explicitly rejected. The hero runs three tiers, each with its own job: the headline names how closed the group is and who is let in, the line under it says what kind of decision this is ("Invest in a cohort, not just a cause"), and the paragraph says what a sponsor actually gets. That middle line exists because the tax-deductibility banners further down would otherwise let the page read as charity. Do not shorten the paragraph; MPR has twice asked for full-length prose in normal-length sentences rather than clipped ones.
  - **Stats section** is chart-based (dot plot for GPA by aid program, zero-based bars for retention, dumbbell for GPA by major vs program average): emphasis form, cobalt = Lumen, muted gray = context, GPA axis 3.5–5.0 with visible ticks.
  - **Content data** in `src/data/`: `scholars.ts` (all 11 profiles, map cities + projected coords, Colombia SVG path), `team.ts` (board + Andes team), `nav.ts`.
  - **Primitives**: `ArrowButton`, `Reveal` (IntersectionObserver scroll-reveal), `CountUp` (animated stats). Both respect `prefers-reduced-motion` and a `?nofx` query param (used for headless screenshots — append it to render without animations).
  - **Assets**: `public/lumen-icon.png` (transparent brand mark — watermarks, map markers, favicon), `public/team/*.jpg` (headshots extracted from the pitch deck), `public/campus-*.jpg` (Andes photos), `public/scholars/*.jpg` (scholar headshots).
  - The program-film embed URL goes in `PROGRAM_VIDEO_EMBED_URL` ([src/components/home/VideoSection.tsx](src/components/home/VideoSection.tsx)); the public contact email goes in `CONTACT_EMAIL` ([src/pages/GetInvolved.tsx](src/pages/GetInvolved.tsx)). Both are empty placeholders pending real values.

## When in doubt

Check [prd.md](prd.md) for the product spec, pattern definitions (P1–P10), and the full landing-page IA.
