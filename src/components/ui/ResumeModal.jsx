import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaDownload, FaTimes, FaFilePdf, FaClock, FaAward, FaBriefcase, FaMagic } from 'react-icons/fa'
import { getActiveKnowledge } from '../../lib/public-ai/cmsKnowledgeStore'

export default function ResumeModal({ isOpen, onClose }) {
  const [resumes, setResumes] = useState([])

  useEffect(() => {
    const updateResumes = () => {
      const active = getActiveKnowledge()
      if (active && active.resumes && active.resumes.length > 0) {
        setResumes(active.resumes)
      } else {
        setResumes([
          {
            id: 'creative-technologist',
            title: '1. CREATIVE TECHNOLOGIST RESUME',
            subtitle: 'AI/ML Engineering, Full-Stack Web/App Development & Visual Design',
            badge: 'Available (PDF)',
            badgeType: 'available',
            url: active?.profile?.resumeUrl || '/resumes/Priyanshu_Agarwal_Creative_Technologist_Resume.pdf',
          },
        ])
      }
    }

    updateResumes()
    window.addEventListener('cms_knowledge_updated', updateResumes)
    window.addEventListener('storage', updateResumes)
    return () => {
      window.removeEventListener('cms_knowledge_updated', updateResumes)
      window.removeEventListener('storage', updateResumes)
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-md"
        />

        {/* Animated Modal Container */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 10 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative w-full max-w-xl bg-slate-900/95 border border-cyan-500/30 rounded-3xl p-6 sm:p-8 shadow-[0_0_50px_rgba(34,211,238,0.2)] z-10 space-y-6"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-400/30 grid place-items-center text-cyan-400">
                <FaFilePdf className="text-xl" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white tracking-tight">Select Resume</h3>
                <p className="text-xs text-slate-400 font-mono">Choose from 3 specialized resume profiles</p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-white/5 hover:bg-white/15 text-slate-400 hover:text-white grid place-items-center transition-colors"
            >
              <FaTimes />
            </button>
          </div>

          {/* Resume Items */}
          <div className="space-y-3">
            {resumes.map((res) => {
              const isAvailable = res.badgeType === 'available' || Boolean(res.url)

              return (
                <div
                  key={res.id}
                  className={`p-4 rounded-2xl border transition-all duration-300 ${
                    isAvailable
                      ? 'bg-gradient-to-r from-indigo-950/40 to-cyan-950/40 border-cyan-400/40 hover:border-cyan-400 shadow-md hover:shadow-cyan-500/20'
                      : 'bg-white/5 border-white/10 opacity-75'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="flex items-center gap-2.5">
                      <FaFilePdf className={`text-base ${isAvailable ? 'text-cyan-400' : 'text-slate-500'}`} />
                      <h4 className="text-sm font-bold text-white">{res.title}</h4>
                    </div>

                    <span
                      className={`text-[10px] font-mono font-semibold px-2.5 py-0.5 rounded-full ${
                        isAvailable
                          ? 'bg-cyan-400/20 text-cyan-300 border border-cyan-400/30'
                          : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      }`}
                    >
                      {res.badge || (isAvailable ? 'Available (PDF)' : 'Under Progress ⏳')}
                    </span>
                  </div>

                  <p className="text-xs text-slate-400 leading-relaxed mb-3">{res.subtitle}</p>

                  {isAvailable && res.url ? (
                    <div className="flex items-center justify-between gap-3 pt-1 flex-wrap">
                      <a
                        href={res.url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 text-xs font-semibold text-white bg-gradient-to-r from-indigo-500 to-cyan-500 rounded-xl px-4 py-2 shadow-md hover:shadow-cyan-500/30 transition-all"
                      >
                        <FaDownload className="text-[10px]" /> View & Download PDF
                      </a>
                      {res.fileSize && (
                        <span className="text-[11px] font-mono text-slate-400">Size: {res.fileSize}</span>
                      )}
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5 text-[11px] font-mono text-amber-400/90 pt-1">
                      <FaClock className="text-xs" /> Under Progress — Will be available soon.
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
