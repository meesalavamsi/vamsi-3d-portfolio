import { useMemo, useState } from 'react'
import { useGame } from '../state'
import { ranks, scenarios, totalBest } from '../data/scenarios'

const GOLD = '#f0b429'

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" style={{ background: '#08090a' }}>
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-[-14rem] h-[38rem] w-[64rem] -translate-x-1/2"
        style={{
          background:
            'radial-gradient(50% 50% at 50% 50%, rgba(240,180,41,0.14) 0%, transparent 70%)',
        }}
      />
      <div className="relative mx-auto flex min-h-full max-w-3xl flex-col justify-center px-6 py-14">
        {children}
      </div>
    </div>
  )
}

export function TitleScreen() {
  const begin = useGame((s) => s.begin)
  return (
    <Shell>
      <div style={{ animation: 'g-rise 0.6s cubic-bezier(0.2,0.8,0.2,1)' }}>
        <div className="font-mono text-[0.62rem] uppercase tracking-[0.24em]" style={{ color: GOLD }}>
          A playable case study
        </div>

        <h1
          className="mt-5 text-[clamp(2.4rem,8vw,4.6rem)] font-semibold leading-[0.95]"
          style={{ letterSpacing: '-0.04em', color: '#fafaf9' }}
        >
          The First
          <br />
          <span style={{ fontFamily: '"Instrument Serif", serif', fontStyle: 'italic', color: GOLD }}>
            90 Days
          </span>
        </h1>

        <p className="mt-7 max-w-xl text-[1.02rem] leading-relaxed text-[#9ca0a8]">
          You have just joined an enterprise platform team. A city block of work is waiting: a broken
          campus network, a request queue nobody can keep up with, an inverter quietly cooking itself,
          a phishing email at 4:52pm, and a pull request that will fall over in production.
        </p>

        <p className="mt-4 max-w-xl text-[0.95rem] leading-relaxed text-[#6b6f77]">
          Every scenario is a real problem Vamsi Meesala worked on. Your decisions are scored the way
          they would be at work — on judgement, and on how fast you make the call.
        </p>

        <div className="mt-9 flex flex-wrap items-center gap-3">
          <button
            onClick={begin}
            className="rounded-full px-7 py-3.5 text-[0.9rem] font-semibold text-[#0a0c10] transition-transform hover:scale-[1.02] active:scale-[0.98]"
            style={{ background: GOLD }}
          >
            Start your first day
          </button>
          <a
            href="/"
            className="rounded-full border px-6 py-3.5 text-[0.9rem] text-[#fafaf9] transition-colors hover:border-[#4a4f57]"
            style={{ borderColor: '#23262b' }}
          >
            Back to portfolio
          </a>
        </div>

        <div className="mt-12 grid gap-3 sm:grid-cols-5">
          {scenarios.map((s) => (
            <div
              key={s.id}
              className="rounded-lg border p-3"
              style={{ borderColor: '#23262b', background: '#0e0f11' }}
            >
              <div className="font-mono text-[0.55rem] uppercase tracking-[0.14em]" style={{ color: s.accent }}>
                0{s.order}
              </div>
              <div className="mt-1.5 text-[0.72rem] leading-tight text-[#d4d8de]">{s.place}</div>
            </div>
          ))}
        </div>
      </div>
    </Shell>
  )
}

