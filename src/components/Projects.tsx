import Reveal, { SectionHead } from './Reveal'
import { projects } from '../data/resume'

export default function Projects() {
  return (
    <section id="projects" className="max-w-6xl mx-auto px-6 py-24 md:py-32">
      <SectionHead index="03" label="Selected Work" title="Things I've built." />
      <div className="space-y-8">
        {projects.map((p, i) => (
          <Reveal key={p.id} delay={0.05}>
            <article
              className="card relative overflow-hidden p-7 md:p-10 group"
              style={{ ['--accent' as string]: p.accent }}
            >
              <div
                className="absolute -top-24 -right-24 w-72 h-72 rounded-full opacity-[0.07] group-hover:opacity-[0.14] transition-opacity blur-3xl pointer-events-none"
                style={{ background: p.accent }}
              />
              <div className="grid md:grid-cols-[auto_1fr] gap-6 md:gap-10 items-start">
                <div className="flex md:flex-col items-center md:items-start gap-4">
                  <span className="font-mono text-sm" style={{ color: p.accent }}>{p.num}</span>
                  <span className="text-4xl md:text-5xl">{p.icon}</span>
                </div>
                <div>
                  <h3 className="text-2xl md:text-3xl font-bold text-white group-hover:text-transparent group-hover:bg-clip-text transition-all"
                    style={{ ['--tw-text-opacity' as string]: 1 }}>
                    {p.name}
                  </h3>
                  <p className="font-mono text-xs tracking-[0.2em] mt-1.5 uppercase" style={{ color: p.accent }}>{p.tagline}</p>
                  <p className="text-slate-400 leading-relaxed mt-4 max-w-2xl">{p.description}</p>
                  <div className="grid sm:grid-cols-2 gap-x-8 gap-y-1.5 mt-5 max-w-xl">
                    {p.features.map((f) => (
                      <div key={f} className="flex gap-2.5 text-sm text-slate-300">
                        <span style={{ color: p.accent }}>▸</span>{f}
                      </div>
                    ))}
                  </div>
                  <div className="flex flex-wrap gap-2 mt-6">
                    {p.tech.map((t) => <span key={t} className="chip">{t}</span>)}
                  </div>
                </div>
              </div>
            </article>
          </Reveal>
        ))}
      </div>
    </section>
  )
}
