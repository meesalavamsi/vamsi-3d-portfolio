import { Fragment, useEffect, useMemo, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import Human, { makeLook, type Look } from './Human'
import WorldLabel from './WorldLabel'
import { useGame } from '../state'
import { interiors, spotActive, type InteriorDef, type Spot } from '../data/interiors'
import {
  Banner, Bin, Box, Chair, CeilingLight, Clock, Counter, Desk, DISC, ExitDoor, Laptop,
  Monitor, NoticeBoard, Panel, Plant, Podium, PLANE, Rug, ServerRack, SideDoor, Sofa, Stage,
  TableClutter, UNIT, Vent, WallScreen, WaterCooler, Whiteboard, Windows, flat, floorMat,
  glow, mat, signMat, wallMat,
} from './InteriorKit'

/* ═══════════════════════════════════════════════════════════════
   Walk-in interiors. Each objective building has a real room
   behind its doors: furniture, screens with content on them, and
   people who are actually doing the work the scenario describes.
   ═══════════════════════════════════════════════════════════════ */

type RoomProps = { def: InteriorDef; light: boolean }

/* ── a person standing/sitting somewhere in the room ─────────── */

function Person({
  p, ry = 0, seed = 1, look, seated, typing, talking, gait = 0, tempo = 1, badge, tag,
}: {
  p: [number, number]
  ry?: number
  seed?: number
  look?: Partial<Look>
  seated?: boolean
  typing?: boolean
  talking?: boolean
  gait?: number
  tempo?: number
  badge?: boolean
  tag?: string
}) {
  const l = useMemo(() => ({ ...makeLook(seed), badge, ...look }), [seed, badge, look])
  // a seated hip joint sits just above the cushion, not on top of the person's legs
  const y = seated ? -0.28 : 0
  return (
    <group position={[p[0], y, p[1]]} rotation={[0, ry, 0]}>
      <Human
        look={l}
        gait={gait}
        tempo={tempo}
        phase={seed * 6.28}
        seated={seated}
        typing={typing}
        talking={talking}
        castShadow={false}
        detail={false}
      />
      {!seated && (
        <mesh geometry={DISC} material={flat('#000', 0.24)} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.03, 0]} scale={[0.8, 0.8, 1]} />
      )}
      {tag && (
        <WorldLabel position={[0, 2.1, 0]} maxDist={22}>
          <div
            style={{
              fontFamily: '"JetBrains Mono", monospace',
              fontSize: '9px',
              letterSpacing: '0.14em',
              color: '#d4d8de',
              textShadow: '0 2px 8px rgba(0,0,0,0.95)',
              whiteSpace: 'nowrap',
            }}
          >
            {tag}
          </div>
        </WorldLabel>
      )}
    </group>
  )
}

/* ── the shell: floor, walls, ceiling, lights, way out ───────── */

