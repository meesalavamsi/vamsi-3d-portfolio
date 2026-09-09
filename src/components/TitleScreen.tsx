import { lazy, Suspense } from 'react'
import { motion } from 'framer-motion'
import { identity } from '../data/resume'
import { useGame } from '../store/gameStore'
import { sfx, startAmbient } from '../utils/sound'

const TitleBackground = lazy(() => import('../three/TitleBackground'))

export default function TitleScreen() {
  const setPhase = useGame((s) => s.setPhase)
  const openResume = useGame((s) => s.openResume)
  const soundOn = useGame((s) => s.soundOn)
  const reducedMotion = useGame((s) => s.reducedMotion)

  const enter = () => {
    if (soundOn) { sfx.open(); startAmbient() }
    setPhase('intro')
  }

  return (
    <div className="fixed inset-0 z-40 overflow-hidden">
      {!reducedMotion && (
        <Suspense fallback={<div className="absolute inset-0 cyber-grid" />}>
          <TitleBackground />
        </Suspense>
      )}
      {reducedMotion && <div className="absolute inset-0 cyber-grid" />}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#05060e]/30 to-[#05060e]" />

      <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6 scanlines">
        <motion.p
          initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="text-[10px] md:text-xs tracking-[0.5em] text-cyan-300/70 mb-6"
        >
          WELCOME, PLAYER.
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, scale: 0.94 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.35, duration: 0.7 }}
          className="text-4xl md:text-7xl font-black tracking-[0.12em] text-white text-glow"
        >
          {identity.name.toUpperCase()}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}
          className="mt-4 text-xs md:text-sm tracking-[0.4em] text-purple-300 text-glow-purple"
        >
          {identity.tagline}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1 }}
          className="mt-12 flex flex-col sm:flex-row gap-4"
        >
          <button className="btn-game text-sm !px-10 !py-4" onClick={enter}>
            [ ENTER THE JOURNEY ]
          </button>
          <button className="btn-game purple text-sm !px-10 !py-4" onClick={() => { if (soundOn) sfx.click(); openResume() }}>
            [ VIEW TRADITIONAL RESUME ]
          </button>
        </motion.div>

        <motion.button
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.3 }}
          className="mt-8 text-[10px] tracking-[0.3em] text-slate-500 hover:text-cyan-300 transition-colors"
          onClick={() => { setPhase('world'); useGame.getState().enterWorld() }}
        >
          SKIP 3D INTRO ▸ GO STRAIGHT TO MAP
        </motion.button>
      </div>
    </div>
  )
}
