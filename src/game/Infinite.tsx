import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { useGameStore } from './gstore'
import { infiniteScenarios, finalMessage } from './story'

const beats = [
  { text: 'You arrive. The air is wrong. Something here has been waiting.', a: 'Investigate alone', b: 'Call for help' },
  { text: 'A locked door. A sound behind it. It knows your name.', a: 'Open it', b: 'Walk away' },
  { text: 'A stranger offers you a way out — for a price you cannot see.', a: 'Accept', b: 'Refuse' },
  { text: 'The floor is collapsing. One path is safe. One path is faster.', a: 'The fast path', b: 'The safe path' },
  { text: 'A message appears: "STOP NOW." It is signed with your name.', a: 'Keep going', b: 'Turn back' },
  { text: 'Power flickers. In the dark, something moves closer.', a: 'Stand still', b: 'Run toward it' },
]

export default function Infinite({ onExit }: { onExit: () => void }) {
  const s = useGameStore()
  const [scenario, setScenario] = useState<string | null>(null)
  const [round, setRound] = useState(0)
  const [score, setScore] = useState(0)

  const rounds = useMemo(() => [...beats].sort(() => Math.random() - 0.5).slice(0, 3), [scenario])
  const pick = (risky: boolean) => {
    if (risky) { setScore((v) => v + 2); s.set({ memory: { ...s.memory, risks: s.memory.risks + 1, choices: s.memory.choices + 1 } }) }
    else s.set({ memory: { ...s.memory, choices: s.memory.choices + 1 } })
    setRound((r) => r + 1)
  }

  if (!scenario) {
    const shown = [...infiniteScenarios].sort(() => Math.random() - 0.5).slice(0, 4)
    return (
      <div className="absolute inset-0 z-20 bg-black/95 flex items-center justify-center p-6">
        <div className="w-full max-w-xl text-center">
          <div className="font-mono text-[10px] tracking-[0.4em] text-purple-400 mb-2">INFINITE MODE</div>
          <div className="font-mono text-xl text-white tracking-[0.2em] mb-2">THE SIMULATION CONTINUES</div>
          <div className="font-mono text-[11px] text-slate-500 mb-8">Endless scenarios. Partially randomized. No two runs are the same.</div>
          <div className="grid gap-3">
            {shown.map((sc) => (
              <button key={sc} onClick={() => { setScenario(sc); setRound(0); setScore(0) }}
                className="font-mono text-sm tracking-[0.25em] text-slate-200 border border-white/15 px-6 py-4 hover:border-purple-400/60 hover:bg-purple-400/10 transition-all">
                {sc}
              </button>
            ))}
          </div>
          <button onClick={onExit} className="mt-8 font-mono text-[10px] tracking-[0.3em] text-slate-500 hover:text-white transition-colors">← EXIT SIMULATION</button>
        </div>
      </div>
    )
  }

  if (round >= rounds.length) {
    return (
      <div className="absolute inset-0 z-20 bg-black/95 flex items-center justify-center p-6">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center max-w-md">
          <div className="font-mono text-[10px] tracking-[0.4em] text-purple-400 mb-3">{scenario}</div>
          <div className="font-mono text-2xl text-white tracking-[0.2em] mb-2">SCENARIO COMPLETE</div>
          <div className="font-mono text-sm text-slate-400 mb-1">RISK SCORE: <span className="text-purple-300">{score} / {rounds.length * 2}</span></div>
          <div className="font-mono text-[11px] text-slate-500 mt-4 leading-6">
            {score >= 4 ? 'ASTRA: "You run toward danger. Noted. Again."' : score >= 2 ? 'ASTRA: "Balanced. Cautious. Curious."' : 'ASTRA: "You survived by saying no. That is also a choice."'}
          </div>
          <div className="mt-8 flex gap-3 justify-center">
            <button onClick={() => setScenario(null)} className="font-mono text-xs tracking-[0.25em] px-7 py-3.5 border border-purple-400/60 text-purple-300 hover:bg-purple-400 hover:text-black transition-all">[ ANOTHER SCENARIO ]</button>
            <button onClick={onExit} className="font-mono text-xs tracking-[0.25em] px-7 py-3.5 border border-white/25 text-slate-300 hover:bg-white hover:text-black transition-all">[ EXIT ]</button>
          </div>
        </motion.div>
      </div>
    )
  }

  const beat = rounds[round]
  return (
    <div className="absolute inset-0 z-20 bg-black/95 flex items-center justify-center p-6">
      <div className="w-full max-w-xl">
        <div className="font-mono text-[10px] tracking-[0.4em] text-purple-400 mb-2">{scenario} — EVENT {round + 1}/3</div>
        <motion.p key={round} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
          className="font-mono text-slate-200 text-base md:text-lg leading-relaxed mb-10 min-h-16">
          {beat.text}
        </motion.p>
        <div className="grid sm:grid-cols-2 gap-3">
          <button onClick={() => pick(true)} className="font-mono text-xs tracking-[0.2em] px-6 py-4 border border-red-400/50 text-red-300 hover:bg-red-400 hover:text-black transition-all">
            A — {beat.a.toUpperCase()}
          </button>
          <button onClick={() => pick(false)} className="font-mono text-xs tracking-[0.2em] px-6 py-4 border border-cyan-400/50 text-cyan-300 hover:bg-cyan-400 hover:text-black transition-all">
            B — {beat.b.toUpperCase()}
          </button>
        </div>
      </div>
    </div>
  )
}
