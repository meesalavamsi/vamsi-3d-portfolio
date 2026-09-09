import { lazy, Suspense, useEffect, useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import { useGame } from './store/gameStore'
import { locations, type LocationId } from './data/resume'
import BootScreen from './components/BootScreen'
import TitleScreen from './components/TitleScreen'
import IntroScreen from './components/IntroScreen'
import HUD from './components/HUD'
import MissionPanel from './components/MissionPanel'
import MiniMap from './components/MiniMap'
import Toasts from './components/Toasts'
import ResumeMode from './components/ResumeMode'
import FinaleScreen from './components/FinaleScreen'
import HomeBase from './sections/HomeBase'
import University from './sections/University'
import SkillLab from './sections/SkillLab'
import ServiceNowHQ from './sections/ServiceNowHQ'
import ProjectCity from './sections/ProjectCity'
import CyberArena from './sections/CyberArena'
import CertVault from './sections/CertVault'
import CodingArena from './sections/CodingArena'
import MissionControl from './sections/MissionControl'
import { sfx } from './utils/sound'
import { stopAmbient, startAmbient } from './utils/sound'

// Heavy 3D world loads lazily — keeps first paint fast.
const WorldMap = lazy(() => import('./three/WorldMap'))

function hasWebGL() {
  try {
    const c = document.createElement('canvas')
    return !!(c.getContext('webgl2') || c.getContext('webgl'))
  } catch {
    return false
  }
}

const sectionComponents: Record<LocationId, React.ComponentType> = {
  home: HomeBase,
  university: University,
  skilllab: SkillLab,
  servicenow: ServiceNowHQ,
  projects: ProjectCity,
  cyber: CyberArena,
  certs: CertVault,
  arena: CodingArena,
  control: MissionControl,
}

/** 2.5D fallback: card grid when WebGL is unavailable. */
function FlatWorld() {
  const enterLocation = useGame((s) => s.enterLocation)
  const visited = useGame((s) => s.visited)
  return (
    <div className="fixed inset-0 cyber-grid overflow-y-auto">
      <div className="max-w-4xl mx-auto px-6 pt-28 pb-20">
        <h1 className="text-2xl font-black tracking-[0.2em] text-white text-glow mb-2">WORLD MAP</h1>
        <p className="text-xs text-slate-400 tracking-widest mb-8">2D MODE — SELECT A LOCATION</p>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
          {locations.map((l) => {
            const un = visited.includes(l.unlockAfter ?? l.id) || !l.unlockAfter
            return (
              <button
                key={l.id}
                disabled={!un}
                onClick={() => enterLocation(l.id)}
                className="holo-card p-5 text-left disabled:opacity-40"
                style={{ borderColor: `${l.color}44` }}
              >
                <span className="text-2xl">{l.icon}</span>
                <div className="mt-2 text-sm tracking-widest text-white">{l.name.toUpperCase()}</div>
                <div className="text-[10px] text-slate-500 tracking-widest mt-1">
                  {visited.includes(l.id) ? '✓ VISITED' : un ? 'AVAILABLE' : '🔒 LOCKED'}
                </div>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default function App() {
  const phase = useGame((s) => s.phase)
  const activeLocation = useGame((s) => s.activeLocation)
  const soundOn = useGame((s) => s.soundOn)
  const setMobile = useGame((s) => s.setMobile)
  const setReducedMotion = useGame((s) => s.setReducedMotion)
  const [webgl] = useState(hasWebGL)
  const [nearLoc, setNearLoc] = useState<LocationId | null>(null)

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 768px)')
    const apply = () => setMobile(mq.matches)
    apply()
    mq.addEventListener('change', apply)
    const rm = window.matchMedia('(prefers-reduced-motion: reduce)')
    const applyRm = () => setReducedMotion(rm.matches)
    applyRm()
    rm.addEventListener('change', applyRm)
    return () => { mq.removeEventListener('change', apply); rm.removeEventListener('change', applyRm) }
  }, [setMobile, setReducedMotion])

  // keyboard shortcut: M toggles map
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === 'm' && (phase === 'world')) useGame.getState().toggleMap()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [phase])

  // ambient sound follows toggle
  useEffect(() => {
    if (soundOn && (phase === 'world' || phase === 'section')) startAmbient()
    if (!soundOn) stopAmbient()
  }, [soundOn, phase])

  const Active = activeLocation ? sectionComponents[activeLocation] : null

  return (
    <div className="h-full">
      {phase === 'boot' && <BootScreen />}
      {phase === 'title' && <TitleScreen />}
      {phase === 'intro' && <IntroScreen />}

      {(phase === 'world' || phase === 'section') && (
        <>
          {webgl ? (
            <Suspense fallback={
              <div className="fixed inset-0 bg-[#05060e] flex items-center justify-center">
                <div className="text-cyan-300 text-glow tracking-[0.4em] text-sm pulse-glow">LOADING WORLD...</div>
              </div>
            }>
              <WorldMap onNear={setNearLoc} />
            </Suspense>
          ) : (
            <FlatWorld />
          )}
          <HUD />
          <MissionPanel />
          <MiniMap />
          {/* proximity prompt */}
          {nearLoc && phase === 'world' && webgl && (
            <div className="fixed bottom-14 left-1/2 -translate-x-1/2 z-40 glass-strong px-5 py-2.5 text-xs tracking-[0.25em] text-cyan-200 pulse-glow">
              [E] ENTER {nearLoc.toUpperCase()}
            </div>
          )}
          <AnimatePresence>
            {phase === 'section' && Active && <Active key={activeLocation} />}
          </AnimatePresence>
        </>
      )}

      {phase === 'resume' && <ResumeMode />}
      {phase === 'finale' && <FinaleScreen />}

      {/* persistent resume-mode toggle */}
      {phase !== 'resume' && phase !== 'boot' && phase !== 'finale' && (
        <button
          onClick={() => { if (soundOn) sfx.click(); useGame.getState().openResume() }}
          className="fixed bottom-3 right-3 z-40 glass px-4 py-2 text-[10px] tracking-[0.25em] text-purple-300 hover:bg-purple-400/10 transition-colors"
        >
          [ SWITCH TO RESUME MODE ]
        </button>
      )}

      <Toasts />
    </div>
  )
}
