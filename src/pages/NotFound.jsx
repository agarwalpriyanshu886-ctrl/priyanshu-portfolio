import { Link } from 'react-router-dom'
import { FaArrowLeft } from 'react-icons/fa'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-ink-950 text-white flex flex-col items-center justify-center p-6 text-center">
      <h1 className="font-mono text-7xl font-extrabold text-cyan-400 mb-2">404</h1>
      <h2 className="text-2xl font-bold mb-4">Page Not Found</h2>
      <p className="text-slate-400 text-sm max-w-sm leading-relaxed mb-8">
        The page you are looking for does not exist or has been moved.
      </p>
      <Link
        to="/"
        className="inline-flex items-center gap-2 font-semibold text-white bg-gradient-to-r from-indigo-500 to-cyan-500 rounded-xl px-6 py-3 shadow-lg shadow-indigo-500/30 hover:shadow-cyan-500/40 transition-all text-xs"
      >
        <FaArrowLeft /> Return to Home
      </Link>
    </div>
  )
}
