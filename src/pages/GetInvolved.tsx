import CountUp from "../components/primitives/CountUp"
import Reveal from "../components/primitives/Reveal"
import { useLang, type L } from "../lib/i18n"

const CONTACT_EMAIL = "hq@lumenedu.org"

const INDIVIDUAL_GIVES: L[] = [
  { en: "Speak at a mentorship session", es: "Da una charla de mentoría" },
  { en: "Take a 15-minute networking call with a Lumen", es: "Toma una llamada de networking de 15 minutos con un Lumen" },
  { en: "Run an interview or resume workshop", es: "Dirige un taller de entrevistas u hoja de vida" },
  { en: "Share Lumen with potential sponsors", es: "Comparte Lumen con patrocinadores potenciales" },
]

const CORPORATE_GIVES: L[] = [
  { en: "Open internships and early-career roles", es: "Abre prácticas y vacantes de inicio de carrera" },
  { en: "Fast-track Lumen applications", es: "Agiliza los procesos de selección para los Lumens" },
  { en: "Host a session with your recruiting team", es: "Organiza una sesión con tu equipo de selección" },
]

const RECEIVE: L[] = [
  { en: "Real impact on social mobility in Colombia", es: "Impacto real en la movilidad social de Colombia" },
  {
    en: "Privileged access to hyper-curated talent with a track record of top performance",
    es: "Acceso privilegiado a talento altamente seleccionado y con historial de alto desempeño",
  },
  { en: "A yearly report on every Lumen", es: "Un informe anual sobre cada Lumen" },
  { en: "U.S. or Colombian tax deductions", es: "Deducciones tributarias en Estados Unidos o Colombia" },
]

const TIERS: Array<{
  label: L
  amount?: number
  cop?: L
  detail?: L
}> = [
  {
    label: { en: "Full scholarship", es: "Beca completa" },
    amount: 50,
    cop: { en: "$190M COP", es: "$190M COP" },
  },
  {
    label: { en: "Half scholarship", es: "Media beca" },
    amount: 25,
    cop: { en: "$95M COP", es: "$95M COP" },
  },
  {
    label: { en: "Ad hoc", es: "Monto libre" },
    detail: {
      en: "Contributions under $5K will be allocated to fund the living stipend every Lumen receives each semester.",
      es: "Los aportes de menos de $5K se destinarán a financiar el apoyo de sostenimiento que cada Lumen recibe cada semestre.",
    },
  },
]

