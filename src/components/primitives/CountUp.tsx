import { useEffect, useRef, useState } from "react"
import { skipMotion } from "../../lib/motion"

type Props = {
  /** Final value */
  value: number
  /** Decimal places to render */
  decimals?: number
  prefix?: string
  suffix?: string
  duration?: number
  className?: string
}

/** Animates a number from 0 to `value` when it scrolls into view. */
export default function CountUp({
  value,
  decimals = 0,
  prefix = "",
  suffix = "",
  duration = 1400,
  className = "",
}: Props) {
  const ref = useRef<HTMLSpanElement | null>(null)
  const [display, setDisplay] = useState(() => (skipMotion() ? value : 0))
  const started = useRef(false)

  useEffect(() => {
    const el = ref.current
    if (!el || skipMotion()) return
    let failSafe: ReturnType<typeof setTimeout> | undefined
    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((e) => e.isIntersecting) || started.current) return
        started.current = true
        observer.disconnect()
        // Guarantee the final value even if rAF is throttled (battery saver, hidden tab)
        failSafe = setTimeout(() => setDisplay(value), duration + 600)
        const t0 = performance.now()
        const tick = (t: number) => {
          const p = Math.min((t - t0) / duration, 1)
          const eased = 1 - Math.pow(1 - p, 3)
          setDisplay(value * eased)
          if (p < 1) requestAnimationFrame(tick)
        }
        requestAnimationFrame(tick)
      },
      { threshold: 0.4 },
    )
    observer.observe(el)
    return () => {
      observer.disconnect()
      if (failSafe) clearTimeout(failSafe)
    }
  }, [value, duration])

  const formatted = display.toLocaleString("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })

  return (
    <span ref={ref} className={className}>
      {prefix}
      {formatted}
      {suffix}
    </span>
  )
}
