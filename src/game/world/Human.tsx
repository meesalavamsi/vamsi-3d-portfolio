import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

/* ═══════════════════════════════════════════════════════════════
   A procedurally rigged human. No downloaded models — a real
   joint hierarchy (hips → spine → head, shoulders → elbows,
   hips → knees → ankles) driven by a sine-based gait.
   ═══════════════════════════════════════════════════════════════ */

// ── shared geometry (created once, reused by every person) ──
const G = {
  head: new THREE.SphereGeometry(0.108, 20, 16),
  hair: new THREE.SphereGeometry(0.114, 18, 14, 0, Math.PI * 2, 0, Math.PI * 0.62),
  neck: new THREE.CylinderGeometry(0.042, 0.05, 0.08, 10),
  chest: new THREE.CapsuleGeometry(0.135, 0.2, 6, 14),
  waist: new THREE.CapsuleGeometry(0.115, 0.1, 5, 12),
  upperArm: new THREE.CapsuleGeometry(0.045, 0.19, 4, 10),
  foreArm: new THREE.CapsuleGeometry(0.038, 0.18, 4, 10),
  hand: new THREE.SphereGeometry(0.048, 10, 8),
  thigh: new THREE.CapsuleGeometry(0.068, 0.3, 5, 12),
  shin: new THREE.CapsuleGeometry(0.055, 0.29, 5, 12),
  foot: new THREE.BoxGeometry(0.095, 0.055, 0.23),
  bag: new THREE.BoxGeometry(0.24, 0.3, 0.11),
  eye: new THREE.SphereGeometry(0.017, 8, 6),
  brow: new THREE.BoxGeometry(0.038, 0.008, 0.01),
}

const matCache = new Map<string, THREE.MeshStandardMaterial>()
function mat(color: string, rough = 0.72, metal = 0.02) {
  const key = `${color}|${rough}|${metal}`
  let m = matCache.get(key)
  if (!m) {
    m = new THREE.MeshStandardMaterial({ color, roughness: rough, metalness: metal })
    matCache.set(key, m)
  }
  return m
}

const EYE = new THREE.MeshStandardMaterial({ color: '#221c18', roughness: 0.35 })

export const SKINS = ['#e8b98e', '#d6a077', '#c68863', '#a9714c', '#8a5a3b', '#f0c9a5']
export const TOPS = [
  '#2f4f7f', '#3a6b5c', '#7a3b4e', '#40465e', '#6b5b8a',
  '#8a6a3b', '#2f6f7a', '#5c5c64', '#7a4a3b', '#3f5f3f',
]
export const BOTTOMS = ['#2a2d36', '#3a3f4b', '#4a4034', '#25303f', '#33343a']
export const HAIRS = ['#171512', '#2b2118', '#3d2a1c', '#5a4632', '#0f0f10']

export type Look = {
  skin: string
  top: string
  bottom: string
  hair: string
  height: number
  bag?: boolean
}

export function makeLook(seed: number): Look {
  const r = (n: number) => {
    const x = Math.sin(seed * 127.1 + n * 311.7) * 43758.5453
    return x - Math.floor(x)
  }
  return {
    skin: SKINS[Math.floor(r(1) * SKINS.length)],
    top: TOPS[Math.floor(r(2) * TOPS.length)],
    bottom: BOTTOMS[Math.floor(r(3) * BOTTOMS.length)],
    hair: HAIRS[Math.floor(r(4) * HAIRS.length)],
    height: 0.9 + r(5) * 0.22,
    bag: r(6) > 0.62,
  }
}

type Props = {
  look: Look
  /** 0 = standing, 1 = full walk */
  gait?: number
  /** cycle speed multiplier */
  tempo?: number
  /** conversational gesturing */
  talking?: boolean
  phase?: number
  castShadow?: boolean
  /** false drops face detail for background crowd */
  detail?: boolean
}

