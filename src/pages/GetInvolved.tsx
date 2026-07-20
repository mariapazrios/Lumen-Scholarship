import ArrowButton from "../components/primitives/ArrowButton"
import CountUp from "../components/primitives/CountUp"
import Reveal from "../components/primitives/Reveal"
import { useLang, type L } from "../lib/i18n"

/** Drop the program's public contact email here when confirmed (e.g. "hello@..."). */
const CONTACT_EMAIL = ""

const INDIVIDUAL_GIVES: L[] = [
  { en: "Speak at a mentorship session", es: "Da una charla de mentoría" },
  { en: "Take a 15-minute networking call with a Lumen", es: "Toma una llamada de networking de 15 minutos con un Lumen" },
  { en: "Run an interview or resume workshop", es: "Dirige un taller de entrevistas u hoja de vida" },
  { en: "Share Lumen with potential donors", es: "Comparte Lumen con donantes potenciales" },
]

const CORPORATE_GIVES: L[] = [
  { en: "Open internships and early-career roles", es: "Abre prácticas y vacantes de inicio de carrera" },
  { en: "Fast-track Lumen applications", es: "Agiliza los procesos de selección para los Lumens" },
  { en: "Host a session with your recruiting team", es: "Organiza una sesión con tu equipo de selección" },
]

const RECEIVE: L[] = [
  { en: "Real impact on social mobility in Colombia", es: "Impacto real en la movilidad social de Colombia" },
  { en: "A program with a track record of top performance", es: "Un programa con historial de alto desempeño" },
  { en: "Privileged access to hyper-curated talent", es: "Acceso privilegiado a talento altamente seleccionado" },
  { en: "A yearly report on every Lumen", es: "Un informe anual sobre cada Lumen" },
  { en: "Social responsibility your team can see", es: "Responsabilidad social visible para tu equipo" },
  { en: "U.S. or Colombian tax deductions", es: "Deducciones tributarias en Estados Unidos o Colombia" },
]

const TIERS: Array<{
  label: L
  amount: number
  note: L
  detail: L
  featured?: boolean
}> = [
  {
    label: { en: "Full scholarship", es: "Beca completa" },
    amount: 40,
    note: { en: "$160M COP upfront", es: "$160M COP de contado" },
    detail: {
      en: "Or in installments over 4 years at 0% interest, before tax deductions.",
      es: "O en cuotas durante 4 años al 0% de interés, antes de deducciones tributarias.",
    },
    featured: true,
  },
  {
    label: { en: "Half scholarship", es: "Media beca" },
    amount: 25,
    note: { en: "$95M COP", es: "$95M COP" },
    detail: {
      en: "Co-sponsor a Lumen with a partner, upfront or over 4 years.",
      es: "Copatrocina un Lumen con un socio, de contado o a 4 años.",
    },
  },
  {
    label: { en: "Partial scholarship", es: "Beca parcial" },
    amount: 10,
    note: { en: "From one-fifth of a scholarship", es: "Desde una quinta parte de una beca" },
    detail: {
      en: "Shares from one-third to one-fifth, from roughly $208 a month.",
      es: "Participaciones desde un tercio hasta una quinta parte, desde unos $208 al mes.",
    },
  },
]