function Room({
  def, surface, children,
}: {
  def: InteriorDef
  surface: 'tile' | 'carpet' | 'concrete'
  children?: React.ReactNode
}) {
  const hw = def.w / 2
  const hd = def.d / 2
  const walls = wallMat(def.wall, Math.max(4, Math.round(def.w / 3)))
  const lightRows = useMemo(() => {
    const out: [number, number][] = []
    const cols = def.w > 21 ? 3 : 2
    const rows = Math.max(2, Math.round(def.d / 7))
    for (let i = 0; i < cols; i++)
      for (let j = 0; j < rows; j++)
        out.push([
          -def.w / 2 + (def.w / cols) * (i + 0.5),
          -def.d / 2 + (def.d / rows) * (j + 0.5),
        ])
    return out
  }, [def])

  return (
    <group>
      {/* floor + ceiling */}
      <mesh
        geometry={PLANE}
        material={floorMat(def.floor, surface, Math.max(3, Math.round(def.w / 2.6)))}
        rotation={[-Math.PI / 2, 0, 0]}
        scale={[def.w, def.d, 1]}
        receiveShadow
      />
      <mesh
        geometry={PLANE}
        material={floorMat('#585d68', 'tile', Math.max(4, Math.round(def.w / 2.2)))}
        rotation={[Math.PI / 2, 0, 0]}
        position={[0, def.h, 0]}
        scale={[def.w, def.d, 1]}
      />

      {/* walls, facing inward */}
      <mesh geometry={PLANE} material={walls} position={[0, def.h / 2, -hd]} scale={[def.w, def.h, 1]} />
      <mesh geometry={PLANE} material={walls} position={[0, def.h / 2, hd]} rotation={[0, Math.PI, 0]} scale={[def.w, def.h, 1]} />
      <mesh geometry={PLANE} material={walls} position={[-hw, def.h / 2, 0]} rotation={[0, Math.PI / 2, 0]} scale={[def.d, def.h, 1]} />
      <mesh geometry={PLANE} material={walls} position={[hw, def.h / 2, 0]} rotation={[0, -Math.PI / 2, 0]} scale={[def.d, def.h, 1]} />

      {/* skirting + a painted band so the walls aren't flat colour */}
      {([
        [[0, 0, -hd + 0.05], [def.w, 1], 0],
        [[0, 0, hd - 0.05], [def.w, 1], Math.PI],
        [[-hw + 0.05, 0, 0], [def.d, 1], Math.PI / 2],
        [[hw - 0.05, 0, 0], [def.d, 1], -Math.PI / 2],
      ] as [[number, number, number], [number, number], number][]).map(([p, s, r], i) => (
        <Fragment key={i}>
          <mesh geometry={UNIT} material={mat('#22252b', 0.9)} position={[p[0], 0.09, p[2]]} rotation={[0, r, 0]} scale={[s[0], 0.18, 0.08]} />
          <mesh geometry={UNIT} material={mat('#7d8492', 0.8)} position={[p[0], 1.02, p[2]]} rotation={[0, r, 0]} scale={[s[0], 0.06, 0.05]} />
          <mesh geometry={UNIT} material={mat(def.accent, 0.75)} position={[p[0], def.h - 0.42, p[2]]} rotation={[0, r, 0]} scale={[s[0], 0.045, 0.04]} />
        </Fragment>
      ))}

      {/* ceiling panels */}
      {lightRows.map(([x, z], i) => (
        <CeilingLight key={i} p={[x, z]} y={def.h - 0.14} />
      ))}
      {/* ceiling structure + air handling */}
      {Array.from({ length: Math.round(def.d / 4) }, (_, i) => (
        <Fragment key={`b${i}`}>
          <mesh
            geometry={UNIT}
            material={mat('#3c414a', 0.9)}
            position={[0, def.h - 0.16, -hd + 2 + i * 4]}
            scale={[def.w, 0.2, 0.22]}
          />
          <Vent p={[i % 2 ? hw - 2.2 : -hw + 2.2, -hd + 2 + i * 4]} y={def.h - 0.3} />
        </Fragment>
      ))}

      {/* the way out, plus a service door so the room has more than one exit */}
      <ExitDoor p={[0, 0, hd - 0.1]} ry={Math.PI} />
      <SideDoor p={[-hw + 2.6, 0, hd - 0.07]} rot={[0, Math.PI, 0]} />
      <NoticeBoard p={[hw - 2.7, 1.75, hd - 0.08]} rot={[0, Math.PI, 0]} />
      <Bin p={[hw - 0.8, hd - 0.8]} />
      <WaterCooler p={[-hw + 0.7, hd - 0.9]} />

      {children}
    </group>
  )
}

/* ── the little glowing pad you stand on ─────────────────────── */

function SpotMarker({ spot, color, done, near }: { spot: Spot; color: string; done: boolean; near: boolean }) {
  const ring = useRef<THREE.Mesh>(null)
  useFrame((s) => {
    if (!ring.current) return
    const k = 1 + Math.sin(s.clock.elapsedTime * 2.2) * 0.06
    ring.current.scale.set(k * 1.15, k * 1.15, 1)
    ;(ring.current.material as THREE.MeshBasicMaterial).opacity = done ? 0.2 : 0.45 + Math.sin(s.clock.elapsedTime * 2.2) * 0.2
  })
  const c = done ? '#4ade80' : color
  return (
    <group position={[spot.at[0], 0, spot.at[1]]}>
      <mesh ref={ring} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.045, 0]}>
        <ringGeometry args={[0.86, 1.12, 34]} />
        <meshBasicMaterial color={c} transparent opacity={0.5} side={THREE.DoubleSide} />
      </mesh>
      <mesh geometry={DISC} material={flat(c, done ? 0.05 : 0.12)} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.035, 0]} scale={[1.9, 1.9, 1]} />
      <WorldLabel position={[0, 2.5, 0]} maxDist={30} hidden={near}>
        <div style={{ fontFamily: '"JetBrains Mono", monospace', textAlign: 'center', whiteSpace: 'nowrap' }}>
          <div style={{ fontSize: '9px', letterSpacing: '0.2em', color: c, textShadow: `0 0 10px ${c}, 0 1px 6px rgba(0,0,0,0.9)` }}>
            {done ? 'DONE ✓' : spot.kind === 'exit' ? 'EXIT' : spot.label.toUpperCase()}
          </div>
          <div style={{ marginTop: '3px', fontSize: '11px', color: '#fafaf9', textShadow: '0 2px 10px rgba(0,0,0,0.95)' }}>
            {spot.sub}
          </div>
        </div>
      </WorldLabel>
    </group>
  )
}

