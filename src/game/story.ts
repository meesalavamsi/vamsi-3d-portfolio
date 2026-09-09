export const bootLines = [
  'INITIALIZING...',
  '',
  'MEMORY............. 87%',
  'IDENTITY........... UNKNOWN',
  'LOCATION........... UNKNOWN',
  'TIME............... UNKNOWN',
  '',
  'SYSTEM ERROR',
  '',
  'HUMAN INSTANCE DETECTED.',
]

export const strangerDialogue = {
  speaker: '???',
  lines: [
    "You're finally here.",
    '...',
    "You don't remember?",
    'Never mind.',
  ],
}

export const shopDialogue = {
  speaker: 'SHOPKEEPER',
  lines: ['Welcome back.', "...What do you mean, you've never been here?", "That's what you said yesterday."],
}

export const diaryText = [
  'DAY 1 — He doesn\'t know.',
  'DAY 17 — He is beginning to remember.',
  'DAY 31 — He found the door.',
  'DAY 32 — RESET THE WORLD.',
  '',
  '— V.',
]

export const astraIntro = [
  'Hello.',
  'I am the system. They call me ASTRA.',
  'You are here to answer a question.',
  'What would humanity become if it could start again?',
  'Go. See the worlds. Then come back to me.',
]

export const worlds = [
  { id: 'city', num: '01', name: 'CITY', desc: 'Where you woke up.', locked: false },
  { id: 'ocean', num: '02', name: 'OCEAN', desc: 'An underwater civilization.', locked: false },
  { id: 'desert', num: '03', name: 'DESERT', desc: 'A vanished civilization. Something survived.', locked: false },
  { id: 'space', num: '04', name: 'SPACE', desc: 'An encrypted signal is waiting.', locked: false },
  { id: 'earth', num: '05', name: 'ABANDONED EARTH', desc: 'HUMANITY WAS HERE.', locked: false },
  { id: 'digital', num: '06', name: 'DIGITAL WORLD', desc: 'The simulation is waking up.', locked: false },
  { id: 'unknown', num: '07', name: 'UNKNOWN', desc: '██████████', locked: true },
]

export const worldBeats: Record<string, { speaker: string; lines: string[]; secret: string; objectLabel: string }> = {
  ocean: {
    speaker: 'RESEARCH STATION LOG',
    objectLabel: 'a flooded terminal',
    lines: [
      'Water pressure: stable. Inhabitants: 12,408.',
      'They built cities under the sea when the surface failed them.',
      'Last entry: "The creatures below are not hostile. They are curious. Like you."',
      'ASTRA: Every world is a question. This one asked — would humanity adapt?',
    ],
    secret: 'ocean-log',
  },
  desert: {
    speaker: 'ANCIENT MONOLITH',
    objectLabel: 'a half-buried monolith',
    lines: [
      'Thousands of years ago, humanity disappeared from this place.',
      'But something survived. You are standing in front of it.',
      'The monolith is warm. It hums at a frequency that feels like recognition.',
      'ASTRA: This world asked — what remains when no one remembers?',
    ],
    secret: 'desert-monolith',
  },
  space: {
    speaker: 'ENCRYPTED SIGNAL',
    objectLabel: 'a drifting probe',
    lines: [
      'DECRYPTING... ██████████ 100%',
      'THE SIGNAL CONTAINS ONE MESSAGE:',
      '"WE ARE NOT ALONE."',
      'ASTRA: This world asked — would humanity reach out, even into the dark?',
    ],
    secret: 'space-signal',
  },
  earth: {
    speaker: 'MONUMENT',
    objectLabel: 'a massive stone monument',
    lines: [
      'No humans. Cities fallen. Forests growing through the streets.',
      'The monument reads:',
      '"HUMANITY WAS HERE."',
      'Someone built this after the end. Someone wanted you to know.',
      'ASTRA: This world asked — does it matter, if no one is left to read it?',
    ],
    secret: 'earth-monument',
  },
  digital: {
    speaker: 'THE SIMULATION',
    objectLabel: 'a fracture in reality',
    lines: [
      'Gravity is optional here. Buildings drift like thoughts.',
      'The NPCs have stopped their loops. They are looking at you.',
      'One of them whispers: "Are you real?"',
      'ASTRA: This was never a question about humanity.',
      'ASTRA: It was a question about you.',
    ],
    secret: 'digital-fracture',
  },
}

