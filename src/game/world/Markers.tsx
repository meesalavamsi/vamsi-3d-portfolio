import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import WorldLabel from './WorldLabel'
import * as THREE from 'three'
import { zones } from '../data/zones'
import { useGame } from '../state'

/* The glowing objective markers — a ring, a soft light shaft and a floating label. */

function Marker({
  at, color, label, order, done, near, quiet,
}: {
  at: [number, number]
  color: string
  label: string
  order: number
  done: boolean
  near: boolean
  quiet: boolean
}) {
  const ring = useRef<THREE.Mesh>(null)
  const beam = useRef<THREE.Mesh>(null)

  useFrame((s) => {
    const t = s.clock.elapsedTime
    if (ring.current) {
      const k = 1 + Math.sin(t * 2.1) * 0.07
      ring.current.scale.set(k, k, 1)
      ;(ring.current.material as THREE.MeshBasicMaterial).opacity = done
        ? 0.28
        : 0.5 + Math.sin(t * 2.1) * 0.18
    }
    if (beam.current) {
      // the shaft is a wayfinding hint — dim it once you have arrived
      const base = done ? 0.02 : near ? 0.02 : 0.055 + Math.sin(t * 1.6) * 0.02
      const m = beam.current.material as THREE.MeshBasicMaterial
      m.opacity += (base - m.opacity) * 0.08
    }
  })

  const c = done ? '#4ade80' : color

  return (
    <group position={[at[0], 0, at[1]]}>
      <mesh ref={ring} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.05, 0]}>
        <ringGeometry args={[1.5, 1.9, 40]} />
        <meshBasicMaterial color={c} transparent opacity={0.55} side={THREE.DoubleSide} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.04, 0]}>
        <circleGeometry args={[1.5, 32]} />
        <meshBasicMaterial color={c} transparent opacity={done ? 0.05 : 0.11} />
      </mesh>
      <mesh ref={beam} position={[0, 6.5, 0]}>
        <cylinderGeometry args={[2.6, 1.6, 13, 22, 1, true]} />
        <meshBasicMaterial
          color={c}
          transparent
          opacity={0.05}
          side={THREE.FrontSide}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* once you are standing on it the bottom prompt says the same thing */}
      <WorldLabel position={[0, 3.4, 0]} maxDist={98} hidden={quiet || near}>
        <div
          style={{
            fontFamily: '"JetBrains Mono", monospace',
            textAlign: 'center',
            whiteSpace: 'nowrap',
            transform: near ? 'translateY(-2px)' : 'none',
            transition: 'transform 0.25s',
          }}
        >
          <div
            style={{
              fontSize: '9px',
              letterSpacing: '0.2em',
              color: c,
              textShadow: `0 0 10px ${c}, 0 1px 6px rgba(0,0,0,0.9)`,
            }}
          >
            {done ? 'COMPLETE ✓' : `OBJECTIVE 0${order}`}
          </div>
          <div
            style={{
              marginTop: '3px',
              fontSize: '11px',
              color: '#fafaf9',
              textShadow: '0 2px 10px rgba(0,0,0,0.95), 0 0 3px rgba(0,0,0,0.9)',
            }}
          >
            {label}
          </div>
        </div>
      </WorldLabel>
    </group>
  )
}

export default function Markers({
  completed, near,
}: {
  completed: string[]
  near: string | null
}) {
  const phase = useGame((s) => s.phase)
  const quiet = phase !== 'playing'

  return (
    <group>
      {zones.map((z) => (
        <Marker
          key={z.id}
          at={z.door}
          color={z.color}
          label={z.sub}
          order={z.order}
          done={completed.includes(z.id)}
          near={near === z.id}
          quiet={quiet}
        />
      ))}
    </group>
  )
}
