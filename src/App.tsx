import { lazy, Suspense, useCallback, useEffect, useState } from 'react'
import Nav from './components/Nav'
import Hero from './components/Hero'
import Marquee from './components/Marquee'
import About from './components/About'
import Experience from './components/Experience'
import Work from './components/Work'
import Skills from './components/Skills'
import Credentials from './components/Credentials'
import Contact from './components/Contact'
import PlayCTA from './components/PlayCTA'
import Footer from './components/Footer'
import Preloader from './components/Preloader'
import CommandPalette from './components/CommandPalette'

const ResumeMode = lazy(() => import('./components/ResumeMode'))

export default function App() {
  const [booting, setBooting] = useState(true)
  const [resume, setResume] = useState(false)
  const [palette, setPalette] = useState(false)

  const openResume = useCallback(() => setResume(true), [])

  // ⌘K / Ctrl+K opens the command menu
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setPalette((p) => !p)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  return (
    <div className="grain relative min-h-screen">
      {booting && <Preloader onDone={() => setBooting(false)} />}

      <Nav onResume={openResume} onPalette={() => setPalette(true)} />

      <main>
        <Hero onResume={openResume} />
        <Marquee />
        <About />
        <div className="shell"><div className="rule" /></div>
        <Experience />
        <div className="shell"><div className="rule" /></div>
        <PlayCTA />
        <div className="shell"><div className="rule" /></div>
        <Work />
        <div className="shell"><div className="rule" /></div>
        <Skills />
        <div className="shell"><div className="rule" /></div>
        <Credentials />
        <div className="shell"><div className="rule" /></div>
        <Contact onResume={openResume} />
      </main>

      <Footer />

      <CommandPalette open={palette} onClose={() => setPalette(false)} onResume={openResume} />

      {resume && (
        <Suspense fallback={null}>
          <ResumeMode onClose={() => setResume(false)} />
        </Suspense>
      )}
    </div>
  )
}
