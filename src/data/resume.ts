// ─────────────────────────────────────────────────────────────
// SINGLE SOURCE OF TRUTH — all resume facts live here.
// Update this file to change any content on the site.
// ─────────────────────────────────────────────────────────────

export const identity = {
  name: 'Vamsi Meesala',
  playerTitle: 'SYSTEMS ENGINEER IN TRAINING',
  tagline: 'SYSTEMS • SOFTWARE • AUTOMATION • AI',
  role: 'Computer Science & Engineering Undergraduate',
  email: 'vamsim005@gmail.com',
  // Update these with the real profile URLs:
  github: 'https://github.com/meesalavamsi',
  linkedin: 'https://www.linkedin.com/in/vamsi-meesala',
}

export const summary = [
  'Full-stack web development',
  'TypeScript', 'React', 'Node.js',
  'Enterprise workflow automation', 'ServiceNow',
  'Linux administration', 'RHCSA',
  'Backend systems engineering',
  'Problem solving', 'AI-driven solutions',
  'Data Structures', 'Algorithms', 'Operating Systems',
  'Open-source projects',
]

export const education = {
  institution: 'Aditya College of Engineering and Technology',
  degree: 'Bachelor of Technology',
  field: 'Computer Science and Engineering',
  period: '2023 – 2027',
  cgpa: 8.63,
  cgpaMax: 10.0,
  foundations: ['Data Structures', 'Algorithms', 'Operating Systems', 'Databases', 'Networks', 'Programming'],
}

export const skillGroups = [
  {
    id: 'programming',
    title: 'Programming Terminal',
    icon: '⌨️',
    skills: ['JavaScript', 'TypeScript', 'Java', 'Python', 'C', 'SQL'],
  },
  {
    id: 'corecs',
    title: 'Core Computer Science',
    icon: '🧠',
    skills: ['Data Structures & Algorithms', 'Operating Systems', 'DBMS', 'Computer Networks'],
  },
  {
    id: 'web',
    title: 'Web & Backend',
    icon: '⚙️',
    skills: ['HTML5', 'CSS3', 'React', 'Node.js', 'Express.js', 'REST APIs', 'Vercel Deployment'],
  },
  {
    id: 'sysadmin',
    title: 'System Administration',
    icon: '🐧',
    skills: ['Linux System Administration', 'RHCSA', 'Shell Scripting', 'Git', 'GitHub'],
  },
  {
    id: 'enterprise',
    title: 'Enterprise Systems — ServiceNow',
    icon: '🏢',
    skills: ['ITSM', 'CMDB', 'App Engine', 'Flow Designer', 'Business Rules', 'Client Scripts', 'Service Portal'],
  },
  {
    id: 'methodology',
    title: 'Methodology',
    icon: '🧩',
    skills: ['Agile / Scrum', 'RBAC', 'System Architecture', 'SLA Management', 'Workflow Automation'],
  },
]

export const experience = [
  {
    id: 'sn-intern',
    role: 'ServiceNow Application Developer Intern',
    org: 'Technical Hub',
    period: 'May 2025 – June 2025',
    mission: 'ENTERPRISE AUTOMATION',
    briefing:
      '500+ monthly requests were entering the system. The challenge? Automate the workflow. Improve SLA compliance. Make approvals faster.',
    stats: [
      { value: 500, suffix: '+', label: 'Monthly Requests' },
      { value: 25, suffix: '%', label: 'Improvement in SLA Compliance' },
    ],
    tech: ['Business Rules', 'Client Scripts', 'Flow Designer', 'ACLs', 'Service Catalog', 'Agile Sprints'],
    workflow: [
      { node: 'Request', desc: 'An employee submits a request through the Service Catalog. This is where every ticket begins.' },
      { node: 'Approval', desc: 'The request routes to the right approver automatically — no chasing people over email.' },
      { node: 'Automation', desc: 'Flow Designer and Business Rules trigger the moment conditions match. The system works while people sleep.' },
      { node: 'Processing', desc: 'Tasks are assigned, tracked, and measured against SLAs so nothing slips through.' },
      { node: 'Resolution', desc: 'The request closes, the requester is notified, and the data feeds reporting.' },
    ],
  },
  {
    id: 'sn-trainee',
    role: 'ServiceNow Developer Trainee',
    org: 'Technical Hub',
    period: 'July 2025 – January 2026',
    mission: 'OPTIMIZE THE ENTERPRISE SYSTEM',
    briefing:
      'The next challenge was not simply building features. It was making existing systems faster, more reliable, and easier to use.',
    stats: [],
    tech: ['Service Portal', 'REST APIs', 'GlideRecord', 'Debugging', 'Unit Testing', 'Peer Code Review'],
    bullets: [
      'Customized Service Portal components',
      'Integrated external REST APIs',
      'Optimized GlideRecord queries',
      'Debugged systems',
      'Performed unit testing',
      'Participated in peer code reviews',
    ],
    workflow: [
      { node: 'External API', desc: 'External systems send and receive data through scripted REST APIs.' },
      { node: 'ServiceNow', desc: 'ServiceNow receives the payload and routes it to the right logic.' },
      { node: 'GlideRecord', desc: 'GlideRecord queries read and write database records — optimized queries keep this fast.' },
      { node: 'Workflow', desc: 'Flows and business rules act on the data automatically.' },
      { node: 'User', desc: 'The user sees the result in the Service Portal — fast and reliable.' },
    ],
  },
]

