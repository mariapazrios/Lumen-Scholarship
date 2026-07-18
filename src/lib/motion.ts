/** True when the user prefers reduced motion, or ?nofx is set (test/screenshot escape hatch). */
export function skipMotion(): boolean {
  return (
    window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
    new URLSearchParams(window.location.search).has("nofx")
  )
}
