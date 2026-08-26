import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaGithub, FaExternalLinkAlt, FaLock } from 'react-icons/fa'
import { projects as defaultProjects, projectCategories } from '../data/projects'
import { getActiveKnowledge } from '../lib/public-ai/cmsKnowledgeStore'
import SectionHeading from './ui/SectionHeading'
import Reveal from './ui/Reveal'
import { gradientThumb } from '../utils/gradientThumb'

function ProjectCard({ project, index }) {
  const rawImage = project.image || project.imageUrl || project.bannerUrl || project.banner
  const thumb = project.isPlaceholder
    ? null
    : (typeof rawImage === 'string' ? rawImage : rawImage?.url) || gradientThumb({ label: project.title })

  const title = project.title
  const description = project.shortDescription || project.description
  const tech = project.techStack || project.tech || []
  const github = project.githubUrl || project.github
  const demo = project.demoUrl || project.demo

  return (
    <motion.article
      layout
      initial={{ opacity: 0, scale: 0.94 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.94 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className="group glass rounded-3xl overflow-hidden card-glow hover:border-indigo-400/30 hover:-translate-y-1.5 transition-all duration-300 flex flex-col"
    >
      <div className="relative overflow-hidden aspect-[16/9]">
        {project.isPlaceholder ? (
          <div className="absolute inset-0 grid place-items-center bg-white/[0.03]">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgb(99_102_241/0.12),transparent_70%)]" />
            <div className="relative text-center px-6">
              <span className="mx-auto mb-3 w-14 h-14 grid place-items-center rounded-2xl glass text-2xl">
                <FaLock className="text-slate-500" />
              </span>
              <p className="font-mono text-xs uppercase tracking-widest text-slate-500">Slot available</p>
            </div>
          </div>
        ) : (
          <>
            <img
              src={thumb}
              alt={`${title} preview`}
              loading="lazy"
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink-950/80 via-transparent to-transparent" />
          </>
        )}
      </div>

      <div className="p-6 flex flex-col flex-1">
        <div className="flex items-center justify-between gap-3 mb-2">
          <h3 className="font-display font-semibold text-white text-lg leading-snug">{title}</h3>
          {(project.featured || project.status === 'LIVE') && !project.isPlaceholder && (
            <span className="shrink-0 text-[10px] font-mono uppercase tracking-widest text-cyan-300 glass rounded-full px-2.5 py-1">
              {project.status || 'Featured'}
            </span>
          )}
        </div>
        <p className="text-sm text-slate-400 leading-relaxed mb-4">{description}</p>

        <div className="flex flex-wrap gap-2 mb-5">
          {tech.map((t) => (
            <span
              key={t}
              className="text-xs font-mono text-slate-300 bg-white/[0.05] border border-white/10 rounded-full px-3 py-1"
            >
              {t}
            </span>
          ))}
        </div>

        <div className="mt-auto flex items-center gap-2.5">
          {project.isPlaceholder ? (
            <span className="text-xs text-slate-500 font-mono">Slot available</span>
          ) : (
            <>
              {github && (
                <a
                  href={github}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 text-sm font-medium text-slate-300 glass rounded-full px-4 py-2 hover:text-white hover:border-white/20 hover:-translate-y-0.5 transition-all duration-300"
                >
                  <FaGithub /> GitHub
                </a>
              )}
              {demo && (
                <a
                  href={demo}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 text-sm font-medium text-white bg-gradient-to-r from-indigo-500 to-cyan-500 rounded-full px-4 py-2 shadow-[0_6px_24px_-8px_rgb(99_102_241/0.6)] hover:shadow-[0_6px_30px_-6px_rgb(34_211_238/0.5)] hover:-translate-y-0.5 transition-all duration-300"
                >
                  <FaExternalLinkAlt className="text-xs" /> Live Demo
                </a>
              )}
            </>
          )}
        </div>
      </div>
    </motion.article>
  )
}

export default function Projects() {
  const [filter, setFilter] = useState('all')
  const [projectList, setProjectList] = useState(defaultProjects)

  useEffect(() => {
    const updateProjects = () => {
      const active = getActiveKnowledge()
      if (active && active.projects && active.projects.length > 0) {
        setProjectList(active.projects)
      }
    }

    updateProjects()
    window.addEventListener('cms_knowledge_updated', updateProjects)
    window.addEventListener('storage', updateProjects)
    return () => {
      window.removeEventListener('cms_knowledge_updated', updateProjects)
      window.removeEventListener('storage', updateProjects)
    }
  }, [])

  const filtered = projectList.filter((p) => filter === 'all' || p.category === filter || filter.toUpperCase() === p.category)

  return (
    <section id="projects" className="relative py-12 lg:py-16 overflow-hidden">
      <div className="absolute -top-20 left-1/3 w-[30rem] h-[30rem] rounded-full bg-cyan-500/10 blur-3xl pointer-events-none" />

      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHeading
          eyebrow="Projects"
          title="Selected work I've"
          highlight="built"
          description="Real projects with real users in mind — from the web to Android."
        />

        <Reveal className="mb-8">
          <div className="flex flex-wrap justify-center gap-2">
            {projectCategories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setFilter(cat.id)}
                className={`relative px-5 py-2 rounded-full text-sm font-medium transition-colors duration-300 ${
                  filter === cat.id ? 'text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                {filter === cat.id && (
                  <motion.span
                    layoutId="project-filter"
                    className="absolute inset-0 rounded-full bg-gradient-to-r from-indigo-500/90 to-cyan-500/90 shadow-[0_6px_24px_-8px_rgb(99_102_241/0.6)]"
                    transition={{ type: 'spring', stiffness: 350, damping: 32 }}
                  />
                )}
                <span className="relative z-10">{cat.label}</span>
              </button>
            ))}
          </div>
        </Reveal>

        <motion.div layout className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {filtered.map((project, i) => (
              <ProjectCard key={project.id || project.slug} project={project} index={i} />
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  )
}
