import { Project } from '../../types/database'
import { FaTimes, FaExternalLinkAlt, FaCheckCircle, FaPalette, FaCode } from 'react-icons/fa'

export default function CreativeGalleryModal({
  project,
  onClose,
}: {
  project: Project
  onClose: () => void
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xl animate-in fade-in duration-200">
      <div className="w-full max-w-3xl bg-slate-900 border border-white/15 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-6 border-b border-white/10 flex items-center justify-between bg-slate-950/50">
          <div>
            <span className="text-xs font-mono uppercase text-pink-400 bg-pink-400/10 px-2.5 py-1 rounded-full border border-pink-400/20">
              {project.category}
            </span>
            <h3 className="text-2xl font-bold text-white mt-1">{project.name}</h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-all"
          >
            <FaTimes className="text-lg" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6 overflow-y-auto flex-1">
          {project.thumbnail_url && (
            <img
              src={project.thumbnail_url}
              alt={project.name}
              className="w-full max-h-96 object-cover rounded-2xl border border-white/10 shadow-lg"
            />
          )}

          <div>
            <h4 className="text-sm font-bold text-slate-300 uppercase tracking-wider mb-2">Overview</h4>
            <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-wrap">
              {project.full_description || project.short_description}
            </p>
          </div>

          {/* Highlights */}
          {project.creative_highlights && project.creative_highlights.length > 0 && (
            <div className="p-4 rounded-2xl bg-pink-500/10 border border-pink-500/20 space-y-2">
              <h5 className="text-xs font-bold text-pink-300 uppercase tracking-wider flex items-center gap-2">
                <FaPalette /> Creative Highlights
              </h5>
              <div className="flex flex-wrap gap-2">
                {project.creative_highlights.map((h, i) => (
                  <span key={i} className="text-xs font-mono bg-pink-400/20 text-pink-200 px-3 py-1 rounded-lg">
                    {h}
                  </span>
                ))}
              </div>
            </div>
          )}

          {project.developer_highlights && project.developer_highlights.length > 0 && (
            <div className="p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 space-y-2">
              <h5 className="text-xs font-bold text-indigo-300 uppercase tracking-wider flex items-center gap-2">
                <FaCode /> Technical Code Highlights
              </h5>
              <div className="flex flex-wrap gap-2">
                {project.developer_highlights.map((h, i) => (
                  <span key={i} className="text-xs font-mono bg-indigo-400/20 text-indigo-200 px-3 py-1 rounded-lg">
                    {h}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-white/10 bg-slate-950/50 flex justify-end gap-3">
          {project.live_demo_url && (
            <a
              href={project.live_demo_url}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 text-xs font-semibold text-white bg-gradient-to-r from-purple-600 to-pink-500 rounded-xl px-5 py-2.5 shadow-lg shadow-pink-500/25 hover:shadow-pink-500/40 transition-all"
            >
              View Full Work <FaExternalLinkAlt className="text-[10px]" />
            </a>
          )}
        </div>
      </div>
    </div>
  )
}
