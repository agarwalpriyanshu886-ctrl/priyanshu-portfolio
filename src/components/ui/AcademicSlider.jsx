import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FaGraduationCap,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaCheckCircle,
  FaChevronLeft,
  FaChevronRight,
  FaSchool,
  FaFlask,
} from 'react-icons/fa'

function getShortDegreeLabel(item) {
  if (!item) return ''
  const deg = item.degree || item.badge || ''
  if (deg.includes('M.Tech')) return 'M.Tech'
  if (deg.includes('B.Tech')) return 'B.Tech'
  if (deg.includes('JEE')) return 'IIT-JEE'
  if (deg.includes('Schooling') || deg.includes('Primary')) return 'Schooling'
  return deg.slice(0, 10)
}

export default function AcademicSlider({ items }) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [direction, setDirection] = useState(1) // 1 for right, -1 for left
  const [isAutoPlay, setIsAutoPlay] = useState(true)
  const autoPlayRef = useRef(null)

  // Chronological order: Schooling (2010-2024) -> Resonance (2022-2024) -> B.Tech (2024-2028) -> M.Tech (2028-2029)
  const sortedItems = [...items].sort((a, b) => {
    const startA = parseInt(a.start_date || a.startDate || '0', 10)
    const startB = parseInt(b.start_date || b.startDate || '0', 10)
    return startA - startB
  })

  const total = sortedItems.length

  const handleNext = () => {
    setDirection(1)
    setCurrentIndex((prev) => (prev + 1) % total)
  }

  const handlePrev = () => {
    setDirection(-1)
    setCurrentIndex((prev) => (prev - 1 + total) % total)
  }

  const handleDotClick = (index) => {
    setDirection(index > currentIndex ? 1 : -1)
    setCurrentIndex(index)
  }

  useEffect(() => {
    autoPlayRef.current = setInterval(() => {
      handleNext()
    }, 3000)

    return () => {
      if (autoPlayRef.current) clearInterval(autoPlayRef.current)
    }
  }, [currentIndex])

  const slideVariants = {
    enter: (dir) => ({
      x: dir > 0 ? 300 : -300,
      opacity: 0,
      scale: 0.95,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
    },
    exit: (dir) => ({
      x: dir > 0 ? -300 : 300,
      opacity: 0,
      scale: 0.95,
      transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] },
    }),
  }

  const activeItem = sortedItems[currentIndex]

  return (
    <div
      className="space-y-8"
      onMouseEnter={() => setIsAutoPlay(false)}
      onMouseLeave={() => setIsAutoPlay(true)}
    >
      {/* Horizontal Chronological Progression Bar */}
      <div className="relative mx-auto max-w-4xl px-4 py-4">
        {/* Progress Line */}
        <div className="absolute top-[25px] left-8 right-8 h-1 bg-slate-800 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-indigo-500 via-cyan-400 to-emerald-400"
            initial={{ width: '0%' }}
            animate={{ width: `${((currentIndex + 1) / total) * 100}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>

        {/* Milestone Nodes */}
        <div className="relative z-10 flex items-center justify-between">
          {sortedItems.map((item, idx) => {
            const isActive = idx === currentIndex
            const isPassed = idx <= currentIndex

            return (
              <button
                key={item.id || idx}
                onClick={() => handleDotClick(idx)}
                className="group flex flex-col items-center gap-2 outline-none"
              >
                <div
                  className={`px-3 py-2 rounded-2xl flex items-center justify-center font-mono text-xs font-bold transition-all duration-300 ${
                    isActive
                      ? 'bg-gradient-to-r from-indigo-500 to-cyan-400 text-slate-950 scale-110 shadow-[0_0_25px_rgba(34,211,238,0.6)] ring-4 ring-cyan-400/20'
                      : isPassed
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/40'
                      : 'bg-slate-900 text-slate-400 border border-white/10'
                  }`}
                >
                  {getShortDegreeLabel(item)}
                </div>
                <span
                  className={`text-xs font-mono font-semibold transition-colors ${
                    isActive ? 'text-cyan-300' : 'text-slate-500'
                  }`}
                >
                  {item.start_date || item.startDate}–{item.end_date || item.endDate}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Main Horizontal Slide Showcase Container */}
      <div className="relative max-w-4xl mx-auto min-h-[420px] flex items-center">
        {/* Navigation Arrows */}
        <button
          onClick={handlePrev}
          aria-label="Previous Slide"
          className="absolute -left-5 sm:-left-7 z-20 w-12 h-12 rounded-2xl bg-slate-900/90 border border-white/15 text-slate-300 hover:text-white hover:border-cyan-400 hover:scale-110 glass grid place-items-center shadow-2xl transition-all"
        >
          <FaChevronLeft className="text-base" />
        </button>

        <button
          onClick={handleNext}
          aria-label="Next Slide"
          className="absolute -right-5 sm:-right-7 z-20 w-12 h-12 rounded-2xl bg-slate-900/90 border border-white/15 text-slate-300 hover:text-white hover:border-cyan-400 hover:scale-110 glass grid place-items-center shadow-2xl transition-all"
        >
          <FaChevronRight className="text-base" />
        </button>

        {/* Animated Slide Card */}
        <div className="w-full overflow-hidden p-2">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={currentIndex}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="w-full rounded-3xl bg-slate-900/80 border border-white/15 p-6 sm:p-9 shadow-2xl space-y-6 relative overflow-hidden backdrop-blur-xl"
            >
              {/* Optional Background Glow */}
              <div className="absolute -top-24 -right-24 w-60 h-60 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none" />

              {/* Image Banner if present */}
              {activeItem.image && (
                <div className="rounded-2xl overflow-hidden h-52 sm:h-64 bg-slate-950 border border-white/10 relative shadow-inner">
                  <img
                    src={activeItem.image}
                    alt={activeItem.institution}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-white bg-slate-900/90 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/20 shadow-md">
                      🏢 {activeItem.institution}
                    </span>
                  </div>
                </div>
              )}

              {/* Title & Badge */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-cyan-500 grid place-items-center text-white text-xl font-bold shrink-0 shadow-lg shadow-indigo-500/30">
                    <FaGraduationCap />
                  </div>
                  <div>
                    <span className="text-xs font-mono tracking-wider text-cyan-400 font-bold block mb-0.5">
                      {activeItem.badge || `Stage ${currentIndex + 1} of ${total}`}
                    </span>
                    <h3 className="font-display font-extrabold text-white text-xl sm:text-2xl leading-tight">
                      {activeItem.degree}{' '}
                      <span className="text-cyan-300 font-medium">— {activeItem.field}</span>
                    </h3>
                  </div>
                </div>

                <div className="shrink-0 self-start sm:self-auto">
                  <span className="font-mono text-xs font-extrabold text-slate-950 bg-gradient-to-r from-cyan-400 to-indigo-300 px-4 py-2 rounded-xl shadow-lg shadow-cyan-500/20 block">
                    🗓 {activeItem.start_date || activeItem.startDate} – {activeItem.end_date || activeItem.endDate}
                  </span>
                </div>
              </div>

              {/* Location & Duration info */}
              <div className="flex flex-wrap gap-5 text-xs text-slate-300 font-mono">
                {activeItem.institution && (
                  <span className="inline-flex items-center gap-2">
                    <span className="text-cyan-400 font-bold">🏫 Institution:</span> {activeItem.institution}
                  </span>
                )}
                {activeItem.location && (
                  <span className="inline-flex items-center gap-2">
                    <span className="text-cyan-400 font-bold">📍 Location:</span> {activeItem.location}
                  </span>
                )}
                {(activeItem.duration || activeItem.current_status) && (
                  <span className="inline-flex items-center gap-2">
                    <span className="text-cyan-400 font-bold">⏱ Duration:</span>{' '}
                    {activeItem.duration || activeItem.current_status}
                  </span>
                )}
              </div>

              {/* Description */}
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                {activeItem.description}
              </p>

              {/* Highlights tags */}
              {activeItem.highlights && activeItem.highlights.length > 0 && (
                <div className="pt-3 border-t border-white/10 space-y-2">
                  <span className="text-xs font-mono tracking-wider text-slate-400 block font-semibold">
                    Key Highlights & Subjects
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {activeItem.highlights.map((h, idx) => (
                      <span
                        key={idx}
                        className="text-xs font-mono text-cyan-200 bg-cyan-400/10 border border-cyan-400/20 rounded-xl px-3 py-1 flex items-center gap-2"
                      >
                        <FaCheckCircle className="text-[10px] text-cyan-400 shrink-0" /> {h}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Slide Pagination Dots */}
      <div className="flex items-center justify-center gap-3 pt-2">
        {sortedItems.map((_, idx) => (
          <button
            key={idx}
            onClick={() => handleDotClick(idx)}
            aria-label={`Go to slide ${idx + 1}`}
            className={`h-2.5 rounded-full transition-all duration-300 ${
              idx === currentIndex
                ? 'w-10 bg-gradient-to-r from-indigo-500 to-cyan-400 shadow-[0_0_12px_rgba(34,211,238,0.5)]'
                : 'w-2.5 bg-slate-800 hover:bg-slate-600'
            }`}
          />
        ))}
      </div>
    </div>
  )
}
