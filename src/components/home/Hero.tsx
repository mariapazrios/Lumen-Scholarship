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
          {/* Three editorial lines: at the top of the display clamp each one runs
              about 30 characters, so the break points are load-bearing (P10). On a
              phone they are not: every line wraps anyway, and forcing them costs a
              sixth line of headline. Let the text flow below md. */}
          <h1 className="text-display font-light tracking-tight">
            {lang === "es" ? (
              <>
                Construimos el camino entre
                <br className="hidden md:inline" />{" "}
                el mejor talento de Colombia
                <br className="hidden md:inline" />{" "}
                <em className="italic font-semibold">y sus mejores empresas.</em>
              </>
            ) : (
              <>
                Building the path between
                <br className="hidden md:inline" />{" "}
                Colombia's best talent
                <br className="hidden md:inline" />{" "}
                <em className="italic font-semibold">and its best companies.</em>
              </>
            )}
          </h1>
          <p className="text-lead font-light text-primary-foreground/75 mt-8 max-w-3xl">
            {lang === "es"
              ? "Lumen encuentra estudiantes en el 1% superior del examen nacional a quienes ninguna empresa está buscando, financia diez semestres en Los Andes y los acompaña hasta que están dentro de las empresas que los necesitan."
              : "Lumen finds students in the top 1% of the national exam who no company is looking for, funds ten semesters at Los Andes, and stays with them until they are inside the firms that need them."}
          </p>
        </Reveal>
      </div>
    </section>
  )
}
