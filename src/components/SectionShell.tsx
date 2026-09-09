import { type ReactNode, useEffect } from 'react'
import { motion } from 'framer-motion'
import { X, CheckCircle2 } from 'lucide-react'
import { locations, type LocationId } from '../data/resume'
import { useGame } from '../store/gameStore'
import { sfx } from '../utils/sound'

interface Props {
  id: LocationId
  title: string
  subtitle?: string
  accent?: string
  children: ReactNode
  canComplete?: boolean   // gate the complete button (e.g. quiz / certs)
  completeHint?: string
}

export default function SectionShell({ id, title, subtitle, accent = '#4dd0ff', children, canComplete = true, completeHint }: Props) {
  const exitLocation = useGame((s) => s.exitLocation)
  const completeMission = useGame((s) => s.completeMission)
  const completed = useGame((s) => s.completedMissions.includes(id))
  const soundOn = useGame((s) => s.soundOn)
  const loc = locations.find((l) => l.id === id)!

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') exitLocation() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [exitLocation])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed inset-0 z-30 bg-[#05060e]/97 overflow-y-auto"
    >
      <div className="min-h-full cyber-grid">
        <div className="max-w-6xl mx-auto px-4 md:px-8 pt-24 pb-16">
          {/* header */}
          <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="mb-10">
            <div className="text-[10px] tracking-[0.5em] mb-2" style={{ color: accent }}>
              {loc.icon} LOCATION // {loc.name.toUpperCase()}
            </div>
            <h1 className="text-3xl md:text-5xl font-black tracking-[0.08em] text-white" style={{ textShadow: `0 0 18px ${accent}88` }}>
              {title}
            </h1>
            {subtitle && <p className="mt-2 text-sm text-slate-400 tracking-wider">{subtitle}</p>}
          </motion.div>

          {children}

          {/* footer actions */}
          <div className="mt-14 flex flex-wrap items-center gap-4 border-t border-cyan-400/15 pt-8">
            {!completed ? (
              <>
                <button
                  className="btn-game green"
                  disabled={!canComplete}
                  onClick={() => { if (soundOn) sfx.mission(); completeMission(id) }}
                >
                  ✓ COMPLETE MISSION {completeHint && !canComplete ? `— ${completeHint}` : `(+${loc.xp} XP)`}
                </button>
                {!canComplete && completeHint && (
                  <span className="text-[11px] text-amber-300/80 tracking-widest">⚠ {completeHint}</span>
                )}
              </>
            ) : (
              <div className="flex items-center gap-2 text-emerald-300 text-glow-green text-sm tracking-widest">
                <CheckCircle2 size={18} /> MISSION COMPLETE
              </div>
            )}
            <button className="btn-game" onClick={() => { if (soundOn) sfx.click(); exitLocation() }}>
              ← RETURN TO MAP
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
