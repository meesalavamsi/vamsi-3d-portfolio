import { useMemo, useRef, useState, type ReactNode } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import * as THREE from 'three'

/* drei's <Html> keeps projecting when a point is behind the camera, which throws
   giant mirrored labels on screen — and `distanceFactor` blows the label up to
   full-screen size when you stand next to it. So: mount only while the anchor is
   genuinely in front of the camera and in range, keep the label in screen space,
   and scale/fade it gently by distance within a hard clamp. */

export default function WorldLabel({
  position,
  children,
  maxDist = 72,
  hidden = false,
}: {
  position: [number, number, number]
  children: ReactNode
  maxDist?: number
  hidden?: boolean
}) {
  const g = useRef<THREE.Group>(null)
  const el = useRef<HTMLDivElement>(null)
  const [show, setShow] = useState(false)
  const tmp = useMemo(
    () => ({
      p: new THREE.Vector3(),
      d: new THREE.Vector3(),
      f: new THREE.Vector3(),
      n: new THREE.Vector3(),
    }),
    [],
  )
  const t = useRef(0)

  useFrame(({ camera }, dt) => {
    t.current += dt
    if (t.current < 0.1 || !g.current) return
    t.current = 0

    g.current.getWorldPosition(tmp.p)
    tmp.d.copy(tmp.p).sub(camera.position)
    const dist = tmp.d.length()
    camera.getWorldDirection(tmp.f)
    const inFront = tmp.d.normalize().dot(tmp.f) > 0.2

    // also drop labels whose anchor is outside the frame, or they get pinned
    // to the edge as half-cut text (very visible on tall phone screens)
    tmp.n.copy(tmp.p).project(camera)
    const onScreen =
      inFront && Math.abs(tmp.n.x) < 0.9 && tmp.n.y > -0.95 && tmp.n.y < 0.98

    const next = !hidden && onScreen && dist < maxDist
    if (next !== show) setShow(next)

    if (el.current) {
      // shrink a touch with distance, never balloon up close
      const s = THREE.MathUtils.clamp(1.1 - dist * 0.008, 0.66, 1.1)
      const fade = THREE.MathUtils.clamp((maxDist - dist) / (maxDist * 0.35), 0.16, 1)
      el.current.style.transform = `scale(${s.toFixed(3)})`
      el.current.style.opacity = fade.toFixed(2)
    }
  })

  return (
    <group ref={g} position={position}>
      {show && (
        <Html center zIndexRange={[18, 0]} style={{ pointerEvents: 'none', userSelect: 'none' }}>
          <div ref={el} style={{ transition: 'opacity 0.25s linear', willChange: 'transform' }}>
            {children}
          </div>
        </Html>
      )}
    </group>
  )
}
