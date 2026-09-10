import * as THREE from 'three'

/* ═══════════════════════════════════════════════════════════════
   Set dressing for the building interiors. Everything is built
   from a handful of shared geometries and cached materials so a
   fully furnished room still costs very little.
   ═══════════════════════════════════════════════════════════════ */

export const UNIT = new THREE.BoxGeometry(1, 1, 1)
export const PLANE = new THREE.PlaneGeometry(1, 1)
export const CYL = new THREE.CylinderGeometry(0.5, 0.5, 1, 14)
export const CONE = new THREE.ConeGeometry(0.5, 1, 14)
export const SPH = new THREE.SphereGeometry(0.5, 14, 10)
export const DISC = new THREE.CircleGeometry(0.5, 22)

const std = new Map<string, THREE.MeshStandardMaterial>()
export function mat(color: string, roughness = 0.82, metalness = 0.04) {
  const k = `${color}|${roughness}|${metalness}`
  let m = std.get(k)
  if (!m) {
    m = new THREE.MeshStandardMaterial({ color, roughness, metalness })
    std.set(k, m)
  }
  return m
}

const emi = new Map<string, THREE.MeshStandardMaterial>()
export function glow(color: string, intensity = 1.1) {
  const k = `${color}|${intensity}`
  let m = emi.get(k)
  if (!m) {
    m = new THREE.MeshStandardMaterial({
      color,
      emissive: new THREE.Color(color),
      emissiveIntensity: intensity,
      roughness: 0.4,
    })
    emi.set(k, m)
  }
  return m
}

const basic = new Map<string, THREE.MeshBasicMaterial>()
export function flat(color: string, opacity = 1) {
  const k = `${color}|${opacity}`
  let m = basic.get(k)
  if (!m) {
    m = new THREE.MeshBasicMaterial({
      color,
      transparent: opacity < 1,
      opacity,
      depthWrite: opacity >= 1,
    })
    basic.set(k, m)
  }
  return m
}

/* ── floor / wall surface textures ───────────────────────────── */

const surf = new Map<string, THREE.CanvasTexture>()
function surfaceTex(kind: 'tile' | 'carpet' | 'concrete') {
  let t = surf.get(kind)
  if (t) return t
  const S = 256
  const c = document.createElement('canvas')
  c.width = S
  c.height = S
  const x = c.getContext('2d')!
  x.fillStyle = '#ffffff'
  x.fillRect(0, 0, S, S)

  if (kind === 'tile') {
    x.strokeStyle = 'rgba(0,0,0,0.30)'
    x.lineWidth = 3
    for (let i = 0; i <= 2; i++) {
      const p = (i * S) / 2
      x.beginPath()
      x.moveTo(p, 0)
      x.lineTo(p, S)
      x.moveTo(0, p)
      x.lineTo(S, p)
      x.stroke()
    }
    // faint polish streaks
    x.strokeStyle = 'rgba(255,255,255,0.5)'
    x.lineWidth = 8
    for (let i = 0; i < 5; i++) {
      x.beginPath()
      x.moveTo(Math.random() * S, 0)
      x.lineTo(Math.random() * S, S)
      x.stroke()
    }
  } else if (kind === 'carpet') {
    for (let i = 0; i < 9000; i++) {
      const v = 200 + Math.random() * 55
      x.fillStyle = `rgba(${v},${v},${v},0.5)`
      x.fillRect(Math.random() * S, Math.random() * S, 2, 2)
    }
    x.fillStyle = 'rgba(0,0,0,0.12)'
    for (let i = 0; i < S; i += 8) x.fillRect(0, i, S, 2)
  } else {
    for (let i = 0; i < 2600; i++) {
      const v = Math.random() > 0.5 ? 235 : 255
      x.fillStyle = `rgba(${v},${v},${v},0.5)`
      const r = 1 + Math.random() * 3
      x.beginPath()
      x.arc(Math.random() * S, Math.random() * S, r, 0, Math.PI * 2)
      x.fill()
    }
  }

  t = new THREE.CanvasTexture(c)
  t.wrapS = t.wrapT = THREE.RepeatWrapping
  surf.set(kind, t)
  return t
}

const wallMats = new Map<string, THREE.MeshStandardMaterial>()
export function wallMat(color: string, rep = 6) {
  const k = `${color}|${rep}`
  let m = wallMats.get(k)
  if (!m) {
    const t = surfaceTex('concrete').clone()
    t.needsUpdate = true
    t.wrapS = t.wrapT = THREE.RepeatWrapping
    t.repeat.set(rep, 2)
    m = new THREE.MeshStandardMaterial({ color, map: t, roughness: 0.95 })
    wallMats.set(k, m)
  }
  return m
}

const floorMats = new Map<string, THREE.MeshStandardMaterial>()
export function floorMat(color: string, kind: 'tile' | 'carpet' | 'concrete', rep: number) {
  const k = `${color}|${kind}|${rep}`
  let m = floorMats.get(k)
  if (!m) {
    const base = surfaceTex(kind)
    const t = base.clone()
    t.needsUpdate = true
    t.wrapS = t.wrapT = THREE.RepeatWrapping
    t.repeat.set(rep, rep)
    m = new THREE.MeshStandardMaterial({
      color,
      map: t,
      roughness: kind === 'tile' ? 0.42 : 0.94,
      metalness: kind === 'tile' ? 0.16 : 0.02,
    })
    floorMats.set(k, m)
  }
  return m
}

