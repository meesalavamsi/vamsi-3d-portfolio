import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

/* ═══════════════════════════════════════════════════════════════
   A procedurally rigged human. No downloaded models — a real
   joint hierarchy (hips → spine → neck → head, shoulders → elbows,
   hips → knees → ankles) driven by a sine-based gait.

   Faces are painted into one shared canvas texture and mapped onto
   the head sphere, so every person in the city has eyes, brows and
   a mouth for zero extra draw calls.
   ═══════════════════════════════════════════════════════════════ */

// ── the face, drawn once into a texture ──
let faceTex: THREE.CanvasTexture | null = null

function getFaceTexture() {
  if (faceTex) return faceTex
  const W = 256
  const H = 128
  const c = document.createElement('canvas')
  c.width = W
  c.height = H
  const x = c.getContext('2d')!

  // white = untouched skin (the material tints it)
  x.fillStyle = '#ffffff'
  x.fillRect(0, 0, W, H)

  // SphereGeometry maps u = 0.25 to +Z, which is the way a person faces
  const cx = W * 0.25
  const eyeDX = 12
  const eyeY = 58
  const browY = 49
  const mouthY = 79

  // soft shading down the nose bridge
  const grad = x.createLinearGradient(cx - 5, eyeY, cx + 5, eyeY)
  grad.addColorStop(0, 'rgba(150,120,100,0)')
  grad.addColorStop(0.5, 'rgba(150,118,96,0.5)')
  grad.addColorStop(1, 'rgba(150,120,100,0)')
  x.fillStyle = grad
  x.fillRect(cx - 5, eyeY, 10, 16)

  // eye whites
  x.fillStyle = '#f6f2ee'
  for (const s of [-1, 1]) {
    x.beginPath()
    x.ellipse(cx + s * eyeDX, eyeY, 5.2, 3.4, 0, 0, Math.PI * 2)
    x.fill()
  }
  // irises + pupils
  for (const s of [-1, 1]) {
    x.fillStyle = '#3b2a1e'
    x.beginPath()
    x.ellipse(cx + s * eyeDX, eyeY + 0.2, 2.9, 2.9, 0, 0, Math.PI * 2)
    x.fill()
    x.fillStyle = '#12100e'
    x.beginPath()
    x.ellipse(cx + s * eyeDX, eyeY + 0.2, 1.5, 1.5, 0, 0, Math.PI * 2)
    x.fill()
    x.fillStyle = 'rgba(255,255,255,0.9)'
    x.beginPath()
    x.ellipse(cx + s * eyeDX - 1, eyeY - 1.1, 0.8, 0.8, 0, 0, Math.PI * 2)
    x.fill()
  }
  // lids
  x.strokeStyle = 'rgba(90,64,48,0.75)'
  x.lineWidth = 1.3
  for (const s of [-1, 1]) {
    x.beginPath()
    x.ellipse(cx + s * eyeDX, eyeY, 5.4, 3.6, 0, Math.PI * 1.02, Math.PI * 1.98)
    x.stroke()
  }
  // brows
  x.strokeStyle = 'rgba(46,34,24,0.92)'
  x.lineWidth = 2.6
  x.lineCap = 'round'
  for (const s of [-1, 1]) {
    x.beginPath()
    x.moveTo(cx + s * (eyeDX + 6), browY + 1.4)
    x.quadraticCurveTo(cx + s * eyeDX, browY - 2.2, cx + s * (eyeDX - 6), browY)
    x.stroke()
  }
  // mouth
  x.strokeStyle = 'rgba(122,66,58,0.9)'
  x.lineWidth = 2
  x.beginPath()
  x.moveTo(cx - 7, mouthY)
  x.quadraticCurveTo(cx, mouthY + 3.2, cx + 7, mouthY)
  x.stroke()

  faceTex = new THREE.CanvasTexture(c)
  faceTex.colorSpace = THREE.SRGBColorSpace
  faceTex.anisotropy = 4
  return faceTex
}

