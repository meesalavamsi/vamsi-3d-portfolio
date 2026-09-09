import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useGame } from '../store/gameStore'
import { sfx } from '../utils/sound'

interface Props {
  speaker?: string
  lines: string[]
  onDone?: () => void
  speed?: number
}

/** RPG-style typewriter dialogue box. */
export default function DialogueBox({ speaker = 'VAMSI', lines, onDone, speed = 18 }: Props) {
  const [lineIdx, setLineIdx] = useState(0)
  const [chars, setChars] = useState(0)
  const soundOn = useGame((s) => s.soundOn)
  const reducedMotion = useGame((s) => s.reducedMotion)
  const line = lines[lineIdx]
  const lineDone = chars >= line.length
  const allDone = lineDone && lineIdx === lines.length - 1

  useEffect(() => {
    if (reducedMotion) { setChars(line.length); return }
    if (lineDone) return
    const t = setTimeout(() => {
      setChars((c) => c + 1)
      if (soundOn && chars % 3 === 0) sfx.type()
    }, speed)
    return () => clearTimeout(t)
  }, [chars, lineDone, line, speed, soundOn, reducedMotion])

  const advance = () => {
    if (!lineDone) { setChars(line.length); return }
    if (lineIdx < lines.length - 1) { setLineIdx(lineIdx + 1); setChars(0) }
    else onDone?.()
  }

  return (
    <motion.div
      initial={{ y: 30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="glass-strong scanlines relative px-6 py-5 max-w-2xl w-full cursor-pointer"
      onClick={advance}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && advance()}
    >
      <div className="absolute -top-3 left-4 glass px-3 py-0.5 text-[10px] tracking-[0.3em] text-purple-300 text-glow-purple">
        {speaker}
      </div>
      <p className={`text-cyan-50/95 text-sm md:text-base leading-relaxed min-h-12 ${lineDone ? '' : 'caret'}`}>
        {line.slice(0, chars)}
      </p>
      <div className="text-right text-[10px] text-cyan-300/50 tracking-widest mt-2 pulse-glow">
        {allDone ? 'CONTINUE ▸' : lineDone ? 'CLICK ▸' : '...'}
      </div>
    </motion.div>
  )
}
