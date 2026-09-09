// ═══════════════════════════════════════════════════════════════
// SINGLE SOURCE OF TRUTH
// Every fact rendered on the site comes from this file.
// Edit here → the whole portfolio updates.
// ═══════════════════════════════════════════════════════════════

export const identity = {
  name: 'Vamsi Meesala',
  first: 'Vamsi',
  last: 'Meesala',
  role: 'Computer Science & Engineering Undergraduate',
  title: 'Backend & Systems Engineer in the making',
  headline: 'Systems · Software · Automation · AI',
  availability: 'Open to software engineering roles & internships',
  pitch:
    'I build systems that hold up in production — enterprise workflows automating 500+ requests a month, and full-stack apps shipped on the edge.',
  email: 'vamsim005@gmail.com',
  github: 'https://github.com/meesalavamsi',
  githubHandle: 'meesalavamsi',
  linkedin: 'https://www.linkedin.com/in/vamsi-meesala',
  linkedinHandle: 'vamsi-meesala',
}

export const sections = [
  { id: 'about', label: 'About' },
  { id: 'experience', label: 'Experience' },
  { id: 'work', label: 'Work' },
  { id: 'skills', label: 'Skills' },
  { id: 'credentials', label: 'Credentials' },
  { id: 'contact', label: 'Contact' },
] as const

export const stats = [
  { value: 500, suffix: '+', label: 'Monthly requests automated', note: 'ServiceNow workflows' },
  { value: 25, suffix: '%', label: 'SLA compliance improvement', note: 'Measured post-rollout' },
  { value: 8.63, suffix: '', label: 'CGPA out of 10.0', note: 'B.Tech CSE, 2023–2027', decimals: 2 },
  { value: 4, suffix: '', label: 'Industry certifications', note: 'Red Hat · ServiceNow · Oracle' },
]

export const about = {
  lead: 'Software looks like screens. It runs on workflows, queries and systems — and that is the part I like working on.',
  body: [
    'I started out simply wanting to know how computers really work. That curiosity turned into projects, projects turned into internships, and internships turned into a focus on backend and systems engineering.',
    'Today I work on both sides of the stack: TypeScript, React and Node.js on the product side; ServiceNow, workflow automation and Linux administration on the enterprise side — backed by a solid CS foundation in data structures, algorithms, operating systems and networks.',
  ],
  facts: [
    { k: 'Focus', v: 'Backend systems · Workflow automation' },
    { k: 'Studying', v: 'B.Tech CSE — Aditya College of Engineering and Technology' },
    { k: 'Graduating', v: '2027' },
    { k: 'Currently', v: 'ServiceNow Developer Trainee at Technical Hub' },
  ],
  traits: ['Developer', 'Problem Solver', 'Systems Thinker', 'Builder'],
  terminal: [
    { cmd: 'whoami', out: ['vamsi — cse undergraduate, backend & systems'] },
    { cmd: 'cat focus.txt', out: ['servicenow · node.js · linux · rest apis'] },
    { cmd: 'status', out: ['open to opportunities — systems ready ✓'] },
  ],
}

export const education = {
  institution: 'Aditya College of Engineering and Technology',
  degree: 'B.Tech — Computer Science and Engineering',
  period: '2023 – 2027',
  cgpa: '8.63 / 10.0',
  cgpaValue: 8.63,
  coursework: ['Data Structures & Algorithms', 'Operating Systems', 'DBMS', 'Computer Networks'],
}

export const experience = [
  {
    id: 'sn-trainee',
    num: '01',
    role: 'ServiceNow Developer Trainee',
    org: 'Technical Hub',
    period: 'Jul 2025 – Jan 2026',
    current: true,
    summary:
      'Moved from building features to improving them — making existing enterprise systems faster, more reliable and easier for employees to use.',
    bullets: [
      'Customized Service Portal components to improve the employee-facing experience',
      'Integrated external REST APIs into ServiceNow workflows',
      'Optimized GlideRecord queries to reduce response times',
      'Debugged production issues, wrote unit tests and took part in peer code reviews',
    ],
    tech: ['Service Portal', 'REST APIs', 'GlideRecord', 'Unit Testing', 'Debugging', 'Code Review'],
  },
  {
    id: 'sn-intern',
    num: '02',
    role: 'ServiceNow Application Developer Intern',
    org: 'Technical Hub',
    period: 'May 2025 – Jun 2025',
    current: false,
    summary:
      'Joined a platform team facing 500+ incoming requests every month. The mandate: automate the workflow, speed up approvals and hold the SLA.',
    bullets: [
      'Automated request workflows with Business Rules, Client Scripts and Flow Designer',
      'Improved SLA compliance by 25% across automated request paths',
      'Designed Service Catalog items with ACL-based access control',
      'Delivered inside Agile sprints alongside the platform team',
    ],
    tech: ['Business Rules', 'Client Scripts', 'Flow Designer', 'ACLs', 'Service Catalog', 'Agile / Scrum'],
    metrics: [
      { value: '500+', label: 'monthly requests' },
      { value: '+25%', label: 'SLA compliance' },
    ],
  },
]

export type Project = (typeof projects)[number]

