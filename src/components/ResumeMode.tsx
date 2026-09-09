import { useEffect } from 'react'
import { Printer, X } from 'lucide-react'
import {
  certifications, coding, education, experience, identity, projects, skillGroups,
} from '../data/resume'

/** Clean, single-column, ATS-friendly resume. Prints to A4 via the browser. */
export default function ResumeMode({ onClose }: { onClose: () => void }) {
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKey)
    }
  }, [onClose])

  const Head = ({ children }: { children: string }) => (
    <h2
      className="mb-3 border-b pb-1.5 font-mono text-[0.7rem] font-medium uppercase tracking-[0.18em]"
      style={{ borderColor: '#d8d8d4', color: '#8a6a12' }}
    >
      {children}
    </h2>
  )

  return (
    <div
      className="print-sheet fixed inset-0 z-[95] overflow-y-auto"
      style={{ background: '#f4f4f2', color: '#17181a' }}
      role="dialog"
      aria-modal="true"
      aria-label="Traditional resume"
    >
      {/* toolbar */}
      <div
        className="no-print sticky top-0 z-10 border-b backdrop-blur"
        style={{ background: 'rgba(244,244,242,0.92)', borderColor: '#dcdcd8' }}
      >
        <div className="mx-auto flex max-w-[860px] items-center justify-between px-6 py-3">
          <span className="font-mono text-[0.68rem] uppercase tracking-[0.16em]" style={{ color: '#6b6f77' }}>
            Traditional resume
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className="inline-flex h-9 items-center gap-2 rounded-full px-4 text-[0.8rem] font-medium"
              style={{ background: '#17181a', color: '#fff' }}
            >
              <Printer size={14} />
              Print / Save as PDF
            </button>
            <button
              onClick={onClose}
              className="inline-flex h-9 items-center gap-2 rounded-full border px-4 text-[0.8rem]"
              style={{ borderColor: '#c9c9c4', color: '#17181a' }}
            >
              <X size={14} />
              Close
            </button>
          </div>
        </div>
      </div>

      {/* sheet */}
      <article
        className="mx-auto my-6 max-w-[860px] px-8 py-10 md:px-14 md:py-14"
        style={{ background: '#fff', boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}
      >
        {/* header */}
        <header className="border-b pb-6" style={{ borderColor: '#d8d8d4' }}>
          <h1 className="text-[2.1rem] font-semibold leading-none tracking-tight">{identity.name}</h1>
          <p className="mt-2 text-[0.95rem]" style={{ color: '#4a4d52' }}>
            {identity.role}
          </p>
          <p className="mt-3 font-mono text-[0.72rem]" style={{ color: '#5a5d63' }}>
            {identity.email} · {identity.github.replace('https://', '')} ·{' '}
            {identity.linkedin.replace('https://www.', '')}
          </p>
        </header>

        {/* summary */}
        <section className="mt-7">
          <Head>Professional Summary</Head>
          <p className="text-[0.88rem] leading-relaxed" style={{ color: '#2c2e31' }}>
            Computer Science and Engineering undergraduate with hands-on experience in full-stack web
            development (TypeScript, React, Node.js), enterprise workflow automation on ServiceNow, and
            Linux system administration (RHCSA). Automated workflows handling 500+ monthly requests and
            improved SLA compliance by 25%. Strong foundation in data structures, algorithms, operating
            systems and databases, with an interest in backend systems engineering and AI-driven solutions.
          </p>
        </section>

        {/* education */}
        <section className="mt-7">
          <Head>Education</Head>
          <div className="flex flex-wrap items-baseline justify-between gap-x-4">
            <div>
              <p className="text-[0.92rem] font-semibold">{education.institution}</p>
              <p className="text-[0.85rem]" style={{ color: '#4a4d52' }}>
                {education.degree}
              </p>
            </div>
            <p className="font-mono text-[0.75rem]" style={{ color: '#5a5d63' }}>
              {education.period} · CGPA {education.cgpa}
            </p>
          </div>
          <p className="mt-2 text-[0.82rem]" style={{ color: '#4a4d52' }}>
            Relevant coursework: {education.coursework.join(', ')}
          </p>
        </section>

        {/* skills */}
        <section className="mt-7">
          <Head>Technical Skills</Head>
          <dl className="space-y-1.5">
            {skillGroups.map((g) => (
              <div key={g.id} className="flex gap-2 text-[0.85rem]">
                <dt className="w-[9.5rem] shrink-0 font-semibold">{g.title}</dt>
                <dd style={{ color: '#2c2e31' }}>{g.skills.join(', ')}</dd>
              </div>
            ))}
          </dl>
        </section>

        {/* experience */}
        <section className="mt-7">
          <Head>Experience</Head>
          <div className="space-y-5">
            {experience.map((job) => (
              <div key={job.id}>
                <div className="flex flex-wrap items-baseline justify-between gap-x-4">
                  <p className="text-[0.92rem] font-semibold">
                    {job.role} — {job.org}
                  </p>
                  <p className="font-mono text-[0.75rem]" style={{ color: '#5a5d63' }}>
                    {job.period}
                  </p>
                </div>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-[0.85rem]" style={{ color: '#2c2e31' }}>
                  {job.bullets.map((b) => (
                    <li key={b}>{b}</li>
                  ))}
                </ul>
                <p className="mt-2 text-[0.79rem]" style={{ color: '#5a5d63' }}>
                  <span className="font-semibold">Technologies: </span>
                  {job.tech.join(', ')}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* projects */}
        <section className="mt-7">
          <Head>Projects</Head>
          <div className="space-y-4">
            {projects.map((p) => (
              <div key={p.id}>
                <p className="text-[0.9rem] font-semibold">{p.name}</p>
                <p className="mt-1 text-[0.85rem] leading-relaxed" style={{ color: '#2c2e31' }}>
                  {p.solution}
                </p>
                <p className="mt-1 text-[0.79rem]" style={{ color: '#5a5d63' }}>
                  <span className="font-semibold">Stack: </span>
                  {p.tech.join(', ')}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* certifications */}
        <section className="mt-7">
          <Head>Certifications</Head>
          <ul className="list-disc space-y-1 pl-5 text-[0.85rem]" style={{ color: '#2c2e31' }}>
            {certifications.map((c) => (
              <li key={c.short}>
                {c.name} — {c.issuer}
              </li>
            ))}
          </ul>
        </section>

        {/* coding */}
        <section className="mt-7">
          <Head>Coding Profiles</Head>
          <p className="text-[0.85rem]" style={{ color: '#2c2e31' }}>
            Active on {coding.platforms.map((p) => p.name).join(', ')} — competitive programming and
            problem solving practice.
          </p>
        </section>
      </article>
    </div>
  )
}
