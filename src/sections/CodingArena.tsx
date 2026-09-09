import { motion } from 'framer-motion'
import SectionShell from '../components/SectionShell'
import { ZoneTitle, HoloChip } from '../components/widgets'
import { codingProfiles } from '../data/resume'

const accent = '#34d399'

function XpBar({ label, value, delay }: { label: string; value: number; delay: number }) {
  const blocks = 18
  const filled = Math.round((value / 100) * blocks)
  return (
    <div className="mb-5">
      <div className="flex justify-between text-[11px] tracking-[0.25em] text-slate-300 mb-1.5">
        <span>{label}</span><span className="text-emerald-300">{value}</span>
      </div>
      <motion.div
        initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
        className="font-mono text-emerald-400 text-glow-green text-sm whitespace-nowrap overflow-hidden"
      >
        {Array.from({ length: blocks }).map((_, i) => (
          <motion.span
            key={i}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: delay + i * 0.035 }}
          >
            {i < filled ? '█' : '░'}
          </motion.span>
        ))}
      </motion.div>
    </div>
  )
}

export default function CodingArena() {
  return (
    <SectionShell id="arena" title="ALGORITHM ARENA" subtitle="Building applications is only one part of becoming a better engineer. Problem solving matters too." accent={accent}>
      <div className="grid lg:grid-cols-2 gap-10">
        <div>
          <ZoneTitle accent={accent}>COMPETITIVE PLATFORMS</ZoneTitle>
          <div className="grid gap-4 mb-10">
            {codingProfiles.platforms.map((pf, i) => (
              <motion.div
                key={pf}
                initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="holo-card p-5 flex items-center justify-between"
              >
                <div>
                  <div className="text-lg font-bold tracking-[0.2em] text-white">{pf.toUpperCase()}</div>
                  <div className="text-[10px] tracking-[0.25em] text-emerald-300/70 mt-1">{codingProfiles.title.toUpperCase()}</div>
                </div>
                <span className="text-2xl">{['⚔️', '🍳', '🥉'][i] ?? '💠'}</span>
              </motion.div>
            ))}
          </div>

          <ZoneTitle accent={accent}>CODE TERMINAL</ZoneTitle>
          <div className="terminal p-5 text-[13px] leading-6">
            <div><span className="prompt">$ </span>solve --daily</div>
            <div className="text-slate-300 pl-3">problem: two-sum-variant</div>
            <div className="text-slate-300 pl-3">approach: hash-map · O(n)</div>
            <div className="text-emerald-400 pl-3">✓ accepted — all test cases passed</div>
            <div><span className="prompt">$ </span>streak --show</div>
            <div className="text-slate-300 pl-3">consistency: <span className="text-emerald-300">ACTIVE</span></div>
            <div><span className="prompt">$ </span><span className="caret" /></div>
          </div>
        </div>

        <div>
          <ZoneTitle accent={accent}>ENGINEER LEVEL</ZoneTitle>
          <div className="glass p-6">
            <XpBar label="SYSTEM THINKING" value={82} delay={0} />
            <XpBar label="ALGORITHMS" value={78} delay={0.2} />
            <XpBar label="PROBLEM SOLVING" value={85} delay={0.4} />
            <XpBar label="DEBUGGING" value={80} delay={0.6} />
          </div>
          <div className="glass p-5 mt-6 text-xs text-slate-400 leading-relaxed tracking-wider">
            {codingProfiles.traits.map((t) => (
              <div key={t} className="flex gap-2 py-0.5"><span className="text-emerald-400">▸</span>{t}</div>
          ))}
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            <HoloChip label="Algorithm Puzzles" accent={accent} />
            <HoloChip label="Score System" accent={accent} />
            <HoloChip label="XP Progression" accent={accent} />
          </div>
        </div>
      </div>
    </SectionShell>
  )
}
