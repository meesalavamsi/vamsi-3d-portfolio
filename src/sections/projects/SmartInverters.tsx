import { useEffect, useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import { HoloChip, FlowDiagram, ZoneTitle, NpcLine } from '../../components/widgets'
import { projects } from '../../data/resume'

const p = projects.find((x) => x.id === 'smart-inverters')!
const accent = '#fbbf24'

/** Animated live energy graph (pure SVG). */
function EnergyGraph() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: false, margin: '-20px' })
  const [points, setPoints] = useState<number[]>(() => Array.from({ length: 40 }, (_, i) => 50 + Math.sin(i / 4) * 18))

  useEffect(() => {
    if (!inView) return
    const t = setInterval(() => {
      setPoints((prev) => {
        const next = [...prev.slice(1)]
        const last = prev[prev.length - 1]
        next.push(Math.min(88, Math.max(14, last + (Math.random() - 0.5) * 14)))
        return next
      })
    }, 350)
    return () => clearInterval(t)
  }, [inView])

  const W = 560, H = 150
  const path = points.map((v, i) => `${(i / (points.length - 1)) * W},${H - (v / 100) * H}`).join(' ')

  return (
    <div ref={ref} className="terminal p-4">
      <div className="flex justify-between text-[10px] tracking-[0.25em] text-amber-300/80 mb-2">
        <span>⚡ LIVE ENERGY OUTPUT</span>
        <span className="text-emerald-400 pulse-glow">● STREAMING</span>
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-36">
        <defs>
          <linearGradient id="eg" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#fbbf24" stopOpacity="0" />
          </linearGradient>
        </defs>
        <polyline points={`0,${H} ${path} ${W},${H}`} fill="url(#eg)" stroke="none" />
        <polyline points={path} fill="none" stroke="#fbbf24" strokeWidth="2" style={{ filter: 'drop-shadow(0 0 5px #fbbf24)' }} />
      </svg>
      <div className="flex justify-between text-[9px] text-slate-500 tracking-widest mt-1">
        <span>T-40</span><span>NOW</span>
      </div>
    </div>
  )
}

export default function SmartInverters() {
  return (
    <div>
      <div className="text-[10px] tracking-[0.4em] mb-2" style={{ color: accent }}>BUILDING 01 // {p.theme.toUpperCase()}</div>
      <h2 className="text-2xl md:text-4xl font-black tracking-wider text-white mb-6" style={{ textShadow: `0 0 16px ${accent}66` }}>
        {p.name.toUpperCase()}
      </h2>

      <div className="glass p-5 mb-8 max-w-3xl">
        <NpcLine who="BRIEFING" text={p.story} accent={accent} />
      </div>

      <div className="grid lg:grid-cols-2 gap-8 mb-10">
        <div>
          <ZoneTitle accent={accent}>DATA PIPELINE</ZoneTitle>
          <FlowDiagram nodes={p.flow} accent={accent} />
        </div>
        <div className="space-y-6">
          <EnergyGraph />
          <div className="glass p-5">
            <ZoneTitle accent={accent}>FEATURES</ZoneTitle>
            <ul className="space-y-2 text-sm text-slate-200">
              {p.features.map((f, i) => (
                <motion.li key={f} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.07 }} className="flex gap-2">
                  <span style={{ color: accent }}>▸</span>{f}
                </motion.li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <ZoneTitle accent={accent}>TECH STACK</ZoneTitle>
      <div className="flex flex-wrap gap-3">
        {p.tech.map((t, i) => <HoloChip key={t} label={t} accent={accent} delay={i * 0.05} />)}
      </div>
    </div>
  )
}