export function BriefScreen() {
  const enterWorld = useGame((s) => s.enterWorld)
  const isTouch = typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches

  return (
    <Shell>
      <div style={{ animation: 'g-rise 0.5s cubic-bezier(0.2,0.8,0.2,1)' }}>
        <div className="font-mono text-[0.62rem] uppercase tracking-[0.24em]" style={{ color: GOLD }}>
          Orientation
        </div>
        <h2
          className="mt-4 text-[clamp(1.7rem,4.5vw,2.6rem)] font-semibold"
          style={{ letterSpacing: '-0.03em', color: '#fafaf9' }}
        >
          How this works
        </h2>

        <div className="mt-8 space-y-4">
          {[
            ['Walk the city', 'Six buildings, six real problems. Head for the glowing markers.'],
            ['Go inside', 'Press E at the doors. Every building has a real floor to walk around.'],
            ['Decide under pressure', 'Most questions run on a timer. Not answering costs you.'],
            ['Earn your review', 'Finish all six and you get a performance review with your rank.'],
          ].map(([t, d], i) => (
            <div key={t} className="flex gap-4">
              <span
                className="mt-0.5 grid size-7 shrink-0 place-items-center rounded-full font-mono text-[0.66rem]"
                style={{ background: GOLD + '1f', color: GOLD, border: `1px solid ${GOLD}44` }}
              >
                {i + 1}
              </span>
              <div>
                <div className="text-[0.92rem] font-medium text-[#fafaf9]">{t}</div>
                <div className="mt-0.5 text-[0.86rem] text-[#9ca0a8]">{d}</div>
              </div>
            </div>
          ))}
        </div>

        <div
          className="mt-9 rounded-xl border p-5"
          style={{ borderColor: '#23262b', background: '#0e0f11' }}
        >
          <div className="font-mono text-[0.58rem] uppercase tracking-[0.16em] text-[#6b6f77]">
            Controls
          </div>
          <div className="mt-3 grid gap-x-6 gap-y-2 sm:grid-cols-2">
            {(isTouch
              ? [
                  ['Left stick', 'Walk'],
                  ['Drag right side', 'Look around'],
                  ['ENTER button', 'Go inside'],
                  ['Push the stick', 'Run'],
                ]
              : [
                  ['W A S D', 'Walk'],
                  ['Mouse drag', 'Look around'],
                  ['Shift', 'Run'],
                  ['E', 'Go inside'],
                ]
            ).map(([k, v]) => (
              <div key={k} className="flex items-center justify-between gap-3">
                <kbd
                  className="rounded border px-2 py-1 font-mono text-[0.66rem] text-[#d4d8de]"
                  style={{ borderColor: '#2c3037', background: '#15171a' }}
                >
                  {k}
                </kbd>
                <span className="text-[0.82rem] text-[#9ca0a8]">{v}</span>
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={enterWorld}
          className="mt-8 w-full rounded-full py-4 text-[0.92rem] font-semibold text-[#0a0c10] transition-transform hover:scale-[1.01] active:scale-[0.99] sm:w-auto sm:px-10"
          style={{ background: GOLD }}
        >
          Clock in →
        </button>
      </div>
    </Shell>
  )
}

export function ReportScreen() {
  const answers = useGame((s) => s.answers)
  const score = useGame((s) => s.score)
  const started = useGame((s) => s.started)
  const finished = useGame((s) => s.finished)
  const restart = useGame((s) => s.restart)
  const [copied, setCopied] = useState(false)

  const pct = Math.max(0, Math.min(1, score / totalBest))
  const rank = useMemo(() => [...ranks].reverse().find((r) => pct >= r.min) ?? ranks[0], [pct])
  const mins = started && finished ? Math.max(1, Math.round((finished - started) / 60000)) : null
  const bestCalls = answers.filter((a) => a.best).length
  const timeouts = answers.filter((a) => a.timedOut).length

  const share = async () => {
    const text = `I ran "The First 90 Days" — the engineering simulator inside Vamsi Meesala's portfolio. Final rank: ${rank.title} (${score}/${totalBest}). Try it:`
    const url = typeof window !== 'undefined' ? window.location.href : ''
    try {
      if (navigator.share) await navigator.share({ title: 'The First 90 Days', text, url })
      else {
        await navigator.clipboard.writeText(`${text} ${url}`)
        setCopied(true)
        setTimeout(() => setCopied(false), 1800)
      }
    } catch {
      /* dismissed */
    }
  }

  const byScenario = scenarios.map((s) => {
    const mine = answers.filter((a) => a.scenarioId === s.id)
    const got = mine.reduce((a, b) => a + b.score, 0)
    const max = s.steps.reduce((a, st) => a + Math.max(...st.choices.map((c) => c.score)), 0)
    return { s, got, max }
  })

  return (
    <Shell>
      <div style={{ animation: 'g-rise 0.6s cubic-bezier(0.2,0.8,0.2,1)' }}>
        <div className="font-mono text-[0.62rem] uppercase tracking-[0.24em]" style={{ color: GOLD }}>
          Performance review
        </div>

        <h2
          className="mt-4 text-[clamp(2rem,6vw,3.4rem)] font-semibold leading-[1]"
          style={{ letterSpacing: '-0.035em', color: '#fafaf9' }}
        >
          You finished as
          <br />
          <span style={{ fontFamily: '"Instrument Serif", serif', fontStyle: 'italic', color: GOLD }}>
            {rank.title}
          </span>
        </h2>

        <p className="mt-5 max-w-xl text-[1rem] leading-relaxed text-[#9ca0a8]">{rank.note}</p>

        {/* score bar */}
        <div className="mt-8">
          <div className="flex items-baseline justify-between">
            <span className="font-mono text-[0.6rem] uppercase tracking-[0.16em] text-[#6b6f77]">
              Judgement score
            </span>
            <span className="font-mono text-[0.85rem] text-[#fafaf9]">
              {score} <span className="text-[#6b6f77]">/ {totalBest}</span>
            </span>
          </div>
          <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-[#23262b]">
            <div
              className="h-full rounded-full"
              style={{ width: `${pct * 100}%`, background: GOLD, transition: 'width 1.2s cubic-bezier(0.2,0.8,0.2,1)' }}
            />
          </div>
        </div>

        {/* stats */}
        <div className="mt-6 grid grid-cols-3 gap-3">
          {[
            [String(bestCalls), 'Best calls'],
            [String(timeouts), 'Ran out of time'],
            [mins ? `${mins}m` : '—', 'On the clock'],
          ].map(([v, l]) => (
            <div
              key={l}
              className="rounded-xl border p-4"
              style={{ borderColor: '#23262b', background: '#0e0f11' }}
            >
              <div className="text-[1.5rem] font-semibold text-[#fafaf9]">{v}</div>
              <div className="mt-1 font-mono text-[0.58rem] uppercase tracking-[0.12em] text-[#6b6f77]">
                {l}
              </div>
            </div>
          ))}
        </div>

        {/* per scenario */}
        <div className="mt-8 space-y-2">
          {byScenario.map(({ s, got, max }) => (
            <div
              key={s.id}
              className="flex items-center gap-4 rounded-lg border px-4 py-3"
              style={{ borderColor: '#23262b', background: '#0e0f11' }}
            >
              <span className="font-mono text-[0.62rem]" style={{ color: s.accent }}>
                0{s.order}
              </span>
              <span className="min-w-0 flex-1 truncate text-[0.85rem] text-[#d4d8de]">{s.title}</span>
              <span className="font-mono text-[0.72rem] text-[#9ca0a8]">
                {got}/{max}
              </span>
              <span className="h-1 w-16 overflow-hidden rounded-full bg-[#23262b]">
                <span
                  className="block h-full rounded-full"
                  style={{ width: `${Math.max(0, (got / max) * 100)}%`, background: s.accent }}
                />
              </span>
            </div>
          ))}
        </div>

        <div className="mt-10 flex flex-wrap gap-3">
          <button
            onClick={share}
            className="rounded-full px-6 py-3.5 text-[0.88rem] font-semibold text-[#0a0c10]"
            style={{ background: GOLD }}
          >
            {copied ? 'Link copied ✓' : 'Share your result'}
          </button>
          <button
            onClick={restart}
            className="rounded-full border px-6 py-3.5 text-[0.88rem] text-[#fafaf9]"
            style={{ borderColor: '#23262b' }}
          >
            Play again
          </button>
          <a
            href="/"
            className="rounded-full border px-6 py-3.5 text-[0.88rem] text-[#fafaf9]"
            style={{ borderColor: '#23262b' }}
          >
            Meet the engineer →
          </a>
        </div>

        <p className="mt-10 text-[0.82rem] leading-relaxed text-[#6b6f77]">
          Every scenario here came from real work: ServiceNow workflow automation handling 500+ monthly
          requests, a university ITSM implementation, an IoT inverter dashboard, security awareness
          training, and production GlideRecord optimisation.
        </p>
      </div>
    </Shell>
  )
}
