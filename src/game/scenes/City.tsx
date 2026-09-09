import { useMemo, useRef, useState, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useGameStore } from '../gstore'
import { strangerDialogue, shopDialogue, diaryText } from '../story'

const BOUNDS = 42

/* ── procedural neon city ─────────────────────────────── */
function Buildings() {
  const { positions, scales, colors } = useMemo(() => {
    const positions: [number, number, number][] = []
    const scales: [number, number, number][] = []
    const colors: string[] = []
    const palette = ['#0d1b2e', '#101c33', '#0a1626', '#131f38']
    for (let x = -BOUNDS; x <= BOUNDS; x += 8) {
      for (let z = -BOUNDS; z <= BOUNDS; z += 8) {
        if (Math.abs(x) < 6 && Math.abs(z) < 6) continue // plaza
        if (Math.random() < 0.18) continue // empty lot
        const h = 6 + Math.random() * 26
        positions.push([x + (Math.random() - 0.5) * 2.5, h / 2, z + (Math.random() - 0.5) * 2.5])
        scales.push([3.5 + Math.random() * 2.5, h, 3.5 + Math.random() * 2.5])
        colors.push(palette[Math.floor(Math.random() * palette.length)])
      }
    }
    return { positions, scales, colors }
  }, [])

  const ref = useRef<THREE.InstancedMesh>(null)
  useEffect(() => {
    if (!ref.current) return
    const m = new THREE.Matrix4()
    const c = new THREE.Color()
    positions.forEach((p, i) => {
      m.makeScale(...scales[i])
      m.setPosition(p[0], p[1], p[2])
      ref.current!.setMatrixAt(i, m)
      ref.current!.setColorAt(i, c.set(colors[i]))
    })
    ref.current.instanceMatrix.needsUpdate = true
    if (ref.current.instanceColor) ref.current.instanceColor.needsUpdate = true
  }, [positions, scales, colors])

  return (
    <instancedMesh ref={ref} args={[undefined, undefined, positions.length]}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial roughness={0.4} metalness={0.7} />
    </instancedMesh>
  )
}

/** glowing window planes + neon signs */
function Neon() {
  const signs = useMemo(() => {
    const arr: { pos: [number, number, number]; color: string; w: number }[] = []
    const palette = ['#4dd0ff', '#ff4d94', '#a78bfa', '#62d84e', '#fbbf24']
    for (let i = 0; i < 40; i++) {
      arr.push({
        pos: [(Math.random() - 0.5) * 80, 4 + Math.random() * 18, (Math.random() - 0.5) * 80],
        color: palette[i % palette.length],
        w: 1.5 + Math.random() * 3,
      })
    }
    return arr
  }, [])
  return (
    <group>
      {signs.map((s, i) => (
        <mesh key={i} position={s.pos} rotation={[0, Math.random() * Math.PI, 0]}>
          <planeGeometry args={[s.w, 0.5]} />
          <meshBasicMaterial color={s.color} side={THREE.DoubleSide} transparent opacity={0.9} />
        </mesh>
      ))}
    </group>
  )
}

/** instanced rain */
function Rain({ count = 900 }: { count?: number }) {
  const ref = useRef<THREE.InstancedMesh>(null)
  const drops = useMemo(() => Array.from({ length: count }, () => ({
    x: (Math.random() - 0.5) * 90, y: Math.random() * 40, z: (Math.random() - 0.5) * 90, v: 22 + Math.random() * 10,
  })), [count])
  const m = useMemo(() => new THREE.Matrix4(), [])
  useFrame((_, dt) => {
    if (!ref.current) return
    const d = Math.min(dt, 0.05)
    drops.forEach((drop, i) => {
      drop.y -= drop.v * d
      if (drop.y < 0) drop.y = 40
      m.makeScale(1, 1, 1)
      m.setPosition(drop.x, drop.y, drop.z)
      ref.current!.setMatrixAt(i, m)
    })
    ref.current.instanceMatrix.needsUpdate = true
  })
  return (
    <instancedMesh ref={ref} args={[undefined, undefined, count]} frustumCulled={false}>
      <boxGeometry args={[0.015, 0.7, 0.015]} />
      <meshBasicMaterial color="#7db9e8" transparent opacity={0.35} />
    </instancedMesh>
  )
}