export default function Human({
  look,
  gait = 1,
  tempo = 1,
  talking = false,
  phase = 0,
  castShadow = true,
  detail = true,
}: Props) {
  const root = useRef<THREE.Group>(null)
  const hips = useRef<THREE.Group>(null)
  const spine = useRef<THREE.Group>(null)
  const head = useRef<THREE.Group>(null)
  const armL = useRef<THREE.Group>(null)
  const armR = useRef<THREE.Group>(null)
  const elbowL = useRef<THREE.Group>(null)
  const elbowR = useRef<THREE.Group>(null)
  const legL = useRef<THREE.Group>(null)
  const legR = useRef<THREE.Group>(null)
  const kneeL = useRef<THREE.Group>(null)
  const kneeR = useRef<THREE.Group>(null)
  const ankleL = useRef<THREE.Group>(null)
  const ankleR = useRef<THREE.Group>(null)

  const M = useMemo(
    () => ({
      skin: mat(look.skin, 0.66),
      top: mat(look.top, 0.82),
      bottom: mat(look.bottom, 0.85),
      hair: mat(look.hair, 0.55),
      shoe: mat('#191b20', 0.6),
      bag: mat('#33363f', 0.8),
    }),
    [look],
  )

  useFrame((state) => {
    const t = state.clock.elapsedTime * 4.4 * tempo + phase
    const g = gait

    // ── gait ──
    const swing = Math.sin(t)
    const swing2 = Math.sin(t + Math.PI)

    if (legL.current) legL.current.rotation.x = swing * 0.62 * g
    if (legR.current) legR.current.rotation.x = swing2 * 0.62 * g
    // knees only bend one way
    if (kneeL.current) kneeL.current.rotation.x = -Math.max(0, -Math.sin(t + 0.7)) * 1.05 * g
    if (kneeR.current) kneeR.current.rotation.x = -Math.max(0, -Math.sin(t + 0.7 + Math.PI)) * 1.05 * g
    if (ankleL.current) ankleL.current.rotation.x = -swing * 0.22 * g
    if (ankleR.current) ankleR.current.rotation.x = -swing2 * 0.22 * g

    // arms counter-swing
    const armBase = talking ? -0.16 : 0
    if (armL.current) armL.current.rotation.x = armBase + swing2 * 0.5 * g
    if (armR.current) armR.current.rotation.x = armBase + swing * 0.5 * g
    if (elbowL.current)
      elbowL.current.rotation.x =
        -0.22 - Math.max(0, swing2) * 0.4 * g - (talking ? 0.38 + Math.sin(t * 0.85) * 0.22 : 0)
    if (elbowR.current)
      elbowR.current.rotation.x =
        -0.22 - Math.max(0, swing) * 0.4 * g - (talking ? 0.38 + Math.sin(t * 0.85 + 1.6) * 0.22 : 0)

    // hip bob + torso counter-rotation (this is what sells the walk)
    if (hips.current) {
      hips.current.position.y = 0.9 * look.height + Math.abs(Math.sin(t)) * 0.028 * g
      hips.current.rotation.y = swing * 0.09 * g
      hips.current.rotation.z = swing * 0.035 * g
    }
    if (spine.current) {
      spine.current.rotation.y = -swing * 0.13 * g
      spine.current.rotation.x = 0.045 * g + Math.sin(t * 0.5) * 0.012
    }
    if (head.current) {
      head.current.rotation.y = swing * 0.055 * g + (talking ? Math.sin(t * 0.55) * 0.2 : 0)
      head.current.rotation.x = talking ? Math.sin(t * 0.8) * 0.09 : -0.03 * g
      head.current.position.y = Math.abs(Math.sin(t + 0.3)) * 0.008 * g
    }
    // idle breathing when standing still
    if (root.current && g < 0.05) {
      root.current.position.y = Math.sin(state.clock.elapsedTime * 1.6 + phase) * 0.007
    }
  })

  const s = look.height

  return (
    <group ref={root} scale={[s, s, s]}>
      <group ref={hips} position={[0, 0.9, 0]}>
        {/* pelvis */}
        <mesh geometry={G.waist} material={M.bottom} castShadow={castShadow} />

        {/* ── spine ── */}
        <group ref={spine} position={[0, 0.1, 0]}>
          <mesh geometry={G.chest} material={M.top} position={[0, 0.16, 0]} castShadow={castShadow} />
          <mesh geometry={G.neck} material={M.skin} position={[0, 0.32, 0]} />

          {/* ── head ── */}
          <group ref={head} position={[0, 0.36, 0]}>
            <mesh geometry={G.head} material={M.skin} position={[0, 0.1, 0]} castShadow={castShadow} />
            <mesh geometry={G.hair} material={M.hair} position={[0, 0.106, -0.004]} />
            {/* faces only matter on the character you control */}
            {detail && (
              <>
                <mesh geometry={G.eye} material={EYE} position={[-0.038, 0.108, 0.096]} />
                <mesh geometry={G.eye} material={EYE} position={[0.038, 0.108, 0.096]} />
                <mesh geometry={G.brow} material={M.hair} position={[-0.038, 0.135, 0.095]} />
                <mesh geometry={G.brow} material={M.hair} position={[0.038, 0.135, 0.095]} />
              </>
            )}
          </group>

          {/* ── arms ── */}
          {(['L', 'R'] as const).map((side) => {
            const x = side === 'L' ? -0.175 : 0.175
            const armRef = side === 'L' ? armL : armR
            const elbRef = side === 'L' ? elbowL : elbowR
            return (
              <group
                key={side}
                ref={armRef}
                position={[x, 0.24, 0]}
                rotation={[0, 0, side === 'L' ? 0.11 : -0.11]}
              >
                <mesh
                  geometry={G.upperArm}
                  material={M.top}
                  position={[0, -0.115, 0]}
                  castShadow={castShadow}
                />
                <group ref={elbRef} position={[0, -0.235, 0]}>
                  <mesh geometry={G.foreArm} material={M.skin} position={[0, -0.11, 0]} />
                  <mesh geometry={G.hand} material={M.skin} position={[0, -0.225, 0]} />
                </group>
              </group>
            )
          })}

          {look.bag && (
            <mesh geometry={G.bag} material={M.bag} position={[0, 0.14, -0.17]} castShadow={castShadow} />
          )}
        </group>

        {/* ── legs ── */}
        {(['L', 'R'] as const).map((side) => {
          const x = side === 'L' ? -0.085 : 0.085
          const legRef = side === 'L' ? legL : legR
          const kneeRef = side === 'L' ? kneeL : kneeR
          const ankRef = side === 'L' ? ankleL : ankleR
          return (
            <group key={side} ref={legRef} position={[x, -0.06, 0]}>
              <mesh
                geometry={G.thigh}
                material={M.bottom}
                position={[0, -0.2, 0]}
                castShadow={castShadow}
              />
              <group ref={kneeRef} position={[0, -0.4, 0]}>
                <mesh geometry={G.shin} material={M.bottom} position={[0, -0.19, 0]} castShadow={castShadow} />
                <group ref={ankRef} position={[0, -0.37, 0]}>
                  <mesh geometry={G.foot} material={M.shoe} position={[0, -0.03, 0.05]} castShadow={castShadow} />
                </group>
              </group>
            </group>
          )
        })}
      </group>
    </group>
  )
}
