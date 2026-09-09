import { useLayoutEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'
import WorldLabel from './WorldLabel'
import { zones, type Zone } from '../data/zones'

/* Buildings with instanced window grids that light up as evening falls. */

const winGeo = new THREE.BoxGeometry(1, 1, 0.06)

function WindowGrid({
  w, h, d, night, tint = '#ffd9a0', density = 0.62,
}: {
  w: number; h: number; d: number; night: number; tint?: string; density?: number
}) {
  const cols = Math.max(2, Math.floor(w / 2.1))
  const rows = Math.max(2, Math.floor((h - 2.4) / 2.3))
  const litRef = useRef<THREE.InstancedMesh>(null)
  const darkRef = useRef<THREE.InstancedMesh>(null)

  const cells = useMemo(() => {
    const out: { p: [number, number, number]; r: number; lit: boolean }[] = []
    const faces: { n: [number, number, number]; rot: number; span: number }[] = [
      { n: [0, 0, 1], rot: 0, span: w },
      { n: [0, 0, -1], rot: Math.PI, span: w },
      { n: [1, 0, 0], rot: Math.PI / 2, span: d },
      { n: [-1, 0, 0], rot: -Math.PI / 2, span: d },
    ]
    faces.forEach((f, fi) => {
      const c = Math.max(2, Math.floor(f.span / 2.1))
      for (let i = 0; i < c; i++) {
        for (let j = 0; j < rows; j++) {
          const u = (i + 0.5) / c - 0.5
          const y = 1.9 + j * 2.3
          const off = f.n[2] !== 0 ? d / 2 : w / 2
          const px = f.n[2] !== 0 ? u * f.span : f.n[0] * off
          const pz = f.n[2] !== 0 ? f.n[2] * off : u * f.span
          const seed = Math.sin((fi + 1) * 12.9898 + i * 78.233 + j * 37.719) * 43758.5453
          out.push({
            p: [px, y, pz],
            r: f.rot,
            lit: seed - Math.floor(seed) < density,
          })
        }
      }
    })
    return out
  }, [w, d, rows])

  const lit = useMemo(() => cells.filter((c) => c.lit), [cells])
  const dark = useMemo(() => cells.filter((c) => !c.lit), [cells])

  const litMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#20242c',
        emissive: new THREE.Color(tint),
        emissiveIntensity: 0,
        roughness: 0.24,
        metalness: 0.35,
      }),
    [tint],
  )
  const darkMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#151a22',
        roughness: 0.18,
        metalness: 0.55,
      }),
    [],
  )
  litMat.emissiveIntensity = 0.05 + night * 1.15

  const write = (ref: React.RefObject<THREE.InstancedMesh | null>, list: typeof cells) => {
    const m = ref.current
    if (!m) return
    const o = new THREE.Object3D()
    list.forEach((c, i) => {
      o.position.set(...c.p)
      o.rotation.set(0, c.r, 0)
      o.scale.set(1.35, 1.5, 1)
      o.updateMatrix()
      m.setMatrixAt(i, o.matrix)
    })
    m.instanceMatrix.needsUpdate = true
  }

  useLayoutEffect(() => {
    write(litRef, lit)
    write(darkRef, dark)
  }, [lit, dark])

  return (
    <group>
      <instancedMesh ref={litRef} args={[winGeo, litMat, Math.max(1, lit.length)]} />
      <instancedMesh ref={darkRef} args={[winGeo, darkMat, Math.max(1, dark.length)]} />
    </group>
  )
}

const concrete = new THREE.MeshStandardMaterial({ color: '#3c4149', roughness: 0.88 })
const concreteDark = new THREE.MeshStandardMaterial({ color: '#2b2f36', roughness: 0.9 })
const trimMat = new THREE.MeshStandardMaterial({ color: '#4c525b', roughness: 0.6, metalness: 0.3 })

