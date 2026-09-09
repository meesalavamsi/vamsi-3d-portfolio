import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import { ArrowDown, Mail, FileText } from 'lucide-react'
import { identity, stats } from '../data/resume'
import { GithubIcon, LinkedinIcon } from './BrandIcons'

const HeroScene = lazy(() => import('../three/HeroScene'))

function Stat({ value, suffix, label, decimals = 0 }: { value: number; suffix: string; label: string; decimals?: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-30px' })
  const [n, setN] = useState(0)

  useEffect(() => {
    if (!inView) return
    const start = performance.now()
    let raf = 0
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / 1400)
      setN(value * (1 - Math.pow(1 - p, 3)))
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [inView, value])

  return (
    <div ref={ref}>
      <div className="text-2xl md:text-4xl font-black text-white">
        {n.toFixed(decimals)}<span className="grad-text">{suffix}</span>
      </div>
      <div className="text-[10px] md:text-xs tracking-[0.18em] text-slate-500 mt-1 uppercase">{label}</div>
    </div>
  )
}

export default function Hero({ onResume }: { onResume: () => void }) {
  return (
    <section id="top" className="relative min-h-screen flex flex-col justify-center overflow-hidden">
      <Suspense fallback={null}><HeroScene /></Suspense>
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#05060e] pointer-events-none" />

      <div className="relative z-10 max-w-6xl mx-auto px-6 w-full pt-28 pb-16">
        <motion.p
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.7 }}
          className="section-label mb-6 flex items-center gap-3"
        >
          <span className="w-2 h-2 rounded-full bg-emerald-400 pulse-dot" />
          AVAILABLE FOR OPPORTUNITIES
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.85, duration: 0.8 }}
          className="text-[13vw] md:text-[7.5rem] leading-[0.95] font-black tracking-tight text-white"
        >
          {identity.first}
          <br />
          <span className="grad-text">{identity.last}</span>
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 2.05, duration: 0.7 }}
          className="mt-6 max-w-xl"
        >
          <p className="font-mono text-xs md:text-sm tracking-[0.3em] text-cyan-300/90 mb-4">{identity.headline.toUpperCase()}</p>
          <p className="text-slate-400 text-base md:text-lg leading-relaxed">{identity.pitch}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 2.25, duration: 0.7 }}
          className="mt-9 flex flex-wrap items-center gap-4"
        >
          <a href="#projects" className="btn-primary">View My Work <ArrowDown size={15} /></a>
          <button onClick={onResume} className="btn-ghost"><FileText size={15} /> Resume</button>
          <div className="flex gap-2 ml-1">
            <a href={identity.github} target="_blank" rel="noreferrer" aria-label="GitHub" className="btn-ghost !p-3 !rounded-full"><GithubIcon size={17} /></a>
            <a href={identity.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn" className="btn-ghost !p-3 !rounded-full"><LinkedinIcon size={17} /></a>
            <a href={`mailto:${identity.email}`} aria-label="Email" className="btn-ghost !p-3 !rounded-full"><Mail size={17} /></a>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.6, duration: 0.9 }}
          className="mt-16 md:mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 border-t border-white/10 pt-8"
        >
          {stats.map((s) => <Stat key={s.label} {...s} />)}
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 3 }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 text-slate-500 floaty"
      >
        <ArrowDown size={18} />
      </motion.div>
    </section>
  )
}
