import { useCallback, useEffect, useRef, useState } from "react"
import { LangToggle } from "../Header"
import { useLang } from "../../lib/i18n"
import LumenMark3D from "./LumenMark3D"

const FADE_MS = 780
const CLICK_SLOP_PX = 12

type Props = {
  onEntered: () => void
}

export default function EnterLanding({ onEntered }: Props) {
  const { lang } = useLang()
  // Still tracked with no text to reveal: it is what arms the 720ms timer
  // below, so the intro cannot be clicked away before the mark assembles.
  const [together, setTogether] = useState(false)
  const [leaving, setLeaving] = useState(false)
  const onTogether = useCallback(() => setTogether(true), [])
  const leavingRef = useRef(false)
  const canLeaveRef = useRef(false)
  const origin = useRef<{ x: number; y: number } | null>(null)
  const onEnteredRef = useRef(onEntered)
  onEnteredRef.current = onEntered

  useEffect(() => {
    if (!together) return
    const id = window.setTimeout(() => {
      canLeaveRef.current = true
    }, 720)
    return () => window.clearTimeout(id)
  }, [together])

  useEffect(() => {
    const prev = document.body.style.overflow
    document.body.style.overflow = "hidden"
    return () => {
      document.body.style.overflow = prev
    }
  }, [])

  useEffect(() => {
    const go = () => {
      if (!canLeaveRef.current || leavingRef.current) return
      leavingRef.current = true
      setLeaving(true)
      window.setTimeout(() => onEnteredRef.current(), FADE_MS)
    }

    const onWheel = (event: WheelEvent) => {
      event.preventDefault()
      go()
    }

    const onDown = (event: PointerEvent) => {
      if (event.target instanceof Element && event.target.closest("[data-no-enter]")) {
        origin.current = null
        return
      }
      origin.current = { x: event.clientX, y: event.clientY }
    }

    const onUp = (event: PointerEvent) => {
      if (!origin.current) return
      const dx = event.clientX - origin.current.x
      const dy = event.clientY - origin.current.y
      origin.current = null
      const dist = Math.hypot(dx, dy)
      if (dist <= CLICK_SLOP_PX) go()
      else if (Math.abs(dy) > 36 && Math.abs(dy) > Math.abs(dx)) go()
    }

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Enter" || event.key === " " || event.key === "Escape") {
        event.preventDefault()
        go()
      }
    }

    window.addEventListener("wheel", onWheel, { passive: false })
    window.addEventListener("pointerdown", onDown)
    window.addEventListener("pointerup", onUp)
    window.addEventListener("keydown", onKey)
    return () => {
      window.removeEventListener("wheel", onWheel)
      window.removeEventListener("pointerdown", onDown)
      window.removeEventListener("pointerup", onUp)
      window.removeEventListener("keydown", onKey)
    }
  }, [])

  return (
    <section
      className={`fixed inset-0 z-[60] overflow-hidden transition-[opacity,transform] duration-700 ease-out ${
        leaving ? "pointer-events-none -translate-y-6 opacity-0" : "opacity-100 translate-y-0"
      }`}
      style={{ background: "#141c28" }}
      aria-label={lang === "es" ? "Entrar a Lumen" : "Enter Lumen"}
    >
      {/* No offset: the -translate-y-16 here existed only to lift the mark
          clear of the LUMEN title on mobile, and with the text gone it just
          pushed the graphic off centre. */}
      <div className="absolute inset-0">
        <LumenMark3D onTogether={onTogether} />
      </div>
      <div className="absolute top-5 right-6 z-10" data-no-enter>
        <LangToggle onDark />
      </div>
    </section>
  )
}