function SponsorsSection() {
  const { lang, t } = useLang()
  return (
    <section id="sponsors" className="bg-surface-soft scroll-mt-24">
      <div className="max-w-8xl mx-auto px-6 md:px-10 lg:px-16 py-16 md:py-28">
        <Reveal>
          <div className="text-meta uppercase tracking-widest text-muted mb-4">
            {lang === "es" ? "Para patrocinadores" : "For sponsors"}
          </div>
          <h2 className="text-h2 font-semibold text-primary max-w-3xl">
            {lang === "es" ? (
              <>
                Aporta recursos, aporta tiempo,
                <br />
                <em className="italic font-light">o ambos.</em>
              </>
            ) : (
              <>
                Give money, give time,
                <br />
                <em className="italic font-light">or both.</em>
              </>
            )}
          </h2>
        </Reveal>

        {/* Donor tiers */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-14">
          {TIERS.map((tier, i) => (
            <Reveal key={tier.label.en} delay={i * 120}>
              <div
                className={`rounded-sm p-8 md:p-10 h-full flex flex-col transition-transform duration-300 hover:-translate-y-1 ${
                  tier.featured
                    ? "bg-primary text-primary-foreground"
                    : "bg-white border border-ink/10"
                }`}
              >
                <div
                  className={`text-meta uppercase tracking-widest ${
                    tier.featured ? "text-primary-foreground/60" : "text-muted"
                  }`}
                >
                  {t(tier.label)}
                </div>
                <div
                  className={`text-stat font-bold mt-4 tabular-nums ${
                    tier.featured ? "" : "text-primary"
                  }`}
                >
                  ~US$
                  <CountUp value={tier.amount} duration={900 + i * 150} />K
                </div>
                <div
                  className={`text-body mt-1 ${
                    tier.featured ? "text-primary-foreground/75" : "text-muted"
                  }`}
                >
                  {t(tier.note)}
                </div>
                <p
                  className={`text-body mt-4 flex-1 ${
                    tier.featured ? "text-primary-foreground/75" : "text-ink/75"
                  }`}
                >
                  {t(tier.detail)}
                </p>
              </div>
            </Reveal>
          ))}
        </div>

        {/* Tax + process */}
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
                    PSE, tarjeta o cheque. Beneficio tributario del 25%, y la universidad suma
                    una contrapartida a cada beca.
                  </>
                ) : (
                  <>
                    Directly through <strong>Universidad de los Andes</strong>: transfer, PSE,
                    card, or check. A 25% tax benefit, and the university adds counterpart
                    funding to every scholarship.
                  </>
                )}
              </p>
            </div>
          </Reveal>
        </div>

        {/* Affiliates */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-12 mt-20">
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

        {/* What sponsors receive */}
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-6">
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
                  Impulsa a la
                  <br />
                  <em className="italic font-semibold">próxima generación.</em>
                </>
              ) : (
                <>
                  Back the
                  <br />
                  <em className="italic font-semibold">next generation.</em>
                </>
              )}
            </h1>
            <p className="text-lead font-light text-primary-foreground/75 mt-6">
              {lang === "es"
                ? "Aporta tiempo, abre puertas o financia una beca. Así funciona."
                : "Give time, open doors, or fund a scholarship. Here's how."}
            </p>
            <div className="mt-10 flex flex-wrap gap-x-10 gap-y-4">
              <ArrowButton
                label={lang === "es" ? "Para patrocinadores" : "For sponsors"}
                tone="white"
                href="#sponsors"
              />
              <ArrowButton
                label={lang === "es" ? "Para estudiantes" : "For students"}
                tone="white"
                href="#/apply"
              />
            </div>
          </Reveal>
        </div>
      </section>

      <SponsorsSection />

      {/* Closing CTA */}
      <section className="bg-primary text-primary-foreground">
        <div className="max-w-8xl mx-auto px-6 md:px-10 lg:px-16 py-16 md:py-24 text-center">
          <Reveal>
            <h2 className="text-h2 font-semibold max-w-3xl mx-auto">
              {lang === "es" ? "¿Listo para abrir una puerta?" : "Ready to open a door?"}
            </h2>
            <p className="text-lead font-light text-primary-foreground/75 mt-4 max-w-xl mx-auto">
              {CONTACT_EMAIL
                ? lang === "es"
                  ? "Escríbenos y nosotros nos encargamos del resto."
                  : "Write to us and we'll take it from there."
                : lang === "es"
                  ? "Contacta a cualquier miembro de la Junta Lumen o al equipo de filantropía de la Universidad de los Andes."
                  : "Reach out to any member of the Lumen Board, or to the Universidad de los Andes philanthropy team."}
            </p>
            <div className="mt-8 flex justify-center">
              {CONTACT_EMAIL ? (
                <ArrowButton
                  label={lang === "es" ? "Contacta a Lumen" : "Contact Lumen"}
                  tone="white"
                  href={`mailto:${CONTACT_EMAIL}`}
                />
              ) : (
                <ArrowButton
                  label={lang === "es" ? "Conoce al equipo" : "Meet the team"}
                  tone="white"
                  href="#/team"
                />
              )}
            </div>
          </Reveal>
        </div>
      </section>
    </>
  )
}
