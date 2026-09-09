import { HoloChip, FlowDiagram, ZoneTitle, NpcLine } from '../../components/widgets'
import { projects } from '../../data/resume'

const p = projects.find((x) => x.id === 'workflow-hub')!
const accent = '#62d84e'

export default function WorkflowHub() {
  return (
    <div>
      <div className="text-[10px] tracking-[0.4em] mb-2" style={{ color: accent }}>BUILDING 02 // {p.theme.toUpperCase()}</div>
      <h2 className="text-2xl md:text-4xl font-black tracking-wider text-white mb-6" style={{ textShadow: `0 0 16px ${accent}66` }}>
        {p.name.toUpperCase()}
      </h2>

      <div className="glass p-5 mb-8 max-w-3xl space-y-3">
        <NpcLine who="BRIEFING" text={p.story} accent={accent} />
        <NpcLine who="SYSTEM" text="CONNECTING EMPLOYEE OPERATIONS TO AUTOMATED WORKFLOWS..." accent="#4dd0ff" />
      </div>

      <div className="grid lg:grid-cols-2 gap-8 mb-10">
        <div>
          <ZoneTitle accent={accent}>WORKFLOW PIPELINE</ZoneTitle>
          <FlowDiagram nodes={p.flow} accent={accent} />
        </div>
        <div className="glass p-5 h-fit">
          <ZoneTitle accent={accent}>CAPABILITIES</ZoneTitle>
          <ul className="space-y-2 text-sm text-slate-200">
            {p.features.map((f) => (
              <li key={f} className="flex gap-2"><span style={{ color: accent }}>▸</span>{f}</li>
            ))}
          </ul>
        </div>
      </div>

      <ZoneTitle accent={accent}>TECH STACK</ZoneTitle>
      <div className="flex flex-wrap gap-3">
        {p.tech.map((t, i) => <HoloChip key={t} label={t} accent={accent} delay={i * 0.05} />)}
      </div>
    </div>
  )
}