/* ── screen content, painted into canvases ───────────────────── */

export type ScreenKind =
  | 'code'
  | 'chart'
  | 'board'
  | 'alert'
  | 'timer'
  | 'slides'
  | 'grid'
  | 'terminal'
  | 'diff'
  | 'scores'

const screens = new Map<string, THREE.CanvasTexture>()

export function screenTex(kind: ScreenKind, seed = 0) {
  const key = `${kind}|${seed}`
  let t = screens.get(key)
  if (t) return t
  const W = 512
  const H = 320
  const c = document.createElement('canvas')
  c.width = W
  c.height = H
  const x = c.getContext('2d')!
  let n = seed * 9301 + 49297
  const rnd = () => {
    n = (n * 9301 + 49297) % 233280
    return n / 233280
  }

  const bg = (col: string) => {
    x.fillStyle = col
    x.fillRect(0, 0, W, H)
  }
  const chrome = (title: string, col = '#f0b429') => {
    x.fillStyle = 'rgba(255,255,255,0.06)'
    x.fillRect(0, 0, W, 26)
    x.fillStyle = col
    x.font = 'bold 13px monospace'
    x.fillText(title, 12, 18)
    for (let i = 0; i < 3; i++) {
      x.fillStyle = ['#ff5f57', '#febc2e', '#28c840'][i]
      x.beginPath()
      x.arc(W - 20 - i * 18, 13, 5, 0, Math.PI * 2)
      x.fill()
    }
  }

  if (kind === 'code' || kind === 'diff') {
    bg('#12141a')
    chrome(kind === 'diff' ? 'pull request #418' : 'inverter_sync.py', '#7dd3fc')
    const cols = ['#c792ea', '#82aaff', '#c3e88d', '#f78c6c', '#89ddff', '#eeffff']
    for (let i = 0; i < 17; i++) {
      const y = 44 + i * 15
      x.fillStyle = '#3b4252'
      x.font = '11px monospace'
      x.fillText(String(i + 1).padStart(2, '0'), 8, y)
      if (kind === 'diff' && i % 4 === 1) {
        x.fillStyle = 'rgba(74,222,128,0.13)'
        x.fillRect(28, y - 10, W - 36, 14)
      } else if (kind === 'diff' && i % 7 === 3) {
        x.fillStyle = 'rgba(248,113,113,0.13)'
        x.fillRect(28, y - 10, W - 36, 14)
      }
      let px = 30 + (i % 3) * 14
      const words = 2 + Math.floor(rnd() * 5)
      for (let w = 0; w < words; w++) {
        const len = 18 + rnd() * 62
        x.fillStyle = cols[Math.floor(rnd() * cols.length)]
        x.globalAlpha = 0.85
        x.fillRect(px, y - 8, len, 8)
        x.globalAlpha = 1
        px += len + 9
        if (px > W - 50) break
      }
    }
  } else if (kind === 'terminal') {
    bg('#0b0e13')
    chrome('bash', '#4ade80')
    x.font = '12px monospace'
    for (let i = 0; i < 16; i++) {
      const y = 48 + i * 16
      x.fillStyle = i % 5 === 0 ? '#4ade80' : '#94a3b8'
      x.fillText(
        (i % 5 === 0 ? '$ ' : '  ') +
          ['ok', 'reading register 0x1f', 'poll 24 devices', 'commit', 'retry 1/3', 'done in 412ms'][
            Math.floor(rnd() * 6)
          ],
        12,
        y,
      )
    }
  } else if (kind === 'chart') {
    bg('#10141c')
    chrome('inverter array · live', '#f0b429')
    // grid
    x.strokeStyle = 'rgba(255,255,255,0.07)'
    x.lineWidth = 1
    for (let i = 0; i < 7; i++) {
      const y = 50 + i * 36
      x.beginPath()
      x.moveTo(20, y)
      x.lineTo(W - 20, y)
      x.stroke()
    }
    // three traces, one drifting low
    const traces = ['#f0b429', '#4ade80', '#f87171']
    traces.forEach((col, ti) => {
      x.strokeStyle = col
      x.lineWidth = 2.4
      x.beginPath()
      for (let i = 0; i <= 60; i++) {
        const px = 20 + (i / 60) * (W - 40)
        const drift = ti === 2 ? (i / 60) * 70 : 0
        const py =
          120 + ti * 22 + drift + Math.sin(i * 0.4 + ti * 2) * 16 + (rnd() - 0.5) * 6
        i ? x.lineTo(px, py) : x.moveTo(px, py)
      }
      x.stroke()
    })
    x.fillStyle = '#f87171'
    x.font = 'bold 14px monospace'
    x.fillText('INV-03  -18%', W - 150, 300)
  } else if (kind === 'board') {
    bg('#111318')
    chrome('service requests', '#a78bfa')
    const lanes = ['INTAKE', 'TRIAGE', 'BUILT']
    for (let l = 0; l < 3; l++) {
      const lx = 16 + l * 164
      x.fillStyle = 'rgba(255,255,255,0.04)'
      x.fillRect(lx, 36, 152, H - 52)
      x.fillStyle = '#8b93a7'
      x.font = 'bold 11px monospace'
      x.fillText(lanes[l], lx + 10, 54)
      const cards = l === 0 ? 8 : l === 1 ? 4 : 2
      for (let i = 0; i < cards; i++) {
        const cy = 64 + i * 29
        if (cy > H - 34) break
        x.fillStyle = l === 0 ? '#232733' : l === 1 ? '#2b3242' : '#243527'
        x.fillRect(lx + 8, cy, 136, 22)
        x.fillStyle = ['#f0b429', '#4ade80', '#f87171', '#60a5fa'][Math.floor(rnd() * 4)]
        x.fillRect(lx + 8, cy, 3, 22)
        x.fillStyle = '#9aa3b2'
        x.fillRect(lx + 18, cy + 7, 60 + rnd() * 50, 7)
      }
    }
  } else if (kind === 'alert') {
    bg('#160f12')
    chrome('mail · quarantine', '#f87171')
    x.fillStyle = 'rgba(248,113,113,0.14)'
    x.fillRect(16, 40, W - 32, 62)
    x.strokeStyle = '#f87171'
    x.lineWidth = 2
    x.strokeRect(16, 40, W - 32, 62)
    x.fillStyle = '#fca5a5'
    x.font = 'bold 16px monospace'
    x.fillText('⚠  EXTERNAL SENDER', 30, 66)
    x.font = '12px monospace'
    x.fillStyle = '#e2b8b8'
    x.fillText('accounts-verify@vendor-portal-sec.co', 30, 88)
    x.fillStyle = '#8b93a7'
    x.font = '12px monospace'
    const lines = [
      'Subject: URGENT — invoice payment on hold',
      'Please confirm the bank details on the attached',
      'form within 30 minutes or the vendor contract',
      'will lapse. Use the secure link below.',
      '',
      'http://vendor-portal-sec.co/verify?id=8841',
    ]
    lines.forEach((s, i) => {
      x.fillStyle = i === 5 ? '#60a5fa' : '#93a0b4'
      x.fillText(s, 30, 132 + i * 22)
    })
  } else if (kind === 'timer') {
    bg('#14101a')
    x.fillStyle = '#f472b6'
    x.font = 'bold 22px monospace'
    x.textAlign = 'center'
    x.fillText('36-HOUR BUILD', W / 2, 54)
    x.fillStyle = '#fafaf9'
    x.font = 'bold 92px monospace'
    x.fillText('04:11', W / 2, 158)
    x.fillStyle = '#f472b6'
    x.font = 'bold 16px monospace'
    x.fillText('REMAINING', W / 2, 190)
    x.fillStyle = 'rgba(255,255,255,0.12)'
    x.fillRect(60, 224, W - 120, 16)
    x.fillStyle = '#f472b6'
    x.fillRect(60, 224, (W - 120) * 0.88, 16)
    x.fillStyle = '#c9a7bb'
    x.font = '13px monospace'
    x.fillText('42 TEAMS · DEMOS AT 18:00', W / 2, 272)
    x.textAlign = 'left'
  } else if (kind === 'slides') {
    bg('#0d1016')
    x.fillStyle = '#f0b429'
    x.fillRect(0, 0, 8, H)
    x.fillStyle = '#fafaf9'
    x.font = 'bold 27px system-ui, sans-serif'
    x.fillText('Smart Inverter Ops', 34, 62)
    x.fillStyle = '#f0b429'
    x.font = 'bold 13px monospace'
    x.fillText('ONE DASHBOARD · 24 DEVICES · LIVE', 34, 90)
    // simple bar chart
    const bars = [0.35, 0.55, 0.42, 0.78, 0.66, 0.92]
    bars.forEach((b, i) => {
      const bx = 40 + i * 42
      x.fillStyle = i === 5 ? '#4ade80' : '#3f4a5c'
      x.fillRect(bx, 250 - b * 130, 28, b * 130)
    })
    x.fillStyle = '#8b93a7'
    x.font = '12px monospace'
    x.fillText('downtime caught in minutes, not days', 40, 280)
    x.fillStyle = '#4ade80'
    x.font = 'bold 12px monospace'
    x.fillText('-31% MANUAL CHECKS', 300, 200)
  } else if (kind === 'scores') {
    bg('#0f1117')
    chrome('demo day · shortlist', '#f472b6')
    const teams = ['HELIOS', 'NOVA', 'GRIDLINE', 'BYTEFORGE', 'KERNEL PANIC']
    teams.forEach((t, i) => {
      const y = 66 + i * 46
      const me = i === 0
      x.fillStyle = me ? 'rgba(244,114,182,0.18)' : 'rgba(255,255,255,0.04)'
      x.fillRect(20, y - 22, W - 40, 36)
      x.fillStyle = me ? '#f472b6' : '#8b93a7'
      x.font = 'bold 15px monospace'
      x.fillText(me ? '▶' : '·', 34, y)
      x.fillStyle = me ? '#fafaf9' : '#b6bdc9'
      x.fillText(t, 62, y)
      x.fillStyle = me ? '#f472b6' : '#6b7280'
      x.fillText(me ? 'ON DECK' : 'WAITING', W - 132, y)
    })
  } else {
    bg('#0f1218')
    x.strokeStyle = 'rgba(120,180,255,0.35)'
    x.lineWidth = 1
    for (let i = 0; i < 20; i++) {
      x.beginPath()
      x.moveTo((i / 20) * W, 0)
      x.lineTo((i / 20) * W, H)
      x.stroke()
    }
    for (let i = 0; i < 12; i++) {
      x.beginPath()
      x.moveTo(0, (i / 12) * H)
      x.lineTo(W, (i / 12) * H)
      x.stroke()
    }
  }

  t = new THREE.CanvasTexture(c)
  t.colorSpace = THREE.SRGBColorSpace
  screens.set(key, t)
  return t
}

