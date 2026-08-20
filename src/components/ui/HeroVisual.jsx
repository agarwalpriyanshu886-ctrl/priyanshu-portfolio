import { useRef } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'

const inputNodes = [15, 30, 45, 60, 75]
const hiddenNodes = [8, 28, 48, 68, 88]
const outputNodes = [25, 75]

const edges = []
inputNodes.forEach((y1, i) =>
  hiddenNodes.forEach((y2, j) => {
    if ((i + j) % 3 === 0) edges.push({ x1: 20, y1, x2: 80, y2, delay: ((i + j) % 5) * 0.25 })
  }),
)
hiddenNodes.forEach((y1, i) =>
  outputNodes.forEach((y2, j) => {
    if ((i + j) % 2 === 0) edges.push({ x1: 80, y1, x2: 92, y2, delay: (i % 4) * 0.3 })
  }),
)

export default function HeroVisual() {
  const ref = useRef(null)
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const sx = useSpring(mx, { stiffness: 60, damping: 18 })
  const sy = useSpring(my, { stiffness: 60, damping: 18 })
  const tx = useTransform(sx, [-0.5, 0.5], [-12, 12])
  const ty = useTransform(sy, [-0.5, 0.5], [-12, 12])

  const onMouseMove = (e) => {
    const rect = ref.current.getBoundingClientRect()
    mx.set((e.clientX - rect.left) / rect.width - 0.5)
    my.set((e.clientY - rect.top) / rect.height - 0.5)
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMouseMove}
      className="relative w-full max-w-[520px] mx-auto aspect-square"
      initial={{ opacity: 0, scale: 0.92 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.9, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* Glow halo */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-indigo-600/25 via-violet-500/15 to-cyan-400/25 blur-3xl animate-pulse-glow" />

      {/* Orbit rings */}
      <motion.div
        style={{ x: tx, y: ty }}
        className="absolute inset-[8%]"
        aria-hidden="true"
      >
        <div className="absolute inset-0 rounded-full border border-indigo-500/20 animate-spin-slow">
          <span className="absolute top-1/2 -left-1.5 w-3 h-3 rounded-full bg-cyan-400 shadow-[0_0_16px_4px_rgb(34_211_238/0.6)]" />
          <span className="absolute -bottom-1 -right-0.5 w-2 h-2 rounded-full bg-indigo-400 shadow-[0_0_12px_3px_rgb(99_102_241/0.6)]" />
        </div>
        <div className="absolute inset-[14%] rounded-full border border-dashed border-cyan-400/20 animate-[spin_28s_linear_infinite_reverse]">
          <span className="absolute top-[14%] -right-1 w-2 h-2 rounded-full bg-violet-400 shadow-[0_0_12px_3px_rgb(167_139_250/0.6)]" />
        </div>
        <div className="absolute inset-[26%] rounded-full border border-white/10 animate-float-slow" />
      </motion.div>

      {/* Neural network core */}
      <motion.div
        style={{ x: tx, y: ty }}
        className="absolute inset-[18%] glass rounded-full grid place-items-center"
      >
        <svg viewBox="0 0 100 100" className="w-[72%]" aria-hidden="true">
          <defs>
            <linearGradient id="edgeGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#6366f1" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#22d3ee" stopOpacity="0.9" />
            </linearGradient>
            <radialGradient id="nodeGrad" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#c7d2fe" />
              <stop offset="100%" stopColor="#818cf8" />
            </radialGradient>
          </defs>
          {edges.map((e, i) => (
            <line
              key={`e${i}`}
              x1={e.x1}
              y1={e.y1}
              x2={e.x2}
              y2={e.y2}
              stroke="url(#edgeGrad)"
              strokeWidth="0.4"
              strokeLinecap="round"
              style={{
                strokeDasharray: '3 5',
                animation: `edge-flow 3.2s linear ${e.delay}s infinite`,
              }}
            />
          ))}
          {inputNodes.map((y) => (
            <circle key={`i${y}`} cx={20} cy={y} r={3} fill="url(#nodeGrad)">
              <animate attributeName="opacity" values="0.5;1;0.5" dur="2.4s" repeatCount="indefinite" />
            </circle>
          ))}
          {hiddenNodes.map((y) => (
            <circle key={`h${y}`} cx={80} cy={y} r={3} fill="url(#nodeGrad)">
              <animate attributeName="opacity" values="1;0.5;1" dur="2.4s" repeatCount="indefinite" />
            </circle>
          ))}
          {outputNodes.map((y) => (
            <circle key={`o${y}`} cx={92} cy={y} r={3.4} fill="#22d3ee">
              <animate attributeName="opacity" values="0.4;1;0.4" dur="1.8s" repeatCount="indefinite" />
            </circle>
          ))}
          <circle cx={50} cy={50} r={4} fill="#0a0c1b" stroke="#22d3ee" strokeWidth="0.8">
            <animate attributeName="r" values="4;5;4" dur="2s" repeatCount="indefinite" />
          </circle>
        </svg>
      </motion.div>

      {/* Floating code card */}
      <motion.div
        style={{ x: tx, y: ty }}
        className="absolute -top-2 left-[4%] glass rounded-xl px-4 py-3 shadow-xl animate-float"
      >
        <p className="font-mono text-[11px] leading-relaxed text-cyan-300">
          <span className="text-indigo-400">def</span>{' '}
          <span className="text-slate-100">build</span>(<span className="text-amber-300">idea</span>):
        </p>
        <p className="font-mono text-[11px] leading-relaxed text-slate-400">
          {'  '}return <span className="text-emerald-300">ai</span> + <span className="text-sky-300">web</span>
        </p>
      </motion.div>

      {/* Floating terminal badge */}
      <motion.div
        style={{ x: tx, y: ty }}
        className="absolute -bottom-3 right-[6%] glass rounded-xl px-4 py-3 shadow-xl animate-float-slow"
      >
        <div className="flex items-center gap-1.5 mb-1.5">
          <span className="w-2 h-2 rounded-full bg-rose-400" />
          <span className="w-2 h-2 rounded-full bg-amber-400" />
          <span className="w-2 h-2 rounded-full bg-emerald-400" />
        </div>
        <p className="font-mono text-[11px] text-emerald-300">
          <span className="text-slate-500">$</span> train_model()<span className="animate-blink">▍</span>
        </p>
        <p className="font-mono text-[11px] text-slate-500">accuracy: 98.2%</p>
      </motion.div>

      {/* Floating chip badge */}
      <motion.div
        style={{ x: tx, y: ty }}
        className="absolute top-[42%] -left-3 glass rounded-lg px-3 py-2 animate-float shadow-xl"
      >
        <p className="font-mono text-[10px] text-violet-300">numpy</p>
        <p className="font-mono text-[10px] text-slate-500">ML</p>
      </motion.div>
    </motion.div>
  )
}
