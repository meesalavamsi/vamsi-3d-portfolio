import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Download } from 'lucide-react'
import { useGameStore } from './gstore'
import { destinies, finalMessage } from './story'

function pickDestiny(risks: number, helped: number, secrets: number) {
  if (risks >= 3) return 'THE REBEL'
  if (helped >= 2) return 'THE GARDENER'
  if (secrets >= 4) return 'THE WITNESS'
  if (risks === 0 && helped === 0) return 'THE GHOST'
  return destinies[(risks + helped + secrets) % destinies.length]
}

export default function ResultCard({ open, onClose }: { open: boolean; onClose: () => void }) {
  const s = useGameStore()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [png, setPng] = useState<string | null>(null)
  const m = s.memory
  const mins = Math.max(1, Math.round((Date.now() - m.startTime) / 60000))
  const trust = Math.min(99, 40 + m.helped * 18 - m.risks * 4 + m.secrets.length * 3)
  const destiny = pickDestiny(m.risks, m.helped, m.secrets.length)

  const rows: [string, string][] = [
    ['DECISIONS', String(m.choices)],
    ['SECRETS FOUND', String(m.secrets.length)],
    ['HUMANS HELPED', String(m.helped)],
    ['RISKS TAKEN', String(m.risks)],
    ['WORLDS EXPLORED', String(m.worldsVisited.length + 1)],
    ['TIME INSIDE', `${mins} MIN`],
    ['TRUST SCORE', `${trust}%`],
    ['RISK LEVEL', m.risks >= 3 ? 'HIGH' : m.risks >= 1 ? 'MEDIUM' : 'LOW'],
  ]

  useEffect(() => {
    if (!open || !canvasRef.current) return
    const c = canvasRef.current
    const ctx = c.getContext('2d')!
    const W = 900, H = 1200
    c.width = W; c.height = H
    // bg
    const g = ctx.createLinearGradient(0, 0, W, H)
    g.addColorStop(0, '#05060e'); g.addColorStop(1, '#120826')
    ctx.fillStyle = g; ctx.fillRect(0, 0, W, H)
    // grid
    ctx.strokeStyle = 'rgba(77,208,255,0.08)'
    for (let x = 0; x < W; x += 45) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke() }
    for (let y = 0; y < H; y += 45) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke() }
    // border
    ctx.strokeStyle = 'rgba(77,208,255,0.7)'; ctx.lineWidth = 3; ctx.strokeRect(30, 30, W - 60, H - 60)
    // header
    ctx.fillStyle = '#4dd0ff'; ctx.font = '700 30px monospace'; ctx.textAlign = 'center'
    ctx.fillText('THE LAST HUMAN', W / 2, 110)
    ctx.fillStyle = '#ffffff'; ctx.font = '900 64px monospace'
    ctx.fillText('YOUR SIMULATION', W / 2, 190)
    ctx.fillStyle = 'rgba(255,255,255,0.4)'; ctx.font = '22px monospace'
    ctx.fillText(`PLAYER 1000 · RUN #${s.runCount + 1}`, W / 2, 240)
    // rows
    ctx.textAlign = 'left'
    rows.forEach(([k, v], i) => {
      const y = 330 + i * 72
      ctx.fillStyle = 'rgba(255,255,255,0.45)'; ctx.font = '22px monospace'
      ctx.fillText(k, 90, y)
      ctx.fillStyle = '#ffffff'; ctx.font = '700 30px monospace'; ctx.textAlign = 'right'
      ctx.fillText(v, W - 90, y)
      ctx.textAlign = 'left'
      ctx.strokeStyle = 'rgba(255,255,255,0.1)'; ctx.lineWidth = 1
      ctx.beginPath(); ctx.moveTo(90, y + 18); ctx.lineTo(W - 90, y + 18); ctx.stroke()
    })
    // destiny
    ctx.textAlign = 'center'
    ctx.fillStyle = 'rgba(255,255,255,0.4)'; ctx.font = '22px monospace'
    ctx.fillText('FINAL DESTINY', W / 2, 950)
    const dg = ctx.createLinearGradient(W / 2 - 260, 0, W / 2 + 260, 0)
    dg.addColorStop(0, '#4dd0ff'); dg.addColorStop(0.5, '#a78bfa'); dg.addColorStop(1, '#f472b6')
    ctx.fillStyle = dg; ctx.font = '900 58px monospace'
    ctx.fillText(destiny, W / 2, 1030)
    ctx.fillStyle = 'rgba(255,255,255,0.35)'; ctx.font = '18px monospace'
    ctx.fillText('vamsi-3d-portfolio.vercel.app', W / 2, 1130)
    setPng(c.toDataURL('image/png'))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  return (
    <AnimatePresence>
      {open && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 z-[80] bg-black/90 flex items-center justify-center p-4 overflow-y-auto">
          <div className="max-w-sm w-full">
            <div className="flex justify-between items-center mb-4">
              <span className="font-mono text-xs tracking-[0.3em] text-cyan-300">SHARE MY RESULT</span>
              <button onClick={onClose} className="text-slate-400 hover:text-white"><X size={20} /></button>
            </div>
            <canvas ref={canvasRef} className="w-full border border-cyan-400/30" style={{ imageRendering: 'auto' }} />
            <div className="font-mono text-[10px] text-slate-500 leading-5 mt-4 text-center whitespace-pre-line">{finalMessage.join('\n')}</div>
            {png && (
              <a href={png} download="my-simulation.png"
                className="mt-4 flex items-center justify-center gap-2 font-mono text-xs tracking-[0.25em] px-6 py-3.5 border border-cyan-400/60 text-cyan-300 hover:bg-cyan-400 hover:text-black transition-all">
                <Download size={14} /> DOWNLOAD CARD
              </a>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
