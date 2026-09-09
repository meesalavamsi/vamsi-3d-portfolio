import { Mail, ArrowUpRight } from 'lucide-react'
import Reveal from './Reveal'
import { identity } from '../data/resume'
import { GithubIcon, LinkedinIcon } from './BrandIcons'

export default function Contact() {
  return (
    <section id="contact" className="relative py-28 md:py-40 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-indigo-950/20 to-transparent pointer-events-none" />
      <div className="relative max-w-4xl mx-auto px-6 text-center">
        <Reveal>
          <div className="section-label mb-5">06 — CONTACT</div>
          <h2 className="text-4xl md:text-7xl font-black tracking-tight text-white leading-[1.05]">
            Let's build<br /><span className="grad-text">something real.</span>
          </h2>
          <p className="text-slate-400 mt-7 max-w-xl mx-auto leading-relaxed">
            I'm open to internships, junior backend / full-stack roles, and interesting collaborations.
            The fastest way to reach me is email — I reply quickly.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <a href={`mailto:${identity.email}`} className="btn-primary !text-base !px-9 !py-4">
              <Mail size={17} /> {identity.email}
            </a>
          </div>
          <div className="mt-8 flex justify-center gap-3">
            <a href={identity.github} target="_blank" rel="noreferrer" className="btn-ghost">
              <GithubIcon size={16} /> GitHub <ArrowUpRight size={13} className="opacity-60" />
            </a>
            <a href={identity.linkedin} target="_blank" rel="noreferrer" className="btn-ghost">
              <LinkedinIcon size={16} /> LinkedIn <ArrowUpRight size={13} className="opacity-60" />
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
