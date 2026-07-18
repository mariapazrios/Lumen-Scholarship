import { useState } from "react"
import Reveal from "../primitives/Reveal"
import Watermark from "../primitives/Watermark"
import { useLang } from "../../lib/i18n"

/**
 * Drop the program film's embed URL here when it's ready
 * (e.g. "https://www.youtube.com/embed/VIDEO_ID" or a Vimeo embed URL).
 * While empty, the section shows a poster frame with a "coming soon" tag.
 */
const PROGRAM_VIDEO_EMBED_URL = ""

export default function VideoSection() {
  const [playing, setPlaying] = useState(false)
  const { lang } = useLang()
  const hasVideo = PROGRAM_VIDEO_EMBED_URL.length > 0

  return (
    <section className="bg-primary text-primary-foreground relative overflow-hidden">
      <Watermark onDark className="-right-36 -bottom-36 w-[26rem]" />
      <div className="max-w-8xl mx-auto px-6 md:px-10 lg:px-16 py-16 md:py-28 relative">
        <Reveal>
          <div className="relative rounded-sm overflow-hidden aspect-video max-w-5xl mx-auto">
            {playing && hasVideo ? (
              <iframe
                src={`${PROGRAM_VIDEO_EMBED_URL}?autoplay=1`}
                title={lang === "es" ? "El video del programa Lumen" : "The Lumen program film"}
                className="absolute inset-0 w-full h-full"
                allow="autoplay; fullscreen; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <>
                <img
                  src="/hero-lumen.jpg"
                  alt={
                    lang === "es"
                      ? "Los estudiantes Lumen reunidos en el campus"
                      : "The Lumen scholars together on campus"
                  }
                  className="absolute inset-0 w-full h-full object-cover object-[center_30%]"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-primary/40" />
                {hasVideo ? (
                  <button
                    type="button"
                    onClick={() => setPlaying(true)}
                    aria-label={
                      lang === "es" ? "Reproducir el video de Lumen" : "Play the Lumen program film"
                    }
                    className="absolute inset-0 grid place-items-center group cursor-pointer"
                  >
                    <span className="w-24 h-24 rounded-full bg-white/95 grid place-items-center transition-transform duration-300 group-hover:scale-110 shadow-xl">
                      <svg width="26" height="30" viewBox="0 0 26 30" aria-hidden="true">
                        <path d="M2 2 L24 15 L2 28 Z" fill="var(--color-navy)" />
                      </svg>
                    </span>
                  </button>
                ) : (
                  <div className="absolute inset-0 grid place-items-center">
                    <div className="text-center px-6">
                      <span className="inline-block border border-white/40 rounded-full px-5 py-2 text-meta uppercase tracking-widest">
                        {lang === "es" ? "Video próximamente" : "Film coming soon"}
                      </span>
                      <p className="text-body text-primary-foreground/80 mt-4 max-w-sm mx-auto">
                        {lang === "es"
                          ? "Mientras tanto, conoce a los estudiantes en sus propias palabras."
                          : "Until then, meet the scholars in their own words."}
                      </p>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  )
}
