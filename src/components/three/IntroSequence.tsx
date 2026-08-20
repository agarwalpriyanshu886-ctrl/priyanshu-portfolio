import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useDualMode } from '../../lib/mode/ModeContext'
import { FaCode, FaPaintBrush, FaArrowRight, FaTimes } from 'react-icons/fa'

export function IntroSequence() {
  const { showIntro, dismissIntro } = useDualMode()
  const [step, setStep] = useState(1)

  useEffect(() => {
    if (!showIntro) return
    const timer1 = setTimeout(() => setStep(2), 1200)
    const timer2 = setTimeout(() => setStep(3), 2800)
    const timer3 = setTimeout(() => dismissIntro(), 4200)

    return () => {
      clearTimeout(timer1)
      clearTimeout(timer2)
      clearTimeout(timer3)
    }
  }, [showIntro])

  if (!showIntro) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.6 }}
        className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-slate-950 text-white p-6"
      >
        <button
          onClick={dismissIntro}
          className="absolute top-6 right-6 flex items-center gap-2 text-xs font-mono text-slate-400 hover:text-white glass px-4 py-2 rounded-full border border-white/10 transition-all z-10"
        >
          Skip Intro <FaTimes className="text-xs" />
        </button>

        {step === 1 && (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 1.1, opacity: 0 }}
            className="w-16 h-16 rounded-full bg-gradient-to-tr from-indigo-500 to-cyan-400 grid place-items-center shadow-[0_0_60px_rgba(99,102,241,0.6)] animate-pulse"
          />
        )}

        {step === 2 && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            className="flex items-center gap-8 font-display font-extrabold text-3xl sm:text-5xl tracking-tight"
          >
            <span className="flex items-center gap-3 text-cyan-400">
              <FaCode className="text-2xl" /> CODE
            </span>
            <span className="text-slate-600">+</span>
            <span className="flex items-center gap-3 text-pink-500">
              <FaPaintBrush className="text-2xl" /> CREATE
            </span>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-center space-y-3"
          >
            <h1 className="font-display font-extrabold text-4xl sm:text-6xl text-white tracking-tight">
              PRIYANSHU AGARWAL
            </h1>
            <p className="font-mono text-xs uppercase tracking-widest text-cyan-400">
              One Person · Two Worlds · One Portfolio
            </p>
          </motion.div>
        )}
      </motion.div>
    </AnimatePresence>
  )
}
