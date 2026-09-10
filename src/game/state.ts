import { create } from 'zustand'
import { scenarios, type Scenario, type Choice } from './data/scenarios'
import { zones } from './data/zones'

export type Phase = 'title' | 'brief' | 'playing' | 'scenario' | 'report'

export type Answer = {
  scenarioId: string
  stepId: string
  choiceId: string
  label: string
  verdict: string
  score: number
  best: boolean
  timedOut: boolean
  secondsLeft: number
}

type State = {
  phase: Phase
  // world
  dayProgress: number            // 0 → 1 drives the sun
  playerPos: [number, number, number]
  /** zone id whose interior the player is standing in, or null for the street */
  inside: string | null
  /** where to put the player back on the street after walking out */
  exitAt: { at: [number, number]; facing: number; key: number } | null
  /** hackathon arc: 0 not started, 1 building, 2 shortlisted, 3 judged */
  hackStage: number
  // scenario flow
  activeId: string | null
  stepIndex: number
  answers: Answer[]
  completed: string[]
  lastVerdict: { text: string; score: number; label: string } | null
  /** a scenario that has paused mid-way and is waiting for you somewhere else */
  pending: { scenario: string; spot: string; hint: string } | null
  // meta
  score: number
  started: number | null
  finished: number | null
  soundOn: boolean
  hintsSeen: string[]

  setPhase: (p: Phase) => void
  begin: () => void
  enterWorld: () => void
  setPlayerPos: (p: [number, number, number]) => void
  enterBuilding: (id: string) => void
  leaveBuilding: () => void
  setHackStage: (n: number) => void
  openScenario: (id: string) => void
  resumeScenario: () => void
  answer: (c: Choice, secondsLeft: number, timedOut: boolean) => void
  nextStep: () => void
  closeScenario: () => void
  finish: () => void
  restart: () => void
  toggleSound: () => void
  markHint: (id: string) => void
}

export const scenarioById = (id: string | null): Scenario | undefined =>
  scenarios.find((s) => s.id === id)

export const useGame = create<State>((set, get) => ({
  phase: 'title',
  dayProgress: 0,
  playerPos: [0, 0, 11],
  inside: null,
  exitAt: null,
  hackStage: 0,
  activeId: null,
  stepIndex: 0,
  answers: [],
  completed: [],
  lastVerdict: null,
  pending: null,
  score: 0,
  started: null,
  finished: null,
  soundOn: false,
  hintsSeen: [],

  setPhase: (phase) => set({ phase }),

  begin: () => set({ phase: 'brief', started: Date.now() }),
  enterWorld: () => set({ phase: 'playing' }),

  setPlayerPos: (playerPos) => set({ playerPos }),

  enterBuilding: (id) =>
    set({
      inside: id,
      phase: 'playing',
      // walking into the hall starts the clock on the build
      hackStage: id === 'hackathon' && get().hackStage === 0 ? 1 : get().hackStage,
    }),

  leaveBuilding: () => {
    const id = get().inside
    const z = zones.find((v) => v.id === id)
    if (!z) return set({ inside: null, phase: 'playing' })
    const dx = z.door[0] - z.pos[0]
    const dz = z.door[1] - z.pos[1]
    const len = Math.hypot(dx, dz) || 1
    set({
      inside: null,
      phase: 'playing',
      exitAt: {
        at: [z.door[0] + (dx / len) * 2.6, z.door[1] + (dz / len) * 2.6],
        facing: Math.atan2(dx / len, dz / len),
        key: Date.now(),
      },
    })
  },

  setHackStage: (hackStage) => set({ hackStage }),

  openScenario: (id) => {
    if (get().completed.includes(id)) return
    set({ phase: 'scenario', activeId: id, stepIndex: 0, lastVerdict: null, pending: null })
  },

  resumeScenario: () => set({ phase: 'scenario', lastVerdict: null, pending: null }),

  answer: (choice, secondsLeft, timedOut) => {
    const { activeId, stepIndex, answers, score } = get()
    const sc = scenarioById(activeId)
    if (!sc) return
    const step = sc.steps[stepIndex]
    const gained = timedOut ? -1 : choice.score
    const entry: Answer = {
      scenarioId: sc.id,
      stepId: step.id,
      choiceId: choice.id,
      label: choice.label,
      verdict: timedOut
        ? 'The clock ran out. In production, not deciding is also a decision — and usually the expensive one.'
        : choice.verdict,
      score: gained,
      best: !!choice.best && !timedOut,
      timedOut,
      secondsLeft,
    }
    set({
      answers: [...answers, entry],
      score: score + gained,
      lastVerdict: { text: entry.verdict, score: gained, label: choice.label },
    })
  },

  nextStep: () => {
    const { activeId, stepIndex, hackStage } = get()
    const sc = scenarioById(activeId)
    if (!sc) return
    const step = sc.steps[stepIndex]
    if (stepIndex + 1 < sc.steps.length) {
      // some scenarios break off and continue somewhere else in the building
      if (step?.resumeAt) {
        set({
          stepIndex: stepIndex + 1,
          lastVerdict: null,
          phase: 'playing',
          pending: { scenario: sc.id, spot: step.resumeAt, hint: step.resumeHint ?? '' },
          hackStage: sc.id === 'hackathon' ? Math.max(hackStage, 2) : hackStage,
        })
        return
      }
      set({ stepIndex: stepIndex + 1, lastVerdict: null })
    } else {
      set({ lastVerdict: null, stepIndex: sc.steps.length })
    }
  },

  closeScenario: () => {
    const { activeId, completed } = get()
    if (!activeId) return set({ phase: 'playing' })
    const done = completed.includes(activeId) ? completed : [...completed, activeId]
    set({
      completed: done,
      activeId: null,
      stepIndex: 0,
      lastVerdict: null,
      pending: null,
      phase: 'playing',
      hackStage: activeId === 'hackathon' ? 3 : get().hackStage,
      dayProgress: Math.min(1, done.length / scenarios.length),
    })
  },

  finish: () => set({ phase: 'report', finished: Date.now() }),

  restart: () =>
    set({
      phase: 'title',
      dayProgress: 0,
      inside: null,
      exitAt: null,
      hackStage: 0,
      activeId: null,
      stepIndex: 0,
      answers: [],
      completed: [],
      lastVerdict: null,
      pending: null,
      score: 0,
      started: null,
      finished: null,
      hintsSeen: [],
    }),

  toggleSound: () => set({ soundOn: !get().soundOn }),
  markHint: (id) => set({ hintsSeen: [...new Set([...get().hintsSeen, id])] }),
}))
