import { useState } from 'react'
import Reveal from './Reveal'

/** Mysterious portal into THE LAST HUMAN — placed between Contact and Footer. */
export default function SimGate({ onEnter, played }: { onEnter: () => void; played: boolean }) {
  const [hover, setHover] = useState(false)
  return (
    <section className="relative py-24 border-t border-white/8 overflow-hidden">
      <div
        className="absolute inset-0 opacity-30 pointer-events-none transition-opacity"
        style={{
          background: 'repeating-linear-gradient(0deg, rgba(255,255,255,0.03) 0 2px, transparent 2px 5px)',
          opacity: hover ? 0.6 : 0.3,
        }}
      />
      <Reveal className="relative max-w-3xl mx-auto px-6 text-center">
        <div className="font-mono text-[10px] tracking-[0.5em] text-red-400/70 mb-4">⚠ UNLISTED TRANSMISSION</div>
        <p className="font-mono text-slate-400 text-sm leading-7 mb-8">
          There is something else on this website.<br />
          It is not a portfolio section.<br />
          <span className="text-slate-200">It remembers everyone who enters.</span>
        </p>
        <button
          onClick={onEnter}
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
          className="font-mono text-sm tracking-[0.35em] px-10 py-4 border border-red-500/50 text-red-300 hover:bg-red-500 hover:text-black transition-all"
          style={{ boxShadow: hover ? '0 0 30px rgba(239,68,68,0.35)' : 'none' }}
        >
          {played ? '[ ENTER AGAIN ]' : '[ ENTER ]'}
        </button>
        <div className="font-mono text-[10px] text-slate-600 mt-5 tracking-widest">
          A STORY-DRIVEN SIMULATION · ~15 MIN · HEADPHONES RECOMMENDED
        </div>
      </Reveal>
    </section>
  )
}
