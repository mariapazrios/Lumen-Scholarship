import Reveal from "./primitives/Reveal"
import Watermark from "./primitives/Watermark"
import { useLang, type L } from "../lib/i18n"

type Props = {
  label: L
  href: string
  tone?: "white" | "soft"
}

/** Closing section with a single oversized arrow link (the "Meet the Lumens" pattern). */
export default function CtaLink({ label, href, tone = "white" }: Props) {
  const { t } = useLang()
  return (
    <section
      className={`${tone === "soft" ? "bg-surface-soft" : "bg-background"} relative overflow-hidden`}
    >
      <Watermark className="-right-32 -bottom-28 w-[24rem]" />
      <div className="max-w-8xl mx-auto px-6 md:px-10 lg:px-16 py-16 md:py-24 relative">
        <Reveal>
          <a
            href={href}
            className="group inline-flex items-center gap-8 text-primary hover:text-foreground transition-all duration-200 hover:translate-x-2"
          >
            <span className="text-h2 font-semibold uppercase tracking-wide">{t(label)}</span>
            <svg width="112" height="32" viewBox="0 0 112 32" fill="none" aria-hidden="true">
              <path d="M0 16h108M84 2l24 14-24 14" stroke="currentColor" strokeWidth="2.5" />
            </svg>
          </a>
        </Reveal>
      </div>
    </section>
  )
}
