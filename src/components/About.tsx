import { GraduationCap } from 'lucide-react'
import { about, education } from '../data/resume'
import Reveal from './Reveal'
import SectionHeader from './SectionHeader'
import { useCounter, useInView } from '../lib/hooks'

function CgpaMeter() {
  const { ref, seen } = useInView<HTMLDivElement>('0px')
  const v = useCounter(education.cgpaValue, seen, 1500, 2)
  const pct = (v / 10) * 100

  return (
    <div ref={ref}>
      <div className="flex items-baseline justify-between">
        <span className="t-eyebrow text-[var(--color-faint)]">CGPA</span>
        <span className="t-display text-2xl tabular-nums">
          {v.toFixed(2)}
          <span className="text-sm text-[var(--color-faint)]"> / 10.0</span>
        </span>
      </div>
      <div className="mt-3 h-1 w-full overflow-hidden rounded-full bg-[var(--color-line)]">
        <div
          className="h-full rounded-full bg-[var(--color-gold)]"
          style={{ width: `${pct}%`, transition: 'width 1.5s cubic-bezier(0.2,0.8,0.2,1)' }}
        />
      </div>
    </div>
  )
}

function Terminal() {
  const { ref, seen } = useInView<HTMLDivElement>('0px')

  return (
    <div ref={ref} className="card overflow-hidden">
      <div className="flex items-center gap-2 border-b border-[var(--color-line)] px-4 py-3">
        <span className="size-2.5 rounded-full bg-[#ff5f57]" />
        <span className="size-2.5 rounded-full bg-[#febc2e]" />
        <span className="size-2.5 rounded-full bg-[#28c840]" />
        <span className="t-mono ml-2 text-[0.66rem] text-[var(--color-faint)]">vamsi@systems — zsh</span>
      </div>

      <div className="space-y-3 p-4 font-mono text-[0.76rem] leading-relaxed">
        {about.terminal.map((line, i) => (
          <div
            key={line.cmd}
            style={{
              opacity: seen ? 1 : 0,
              transform: seen ? 'none' : 'translateY(6px)',
              transition: `all 0.45s ease ${300 + i * 320}ms`,
            }}
          >
            <div className="flex gap-2">
              <span className="text-[var(--color-mint)]">$</span>
              <span className="text-[var(--color-paper)]">{line.cmd}</span>
            </div>
            {line.out.map((o) => (
              <div key={o} className="pl-4 text-[var(--color-muted)]">
                {o}
              </div>
            ))}
          </div>
        ))}
        <div
          className="flex gap-2"
          style={{ opacity: seen ? 1 : 0, transition: 'opacity 0.4s ease 1.5s' }}
        >
          <span className="text-[var(--color-mint)]">$</span>
          <span className="inline-block h-4 w-2 animate-pulse bg-[var(--color-gold)]" />
        </div>
      </div>
    </div>
  )
}

export default function About() {
  return (
    <section id="about" className="scroll-mt-24 py-24 md:py-32">
      <div className="shell">
        <SectionHeader
          index="01"
          label="About"
          title="The layer most people"
          serifWord="never see"
        />

        <div className="mt-14 grid gap-12 lg:grid-cols-12 lg:gap-14">
          {/* narrative */}
          <div className="lg:col-span-7">
            <Reveal>
              <p className="t-display text-[clamp(1.35rem,2.4vw,1.85rem)] leading-[1.42] text-[var(--color-paper)]">
                {about.lead}
              </p>
            </Reveal>

            <div className="mt-8 space-y-5">
              {about.body.map((p, i) => (
                <Reveal key={i} delay={80 + i * 80}>
                  <p className="t-body">{p}</p>
                </Reveal>
              ))}
            </div>

            <Reveal delay={240}>
              <ul className="mt-9 flex flex-wrap gap-2">
                {about.traits.map((t) => (
                  <li key={t} className="chip">
                    {t}
                  </li>
                ))}
              </ul>
            </Reveal>

            <Reveal delay={300}>
              <div className="mt-10">
                <Terminal />
              </div>
            </Reveal>
          </div>

          {/* facts rail */}
          <aside className="lg:col-span-5">
            <Reveal delay={120}>
              <div className="card p-6 md:p-7">
                <span className="t-eyebrow text-[var(--color-faint)]">At a glance</span>
                <dl className="mt-5 space-y-4">
                  {about.facts.map((f) => (
                    <div key={f.k} className="border-b border-[var(--color-line)] pb-4 last:border-0 last:pb-0">
                      <dt className="t-mono text-[0.65rem] uppercase tracking-[0.14em] text-[var(--color-faint)]">
                        {f.k}
                      </dt>
                      <dd className="mt-1.5 text-[0.9rem] leading-snug">{f.v}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </Reveal>

            <Reveal delay={200}>
              <div className="card mt-4 p-6 md:p-7">
                <div className="flex items-start gap-3">
                  <span className="mt-0.5 grid size-9 shrink-0 place-items-center rounded-lg border border-[var(--color-line)] bg-[var(--color-ink-3)] text-[var(--color-gold)]">
                    <GraduationCap size={17} />
                  </span>
                  <div className="min-w-0">
                    <h3 className="text-[0.95rem] font-medium leading-snug">{education.institution}</h3>
                    <p className="mt-1 text-[0.82rem] text-[var(--color-muted)]">{education.degree}</p>
                    <p className="t-mono mt-1.5 text-[0.68rem] text-[var(--color-faint)]">{education.period}</p>
                  </div>
                </div>

                <div className="mt-6">
                  <CgpaMeter />
                </div>

                <div className="mt-6">
                  <span className="t-eyebrow text-[var(--color-faint)]">Core coursework</span>
                  <ul className="mt-3 flex flex-wrap gap-2">
                    {education.coursework.map((c) => (
                      <li key={c} className="chip">
                        {c}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </Reveal>
          </aside>
        </div>
      </div>
    </section>
  )
}
