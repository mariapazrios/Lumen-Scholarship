import { useEffect, useState } from "react"

/**
 * True below Tailwind's md breakpoint.
 *
 * Charts that carry text cannot be made responsive by scaling alone. An SVG
 * with a fixed viewBox squeezed into a phone shrinks its labels along with
 * everything else: a 620 unit chart in 240px of column renders `fontSize="10"`
 * at under 4px. The geometry has to change, not just the scale, so the chart
 * needs to know which one it is drawing.
 */
export function useIsNarrow(maxWidth = 767) {
  const query = `(max-width: ${maxWidth}px)`
  const [narrow, setNarrow] = useState(
    () => typeof window !== "undefined" && window.matchMedia(query).matches,
  )

  useEffect(() => {
    const mq = window.matchMedia(query)
    const onChange = () => setNarrow(mq.matches)
    onChange()
    mq.addEventListener("change", onChange)
    return () => mq.removeEventListener("change", onChange)
  }, [query])

  return narrow
}
