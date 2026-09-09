import { useInView } from '../lib/hooks'

/** Hand-built SVG diagrams — one per project. No images, no 3D, ~1KB each. */

function Energy({ accent, on }: { accent: string; on: boolean }) {
  const bars = [38, 62, 45, 78, 55, 88, 66, 92, 71, 58, 83, 49]
  return (
    <svg viewBox="0 0 320 200" className="h-full w-full" role="img" aria-label="Energy monitoring dashboard">
      <g opacity="0.14" stroke="#fff" strokeWidth="0.5">
        {[40, 80, 120, 160].map((y) => <line key={y} x1="18" y1={y} x2="302" y2={y} />)}
      </g>
      {/* live area line */}
      <polyline
        fill="none" stroke={accent} strokeWidth="1.6" strokeLinecap="round"
        points={bars.map((b, i) => `${24 + i * 25},${172 - b * 1.3}`).join(' ')}
        style={{
          strokeDasharray: 700, strokeDashoffset: on ? 0 : 700,
          transition: 'stroke-dashoffset 1.8s cubic-bezier(0.2,0.8,0.2,1) 0.2s',
        }}
      />
      {bars.map((b, i) => (
        <g key={i}>
          <rect
            x={19 + i * 25} y={172 - b * 1.3} width="10" rx="2"
            height={on ? b * 1.3 : 0} fill={accent} opacity="0.16"
            style={{ transition: `height 0.9s cubic-bezier(0.2,0.8,0.2,1) ${i * 55}ms, y 0.9s cubic-bezier(0.2,0.8,0.2,1) ${i * 55}ms` }}
          />
          <circle cx={24 + i * 25} cy={172 - b * 1.3} r="2" fill={accent}
            opacity={on ? 1 : 0} style={{ transition: `opacity 0.4s ease ${600 + i * 55}ms` }} />
        </g>
      ))}
      <line x1="18" y1="172" x2="302" y2="172" stroke="#fff" strokeWidth="0.6" opacity="0.28" />
      {/* status row */}
      <g fontFamily="monospace" fontSize="7.5" opacity="0.75">
        <circle cx="24" cy="22" r="3" fill="#4ade80" />
        <text x="33" y="25" fill="#e9e6df">INVERTER ARRAY · ONLINE</text>
        <text x="232" y="25" fill={accent}>▲ LIVE</text>
      </g>
    </svg>
  )
}

function Flow({ accent, on }: { accent: string; on: boolean }) {
  const nodes = ['Employee', 'ServiceNow', 'Workflow', 'Node.js', 'REST API']
  return (
    <svg viewBox="0 0 320 200" className="h-full w-full" role="img" aria-label="Enterprise workflow pipeline">
      {nodes.map((n, i) => {
        const y = 24 + i * 36
        return (
          <g key={n} opacity={on ? 1 : 0} style={{ transition: `opacity 0.5s ease ${i * 130}ms` }}>
            <rect x="70" y={y} width="180" height="24" rx="5" fill="#15171a" stroke={i === 2 ? accent : '#2c3037'} strokeWidth="1" />
            <text x="84" y={y + 16} fontFamily="monospace" fontSize="9" fill={i === 2 ? accent : '#c5c9d0'}>{n}</text>
            <text x="238" y={y + 16} fontFamily="monospace" fontSize="8" fill="#6b6f77" textAnchor="end">
              {String(i + 1).padStart(2, '0')}
            </text>
            {i < nodes.length - 1 && (
              <>
                <line x1="160" y1={y + 24} x2="160" y2={y + 36} stroke="#2c3037" strokeWidth="1" />
                <circle r="2.4" fill={accent}>
                  <animate attributeName="cy" values={`${y + 24};${y + 36}`} dur="1.1s" begin={`${i * 0.28}s`} repeatCount="indefinite" />
                  <animate attributeName="cx" values="160;160" dur="1.1s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0;1;0" dur="1.1s" begin={`${i * 0.28}s`} repeatCount="indefinite" />
                </circle>
              </>
            )}
          </g>
        )
      })}
    </svg>
  )
}

