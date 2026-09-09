import { useEffect, useRef, useState, lazy, Suspense } from 'react'
import { motion } from 'framer-motion'
import { Mail, FileText, ArrowDown, MapPin } from 'lucide-react'
import { chapters, scrollState, STEP } from './world'
import { identity, skillGroups, projects, experience, certifications, coding } from '../data/resume'
import { GithubIcon, LinkedinIcon } from '../components/BrandIcons'

const JourneyWorld = lazy(() => import('./JourneyWorld'))

/* ── data cards per chapter ────────────────────────────── */
function ChapterExtra({ id }: { id: string }) {
  if (id === 'university')
    return (
      <div className="mt-5 flex flex-wrap gap-2">
        {['Data Structures', 'Algorithms', 'Operating Systems', 'DBMS', 'Networks', 'CGPA 8.63 / 10'].map((t) => (
          <span key={t} className="font-mono text-[10px] tracking-wider px-3 py-1.5 rounded-full border border-amber-900/20 bg-amber-950/30 text-amber-200">{t}</span>
        ))}
      </div>
    )
  if (id === 'forest')
    return (
      <div className="mt-5 flex flex-wrap gap-2">
        {skillGroups.flatMap((g) => g.skills.slice(0, 4)).map((t) => (
          <span key={t} className="font-mono text-[10px] tracking-wider px-3 py-1.5 rounded-full border border-emerald-900/30 bg-emerald-950/40 text-emerald-200">{t}</span>
        ))}
      </div>
    )
  if (id === 'city')
    return (
      <div className="mt-5 grid gap-2">
        {projects.map((p) => (
          <div key={p.id} className="flex items-center gap-3 text-left">
            <span className="text-lg">{p.icon}</span>
            <div>
              <div className="text-sm font-semibold text-white">{p.name}</div>
              <div className="font-mono text-[10px] text-slate-400">{p.tech.join(' · ')}</div>
            </div>
          </div>
        ))}
      </div>
    )
  if (id === 'towers')
    return (
      <div className="mt-5 grid sm:grid-cols-2 gap-3">
        {experience.map((e) => (
          <div key={e.id} className="rounded-xl border border-white/10 bg-white/5 p-4 text-left">
            <div className="text-sm font-bold text-white">{e.role}</div>
            <div className="font-mono text-[10px] text-emerald-300 mt-0.5">{e.org} · {e.period}</div>
          </div>
        ))}
        <div className="rounded-xl border border-emerald-400/30 bg-emerald-400/10 p-4 text-left">
          <div className="text-2xl font-black text-emerald-300">+25%</div>
          <div className="font-mono text-[10px] text-emerald-200/70">SLA COMPLIANCE IMPROVEMENT</div>
        </div>
        <div className="rounded-xl border border-emerald-400/30 bg-emerald-400/10 p-4 text-left">
          <div className="text-2xl font-black text-emerald-300">500+</div>
          <div className="font-mono text-[10px] text-emerald-200/70">MONTHLY REQUESTS AUTOMATED</div>
        </div>
      </div>
    )
  if (id === 'horizon')
    return (
      <div className="mt-6">
        <div className="flex flex-wrap gap-2 mb-6">
          {certifications.map((c) => (
            <span key={c.short} className="font-mono text-[10px] tracking-wider px-3 py-1.5 rounded-full border" style={{ borderColor: `${c.color}55`, color: c.color, background: `${c.color}11` }}>
              ✓ {c.short}
            </span>
          ))}
        </div>
        <div className="font-mono text-[11px] text-slate-400 mb-5">ALSO WALKING DAILY: {coding.platforms.join(' · ')}</div>
        <div className="flex flex-wrap gap-3">
          <a href={`mailto:${identity.email}`} className="btn-primary !text-sm"><Mail size={15} /> {identity.email}</a>
          <a href={identity.linkedin} target="_blank" rel="noreferrer" className="btn-ghost !text-sm"><LinkedinIcon size={15} /> LinkedIn</a>
          <a href={identity.github} target="_blank" rel="noreferrer" className="btn-ghost !text-sm"><GithubIcon size={15} /> GitHub</a>
        </div>
      </div>
    )
  return null
}

