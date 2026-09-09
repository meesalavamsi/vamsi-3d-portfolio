import { identity } from '../data/resume'

export default function Footer() {
  return (
    <footer className="border-t border-white/8 py-8">
      <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-3">
        <span className="font-mono text-xs tracking-[0.25em] text-slate-500">
          © {new Date().getFullYear()} {identity.name.toUpperCase()}
        </span>
        <span className="font-mono text-[10px] tracking-[0.25em] text-slate-600">
          DESIGNED & BUILT WITH REACT · THREE.JS · TAILWIND
        </span>
      </div>
    </footer>
  )
}
