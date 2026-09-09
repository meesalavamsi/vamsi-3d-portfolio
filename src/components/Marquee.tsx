import { marqueeItems } from '../data/resume'

export default function Marquee() {
  const row = [...marqueeItems, ...marqueeItems]
  return (
    <div className="hairline-t hairline-b overflow-hidden bg-[var(--color-ink-2)] py-4 no-print" aria-hidden>
      <div className="marquee-track">
        {row.map((item, i) => (
          <span key={i} className="flex items-center whitespace-nowrap">
            <span className="t-mono px-6 text-[0.72rem] uppercase tracking-[0.18em] text-[#7b8089]">
              {item}
            </span>
            <span className="size-1 rounded-full bg-[var(--color-gold)] opacity-50" />
          </span>
        ))}
      </div>
    </div>
  )
}