export function ZoneBuilding({
  zone, night, done, active, quiet,
}: {
  zone: Zone; night: number; done: boolean; active: boolean; quiet: boolean
}) {
  const [w, h, d] = zone.size
  const facing = useMemo(() => {
    const dx = zone.door[0] - zone.pos[0]
    const dz = zone.door[1] - zone.pos[1]
    return Math.abs(dx) > Math.abs(dz) ? (dx > 0 ? 'east' : 'west') : dz > 0 ? 'south' : 'north'
  }, [zone])

  const signPos: [number, number, number] =
    facing === 'east'
      ? [w / 2 + 0.1, h * 0.62, 0]
      : facing === 'west'
        ? [-w / 2 - 0.1, h * 0.62, 0]
        : facing === 'south'
          ? [0, h * 0.62, d / 2 + 0.1]
          : [0, h * 0.62, -d / 2 - 0.1]

  // entrance sits in its own group whose local +z points out of the facade
  const entrance = useMemo<{ pos: [number, number, number]; rot: number }>(() => {
    if (facing === 'east') return { pos: [w / 2, 0, 0], rot: Math.PI / 2 }
    if (facing === 'west') return { pos: [-w / 2, 0, 0], rot: -Math.PI / 2 }
    if (facing === 'south') return { pos: [0, 0, d / 2], rot: 0 }
    return { pos: [0, 0, -d / 2], rot: Math.PI }
  }, [facing, w, d])

  const doorGlass = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#111922',
        emissive: new THREE.Color(zone.color),
        emissiveIntensity: 0.05,
        roughness: 0.12,
        metalness: 0.6,
      }),
    [zone.color],
  )
  const signMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#0d1117',
        emissive: new THREE.Color(zone.color),
        emissiveIntensity: 1,
        roughness: 0.4,
      }),
    [zone.color],
  )
  // mutate rather than rebuild: `night` ticks several times a second
  useLayoutEffect(() => {
    doorGlass.emissive.set(done ? '#4ade80' : zone.color)
    doorGlass.emissiveIntensity = (done ? 0.07 : active ? 0.09 : 0.035) + night * 0.5
    signMat.emissive.set(done ? '#4ade80' : zone.color)
    signMat.emissiveIntensity = (done ? 0.75 : active ? 1.05 : 0.55) + night * 1.9
  }, [doorGlass, signMat, done, active, night, zone.color])

  return (
    <group position={[zone.pos[0], 0, zone.pos[1]]}>
      {/* mass */}
      <mesh material={concrete} position={[0, h / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[w, h, d]} />
      </mesh>
      {/* base plinth */}
      <mesh material={concreteDark} position={[0, 0.35, 0]} receiveShadow>
        <boxGeometry args={[w + 0.7, 0.7, d + 0.7]} />
      </mesh>
      {/* roof trim + rooftop kit */}
      <mesh material={trimMat} position={[0, h + 0.22, 0]}>
        <boxGeometry args={[w + 0.5, 0.44, d + 0.5]} />
      </mesh>
      <mesh material={concreteDark} position={[w * 0.22, h + 1.1, -d * 0.18]} castShadow>
        <boxGeometry args={[2.4, 1.4, 2.2]} />
      </mesh>

      <WindowGrid w={w} h={h} d={d} night={night} />

      {/* entrance: recessed frame, twin glass doors, lit fascia, steps */}
      <group position={entrance.pos} rotation={[0, entrance.rot, 0]}>
        <mesh material={concreteDark} position={[0, 1.85, 0.14]} castShadow receiveShadow>
          <boxGeometry args={[5.1, 3.7, 0.36]} />
        </mesh>
        <mesh material={doorGlass} position={[-1.06, 1.52, 0.34]}>
          <boxGeometry args={[1.86, 2.84, 0.08]} />
        </mesh>
        <mesh material={doorGlass} position={[1.06, 1.52, 0.34]}>
          <boxGeometry args={[1.86, 2.84, 0.08]} />
        </mesh>
        <mesh material={trimMat} position={[0, 1.55, 0.4]}>
          <boxGeometry args={[0.16, 2.94, 0.14]} />
        </mesh>
        {/* lit fascia — the "this is the way in" cue */}
        <mesh material={signMat} position={[0, 3.28, 0.36]}>
          <boxGeometry args={[4.6, 0.3, 0.14]} />
        </mesh>
        {/* canopy */}
        <mesh material={trimMat} position={[0, 3.62, 1.15]} castShadow>
          <boxGeometry args={[5.6, 0.24, 2.6]} />
        </mesh>
        <mesh material={trimMat} position={[-2.6, 1.8, 2.3]} castShadow>
          <boxGeometry args={[0.16, 3.6, 0.16]} />
        </mesh>
        <mesh material={trimMat} position={[2.6, 1.8, 2.3]} castShadow>
          <boxGeometry args={[0.16, 3.6, 0.16]} />
        </mesh>
        {/* steps */}
        <mesh material={concreteDark} position={[0, 0.12, 1.05]} receiveShadow>
          <boxGeometry args={[6, 0.24, 2.1]} />
        </mesh>
      </group>

      {/* name plate */}
      <WorldLabel position={signPos} maxDist={54} hidden={quiet}>
        <div
          style={{
            fontFamily: '"JetBrains Mono", monospace',
            fontSize: '11px',
            letterSpacing: '0.16em',
            whiteSpace: 'nowrap',
            padding: '7px 13px',
            borderRadius: '6px',
            border: `1px solid ${done ? '#4ade8066' : zone.color + '66'}`,
            background: 'rgba(8,10,14,0.74)',
            color: done ? '#4ade80' : zone.color,
            textShadow: `0 0 14px ${done ? '#4ade8099' : zone.color + '99'}`,
            backdropFilter: 'blur(3px)',
          }}
        >
          {done ? '✓ ' : ''}
          {zone.label}
        </div>
      </WorldLabel>
    </group>
  )
}

