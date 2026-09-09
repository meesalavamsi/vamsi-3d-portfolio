import { useEffect, useMemo, useRef, useState } from 'react'
import {
  ArrowRight, Check, Copy, FileText, Gamepad2, Mail, Search,
} from 'lucide-react'
import { Github, Linkedin } from './BrandIcons'
import { identity, sections } from '../data/resume'

type Item = {
  id: string
  label: string
  hint: string
  icon: React.ReactNode
  run: () => void
}

export default function CommandPalette({
  open,
  onClose,
  onResume,
}: {
  open: boolean
  onClose: () => void
  onResume: () => void
}) {
  const [q, setQ] = useState('')
  const [cursor, setCursor] = useState(0)
  const [copied, setCopied] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const items = useMemo<Item[]>(() => {
    const jump: Item[] = sections.map((s) => ({
      id: `go-${s.id}`,
      label: s.label,
      hint: 'Jump to section',
      icon: <ArrowRight size={15} />,
      run: () => {
        document.getElementById(s.id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
        onClose()
      },
    }))

    return [
      ...jump,
      {
        id: 'play',
        label: 'Play “The First 90 Days”',
        hint: '3D simulator · 5 real scenarios',
        icon: <Gamepad2 size={15} />,
        run: () => {
          window.location.href = '/game'
        },
      },
      {
        id: 'resume',
        label: 'View traditional resume',
        hint: 'Printable · ATS friendly',
        icon: <FileText size={15} />,
        run: () => {
          onResume()
          onClose()
        },
      },
      {
        id: 'copy',
        label: 'Copy email address',
        hint: identity.email,
        icon: copied ? <Check size={15} /> : <Copy size={15} />,
        run: () => {
          navigator.clipboard?.writeText(identity.email)
          setCopied(true)
          setTimeout(() => setCopied(false), 1600)
        },
      },
      {
        id: 'mail',
        label: 'Send an email',
        hint: identity.email,
        icon: <Mail size={15} />,
        run: () => {
          window.location.href = `mailto:${identity.email}`
          onClose()
        },
      },
      {
        id: 'gh',
        label: 'Open GitHub',
        hint: identity.githubHandle,
        icon: <Github size={15} />,
        run: () => {
          window.open(identity.github, '_blank', 'noopener')
          onClose()
        },
      },
      {
        id: 'li',
        label: 'Open LinkedIn',
        hint: identity.linkedinHandle,
        icon: <Linkedin size={15} />,
        run: () => {
          window.open(identity.linkedin, '_blank', 'noopener')
          onClose()
        },
      },
    ]
  }, [onClose, onResume, copied])

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase()
    if (!s) return items
    return items.filter((i) => (i.label + ' ' + i.hint).toLowerCase().includes(s))
  }, [q, items])

  useEffect(() => {
    if (open) {
      setQ('')
      setCursor(0)
      setTimeout(() => inputRef.current?.focus(), 40)
    }
  }, [open])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowDown') {
        e.preventDefault()
        setCursor((c) => Math.min(c + 1, filtered.length - 1))
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault()
        setCursor((c) => Math.max(c - 1, 0))
      }
      if (e.key === 'Enter') {
        e.preventDefault()
        filtered[cursor]?.run()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, filtered, cursor, onClose])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-[85] flex items-start justify-center px-4 pt-[12vh] no-print" role="dialog" aria-modal="true" aria-label="Command menu">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />

      <div
        className="relative w-full max-w-lg overflow-hidden rounded-xl border border-[var(--color-line)] bg-[var(--color-ink-2)] shadow-2xl"
        style={{ animation: 'fade-up 0.24s cubic-bezier(0.2,0.8,0.2,1)' }}
      >
        <div className="flex items-center gap-3 border-b border-[var(--color-line)] px-4">
          <Search size={16} className="text-[var(--color-faint)]" />
          <input
            ref={inputRef}
            value={q}
            onChange={(e) => {
              setQ(e.target.value)
              setCursor(0)
            }}
            placeholder="Search sections, links, actions…"
            className="h-12 flex-1 bg-transparent text-[0.9rem] outline-none focus-visible:outline-none placeholder:text-[var(--color-faint)]"
          />
          <kbd className="t-mono rounded border border-[var(--color-line)] px-1.5 py-0.5 text-[0.65rem] text-[var(--color-faint)]">
            ESC
          </kbd>
        </div>

        <ul className="max-h-[52vh] overflow-y-auto p-2">
          {filtered.length === 0 && (
            <li className="px-3 py-6 text-center text-sm text-[var(--color-faint)]">No matches</li>
          )}
          {filtered.map((item, i) => (
            <li key={item.id}>
              <button
                onMouseEnter={() => setCursor(i)}
                onClick={item.run}
                className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors"
                style={{ background: cursor === i ? 'var(--color-ink-3)' : 'transparent' }}
              >
                <span className="text-[var(--color-gold)]">{item.icon}</span>
                <span className="flex-1 text-[0.875rem]">{item.label}</span>
                <span className="t-mono truncate text-[0.68rem] text-[var(--color-faint)]">{item.hint}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
