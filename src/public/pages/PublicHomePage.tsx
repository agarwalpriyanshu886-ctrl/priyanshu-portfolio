import { useEffect, useState, FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FaBrain,
  FaRobot,
  FaLaptopCode,
  FaCode,
  FaDatabase,
  FaShieldAlt,
  FaLightbulb,
  FaGithub,
  FaLinkedinIn,
  FaInstagram,
  FaPaperPlane,
  FaArrowRight,
  FaGraduationCap,
  FaPaintBrush,
  FaFilm,
  FaPalette,
  FaLayerGroup,
  FaEye,
  FaCheckCircle,
  FaExclamationCircle,
  FaSpinner,
  FaExternalLinkAlt,
  FaCompressAlt,
} from 'react-icons/fa'
import { cmsService } from '../../lib/services/cmsService'
import { useDualMode } from '../../lib/mode/ModeContext'
import ModeSwitch from '../../components/ui/ModeSwitch'

// 3D Canvas Modules
import { SceneCanvas } from '../../components/three/SceneCanvas'
import { DeveloperWorld3D } from '../../components/three/DeveloperWorld3D'
import { CreativeWorld3D } from '../../components/three/CreativeWorld3D'
import { PortalTransition3D } from '../../components/three/PortalTransition3D'
import { IntroSequence } from '../../components/three/IntroSequence'

// Creative Subcomponents
import ShowreelSection from '../components/ShowreelSection'
import CreativeGalleryModal from '../components/CreativeGalleryModal'
import ResumeModal from '../../components/ui/ResumeModal'
import AcademicSlider from '../../components/ui/AcademicSlider'
import { PRIAIAgentContainer } from '../../components/ai/PRIAIAgentContainer'
import Footer from '../../components/Footer'

import {
  SiteSettings,
  HomepageSection,
  AboutProfile,
  Skill,
  Project,
  Experience,
  Education,
  CreativeTool,
  Service,
  NavigationItem,
  SocialLink,
} from '../../types/database'

