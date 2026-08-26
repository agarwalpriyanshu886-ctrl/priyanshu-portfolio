import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FaPaperPlane,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaCheckCircle,
  FaExclamationCircle,
  FaGithub,
  FaLinkedinIn,
  FaInstagram,
  FaSpinner,
} from 'react-icons/fa'
import { site } from '../data/site'
import { getActiveKnowledge } from '../lib/public-ai/cmsKnowledgeStore'
import SectionHeading from './ui/SectionHeading'
import Reveal from './ui/Reveal'

const socialIcons = {
  github: FaGithub,
  linkedin: FaLinkedinIn,
  instagram: FaInstagram,
}

const initialForm = { name: '', email: '', subject: '', message: '' }

export default function Contact() {
  const [form, setForm] = useState(initialForm)
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState(null)
  const [contactInfo, setContactInfo] = useState({
    email: site.email,
    phone: site.phone,
    location: site.location,
    socials: site.socials,
  })

  useEffect(() => {
    const updateContact = () => {
      const active = getActiveKnowledge()
      if (active && active.profile) {
        setContactInfo({
          email: active.profile.contactEmail || site.email,
          phone: active.profile.contactPhone || site.phone,
          location: active.profile.location || site.location,
          socials: {
            github: { label: 'GitHub', url: active.profile.github || 'https://github.com/agarwalpriyanshu886-ctrl' },
            linkedin: { label: 'LinkedIn', url: active.profile.linkedin || 'https://linkedin.com' },
            instagram: { label: 'Instagram', url: active.profile.instagram || 'https://instagram.com/priyanshu0.112' },
          },
        })
      }
    }

    updateContact()
    window.addEventListener('cms_knowledge_updated', updateContact)
    window.addEventListener('storage', updateContact)
    return () => {
      window.removeEventListener('cms_knowledge_updated', updateContact)
      window.removeEventListener('storage', updateContact)
    }
  }, [])

  const validate = () => {
    const next = {}
    if (!form.name.trim()) next.name = 'Please enter your name.'
    if (!form.email.trim()) next.email = 'Please enter your email.'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      next.email = 'Please enter a valid email address.'
    if (!form.subject.trim()) next.subject = 'Please add a subject.'
    if (!form.message.trim()) next.message = 'Please write a message.'
    else if (form.message.trim().length < 10)
      next.message = 'Message should be at least 10 characters.'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((f) => ({ ...f, [name]: value }))
    if (errors[name]) setErrors((er) => ({ ...er, [name]: undefined }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!validate()) return
    setStatus('loading')
    setTimeout(() => {
      setStatus('success')
      setForm(initialForm)
      setErrors({})
      setTimeout(() => setStatus(null), 5000)
    }, 1200)
  }

  const fieldCls = (name) =>
    `w-full bg-white/[0.04] border rounded-xl px-4 py-3 text-sm text-white placeholder:text-slate-600 outline-none transition-all duration-300 focus:bg-white/[0.06] ${
      errors[name]
        ? 'border-rose-500/60 focus:border-rose-400 focus:ring-2 focus:ring-rose-500/20'
        : 'border-white/10 focus:border-cyan-400/60 focus:ring-2 focus:ring-cyan-500/20'
    }`

  return (
    <section id="contact" className="relative py-12 lg:py-16 overflow-hidden">
      <div className="absolute bottom-0 left-1/4 w-[32rem] h-[32rem] rounded-full bg-indigo-600/12 blur-3xl pointer-events-none" />

      <div className="relative mx-auto max-w-6xl px-5 sm:px-8">
        <SectionHeading
          eyebrow="Contact"
          title="Let's build something"
          highlight="amazing"
          description="Have a project, an opportunity or just want to say hi? My inbox is always open."
        />

        <div className="grid lg:grid-cols-[0.9fr_1.1fr] gap-8">
          <Reveal>
            <div className="glass rounded-3xl p-7 sm:p-8 h-full">
              <h3 className="font-display font-semibold text-white text-xl mb-6">Get in touch</h3>

              <div className="space-y-4 mb-8">
                <a
                  href={`mailto:${contactInfo.email}`}
                  className="flex items-center gap-4 glass rounded-2xl p-4 hover:border-cyan-400/30 hover:-translate-y-0.5 transition-all duration-300 group"
                >
                  <span className="w-11 h-11 grid place-items-center rounded-xl bg-gradient-to-br from-indigo-500/30 to-cyan-500/30 text-cyan-300 text-lg group-hover:from-indigo-500 group-hover:to-cyan-500 group-hover:text-white transition-all duration-300">
                    <FaEnvelope />
                  </span>
                  <div>
                    <p className="text-xs text-slate-500 font-mono uppercase tracking-widest">Email</p>
                    <p className="text-sm text-white">{contactInfo.email}</p>
                  </div>
                </a>

                {contactInfo.phone && (
                  <a
                    href={`tel:${contactInfo.phone}`}
                    className="flex items-center gap-4 glass rounded-2xl p-4 hover:border-cyan-400/30 hover:-translate-y-0.5 transition-all duration-300 group"
                  >
                    <span className="w-11 h-11 grid place-items-center rounded-xl bg-gradient-to-br from-emerald-500/30 to-cyan-500/30 text-emerald-300 text-lg group-hover:from-emerald-500 group-hover:to-cyan-500 group-hover:text-white transition-all duration-300">
                      <FaPhone />
                    </span>
                    <div>
                      <p className="text-xs text-slate-500 font-mono uppercase tracking-widest">Phone</p>
                      <p className="text-sm text-white">{contactInfo.phone}</p>
                    </div>
                  </a>
                )}

                <div className="flex items-center gap-4 glass rounded-2xl p-4">
                  <span className="w-11 h-11 grid place-items-center rounded-xl bg-gradient-to-br from-violet-500/30 to-indigo-500/30 text-violet-300 text-lg">
                    <FaMapMarkerAlt />
                  </span>
                  <div>
                    <p className="text-xs text-slate-500 font-mono uppercase tracking-widest">Location</p>
                    <p className="text-sm text-white">{contactInfo.location}</p>
                  </div>
                </div>
              </div>

              <p className="text-sm text-slate-500 mb-4">Or find me here</p>
              <div className="flex gap-3">
                {Object.entries(contactInfo.socials).map(([key, social]) => {
                  const Icon = socialIcons[key] || FaGithub
                  return (
                    <motion.a
                      key={key}
                      href={social.url}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={social.label}
                      whileHover={{ y: -3 }}
                      className="w-11 h-11 grid place-items-center rounded-xl glass text-slate-300 hover:text-white hover:border-cyan-400/40 hover:shadow-[0_0_24px_-6px_rgb(34_211_238/0.5)] transition-all duration-300"
                    >
                      <Icon className="text-lg" />
                    </motion.a>
                  )
                })}
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <form onSubmit={handleSubmit} noValidate className="glass rounded-3xl p-7 sm:p-8">
              <div className="grid sm:grid-cols-2 gap-4 mb-4">
                <div>
                  <label htmlFor="name" className="block text-sm text-slate-400 mb-1.5">
                    Name
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Your name"
                    className={fieldCls('name')}
                    autoComplete="name"
                  />
                  {errors.name && (
                    <p className="mt-1.5 text-xs text-rose-400 flex items-center gap-1">
                      <FaExclamationCircle /> {errors.name}
                    </p>
                  )}
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm text-slate-400 mb-1.5">
                    Email
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    className={fieldCls('email')}
                    autoComplete="email"
                  />
                  {errors.email && (
                    <p className="mt-1.5 text-xs text-rose-400 flex items-center gap-1">
                      <FaExclamationCircle /> {errors.email}
                    </p>
                  )}
                </div>
              </div>

              <div className="mb-4">
                <label htmlFor="subject" className="block text-sm text-slate-400 mb-1.5">
                  Subject
                </label>
                <input
                  id="subject"
                  name="subject"
                  type="text"
                  value={form.subject}
                  onChange={handleChange}
                  placeholder="What's this about?"
                  className={fieldCls('subject')}
                />
                {errors.subject && (
                  <p className="mt-1.5 text-xs text-rose-400 flex items-center gap-1">
                    <FaExclamationCircle /> {errors.subject}
                  </p>
                )}
              </div>

              <div className="mb-6">
                <label htmlFor="message" className="block text-sm text-slate-400 mb-1.5">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={5}
                  value={form.message}
                  onChange={handleChange}
                  placeholder="Tell me about your project..."
                  className={`${fieldCls('message')} resize-none`}
                />
                {errors.message && (
                  <p className="mt-1.5 text-xs text-rose-400 flex items-center gap-1">
                    <FaExclamationCircle /> {errors.message}
                  </p>
                )}
              </div>

              <motion.button
                type="submit"
                disabled={status === 'loading'}
                whileTap={{ scale: 0.98 }}
                className="w-full inline-flex items-center justify-center gap-2 font-semibold text-white bg-gradient-to-r from-indigo-500 to-cyan-500 rounded-xl px-6 py-3.5 shadow-[0_8px_30px_-8px_rgb(99_102_241/0.6)] hover:shadow-[0_8px_36px_-6px_rgb(34_211_238/0.5)] hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-70 disabled:hover:translate-y-0"
              >
                {status === 'loading' ? (
                  <>
                    <FaSpinner className="animate-spin" /> Sending...
                  </>
                ) : (
                  <>
                    Send Message <FaPaperPlane className="text-sm" />
                  </>
                )}
              </motion.button>

              <AnimatePresence>
                {status === 'success' && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="mt-4 flex items-center gap-2.5 glass rounded-xl px-4 py-3 text-sm text-emerald-300 border border-emerald-400/30"
                    role="status"
                  >
                    <FaCheckCircle /> Thank you! Your message was sent successfully. I'll get back to you soon.
                  </motion.div>
                )}
              </AnimatePresence>
            </form>
          </Reveal>
        </div>
      </div>
    </section>
  )
}