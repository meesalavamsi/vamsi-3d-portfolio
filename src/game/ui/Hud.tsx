import { useMemo } from 'react'
import { useGame } from '../state'
import { zones } from '../data/zones'
import { interiors } from '../data/interiors'
import { scenarios } from '../data/scenarios'

/* Minimal in-world HUD: objectives, progress, minimap, prompt. */

export function Objectives() {
  const completed = useGame((s) => s.completed)
  return (
    <div className="pointer-events-none fixed right-3 top-3 z-30 w-[7.9rem] sm:right-4 sm:top-4 sm:w-[13.5rem]">
      <div
        className="rounded-xl border px-3.5 py-3"
        style={{ borderColor: '#ffffff1a', background: 'rgba(8,10,14,0.62)', backdropFilter: 'blur(10px)' }}
      >
        <div className="flex items-center justify-between">
          <span className="font-mono text-[0.58rem] uppercase tracking-[0.18em] text-[#9ca0a8]">
            Objectives
          </span>
          <span className="font-mono text-[0.6rem] text-[#f0b429]">
            {completed.length}/{zones.length}
          </span>
        </div>
        <div className="mt-2.5 h-[2px] w-full overflow-hidden rounded-full bg-[#ffffff14]">
          <div
            className="h-full rounded-full bg-[#f0b429]"
            style={{ width: `${(completed.length / zones.length) * 100}%`, transition: 'width 0.6s' }}
          />
        </div>
        {/* the full checklist needs room — phones get the counter and bar */}
        <ul className="mt-3 hidden space-y-1.5 sm:block">
          {zones.map((z) => {
            const done = completed.includes(z.id)
            return (
              <li key={z.id} className="flex items-start gap-2">
                <span
                  className="mt-[0.28rem] size-1.5 shrink-0 rounded-full"
                  style={{ background: done ? '#4ade80' : z.color, opacity: done ? 1 : 0.55 }}
                />
                <span
                  className="font-mono text-[0.6rem] leading-tight"
                  style={{
                    color: done ? '#6b6f77' : '#d4d8de',
                    textDecoration: done ? 'line-through' : 'none',
                  }}
                >
                  {z.sub}
                </span>
              </li>
            )
          })}
        </ul>
      </div>
    </div>
  )
}

export function MiniMap() {
  const pos = useGame((s) => s.playerPos)
  const completed = useGame((s) => s.completed)
  const S = 116
  const scale = S / 150 // world span → px

  const toMap = (x: number, z: number) => ({
    left: S / 2 + x * scale,
    top: S / 2 + z * scale,
  })

  return (
    <div
      className="pointer-events-none fixed bottom-3 right-3 z-30 hidden sm:block"
      style={{ width: S, height: S }}
    >
      <div
        className="relative size-full overflow-hidden rounded-xl border"
        style={{ borderColor: '#ffffff1a', background: 'rgba(8,10,14,0.66)', backdropFilter: 'blur(10px)' }}
      >
        {/* roads */}
        <div className="absolute left-0 right-0" style={{ top: toMap(0, -19).top, height: 3, background: '#ffffff14' }} />
        <div className="absolute bottom-0 top-0" style={{ left: toMap(30, 0).left, width: 3, background: '#ffffff14' }} />
        {/* plaza */}
        <div
          className="absolute rounded-full border"
          style={{
            left: toMap(0, 2).left - 10,
            top: toMap(0, 2).top - 10,
            width: 20,
            height: 20,
            borderColor: '#ffffff22',
          }}
        />
        {zones.map((z) => {
          const p = toMap(z.door[0], z.door[1])
          const done = completed.includes(z.id)
          return (
            <span
              key={z.id}
              className="absolute rounded-full"
              style={{
                left: p.left - 3,
                top: p.top - 3,
                width: 6,
                height: 6,
                background: done ? '#4ade80' : z.color,
                boxShadow: `0 0 7px ${done ? '#4ade80' : z.color}`,
              }}
            />
          )
        })}
        {/* player */}
        <span
          className="absolute rounded-full border-2"
          style={{
            left: toMap(pos[0], pos[2]).left - 4,
            top: toMap(pos[0], pos[2]).top - 4,
            width: 8,
            height: 8,
            borderColor: '#fafaf9',
            background: '#f0b429',
            transition: 'left 0.13s linear, top 0.13s linear',
          }}
        />
      </div>
    </div>
  )
}

