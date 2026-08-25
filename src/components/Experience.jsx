import { useState, useEffect } from 'react'
import { FaBriefcase } from 'react-icons/fa'
import { experience as defaultExperience } from '../data/experience'
import { getActiveKnowledge } from '../lib/public-ai/cmsKnowledgeStore'
import SectionHeading from './ui/SectionHeading'
import Timeline from './ui/Timeline'

function ExperienceItem({ item }) {
  return (
    <div className="glass rounded-3xl p-6 sm:p-7 hover:border-indigo-400/30 hover:-translate-y-0.5 transition-all duration-300">
      <div className="flex items-start justify-between gap-3 flex-wrap mb-4">
        <div className="flex items-center gap-3">
          <span className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-cyan-500 grid place-items-center text-white text-base shrink-0">
            <FaBriefcase />
          </span>
          <div>
            <h3 className="font-display font-semibold text-white">{item.role}</h3>
            <p className="text-sm text-cyan-300/90">{item.company}</p>
          </div>
        </div>
        <span className="font-mono text-xs text-slate-400 glass rounded-full px-3 py-1.5 whitespace-nowrap">
          {item.type || 'Internship'} · {item.duration}
        </span>
      </div>
      <ul className="space-y-2">
        {(item.points || []).map((point, i) => (
          <li key={i} className="flex gap-2.5 text-sm text-slate-400 leading-relaxed">
            <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-cyan-400 shrink-0" />
            {point}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default function Experience() {
  const [items, setItems] = useState(defaultExperience)

  useEffect(() => {
    const active = getActiveKnowledge()
    if (active && active.experience && active.experience.length > 0) {
      setItems(active.experience)
    }
  }, [])

  return (
    <section id="experience" className="relative py-12 lg:py-16 overflow-hidden">
      <div className="absolute bottom-0 -right-40 w-[26rem] h-[26rem] rounded-full bg-indigo-600/10 blur-3xl pointer-events-none" />

      <div className="relative mx-auto max-w-5xl px-5 sm:px-8">
        <SectionHeading
          eyebrow="Experience"
          title="Where I've"
          highlight="worked"
          description="Professional experience and internships — a growing timeline."
        />
        <Timeline items={items} renderItem={(item) => <ExperienceItem item={item} />} />
      </div>
    </section>
  )
}
