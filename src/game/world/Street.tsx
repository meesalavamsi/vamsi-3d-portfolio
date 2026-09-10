import { useLayoutEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'
import Human, { makeLook } from './Human'
import {
  ARCADE_D, ARCADE_FRONT, ARCADE_H, ARCADE_W, ARCADE_Z, busStop, kiosk, parkedCars, shops,
} from '../data/street'

/* ═══════════════════════════════════════════════════════════════
   The bits that make the district read as a city people live in:
   a shopfront arcade, cars at the kerb, crossings, a bus stop and
   a chai cart. Repeated pieces are instanced so the whole street
   costs about a dozen draw calls.
   ═══════════════════════════════════════════════════════════════ */

const BOX = new THREE.BoxGeometry(1, 1, 1)
const PLANE = new THREE.PlaneGeometry(1, 1)
const CYL = new THREE.CylinderGeometry(0.5, 0.5, 1, 12)

type Item = { p: [number, number, number]; r?: [number, number, number]; s?: [number, number, number] }

function Repeat({
  geo, mat, items, shadow = false,
}: {
  geo: THREE.BufferGeometry
  mat: THREE.Material
  items: Item[]
  shadow?: boolean
}) {
  const ref = useRef<THREE.InstancedMesh>(null)
  useLayoutEffect(() => {
    const m = ref.current
    if (!m) return
    const o = new THREE.Object3D()
    items.forEach((it, i) => {
      o.position.set(it.p[0], it.p[1], it.p[2])
      const r = it.r ?? [0, 0, 0]
      o.rotation.set(r[0], r[1], r[2])
      const s = it.s ?? [1, 1, 1]
      o.scale.set(s[0], s[1], s[2])
      o.updateMatrix()
      m.setMatrixAt(i, o.matrix)
    })
    m.instanceMatrix.needsUpdate = true
    m.computeBoundingSphere()
  }, [items])
  return (
    <instancedMesh
      ref={ref}
      args={[geo, mat, Math.max(1, items.length)]}
      castShadow={shadow}
      receiveShadow={shadow}
    />
  )
}

/* ── materials ───────────────────────────────────────────────── */

const render = new THREE.MeshStandardMaterial({ color: '#8b8378', roughness: 0.92 })
const plinth = new THREE.MeshStandardMaterial({ color: '#5b5750', roughness: 0.9 })
const frame = new THREE.MeshStandardMaterial({ color: '#3c4149', roughness: 0.6, metalness: 0.35 })
const metal = new THREE.MeshStandardMaterial({ color: '#6d737c', roughness: 0.5, metalness: 0.55 })
const rubber = new THREE.MeshStandardMaterial({ color: '#15171b', roughness: 0.9 })
const glassM = new THREE.MeshStandardMaterial({ color: '#0f1a24', roughness: 0.15, metalness: 0.5 })
const lineM = new THREE.MeshStandardMaterial({ color: '#d3d6da', roughness: 0.75 })
/* A lit shop interior seen through glass, painted once and shared. */
const shopGlow = (() => {
  const W = 512
  const H = 288
  const c = document.createElement('canvas')
  c.width = W
  c.height = H
  const x = c.getContext('2d')!
  const g = x.createLinearGradient(0, 0, 0, H)
  g.addColorStop(0, '#6b5233')
  g.addColorStop(0.55, '#4a3a26')
  g.addColorStop(1, '#2a2118')
  x.fillStyle = g
  x.fillRect(0, 0, W, H)
  // shelving with stock on it
  for (let r = 0; r < 3; r++) {
    const y = 62 + r * 62
    x.fillStyle = 'rgba(20,15,10,0.55)'
    x.fillRect(24, y + 34, W - 48, 7)
    for (let i = 0; i < 16; i++) {
      const bw = 10 + ((i * 37 + r * 13) % 14)
      const bh = 16 + ((i * 23 + r * 7) % 16)
      x.fillStyle = ['#c9a15e', '#8fa9b8', '#b8776a', '#9db089', '#c4c0b4'][(i + r) % 5]
      x.globalAlpha = 0.75
      x.fillRect(30 + i * 29, y + 34 - bh, bw, bh)
      x.globalAlpha = 1
    }
  }
  // counter + someone behind it
  x.fillStyle = 'rgba(18,14,10,0.8)'
  x.fillRect(0, H - 54, W, 54)
  x.fillStyle = 'rgba(255,214,150,0.16)'
  x.fillRect(0, H - 58, W, 5)
  // glass reflection
  const r2 = x.createLinearGradient(0, H, W, 0)
  r2.addColorStop(0, 'rgba(255,255,255,0)')
  r2.addColorStop(0.5, 'rgba(220,235,255,0.1)')
  r2.addColorStop(0.62, 'rgba(220,235,255,0.02)')
  r2.addColorStop(1, 'rgba(255,255,255,0)')
  x.fillStyle = r2
  x.fillRect(0, 0, W, H)
  const t = new THREE.CanvasTexture(c)
  t.colorSpace = THREE.SRGBColorSpace
  return new THREE.MeshStandardMaterial({
    map: t,
    emissiveMap: t,
    emissive: new THREE.Color('#ffffff'),
    emissiveIntensity: 0.9,
    roughness: 0.28,
  })
})()
const awningMat = (() => {
  const c = document.createElement('canvas')
  c.width = 64
  c.height = 16
  const x = c.getContext('2d')!
  for (let i = 0; i < 8; i++) {
    x.fillStyle = i % 2 ? '#c9563f' : '#f0ece3'
    x.fillRect(i * 8, 0, 8, 16)
  }
  const t = new THREE.CanvasTexture(c)
  t.colorSpace = THREE.SRGBColorSpace
  return new THREE.MeshStandardMaterial({ map: t, roughness: 0.85 })
})()

function shopSign(name: string, sub: string, tint: string) {
  const W = 512
  const H = 96
  const c = document.createElement('canvas')
  c.width = W
  c.height = H
  const x = c.getContext('2d')!
  x.fillStyle = '#14161b'
  x.fillRect(0, 0, W, H)
  x.fillStyle = tint
  x.fillRect(0, 0, W, 5)
  x.fillRect(0, H - 5, W, 5)
  x.textAlign = 'center'
  x.textBaseline = 'middle'
  let size = 40
  for (;;) {
    x.font = `bold ${size}px system-ui, sans-serif`
    if (x.measureText(name).width <= W * 0.9 || size <= 10) break
    size -= 1
  }
  x.fillStyle = tint
  x.fillText(name, W / 2, H * 0.38)
  x.font = 'bold 17px monospace'
  x.fillStyle = '#9ca0a8'
  x.fillText(sub.toUpperCase(), W / 2, H * 0.74)
  const t = new THREE.CanvasTexture(c)
  t.colorSpace = THREE.SRGBColorSpace
  return new THREE.MeshStandardMaterial({
    map: t,
    emissiveMap: t,
    emissive: new THREE.Color('#ffffff'),
    emissiveIntensity: 0.5,
    roughness: 0.5,
  })
}

/* ── the arcade ──────────────────────────────────────────────── */

function Arcade({ night, busy }: { night: number; busy: boolean }) {
  const signMats = useMemo(() => shops.map((s) => shopSign(s.name, s.sub, s.tint)), [])

  const mass = useMemo<Item[]>(
    () => shops.map((s) => ({ p: [s.x, ARCADE_H / 2, ARCADE_Z], s: [ARCADE_W - 0.16, ARCADE_H, ARCADE_D] })),
    [],
  )
  const caps = useMemo<Item[]>(
    () => shops.map((s) => ({ p: [s.x, ARCADE_H + 0.28, ARCADE_Z], s: [ARCADE_W + 0.14, 0.56, ARCADE_D + 0.3] })),
    [],
  )
  const bases = useMemo<Item[]>(
    () => shops.map((s) => ({ p: [s.x, 0.16, ARCADE_Z], s: [ARCADE_W + 0.1, 0.32, ARCADE_D + 0.2] })),
    [],
  )
  const fronts = useMemo<Item[]>(
    () =>
      shops.map((s) => ({
        p: [s.x - 0.75, 1.55, ARCADE_FRONT - 0.03],
        r: [0, Math.PI, 0],
        s: [3.4, 2.44, 1],
      })),
    [],
  )
  const mullions = useMemo<Item[]>(
    () =>
      shops.flatMap((s) => [
        { p: [s.x - 2.5, 1.55, ARCADE_FRONT - 0.09] as [number, number, number], s: [0.15, 2.7, 0.2] as [number, number, number] },
        { p: [s.x - 0.75, 1.55, ARCADE_FRONT - 0.09] as [number, number, number], s: [0.09, 2.6, 0.16] as [number, number, number] },
        { p: [s.x + 1.02, 1.55, ARCADE_FRONT - 0.09] as [number, number, number], s: [0.15, 2.7, 0.2] as [number, number, number] },
        { p: [s.x + 2.5, 1.55, ARCADE_FRONT - 0.09] as [number, number, number], s: [0.15, 2.7, 0.2] as [number, number, number] },
        { p: [s.x, 2.9, ARCADE_FRONT - 0.09] as [number, number, number], s: [5.2, 0.16, 0.2] as [number, number, number] },
        { p: [s.x, 0.28, ARCADE_FRONT - 0.09] as [number, number, number], s: [5.2, 0.2, 0.2] as [number, number, number] },
      ]),
    [],
  )
  const doors = useMemo<Item[]>(
    () =>
      shops.flatMap((s) => [
        { p: [s.x + 1.8, 1.22, ARCADE_FRONT - 0.03] as [number, number, number], r: [0, Math.PI, 0] as [number, number, number], s: [1.3, 2.2, 1] as [number, number, number] },
      ]),
    [],
  )
  const boards = useMemo<Item[]>(
    () => shops.map((s) => ({ p: [s.x, 3.52, ARCADE_FRONT - 0.14], s: [ARCADE_W - 0.5, 0.9, 0.24] })),
    [],
  )
  const awnings = useMemo<Item[]>(
    () =>
      shops.map((s) => ({
        p: [s.x, 2.58, ARCADE_FRONT - 0.82],
        r: [-0.3, 0, 0],
        s: [ARCADE_W - 0.7, 0.09, 1.7],
      })),
    [],
  )
  const steps = useMemo<Item[]>(
    () => shops.map((s) => ({ p: [s.x, 0.09, ARCADE_FRONT - 0.7], s: [ARCADE_W - 0.6, 0.18, 1.3] })),
    [],
  )
  const upper = useMemo<Item[]>(
    () =>
      shops.flatMap((s) => [
        { p: [s.x - 1.45, 4.68, ARCADE_FRONT - 0.06] as [number, number, number], s: [1.5, 1.06, 0.1] as [number, number, number] },
        { p: [s.x + 1.45, 4.68, ARCADE_FRONT - 0.06] as [number, number, number], s: [1.5, 1.06, 0.1] as [number, number, number] },
      ]),
    [],
  )
  const acs = useMemo<Item[]>(
    () => shops.map((s) => ({ p: [s.x + 2.4, 4.7, ARCADE_FRONT - 0.34], s: [0.72, 0.6, 0.5] })),
    [],
  )

  useLayoutEffect(() => {
    shopGlow.emissiveIntensity = 0.9 + night * 0.85
    signMats.forEach((m) => (m.emissiveIntensity = 0.35 + night * 1.9))
  }, [night, signMats])

  return (
    <group>
      <Repeat geo={BOX} mat={render} items={mass} shadow />
      <Repeat geo={BOX} mat={plinth} items={caps} shadow />
      <Repeat geo={BOX} mat={plinth} items={bases} />
      <Repeat geo={PLANE} mat={shopGlow} items={fronts} />
      <Repeat geo={PLANE} mat={shopGlow} items={doors} />
      <Repeat geo={BOX} mat={frame} items={mullions} />
      <Repeat geo={BOX} mat={frame} items={boards} />
      <Repeat geo={BOX} mat={awningMat} items={awnings} shadow />
      <Repeat geo={BOX} mat={plinth} items={steps} />
      <Repeat geo={BOX} mat={glassM} items={upper} />
      <Repeat geo={BOX} mat={metal} items={acs} />
      {shops.map((s, i) => (
        <mesh
          key={s.x}
          geometry={PLANE}
          material={signMats[i]}
          position={[s.x, 3.52, ARCADE_FRONT - 0.27]}
          rotation={[0, Math.PI, 0]}
          scale={[ARCADE_W - 0.7, 0.76, 1]}
        />
      ))}
      {/* someone standing outside the chai house and the mess */}
      {busy && (
        <>
          <Shopper at={[-27.2, 22.6]} rot={0.3} seed={301} />
          <Shopper at={[-9.4, 22.8]} rot={-0.4} seed={302} />
        </>
      )}
    </group>
  )
}

function Shopper({ at, rot, seed }: { at: [number, number]; rot: number; seed: number }) {
  const look = useMemo(() => makeLook(seed), [seed])
  return (
    <group position={[at[0], 0, at[1]]} rotation={[0, rot, 0]}>
      <Human look={look} gait={0} phase={seed} castShadow={false} detail={false} />
    </group>
  )
}

/* ── cars left at the kerb ───────────────────────────────────── */

const CAR_TINTS = ['#b8332c', '#1f3d6e', '#d8d8d8', '#2b2f36', '#356b4a', '#c9922b', '#7a5a3b']

function ParkedCars() {
  const bodies = useRef<THREE.InstancedMesh>(null)

  const items = useMemo(
    () =>
      parkedCars.map(([x, z, yaw]) => ({
        p: [x, 0.42, z] as [number, number, number],
        r: [0, yaw, 0] as [number, number, number],
      })),
    [],
  )
  const cabins = useMemo<Item[]>(
    () =>
      parkedCars.map(([x, z, yaw]) => ({
        p: [x - Math.sin(yaw) * -0.16, 0.97, z - Math.cos(yaw) * -0.16],
        r: [0, yaw, 0],
        s: [1.5, 0.5, 1.9],
      })),
    [],
  )
  const wheels = useMemo<Item[]>(
    () =>
      parkedCars.flatMap(([x, z, yaw]) =>
        ([[-0.95, 1.4], [0.95, 1.4], [-0.95, -1.4], [0.95, -1.4]] as [number, number][]).map(
          ([ox, oz]) => ({
            p: [
              x + ox * Math.cos(yaw) + oz * Math.sin(yaw),
              0.33,
              z - ox * Math.sin(yaw) + oz * Math.cos(yaw),
            ] as [number, number, number],
            r: [0, yaw, Math.PI / 2] as [number, number, number],
            s: [0.66, 0.22, 0.66],
          }),
        ),
      ),
    [],
  )

  useLayoutEffect(() => {
    const m = bodies.current
    if (!m) return
    const o = new THREE.Object3D()
    const c = new THREE.Color()
    items.forEach((it, i) => {
      o.position.set(it.p[0], it.p[1], it.p[2])
      o.rotation.set(0, it.r![1], 0)
      o.scale.set(2.05, 0.78, 4.5)
      o.updateMatrix()
      m.setMatrixAt(i, o.matrix)
      m.setColorAt(i, c.set(CAR_TINTS[i % CAR_TINTS.length]))
    })
    m.instanceMatrix.needsUpdate = true
    if (m.instanceColor) m.instanceColor.needsUpdate = true
    m.computeBoundingSphere()
  }, [items])

  const paint = useMemo(
    () => new THREE.MeshStandardMaterial({ roughness: 0.34, metalness: 0.42 }),
    [],
  )

  return (
    <group>
      <instancedMesh ref={bodies} args={[BOX, paint, parkedCars.length]} castShadow receiveShadow />
      <Repeat geo={BOX} mat={glassM} items={cabins} />
      <Repeat geo={CYL} mat={rubber} items={wheels} />
    </group>
  )
}

/* ── road markings ───────────────────────────────────────────── */

function Markings() {
  const zebra = useMemo<Item[]>(() => {
    const out: Item[] = []
    // main avenue, at the plaza path
    for (let i = 0; i < 8; i++)
      out.push({
        p: [-2.8 + i * 0.8, 0.022, -19.2],
        r: [-Math.PI / 2, 0, 0],
        s: [0.42, 9.2, 1],
      })
    // north–south avenue, on the way to energy ops
    for (let i = 0; i < 8; i++)
      out.push({
        p: [30.5, 0.022, 8.4 - i * 0.8],
        r: [-Math.PI / 2, 0, Math.PI / 2],
        s: [0.42, 8, 1],
      })
    return out
  }, [])

  const kerbLines = useMemo<Item[]>(
    () => [
      { p: [0, 0.022, -14.5], r: [-Math.PI / 2, 0, 0], s: [180, 0.18, 1] },
      { p: [0, 0.022, -23.9], r: [-Math.PI / 2, 0, 0], s: [180, 0.18, 1] },
      { p: [26.6, 0.022, 4], r: [-Math.PI / 2, 0, Math.PI / 2], s: [120, 0.18, 1] },
      { p: [34.4, 0.022, 4], r: [-Math.PI / 2, 0, Math.PI / 2], s: [120, 0.18, 1] },
    ],
    [],
  )

  return (
    <group>
      <Repeat geo={PLANE} mat={lineM} items={zebra} />
      <Repeat geo={PLANE} mat={lineM} items={kerbLines} />
    </group>
  )
}

/* ── bus stop + chai cart ────────────────────────────────────── */

function BusStop({ night, busy }: { night: number; busy: boolean }) {
  const [x, z] = busStop
  const ad = useMemo(() => {
    const W = 256
    const H = 384
    const c = document.createElement('canvas')
    c.width = W
    c.height = H
    const g = c.getContext('2d')!
    g.fillStyle = '#0d1117'
    g.fillRect(0, 0, W, H)
    g.fillStyle = '#f0b429'
    g.fillRect(0, 0, W, 8)
    g.textAlign = 'center'
    g.fillStyle = '#fafaf9'
    g.font = 'bold 30px system-ui, sans-serif'
    g.fillText('HIRING', W / 2, 96)
    g.font = 'bold 21px system-ui, sans-serif'
    g.fillText('ENGINEERS', W / 2, 130)
    g.fillStyle = '#f0b429'
    g.font = 'bold 15px monospace'
    g.fillText('WHO FIX THE', W / 2, 186)
    g.fillText('PROCESS, NOT', W / 2, 208)
    g.fillText('JUST THE TICKET', W / 2, 230)
    g.fillStyle = '#6b6f77'
    g.font = 'bold 13px monospace'
    g.fillText('CITY WORKS DEPT.', W / 2, 320)
    const t = new THREE.CanvasTexture(c)
    t.colorSpace = THREE.SRGBColorSpace
    return new THREE.MeshStandardMaterial({
      map: t,
      emissiveMap: t,
      emissive: new THREE.Color('#ffffff'),
      emissiveIntensity: 0.4,
      roughness: 0.5,
    })
  }, [])

  useLayoutEffect(() => {
    ad.emissiveIntensity = 0.35 + night * 1.7
  }, [ad, night])

  return (
    <group position={[x, 0, z]}>
      <mesh geometry={BOX} material={plinth} position={[0, 0.07, 0]} scale={[5.2, 0.14, 2]} receiveShadow />
      {[-2.3, 2.3].map((o) => (
        <mesh key={o} geometry={BOX} material={metal} position={[o, 1.3, -0.8]} scale={[0.12, 2.6, 0.12]} castShadow />
      ))}
      <mesh geometry={BOX} material={metal} position={[0, 2.66, -0.1]} scale={[5, 0.12, 2.2]} castShadow />
      <mesh geometry={BOX} material={glassM} position={[0, 1.4, 0.82]} scale={[5, 2.5, 0.06]} />
      <mesh geometry={BOX} material={frame} position={[-1.9, 1.4, -0.86]} scale={[1.3, 2.4, 0.14]} />
      <mesh geometry={PLANE} material={ad} position={[-1.9, 1.4, -0.78]} scale={[1.1, 2.1, 1]} rotation={[0, Math.PI, 0]} />
      <mesh geometry={BOX} material={frame} position={[1, 0.48, -0.4]} scale={[2.4, 0.1, 0.5]} castShadow />
      {[-0.1, 2.1].map((o) => (
        <mesh key={o} geometry={BOX} material={metal} position={[o, 0.25, -0.4]} scale={[0.09, 0.42, 0.42]} />
      ))}
      <mesh geometry={CYL} material={metal} position={[2.9, 1.5, 0.4]} scale={[0.1, 3, 0.1]} />
      <mesh geometry={BOX} material={frame} position={[2.9, 2.85, 0.4]} scale={[0.9, 0.5, 0.08]} />
      {busy && <Shopper at={[-1.4, 0.1]} rot={Math.PI} seed={311} />}
    </group>
  )
}

function ChaiCart({ night }: { night: number }) {
  const [x, z] = kiosk
  const lamp = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#fff3d8',
        emissive: new THREE.Color('#ffdc9c'),
        emissiveIntensity: 0.4,
      }),
    [],
  )
  useLayoutEffect(() => {
    lamp.emissiveIntensity = 0.3 + night * 2.4
  }, [lamp, night])
  return (
    <group position={[x, 0, z]} rotation={[0, -0.6, 0]}>
      <mesh geometry={BOX} material={frame} position={[0, 0.55, 0]} scale={[2.4, 1.1, 1.2]} castShadow />
      <mesh geometry={BOX} material={metal} position={[0, 1.14, 0]} scale={[2.6, 0.1, 1.35]} />
      <mesh geometry={CYL} material={metal} position={[-1.05, 1.9, -0.5]} scale={[0.07, 1.6, 0.07]} />
      <mesh geometry={CYL} material={metal} position={[1.05, 1.9, -0.5]} scale={[0.07, 1.6, 0.07]} />
      <mesh geometry={BOX} material={awningMat} position={[0, 2.6, 0.1]} scale={[2.9, 0.08, 1.9]} rotation={[0.14, 0, 0]} castShadow />
      <mesh geometry={BOX} material={lamp} position={[0, 2.42, 0.1]} scale={[1.2, 0.07, 0.2]} />
      <mesh geometry={CYL} material={metal} position={[0.7, 1.28, 0.1]} scale={[0.22, 0.26, 0.22]} />
      <mesh geometry={CYL} material={rubber} position={[-1.1, 0.28, 0.62]} scale={[0.56, 0.16, 0.56]} rotation={[0, 0, Math.PI / 2]} />
      <mesh geometry={CYL} material={rubber} position={[1.1, 0.28, 0.62]} scale={[0.56, 0.16, 0.56]} rotation={[0, 0, Math.PI / 2]} />
      <Shopper at={[0, -1.05]} rot={0} seed={321} />
    </group>
  )
}

