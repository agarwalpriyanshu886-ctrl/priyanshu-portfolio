import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { skillCategories as defaultCategories } from '../data/skills'
import { getActiveKnowledge } from '../lib/public-ai/cmsKnowledgeStore'
import SectionHeading from './ui/SectionHeading'
import Reveal from './ui/Reveal'
import { SkillIcon, CategoryIcon } from './ui/SkillIcon'

function SkillCard({ name, icon, level, accent, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.03, duration: 0.3 }}
      className="flex items-center justify-between p-2.5 rounded-xl bg-white/[0.04] border border-white/10 hover:border-cyan-400/40 hover:bg-white/[0.07] transition-all group"
    >
      <span className="inline-flex items-center gap-2.5 text-xs font-medium text-slate-200">
        <span
          className="w-7 h-7 rounded-lg grid place-items-center text-sm bg-slate-950 border border-white/10 shrink-0 group-hover:scale-110 transition-transform"
          style={{ color: accent }}
        >
          <SkillIcon name={icon} />
        </span>
        {name}
      </span>
      <span className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-slate-950/70 border border-white/5" title={`Proficiency: ${level}%`}>
        <span
          className="w-2 h-2 rounded-full animate-pulse"
          style={{ backgroundColor: accent }}
        />
      </span>
    </motion.div>
  )
}

export default function Skills() {
  const [categories, setCategories] = useState(defaultCategories)

  useEffect(() => {
    const updateSkills = () => {
      const active = getActiveKnowledge()
      if (active && active.skillCategories && active.skillCategories.length > 0) {
        setCategories(active.skillCategories)
      }
    }

    updateSkills()
    window.addEventListener('cms_knowledge_updated', updateSkills)
    window.addEventListener('storage', updateSkills)
    return () => {
      window.removeEventListener('cms_knowledge_updated', updateSkills)
      window.removeEventListener('storage', updateSkills)
    }
  }, [])

  return (
    <section id="skills" className="relative py-12 lg:py-16 overflow-hidden">
      <div className="absolute top-20 -right-40 w-[28rem] h-[28rem] rounded-full bg-violet-600/10 blur-3xl pointer-events-none" />

      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHeading
          eyebrow="Skills"
          title="My technical"
          highlight="arsenal"
          description="Key technologies, frameworks, and tools categorized by core expertise."
        />

        <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5">
          {categories.map((cat, ci) => (
            <Reveal key={cat.id || cat.label} delay={ci * 0.08}>
              <div
                className="glass rounded-3xl p-6 h-full hover:-translate-y-1 transition-transform duration-300 card-glow group"
                style={{ '--cat-accent': cat.accent || '#6366f1' }}
              >
                <div className="flex items-center gap-3 mb-5">
                  <span
                    className="w-11 h-11 rounded-xl grid place-items-center text-lg bg-white/[0.05] border border-white/10 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3"
                    style={{ color: cat.accent || '#6366f1' }}
                  >
                    <CategoryIcon name={cat.icon} />
                  </span>
                  <div>
                    <h3 className="font-display font-semibold text-white">{cat.label}</h3>
                    <p className="text-xs text-slate-400 font-mono">{cat.skills.length} core technologies</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-2.5">
                  {cat.skills.map((skill, i) => (
                    <SkillCard
                      key={skill.name}
                      name={skill.name}
                      icon={skill.icon || 'code'}
                      level={skill.level}
                      accent={cat.accent || '#6366f1'}
                      index={i}
                    />
                  ))}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
