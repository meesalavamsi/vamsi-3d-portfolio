import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import SectionShell from '../components/SectionShell'
import { ZoneTitle } from '../components/widgets'
import { projects } from '../data/resume'
import { useGame } from '../store/gameStore'
import { sfx } from '../utils/sound'
import SmartInverters from './projects/SmartInverters'
import WorkflowHub from './projects/WorkflowHub'
import ItsmTracker from './projects/ItsmTracker'
import CyberArena from './CyberArena'

const buildingAccents: Record<string, string> = {
  'smart-inverters': '#fbbf24',
  'workflow-hub': '#62d84e',
  'cyber-arena': '#ff4d5e',
  'itsm-tracker': '#a78bfa',
}

export default function ProjectCity() {
  const [openProject, setOpenProject] = useState<string | null>(null)
  const explored = useGame((s) => s.exploredProjects)
  const exploreProject = useGame((s) => s.exploreProject)
  const soundOn = useGame((s) => s.soundOn)

  const open = (id: string) => {
    setOpenProject(id)
    exploreProject(id)
    if (soundOn) sfx.open()
  }

  return (
    <SectionShell
      id="projects"
      title="PROJECT CITY"
      subtitle="Four buildings. Four real systems. Enter each one."
      accent="#f472b6"
      canComplete={explored.length >= 4}
      completeHint={`ENTER ALL 4 BUILDINGS (${explored.length}/4)`}
    >
      <ZoneTitle accent="#f472b6">CITY BLOCK — SELECT A BUILDING</ZoneTitle>
      <div className="grid sm:grid-cols-2 gap-5">
        {projects.map((p, i) => {
          const accent = buildingAccents[p.id]
          const done = explored.includes(p.id)
          return (
            <motion.button
              key={p.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              onClick={() => open(p.id)}
              className="holo-card p-6 text-left relative overflow-hidden group"
              style={{ borderColor: `${accent}44` }}
            >
              <div className="absolute top-0 left-0 w-full h-0.5" style={{ background: `linear-gradient(90deg, transparent, ${accent}, transparent)` }} />
              <div className="flex items-start justify-between">
                <span className="text-3xl">{p.icon}</span>
                {done && <span className="text-emerald-400 text-xs tracking-widest">✓ EXPLORED</span>}
              </div>
              <div className="mt-4 text-lg font-bold tracking-[0.15em] text-white">{p.short}</div>
              <div className="text-[11px] tracking-widest mt-1" style={{ color: accent }}>{p.theme.toUpperCase()}</div>
              <div className="text-xs text-slate-400 mt-3 leading-relaxed line-clamp-2">{p.name}</div>
              <div className="mt-4 text-[10px] tracking-[0.3em] text-slate-500 group-hover:text-cyan-300 transition-colors">
                ▸ ENTER BUILDING
              </div>
            </motion.button>
          )
        })}
      </div>

      {/* project interior overlay */}
      <AnimatePresence>
        {openProject && (
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.97 }}
            className="fixed inset-0 z-40 bg-[#05060e]/98 overflow-y-auto"
          >
            <div className="max-w-5xl mx-auto px-4 md:px-8 pt-20 pb-16 cyber-grid min-h-full">
              <button
                className="btn-game mb-8"
                onClick={() => { setOpenProject(null); if (soundOn) sfx.click() }}
              >
                ← EXIT BUILDING
              </button>
              {openProject === 'smart-inverters' && <SmartInverters />}
              {openProject === 'workflow-hub' && <WorkflowHub />}
              {openProject === 'itsm-tracker' && <ItsmTracker />}
              {openProject === 'cyber-arena' && <CyberArena embedded />}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </SectionShell>
  )
}
