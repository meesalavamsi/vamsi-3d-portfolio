import { useEffect, useState } from 'react'
import { identity } from '../data/resume'

/** Short, restrained intro. Never blocks longer than it takes to read a name. */
export default function Preloader({ onDone }: { onDone: () => void }) {
  const [pct, setPct] = useState(0)
  const [out, setOut] = useState(false)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      onDone()
      return
    }
    let raf = 0
    const start = performance.now()
    const dur = 900
    const tick = (now: number) => {
      const p = Math.min((now - start) / dur, 1)
      setPct(Math.round((1 - Math.pow(1 - p, 3)) * 100))
      if (p < 1) raf = requestAnimationFrame(tick)
      else {
        setOut(true)
        setTimeout(onDone, 520)
      }
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [onDone])

  return (
    <div
      className="fixed inset-0 z-[90] flex flex-col items-center justify-center bg-[var(--color-ink)]"
      style={{
        opacity: out ? 0 : 1,
        transition: 'opacity 0.5s ease',
        pointerEvents: out ? 'none' : 'auto',
      }}
      aria-hidden
    >
      <div
        className="t-display text-[clamp(1.6rem,4vw,2.4rem)]"
        style={{
          opacity: out ? 0 : 1,
          transform: out ? 'translateY(-10px)' : 'none',
          transition: 'all 0.5s cubic-bezier(0.2,0.8,0.2,1)',
        }}
      >
        {identity.first} <span className="t-serif italic text-[var(--color-gold)]">{identity.last}</span>
      </div>

      <div className="mt-7 h-px w-[min(240px,46vw)] overflow-hidden bg-[var(--color-line)]">
        <div
          className="h-full bg-[var(--color-gold)]"
          style={{ width: `${pct}%`, transition: 'width 0.1s linear' }}
        />
      </div>

      <div className="t-mono mt-4 text-[var(--color-faint)]">{String(pct).padStart(3, '0')}</div>
    </div>
  )
}
