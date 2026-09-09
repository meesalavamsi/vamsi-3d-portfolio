import Reveal, { SectionHead } from './Reveal'
import { experience } from '../data/resume'

export default function Experience() {
  return (
    <section id="experience" className="max-w-6xl mx-auto px-6 py-24 md:py-32">
      <SectionHead index="02" label="Experience" title="Where I've worked." />
      <div className="relative pl-6 md:pl-10 border-l border-white/10 space-y-14">
        {experience.map((e, i) => (
          <Reveal key={e.id} delay={i * 0.1} className="relative">
            <span className="absolute -left-[31px] md:-left-[47px] top-1.5 w-3.5 h-3.5 rounded-full bg-[#05060e] border-2 border-cyan-400 shadow-[0_0_12px_rgba(77,208,255,0.6)]" />
            <div className="card p-6 md:p-8">
              <div className="flex flex-wrap items-baseline justify-between gap-2 mb-1">
                <h3 className="text-xl md:text-2xl font-bold text-white">{e.role}</h3>
                <span className="font-mono text-xs text-cyan-300 tracking-wider">{e.period}</span>
              </div>
              <div className="text-sm text-slate-500 font-mono tracking-wider mb-4">{e.org}</div>
              <p className="text-slate-300 font-medium mb-5">{e.summary}</p>
              <ul className="space-y-2 mb-6">
                {e.bullets.map((b) => (
                  <li key={b} className="flex gap-3 text-sm text-slate-400">
                    <span className="text-cyan-400 mt-0.5">▸</span>{b}
                  </li>
                ))}
              </ul>
              <div className="flex flex-wrap gap-2">
                {e.tech.map((t) => <span key={t} className="chip">{t}</span>)}
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  )
}
