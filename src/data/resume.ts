// ─────────────────────────────────────────────────────────────
// SINGLE SOURCE OF TRUTH — all portfolio facts live here.
// ─────────────────────────────────────────────────────────────

export const identity = {
  name: 'Vamsi Meesala',
  first: 'VAMSI',
  last: 'MEESALA',
  role: 'Computer Science & Engineering Undergraduate',
  headline: 'Systems · Software · Automation · AI',
  pitch:
    'I build systems that work — from enterprise workflow automation handling 500+ monthly requests to full-stack web apps deployed on the edge.',
  email: 'vamsim005@gmail.com',
  github: 'https://github.com/meesalavamsi',
  linkedin: 'https://www.linkedin.com/in/vamsi-meesala',
}

export const stats = [
  { value: 500, suffix: '+', label: 'Monthly requests automated' },
  { value: 25, suffix: '%', label: 'SLA compliance improvement' },
  { value: 8.63, suffix: '', label: 'CGPA / 10.0', decimals: 2 },
  { value: 4, suffix: '', label: 'Professional certifications' },
]

export const about = {
  lead: 'Computer Science undergraduate focused on backend and systems engineering.',
  body: [
    'I started by learning how computers, software, and systems actually work. Curiosity turned into projects, projects turned into experience, and experience turned into a passion for building real systems.',
    'Today I work across the stack — TypeScript, React and Node.js on the web side; ServiceNow, workflow automation and Linux administration on the enterprise side — with a strong CS foundation in data structures, algorithms and operating systems.',
  ],
  traits: ['Developer', 'Problem Solver', 'Systems Thinker', 'Builder'],
}

export const education = {
  institution: 'Aditya College of Engineering and Technology',
  degree: 'Bachelor of Technology — Computer Science and Engineering',
  period: '2023 – 2027',
  cgpa: '8.63 / 10.0',
}

export const experience = [
  {
    id: 'sn-trainee',
    role: 'ServiceNow Developer Trainee',
    org: 'Technical Hub',
    period: 'Jul 2025 – Jan 2026',
    summary: 'Making existing enterprise systems faster, more reliable, and easier to use.',
    bullets: [
      'Customized Service Portal components for better employee experience',
      'Integrated external REST APIs into ServiceNow workflows',
      'Optimized GlideRecord queries for performance',
      'Debugged systems, performed unit testing, and participated in peer code reviews',
    ],
    tech: ['Service Portal', 'REST APIs', 'GlideRecord', 'Unit Testing', 'Debugging'],
  },
  {
    id: 'sn-intern',
    role: 'ServiceNow Application Developer Intern',
    org: 'Technical Hub',
    period: 'May 2025 – Jun 2025',
    summary: 'Automated enterprise workflows processing 500+ monthly requests — improving SLA compliance by 25%.',
    bullets: [
      'Built automation with Business Rules, Client Scripts, and Flow Designer',
      'Designed Service Catalog items with ACL-based access control',
      'Worked in Agile sprints with the platform team',
    ],
    tech: ['Business Rules', 'Client Scripts', 'Flow Designer', 'ACLs', 'Service Catalog', 'Agile'],
  },
]

