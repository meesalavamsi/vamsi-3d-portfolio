import { useRef, useState, useMemo, useEffect } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Html, Stars } from '@react-three/drei'
import * as THREE from 'three'
import { locations, type LocationId } from '../data/resume'
import { useGame, isUnlocked } from '../store/gameStore'
import { sfx } from '../utils/sound'
import { Particles, GridFloor, Avatar } from './Effects'

const WORLD_MIN = -24
const WORLD_MAX = 24
const INTERACT_DIST = 5.5

function Building({ id }: { id: LocationId }) {
  const loc = locations.find((l) => l.id === id)!
  const group = useRef<THREE.Group>(null)
  const core = useRef<THREE.Mesh>(null)
  const [hovered, setHovered] = useState(false)
  const visited = useGame((s) => s.visited.includes(id))
  const unlocked = useGame((s) => isUnlocked(id, s.visited))
  const enterLocation = useGame((s) => s.enterLocation)
  const soundOn = useGame((s) => s.soundOn)

  useFrame(({ clock }) => {
    if (group.current) group.current.position.y = Math.sin(clock.elapsedTime * 0.8 + loc.pos[0]) * 0.15
    if (core.current) {
      const m = core.current.material as THREE.MeshStandardMaterial
      m.emissiveIntensity = hovered ? 2.4 : visited ? 1.5 : unlocked ? 0.9 : 0.15
    }
  })

  const dims: [number, number, number] = useMemo(() => {
    const h = id === 'servicenow' ? 6 : id === 'projects' ? 4 : 3.4
    return [3.4, h, 3.4]
  }, [id])

  const dim = unlocked ? loc.color : '#2a3550'

  return (
    <group position={loc.pos}>
      <group ref={group}>
        <mesh
          ref={core}
          position={[0, dims[1] / 2, 0]}
          onClick={(e) => { e.stopPropagation(); if (soundOn) unlocked ? sfx.open() : sfx.error(); enterLocation(id) }}
          onPointerOver={(e) => { e.stopPropagation(); setHovered(true); if (soundOn) sfx.hover(); document.body.style.cursor = 'pointer' }}
          onPointerOut={() => { setHovered(false); document.body.style.cursor = 'default' }}
          scale={hovered ? 1.06 : 1}
        >
          <boxGeometry args={dims} />
          <meshStandardMaterial
            color={unlocked ? '#0b1428' : '#0a0f1c'}
            emissive={dim}
            emissiveIntensity={0.9}
            roughness={0.25}
            metalness={0.8}
            transparent
            opacity={unlocked ? 1 : 0.85}
          />
        </mesh>
        {/* wireframe shell */}
        <mesh position={[0, dims[1] / 2, 0]} scale={1.02}>
          <boxGeometry args={dims} />
          <meshBasicMaterial color={dim} wireframe transparent opacity={hovered ? 0.9 : 0.4} />
        </mesh>
        {/* beacon */}
        {unlocked && (
          <mesh position={[0, dims[1] + 1.2, 0]}>
            <octahedronGeometry args={[0.35]} />
            <meshStandardMaterial color={loc.color} emissive={loc.color} emissiveIntensity={3} />
          </mesh>
        )}
        {unlocked && <pointLight color={loc.color} intensity={hovered ? 30 : 12} distance={16} position={[0, dims[1] + 1, 0]} />}
      </group>
      <Html position={[0, dims[1] + 2.2, 0]} center distanceFactor={26} zIndexRange={[10, 0]}>
        <div
          role="button"
          tabIndex={0}
          onClick={() => { if (soundOn) unlocked ? sfx.open() : sfx.error(); enterLocation(id) }}
          onKeyDown={(e) => { if (e.key === 'Enter') { if (soundOn) sfx.open(); enterLocation(id) } }}
          className={`select-none whitespace-nowrap px-3 py-1.5 text-[11px] tracking-[0.2em] transition-all cursor-pointer ${
            hovered ? 'glass-strong text-white scale-110' : 'glass text-cyan-200/80'
          }`}
          style={{ borderColor: unlocked ? loc.color : 'rgba(80,90,120,0.4)' }}
        >
          {loc.icon} {loc.name.toUpperCase()} {!unlocked && '🔒'}
          {visited && <span className="ml-2 text-emerald-400">✓</span>}
        </div>
      </Html>
    </group>
  )
}

