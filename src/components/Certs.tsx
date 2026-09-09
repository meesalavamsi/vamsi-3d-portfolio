import Reveal, { SectionHead } from './Reveal'
import { certifications, coding } from '../data/resume'
import { BadgeCheck } from 'lucide-react'

export default function Certs() {
  return (
    <section id="certs" className="max-w-6xl mx-auto px-6 py-24 md:py-32">
      <SectionHead index="05" label="Credentials" title="Certified & verified." />
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-24">
        {certifications.map((c, i) => (
          <Reveal key={c.short} delay={i * 0.07}>
            <div className="card p-6 h-full relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-full h-0.5" style={{ background: `linear-gradient(90deg, transparent, ${c.color}, transparent)` }} />
              <div className="flex items-center justify-between mb-5">
                <span className="text-2xl">{c.icon}</span>
                <BadgeCheck size={18} style={{ color: c.color }} />
              </div>
              <div className="font-bold text-white tracking-wide" style={{ textShadow: `0 0 20px ${c.color}44` }}>{c.short}</div>
              <div className="text-xs text-slate-400 mt-1.5 leading-relaxed">{c.name}</div>
            </div>
          </Reveal>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-10 items-center">
        <Reveal>
          <div className="section-label mb-3">COMPETITIVE PROGRAMMING</div>
          <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">Problem solving, daily.</h3>
          <p className="text-slate-400 leading-relaxed mb-6">
            Building applications is only half of engineering. I sharpen the other half — algorithms and
            data structures — through consistent practice on competitive platforms.
          </p>
          <div className="flex flex-wrap gap-2.5">
            {coding.platforms.map((p) => (
              <span key={p} className="chip !text-emerald-300 !border-emerald-400/30">{p}</span>
            ))}
          </div>
        </Reveal>
        <Reveal delay={0.15}>
          <div className="card p-7 space-y-5">
            {coding.bars.map((b, i) => (
              <div key={b.label}>
                <div className="flex justify-between font-mono text-[11px] tracking-[0.2em] text-slate-400 mb-2">
                  <span>{b.label.toUpperCase()}</span><span className="text-cyan-300">{b.value}%</span>
                </div>
                <div className="h-1.5 rounded-full bg-white/8 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-purple-500 transition-all duration-1000"
                    style={{ width: `${b.value}%`, transitionDelay: `${i * 120}ms` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  )
}
