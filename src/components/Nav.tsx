import { useEffect, useState } from 'react'
import { Menu, X, Command, FileText } from 'lucide-react'
import { identity, sections } from '../data/resume'
import { useActiveSection, useScrollProgress } from '../lib/hooks'

const ids = sections.map((s) => s.id)

export default function Nav({
  onResume,
  onPalette,
}: {
  onResume: () => void
  onPalette: () => void
}) {
  const [open, setOpen] = useState(false)
  const [solid, setSolid] = useState(false)
  const active = useActiveSection(ids as unknown as string[])
  const progress = useScrollProgress()

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  return (
    <>
      <a
        href="#about"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[80] focus:rounded-md focus:bg-[var(--color-paper)] focus:px-4 focus:py-2 focus:text-sm focus:text-black"
      >
        Skip to content
      </a>

      <header
        className="fixed inset-x-0 top-0 z-50 no-print"
        style={{
          background: solid ? 'rgba(8,9,10,0.82)' : 'transparent',
          backdropFilter: solid ? 'blur(14px) saturate(140%)' : 'none',
          borderBottom: `1px solid ${solid ? 'var(--color-line)' : 'transparent'}`,
          transition: 'background 0.4s, border-color 0.4s, backdrop-filter 0.4s',
        }}
      >
        <div className="shell flex h-[4.25rem] items-center justify-between gap-6">
          {/* Wordmark */}
          <a href="#top" className="group flex items-center gap-2.5" aria-label="Back to top">
            <span className="grid size-8 place-items-center rounded-md border border-[var(--color-line)] bg-[var(--color-ink-2)] font-mono text-[0.8rem] font-medium text-[var(--color-gold)] transition-colors group-hover:border-[var(--color-gold)]">
              V
            </span>
            <span className="hidden text-[0.9rem] font-medium tracking-tight sm:block">
              {identity.name}
            </span>
          </a>

          {/* Desktop links */}
          <nav className="hidden items-center gap-1 md:flex" aria-label="Sections">
            {sections.map((s) => (
              <a
                key={s.id}
                href={`#${s.id}`}
                className="relative rounded-full px-3.5 py-2 text-[0.82rem] transition-colors"
                style={{
                  color: active === s.id ? 'var(--color-paper)' : 'var(--color-faint)',
                }}
              >
                {active === s.id && (
                  <span
                    className="absolute inset-0 rounded-full border border-[var(--color-line)] bg-[var(--color-ink-2)]"
                    aria-hidden
                  />
                )}
                <span className="relative">{s.label}</span>
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <button
              onClick={onPalette}
              className="hidden h-9 items-center gap-2 rounded-full border border-[var(--color-line)] px-3 text-[0.75rem] text-[var(--color-faint)] transition-colors hover:border-[#4a4f57] hover:text-[var(--color-paper)] lg:flex"
              aria-label="Open command menu"
            >
              <Command size={13} />
              <span className="font-mono">K</span>
            </button>

            <button onClick={onResume} className="btn btn-solid h-9 px-4 text-[0.8rem]">
              <FileText size={14} />
              Resume
            </button>

            <button
              onClick={() => setOpen(true)}
              className="grid size-9 place-items-center rounded-full border border-[var(--color-line)] text-[var(--color-paper)] md:hidden"
              aria-label="Open menu"
            >
              <Menu size={17} />
            </button>
          </div>
        </div>

        {/* Scroll progress */}
        <div className="h-px w-full bg-transparent">
          <div
            className="h-px bg-[var(--color-gold)]"
            style={{ width: `${progress * 100}%`, transition: 'width 0.1s linear' }}
          />
        </div>
      </header>

      {/* Mobile sheet */}
      <div
        className="fixed inset-0 z-[70] md:hidden no-print"
        style={{
          pointerEvents: open ? 'auto' : 'none',
          opacity: open ? 1 : 0,
          transition: 'opacity 0.3s ease',
        }}
      >
        <div className="absolute inset-0 bg-[rgba(8,9,10,0.96)] backdrop-blur-xl" onClick={() => setOpen(false)} />
        <div
          className="absolute inset-x-0 top-0 border-b border-[var(--color-line)] bg-[var(--color-ink)] px-6 pb-8 pt-5"
          style={{
            transform: open ? 'translateY(0)' : 'translateY(-14px)',
            transition: 'transform 0.35s cubic-bezier(0.2,0.8,0.2,1)',
          }}
        >
          <div className="flex items-center justify-between">
            <span className="t-eyebrow text-[var(--color-faint)]">Navigate</span>
            <button
              onClick={() => setOpen(false)}
              className="grid size-9 place-items-center rounded-full border border-[var(--color-line)]"
              aria-label="Close menu"
            >
              <X size={17} />
            </button>
          </div>

          <nav className="mt-6 flex flex-col">
            {sections.map((s, i) => (
              <a
                key={s.id}
                href={`#${s.id}`}
                onClick={() => setOpen(false)}
                className="flex items-baseline gap-4 border-b border-[var(--color-line)] py-4 last:border-0"
              >
                <span className="t-mono text-[var(--color-gold)]">{String(i + 1).padStart(2, '0')}</span>
                <span className="t-display text-2xl">{s.label}</span>
              </a>
            ))}
          </nav>

          <button
            onClick={() => {
              setOpen(false)
              onResume()
            }}
            className="btn btn-solid mt-6 w-full"
          >
            <FileText size={15} />
            View traditional resume
          </button>
        </div>
      </div>
    </>
  )
}