/** Smoothly moves the camera to a target view. */
function CameraRig({ target, lookAt }: { target: [number, number, number]; lookAt: [number, number, number] }) {
  const { camera } = useThree()
  const vec = useMemo(() => new THREE.Vector3(), [])
  const look = useMemo(() => new THREE.Vector3(...lookAt), [lookAt])
  useFrame(() => {
    vec.set(...target)
    if (camera.position.distanceTo(vec) > 0.02) {
      camera.position.lerp(vec, 0.045)
      camera.lookAt(look)
    }
  })
  return null
}

/** Keyboard-driven player that walks the map. */
function PlayerController({ onNear }: { onNear: (id: LocationId | null) => void }) {
  const [pos, setPos] = useState<[number, number, number]>([0, 0, 8])
  const keys = useRef<Record<string, boolean>>({})
  const reducedMotion = useGame((s) => s.reducedMotion)
  const enterLocation = useGame((s) => s.enterLocation)
  const soundOn = useGame((s) => s.soundOn)
  const nearRef = useRef<LocationId | null>(null)

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      keys.current[e.key.toLowerCase()] = true
      if (e.key.toLowerCase() === 'e' && nearRef.current) {
        if (soundOn) sfx.open()
        enterLocation(nearRef.current)
      }
    }
    const up = (e: KeyboardEvent) => { keys.current[e.key.toLowerCase()] = false }
    window.addEventListener('keydown', down)
    window.addEventListener('keyup', up)
    return () => { window.removeEventListener('keydown', down); window.removeEventListener('keyup', up) }
  }, [enterLocation, soundOn])

  useFrame((_, dt) => {
    if (reducedMotion) return
    const speed = 14 * Math.min(dt, 0.05)
    let [x, y, z] = pos
    if (keys.current['w'] || keys.current['arrowup']) z -= speed
    if (keys.current['s'] || keys.current['arrowdown']) z += speed
    if (keys.current['a'] || keys.current['arrowleft']) x -= speed
    if (keys.current['d'] || keys.current['arrowright']) x += speed
    x = THREE.MathUtils.clamp(x, WORLD_MIN, WORLD_MAX)
    z = THREE.MathUtils.clamp(z, WORLD_MIN, WORLD_MAX)
    if (x !== pos[0] || z !== pos[2]) setPos([x, y, z])

    let nearest: LocationId | null = null
    let best = INTERACT_DIST
    for (const loc of locations) {
      const d = Math.hypot(loc.pos[0] - x, loc.pos[2] - z)
      if (d < best) { best = d; nearest = loc.id }
    }
    if (nearest !== nearRef.current) { nearRef.current = nearest; onNear(nearest) }
  })

  return <Avatar position={pos} />
}

export default function WorldMap({ onNear }: { onNear: (id: LocationId | null) => void }) {
  const isMobile = useGame((s) => s.isMobile)
  return (
    <Canvas
      camera={{ position: [0, 26, 40], fov: 50 }}
      dpr={[1, 1.75]}
      gl={{ antialias: true, powerPreference: 'high-performance' }}
    >
      <color attach="background" args={['#05060e']} />
      <fog attach="fog" args={['#05060e', 45, 110]} />
      <ambientLight intensity={0.25} />
      <directionalLight position={[20, 30, 10]} intensity={0.7} color="#9db8ff" />
      <Stars radius={90} depth={40} count={2200} factor={3.5} saturation={0.6} fade speed={0.6} />
      <Particles count={isMobile ? 120 : 350} />
      <GridFloor />
      {locations.map((l) => <Building key={l.id} id={l.id} />)}
      {!isMobile && <PlayerController onNear={onNear} />}
      <CameraRig target={[0, isMobile ? 34 : 26, isMobile ? 48 : 40]} lookAt={[0, 0, 0]} />
    </Canvas>
  )
}
