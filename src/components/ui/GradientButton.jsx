import { motion } from 'framer-motion'

export default function GradientButton({ href, children, variant = 'primary', className = '', onClick }) {
  const base =
    'inline-flex items-center justify-center gap-2 font-semibold text-sm tracking-wide rounded-full px-6 py-3 transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/60'
  const styles =
    variant === 'primary'
      ? 'text-white bg-gradient-to-r from-indigo-500 via-indigo-500 to-cyan-500 bg-[length:200%_auto] hover:bg-[position:right_center] shadow-[0_8px_30px_-6px_rgb(99_102_241/0.55)] hover:shadow-[0_8px_40px_-4px_rgb(34_211_238/0.5)] hover:-translate-y-0.5'
      : 'text-slate-200 glass hover:bg-white/10 hover:-translate-y-0.5 hover:border-white/20'

  const inner = <>{children}</>

  if (href && href !== '#') {
    return (
      <motion.a
        href={href}
        className={`${base} ${styles} ${className}`}
        whileTap={{ scale: 0.97 }}
      >
        {inner}
      </motion.a>
    )
  }
  if (onClick) {
    return (
      <motion.button
        type="button"
        onClick={onClick}
        className={`${base} ${styles} ${className}`}
        whileTap={{ scale: 0.97 }}
      >
        {inner}
      </motion.button>
    )
  }
  return (
    <a href={href} className={`${base} ${styles} ${className}`}>
      {inner}
    </a>
  )
}
