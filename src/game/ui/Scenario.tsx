import { useEffect, useMemo, useRef, useState } from 'react'
import { useGame, scenarioById } from '../state'
import type { Choice } from '../data/scenarios'

/* The decision panel: briefing → timed question → verdict → next. */

export default function ScenarioPanel() {
  const activeId = useGame((s) => s.activeId)
  const stepIndex = useGame((s) => s.stepIndex)
  const lastVerdict = useGame((s) => s.lastVerdict)
  const answer = useGame((s) => s.answer)
  const nextStep = useGame((s) => s.nextStep)
  const closeScenario = useGame((s) => s.closeScenario)

  const sc = scenarioById(activeId)
  // a scenario that paused and resumed elsewhere should pick up where it left off
  const [phase, setPhase] = useState<'brief' | 'ask'>(() => (stepIndex > 0 ? 'ask' : 'brief'))
  const [left, setLeft] = useState(0)
  const answered = useRef(false)

  const step = sc && stepIndex < sc.steps.length ? sc.steps[stepIndex] : null
  const finished = !!sc && stepIndex >= sc.steps.length

  // reset when a new scenario opens
  useEffect(() => {
    setPhase(useGame.getState().stepIndex > 0 ? 'ask' : 'brief')
  }, [activeId])

  // countdown
  useEffect(() => {
    if (phase !== 'ask' || !step?.seconds || lastVerdict) return
    answered.current = false
    setLeft(step.seconds)
    const id = setInterval(() => {
      setLeft((v) => {
        if (v <= 1) {
          clearInterval(id)
          if (!answered.current) {
            answered.current = true
            answer(step.choices[0], 0, true)
          }
          return 0
        }
        return v - 1
      })
    }, 1000)
    return () => clearInterval(id)
  }, [phase, step, lastVerdict, answer])

  const pick = (c: Choice) => {
    if (answered.current) return
    answered.current = true
    answer(c, left, false)
  }

  const scoreTone = useMemo(() => {
    if (!lastVerdict) return ''
    if (lastVerdict.score >= 3) return '#4ade80'
    if (lastVerdict.score >= 1) return '#f0b429'
    if (lastVerdict.score === 0) return '#9ca0a8'
    return '#f87171'
  }, [lastVerdict])

  if (!sc) return null

  return (
    <div className="fixed inset-0 z-40 flex items-end justify-center bg-gradient-to-t from-black/85 via-black/45 to-black/20 p-3 sm:items-center sm:p-6">
      <div
        className="w-full max-w-2xl overflow-hidden rounded-2xl border shadow-2xl"
        style={{
          borderColor: sc.accent + '55',
          background: 'rgba(10,12,16,0.94)',
          backdropFilter: 'blur(14px)',
          animation: 'g-rise 0.35s cubic-bezier(0.2,0.8,0.2,1)',
        }}
      >
        {/* header */}
        <div
          className="flex items-center justify-between gap-3 border-b px-5 py-3"
          style={{ borderColor: sc.accent + '33', background: sc.accent + '0f' }}
        >
          <div className="min-w-0">
            <div
              className="font-mono text-[0.6rem] uppercase tracking-[0.18em]"
              style={{ color: sc.accent }}
            >
              {sc.place}
            </div>
            <h2 className="mt-0.5 truncate text-[0.98rem] font-semibold text-[#fafaf9]">{sc.title}</h2>
          </div>
          <div className="shrink-0 text-right">
            <div className="font-mono text-[0.58rem] uppercase tracking-[0.14em] text-[#6b6f77]">
              Step
            </div>
            <div className="font-mono text-[0.8rem] text-[#fafaf9]">
              {Math.min(stepIndex + 1, sc.steps.length)}/{sc.steps.length}
            </div>
          </div>
        </div>

        <div className="max-h-[62vh] overflow-y-auto px-5 py-5 sm:px-7 sm:py-6">
          {/* ── mission brief ── */}
          {phase === 'brief' && (
            <div>
              <p className="text-[0.95rem] leading-relaxed text-[#d4d8de]">{sc.brief}</p>
              <div
                className="mt-5 rounded-lg border px-4 py-3"
                style={{ borderColor: '#23262b', background: '#0e0f11' }}
              >
                <div className="font-mono text-[0.58rem] uppercase tracking-[0.15em] text-[#6b6f77]">
                  Based on real work
                </div>
                <div className="mt-1 text-[0.8rem] text-[#9ca0a8]">{sc.basedOn}</div>
              </div>
              <button
                onClick={() => setPhase('ask')}
                className="mt-6 w-full rounded-full py-3 text-[0.88rem] font-semibold text-[#0a0c10] transition-transform active:scale-[0.98]"
                style={{ background: sc.accent }}
              >
                Begin
              </button>
            </div>
          )}

          {/* ── question ── */}
          {phase === 'ask' && step && !lastVerdict && (
            <div>
              <div className="flex items-start gap-3">
                <div
                  className="grid size-10 shrink-0 place-items-center rounded-full font-mono text-[0.75rem] font-semibold"
                  style={{ background: sc.accent + '22', color: sc.accent, border: `1px solid ${sc.accent}44` }}
                >
                  {step.speaker.slice(0, 2).toUpperCase()}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-baseline gap-x-2">
                    <span className="text-[0.85rem] font-semibold text-[#fafaf9]">{step.speaker}</span>
                    <span className="font-mono text-[0.6rem] uppercase tracking-[0.12em] text-[#6b6f77]">
                      {step.role}
                    </span>
                  </div>
                  <p className="mt-1.5 text-[0.95rem] leading-relaxed text-[#d4d8de]">"{step.line}"</p>
                </div>
              </div>

              <div className="mt-6 flex items-center justify-between gap-4">
                <p className="text-[0.9rem] font-medium text-[#fafaf9]">{step.question}</p>
                {step.seconds && (
                  <div className="shrink-0 text-right">
                    <div
                      className="font-mono text-[1.1rem] tabular-nums"
                      style={{ color: left <= 5 ? '#f87171' : '#fafaf9' }}
                    >
                      {String(left).padStart(2, '0')}s
                    </div>
                  </div>
                )}
              </div>

              {step.seconds && (
                <div className="mt-2 h-[3px] w-full overflow-hidden rounded-full bg-[#23262b]">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${(left / step.seconds) * 100}%`,
                      background: left <= 5 ? '#f87171' : sc.accent,
                      transition: 'width 1s linear',
                    }}
                  />
                </div>
              )}

              <div className="mt-5 space-y-2.5">
                {step.choices.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => pick(c)}
                    className="group w-full rounded-xl border px-4 py-3.5 text-left transition-colors"
                    style={{ borderColor: '#23262b', background: '#0e0f11' }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = sc.accent + '77'
                      e.currentTarget.style.background = '#15171a'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = '#23262b'
                      e.currentTarget.style.background = '#0e0f11'
                    }}
                  >
                    <div className="text-[0.88rem] font-medium text-[#fafaf9]">{c.label}</div>
                    {c.detail && (
                      <div className="mt-1 font-mono text-[0.66rem] text-[#6b6f77]">{c.detail}</div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ── verdict ── */}
          {lastVerdict && (
            <div>
              <div className="font-mono text-[0.6rem] uppercase tracking-[0.18em] text-[#6b6f77]">
                You chose
              </div>
              <div className="mt-1.5 text-[0.9rem] text-[#d4d8de]">{lastVerdict.label}</div>

              <div
                className="mt-5 rounded-xl border p-4"
                style={{ borderColor: scoreTone + '44', background: scoreTone + '0d' }}
              >
                <div className="flex items-center justify-between">
                  <span
                    className="font-mono text-[0.62rem] uppercase tracking-[0.16em]"
                    style={{ color: scoreTone }}
                  >
                    {lastVerdict.score >= 3
                      ? 'Best call'
                      : lastVerdict.score >= 1
                        ? 'Workable'
                        : lastVerdict.score === 0
                          ? 'Missed it'
                          : 'Costly'}
                  </span>
                  <span className="font-mono text-[0.8rem]" style={{ color: scoreTone }}>
                    {lastVerdict.score > 0 ? '+' : ''}
                    {lastVerdict.score}
                  </span>
                </div>
                <p className="mt-2.5 text-[0.88rem] leading-relaxed text-[#d4d8de]">
                  {lastVerdict.text}
                </p>
              </div>

              <button
                onClick={nextStep}
                className="mt-6 w-full rounded-full py-3 text-[0.88rem] font-semibold text-[#0a0c10] transition-transform active:scale-[0.98]"
                style={{ background: sc.accent }}
              >
                Continue
              </button>
            </div>
          )}

          {/* ── scenario closed ── */}
          {finished && !lastVerdict && (
            <div>
              <div
                className="font-mono text-[0.62rem] uppercase tracking-[0.18em]"
                style={{ color: sc.accent }}
              >
                Scenario complete
              </div>
              <p className="mt-3 text-[0.95rem] leading-relaxed text-[#d4d8de]">{sc.closer}</p>
              <button
                onClick={closeScenario}
                className="mt-6 w-full rounded-full py-3 text-[0.88rem] font-semibold text-[#0a0c10] transition-transform active:scale-[0.98]"
                style={{ background: sc.accent }}
              >
                Back to the city
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
