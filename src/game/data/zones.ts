export type Zone = {
  id: string
  label: string
  sub: string
  pos: [number, number]      // building centre
  door: [number, number]     // where the player interacts
  size: [number, number, number] // w, h, d
  color: string
  order: number
}

export const zones: Zone[] = [
  {
    id: 'campus',
    label: 'UNIVERSITY IT DESK',
    sub: 'Block C · Service Desk',
    pos: [-27, 4],
    door: [-16, 4],
    size: [14, 9, 18],
    color: '#a78bfa',
    order: 1,
  },
  {
    id: 'backlog',
    label: 'PLATFORM TEAM FLOOR',
    sub: 'Enterprise Automation',
    pos: [21, -27],
    door: [21, -15.5],
    size: [17, 26, 15],
    color: '#4ade80',
    order: 2,
  },
  {
    id: 'inverters',
    label: 'ENERGY OPERATIONS',
    sub: 'Inverter Array Control',
    pos: [37, 11],
    door: [26.5, 11],
    size: [13, 11, 20],
    color: '#f0b429',
    order: 3,
  },
  {
    id: 'security',
    label: 'SECURITY OPERATIONS',
    sub: 'Threat Triage',
    pos: [7, 33],
    door: [7, 23],
    size: [15, 8, 12],
    color: '#f87171',
    order: 4,
  },
  {
    id: 'review',
    label: 'CODE REVIEW ROOM',
    sub: 'Peer Review · Build Floor',
    pos: [-16, -28],
    door: [-16, -17],
    size: [15, 17, 14],
    color: '#60a5fa',
    order: 5,
  },
]

/** Rectangles the player cannot walk through (x, z, halfW, halfD). */
export const colliders: [number, number, number, number][] = zones.map((z) => [
  z.pos[0],
  z.pos[1],
  z.size[0] / 2 + 0.4,
  z.size[2] / 2 + 0.4,
])
