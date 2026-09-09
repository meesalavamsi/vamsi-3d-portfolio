import { useLayoutEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { Bench, Birds, StreetLight, Traffic, TreeField } from './Props'
import { zones } from '../data/zones'
import { edgeTreeSpots, lampSpots, treeSpots } from '../data/props'

/* Ground, roads, plaza and planting. */

const grassMat = new THREE.MeshStandardMaterial({ color: '#54703f', roughness: 1 })
const lawnMat = new THREE.MeshStandardMaterial({ color: '#5d7c46', roughness: 1 })
const asphaltMat = new THREE.MeshStandardMaterial({ color: '#33363c', roughness: 0.95 })
const pavingMat = new THREE.MeshStandardMaterial({ color: '#7d838c', roughness: 0.92 })
const plazaMat = new THREE.MeshStandardMaterial({ color: '#868c95', roughness: 0.85 })
const lineMat = new THREE.MeshStandardMaterial({
  color: '#c9cbcf', roughness: 0.7, emissive: new THREE.Color('#3a3d42'), emissiveIntensity: 0.2,
})
const waterMat = new THREE.MeshStandardMaterial({
  color: '#4a7f94', roughness: 0.09, metalness: 0.22, transparent: true, opacity: 0.74,
})
const stoneMat = new THREE.MeshStandardMaterial({ color: '#6a6f78', roughness: 0.9 })

function Dashes({
  count, z, spacing = 6,
}: {
  count: number; z: number; spacing?: number
}) {
  const ref = useRef<THREE.InstancedMesh>(null)
  const geo = useMemo(() => new THREE.PlaneGeometry(2.6, 0.22), [])
  useLayoutEffect(() => {
    const m = ref.current
    if (!m) return
    const o = new THREE.Object3D()
    for (let i = 0; i < count; i++) {
      o.position.set(-count * spacing * 0.5 + i * spacing, 0.02, z)
      o.rotation.set(-Math.PI / 2, 0, 0)
      o.updateMatrix()
      m.setMatrixAt(i, o.matrix)
    }
    m.instanceMatrix.needsUpdate = true
  }, [count, spacing, z])
  return <instancedMesh ref={ref} args={[geo, lineMat, count]} />
}

function Fountain() {
  const w = useRef<THREE.Mesh>(null)
  useFrame((s) => {
    if (w.current) {
      const t = s.clock.elapsedTime
      w.current.position.y = 0.62 + Math.sin(t * 1.4) * 0.012
    }
  })
  return (
    <group position={[0, 0, 0]}>
      <mesh material={stoneMat} position={[0, 0.28, 0]} receiveShadow castShadow>
        <cylinderGeometry args={[3.4, 3.6, 0.56, 28]} />
      </mesh>
      <mesh ref={w} material={waterMat} position={[0, 0.62, 0]}>
        <cylinderGeometry args={[3.1, 3.1, 0.12, 28]} />
      </mesh>
      <mesh material={stoneMat} position={[0, 1.05, 0]} castShadow>
        <cylinderGeometry args={[0.42, 0.6, 1.3, 14]} />
      </mesh>
      <mesh material={waterMat} position={[0, 1.85, 0]}>
        <sphereGeometry args={[0.42, 16, 12]} />
      </mesh>
    </group>
  )
}

export default function City({ night, quality }: { night: number; quality: 'high' | 'low' }) {
  const trees = treeSpots
  const lamps = lampSpots

  return (
    <group>
      {/* ground */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} material={grassMat} receiveShadow>
        <planeGeometry args={[300, 300]} />
      </mesh>

      {/* lawns around the plaza */}
      {([[-17, 14], [17, 14], [-17, -6], [17, -6]] as [number, number][]).map((p, i) => (
        <mesh
          key={i}
          rotation={[-Math.PI / 2, 0, 0]}
          position={[p[0], 0.012, p[1]]}
          material={lawnMat}
          receiveShadow
        >
          <planeGeometry args={[13, 11]} />
        </mesh>
      ))}

      {/* main avenue (east-west) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.014, -19.2]} material={asphaltMat} receiveShadow>
        <planeGeometry args={[190, 9.6]} />
      </mesh>
      <Dashes count={26} z={-19.2} />

      {/* cross avenue (north-south) */}
      <mesh
        rotation={[-Math.PI / 2, 0, Math.PI / 2]}
        position={[30.5, 0.014, 4]}
        material={asphaltMat}
        receiveShadow
      >
        <planeGeometry args={[130, 8.4]} />
      </mesh>

      {/* sidewalks */}
      {([
        [0, -13.6, 190, 3.2],
        [0, -24.8, 190, 3.2],
        [0, 22, 120, 3.2],
      ] as [number, number, number, number][]).map((s, i) => (
        <mesh
          key={i}
          rotation={[-Math.PI / 2, 0, 0]}
          position={[s[0], 0.02, s[1]]}
          material={pavingMat}
          receiveShadow
        >
          <planeGeometry args={[s[2], s[3]]} />
        </mesh>
      ))}

      {/* central plaza */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.018, 2]} material={plazaMat} receiveShadow>
        <circleGeometry args={[13.5, 40]} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.026, 2]} material={pavingMat} receiveShadow>
        <ringGeometry args={[9.2, 10, 40]} />
      </mesh>

      {/* paths out to each building */}
      {zones.map((z) => {
        const dx = z.door[0]
        const dz = z.door[1] - 2
        const base = Math.hypot(dx, dz)
        const len = base + 5 // run past the marker, up to the entrance steps
        const ang = Math.atan2(dx, dz)
        return (
          <mesh
            key={z.id}
            rotation={[-Math.PI / 2, 0, -ang]}
            position={[(dx / base) * (len / 2), 0.016, 2 + (dz / base) * (len / 2)]}
            material={pavingMat}
            receiveShadow
          >
            <planeGeometry args={[3.4, len]} />
          </mesh>
        )
      })}

      <Fountain />

      <TreeField spots={trees} />
      <TreeField spots={edgeTreeSpots} shadows={false} />
      {lamps.map((l, i) => (
        <StreetLight key={i} at={l} night={night} lit={quality === 'high' ? i % 2 === 0 : i % 4 === 0} />
      ))}

      <Bench at={[-9.2, 10.4]} rot={0} />
      <Bench at={[9.4, 10.4]} rot={Math.PI} />
      <Bench at={[-9.2, -6]} rot={0} />

      <Traffic night={night} count={quality === 'high' ? 6 : 3} />
      {quality === 'high' && <Birds />}
    </group>
  )
}
