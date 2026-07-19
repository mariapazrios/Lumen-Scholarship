import Reveal from "../components/primitives/Reveal"
import Generations from "../components/home/Generations"
import CtaLink from "../components/CtaLink"
import { SCHOLARS, type Scholar } from "../data/scholars"
import { useLang } from "../lib/i18n"

function Profile({ scholar, index }: { scholar: Scholar; index: number }) {
  const { lang, t, tl } = useLang()
  const reversed = index % 2 === 1
  return (
    <article
      id={`scholar-${scholar.slug}`}
      className={`scroll-mt-24 ${index % 2 === 0 ? "bg-background" : "bg-surface-soft"}`}
    >
      <div className="max-w-8xl mx-auto px-6 md:px-10 lg:px-16 py-16 md:py-24">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10 lg:gap-16 items-start">
          <Reveal className={`md:col-span-2 ${reversed ? "md:order-2" : ""}`}>
            <div className="relative max-w-sm">
              <div
                aria-hidden="true"
                className={`absolute w-2/3 h-2/3 bg-surface rounded-sm ${
                  reversed ? "-right-4 -bottom-4" : "-left-4 -bottom-4"
                }`}
              />
              <img
                src={`/scholars/${scholar.slug}.jpg`}
                alt={
                  lang === "es"
                    ? `${scholar.name}, estudiante Lumen`
                    : `${scholar.name}, Lumen scholar`
                }
                className="relative w-full rounded-sm object-cover object-[center_15%] aspect-[4/5]"
                loading="lazy"
              />
            </div>
            {scholar.video && (
              <div className="max-w-sm mt-8">
                <video
                  controls
                  preload="none"
                  playsInline
                  poster={`/videos/${scholar.slug}.jpg`}
                  src={`/videos/${scholar.slug}.mp4`}
                  className="w-full rounded-sm bg-ink aspect-video object-cover"
                />
                <div className="text-meta uppercase tracking-widest text-muted mt-2.5">
                  {lang === "es" ? "En sus propias palabras" : "In their own words"}
                </div>
              </div>
            )}
          </Reveal>

          <Reveal delay={120} className={`md:col-span-3 ${reversed ? "md:order-1" : ""}`}>
            <div className="max-w-2xl">
              <div className="text-meta uppercase tracking-widest text-muted">
                {lang === "es" ? "Generación" : "Generation"} {scholar.generation} ·{" "}
                {scholar.hometown}, {scholar.department}
              </div>
              <h2 className="text-h2 font-semibold text-primary mt-2">{scholar.name}</h2>
              <div className="text-lead font-light text-accent mt-1">{t(scholar.major)}</div>

              <blockquote className="text-h3 font-light italic text-primary mt-8 border-l-2 border-accent pl-6">
                &ldquo;{t(scholar.quote)}&rdquo;
              </blockquote>

              <div className="mt-8 space-y-4">
                {tl(scholar.story).map((p) => (
                  <p key={p.slice(0, 24)} className="text-body text-ink/80">
                    {p}
                  </p>
                ))}
              </div>

              <div className="mt-8">
                <div className="text-meta uppercase tracking-widest text-muted mb-3">
                  {lang === "es" ? "En el campus" : "On campus"}
                </div>
                <ul className="space-y-2">
                  {tl(scholar.highlights).map((h) => (
                    <li key={h.slice(0, 24)} className="text-body text-ink/80 flex gap-3">
                      <span aria-hidden="true" className="w-1.5 h-1.5 rounded-full bg-accent mt-2.5 shrink-0" />
                      {h}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </article>
  )
}

export default function Scholars() {
  return (
    <>
      {/* The Lumens, by generation */}
      <Generations />

      {/* Full profiles */}
      {SCHOLARS.map((s, i) => (
        <Profile key={s.slug} scholar={s} index={i} />
      ))}

      <CtaLink
        label={{ en: "Meet the team", es: "Conoce al equipo" }}
        href="#/team"
        tone="soft"
      />
    </>
  )
}
