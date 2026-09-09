import { ArrowUp } from 'lucide-react'
import { identity } from '../data/resume'

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="hairline-t no-print">
      <div className="shell flex flex-col gap-6 py-10 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="text-[0.9rem] font-medium">{identity.name}</div>
          <p className="t-mono mt-1 text-[0.66rem] text-[var(--color-faint)]">
            {identity.title} · © {year}
          </p>
        </div>

        <div className="flex items-center gap-6">
          <p className="t-mono hidden text-[0.66rem] text-[var(--color-faint)] sm:block">
            Built with React · TypeScript · Three.js
          </p>
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="group flex items-center gap-2 text-[0.78rem] text-[var(--color-muted)] transition-colors hover:text-[var(--color-paper)]"
          >
            Back to top
            <span className="grid size-8 place-items-center rounded-full border border-[var(--color-line)] transition-colors group-hover:border-[var(--color-gold)]">
              <ArrowUp size={13} />
            </span>
          </button>
        </div>
      </div>
    </footer>
  )
}