/* ═══════════════════ room 1 · university IT ═════════════════ */

function CampusRoom({ def }: RoomProps) {
  const hd = def.d / 2
  return (
    <Room def={def} surface="tile">
      <Counter p={[0, -3.4]} w={9.2} col="#4b5364" />
      <Monitor p={[-2.6, -3.7]} ry={Math.PI} kind="board" seed={1} y={1.09} w={0.7} h={0.44} />
      <Monitor p={[2.6, -3.7]} ry={Math.PI} kind="terminal" seed={2} y={1.09} w={0.7} h={0.44} />
      <Chair p={[-2.6, -4.7]} />
      <Chair p={[2.6, -4.7]} />
      <Person p={[-2.6, -4.55]} seed={11} seated typing badge tag="IT DESK" />
      <Person p={[2.6, -4.55]} seed={12} seated typing badge />

      {/* the student who is about to ask you something */}
      <Person p={[1.5, -1.7]} ry={Math.PI} seed={23} talking tag="WAITING" />
      <Person p={[-1.9, -1.5]} ry={Math.PI - 0.4} seed={24} />

      {/* queue display + signage behind the desk */}
      <WallScreen p={[0, 2.6, -hd + 0.12]} w={4.6} h={1.5} kind="board" seed={4} />
      <Banner p={[-6.4, 2.5, -hd + 0.1]} w={2.4} h={1.5} lines={['BLOCK C', 'IT SERVICE DESK']} accent="#a78bfa" bg="#1b1730" />
      <Banner p={[6.4, 2.5, -hd + 0.1]} w={2.4} h={1.5} lines={['SLA', 'response < 4h']} accent="#a78bfa" bg="#1b1730" />

      {/* waiting area */}
      <Sofa p={[8.4, -1.4]} ry={-Math.PI / 2} w={2.6} col="#3f4757" />
      <Sofa p={[8.4, 1.6]} ry={-Math.PI / 2} w={2.6} col="#3f4757" />
      <Person p={[7.6, -1.4]} ry={-Math.PI / 2} seed={31} seated />
      <Person p={[7.6, 1.9]} ry={-Math.PI / 2} seed={32} seated />

      {/* print / self-service bay */}
      <Box p={[-8, 0.55, -5]} s={[2.4, 1.1, 1.6]} m={mat('#33383f', 0.8)} />
      <Box p={[-8, 1.16, -5]} s={[2.2, 0.12, 1.4]} m={mat('#4a505a', 0.6)} />
      <Panel p={[-8, 1.24, -5]} s={[0.7, 0.5]} m={signMat(['SELF', 'SERVICE'], { bg: '#1c1f26', accent: '#a78bfa', w: 256, h: 192 })} rot={[-Math.PI / 2, 0, 0]} />
      <Person p={[-8, -3.2]} ry={Math.PI} seed={41} />

      <Windows p={[-def.w / 2 + 0.08, 0, 0]} rot={[0, Math.PI / 2, 0]} along={def.d - 3} bays={3} h={1.9} y={2} />
      <Clock p={[0, 3.72, -hd + 0.12]} />
      <Plant p={[-9, 3.2]} />
      <Plant p={[9, 3.4]} s={0.9} />
      <Rug p={[0, 1.2]} w={7} d={4.4} col="#464c59" />
    </Room>
  )
}

/* ═══════════════ room 2 · automation platform floor ═════════ */

