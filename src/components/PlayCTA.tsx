import { ArrowUpRight, Gamepad2 } from 'lucide-react'
import Reveal from './Reveal'

/**
 * The one invitation to the playable side of this site. Deliberately a single
 * band so it reads as a detour, not a competing section.
 */
export default function PlayCTA() {
  const facts = ['6 scenarios', 'Walk-in buildings', '~8 minutes', 'No sign-up']

  return (
    <section aria-labelledby="play-title" className="no-print py-14 md:py-20">
      <div className="shell">
        <Reveal>
          <a
            href="/game"
            className="group relative block overflow-hidden rounded-2xl border border-[var(--color-line)] bg-[var(--color-ink-2)] transition-colors duration-300 hover:border-[#3a3f47]"
          >
            <span
              aria-hidden
              className="pointer-events-none absolute -right-32 -top-40 size-[30rem] opacity-90 transition-opacity duration-500 group-hover:opacity-100"
              style={{
                background:
                  'radial-gradient(50% 50% at 50% 50%, rgba(240,180,41,0.15) 0%, transparent 70%)',
              }}
            />
            <span
              aria-hidden
              className="pointer-events-none absolute inset-0"
              style={{
                backgroundImage: 'radial-gradient(rgba(255,255,255,0.055) 1px, transparent 1px)',
                backgroundSize: '22px 22px',
                maskImage: 'linear-gradient(to right, rgba(0,0,0,0.9), transparent 68%)',
                WebkitMaskImage: 'linear-gradient(to right, rgba(0,0,0,0.9), transparent 68%)',
              }}
            />

            <div className="relative flex flex-col gap-8 p-7 md:flex-row md:items-end md:justify-between md:p-10">
              <div className="max-w-2xl">
                <span className="t-eyebrow inline-flex items-center gap-2 text-[var(--color-gold)]">
                  <Gamepad2 size={13} />
                  Interactive
                </span>

                <h3
                  id="play-title"
                  className="t-display mt-4 text-[clamp(1.65rem,3.6vw,2.5rem)] leading-[1.05]"
                >
                  Or skip the reading and{' '}
                  <span className="t-serif italic text-[var(--color-gold)]">play the job</span>
                </h3>

                <p className="t-body mt-4 max-w-xl text-[0.95rem]">
                  <span className="text-[var(--color-paper)]">The First 90 Days</span> is a small 3D
                  game I built into this site. You walk a city as a new engineer and make the same
                  calls I made at work — incident or problem, which SLA breach to touch first, an
                  inverter that keeps dropping out, a 4:52pm email that isn't what it looks like.
                  It scores your judgement at the end.
                </p>

                <ul className="t-mono mt-6 flex flex-wrap items-center gap-x-3 gap-y-2 text-[0.64rem] text-[var(--color-faint)]">
                  {facts.map((f, i) => (
                    <li key={f} className="flex items-center gap-3">
                      {i > 0 && <span aria-hidden className="text-[var(--color-line)]">/</span>}
                      {f}
                    </li>
                  ))}
                </ul>
              </div>

              <span className="btn btn-gold h-11 shrink-0 px-6 text-[0.85rem]">
                Play the simulator
                <ArrowUpRight
                  size={15}
                  className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                />
              </span>
            </div>
          </a>
        </Reveal>
      </div>
    </section>
  )
}
