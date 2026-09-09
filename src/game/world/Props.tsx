import { useLayoutEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

/* Street furniture, planting and traffic — all instanced where it repeats. */

const trunkGeo = new THREE.CylinderGeometry(0.11, 0.16, 2.1, 8)
const leafGeo = new THREE.IcosahedronGeometry(1, 1)
const trunkMat = new THREE.MeshStandardMaterial({ color: '#4a3728', roughness: 0.95 })
const leafMat = new THREE.MeshStandardMaterial({ color: '#3d7f45', roughness: 0.9, flatShading: true })
const leafMat2 = new THREE.MeshStandardMaterial({ color: '#4a9151', roughness: 0.9, flatShading: true })

export function Tree({ at, s = 1 }: { at: [number, number]; s?: number }) {
  return (
    <group position={[at[0], 0, at[1]]} scale={[s, s, s]}>
      <mesh geometry={trunkGeo} material={trunkMat} position={[0, 1.05, 0]} castShadow />
      <mesh geometry={leafGeo} material={leafMat} position={[0, 2.6, 0]} scale={[1.15, 1.0, 1.15]} castShadow />
      <mesh geometry={leafGeo} material={leafMat2} position={[0.42, 2.15, 0.2]} scale={0.72} castShadow />
      <mesh geometry={leafGeo} material={leafMat2} position={[-0.38, 2.3, -0.24]} scale={0.62} castShadow />
    </group>
  )
}

/* Four instanced meshes for the whole treeline instead of four per tree. */
const TREE_PARTS: {
  geo: THREE.BufferGeometry
  mat: THREE.Material
  p: [number, number, number]
  s: [number, number, number]
}[] = [
  { geo: trunkGeo, mat: trunkMat, p: [0, 1.05, 0], s: [1, 1, 1] },
  { geo: leafGeo, mat: leafMat, p: [0, 2.6, 0], s: [1.15, 1, 1.15] },
  { geo: leafGeo, mat: leafMat2, p: [0.42, 2.15, 0.2], s: [0.72, 0.72, 0.72] },
  { geo: leafGeo, mat: leafMat2, p: [-0.38, 2.3, -0.24], s: [0.62, 0.62, 0.62] },
]

export function TreeField({
  spots,
  shadows = true,
}: {
  spots: [number, number][]
  shadows?: boolean
}) {
  const group = useRef<THREE.Group>(null)

  useLayoutEffect(() => {
    const g = group.current
    if (!g) return
    const parent = new THREE.Object3D()
    const child = new THREE.Object3D()
    const m = new THREE.Matrix4()
    g.children.forEach((mesh, part) => {
      const im = mesh as THREE.InstancedMesh
      const def = TREE_PARTS[part]
      spots.forEach(([x, z], i) => {
        const scale = 0.85 + ((i * 37) % 5) * 0.12
        parent.position.set(x, 0, z)
        parent.rotation.set(0, (i * 2.399) % (Math.PI * 2), 0)
        parent.scale.setScalar(scale)
        parent.updateMatrix()
        child.position.set(...def.p)
        child.rotation.set(0, 0, 0)
        child.scale.set(...def.s)
        child.updateMatrix()
        im.setMatrixAt(i, m.multiplyMatrices(parent.matrix, child.matrix))
      })
      im.instanceMatrix.needsUpdate = true
      im.computeBoundingSphere()
    })
  }, [spots])

  return (
    <group ref={group}>
      {TREE_PARTS.map((part, i) => (
        <instancedMesh
          key={i}
          args={[part.geo, part.mat, Math.max(1, spots.length)]}
          castShadow={shadows}
          receiveShadow={shadows}
        />
      ))}
    </group>
  )
}

const poleGeo = new THREE.CylinderGeometry(0.055, 0.07, 4.4, 8)
const armGeo = new THREE.BoxGeometry(0.9, 0.08, 0.08)
const headGeo = new THREE.BoxGeometry(0.42, 0.1, 0.22)
const metalMat = new THREE.MeshStandardMaterial({ color: '#3a3f47', roughness: 0.5, metalness: 0.6 })

export function StreetLight({ at, night, lit = false }: { at: [number, number]; night: number; lit?: boolean }) {
  const lampMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#fff3d0',
        emissive: new THREE.Color('#ffd98a'),
        emissiveIntensity: 0,
        roughness: 0.3,
      }),
    [],
  )
  lampMat.emissiveIntensity = night * 2.6
  return (
    <group position={[at[0], 0, at[1]]}>
      <mesh geometry={poleGeo} material={metalMat} position={[0, 2.2, 0]} castShadow />
      <mesh geometry={armGeo} material={metalMat} position={[0.42, 4.32, 0]} />
      <mesh geometry={headGeo} material={lampMat} position={[0.78, 4.24, 0]} />
      {lit && night > 0.35 && (
        <pointLight
          position={[0.78, 4.1, 0]}
          color="#ffcf87"
          intensity={night * 26}
          distance={17}
          decay={2}
        />
      )}
    </group>
  )
}

const benchSeat = new THREE.BoxGeometry(1.7, 0.09, 0.52)
const benchBack = new THREE.BoxGeometry(1.7, 0.42, 0.07)
const benchLeg = new THREE.BoxGeometry(0.1, 0.42, 0.46)
const woodMat = new THREE.MeshStandardMaterial({ color: '#6b4a2f', roughness: 0.9 })

