import { useEffect, useRef, useState } from "react"
import { skipMotion } from "../../lib/motion"

type Props = {
  children: React.ReactNode
  /** Stagger delay in ms */
  delay?: number
  className?: string
  as?: "div" | "section" | "li" | "span"
}

/** Scroll-reveal wrapper: fades + lifts children in the first time they enter the viewport. */
export default function Reveal({ children, delay = 0, className = "", as = "div" }: Props) {
  const ref = useRef<HTMLDivElement | null>(null)
  const [revealed, setRevealed] = useState(skipMotion)

  useEffect(() => {
    const el = ref.current
    if (!el || revealed) return
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setRevealed(true)
          observer.disconnect()
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [revealed])

  const Tag = as
  return (
    <Tag
      ref={ref as React.RefObject<HTMLDivElement & HTMLLIElement>}
      className={`reveal ${revealed ? "is-revealed" : ""} ${className}`}
      style={{ "--reveal-delay": `${delay}ms` } as React.CSSProperties}
    >
      {children}
    </Tag>
  )
}