/** flying vehicles crossing the sky */
function Vehicles() {
  const ref = useRef<THREE.Group>(null)
  const ships = useMemo(() => Array.from({ length: 7 }, (_, i) => ({
    y: 14 + Math.random() * 14, z: (Math.random() - 0.5) * 70, speed: 6 + Math.random() * 8, offset: i * 17,
  })), [])
  useFrame(({ clock }) => {
    if (!ref.current) return
    ref.current.children.forEach((c, i) => {
      const s = ships[i]
      c.position.x = ((clock.elapsedTime * s.speed + s.offset * 10) % 160) - 80
      c.position.y = s.y + Math.sin(clock.elapsedTime + i) * 0.6
      c.position.z = s.z
    })
  })
  return (
    <group ref={ref}>
      {ships.map((s, i) => (
        <group key={i}>
          <mesh><boxGeometry args={[2.2, 0.3, 0.8]} /><meshStandardMaterial color="#0a1220" emissive={i % 2 ? '#ff4d94' : '#4dd0ff'} emissiveIntensity={1.4} /></mesh>
          <pointLight color={i % 2 ? '#ff4d94' : '#4dd0ff'} intensity={3} distance={7} />
        </group>
      ))}
    </group>
  )
}

/** wandering NPC silhouettes */
function Npcs() {
  const ref = useRef<THREE.Group>(null)
  const npcs = useMemo(() => Array.from({ length: 10 }, (_, i) => ({
    cx: (Math.random() - 0.5) * 60, cz: (Math.random() - 0.5) * 60,
    r: 3 + Math.random() * 8, speed: 0.2 + Math.random() * 0.4, phase: i * 1.3,
  })), [])
  useFrame(({ clock }) => {
    if (!ref.current) return
    ref.current.children.forEach((c, i) => {
      const n = npcs[i]
      const t = clock.elapsedTime * n.speed + n.phase
      c.position.x = n.cx + Math.cos(t) * n.r
      c.position.z = n.cz + Math.sin(t) * n.r
      c.rotation.y = -t
    })
  })
  return (
    <group ref={ref}>
      {npcs.map((_, i) => (
        <group key={i}>
          <mesh position={[0, 0.8, 0]}>
            <capsuleGeometry args={[0.25, 0.9, 4, 10]} />
            <meshStandardMaterial color="#111a2c" emissive="#3b4a6b" emissiveIntensity={0.4} />
          </mesh>
        </group>
      ))}
    </group>
  )
}

/* ── hotspots ─────────────────────────────────────────── */
interface Hotspot {
  id: string
  pos: [number, number, number]
  label: string
  color: string
  visible: boolean
}

function HotspotMesh({ h }: { h: Hotspot }) {
  const ref = useRef<THREE.Mesh>(null)
  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.rotation.y = clock.elapsedTime * 1.2
      ref.current.position.y = h.pos[1] + Math.sin(clock.elapsedTime * 2) * 0.15
    }
  })
  if (!h.visible) return null
  return (
    <group position={[h.pos[0], 0, h.pos[2]]}>
      <mesh ref={ref} position={[0, h.pos[1], 0]}>
        <octahedronGeometry args={[0.35]} />
        <meshStandardMaterial color={h.color} emissive={h.color} emissiveIntensity={2.4} />
      </mesh>
      <pointLight color={h.color} intensity={5} distance={7} position={[0, h.pos[1], 0]} />
    </group>
  )
}

