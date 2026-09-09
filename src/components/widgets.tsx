import { useEffect, useRef, useState, type ReactNode } from 'react'
import { motion, useInView } from 'framer-motion'
import { useGame } from '../store/gameStore'
import { sfx } from '../utils/sound'

/** Animated number counter. */
export function StatCounter({ value, suffix, label, accent = '#4dd0ff' }: { value: number; suffix?: string; label: string; accent?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-40px' })
  const [n, setN] = useState(0)
  const reduced = useGame((s) => s.reducedMotion)

  useEffect(() => {
    if (!inView) return
    if (reduced) { setN(value); return }
    const start = performance.now()
    const dur = 1400
    let raf = 0
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / dur)
      setN(Math.round(value * (1 - Math.pow(1 - p, 3))))
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [inView, value, reduced])

  return (
    <div ref={ref} className="holo-card px-8 py-6 text-center">
      <div className="text-4xl md:text-5xl font-black" style={{ color: accent, textShadow: `0 0 16px ${accent}` }}>
        {n}{suffix}
      </div>
      <div className="mt-2 text-[11px] tracking-[0.25em] text-slate-400">{label.toUpperCase()}</div>
    </div>
  )
}

/** Holographic chip/card for skills & tech. */
export function HoloChip({ label, accent = '#4dd0ff', delay = 0 }: { label: string; accent?: string; delay?: number }) {
  const soundOn = useGame((s) => s.soundOn)
  return (
    <motion.span
      initial={{ opacity: 0, y: 14, rotateX: -30 }}
      whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
      viewport={{ once: true, margin: '-30px' }}
      transition={{ delay, duration: 0.4 }}
      onMouseEnter={() => soundOn && sfx.hover()}
      className="holo-card inline-block px-4 py-2 text-xs md:text-sm tracking-wider cursor-default"
      style={{ borderColor: `${accent}55`, color: '#e6f6ff' }}
    >
      {label}
    </motion.span>
  )
}

/** Vertical data-flow diagram with clickable nodes. */
export function FlowDiagram({ nodes, accent = '#4dd0ff', interactive = false }: {
  nodes: { node: string; desc?: string }[] | string[]
  accent?: string
  interactive?: boolean
}) {
  const [open, setOpen] = useState<number | null>(null)
  const soundOn = useGame((s) => s.soundOn)
  const norm = nodes.map((n) => (typeof n === 'string' ? { node: n, desc: undefined } : n))

  return (
    <div className="flex flex-col items-center gap-0">
      {norm.map((n, i) => (
        <div key={i} className="flex flex-col items-center w-full max-w-md">
          <motion.button
            initial={{ opacity: 0, scale: 0.85 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08 }}
            disabled={!interactive || !n.desc}
            onClick={() => { setOpen(open === i ? null : i); if (soundOn) sfx.click() }}
            className={`w-full glass px-5 py-3 text-center tracking-[0.2em] text-sm transition-all ${
              interactive && n.desc ? 'cursor-pointer hover:bg-cyan-400/10' : 'cursor-default'
            } ${open === i ? 'neon-border' : ''}`}
            style={{ borderColor: `${accent}44`, color: accent }}
          >
            {n.node.toUpperCase()}
          </motion.button>
          {open === i && n.desc && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="w-full glass-strong px-5 py-3 text-xs text-slate-300 leading-relaxed border-t-0"
            >
              💡 {n.desc}
            </motion.div>
          )}
          {i < norm.length - 1 && (
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-lg leading-none py-1 pulse-glow"
              style={{ color: accent }}
            >
              ↓
            </motion.div>
          )}
        </div>
      ))}
    </div>
  )
}

/** Dialogue line in NPC style. */
export function NpcLine({ who, text, accent = '#a78bfa' }: { who: string; text: string; accent?: string }) {
  return (
    <div className="flex gap-3 items-start">
      <span className="glass px-2.5 py-1 text-[10px] tracking-[0.2em] shrink-0 mt-0.5" style={{ color: accent, borderColor: `${accent}44` }}>
        {who}
      </span>
      <p className="text-sm text-slate-300 leading-relaxed">"{text}"</p>
    </div>
  )
}

/** Section heading inside a location. */
export function ZoneTitle({ children, accent = '#4dd0ff' }: { children: ReactNode; accent?: string }) {
  return (
    <h2 className="text-lg md:text-xl font-bold tracking-[0.3em] mb-5 flex items-center gap-3" style={{ color: accent }}>
      <span className="inline-block w-8 h-px" style={{ background: accent }} />
      {children}
    </h2>
  )
}
