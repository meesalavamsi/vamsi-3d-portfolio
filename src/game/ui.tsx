import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useGameStore, memoryPercent } from './gstore'
import { bootLines } from './story'

/* ── Boot sequence ─────────────────────────────────────── */
export function Boot({ onWake }: { onWake: () => void }) {
  const [shown, setShown] = useState(0)
  const [wakeUp, setWakeUp] = useState(false)
  const runCount = useGameStore((s) => s.runCount)

  useEffect(() => {
    if (shown < bootLines.length) {
      const t = setTimeout(() => setShown((v) => v + 1), shown === 0 ? 700 : 320)
      return () => clearTimeout(t)
    }
    const t = setTimeout(() => setWakeUp(true), 2000)
    return () => clearTimeout(t)
  }, [shown])

  return (
    <div className={`absolute inset-0 bg-black z-20 flex items-center justify-center ${wakeUp ? 'animate-[shake_0.4s_ease-in-out]' : ''}`}>
      <style>{`@keyframes shake { 0%,100%{transform:translate(0)} 25%{transform:translate(-6px,3px)} 50%{transform:translate(5px,-4px)} 75%{transform:translate(-3px,-3px)} }`}</style>
      {!wakeUp ? (
        <pre className="font-mono text-emerald-400/90 text-xs md:text-sm leading-7">
          {bootLines.slice(0, shown).join('\n')}
          {shown < bootLines.length && <span className="animate-pulse">▊</span>}
        </pre>
      ) : (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center">
          <div className="font-mono text-white text-3xl md:text-5xl tracking-[0.4em] mb-10" style={{ textShadow: '0 0 30px rgba(255,255,255,0.6)' }}>
            {runCount > 0 ? 'WAKE UP. AGAIN.' : 'WAKE UP.'}
          </div>
          <button
            onClick={onWake}
            className="font-mono text-sm tracking-[0.3em] px-10 py-4 border border-white/40 text-white hover:bg-white hover:text-black transition-all"
          >
            [ WAKE UP ]
          </button>
        </motion.div>
      )}
    </div>
  )
}

/* ── Typewriter dialogue ───────────────────────────────── */
export function Dialogue() {
  const dialogue = useGameStore((s) => s.dialogue)
  const closeDialogue = useGameStore((s) => s.closeDialogue)
  const [lineIdx, setLineIdx] = useState(0)
  const [chars, setChars] = useState(0)

  useEffect(() => { setLineIdx(0); setChars(0) }, [dialogue])

  const line = dialogue ? dialogue.lines[Math.min(lineIdx, dialogue.lines.length - 1)] : ''
  const lineDone = chars >= line.length

  useEffect(() => {
    if (!dialogue || lineDone) return
    const t = setTimeout(() => setChars((c) => c + 1), 22)
    return () => clearTimeout(t)
  })

  if (!dialogue) return null
  const last = lineIdx === dialogue.lines.length - 1

  const advance = () => {
    if (!lineDone) { setChars(line.length); return }
    if (!last) { setLineIdx(lineIdx + 1); setChars(0) } else closeDialogue()
  }

  return (
    <motion.div
      initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
      className="absolute bottom-24 left-1/2 -translate-x-1/2 z-30 w-[min(92vw,42rem)] cursor-pointer"
      onClick={advance}
    >
      <div className="bg-black/85 backdrop-blur-md border border-white/15 px-6 py-5" style={{ boxShadow: '0 0 40px rgba(0,0,0,0.8)' }}>
        <div className="font-mono text-[10px] tracking-[0.35em] text-cyan-400 mb-2">{dialogue.speaker}</div>
        <p className="font-mono text-sm md:text-base text-slate-100 leading-relaxed min-h-10">
          {line.slice(0, chars)}{!lineDone && <span className="animate-pulse">▊</span>}
        </p>
        <div className="text-right font-mono text-[10px] text-slate-500 mt-2">{lineDone ? (last ? '▸ CLOSE' : '▸') : '…'}</div>
      </div>
    </motion.div>
  )
}

/* ── HUD ───────────────────────────────────────────────── */
function objectiveText(s: ReturnType<typeof useGameStore.getState>): string {
  if (!s.strangerMet) return 'EXPLORE. SOMEONE IS LOOKING FOR YOU.'
  if (!s.shopMet) return 'FOLLOW THE LIGHT.'
  if (!s.chaseChoice) return '...'
  if (!s.chaseResolved) return 'THE CITY REMEMBERS YOUR CHOICE.'
  if (!s.foundPhoto) return 'SEARCH THE CITY.'
  if (!s.foundDiary) return 'SOMETHING IS HIDDEN NEARBY.'
  return 'FIND THE DOOR.'
}

