import { motion, AnimatePresence } from 'framer-motion'
import { useDualMode } from '../../lib/mode/ModeContext'

export function PortalTransition3D() {
  const { isTransitioning, mode } = useDualMode()

  return (
    <AnimatePresence>
      {isTransitioning && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 0.4, ease: 'easeInOut' }}
          className="fixed inset-0 z-50 pointer-events-none flex items-center justify-center bg-slate-950/90 backdrop-blur-xl"
        >
          <div className="relative flex flex-col items-center">
            {/* Pulsing Portal Ring */}
            <div
              className={`w-32 h-32 rounded-full border-4 animate-spin ${
                mode === 'developer'
                  ? 'border-indigo-500 border-t-cyan-400 shadow-[0_0_50px_rgba(34,211,238,0.5)]'
                  : 'border-purple-500 border-t-pink-500 shadow-[0_0_50px_rgba(236,72,153,0.5)]'
              }`}
            />
            <span className="mt-6 font-mono text-xs uppercase tracking-widest text-slate-300 font-bold animate-pulse">
              Entering {mode === 'developer' ? 'Creative Studio' : 'Developer Terminal'}...
            </span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
