import Reveal from "../primitives/Reveal"
import { useLang } from "../../lib/i18n"
import { BOARD } from "../../data/team"

/**
 * The founder's own words, read from the board data rather than retyped here,
 * so her card on the team page and this line cannot drift apart.
 */
const FOUNDER = BOARD.find((m) => m.founder)

export default function Hero() {
  const { lang } = useLang()

  return (
    <section className="relative bg-primary text-primary-foreground overflow-hidden">
      {/* Aurora glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-40 right-[-10%] w-[48rem] h-[36rem] rounded-full blur-3xl opacity-25"
        style={{
          background:
            "radial-gradient(ellipse at center, var(--color-cobalt) 0%, transparent 65%)",
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-40 left-[-14%] w-[40rem] h-[30rem] rounded-full blur-3xl opacity-30"
        style={{
          background:
            "radial-gradient(ellipse at center, var(--color-navy-soft) 0%, transparent 65%)",
        }}
      />
      {/* Watermark mark */}
      <img
        src="/lumen-icon.png"
        alt=""
        aria-hidden="true"
        className="pointer-events-none select-none absolute -right-44 -top-32 w-[42rem] opacity-[0.06] brightness-0 invert"
      />

      <div className="max-w-8xl mx-auto px-6 md:px-10 lg:px-16 py-20 md:py-32 relative">
        <Reveal>
          <div className="text-meta uppercase tracking-widest text-primary-foreground/60 mb-8">
            {lang === "es" ? "Nuestra visión" : "Our vision"}
          </div>
          <h1 className="text-display font-light tracking-tight">
            {lang === "es" ? (
              <>
                Un programa de becas para la
                <br />
                <em className="italic font-semibold">
                  movilidad social basada en educación.
                </em>
              </>
            ) : (
              <>
                A scholarship program for
                <br />
                <em className="italic font-semibold">education-based social mobility.</em>
              </>
            )}
          </h1>
        </Reveal>

        {/* The founder's line, set as a subtitle rather than a pull quote: no
            quote marks, no portrait, no card. It reads as the headline
            continuing to explain itself, which is what a subtitle is. The
            rule and the lighter second sentence carry the shift from claim to
            reason, so the two do not run together as one grey block. */}
        {FOUNDER && (
          <Reveal delay={140}>
            {/* Runs to the same measure as the headline above it rather than
                a narrower column: capped at max-w-3xl it wrapped early and
                read as a caption hanging off the title. Unattributed on
                purpose, so it reads as the programme's own position rather
                than one person's testimonial. */}
            <div className="mt-10 md:mt-12">
              <span
                aria-hidden="true"
                className="block w-16 h-px bg-primary-foreground/30 mb-8"
              />
              <p className="text-lead md:text-h3 font-light leading-relaxed text-primary-foreground/90">
                {lang === "es" ? FOUNDER.highlightLead?.es : FOUNDER.highlightLead?.en}
              </p>
              <p className="text-lead font-light leading-relaxed text-primary-foreground/65 mt-4">
                {lang === "es" ? FOUNDER.highlight.es : FOUNDER.highlight.en}
              </p>
            </div>
          </Reveal>
        )}
      </div>
    </section>
  )
}
