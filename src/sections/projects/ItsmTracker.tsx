import { useState } from 'react'
import { motion } from 'framer-motion'
import { HoloChip, ZoneTitle, NpcLine } from '../../components/widgets'
import { projects } from '../../data/resume'
import { useGame } from '../../store/gameStore'
import { sfx } from '../../utils/sound'

const p = projects.find((x) => x.id === 'itsm-tracker')!
const accent = '#a78bfa'

const stages = [
  { id: 'report', label: 'REPORT', text: '"My laptop cannot connect to Wi-Fi." — a student reports the issue through the Service Catalog.' },
  { id: 'incident', label: 'INCIDENT', text: 'The system creates an INCIDENT record: categorized, prioritized, and assigned to IT staff.' },
  { id: 'problem', label: 'PROBLEM', text: 'Repeated Wi-Fi incidents? A PROBLEM record investigates the root cause — maybe a failing access point.' },
  { id: 'change', label: 'CHANGE', text: 'Fixing the root cause needs a CHANGE: planned, approved, and rolled out without breaking anything else.' },
  { id: 'resolved', label: 'RESOLVED', text: 'The student is back online. The whole journey is tracked on visual task boards.' },
]

export default function ItsmTracker() {
  const [stage, setStage] = useState(0)
  const soundOn = useGame((s) => s.soundOn)

  return (
    <div>
      <div className="text-[10px] tracking-[0.4em] mb-2" style={{ color: accent }}>BUILDING 04 // {p.theme.toUpperCase()}</div>
      <h2 className="text-2xl md:text-4xl font-black tracking-wider text-white mb-6" style={{ textShadow: `0 0 16px ${accent}66` }}>
        {p.name.toUpperCase()}
      </h2>

      <div className="glass p-5 mb-8 max-w-3xl space-y-3">
        <NpcLine who="STUDENT" text="My laptop cannot connect to Wi-Fi." accent="#f472b6" />
        <NpcLine who="SYSTEM" text="Instead of solving IT problems manually, the system organizes them into structured workflows." accent={accent} />
      </div>

      {/* interactive lifecycle */}
      <ZoneTitle accent={accent}>ITSM LIFECYCLE — STEP THROUGH IT</ZoneTitle>
      <div className="flex flex-wrap gap-2 mb-4">
        {stages.map((st, i) => (
          <button
            key={st.id}
            onClick={() => { setStage(i); if (soundOn) sfx.click() }}
            className={`px-4 py-2 text-xs tracking-[0.2em] border transition-all ${
              i === stage
                ? 'text-white neon-border'
                : i < stage
                  ? 'text-emerald-300 border-emerald-400/30 bg-emerald-400/5'
                  : 'text-slate-500 border-slate-700/50 bg-white/[0.02]'
            }`}
          >
            {i < stage ? '✓ ' : ''}{st.label}
          </button>
        ))}
      </div>
      <motion.div key={stage} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="glass-strong p-5 max-w-2xl mb-4 text-sm text-slate-200 leading-relaxed">
        {stages[stage].text}
      </motion.div>
      {stage < stages.length - 1 && (
        <button className="btn-game purple mb-10" onClick={() => { setStage(stage + 1); if (soundOn) sfx.click() }}>
          ADVANCE WORKFLOW ▸
        </button>
      )}
      {stage === stages.length - 1 && <div className="text-emerald-300 text-glow-green text-sm tracking-widest mb-10">WORKFLOW COMPLETE ✓</div>}

      <ZoneTitle accent={accent}>MODULES</ZoneTitle>
      <div className="flex flex-wrap gap-3 mb-10">
        {p.features.map((f, i) => <HoloChip key={f} label={f} accent={accent} delay={i * 0.05} />)}
      </div>

      <ZoneTitle accent={accent}>TECH STACK</ZoneTitle>
      <div className="flex flex-wrap gap-3">
        {p.tech.map((t, i) => <HoloChip key={t} label={t} accent={accent} delay={i * 0.05} />)}
      </div>
    </div>
  )
}
