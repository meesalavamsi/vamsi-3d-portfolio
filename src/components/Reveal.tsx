import { motion } from 'framer-motion'
import type { ReactNode } from 'react'

export default function Reveal({ children, delay = 0, className = '' }: { children: ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

export function SectionHead({ index, label, title }: { index: string; label: string; title: string }) {
  return (
    <Reveal className="mb-12 md:mb-16">
      <div className="section-label mb-3">{index} — {label}</div>
      <h2 className="text-3xl md:text-5xl font-black tracking-tight text-white">{title}</h2>
      <div className="hline mt-6 w-24" />
    </Reveal>
  )
}
