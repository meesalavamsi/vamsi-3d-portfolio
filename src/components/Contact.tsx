import { useState } from 'react'
import { ArrowUpRight, Check, Copy, FileText, Mail } from 'lucide-react'
import { Github, Linkedin } from './BrandIcons'
import { identity } from '../data/resume'
import Reveal from './Reveal'
import SectionHeader from './SectionHeader'

export default function Contact({ onResume }: { onResume: () => void }) {
  const [copied, setCopied] = useState(false)

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(identity.email)
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    } catch {
      window.location.href = `mailto:${identity.email}`
    }
  }

  const links = [
    { label: 'GitHub', handle: identity.githubHandle, href: identity.github, Icon: Github },
    { label: 'LinkedIn', handle: identity.linkedinHandle, href: identity.linkedin, Icon: Linkedin },
  ]

  return (
    <section id="contact" className="relative scroll-mt-24 overflow-hidden py-24 md:py-32">
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-[-16rem] left-1/2 h-[36rem] w-[64rem] -translate-x-1/2"
        style={{
          background:
            'radial-gradient(50% 50% at 50% 50%, rgba(240,180,41,0.11) 0%, transparent 68%)',
        }}
      />

      <div className="shell relative">
        <SectionHeader index="06" label="Contact" title="Let's build" serifWord="something real" />

        <Reveal delay={140}>
          <p className="t-body mt-6 max-w-xl">
            I'm looking for software engineering roles and internships where I can work on backend
            systems, automation and platforms that matter. If that sounds like your team, I'd love to talk.
          </p>
        </Reveal>

        {/* email */}
        <Reveal delay={200}>
          <div className="mt-12 border-y border-[var(--color-line)] py-8">
            <span className="t-eyebrow text-[var(--color-faint)]">Email</span>
            <div className="mt-3 flex flex-wrap items-center gap-x-6 gap-y-4">
              <a
                href={`mailto:${identity.email}`}
                className="t-display break-all text-[clamp(1.5rem,4.4vw,3rem)] transition-colors hover:text-[var(--color-gold)]"
              >
                {identity.email}
              </a>
              <button
                onClick={copy}
                className="btn btn-ghost h-10 px-4 text-[0.8rem]"
                aria-label="Copy email address"
              >
                {copied ? <Check size={14} className="text-[var(--color-mint)]" /> : <Copy size={14} />}
                {copied ? 'Copied' : 'Copy'}
              </button>
            </div>
          </div>
        </Reveal>

        {/* links */}
        <div className="grid gap-4 pt-10 sm:grid-cols-2 lg:grid-cols-4">
          {links.map((l, i) => (
            <Reveal key={l.label} delay={i * 70}>
              <a
                href={l.href}
                target="_blank"
                rel="noopener noreferrer"
                className="card group flex h-full items-center gap-4 p-5"
              >
                <span className="grid size-10 place-items-center rounded-lg border border-[var(--color-line)] bg-[var(--color-ink-3)] text-[var(--color-paper)]">
                  <l.Icon size={17} />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-[0.88rem] font-medium">{l.label}</span>
                  <span className="t-mono block truncate text-[0.66rem] text-[var(--color-faint)]">
                    {l.handle}
                  </span>
                </span>
                <ArrowUpRight
                  size={15}
                  className="shrink-0 text-[var(--color-faint)] transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[var(--color-gold)]"
                />
              </a>
            </Reveal>
          ))}

          <Reveal delay={140}>
            <a href={`mailto:${identity.email}`} className="card group flex h-full items-center gap-4 p-5">
              <span className="grid size-10 place-items-center rounded-lg border border-[var(--color-line)] bg-[var(--color-ink-3)]">
                <Mail size={17} />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-[0.88rem] font-medium">Direct email</span>
                <span className="t-mono block truncate text-[0.66rem] text-[var(--color-faint)]">
                  Straight to my inbox
                </span>
              </span>
              <ArrowUpRight
                size={15}
                className="shrink-0 text-[var(--color-faint)] transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[var(--color-gold)]"
              />
            </a>
          </Reveal>

          <Reveal delay={210}>
            <button onClick={onResume} className="card group flex h-full w-full items-center gap-4 p-5 text-left">
              <span className="grid size-10 place-items-center rounded-lg border border-[var(--color-line)] bg-[var(--color-ink-3)]">
                <FileText size={17} />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-[0.88rem] font-medium">Resume</span>
                <span className="t-mono block truncate text-[0.66rem] text-[var(--color-faint)]">
                  Print or save as PDF
                </span>
              </span>
              <ArrowUpRight
                size={15}
                className="shrink-0 text-[var(--color-faint)] transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[var(--color-gold)]"
              />
            </button>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
