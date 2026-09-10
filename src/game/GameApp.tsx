import { lazy, Suspense, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useGame } from './state'
import { attachKeyboard, input, resetInput } from './input'
import { BriefScreen, ReportScreen, TitleScreen } from './ui/Screens'
import ScenarioPanel from './ui/Scenario'
import { ControlHint, InsideBar, MiniMap, Objectives, PendingHint, Prompt, TopBar } from './ui/Hud'
import TouchControls from './ui/TouchControls'
import { zones } from './data/zones'
import { interiors } from './data/interiors'

const Scene = lazy(() => import('./world/Scene'))

function hasWebGL() {
  try {
    const c = document.createElement('canvas')
    return !!(window.WebGLRenderingContext && (c.getContext('webgl2') || c.getContext('webgl')))
  } catch {
    return false
  }
}

function Loading() {
  return (
    <div className="fixed inset-0 z-40 grid place-items-center" style={{ background: '#08090a' }}>
      <div className="text-center">
        <div
          className="mx-auto size-8 rounded-full border-2 border-[#23262b]"
          style={{ borderTopColor: '#f0b429', animation: 'g-spin 0.9s linear infinite' }}
        />
        <div className="mt-5 font-mono text-[0.62rem] uppercase tracking-[0.22em] text-[#6b6f77]">
          Building the city…
        </div>
      </div>
    </div>
  )
}

function NoWebGL() {
  return (
    <div className="fixed inset-0 grid place-items-center px-6" style={{ background: '#08090a' }}>
      <div className="max-w-md text-center">
        <h1 className="text-2xl font-semibold text-[#fafaf9]">This browser can't run the 3D city</h1>
        <p className="mt-3 text-[0.92rem] leading-relaxed text-[#9ca0a8]">
          The simulator needs WebGL. Try a different browser, or head back to the portfolio — all the
          same work is written up there.
        </p>
        <a
          href="/"
          className="mt-7 inline-block rounded-full px-6 py-3 text-[0.88rem] font-semibold text-[#0a0c10]"
          style={{ background: '#f0b429' }}
        >
          Back to portfolio
        </a>
      </div>
    </div>
  )
}

export default function GameApp() {
  const phase = useGame((s) => s.phase)
  const completed = useGame((s) => s.completed)
  const finish = useGame((s) => s.finish)
  const inside = useGame((s) => s.inside)
  const exitAt = useGame((s) => s.exitAt)
  const [near, setNear] = useState<string | null>(null)
  const nearRef = useRef<string | null>(null)
  const [webgl] = useState(hasWebGL)

  const quality = useMemo<'high' | 'low'>(
    () =>
      typeof window !== 'undefined' &&
      (window.matchMedia('(pointer: coarse)').matches || window.innerWidth < 820)
        ? 'low'
        : 'high',
    [],
  )

  const inWorld = phase === 'playing' || phase === 'scenario'

  // expose the store + input for automated playtests
  useEffect(() => {
    ;(window as unknown as { __game?: unknown; __input?: unknown }).__game = useGame
    ;(window as unknown as { __game?: unknown; __input?: unknown }).__input = input
  }, [])

  /* One key for everything: doors on the street, hotspots inside. */
  const tryInteract = useCallback(() => {
    const id = nearRef.current
    if (!id) return
    const g = useGame.getState()

    if (!g.inside) {
      resetInput()
      g.enterBuilding(id)
      return
    }

    const spot = interiors[g.inside]?.spots.find((s) => s.id === id)
    if (!spot) return
    if (spot.kind === 'exit') {
      resetInput()
      g.leaveBuilding()
      return
    }
    if (!spot.scenario) return
    if (spot.kind === 'resume') {
      if (g.pending?.scenario === spot.scenario) {
        resetInput()
        g.resumeScenario()
      }
      return
    }
    if (g.completed.includes(spot.scenario)) return
    resetInput()
    g.openScenario(spot.scenario)
  }, [])

  /* Point the camera sensibly whenever the world changes under you. */
  useEffect(() => {
    input.yaw = inside ? Math.PI : (exitAt?.facing ?? Math.PI)
    input.pitch = inside ? 0.2 : 0.28
  }, [inside, exitAt])

  // keyboard
  useEffect(() => {
    if (phase !== 'playing') return
    return attachKeyboard(tryInteract, () => {})
  }, [phase, tryInteract])

  // drag to look
  useEffect(() => {
    if (phase !== 'playing') return
    let dragging = false
    let last = { x: 0, y: 0 }
    const down = (e: PointerEvent) => {
      if (e.pointerType === 'touch') return
      const t = e.target as HTMLElement
      if (t.closest('button') || t.closest('a')) return
      dragging = true
      last = { x: e.clientX, y: e.clientY }
    }
    const move = (e: PointerEvent) => {
      if (!dragging) return
      input.yaw -= (e.clientX - last.x) * 0.0045
      input.pitch = Math.max(0.04, Math.min(0.85, input.pitch + (e.clientY - last.y) * 0.003))
      last = { x: e.clientX, y: e.clientY }
    }
    const up = () => {
      dragging = false
    }
    window.addEventListener('pointerdown', down)
    window.addEventListener('pointermove', move)
    window.addEventListener('pointerup', up)
    window.addEventListener('pointercancel', up)
    return () => {
      window.removeEventListener('pointerdown', down)
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerup', up)
      window.removeEventListener('pointercancel', up)
    }
  }, [phase])

  // freeze movement while a scenario is open
  useEffect(() => {
    if (phase === 'scenario') resetInput()
  }, [phase])

  const onNear = useCallback((id: string | null) => {
    nearRef.current = id
    setNear(id)
  }, [])

  if (!webgl) return <NoWebGL />

  return (
    <>
      {inWorld && (
        <Suspense fallback={<Loading />}>
          <Scene onNear={onNear} quality={quality} />
        </Suspense>
      )}

      {phase === 'title' && <TitleScreen />}
      {phase === 'brief' && <BriefScreen />}
      {phase === 'report' && <ReportScreen />}

      {phase === 'playing' && (
        <>
          <TopBar onExit={() => (window.location.href = '/')} onFinish={finish} />
          <Objectives />
          {inside ? <InsideBar /> : <MiniMap />}
          <ControlHint />
          <PendingHint />
          <Prompt near={near} onInteract={tryInteract} />
          {quality === 'low' && <TouchControls onInteract={tryInteract} />}
          {completed.length === zones.length && (
            <div className="pointer-events-none fixed inset-x-0 top-[5.5rem] z-30 flex justify-center px-4">
              <div
                className="rounded-full border px-4 py-2 font-mono text-[0.62rem] uppercase tracking-[0.16em]"
                style={{
                  borderColor: '#f0b42955',
                  background: 'rgba(8,10,14,0.8)',
                  color: '#f0b429',
                  backdropFilter: 'blur(8px)',
                }}
              >
                All {zones.length} handled — collect your review
              </div>
            </div>
          )}
        </>
      )}

      {phase === 'scenario' && <ScenarioPanel />}
    </>
  )
}
