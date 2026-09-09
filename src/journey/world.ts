// ── THE JOURNEY — chapters of Vamsi's story ─────────────────
// shared mutable scroll progress (0 → 1)
export const scrollState = { p: 0 }

export const STEP = 120 // world distance between chapters

export interface Chapter {
  id: string
  x: number
  kicker: string
  title: string
  text: string[]
  biome: 'village' | 'university' | 'forest' | 'city' | 'towers' | 'horizon'
}

export const chapters: Chapter[] = [
  {
    id: 'prologue',
    x: 0,
    kicker: 'PROLOGUE',
    title: 'Every journey begins with a curious kid.',
    biome: 'village',
    text: [
      'A small town. An old computer. A boy who kept asking one question:',
      '"How does this actually work?"',
      'He took things apart. Sometimes he even put them back together.',
    ],
  },
  {
    id: 'university',
    x: STEP,
    kicker: 'CHAPTER 01 — 2023',
    title: 'The University.',
    biome: 'university',
    text: [
      'He walked into Aditya College of Engineering and Technology to study Computer Science.',
      'Data structures. Algorithms. Operating systems. Databases. Networks.',
      'CGPA 8.63 / 10.0 — but the real education happened after class, when theory turned into code.',
    ],
  },
  {
    id: 'forest',
    x: STEP * 2,
    kicker: 'CHAPTER 02',
    title: "Skills don't appear. They grow.",
    biome: 'forest',
    text: [
      'Late nights. Broken builds. Stack Overflow at 2 AM.',
      'Every skill here is a tree he planted and watered for years —',
      'JavaScript, TypeScript, Python, Java, C, SQL. React. Node.js. Linux. Git.',
      'And a whole enterprise grove: ServiceNow ITSM, Flow Designer, App Engine.',
    ],
  },
  {
    id: 'city',
    x: STEP * 3,
    kicker: 'CHAPTER 03',
    title: 'Then he started building.',
    biome: 'city',
    text: [
      'Smart Inverters — a real-time IoT dashboard watching the health of energy systems.',
      'Enterprise Workflow Hub — connecting employees, approvals, and APIs.',
      'A cybersecurity training game. A university IT ticketing system.',
      'Each building in this city is something that did not exist before him.',
    ],
  },
  {
    id: 'towers',
    x: STEP * 4,
    kicker: 'CHAPTER 04 — 2025',
    title: 'The real world.',
    biome: 'towers',
    text: [
      'Technical Hub. ServiceNow Application Developer Intern, then Developer Trainee.',
      '500+ requests hit the system every month. He automated the workflow.',
      'SLA compliance rose 25%. Approvals got faster. People noticed.',
      'Then he stayed — making the systems faster, cleaner, easier to use.',
    ],
  },
  {
    id: 'horizon',
    x: STEP * 5,
    kicker: 'EPILOGUE — NOW',
    title: 'And now, he stands here.',
    biome: 'horizon',
    text: [
      'Certified. RHCSA. ServiceNow CAD & CSA. Oracle Java Foundations.',
      'Battle-tested on real systems. Still curious. Still building.',
      'He is looking for a team that builds things that matter.',
      'Maybe yours.',
    ],
  },
]

// sky keyframes: [progress, skyTop, fog, sunColor, sunIntensity]
export const skyKeys = [
  { p: 0.0, bg: '#2b1a3a', fog: '#3a2547', sun: '#ffb347', amb: 0.5 },  // dawn
  { p: 0.2, bg: '#7ec8e3', fog: '#a8d8ea', sun: '#fff3d6', amb: 0.75 }, // morning
  { p: 0.45, bg: '#87ceeb', fog: '#bfe3f0', sun: '#ffffff', amb: 0.85 }, // midday
  { p: 0.65, bg: '#e8956b', fog: '#e8b48b', sun: '#ffd27d', amb: 0.65 }, // golden hour
  { p: 0.85, bg: '#1a2340', fog: '#232f4d', sun: '#ff9a6b', amb: 0.45 }, // dusk
  { p: 1.0, bg: '#070b1e', fog: '#0b1026', sun: '#8fb4ff', amb: 0.35 },  // night
]
