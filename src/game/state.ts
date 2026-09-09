import { create } from 'zustand'
import { scenarios, type Scenario, type Choice } from './data/scenarios'

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
  // scenario flow
  activeId: string | null
  stepIndex: number
  answers: Answer[]
  completed: string[]
  lastVerdict: { text: string; score: number; label: string } | null
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
  openScenario: (id: string) => void
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
  activeId: null,
  stepIndex: 0,
  answers: [],
  completed: [],
  lastVerdict: null,
  score: 0,
  started: null,
  finished: null,
  soundOn: false,
  hintsSeen: [],

  setPhase: (phase) => set({ phase }),

  begin: () => set({ phase: 'brief', started: Date.now() }),
  enterWorld: () => set({ phase: 'playing' }),

  setPlayerPos: (playerPos) => set({ playerPos }),

  openScenario: (id) => {
    if (get().completed.includes(id)) return
    set({ phase: 'scenario', activeId: id, stepIndex: 0, lastVerdict: null })
  },

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
    const { activeId, stepIndex } = get()
    const sc = scenarioById(activeId)
    if (!sc) return
    if (stepIndex + 1 < sc.steps.length) {
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
      phase: 'playing',
      dayProgress: Math.min(1, done.length / scenarios.length),
    })
  },

  finish: () => set({ phase: 'report', finished: Date.now() }),

  restart: () =>
    set({
      phase: 'title',
      dayProgress: 0,
      activeId: null,
      stepIndex: 0,
      answers: [],
      completed: [],
      lastVerdict: null,
      score: 0,
      started: null,
      finished: null,
      hintsSeen: [],
    }),

  toggleSound: () => set({ soundOn: !get().soundOn }),
  markHint: (id) => set({ hintsSeen: [...new Set([...get().hintsSeen, id])] }),
}))
