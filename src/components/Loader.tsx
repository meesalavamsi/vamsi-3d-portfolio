import { motion } from 'framer-motion'
import { identity } from '../data/resume'

export default function Loader() {
  return (
    <motion.div
      className="fixed inset-0 z-[100] bg-[#05060e] flex flex-col items-center justify-center"
      exit={{ y: '-100%', transition: { duration: 0.7, ease: [0.76, 0, 0.24, 1] } }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <div className="font-mono text-[10px] tracking-[0.5em] text-cyan-400/70 mb-4">PORTFOLIO</div>
        <div className="text-3xl md:text-4xl font-black tracking-[0.15em] text-white">
          {identity.first}<span className="grad-text"> {identity.last}</span>
        </div>
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1.1, ease: 'easeInOut', delay: 0.2 }}
          className="mt-6 h-px w-48 mx-auto bg-gradient-to-r from-transparent via-cyan-400 to-transparent origin-left"
        />
      </motion.div>
    </motion.div>
  )
}
