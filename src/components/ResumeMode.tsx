import { ArrowLeft, Printer, Mail } from 'lucide-react'
import { GithubIcon, LinkedinIcon } from './BrandIcons'
import { identity, education, skillGroups, experience, projects, certifications, coding } from '../data/resume'

/** Clean, printable, ATS-friendly resume view. */
export default function ResumeMode({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-[90] bg-[#f5f7fb] text-slate-900 overflow-y-auto print:static print:bg-white">
      <div className="max-w-3xl mx-auto px-6 py-10 print:py-2">
        <div className="flex justify-between items-center mb-8 print:hidden">
          <button onClick={onClose} className="flex items-center gap-2 text-sm font-medium text-indigo-600 hover:text-indigo-800">
            <ArrowLeft size={16} /> BACK TO PORTFOLIO
          </button>
          <button onClick={() => window.print()} className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900 border border-slate-300 rounded px-3 py-1.5">
            <Printer size={15} /> Print / Save PDF
          </button>
        </div>

        <article className="bg-white shadow-xl rounded-lg p-8 md:p-10 print:shadow-none print:p-0">
          <header className="border-b-2 border-slate-800 pb-4">
            <h1 className="text-3xl font-extrabold tracking-tight">{identity.name}</h1>
            <p className="text-slate-600 mt-1">{identity.role}</p>
            <div className="flex flex-wrap gap-x-5 gap-y-1 mt-3 text-sm text-slate-600">
              <a className="inline-flex items-center gap-1.5 hover:text-indigo-700" href={`mailto:${identity.email}`}><Mail size={13} />{identity.email}</a>
              <a className="inline-flex items-center gap-1.5 hover:text-indigo-700" href={identity.linkedin} target="_blank" rel="noreferrer"><LinkedinIcon size={13} />linkedin.com/in/vamsi-meesala</a>
              <a className="inline-flex items-center gap-1.5 hover:text-indigo-700" href={identity.github} target="_blank" rel="noreferrer"><GithubIcon size={13} />github.com/meesalavamsi</a>
            </div>
          </header>

          <Section title="Professional Summary">
            <p className="text-sm leading-relaxed text-slate-700">
              Computer Science undergraduate with hands-on experience in full-stack web development
              (TypeScript, React, Node.js), enterprise workflow automation (ServiceNow), and Linux
              system administration (RHCSA). Strong CS foundation in data structures, algorithms, and
              operating systems; focused on backend systems engineering, problem solving, AI-driven
              solutions, and open-source projects.
            </p>
          </Section>

          <Section title="Education">
            <div className="flex justify-between flex-wrap gap-2">
              <div>
                <div className="font-bold text-sm">{education.institution}</div>
                <div className="text-sm text-slate-700">{education.degree}</div>
              </div>
              <div className="text-right text-sm text-slate-600">
                <div>{education.period}</div>
                <div className="font-semibold text-slate-800">CGPA: {education.cgpa}</div>
              </div>
            </div>
          </Section>

          <Section title="Technical Skills">
            <div className="space-y-1.5 text-sm">
              {skillGroups.map((g) => (
                <div key={g.id} className="flex gap-2">
                  <span className="font-semibold min-w-36">{g.title}:</span>
                  <span className="text-slate-700">{g.skills.join(', ')}</span>
                </div>
              ))}
            </div>
          </Section>

          <Section title="Experience">
            {experience.map((e) => (
              <div key={e.id} className="mb-4">
                <div className="flex justify-between flex-wrap gap-1">
                  <div className="font-bold text-sm">{e.role} — {e.org}</div>
                  <div className="text-sm text-slate-600">{e.period}</div>
                </div>
                <ul className="list-disc ml-5 mt-1.5 text-sm text-slate-700 space-y-1">
                  <li>{e.summary}</li>
                  {e.bullets.slice(0, 3).map((b) => <li key={b}>{b}</li>)}
                </ul>
              </div>
            ))}
          </Section>

          <Section title="Projects">
            {projects.map((p) => (
              <div key={p.id} className="mb-3.5">
                <div className="font-bold text-sm">{p.name} <span className="font-normal text-slate-500">— {p.tagline}</span></div>
                <div className="text-xs text-slate-500 mb-1">{p.tech.join(' · ')}</div>
                <ul className="list-disc ml-5 text-sm text-slate-700 space-y-0.5">
                  {p.features.slice(0, 3).map((f) => <li key={f}>{f}</li>)}
                </ul>
              </div>
            ))}
          </Section>

          <Section title="Certifications">
            <ul className="list-disc ml-5 text-sm text-slate-700 space-y-1">
              {certifications.map((c) => <li key={c.short}><span className="font-semibold">{c.short}</span> — {c.name}</li>)}
            </ul>
          </Section>

          <Section title="Coding Profiles">
            <p className="text-sm text-slate-700">Competitive programming & problem solving: {coding.platforms.join(' · ')}</p>
          </Section>
        </article>
      </div>
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-6">
      <h2 className="text-sm font-extrabold tracking-[0.2em] text-slate-900 border-b border-slate-300 pb-1 mb-3 uppercase">{title}</h2>
      {children}
    </section>
  )
}