// ── shared geometry (created once, reused by every person) ──
const G = {
  head: new THREE.SphereGeometry(0.138, 22, 18),
  ear: new THREE.SphereGeometry(0.028, 7, 6),
  // hair always sits a hair's breadth outside the skull, never inside it
  hairCap: new THREE.SphereGeometry(0.148, 20, 14, 0, Math.PI * 2, 0, Math.PI * 0.44),
  hairBack: new THREE.SphereGeometry(0.147, 18, 14, 0, Math.PI * 2, 0, Math.PI * 0.6),
  bun: new THREE.SphereGeometry(0.066, 12, 10),
  ponytail: new THREE.CapsuleGeometry(0.055, 0.17, 4, 10),
  capBrim: new THREE.BoxGeometry(0.21, 0.024, 0.115),
  neck: new THREE.CylinderGeometry(0.052, 0.062, 0.1, 12),
  chest: new THREE.CapsuleGeometry(0.132, 0.2, 6, 14),
  shoulder: new THREE.SphereGeometry(0.072, 10, 8),
  waist: new THREE.CapsuleGeometry(0.115, 0.1, 5, 12),
  upperArm: new THREE.CapsuleGeometry(0.045, 0.19, 4, 10),
  foreArm: new THREE.CapsuleGeometry(0.038, 0.18, 4, 10),
  hand: new THREE.SphereGeometry(0.048, 10, 8),
  thigh: new THREE.CapsuleGeometry(0.068, 0.3, 5, 12),
  shin: new THREE.CapsuleGeometry(0.055, 0.29, 5, 12),
  foot: new THREE.BoxGeometry(0.095, 0.055, 0.23),
  bag: new THREE.BoxGeometry(0.24, 0.3, 0.11),
  lanyard: new THREE.BoxGeometry(0.075, 0.105, 0.012),
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

const faceCache = new Map<string, THREE.MeshStandardMaterial>()
function faceMat(skin: string) {
  let m = faceCache.get(skin)
  if (!m) {
    m = new THREE.MeshStandardMaterial({ color: skin, roughness: 0.66, map: getFaceTexture() })
    faceCache.set(skin, m)
  }
  return m
}

export const SKINS = ['#e8b98e', '#d6a077', '#c68863', '#a9714c', '#8a5a3b', '#f0c9a5']
export const TOPS = [
  '#2f4f7f', '#3a6b5c', '#7a3b4e', '#40465e', '#6b5b8a',
  '#8a6a3b', '#2f6f7a', '#5c5c64', '#7a4a3b', '#3f5f3f',
]
export const BOTTOMS = ['#2a2d36', '#3a3f4b', '#4a4034', '#25303f', '#33343a']
export const HAIRS = ['#171512', '#2b2118', '#3d2a1c', '#5a4632', '#0f0f10', '#6e5c4a']

export type HairStyle = 'short' | 'bun' | 'ponytail' | 'cap' | 'bald'

export type Look = {
  skin: string
  top: string
  bottom: string
  hair: string
  height: number
  bag?: boolean
  style?: HairStyle
  badge?: boolean
}

const STYLES: HairStyle[] = ['short', 'short', 'short', 'bun', 'ponytail', 'cap', 'bald']

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
    height: 0.92 + r(5) * 0.2,
    bag: r(6) > 0.68,
    style: STYLES[Math.floor(r(7) * STYLES.length)],
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
  /** hunched over a keyboard */
  typing?: boolean
  /** arms folded / hands on the table, for people who are seated */
  seated?: boolean
  phase?: number
  castShadow?: boolean
  /** false drops the smallest details for background crowd */
  detail?: boolean
}

