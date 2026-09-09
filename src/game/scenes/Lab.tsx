import { useEffect, useMemo, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useGameStore, astraObservation } from '../gstore'
import { astraIntro } from '../story'

/** wall of flickering monitors */
function Screens() {
  const ref = useRef<THREE.Group>(null)
  const cells = useMemo(() => {
    const arr: { pos: [number, number, number]; color: string; speed: number }[] = []
    const palette = ['#4dd0ff', '#62d84e', '#f472b6', '#fbbf24', '#a78bfa']
    for (let r = 0; r < 5; r++)
      for (let c = 0; c < 10; c++)
        arr.push({ pos: [(c - 4.5) * 1.7, 1.5 + r * 1.3, -9], color: palette[Math.floor(Math.random() * palette.length)], speed: 0.5 + Math.random() * 3 })
    return arr
  }, [])
  useFrame(({ clock }) => {
    if (!ref.current) return
    ref.current.children.forEach((c, i) => {
      const m = (c as THREE.Mesh).material as THREE.MeshBasicMaterial
      m.opacity = 0.35 + Math.abs(Math.sin(clock.elapsedTime * cells[i].speed + i)) * 0.6
    })
  })
  return (
    <group ref={ref}>
      {cells.map((c, i) => (
        <mesh key={i} position={c.pos}>
          <planeGeometry args={[1.45, 1]} />
          <meshBasicMaterial color={c.color} transparent opacity={0.6} />
        </mesh>
      ))}
    </group>
  )
}

/** ASTRA — floating core */
function AstraCore() {
  const ref = useRef<THREE.Group>(null)
  useFrame(({ clock }) => {
    if (!ref.current) return
    ref.current.rotation.y = clock.elapsedTime * 0.5
    ref.current.position.y = 3 + Math.sin(clock.elapsedTime * 1.4) * 0.25
  })
  return (
    <group ref={ref} position={[0, 3, -4]}>
      <mesh>
        <icosahedronGeometry args={[0.9, 1]} />
        <meshStandardMaterial color="#0a0f1e" emissive="#ffffff" emissiveIntensity={1.6} wireframe />
      </mesh>
      <mesh scale={0.5}>
        <icosahedronGeometry args={[0.9, 0]} />
        <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={3} />
      </mesh>
      <pointLight color="#bcd6ff" intensity={40} distance={18} />
    </group>
  )
}

/** the big machine */
function Engine() {
  return (
    <group position={[0, 0, -7]}>
      <mesh position={[0, 2.2, 0]}>
        <cylinderGeometry args={[1.6, 2, 4.4, 24, 1, true]} />
        <meshStandardMaterial color="#0b1428" emissive="#62d84e" emissiveIntensity={0.5} wireframe />
      </mesh>
      <mesh position={[0, 4.8, 0]}>
        <torusGeometry args={[1.8, 0.12, 10, 40]} />
        <meshStandardMaterial color="#62d84e" emissive="#62d84e" emissiveIntensity={1.5} />
      </mesh>
    </group>
  )
}

export default function Lab() {
  const s = useGameStore()

  useEffect(() => {
    if (!s.metAstra) {
      const t = setTimeout(() => {
        s.set({ metAstra: true })
        s.say('ASTRA', [...astraIntro, '', astraObservation(s.memory)])
      }, 1500)
      return () => clearTimeout(t)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="absolute inset-0">
      <Canvas camera={{ position: [0, 3.2, 8], fov: 55 }} dpr={[1, 1.6]}>
        <color attach="background" args={['#030509']} />
        <fog attach="fog" args={['#030509', 12, 40]} />
        <ambientLight intensity={0.25} />
        <pointLight position={[0, 6, 4]} intensity={12} color="#4dd0ff" />
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[40, 40]} />
          <meshStandardMaterial color="#060a14" roughness={0.3} metalness={0.8} />
        </mesh>
        <Screens />
        <Engine />
        <AstraCore />
      </Canvas>
      <div className="absolute top-16 left-1/2 -translate-x-1/2 font-mono text-[10px] tracking-[0.4em] text-emerald-400/80">
        HUMAN SIMULATION ENGINE
      </div>
      {!s.dialogue && (
        <div className="absolute bottom-24 left-1/2 -translate-x-1/2 z-30 flex gap-4">
          <button
            onClick={() => s.set({ phase: 'worldmap' })}
            className="font-mono text-xs tracking-[0.3em] px-8 py-3.5 border border-emerald-400/60 text-emerald-300 hover:bg-emerald-400 hover:text-black transition-all"
          >
            [ SEE THE WORLDS ]
          </button>
        </div>
      )}
    </div>
  )
}
