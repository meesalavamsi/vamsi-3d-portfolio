import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import SectionShell from '../components/SectionShell'
import { ZoneTitle, HoloChip, NpcLine } from '../components/widgets'
import { projects } from '../data/resume'
import { useGame } from '../store/gameStore'
import { sfx } from '../utils/sound'

const p = projects.find((x) => x.id === 'cyber-arena')!
const accent = '#ff4d5e'
const TIME_PER_Q = 15

const quiz = [
  {
    q: 'A user receives an email asking them to "verify their password" via a link. What attack is this?',
    options: ['Phishing', 'SQL Injection', 'DDoS', 'Zero-day'],
    answer: 0,
  },
  {
    q: "Which of these input strings is a classic SQL Injection attempt?",
    options: ['"hello world"', "' OR '1'='1", 'user@example.com', 'GET /index.html'],
    answer: 1,
  },
  {
    q: 'What does RBAC control in an enterprise system?',
    options: ['Network bandwidth', 'Access based on user roles', 'Disk encryption', 'CPU scheduling'],
    answer: 1,
  },
  {
    q: 'A vulnerability scan finds an unpatched public web server. Best first action?',
    options: ['Ignore it', 'Shut down the internet', 'Prioritize and patch the server', 'Delete the logs'],
    answer: 2,
  },
  {
    q: 'What is the purpose of multi-factor authentication (MFA)?',
    options: ['Faster logins', 'Extra proof of identity beyond a password', 'Password sharing', 'Load balancing'],
    answer: 1,
  },
]

const baseBoard = [
  { name: 'VAMSI', score: 980 },
  { name: 'PLAYER 02', score: 820 },
  { name: 'PLAYER 03', score: 760 },
]

function Quiz({ onFinish }: { onFinish: (score: number) => void }) {
  const [qi, setQi] = useState(0)
  const [score, setScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(TIME_PER_Q)
  const [picked, setPicked] = useState<number | null>(null)
  const soundOn = useGame((s) => s.soundOn)
  const timer = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    timer.current = setInterval(() => setTimeLeft((t) => Math.max(0, t - 1)), 1000)
    return () => { if (timer.current) clearInterval(timer.current) }
  }, [qi])

  useEffect(() => {
    if (timeLeft === 0 && picked === null) answer(-1)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeLeft])

  const answer = (i: number) => {
    if (picked !== null) return
    setPicked(i)
    const correct = i === quiz[qi].answer
    if (correct) {
      setScore((sc) => sc + 100 + timeLeft * 10)
      if (soundOn) sfx.success()
    } else if (soundOn) sfx.error()
    setTimeout(() => {
      if (qi + 1 < quiz.length) {
        setQi(qi + 1); setPicked(null); setTimeLeft(TIME_PER_Q)
      } else {
        onFinish(correct ? score + 100 + timeLeft * 10 : score)
      }
    }, 900)
  }

  const q = quiz[qi]

  return (
    <div className="terminal p-6 max-w-2xl border-red-400/40" style={{ boxShadow: '0 0 24px rgba(255,77,94,0.15)' }}>
      <div className="flex justify-between items-center mb-5 text-[10px] tracking-[0.3em]">
        <span className="text-red-400">⚠ THREAT {qi + 1}/{quiz.length}</span>
        <span className={timeLeft <= 5 ? 'text-red-400 pulse-glow' : 'text-cyan-300'}>⏱ {timeLeft}s</span>
        <span className="text-emerald-300">SCORE {score}</span>
      </div>
      <div className="bar-outer h-1 w-full mb-6">
        <div className="h-full transition-all duration-1000" style={{ width: `${(timeLeft / TIME_PER_Q) * 100}%`, background: timeLeft <= 5 ? '#ff4d5e' : '#4dd0ff' }} />
      </div>
      <p className="text-slate-100 text-sm md:text-base leading-relaxed mb-6">{q.q}</p>
      <div className="grid gap-2.5">
        {q.options.map((opt, i) => {
          const isRight = picked !== null && i === q.answer
          const isWrong = picked === i && i !== q.answer
          return (
            <button
              key={i}
              onClick={() => answer(i)}
              disabled={picked !== null}
              className={`text-left px-4 py-3 text-sm border transition-all tracking-wider ${
                isRight ? 'border-emerald-400 bg-emerald-400/15 text-emerald-200'
                : isWrong ? 'border-red-500 bg-red-500/15 text-red-300'
                : 'border-slate-700 hover:border-red-400/60 hover:bg-red-400/5 text-slate-200'
              }`}
            >
              [{String.fromCharCode(65 + i)}] {opt}
            </button>
          )
        })}
      </div>
    </div>
  )
}

