import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { skillCategories as defaultCategories } from '../data/skills'
import { getActiveKnowledge } from '../lib/public-ai/cmsKnowledgeStore'
import SectionHeading from './ui/SectionHeading'
import Reveal from './ui/Reveal'
import { SkillIcon, CategoryIcon } from './ui/SkillIcon'

function SkillBar({ name, icon, level, accent, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.05, duration: 0.4 }}
      className="group"
    >
      <div className="flex items-center justify-between mb-1.5">
        <span className="inline-flex items-center gap-2 text-sm text-slate-300">
          <span
            className="w-6 h-6 rounded-md grid place-items-center text-xs bg-white/[0.06] border border-white/10 transition-transform duration-300 group-hover:scale-110"
            style={{ color: accent }}
          >
            <SkillIcon name={icon} className="text-sm" />
          </span>
          {name}
        </span>
        <span className="font-mono text-xs text-slate-500">{level}%</span>
      </div>
      <div className="h-1.5 rounded-full bg-white/[0.07] overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: `${level}%` }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, delay: 0.1 + index * 0.05, ease: [0.22, 1, 0.36, 1] }}
          className="h-full rounded-full"
          style={{
            background: `linear-gradient(90deg, ${accent}, #22d3ee)`,
            boxShadow: `0 0 12px ${accent}66`,
          }}
        />
      </div>
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
          description="Technologies and tools I work with daily — measured honestly, not inflated."
        />

        <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5">
          {categories.map((cat, ci) => (
            <Reveal key={cat.id || cat.label} delay={ci * 0.08} className={cat.skills.length > 5 ? 'sm:col-span-2 xl:col-span-1' : ''}>
              <div
                className="glass rounded-3xl p-6 h-full hover:-translate-y-1 transition-transform duration-300 card-glow group"
                style={{ '--cat-accent': cat.accent || '#6366f1' }}
              >
                <div className="flex items-center gap-3 mb-6">
                  <span
                    className="w-11 h-11 rounded-xl grid place-items-center text-lg bg-white/[0.05] border border-white/10 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3"
                    style={{ color: cat.accent || '#6366f1' }}
                  >
                    <CategoryIcon name={cat.icon} />
                  </span>
                  <div>
                    <h3 className="font-display font-semibold text-white">{cat.label}</h3>
                    <p className="text-xs text-slate-500 font-mono">{cat.skills.length} technologies</p>
                  </div>
                </div>
                <div className="space-y-4">
                  {cat.skills.map((skill, i) => (
                    <SkillBar
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
