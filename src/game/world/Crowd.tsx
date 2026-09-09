import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import Human, { makeLook } from './Human'

/* Pedestrians that actually walk a route and turn to face where they're going. */

type Route = [number, number][]

function Pedestrian({ route, speed, seed }: { route: Route; speed: number; seed: number }) {
  const g = useRef<THREE.Group>(null)
  const look = useMemo(() => makeLook(seed), [seed])
  const pts = useMemo(() => route.map(([x, z]) => new THREE.Vector2(x, z)), [route])
  const state = useRef({ i: Math.floor((seed * 7) % route.length), t: (seed * 13) % 1 })
  const yaw = useRef(0)

  useFrame((_, dt) => {
    if (!g.current) return
    const d = Math.min(dt, 0.05)
    const s = state.current
    const a = pts[s.i]
    const b = pts[(s.i + 1) % pts.length]
    const seg = a.distanceTo(b)
    s.t += (speed * d) / Math.max(seg, 0.001)
    while (s.t >= 1) {
      s.t -= 1
      s.i = (s.i + 1) % pts.length
    }
    const p = pts[s.i]
    const q = pts[(s.i + 1) % pts.length]
    const x = p.x + (q.x - p.x) * s.t
    const z = p.y + (q.y - p.y) * s.t
    g.current.position.set(x, 0, z)

    const target = Math.atan2(q.x - p.x, q.y - p.y)
    let diff = target - yaw.current
    while (diff > Math.PI) diff -= Math.PI * 2
    while (diff < -Math.PI) diff += Math.PI * 2
    yaw.current += diff * Math.min(1, d * 5)
    g.current.rotation.y = yaw.current
  })

  return (
    <group ref={g}>
      <Human
        look={look}
        gait={1}
        tempo={0.85 + speed * 0.16}
        phase={seed * 6.28}
        castShadow={false}
        detail={false}
      />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.03, 0]}>
        <circleGeometry args={[0.4, 14]} />
        <meshBasicMaterial color="#000" transparent opacity={0.22} />
      </mesh>
    </group>
  )
}

/** Two people standing in conversation, gesturing. */
function Chatting({ at, seed }: { at: [number, number]; seed: number }) {
  const a = useMemo(() => makeLook(seed), [seed])
  const b = useMemo(() => makeLook(seed + 91), [seed])
  return (
    <group position={[at[0], 0, at[1]]}>
      <group position={[-0.42, 0, 0]} rotation={[0, Math.PI / 2 + 0.14, 0]}>
        <Human look={a} gait={0} talking phase={seed} castShadow={false} detail={false} />
      </group>
      <group position={[0.42, 0, 0]} rotation={[0, -Math.PI / 2 - 0.1, 0]}>
        <Human look={b} gait={0} talking phase={seed + 2.2} castShadow={false} detail={false} />
      </group>
    </group>
  )
}

/** Someone sitting on a bench. */
function Sitting({ at, rot, seed }: { at: [number, number]; rot: number; seed: number }) {
  const look = useMemo(() => makeLook(seed), [seed])
  return (
    <group position={[at[0], 0, at[1]]} rotation={[0, rot, 0]}>
      <group position={[0, -0.42, 0]}>
        <Human look={look} gait={0} phase={seed} detail={false} />
      </group>
    </group>
  )
}

// Sidewalk loops around the plaza and along the main avenues
const ROUTES: Route[] = [
  [[-16, -10], [16, -10], [16, 12], [-16, 12]],
  [[-26, 4], [-8, 4], [-8, 22], [-26, 22]],
  [[8, -28], [26, -28], [26, -12], [8, -12]],
  [[-4, 26], [22, 26], [22, 34], [-4, 34]],
  [[28, 2], [40, 2], [40, 18], [28, 18]],
]

export default function Crowd({ density = 1 }: { density?: number }) {
  const people = useMemo(() => {
    const out: { route: Route; speed: number; seed: number }[] = []
    ROUTES.forEach((route, ri) => {
      const n = Math.max(1, Math.round((ri === 0 ? 5 : 3) * density))
      for (let i = 0; i < n; i++) {
        out.push({
          route,
          speed: 1.15 + ((i * 37 + ri * 11) % 9) * 0.075,
          seed: ri * 100 + i * 17 + 3,
        })
      }
    })
    return out
  }, [density])

  const groups = useMemo(
    () =>
      (
        [
          [-3.4, 6.2],
          [11.5, -6.5],
          [-19, 15],
          [20, 24],
        ] as [number, number][]
      ).slice(0, Math.max(1, Math.round(4 * density))),
    [density],
  )

  return (
    <group>
      {people.map((p, i) => (
        <Pedestrian key={i} {...p} />
      ))}
      {groups.map((at, i) => (
        <Chatting key={`c${i}`} at={at} seed={i * 53 + 9} />
      ))}
      {density > 0.6 && (
        <>
          <Sitting at={[-9.2, 9.6]} rot={0} seed={71} />
          <Sitting at={[9.4, 9.6]} rot={Math.PI} seed={88} />
        </>
      )}
    </group>
  )
}