function BacklogRoom({ def }: RoomProps) {
  const hd = def.d / 2
  const pods: [number, number][] = [
    [-5.5, 1],
    [-5.5, -3.5],
    [5.5, 1],
    [5.5, -3.5],
  ]
  return (
    <Room def={def} surface="carpet">
      {pods.map(([x, z], i) => (
        <Fragment key={i}>
          <Desk p={[x, z]} w={6.8} d={1.8} top="#5b6272" />
          {[-2.1, 0, 2.1].map((o, k) => (
            <Monitor
              key={k}
              p={[x + o, z - 0.35]}
              ry={Math.PI}
              kind={(['board', 'code', 'terminal'] as const)[(i + k) % 3]}
              seed={i * 3 + k}
              y={0.81}
              w={0.72}
              h={0.44}
            />
          ))}
          {[-2.1, 0, 2.1].map((o, k) => (
            <Fragment key={`s${k}`}>
              <Chair p={[x + o, z + 1.35]} ry={Math.PI} />
              {(i + k) % 3 !== 2 && (
                <Person
                  p={[x + o, z + 1.2]}
                  ry={Math.PI}
                  seed={i * 7 + k * 3 + 5}
                  seated
                  typing
                  badge
                />
              )}
            </Fragment>
          ))}
          <TableClutter p={[x + 2.7, z]} seed={i + 2} kind="office" />
        </Fragment>
      ))}

      {/* the request board — the thing the scenario is about */}
      <Box p={[0, 0.42, -7.2]} s={[6, 0.84, 1.2]} m={mat('#3a4049', 0.85)} />
      <Box p={[0, 0.88, -7.2]} s={[6.2, 0.08, 1.35]} m={mat('#4c535e', 0.6)} />
      <WallScreen p={[-3.1, 2.5, -hd + 0.12]} w={5.4} h={2.6} kind="board" seed={9} />
      <WallScreen p={[3.1, 2.5, -hd + 0.12]} w={5.4} h={2.6} kind="chart" seed={3} />
      <Banner p={[8.6, 2.4, -hd + 0.1]} w={2.2} h={2.6} lines={['500+', 'requests / month', 'one workflow hub']} accent="#4ade80" bg="#10231a" />
      <Person p={[-2.2, -5.6]} ry={0.4} seed={61} talking tag="LEAD" />
      <Person p={[0.9, -5.9]} ry={-0.5} seed={62} talking />

      <Whiteboard p={[-def.w / 2 + 0.14, 2.1, 4]} rot={[0, Math.PI / 2, 0]} w={3.4} h={1.8} />
      <Windows p={[def.w / 2 - 0.08, 0, 0]} rot={[0, -Math.PI / 2, 0]} along={def.d - 4} bays={4} h={2} y={2} />
      <Sofa p={[-8.6, 6.2]} w={2.4} col="#454d5e" />
      <Plant p={[-10.2, 4.4]} />
      <Plant p={[10.2, 4.6]} s={0.85} />
      <Clock p={[6.2, 3.3, -hd + 0.12]} />
    </Room>
  )
}

/* ═══════════════ room 3 · inverter control room ═════════════ */

function InverterRoom({ def }: RoomProps) {
  const hd = def.d / 2
  return (
    <Room def={def} surface="concrete">
      {/* video wall */}
      <Box p={[0, 2.9, -hd + 0.08]} s={[def.w - 2.4, 3.6, 0.16]} m={mat('#15181d', 0.8)} />
      <WallScreen p={[-4.6, 3.1, -hd + 0.2]} w={4.2} h={2.4} kind="chart" seed={1} />
      <WallScreen p={[0, 3.1, -hd + 0.2]} w={4.2} h={2.4} kind="grid" seed={2} />
      <WallScreen p={[4.6, 3.1, -hd + 0.2]} w={4.2} h={2.4} kind="terminal" seed={3} />
      <Banner p={[0, 1.1, -hd + 0.2]} w={5.4} h={0.6} lines={['24 INVERTERS · LIVE TELEMETRY']} accent="#f0b429" bg="#1a1508" />

      {/* console */}
      <Desk p={[0, -2.6]} w={10.4} d={1.6} top="#3f454f" />
      {[-3.6, -1.2, 1.2, 3.6].map((x, i) => (
        <Monitor key={i} p={[x, -3]} ry={Math.PI} kind={(['chart', 'terminal', 'chart', 'grid'] as const)[i]} seed={10 + i} y={0.81} w={0.78} h={0.48} />
      ))}
      {[-2.4, 2.4].map((x, i) => (
        <Fragment key={i}>
          <Chair p={[x, -1.5]} ry={Math.PI} />
          <Person p={[x, -1.65]} ry={Math.PI} seed={71 + i} seated typing badge tag={i === 0 ? 'OPS' : undefined} />
        </Fragment>
      ))}
      <TableClutter p={[4.6, -2.6]} seed={5} kind="office" />

      {/* racks down both sides */}
      {[-3.4, -1, 1.4].map((z, i) => (
        <Fragment key={i}>
          <ServerRack p={[-8.6, z]} ry={Math.PI / 2} h={2.2} />
          <ServerRack p={[8.6, z]} ry={-Math.PI / 2} h={2.2} />
        </Fragment>
      ))}

      <Person p={[-5.6, 2.4]} ry={-0.6} seed={73} talking />
      <Person p={[-3.4, 2.9]} ry={2.4} seed={74} talking tag="FIELD ENG" />
      <Plant p={[7.6, 5.6]} s={0.9} />
      <Clock p={[def.w / 2 - 0.12, 3.2, 3]} rot={[0, -Math.PI / 2, 0]} />
    </Room>
  )
}