/** Sponsors fund the program: tuition, stipend, the scholarships themselves. */
function SponsorsSection() {
  const { lang, t } = useLang()
  return (
    <section id="sponsors" className="bg-surface-soft scroll-mt-24">
      <div className="max-w-8xl mx-auto px-6 md:px-10 lg:px-16 py-16 md:py-28">
        <Reveal>
          <div className="text-meta uppercase tracking-widest text-muted mb-4">
            {lang === "es" ? "Patrocinadores" : "Sponsors"}
          </div>
          <h2 className="text-h2 font-semibold text-primary">
            {lang === "es" ? (
              <>
                Cada beca empieza con{" "}
                <em className="italic font-light">un patrocinador.</em>
              </>
            ) : (
              <>
                Every scholarship starts with{" "}
                <em className="italic font-light">a sponsor.</em>
              </>
            )}
          </h2>
          <p className="text-lead font-light text-ink/80 mt-6">
            {lang === "es"
              ? "El programa se financia por completo con donaciones: matrícula, sostenimiento y los diez semestres que siguen. Cada aporte se traduce directamente en un estudiante que puede estudiar."
              : "The program is funded entirely by donations: tuition, the living stipend, and the ten semesters that follow. Every contribution translates directly into a student who gets to study."}
          </p>
        </Reveal>

        {/* Donor tiers */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-14">
          {TIERS.map((tier, i) => (
            <Reveal key={tier.label.en} delay={i * 120}>
              <div className="rounded-sm p-8 h-full flex flex-col bg-white border border-ink/10 transition-transform duration-300 hover:-translate-y-1">
                <div className="text-meta uppercase tracking-widest text-muted">
                  {t(tier.label)}
                </div>
                <div className="text-h2 font-bold mt-4 tabular-nums text-primary">
                  {tier.amount ? (
                    <>
                      ~US$
                      <CountUp value={tier.amount} duration={900 + i * 150} />K
                    </>
                  ) : (
                    <span>{lang === "es" ? "Tú eliges" : "Any amount"}</span>
                  )}
                </div>
                {tier.cop && <div className="text-body mt-2 text-muted">{t(tier.cop)}</div>}
                {tier.detail && (
                  <p className="text-body text-ink/75 mt-3 flex-1">{t(tier.detail)}</p>
                )}
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={120}>
          <p className="text-body text-ink/75 mt-6">
            {lang === "es"
              ? "Cualquiera de las tres opciones se puede pagar de contado o diferida en cuotas semestrales, cada 6 meses, al 0% de interés."
              : "Any of the three can be paid upfront or deferred in semester installments, every 6 months, at 0% interest."}
          </p>
        </Reveal>

        {/* Tax treatment */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <Reveal>
            <div className="bg-white border border-ink/10 rounded-sm p-8 h-full">
              <h3 className="text-h3 font-semibold text-primary">
                {lang === "es" ? "Desde Estados Unidos" : "From the U.S."}
              </h3>
              <p className="text-body text-ink/75 mt-3">
                {lang === "es" ? (
                  <>
                    Deducible de impuestos vía la{" "}
                    <strong>University of the Andes Foundation</strong>, una 501(c)(3) con
                    calificación 4/4 en Charity Navigator. En línea, transferencia o cheque.
                    Muchas empresas duplican la donación.
                  </>
                ) : (
                  <>
                    Tax-deductible via the <strong>University of the Andes Foundation</strong>,
                    a 501(c)(3) rated 4/4 on Charity Navigator. Online, wire, or check. Many
                    employers match.
                  </>
                )}
              </p>
            </div>
          </Reveal>
          <Reveal delay={120}>
            <div className="bg-white border border-ink/10 rounded-sm p-8 h-full">
              <h3 className="text-h3 font-semibold text-primary">
                {lang === "es" ? "Desde Colombia" : "From Colombia"}
              </h3>
              <p className="text-body text-ink/75 mt-3">
                {lang === "es" ? (
                  <>
                    Directamente a la <strong>Universidad de los Andes</strong>: transferencia,
                    PSE, tarjeta o cheque, con un beneficio tributario del 25%.
                  </>
                ) : (
                  <>
                    Directly through <strong>Universidad de los Andes</strong>: transfer, PSE,
                    card, or check, with a 25% tax benefit.
                  </>
                )}
              </p>
            </div>
          </Reveal>
        </div>

        {/* What sponsors receive: four points, two per column */}
        <div className="mt-20">
          <Reveal>
            <h3 className="text-h3 font-semibold text-primary mb-8">
              {lang === "es" ? (
                <>
                  Lo que los patrocinadores <em className="italic font-light">reciben.</em>
                </>
              ) : (
                <>
                  What sponsors <em className="italic font-light">receive.</em>
                </>
              )}
            </h3>
          </Reveal>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-16 gap-y-6">
            {RECEIVE.map((r, i) => (
              <Reveal key={r.en.slice(0, 24)} delay={i * 80}>
                <div className="flex gap-4">
                  <span className="text-meta font-bold text-accent tabular-nums mt-1">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <p className="text-body text-ink/80">{t(r)}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

/** Everything that isn't money: time, access, opportunity. */
function OtherWaysSection() {
  const { lang, t } = useLang()
  return (
    <section id="other-ways" className="bg-background scroll-mt-24">
      <div className="max-w-8xl mx-auto px-6 md:px-10 lg:px-16 py-16 md:py-28">
        <Reveal>
          <div className="text-meta uppercase tracking-widest text-muted mb-4">
            {lang === "es" ? "Otras formas de vincularse" : "Other ways to get involved"}
          </div>
          <h2 className="text-h2 font-semibold text-primary">
            {lang === "es" ? (
              <>
                El tiempo y el acceso{" "}
                <em className="italic font-light">nos hacen más fuertes.</em>
              </>
            ) : (
              <>
                Time and access <em className="italic font-light">make us stronger.</em>
              </>
            )}
          </h2>
          <p className="text-lead font-light text-ink/80 mt-6">
            {lang === "es"
              ? "Mentoría, talleres, prácticas y contactos."
              : "Mentorship, workshops, internships, and contacts."}
          </p>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-12 mt-14">
          <Reveal>
            <div className="border-t-2 border-primary pt-6">
              <h3 className="text-h3 font-semibold text-primary">
                {lang === "es" ? (
                  <>
                    Las personas <em className="italic font-light">aportan tiempo.</em>
                  </>
                ) : (
                  <>
                    Individuals <em className="italic font-light">give time.</em>
                  </>
                )}
              </h3>
              <ul className="mt-5 space-y-3">
                {INDIVIDUAL_GIVES.map((g, i) => (
                  <Reveal key={g.en.slice(0, 24)} delay={i * 90} as="li">
                    <span className="text-body text-ink/80 flex gap-3">
                      <span aria-hidden="true" className="w-1.5 h-1.5 rounded-full bg-accent mt-2.5 shrink-0" />
                      {t(g)}
                    </span>
                  </Reveal>
                ))}
              </ul>
            </div>
          </Reveal>
          <Reveal delay={120}>
            <div className="border-t-2 border-primary pt-6">
              <h3 className="text-h3 font-semibold text-primary">
                {lang === "es" ? (
                  <>
                    Las empresas <em className="italic font-light">aportan acceso.</em>
                  </>
                ) : (
                  <>
                    Corporates <em className="italic font-light">give access.</em>
                  </>
                )}
              </h3>
              <ul className="mt-5 space-y-3">
                {CORPORATE_GIVES.map((g, i) => (
                  <Reveal key={g.en.slice(0, 24)} delay={i * 90} as="li">
                    <span className="text-body text-ink/80 flex gap-3">
                      <span aria-hidden="true" className="w-1.5 h-1.5 rounded-full bg-accent mt-2.5 shrink-0" />
                      {t(g)}
                    </span>
                  </Reveal>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

export default function GetInvolved() {
  const { lang } = useLang()

  return (
    <>
      <section className="bg-primary text-primary-foreground relative overflow-hidden">
        <img
          src="/lumen-icon.png"
          alt=""
          aria-hidden="true"
          className="pointer-events-none select-none absolute -right-32 -top-32 w-[30rem] opacity-[0.06] brightness-0 invert"
        />
        <div className="max-w-8xl mx-auto px-6 md:px-10 lg:px-16 py-16 md:py-24 relative">
          <Reveal>
            <div className="text-meta uppercase tracking-widest text-primary-foreground/60 mb-4">
              {lang === "es" ? "Vincúlate" : "Get involved"}
            </div>
            <h1 className="text-display font-light">
              {lang === "es" ? (
                <>
                  Impulsa a la <em className="italic font-semibold">próxima generación.</em>
                </>
              ) : (
                <>
                  Back the <em className="italic font-semibold">next generation.</em>
                </>
              )}
            </h1>
            <p className="text-lead font-light text-primary-foreground/75 mt-6">
              {lang === "es"
                ? "Hay dos maneras de vincularse. Los patrocinadores financian las becas, que es lo que mantiene el programa en pie. Otros aportan tiempo, acceso y oportunidades. Ambas cuentan."
                : "There are two ways in. Sponsors fund the scholarships, which is what keeps the program running. Others give time, access, and opportunity. Both matter."}
            </p>
          </Reveal>
        </div>
      </section>

      <SponsorsSection />
      <OtherWaysSection />

      {/* Closing CTA */}
      <section className="bg-primary text-primary-foreground">
        <div className="max-w-8xl mx-auto px-6 md:px-10 lg:px-16 py-16 md:py-24 text-center">
          <Reveal>
            <h2 className="text-h2 font-semibold max-w-3xl mx-auto">
              {lang === "es" ? "¿Listo para abrir una puerta?" : "Ready to open a door?"}
            </h2>
            <p className="text-lead font-light text-primary-foreground/75 mt-4 max-w-xl mx-auto">
              {lang === "es" ? "Escríbenos a " : "Reach out to "}
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="font-semibold underline underline-offset-4 decoration-primary-foreground/40 hover:decoration-primary-foreground transition-colors duration-200"
              >
                {CONTACT_EMAIL}
              </a>
              .
            </p>
          </Reveal>
        </div>
      </section>
    </>
  )
}
