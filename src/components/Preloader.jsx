import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { site } from '../data/site'

export default function Preloader() {
  const [progress, setProgress] = useState(0)
  const [done, setDone] = useState(false)

  useEffect(() => {
    const start = performance.now()
    const duration = 1400
    let raf
    const tick = (now) => {
      const p = Math.min((now - start) / duration, 1)
      setProgress(Math.round(p * 100))
      if (p < 1) {
        raf = requestAnimationFrame(tick)
      } else {
        setTimeout(() => setDone(true), 300)
      }
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [])

  useEffect(() => {
    if (done) {
      document.body.style.overflow = ''
    } else {
      document.body.style.overflow = 'hidden'
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [done])

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          exit={{ opacity: 0, transition: { duration: 0.5 } }}
          className="fixed inset-0 z-[100] grid place-items-center bg-ink-950"
          aria-hidden="true"
        >
          <div className="absolute inset-0 bg-[radial-gradient(700px_circle_at_50%_50%,rgb(99_102_241/0.14),transparent_70%)]" />
          <div className="relative flex flex-col items-center gap-6">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="w-20 h-20 rounded-3xl bg-gradient-to-br from-indigo-500 to-cyan-500 grid place-items-center shadow-[0_0_60px_-10px_rgb(99_102_241/0.7)]"
            >
              <span className="font-display font-bold text-white text-2xl">{site.initials}</span>
            </motion.div>

            <div className="text-center">
              <p className="font-display text-white text-lg font-medium">{site.name}</p>
              <p className="font-mono text-xs text-cyan-300/80 mt-1 uppercase tracking-widest">Loading portfolio</p>
            </div>

            <div className="w-52 h-1 rounded-full bg-white/10 overflow-hidden">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-cyan-400"
                style={{ width: `${progress}%` }}
              />
            </div>
            <span className="font-mono text-xs text-slate-500">{progress}%</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
