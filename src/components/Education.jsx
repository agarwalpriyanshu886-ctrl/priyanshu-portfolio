import { useState, useEffect } from 'react'
import { education as defaultEducation } from '../data/education'
import { getActiveKnowledge } from '../lib/public-ai/cmsKnowledgeStore'
import SectionHeading from './ui/SectionHeading'
import AcademicSlider from './ui/AcademicSlider'

export default function Education() {
  const [items, setItems] = useState(defaultEducation)

  useEffect(() => {
    const active = getActiveKnowledge()
    if (active && active.education && active.education.length > 0) {
      setItems(active.education)
    }
  }, [])

  return (
    <section id="education" className="relative py-24 lg:py-28 overflow-hidden">
      <div className="absolute top-10 -left-40 w-[26rem] h-[26rem] rounded-full bg-indigo-600/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 -right-40 w-[26rem] h-[26rem] rounded-full bg-cyan-500/10 blur-3xl pointer-events-none" />

      <div className="relative mx-auto max-w-6xl px-5 sm:px-8">
        <SectionHeading
          eyebrow="Academic Journey"
          title="Education &"
          highlight="Milestones"
          description="Interactive horizontal showcase of my complete academic journey — from schooling to competitive engineering."
        />

        <AcademicSlider items={items} />
      </div>
    </section>
  )
}
