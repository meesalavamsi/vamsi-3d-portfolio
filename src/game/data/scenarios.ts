// ═══════════════════════════════════════════════════════════════
// Real scenarios, drawn from Vamsi Meesala's actual work.
// Game framing is invented; the technical substance is not.
// ═══════════════════════════════════════════════════════════════

export type Choice = {
  id: string
  label: string
  detail?: string
  score: number          // -2 … 3
  verdict: string        // what the world says back
  best?: boolean
}

export type Step = {
  id: string
  speaker: string
  role: string
  line: string
  question: string
  seconds?: number       // real-time pressure; omit for untimed
  choices: Choice[]
}

export type Scenario = {
  id: string
  zone: string
  order: number
  title: string
  place: string
  tag: string
  accent: string
  brief: string
  basedOn: string
  steps: Step[]
  closer: string
}

export const scenarios: Scenario[] = [
  // ── 1. CAMPUS ─────────────────────────────────────────────
  {
    id: 'campus',
    zone: 'campus',
    order: 1,
    title: 'The Wi-Fi Ticket',
    place: 'University IT Desk',
    tag: 'ITSM · Incident → Problem → Change',
    accent: '#a78bfa',
    brief:
      'A student walks up to the IT desk. Nothing is on fire yet — but how you classify this decides whether it gets fixed once or forever.',
    basedOn: 'University IT Issue Tracking System — ServiceNow ITSM',
    steps: [
      {
        id: 'classify',
        speaker: 'Ananya',
        role: 'Second-year student',
        line: "My laptop won't connect to the campus Wi-Fi. It worked yesterday.",
        question: 'How do you log this?',
        seconds: 22,
        choices: [
          {
            id: 'incident',
            label: 'Raise an Incident',
            detail: 'One user, service is degraded, restore it first',
            score: 3,
            best: true,
            verdict:
              'Correct. An Incident is an unplanned interruption for a user. Restore service first, investigate later.',
          },
          {
            id: 'problem',
            label: 'Raise a Problem',
            detail: 'Go straight to root cause',
            score: 0,
            verdict:
              'Too early. A Problem is for the underlying cause behind one or more Incidents — you do not have that evidence yet.',
          },
          {
            id: 'change',
            label: 'Raise a Change request',
            detail: 'Push a fix to the network',
            score: -1,
            verdict:
              'Dangerous. A Change modifies the environment. You would be touching production with no diagnosis and no approval.',
          },
        ],
      },
      {
        id: 'pattern',
        speaker: 'Service Desk',
        role: 'Queue alert',
        line: 'Four more Incidents just came in. All from Block C. All Wi-Fi.',
        question: 'Four Incidents, one pattern. Next move?',
        seconds: 20,
        choices: [
          {
            id: 'problem2',
            label: 'Open a Problem record and link the Incidents',
            detail: 'One cause behind many tickets',
            score: 3,
            best: true,
            verdict:
              'That is exactly the escalation path. Multiple related Incidents mean a Problem record — investigate the cause once, not five times.',
          },
          {
            id: 'close',
            label: 'Resolve each Incident individually',
            score: -1,
            verdict:
              'You will close five tickets and get five more tomorrow. The cause is still live in Block C.',
          },
          {
            id: 'ignore',
            label: 'Ask the students to use mobile data',
            score: -2,
            verdict: 'That is not a resolution. That is a workaround with no record.',
          },
        ],
      },
      {
        id: 'fix',
        speaker: 'Network Engineer',
        role: 'Infrastructure',
        line: 'Found it — the Block C access point is running old firmware and dropping clients.',
        question: 'You know the cause. How does the fix reach production?',
        seconds: 18,
        choices: [
          {
            id: 'change2',
            label: 'Raise a Change request for the firmware update',
            detail: 'Approval, schedule, rollback plan',
            score: 3,
            best: true,
            verdict:
              'Incident → Problem → Change, closed properly. The fix is approved, scheduled and reversible.',
          },
          {
            id: 'cowboy',
            label: 'Update it now, document later',
            score: -2,
            verdict:
              'Unapproved production change during class hours. This is how a Wi-Fi ticket becomes a campus outage.',
          },
        ],
      },
    ],
    closer:
      'One student became one Incident, five Incidents became one Problem, and one Problem became one controlled Change. That is the whole system working.',
  },

  // ── 2. THE BACKLOG ────────────────────────────────────────
  {
    id: 'backlog',
    zone: 'office',
    order: 2,
    title: 'Five Hundred a Month',
    place: 'Platform Team Floor',
    tag: 'ServiceNow · Workflow automation · SLA',
    accent: '#4ade80',
    brief:
      'The request queue is winning. 500+ requests a month are arriving and approvals are the bottleneck. The SLA clock does not stop while you decide.',
    basedOn: 'ServiceNow Application Developer Intern — 500+ monthly requests, +25% SLA compliance',
    steps: [
      {
        id: 'approach',
        speaker: 'Priya',
        role: 'Platform Lead',
        line: "We're at 500-plus requests a month and SLA compliance is slipping. I need a plan today, not a roadmap.",
        question: 'Where do you attack first?',
        seconds: 25,
        choices: [
          {
            id: 'automate',
            label: 'Automate the approval path with Flow Designer',
            detail: 'Route, approve and notify without a human relay',
            score: 3,
            best: true,
            verdict:
              'Right target. The bottleneck is waiting, not working. Flow Designer removes the human relay from the critical path.',
          },
          {
            id: 'staff',
            label: 'Ask for two more people on triage',
            score: 0,
            verdict:
              'That buys you a month and costs you every month after. The process is the problem, not the headcount.',
          },
          {
            id: 'sla',
            label: 'Relax the SLA targets',
            score: -2,
            verdict:
              'Moving the goalposts is not improvement. Compliance would look better while service got worse.',
          },
        ],
      },
      {
        id: 'validate',
        speaker: 'You',
        role: 'Platform Developer',
        line: 'Half these requests fail validation and bounce back to the requester days later.',
        question: 'Where do you catch a bad request?',
        seconds: 20,
        choices: [
          {
            id: 'client',
            label: 'Client Scripts on the form, plus Business Rules server-side',
            detail: 'Fast feedback, enforced properly',
            score: 3,
            best: true,
            verdict:
              'Both layers. Client Scripts tell the user instantly; Business Rules make sure it is actually enforced where it counts.',
          },
          {
            id: 'onlyclient',
            label: 'Client Scripts only',
            score: 1,
            verdict:
              'Good UX, weak guarantee. Anything that skips the form — an import or an API call — walks straight past it.',
          },
          {
            id: 'manual',
            label: 'Have triage check each one by hand',
            score: -1,
            verdict: 'You just automated a queue into a different queue.',
          },
        ],
      },
      {
        id: 'access',
        speaker: 'Security Review',
        role: 'Governance',
        line: 'Your new catalog item is live. Who can see the records behind it?',
        question: 'How do you scope access?',
        seconds: 18,
        choices: [
          {
            id: 'acl',
            label: 'ACLs with role-based access on the catalog item',
            score: 3,
            best: true,
            verdict:
              'RBAC through ACLs. Requesters see their own records, approvers see their queue, nobody browses the rest.',
          },
          {
            id: 'open',
            label: 'Leave it open — it is only internal',
            score: -2,
            verdict:
              '"Internal" is not an access model. Salary and HR requests flow through this same catalog.',
          },
        ],
      },
    ],
    closer:
      'Approvals moved from inbox ping-pong into an automated flow, validation moved to where it is enforced, and access got scoped. SLA compliance climbed 25%.',
  },

  // ── 3. THE ENERGY FLOOR ───────────────────────────────────
  {
    id: 'inverters',
    zone: 'plant',
    order: 3,
    title: 'Inverter 03',
    place: 'Energy Operations',
    tag: 'IoT · Telemetry · Real-time dashboards',
    accent: '#f0b429',
    brief:
      'Four inverters are streaming live. One of them is lying to you — the status light is green and the numbers are not.',
    basedOn: 'Smart Inverters for Enterprisers — TypeScript, React, Node.js, Vercel',
    steps: [
      {
        id: 'read',
        speaker: 'Live Telemetry',
        role: 'Inverter array',
        line: 'INV-01 4.8kW · 41°C — INV-02 4.6kW · 43°C — INV-03 2.1kW · 68°C — INV-04 4.7kW · 40°C',
        question: 'All four report status OK. Which one do you trust least?',
        seconds: 24,
        choices: [
          {
            id: 'inv03',
            label: 'INV-03 — output halved, temperature 25° above the others',
            score: 3,
            best: true,
            verdict:
              'Found it. Status flags lie; trends do not. Half the output at a much higher temperature is a unit in trouble.',
          },
          {
            id: 'inv02',
            label: 'INV-02 — it has the lowest output of the healthy three',
            score: 0,
            verdict: 'Normal variance. 4.6 against 4.8 is shading or panel angle, not a fault.',
          },
          {
            id: 'none',
            label: 'None — every unit reports OK',
            score: -2,
            verdict:
              'This is exactly why the dashboard exists. A self-reported OK is not health; measured output is.',
          },
        ],
      },
      {
        id: 'alert',
        speaker: 'Site Manager',
        role: 'Operations',
        line: 'So what does the system actually do about it? I cannot watch a screen all day.',
        question: 'How should this surface next time?',
        seconds: 20,
        choices: [
          {
            id: 'threshold',
            label: 'Alert on the trend — sustained output drop against the array average',
            score: 3,
            best: true,
            verdict:
              'Comparing each unit against its peers catches degradation early and avoids alerting on a cloudy afternoon.',
          },
          {
            id: 'hardalert',
            label: 'Alert whenever output drops below a fixed number',
            score: 1,
            verdict:
              'It works until sunset. Fixed thresholds fire all evening and train people to ignore alerts.',
          },
          {
            id: 'email',
            label: 'Email a daily summary',
            score: -1,
            verdict: 'A unit can cook itself in a morning. Daily is not real-time.',
          },
        ],
      },
    ],
    closer:
      'One unit degrading quietly inside a healthy-looking array — caught by comparing live output against its peers instead of trusting a status flag.',
  },

  // ── 4. SECURITY ───────────────────────────────────────────
  {
    id: 'security',
    zone: 'secops',
    order: 4,
    title: 'The 4:52 Email',
    place: 'Security Operations',
    tag: 'Security awareness · Triage',
    accent: '#f87171',
    brief:
      'Three reports land in the same minute, right before end of day. Two are noise. One is real, and the clock matters.',
    basedOn: 'Cyber Security Smart IT Support — vulnerability quizzes & threat simulations',
    steps: [
      {
        id: 'triage',
        speaker: 'Reported Items',
        role: 'Security queue',
        line: 'A) "Printer is offline again."  B) "IT asked me to confirm my password at a link — payroll deadline, urgent."  C) "My screen resolution changed."',
        question: 'Which one do you take first?',
        seconds: 18,
        choices: [
          {
            id: 'b',
            label: 'B — credential request via link, with urgency pressure',
            score: 3,
            best: true,
            verdict:
              'Textbook phishing: authority, urgency, and a credential prompt off-platform. This one is time-critical.',
          },
          {
            id: 'a',
            label: 'A — the printer, it blocks work right now',
            score: -1,
            verdict: 'A printer costs an afternoon. Harvested credentials cost the domain.',
          },
          {
            id: 'c',
            label: 'C — display change could mean a compromised machine',
            score: 0,
            verdict: 'Worth a look eventually. It is not the one actively asking for a password.',
          },
        ],
      },
      {
        id: 'respond',
        speaker: 'Reporter',
        role: 'Finance team',
        line: 'I already clicked the link. I typed my password in. Did I break something?',
        question: 'First action?',
        seconds: 16,
        choices: [
          {
            id: 'reset',
            label: 'Reset the credentials, kill active sessions, then hunt for reuse',
            score: 3,
            best: true,
            verdict:
              'Contain first. Invalidate the credential and the live sessions, then look for where else it was used.',
          },
          {
            id: 'scan',
            label: 'Run a full antivirus scan on her laptop first',
            score: 0,
            verdict:
              'The credential already left the building. Scanning the endpoint does not close that door.',
          },
          {
            id: 'blame',
            label: 'File a policy violation against the user',
            score: -2,
            verdict:
              'Punish reporting and the next person stays quiet. She did the right thing by telling you.',
          },
        ],
      },
    ],
    closer:
      'Real security work is triage under time pressure — and keeping people willing to tell you when they slipped.',
  },

  // ── 5. CODE REVIEW ────────────────────────────────────────
  {
    id: 'review',
    zone: 'office2',
    order: 5,
    title: 'Query in a Loop',
    place: 'Code Review Room',
    tag: 'GlideRecord · Performance · Peer review',
    accent: '#60a5fa',
    brief:
      'A teammate opens a pull request. It works in dev with forty records. Production has ninety thousand.',
    basedOn: 'ServiceNow Developer Trainee — GlideRecord optimization, unit testing, peer code review',
    steps: [
      {
        id: 'spot',
        speaker: 'Rohit',
        role: 'Developer',
        line: 'It loops the incidents, then queries the user table inside the loop to get each manager.',
        question: 'What is the real problem here?',
        seconds: 22,
        choices: [
          {
            id: 'nplus1',
            label: 'A query inside the loop — one database round trip per record',
            score: 3,
            best: true,
            verdict:
              'That is the N+1. Forty records hides it; ninety thousand turns it into ninety thousand round trips.',
          },
          {
            id: 'style',
            label: 'Naming and formatting need cleanup',
            score: 0,
            verdict: 'True and irrelevant. Style will not save this at production volume.',
          },
          {
            id: 'fine',
            label: 'Nothing — the tests pass',
            score: -2,
            verdict:
              'Passing tests on forty records is not a performance guarantee. Volume is part of correctness.',
          },
        ],
      },
      {
        id: 'fix',
        speaker: 'You',
        role: 'Reviewer',
        line: 'How do you want it rewritten?',
        question: 'Pick the fix.',
        seconds: 20,
        choices: [
          {
            id: 'batch',
            label: 'One query with an encoded IN filter, cached in a map, plus setLimit',
            score: 3,
            best: true,
            verdict:
              'One round trip, a lookup map, and a bounded result set. This is the fix that survives production.',
          },
          {
            id: 'index',
            label: 'Leave the loop and ask the DBA for an index',
            score: 0,
            verdict:
              'An index makes each of the ninety thousand queries faster. There should not be ninety thousand queries.',
          },
          {
            id: 'async',
            label: 'Move the whole thing to a scheduled job overnight',
            score: 1,
            verdict:
              'Hides it rather than fixes it — and the users still need this data during the day.',
          },
        ],
      },
      {
        id: 'ship',
        speaker: 'Rohit',
        role: 'Developer',
        line: 'Fixed and pushed. Can I merge it?',
        question: 'Before this ships?',
        seconds: 16,
        choices: [
          {
            id: 'test',
            label: 'Add a unit test at realistic volume, then approve',
            score: 3,
            best: true,
            verdict:
              'A test that would have caught it is the only thing stopping it coming back next quarter.',
          },
          {
            id: 'merge',
            label: 'Approve it — you already reviewed the logic',
            score: 0,
            verdict: 'Reviewed once, unprotected forever. The next refactor reintroduces it.',
          },
        ],
      },
    ],
    closer:
      'Review is not about catching typos. It is about catching the thing that only appears at production scale.',
  },
]

export const totalBest = scenarios.reduce(
  (sum, s) => sum + s.steps.reduce((a, st) => a + Math.max(...st.choices.map((c) => c.score)), 0),
  0,
)

export const ranks = [
  { min: 0.0, title: 'Intern', note: 'You showed up. Everything after this is learnable.' },
  { min: 0.45, title: 'Junior Engineer', note: 'Solid instincts, a few expensive detours.' },
  { min: 0.62, title: 'Platform Developer', note: 'You fixed the process, not just the ticket.' },
  { min: 0.78, title: 'Systems Engineer', note: 'You thought in causes and consequences, under time pressure.' },
  { min: 0.92, title: 'Principal Engineer', note: 'Near-perfect judgement. Vamsi would like a word — about hiring you.' },
]
