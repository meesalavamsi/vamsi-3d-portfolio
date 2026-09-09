import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { locations, levels, type LocationId } from '../data/resume'

export type Phase =
  | 'boot'        // cinematic loading
  | 'title'       // start screen
  | 'intro'       // player introduction dialogue
  | 'world'       // 3D world map
  | 'section'     // inside a location
  | 'resume'      // traditional resume mode
  | 'finale'      // cinematic ending

export interface Toast {
  id: number
  kind: 'mission' | 'achievement' | 'xp' | 'info'
  title: string
  lines: string[]
}

interface GameState {
  phase: Phase
  prevPhase: Phase
  xp: number
  soundOn: boolean
  visited: LocationId[]
  completedMissions: LocationId[]
  exploredProjects: string[]
  unlockedCerts: string[]
  cyberQuizDone: boolean
  earnedAchievements: string[]
  activeLocation: LocationId | null
  toasts: Toast[]
  showMissions: boolean
  showMap: boolean
  isMobile: boolean
  reducedMotion: boolean

  setPhase: (p: Phase) => void
  enterWorld: () => void
  enterLocation: (id: LocationId) => void
  exitLocation: () => void
  completeMission: (id: LocationId) => void
  exploreProject: (id: string) => void
  unlockCert: (id: string) => void
  setCyberQuizDone: () => void
  toggleSound: () => void
  toggleMissions: () => void
  toggleMap: () => void
  openResume: () => void
  closeResume: () => void
  setMobile: (v: boolean) => void
  setReducedMotion: (v: boolean) => void
  pushToast: (t: Omit<Toast, 'id'>) => void
  dismissToast: (id: number) => void
  resetJourney: () => void
}

let toastId = 0

export const levelForXp = (xp: number) => {
  let cur = levels[0]
  for (const l of levels) if (xp >= l.xpRequired) cur = l
  return cur
}

export const isUnlocked = (id: LocationId, visited: LocationId[]) => {
  const loc = locations.find((l) => l.id === id)!
  if (!loc.unlockAfter) return true
  return visited.includes(loc.unlockAfter)
}

