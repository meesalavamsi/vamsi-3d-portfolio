import { useEffect, useState } from 'react'
import { bootLines } from '../data/resume'
import { useGame } from '../store/gameStore'

export default function BootScreen() {
  const [shown, setShown] = useState(0)
  const setPhase = useGame((s) => s.setPhase)
  const reducedMotion = useGame((s) => s.reducedMotion)

  useEffect(() => {
    if (reducedMotion) { setShown(bootLines.length); const t = setTimeout(() => setPhase('title'), 400); return () => clearTimeout(t) }
    if (shown < bootLines.length) {
      const t = setTimeout(() => setShown((v) => v + 1), shown === 0 ? 500 : 260)
      return () => clearTimeout(t)
    }
    const t = setTimeout(() => setPhase('title'), 900)
    return () => clearTimeout(t)
  }, [shown, setPhase, reducedMotion])

  return (
    <div className="fixed inset-0 z-50 bg-[#05060e] flex items-center justify-center scanlines">
      <pre className="text-emerald-400 text-glow-green text-xs md:text-sm leading-7 font-mono">
        {bootLines.slice(0, shown).join('\n')}
        {shown < bootLines.length && <span className="caret" />}
      </pre>
      <button
        className="absolute bottom-6 right-6 text-[10px] tracking-[0.25em] text-slate-500 hover:text-cyan-300 transition-colors"
        onClick={() => setPhase('title')}
      >
        SKIP ▸
      </button>
    </div>
  )
}
