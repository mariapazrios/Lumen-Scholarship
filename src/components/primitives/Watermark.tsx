type Props = {
  /** Position + size classes, e.g. "-right-32 -top-24 w-[24rem]" */
  className?: string
  /** Set for dark (navy) sections so the mark renders white */
  onDark?: boolean
}

/** Faint Lumen brand mark dropped into a section background. Parent needs `relative overflow-hidden`. */
export default function Watermark({ className = "", onDark = false }: Props) {
  return (
    <img
      src="/lumen-icon.png"
      alt=""
      aria-hidden="true"
      className={`pointer-events-none select-none absolute ${
        onDark ? "brightness-0 invert opacity-[0.06]" : "opacity-[0.04]"
      } ${className}`}
    />
  )
}
