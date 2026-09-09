/** Shared, mutable input state — written by DOM/touch handlers, read in the frame loop. */
export const input = {
  f: 0,          // -1 back … 1 forward
  s: 0,          // -1 left … 1 right
  sprint: false,
  yaw: Math.PI,  // camera orbit (starts looking across the plaza)
  pitch: 0.28,
  interact: false,
  lookDX: 0,
  lookDY: 0,
}

export function resetInput() {
  input.f = 0
  input.s = 0
  input.sprint = false
  input.interact = false
  input.lookDX = 0
  input.lookDY = 0
}

const keyMap: Record<string, () => void> = {}

export function attachKeyboard(onInteract: () => void, onMap: () => void) {
  const down = (e: KeyboardEvent) => {
    const k = e.key.toLowerCase()
    if (['w', 'arrowup'].includes(k)) input.f = 1
    if (['s', 'arrowdown'].includes(k)) input.f = -1
    if (['a', 'arrowleft'].includes(k)) input.s = -1
    if (['d', 'arrowright'].includes(k)) input.s = 1
    if (k === 'shift') input.sprint = true
    if (k === 'q') input.yaw += 0.14 // keyboard-only camera nudge
    if (k === 'r') input.yaw -= 0.14
    if (k === 'e') onInteract()
    if (k === 'm') onMap()
    if (['w', 'a', 's', 'd', 'arrowup', 'arrowdown', 'arrowleft', 'arrowright', ' '].includes(k)) {
      e.preventDefault()
    }
  }
  const up = (e: KeyboardEvent) => {
    const k = e.key.toLowerCase()
    if (['w', 'arrowup'].includes(k) && input.f > 0) input.f = 0
    if (['s', 'arrowdown'].includes(k) && input.f < 0) input.f = 0
    if (['a', 'arrowleft'].includes(k) && input.s < 0) input.s = 0
    if (['d', 'arrowright'].includes(k) && input.s > 0) input.s = 0
    if (k === 'shift') input.sprint = false
  }
  const blur = () => resetInput()
  window.addEventListener('keydown', down)
  window.addEventListener('keyup', up)
  window.addEventListener('blur', blur)
  return () => {
    window.removeEventListener('keydown', down)
    window.removeEventListener('keyup', up)
    window.removeEventListener('blur', blur)
  }
}

export { keyMap }
