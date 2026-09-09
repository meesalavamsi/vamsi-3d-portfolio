import { useMemo, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

/** Fibonacci-sphere point cloud — even distribution, no clumping. */
function useSpherePoints(count: number, radius: number) {
  return useMemo(() => {
    const arr = new Float32Array(count * 3)
    const golden = Math.PI * (3 - Math.sqrt(5))
    for (let i = 0; i < count; i++) {
      const y = 1 - (i / (count - 1)) * 2
      const r = Math.sqrt(Math.max(0, 1 - y * y))
      const theta = golden * i
      arr[i * 3] = Math.cos(theta) * r * radius
      arr[i * 3 + 1] = y * radius
      arr[i * 3 + 2] = Math.sin(theta) * r * radius
    }
    return arr
  }, [count, radius])
}

function PointGlobe({ count }: { count: number }) {
  const positions = useSpherePoints(count, 1.62)
  const ref = useRef<THREE.Points>(null)

  useFrame((state, dt) => {
    if (!ref.current) return
    ref.current.rotation.y += dt * 0.11
    ref.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.18) * 0.12
  })

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.0235}
        color="#e9e6df"
        transparent
        opacity={0.92}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  )
}

/** Thin orbital rings at offset tilts. */
function Rings() {
  const g = useRef<THREE.Group>(null)
  useFrame((_, dt) => {
    if (g.current) g.current.rotation.z += dt * 0.05
  })
  const tilts: [number, number, number][] = [
    [Math.PI / 2.1, 0, 0],
    [Math.PI / 2.6, 0.5, 0.35],
    [Math.PI / 1.75, -0.4, -0.25],
  ]
  return (
    <group ref={g}>
      {tilts.map((t, i) => (
        <mesh key={i} rotation={t}>
          <torusGeometry args={[1.62 + i * 0.16, 0.0026, 3, 128]} />
          <meshBasicMaterial
            color={i === 1 ? '#f0b429' : '#5a5f68'}
            transparent
            opacity={i === 1 ? 0.62 : 0.38}
          />
        </mesh>
      ))}
    </group>
  )
}

/** Warm core that reads as a light source behind the cloud. */
function Core() {
  const m = useRef<THREE.Mesh>(null)
  useFrame((state) => {
    if (m.current) {
      const s = 1 + Math.sin(state.clock.elapsedTime * 0.9) * 0.045
      m.current.scale.setScalar(s)
    }
  })
  return (
    <mesh ref={m}>
      <sphereGeometry args={[0.42, 32, 32]} />
      <meshBasicMaterial color="#f0b429" transparent opacity={0.11} />
    </mesh>
  )
}

/** Slow parallax toward the pointer, damped. */
function Parallax({ children }: { children: React.ReactNode }) {
  const g = useRef<THREE.Group>(null)
  useFrame((state, dt) => {
    if (!g.current) return
    const tx = state.pointer.y * 0.16
    const ty = state.pointer.x * 0.26
    g.current.rotation.x += (tx - g.current.rotation.x) * Math.min(1, dt * 2.2)
    g.current.rotation.y += (ty - g.current.rotation.y) * Math.min(1, dt * 2.2)
  })
  return <group ref={g}>{children}</group>
}

export default function Sculpture({ dense = true }: { dense?: boolean }) {
  return (
    <Canvas
      camera={{ position: [0, 0, 5.1], fov: 42 }}
      dpr={[1, dense ? 1.75 : 1.35]}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      style={{ background: 'transparent' }}
    >
      <Parallax>
        <PointGlobe count={dense ? 2600 : 1100} />
        <Rings />
        <Core />
      </Parallax>
    </Canvas>
  )
}