export default function PublicHomePage() {
  const { mode } = useDualMode()

  // State
  const [settings, setSettings] = useState<SiteSettings | null>(null)
  const [sections, setSections] = useState<HomepageSection[]>([])
  const [devAbout, setDevAbout] = useState<AboutProfile | null>(null)
  const [creativeAbout, setCreativeAbout] = useState<AboutProfile | null>(null)
  const [skills, setSkills] = useState<Skill[]>([])
  const [projects, setProjects] = useState<Project[]>([])
  const [creativeTools, setCreativeTools] = useState<CreativeTool[]>([])
  const [experience, setExperience] = useState<Experience[]>([])
  const [education, setEducation] = useState<Education[]>([])
  const [services, setServices] = useState<Service[]>([])
  const [navItems, setNavItems] = useState<NavigationItem[]>([])
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([])

  // Modal Lightbox & AI Chatbot
  const [selectedCreativeProject, setSelectedCreativeProject] = useState<Project | null>(null)
  const [isResumeModalOpen, setIsResumeModalOpen] = useState(false)
  const [isChatOpen, setIsChatOpen] = useState(false)

  // Contact Form
  const [contactForm, setContactForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [contactErrors, setContactErrors] = useState<Record<string, string>>({})
  const [contactStatus, setContactStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [contactMsg, setContactMsg] = useState('')

  useEffect(() => {
    cmsService.recordAnalyticsEvent('PAGE_VIEW', `/?mode=${mode}`)

    const loadData = async () => {
      const [
        siteSet,
        secList,
        dAbout,
        cAbout,
        skillList,
        projList,
        toolList,
        expList,
        eduList,
        servList,
        navList,
        socialList,
      ] = await Promise.all([
        cmsService.getSiteSettings(),
        cmsService.getHomepageSections(),
        cmsService.getAboutProfile('DEVELOPER'),
        cmsService.getAboutProfile('CREATIVE'),
        cmsService.getSkills(mode === 'creative' ? 'CREATIVE' : 'DEVELOPER'),
        cmsService.getProjects(mode === 'creative' ? 'CREATIVE' : 'DEVELOPER'),
        cmsService.getCreativeTools(),
        cmsService.getExperience(true),
        cmsService.getEducation(true),
        cmsService.getServices(mode === 'creative' ? 'CREATIVE' : 'DEVELOPER'),
        cmsService.getNavigationItems(mode === 'creative' ? 'CREATIVE' : 'DEVELOPER'),
        cmsService.getSocialLinks(true),
      ])

      setSettings(siteSet)
      setSections(secList)
      setDevAbout(dAbout)
      setCreativeAbout(cAbout)
      setSkills(skillList)
      setProjects(projList)
      setCreativeTools(toolList)
      setExperience(expList)
      setEducation(eduList)
      setServices(servList)
      setNavItems(navList)
      setSocialLinks(socialList)
    }

    loadData()
  }, [mode])

  if (settings?.maintenance_mode) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 grid place-items-center mb-6 text-indigo-400">
          <FaCode className="text-2xl animate-pulse" />
        </div>
        <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight mb-3">Under Maintenance</h1>
        <p className="text-slate-400 max-w-md leading-relaxed text-sm">
          {settings.maintenance_message || 'The website is undergoing scheduled updates. Please check back shortly.'}
        </p>
      </div>
    )
  }

  const handleContactSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setContactErrors({})
    const errs: Record<string, string> = {}
    if (!contactForm.name.trim()) errs.name = 'Please enter your name.'
    if (!contactForm.email.trim() || !contactForm.email.includes('@')) errs.email = 'Valid email required.'
    if (!contactForm.subject.trim()) errs.subject = 'Subject required.'
    if (!contactForm.message.trim() || contactForm.message.length < 5) errs.message = 'Message must be at least 5 chars.'

    if (Object.keys(errs).length > 0) {
      setContactErrors(errs)
      return
    }

    setContactStatus('loading')
    const res = await cmsService.submitContactMessage({
      sender_name: contactForm.name,
      sender_email: contactForm.email,
      subject: contactForm.subject,
      message: contactForm.message,
    })

    if (res.success) {
      setContactStatus('success')
      setContactForm({ name: '', email: '', subject: '', message: '' })
      setContactMsg('Thank you! Your message was sent successfully.')
      setTimeout(() => setContactStatus('idle'), 5000)
    } else {
      setContactStatus('error')
      setContactMsg(res.error || 'Unable to submit message. Please try again.')
    }
  }

  const hybridProjects = projects.filter((p) => p.mode === 'HYBRID')

  return (
    <div
      className={`relative min-h-screen font-sans selection:bg-cyan-500 selection:text-slate-950 transition-colors duration-700 ${
        mode === 'creative' ? 'bg-slate-950 text-slate-100' : 'bg-slate-950 text-slate-100'
      }`}
    >
      {/* 3D WEBGL BACKDROP & OVERLAYS */}
      <IntroSequence />
      <PortalTransition3D />
      <SceneCanvas>{mode === 'developer' ? <DeveloperWorld3D /> : <CreativeWorld3D />}</SceneCanvas>

      {/* DYNAMIC HEADER & MODE SWITCHER */}
      <header className="fixed top-0 inset-x-0 z-40 py-4 backdrop-blur-md bg-slate-950/80 border-b border-white/10">
        <nav className="mx-auto max-w-7xl px-5 sm:px-8 flex items-center justify-between">
          <a href="#home" className="flex items-center gap-2.5 group">
            <div
              className={`w-10 h-10 rounded-xl grid place-items-center font-bold text-white text-base shadow-lg transition-transform group-hover:scale-105 ${
                mode === 'creative'
                  ? 'bg-gradient-to-br from-purple-600 to-pink-500 shadow-pink-500/20'
                  : 'bg-gradient-to-br from-indigo-500 to-cyan-500 shadow-indigo-500/20'
              }`}
            >
              PA
            </div>
            <span className="font-bold text-white text-lg tracking-tight">
              Priyanshu Agarwal
              <span className={mode === 'creative' ? 'text-pink-400' : 'text-cyan-400'}>.</span>
            </span>
          </a>

          <ul className="hidden md:flex items-center gap-6 text-sm">
            {(navItems.length > 0
              ? navItems
              : [
                  { id: '1', label: 'Home', url: '#home' },
                  { id: '2', label: 'About', url: '#about' },
                  { id: '3', label: mode === 'creative' ? 'Creative Work' : 'Skills', url: mode === 'creative' ? '#portfolio' : '#skills' },
                  { id: '4', label: mode === 'creative' ? 'Showreel' : 'Projects', url: mode === 'creative' ? '#showreel' : '#projects' },
                  { id: '5', label: 'Contact', url: '#contact' },
                ]
            ).map((item) => (
              <li key={item.id}>
                <a href={item.url} className="text-slate-300 hover:text-white transition-colors font-medium">
                  {item.label}
                </a>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsChatOpen(true)}
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-mono font-bold text-cyan-300 bg-cyan-400/10 border border-cyan-400/30 hover:border-cyan-400 hover:bg-cyan-400/20 transition-all"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" /> 🤖 PA-Bot AI
            </button>
            <ModeSwitch />
          </div>
        </nav>
      </header>

      {/* HERO SECTION */}
      <section id="home" className="relative pt-36 pb-24 lg:pt-44 lg:pb-32 overflow-hidden">
        <div className="relative mx-auto max-w-7xl px-5 sm:px-8 text-center">
          <motion.div
            key={mode}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {mode === 'developer' ? (
              <>
                <span className="inline-block text-xs font-mono uppercase tracking-widest text-cyan-400 glass rounded-full px-4 py-1.5 mb-6 border border-cyan-400/20">
                  ⚡ Developer Identity · AI/ML & Full-Stack
                </span>

                <h1 className="font-display text-4xl sm:text-6xl lg:text-7xl font-extrabold text-white tracking-tight leading-tight max-w-4xl mx-auto">
                  Hi, I'm{' '}
                  <span className="bg-gradient-to-r from-indigo-400 via-cyan-300 to-white bg-clip-text text-transparent">
                    Priyanshu Agarwal
                  </span>
                </h1>

                <p className="mt-4 text-xl sm:text-2xl text-cyan-300 font-semibold tracking-wide">
                  AI/ML Engineer & Full-Stack Developer
                </p>

                <p className="mt-6 max-w-2xl mx-auto text-slate-300 text-base sm:text-lg leading-relaxed">
                  I build intelligent, scalable software applications, robust backend systems, and modern digital products.
                </p>

                <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
                  <a
                    href="#projects"
                    className="inline-flex items-center gap-2.5 font-semibold text-white bg-gradient-to-r from-indigo-500 to-cyan-500 rounded-xl px-7 py-3.5 shadow-lg shadow-indigo-500/30 hover:shadow-cyan-500/40 hover:-translate-y-0.5 transition-all"
                  >
                    View Code Projects <FaArrowRight className="text-xs" />
                  </a>
                  <a
                    href="#contact"
                    className="inline-flex items-center gap-2 font-semibold text-slate-300 bg-slate-900/80 border border-white/15 rounded-xl px-7 py-3.5 hover:text-white hover:border-slate-700 transition-all"
                  >
                    Contact Me
                  </a>
                  <button
                    onClick={() => setIsResumeModalOpen(true)}
                    className="inline-flex items-center gap-2 font-semibold text-slate-200 bg-white/5 border border-white/15 rounded-xl px-6 py-3.5 hover:text-white hover:border-cyan-400/40 transition-all shadow-md hover:shadow-cyan-500/20"
                  >
                    Resume Options
                  </button>
                </div>
              </>
            ) : (
              <>
                <span className="inline-block text-xs font-mono uppercase tracking-widest text-pink-400 glass rounded-full px-4 py-1.5 mb-6 border border-pink-400/20">
                  ✦ Creative Identity · Design & Motion Studio
                </span>

                <h1 className="font-display text-4xl sm:text-6xl lg:text-7xl font-extrabold text-white tracking-tight leading-tight max-w-4xl mx-auto">
                  I Design.{' '}
                  <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-white bg-clip-text text-transparent">
                    I Edit. I Create.
                  </span>
                </h1>

                <p className="mt-4 text-xl sm:text-2xl text-pink-300 font-semibold tracking-wide">
                  Graphic Designer · Video Editor · Visual Artist
                </p>

                <p className="mt-6 max-w-2xl mx-auto text-slate-300 text-base sm:text-lg leading-relaxed">
                  I turn raw concepts into captivating visuals, motion graphics, video showreels, and memorable brand identities.
                </p>

                <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
                  <a
                    href="#portfolio"
                    className="inline-flex items-center gap-2.5 font-semibold text-white bg-gradient-to-r from-purple-600 to-pink-500 rounded-xl px-7 py-3.5 shadow-lg shadow-pink-500/30 hover:shadow-pink-500/40 hover:-translate-y-0.5 transition-all"
                  >
                    View Creative Work <FaArrowRight className="text-xs" />
                  </a>
                  <a
                    href="#showreel"
                    className="inline-flex items-center gap-2 font-semibold text-slate-300 bg-slate-900/80 border border-white/15 rounded-xl px-7 py-3.5 hover:text-white transition-all"
                  >
                    Watch Showreel <FaFilm className="text-xs" />
                  </a>
                </div>
              </>
            )}
          </motion.div>
        </div>
      </section>

      {/* ABOUT SECTION (MODE-AWARE) */}
      <section id="about" className="relative py-24 border-t border-white/10 bg-slate-950/60">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="text-center mb-16">
            <span
              className={`text-xs font-mono uppercase tracking-widest glass rounded-full px-3.5 py-1 mb-3 inline-block border ${
                mode === 'creative' ? 'text-pink-400 border-pink-400/20' : 'text-cyan-400 border-cyan-400/20'
              }`}
            >
              {mode === 'creative' ? 'Creative Journey' : 'Developer Profile'}
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
              {mode === 'creative' ? creativeAbout?.headline : devAbout?.headline}
            </h2>
            <p className="text-slate-400 mt-2 text-sm max-w-xl mx-auto">
              {mode === 'creative' ? creativeAbout?.subheading : devAbout?.subheading}
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-10">
            <div className="glass rounded-3xl p-8 border border-white/10 bg-slate-900/40">
              {((mode === 'creative' ? creativeAbout?.paragraphs : devAbout?.paragraphs) || []).map((para, i) => (
                <p key={i} className="text-slate-300 leading-relaxed mb-4 last:mb-0 text-sm sm:text-base">
                  {para}
                </p>
              ))}
            </div>

            <div className="glass rounded-3xl p-8 border border-white/10 bg-slate-900/40">
              <h3 className="font-semibold text-white text-lg mb-6">
                {mode === 'creative' ? 'Creative Specializations' : 'Engineering Focus Areas'}
              </h3>
              <div className="grid sm:grid-cols-2 gap-3">
                {((mode === 'creative' ? creativeAbout?.passions : devAbout?.passions) || []).map((p) => (
                  <div
                    key={p}
                    className="flex items-center gap-3 p-3.5 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 transition-all"
                  >
                    {mode === 'creative' ? (
                      <FaPaintBrush className="text-pink-400 text-base shrink-0" />
                    ) : (
                      <FaCode className="text-cyan-400 text-base shrink-0" />
                    )}
                    <span className="text-xs font-medium text-slate-200">{p}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* DEVELOPER MODE: SKILLS & PROJECTS */}
      {mode === 'developer' && (
        <>
          {/* Skills */}
          <section id="skills" className="relative py-24 border-t border-white/10">
            <div className="mx-auto max-w-7xl px-5 sm:px-8">
              <div className="text-center mb-16">
                <span className="text-xs font-mono uppercase tracking-widest text-cyan-400 glass rounded-full px-3.5 py-1 mb-3 inline-block border border-cyan-400/20">
                  Tech Stack
                </span>
                <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">Programming & AI Tools</h2>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {skills.map((skill) => (
                  <div
                    key={skill.id}
                    className="p-5 rounded-2xl bg-slate-900/60 border border-white/10 hover:border-cyan-400/40 transition-all hover:-translate-y-1"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-bold text-white text-base">{skill.name}</span>
                      <span className="text-xs font-mono text-cyan-400">{skill.proficiency}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-indigo-500 to-cyan-400 rounded-full"
                        style={{ width: `${skill.proficiency}%` }}
                      />
                    </div>
                    <span className="text-[10px] text-slate-500 font-mono mt-2 block uppercase">
                      {skill.experience_level}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Projects */}
          <section id="projects" className="relative py-24 border-t border-white/10 bg-slate-950/60">
            <div className="mx-auto max-w-7xl px-5 sm:px-8">
              <div className="text-center mb-16">
                <span className="text-xs font-mono uppercase tracking-widest text-cyan-400 glass rounded-full px-3.5 py-1 mb-3 inline-block border border-cyan-400/20">
                  Code Base
                </span>
                <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">Software & Web Projects</h2>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.map((proj) => (
                  <div
                    key={proj.id}
                    className="rounded-3xl bg-slate-900/60 border border-white/10 overflow-hidden flex flex-col justify-between hover:border-cyan-400/40 transition-all hover:-translate-y-1"
                  >
                    <div className="flex flex-col h-full justify-between">
                      <div>
                        {proj.thumbnail_url ? (
                          <div className="h-44 bg-slate-800 overflow-hidden relative">
                            <img
                              src={proj.thumbnail_url}
                              alt={proj.name}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-transparent to-transparent" />
                          </div>
                        ) : null}
                        <div className="p-6">
                          <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-mono text-cyan-400 bg-cyan-400/10 px-2.5 py-1 rounded-full">
                          {proj.category}
                        </span>
                        {proj.github_url && (
                          <a href={proj.github_url} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-white">
                            <FaGithub className="text-lg" />
                          </a>
                        )}
                      </div>
                      <h3 className="font-bold text-white text-xl mb-2">{proj.name}</h3>
                      <p className="text-slate-400 text-sm line-clamp-3 leading-relaxed mb-4">{proj.short_description}</p>
                      <div className="flex flex-wrap gap-1.5">
                        {(proj.technologies || []).map((t) => (
                          <span key={t} className="text-[10px] bg-white/5 text-slate-300 font-mono px-2 py-0.5 rounded">
                            {t}
                          </span>
                        ))}
                        </div>
                      </div>

                      <div className="p-6 pt-0">
                      <Link
                        to={`/projects/${proj.slug}`}
                        className="w-full inline-flex items-center justify-center gap-2 text-xs font-semibold text-white bg-white/5 hover:bg-cyan-500 hover:text-slate-950 border border-white/10 rounded-xl py-2.5 transition-all"
                      >
                        View Case Study <FaArrowRight className="text-[10px]" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Education Timeline */}
          <section id="education" className="relative py-24 border-t border-white/10">
            <div className="mx-auto max-w-7xl px-5 sm:px-8">
              <div className="text-center mb-16">
                <span className="text-xs font-mono uppercase tracking-widest text-cyan-400 glass rounded-full px-3.5 py-1 mb-3 inline-block border border-cyan-400/20">
                  Academic Timeline
                </span>
                <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">Education Timeline</h2>
              </div>

              <AcademicSlider items={education} />
            </div>
          </section>
        </>
      )}

      {/* CREATIVE MODE: SHOWREEL, PORTFOLIO & TOOLS */}
      {mode === 'creative' && (
        <>
          <ShowreelSection />

          {/* Creative Portfolio Gallery */}
          <section id="portfolio" className="relative py-24 border-t border-white/10">
            <div className="mx-auto max-w-7xl px-5 sm:px-8">
              <div className="text-center mb-16">
                <span className="text-xs font-mono uppercase tracking-widest text-pink-400 glass rounded-full px-3.5 py-1 mb-3 inline-block border border-pink-400/20">
                  Visual Gallery
                </span>
                <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">Design & Motion Portfolio</h2>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.map((proj) => (
                  <div
                    key={proj.id}
                    onClick={() => setSelectedCreativeProject(proj)}
                    className="group rounded-3xl bg-slate-900/60 border border-white/10 overflow-hidden cursor-pointer hover:border-pink-500/50 transition-all hover:-translate-y-1 flex flex-col justify-between"
                  >
                    <div>
                      {proj.thumbnail_url ? (
                        <div className="h-48 bg-slate-800 overflow-hidden relative">
                          <img
                            src={proj.thumbnail_url}
                            alt={proj.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                      ) : (
                        <div className="h-48 bg-gradient-to-br from-purple-900/40 to-pink-900/40 grid place-items-center">
                          <FaPalette className="text-4xl text-pink-400/50" />
                        </div>
                      )}
                      <div className="p-6">
                        <span className="text-xs font-mono text-pink-400 bg-pink-400/10 px-2.5 py-1 rounded-full">
                          {proj.category}
                        </span>
                        <h3 className="font-bold text-white text-xl mt-2 mb-1">{proj.name}</h3>
                        <p className="text-slate-400 text-sm line-clamp-2 leading-relaxed">{proj.short_description}</p>
                      </div>
                    </div>

                    <div className="p-6 pt-0">
                      <button className="w-full inline-flex items-center justify-center gap-2 text-xs font-semibold text-white bg-white/5 group-hover:bg-pink-600 rounded-xl py-2.5 transition-all">
                        View Project Lightbox <FaEye className="text-xs" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Creative Tools */}
          <section id="tools" className="relative py-24 border-t border-white/10 bg-slate-950/60">
            <div className="mx-auto max-w-7xl px-5 sm:px-8">
              <div className="text-center mb-16">
                <span className="text-xs font-mono uppercase tracking-widest text-pink-400 glass rounded-full px-3.5 py-1 mb-3 inline-block border border-pink-400/20">
                  Software Stack
                </span>
                <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">Creative Software Tools</h2>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {creativeTools.map((tool) => (
                  <div
                    key={tool.id}
                    className="p-5 rounded-2xl bg-slate-900/60 border border-white/10 hover:border-pink-500/40 transition-all hover:-translate-y-1"
                  >
                    <span className="text-xs font-mono text-pink-400 block mb-1">{tool.category}</span>
                    <h4 className="font-bold text-white text-base mb-3">{tool.name}</h4>
                    <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-purple-600 to-pink-500 rounded-full"
                        style={{ width: `${tool.proficiency_level}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </>
      )}

      {/* HYBRID SHOWCASE (CODE × DESIGN) */}
      {hybridProjects.length > 0 && (
        <section className="relative py-24 border-t border-white/10 bg-gradient-to-b from-slate-950 via-indigo-950/20 to-slate-950">
          <div className="mx-auto max-w-7xl px-5 sm:px-8">
            <div className="text-center mb-16">
              <span className="text-xs font-mono uppercase tracking-widest text-amber-400 glass rounded-full px-4 py-1.5 mb-3 inline-block border border-amber-400/20">
                CODE × DESIGN HYBRID SHOWCASE
              </span>
              <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
                Where Technology Meets Creativity
              </h2>
              <p className="text-slate-400 text-sm mt-2 max-w-xl mx-auto">
                Signature projects that combine full-stack code engineering with bespoke visual design & branding.
              </p>
            </div>

            <div className="grid gap-8">
              {hybridProjects.map((p) => (
                <div
                  key={p.id}
                  className="rounded-3xl bg-slate-900/80 border border-amber-400/30 p-8 shadow-2xl space-y-6"
                >
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
                    <div>
                      <span className="text-xs font-mono text-amber-400 font-bold uppercase tracking-widest">
                        Hybrid Feature Case
                      </span>
                      <h3 className="text-2xl font-bold text-white mt-1">{p.name}</h3>
                    </div>
                    {p.live_demo_url && (
                      <a
                        href={p.live_demo_url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-xl px-5 py-2.5 transition-all shadow-lg shadow-amber-400/20"
                      >
                        Explore Project <FaExternalLinkAlt className="text-[10px]" />
                      </a>
                    )}
                  </div>

                  <p className="text-slate-300 text-sm leading-relaxed">{p.short_description}</p>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 space-y-2">
                      <h4 className="text-xs font-bold text-indigo-300 uppercase tracking-wider">
                        ⚡ Code & Engineering Side
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {(p.developer_highlights || ['React', 'Supabase', 'Database Architecture', 'RBAC']).map((h) => (
                          <span key={h} className="text-xs font-mono bg-indigo-400/20 text-indigo-200 px-3 py-1 rounded-lg">
                            {h}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="p-4 rounded-2xl bg-pink-500/10 border border-pink-500/20 space-y-2">
                      <h4 className="text-xs font-bold text-pink-300 uppercase tracking-wider">
                        ✦ Visual & Creative Side
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {(p.creative_highlights || ['Brand Identity', 'UI Design', 'Visual Assets', 'Motion']).map((h) => (
                          <span key={h} className="text-xs font-mono bg-pink-400/20 text-pink-200 px-3 py-1 rounded-lg">
                            {h}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CONTACT SECTION */}
      <section id="contact" className="relative py-24 border-t border-white/10 bg-slate-950/60">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <div className="text-center mb-16">
            <span
              className={`text-xs font-mono uppercase tracking-widest glass rounded-full px-3.5 py-1 mb-3 inline-block border ${
                mode === 'creative' ? 'text-pink-400 border-pink-400/20' : 'text-cyan-400 border-cyan-400/20'
              }`}
            >
              Get In Touch
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
              {mode === 'creative' ? "Let's create something memorable" : "Let's build intelligent software"}
            </h2>
          </div>

          <div className="grid lg:grid-cols-2 gap-10">
            <div className="glass rounded-3xl p-8 border border-white/10 space-y-6">
              <h3 className="text-xl font-bold text-white">Contact Information</h3>
              <div className="space-y-4">
                {settings?.email && (
                  <a
                    href={`mailto:${settings.email}`}
                    className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 transition-all"
                  >
                    <span className="text-sm font-semibold text-white">{settings.email}</span>
                  </a>
                )}
                {settings?.phone && (
                  <a
                    href={`tel:${settings.phone}`}
                    className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 transition-all"
                  >
                    <span className="text-sm font-semibold text-white">{settings.phone}</span>
                  </a>
                )}
              </div>
            </div>

            <form onSubmit={handleContactSubmit} noValidate className="glass rounded-3xl p-8 border border-white/10 space-y-4">
              {contactStatus === 'success' && (
                <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
                  <FaCheckCircle className="shrink-0 text-sm" />
                  <span>{contactMsg}</span>
                </div>
              )}

              {contactStatus === 'error' && (
                <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                  <FaExclamationCircle className="shrink-0 text-sm" />
                  <span>{contactMsg}</span>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Your Name</label>
                  <input
                    type="text"
                    value={contactForm.name}
                    onChange={(e) => setContactForm((f) => ({ ...f, name: e.target.value }))}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-white/30"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Your Email</label>
                  <input
                    type="email"
                    value={contactForm.email}
                    onChange={(e) => setContactForm((f) => ({ ...f, email: e.target.value }))}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-white/30"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1">Subject</label>
                <input
                  type="text"
                  value={contactForm.subject}
                  onChange={(e) => setContactForm((f) => ({ ...f, subject: e.target.value }))}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-white/30"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1">Message</label>
                <textarea
                  rows={4}
                  value={contactForm.message}
                  onChange={(e) => setContactForm((f) => ({ ...f, message: e.target.value }))}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-white/30"
                />
              </div>

              <button
                type="submit"
                disabled={contactStatus === 'loading'}
                className={`w-full inline-flex items-center justify-center gap-2 font-semibold text-white rounded-xl py-3.5 shadow-lg transition-all ${
                  mode === 'creative'
                    ? 'bg-gradient-to-r from-purple-600 to-pink-500 shadow-pink-500/20'
                    : 'bg-gradient-to-r from-indigo-500 to-cyan-500 shadow-indigo-500/20'
                }`}
              >
                {contactStatus === 'loading' ? (
                  <>
                    <FaSpinner className="animate-spin" /> Sending...
                  </>
                ) : (
                  <>
                    Send Message <FaPaperPlane className="text-xs" />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* FOOTER SECTION */}
      <Footer />

      {/* LIGHTBOX MODAL */}
      {selectedCreativeProject && (
        <CreativeGalleryModal project={selectedCreativeProject} onClose={() => setSelectedCreativeProject(null)} />
      )}

      {/* RESUME OPTIONS MODAL */}
      <ResumeModal isOpen={isResumeModalOpen} onClose={() => setIsResumeModalOpen(false)} />

      {/* PRIAI 3D ROBOT AI AGENT CONTAINER */}
      <PRIAIAgentContainer />
    </div>
  )
}