export function Prompt({ near, onInteract }: { near: string | null; onInteract: () => void }) {
  const completed = useGame((s) => s.completed)
  const inside = useGame((s) => s.inside)
  const pending = useGame((s) => s.pending)

  let color = '#f0b429'
  let label = ''
  let title = ''
  let disabled = false
  let hint: string | null = 'Press E · or tap here'

  if (!near) return null

  if (!inside) {
    const zone = zones.find((z) => z.id === near)
    if (!zone) return null
    const done = completed.includes(zone.id)
    const scen = scenarios.find((s) => s.zone === zone.id)
    color = done ? '#4ade80' : zone.color
    label = done ? 'Handled ✓' : zone.label
    title = done ? 'Go back inside' : (scen?.title ?? 'Go inside')
  } else {
    const def = interiors[inside]
    const spot = def?.spots.find((s) => s.id === near)
    if (!def || !spot) return null
    if (spot.kind === 'exit') {
      color = '#9ca0a8'
      label = 'Way out'
      title = 'Step back onto the street'
    } else if (spot.kind === 'resume') {
      const live = pending?.scenario === spot.scenario
      color = def.accent
      label = spot.label
      title = live ? 'Take the stage' : 'Nothing happening up here yet'
      disabled = !live
      if (!live) hint = null
    } else {
      const done = !!spot.scenario && completed.includes(spot.scenario)
      const scen = scenarios.find((s) => s.id === spot.scenario)
      color = done ? '#4ade80' : def.accent
      label = done ? 'Handled ✓' : spot.label
      title = done ? 'Nothing left to do here' : (scen?.title ?? spot.sub)
      disabled = done
      if (done) hint = null
    }
  }

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-24 z-30 flex justify-center px-4 sm:bottom-28">
      <button
        onClick={onInteract}
        disabled={disabled}
        className="pointer-events-auto rounded-xl border px-5 py-3 text-center transition-transform active:scale-[0.98]"
        style={{
          borderColor: color + '77',
          background: 'rgba(8,10,14,0.82)',
          backdropFilter: 'blur(10px)',
          animation: 'g-rise 0.25s ease',
        }}
      >
        <div className="font-mono text-[0.58rem] uppercase tracking-[0.18em]" style={{ color }}>
          {label}
        </div>
        <div className="mt-1 text-[0.9rem] font-medium text-[#fafaf9]">{title}</div>
        {hint && (
          <div className="mt-1.5 font-mono text-[0.62rem] text-[#9ca0a8]">
            Press <span className="text-[#f0b429]">E</span> · or tap here
          </div>
        )}
      </button>
    </div>
  )
}

/** Replaces the minimap while you are indoors. */
export function InsideBar() {
  const inside = useGame((s) => s.inside)
  const leave = useGame((s) => s.leaveBuilding)
  const def = inside ? interiors[inside] : undefined
  if (!def) return null
  return (
    <div className="pointer-events-none fixed bottom-3 right-3 z-30 hidden sm:block">
      <div
        className="pointer-events-auto rounded-xl border px-3.5 py-3 text-right"
        style={{ borderColor: '#ffffff1a', background: 'rgba(8,10,14,0.66)', backdropFilter: 'blur(10px)' }}
      >
        <div className="font-mono text-[0.56rem] uppercase tracking-[0.18em]" style={{ color: def.accent }}>
          Inside
        </div>
        <div className="mt-0.5 text-[0.82rem] font-medium text-[#fafaf9]">{def.title}</div>
        <button
          onClick={leave}
          className="mt-2 rounded-full border px-3 py-1 font-mono text-[0.58rem] uppercase tracking-[0.14em] text-[#9ca0a8] transition-colors hover:text-[#fafaf9]"
          style={{ borderColor: '#ffffff22' }}
        >
          Leave building
        </button>
      </div>
    </div>
  )
}

