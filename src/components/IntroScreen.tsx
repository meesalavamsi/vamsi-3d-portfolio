import { lazy, Suspense } from 'react'
import { motion } from 'framer-motion'
import DialogueBox from './DialogueBox'
import { introNarration } from '../data/resume'
import { useGame } from '../store/gameStore'
import { sfx, startAmbient } from '../utils/sound'

const IntroAvatar = lazy(() => import('../three/IntroAvatar'))

export default function IntroScreen() {
  const enterWorld = useGame((s) => s.enterWorld)
  const soundOn = useGame((s) => s.soundOn)
  const reducedMotion = useGame((s) => s.reducedMotion)

  return (
    <div className="fixed inset-0 z-40 bg-[#05060e] scanlines">
      {!reducedMotion && (
        <Suspense fallback={<div className="absolute inset-0 cyber-grid" />}>
          <IntroAvatar />
        </Suspense>
      )}
      {reducedMotion && <div className="absolute inset-0 cyber-grid" />}
      <div className="relative z-10 h-full flex flex-col items-center justify-end pb-20 px-4 pointer-events-none">
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
          className="pointer-events-auto flex flex-col items-center gap-6"
        >
          <DialogueBox speaker="VAMSI" lines={introNarration} />
          <button
            className="btn-game green text-sm !px-10 !py-4"
            onClick={() => { if (soundOn) { sfx.mission(); startAmbient() } enterWorld() }}
          >
            ▶ START MISSION
          </button>
        </motion.div>
      </div>
    </div>
  )
}