const screenMats = new Map<string, THREE.MeshBasicMaterial>()
export function screenMat(kind: ScreenKind, seed = 0) {
  const k = `${kind}|${seed}`
  let m = screenMats.get(k)
  if (!m) {
    m = new THREE.MeshBasicMaterial({ map: screenTex(kind, seed), toneMapped: false })
    screenMats.set(k, m)
  }
  return m
}

/* ── printed signage (banners, posters, room names) ──────────── */

const signs = new Map<string, THREE.MeshBasicMaterial>()

/** Shrink a font until the string actually fits the plate. */
function fitFont(x: CanvasRenderingContext2D, text: string, maxW: number, start: number, family: string) {
  let size = start
  for (;;) {
    x.font = `bold ${size}px ${family}`
    if (x.measureText(text).width <= maxW || size <= 7) break
    size -= 1
  }
  return size
}

export function signMat(
  lines: string[],
  opts: { bg?: string; fg?: string; accent?: string; w?: number; h?: number } = {},
) {
  const key = lines.join('|') + JSON.stringify(opts)
  let m = signs.get(key)
  if (m) return m
  const W = opts.w ?? 512
  const H = opts.h ?? 256
  const c = document.createElement('canvas')
  c.width = W
  c.height = H
  const x = c.getContext('2d')!
  x.fillStyle = opts.bg ?? '#111318'
  x.fillRect(0, 0, W, H)
  if (opts.accent) {
    x.fillStyle = opts.accent
    x.fillRect(0, 0, W, Math.max(4, H * 0.03))
    x.fillRect(0, H - Math.max(4, H * 0.03), W, Math.max(4, H * 0.03))
  }
  x.textAlign = 'center'
  x.textBaseline = 'middle'
  const maxW = W * 0.86
  const slot = H / lines.length
  lines.forEach((s, i) => {
    const big = i === 0
    x.fillStyle = big ? (opts.fg ?? '#fafaf9') : (opts.accent ?? '#aeb4c0')
    const fam = big ? 'system-ui, sans-serif' : 'monospace'
    const size = fitFont(x, s, maxW, Math.min(slot * (big ? 0.62 : 0.44), H * 0.3), fam)
    x.font = `bold ${size}px ${fam}`
    x.fillText(s, W / 2, slot * (i + 0.5))
  })
  const t = new THREE.CanvasTexture(c)
  t.colorSpace = THREE.SRGBColorSpace
  m = new THREE.MeshBasicMaterial({ map: t, toneMapped: false })
  signs.set(key, m)
  return m
}

