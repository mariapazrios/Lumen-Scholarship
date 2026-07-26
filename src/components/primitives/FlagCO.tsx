/** Colombian flag: yellow half, blue quarter, red quarter. */
export default function FlagCO({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 6 4"
      role="img"
      aria-label="Colombia"
      className={`shrink-0 rounded-[1px] ${className}`}
    >
      <rect width="6" height="2" fill="#FCD116" />
      <rect y="2" width="6" height="1" fill="#003893" />
      <rect y="3" width="6" height="1" fill="#CE1126" />
    </svg>
  )
}
