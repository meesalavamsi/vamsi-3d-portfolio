import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

/** Instanced floating particles — cheap and pretty. */
export function Particles({ count = 350, spread = 90 }: { count?: number; spread?: number }) {
  const ref = useRef<THREE.Points>(null)
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * spread
      arr[i * 3 + 1] = Math.random() * 30
      arr[i * 3 + 2] = (Math.random() - 0.5) * spread
    }
    return arr
  }, [count, spread])

  useFrame(({ clock }) => {
    if (!ref.current) return
    ref.current.rotation.y = clock.elapsedTime * 0.015
  })

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.16} color="#4dd0ff" transparent opacity={0.65} sizeAttenuation />
    </points>
  )
}

/** Ground grid plane with neon grid. */
export function GridFloor({ size = 120 }: { size?: number }) {
  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.02, 0]}>
        <planeGeometry args={[size, size]} />
        <meshStandardMaterial color="#05060e" roughness={0.9} metalness={0.1} />
      </mesh>
      <gridHelper args={[size, 60, '#1d4ed8', '#0e1a38']} position={[0, 0, 0]} />
    </group>
  )
}

/** The player's simple futuristic avatar. */
export function Avatar({ position }: { position: [number, number, number] }) {
  const ref = useRef<THREE.Group>(null)
  useFrame(({ clock }) => {
    if (ref.current) ref.current.position.y = position[1] + Math.sin(clock.elapsedTime * 2) * 0.06
  })
  return (
    <group ref={ref} position={position}>
      {/* body */}
      <mesh position={[0, 0.75, 0]}>
        <capsuleGeometry args={[0.32, 0.8, 6, 14]} />
        <meshStandardMaterial color="#12233f" emissive="#4dd0ff" emissiveIntensity={0.35} roughness={0.3} metalness={0.7} />
      </mesh>
      {/* visor */}
      <mesh position={[0, 1.18, 0.22]}>
        <boxGeometry args={[0.42, 0.12, 0.2]} />
        <meshStandardMaterial color="#4dd0ff" emissive="#4dd0ff" emissiveIntensity={1.6} />
      </mesh>
      {/* ring base */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.05, 0]}>
        <ringGeometry args={[0.55, 0.75, 32]} />
        <meshBasicMaterial color="#4dd0ff" transparent opacity={0.5} side={THREE.DoubleSide} />
      </mesh>
      <pointLight color="#4dd0ff" intensity={6} distance={8} />
    </group>
  )
}