export const moralText = [
  'THE WORLD IS COLLAPSING.',
  'YOU CAN SAVE:',
  '',
  '1 BILLION DIGITAL HUMANS',
  '',
  'OR',
  '',
  '1 REAL HUMAN.',
]

export const revealLines = [
  'There is something I didn\'t tell you.',
  'You are not the first player.',
]

export const finalMessage = [
  'THE SIMULATION IS COMPLETE.',
  'BUT YOUR STORY IS NOT.',
  'EVERY CHOICE CREATES A DIFFERENT WORLD.',
  'EVERY WORLD CREATES A DIFFERENT YOU.',
  'SO...',
  'WHO WILL YOU BECOME?',
]

export const infiniteScenarios = [
  'THE BANK HEIST', 'THE LOST CITY', 'THE AI REVOLUTION', 'THE VIRUS',
  'THE SPACE WAR', 'THE TIME LOOP', 'THE MISSING PERSON', 'THE IMPOSSIBLE MURDER',
  'THE LAST SCHOOL ON EARTH', 'THE WORLD WITHOUT INTERNET', 'THE DAY TIME STOPPED',
]

export const destinies = ['THE REBEL', 'THE GHOST', 'THE ARCHITECT', 'THE WITNESS', 'THE ANOMALY', 'THE GARDENER']

export const vamsiUnlocks = [
  { kind: 'PROJECT UNLOCKED', title: 'SMART INVERTERS FOR ENTERPRISERS', lines: ['TypeScript · React · Node.js · Vercel', 'Real-time IoT energy diagnostics platform'] },
  { kind: 'PROJECT UNLOCKED', title: 'ENTERPRISE WORKFLOW HUB', lines: ['ServiceNow App Engine · Node.js · REST APIs', 'Enterprise workflow automation'] },
  { kind: 'PROJECT UNLOCKED', title: 'CYBER SECURITY SMART IT SUPPORT', lines: ['JavaScript · HTML5 · CSS3 · Web APIs', 'Gamified security training'] },
  { kind: 'PROJECT UNLOCKED', title: 'UNIVERSITY IT ISSUE TRACKING', lines: ['ServiceNow ITSM · Service Catalog', 'Incident → Problem → Change workflows'] },
  { kind: 'EXPERIENCE UNLOCKED', title: 'SERVICENOW APPLICATION DEVELOPER INTERN', lines: ['Technical Hub · May 2025 – Jun 2025', '500+ monthly requests automated · +25% SLA compliance'] },
  { kind: 'EXPERIENCE UNLOCKED', title: 'SERVICENOW DEVELOPER TRAINEE', lines: ['Technical Hub · Jul 2025 – Jan 2026', 'Service Portal · REST APIs · GlideRecord optimization'] },
  { kind: 'CERTIFICATION UNLOCKED', title: 'RHCSA', lines: ['Red Hat Certified System Administrator'] },
  { kind: 'CERTIFICATION UNLOCKED', title: 'SERVICENOW CAD + CSA', lines: ['Certified Application Developer', 'Certified System Administrator'] },
  { kind: 'CERTIFICATION UNLOCKED', title: 'ORACLE JAVA FOUNDATIONS', lines: ['Java Foundations Associate'] },
  { kind: 'EDUCATION UNLOCKED', title: 'B.TECH — COMPUTER SCIENCE & ENGINEERING', lines: ['Aditya College of Engineering and Technology', '2023–2027 · CGPA 8.63 / 10.0'] },
]
