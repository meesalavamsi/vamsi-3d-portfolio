import { motion } from 'framer-motion'
import { Mail, FileDown } from 'lucide-react'
import { GithubIcon, LinkedinIcon } from '../components/BrandIcons'
import SectionShell from '../components/SectionShell'
import { ZoneTitle, NpcLine } from '../components/widgets'
import { identity, locations } from '../data/resume'
import { useGame } from '../store/gameStore'
import { sfx } from '../utils/sound'

const accent = '#818cf8'

const nextGoals = [
  'Build better systems.',
  'Solve harder problems.',
  'Learn continuously.',
  'Explore AI.',
  'Become a stronger software engineer.',
]

export default function MissionControl() {
  const completed = useGame((s) => s.completedMissions)
  const openResume = useGame((s) => s.openResume)
  const setPhase = useGame((s) => s.setPhase)
  const resetJourney = useGame((s) => s.resetJourney)
  const soundOn = useGame((s) => s.soundOn)
  const allDone = completed.length >= locations.length

  const contacts = [
    { icon: LinkedinIcon, label: 'LinkedIn', href: identity.linkedin },
    { icon: GithubIcon, label: 'GitHub', href: identity.github },
    { icon: Mail, label: 'Email', href: `mailto:${identity.email}` },
  ]

  return (
    <SectionShell id="control" title="MISSION CONTROL" subtitle="The final station of the journey." accent={accent}>
      <div className="glass p-6 md:p-8 max-w-3xl mb-10 space-y-3">
        <NpcLine who="SYSTEM" text="You have explored the education. You have discovered the skills. You investigated enterprise systems." accent={accent} />
        <NpcLine who="SYSTEM" text="You explored real projects. You unlocked certifications. You entered the coding arena." accent={accent} />
        <NpcLine who="VAMSI" text="But the journey isn't finished." accent="#4dd0ff" />
      </div>

      <ZoneTitle accent={accent}>WHAT'S NEXT?</ZoneTitle>
      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 mb-12 max-w-4xl">
        {nextGoals.map((g, i) => (
          <motion.div
            key={g}
            initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            transition={{ delay: i * 0.08 }}
            className="holo-card p-4 text-sm text-slate-100 tracking-wider"
          >
            <span style={{ color: accent }}>▸</span> {g}
          </motion.div>
        ))}
      </div>

      <ZoneTitle accent={accent}>COMMUNICATION TERMINAL</ZoneTitle>
      <div className="terminal p-6 max-w-2xl mb-10 !border-indigo-400/40" style={{ boxShadow: '0 0 24px rgba(129,140,248,0.12)' }}>
        <div className="text-indigo-300 text-glow-purple text-lg tracking-[0.2em]">{identity.name}</div>
        <div className="text-slate-400 text-xs tracking-[0.25em] mt-1 mb-6">{identity.role.toUpperCase()}</div>
        <div className="flex flex-wrap gap-3">
          {contacts.map((c) => (
            <a
              key={c.label}
              href={c.href}
              target={c.href.startsWith('mailto') ? undefined : '_blank'}
              rel="noreferrer"
              className="btn-game !py-2.5 !px-5 inline-flex items-center gap-2 !normal-case !tracking-widest"
              onClick={() => soundOn && sfx.click()}
            >
              <c.icon size={15} /> {c.label}
            </a>
          ))}
          <button
            className="btn-game purple !py-2.5 !px-5 inline-flex items-center gap-2 !normal-case !tracking-widest"
            onClick={() => { if (soundOn) sfx.click(); openResume() }}
          >
            <FileDown size={15} /> Download Resume
          </button>
        </div>
        <div className="mt-5 text-[11px] text-slate-500 tracking-widest">SIGNAL: {identity.email}</div>
      </div>

      {allDone && (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="glass-strong p-8 max-w-2xl text-center mb-8">
          <div className="text-emerald-300 text-glow-green text-xl tracking-[0.3em] mb-6">ALL MISSIONS COMPLETE ✓</div>
          <button
            className="btn-game green text-sm !px-10 !py-4"
            onClick={() => { if (soundOn) sfx.mission(); setPhase('finale') }}
          >
            ▶ INITIATE FINAL SEQUENCE
          </button>
        </motion.div>
      )}
      {!allDone && (
        <div className="text-[11px] text-slate-500 tracking-[0.25em]">
          COMPLETE ALL MISSIONS TO INITIATE THE FINAL SEQUENCE ({completed.length}/{locations.length})
        </div>
      )}
      <button
        className="mt-6 text-[10px] tracking-[0.3em] text-slate-600 hover:text-red-400 transition-colors block"
        onClick={() => { if (soundOn) sfx.click(); resetJourney() }}
      >
        ↻ RESTART JOURNEY (RESET SAVE)
      </button>
    </SectionShell>
  )
}
