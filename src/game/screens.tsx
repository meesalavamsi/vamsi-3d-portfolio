import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useGameStore } from './gstore'
import { worlds, moralText, revealLines, vamsiUnlocks } from './story'
import { identity } from '../data/resume'

/* ── WORLD MAP ─────────────────────────────────────────── */
export function WorldMap() {
  const s = useGameStore()
  const visited = s.memory.worldsVisited
  const allVisited = ['ocean', 'desert', 'space', 'earth', 'digital'].every((w) => visited.includes(w))

  useEffect(() => {
    if (allVisited && !s.moralChoice) {
      const t = setTimeout(() => s.say('ASTRA', ['You have seen enough.', 'Come back to me.', 'It is time for the question.'], 'to-moral'), 900)
      return () => clearTimeout(t)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allVisited])

  return (
    <div className="absolute inset-0 z-20 bg-black/92 backdrop-blur-sm flex items-center justify-center p-6">
      <div className="w-full max-w-2xl">
        <div className="font-mono text-[10px] tracking-[0.4em] text-white/50 mb-2 text-center">SIMULATION SECTORS</div>
        <div className="font-mono text-xl text-white tracking-[0.25em] text-center mb-8">SELECT A WORLD</div>
        <div className="space-y-2">
          {worlds.map((w) => {
            const isUnknown = w.id === 'unknown'
            const locked = isUnknown && !s.endingsSeen.includes('escaped')
            const isVisited = visited.includes(w.id) || (w.id === 'city')
            return (
              <button
                key={w.id}
                disabled={locked}
                onClick={() => {
                  if (w.id === 'city') s.set({ phase: 'city' })
                  else s.set({ phase: 'world', world: w.id })
                }}
                className={`w-full text-left font-mono px-5 py-4 border transition-all flex items-center gap-5 ${
                  locked
                    ? 'border-white/5 text-slate-700 cursor-not-allowed'
                    : 'border-white/15 text-slate-200 hover:border-cyan-400/60 hover:bg-cyan-400/5'
                }`}
              >
                <span className="text-cyan-400/80 text-xs w-8">{w.num}</span>
                <span className="tracking-[0.25em] text-sm flex-1">{locked ? '███████' : w.name}</span>
                <span className="text-[10px] text-slate-500 tracking-wider hidden sm:block">{locked ? 'LOCKED' : w.desc}</span>
                {isVisited && !isUnknown && <span className="text-emerald-400 text-xs">✓</span>}
              </button>
            )
          })}
        </div>
        <div className="text-center mt-8">
          <button onClick={() => s.set({ phase: 'lab' })} className="font-mono text-[10px] tracking-[0.3em] text-slate-500 hover:text-white transition-colors">
            ← RETURN TO ASTRA
          </button>
        </div>
      </div>
    </div>
  )
}

/* ── THE MORAL TEST ────────────────────────────────────── */
export function Moral() {
  const s = useGameStore()
  const [stage, setStage] = useState(0)

  useEffect(() => {
    const t = setTimeout(() => setStage(1), 2800)
    return () => clearTimeout(t)
  }, [])

  const choose = (c: 'digital' | 'human') => {
    s.set({
      moralChoice: c,
      memory: { ...s.memory, choices: s.memory.choices + 1 },
    })
    s.say('ASTRA', ['...', 'Recorded.', 'I will not tell you whether you were right.', 'There is something else.'], 'to-reveal')
  }

  return (
    <div className="absolute inset-0 z-20 bg-black flex items-center justify-center p-6">
      <div className="text-center max-w-xl">
        <pre className="font-mono text-red-400/90 text-sm md:text-base leading-8 text-left inline-block">{moralText.join('\n')}</pre>
        {stage >= 1 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <button onClick={() => choose('digital')}
              className="font-mono text-xs tracking-[0.25em] px-8 py-4 border border-cyan-400/60 text-cyan-300 hover:bg-cyan-400 hover:text-black transition-all">
              [ SAVE 1 BILLION DIGITAL HUMANS ]
            </button>
            <button onClick={() => choose('human')}
              className="font-mono text-xs tracking-[0.25em] px-8 py-4 border border-red-400/60 text-red-300 hover:bg-red-400 hover:text-black transition-all">
              [ SAVE 1 REAL HUMAN ]
            </button>
          </motion.div>
        )}
      </div>
    </div>
  )
}

