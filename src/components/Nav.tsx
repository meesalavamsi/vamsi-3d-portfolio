import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { FileText, Menu, X } from 'lucide-react'

const links = [
  { href: '#about', label: 'About' },
  { href: '#experience', label: 'Experience' },
  { href: '#projects', label: 'Projects' },
  { href: '#skills', label: 'Skills' },
  { href: '#contact', label: 'Contact' },
]

export default function Nav({ onResume }: { onResume: () => void }) {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <motion.header
      initial={{ y: -70, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 1.6, duration: 0.6 }}
      className={`fixed top-0 inset-x-0 z-50 transition-all ${scrolled ? 'glass py-3' : 'py-5'}`}
    >
      <nav className="max-w-6xl mx-auto px-6 flex items-center justify-between">
        <a href="#top" className="font-mono font-bold tracking-[0.2em] text-white text-sm">
          VM<span className="text-cyan-400">.</span>DEV
        </a>
        <div className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <a key={l.href} href={l.href} className="nav-link text-sm text-slate-400">{l.label}</a>
          ))}
          <button onClick={onResume} className="btn-ghost !py-2 !px-4 text-xs font-mono tracking-widest">
            <FileText size={13} /> RESUME
          </button>
        </div>
        <button className="md:hidden text-slate-300" onClick={() => setOpen(!open)} aria-label="Menu">
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>
      {open && (
        <div className="md:hidden glass mt-2 mx-4 rounded-xl p-4 flex flex-col gap-4">
          {links.map((l) => (
            <a key={l.href} href={l.href} onClick={() => setOpen(false)} className="text-sm text-slate-300">{l.label}</a>
          ))}
          <button onClick={() => { setOpen(false); onResume() }} className="btn-ghost !py-2 text-xs font-mono tracking-widest justify-center">
            <FileText size={13} /> RESUME
          </button>
        </div>
      )}
    </motion.header>
  )
}
