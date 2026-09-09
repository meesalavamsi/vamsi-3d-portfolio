import { useEffect, useMemo, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Stars } from '@react-three/drei'
import * as THREE from 'three'
import { useGameStore } from '../gstore'
import { worldBeats } from '../story'

const configs: Record<string, { bg: string; fog: [string, number, number]; ground: string; accent: string; stars?: boolean }> = {
  ocean:   { bg: '#02101f', fog: ['#02101f', 6, 34], ground: '#03223d', accent: '#38bdf8' },
  desert:  { bg: '#150e04', fog: ['#150e04', 10, 46], ground: '#2a1c08', accent: '#fbbf24' },
  space:   { bg: '#010104', fog: ['#010104', 30, 90], ground: '#05050c', accent: '#a78bfa', stars: true },
  earth:   { bg: '#061006', fog: ['#061006', 8, 40], ground: '#0a1c0a', accent: '#4ade80' },
  digital: { bg: '#0c0212', fog: ['#0c0212', 8, 36], ground: '#14041e', accent: '#f472b6' },
}

function Scenery({ world, accent }: { world: string; accent: string }) {
  const ref = useRef<THREE.Group>(null)
  useFrame(({ clock }) => {
    if (ref.current && world === 'digital') {
      ref.current.children.forEach((c, i) => {
        c.position.y = (c.userData.baseY as number) + Math.sin(clock.elapsedTime * 0.8 + i) * 1.6
        c.rotation.y = clock.elapsedTime * 0.2 + i
      })
    }
  })

  const items = useMemo(() => {
    const n = world === 'space' ? 26 : 18
    return Array.from({ length: n }, (_, i) => ({
      pos: [(Math.random() - 0.5) * 50, world === 'space' || world === 'digital' ? Math.random() * 16 : 0, (Math.random() - 0.5) * 50] as [number, number, number],
      scale: 0.5 + Math.random() * (world === 'desert' ? 5 : 2.5),
      rot: Math.random() * Math.PI,
      i,
    }))
  }, [world])

  return (
    <group ref={ref}>
      {items.map((it) => {
        const h = it.scale * (world === 'desert' ? 2 : 3)
        return (
          <mesh key={it.i} position={[it.pos[0], it.pos[1] === 0 ? h / 2 : it.pos[1], it.pos[2]]} rotation={[0, it.rot, 0]}
            userData={{ baseY: it.pos[1] === 0 ? h / 2 : it.pos[1] }}>
            {world === 'ocean' && <coneGeometry args={[it.scale, h, 6]} />}
            {world === 'desert' && <coneGeometry args={[it.scale * 1.4, h, 4]} />}
            {world === 'space' && <dodecahedronGeometry args={[it.scale * 0.5]} />}
            {world === 'earth' && <boxGeometry args={[it.scale, h * 0.7, it.scale]} />}
            {world === 'digital' && <boxGeometry args={[it.scale, it.scale, it.scale]} />}
            <meshStandardMaterial
              color="#0a0f1c" emissive={accent} emissiveIntensity={world === 'digital' ? 0.7 : 0.25}
              wireframe={world === 'digital'} roughness={0.5} metalness={0.6}
              transparent opacity={world === 'digital' ? 0.85 : 1}
            />
          </mesh>
        )
      })}
      {/* the object of interest */}
      <mesh position={[0, 1.6, -6]}>
        <octahedronGeometry args={[0.5]} />
        <meshStandardMaterial color={accent} emissive={accent} emissiveIntensity={3} />
      </mesh>
      <pointLight position={[0, 2, -6]} color={accent} intensity={16} distance={14} />
      {world === 'earth' && (
        <mesh position={[0, 3, -18]}>
          <boxGeometry args={[8, 6, 1]} />
          <meshStandardMaterial color="#101c10" emissive="#4ade80" emissiveIntensity={0.15} roughness={0.9} />
        </mesh>
      )}
    </group>
  )
}

function Bubbles({ show }: { show: boolean }) {
  const ref = useRef<THREE.Points>(null)
  const pos = useMemo(() => {
    const a = new Float32Array(300)
    for (let i = 0; i < 100; i++) { a[i * 3] = (Math.random() - 0.5) * 40; a[i * 3 + 1] = Math.random() * 16; a[i * 3 + 2] = (Math.random() - 0.5) * 40 }
    return a
  }, [])
  useFrame(({ clock }) => { if (ref.current) ref.current.rotation.y = clock.elapsedTime * 0.03 })
  if (!show) return null
  return (
    <points ref={ref}>
      <bufferGeometry><bufferAttribute attach="attributes-position" args={[pos, 3]} /></bufferGeometry>
      <pointsMaterial size={0.12} color="#7dd3fc" transparent opacity={0.6} />
    </points>
  )
}

export default function Worlds() {
  const s = useGameStore()
  const world = s.world ?? 'ocean'
  const cfg = configs[world] ?? configs.ocean
  const beat = worldBeats[world]

  useEffect(() => {
    s.visitWorld(world)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [world])

  useEffect(() => {
    if (world === 'digital') s.doGlitch(1600)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [world])

  const inspect = () => {
    if (!beat) return
    s.addSecret(beat.secret)
    s.say(beat.speaker, beat.lines)
  }

  const done = beat ? s.memory.secrets.includes(beat.secret) : false

  return (
    <div className="absolute inset-0">
      <Canvas camera={{ position: [0, 4, 10], fov: 55 }} dpr={[1, 1.6]}>
        <color attach="background" args={[cfg.bg]} />
        <fog attach="fog" args={cfg.fog} />
        <ambientLight intensity={0.3} />
        <pointLight position={[6, 10, 6]} intensity={20} color={cfg.accent} />
        {cfg.stars && <Stars radius={60} depth={30} count={3000} factor={3} fade speed={0.4} />}
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[100, 100]} />
          <meshStandardMaterial color={cfg.ground} roughness={0.6} metalness={0.4} />
        </mesh>
        <Scenery world={world} accent={cfg.accent} />
        <Bubbles show={world === 'ocean'} />
      </Canvas>

      {/* header */}
      <div className="absolute top-16 left-1/2 -translate-x-1/2 text-center z-20">
        <div className="font-mono text-[10px] tracking-[0.4em] text-white/50">WORLD {world === 'ocean' ? '02' : world === 'desert' ? '03' : world === 'space' ? '04' : world === 'earth' ? '05' : '06'}</div>
        <div className="font-mono text-lg tracking-[0.3em] text-white mt-1" style={{ textShadow: `0 0 20px ${cfg.accent}` }}>
          {world.toUpperCase()}
        </div>
      </div>

      {!s.dialogue && (
        <div className="absolute bottom-20 left-1/2 -translate-x-1/2 z-30 flex flex-wrap justify-center gap-3 px-4">
          {!done && (
            <button onClick={inspect}
              className="font-mono text-xs tracking-[0.25em] px-7 py-3.5 border transition-all hover:text-black"
              style={{ borderColor: cfg.accent, color: cfg.accent }}
              onMouseEnter={(e) => (e.currentTarget.style.background = cfg.accent)}
              onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}>
              [ EXAMINE {beat?.objectLabel?.toUpperCase() ?? 'SIGNAL'} ]
            </button>
          )}
          <button onClick={() => s.set({ phase: 'worldmap', world: null })}
            className="font-mono text-xs tracking-[0.25em] px-7 py-3.5 border border-white/30 text-white/80 hover:bg-white hover:text-black transition-all">
            [ RETURN ]
          </button>
        </div>
      )}
    </div>
  )
}
