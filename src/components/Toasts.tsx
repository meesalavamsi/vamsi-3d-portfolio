import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useGame } from '../store/gameStore'
import { sfx } from '../utils/sound'

export default function Toasts() {
  const toasts = useGame((s) => s.toasts)
  const soundOn = useGame((s) => s.soundOn)

  useEffect(() => {
    if (!toasts.length || !soundOn) return
    const latest = toasts[toasts.length - 1]
    if (latest.kind === 'mission') sfx.mission()
    else if (latest.kind === 'achievement') sfx.achievement()
    else if (latest.kind === 'xp') sfx.success()
    else sfx.click()
  }, [toasts, soundOn])

  return (
    <div className="fixed bottom-24 right-3 z-50 flex flex-col gap-2 items-end pointer-events-none">
      <AnimatePresence>
        {toasts.map((t) => (
          <motion.div
            key={t.id}
            initial={{ x: 60, opacity: 0, scale: 0.9 }}
            animate={{ x: 0, opacity: 1, scale: 1 }}
            exit={{ x: 60, opacity: 0 }}
            className={`glass-strong px-5 py-3 min-w-56 scanlines relative ${
              t.kind === 'achievement' ? 'border-amber-400/50' : t.kind === 'mission' ? 'border-emerald-400/50' : ''
            }`}
          >
            <div className={`text-sm font-bold tracking-widest ${
              t.kind === 'achievement' ? 'text-amber-300' : t.kind === 'mission' ? 'text-emerald-300 text-glow-green' : 'text-cyan-300 text-glow'
            }`}>
              {t.title}
            </div>
            {t.lines.map((l, i) => (
              <div key={i} className="text-[11px] text-slate-300/90 tracking-wider mt-0.5">{l}</div>
            ))}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
