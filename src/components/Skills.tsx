import Reveal, { SectionHead } from './Reveal'
import { skillGroups } from '../data/resume'

export default function Skills() {
  return (
    <section id="skills" className="max-w-6xl mx-auto px-6 py-24 md:py-32">
      <SectionHead index="04" label="Capabilities" title="What I work with." />
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {skillGroups.map((g, i) => (
          <Reveal key={g.id} delay={i * 0.06}>
            <div className="card p-6 h-full">
              <div className="flex items-center gap-3 mb-5">
                <span className="text-xl">{g.icon}</span>
                <h3 className="font-bold text-white tracking-wide text-sm">{g.title.toUpperCase()}</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {g.skills.map((s) => <span key={s} className="chip">{s}</span>)}
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  )
}
