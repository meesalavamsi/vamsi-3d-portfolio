import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type GamePhase =
  | 'boot' | 'city' | 'lab' | 'worldmap' | 'world'
  | 'moral' | 'reveal' | 'countdown' | 'blackout' | 'escaped'
  | 'vamsiroom' | 'infinite'

export type ChaseChoice = 'helped' | 'ignored' | 'followed' | null

interface Memory {
  choices: number
  helped: number
  risks: number
  secrets: string[]
  startTime: number
  worldsVisited: string[]
}

interface GameState {
  phase: GamePhase
  world: string | null
  soundOn: boolean
  // story flags
  strangerMet: boolean
  shopMet: boolean
  chaseChoice: ChaseChoice
  chaseResolved: boolean
  chasePending: boolean
  foundPhoto: boolean
  foundDiary: boolean
  doorOpen: boolean
  metAstra: boolean
  moralChoice: 'digital' | 'human' | null
  endingsSeen: string[]
  runCount: number
  infiniteUnlocked: boolean
  memory: Memory
  // transient
  dialogue: { speaker: string; lines: string[]; onDone?: string } | null
  glitch: boolean
  menuOpen: boolean
  inventoryOpen: boolean
  toast: string | null

  set: (p: Partial<GameState>) => void
  say: (speaker: string, lines: string[], onDone?: string) => void
  closeDialogue: () => void
  doGlitch: (ms?: number) => void
  addSecret: (id: string) => void
  visitWorld: (id: string) => void
  chooseChase: (c: Exclude<ChaseChoice, null>) => void
  resetWorld: () => void
  fullReset: () => void
  fullResetKeepProgress: () => void
  toggleSound: () => void
  showToast: (t: string) => void
}

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      phase: 'boot',
      world: null,
      soundOn: false,
      strangerMet: false,
      shopMet: false,
      chaseChoice: null,
      chaseResolved: false,
      chasePending: false,
      foundPhoto: false,
      foundDiary: false,
      doorOpen: false,
      metAstra: false,
      moralChoice: null,
      endingsSeen: [],
      runCount: 0,
      infiniteUnlocked: false,
      memory: { choices: 0, helped: 0, risks: 0, secrets: [], startTime: Date.now(), worldsVisited: [] },
      dialogue: null,
      glitch: false,
      menuOpen: false,
      inventoryOpen: false,
      toast: null,

      set: (p) => set(p),
      say: (speaker, lines, onDone) => set({ dialogue: { speaker, lines, onDone } }),
      closeDialogue: () => {
        const d = get().dialogue
        set({ dialogue: null })
        if (d?.onDone === 'lab-door') set({ doorOpen: true })
        if (d?.onDone === 'to-lab') set({ phase: 'lab' })
        if (d?.onDone === 'to-moral') set({ phase: 'moral' })
        if (d?.onDone === 'to-reveal') set({ phase: 'reveal' })
        if (d?.onDone === 'to-worldmap') set({ phase: 'worldmap', world: null })
        if (d?.onDone === 'chase-later') set({ chaseResolved: true })
        if (d?.onDone === 'chase-choice') set({ chasePending: true })
      },
      doGlitch: (ms = 900) => {
        set({ glitch: true })
        setTimeout(() => set({ glitch: false }), ms)
      },
      addSecret: (id) => {
        const m = get().memory
        if (m.secrets.includes(id)) return
        set({ memory: { ...m, secrets: [...m.secrets, id] } })
        get().showToast('◈ SECRET DISCOVERED')
      },
      visitWorld: (id) => {
        const m = get().memory
        if (!m.worldsVisited.includes(id)) set({ memory: { ...m, worldsVisited: [...m.worldsVisited, id] } })
      },
      chooseChase: (c) => {
        const m = get().memory
        set({
          chaseChoice: c,
          memory: {
            ...m,
            choices: m.choices + 1,
            helped: c === 'helped' ? m.helped + 1 : m.helped,
            risks: c === 'followed' ? m.risks + 1 : m.risks,
          },
        })
      },
      resetWorld: () => {
        const s = get()
        set({
          phase: 'boot',
          world: null,
          strangerMet: false, shopMet: false, chaseChoice: null, chaseResolved: false, chasePending: false,
          foundPhoto: false, foundDiary: false, doorOpen: false, metAstra: false,
          moralChoice: null, runCount: s.runCount + 1,
          endingsSeen: [...s.endingsSeen, 'reset'],
          memory: { ...s.memory, startTime: Date.now(), worldsVisited: [] },
        })
      },
      fullReset: () =>
        set({
          phase: 'boot', world: null, strangerMet: false, shopMet: false, chaseChoice: null,
          chaseResolved: false, chasePending: false, foundPhoto: false, foundDiary: false, doorOpen: false, metAstra: false,
          moralChoice: null, endingsSeen: [], runCount: 0, infiniteUnlocked: false,
          memory: { choices: 0, helped: 0, risks: 0, secrets: [], startTime: Date.now(), worldsVisited: [] },
          dialogue: null, glitch: false,
        }),
      fullResetKeepProgress: () =>
        set({
          phase: 'boot', world: null, strangerMet: false, shopMet: false, chaseChoice: null,
          chaseResolved: false, chasePending: false, foundPhoto: false, foundDiary: false,
          doorOpen: false, metAstra: false, moralChoice: null, dialogue: null, glitch: false,
        }),
      toggleSound: () => set({ soundOn: !get().soundOn }),
      showToast: (t) => {
        set({ toast: t })
        setTimeout(() => { if (get().toast === t) set({ toast: null }) }, 2600)
      },
    }),
    {
      name: 'last-human-save',
      partialize: (s) => ({
        soundOn: s.soundOn, endingsSeen: s.endingsSeen, runCount: s.runCount,
        infiniteUnlocked: s.infiniteUnlocked, memory: s.memory,
      }),
    },
  ),
)

/** ASTRA's behavior comments, derived from the hidden player profile. */
export function astraObservation(m: Memory): string {
  if (m.risks >= 2) return 'You always choose the risky option. Noted.'
  if (m.helped >= 2) return `You helped ${m.helped} strangers. Compassion... or strategy?`
  if (m.choices >= 3 && m.helped === 0) return "You haven't trusted anyone. Wise. Or lonely."
  if (m.secrets.length >= 3) return 'You look behind things. I like that.'
  if (Date.now() - m.startTime > 10 * 60 * 1000) return 'You have been here a long time. Are you looking for something?'
  return 'Interesting.'
}

export const memoryPercent = (s: { memory: Memory; strangerMet: boolean; shopMet: boolean; foundPhoto: boolean; foundDiary: boolean; metAstra: boolean }) => {
  let v = 12 + s.memory.worldsVisited.length * 11 + s.memory.secrets.length * 4 + s.memory.choices * 3
  if (s.strangerMet) v += 6
  if (s.shopMet) v += 6
  if (s.foundPhoto) v += 8
  if (s.foundDiary) v += 8
  if (s.metAstra) v += 10
  return Math.min(99, v)
}

// debug/testing handle
if (typeof window !== 'undefined') (window as any).__game = useGameStore
