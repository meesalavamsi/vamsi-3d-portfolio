import { zones } from './zones'
import { streetColliders } from './street'

/** Keep street furniture off the objective markers and the paths leading to them. */
/** Nothing should be planted inside a building. */
function insideBuilding(x: number, z: number, pad: number) {
  for (const zn of zones) {
    if (
      Math.abs(x - zn.pos[0]) < zn.size[0] / 2 + pad &&
      Math.abs(z - zn.pos[1]) < zn.size[2] / 2 + pad
    )
      return true
  }
  for (const [cx, cz, hw, hd] of streetColliders) {
    if (Math.abs(x - cx) < hw + pad && Math.abs(z - cz) < hd + pad) return true
  }
  return false
}

function blocksWayfinding(x: number, z: number, pad: number) {
  for (const zn of zones) {
    const [dx, dz] = zn.door
    if (Math.hypot(x - dx, z - dz) < 6.2) return true
    const ax = 0
    const az = 2
    const vx = dx * 1.3 - ax
    const vz = 2 + (dz - 2) * 1.3 - az
    const l2 = vx * vx + vz * vz
    const t = Math.max(0, Math.min(1, ((x - ax) * vx + (z - az) * vz) / l2))
    if (Math.hypot(x - (ax + vx * t), z - (az + vz * t)) < pad) return true
  }
  return false
}

// the inner ring sits outside the camera's orbit so it does not clip the view
const RAW_TREES: [number, number][] = [
  [-13, 13], [-7, 17], [7, 17], [13, 13], [-16, 6], [16, 6],
  [-15, -7], [15, -7], [-9, -14], [9, -14],
  [26, 20], [31, 24], [-30, 20], [-25, 24], [-34, -12], [-28, -14],
  [18, 30], [-4, 40], [16, 40], [34, -8], [40, 26], [-40, 6], [-38, 32], [30, -38],
]

const RAW_LAMPS: [number, number][] = [
  [-10, 10], [10, 10], [-10, -10], [10, -10], [-21, 0], [21, 0],
  [0, 21], [0, -14], [26, -14], [-26, -14], [26, 14], [-26, 14],
  [12, 26], [-12, 26], [34, 2], [-34, 2],
]

// a treeline closes off the district so the world never runs out into blank grass
const RING_TREES: [number, number][] = Array.from({ length: 30 }, (_, i) => {
  const a = (i / 30) * Math.PI * 2 + 0.21
  const r = 47.5 + ((i * 7) % 4)
  return [Math.round(Math.cos(a) * r), Math.round(Math.sin(a) * r)]
})

const clear = (list: [number, number][]) =>
  list.filter(([x, z]) => !blocksWayfinding(x, z, 3.1) && !insideBuilding(x, z, 1.6))

export const treeSpots = clear(RAW_TREES)
export const edgeTreeSpots = clear(RING_TREES)
export const lampSpots = RAW_LAMPS.filter(
  ([x, z]) => !blocksWayfinding(x, z, 2.4) && !insideBuilding(x, z, 1.2),
)

/** Round obstacles the third-person camera must not push through: x, z, radius. */
export const camObstacles: [number, number, number][] = [
  ...treeSpots.map(([x, z]) => [x, z, 2.15] as [number, number, number]),
  ...edgeTreeSpots.map(([x, z]) => [x, z, 2.15] as [number, number, number]),
]
