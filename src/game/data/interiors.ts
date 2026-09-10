import { zones } from './zones'
import type { WorldCfg } from '../world/Player'

/* Every objective building can actually be walked into. Rooms are centred on
   the origin: x ∈ [-w/2, w/2], z ∈ [-d/2, d/2], with the way out on the +z wall. */

export type SpotKind = 'scenario' | 'resume' | 'exit'

export type Spot = {
  id: string
  at: [number, number]
  label: string
  sub: string
  kind: SpotKind
  /** which scenario this hotspot drives */
  scenario?: string
  /** only offered once the hackathon arc has reached this stage */
  needsStage?: number
  /** hidden again once the arc has moved past this stage */
  maxStage?: number
}

export type InteriorDef = {
  id: string
  title: string
  sub: string
  accent: string
  w: number
  d: number
  h: number
  floor: string
  wall: string
  spawn: [number, number]
  /** x, z, halfW, halfD — furniture you cannot walk through */
  colliders: [number, number, number, number][]
  spots: Spot[]
}

const exitSpot = (d: number): Spot => ({
  id: 'exit',
  at: [0, d / 2 - 1.2],
  label: 'Way out',
  sub: 'Back to the street',
  kind: 'exit',
})

export const interiors: Record<string, InteriorDef> = {
  campus: {
    id: 'campus',
    title: 'Block C · Service Desk',
    sub: 'University IT',
    accent: '#a78bfa',
    w: 20,
    d: 15,
    h: 4,
    floor: '#494e58',
    wall: '#666b78',
    spawn: [0, 3.1],
    colliders: [
      [0, -3.4, 4.6, 0.7],   // the front counter
      [-8, -5, 1.6, 1.4],    // printer bay
      [8.2, 0, 1.2, 3],      // waiting bench run
    ],
    spots: [
      { id: 'campus', at: [0, -2], label: 'Service desk', sub: 'A student is waiting', kind: 'scenario', scenario: 'campus' },
      exitSpot(15),
    ],
  },

  backlog: {
    id: 'backlog',
    title: 'Enterprise Automation',
    sub: 'Platform team floor',
    accent: '#4ade80',
    w: 22,
    d: 17,
    h: 3.9,
    floor: '#3c414b',
    wall: '#5f6572',
    spawn: [0, 4.1],
    colliders: [
      [-5.5, 1, 3.4, 0.9],
      [-5.5, -3.5, 3.4, 0.9],
      [5.5, 1, 3.4, 0.9],
      [5.5, -3.5, 3.4, 0.9],
      [0, -7.2, 3, 0.6],
    ],
    spots: [
      { id: 'backlog', at: [0, -5.4], label: 'The request board', sub: 'Five hundred a month', kind: 'scenario', scenario: 'backlog' },
      exitSpot(17),
    ],
  },

  inverters: {
    id: 'inverters',
    title: 'Inverter Array Control',
    sub: 'Energy operations',
    accent: '#f0b429',
    w: 20,
    d: 16,
    h: 4.4,
    floor: '#383c45',
    wall: '#565c69',
    spawn: [0, 3.6],
    colliders: [
      [0, -2.6, 5.2, 0.8],
      [-8.4, -1, 1.1, 4],
      [8.4, -1, 1.1, 4],
    ],
    spots: [
      { id: 'inverters', at: [0, -0.9], label: 'Control wall', sub: 'INV-03 is drifting', kind: 'scenario', scenario: 'inverters' },
      exitSpot(16),
    ],
  },

  security: {
    id: 'security',
    title: 'Threat Triage',
    sub: 'Security operations',
    accent: '#f87171',
    w: 18,
    d: 14,
    h: 3.8,
    floor: '#33373f',
    wall: '#525863',
    spawn: [0, 2.6],
    colliders: [
      [0, -2.2, 4.4, 0.8],
      [-7.2, 1.5, 1.2, 2.6],
      [7.2, 1.5, 1.2, 2.6],
    ],
    spots: [
      { id: 'security', at: [0, -0.5], label: 'Triage station', sub: 'An email came in at 4:52pm', kind: 'scenario', scenario: 'security' },
      exitSpot(14),
    ],
  },

  review: {
    id: 'review',
    title: 'Peer Review · Build Floor',
    sub: 'Code review room',
    accent: '#60a5fa',
    w: 17,
    d: 15,
    h: 3.8,
    floor: '#3e434d',
    wall: '#5c626f',
    spawn: [0, 3.1],
    colliders: [[0, -1, 3.2, 1.5]],
    spots: [
      { id: 'review', at: [0, -3.4], label: 'Review table', sub: 'A pull request is on the screen', kind: 'scenario', scenario: 'review' },
      exitSpot(15),
    ],
  },

  hackathon: {
    id: 'hackathon',
    title: '36-Hour Hackathon',
    sub: 'Innovation Hall',
    accent: '#f472b6',
    w: 20,
    d: 26,
    h: 6.4,
    floor: '#43414f',
    wall: '#656375',
    spawn: [0, 9],
    colliders: [
      // three rows of paired participant tables, wide centre aisle
      [-5.3, 6, 3.5, 0.75],
      [5.3, 6, 3.5, 0.75],
      [-5.3, 1.5, 3.5, 0.75],
      [5.3, 1.5, 3.5, 0.75],
      [-5.3, -3, 3.5, 0.75],
      [5.3, -3, 3.5, 0.75],
      // registration desk by the door
      [-7, 10, 2.2, 0.5],
      // stage + judges bench
      [0, -10.8, 7.5, 2.2],
      [0, -7.2, 3.2, 0.6],
    ],
    spots: [
      {
        id: 'hack-team',
        at: [-5.3, 3.7],
        label: 'Your table',
        sub: 'Team of four · 36 hours on the clock',
        kind: 'scenario',
        scenario: 'hackathon',
        maxStage: 1,
      },
      {
        id: 'hack-stage',
        at: [0, -5.2],
        label: 'Demo day',
        sub: 'The judges are waiting for your pitch',
        kind: 'resume',
        scenario: 'hackathon',
        needsStage: 2,
        maxStage: 2,
      },
      exitSpot(26),
    ],
  },
}

export const interiorFor = (id: string | null) => (id ? interiors[id] : undefined)

export const zoneFor = (id: string | null) => zones.find((z) => z.id === id)

/** Is this hotspot currently live, given the hackathon arc? */
export function spotActive(s: Spot, stage: number) {
  if (s.needsStage !== undefined && stage < s.needsStage) return false
  if (s.maxStage !== undefined && stage > s.maxStage) return false
  return true
}

/** Turn a room into a movement world for <Player>. */
export function interiorWorld(def: InteriorDef, stage: number): WorldCfg {
  return {
    spawn: def.spawn,
    rect: [def.w / 2, def.d / 2],
    ceiling: def.h,
    colliders: def.colliders,
    targets: def.spots.filter((s) => spotActive(s, stage)).map((s) => ({ id: s.id, at: s.at })),
    reach: 2.4,
    camDist: def.id === 'hackathon' ? 5.4 : 4.9,
    indoor: true,
    facing: Math.PI,
  }
}
