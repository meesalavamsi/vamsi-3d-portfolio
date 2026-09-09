import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import SectionShell from '../components/SectionShell'
import { ZoneTitle, NpcLine } from '../components/widgets'
import { summary } from '../data/resume'
import { useGame } from '../store/gameStore'
import { sfx } from '../utils/sound'

const objects = [
  { icon: '💻', label: 'Laptop', reveals: 'Technical Skills', text: 'TypeScript, React, Node.js — the daily drivers.' },
  { icon: '📚', label: 'Books', reveals: 'Education', text: 'B.Tech Computer Science & Engineering, 2023–2027.' },
  { icon: '🖥️', label: 'Server', reveals: 'Backend', text: 'APIs, databases, deployments — systems that stay up.' },
  { icon: '🤖', label: 'Robot', reveals: 'AI', text: 'AI-driven solutions and open-source exploration.' },
  { icon: '⌨️', label: 'Terminal', reveals: 'Coding', text: 'Linux, shell scripting, Git — the command line is home.' },
  { icon: '🎛️', label: 'ServiceNow Console', reveals: 'Experience', text: 'Enterprise workflow automation at Technical Hub.' },
]

export default function HomeBase() {
  const [active, setActive] = useState<number | null>(null)
  const [pcOn, setPcOn] = useState(false)
  const soundOn = useGame((s) => s.soundOn)

  return (
    <SectionShell id="home" title="HOME BASE" subtitle="A futuristic developer room. Every object tells part of the story." accent="#4dd0ff">
      <ZoneTitle>THE DEVELOPER ROOM — CLICK OBJECTS</ZoneTitle>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-12">
        {objects.map((o, i) => (
          <motion.button
            key={o.label}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.06 }}
            onClick={() => { setActive(active === i ? null : i); if (soundOn) sfx.click() }}
            className={`holo-card p-5 text-left ${active === i ? 'neon-border' : ''}`}
          >
            <div className="text-3xl floaty" style={{ animationDelay: `${i * 0.3}s` }}>{o.icon}</div>
            <div className="mt-3 text-sm tracking-widest text-cyan-200">{o.label.toUpperCase()}</div>
            <div className="text-[10px] tracking-widest text-purple-300/70 mt-1">→ {o.reveals.toUpperCase()}</div>
            <AnimatePresence>
              {active === i && (
                <motion.p
                  initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                  className="text-xs text-slate-300/90 mt-3 leading-relaxed"
                >
                  {o.text}
                </motion.p>
              )}
            </AnimatePresence>
          </motion.button>
        ))}
      </div>

      <ZoneTitle>THE MAIN COMPUTER</ZoneTitle>
      <div className="terminal p-6 max-w-3xl">
        {!pcOn ? (
          <button className="btn-game green" onClick={() => { setPcOn(true); if (soundOn) sfx.open() }}>
            ⏻ POWER ON — WHO IS VAMSI?
          </button>
        ) : (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="prompt text-sm mb-1">$ whoami --verbose</div>
            <h3 className="text-cyan-300 text-glow text-xl tracking-[0.2em] mb-4">WHO IS VAMSI?</h3>
            <p className="text-sm text-slate-300 mb-4">
              Computer Science undergraduate with hands-on experience in:
            </p>
            <ul className="grid sm:grid-cols-2 gap-x-8 gap-y-1.5 text-[13px] text-slate-200 mb-6">
              {summary.map((s) => (
                <li key={s} className="flex gap-2"><span className="text-emerald-400">▸</span>{s}</li>
              ))}
            </ul>
            <div className="border-t border-emerald-400/20 pt-4 space-y-3">
              <NpcLine who="STORY" text="Vamsi started his journey by learning how computers, software, and systems work." />
              <NpcLine who="STORY" text="Over time, curiosity turned into projects. Projects turned into experience." />
              <NpcLine who="STORY" text="And experience turned into a passion for building real systems." />
            </div>
            <div className="prompt text-sm mt-5">$ <span className="caret" /></div>
          </motion.div>
        )}
      </div>
    </SectionShell>
  )
}