/** A scenario that broke off and is waiting for you somewhere else in the room. */
export function PendingHint() {
  const pending = useGame((s) => s.pending)
  if (!pending?.hint) return null
  return (
    <div className="pointer-events-none fixed inset-x-0 top-[8.6rem] z-30 flex justify-center px-4 sm:top-[5.5rem]">
      <div
        className="max-w-md rounded-xl border px-4 py-2.5 text-center"
        style={{
          borderColor: '#f472b655',
          background: 'rgba(8,10,14,0.84)',
          backdropFilter: 'blur(10px)',
          animation: 'g-rise 0.3s ease',
        }}
      >
        <div className="font-mono text-[0.56rem] uppercase tracking-[0.18em] text-[#f472b6]">
          Scenario paused
        </div>
        <div className="mt-1 text-[0.82rem] leading-snug text-[#d4d8de]">{pending.hint}</div>
      </div>
    </div>
  )
}

export function TopBar({ onExit, onFinish }: { onExit: () => void; onFinish: () => void }) {
  const completed = useGame((s) => s.completed)
  const score = useGame((s) => s.score)
  const all = completed.length === zones.length

  return (
    <div className="pointer-events-none fixed left-3 top-3 z-30 flex max-w-[calc(100%-9.4rem)] flex-wrap items-start gap-2 sm:left-4 sm:top-4 sm:max-w-none sm:flex-nowrap">
      <div
        className="pointer-events-auto rounded-xl border px-3.5 py-2.5"
        style={{ borderColor: '#ffffff1a', background: 'rgba(8,10,14,0.62)', backdropFilter: 'blur(10px)' }}
      >
        <div className="font-mono text-[0.58rem] uppercase tracking-[0.18em] text-[#9ca0a8]">
          The First 90 Days
        </div>
        <div className="mt-0.5 flex items-baseline gap-2">
          <span className="text-[0.9rem] font-semibold text-[#fafaf9]">Day {completed.length + 1}</span>
          <span className="font-mono text-[0.66rem] text-[#f0b429]">{score} pts</span>
        </div>
      </div>

      {all && (
        <button
          onClick={onFinish}
          className="pointer-events-auto rounded-xl border px-4 py-2.5 text-[0.8rem] font-semibold text-[#0a0c10]"
          style={{ background: '#f0b429', borderColor: '#f0b429', animation: 'g-pulse 1.8s infinite' }}
        >
          See your review →
        </button>
      )}

      <button
        onClick={onExit}
        className="pointer-events-auto rounded-xl border px-3 py-2.5 font-mono text-[0.62rem] text-[#9ca0a8] transition-colors hover:text-[#fafaf9]"
        style={{ borderColor: '#ffffff1a', background: 'rgba(8,10,14,0.62)', backdropFilter: 'blur(10px)' }}
      >
        ← Portfolio
      </button>
    </div>
  )
}

export function ControlHint() {
  const keys = useMemo(
    () => [
      ['W A S D', 'Move'],
      ['Shift', 'Run'],
      ['Drag', 'Look'],
      ['E', 'Enter / act'],
    ],
    [],
  )
  return (
    <div className="pointer-events-none fixed bottom-3 left-3 z-30 hidden gap-3 sm:flex">
      {keys.map(([k, v]) => (
        <div key={k} className="flex items-center gap-1.5">
          <kbd
            className="rounded border px-1.5 py-0.5 font-mono text-[0.58rem] text-[#d4d8de]"
            style={{ borderColor: '#ffffff22', background: 'rgba(8,10,14,0.6)' }}
          >
            {k}
          </kbd>
          <span className="font-mono text-[0.58rem] text-[#6b6f77]">{v}</span>
        </div>
      ))}
    </div>
  )
}