/* ═══════════════ room 4 · security operations ═══════════════ */

function SecurityRoom({ def }: RoomProps) {
  const hd = def.d / 2
  return (
    <Room def={def} surface="concrete">
      <Box p={[0, 2.6, -hd + 0.08]} s={[def.w - 2, 3.2, 0.16]} m={mat('#16181d', 0.8)} />
      <WallScreen p={[-3.7, 2.8, -hd + 0.2]} w={5.4} h={2.5} kind="alert" seed={1} />
      <WallScreen p={[3.7, 2.8, -hd + 0.2]} w={5.4} h={2.5} kind="grid" seed={2} />

      <Desk p={[0, -2.2]} w={8.8} d={1.6} top="#3a4049" />
      {[-2.8, -0.9, 0.9, 2.8].map((x, i) => (
        <Monitor key={i} p={[x, -2.6]} ry={Math.PI} kind={(['alert', 'terminal', 'grid', 'code'] as const)[i]} seed={20 + i} y={0.81} w={0.7} h={0.44} />
      ))}
      {[-1.9, 1.9].map((x, i) => (
        <Fragment key={i}>
          <Chair p={[x, -1.1]} ry={Math.PI} />
          <Person p={[x, -1.25]} ry={Math.PI} seed={81 + i} seated typing badge tag={i === 0 ? 'SOC ANALYST' : undefined} />
        </Fragment>
      ))}

      <Box p={[-7.2, 1, 1.5]} s={[2.4, 2, 5.2]} m={mat('#31363e', 0.85)} />
      <Box p={[7.2, 1, 1.5]} s={[2.4, 2, 5.2]} m={mat('#31363e', 0.85)} />
      {[-1, 0.6, 2.2].map((z, i) => (
        <Fragment key={i}>
          <Panel p={[-5.98, 1.4, z]} s={[1.1, 0.7]} m={signMat(['RUNBOOK'], { bg: '#241416', accent: '#f87171', w: 256, h: 128 })} rot={[0, Math.PI / 2, 0]} />
          <Panel p={[5.98, 1.4, z]} s={[1.1, 0.7]} m={signMat(['PHISHING', 'REPORT IT'], { bg: '#241416', accent: '#f87171', w: 256, h: 160 })} rot={[0, -Math.PI / 2, 0]} />
        </Fragment>
      ))}
      <Banner p={[0, 1.0, -hd + 0.2]} w={5.2} h={0.55} lines={['VERIFY THE SENDER · NEVER THE LINK']} accent="#f87171" bg="#1d1113" />
      <Person p={[-3.2, 2.6]} ry={-0.5} seed={83} talking />
      <Plant p={[-8.2, 3.2]} s={0.85} />
      <Clock p={[0, 3.5, -hd + 0.2]} />
    </Room>
  )
}

/* ═══════════════ room 5 · code review room ══════════════════ */

function ReviewRoom({ def }: RoomProps) {
  const hd = def.d / 2
  return (
    <Room def={def} surface="carpet">
      <WallScreen p={[0, 2.5, -hd + 0.12]} w={6.4} h={3.2} kind="diff" seed={1} />
      <Banner p={[-5.6, 2.4, -hd + 0.1]} w={2.2} h={2.4} lines={['REVIEW', 'correctness', 'then scale']} accent="#60a5fa" bg="#101a2b" />

      {/* the table */}
      <Box p={[0, 0.72, -1]} s={[6.4, 0.09, 3]} m={mat('#5d6473', 0.6)} />
      {([[-2.9, -2.2], [2.9, -2.2], [-2.9, 0.2], [2.9, 0.2]] as [number, number][]).map(([x, z], i) => (
        <Box key={i} p={[x, 0.36, z]} s={[0.12, 0.72, 0.12]} m={mat('#8b9099', 0.5, 0.5)} />
      ))}
      {[-2, 0, 2].map((x, i) => (
        <Fragment key={i}>
          <Chair p={[x, -3.1]} ry={Math.PI} />
          <Chair p={[x, 1.1]} />
        </Fragment>
      ))}
      <Laptop p={[-1.9, -1.9]} ry={Math.PI} seed={2} kind="diff" y={0.77} />
      <Laptop p={[1.9, -0.1]} seed={3} kind="code" y={0.77} />
      <Laptop p={[0, -0.1]} seed={4} kind="terminal" y={0.77} />
      <TableClutter p={[2.6, -1.6]} seed={7} kind="office" />
      <TableClutter p={[-2.6, -0.4]} seed={9} kind="office" />

      <Person p={[-2, 1.25]} seed={91} seated talking tag="REVIEWER" />
      <Person p={[2, 1.25]} seed={92} seated />
      <Person p={[0, -3.25]} ry={Math.PI} seed={93} seated typing />

      <Whiteboard p={[def.w / 2 - 0.14, 2.1, -1]} rot={[0, -Math.PI / 2, 0]} w={3.6} h={1.9} />
      <Windows p={[-def.w / 2 + 0.08, 0, 0]} rot={[0, Math.PI / 2, 0]} along={def.d - 4} bays={3} h={2} y={2} />
      <Sofa p={[5.4, 4.6]} ry={-0.5} w={2.2} col="#3f4757" />
      <Plant p={[-6.8, 5.4]} />
      <Clock p={[4.6, 3.2, -hd + 0.12]} />
    </Room>
  )
}