/* ── main city scene ──────────────────────────────────── */
export default function City({ onPrompt }: { onPrompt: (p: string | null) => void }) {
  const s = useGameStore()
  const [playerPos, setPlayerPos] = useState<[number, number, number]>([0, 0, 0])
  const keys = useRef<Record<string, boolean>>({})
  const posRef = useRef<[number, number, number]>([0, 0, 0])
  const [strangerVisible, setStrangerVisible] = useState(false)
  const [chaseEvent, setChaseEvent] = useState(false)
  const interactRef = useRef<string | null>(null)

  // stranger appears after ~30s
  useEffect(() => {
    if (s.strangerMet) return
    const t = setTimeout(() => setStrangerVisible(true), 30000)
    return () => clearTimeout(t)
  }, [s.strangerMet])

  // chase event after shop
  useEffect(() => {
    if (s.shopMet && !s.chaseChoice && !chaseEvent) {
      const t = setTimeout(() => {
        setChaseEvent(true)
        s.say('DISTANT SHOUT', ['Help! Someone—', 'A figure runs past you. Another follows.'], 'chase-choice')
      }, 6000)
      return () => clearTimeout(t)
    }
  }, [s.shopMet, s.chaseChoice, chaseEvent, s])

  // keyboard
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      keys.current[e.key.toLowerCase()] = true
      if (e.key.toLowerCase() === 'e' && interactRef.current) trigger(interactRef.current)
    }
    const up = (e: KeyboardEvent) => { keys.current[e.key.toLowerCase()] = false }
    window.addEventListener('keydown', down)
    window.addEventListener('keyup', up)
    return () => { window.removeEventListener('keydown', down); window.removeEventListener('keyup', up) }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [strangerVisible, chaseEvent, s.shopMet, s.foundDiary, s.doorOpen, s.metAstra])

  const trigger = (id: string) => {
    const st = useGameStore.getState()
    if (id === 'stranger' && !st.strangerMet) {
      st.set({ strangerMet: true })
      st.say(strangerDialogue.speaker, strangerDialogue.lines)
      setStrangerVisible(false)
    } else if (id === 'shop' && !st.shopMet) {
      st.set({ shopMet: true })
      st.say(shopDialogue.speaker, [...shopDialogue.lines, '', 'SYSTEM: MEMORY CONFLICT DETECTED'])
      setTimeout(() => st.doGlitch(1200), 2500)
    } else if (id === 'photo' && !st.foundPhoto) {
      st.set({ foundPhoto: true })
      st.addSecret('photo')
      st.say('YOU', ['A photograph.', 'It shows... you.', 'You have never taken this photograph.'])
    } else if (id === 'diary' && !st.foundDiary) {
      st.set({ foundDiary: true, doorOpen: true })
      st.addSecret('diary')
      st.doGlitch(800)
      st.say('A DIARY', [...diaryText, '', 'SOMETHING HAS CHANGED.', 'A door is open somewhere.'])
    } else if (id === 'labdoor' && st.doorOpen) {
      st.set({ phase: 'lab' })
    } else if (id === 'vamsi') {
      st.addSecret('vamsi-room')
      st.set({ phase: 'vamsiroom' })
    } else if (id === 'chaseresult' && st.chaseChoice && !st.chaseResolved) {
      st.set({ chaseResolved: true })
      if (st.chaseChoice === 'helped') st.say('THE STRANGER YOU SAVED', ['You saved me.', 'I will not forget this. Neither will the city.'])
      else if (st.chaseChoice === 'ignored') st.say('ASTRA', ['...', 'Interesting. You watched, and did nothing.'])
      else st.say('ASTRA', ['You followed the attacker into the dark.', 'Bold. The city noticed.'])
    }
  }

  const hotspots: Hotspot[] = [
    { id: 'stranger', pos: [6, 1.4, -4], label: 'TALK', color: '#ffffff', visible: strangerVisible && !s.strangerMet },
    { id: 'shop', pos: [-14, 1.4, 10], label: 'ENTER SHOP', color: '#fbbf24', visible: !s.shopMet },
    { id: 'photo', pos: [16, 1.2, 14], label: 'PICK UP', color: '#4dd0ff', visible: s.strangerMet && !s.foundPhoto },
    { id: 'diary', pos: [-20, 1.2, -16], label: 'READ', color: '#a78bfa', visible: s.foundPhoto && !s.foundDiary },
    { id: 'labdoor', pos: [0, 1.4, -30], label: 'DESCEND', color: '#62d84e', visible: s.doorOpen },
    { id: 'vamsi', pos: [34, 1.4, 34], label: '???', color: '#ff4d5e', visible: true },
    { id: 'chaseresult', pos: [-4, 1.4, 20], label: '...', color: '#ff4d94', visible: !!s.chaseChoice && !s.chaseResolved },
  ]

  /* player rig inside canvas */
  function PlayerRig() {
    const grp = useRef<THREE.Group>(null)
    useFrame(({ camera }, dt) => {
      const d = Math.min(dt, 0.05)
      const speed = 9 * d
      let [x, y, z] = posRef.current
      let moved = false
      if (keys.current['w'] || keys.current['arrowup']) { z -= speed; moved = true }
      if (keys.current['s'] || keys.current['arrowdown']) { z += speed; moved = true }
      if (keys.current['a'] || keys.current['arrowleft']) { x -= speed; moved = true }
      if (keys.current['d'] || keys.current['arrowright']) { x += speed; moved = true }
      x = THREE.MathUtils.clamp(x, -BOUNDS, BOUNDS)
      z = THREE.MathUtils.clamp(z, -BOUNDS, BOUNDS)
      if (moved) {
        posRef.current = [x, y, z]
        setPlayerPos([x, y, z])
      }
      if (grp.current) {
        grp.current.position.set(x, y, z)
        grp.current.rotation.y = Math.sin(Date.now() / 400) * 0.03
      }
      // camera follow
      camera.position.lerp(new THREE.Vector3(x, 7.5, z + 11), 0.06)
      camera.lookAt(x, 1.4, z)
      // proximity
      let near: string | null = null
      let label: string | null = null
      for (const h of hotspots) {
        if (!h.visible) continue
        if (Math.hypot(h.pos[0] - x, h.pos[2] - z) < 3.2) { near = h.id; label = h.label; break }
      }
      interactRef.current = near
      onPrompt(label)
    })
    return (
      <group ref={grp}>
        <mesh position={[0, 0.85, 0]}>
          <capsuleGeometry args={[0.3, 1, 6, 14]} />
          <meshStandardMaterial color="#0e1a30" emissive="#4dd0ff" emissiveIntensity={0.8} />
        </mesh>
        <mesh position={[0, 1.45, 0.2]}>
          <boxGeometry args={[0.36, 0.1, 0.16]} />
          <meshStandardMaterial color="#4dd0ff" emissive="#4dd0ff" emissiveIntensity={2.5} />
        </mesh>
        <pointLight color="#4dd0ff" intensity={4} distance={8} position={[0, 1.6, 0]} />
      </group>
    )
  }

  return (
    <div className="absolute inset-0">
      <Canvas camera={{ position: [0, 7.5, 11], fov: 55 }} dpr={[1, 1.6]} gl={{ antialias: true }}>
        <color attach="background" args={['#050812']} />
        <fog attach="fog" args={['#050812', 18, 70]} />
        <ambientLight intensity={0.22} />
        <directionalLight position={[10, 30, 5]} intensity={0.35} color="#5f7dbb" />
        {/* ground */}
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[120, 120]} />
          <meshStandardMaterial color="#070b16" roughness={0.25} metalness={0.85} />
        </mesh>
        <gridHelper args={[120, 60, '#12224a', '#0a1226']} position={[0, 0.02, 0]} />
        <Buildings />
        <Neon />
        <Rain />
        <Vehicles />
        <Npcs />
        {hotspots.map((h) => <HotspotMesh key={h.id} h={h} />)}
        {/* stranger NPC figure */}
        {strangerVisible && !s.strangerMet && (
          <mesh position={[6, 0.9, -4]}>
            <capsuleGeometry args={[0.28, 1, 4, 10]} />
            <meshStandardMaterial color="#1a1030" emissive="#ffffff" emissiveIntensity={0.7} />
          </mesh>
        )}
        <PlayerRig />
      </Canvas>
      <input type="hidden" value={playerPos.join(',')} readOnly />
    </div>
  )
}
