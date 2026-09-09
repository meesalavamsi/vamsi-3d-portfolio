import { useEffect, useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import SectionShell from '../components/SectionShell'
import { ZoneTitle, NpcLine } from '../components/widgets'
import { education } from '../data/resume'
import { useGame } from '../store/gameStore'
import { sfx } from '../utils/sound'

const floating = [
  { icon: '🧮', label: 'DSA', text: 'Data Structures & Algorithms — how to think in solutions.' },
  { icon: '🗄️', label: 'Database', text: 'DBMS — how data is stored, queried, and protected.' },
  { icon: '💻', label: 'Computer', text: 'Programming — turning logic into running software.' },
  { icon: '🌐', label: 'Network', text: 'Computer Networks — how systems talk to each other.' },
  { icon: '🖥️', label: 'OS Terminal', text: 'Operating Systems — what happens under the hood.' },
]

function CgpaRing() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-40px' })
  const [p, setP] = useState(0)
  const reduced = useGame((s) => s.reducedMotion)
  const target = (education.cgpa / education.cgpaMax) * 100

  useEffect(() => {
    if (!inView) return
    if (reduced) { setP(target); return }
    const start = performance.now()
    let raf = 0
    const tick = (t: number) => {
      const pr = Math.min(1, (t - start) / 1500)
      setP(target * (1 - Math.pow(1 - pr, 3)))
      if (pr < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [inView, target, reduced])

  const R = 56
  const C = 2 * Math.PI * R

  return (
    <div ref={ref} className="flex items-center gap-8 flex-wrap">
      <div className="relative w-40 h-40">
        <svg viewBox="0 0 140 140" className="w-full h-full -rotate-90">
          <circle cx="70" cy="70" r={R} fill="none" stroke="rgba(167,139,250,0.15)" strokeWidth="10" />
          <circle
            cx="70" cy="70" r={R} fill="none" stroke="#a78bfa" strokeWidth="10" strokeLinecap="round"
            strokeDasharray={C} strokeDashoffset={C - (C * p) / 100}
            style={{ filter: 'drop-shadow(0 0 8px #a78bfa)' }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-black text-purple-200 text-glow-purple">{(education.cgpa * (p / 100)).toFixed(2)}</span>
          <span className="text-[9px] tracking-[0.25em] text-slate-400">/ {education.cgpaMax.toFixed(1)} CGPA</span>
        </div>
      </div>
      <div>
        <div className="text-xl md:text-2xl font-bold text-white tracking-wider">{education.degree}</div>
        <div className="text-purple-300 tracking-widest mt-1">{education.field}</div>
        <div className="text-slate-400 text-sm mt-2 tracking-widest">{education.period}</div>
      </div>
    </div>
  )
}

export default function University() {
  const [active, setActive] = useState<number | null>(null)
  const soundOn = useGame((s) => s.soundOn)

  return (
    <SectionShell id="university" title={education.institution.toUpperCase()} subtitle="UNIVERSITY CAMPUS — Mission: Become a stronger computer scientist." accent="#a78bfa">
      <div className="glass p-8 mb-12">
        <CgpaRing />
      </div>

      <ZoneTitle accent="#a78bfa">FLOATING KNOWLEDGE — CLICK TO INSPECT</ZoneTitle>
      <div className="flex flex-wrap gap-4 mb-12">
        {floating.map((f, i) => (
          <motion.button
            key={f.label}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08 }}
            onClick={() => { setActive(active === i ? null : i); if (soundOn) sfx.click() }}
            className={`holo-card px-5 py-4 text-center min-w-32 ${active === i ? 'neon-border' : ''}`}
          >
            <div className="text-2xl floaty" style={{ animationDelay: `${i * 0.35}s` }}>{f.icon}</div>
            <div className="mt-2 text-[11px] tracking-[0.2em] text-purple-200">{f.label.toUpperCase()}</div>
          </motion.button>
        ))}
      </div>
      {active !== null && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass-strong p-5 max-w-xl mb-12 text-sm text-slate-200">
          {floating[active].text}
        </motion.div>
      )}

      <ZoneTitle accent="#a78bfa">FIELD LOG</ZoneTitle>
      <div className="glass p-6 max-w-3xl space-y-3">
        <NpcLine who="STORY" text="Vamsi began his B.Tech journey in Computer Science and Engineering." accent="#a78bfa" />
        <NpcLine who="STORY" text="Here he built the foundation: Data Structures. Algorithms. Operating Systems. Databases. Networks. Programming." accent="#a78bfa" />
        <NpcLine who="VAMSI" text="But the real learning happened when theory became projects." accent="#4dd0ff" />
      </div>
    </SectionShell>
  )
}