export const useGame = create<GameState>()(
  persist(
    (set, get) => ({
      phase: 'boot',
      prevPhase: 'world',
      xp: 0,
      soundOn: false,
      visited: [],
      completedMissions: [],
      exploredProjects: [],
      unlockedCerts: [],
      cyberQuizDone: false,
      earnedAchievements: [],
      activeLocation: null,
      toasts: [],
      showMissions: false,
      showMap: false,
      isMobile: false,
      reducedMotion: false,

      setPhase: (p) => set({ phase: p }),

      enterWorld: () => {
        const s = get()
        set({ phase: 'world' })
        if (!s.earnedAchievements.includes('first-step')) {
          set({ earnedAchievements: [...s.earnedAchievements, 'first-step'] })
          s.pushToast({ kind: 'achievement', title: '🏅 ACHIEVEMENT UNLOCKED', lines: ['FIRST STEP', 'Entered the world.'] })
        }
      },

      enterLocation: (id) => {
        const s = get()
        if (!isUnlocked(id, s.visited)) {
          const loc = locations.find((l) => l.id === id)!
          const req = locations.find((l) => l.id === loc.unlockAfter)!
          s.pushToast({ kind: 'info', title: '🔒 LOCKED', lines: [`Complete "${req.mission}" first.`] })
          return
        }
        const firstVisit = !s.visited.includes(id)
        set({
          activeLocation: id,
          phase: 'section',
          visited: firstVisit ? [...s.visited, id] : s.visited,
        })
        // Section-specific achievement hooks
        const achMap: Partial<Record<LocationId, [string, string, string]>> = {
          skilllab: ['code-explorer', 'CODE EXPLORER', 'Visited Skill Lab.'],
          certs: ['certified', 'CERTIFIED', 'Unlocked Certification Vault.'],
          arena: ['problem-solver', 'PROBLEM SOLVER', 'Visited Algorithm Arena.'],
        }
        const ach = achMap[id]
        if (ach && !s.earnedAchievements.includes(ach[0])) {
          set({ earnedAchievements: [...get().earnedAchievements, ach[0]] })
          s.pushToast({ kind: 'achievement', title: '🏅 ACHIEVEMENT UNLOCKED', lines: [ach[1], ach[2]] })
        }
      },

      exitLocation: () => set({ phase: 'world', activeLocation: null }),

      completeMission: (id) => {
        const s = get()
        if (s.completedMissions.includes(id)) return
        const loc = locations.find((l) => l.id === id)!
        const newCompleted = [...s.completedMissions, id]
        const newXp = s.xp + loc.xp
        const before = levelForXp(s.xp)
        const after = levelForXp(newXp)
        set({ completedMissions: newCompleted, xp: newXp })
        s.pushToast({ kind: 'mission', title: 'MISSION COMPLETE ✓', lines: [loc.mission, `+${loc.xp} XP`] })
        if (after.level > before.level) {
          get().pushToast({ kind: 'xp', title: `⬆ LEVEL ${String(after.level).padStart(2, '0')}`, lines: [after.title] })
        }
        if (id === 'servicenow' && !s.earnedAchievements.includes('auto-master')) {
          set({ earnedAchievements: [...get().earnedAchievements, 'auto-master'] })
          get().pushToast({ kind: 'achievement', title: '🏅 ACHIEVEMENT UNLOCKED', lines: ['AUTOMATION MASTER', 'Completed ServiceNow HQ.'] })
        }
        if (newCompleted.length === locations.length && !get().earnedAchievements.includes('sys-complete')) {
          set({ earnedAchievements: [...get().earnedAchievements, 'sys-complete'] })
          get().pushToast({ kind: 'achievement', title: '🏅 ACHIEVEMENT UNLOCKED', lines: ['SYSTEM COMPLETE', 'Completed the entire journey.'] })
        }
      },

      exploreProject: (pid) => {
        const s = get()
        if (s.exploredProjects.includes(pid)) return
        const explored = [...s.exploredProjects, pid]
        set({ exploredProjects: explored })
        if (explored.length === 4 && !s.earnedAchievements.includes('builder')) {
          set({ earnedAchievements: [...get().earnedAchievements, 'builder'] })
          s.pushToast({ kind: 'achievement', title: '🏅 ACHIEVEMENT UNLOCKED', lines: ['BUILDER', 'Explored all projects.'] })
        }
      },

      unlockCert: (cid) => {
        const s = get()
        if (s.unlockedCerts.includes(cid)) return
        set({ unlockedCerts: [...s.unlockedCerts, cid] })
      },

      setCyberQuizDone: () => {
        const s = get()
        if (s.cyberQuizDone) return
        set({ cyberQuizDone: true, xp: s.xp + 100 })
        if (!s.earnedAchievements.includes('cyber-agent')) {
          set({ earnedAchievements: [...get().earnedAchievements, 'cyber-agent'] })
          s.pushToast({ kind: 'achievement', title: '🏅 ACHIEVEMENT UNLOCKED', lines: ['CYBER AGENT', 'Completed Cyber Arena.'] })
        }
      },

      toggleSound: () => set({ soundOn: !get().soundOn }),
      toggleMissions: () => set({ showMissions: !get().showMissions, showMap: false }),
      toggleMap: () => set({ showMap: !get().showMap, showMissions: false }),
      openResume: () => set({ prevPhase: get().phase, phase: 'resume' }),
      closeResume: () => set({ phase: get().prevPhase === 'resume' ? 'world' : get().prevPhase }),
      setMobile: (v) => set({ isMobile: v }),
      setReducedMotion: (v) => set({ reducedMotion: v }),

      pushToast: (t) => {
        const id = ++toastId
        set({ toasts: [...get().toasts, { ...t, id }] })
        setTimeout(() => get().dismissToast(id), 4200)
      },
      dismissToast: (id) => set({ toasts: get().toasts.filter((t) => t.id !== id) }),

      resetJourney: () =>
        set({
          phase: 'world',
          xp: 0,
          visited: [],
          completedMissions: [],
          exploredProjects: [],
          unlockedCerts: [],
          cyberQuizDone: false,
          earnedAchievements: ['first-step'],
          activeLocation: null,
          showMissions: false,
          showMap: false,
        }),
    }),
    {
      name: 'vamsi-portfolio-save',
      partialize: (s) => ({
        xp: s.xp,
        soundOn: s.soundOn,
        visited: s.visited,
        completedMissions: s.completedMissions,
        exploredProjects: s.exploredProjects,
        unlockedCerts: s.unlockedCerts,
        cyberQuizDone: s.cyberQuizDone,
        earnedAchievements: s.earnedAchievements,
      }),
    },
  ),
)
