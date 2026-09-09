// Tiny WebAudio synth — no audio assets needed.
let ctx: AudioContext | null = null

const getCtx = () => {
  if (!ctx) ctx = new (window.AudioContext || (window as any).webkitAudioContext)()
  if (ctx.state === 'suspended') ctx.resume()
  return ctx
}

function tone(freq: number, dur: number, type: OscillatorType = 'sine', gain = 0.06, when = 0) {
  try {
    const c = getCtx()
    const o = c.createOscillator()
    const g = c.createGain()
    o.type = type
    o.frequency.value = freq
    g.gain.setValueAtTime(gain, c.currentTime + when)
    g.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + when + dur)
    o.connect(g).connect(c.destination)
    o.start(c.currentTime + when)
    o.stop(c.currentTime + when + dur)
  } catch {
    /* audio unavailable */
  }
}

export const sfx = {
  click: () => tone(660, 0.08, 'square', 0.03),
  hover: () => tone(440, 0.05, 'sine', 0.015),
  open: () => { tone(220, 0.25, 'sawtooth', 0.04); tone(440, 0.3, 'sine', 0.04, 0.1) },
  mission: () => { tone(523, 0.15, 'sine', 0.05); tone(659, 0.15, 'sine', 0.05, 0.12); tone(784, 0.3, 'sine', 0.06, 0.24) },
  achievement: () => { tone(587, 0.12, 'triangle', 0.05); tone(880, 0.25, 'triangle', 0.05, 0.1) },
  error: () => tone(180, 0.2, 'sawtooth', 0.04),
  type: () => tone(880 + Math.random() * 220, 0.02, 'square', 0.008),
  success: () => { tone(392, 0.1, 'sine', 0.05); tone(523, 0.1, 'sine', 0.05, 0.08); tone(659, 0.2, 'sine', 0.05, 0.16) },
}

// Subtle ambient hum loop
let ambientNodes: { o: OscillatorNode; g: GainNode }[] = []
export function startAmbient() {
  try {
    const c = getCtx()
    if (ambientNodes.length) return
    ;([55, 82.5] as const).forEach((f, i) => {
      const o = c.createOscillator()
      const g = c.createGain()
      o.type = 'sine'
      o.frequency.value = f
      g.gain.value = i === 0 ? 0.015 : 0.008
      o.connect(g).connect(c.destination)
      o.start()
      ambientNodes.push({ o, g })
    })
  } catch { /* noop */ }
}
export function stopAmbient() {
  ambientNodes.forEach(({ o }) => { try { o.stop() } catch {} })
  ambientNodes = []
}
