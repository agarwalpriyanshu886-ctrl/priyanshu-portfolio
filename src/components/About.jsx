import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  FaBrain,
  FaRobot,
  FaLaptopCode,
  FaCode,
  FaDatabase,
  FaShieldAlt,
  FaLightbulb,
  FaCheckCircle,
} from 'react-icons/fa'
import { site as defaultSite } from '../data/site'
import { getActiveKnowledge } from '../lib/public-ai/cmsKnowledgeStore'
import SectionHeading from './ui/SectionHeading'
import Reveal from './ui/Reveal'
import Counter from './ui/Counter'

const passionIcons = {
  'Artificial Intelligence': FaBrain,
  'Machine Learning': FaRobot,
  'Full-Stack Development': FaLaptopCode,
  'Software Engineering': FaCode,
  'Database Systems': FaDatabase,
  Cybersecurity: FaShieldAlt,
  'Problem Solving': FaLightbulb,
}

export default function About() {
  const [profile, setProfile] = useState({
    name: defaultSite.name,
    title: defaultSite.role,
    bio: defaultSite.about.paragraphs.join('\n\n'),
    passions: defaultSite.about.passions,
  })

  const [statsList, setStatsList] = useState(defaultSite.stats)

  useEffect(() => {
    const updateAbout = () => {
      const active = getActiveKnowledge()
      if (active) {
        if (active.profile) {
          setProfile({
            name: active.profile.name,
            title: active.profile.title,
            bio: active.profile.bio,
            passions: active.profile.passions || defaultSite.about.passions,
          })
        }
        if (active.stats && active.stats.length > 0) {
          setStatsList(active.stats)
        }
      }
    }

    updateAbout()
    window.addEventListener('cms_knowledge_updated', updateAbout)
    window.addEventListener('storage', updateAbout)
    return () => {
      window.removeEventListener('cms_knowledge_updated', updateAbout)
      window.removeEventListener('storage', updateAbout)
    }
  }, [])

  return (
    <section id="about" className="relative py-12 lg:py-16 overflow-hidden">
      <div className="absolute top-1/3 -left-32 w-96 h-96 rounded-full bg-indigo-600/10 blur-3xl pointer-events-none" />

      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHeading
          eyebrow="About Me"
          title="Turning ideas into"
          highlight="intelligent products"
          description="A quick look at who I am and what drives me."
        />

        <div className="grid lg:grid-cols-2 gap-8 items-stretch">
          <Reveal className="h-full">
            <div className="glass rounded-3xl p-6 sm:p-8 h-full flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3 mb-5">
                  <span className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-cyan-500 grid place-items-center font-display font-bold text-white text-xl shadow-[0_8px_30px_-8px_rgb(99_102_241/0.7)]">
                    PA
                  </span>
                  <div>
                    <h3 className="font-display font-semibold text-white text-lg">{profile.name}</h3>
                    <p className="text-sm text-cyan-300/90">{profile.title}</p>
                  </div>
                </div>

                <div className="text-slate-400 leading-relaxed space-y-4 whitespace-pre-wrap">
                  {profile.bio}
                </div>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.1} className="h-full">
            <div className="glass rounded-3xl p-6 sm:p-8 h-full flex flex-col justify-between">
              <div>
                <h3 className="font-display font-semibold text-white text-lg mb-5">Areas I'm passionate about</h3>
                <ul className="flex flex-wrap gap-2.5">
                  {profile.passions.map((passion, i) => {
                    const Icon = passionIcons[passion] || FaBrain
                    return (
                      <motion.li
                        key={passion}
                        initial={{ opacity: 0, x: -12 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.06 * i, duration: 0.45 }}
                        className="inline-flex items-center gap-2.5 text-xs font-medium text-slate-200 bg-white/[0.04] border border-white/10 rounded-xl px-3.5 py-2.5 hover:border-cyan-400/30 hover:bg-white/[0.07] transition-all"
                      >
                        <Icon className="text-cyan-400 text-sm shrink-0" />
                        {passion}
                      </motion.li>
                    )
                  })}
                </ul>
              </div>
            </div>
          </Reveal>
        </div>

        {/* Dynamic Stats Counter Cards Section */}
        <Reveal delay={0.15} className="mt-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {statsList.map((stat, idx) => (
              <div
                key={stat.id || idx}
                className="glass rounded-2xl p-5 text-center hover:border-indigo-400/40 hover:-translate-y-1 transition-all duration-300"
              >
                <p className="font-display text-3xl sm:text-4xl font-bold text-gradient">
                  <Counter value={Number(stat.value) || 0} suffix={stat.suffix || '+'} />
                </p>
                <p className="mt-1.5 text-xs sm:text-sm text-slate-400 font-medium">{stat.label}</p>
              </div>
            ))}
          </div>
        </Reveal>

        <Reveal delay={0.1} className="mt-6 flex justify-center">
          <p className="inline-flex items-center gap-2 text-xs sm:text-sm text-slate-500">
            <FaCheckCircle className="text-emerald-400" /> Always learning · Always building
          </p>
        </Reveal>
      </div>
    </section>
  )
}