export function HUD() {
  const s = useGameStore()
  const pct = memoryPercent(s)
  return (
    <>
      <div className="absolute top-4 left-5 z-20 font-mono text-[11px] tracking-[0.3em] text-white/70">
        PLAYER 1000{s.runCount > 0 && <span className="text-cyan-400 ml-2">RUN #{s.runCount + 1}</span>}
      </div>
      <div className="absolute top-4 right-5 z-20 font-mono text-[11px] tracking-[0.3em] text-white/70 text-right">
        <div>MEMORY: <span className="text-cyan-300">{pct}%</span></div>
        <button onClick={s.toggleSound} className="mt-1 text-[10px] text-slate-500 hover:text-white transition-colors">
          {s.soundOn ? '🔊 SOUND ON' : '🔇 SOUND OFF'}
        </button>
      </div>
      <div className="absolute top-14 left-1/2 -translate-x-1/2 z-20 font-mono text-[10px] tracking-[0.3em] text-cyan-200/60 text-center px-4">
        ▸ {objectiveText(s)}
      </div>
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 font-mono text-[10px] tracking-[0.25em] text-white/40 hidden md:block">
        [WASD] MOVE&nbsp;&nbsp;[E] INTERACT&nbsp;&nbsp;[M] ???&nbsp;&nbsp;[I] INVENTORY
      </div>
      <AnimatePresence>
        {s.toast && (
          <motion.div
            initial={{ opacity: 0, y: -14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="absolute top-16 left-1/2 -translate-x-1/2 z-30 font-mono text-xs tracking-[0.3em] text-cyan-300 bg-black/70 border border-cyan-400/40 px-6 py-2.5"
          >
            {s.toast}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

/* ── Glitch overlay ────────────────────────────────────── */
export function Glitch() {
  const glitch = useGameStore((s) => s.glitch)
  return (
    <AnimatePresence>
      {glitch && (
        <motion.div className="absolute inset-0 z-40 pointer-events-none" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <style>{`
            @keyframes glitch-shift { 0%{transform:translate(0)} 20%{transform:translate(-8px,4px)} 40%{transform:translate(6px,-6px)} 60%{transform:translate(-4px,-2px)} 80%{transform:translate(7px,3px)} 100%{transform:translate(0)} }
            @keyframes glitch-bar { 0%{top:10%} 50%{top:60%} 100%{top:20%} }
          `}</style>
          <div className="absolute inset-0 bg-cyan-400/10 mix-blend-screen" style={{ animation: 'glitch-shift 0.12s steps(2) infinite' }} />
          <div className="absolute inset-0 bg-pink-500/10 mix-blend-screen" style={{ animation: 'glitch-shift 0.15s steps(3) infinite reverse' }} />
          <div className="absolute left-0 right-0 h-8 bg-white/15" style={{ animation: 'glitch-bar 0.5s linear infinite' }} />
          <div className="absolute inset-0" style={{ background: 'repeating-linear-gradient(0deg, rgba(255,255,255,0.06) 0 2px, transparent 2px 4px)' }} />
        </motion.div>
      )}
    </AnimatePresence>
  )
}

/* ── Fourth-wall menu ──────────────────────────────────── */
const creepyLines = ['SETTINGS', '', 'WHO IS PLAYING?', '', 'WHY ARE YOU STILL HERE?', '', 'WHAT ARE YOU LOOKING FOR?']
export function CreepyMenu() {
  const open = useGameStore((s) => s.menuOpen)
  const set = useGameStore((s) => s.set)
  const [stage, setStage] = useState(0)

  useEffect(() => {
    if (!open) { setStage(0); return }
    const t1 = setTimeout(() => setStage(1), 1600)
    const t2 = setTimeout(() => set({ menuOpen: false }), 3200)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [open, set])

  return (
    <AnimatePresence>
      {open && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="absolute inset-0 z-40 bg-black/92 flex items-center justify-center">
          {stage === 0 ? (
            <pre className="font-mono text-slate-200 text-sm md:text-base leading-9 tracking-[0.2em]">{creepyLines.join('\n')}</pre>
          ) : (
            <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
              className="font-mono text-white text-2xl md:text-4xl tracking-[0.3em]" style={{ textShadow: '0 0 24px rgba(255,80,80,0.8)' }}>
              I CAN SEE YOU.
            </motion.div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  )
}

/* ── Inventory ─────────────────────────────────────────── */
export function Inventory() {
  const open = useGameStore((s) => s.inventoryOpen)
  const set = useGameStore((s) => s.set)
  const s = useGameStore()
  const items = [
    s.foundPhoto && { icon: '📷', name: 'A PHOTOGRAPH', desc: 'It shows you. You never took it.' },
    s.foundDiary && { icon: '📓', name: 'A DIARY', desc: 'Day 32: RESET THE WORLD. — V.' },
    s.memory.secrets.includes('space-signal') && { icon: '📡', name: 'DECRYPTED SIGNAL', desc: '"WE ARE NOT ALONE."' },
    s.memory.secrets.includes('earth-monument') && { icon: '🗿', name: 'MONUMENT RUBBING', desc: '"HUMANITY WAS HERE."' },
  ].filter(Boolean) as { icon: string; name: string; desc: string }[]

  return (
    <AnimatePresence>
      {open && (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
          className="absolute inset-0 z-40 bg-black/85 flex items-center justify-center p-6" onClick={() => set({ inventoryOpen: false })}>
          <div className="w-full max-w-md bg-black/90 border border-white/15 p-6" onClick={(e) => e.stopPropagation()}>
            <div className="font-mono text-xs tracking-[0.35em] text-cyan-400 mb-5">INVENTORY</div>
            {items.length === 0 && <div className="font-mono text-xs text-slate-500 leading-6">Empty.<br /><br />Keep looking.</div>}
            <div className="space-y-3">
              {items.map((it) => (
                <div key={it.name} className="flex gap-4 items-start border border-white/10 p-3">
                  <span className="text-2xl">{it.icon}</span>
                  <div>
                    <div className="font-mono text-xs tracking-widest text-white">{it.name}</div>
                    <div className="font-mono text-[11px] text-slate-400 mt-1">{it.desc}</div>
                  </div>
                </div>
              ))}
            </div>
            <div className="font-mono text-[10px] text-slate-600 mt-5 text-center">[I] OR CLICK OUTSIDE TO CLOSE</div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
