import { useMemo, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { scrollState, STEP } from './world'

const HERO_END = STEP * 5
const lerp = THREE.MathUtils.lerp

/* ── sky + light follow the scroll ─────────────────────── */
const skyKeys = [
  { p: 0.0, bg: new THREE.Color('#2b1a3a'), fog: new THREE.Color('#3a2547'), sun: new THREE.Color('#ffb347'), amb: 0.55 },
  { p: 0.2, bg: new THREE.Color('#7ec8e3'), fog: new THREE.Color('#a8d8ea'), sun: new THREE.Color('#fff3d6'), amb: 0.8 },
  { p: 0.45, bg: new THREE.Color('#87ceeb'), fog: new THREE.Color('#bfe3f0'), sun: new THREE.Color('#ffffff'), amb: 0.9 },
  { p: 0.65, bg: new THREE.Color('#e8956b'), fog: new THREE.Color('#e8b48b'), sun: new THREE.Color('#ffd27d'), amb: 0.7 },
  { p: 0.85, bg: new THREE.Color('#1a2340'), fog: new THREE.Color('#232f4d'), sun: new THREE.Color('#ff9a6b'), amb: 0.5 },
  { p: 1.0, bg: new THREE.Color('#070b1e'), fog: new THREE.Color('#0b1026'), sun: new THREE.Color('#8fb4ff'), amb: 0.4 },
]

function SkyRig() {
  const sunRef = useRef<THREE.DirectionalLight>(null)
  const ambRef = useRef<THREE.AmbientLight>(null)
  const hemiRef = useRef<THREE.HemisphereLight>(null)
  const tmp = useMemo(() => ({ c1: new THREE.Color(), c2: new THREE.Color() }), [])

  useFrame(({ scene }) => {
    const p = scrollState.p
    let a = skyKeys[0], b = skyKeys[skyKeys.length - 1]
    for (let i = 0; i < skyKeys.length - 1; i++) {
      if (p >= skyKeys[i].p && p <= skyKeys[i + 1].p) { a = skyKeys[i]; b = skyKeys[i + 1]; break }
    }
    const t = THREE.MathUtils.clamp((p - a.p) / (b.p - a.p || 1), 0, 1)
    tmp.c1.lerpColors(a.bg, b.bg, t)
    tmp.c2.lerpColors(a.fog, b.fog, t)
    scene.background = tmp.c1
    if (scene.fog) (scene.fog as THREE.Fog).color.copy(tmp.c2)
    if (sunRef.current) {
      sunRef.current.color.lerpColors(a.sun, b.sun, t)
      sunRef.current.intensity = lerp(a.amb, b.amb, t) * 1.6
      // sun arcs across the sky
      const ang = lerp(0.15, Math.PI - 0.3, p)
      sunRef.current.position.set(Math.cos(ang) * 40, Math.sin(ang) * 30 + 4, 14)
    }
    if (ambRef.current) ambRef.current.intensity = lerp(a.amb, b.amb, t) * 0.55
    if (hemiRef.current) hemiRef.current.intensity = lerp(a.amb, b.amb, t) * 0.5
  })
  return (
    <>
      <fog attach="fog" args={['#3a2547', 25, 95]} />
      <ambientLight ref={ambRef} intensity={0.3} />
      <hemisphereLight ref={hemiRef} args={['#bcd8ff', '#3d2b1f', 0.4]} />
      <directionalLight ref={sunRef} position={[40, 10, 14]} intensity={1} castShadow={false} />
    </>
  )
}

/* ── hero ─────────────────────────────────────────────── */
function Hero() {
  const g = useRef<THREE.Group>(null)
  const bodyRef = useRef<THREE.Group>(null)
  const lastX = useRef(0)
  useFrame(({ clock }) => {
    if (!g.current) return
    const x = scrollState.p * HERO_END
    const moving = Math.abs(x - lastX.current) > 0.001
    lastX.current = x
    g.current.position.x = x
    g.current.position.z = 2.5
    if (bodyRef.current) {
      bodyRef.current.position.y = moving ? Math.abs(Math.sin(clock.elapsedTime * 9)) * 0.18 : Math.sin(clock.elapsedTime * 2) * 0.04
      bodyRef.current.rotation.z = moving ? Math.sin(clock.elapsedTime * 9) * 0.06 : 0
    }
  })
  return (
    <group ref={g}>
      <group ref={bodyRef}>
        {/* body */}
        <mesh position={[0, 0.95, 0]}><capsuleGeometry args={[0.34, 0.85, 6, 12]} /><meshStandardMaterial color="#3b5bdb" roughness={0.6} flatShading /></mesh>
        {/* head */}
        <mesh position={[0, 1.85, 0]}><sphereGeometry args={[0.3, 14, 12]} /><meshStandardMaterial color="#f2c99b" roughness={0.7} flatShading /></mesh>
        {/* backpack */}
        <mesh position={[0, 1.05, -0.38]}><boxGeometry args={[0.5, 0.6, 0.28]} /><meshStandardMaterial color="#e8590c" roughness={0.7} flatShading /></mesh>
      </group>
      {/* shadow blob */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
        <circleGeometry args={[0.55, 20]} />
        <meshBasicMaterial color="#000000" transparent opacity={0.25} />
      </mesh>
    </group>
  )
}

/* ── camera follows the hero ───────────────────────────── */
function CameraRig() {
  useFrame(({ camera }) => {
    const x = scrollState.p * HERO_END
    camera.position.lerp(new THREE.Vector3(x - 1.5, 4.6, 13.5), 0.08)
    camera.lookAt(x + 2.5, 2.2, 0)
  })
  return null
}

/* ── biome builders ────────────────────────────────────── */
const rand = (seed: number) => { let x = Math.sin(seed) * 10000; return x - Math.floor(x) }

function Tree({ x, z, s = 1, leaf = '#2f9e44', orb }: { x: number; z: number; s?: number; leaf?: string; orb?: string }) {
  return (
    <group position={[x, 0, z]} scale={s}>
      <mesh position={[0, 0.9, 0]}><cylinderGeometry args={[0.14, 0.2, 1.8, 6]} /><meshStandardMaterial color="#795548" flatShading /></mesh>
      <mesh position={[0, 2.4, 0]}><coneGeometry args={[1.15, 2.4, 7]} /><meshStandardMaterial color={leaf} flatShading roughness={0.8} /></mesh>
      {orb && (
        <>
          <mesh position={[0.5, 2.6, 0.3]}><sphereGeometry args={[0.16, 8, 8]} /><meshStandardMaterial color={orb} emissive={orb} emissiveIntensity={2} /></mesh>
          <pointLight position={[0.5, 2.6, 0.3]} color={orb} intensity={2.5} distance={6} />
        </>
      )}
    </group>
  )
}

function House({ x, z, c = '#e8b88a', r = '#a54b2a' }: { x: number; z: number; c?: string; r?: string }) {
  return (
    <group position={[x, 0, z]}>
      <mesh position={[0, 1.1, 0]}><boxGeometry args={[2.6, 2.2, 2.2]} /><meshStandardMaterial color={c} flatShading roughness={0.9} /></mesh>
      <mesh position={[0, 2.75, 0]} rotation={[0, Math.PI / 4, 0]}><coneGeometry args={[2.1, 1.3, 4]} /><meshStandardMaterial color={r} flatShading /></mesh>
      <mesh position={[0, 0.9, 1.12]}><boxGeometry args={[0.5, 1.1, 0.06]} /><meshStandardMaterial color="#5d4037" /></mesh>
    </group>
  )
}

function Building({ x, z, w, h, d, c = '#5b7bb4', glow }: { x: number; z: number; w: number; h: number; d: number; c?: string; glow?: string }) {
  return (
    <group position={[x, 0, z]}>
      <mesh position={[0, h / 2, 0]}>
        <boxGeometry args={[w, h, d]} />
        <meshStandardMaterial color={c} flatShading roughness={0.5} metalness={0.3} />
      </mesh>
      {glow && (
        <>
          <mesh position={[0, h * 0.55, d / 2 + 0.02]}><planeGeometry args={[w * 0.7, h * 0.35]} /><meshBasicMaterial color={glow} transparent opacity={0.85} /></mesh>
          <pointLight position={[0, h * 0.6, d]} color={glow} intensity={6} distance={16} />
        </>
      )}
    </group>
  )
}

function Clouds() {
  const ref = useRef<THREE.Group>(null)
  const clouds = useMemo(() => Array.from({ length: 16 }, (_, i) => ({
    x: rand(i * 7) * 640 - 20, y: 12 + rand(i * 3) * 8, z: -18 - rand(i * 5) * 20,
    s: 1.4 + rand(i * 11) * 2.2, v: 0.2 + rand(i * 13) * 0.5,
  })), [])
  useFrame(({ clock }) => {
    if (!ref.current) return
    ref.current.children.forEach((c, i) => {
      const cl = clouds[i]
      c.position.x = cl.x + ((clock.elapsedTime * cl.v) % 700)
    })
  })
  return (
    <group ref={ref}>
      {clouds.map((c, i) => (
        <group key={i} position={[c.x, c.y, c.z]} scale={c.s}>
          <mesh><sphereGeometry args={[0.9, 8, 6]} /><meshStandardMaterial color="#ffffff" flatShading transparent opacity={0.85} /></mesh>
          <mesh position={[0.9, 0.15, 0]}><sphereGeometry args={[0.65, 8, 6]} /><meshStandardMaterial color="#f4f7fb" flatShading transparent opacity={0.85} /></mesh>
          <mesh position={[-0.85, 0.1, 0]}><sphereGeometry args={[0.6, 8, 6]} /><meshStandardMaterial color="#eef3f9" flatShading transparent opacity={0.85} /></mesh>
        </group>
      ))}
    </group>
  )
}

function Stars({ visible }: { visible: boolean }) {
  const geo = useMemo(() => {
    const n = 400
    const pos = new Float32Array(n * 3)
    for (let i = 0; i < n; i++) {
      pos[i * 3] = rand(i * 3) * 700 - 30
      pos[i * 3 + 1] = 8 + rand(i * 7) * 40
      pos[i * 3 + 2] = -20 - rand(i * 9) * 40
    }
    const g = new THREE.BufferGeometry()
    g.setAttribute('position', new THREE.BufferAttribute(pos, 3))
    return g
  }, [])
  const mat = useRef<THREE.PointsMaterial>(null)
  useFrame(() => {
    if (mat.current) mat.current.opacity = THREE.MathUtils.clamp((scrollState.p - 0.8) / 0.2, 0, 1) * 0.9
  })
  return (
    <points geometry={geo}>
      <pointsMaterial ref={mat} size={0.16} color="#ffffff" transparent opacity={0} sizeAttenuation />
    </points>
  )
}

/* ── the world, laid out along X ───────────────────────── */
function World() {
  const trees1 = useMemo(() => Array.from({ length: 14 }, (_, i) => ({ x: -18 + rand(i) * 100, z: -4 - rand(i * 2) * 10, s: 0.7 + rand(i * 3) * 0.8 })), [])
  const forest = useMemo(() => Array.from({ length: 30 }, (_, i) => ({
    x: STEP * 2 - 25 + rand(i * 17) * 80, z: -6 + rand(i * 19) * 16, s: 0.8 + rand(i * 23) * 1.1,
    orb: i % 3 === 0 ? ['#4dd0ff', '#a78bfa', '#62d84e', '#fbbf24'][i % 4] : undefined,
  })), [])
  const cityFill = useMemo(() => Array.from({ length: 14 }, (_, i) => ({
    x: STEP * 3 - 22 + rand(i * 29) * 90, z: -8 - rand(i * 31) * 8, w: 2 + rand(i) * 2, h: 4 + rand(i * 37) * 9, d: 2 + rand(i * 41) * 2,
  })), [])
  const towers = useMemo(() => Array.from({ length: 8 }, (_, i) => ({
    x: STEP * 4 - 16 + i * 9 + rand(i * 43) * 3, z: -8 - rand(i * 47) * 6, h: 12 + rand(i * 53) * 14,
  })), [])

  return (
    <group>
      {/* ground */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[HERO_END / 2, -0.01, 0]}>
        <planeGeometry args={[HERO_END + 300, 90]} />
        <meshStandardMaterial color="#4c8a3f" roughness={1} flatShading />
      </mesh>
      {/* path */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[HERO_END / 2, 0.01, 2.5]}>
        <planeGeometry args={[HERO_END + 300, 2.4]} />
        <meshStandardMaterial color="#cbb26a" roughness={1} />
      </mesh>

      {/* 0 · village */}
      <House x={-6} z={-3} />
      <House x={8} z={-6} c="#f2d5a0" />
      <House x={22} z={-2} c="#e8c39e" r="#7d4b2a" />
      {trees1.map((t, i) => <Tree key={i} x={t.x} z={t.z} s={t.s} />)}

      {/* 1 · university */}
      <group position={[STEP, 0, -4]}>
        <mesh position={[0, 3.4, 0]}><boxGeometry args={[16, 6.8, 5]} /><meshStandardMaterial color="#d8c9a8" flatShading roughness={0.9} /></mesh>
        {[-6, -3, 0, 3, 6].map((px) => (
          <mesh key={px} position={[px, 2.6, 2.6]}><cylinderGeometry args={[0.35, 0.35, 5.2, 8]} /><meshStandardMaterial color="#efe6cd" flatShading /></mesh>
        ))}
        <mesh position={[0, 7.6, 0]}><boxGeometry args={[17, 1.2, 5.6]} /><meshStandardMaterial color="#8d6e4a" flatShading /></mesh>
        <mesh position={[0, 9.2, 0]}><coneGeometry args={[2, 2.4, 4]} /><meshStandardMaterial color="#a54b2a" flatShading /></mesh>
      </group>

      {/* 2 · skill forest */}
      {forest.map((t, i) => <Tree key={i} x={t.x} z={t.z} s={t.s} orb={t.orb} leaf={t.orb ? '#1f7a38' : '#2f9e44'} />)}

      {/* 3 · project city */}
      {cityFill.map((b, i) => <Building key={i} x={b.x} z={b.z} w={b.w} h={b.h} d={b.d} c="#6b7f9e" />)}
      <Building x={STEP * 3 - 8} z={-4} w={4} h={13} d={4} c="#8a6d1f" glow="#fbbf24" />
      <Building x={STEP * 3 + 4} z={-5} w={4.5} h={16} d={4} c="#1f4d2a" glow="#62d84e" />
      <Building x={STEP * 3 + 16} z={-4} w={4} h={12} d={4} c="#5e2430" glow="#ff4d5e" />
      <Building x={STEP * 3 + 28} z={-5} w={4.5} h={15} d={4} c="#3d2a5e" glow="#a78bfa" />

      {/* 4 · corporate towers */}
      {towers.map((t, i) => (
        <Building key={i} x={t.x} z={t.z} w={5} h={t.h} d={5} c={i === 3 ? '#1f6b3a' : '#43597e'} glow={i === 3 ? '#62d84e' : undefined} />
      ))}

      {/* 5 · horizon — mountains + monument */}
      {[0, 1, 2].map((i) => (
        <mesh key={i} position={[STEP * 5 + 6 + i * 16, 6, -22 - i * 4]}>
          <coneGeometry args={[14, 14 + i * 4, 5]} />
          <meshStandardMaterial color={['#5a6b8c', '#48587a', '#374766'][i]} flatShading roughness={1} />
        </mesh>
      ))}
      <mesh position={[STEP * 5 + 10, 1.8, -6]}>
        <boxGeometry args={[2.4, 3.6, 1]} />
        <meshStandardMaterial color="#d8d3c3" flatShading roughness={0.9} />
      </mesh>
      <pointLight position={[STEP * 5 + 10, 3, -4]} color="#ffd27d" intensity={8} distance={20} />

      <Clouds />
      <Stars visible />
    </group>
  )
}

export default function JourneyWorld() {
  return (
    <Canvas camera={{ position: [-1.5, 4.6, 13.5], fov: 50 }} dpr={[1, 1.6]} gl={{ antialias: true }}>
      <SkyRig />
      <World />
      <Hero />
      <CameraRig />
    </Canvas>
  )
}
