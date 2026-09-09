import { useEffect, useState } from 'react'
import { AnimatePresence, motion, useScroll, useSpring } from 'framer-motion'
import Loader from './components/Loader'
import Nav from './components/Nav'
import Hero from './components/Hero'
import Marquee from './components/Marquee'
import About from './components/About'
import Experience from './components/Experience'
import Projects from './components/Projects'
import Skills from './components/Skills'
import Certs from './components/Certs'
import Contact from './components/Contact'
import Footer from './components/Footer'
import ResumeMode from './components/ResumeMode'
import SimGate from './components/SimGate'
import { lazy, Suspense } from 'react'
import { useGameStore } from './game/gstore'

const GameApp = lazy(() => import('./game/GameApp'))

export default function App() {
  const [loading, setLoading] = useState(true)
  const [showResume, setShowResume] = useState(false)
  const [inGame, setInGame] = useState(false)
  const escaped = useGameStore((s) => s.endingsSeen.includes('escaped'))
  const { scrollYProgress } = useScroll()
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 24 })

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 1600)
    return () => clearTimeout(t)
  }, [])

  useEffect(() => {
    document.body.style.overflow = showResume ? 'hidden' : ''
  }, [showResume])

  return (
    <div className="relative">
      <AnimatePresence>{loading && <Loader />}</AnimatePresence>

      {/* scroll progress */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-[2px] z-[60] origin-left bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400"
        style={{ scaleX: progress }}
      />

      <Nav onResume={() => setShowResume(true)} />
      <main>
        <Hero onResume={() => setShowResume(true)} />
        <Marquee />
        <About />
        <Experience />
        <Projects />
        <Skills />
        <Certs />
        <Contact />
        <SimGate played={escaped} onEnter={() => setInGame(true)} />
      </main>
      <Footer />

      {inGame && (
        <Suspense fallback={
          <div className="fixed inset-0 z-[70] bg-black flex items-center justify-center">
            <span className="font-mono text-xs tracking-[0.4em] text-white/60 animate-pulse">LOADING SIMULATION...</span>
          </div>
        }>
          <GameApp
            onExit={() => setInGame(false)}
            onMeetCreator={() => { setInGame(false); setTimeout(() => document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' }), 100) }}
          />
        </Suspense>
      )}

      <AnimatePresence>{showResume && <ResumeMode onClose={() => setShowResume(false)} />}</AnimatePresence>
    </div>
  )
}