/* ── primitives ──────────────────────────────────────────────── */

type V3 = [number, number, number]

export function Box({
  p, s, m, ry = 0, rx = 0, shadow = true,
}: {
  p: V3
  s: V3
  m: THREE.Material
  ry?: number
  rx?: number
  shadow?: boolean
}) {
  return (
    <mesh
      geometry={UNIT}
      material={m}
      position={p}
      scale={s}
      rotation={[rx, ry, 0]}
      castShadow={shadow}
      receiveShadow={shadow}
    />
  )
}

export function Panel({
  p, s, m, rot = [0, 0, 0],
}: {
  p: V3
  s: [number, number]
  m: THREE.Material
  rot?: V3
}) {
  return (
    <mesh geometry={PLANE} material={m} position={p} scale={[s[0], s[1], 1]} rotation={rot} />
  )
}

/* ── furniture ───────────────────────────────────────────────── */

const WOOD = '#6b5340'
const METAL = '#8b9099'
const DARK = '#23262d'

export function Desk({
  p, w = 2.2, d = 1.1, h = 0.74, top = WOOD, ry = 0,
}: {
  p: [number, number]
  w?: number
  d?: number
  h?: number
  top?: string
  ry?: number
}) {
  return (
    <group position={[p[0], 0, p[1]]} rotation={[0, ry, 0]}>
      <Box p={[0, h, 0]} s={[w, 0.07, d]} m={mat(top, 0.62)} />
      <Box p={[0, h - 0.2, -d / 2 + 0.06]} s={[w * 0.94, 0.3, 0.05]} m={mat(top, 0.7)} />
      {[-1, 1].map((s) => (
        <Box
          key={s}
          p={[(s * (w / 2 - 0.1)), h / 2, 0]}
          s={[0.07, h, d * 0.86]}
          m={mat(METAL, 0.5, 0.5)}
        />
      ))}
    </group>
  )
}

export function Chair({
  p, ry = 0, col = DARK,
}: {
  p: [number, number]
  ry?: number
  col?: string
}) {
  return (
    <group position={[p[0], 0, p[1]]} rotation={[0, ry, 0]}>
      <Box p={[0, 0.44, 0]} s={[0.5, 0.08, 0.48]} m={mat(col, 0.85)} />
      <Box p={[0, 0.74, -0.22]} s={[0.48, 0.52, 0.07]} m={mat(col, 0.85)} rx={-0.12} />
      <mesh geometry={CYL} material={mat('#4a4f58', 0.5, 0.5)} position={[0, 0.2, 0]} scale={[0.07, 0.4, 0.07]} />
      <mesh geometry={CYL} material={mat('#33373d', 0.6, 0.3)} position={[0, 0.03, 0]} scale={[0.44, 0.06, 0.44]} />
    </group>
  )
}

