import { GraduationCap } from 'lucide-react'
import Reveal, { SectionHead } from './Reveal'
import { about, education } from '../data/resume'

export default function About() {
  return (
    <section id="about" className="max-w-6xl mx-auto px-6 py-24 md:py-32">
      <SectionHead index="01" label="About" title="The short version." />
      <div className="grid md:grid-cols-2 gap-10 md:gap-16 items-start">
        <Reveal>
          <p className="text-xl md:text-2xl text-slate-200 font-medium leading-snug mb-6">{about.lead}</p>
          {about.body.map((p, i) => (
            <p key={i} className="text-slate-400 leading-relaxed mb-5">{p}</p>
          ))}
          <div className="flex flex-wrap gap-2.5 mt-7">
            {about.traits.map((t) => (
              <span key={t} className="chip !text-cyan-300 !border-cyan-400/30">{t}</span>
            ))}
          </div>
          <div className="card p-5 mt-8 flex gap-4 items-center">
            <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-400/20">
              <GraduationCap size={22} className="text-purple-300" />
            </div>
            <div>
              <div className="text-white font-semibold text-sm">{education.institution}</div>
              <div className="text-slate-400 text-sm">{education.degree}</div>
              <div className="font-mono text-[11px] text-slate-500 mt-1 tracking-wider">
                {education.period} · CGPA <span className="text-purple-300 font-bold">{education.cgpa}</span>
              </div>
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.15}>
          <div className="terminal overflow-hidden">
            <div className="flex items-center gap-1.5 px-4 py-3 border-b border-white/8">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400/70" />
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400/70" />
              <span className="ml-3 text-[10px] tracking-[0.25em] text-slate-600">vamsi@dev ~ whoami</span>
            </div>
            <div className="p-6 text-[13px] leading-7 font-mono">
              <div><span className="text-emerald-400">$</span> <span className="text-slate-300">whoami</span></div>
              <div className="text-cyan-300">vamsi — systems engineer in training</div>
              <div className="mt-3"><span className="text-emerald-400">$</span> <span className="text-slate-300">cat focus.txt</span></div>
              <div className="text-slate-400">backend systems · enterprise automation · full-stack web · AI-driven solutions</div>
              <div className="mt-3"><span className="text-emerald-400">$</span> <span className="text-slate-300">systemctl status career</span></div>
              <div className="text-slate-400">● active <span className="text-emerald-400">(learning, building, shipping)</span></div>
              <div className="mt-3"><span className="text-emerald-400">$</span> <span className="animate-pulse text-slate-300">▊</span></div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
