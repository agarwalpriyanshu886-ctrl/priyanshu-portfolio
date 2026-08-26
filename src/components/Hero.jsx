import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FaGithub, FaLinkedinIn, FaInstagram, FaDownload, FaRocket, FaEnvelope } from 'react-icons/fa'
import { site as defaultSite } from '../data/site'
import { getActiveKnowledge } from '../lib/public-ai/cmsKnowledgeStore'
import Particles from './ui/Particles'
import HeroVisual from './ui/HeroVisual'
import Typewriter from './ui/Typewriter'
import GradientButton from './ui/GradientButton'
import ResumeModal from './ui/ResumeModal'

const socialIcons = {
  github: FaGithub,
  linkedin: FaLinkedinIn,
  instagram: FaInstagram,
}

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.15 } },
}
const item = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
}

export default function Hero() {
  const [isResumeModalOpen, setIsResumeModalOpen] = useState(false)
  const [heroData, setHeroData] = useState({
    greetingPill: defaultSite.hero.greeting + ' ' + defaultSite.name + ' — Engineering student @ NIMS University Jaipur',
    firstName: defaultSite.hero.name.split(' ')[0],
    lastName: defaultSite.hero.name.split(' ').slice(1).join(' '),
    roles: defaultSite.hero.roles,
    typingSpeed: 70,
    deletingSpeed: 40,
    pauseDuration: 1600,
    shortDescription: defaultSite.shortDescription,
    primaryCtaLabel: defaultSite.hero.ctaPrimary.label,
    primaryCtaHref: defaultSite.hero.ctaPrimary.href,
    secondaryCtaLabel: defaultSite.hero.ctaSecondary.label,
    secondaryCtaHref: defaultSite.hero.ctaSecondary.href,
  })

  useEffect(() => {
    const updateHero = () => {
      const active = getActiveKnowledge()
      if (active && active.hero) {
        setHeroData({
          greetingPill: active.hero.greetingPill || defaultSite.name,
          firstName: active.hero.firstName || defaultSite.hero.name.split(' ')[0],
          lastName: active.hero.lastName || defaultSite.hero.name.split(' ').slice(1).join(' '),
          roles: active.hero.roles || defaultSite.hero.roles,
          typingSpeed: active.hero.typingSpeed || 70,
          deletingSpeed: active.hero.deletingSpeed || 40,
          pauseDuration: active.hero.pauseDuration || 1600,
          shortDescription: active.hero.shortDescription || defaultSite.shortDescription,
          primaryCtaLabel: active.hero.primaryCtaLabel || 'View My Projects',
          primaryCtaHref: active.hero.primaryCtaHref || '#projects',
          secondaryCtaLabel: active.hero.secondaryCtaLabel || 'Contact Me',
          secondaryCtaHref: active.hero.secondaryCtaHref || '#contact',
        })
      }
    }

    updateHero()
    window.addEventListener('cms_knowledge_updated', updateHero)
    window.addEventListener('storage', updateHero)
    return () => {
      window.removeEventListener('cms_knowledge_updated', updateHero)
      window.removeEventListener('storage', updateHero)
    }
  }, [])

  return (
    <section id="home" className="relative min-h-screen flex items-center pt-28 pb-20 overflow-hidden">
      <Particles className="absolute inset-0" density={80} />
      <div className="absolute -top-32 -right-40 w-[34rem] h-[34rem] rounded-full bg-indigo-600/15 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 -left-40 w-[28rem] h-[28rem] rounded-full bg-cyan-500/10 blur-3xl pointer-events-none" />

      <div className="relative mx-auto max-w-7xl px-5 sm:px-8 grid lg:grid-cols-[1.05fr_0.95fr] gap-14 items-center w-full">
        <motion.div variants={container} initial="hidden" animate="show">
          <motion.p
            variants={item}
            className="inline-flex items-center gap-2 glass rounded-full px-4 py-1.5 text-sm text-slate-300 mb-6"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
            </span>
            {heroData.greetingPill}
          </motion.p>

          <motion.h1
            variants={item}
            className="font-display text-4xl sm:text-6xl lg:text-7xl font-bold text-white leading-[1.05]"
          >
            {heroData.firstName}{' '}
            <span className="text-gradient animate-gradient-x">
              {heroData.lastName}
            </span>
          </motion.h1>

          <motion.h2 variants={item} className="mt-4 font-display text-xl sm:text-2xl lg:text-3xl font-semibold text-cyan-300">
            <Typewriter
              words={heroData.roles.length > 0 ? heroData.roles : ['Full-Stack Developer']}
              typingSpeed={heroData.typingSpeed}
              deletingSpeed={heroData.deletingSpeed}
              pause={heroData.pauseDuration}
            />
          </motion.h2>

          <motion.p variants={item} className="mt-5 max-w-xl text-slate-400 leading-relaxed text-base sm:text-lg">
            {heroData.shortDescription}
          </motion.p>

          <motion.div variants={item} className="mt-8 flex flex-wrap items-center gap-3">
            <GradientButton href={heroData.primaryCtaHref} variant="primary">
              <FaRocket className="text-sm" /> {heroData.primaryCtaLabel}
            </GradientButton>
            <GradientButton href={heroData.secondaryCtaHref} variant="secondary">
              <FaEnvelope className="text-sm" /> {heroData.secondaryCtaLabel}
            </GradientButton>

            <button
              onClick={() => setIsResumeModalOpen(true)}
              className="inline-flex items-center gap-2 font-semibold text-slate-200 bg-white/5 border border-white/15 rounded-xl px-5 py-3 text-sm hover:text-white hover:border-cyan-400/40 hover:bg-white/10 transition-all duration-300 shadow-md hover:shadow-cyan-500/20"
            >
              <FaDownload className="text-sm text-cyan-400" /> Resume Options
            </button>
          </motion.div>

          <motion.div variants={item} className="mt-9 flex items-center gap-3">
            <span className="text-sm text-slate-500 mr-1">Follow me</span>
            {Object.entries(defaultSite.socials).map(([key, social]) => {
              const Icon = socialIcons[key]
              return (
                <motion.a
                  key={key}
                  href={social.url}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={social.label}
                  whileHover={{ y: -3 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-11 h-11 grid place-items-center rounded-xl glass text-slate-300 hover:text-white hover:border-cyan-400/40 hover:shadow-[0_0_24px_-6px_rgb(34_211_238/0.5)] transition-all duration-300"
                >
                  <Icon className="text-lg" />
                </motion.a>
              )
            })}
          </motion.div>
        </motion.div>

        <HeroVisual />
      </div>

      <motion.a
        href="#about"
        aria-label="Scroll to About section"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6 }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 hidden md:flex flex-col items-center gap-2 text-slate-500 hover:text-cyan-300 transition-colors"
      >
        <span className="text-[10px] font-mono uppercase tracking-widest">Scroll</span>
        <span className="w-6 h-10 rounded-full border border-white/15 flex justify-center pt-2">
          <span className="w-1 h-1.5 rounded-full bg-cyan-400 animate-scroll-dot" />
        </span>
      </motion.a>

      <ResumeModal isOpen={isResumeModalOpen} onClose={() => setIsResumeModalOpen(false)} />
    </section>
  )
}