/** Non-interactive background towers for depth. */
const farMat = new THREE.MeshStandardMaterial({
  color: '#272b33',
  emissive: new THREE.Color('#2c3550'),
  emissiveIntensity: 0,
  roughness: 0.9,
})

export function Skyline({ night }: { night: number }) {
  const towers = useMemo(() => {
    const out: { p: [number, number]; s: [number, number, number]; near: boolean }[] = []
    const rand = (i: number) => Math.abs((Math.sin(i * 12.9898) * 43758.5453) % 1)
    // two rings, so the horizon reads as a city from anywhere in the district
    const rings: [number, number, number][] = [
      [20, 58, 12], // count, radius, base height
      [16, 84, 20],
    ]
    let seed = 0
    rings.forEach(([count, radius, base], ri) => {
      for (let i = 0; i < count; i++) {
        seed += 1
        const a = (i / count) * Math.PI * 2 + ri * 0.31
        const r = radius + rand(seed) * 12
        const q = rand(seed + 99)
        out.push({
          p: [Math.cos(a) * r, Math.sin(a) * r],
          s: [9 + q * 8, base + q * 30, 9 + rand(seed + 7) * 7],
          near: ri === 0,
        })
      }
    })
    return out
  }, [])

  return (
    <group>
      {towers.map((t, i) => (
        <group key={i} position={[t.p[0], 0, t.p[1]]}>
          <mesh
            material={t.near ? concreteDark : farMat}
            position={[0, t.s[1] / 2, 0]}
            castShadow={t.near}
          >
            <boxGeometry args={t.s} />
          </mesh>
          {/* only the inner ring pays for window grids — the rest are silhouettes */}
          {t.near && (
            <WindowGrid w={t.s[0]} h={t.s[1]} d={t.s[2]} night={night} density={0.5} tint="#ffcf94" />
          )}
        </group>
      ))}
    </group>
  )
}

const FAR_DAY = new THREE.Color('#272b33')
const FAR_NIGHT = new THREE.Color('#1b2236')

function useFarTone(night: number) {
  farMat.color.copy(FAR_DAY).lerp(FAR_NIGHT, night)
  farMat.emissiveIntensity = night * 0.5
}

export function AllBuildings({
  night, completed, activeNear, quiet,
}: {
  night: number; completed: string[]; activeNear: string | null; quiet: boolean
}) {
  useFarTone(night)
  return (
    <group>
      {zones.map((z) => (
        <ZoneBuilding
          key={z.id}
          zone={z}
          night={night}
          done={completed.includes(z.id)}
          active={activeNear === z.id}
          quiet={quiet}
        />
      ))}
      <Skyline night={night} />
    </group>
  )
}