export function Monitor({
  p, kind = 'code', seed = 0, ry = 0, w = 0.82, h = 0.5, y = 0.82,
}: {
  p: [number, number]
  kind?: ScreenKind
  seed?: number
  ry?: number
  w?: number
  h?: number
  y?: number
}) {
  return (
    <group position={[p[0], y, p[1]]} rotation={[0, ry, 0]}>
      <mesh geometry={CYL} material={mat('#2b2f36', 0.6, 0.4)} position={[0, 0.02, 0]} scale={[0.24, 0.03, 0.16]} />
      <Box p={[0, 0.13, 0]} s={[0.05, 0.24, 0.05]} m={mat('#2b2f36', 0.6, 0.4)} />
      <Box p={[0, 0.28 + h / 2, 0]} s={[w + 0.04, h + 0.04, 0.04]} m={mat('#191c21', 0.7)} />
      <Panel p={[0, 0.28 + h / 2, 0.027]} s={[w, h]} m={screenMat(kind, seed)} />
    </group>
  )
}

export function Laptop({
  p, ry = 0, seed = 0, kind = 'code', y = 0.78,
}: {
  p: [number, number]
  ry?: number
  seed?: number
  kind?: ScreenKind
  y?: number
}) {
  return (
    <group position={[p[0], y, p[1]]} rotation={[0, ry, 0]}>
      <Box p={[0, 0.01, 0]} s={[0.42, 0.02, 0.29]} m={mat('#3a3f47', 0.5, 0.6)} />
      <Panel p={[0, 0.022, 0.02]} s={[0.34, 0.16]} m={flat('#22262c')} rot={[-Math.PI / 2, 0, 0]} />
      <group position={[0, 0.02, -0.14]} rotation={[-0.28, 0, 0]}>
        <Box p={[0, 0.13, 0]} s={[0.42, 0.27, 0.014]} m={mat('#33383f', 0.5, 0.5)} />
        <Panel p={[0, 0.13, 0.009]} s={[0.38, 0.23]} m={screenMat(kind, seed)} />
      </group>
    </group>
  )
}

export function WallScreen({
  p, w, h, kind, seed = 0, rot = [0, 0, 0], frame = '#15181d',
}: {
  p: V3
  w: number
  h: number
  kind: ScreenKind
  seed?: number
  rot?: V3
  frame?: string
}) {
  return (
    <group position={p} rotation={rot}>
      <Box p={[0, 0, -0.03]} s={[w + 0.12, h + 0.12, 0.07]} m={mat(frame, 0.6)} />
      <Panel p={[0, 0, 0.02]} s={[w, h]} m={screenMat(kind, seed)} />
    </group>
  )
}

export function Whiteboard({ p, rot = [0, 0, 0], w = 3.2, h = 1.7 }: { p: V3; rot?: V3; w?: number; h?: number }) {
  return (
    <group position={p} rotation={rot}>
      <Box p={[0, 0, -0.04]} s={[w + 0.1, h + 0.1, 0.06]} m={mat('#9aa1ad', 0.5, 0.4)} />
      <Panel p={[0, 0, 0.01]} s={[w, h]} m={signMat(['ARCHITECTURE', 'poll → queue → api → ui'], { bg: '#e8eaec', fg: '#2b3a4a', accent: '#5b7aa8' })} />
      <Box p={[0, -h / 2 - 0.06, 0.04]} s={[w * 0.9, 0.05, 0.1]} m={mat('#8b9099', 0.5, 0.4)} />
    </group>
  )
}

export function Plant({ p, s = 1 }: { p: [number, number]; s?: number }) {
  return (
    <group position={[p[0], 0, p[1]]} scale={s}>
      <mesh geometry={CYL} material={mat('#5d4a3c', 0.9)} position={[0, 0.18, 0]} scale={[0.36, 0.36, 0.36]} />
      <mesh geometry={SPH} material={mat('#3f7a4a', 0.9)} position={[0, 0.62, 0]} scale={[0.62, 0.72, 0.62]} />
      <mesh geometry={SPH} material={mat('#356b40', 0.9)} position={[0.16, 0.86, 0.08]} scale={[0.4, 0.44, 0.4]} />
      <mesh geometry={SPH} material={mat('#48885a', 0.9)} position={[-0.18, 0.8, -0.06]} scale={[0.34, 0.4, 0.34]} />
    </group>
  )
}

export function ServerRack({ p, ry = 0, h = 2.1 }: { p: [number, number]; ry?: number; h?: number }) {
  const rows = Math.floor(h / 0.22)
  return (
    <group position={[p[0], 0, p[1]]} rotation={[0, ry, 0]}>
      <Box p={[0, h / 2, 0]} s={[0.9, h, 0.75]} m={mat('#191c21', 0.6, 0.3)} />
      {Array.from({ length: rows }, (_, i) => (
        <group key={i}>
          <Box p={[0, 0.16 + i * 0.22, 0.38]} s={[0.82, 0.16, 0.03]} m={mat('#262a31', 0.7)} />
          <Box
            p={[-0.3, 0.16 + i * 0.22, 0.4]}
            s={[0.05, 0.05, 0.02]}
            m={glow(i % 3 === 0 ? '#f0b429' : '#4ade80', 2.2)}
            shadow={false}
          />
          <Box p={[-0.2, 0.16 + i * 0.22, 0.4]} s={[0.04, 0.04, 0.02]} m={glow('#60a5fa', 1.6)} shadow={false} />
        </group>
      ))}
    </group>
  )
}