export const projects = [
  {
    id: 'smart-inverters',
    num: '01',
    name: 'Smart Inverters for Enterprisers',
    tagline: 'Real-time IoT energy monitoring dashboard',
    description:
      'Hundreds of energy inverters running at once need one answer: is everything healthy? This platform streams live inverter diagnostics into a responsive dashboard with metrics visualization, alerts, and API-driven rendering.',
    features: ['Real-time diagnostics', 'Energy metrics visualization', 'System alerts', 'Responsive dashboard'],
    tech: ['TypeScript', 'React', 'Node.js', 'Vercel'],
    accent: '#fbbf24',
    icon: '⚡',
  },
  {
    id: 'workflow-hub',
    num: '02',
    name: 'Enterprise Workflow Hub',
    tagline: 'Connecting employees, approvals, and systems',
    description:
      'Businesses run on workflows — employees submit requests, managers approve, systems process. This hub connects all of it: ServiceNow App Engine on the front, Node.js services and scripted REST APIs on the back.',
    features: ['Workflow automation', 'Server-side business logic', 'Scripted REST APIs', 'Automated triggers'],
    tech: ['ServiceNow App Engine', 'Node.js', 'JavaScript', 'REST APIs'],
    accent: '#62d84e',
    icon: '🔁',
  },
  {
    id: 'cyber-arena',
    num: '03',
    name: 'Cyber Security Smart IT Support',
    tagline: 'Gamified security training platform',
    description:
      'A mini-game that turns cybersecurity training into a challenge: vulnerability quizzes, threat simulations, time-based scoring, and a persistent leaderboard — built entirely with web platform APIs.',
    features: ['Vulnerability quizzes', 'Threat simulations', 'Time-based attempts', 'Leaderboard'],
    tech: ['JavaScript', 'HTML5', 'CSS3', 'Web APIs'],
    accent: '#ff4d5e',
    icon: '🛡️',
  },
  {
    id: 'itsm-tracker',
    num: '04',
    name: 'University IT Issue Tracking System',
    tagline: 'Structured ITSM for campus IT operations',
    description:
      'Instead of solving IT problems over hallway conversations, this system routes them through structured workflows: Incident → Problem → Change, with a service catalog and visual task boards.',
    features: ['Incident Management', 'Problem Management', 'Change Management', 'Service Catalog'],
    tech: ['ServiceNow ITSM', 'JavaScript', 'Service Catalog'],
    accent: '#a78bfa',
    icon: '🎫',
  },
]

export const skillGroups = [
  { id: 'languages', title: 'Languages', icon: '⌨️', skills: ['JavaScript', 'TypeScript', 'Java', 'Python', 'C', 'SQL'] },
  { id: 'core', title: 'Core CS', icon: '🧠', skills: ['Data Structures & Algorithms', 'Operating Systems', 'DBMS', 'Computer Networks'] },
  { id: 'web', title: 'Web & Backend', icon: '⚙️', skills: ['HTML5', 'CSS3', 'React', 'Node.js', 'Express.js', 'REST APIs', 'Vercel'] },
  { id: 'sys', title: 'System Administration', icon: '🐧', skills: ['Linux Administration', 'RHCSA', 'Shell Scripting', 'Git', 'GitHub'] },
  { id: 'sn', title: 'ServiceNow', icon: '🏢', skills: ['ITSM', 'CMDB', 'App Engine', 'Flow Designer', 'Business Rules', 'Client Scripts', 'Service Portal'] },
  { id: 'methods', title: 'Methodology', icon: '🧩', skills: ['Agile / Scrum', 'RBAC', 'System Architecture', 'SLA Management', 'Workflow Automation'] },
]

export const certifications = [
  { short: 'RHCSA', name: 'Red Hat Certified System Administrator', color: '#ff4d5e', icon: '🎩' },
  { short: 'ServiceNow CAD', name: 'Certified Application Developer', color: '#62d84e', icon: '🟢' },
  { short: 'ServiceNow CSA', name: 'Certified System Administrator', color: '#4dd0ff', icon: '🔵' },
  { short: 'Oracle Java', name: 'Java Foundations Associate', color: '#f89820', icon: '☕' },
]

export const coding = {
  platforms: ['LeetCode', 'CodeChef', 'HackerRank'],
  bars: [
    { label: 'System Thinking', value: 82 },
    { label: 'Algorithms', value: 78 },
    { label: 'Problem Solving', value: 85 },
    { label: 'Debugging', value: 80 },
  ],
}

export const marqueeItems = [
  'TypeScript', 'React', 'Node.js', 'ServiceNow', 'Linux', 'RHCSA',
  'Flow Designer', 'REST APIs', 'Python', 'Java', 'SQL', 'Git',
]
