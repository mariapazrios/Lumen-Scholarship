type Tone = "navy" | "white" | "cobalt"

type Props = {
  label: string
  tone?: Tone
  href?: string
  forceHover?: boolean
  className?: string
}

function ArrowIcon() {
  return (
    <svg
      width="56"
      height="16"
      viewBox="0 0 56 32"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M0.6 16H54.6M39.6 1L54.6 16L39.6 31"
        stroke="currentColor"
        strokeWidth="1.5"
      />
    </svg>
  )
}

export default function ArrowButton({
  label,
  tone = "navy",
  href,
  forceHover = false,
  className = "",
}: Props) {
  const toneClass =
    tone === "navy" ? "text-primary" : tone === "white" ? "text-primary-foreground" : "text-accent"

  const hoverClass = forceHover
    ? tone === "white"
      ? "translate-x-1 opacity-80"
      : "translate-x-1 text-foreground"
    : "hover:translate-x-1 " +
      (tone === "white" ? "hover:opacity-80" : "hover:text-foreground")

  const shared = `inline-flex items-center gap-4 transition-all duration-200 cursor-pointer ${toneClass} ${hoverClass} ${className}`
  const inner = (
    <>
      <span className="text-body font-semibold uppercase tracking-widest">{label}</span>
      <ArrowIcon />
    </>
  )

  if (href) {
    return (
      <a href={href} className={shared}>
        {inner}
      </a>
    )
  }
  return (
    <button type="button" className={shared}>
      {inner}
    </button>
  )
}
