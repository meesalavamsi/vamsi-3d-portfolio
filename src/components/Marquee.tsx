import { marqueeItems } from '../data/resume'

export default function Marquee() {
  const row = [...marqueeItems, ...marqueeItems]
  return (
    <div className="relative py-6 border-y border-white/8 overflow-hidden bg-white/[0.015]">
      <div className="marquee-track flex gap-10 whitespace-nowrap w-max">
        {row.map((item, i) => (
          <span key={i} className="font-mono text-sm tracking-[0.25em] text-slate-500 flex items-center gap-10">
            {item.toUpperCase()} <span className="text-cyan-500/60">✦</span>
          </span>
        ))}
      </div>
    </div>
  )
}