export function Sofa({ p, ry = 0, w = 2.2, col = '#3d4453' }: { p: [number, number]; ry?: number; w?: number; col?: string }) {
  return (
    <group position={[p[0], 0, p[1]]} rotation={[0, ry, 0]}>
      <Box p={[0, 0.24, 0]} s={[w, 0.34, 0.9]} m={mat(col, 0.95)} />
      <Box p={[0, 0.56, -0.36]} s={[w, 0.6, 0.2]} m={mat(col, 0.95)} />
      {[-1, 1].map((s) => (
        <Box key={s} p={[s * (w / 2 - 0.1), 0.5, 0]} s={[0.2, 0.5, 0.9]} m={mat(col, 0.95)} />
      ))}
    </group>
  )
}

export function Counter({ p, w = 6, ry = 0, col = '#4a5364' }: { p: [number, number]; w?: number; ry?: number; col?: string }) {
  return (
    <group position={[p[0], 0, p[1]]} rotation={[0, ry, 0]}>
      <Box p={[0, 0.5, 0]} s={[w, 1, 0.9]} m={mat(col, 0.8)} />
      <Box p={[0, 1.04, 0.06]} s={[w + 0.22, 0.09, 1.1]} m={mat('#2c3138', 0.4, 0.35)} />
      <Box p={[0, 0.16, 0.48]} s={[w, 0.3, 0.06]} m={mat('#9a7a34', 0.75, 0.25)} />
    </group>
  )
}

export function Stage({
  p, w = 12, d = 5, h = 0.55, col = '#22242b',
}: {
  p: [number, number]
  w?: number
  d?: number
  h?: number
  col?: string
}) {
  return (
    <group position={[p[0], 0, p[1]]}>
      <Box p={[0, h / 2, 0]} s={[w, h, d]} m={mat(col, 0.9)} />
      <Box p={[0, h + 0.02, 0]} s={[w - 0.2, 0.04, d - 0.2]} m={mat('#2f323a', 0.75)} />
      {/* step run on the audience side */}
      <Box p={[0, h * 0.28, d / 2 + 0.24]} s={[3.2, h * 0.55, 0.48]} m={mat(col, 0.9)} />
      {/* edge trim so it reads as a stage */}
      <Box p={[0, 0.05, d / 2 + 0.005]} s={[w, 0.06, 0.03]} m={glow('#f472b6', 1.6)} shadow={false} />
    </group>
  )
}

export function Podium({ p, ry = 0 }: { p: [number, number]; ry?: number }) {
  return (
    <group position={[p[0], 0, p[1]]} rotation={[0, ry, 0]}>
      <Box p={[0, 0.55, 0]} s={[0.8, 1.1, 0.55]} m={mat('#2b3038', 0.8)} />
      <Box p={[0, 1.12, 0]} s={[0.9, 0.06, 0.62]} m={mat('#3b424c', 0.6)} rx={-0.16} />
      <Box p={[0, 0.72, 0.29]} s={[0.5, 0.3, 0.03]} m={signMat(['ACET'], { bg: '#f0b429', fg: '#0a0c10', w: 256, h: 128 })} />
      <mesh geometry={CYL} material={mat('#1a1d22', 0.6, 0.4)} position={[0.16, 1.3, 0.1]} scale={[0.03, 0.36, 0.03]} rotation={[0.3, 0, 0.2]} />
      <mesh geometry={SPH} material={mat('#101216', 0.6)} position={[0.22, 1.47, 0.16]} scale={[0.07, 0.09, 0.07]} />
    </group>
  )
}

export function Banner({
  p, w = 1.6, h = 3.4, rot = [0, 0, 0], lines, accent = '#f472b6', bg = '#171320',
}: {
  p: V3
  w?: number
  h?: number
  rot?: V3
  lines: string[]
  accent?: string
  bg?: string
}) {
  return (
    <group position={p} rotation={rot}>
      <Panel p={[0, 0, 0]} s={[w, h]} m={signMat(lines, { bg, accent, w: 256, h: 512 })} />
      <Box p={[0, h / 2 + 0.05, -0.02]} s={[w + 0.14, 0.08, 0.08]} m={mat('#2a2f37', 0.5, 0.4)} />
    </group>
  )
}

export function TableClutter({
  p, seed = 0, kind = 'hack', y = 0.78,
}: {
  p: [number, number]
  seed?: number
  /** hackathon tables get pizza boxes; office desks get paper and mugs */
  kind?: 'hack' | 'office'
  y?: number
}) {
  const r = (n: number) => {
    const x = Math.sin(seed * 71.3 + n * 13.7) * 43758.5453
    return x - Math.floor(x)
  }
  return (
    <group position={[p[0], y, p[1]]}>
      {/* mug */}
      <mesh
        geometry={CYL}
        material={mat(['#e2e5ea', '#c9ccd2', '#8a94a6'][Math.floor(r(1) * 3)], 0.7)}
        position={[r(2) * 0.5 - 0.25, 0.05, r(3) * 0.3 - 0.15]}
        scale={[0.09, 0.1, 0.09]}
      />
      {kind === 'hack' && r(4) > 0.45 && (
        <>
          <Box p={[r(5) * 0.7 - 0.35, 0.03, r(6) * 0.3 - 0.15]} s={[0.36, 0.05, 0.36]} m={mat('#b98a5a', 0.9)} ry={r(7) * 1.2} />
          <mesh geometry={CYL} material={mat('#d8dbe0', 0.6)} position={[r(9) * 0.6 - 0.3, 0.07, r(10) * 0.3 - 0.15]} scale={[0.06, 0.16, 0.06]} />
        </>
      )}
      {kind === 'office' && (
        <>
          <Box p={[r(5) * 0.7 - 0.35, 0.008, r(6) * 0.3 - 0.15]} s={[0.24, 0.014, 0.32]} m={mat('#e8e4dc', 0.95)} ry={r(7) * 0.5} />
          {r(8) > 0.4 && (
            <Box p={[r(9) * 0.7 - 0.35, 0.03, r(10) * 0.3 - 0.15]} s={[0.16, 0.05, 0.22]} m={mat('#7c869a', 0.8)} ry={r(11) * 0.6} />
          )}
        </>
      )}
    </group>
  )
}

