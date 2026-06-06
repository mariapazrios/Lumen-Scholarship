import { useEffect, useState } from "react"
import Hero from "./components/Hero"
import ArrowButton from "./components/primitives/ArrowButton"

function useHideOnScroll(threshold = 8) {
  const [hidden, setHidden] = useState(false)

  useEffect(() => {
    let lastY = window.scrollY
    let ticking = false

    const onScroll = () => {
      if (ticking) return
      ticking = true
      requestAnimationFrame(() => {
        const y = window.scrollY
        if (y < 10) {
          setHidden(false)
        } else if (y > lastY + threshold) {
          setHidden(true)
          lastY = y
        } else if (y < lastY - threshold) {
          setHidden(false)
          lastY = y
        }
        ticking = false
      })
    }

    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [threshold])

  return hidden
}

const NAV_LINKS = [
  { label: "Program", href: "#program" },
  { label: "Andes", href: "#andes" },
  { label: "Scholars", href: "#scholars" },
  { label: "Board", href: "#board" },
  { label: "Get Involved", href: "#get-involved" },
] as const

const SIZES = [
  { token: "text-display", label: "Display", className: "text-display" },
  { token: "text-hero", label: "Hero", className: "text-hero" },
  { token: "text-h2", label: "H2", className: "text-h2" },
  { token: "text-h3", label: "H3", className: "text-h3" },
  { token: "text-stat", label: "Stat", className: "text-stat" },
  { token: "text-lead", label: "Lead", className: "text-lead" },
  { token: "text-body", label: "Body", className: "text-body" },
  { token: "text-meta", label: "Meta", className: "text-meta uppercase tracking-widest" },
] as const

const WEIGHTS = [
  { name: "ExtraLight", weight: 200, className: "font-extralight" },
  { name: "Light", weight: 300, className: "font-light" },
  { name: "Regular", weight: 400, className: "font-normal" },
  { name: "SemiBold", weight: 600, className: "font-semibold" },
  { name: "Bold", weight: 700, className: "font-bold" },
] as const

const COLORS = [
  { token: "navy", hex: "#012851", className: "bg-navy", text: "text-white" },
  { token: "navy-soft", hex: "#1a4178", className: "bg-navy-soft", text: "text-white" },
  { token: "cobalt", hex: "#1f31d2", className: "bg-cobalt", text: "text-white" },
  { token: "cream", hex: "#f4ede0", className: "bg-cream", text: "text-ink" },
  { token: "cream-soft", hex: "#faf6ec", className: "bg-cream-soft", text: "text-ink" },
  { token: "ink", hex: "#0a0a14", className: "bg-ink", text: "text-white" },
  { token: "muted", hex: "#6b6b78", className: "bg-muted", text: "text-white" },
  { token: "bg (white)", hex: "#ffffff", className: "bg-white border border-muted/30", text: "text-ink" },
] as const

function Section({
  title,
  subtitle,
  children,
}: {
  title: string
  subtitle?: string
  children: React.ReactNode
}) {
  return (
    <section className="border-t border-ink/10 py-16">
      <div className="mb-10">
        <div className="text-meta uppercase tracking-widest text-muted mb-2">
          {title}
        </div>
        {subtitle && <p className="text-body text-muted max-w-prose">{subtitle}</p>}
      </div>
      {children}
    </section>
  )
}

export default function App() {
  const navHidden = useHideOnScroll()

  return (
    <div className="min-h-screen bg-background text-foreground px-4 md:px-6 lg:px-10">
      <header
        className={`bg-background sticky top-0 z-50 transition-transform duration-300 ease-out ${
          navHidden ? "-translate-y-full" : "translate-y-0"
        }`}
      >
        <div className="max-w-12xl mx-auto px-4 lg:px-8 py-4 flex items-center justify-between gap-12">
          <a href="/" aria-label="Lumen home" className="block shrink-0">
            <img src="/logo-navy.svg" alt="Lumen" className="h-8 w-auto" />
          </a>
          <nav aria-label="Primary" className="hidden md:flex items-center gap-8 lg:gap-12">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-base font-semibold text-primary hover:text-foreground transition-colors duration-200"
              >
                {link.label}
              </a>
            ))}
          </nav>
        </div>
      </header>

      <Hero />

      {/* Phase 1 — Design system showcase (kept below for reference) */}
      <div className="max-w-12xl mx-auto px-4 lg:px-8 py-12 border-t border-ink/10">
        <div className="mb-10 text-meta uppercase tracking-widest text-muted">
          Design System · v0 (reference)
        </div>

        {/* Logo lockups */}
        <Section
          title="Logo"
          subtitle="Wordmark + hex icon. Use navy-on-white as the primary lockup. White-on-navy for dark sections (footer, hero overlays)."
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white border border-ink/10 rounded-sm aspect-[2/1] flex items-center justify-center p-12">
              <img src="/logo-navy.svg" alt="Lumen navy" className="max-h-20 w-auto" />
            </div>
            <div className="bg-navy rounded-sm aspect-[2/1] flex items-center justify-center p-12">
              <img src="/logo-white.svg" alt="Lumen white" className="max-h-20 w-auto" />
            </div>
          </div>
        </Section>

        {/* Colors */}
        <Section
          title="Color palette"
          subtitle="Deep navy is the primary. Cobalt is a sparing accent for moments that need extra energy. Cream tones drive the editorial section rhythm."
        >
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {COLORS.map((c) => (
              <div key={c.token} className="space-y-2">
                <div
                  className={`${c.className} ${c.text} aspect-[4/3] rounded-sm flex items-end p-4`}
                >
                  <span className="text-meta uppercase tracking-widest font-semibold">
                    {c.hex}
                  </span>
                </div>
                <div className="text-body font-semibold">--color-{c.token}</div>
              </div>
            ))}
          </div>
        </Section>

        {/* Typography */}
        <Section
          title="Typography scale"
          subtitle="Single family: Kulim Park (Google Fonts). Five weights — ExtraLight, Light, Regular, SemiBold, Bold — each with italic. Sizes use clamp() so they fluidly scale between mobile and desktop."
        >
          <div className="space-y-16">
            {SIZES.map((size) => (
              <div key={size.token}>
                <div className="flex items-baseline gap-4 mb-6 pb-2 border-b border-ink/10">
                  <div className="text-meta uppercase tracking-widest text-muted">
                    {size.label}
                  </div>
                  <div className="text-meta text-muted font-normal normal-case tracking-normal">
                    --{size.token}
                  </div>
                </div>
                <div className="space-y-3">
                  {WEIGHTS.map((w) => (
                    <div key={w.weight}>
                      <div className="text-meta uppercase tracking-widest text-muted mb-1">
                        {w.name} {w.weight}
                      </div>
                      <div className="flex flex-col gap-1">
                        <div className={`${size.className} ${w.className}`}>
                          The quick brown fox jumps over the lazy dog
                        </div>
                        <div className={`${size.className} ${w.className} italic`}>
                          The quick brown fox jumps over the lazy dog
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Section>

        {/* Emphasis demo */}
        <Section
          title="Emphasis patterns"
          subtitle="Oak-style accent on a key phrase, rendered three ways. Pick whichever reads strongest for the specific headline."
        >
          <div className="space-y-12">
            <div>
              <div className="text-meta uppercase tracking-widest text-muted mb-3">
                Italic only
              </div>
              <div className="text-display font-light">
                Colombia&apos;s first scholar program for{" "}
                <em className="italic">education-based social mobility</em>.
              </div>
            </div>
            <div>
              <div className="text-meta uppercase tracking-widest text-muted mb-3">
                Weight contrast (Light → Bold)
              </div>
              <div className="text-display font-light">
                Colombia&apos;s first scholar program for{" "}
                <span className="font-bold">education-based social mobility</span>.
              </div>
            </div>
            <div>
              <div className="text-meta uppercase tracking-widest text-muted mb-3">
                Italic + Bold (combined)
              </div>
              <div className="text-display font-light">
                Colombia&apos;s first scholar program for{" "}
                <em className="italic font-bold">education-based social mobility</em>.
              </div>
            </div>
          </div>
        </Section>

        {/* Buttons */}
        <Section
          title="Buttons"
          subtitle="One style across the site: text label + long arrow, no fill, no border. Hover shifts the arrow ~4px right and deepens the text color (no blue wash)."
        >
          <div className="space-y-10">
            <ButtonRow tone="navy" label="Support Lumen" bgClass="bg-white" />
            <ButtonRow tone="white" label="Apply now" bgClass="bg-navy" />
            <ButtonRow tone="cobalt" label="Learn more" bgClass="bg-cream" />
          </div>
        </Section>

        <footer className="border-t border-ink/10 mt-16 pt-8 pb-12">
          <div className="text-meta uppercase tracking-widest text-muted">
            Lumen · Education-based social mobility · 2026
          </div>
        </footer>
      </div>
    </div>
  )
}

function ButtonRow({
  tone,
  label,
  bgClass,
}: {
  tone: "navy" | "white" | "cobalt"
  label: string
  bgClass: string
}) {
  return (
    <div>
      <div className="text-meta uppercase tracking-widest text-muted mb-3">
        {tone} on {bgClass.replace("bg-", "")}
      </div>
      <div className={`${bgClass} rounded-sm p-8 grid grid-cols-2 gap-8`}>
        <div className="space-y-3">
          <div
            className={`text-meta uppercase tracking-widest ${
              tone === "white" ? "text-white/60" : "text-muted"
            }`}
          >
            Default
          </div>
          <ArrowButton label={label} tone={tone} />
        </div>
        <div className="space-y-3">
          <div
            className={`text-meta uppercase tracking-widest ${
              tone === "white" ? "text-white/60" : "text-muted"
            }`}
          >
            Hover
          </div>
          <ArrowButton label={label} tone={tone} forceHover />
        </div>
      </div>
    </div>
  )
}
