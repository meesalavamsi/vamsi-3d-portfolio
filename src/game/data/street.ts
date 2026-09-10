/* Street life that isn't an objective: a shopfront arcade on the north
   sidewalk, parked cars, a bus stop. Kept as data so props and colliders
   can both read it. */

export type Shop = { x: number; name: string; sub: string; tint: string }

export const ARCADE_Z = 28
export const ARCADE_W = 6
export const ARCADE_D = 8
export const ARCADE_H = 5.6
/** the shopfront plane, i.e. the face the player walks up to */
export const ARCADE_FRONT = ARCADE_Z - ARCADE_D / 2

export const shops: Shop[] = [
  { x: -28, name: 'ANJALI CHAI HOUSE', sub: 'open till late', tint: '#f0b429' },
  { x: -22, name: 'ACET BOOK DEPOT', sub: 'stationery · xerox', tint: '#60a5fa' },
  { x: -16, name: 'PIXEL PC SERVICE', sub: 'repairs · spares', tint: '#4ade80' },
  { x: -10, name: 'AMMA MESS', sub: 'meals · tiffin', tint: '#f87171' },
  { x: -4, name: 'CITY PHARMACY', sub: '24 hours', tint: '#a78bfa' },
]

/** Extra rectangles the player can't walk through: x, z, halfW, halfD. */
export const streetColliders: [number, number, number, number][] = shops.map((s) => [
  s.x,
  ARCADE_Z,
  ARCADE_W / 2 + 0.3,
  ARCADE_D / 2 + 0.4,
])

/** Cars left at the kerb: x, z, yaw. */
export const parkedCars: [number, number, number][] = [
  [-30, 18.2, 0],
  [-24.4, 18.2, 0],
  [-13, 18.2, 0],
  [-7.4, 18.2, 0],
  [24.6, -15.6, Math.PI / 2],
  [16.4, -23.2, Math.PI / 2],
  [-20.2, -23.2, Math.PI / 2],
]

export const busStop: [number, number] = [4.5, -12.4]
export const kiosk: [number, number] = [8.2, 8.6]
