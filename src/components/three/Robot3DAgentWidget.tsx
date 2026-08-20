import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaSparkles } from 'react-icons/fa'

export function Robot3DAgentWidget({ onOpenChat }: { onOpenChat: () => void }) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div className="fixed bottom-6 right-6 z-[9999] flex flex-col items-end pointer-events-auto">
      {/* Speech Bubble Badge Tooltip */}
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, y: 10, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 10, scale: 0.9 }}
          onClick={onOpenChat}
          className="mb-3 bg-slate-900/95 border border-cyan-400/50 backdrop-blur-xl text-white text-xs font-mono font-bold px-4 py-2 rounded-2xl shadow-[0_0_25px_rgba(34,211,238,0.4)] cursor-pointer flex items-center gap-2.5 hover:border-cyan-300 hover:scale-105 transition-all group"
        >
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-400" />
          </span>
          <span>Ask PA-Bot AI 🤖</span>
          <FaSparkles className="text-cyan-400 text-xs group-hover:rotate-12 transition-transform" />
        </motion.div>
      </AnimatePresence>

      {/* Floating 3D Robot Character Button */}
      <motion.div
        animate={{
          y: [0, -8, 0],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        onClick={onOpenChat}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-slate-950/90 border-2 border-cyan-400/60 shadow-[0_0_40px_rgba(34,211,238,0.5)] cursor-pointer relative group overflow-hidden flex items-center justify-center transition-all duration-300 hover:scale-110 hover:border-cyan-300 hover:shadow-[0_0_60px_rgba(34,211,238,0.8)]"
        title="Click to chat with Priyanshu's AI Agent"
      >
        {/* Robot Image */}
        <img
          src="/robot-agent.png"
          alt="PA-Bot 3D AI Robot"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />

        {/* Futuristic Glowing Frame Border Overlay */}
        <div className="absolute inset-0 border border-cyan-400/30 rounded-3xl pointer-events-none group-hover:border-cyan-400/80 transition-colors" />

        {/* Pulse Glow Effect */}
        <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-cyan-400/30 blur-md pointer-events-none animate-pulse" />
      </motion.div>
    </div>
  )
}
