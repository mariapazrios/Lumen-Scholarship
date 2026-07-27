/** Colombian tricolor rule: yellow half, blue quarter, red quarter. */
export default function Tricolor({ className = "" }: { className?: string }) {
  return (
    <div aria-hidden="true" className={`flex overflow-hidden ${className}`}>
      <span className="flex-[2]" style={{ background: "#FCD116" }} />
      <span className="flex-1" style={{ background: "#003893" }} />
      <span className="flex-1" style={{ background: "#CE1126" }} />
    </div>
  )
}
