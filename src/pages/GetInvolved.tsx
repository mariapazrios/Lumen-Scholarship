import ArrowButton from "../components/primitives/ArrowButton"
import Reveal from "../components/primitives/Reveal"
import AdmissionsProcess from "../components/AdmissionsProcess"
import { useLang, type L } from "../lib/i18n"

/** Drop the program's public contact email here when confirmed (e.g. "hello@..."). */
const CONTACT_EMAIL = ""

const INDIVIDUAL_GIVES: L[] = [
  {
    en: "Join 60-minute industry and mentorship speaker series",
    es: "Participa en charlas de industria y mentoría de 60 minutos",
  },
  {
    en: "Connect with Lumens for 15-30 minute networking calls",
    es: "Conéctate con los Lumens en llamadas de networking de 15 a 30 minutos",
  },
  {
    en: "Participate in brief interview and resume workshops",
    es: "Participa en talleres breves de entrevistas y hoja de vida",
  },
  {
    en: "Share Lumen with potential donors",
    es: "Comparte Lumen con donantes potenciales",
  },
]

const CORPORATE_GIVES: L[] = [
  {
    en: "Provide access to relevant internships and early-career opportunities",
    es: "Ofrece acceso a prácticas y oportunidades de inicio de carrera",
  },
  {
    en: "Fast-track application processes for Lumens",
    es: "Agiliza los procesos de selección para los Lumens",
  },
  {
    en: "Host Lumen networking sessions with your firm's recruiting team",
    es: "Organiza sesiones de networking con el equipo de selección de tu empresa",
  },
]