export function Bench({ at, rot = 0 }: { at: [number, number]; rot?: number }) {
  return (
    <group position={[at[0], 0, at[1]]} rotation={[0, rot, 0]}>
      <mesh geometry={benchSeat} material={woodMat} position={[0, 0.46, 0]} castShadow />
      <mesh geometry={benchBack} material={woodMat} position={[0, 0.7, -0.24]} castShadow />
      <mesh geometry={benchLeg} material={metalMat} position={[-0.7, 0.23, 0]} />
      <mesh geometry={benchLeg} material={metalMat} position={[0.7, 0.23, 0]} />
    </group>
  )
}

// ── traffic ──
const bodyGeo = new THREE.BoxGeometry(1.85, 0.62, 4.3)
const cabinGeo = new THREE.BoxGeometry(1.66, 0.56, 2.15)
const wheelGeo = new THREE.CylinderGeometry(0.33, 0.33, 0.22, 12)
const wheelMat = new THREE.MeshStandardMaterial({ color: '#15171b', roughness: 0.85 })
const glassMat = new THREE.MeshStandardMaterial({
  color: '#0f1a24', roughness: 0.16, metalness: 0.5,
})
const CAR_COLORS = ['#b8332c', '#1f3d6e', '#d8d8d8', '#2b2f36', '#356b4a', '#c9922b']

function Car({
  color, lane, offset, speed, night,
}: {
  color: string; lane: { z: number; dir: 1 | -1 }; offset: number; speed: number; night: number
}) {
  const g = useRef<THREE.Group>(null)
  const paint = useMemo(
    () => new THREE.MeshStandardMaterial({ color, roughness: 0.34, metalness: 0.42 }),
    [color],
  )
  const lampMat = useMemo(
    () => new THREE.MeshStandardMaterial({ color: '#fff6df', emissive: new THREE.Color('#fff0c0'), emissiveIntensity: 0 }),
    [],
  )
  const tailMat = useMemo(
    () => new THREE.MeshStandardMaterial({ color: '#5c1512', emissive: new THREE.Color('#ff2a1a'), emissiveIntensity: 0 }),
    [],
  )
  lampMat.emissiveIntensity = night * 3
  tailMat.emissiveIntensity = 0.5 + night * 2.5
  const wheels = useRef<THREE.Group>(null)

  useFrame((state, dt) => {
    if (!g.current) return
    const span = 150
    const t = ((state.clock.elapsedTime * speed + offset) % span) - span / 2
    g.current.position.set(lane.dir > 0 ? t : -t, 0.42, lane.z)
    g.current.rotation.y = lane.dir > 0 ? Math.PI / 2 : -Math.PI / 2
    if (wheels.current) wheels.current.rotation.x -= dt * speed * 2.2
  })

  return (
    <group ref={g}>
      <mesh geometry={bodyGeo} material={paint} castShadow />
      <mesh geometry={cabinGeo} material={glassMat} position={[0, 0.55, -0.16]} castShadow />
      <mesh geometry={new THREE.BoxGeometry(0.34, 0.16, 0.1)} material={lampMat} position={[-0.58, 0.06, 2.16]} />
      <mesh geometry={new THREE.BoxGeometry(0.34, 0.16, 0.1)} material={lampMat} position={[0.58, 0.06, 2.16]} />
      <mesh geometry={new THREE.BoxGeometry(0.3, 0.14, 0.08)} material={tailMat} position={[-0.6, 0.08, -2.18]} />
      <mesh geometry={new THREE.BoxGeometry(0.3, 0.14, 0.08)} material={tailMat} position={[0.6, 0.08, -2.18]} />
      <group ref={wheels}>
        {([[-0.95, 1.4], [0.95, 1.4], [-0.95, -1.4], [0.95, -1.4]] as [number, number][]).map(
          ([x, z], i) => (
            <mesh
              key={i}
              geometry={wheelGeo}
              material={wheelMat}
              position={[x, -0.22, z]}
              rotation={[0, 0, Math.PI / 2]}
            />
          ),
        )}
      </group>
    </group>
  )
}

export function Traffic({ night, count = 6 }: { night: number; count?: number }) {
  const lanes = useMemo(
    () => [
      { z: -17.4, dir: 1 as const },
      { z: -21.0, dir: -1 as const },
    ],
    [],
  )
  const cars = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        color: CAR_COLORS[i % CAR_COLORS.length],
        lane: lanes[i % 2],
        offset: (i * 137) % 150,
        speed: 7 + (i % 3) * 1.6,
      })),
    [count, lanes],
  )
  return (
    <group>
      {cars.map((c, i) => (
        <Car key={i} {...c} night={night} />
      ))}
    </group>
  )
}

/** Birds circling — cheap life in the sky. */
export function Birds({ n = 9 }: { n?: number }) {
  const g = useRef<THREE.Group>(null)
  const geo = useMemo(() => new THREE.ConeGeometry(0.09, 0.42, 3), [])
  const m = useMemo(() => new THREE.MeshBasicMaterial({ color: '#3a3f47' }), [])
  useFrame((state) => {
    if (g.current) g.current.rotation.y = state.clock.elapsedTime * 0.08
  })
  const birds = useMemo(
    () =>
      Array.from({ length: n }, (_, i) => ({
        r: 22 + (i % 4) * 5,
        a: (i / n) * Math.PI * 2,
        y: 17 + (i % 5) * 1.8,
      })),
    [n],
  )
  return (
    <group ref={g}>
      {birds.map((b, i) => (
        <mesh
          key={i}
          geometry={geo}
          material={m}
          position={[Math.cos(b.a) * b.r, b.y, Math.sin(b.a) * b.r]}
          rotation={[Math.PI / 2, 0, -b.a]}
        />
      ))}
    </group>
  )
}