export function CeilingLight({ p, y, accent = '#fff8ec' }: { p: [number, number]; y: number; accent?: string }) {
  return (
    <group position={[p[0], y, p[1]]}>
      <Box p={[0, 0, 0]} s={[3, 0.07, 1.05]} m={glow(accent, 2.6)} shadow={false} />
      <Box p={[0, 0.07, 0]} s={[3.14, 0.09, 1.2]} m={mat('#c9ccd2', 0.6)} shadow={false} />
    </group>
  )
}

/** Extra bits of building that stop a room reading as a stage set. */
export function Vent({ p, y }: { p: [number, number]; y: number }) {
  return (
    <group position={[p[0], y, p[1]]}>
      <Box p={[0, 0, 0]} s={[1.2, 0.1, 0.7]} m={mat('#4b5058', 0.7, 0.3)} shadow={false} />
      {[-0.2, 0, 0.2].map((o, i) => (
        <Box key={i} p={[0, -0.06, o]} s={[1.1, 0.03, 0.08]} m={mat('#2c3037', 0.7)} shadow={false} />
      ))}
    </group>
  )
}

export function SideDoor({ p, rot = [0, 0, 0], label = 'STAIRS' }: { p: [number, number, number]; rot?: [number, number, number]; label?: string }) {
  return (
    <group position={p} rotation={rot}>
      <Box p={[0, 1.08, 0.03]} s={[1.34, 2.16, 0.1]} m={mat('#3a3f47', 0.8)} />
      <Box p={[0, 1.05, 0.1]} s={[1.1, 2.02, 0.06]} m={mat('#59616d', 0.75)} />
      <mesh geometry={CYL} material={mat('#b9bec7', 0.4, 0.7)} position={[0.42, 1.02, 0.16]} rotation={[Math.PI / 2, 0, 0]} scale={[0.06, 0.22, 0.06]} />
      <Panel p={[0, 2.36, 0.1]} s={[0.86, 0.28]} m={signMat([label], { bg: '#171a20', accent: '#8b93a7', w: 256, h: 84 })} />
    </group>
  )
}

export function NoticeBoard({ p, rot = [0, 0, 0], w = 2.2, h = 1.3 }: { p: [number, number, number]; rot?: [number, number, number]; w?: number; h?: number }) {
  return (
    <group position={p} rotation={rot}>
      <Box p={[0, 0, -0.03]} s={[w + 0.1, h + 0.1, 0.07]} m={mat('#6b5340', 0.85)} />
      <Panel p={[0, 0, 0.02]} s={[w, h]} m={flat('#b99f7a')} />
      {Array.from({ length: 8 }, (_, i) => (
        <Panel
          key={i}
          p={[
            -w / 2 + 0.34 + (i % 4) * ((w - 0.6) / 4),
            h / 4.4 - Math.floor(i / 4) * (h / 2.6),
            0.03,
          ]}
          s={[w / 6.2, h / 4.4]}
          m={flat(['#f3f1ec', '#e8eef6', '#f6ece8', '#eef3ea'][i % 4])}
        />
      ))}
    </group>
  )
}

export function WaterCooler({ p }: { p: [number, number] }) {
  return (
    <group position={[p[0], 0, p[1]]}>
      <Box p={[0, 0.5, 0]} s={[0.5, 1, 0.44]} m={mat('#dfe3e8', 0.6)} />
      <mesh geometry={CYL} material={mat('#8fc0dd', 0.2, 0.1)} position={[0, 1.24, 0]} scale={[0.38, 0.48, 0.38]} />
      <Box p={[0, 0.66, 0.24]} s={[0.16, 0.1, 0.07]} m={mat('#3a3f47', 0.6)} />
    </group>
  )
}

export function Bin({ p }: { p: [number, number] }) {
  return (
    <group position={[p[0], 0, p[1]]}>
      <mesh geometry={CYL} material={mat('#2f343b', 0.8)} position={[0, 0.28, 0]} scale={[0.42, 0.56, 0.42]} />
      <mesh geometry={CYL} material={mat('#464c55', 0.6)} position={[0, 0.57, 0]} scale={[0.46, 0.05, 0.46]} />
    </group>
  )
}

export function Rug({ p, w, d, col = '#3f4a5e' }: { p: [number, number]; w: number; d: number; col?: string }) {
  return (
    <mesh
      geometry={PLANE}
      material={floorMat(col, 'carpet', Math.max(2, Math.round(w / 1.6)))}
      rotation={[-Math.PI / 2, 0, 0]}
      position={[p[0], 0.015, p[1]]}
      scale={[w, d, 1]}
      receiveShadow
    />
  )
}

