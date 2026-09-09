import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useGame } from '../store/gameStore'
import { sfx } from '../utils/sound'

const lines = [
  'ALL MISSIONS COMPLETE',
  '',
  'PLAYER: VAMSI',
  '',
  'EDUCATION ........ COMPLETE',
  'SKILLS ........... UNLOCKED',
  'EXPERIENCE ........ VERIFIED',
  'PROJECTS .......... DISCOVERED',
  'CERTIFICATIONS .... VERIFIED',
  'PROBLEM SOLVING ... ACTIVE',
  '',
  'SYSTEM STATUS:',
  '',
  'READY FOR THE NEXT MISSION.',
]

export default function FinaleScreen() {
  const [shown, setShown] = useState(0)
  const setPhase = useGame((s) => s.setPhase)
  const openResume = useGame((s) => s.openResume)
  const resetJourney = useGame((s) => s.resetJourney)
  const soundOn = useGame((s) => s.soundOn)
  const reduced = useGame((s) => s.reducedMotion)

  useEffect(() => {
    if (reduced) { setShown(lines.length); return }
    if (shown < lines.length) {
      const t = setTimeout(() => setShown((v) => v + 1), shown === 0 ? 600 : 300)
      return () => clearTimeout(t)
    }
  }, [shown, reduced])

  const done = shown >= lines.length

  return (
    <div className="fixed inset-0 z-50 bg-[#05060e] scanlines flex items-center justify-center px-4">
      <div className="text-center">
        <pre className="text-emerald-400 text-glow-green text-xs md:text-sm leading-7 font-mono text-left inline-block">
          {lines.slice(0, shown).join('\n')}
          {!done && <span className="caret" />}
        </pre>
        {done && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mt-10">
            <div className="text-2xl md:text-4xl font-black text-white text-glow tracking-[0.15em] mb-8">
              THANK YOU FOR PLAYING.
            </div>
            <div className="flex flex-wrap justify-center gap-4">
              <button className="btn-game" onClick={() => { if (soundOn) sfx.click(); setPhase('section') }}>
                CONTACT VAMSI
              </button>
              <button className="btn-game purple" onClick={() => { if (soundOn) sfx.click(); openResume() }}>
                VIEW RESUME
              </button>
              <button className="btn-game green" onClick={() => { if (soundOn) sfx.click(); resetJourney() }}>
                RESTART JOURNEY
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}