export const projects = [
  {
    id: 'smart-inverters',
    name: 'Smart Inverters For Enterprisers',
    short: 'SMART INVERTERS',
    icon: '⚡',
    theme: 'IoT Energy Monitoring Facility',
    tech: ['TypeScript', 'React', 'Node.js', 'Vercel'],
    story:
      'Imagine hundreds of energy inverters operating at the same time. Someone needs to know: Is the inverter healthy? How much energy is being produced? Is something wrong? That\'s where this project comes in.',
    features: [
      'Real-time inverter diagnostics',
      'Energy metrics visualization',
      'System alerts',
      'Responsive dashboard',
      'API rendering',
    ],
    flow: ['Solar / Energy Devices', 'Inverter', 'API', 'Dashboard', 'Alerts'],
  },
  {
    id: 'workflow-hub',
    name: 'Enterprise Workflow Hub',
    short: 'WORKFLOW HUB',
    icon: '🔁',
    theme: 'Workflow Control Center',
    tech: ['ServiceNow App Engine', 'Node.js', 'JavaScript', 'REST APIs'],
    story:
      'Businesses run on workflows. Employees submit requests. Managers approve them. Systems process them. Someone has to connect all these pieces.',
    features: [
      'Enterprise workflow automation',
      'Server-side business logic',
      'Scripted REST APIs',
      'Automated triggers',
      'Employee operations',
    ],
    flow: ['Employee', 'ServiceNow', 'Workflow Engine', 'Node.js Backend', 'REST API', 'Response'],
  },
  {
    id: 'cyber-arena',
    name: 'Cyber Security Smart IT Support',
    short: 'CYBER ARENA',
    icon: '🛡️',
    theme: 'Cyber-Security Bunker',
    tech: ['JavaScript', 'HTML5', 'CSS3', 'Web APIs'],
    story:
      'A gamified cybersecurity training experience. Players answer vulnerability quizzes under time pressure, run threat simulations, and climb the leaderboard.',
    features: [
      'Vulnerability quizzes',
      'Threat simulations',
      'Time-based attempts',
      'Leaderboard',
      'Stateful tracking',
    ],
    flow: [],
  },
  {
    id: 'itsm-tracker',
    name: 'University IT Issue Tracking System',
    short: 'ITSM TRACKER',
    icon: '🎫',
    theme: 'University IT Operations Center',
    tech: ['ServiceNow ITSM', 'JavaScript', 'Service Catalog'],
    story:
      'Instead of solving IT problems manually, the system organizes them into structured workflows.',
    features: [
      'Incident Management',
      'Problem Management',
      'Change Management',
      'Service Catalog',
      'Visual Task Boards',
    ],
    flow: ['Report', 'Incident', 'Problem', 'Change', 'Resolved'],
  },
]

export const certifications = [
  { id: 'rhcsa', short: 'RHCSA', name: 'Red Hat Certified System Administrator', color: '#ff4d5e' },
  { id: 'sn-cad', short: 'ServiceNow CAD', name: 'Certified Application Developer', color: '#62d84e' },
  { id: 'sn-csa', short: 'ServiceNow CSA', name: 'Certified System Administrator', color: '#4dd0ff' },
  { id: 'oracle-java', short: 'Oracle Java', name: 'Oracle Certified Java Foundations Associate', color: '#f89820' },
]

export const codingProfiles = {
  title: 'Competitive Programming & Problem Solving',
  platforms: ['LeetCode', 'CodeChef', 'HackerRank'],
  traits: ['SYSTEM THINKING', 'ALGORITHMS', 'PROBLEM SOLVING', 'DEBUGGING'],
}

// ── Game configuration ──────────────────────────────────────

export type LocationId =
  | 'home' | 'university' | 'skilllab' | 'servicenow' | 'projects'
  | 'cyber' | 'certs' | 'arena' | 'control'

