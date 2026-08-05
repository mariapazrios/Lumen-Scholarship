import Reveal from "../primitives/Reveal"
import { useLang } from "../../lib/i18n"

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
      </div>
    </section>
  )
}
