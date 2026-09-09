import Reveal from './Reveal'

type Props = {
  index: string
  label: string
  title: string
  serifWord?: string
  intro?: string
  align?: 'left' | 'center'
}

/** The repeating structural header used by every section. */
export default function SectionHeader({ index, label, title, serifWord, intro, align = 'left' }: Props) {
  return (
    <header className={align === 'center' ? 'text-center' : ''}>
      <Reveal>
        <div
          className={`flex items-center gap-4 ${align === 'center' ? 'justify-center' : ''}`}
        >
          <span className="t-eyebrow text-[var(--color-gold)]">{index}</span>
          <span className="h-px w-8 bg-[var(--color-line)]" aria-hidden />
          <span className="t-eyebrow text-[var(--color-faint)]">{label}</span>
        </div>
      </Reveal>

      <Reveal delay={70}>
        <h2 className="t-display mt-6 text-[clamp(2.1rem,5.2vw,3.75rem)]">
          {title}
          {serifWord && (
            <>
              {' '}
              <span className="t-serif italic text-[var(--color-gold)]">{serifWord}</span>
            </>
          )}
        </h2>
      </Reveal>

      {intro && (
        <Reveal delay={140}>
          <p
            className={`t-body mt-5 max-w-2xl ${align === 'center' ? 'mx-auto' : ''}`}
          >
            {intro}
          </p>
        </Reveal>
      )}
    </header>
  )
}
