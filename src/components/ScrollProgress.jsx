import { motion } from 'framer-motion'
import { useScroll, useSpring } from 'framer-motion'

export default function ScrollProgress() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 30, restDelta: 0.001 })

  return (
    <motion.div
      style={{ scaleX }}
      className="fixed top-0 inset-x-0 h-[3px] z-[60] origin-left bg-gradient-to-r from-indigo-500 via-cyan-400 to-emerald-400"
      aria-hidden="true"
    />
  )
}
