import { useEffect, useRef, useState } from 'react'
import SectionShell from '../components/SectionShell'
import { ZoneTitle, HoloChip, NpcLine } from '../components/widgets'
import { skillGroups } from '../data/resume'
import { useGame } from '../store/gameStore'
import { sfx } from '../utils/sound'

const accents: Record<string, string> = {
  programming: '#4dd0ff', corecs: '#a78bfa', web: '#62d84e',
  sysadmin: '#62d84e', enterprise: '#f472b6', methodology: '#fbbf24',
}

/** Interactive fake Linux terminal. */
function LinuxTerminal() {
  const [history, setHistory] = useState<{ cmd: string; out: string[] }[]>([
    { cmd: 'whoami', out: ['vamsi'] },
  ])
  const [input, setInput] = useState('')
  const endRef = useRef<HTMLDivElement>(null)
  const soundOn = useGame((s) => s.soundOn)

  const commands: Record<string, string[]> = {
    whoami: ['vamsi'],
    skills: ['Linux', 'Shell', 'Git', 'GitHub'],
    status: ['SYSTEMS READY'],
    ls: ['projects/', 'certifications/', 'experience/', 'skills/', 'README.md'],
    'cat readme.md': ['Developer + Problem Solver + Systems Thinker + Builder'],
    help: ['whoami · skills · status · ls · certs · clear'],
    certs: ['RHCSA', 'ServiceNow CAD', 'ServiceNow CSA', 'Oracle Java Foundations'],
    clear: [],
  }

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [history])

  const run = (cmd: string) => {
    const key = cmd.trim().toLowerCase()
    if (!key) return
    if (key === 'clear') { setHistory([]); return }
    const out = commands[key] ?? [`bash: ${key}: command not found — try 'help'`]
    setHistory((h) => [...h, { cmd: key, out }])
    if (soundOn) sfx.click()
  }

  return (
    <div className="terminal p-5 max-w-2xl">
      <div className="flex gap-1.5 mb-4">
        <span className="w-3 h-3 rounded-full bg-red-500/70" />
        <span className="w-3 h-3 rounded-full bg-amber-400/70" />
        <span className="w-3 h-3 rounded-full bg-emerald-400/70" />
        <span className="ml-3 text-[10px] tracking-[0.25em] text-slate-500">vamsi@skill-lab: ~</span>
      </div>
      <div className="max-h-56 overflow-y-auto text-[13px] leading-6">
        {history.map((h, i) => (
          <div key={i}>
            <div><span className="prompt">$ </span>{h.cmd}</div>
            {h.out.map((l, j) => <div key={j} className="text-slate-300 pl-3">{l}</div>)}
          </div>
        ))}
        <div className="flex items-center gap-2">
          <span className="prompt">$</span>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') { run(input); setInput('') } }}
            className="flex-1 bg-transparent outline-none text-slate-100 caret-[#62d84e]"
            placeholder="type 'help'..."
            aria-label="terminal input"
          />
        </div>
        <div ref={endRef} />
      </div>
    </div>
  )
}

export default function SkillLab() {
  return (
    <SectionShell id="skilllab" title="SKILL LAB" subtitle="Walk through the skill stations of the laboratory." accent="#22d3ee">
      {skillGroups.map((g) => (
        <div key={g.id} className="mb-12">
          <ZoneTitle accent={accents[g.id]}>{g.icon} {g.title.toUpperCase()}</ZoneTitle>
          <div className="flex flex-wrap gap-3">
            {g.skills.map((s, i) => (
              <HoloChip key={s} label={s} accent={accents[g.id]} delay={i * 0.05} />
            ))}
          </div>
          {g.id === 'web' && (
            <div className="glass p-5 mt-5 max-w-2xl">
              <NpcLine who="STORY" text="The browser is only the beginning. Vamsi learned to connect interfaces with backend systems, APIs, databases, and deployments." accent="#62d84e" />
            </div>
          )}
          {g.id === 'sysadmin' && (
            <div className="mt-5">
              <LinuxTerminal />
            </div>
          )}
        </div>
      ))}
    </SectionShell>
  )
}
