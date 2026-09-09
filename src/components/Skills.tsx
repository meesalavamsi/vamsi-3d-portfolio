import { skillGroups } from '../data/resume'
import Reveal from './Reveal'
import SectionHeader from './SectionHeader'

export default function Skills() {
  return (
    <section id="skills" className="scroll-mt-24 py-24 md:py-32">
      <div className="shell">
        <SectionHeader
          index="04"
          label="Capabilities"
          title="The full"
          serifWord="toolkit"
          intro="Organised the way I actually use it — language, foundation, product, platform and practice."
        />

        <div className="mt-14 grid gap-px overflow-hidden rounded-xl border border-[var(--color-line)] bg-[var(--color-line)] sm:grid-cols-2 lg:grid-cols-3">
          {skillGroups.map((g, i) => (
            <div
              key={g.id}
              className="group h-full bg-[var(--color-ink-2)] p-6 transition-colors hover:bg-[var(--color-ink-3)] md:p-7"
            >
              <Reveal delay={i * 60}>
                <div className="flex items-baseline justify-between gap-3">
                  <h3 className="text-[1rem] font-medium tracking-tight">{g.title}</h3>
                  <span className="t-mono text-[0.65rem] text-[var(--color-faint)]">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                </div>

                <p className="t-mono mt-1.5 text-[0.66rem] text-[var(--color-faint)]">{g.caption}</p>

                <span
                  className="mt-4 block h-px w-8 bg-[var(--color-gold)] transition-all duration-500 group-hover:w-16"
                  aria-hidden
                />

                <ul className="mt-5 flex flex-wrap gap-2">
                  {g.skills.map((s) => (
                    <li key={s} className="chip">
                      {s}
                    </li>
                  ))}
                </ul>
              </Reveal>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
