import { motion } from 'framer-motion'
import { RobotState, RobotEmotion } from '../../lib/ai/aiTypes'

export function RobotScene({
  state = 'idle',
  emotion = 'neutral',
  onClick,
  className = '',
}: {
  state?: RobotState
  emotion?: RobotEmotion
  onClick?: () => void
  className?: string
}) {
  return (
    <motion.div
      onClick={onClick}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.95 }}
      animate={
        state === 'speaking'
          ? { y: [0, -6, 0, -6, 0] }
          : state === 'thinking'
          ? { rotate: [0, -4, 4, 0] }
          : state === 'listening'
          ? { scale: [1, 1.04, 1] }
          : { y: [0, -4, 0] }
      }
      transition={{
        duration: state === 'speaking' ? 1.5 : 3,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
      className={`relative grid place-items-center cursor-pointer rounded-3xl overflow-hidden ${className}`}
    >
      {/* Robot Image */}
      <img
        src="/robot-agent.png"
        alt="Pittu AI Robot Agent"
        className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
      />

      {/* Futuristic Cyan Glass Overlay */}
      <div className="absolute inset-0 rounded-3xl border border-cyan-400/40 pointer-events-none group-hover:border-cyan-300 transition-colors shadow-[inset_0_0_20px_rgba(34,211,238,0.2)]" />

      {/* State Indicator Glowing Dot */}
      {state === 'thinking' && (
        <div className="absolute top-2 right-2 w-3 h-3 rounded-full bg-cyan-400 animate-ping" />
      )}
      {state === 'speaking' && (
        <div className="absolute top-2 right-2 w-3 h-3 rounded-full bg-pink-400 animate-pulse" />
      )}
      {state === 'listening' && (
        <div className="absolute top-2 right-2 w-3 h-3 rounded-full bg-amber-400 animate-bounce" />
      )}
    </motion.div>
  )
}
