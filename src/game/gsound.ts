let ctx: AudioContext | null = null
let nodes: AudioNode[] = []

function ac() {
  if (!ctx) ctx = new (window.AudioContext || (window as any).webkitAudioContext)()
  if (ctx.state === 'suspended') ctx.resume()
  return ctx
}

/** rain = filtered noise, drone = low oscillators */
export function startAmbient() {
  try {
    stopAmbient()
    const c = ac()
    // rain
    const buf = c.createBuffer(1, c.sampleRate * 2, c.sampleRate)
    const data = buf.getChannelData(0)
    for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1
    const noise = c.createBufferSource()
    noise.buffer = buf; noise.loop = true
    const nf = c.createBiquadFilter(); nf.type = 'bandpass'; nf.frequency.value = 2400; nf.Q.value = 0.4
    const ng = c.createGain(); ng.gain.value = 0.035
    noise.connect(nf).connect(ng).connect(c.destination)
    noise.start()
    // drone
    const o1 = c.createOscillator(); o1.type = 'sine'; o1.frequency.value = 48
    const o2 = c.createOscillator(); o2.type = 'sine'; o2.frequency.value = 72.5
    const dg = c.createGain(); dg.gain.value = 0.02
    o1.connect(dg); o2.connect(dg); dg.connect(c.destination)
    o1.start(); o2.start()
    nodes = [noise, ng, o1, o2, dg]
  } catch { /* no audio */ }
}

export function stopAmbient() {
  nodes.forEach((n) => { try { (n as OscillatorNode).stop ? (n as OscillatorNode).stop() : (n as GainNode).disconnect() } catch {} })
  nodes = []
}

export function blip(freq = 520, dur = 0.07, type: OscillatorType = 'sine', gain = 0.05) {
  try {
    const c = ac()
    const o = c.createOscillator(); const g = c.createGain()
    o.type = type; o.frequency.value = freq
    g.gain.setValueAtTime(gain, c.currentTime)
    g.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + dur)
    o.connect(g).connect(c.destination)
    o.start(); o.stop(c.currentTime + dur)
  } catch {}
}

export function glitchSfx() {
  blip(120, 0.3, 'sawtooth', 0.06)
  setTimeout(() => blip(90, 0.25, 'square', 0.05), 120)
}
