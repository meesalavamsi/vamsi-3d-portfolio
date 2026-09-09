import { useState } from 'react'
import Journey from './journey/Journey'
import ResumeMode from './components/ResumeMode'
import { AnimatePresence } from 'framer-motion'

export default function App() {
  const [showResume, setShowResume] = useState(false)
  return (
    <div className="relative">
      <Journey onResume={() => setShowResume(true)} />
      <AnimatePresence>{showResume && <ResumeMode onClose={() => setShowResume(false)} />}</AnimatePresence>
    </div>
  )
}
