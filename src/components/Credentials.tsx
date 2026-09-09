import { BadgeCheck } from 'lucide-react'
import { certifications, coding } from '../data/resume'
import Reveal from './Reveal'
import SectionHeader from './SectionHeader'
import { useInView } from '../lib/hooks'

function Bars() {
  const { ref, seen } = useInView<HTMLDivElement>('0px')
  return (
    <div ref={ref} className="space-y-5">
      {coding.bars.map((b, i) => (
        <div key={b.label}>
          <div className="flex items-baseline justify-between">
            <span className="text-[0.84rem] text-[#c5c9d0]">{b.label}</span>
            <span className="t-mono text-[0.68rem] tabular-nums text-[var(--color-faint)]">{b.value}</span>
          </div>
          <div className="mt-2 h-[3px] w-full overflow-hidden rounded-full bg-[var(--color-line)]">
            <div
              className="h-full rounded-full bg-[var(--color-gold)]"
              style={{
                width: seen ? `${b.value}%` : '0%',
                transition: `width 1.2s cubic-bezier(0.2,0.8,0.2,1) ${i * 120}ms`,
              }}
            />
          </div>
        </div>
      ))}
    </div>
  )
}

export default function Credentials() {
  return (
    <section id="credentials" className="scroll-mt-24 py-24 md:py-32">
      <div className="shell">
        <SectionHeader
          index="05"
          label="Credentials"
          title="Verified, not"
          serifWord="self-declared"
          intro="Four industry certifications from Red Hat, ServiceNow and Oracle — plus continuous algorithm practice."
        />

        <div className="mt-14 grid gap-4 sm:grid-cols-2">
          {certifications.map((c, i) => (
            <Reveal key={c.short} delay={i * 70}>
              <div className="card group flex h-full items-start gap-5 p-6 md:p-7">
                <div
                  className="grid size-14 shrink-0 place-items-center rounded-xl border font-mono text-[0.7rem] font-medium transition-transform duration-500 group-hover:scale-105"
                  style={{
                    borderColor: `${c.color}44`,
                    background: `${c.color}12`,
                    color: c.color,
                  }}
                >
                  {c.short}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="t-mono text-[0.64rem] uppercase tracking-[0.15em] text-[var(--color-faint)]">
                      {c.issuer}
                    </span>
                    <BadgeCheck size={13} style={{ color: c.color }} />
                  </div>
                  <h3 className="mt-1.5 text-[0.95rem] font-medium leading-snug">{c.name}</h3>
                  <p className="mt-1.5 text-[0.8rem] leading-relaxed text-[var(--color-muted)]">{c.detail}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        {/* problem solving */}
        <div className="mt-4 grid gap-4 lg:grid-cols-12">
          <Reveal delay={80} className="lg:col-span-7">
            <div className="card h-full p-6 md:p-8">
              <span className="t-eyebrow text-[var(--color-faint)]">Problem solving</span>
              <p className="t-body mt-4 text-[0.98rem]">{coding.intro}</p>

              <ul className="mt-7 grid gap-3 sm:grid-cols-3">
                {coding.platforms.map((p) => (
                  <li key={p.name} className="rounded-lg border border-[var(--color-line)] bg-[var(--color-ink-3)] p-4">
                    <div className="text-[0.88rem] font-medium">{p.name}</div>
                    <div className="t-mono mt-1 text-[0.62rem] leading-relaxed text-[var(--color-faint)]">
                      {p.focus}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>

          <Reveal delay={140} className="lg:col-span-5">
            <div className="card h-full p-6 md:p-8">
              <span className="t-eyebrow text-[var(--color-faint)]">Engineering strengths</span>
              <div className="mt-6">
                <Bars />
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
