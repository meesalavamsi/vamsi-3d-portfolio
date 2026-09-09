import { useMemo, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import Human, { type Look } from './Human'
import { input } from '../input'
import { colliders, zones } from '../data/zones'
import { camObstacles } from '../data/props'
import { useGame } from '../state'

const WORLD = 45
const RADIUS = 0.45
const CAM_DIST = 7.4

export const playerLook: Look = {
  skin: '#d6a077',
  top: '#4d84c4',
  bottom: '#39404d',
  hair: '#181510',
  height: 1.02,
  bag: true,
}

export default function Player({ onNear }: { onNear: (id: string | null) => void }) {
  const g = useRef<THREE.Group>(null)
  const vel = useRef(new THREE.Vector2())
  const yawRef = useRef(0)
  const gaitRef = useRef(0)
  const camTarget = useRef(new THREE.Vector3(0, 1.4, 8))
  const camDist = useRef(CAM_DIST)
  const nearRef = useRef<string | null>(null)
  const setPlayerPos = useGame((s) => s.setPlayerPos)
  const night = THREE.MathUtils.smoothstep(useGame((s) => s.dayProgress), 0.5, 0.98)
  const posTick = useRef(0)
  const { camera } = useThree()

  const doors = useMemo(
    () => zones.map((z) => ({ id: z.id, v: new THREE.Vector2(z.door[0], z.door[1]) })),
    [],
  )

  useFrame((state, dtRaw) => {
    const dt = Math.min(dtRaw, 0.085)
    const grp = g.current
    if (!grp) return

    // ── movement in camera space ──
    // camera forward (horizontal) D = (sin yaw, cos yaw); screen-right R = (-cos yaw, sin yaw)
    const cy = input.yaw
    const moveVec = new THREE.Vector2(input.s, input.f)
    if (moveVec.lengthSq() > 1) moveVec.normalize()
    const speed = (input.sprint ? 5.8 : 3.2) * (moveVec.lengthSq() > 0.0001 ? 1 : 0)

    const wx = moveVec.y * Math.sin(cy) - moveVec.x * Math.cos(cy)
    const wz = moveVec.y * Math.cos(cy) + moveVec.x * Math.sin(cy)

    const target = new THREE.Vector2(wx, wz).multiplyScalar(speed)
    vel.current.lerp(target, Math.min(1, dt * 9))

    let nx = grp.position.x + vel.current.x * dt
    let nz = grp.position.z + vel.current.y * dt

    // ── collision: push out of building footprints ──
    for (const [cx, cz, hw, hd] of colliders) {
      const dx = nx - cx
      const dz = nz - cz
      if (Math.abs(dx) < hw + RADIUS && Math.abs(dz) < hd + RADIUS) {
        const overlapX = hw + RADIUS - Math.abs(dx)
        const overlapZ = hd + RADIUS - Math.abs(dz)
        if (overlapX < overlapZ) nx = cx + Math.sign(dx || 1) * (hw + RADIUS)
        else nz = cz + Math.sign(dz || 1) * (hd + RADIUS)
      }
    }
    // keep the player inside the district rather than out on blank grass
    const rr = Math.hypot(nx, nz)
    if (rr > WORLD) {
      nx = (nx / rr) * WORLD
      nz = (nz / rr) * WORLD
    }
    grp.position.set(nx, 0, nz)

    // ── face travel direction ──
    const moving = vel.current.length() > 0.25
    if (moving) {
      const want = Math.atan2(vel.current.x, vel.current.y)
      let diff = want - yawRef.current
      while (diff > Math.PI) diff -= Math.PI * 2
      while (diff < -Math.PI) diff += Math.PI * 2
      yawRef.current += diff * Math.min(1, dt * 11)
    }
    grp.rotation.y = yawRef.current
    gaitRef.current = THREE.MathUtils.lerp(
      gaitRef.current,
      Math.min(1, vel.current.length() / 3.2),
      Math.min(1, dt * 8),
    )

    // ── third-person camera, pulled in so it never sits inside a wall ──
    const pitch = THREE.MathUtils.clamp(input.pitch, 0.02, 0.9)
    const cosP = Math.cos(pitch)
    const dirX = -Math.sin(input.yaw) * cosP
    const dirZ = -Math.cos(input.yaw) * cosP

    let want = CAM_DIST
    for (let s = 1.6; s <= CAM_DIST; s += 0.45) {
      const px = nx + dirX * s
      const pz = nz + dirZ * s
      let hit = false
      for (const [cx, cz, hw, hd] of colliders) {
        // colliders carry player padding; shrink it back so the camera can
        // hug an outside wall without snapping in
        if (Math.abs(px - cx) < hw - 0.3 && Math.abs(pz - cz) < hd - 0.3) {
          hit = true
          break
        }
      }
      if (!hit) {
        for (const [cx, cz, r] of camObstacles) {
          const ox = px - cx
          const oz = pz - cz
          if (ox * ox + oz * oz < r * r) {
            hit = true
            break
          }
        }
      }
      if (hit) {
        want = Math.max(2.1, s - 0.5)
        break
      }
    }
    // snap in fast (avoid seeing through walls), ease back out slowly
    const k = want < camDist.current ? 0.45 : Math.min(1, dt * 2.2)
    camDist.current += (want - camDist.current) * k

    const dist = camDist.current
    const camX = nx + dirX * dist
    const camZ = nz + dirZ * dist
    const camY = 1.55 + Math.sin(pitch) * dist
    camTarget.current.set(camX, camY, camZ)
    camera.position.lerp(camTarget.current, Math.min(1, dt * 6))
    camera.lookAt(nx, 2.05, nz)

    // ── proximity to a doorway ──
    const here = new THREE.Vector2(nx, nz)
    let found: string | null = null
    let best = 4.6
    for (const d of doors) {
      const dist2 = d.v.distanceTo(here)
      if (dist2 < best) {
        best = dist2
        found = d.id
      }
    }
    if (found !== nearRef.current) {
      nearRef.current = found
      onNear(found)
    }

    // publish position for the minimap (throttled)
    posTick.current += dt
    if (posTick.current > 0.12) {
      posTick.current = 0
      setPlayerPos([nx, 0, nz])
    }

    // gentle idle camera drift
    if (!moving) camera.position.y += Math.sin(state.clock.elapsedTime * 0.7) * 0.0008
  })

  return (
    <group ref={g} position={[0, 0, 11]}>
      <Human look={playerLook} gait={gaitRef.current} tempo={input.sprint ? 1.45 : 1.05} />
      {/* after dark, keep the character readable */}
      {night > 0.02 && (
        <pointLight
          position={[0, 2.3, 0.7]}
          color="#ffdcae"
          intensity={night * 8}
          distance={12}
          decay={2}
        />
      )}
      {/* soft contact shadow */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
        <circleGeometry args={[0.44, 20]} />
        <meshBasicMaterial color="#000" transparent opacity={0.26} />
      </mesh>
    </group>
  )
}