function Shield({ accent, on }: { accent: string; on: boolean }) {
  const rows = [
    ['VAMSI', '980'],
    ['PLAYER 02', '820'],
    ['PLAYER 03', '760'],
  ]
  return (
    <svg viewBox="0 0 320 200" className="h-full w-full" role="img" aria-label="Security training leaderboard">
      <g transform="translate(28,34)">
        <path
          d="M40 0 L78 14 V52 C78 76 62 94 40 104 C18 94 2 76 2 52 V14 Z"
          fill="none" stroke={accent} strokeWidth="1.6"
          style={{ strokeDasharray: 340, strokeDashoffset: on ? 0 : 340, transition: 'stroke-dashoffset 1.5s ease 0.2s' }}
        />
        <path d="M40 0 L78 14 V52 C78 76 62 94 40 104 C18 94 2 76 2 52 V14 Z" fill={accent} opacity="0.07" />
        <path
          d="M24 50 L36 63 L58 40" fill="none" stroke={accent} strokeWidth="2.4" strokeLinecap="round"
          style={{ strokeDasharray: 60, strokeDashoffset: on ? 0 : 60, transition: 'stroke-dashoffset 0.6s ease 1.4s' }}
        />
        <line x1="2" y1="30" x2="78" y2="30" stroke={accent} strokeWidth="0.8" opacity="0.5">
          <animate attributeName="y1" values="12;96;12" dur="3.4s" repeatCount="indefinite" />
          <animate attributeName="y2" values="12;96;12" dur="3.4s" repeatCount="indefinite" />
        </line>
      </g>
      <g transform="translate(150,34)" fontFamily="monospace">
        <text x="0" y="8" fontSize="8" fill="#6b6f77" letterSpacing="1.4">CYBER ARENA</text>
        <line x1="0" y1="16" x2="140" y2="16" stroke="#2c3037" />
        {rows.map((r, i) => (
          <g key={r[0]} opacity={on ? 1 : 0} style={{ transition: `opacity 0.5s ease ${900 + i * 200}ms` }}>
            <text x="0" y={34 + i * 20} fontSize="9" fill={i === 0 ? accent : '#c5c9d0'}>{r[0]}</text>
            <text x="140" y={34 + i * 20} fontSize="9" fill={i === 0 ? accent : '#8b9098'} textAnchor="end">{r[1]}</text>
          </g>
        ))}
        <line x1="0" y1="96" x2="140" y2="96" stroke="#2c3037" />
        <text x="0" y="112" fontSize="7.5" fill="#6b6f77">THREAT SIMULATION · TIMED</text>
      </g>
    </svg>
  )
}

function Itsm({ accent, on }: { accent: string; on: boolean }) {
  const steps = [
    { t: 'INCIDENT', d: 'Wi-Fi not connecting' },
    { t: 'PROBLEM', d: 'Root cause analysis' },
    { t: 'CHANGE', d: 'Controlled fix rollout' },
  ]
  return (
    <svg viewBox="0 0 320 200" className="h-full w-full" role="img" aria-label="ITSM lifecycle">
      {steps.map((s, i) => {
        const x = 22 + i * 96
        return (
          <g key={s.t} opacity={on ? 1 : 0} style={{ transition: `opacity 0.55s ease ${i * 260}ms` }}>
            <rect x={x} y="58" width="82" height="62" rx="6" fill="#15171a" stroke={accent} strokeWidth="1" opacity="0.9" />
            <circle cx={x + 41} cy="46" r="9" fill="#0e0f11" stroke={accent} strokeWidth="1" />
            <text x={x + 41} y="50" fontFamily="monospace" fontSize="9" fill={accent} textAnchor="middle">{i + 1}</text>
            <text x={x + 41} y="82" fontFamily="monospace" fontSize="8.5" fill={accent} textAnchor="middle" letterSpacing="0.8">{s.t}</text>
            <foreignObject x={x + 6} y="88" width="70" height="30">
              <div style={{ fontFamily: 'monospace', fontSize: '6.6px', color: '#8b9098', lineHeight: 1.4, textAlign: 'center' }}>
                {s.d}
              </div>
            </foreignObject>
            {i < steps.length - 1 && (
              <g>
                <line x1={x + 82} y1="89" x2={x + 96} y2="89" stroke="#2c3037" strokeWidth="1" />
                <polygon points={`${x + 96},89 ${x + 91},86.5 ${x + 91},91.5`} fill={accent} opacity="0.8" />
              </g>
            )}
          </g>
        )
      })}
      <g fontFamily="monospace" fontSize="7.5" fill="#6b6f77">
        <text x="22" y="24">SERVICE CATALOG · VISUAL TASK BOARDS</text>
        <line x1="22" y1="32" x2="298" y2="32" stroke="#2c3037" />
        <text x="22" y="150">STATE MACHINE · SLA TRACKED</text>
      </g>
    </svg>
  )
}

const registry = { energy: Energy, flow: Flow, shield: Shield, itsm: Itsm }

export default function ProjectVisual({ kind, accent }: { kind: string; accent: string }) {
  const { ref, seen } = useInView<HTMLDivElement>('0px')
  const Cmp = registry[kind as keyof typeof registry] ?? Energy

  return (
    <div
      ref={ref}
      className="relative aspect-[16/10] w-full overflow-hidden rounded-xl border border-[var(--color-line)] bg-[var(--color-ink-2)]"
    >
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.35]"
        style={{
          background: `radial-gradient(70% 70% at 78% 8%, ${accent}22 0%, transparent 62%)`,
        }}
      />
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.55]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.028) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.028) 1px, transparent 1px)',
          backgroundSize: '28px 28px',
        }}
      />
      <div className="relative h-full w-full p-4 md:p-6">
        <Cmp accent={accent} on={seen} />
      </div>
    </div>
  )
}
