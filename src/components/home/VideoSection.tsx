import { useRef, useState } from "react"
import Reveal from "../primitives/Reveal"
import Watermark from "../primitives/Watermark"
import { useLang } from "../../lib/i18n"

/** The program film: a 90-second cut from the Lumen interview shoots. */
export default function VideoSection() {
  const { lang } = useLang()
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const [playing, setPlaying] = useState(false)

  const play = () => {
    videoRef.current?.play()
    setPlaying(true)
  }

  return (
    <section className="bg-primary text-primary-foreground relative overflow-hidden">
      <Watermark onDark className="-right-36 -bottom-36 w-[26rem]" />
      <div className="max-w-8xl mx-auto px-6 md:px-10 lg:px-16 py-16 md:py-28 relative">
        <Reveal>
          <div className="relative rounded-sm overflow-hidden aspect-video max-w-5xl mx-auto bg-ink">
            <video
              ref={videoRef}
              src="/videos/program.mp4"
              poster="/videos/program-poster.jpg"
              preload="none"
              controls={playing}
              playsInline
              onEnded={() => setPlaying(false)}
              className="absolute inset-0 w-full h-full object-cover"
            />
            {!playing && (
              <button
                type="button"
                onClick={play}
                aria-label={lang === "es" ? "Reproducir el video de Lumen" : "Play the Lumen film"}
                className="absolute inset-0 grid place-items-center group cursor-pointer bg-primary/30 transition-colors duration-300 hover:bg-primary/20"
              >
                <span className="w-24 h-24 rounded-full bg-white/95 grid place-items-center transition-transform duration-300 group-hover:scale-110 shadow-xl">
                  <svg width="26" height="30" viewBox="0 0 26 30" aria-hidden="true">
                    <path d="M2 2 L24 15 L2 28 Z" fill="var(--color-navy)" />
                  </svg>
                </span>
              </button>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  )
}
