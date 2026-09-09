import { Suspense, useMemo, useRef, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Sky, Stars, AdaptiveDpr, Preload } from '@react-three/drei'
import * as THREE from 'three'
import City from './City'
import { AllBuildings } from './Buildings'
import Crowd from './Crowd'
import Markers from './Markers'
import Player from './Player'
import { useGame } from '../state'

/* Lighting rig + day→night cycle driven by mission progress. */

/** Tall phone screens need a wider lens or the city feels like a corridor. */
function portraitFov() {
  if (typeof window === 'undefined') return 55
  const a = window.innerWidth / window.innerHeight
  return a < 0.75 ? 74 : a < 1.05 ? 66 : 55
}

const DAY = {
  fog: new THREE.Color('#cadbe8'),
  sun: new THREE.Color('#fff4e0'),
  amb: new THREE.Color('#cfe0ee'),
}
const DUSK = {
  fog: new THREE.Color('#2a2237'),
  sun: new THREE.Color('#ff9d5c'),
  amb: new THREE.Color('#3a4460'),
}
const NIGHT = {
  fog: new THREE.Color('#12172a'),
  sun: new THREE.Color('#9fb6de'),
  amb: new THREE.Color('#2d3c5c'),
}

function Rig({ onNight }: { onNight: (n: number) => void }) {
  const target = useGame((s) => s.dayProgress)
  const cur = useRef(0)
  const sun = useRef<THREE.DirectionalLight>(null)
  const hemi = useRef<THREE.HemisphereLight>(null)
  const fill = useRef<THREE.AmbientLight>(null)
  const { scene } = useThree()
  const [sunPos, setSunPos] = useState<[number, number, number]>([40, 46, 18])
  const fogC = useMemo(() => new THREE.Color(), [])
  const sunC = useMemo(() => new THREE.Color(), [])
  const ambC = useMemo(() => new THREE.Color(), [])
  const tick = useRef(0)

  useFrame((_, dt) => {
    cur.current += (target - cur.current) * Math.min(1, dt * 0.9)
    const d = cur.current
    const night = THREE.MathUtils.smoothstep(d, 0.5, 0.98)

    // sun arc: high morning → low golden → below horizon
    const elev = THREE.MathUtils.lerp(0.95, -0.1, d)
    const azim = THREE.MathUtils.lerp(0.6, 2.5, d)
    const r = 70
    const sx = Math.cos(azim) * Math.cos(elev) * r
    const sy = Math.sin(elev) * r
    const sz = Math.sin(azim) * Math.cos(elev) * r

    const deep = THREE.MathUtils.smoothstep(d, 0.78, 1)

    if (sun.current) {
      // after sunset a high, cool "moon" takes over so shadows stay clean
      sun.current.position.set(
        THREE.MathUtils.lerp(sx, -34, deep),
        THREE.MathUtils.lerp(Math.max(sy, 8), 56, deep),
        THREE.MathUtils.lerp(sz, 26, deep),
      )
      sun.current.intensity = THREE.MathUtils.lerp(3.5, 0.85, night)
      sunC
        .copy(DAY.sun)
        .lerp(DUSK.sun, THREE.MathUtils.smoothstep(d, 0.25, 0.85))
        .lerp(NIGHT.sun, deep)
      sun.current.color.copy(sunC)
    }
    if (hemi.current) {
      hemi.current.intensity = THREE.MathUtils.lerp(1.5, 0.62, night)
      ambC.copy(DAY.amb).lerp(DUSK.amb, night).lerp(NIGHT.amb, deep)
      hemi.current.color.copy(ambC)
    }
    if (fill.current) fill.current.intensity = THREE.MathUtils.lerp(0.1, 0.42, night)
    fogC.copy(DAY.fog).lerp(DUSK.fog, night).lerp(NIGHT.fog, deep)
    if (scene.fog) (scene.fog as THREE.Fog).color.copy(fogC)
    scene.background = fogC

    tick.current += dt
    if (tick.current > 0.2) {
      tick.current = 0
      setSunPos([sx, sy, sz])
      onNight(night)
    }
  })

  return (
    <>
      <hemisphereLight ref={hemi} args={['#cfe0ee', '#5a6b46', 1.5]} />
      {/* keeps the city readable once the sun is gone */}
      <ambientLight ref={fill} color="#5f7099" intensity={0.1} />
      <directionalLight
        ref={sun}
        position={[40, 46, 18]}
        intensity={3.5}
        castShadow
        shadow-mapSize={[1536, 1536]}
        shadow-camera-near={1}
        shadow-camera-far={190}
        shadow-camera-left={-70}
        shadow-camera-right={70}
        shadow-camera-top={70}
        shadow-camera-bottom={-70}
        shadow-bias={-0.0006}
        shadow-normalBias={0.03}
      />
      <Sky sunPosition={sunPos} turbidity={6} rayleigh={2.2} mieCoefficient={0.008} mieDirectionalG={0.82} />
    </>
  )
}

function World({ onNear, quality }: { onNear: (id: string | null) => void; quality: 'high' | 'low' }) {
  const completed = useGame((s) => s.completed)
  const quiet = useGame((s) => s.phase !== 'playing')
  const [night, setNight] = useState(0)
  const [near, setNear] = useState<string | null>(null)

  return (
    <>
      <Rig onNight={setNight} />
      <Stars radius={140} depth={60} count={night > 0.25 ? 1600 : 0} factor={4} fade speed={0.4} />
      <City night={night} quality={quality} />
      <AllBuildings night={night} completed={completed} activeNear={near} quiet={quiet} />
      <Crowd density={quality === 'high' ? 1 : 0.4} />
      <Markers completed={completed} near={near} />
      <Player
        onNear={(id) => {
          setNear(id)
          onNear(id)
        }}
      />
    </>
  )
}

export default function Scene({
  onNear, quality,
}: {
  onNear: (id: string | null) => void
  quality: 'high' | 'low'
}) {
  return (
    <Canvas
      shadows={quality === 'high'}
      dpr={quality === 'high' ? [1, 1.7] : [0.75, 1]}
      camera={{ fov: portraitFov(), near: 0.4, far: 260, position: [0, 6, 16] }}
      gl={{
        antialias: quality === 'high',
        powerPreference: 'high-performance',
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 1.24,
      }}
      onCreated={(state) => {
        state.scene.fog = new THREE.Fog('#cadbe8', 62, 205)
        state.scene.background = new THREE.Color('#cadbe8')
        ;(window as unknown as { __r3f?: unknown }).__r3f = state
      }}
    >
      <Suspense fallback={null}>
        <World onNear={onNear} quality={quality} />
        <Preload all />
      </Suspense>
      <AdaptiveDpr pixelated />
    </Canvas>
  )
}