/* ── THE REVEAL (instances) ────────────────────────────── */
export function Reveal() {
  const s = useGameStore()
  const [shown, setShown] = useState(0)
  const [showList, setShowList] = useState(false)
  const [listCount, setListCount] = useState(0)
  const [choiceOpen, setChoiceOpen] = useState(false)

  useEffect(() => {
    if (shown < revealLines.length) {
      const t = setTimeout(() => setShown((v) => v + 1), 1800)
      return () => clearTimeout(t)
    }
    const t = setTimeout(() => setShowList(true), 1200)
    return () => clearTimeout(t)
  }, [shown])

  useEffect(() => {
    if (!showList) return
    if (listCount < 40) {
      const t = setTimeout(() => setListCount((v) => Math.min(40, v + 1)), 55)
      return () => clearTimeout(t)
    }
    const t = setTimeout(() => setChoiceOpen(true), 1000)
    return () => clearTimeout(t)
  }, [showList, listCount])

  return (
    <div className="absolute inset-0 z-20 bg-black flex items-center justify-center p-6">
      {!showList ? (
        <div className="font-mono text-slate-200 text-base md:text-xl leading-loose text-center">
          {revealLines.slice(0, shown).map((l, i) => (
            <motion.div key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>{l}</motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center">
          <div className="font-mono text-[10px] tracking-[0.4em] text-white/50 mb-4">HUMAN INSTANCES</div>
          <div className="font-mono text-xs md:text-sm leading-6 h-64 overflow-hidden text-red-400/80">
            {Array.from({ length: listCount }, (_, i) => 999 - i).reverse().map((n) => (
              <div key={n}>{String(n).padStart(3, '0')} — FAILED</div>
            ))}
          </div>
          {listCount >= 40 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="font-mono text-emerald-300 text-lg tracking-[0.3em] mt-4"
              style={{ textShadow: '0 0 20px rgba(98,216,78,0.7)' }}>
              1000 — CURRENT
            </motion.div>
          )}
          {choiceOpen && (
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mt-8">
              <div className="font-mono text-slate-300 text-sm mb-6">ASTRA: "I can reset everything."</div>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button onClick={() => s.resetWorld()}
                  className="font-mono text-xs tracking-[0.25em] px-8 py-4 border border-white/40 text-white hover:bg-white hover:text-black transition-all">
                  [ RESET THE WORLD ]
                </button>
                <button onClick={() => s.set({ phase: 'countdown' })}
                  className="font-mono text-xs tracking-[0.25em] px-8 py-4 border border-red-500/60 text-red-400 hover:bg-red-500 hover:text-black transition-all">
                  [ BREAK THE SIMULATION ]
                </button>
              </div>
            </motion.div>
          )}
        </div>
      )}
    </div>
  )
}

/* ── COUNTDOWN → BLACKOUT → ESCAPED ────────────────────── */
export function Countdown() {
  const s = useGameStore()
  const [n, setN] = useState(10)

  useEffect(() => {
    s.doGlitch(10000)
    const t = setInterval(() => setN((v) => v - 1), 900)
    return () => clearInterval(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (n < 0) s.set({ phase: 'blackout' })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [n])

  return (
    <div className="absolute inset-0 z-20 bg-black flex flex-col items-center justify-center">
      <div className="font-mono text-red-400 text-xs tracking-[0.4em] mb-6">SIMULATION TERMINATING...</div>
      <div className="font-mono text-white text-8xl font-black" style={{ textShadow: '0 0 40px rgba(255,60,60,0.8)' }}>{Math.max(0, n)}</div>
    </div>
  )
}

export function Blackout({ onExit }: { onExit: () => void }) {
  const s = useGameStore()
  const [stage, setStage] = useState(0)

  useEffect(() => {
    const t1 = setTimeout(() => setStage(1), 5000)
    const t2 = setTimeout(() => setStage(2), 7800)
    const t3 = setTimeout(() => setStage(3), 10200)
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3) }
  }, [])

  useEffect(() => {
    if (!s.endingsSeen.includes('escaped')) {
      s.set({ endingsSeen: [...s.endingsSeen, 'escaped'], infiniteUnlocked: true })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="absolute inset-0 z-20 bg-black flex items-center justify-center p-6">
      <div className="text-center">
        {stage >= 1 && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="font-mono text-emerald-300 text-xl md:text-2xl tracking-[0.3em] leading-loose">CONGRATULATIONS.<br /><br />YOU ESCAPED.</motion.div>}
        {stage >= 2 && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="font-mono text-white text-xl md:text-2xl tracking-[0.3em] mt-8">OR DID YOU?</motion.div>}
        {stage >= 3 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-12 flex flex-col sm:flex-row gap-4 justify-center">
            <button onClick={onExit} className="font-mono text-xs tracking-[0.25em] px-8 py-4 border border-white/40 text-white hover:bg-white hover:text-black transition-all">
              [ RETURN TO REALITY ]
            </button>
            <button onClick={() => s.set({ phase: 'infinite' })} className="font-mono text-xs tracking-[0.25em] px-8 py-4 border border-purple-400/60 text-purple-300 hover:bg-purple-400 hover:text-black transition-all">
              [ INFINITE MODE ]
            </button>
          </motion.div>
        )}
      </div>
    </div>
  )
}

/* ── VAMSI'S ROOM ──────────────────────────────────────── */
export function VamsiRoom({ onExit }: { onExit: () => void }) {
  const s = useGameStore()
  const [started, setStarted] = useState(false)
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!started) {
      const t = setTimeout(() => {
        s.say('???', ['So you finally found me.'], 'vamsi')
        setStarted(true)
      }, 800)
      return () => clearTimeout(t)
    }
  }, [started, s])

  useEffect(() => {
    if (!started || s.dialogue) return
    if (count < vamsiUnlocks.length) {
      const t = setTimeout(() => setCount((v) => v + 1), 650)
      return () => clearTimeout(t)
    }
  }, [started, s.dialogue, count])

  return (
    <div className="absolute inset-0 z-20 bg-[#070a13] overflow-y-auto">
      <div className="max-w-3xl mx-auto px-6 py-20">
        <div className="font-mono text-[10px] tracking-[0.4em] text-red-400 mb-2">SECRET ROOM // CREATOR'S TERMINAL</div>
        <h1 className="font-mono text-2xl md:text-4xl text-white tracking-[0.15em] mb-1">VAMSI'S ROOM</h1>
        <div className="font-mono text-xs text-slate-500 mb-10">{identity.name} — {identity.role}</div>

        <div className="space-y-3">
          {vamsiUnlocks.slice(0, count).map((u) => (
            <motion.div key={u.title} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
              className="border border-emerald-400/30 bg-emerald-400/5 px-5 py-4">
              <div className="font-mono text-[10px] tracking-[0.35em] text-emerald-400">{u.kind} ✓</div>
              <div className="font-mono text-sm text-white tracking-wider mt-1.5">{u.title}</div>
              {u.lines.map((l) => <div key={l} className="font-mono text-[11px] text-slate-400 mt-0.5">{l}</div>)}
            </motion.div>
          ))}
        </div>

        {count >= vamsiUnlocks.length && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-10 flex flex-wrap gap-3">
            <button onClick={onExit} className="font-mono text-xs tracking-[0.25em] px-7 py-3.5 border border-cyan-400/60 text-cyan-300 hover:bg-cyan-400 hover:text-black transition-all">
              [ MEET THE CREATOR ]
            </button>
            <button onClick={() => s.set({ phase: 'city' })} className="font-mono text-xs tracking-[0.25em] px-7 py-3.5 border border-white/25 text-slate-300 hover:bg-white hover:text-black transition-all">
              [ BACK TO THE CITY ]
            </button>
          </motion.div>
        )}
      </div>
    </div>
  )
}
