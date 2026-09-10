import { useMemo, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import Human, { type Look } from './Human'
import { input } from '../input'
import { colliders, zones } from '../data/zones'
import { camObstacles } from '../data/props'
import { streetColliders } from '../data/street'
import { useGame } from '../state'

const RADIUS = 0.45

export type Target = { id: string; at: [number, number] }

export type WorldCfg = {
  /** where the player is dropped in */
  spawn: [number, number]
  /** radial clamp (outdoors) */
  radius?: number
  /** half-extents of a rectangular room (indoors) */
  rect?: [number, number]
  /** height of the room, so the camera stays under the ceiling */
  ceiling?: number
  /** x, z, halfW, halfD */
  colliders: [number, number, number, number][]
  /** x, z, radius — round things the camera should not clip through */
  obstacles?: [number, number, number][]
  targets: Target[]
  /** how close you have to be for the prompt */
  reach?: number
  camDist?: number
  indoor?: boolean
  /** starting facing, radians */
  facing?: number
}


export const cityWorld: WorldCfg = {
  spawn: [0, 11],
  radius: 45,
  colliders: [...colliders, ...streetColliders],
  obstacles: camObstacles,
  targets: zones.map((z) => ({ id: z.id, at: z.door })),
  reach: 4.6,
  camDist: 7.4,
}

export const playerLook: Look = {
  skin: '#d6a077',
  top: '#4d84c4',
  bottom: '#39404d',
  hair: '#181510',
  height: 1.02,
  bag: true,
  style: 'short',
}

export default function Player({
  world,
  onNear,
}: {
  world: WorldCfg
  onNear: (id: string | null) => void
}) {
  const CAM_DIST = world.camDist || 7.4
  const g = useRef<THREE.Group>(null)
  const vel = useRef(new THREE.Vector2())
  const yawRef = useRef(world.facing ?? 0)
  const gaitRef = useRef(0)
  const camTarget = useRef(new THREE.Vector3(0, 1.4, 8))
  const camDist = useRef(CAM_DIST)
  const nearRef = useRef<string | null>(null)
  const setPlayerPos = useGame((s) => s.setPlayerPos)
  const night = THREE.MathUtils.smoothstep(useGame((s) => s.dayProgress), 0.5, 0.98)
  const posTick = useRef(0)
  const { camera } = useThree()

  const targets = useMemo(
    () => world.targets.map((t) => ({ id: t.id, v: new THREE.Vector2(t.at[0], t.at[1]) })),
    [world],
  )
  const reach = world.reach ?? 4.6

  useFrame((state, dtRaw) => {
    const dt = Math.min(dtRaw, 0.085)
    const grp = g.current
    if (!grp) return

    // ── movement in camera space ──
    // camera forward (horizontal) D = (sin yaw, cos yaw); screen-right R = (-cos yaw, sin yaw)
    const cy = input.yaw
    const moveVec = new THREE.Vector2(input.s, input.f)
    if (moveVec.lengthSq() > 1) moveVec.normalize()
    const top = world.indoor ? 2.5 : 3.2
    const run = world.indoor ? 4.2 : 5.8
    const speed = (input.sprint ? run : top) * (moveVec.lengthSq() > 0.0001 ? 1 : 0)

    const wx = moveVec.y * Math.sin(cy) - moveVec.x * Math.cos(cy)
    const wz = moveVec.y * Math.cos(cy) + moveVec.x * Math.sin(cy)

    const target = new THREE.Vector2(wx, wz).multiplyScalar(speed)
    vel.current.lerp(target, Math.min(1, dt * 9))

    let nx = grp.position.x + vel.current.x * dt
    let nz = grp.position.z + vel.current.y * dt

    // ── collision: push out of footprints ──
    for (const [cx, cz, hw, hd] of world.colliders) {
      const dx = nx - cx
      const dz = nz - cz
      if (Math.abs(dx) < hw + RADIUS && Math.abs(dz) < hd + RADIUS) {
        const overlapX = hw + RADIUS - Math.abs(dx)
        const overlapZ = hd + RADIUS - Math.abs(dz)
        if (overlapX < overlapZ) nx = cx + Math.sign(dx || 1) * (hw + RADIUS)
        else nz = cz + Math.sign(dz || 1) * (hd + RADIUS)
      }
    }
    if (world.rect) {
      // inside a room: square walls
      const [hw, hd] = world.rect
      nx = THREE.MathUtils.clamp(nx, -hw + RADIUS, hw - RADIUS)
      nz = THREE.MathUtils.clamp(nz, -hd + RADIUS, hd - RADIUS)
    } else if (world.radius) {
      // keep the player inside the district rather than out on blank grass
      const rr = Math.hypot(nx, nz)
      if (rr > world.radius) {
        nx = (nx / rr) * world.radius
        nz = (nz / rr) * world.radius
      }
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
    for (let s = 1.5; s <= CAM_DIST; s += 0.4) {
      const px = nx + dirX * s
      const pz = nz + dirZ * s
      let hit = false
      if (world.rect) {
        const [hw, hd] = world.rect
        if (Math.abs(px) > hw - 0.3 || Math.abs(pz) > hd - 0.3) hit = true
      } else {
        for (const [cx, cz, hw, hd] of world.colliders) {
          // colliders carry player padding; shrink it back so the camera can
          // hug an outside wall without snapping in
          if (Math.abs(px - cx) < hw - 0.3 && Math.abs(pz - cz) < hd - 0.3) {
            hit = true
            break
          }
        }
        if (!hit && world.obstacles) {
          for (const [cx, cz, r] of world.obstacles) {
            const ox = px - cx
            const oz = pz - cz
            if (ox * ox + oz * oz < r * r) {
              hit = true
              break
            }
          }
        }
      }
      if (hit) {
        want = Math.max(world.indoor ? 1.9 : 2.1, s - 0.45)
        break
      }
    }
    // snap in fast (avoid seeing through walls), ease back out slowly
    const k = want < camDist.current ? 0.45 : Math.min(1, dt * 2.2)
    camDist.current += (want - camDist.current) * k

    const dist = camDist.current
    const camX = nx + dirX * dist
    const camZ = nz + dirZ * dist
    let camY = 1.55 + Math.sin(pitch) * dist
    if (world.ceiling) camY = Math.min(camY, world.ceiling - 0.4)
    camTarget.current.set(camX, camY, camZ)
    camera.position.lerp(camTarget.current, Math.min(1, dt * 6))
    camera.lookAt(nx, world.indoor ? 1.55 : 2.05, nz)

    // ── proximity to something you can act on ──
    const here = new THREE.Vector2(nx, nz)
    let found: string | null = null
    let best = reach
    for (const d of targets) {
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
    <group ref={g} position={[world.spawn[0], 0, world.spawn[1]]} rotation={[0, world.facing ?? 0, 0]}>
      <Human look={playerLook} gait={gaitRef.current} tempo={input.sprint ? 1.45 : 1.05} />
      {/* after dark, keep the character readable */}
      {!world.indoor && night > 0.02 && (
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
