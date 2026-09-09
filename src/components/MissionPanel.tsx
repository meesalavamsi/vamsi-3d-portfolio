import { motion, AnimatePresence } from 'framer-motion'
import { locations } from '../data/resume'
import { useGame } from '../store/gameStore'

export default function MissionPanel() {
  const show = useGame((s) => s.showMissions)
  const completed = useGame((s) => s.completedMissions)
  const visited = useGame((s) => s.visited)

  return (
    <AnimatePresence>
      {show && (
        <motion.aside
          initial={{ x: 320, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 320, opacity: 0 }}
          transition={{ type: 'spring', damping: 26, stiffness: 220 }}
          className="fixed top-28 right-3 z-40 w-72 glass-strong scanlines p-5"
        >
          <h3 className="text-cyan-300 text-glow tracking-[0.3em] text-sm mb-4">MISSIONS</h3>
          <ul className="space-y-2.5 text-xs">
            {locations.map((loc) => {
              const done = completed.includes(loc.id)
              const active = visited.includes(loc.id) && !done
              return (
                <li key={loc.id} className={`flex items-center gap-2.5 ${done ? 'text-emerald-300' : active ? 'text-cyan-200' : 'text-slate-500'}`}>
                  <span className={`w-4 text-center ${done ? 'text-emerald-400' : ''}`}>{done ? '☑' : '☐'}</span>
                  <span className="tracking-wider">{loc.mission}</span>
                </li>
              )
            })}
          </ul>
          <div className="mt-4 pt-3 border-t border-cyan-400/20 text-[10px] text-cyan-100/50 tracking-widest">
            {completed.length} / {locations.length} COMPLETE
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  )
}
