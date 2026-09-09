import { motion } from 'framer-motion'
import SectionShell from '../components/SectionShell'
import { ZoneTitle } from '../components/widgets'
import { certifications } from '../data/resume'
import { useGame } from '../store/gameStore'
import { sfx } from '../utils/sound'

export default function CertVault() {
  const unlocked = useGame((s) => s.unlockedCerts)
  const unlockCert = useGame((s) => s.unlockCert)
  const soundOn = useGame((s) => s.soundOn)
  const allOpen = unlocked.length >= certifications.length

  return (
    <SectionShell
      id="certs"
      title="CERTIFICATION VAULT"
      subtitle="Four verified credentials are sealed inside. Unlock each one."
      accent="#fbbf24"
      canComplete={allOpen}
      completeHint={`UNLOCK ALL 4 CERTIFICATIONS (${unlocked.length}/4)`}
    >
      <div className="grid sm:grid-cols-2 gap-6 max-w-4xl">
        {certifications.map((c, i) => {
          const open = unlocked.includes(c.id)
          return (
            <motion.button
              key={c.id}
              initial={{ opacity: 0, rotateY: -30 }}
              whileInView={{ opacity: 1, rotateY: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              onClick={() => { if (!open) { unlockCert(c.id); if (soundOn) sfx.achievement() } }}
              className={`relative p-[1px] text-left transition-transform ${open ? '' : 'hover:scale-[1.02] cursor-pointer'}`}
              style={{ background: open ? `linear-gradient(135deg, ${c.color}, transparent 60%)` : 'rgba(120,130,160,0.25)' }}
            >
              <div className={`p-6 h-full ${open ? 'bg-[#0a0f1e]' : 'bg-[#0a0f1e]/95'}`}>
                {!open ? (
                  <div className="flex flex-col items-center py-8 text-center">
                    <span className="text-4xl mb-3">🔒</span>
                    <span className="text-[10px] tracking-[0.3em] text-slate-500">SEALED — CLICK TO VERIFY</span>
                  </div>
                ) : (
                  <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
                    <div className="flex items-start justify-between">
                      <span className="text-3xl">🏆</span>
                      <span className="text-[10px] tracking-[0.25em] px-2 py-1 border" style={{ color: c.color, borderColor: `${c.color}66` }}>
                        CERTIFICATION VERIFIED ✓
                      </span>
                    </div>
                    <div className="mt-4 text-xl font-black tracking-wider" style={{ color: c.color, textShadow: `0 0 14px ${c.color}66` }}>
                      {c.short}
                    </div>
                    <div className="text-sm text-slate-200 mt-1 tracking-wider">{c.name}</div>
                  </motion.div>
                )}
              </div>
            </motion.button>
          )
        })}
      </div>
      {allOpen && (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mt-10 glass-strong p-5 max-w-xl text-center">
          <span className="text-amber-300 text-glow tracking-[0.3em] text-sm">VAULT FULLY UNLOCKED ✓</span>
        </motion.div>
      )}
    </SectionShell>
  )
}