export const projects = [
  {
    id: 'smart-inverters',
    num: '01',
    name: 'Smart Inverters for Enterprisers',
    tagline: 'Real-time IoT energy monitoring',
    problem:
      'Hundreds of energy inverters run at the same time. Operators need one answer, fast: is every unit healthy, and how much is it producing?',
    solution:
      'A responsive dashboard that streams live inverter diagnostics, visualizes energy metrics and raises alerts the moment a unit misbehaves.',
    features: ['Real-time diagnostics', 'Energy metrics visualization', 'System alerts', 'API-driven rendering'],
    tech: ['TypeScript', 'React', 'Node.js', 'Vercel'],
    accent: '#f0b429',
    visual: 'energy',
  },
  {
    id: 'workflow-hub',
    num: '02',
    name: 'Enterprise Workflow Hub',
    tagline: 'Requests, approvals and systems — connected',
    problem:
      'Businesses run on workflows: employees submit requests, managers approve them, systems process them. Those pieces rarely talk to each other.',
    solution:
      'A hub that wires them together — ServiceNow App Engine at the front, Node.js business logic and scripted REST APIs behind it, with automated triggers between stages.',
    features: ['Workflow automation', 'Server-side business logic', 'Scripted REST APIs', 'Automated triggers'],
    tech: ['ServiceNow App Engine', 'Node.js', 'JavaScript', 'REST APIs'],
    accent: '#4ade80',
    visual: 'flow',
  },
  {
    id: 'cyber-support',
    num: '03',
    name: 'Cyber Security Smart IT Support',
    tagline: 'Security training that people finish',
    problem:
      'Security awareness training is ignored because it is boring — so the lessons never stick where they matter.',
    solution:
      'A gamified trainer built on plain web APIs: vulnerability quizzes, threat simulations, time-limited attempts, scoring and a persistent leaderboard.',
    features: ['Vulnerability quizzes', 'Threat simulations', 'Time-based attempts', 'Leaderboard & state tracking'],
    tech: ['JavaScript', 'HTML5', 'CSS3', 'Web APIs'],
    accent: '#f87171',
    visual: 'shield',
  },
  {
    id: 'itsm-tracker',
    num: '04',
    name: 'University IT Issue Tracking System',
    tagline: 'Campus IT, run like a service desk',
    problem:
      'Campus IT problems were reported in hallways and lost in inboxes, with no record, no owner and no root-cause follow-up.',
    solution:
      'A structured ITSM implementation that routes every report through Incident → Problem → Change, with a service catalog and visual task boards.',
    features: ['Incident management', 'Problem management', 'Change management', 'Service catalog & task boards'],
    tech: ['ServiceNow ITSM', 'JavaScript', 'Service Catalog'],
    accent: '#a78bfa',
    visual: 'itsm',
  },
] as const

export const skillGroups = [
  {
    id: 'languages',
    title: 'Languages',
    caption: 'Day-to-day working languages',
    skills: ['JavaScript', 'TypeScript', 'Java', 'Python', 'C', 'SQL'],
  },
  {
    id: 'core',
    title: 'Core Computer Science',
    caption: 'The foundation everything sits on',
    skills: ['Data Structures & Algorithms', 'Operating Systems', 'DBMS', 'Computer Networks'],
  },
  {
    id: 'web',
    title: 'Web & Backend',
    caption: 'From interface to API to deployment',
    skills: ['HTML5', 'CSS3', 'React', 'Node.js', 'Express.js', 'REST APIs', 'Vercel Deployment'],
  },
  {
    id: 'sys',
    title: 'Systems & Tooling',
    caption: 'Running and operating the machine',
    skills: ['Linux System Administration', 'RHCSA', 'Shell Scripting', 'Git', 'GitHub'],
  },
  {
    id: 'servicenow',
    title: 'ServiceNow Platform',
    caption: 'Enterprise workflow engineering',
    skills: ['ITSM', 'CMDB', 'App Engine', 'Flow Designer', 'Business Rules', 'Client Scripts', 'Service Portal'],
  },
  {
    id: 'methods',
    title: 'Engineering Practice',
    caption: 'How the work gets delivered',
    skills: ['Agile / Scrum', 'RBAC', 'System Architecture', 'SLA Management', 'Workflow Automation'],
  },
]

export const certifications = [
  {
    short: 'RHCSA',
    issuer: 'Red Hat',
    name: 'Red Hat Certified System Administrator',
    detail: 'Linux administration, storage, networking and services',
    color: '#f87171',
  },
  {
    short: 'CAD',
    issuer: 'ServiceNow',
    name: 'Certified Application Developer',
    detail: 'Application design and scripting on the Now Platform',
    color: '#4ade80',
  },
  {
    short: 'CSA',
    issuer: 'ServiceNow',
    name: 'Certified System Administrator',
    detail: 'Platform administration, configuration and data model',
    color: '#60a5fa',
  },
  {
    short: 'Java',
    issuer: 'Oracle',
    name: 'Certified Java Foundations Associate',
    detail: 'Core Java language and object-oriented fundamentals',
    color: '#f0b429',
  },
]

export const coding = {
  intro:
    'Shipping software is one half of engineering. Staying sharp on algorithms and problem solving is the other.',
  platforms: [
    { name: 'LeetCode', focus: 'Data structures & algorithms' },
    { name: 'CodeChef', focus: 'Competitive programming' },
    { name: 'HackerRank', focus: 'Problem solving practice' },
  ],
  bars: [
    { label: 'Problem solving', value: 85 },
    { label: 'System thinking', value: 82 },
    { label: 'Debugging', value: 80 },
    { label: 'Algorithms', value: 78 },
  ],
}

export const marqueeItems = [
  'TypeScript', 'React', 'Node.js', 'Express.js', 'ServiceNow', 'Flow Designer',
  'REST APIs', 'GlideRecord', 'Linux', 'RHCSA', 'Shell', 'Git',
  'Python', 'Java', 'SQL', 'DSA',
]
