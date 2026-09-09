import { Suspense, lazy } from 'react'
import { ArrowDownRight, ArrowUpRight, Mail } from 'lucide-react'
import { identity, stats } from '../data/resume'
import { useCounter, useInView, useMediaQuery } from '../lib/hooks'
import Reveal from './Reveal'

const Sculpture = lazy(() => import('../three/Sculpture'))

function Stat({
  value, suffix, label, note, decimals = 0, delay,
}: {
  value: number; suffix: string; label: string; note: string; decimals?: number; delay: number
}) {
  const { ref, seen } = useInView<HTMLDivElement>('0px')
  const n = useCounter(value, seen, 1500, decimals)

  return (
    <div ref={ref} className="px-5 py-6 md:px-7 md:py-7" style={{
      opacity: seen ? 1 : 0,
      transform: seen ? 'none' : 'translateY(10px)',
      transition: `all 0.6s cubic-bezier(0.2,0.8,0.2,1) ${delay}ms`,
    }}>
      <div className="t-display text-[clamp(1.9rem,3.4vw,2.6rem)] tabular-nums">
        {decimals ? n.toFixed(decimals) : Math.round(n)}
        <span className="text-[var(--color-gold)]">{suffix}</span>
      </div>
      <div className="mt-2 text-[0.82rem] font-medium leading-snug">{label}</div>
      <div className="t-mono mt-1 text-[0.66rem] text-[var(--color-faint)]">{note}</div>
    </div>
  )
}

export default function Hero({ onResume }: { onResume: () => void }) {
  const wide = useMediaQuery('(min-width: 768px)')
  const noMotion = useMediaQuery('(prefers-reduced-motion: reduce)')

  return (
    <section id="top" className="relative overflow-hidden pt-[7.5rem] md:pt-[9rem]">
      {/* ambient light */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-[-12rem] h-[34rem] w-[62rem] -translate-x-1/2 opacity-[0.5]"
        style={{
          background:
            'radial-gradient(50% 50% at 50% 50%, rgba(240,180,41,0.13) 0%, rgba(240,180,41,0.04) 42%, transparent 72%)',
        }}
      />

      <div className="shell relative">
        <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-8">
          {/* ── copy ─────────────────────────────── */}
          <div className="lg:col-span-7">
            <Reveal>
              <div className="inline-flex items-center gap-2.5 rounded-full border border-[var(--color-line)] bg-[var(--color-ink-2)] py-1.5 pl-2.5 pr-4">
                <span className="relative grid size-4 place-items-center">
                  <span className="pulse-dot absolute size-2 rounded-full bg-[var(--color-mint)]" />
                  <span className="absolute size-4 rounded-full bg-[var(--color-mint)] opacity-20" />
                </span>
                <span className="t-mono text-[0.68rem] text-[#c9cdd4]">{identity.availability}</span>
              </div>
            </Reveal>

            <h1 className="mt-7">
              <Reveal delay={60}>
                <span className="t-display block text-[clamp(3.1rem,10.5vw,7.5rem)]">
                  {identity.first}
                </span>
              </Reveal>
              <Reveal delay={130}>
                <span className="t-serif block text-[clamp(3.1rem,10.5vw,7.5rem)] italic leading-[0.95] text-[var(--color-gold)]">
                  {identity.last}
                </span>
              </Reveal>
            </h1>

            <Reveal delay={200}>
              <div className="mt-7 flex flex-col gap-1.5 sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-3">
                <span className="t-mono text-[0.64rem] uppercase tracking-[0.14em] text-[#d4d8de] sm:text-[0.72rem] sm:tracking-[0.16em]">
                  {identity.role}
                </span>
                <span className="hidden h-px w-6 bg-[var(--color-line)] sm:block" aria-hidden />
                <span className="t-mono text-[0.64rem] uppercase tracking-[0.14em] text-[var(--color-faint)] sm:text-[0.72rem] sm:tracking-[0.16em]">
                  {identity.headline}
                </span>
              </div>
            </Reveal>

            <Reveal delay={260}>
              <p className="t-body mt-6 max-w-xl">{identity.pitch}</p>
            </Reveal>

            <Reveal delay={330}>
              <div className="mt-9 flex flex-wrap items-center gap-3">
                <a href="#work" className="btn btn-gold">
                  See my work
                  <ArrowDownRight size={16} />
                </a>
                <button onClick={onResume} className="btn btn-ghost">
                  Traditional resume
                </button>
                <a
                  href={`mailto:${identity.email}`}
                  className="btn btn-ghost"
                  aria-label={`Email ${identity.email}`}
                >
                  <Mail size={15} />
                  Get in touch
                </a>
              </div>
            </Reveal>
          </div>

          {/* ── sculpture ─────────────────────────── */}
          <div className="relative lg:col-span-5">
            <div className="relative mx-auto aspect-square w-full max-w-[26rem]">
              {!noMotion && (
                <Suspense fallback={null}>
                  <Sculpture dense={wide} />
                </Suspense>
              )}
              {/* corner frame */}
              <div aria-hidden className="pointer-events-none absolute inset-0">
                {[
                  'left-0 top-0 border-l border-t',
                  'right-0 top-0 border-r border-t',
                  'left-0 bottom-0 border-l border-b',
                  'right-0 bottom-0 border-r border-b',
                ].map((c) => (
                  <span key={c} className={`absolute size-5 border-[var(--color-line)] ${c}`} />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── stat strip ─────────────────────────── */}
        <div className="mt-16 md:mt-20">
          <div className="rule" />
          <dl className="grid grid-cols-2 divide-[var(--color-line)] md:grid-cols-4 md:divide-x">
            {stats.map((s, i) => (
              <Stat key={s.label} {...s} delay={i * 90} />
            ))}
          </dl>
          <div className="rule" />
        </div>

        {/* scroll cue */}
        <div className="flex items-center justify-center gap-2 py-6 md:py-8">
          <span className="t-mono text-[0.64rem] text-[var(--color-faint)]">SCROLL</span>
          <ArrowUpRight size={12} className="rotate-135 text-[var(--color-faint)]" />
        </div>
      </div>
    </section>
  )
}
