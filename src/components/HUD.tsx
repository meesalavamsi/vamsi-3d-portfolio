import { Volume2, VolumeX, Map as MapIcon, ListTodo, FileText, SkipForward } from 'lucide-react'
import { useGame, levelForXp } from '../store/gameStore'
import { identity, levels, locations } from '../data/resume'
import { sfx } from '../utils/sound'

export default function HUD({ onEnterWorld }: { onEnterWorld?: () => void }) {
  const s = useGame()
  const level = levelForXp(s.xp)
  const next = levels.find((l) => l.xpRequired > s.xp)
  const xpInLevel = s.xp - level.xpRequired
  const xpSpan = next ? next.xpRequired - level.xpRequired : 1
  const pct = next ? Math.min(100, (xpInLevel / xpSpan) * 100) : 100

  return (
    <>
      {/* top-left identity */}
      <div className="fixed top-3 left-3 z-40 glass px-4 py-2.5 pointer-events-none">
        <div className="text-cyan-300 text-glow font-bold tracking-[0.2em] text-sm">{identity.name.toUpperCase()}</div>
        <div className="text-[10px] tracking-[0.25em] text-cyan-100/50 mt-0.5">{identity.playerTitle}</div>
      </div>

      {/* top-right level + actions */}
      <div className="fixed top-3 right-3 z-40 flex items-start gap-2">
        <div className="glass px-4 py-2.5 text-right">
          <div className="text-purple-300 text-glow-purple text-sm font-bold tracking-widest">
            LEVEL {String(level.level).padStart(2, '0')}
          </div>
          <div className="text-[10px] text-purple-100/60 tracking-widest">{level.title.toUpperCase()}</div>
          <div className="mt-1.5 w-40">
            <div className="flex justify-between text-[9px] text-cyan-100/60 mb-1">
              <span>XP {s.xp}</span><span>{next ? `/ ${next.xpRequired}` : 'MAX'}</span>
            </div>
            <div className="bar-outer h-1.5 w-full"><div className="bar-inner h-full" style={{ width: `${pct}%` }} /></div>
          </div>
        </div>
        <div className="flex flex-col gap-1.5">
          <button aria-label="Toggle missions" className="glass p-2.5 text-cyan-300 hover:bg-cyan-400/10 transition-colors" onClick={() => { if (s.soundOn) sfx.click(); s.toggleMissions() }}>
            <ListTodo size={16} />
          </button>
          <button aria-label="Toggle map" className="glass p-2.5 text-cyan-300 hover:bg-cyan-400/10 transition-colors" onClick={() => { if (s.soundOn) sfx.click(); s.toggleMap() }}>
            <MapIcon size={16} />
          </button>
          <button aria-label="Toggle sound" className="glass p-2.5 text-cyan-300 hover:bg-cyan-400/10 transition-colors" onClick={() => s.toggleSound()}>
            {s.soundOn ? <Volume2 size={16} /> : <VolumeX size={16} />}
          </button>
          <button aria-label="Resume mode" className="glass p-2.5 text-purple-300 hover:bg-purple-400/10 transition-colors" onClick={() => { if (s.soundOn) sfx.click(); s.openResume() }}>
            <FileText size={16} />
          </button>
        </div>
      </div>

      {/* skip 3D — accessibility */}
      {s.phase === 'world' && (
        <button
          onClick={onEnterWorld}
          className="fixed bottom-16 left-3 z-40 hidden"
          aria-hidden
        />
      )}

      {/* bottom controls hint */}
      {!s.isMobile && (s.phase === 'world') && (
        <div className="fixed bottom-3 left-1/2 -translate-x-1/2 z-40 glass px-5 py-2 text-[10px] tracking-[0.2em] text-cyan-100/60 pointer-events-none">
          [WASD] MOVE&nbsp;&nbsp;[CLICK] ENTER BUILDING&nbsp;&nbsp;[E] INTERACT&nbsp;&nbsp;[M] MAP
        </div>
      )}

      {/* mobile action bar */}
      {s.isMobile && s.phase === 'world' && (
        <div className="fixed bottom-3 left-1/2 -translate-x-1/2 z-40 flex gap-2">
          <button className="btn-game !py-2 !px-3 text-[10px]" onClick={() => s.toggleMap()}>Map</button>
          <button className="btn-game !py-2 !px-3 text-[10px]" onClick={() => s.toggleMissions()}>Missions</button>
          <button className="btn-game purple !py-2 !px-3 text-[10px]" onClick={() => s.openResume()}>Resume</button>
        </div>
      )}
    </>
  )
}