export function Leaderboard({ playerScore }: { playerScore: number | null }) {
  const board = [...baseBoard]
  if (playerScore !== null) board.push({ name: 'YOU', score: playerScore })
  board.sort((a, b) => b.score - a.score)
  return (
    <div className="terminal p-5 max-w-sm w-full border-red-400/40">
      <div className="text-red-400 text-xs tracking-[0.3em] mb-4">🛡 CYBER ARENA — LEADERBOARD</div>
      <div className="grid grid-cols-[1fr_auto] gap-y-2 text-sm">
        <div className="text-[10px] tracking-[0.25em] text-slate-500">PLAYER</div>
        <div className="text-[10px] tracking-[0.25em] text-slate-500">SCORE</div>
        {board.map((r) => (
          <div key={r.name} className="contents">
            <div className={r.name === 'YOU' ? 'text-cyan-300 text-glow font-bold' : r.name === 'VAMSI' ? 'text-amber-300' : 'text-slate-300'}>
              {r.name}
            </div>
            <div className={`text-right ${r.name === 'YOU' ? 'text-cyan-300 font-bold' : 'text-slate-300'}`}>{r.score}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function CyberArena({ embedded = false }: { embedded?: boolean }) {
  const [phase, setPhase] = useState<'brief' | 'play' | 'done'>('brief')
  const [finalScore, setFinalScore] = useState<number | null>(null)
  const quizDone = useGame((s) => s.cyberQuizDone)
  const setCyberQuizDone = useGame((s) => s.setCyberQuizDone)
  const soundOn = useGame((s) => s.soundOn)

  const finish = (score: number) => {
    setFinalScore(score)
    setPhase('done')
    setCyberQuizDone()
  }

  const body = (
    <div>
      <div className="text-[10px] tracking-[0.4em] mb-2" style={{ color: accent }}>{embedded ? 'BUILDING 03 //' : ''} {p.theme.toUpperCase()}</div>
      <h2 className="text-2xl md:text-4xl font-black tracking-wider text-white mb-2" style={{ textShadow: `0 0 16px ${accent}88` }}>
        THREAT INTERROGATION
      </h2>
      <p className="text-sm text-slate-400 mb-8 tracking-wider">{p.name} — you are now the cybersecurity analyst.</p>

      <div className="grid lg:grid-cols-[1fr_auto] gap-8 items-start">
        <div>
          <AnimatePresence mode="wait">
            {phase === 'brief' && (
              <motion.div key="brief" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="glass p-6 max-w-2xl">
                <div className="text-red-400 tracking-[0.3em] text-xs mb-4 pulse-glow">⚠ THREAT DETECTED</div>
                <div className="space-y-3 mb-6">
                  <NpcLine who="SYSTEM" text="Multiple vulnerabilities detected in the network. Analyst required." accent={accent} />
                  <NpcLine who="BRIEFING" text="Answer 5 interrogation questions before time runs out. Faster answers score higher." accent="#4dd0ff" />
                </div>
                <ul className="text-xs text-slate-400 space-y-1.5 mb-6 tracking-wider">
                  {p.features.map((f) => <li key={f}>▸ {f}</li>)}
                </ul>
                <button className="btn-game !border-red-400/60 !text-red-300 hover:!bg-red-400/10" onClick={() => { setPhase('play'); if (soundOn) sfx.open() }}>
                  ▶ BEGIN INTERROGATION
                </button>
              </motion.div>
            )}
            {phase === 'play' && (
              <motion.div key="play" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}>
                <Quiz onFinish={finish} />
              </motion.div>
            )}
            {phase === 'done' && (
              <motion.div key="done" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="glass-strong p-8 max-w-2xl text-center">
                <div className="text-emerald-300 text-glow-green text-2xl tracking-[0.2em] mb-2">THREATS NEUTRALIZED ✓</div>
                <div className="text-5xl font-black text-white my-6 text-glow">{finalScore}</div>
                <p className="text-slate-400 text-sm tracking-wider mb-6">
                  {quizDone && finalScore !== null && finalScore >= 980
                    ? 'You outscored VAMSI. Impressive, analyst.'
                    : 'Interrogation complete. +100 XP earned.'}
                </p>
                <button className="btn-game" onClick={() => { setPhase('play'); setFinalScore(null); if (soundOn) sfx.click() }}>
                  ↻ RETRY CHALLENGE
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <Leaderboard playerScore={finalScore} />
      </div>

      <div className="mt-10">
        <ZoneTitle accent={accent}>TECH STACK</ZoneTitle>
        <div className="flex flex-wrap gap-3">
          {p.tech.map((t, i) => <HoloChip key={t} label={t} accent={accent} delay={i * 0.05} />)}
        </div>
      </div>
    </div>
  )

  if (embedded) return body
  return (
    <SectionShell
      id="cyber"
      title="CYBER ARENA"
      subtitle="A dark bunker where threats are interrogated."
      accent={accent}
      canComplete={quizDone || phase === 'done'}
      completeHint="COMPLETE THE CYBER CHALLENGE FIRST"
    >
      {body}
    </SectionShell>
  )
}
