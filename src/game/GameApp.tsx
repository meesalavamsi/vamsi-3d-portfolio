import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useGameStore } from './gstore'
import { Boot, Dialogue, HUD, Glitch, CreepyMenu, Inventory } from './ui'
import City from './scenes/City'
import Lab from './scenes/Lab'
import Worlds from './scenes/Worlds'
import { WorldMap, Moral, Reveal, Countdown, Blackout, VamsiRoom } from './screens'
import Infinite from './Infinite'
import ResultCard from './ResultCard'
import { startAmbient, stopAmbient, blip, glitchSfx } from './gsound'

interface Props {
  onExit: () => void
  onMeetCreator: () => void
}

export default function GameApp({ onExit, onMeetCreator }: Props) {
  const s = useGameStore()
  const [prompt, setPrompt] = useState<string | null>(null)
  const [cardOpen, setCardOpen] = useState(false)

  // keyboard: M = creepy menu, I = inventory
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const k = e.key.toLowerCase()
      if (k === 'm') { s.set({ menuOpen: true }); if (s.soundOn) glitchSfx() }
      if (k === 'i') { s.set({ inventoryOpen: !s.inventoryOpen }); if (s.soundOn) blip() }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [s])

  // ambient sound
  useEffect(() => {
    if (s.soundOn && (s.phase === 'city' || s.phase === 'world' || s.phase === 'lab')) startAmbient()
    else stopAmbient()
  }, [s.soundOn, s.phase])

  // glitch sfx hook
  useEffect(() => { if (s.glitch && s.soundOn) glitchSfx() }, [s.glitch, s.soundOn])

  const sendKey = (key: string, down: boolean) => {
    window.dispatchEvent(new KeyboardEvent(down ? 'keydown' : 'keyup', { key }))
  }

  const in3D = s.phase === 'city' || s.phase === 'world' || s.phase === 'lab'

  return (
    <div className="fixed inset-0 z-[70] bg-black select-none">
      {/* 3D layers */}
      {s.phase === 'city' && <City onPrompt={setPrompt} />}
      {s.phase === 'lab' && <Lab />}
      {s.phase === 'world' && <Worlds />}

      {/* screen phases */}
      {s.phase === 'boot' && <Boot onWake={() => { if (s.soundOn) blip(220, 0.4, 'sawtooth'); s.set({ phase: 'city' }) }} />}
      {s.phase === 'worldmap' && <WorldMap />}
      {s.phase === 'moral' && <Moral />}
      {s.phase === 'reveal' && <Reveal />}
      {s.phase === 'countdown' && <Countdown />}
      {s.phase === 'blackout' && <Blackout onExit={() => { s.fullResetKeepProgress(); onExit() }} />}
      {s.phase === 'vamsiroom' && <VamsiRoom onExit={onMeetCreator} />}
      {s.phase === 'infinite' && <Infinite onExit={onExit} />}

      {/* overlays */}
      <Dialogue />
      <Glitch />
      <CreepyMenu />
      <Inventory />
      <ResultCard open={cardOpen} onClose={() => setCardOpen(false)} />
      {in3D && <HUD />}

      {/* interact prompt */}
      {prompt && !s.dialogue && (
        <div className="absolute bottom-16 left-1/2 -translate-x-1/2 z-30 font-mono text-xs tracking-[0.3em] text-white bg-black/70 border border-white/25 px-6 py-3 animate-pulse">
          [E] {prompt}
        </div>
      )}

      {/* chase choice */}
      <AnimatePresence>
        {s.chasePending && !s.dialogue && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="absolute inset-0 z-40 bg-black/70 flex items-center justify-center p-6">
            <div className="text-center">
              <div className="font-mono text-xs tracking-[0.35em] text-red-400 mb-6">CHOOSE — THE WORLD IS WATCHING</div>
              <div className="grid gap-3">
                {([['helped', 'A — HELP THEM', 'cyan'], ['ignored', 'B — IGNORE THEM', 'slate'], ['followed', 'C — FOLLOW THE ATTACKER', 'red']] as const).map(([c, label, col]) => (
                  <button key={c}
                    onClick={() => {
                      s.chooseChase(c)
                      s.set({ chasePending: false })
                      s.showToast('THE WORLD REMEMBERS.')
                      if (s.soundOn) blip(col === 'red' ? 180 : 420, 0.25)
                    }}
                    className={`font-mono text-xs tracking-[0.25em] px-8 py-4 border transition-all ${
                      col === 'red' ? 'border-red-400/60 text-red-300 hover:bg-red-400'
                      : col === 'cyan' ? 'border-cyan-400/60 text-cyan-300 hover:bg-cyan-400'
                      : 'border-slate-400/40 text-slate-300 hover:bg-slate-300'
                    } hover:text-black`}>
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* mobile controls */}
      {in3D && (
        <div className="md:hidden">
          <div className="absolute bottom-16 left-4 z-30 grid grid-cols-3 gap-1.5 opacity-80">
            <span />
            <TouchBtn label="▲" onDown={() => sendKey('w', true)} onUp={() => sendKey('w', false)} />
            <span />
            <TouchBtn label="◀" onDown={() => sendKey('a', true)} onUp={() => sendKey('a', false)} />
            <TouchBtn label="▼" onDown={() => sendKey('s', true)} onUp={() => sendKey('s', false)} />
            <TouchBtn label="▶" onDown={() => sendKey('d', true)} onUp={() => sendKey('d', false)} />
          </div>
          <div className="absolute bottom-16 right-4 z-30 flex flex-col gap-2 opacity-80">
            <TouchBtn label="E" big onDown={() => sendKey('e', true)} onUp={() => sendKey('e', false)} />
            <TouchBtn label="MENU" onDown={() => s.set({ menuOpen: true })} onUp={() => {}} />
          </div>
        </div>
      )}

      {/* top-right game controls */}
      <div className="absolute top-12 right-5 z-30 flex gap-3">
        {s.endingsSeen.length > 0 && (
          <button onClick={() => setCardOpen(true)} className="font-mono text-[10px] tracking-[0.25em] text-purple-300/80 hover:text-purple-200 transition-colors">
            ◈ SHARE MY JOURNEY
          </button>
        )}
        {s.infiniteUnlocked && s.phase !== 'infinite' && (
          <button onClick={() => s.set({ phase: 'infinite' })} className="font-mono text-[10px] tracking-[0.25em] text-purple-300/80 hover:text-purple-200 transition-colors">
            ∞ INFINITE
          </button>
        )}
        <button onClick={onExit} className="font-mono text-[10px] tracking-[0.25em] text-slate-500 hover:text-white transition-colors">
          EXIT ✕
        </button>
      </div>
    </div>
  )
}

function TouchBtn({ label, onDown, onUp, big = false }: { label: string; onDown: () => void; onUp: () => void; big?: boolean }) {
  return (
    <button
      onTouchStart={(e) => { e.preventDefault(); onDown() }}
      onTouchEnd={(e) => { e.preventDefault(); onUp() }}
      onMouseDown={onDown} onMouseUp={onUp}
      className={`font-mono text-xs text-white bg-white/10 border border-white/25 rounded-lg ${big ? 'w-16 h-16 text-lg' : 'w-12 h-12'}`}
    >
      {label}
    </button>
  )
}