export default function Human({
  look,
  gait = 1,
  tempo = 1,
  talking = false,
  typing = false,
  seated = false,
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
      face: faceMat(look.skin),
      top: mat(look.top, 0.82),
      bottom: mat(look.bottom, 0.85),
      hair: mat(look.hair, 0.55),
      shoe: mat('#191b20', 0.6),
      bag: mat('#33363f', 0.8),
      badge: mat('#f0f2f5', 0.7),
    }),
    [look],
  )

  useFrame((state) => {
    const t = state.clock.elapsedTime * 4.4 * tempo + phase
    const g = gait

    const swing = Math.sin(t)
    const swing2 = Math.sin(t + Math.PI)

    if (legL.current) legL.current.rotation.x = seated ? -1.45 : swing * 0.62 * g
    if (legR.current) legR.current.rotation.x = seated ? -1.45 : swing2 * 0.62 * g
    if (kneeL.current)
      kneeL.current.rotation.x = seated ? 1.5 : -Math.max(0, -Math.sin(t + 0.7)) * 1.05 * g
    if (kneeR.current)
      kneeR.current.rotation.x = seated
        ? 1.5
        : -Math.max(0, -Math.sin(t + 0.7 + Math.PI)) * 1.05 * g
    if (ankleL.current) ankleL.current.rotation.x = seated ? 0 : -swing * 0.22 * g
    if (ankleR.current) ankleR.current.rotation.x = seated ? 0 : -swing2 * 0.22 * g

    // arms
    const armBase = talking ? -0.16 : 0
    const typeSwing = typing ? Math.sin(state.clock.elapsedTime * 9 + phase) * 0.05 : 0
    if (armL.current)
      armL.current.rotation.x = typing ? -0.62 + typeSwing : armBase + swing2 * 0.5 * g
    if (armR.current)
      armR.current.rotation.x = typing ? -0.62 - typeSwing : armBase + swing * 0.5 * g
    if (elbowL.current)
      elbowL.current.rotation.x = typing
        ? -1.02
        : -0.22 - Math.max(0, swing2) * 0.4 * g - (talking ? 0.38 + Math.sin(t * 0.85) * 0.22 : 0)
    if (elbowR.current)
      elbowR.current.rotation.x = typing
        ? -1.02
        : -0.22 - Math.max(0, swing) * 0.4 * g - (talking ? 0.38 + Math.sin(t * 0.85 + 1.6) * 0.22 : 0)

    if (hips.current) {
      hips.current.position.y = 0.9 * look.height + Math.abs(Math.sin(t)) * 0.028 * g
      hips.current.rotation.y = swing * 0.09 * g
      hips.current.rotation.z = swing * 0.035 * g
    }
    if (spine.current) {
      spine.current.rotation.y = -swing * 0.13 * g
      spine.current.rotation.x = (typing ? 0.2 : 0.045 * g) + Math.sin(t * 0.5) * 0.012
    }
    if (head.current) {
      head.current.rotation.y = swing * 0.055 * g + (talking ? Math.sin(t * 0.55) * 0.2 : 0)
      head.current.rotation.x = talking
        ? Math.sin(t * 0.8) * 0.09
        : typing
          ? 0.24
          : -0.03 * g
      head.current.position.y = 0.42 + Math.abs(Math.sin(t + 0.3)) * 0.008 * g
    }
    if (root.current && g < 0.05 && !seated) {
      root.current.position.y = Math.sin(state.clock.elapsedTime * 1.6 + phase) * 0.007
    }
  })

  const s = look.height
  const style = look.style ?? 'short'

  return (
    <group ref={root} scale={[s, s, s]}>
      <group ref={hips} position={[0, 0.9, 0]}>
        <mesh geometry={G.waist} material={M.bottom} castShadow={castShadow} />

        {/* ── spine ── */}
        <group ref={spine} position={[0, 0.1, 0]}>
          <mesh
            geometry={G.chest}
            material={M.top}
            position={[0, 0.16, 0]}
            scale={[1.16, 1, 0.86]}
            castShadow={castShadow}
          />
          {/* shoulders give the silhouette a neck to sit on */}
          <mesh geometry={G.shoulder} material={M.top} position={[-0.155, 0.255, 0]} />
          <mesh geometry={G.shoulder} material={M.top} position={[0.155, 0.255, 0]} />
          <mesh geometry={G.neck} material={M.skin} position={[0, 0.325, 0]} />

          {/* ── head ── */}
          <group ref={head} position={[0, 0.42, 0]}>
            <mesh geometry={G.head} material={M.face} castShadow={castShadow} />
            {detail && (
              <>
                <mesh geometry={G.ear} material={M.skin} position={[-0.13, -0.008, -0.006]} />
                <mesh geometry={G.ear} material={M.skin} position={[0.13, -0.008, -0.006]} />
              </>
            )}

            {style !== 'bald' && (
              <mesh
                geometry={style === 'cap' ? G.hairCap : G.hairBack}
                material={M.hair}
                position={[0, style === 'cap' ? 0.012 : 0.006, style === 'cap' ? 0 : -0.014]}
                castShadow={castShadow}
              />
            )}
            {style === 'cap' && (
              <mesh geometry={G.capBrim} material={M.hair} position={[0, 0.03, 0.126]} />
            )}
            {style === 'bun' && (
              <mesh geometry={G.bun} material={M.hair} position={[0, 0.078, -0.115]} />
            )}
            {style === 'ponytail' && (
              <mesh
                geometry={G.ponytail}
                material={M.hair}
                position={[0, -0.06, -0.145]}
                rotation={[0.36, 0, 0]}
              />
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

          {look.badge && (
            <mesh geometry={G.lanyard} material={M.badge} position={[0, 0.1, 0.125]} />
          )}
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
