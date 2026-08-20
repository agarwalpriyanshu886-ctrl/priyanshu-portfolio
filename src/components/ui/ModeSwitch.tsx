import { useDualMode } from '../../lib/mode/ModeContext'
import { FaCode, FaPaintBrush } from 'react-icons/fa'

export default function ModeSwitch() {
  const { mode, setMode } = useDualMode()

  return (
    <div className="inline-flex items-center p-1 rounded-full bg-slate-900/90 border border-white/15 backdrop-blur-md shadow-xl">
      <button
        onClick={() => setMode('developer')}
        className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold font-mono transition-all duration-300 ${
          mode === 'developer'
            ? 'bg-gradient-to-r from-indigo-500 to-cyan-500 text-white shadow-[0_0_20px_rgba(34,211,238,0.5)]'
            : 'text-slate-400 hover:text-white'
        }`}
      >
        <FaCode className="text-xs" /> ⚡ TECH
      </button>
      <button
        onClick={() => setMode('creative')}
        className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold font-mono transition-all duration-300 ${
          mode === 'creative'
            ? 'bg-gradient-to-r from-purple-600 to-pink-500 text-white shadow-[0_0_20px_rgba(236,72,153,0.5)]'
            : 'text-slate-400 hover:text-white'
        }`}
      >
        <FaPaintBrush className="text-xs" /> ✦ CREATIVE
      </button>
    </div>
  )
}