/* ═══════════════ room 6 · the hackathon hall ════════════════ */

function HackathonRoom({ def, light }: RoomProps) {
  const hd = def.d / 2
  const hw = def.w / 2
  const stage = useGame((s) => s.hackStage)
  const answers = useGame((s) => s.answers)
  const won = useMemo(() => {
    const mine = answers.filter((a) => a.scenarioId === 'hackathon')
    return mine.length > 0 && mine.filter((a) => a.best).length >= mine.length - 1
  }, [answers])
  const demo = stage >= 2

  const rows: [number, number][] = [
    [-5.3, 6], [5.3, 6],
    [-5.3, 1.5], [5.3, 1.5],
    [-5.3, -3], [5.3, -3],
  ]

  return (
    <Room def={def} surface="concrete">
      {/* ── participant tables ── */}
      {rows.map(([x, z], i) => {
        const yours = x === -5.3 && z === 1.5
        return (
          <Fragment key={i}>
            <Box p={[x, 0.74, z]} s={[7, 0.08, 1.5]} m={mat(yours ? '#6b5340' : '#4b515e', 0.7)} />
            {[-1, 1].map((s) => (
              <Box key={s} p={[x + s * 3.2, 0.37, z]} s={[0.1, 0.74, 1.3]} m={mat('#8b9099', 0.5, 0.5)} />
            ))}
            <Box p={[x, 0.36, z + 0.74]} s={[7, 0.62, 0.04]} m={mat(yours ? '#3a2733' : '#2b2f38', 0.9)} />
            <Panel
              p={[x, 0.4, z + 0.78]}
              s={[3.2, 0.34]}
              m={signMat([yours ? 'TEAM HELIOS' : `TABLE ${String(i + 1).padStart(2, '0')}`], {
                bg: yours ? '#2a1b26' : '#1d2028',
                accent: yours ? '#f472b6' : '#5b6270',
                w: 512,
                h: 54,
              })}
            />
            {[-2.3, 0, 2.3].map((o, k) => (
              <Laptop
                key={k}
                p={[x + o, z - 0.2]}
                ry={Math.PI + (k - 1) * 0.16}
                seed={i * 5 + k}
                kind={(['code', 'terminal', 'chart', 'diff', 'slides'] as const)[(i + k) % 5]}
                y={0.79}
              />
            ))}
            <TableClutter p={[x + 2.9, z]} seed={i * 3 + 1} />
            <TableClutter p={[x - 2.9, z]} seed={i * 3 + 2} />
            {/* the crew: heads down while the clock runs, on their feet once demos start */}
            {[-2.3, 0, 2.3].map((o, k) => (
              <Fragment key={`c${k}`}>
                <Chair p={[x + o, z + 1.42]} ry={Math.PI} />
                {!(yours && o === 0) && !(light && k === 2 && !yours) && (
                  <Person
                    p={[x + o, demo ? z + 1.7 : z + 1.28]}
                    ry={Math.PI}
                    seed={i * 11 + k * 4 + 3}
                    seated={!demo}
                    typing={!demo && (i + k) % 4 !== 0}
                    talking={demo || (i + k) % 4 === 0}
                    badge
                  />
                )}
              </Fragment>
            ))}
          </Fragment>
        )
      })}

      {/* ── registration + coffee, because 36 hours ── */}
      <Box p={[-7, 0.5, 10]} s={[4.4, 1, 1]} m={mat('#4b5364', 0.8)} />
      <Box p={[-7, 1.04, 10]} s={[4.6, 0.08, 1.15]} m={mat('#2c3138', 0.5)} />
      <Panel p={[-7, 0.55, 10.55]} s={[3.2, 0.55]} m={signMat(['REGISTRATION'], { bg: '#2a1b26', accent: '#f472b6', w: 512, h: 96 })} />
      <Person p={[-7, 9.2]} seed={101} talking badge tag="VOLUNTEER" />
      <Box p={[7.2, 0.45, 10]} s={[3.4, 0.9, 1]} m={mat('#3f4653', 0.85)} />
      <Panel p={[7.2, 0.5, 10.52]} s={[2.4, 0.5]} m={signMat(['COFFEE · 24/7'], { bg: '#1d2028', accent: '#f0b429', w: 512, h: 96 })} />
      {[-0.85, 0, 0.85].map((o, i) => (
        <mesh key={i} geometry={UNIT} material={mat('#b98a5a', 0.9)} position={[7.2 + o, 0.98, 10]} scale={[0.66, 0.1, 0.66]} rotation={[0, i * 0.4, 0]} />
      ))}
      <Person p={[6, 8.9]} ry={-0.8} seed={102} />

      {/* ── the stage ── */}
      <Stage p={[0, -10.8]} w={15} d={4.4} h={0.55} />
      {/* everything up here has to stand on the deck, not in it */}
      <group position={[0, 0.55, 0]}>
        <Podium p={[-4.4, -9.7]} ry={0.3} />
        {!demo && <Person p={[2.8, -9.6]} ry={0.3} seed={121} talking tag="ON STAGE" />}
        {stage >= 3 && (
          <>
            {/* the banner already names the team; a tag here just fights the screen */}
            <Person p={[0.6, -9.5]} seed={131} talking />
            <Box p={[-4.4, 1.24, -9.7]} s={[0.34, 0.26, 0.34]} m={glow('#f0b429', 1.4)} />
            <mesh geometry={UNIT} material={glow('#f0b429', 1.1)} position={[-4.4, 1.52, -9.7]} scale={[0.16, 0.34, 0.16]} />
          </>
        )}
      </group>
      <WallScreen p={[2.4, 3.4, -hd + 0.14]} w={8} h={4.3} kind={demo ? 'scores' : 'timer'} seed={1} />
      <Banner p={[-7.4, 3.4, -hd + 0.12]} w={2.6} h={4.6} lines={['36', 'HOUR', 'BUILD']} accent="#f472b6" bg="#20132a" />
      <Banner p={[-hw + 0.1, 3.7, -4]} w={3} h={4.6} rot={[0, Math.PI / 2, 0]} lines={['INNOVATION', 'HALL', 'ACET']} accent="#f0b429" bg="#1c1a10" />
      <Banner p={[hw - 0.1, 3.7, -4]} w={3} h={4.6} rot={[0, -Math.PI / 2, 0]} lines={['42', 'TEAMS', 'ONE NIGHT']} accent="#60a5fa" bg="#101a2b" />
      <Banner p={[hw - 0.1, 3.7, 5]} w={3} h={4.6} rot={[0, -Math.PI / 2, 0]} lines={['SHIP', 'SOMETHING', 'REAL']} accent="#4ade80" bg="#10231a" />

      {/* judges bench, occupied once you are shortlisted */}
      <Box p={[0, 0.75, -7.2]} s={[6.4, 0.08, 1.2]} m={mat('#5b6272', 0.6)} />
      <Box p={[0, 0.38, -7.2]} s={[6.4, 0.74, 1.1]} m={mat('#3b414d', 0.85)} />
      <Panel p={[0, 0.44, -6.63]} s={[3.6, 0.44]} m={signMat(['JUDGES'], { bg: '#2a1b26', accent: '#f472b6', w: 512, h: 70 })} />
      {demo &&
        [-2.2, 0, 2.2].map((x, i) => (
          <Fragment key={i}>
            <Chair p={[x, -8.1]} />
            <Person p={[x, -7.95]} seed={111 + i} seated talking={i === 1} badge tag={i === 1 ? 'HEAD JUDGE' : undefined} />
            <Laptop p={[x, -7.4]} seed={30 + i} kind="scores" y={0.8} />
          </Fragment>
        ))}

      {/* the verdict, printed across the front of the stage */}
      {stage >= 3 && (
        <group position={[0, 5.86, -8.7]}>
          <Panel
            p={[0, 0, 0]}
            s={[8.4, 1]}
            m={signMat([won ? 'FIRST PLACE' : 'TOP 3 FINISH', 'TEAM HELIOS · SMART INVERTER OPS'], {
              bg: '#20132a',
              accent: '#f472b6',
              fg: '#fafaf9',
              w: 1024,
              h: 128,
            })}
          />
          <Box p={[0, 0.5, -0.03]} s={[8.6, 0.09, 0.09]} m={mat('#2a2f37', 0.5, 0.4)} />
          {[-3.6, 3.6].map((x) => (
            <Box key={x} p={[x, 0.72, -0.03]} s={[0.05, 0.44, 0.05]} m={mat('#2a2f37', 0.5, 0.4)} />
          ))}
        </group>
      )}

      {/* people gathered to watch the demos */}
      {demo &&
        ([[-6.4, -5.2], [-3.2, -5.4], [3.2, -5.4], [6.4, -5.2], [-8, -1.2], [8, -1.2]] as [number, number][]).map(
          (p, i) => <Person key={i} p={p} ry={Math.PI + (i % 2 ? 0.2 : -0.2)} seed={141 + i} talking={stage >= 3} badge />,
        )}

      {/* truss + stage lighting */}
      {[-5, 0, 5].map((x, i) => (
        <Fragment key={i}>
          <mesh geometry={UNIT} material={mat('#4a505a', 0.6, 0.5)} position={[x, def.h - 0.42, -9]} scale={[0.32, 0.26, 5.6]} />
          <mesh geometry={UNIT} material={mat('#33383f', 0.6, 0.4)} position={[x, def.h - 0.82, -10.2]} scale={[0.09, 0.6, 0.09]} />
          <mesh geometry={UNIT} material={mat('#1e2228', 0.7, 0.3)} position={[x, def.h - 1.18, -10.2]} scale={[0.4, 0.3, 0.4]} />
          <mesh geometry={UNIT} material={glow('#ffd9ec', 2.6)} position={[x, def.h - 1.34, -10.2]} scale={[0.3, 0.06, 0.3]} />
        </Fragment>
      ))}
      <spotLight
        position={[0, def.h - 0.8, -7.6]}
        angle={0.72}
        penumbra={0.6}
        intensity={demo ? 190 : 80}
        color="#ffd9ec"
        distance={24}
        decay={2}
      />

      <Plant p={[-9.3, -6]} s={0.9} />
      <Plant p={[9.3, -6]} s={0.9} />
      <Clock p={[7.4, 4.6, hd - 0.14]} rot={[0, Math.PI, 0]} />
    </Room>
  )
}