/* ── small street furniture, all instanced ───────────────────── */

function Furniture() {
  const bollards = useMemo<Item[]>(() => {
    const out: Item[] = []
    for (let i = 0; i < 12; i++) out.push({ p: [-30 + i * 2.6, 0.42, 20.9], s: [0.16, 0.84, 0.16] })
    for (let i = 0; i < 8; i++) out.push({ p: [-14 + i * 2.6, 0.42, -14.2], s: [0.16, 0.84, 0.16] })
    return out
  }, [])
  const bins = useMemo<Item[]>(
    () =>
      ([[-25.4, 21.2], [-11.6, 21.2], [7.6, -14.1], [-8.6, 11.2], [28.4, 6.2]] as [number, number][]).map(
        ([x, z]) => ({ p: [x, 0.4, z], s: [0.62, 0.8, 0.62] }),
      ),
    [],
  )
  const planters = useMemo<Item[]>(
    () =>
      ([[-19, 21.1], [-5.6, 21.1], [11.4, 21.1], [-11.4, -14.1]] as [number, number][]).map(
        ([x, z]) => ({ p: [x, 0.28, z], s: [1.5, 0.56, 1] }),
      ),
    [],
  )
  const shrubs = useMemo<Item[]>(
    () =>
      ([[-19, 21.1], [-5.6, 21.1], [11.4, 21.1], [-11.4, -14.1]] as [number, number][]).map(
        ([x, z]) => ({ p: [x, 0.8, z], s: [1.1, 0.8, 0.8] }),
      ),
    [],
  )
  const shrubMat = useMemo(
    () => new THREE.MeshStandardMaterial({ color: '#3f6f42', roughness: 0.95 }),
    [],
  )
  return (
    <group>
      <Repeat geo={CYL} mat={metal} items={bollards} />
      <Repeat geo={CYL} mat={frame} items={bins} />
      <Repeat geo={BOX} mat={plinth} items={planters} />
      <Repeat geo={BOX} mat={shrubMat} items={shrubs} />
    </group>
  )
}

export default function Street({ night, quality }: { night: number; quality: 'high' | 'low' }) {
  return (
    <group>
      <Arcade night={night} busy={quality === 'high'} />
      <Markings />
      <ParkedCars />
      <BusStop night={night} busy={quality === 'high'} />
      {quality === 'high' && <ChaiCart night={night} />}
      <Furniture />
    </group>
  )
}