/* ── main journey ──────────────────────────────────────── */
export default function Journey({ onResume }: { onResume: () => void }) {
  const trackRef = useRef<HTMLDivElement>(null)
  const [p, setP] = useState(0)
  const reduced = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

  useEffect(() => {
    const onScroll = () => {
      const el = trackRef.current
      if (!el) return
      const total = el.scrollHeight - window.innerHeight
      const prog = Math.min(1, Math.max(0, -el.getBoundingClientRect().top / total))
      scrollState.p = prog
      setP(prog)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const currentChapter = Math.min(chapters.length - 1, Math.round(p * (chapters.length - 1)))

  return (
    <div ref={trackRef} style={{ height: `${chapters.length * 160 + 100}vh` }} className="relative">
      {/* fixed 3D world */}
      <div className="fixed inset-0 z-0">
        {!reduced ? (
          <Suspense fallback={<div className="w-full h-full bg-[#2b1a3a]" />}>
            <JourneyWorld />
          </Suspense>
        ) : (
          <div className="w-full h-full bg-gradient-to-b from-[#2b1a3a] to-[#87ceeb]" />
        )}
      </div>

      {/* header */}
      <header className="fixed top-0 inset-x-0 z-40 px-6 py-4 flex items-center justify-between bg-gradient-to-b from-black/30 to-transparent">
        <div className="font-mono text-xs tracking-[0.25em] text-white/90 drop-shadow">THE JOURNEY OF <span className="font-bold">VAMSI MEESALA</span></div>
        <button onClick={onResume} className="btn-ghost !py-2 !px-4 text-[11px] font-mono tracking-widest bg-black/30">
          <FileText size={13} /> RESUME
        </button>
      </header>

      {/* progress rail */}
      <div className="fixed right-4 top-1/2 -translate-y-1/2 z-40 hidden md:flex flex-col items-center gap-2">
        {chapters.map((c, i) => (
          <div key={c.id} className={`w-1.5 rounded-full transition-all ${i === currentChapter ? 'h-8 bg-white' : 'h-1.5 bg-white/40'}`} />
        ))}
      </div>

      {/* scroll panels */}
      <div className="relative z-10">
        {/* intro */}
        <section className="h-screen flex flex-col items-center justify-center text-center px-6">
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="font-mono text-[11px] tracking-[0.5em] text-white/70 mb-5">
            THIS IS NOT A RESUME.
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6, duration: 0.9 }}
            className="text-5xl md:text-8xl font-black text-white leading-[1.02] drop-shadow-2xl"
          >
            THE JOURNEY OF<br />VAMSI MEESALA
          </motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.1 }} className="mt-6 text-white/80 max-w-md text-sm md:text-base leading-relaxed">
            A story about a boy, a computer, and everything he built after.
            Scroll to walk with him.
          </motion.p>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.6 }} className="mt-12 text-white/70 flex flex-col items-center gap-2 floaty">
            <span className="font-mono text-[10px] tracking-[0.4em]">SCROLL TO BEGIN</span>
            <ArrowDown size={18} />
          </motion.div>
        </section>

        {chapters.map((c, i) => (
          <section key={c.id} className="min-h-[160vh] flex items-center px-6">
            <motion.div
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, margin: '-25% 0px -25% 0px' }}
              transition={{ duration: 0.8 }}
              className={`max-w-md w-full ${i % 2 ? 'ml-auto' : ''} rounded-2xl border border-white/12 bg-black/45 backdrop-blur-md p-7 shadow-2xl`}
            >
              <div className="font-mono text-[10px] tracking-[0.4em] text-amber-300/90 mb-3 flex items-center gap-2">
                <MapPin size={11} /> {c.kicker}
              </div>
              <h2 className="text-2xl md:text-3xl font-black text-white leading-tight mb-4">{c.title}</h2>
              {c.text.map((t, j) => (
                <p key={j} className="text-slate-300 text-sm md:text-[15px] leading-relaxed mb-2.5">{t}</p>
              ))}
              <ChapterExtra id={c.id} />
            </motion.div>
          </section>
        ))}

        {/* outro */}
        <section className="min-h-screen flex items-center justify-center text-center px-6">
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
            <div className="font-mono text-[10px] tracking-[0.5em] text-white/60 mb-6">THE STORY CONTINUES</div>
            <h2 className="text-4xl md:text-7xl font-black text-white leading-tight drop-shadow-2xl">
              The next chapter<br />could be yours.
            </h2>
            <p className="mt-6 text-white/75 max-w-md mx-auto text-sm md:text-base leading-relaxed">
              Vamsi is looking for internships and junior engineering roles — backend, full-stack, or enterprise systems.
            </p>
            <div className="mt-9 flex flex-wrap justify-center gap-4">
              <a href={`mailto:${identity.email}`} className="btn-primary"><Mail size={15} /> Start the conversation</a>
              <button onClick={onResume} className="btn-ghost bg-black/40"><FileText size={15} /> Read the resume</button>
            </div>
            <div className="mt-14 font-mono text-[10px] tracking-[0.3em] text-white/40">
              © {new Date().getFullYear()} VAMSI MEESALA · EVERY STEP OF THIS WORLD WAS BUILT WITH CODE
            </div>
          </motion.div>
        </section>
      </div>
    </div>
  )
}