/* ═══════════════════════════ shell ═════════════════════════ */

const ROOMS: Record<string, (p: RoomProps) => React.ReactElement> = {
  campus: CampusRoom,
  backlog: BacklogRoom,
  inverters: InverterRoom,
  security: SecurityRoom,
  review: ReviewRoom,
  hackathon: HackathonRoom,
}

export default function Interior({
  id, near, quality,
}: {
  id: string
  near: string | null
  quality: 'high' | 'low'
}) {
  const def = interiors[id]
  const { scene } = useThree()
  const completed = useGame((s) => s.completed)
  const stage = useGame((s) => s.hackStage)

  useEffect(() => {
    if (!def) return
    const prevFog = scene.fog
    const prevBg = scene.background
    scene.fog = new THREE.Fog(new THREE.Color(def.wall).multiplyScalar(0.8), def.d * 0.7, def.d * 3.2)
    scene.background = new THREE.Color('#0e1116')
    return () => {
      scene.fog = prevFog
      scene.background = prevBg
    }
  }, [def, scene])

  if (!def) return null
  const RoomBody = ROOMS[id]

  return (
    <>
      {/* indoor rig — no sun, no sky, just fittings */}
      <ambientLight intensity={1.45} color="#dfe6f2" />
      <hemisphereLight args={['#f2f6ff', '#565c68', 1.5]} />
      <directionalLight position={[5, def.h * 2.2, 9]} intensity={1.1} color="#fff5e6" />
      <directionalLight position={[-7, def.h * 1.8, -8]} intensity={0.55} color="#c8d8ee" />
      <pointLight position={[0, def.h - 1.9, def.d * 0.28]} intensity={20} distance={18} decay={2} color="#ffefd6" />
      <pointLight position={[0, def.h - 1.9, -def.d * 0.2]} intensity={16} distance={16} decay={2} color="#eaf2ff" />

      <RoomBody def={def} light={quality === 'low'} />

      {def.spots.filter((s) => spotActive(s, stage)).map((s) => (
        <SpotMarker
          key={s.id}
          spot={s}
          color={s.kind === 'exit' ? '#9ca0a8' : def.accent}
          done={!!s.scenario && completed.includes(s.scenario)}
          near={near === s.id}
        />
      ))}
    </>
  )
}
