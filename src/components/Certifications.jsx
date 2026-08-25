import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FaAward, FaExternalLinkAlt, FaCalendarAlt, FaBuilding } from 'react-icons/fa'
import { certifications as defaultCertifications } from '../data/certifications'
import { getActiveKnowledge } from '../lib/public-ai/cmsKnowledgeStore'
import SectionHeading from './ui/SectionHeading'
import Reveal from './ui/Reveal'

export default function Certifications() {
  const [certList, setCertList] = useState(defaultCertifications)

  useEffect(() => {
    const active = getActiveKnowledge()
    if (active && active.certifications && active.certifications.length > 0) {
      setCertList(active.certifications)
    }
  }, [])

  return (
    <section id="certifications" className="relative py-12 lg:py-16 overflow-hidden">
      <div className="absolute -top-20 right-1/4 w-[28rem] h-[28rem] rounded-full bg-cyan-500/10 blur-3xl pointer-events-none" />

      <div className="relative mx-auto max-w-6xl px-5 sm:px-8">
        <SectionHeading
          eyebrow="Certifications"
          title="Credentials &"
          highlight="achievements"
          description="Certifications that back up my skills."
        />

        {certList.length === 0 ? (
          <Reveal className="text-center">
            <p className="text-slate-500 glass rounded-2xl py-14">
              No certifications currently listed. Add them in the Admin Panel.
            </p>
          </Reveal>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {certList.map((cert, i) => (
              <Reveal key={cert.id || i} delay={i * 0.08}>
                <motion.div
                  whileHover={{ y: -6 }}
                  className="glass rounded-3xl overflow-hidden card-glow hover:border-cyan-400/30 transition-colors duration-300 h-full flex flex-col"
                >
                  <div className="relative aspect-[16/10] bg-gradient-to-br from-indigo-500/20 to-cyan-500/10 grid place-items-center overflow-hidden">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,rgb(34_211_238/0.15),transparent_60%)]" />
                    {cert.media ? (
                      <img
                        src={cert.media}
                        alt={`${cert.title} certificate`}
                        loading="lazy"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <FaAward className="text-5xl text-cyan-400/70 relative" />
                    )}
                    <span className="absolute top-3 right-3 glass rounded-full px-2.5 py-1 text-[10px] font-mono uppercase tracking-widest text-cyan-300">
                      Certified
                    </span>
                  </div>

                  <div className="p-6 flex flex-col flex-1">
                    <h3 className="font-display font-semibold text-white leading-snug">{cert.title}</h3>
                    <div className="mt-3 space-y-1.5 text-sm text-slate-400">
                      <p className="flex items-center gap-2">
                        <FaBuilding className="text-cyan-400 text-xs" /> {cert.organization}
                      </p>
                      <p className="flex items-center gap-2">
                        <FaCalendarAlt className="text-cyan-400 text-xs" /> {cert.date}
                      </p>
                    </div>
                    {cert.description && (
                      <p className="mt-3 text-sm text-slate-500 leading-relaxed">{cert.description}</p>
                    )}
                    {cert.url && (
                      <div className="mt-auto pt-5">
                        <a
                          href={cert.url}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-2 text-sm font-medium text-white bg-gradient-to-r from-indigo-500 to-cyan-500 rounded-full px-5 py-2.5 hover:shadow-[0_6px_30px_-6px_rgb(34_211_238/0.5)] hover:-translate-y-0.5 transition-all duration-300"
                        >
                          View Certificate <FaExternalLinkAlt className="text-xs" />
                        </a>
                      </div>
                    )}
                  </div>
                </motion.div>
              </Reveal>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
