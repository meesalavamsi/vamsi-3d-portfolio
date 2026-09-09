import { experience } from '../data/resume'
import Reveal from './Reveal'
import SectionHeader from './SectionHeader'

export default function Experience() {
  return (
    <section id="experience" className="scroll-mt-24 py-24 md:py-32">
      <div className="shell">
        <SectionHeader
          index="02"
          label="Experience"
          title="Where the theory met"
          serifWord="production"
          intro="Two roles on the same enterprise platform team — first building automation, then making it faster and more reliable."
        />

        <ol className="mt-14 space-y-4">
          {experience.map((job, i) => (
            <Reveal key={job.id} delay={i * 90} as="li">
              <article className="card p-6 md:p-9">
                <div className="grid gap-7 md:grid-cols-12 md:gap-8">
                  {/* meta rail */}
                  <div className="md:col-span-4">
                    <div className="flex items-center gap-3">
                      <span className="t-mono text-[0.7rem] text-[var(--color-gold)]">{job.num}</span>
                      {job.current && (
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-[rgba(74,222,128,0.3)] bg-[rgba(74,222,128,0.07)] px-2.5 py-0.5">
                          <span className="pulse-dot size-1.5 rounded-full bg-[var(--color-mint)]" />
                          <span className="t-mono text-[0.6rem] uppercase tracking-[0.12em] text-[var(--color-mint)]">
                            Current
                          </span>
                        </span>
                      )}
                    </div>

                    <h3 className="t-display mt-4 text-[clamp(1.25rem,2.1vw,1.6rem)] leading-tight">
                      {job.role}
                    </h3>

                    <div className="mt-3 space-y-1">
                      <p className="text-[0.88rem] font-medium text-[var(--color-paper)]">{job.org}</p>
                      <p className="t-mono text-[0.68rem] text-[var(--color-faint)]">{job.period}</p>
                    </div>

                    {'metrics' in job && job.metrics && (
                      <div className="mt-6 flex gap-6">
                        {job.metrics.map((m) => (
                          <div key={m.label}>
                            <div className="t-display text-[1.6rem] text-[var(--color-gold)]">{m.value}</div>
                            <div className="t-mono mt-0.5 text-[0.63rem] text-[var(--color-faint)]">{m.label}</div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* detail */}
                  <div className="md:col-span-8 md:border-l md:border-[var(--color-line)] md:pl-8">
                    <p className="t-body text-[1rem]">{job.summary}</p>

                    <ul className="mt-6 space-y-3">
                      {job.bullets.map((b) => (
                        <li key={b} className="flex gap-3 text-[0.9rem] leading-relaxed text-[#c5c9d0]">
                          <span
                            className="mt-[0.55rem] size-1 shrink-0 rounded-full bg-[var(--color-gold)]"
                            aria-hidden
                          />
                          {b}
                        </li>
                      ))}
                    </ul>

                    <ul className="mt-7 flex flex-wrap gap-2">
                      {job.tech.map((t) => (
                        <li key={t} className="chip">
                          {t}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </article>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  )
}