const RECEIVE: L[] = [
  {
    en: "Actively combat inequity and the lack of social mobility in Colombia by empowering talented, underprivileged youth",
    es: "Combate activamente la inequidad y la falta de movilidad social en Colombia empoderando a jóvenes talentosos de bajos recursos",
  },
  {
    en: "Maximize your philanthropic impact through a program with a track record of top performance",
    es: "Maximiza tu impacto filantrópico a través de un programa con un historial de alto desempeño",
  },
  {
    en: "Unlock privileged corporate access to a pool of hyper-curated, top talent",
    es: "Accede de manera privilegiada a un grupo de talento altamente seleccionado",
  },
  {
    en: "Receive yearly reports to scope Lumen talent over time",
    es: "Recibe informes anuales para seguir de cerca el talento Lumen",
  },
  {
    en: "Strengthen values of social responsibility, diversity, and inclusion at your firm",
    es: "Fortalece los valores de responsabilidad social, diversidad e inclusión en tu empresa",
  },
  {
    en: "Claim U.S. or Colombian tax deductions",
    es: "Accede a deducciones tributarias en Estados Unidos o Colombia",
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
          <Reveal>
            <div className="bg-primary text-primary-foreground rounded-sm p-8 md:p-10 h-full flex flex-col">
              <div className="text-meta uppercase tracking-widest text-primary-foreground/60">
                {lang === "es" ? "Beca completa" : "Full scholarship"}
              </div>
              <div className="text-stat font-bold mt-4">~US$40K</div>
              <div className="text-body text-primary-foreground/75 mt-1">
                {lang === "es" ? "$160M COP de contado" : "$160M COP upfront"}
              </div>
              <p className="text-body text-primary-foreground/75 mt-4 flex-1">
                {lang === "es"
                  ? "O ~US$50K ($190M COP) en cuotas durante 4 años al 0% de interés, alrededor de $1,042 al mes antes de deducciones tributarias."
                  : "Or ~US$50K ($190M COP) in installments over 4 years at 0% interest, about $1,042 a month before tax deductions."}
              </p>
            </div>
          </Reveal>
          <Reveal delay={120}>
            <div className="bg-white border border-ink/10 rounded-sm p-8 md:p-10 h-full flex flex-col">
              <div className="text-meta uppercase tracking-widest text-muted">
                {lang === "es" ? "Media beca" : "Half scholarship"}
              </div>
              <div className="text-stat font-bold text-primary mt-4">~US$25K</div>
              <div className="text-body text-muted mt-1">$95M COP</div>
              <p className="text-body text-ink/75 mt-4 flex-1">
                {lang === "es"
                  ? "Copatrocina un Lumen con un socio, de contado o diferido a 4 años."
                  : "Co-sponsor a Lumen with a partner, upfront or deferred over 4 years."}
              </p>
            </div>
          </Reveal>
          <Reveal delay={240}>
            <div className="bg-white border border-ink/10 rounded-sm p-8 md:p-10 h-full flex flex-col">
              <div className="text-meta uppercase tracking-widest text-muted">
                {lang === "es" ? "Beca parcial" : "Partial scholarship"}
              </div>
              <div className="text-stat font-bold text-primary mt-4">
                {lang === "es" ? "desde ~US$10K" : "from ~US$10K"}
              </div>
              <div className="text-body text-muted mt-1">
                {lang === "es" ? "Una quinta parte, a 4 años" : "One-fifth share, over 4 years"}
              </div>
              <p className="text-body text-ink/75 mt-4 flex-1">
                {lang === "es"
                  ? "Participaciones desde un tercio hasta una quinta parte de una beca, desde aproximadamente $208 al mes."
                  : "Shares from one-third to one-fifth of a scholarship, from roughly $208 a month."}
              </p>
            </div>
          </Reveal>
        </div>

        {/* Tax + process */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <Reveal>
            <div className="bg-white border border-ink/10 rounded-sm p-8 h-full">
              <h3 className="text-h3 font-semibold text-primary">
                {lang === "es" ? "Donar desde Estados Unidos" : "Donating from the U.S."}
              </h3>
              <p className="text-body text-ink/75 mt-3">
                {lang === "es" ? (
                  <>
                    Las donaciones son totalmente deducibles de impuestos a través de la{" "}
                    <strong>University of the Andes Foundation</strong>, una organización
                    501(c)(3) del IRS con calificación 4/4 en Charity Navigator. Pago en
                    línea, transferencia o cheque. Y pregunta en tu empresa: muchas duplican
                    la donación de sus empleados.
                  </>
                ) : (
                  <>
                    Donations are fully tax-deductible via the{" "}
                    <strong>University of the Andes Foundation</strong>, a 501(c)(3) IRS
                    organization rated 4/4 stars on Charity Navigator. Online payment, wire
                    transfer, or check. Check your employer's matching program.
                  </>
                )}
              </p>
            </div>
          </Reveal>
          <Reveal delay={120}>
            <div className="bg-white border border-ink/10 rounded-sm p-8 h-full">
              <h3 className="text-h3 font-semibold text-primary">
                {lang === "es" ? "Donar desde Colombia" : "Donating from Colombia"}
              </h3>
              <p className="text-body text-ink/75 mt-3">
                {lang === "es" ? (
                  <>
                    Dona directamente a través de la{" "}
                    <strong>Universidad de los Andes</strong>: transferencia bancaria, PSE,
                    tarjeta de crédito o débito, o cheque. Las donaciones ofrecen un
                    beneficio tributario del 25% sobre la renta líquida, y la universidad
                    suma una contrapartida a cada beca.
                  </>
                ) : (
                  <>
                    Give directly through <strong>Universidad de los Andes</strong>: bank
                    transfer, PSE, credit/debit card, or check. Donations provide a 25% tax
                    shield from renta líquida, and the university adds counterpart funding
                    on top of every scholarship.
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
                {INDIVIDUAL_GIVES.map((g) => (
                  <li key={g.en.slice(0, 24)} className="text-body text-ink/80 flex gap-3">
                    <span aria-hidden="true" className="w-1.5 h-1.5 rounded-full bg-accent mt-2.5 shrink-0" />
                    {t(g)}
                  </li>
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
                {CORPORATE_GIVES.map((g) => (
                  <li key={g.en.slice(0, 24)} className="text-body text-ink/80 flex gap-3">
                    <span aria-hidden="true" className="w-1.5 h-1.5 rounded-full bg-accent mt-2.5 shrink-0" />
                    {t(g)}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>

        {/* What sponsors receive */}
        <Reveal delay={120}>
          <div className="mt-20">
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-6">
              {RECEIVE.map((r, i) => (
                <div key={r.en.slice(0, 24)} className="flex gap-4">
                  <span className="text-meta font-bold text-accent tabular-nums mt-1">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <p className="text-body text-ink/80">{t(r)}</p>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
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
                  Cada Lumen comienza con
                  <br />
                  <em className="italic font-semibold">alguien que dijo sí.</em>
                </>
              ) : (
                <>
                  Every Lumen starts with
                  <br />
                  <em className="italic font-semibold">someone who said yes.</em>
                </>
              )}
            </h1>
            <p className="text-lead font-light text-primary-foreground/75 mt-6">
              {lang === "es"
                ? "Si eres un estudiante listo para desafiar límites, una persona que quiere abrir puertas o una empresa que busca talento excepcional, hay un lugar para ti en el ecosistema."
                : "Whether you're a student ready to defy limits, an individual who wants to open doors, or a company looking for exceptional talent, there's a place for you in the ecosystem."}
            </p>
            <div className="mt-10 flex flex-wrap gap-x-10 gap-y-4">
              <ArrowButton
                label={lang === "es" ? "Para estudiantes" : "For students"}
                tone="white"
                href="#students"
              />
              <ArrowButton
                label={lang === "es" ? "Para patrocinadores" : "For sponsors"}
                tone="white"
                href="#sponsors"
              />
            </div>
          </Reveal>
        </div>
      </section>

      <AdmissionsProcess />
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
