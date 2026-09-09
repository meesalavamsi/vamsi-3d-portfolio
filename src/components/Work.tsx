import { projects } from '../data/resume'
import ProjectVisual from './ProjectVisual'
import Reveal from './Reveal'
import SectionHeader from './SectionHeader'

export default function Work() {
  return (
    <section id="work" className="scroll-mt-24 py-24 md:py-32">
      <div className="shell">
        <SectionHeader
          index="03"
          label="Selected work"
          title="Four systems,"
          serifWord="four problems"
          intro="Each one started with something broken or manual. Here is the problem, what I built, and what it runs on."
        />

        <div className="mt-16 space-y-20 md:space-y-28">
          {projects.map((p, i) => {
            const flip = i % 2 === 1
            return (
              <article key={p.id} className="grid items-center gap-8 lg:grid-cols-12 lg:gap-14">
                {/* visual */}
                <Reveal
                  delay={60}
                  className={`lg:col-span-6 ${flip ? 'lg:order-2' : ''}`}
                >
                  <ProjectVisual kind={p.visual} accent={p.accent} />
                </Reveal>

                {/* copy */}
                <div className={`lg:col-span-6 ${flip ? 'lg:order-1' : ''}`}>
                  <Reveal>
                    <div className="flex items-center gap-4">
                      <span
                        className="t-display text-[2.6rem] leading-none"
                        style={{ color: p.accent, opacity: 0.9 }}
                      >
                        {p.num}
                      </span>
                      <span className="h-px flex-1 bg-[var(--color-line)]" aria-hidden />
                      <span className="t-mono text-[0.64rem] uppercase tracking-[0.15em] text-[var(--color-faint)]">
                        {p.tagline}
                      </span>
                    </div>
                  </Reveal>

                  <Reveal delay={70}>
                    <h3 className="t-display mt-5 text-[clamp(1.5rem,2.9vw,2.1rem)] leading-[1.1]">
                      {p.name}
                    </h3>
                  </Reveal>

                  <div className="mt-7 space-y-5">
                    <Reveal delay={130}>
                      <div>
                        <span className="t-eyebrow text-[var(--color-faint)]">The problem</span>
                        <p className="t-body mt-2 text-[0.98rem]">{p.problem}</p>
                      </div>
                    </Reveal>
                    <Reveal delay={190}>
                      <div>
                        <span className="t-eyebrow" style={{ color: p.accent }}>
                          What I built
                        </span>
                        <p className="t-body mt-2 text-[0.98rem]">{p.solution}</p>
                      </div>
                    </Reveal>
                  </div>

                  <Reveal delay={250}>
                    <ul className="mt-7 grid gap-x-6 gap-y-2.5 sm:grid-cols-2">
                      {p.features.map((f) => (
                        <li key={f} className="flex items-start gap-2.5 text-[0.85rem] text-[#c5c9d0]">
                          <svg viewBox="0 0 12 12" className="mt-[0.3rem] size-3 shrink-0" aria-hidden>
                            <path d="M2 6.4 L4.6 9 L10 3.2" fill="none" stroke={p.accent} strokeWidth="1.6" strokeLinecap="round" />
                          </svg>
                          {f}
                        </li>
                      ))}
                    </ul>
                  </Reveal>

                  <Reveal delay={310}>
                    <ul className="mt-8 flex flex-wrap gap-2 border-t border-[var(--color-line)] pt-6">
                      {p.tech.map((t) => (
                        <li key={t} className="chip">
                          {t}
                        </li>
                      ))}
                    </ul>
                  </Reveal>
                </div>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
