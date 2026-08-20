import { useEffect, useState } from 'react'
import { cmsService } from '../../lib/services/cmsService'
import { Showreel } from '../../types/database'
import { FaPlay, FaFilm, FaExternalLinkAlt } from 'react-icons/fa'

export default function ShowreelSection() {
  const [showreels, setShowreels] = useState<Showreel[]>([])
  const [activeShowreel, setActiveShowreel] = useState<Showreel | null>(null)

  useEffect(() => {
    cmsService.getShowreels().then((data) => {
      setShowreels(data)
      if (data.length > 0) setActiveShowreel(data[0])
    })
  }, [])

  if (showreels.length === 0 || !activeShowreel) return null

  const getEmbedUrl = (reel: Showreel) => {
    if (reel.video_source === 'YOUTUBE') {
      const match = reel.video_url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/)
      return match ? `https://www.youtube.com/embed/${match[1]}?autoplay=1` : reel.video_url
    }
    if (reel.video_source === 'VIMEO') {
      const match = reel.video_url.match(/vimeo\.com\/(\d+)/)
      return match ? `https://player.vimeo.com/video/${match[1]}?autoplay=1` : reel.video_url
    }
    return reel.video_url
  }

  return (
    <section id="showreel" className="relative py-24 border-t border-white/10 bg-slate-950/60">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <div className="text-center mb-12">
          <span className="text-xs font-mono uppercase tracking-widest text-pink-400 glass rounded-full px-4 py-1.5 mb-3 inline-block border border-pink-400/20">
            Showreel & Motion Studio
          </span>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Featured Video Showreel
          </h2>
          <p className="text-slate-400 text-sm mt-2 max-w-xl mx-auto">
            Commercial video edits, motion graphic intros, color grading clips, and visual identity reels.
          </p>
        </div>

        <div className="rounded-3xl overflow-hidden glass border border-white/15 shadow-2xl relative">
          {activeShowreel.video_source === 'YOUTUBE' || activeShowreel.video_source === 'VIMEO' ? (
            <div className="aspect-video w-full">
              <iframe
                src={getEmbedUrl(activeShowreel)}
                title={activeShowreel.title}
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          ) : (
            <video
              controls
              poster={activeShowreel.poster_image}
              src={activeShowreel.video_url}
              className="w-full aspect-video object-cover"
            />
          )}

          <div className="p-6 bg-slate-900/90 border-t border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-mono text-pink-400 font-semibold uppercase tracking-wider">
                {activeShowreel.category}
              </span>
              <h3 className="text-xl font-bold text-white mt-0.5">{activeShowreel.title}</h3>
              {activeShowreel.description && <p className="text-xs text-slate-400 mt-1">{activeShowreel.description}</p>}
            </div>

            <a
              href={activeShowreel.video_url}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 text-xs font-semibold text-white bg-gradient-to-r from-purple-600 to-pink-500 rounded-xl px-5 py-2.5 shadow-lg shadow-pink-500/25 hover:shadow-pink-500/40 transition-all shrink-0"
            >
              Watch Original <FaExternalLinkAlt className="text-[10px]" />
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
