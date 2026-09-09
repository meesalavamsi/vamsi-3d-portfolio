import { useRef, useState } from 'react'
import { input } from '../input'

/* Left thumb drives movement; dragging anywhere on the right looks around. */

export default function TouchControls({ onInteract }: { onInteract: () => void }) {
  const [knob, setKnob] = useState({ x: 0, y: 0 })
  const base = useRef<HTMLDivElement>(null)
  const touchId = useRef<number | null>(null)
  const lookId = useRef<number | null>(null)
  const lookLast = useRef({ x: 0, y: 0 })

  const move = (clientX: number, clientY: number) => {
    const el = base.current
    if (!el) return
    const r = el.getBoundingClientRect()
    const cx = r.left + r.width / 2
    const cy = r.top + r.height / 2
    let dx = clientX - cx
    let dy = clientY - cy
    const max = r.width / 2
    const len = Math.hypot(dx, dy)
    if (len > max) {
      dx = (dx / len) * max
      dy = (dy / len) * max
    }
    setKnob({ x: dx, y: dy })
    input.s = dx / max
    input.f = -dy / max
    input.sprint = len > max * 0.82
  }

  const end = () => {
    setKnob({ x: 0, y: 0 })
    input.s = 0
    input.f = 0
    input.sprint = false
    touchId.current = null
  }

  return (
    <div className="fixed inset-0 z-30 sm:hidden" style={{ pointerEvents: 'none' }}>
      {/* look layer (right half) */}
      <div
        className="absolute inset-y-0 right-0 w-1/2"
        style={{ pointerEvents: 'auto' }}
        onTouchStart={(e) => {
          const t = e.changedTouches[0]
          lookId.current = t.identifier
          lookLast.current = { x: t.clientX, y: t.clientY }
        }}
        onTouchMove={(e) => {
          for (const t of Array.from(e.changedTouches)) {
            if (t.identifier !== lookId.current) continue
            input.yaw -= (t.clientX - lookLast.current.x) * 0.006
            input.pitch = Math.max(
              0.05,
              Math.min(0.85, input.pitch + (t.clientY - lookLast.current.y) * 0.004),
            )
            lookLast.current = { x: t.clientX, y: t.clientY }
          }
        }}
        onTouchEnd={() => {
          lookId.current = null
        }}
      />

      {/* joystick */}
      <div
        ref={base}
        className="absolute bottom-6 left-6 size-[7.5rem] rounded-full border"
        style={{
          pointerEvents: 'auto',
          borderColor: '#ffffff26',
          background: 'rgba(8,10,14,0.5)',
          backdropFilter: 'blur(8px)',
          touchAction: 'none',
        }}
        onTouchStart={(e) => {
          const t = e.changedTouches[0]
          touchId.current = t.identifier
          move(t.clientX, t.clientY)
        }}
        onTouchMove={(e) => {
          for (const t of Array.from(e.changedTouches)) {
            if (t.identifier === touchId.current) move(t.clientX, t.clientY)
          }
        }}
        onTouchEnd={end}
        onTouchCancel={end}
      >
        <div
          className="absolute size-14 rounded-full border"
          style={{
            left: `calc(50% - 1.75rem + ${knob.x}px)`,
            top: `calc(50% - 1.75rem + ${knob.y}px)`,
            borderColor: '#f0b42977',
            background: 'rgba(240,180,41,0.22)',
            transition: touchId.current === null ? 'all 0.18s' : 'none',
          }}
        />
      </div>

      {/* interact */}
      <button
        onClick={onInteract}
        className="absolute bottom-9 right-6 grid size-[4.6rem] place-items-center rounded-full border font-mono text-[0.66rem] uppercase tracking-[0.1em] text-[#f0b429]"
        style={{
          pointerEvents: 'auto',
          borderColor: '#f0b42966',
          background: 'rgba(240,180,41,0.14)',
          backdropFilter: 'blur(8px)',
        }}
      >
        Enter
      </button>
    </div>
  )
}