export interface LocationDef {
  id: LocationId
  name: string
  icon: string
  mission: string
  xp: number
  pos: [number, number, number] // position on the world map
  color: string
  unlockAfter?: LocationId
  mapLabel: string
}

export const locations: LocationDef[] = [
  { id: 'home',       name: 'Home Base',          icon: '🏠', mission: 'Discover Vamsi',            xp: 100, pos: [0, 0, 0],       color: '#4dd0ff', mapLabel: 'HOME' },
  { id: 'university', name: 'University',         icon: '🎓', mission: 'Visit University',          xp: 100, pos: [0, 0, -20],     color: '#a78bfa', unlockAfter: 'home', mapLabel: 'UNIVERSITY' },
  { id: 'skilllab',   name: 'Skill Lab',          icon: '🧠', mission: 'Enter Skill Lab',           xp: 200, pos: [-17, 0, 0],     color: '#22d3ee', unlockAfter: 'university', mapLabel: 'SKILL LAB' },
  { id: 'servicenow', name: 'ServiceNow HQ',      icon: '⚙️', mission: 'Investigate ServiceNow HQ', xp: 300, pos: [17, 0, 0],      color: '#62d84e', unlockAfter: 'skilllab', mapLabel: 'SERVICENOW HQ' },
  { id: 'projects',   name: 'Project City',       icon: '💻', mission: 'Explore Project City',      xp: 300, pos: [0, 0, 20],      color: '#f472b6', unlockAfter: 'servicenow', mapLabel: 'PROJECT CITY' },
  { id: 'cyber',      name: 'Cyber Arena',        icon: '🛡️', mission: 'Enter Cyber Arena',         xp: 200, pos: [-17, 0, 20],    color: '#ff4d5e', unlockAfter: 'projects', mapLabel: 'CYBER ARENA' },
  { id: 'certs',      name: 'Certification Vault',icon: '🏆', mission: 'Unlock Certifications',     xp: 200, pos: [17, 0, 20],     color: '#fbbf24', unlockAfter: 'cyber', mapLabel: 'CERT VAULT' },
  { id: 'arena',      name: 'Algorithm Arena',    icon: '🧩', mission: 'Visit Algorithm Arena',     xp: 200, pos: [-17, 0, -20],   color: '#34d399', unlockAfter: 'certs', mapLabel: 'ALGO ARENA' },
  { id: 'control',    name: 'Mission Control',    icon: '🚀', mission: 'Reach Mission Control',     xp: 200, pos: [17, 0, -20],    color: '#818cf8', unlockAfter: 'arena', mapLabel: 'MISSION CTRL' },
]

export const levels = [
  { level: 1, title: 'Explorer',            xpRequired: 0 },
  { level: 2, title: 'Developer',           xpRequired: 200 },
  { level: 3, title: 'Systems Builder',     xpRequired: 500 },
  { level: 4, title: 'Automation Engineer', xpRequired: 900 },
  { level: 5, title: 'Problem Solver',      xpRequired: 1300 },
  { level: 6, title: 'Backend Engineer',    xpRequired: 1600 },
]

export const achievements = [
  { id: 'first-step',   name: 'FIRST STEP',         desc: 'Entered the world.',            check: 'enter' },
  { id: 'code-explorer',name: 'CODE EXPLORER',      desc: 'Visited Skill Lab.',            check: 'skilllab' },
  { id: 'auto-master',  name: 'AUTOMATION MASTER',  desc: 'Completed ServiceNow HQ.',      check: 'servicenow' },
  { id: 'builder',      name: 'BUILDER',            desc: 'Explored all projects.',        check: 'all-projects' },
  { id: 'cyber-agent',  name: 'CYBER AGENT',        desc: 'Completed Cyber Arena.',        check: 'cyber-quiz' },
  { id: 'certified',    name: 'CERTIFIED',          desc: 'Unlocked Certification Vault.', check: 'certs' },
  { id: 'problem-solver',name:'PROBLEM SOLVER',     desc: 'Visited Algorithm Arena.',      check: 'arena' },
  { id: 'sys-complete', name: 'SYSTEM COMPLETE',    desc: 'Completed the entire journey.', check: 'all-missions' },
] as const

export const introNarration = [
  'Hey Player.',
  "I'm Vamsi.",
  "I'm a Computer Science undergraduate who enjoys building systems, solving problems, and turning ideas into working software.",
  'Instead of showing you a boring resume...',
  'Let me show you the journey.',
]

export const bootLines = [
  'INITIALIZING VAMSI.EXE...',
  '',
  'Loading Skills............. OK',
  'Loading Projects........... OK',
  'Loading Experience......... OK',
  'Loading Certifications..... OK',
  'Loading Systems............ OK',
  '',
  'SYSTEM READY',
]
