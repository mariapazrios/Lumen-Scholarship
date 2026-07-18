import { useEffect, useState } from "react"
import { NAV_LINKS } from "../data/nav"
import { useLang, type Lang } from "../lib/i18n"

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

function LangToggle({ className = "" }: { className?: string }) {
  const { lang, setLang } = useLang()
  const options: Array<{ value: Lang; label: string }> = [
    { value: "en", label: "EN" },
    { value: "es", label: "ES" },
  ]
  return (
    <div
      role="group"
      aria-label="Language"
      className={`flex items-center border border-primary/25 rounded-sm overflow-hidden ${className}`}
    >
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          onClick={() => setLang(o.value)}
          aria-pressed={lang === o.value}
          className={`px-3 py-1.5 text-meta font-semibold tracking-widest transition-colors duration-200 cursor-pointer ${
            lang === o.value
              ? "bg-primary text-primary-foreground"
              : "text-primary hover:text-foreground"
          }`}
        >
          {o.label}
        </button>
      ))}
    </div>
  )
}

export default function Header({ route }: { route: string }) {
  const navHidden = useHideOnScroll()
  const [menuOpen, setMenuOpen] = useState(false)
  const { t } = useLang()

  return (
    <header
      className={`bg-background/95 backdrop-blur-sm sticky top-0 z-50 transition-transform duration-300 ease-out border-b border-ink/5 ${
        navHidden && !menuOpen ? "-translate-y-full" : "translate-y-0"
      }`}
    >
      <div className="max-w-8xl mx-auto px-6 md:px-10 lg:px-16 py-4 flex items-center justify-between gap-6">
        <a href="#/" aria-label="Lumen home" className="block shrink-0">
          <img src="/logo-navy.svg" alt="Lumen" className="h-7 md:h-8 w-auto" />
        </a>

        <div className="hidden md:flex items-center gap-8 lg:gap-12">
          <nav aria-label="Primary" className="flex items-center gap-8 lg:gap-12">
            {NAV_LINKS.map((link) => {
              const active = route === link.route
              return (
                <a
                  key={link.route}
                  href={`#/${link.route}`}
                  aria-current={active ? "page" : undefined}
                  className={`relative text-body font-semibold transition-colors duration-200 pb-1 ${
                    active ? "text-foreground" : "text-primary hover:text-foreground"
                  }`}
                >
                  {t(link.label)}
                  <span
                    className={`absolute left-0 -bottom-0.5 h-[2px] bg-accent transition-all duration-300 ${
                      active ? "w-full" : "w-0"
                    }`}
                  />
                </a>
              )
            })}
          </nav>
          <LangToggle />
        </div>

        {/* Mobile: language toggle + menu button */}
        <div className="md:hidden flex items-center gap-3">
          <LangToggle />
          <button
            type="button"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((v) => !v)}
            className="flex flex-col justify-center gap-[5px] w-10 h-10 items-center"
          >
            <span
              className={`block w-6 h-[2px] bg-primary transition-transform duration-300 ${
                menuOpen ? "translate-y-[7px] rotate-45" : ""
              }`}
            />
            <span
              className={`block w-6 h-[2px] bg-primary transition-opacity duration-300 ${
                menuOpen ? "opacity-0" : ""
              }`}
            />
            <span
              className={`block w-6 h-[2px] bg-primary transition-transform duration-300 ${
                menuOpen ? "-translate-y-[7px] -rotate-45" : ""
              }`}
            />
          </button>
        </div>
      </div>

      {/* Mobile panel */}
      <div
        className={`md:hidden overflow-hidden transition-[max-height] duration-300 ease-out bg-background ${
          menuOpen ? "max-h-80 border-t border-ink/5" : "max-h-0"
        }`}
      >
        <nav aria-label="Mobile" className="px-6 py-4 flex flex-col gap-1">
          {NAV_LINKS.map((link) => (
            <a
              key={link.route}
              href={`#/${link.route}`}
              onClick={() => setMenuOpen(false)}
              className={`py-3 text-lead font-semibold border-b border-ink/5 last:border-0 ${
                route === link.route ? "text-accent" : "text-primary"
              }`}
            >
              {t(link.label)}
            </a>
          ))}
        </nav>
      </div>
    </header>
  )
}