export function ExitDoor({ p, ry = 0 }: { p: V3; ry?: number }) {
  return (
    <group position={p} rotation={[0, ry, 0]}>
      <Box p={[0, 1.2, 0]} s={[2.5, 2.4, 0.16]} m={mat('#2a2e36', 0.7)} />
      <Box p={[-0.6, 1.15, 0.1]} s={[1.06, 2.2, 0.05]} m={mat('#7fa8c4', 0.2, 0.4)} />
      <Box p={[0.6, 1.15, 0.1]} s={[1.06, 2.2, 0.05]} m={mat('#7fa8c4', 0.2, 0.4)} />
      <Box p={[0, 1.15, 0.12]} s={[0.07, 2.2, 0.05]} m={mat('#3b4149', 0.5, 0.4)} />
      <Box p={[0, 2.62, 0.05]} s={[0.9, 0.3, 0.06]} m={signMat(['EXIT'], { bg: '#0f2417', fg: '#4ade80', w: 256, h: 96 })} />
    </group>
  )
}

export const KIT_COLORS = { WOOD, METAL, DARK }

/* ── a window with the city outside ─────────────────────────── */

let viewM: THREE.MeshBasicMaterial | null = null
function viewMat() {
  if (viewM) return viewM
  const W = 256
  const H = 256
  const c = document.createElement('canvas')
  c.width = W
  c.height = H
  const x = c.getContext('2d')!
  const g = x.createLinearGradient(0, 0, 0, H)
  g.addColorStop(0, '#8fb6d8')
  g.addColorStop(0.55, '#c5d8e6')
  g.addColorStop(1, '#e0e6e6')
  x.fillStyle = g
  x.fillRect(0, 0, W, H)
  // far skyline
  for (let i = 0; i < 22; i++) {
    const bw = 12 + Math.random() * 26
    const bh = 40 + Math.random() * 110
    const bx = Math.random() * W
    x.fillStyle = `rgba(120,142,164,${0.35 + Math.random() * 0.35})`
    x.fillRect(bx, H - bh - 26, bw, bh)
  }
  // near rooftops
  x.fillStyle = '#6e7d8c'
  x.fillRect(0, H - 30, W, 30)
  x.fillStyle = '#5d6b78'
  for (let i = 0; i < 8; i++) x.fillRect(i * 34, H - 44, 20, 16)
  const t = new THREE.CanvasTexture(c)
  t.colorSpace = THREE.SRGBColorSpace
  viewM = new THREE.MeshBasicMaterial({ map: t, toneMapped: false })
  return viewM
}

/** A run of tall windows along a wall. `along` is the wall length. */
export function Windows({
  p, rot = [0, 0, 0], along, bays = 4, h = 2.1, y = 1.9,
}: {
  p: [number, number, number]
  rot?: [number, number, number]
  along: number
  bays?: number
  h?: number
  y?: number
}) {
  const bw = (along / bays) * 0.82
  const step = along / bays
  return (
    <group position={p} rotation={rot}>
      {Array.from({ length: bays }, (_, i) => {
        const ox = -along / 2 + step * (i + 0.5)
        return (
          <group key={i} position={[ox, y, 0]}>
            <Panel p={[0, 0, 0.02]} s={[bw, h]} m={viewMat()} />
            <Box p={[0, 0, 0.05]} s={[0.06, h, 0.04]} m={mat('#22262c', 0.6, 0.4)} shadow={false} />
            <Box p={[0, 0, 0.05]} s={[bw, 0.06, 0.04]} m={mat('#22262c', 0.6, 0.4)} shadow={false} />
            <Box p={[0, h / 2 + 0.05, 0.05]} s={[bw + 0.16, 0.12, 0.08]} m={mat('#3a3f47', 0.7)} shadow={false} />
            <Box p={[0, -h / 2 - 0.05, 0.09]} s={[bw + 0.16, 0.1, 0.18]} m={mat('#3a3f47', 0.7)} shadow={false} />
          </group>
        )
      })}
    </group>
  )
}

/** Wall-mounted odds and ends that make a room read as lived-in. */
export function WallTrim({
  p, rot = [0, 0, 0], along, accent = '#f0b429',
}: {
  p: [number, number, number]
  rot?: [number, number, number]
  along: number
  accent?: string
}) {
  return (
    <group position={p} rotation={rot}>
      <Box p={[0, 0, 0.03]} s={[along, 0.07, 0.05]} m={mat(accent, 0.6)} shadow={false} />
    </group>
  )
}

export function Clock({ p, rot = [0, 0, 0] }: { p: [number, number, number]; rot?: [number, number, number] }) {
  return (
    <group position={p} rotation={rot}>
      <mesh geometry={CYL} material={mat('#1b1e23', 0.6)} rotation={[Math.PI / 2, 0, 0]} scale={[0.46, 0.06, 0.46]} />
      <mesh geometry={DISC} material={flat('#e8eaec')} position={[0, 0, 0.04]} scale={[0.38, 0.38, 1]} />
      <Box p={[0.05, 0.05, 0.05]} s={[0.03, 0.14, 0.01]} m={flat('#1b1e23')} shadow={false} />
      <Box p={[-0.06, -0.02, 0.05]} s={[0.11, 0.03, 0.01]} m={flat('#1b1e23')} shadow={false} />
    </group>
  )
}
