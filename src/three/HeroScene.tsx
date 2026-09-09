import { useMemo, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Float, Stars } from '@react-three/drei'
import * as THREE from 'three'

function Core() {
  const g = useRef<THREE.Group>(null)
  useFrame(({ clock, pointer }) => {
    if (!g.current) return
    g.current.rotation.y = clock.elapsedTime * 0.12 + pointer.x * 0.25
    g.current.rotation.x = pointer.y * 0.15
  })
  return (
    <group ref={g} position={[2.6, 0, 0]}>
      <Float speed={1.6} rotationIntensity={0.4} floatIntensity={1.4}>
        <mesh>
          <icosahedronGeometry args={[1.9, 1]} />
          <meshStandardMaterial color="#0b1428" emissive="#4dd0ff" emissiveIntensity={0.35} wireframe />
        </mesh>
        <mesh scale={0.62}>
          <icosahedronGeometry args={[1.9, 0]} />
          <meshStandardMaterial color="#0b1428" emissive="#a78bfa" emissiveIntensity={0.8} wireframe />
        </mesh>
        <mesh scale={0.3}>
          <octahedronGeometry args={[1, 0]} />
          <meshStandardMaterial color="#f472b6" emissive="#f472b6" emissiveIntensity={1.2} />
        </mesh>
      </Float>
    </group>
  )
}

function Particles({ count = 260 }: { count?: number }) {
  const ref = useRef<THREE.Points>(null)
  const pos = useMemo(() => {
    const a = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      a[i * 3] = (Math.random() - 0.5) * 26
      a[i * 3 + 1] = (Math.random() - 0.5) * 16
      a[i * 3 + 2] = (Math.random() - 0.5) * 12
    }
    return a
  }, [count])
  useFrame(({ clock }) => { if (ref.current) ref.current.rotation.y = clock.elapsedTime * 0.02 })
  return (
    <points ref={ref}>
      <bufferGeometry><bufferAttribute attach="attributes-position" args={[pos, 3]} /></bufferGeometry>
      <pointsMaterial size={0.05} color="#4dd0ff" transparent opacity={0.55} sizeAttenuation />
    </points>
  )
}

export default function HeroScene() {
  const reduced = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (reduced) return null
  return (
    <div className="absolute inset-0 -z-0">
      <Canvas camera={{ position: [0, 0, 7], fov: 50 }} dpr={[1, 1.6]} gl={{ antialias: true, alpha: true }}>
        <ambientLight intensity={0.4} />
        <pointLight position={[6, 4, 6]} intensity={30} color="#4dd0ff" />
        <Stars radius={40} depth={20} count={1200} factor={2.4} saturation={0.5} fade speed={0.5} />
        <Particles />
        <Core />
      </Canvas>
    </div>
  )
}
