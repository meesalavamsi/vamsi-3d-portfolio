import { motion, AnimatePresence } from 'framer-motion'
import { locations } from '../data/resume'
import { useGame, isUnlocked } from '../store/gameStore'
import { sfx } from '../utils/sound'

/** Stylized node-graph mini map. */
export default function MiniMap() {
  const show = useGame((s) => s.showMap)
  const visited = useGame((s) => s.visited)
  const enterLocation = useGame((s) => s.enterLocation)
  const soundOn = useGame((s) => s.soundOn)

  // normalize positions to SVG coords
  const xs = locations.map((l) => l.pos[0])
  const zs = locations.map((l) => l.pos[2])
  const minX = Math.min(...xs), maxX = Math.max(...xs)
  const minZ = Math.min(...zs), maxZ = Math.max(...zs)
  const W = 300, H = 260, pad = 34
  const px = (x: number) => pad + ((x - minX) / (maxX - minX)) * (W - pad * 2)
  const pz = (z: number) => pad + ((z - minZ) / (maxZ - minZ)) * (H - pad * 2)

  // edges = unlock chain
  const edges = locations.filter((l) => l.unlockAfter).map((l) => {
    const from = locations.find((p) => p.id === l.unlockAfter)!
    return { from, to: l }
  })

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.92 }}
          className="fixed top-28 right-3 z-40 glass-strong scanlines p-4"
        >
          <h3 className="text-cyan-300 text-glow tracking-[0.3em] text-sm mb-2 px-1">WORLD MAP</h3>
          <svg width={W} height={H} className="block">
            {edges.map(({ from, to }) => (
              <line
                key={`${from.id}-${to.id}`}
                x1={px(from.pos[0])} y1={pz(from.pos[2])}
                x2={px(to.pos[0])} y2={pz(to.pos[2])}
                stroke={visited.includes(to.id) ? '#4dd0ff' : '#223052'}
                strokeWidth={visited.includes(to.id) ? 1.6 : 1}
                strokeDasharray={visited.includes(to.id) ? '' : '4 4'}
                opacity={0.8}
              />
            ))}
            {locations.map((l) => {
              const un = isUnlocked(l.id, visited)
              const vis = visited.includes(l.id)
              return (
                <g
                  key={l.id}
                  transform={`translate(${px(l.pos[0])},${pz(l.pos[2])})`}
                  className="cursor-pointer"
                  onClick={() => { if (soundOn) sfx.click(); enterLocation(l.id) }}
                >
                  <circle r={vis ? 9 : 7} fill="#0a1022" stroke={un ? l.color : '#33415e'} strokeWidth={2}
                    style={{ filter: vis ? `drop-shadow(0 0 6px ${l.color})` : undefined }} />
                  {vis && <circle r={3} fill={l.color} />}
                  <text y={-13} textAnchor="middle" fontSize={8.5} fill={un ? '#bfe9ff' : '#4a5878'} style={{ letterSpacing: '0.12em' }}>
                    {l.mapLabel}
                  </text>
                </g>
              )
            })}
          </svg>
          <p className="text-[9px] text-cyan-100/40 tracking-widest mt-1 px-1">CLICK A NODE TO TRAVEL</p>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
