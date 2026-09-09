import { motion } from 'framer-motion'
import SectionShell from '../components/SectionShell'
import { ZoneTitle, StatCounter, HoloChip, FlowDiagram, NpcLine } from '../components/widgets'
import { experience } from '../data/resume'

export default function ServiceNowHQ() {
  const [exp1, exp2] = experience

  return (
    <SectionShell id="servicenow" title="SERVICENOW HQ" subtitle="Enterprise Automation — the biggest tower on the map." accent="#62d84e">
      {/* ── Floor 1 ─────────────────────────── */}
      <div className="glass p-6 md:p-8 mb-12 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent" />
        <div className="text-[10px] tracking-[0.4em] text-emerald-400 mb-2">FLOOR 01 // EXPERIENCE 1</div>
        <h2 className="text-2xl md:text-3xl font-black tracking-wider text-white">{exp1.role.toUpperCase()}</h2>
        <div className="text-emerald-300 tracking-widest text-sm mt-1">{exp1.org} · {exp1.period}</div>

        <div className="mt-6 glass-strong p-5 border-l-2 border-emerald-400">
          <div className="text-[10px] tracking-[0.3em] text-emerald-300 mb-3">📋 MISSION BRIEFING — {exp1.mission}</div>
          <div className="space-y-3">
            <NpcLine who="NPC" text="Vamsi, we have 500+ requests every month." accent="#f472b6" />
            <NpcLine who="VAMSI" text="Then let's automate the workflow." accent="#4dd0ff" />
            <NpcLine who="SYSTEM" text="WORKFLOW AUTOMATION INITIALIZED." accent="#62d84e" />
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-6 mt-8 max-w-xl">
          {exp1.stats.map((st) => (
            <StatCounter key={st.label} value={st.value} suffix={st.suffix} label={st.label} accent="#62d84e" />
          ))}
        </div>

        <div className="mt-8">
          <ZoneTitle accent="#62d84e">TECHNOLOGIES DEPLOYED</ZoneTitle>
          <div className="flex flex-wrap gap-3">
            {exp1.tech.map((t, i) => <HoloChip key={t} label={t} accent="#62d84e" delay={i * 0.05} />)}
          </div>
        </div>

        <div className="mt-10">
          <ZoneTitle accent="#62d84e">THE AUTOMATION PIPELINE — CLICK EACH NODE</ZoneTitle>
          <FlowDiagram nodes={exp1.workflow} accent="#62d84e" interactive />
        </div>
      </div>

      {/* ── Floor 2 ─────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-60px' }}
        className="glass p-6 md:p-8 relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent" />
        <div className="text-[10px] tracking-[0.4em] text-cyan-400 mb-2">FLOOR 02 // EXPERIENCE 2</div>
        <h2 className="text-2xl md:text-3xl font-black tracking-wider text-white">{exp2.role.toUpperCase()}</h2>
        <div className="text-cyan-300 tracking-widest text-sm mt-1">{exp2.org} · {exp2.period}</div>

        <div className="mt-6 glass-strong p-5 border-l-2 border-cyan-400">
          <div className="text-[10px] tracking-[0.3em] text-cyan-300 mb-3">📋 MISSION — {exp2.mission}</div>
          <NpcLine who="STORY" text={exp2.briefing} accent="#22d3ee" />
        </div>

        <div className="mt-6 grid md:grid-cols-2 gap-3 max-w-3xl">
          {exp2.bullets!.map((b, i) => (
            <motion.div
              key={b}
              initial={{ opacity: 0, x: -14 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
              className="holo-card px-4 py-3 text-sm text-slate-200 flex gap-3 items-center"
            >
              <span className="text-cyan-400">▸</span> {b}
            </motion.div>
          ))}
        </div>

        <div className="mt-8">
          <ZoneTitle accent="#22d3ee">TOOLKIT</ZoneTitle>
          <div className="flex flex-wrap gap-3">
            {exp2.tech.map((t, i) => <HoloChip key={t} label={t} accent="#22d3ee" delay={i * 0.05} />)}
          </div>
        </div>

        <div className="mt-10">
          <ZoneTitle accent="#22d3ee">DATA FLOW — CLICK EACH NODE</ZoneTitle>
          <FlowDiagram nodes={exp2.workflow} accent="#22d3ee" interactive />
        </div>
      </motion.div>
    </SectionShell>
  )
}
