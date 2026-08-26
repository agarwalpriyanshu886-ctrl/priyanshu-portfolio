import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaBars, FaTimes, FaCode, FaPaperPlane } from 'react-icons/fa'
import { site } from '../data/site'
import { getActiveKnowledge } from '../lib/public-ai/cmsKnowledgeStore'

const navItems = [
  { id: 'home', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'skills', label: 'Skills' },
  { id: 'projects', label: 'Projects' },
  { id: 'experience', label: 'Experience' },
  { id: 'education', label: 'Education' },
  { id: 'certifications', label: 'Certifications' },
  { id: 'contact', label: 'Contact' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [active, setActive] = useState('home')
  const [brand, setBrand] = useState({
    name: site.name,
    initials: site.initials,
  })

  useEffect(() => {
    const updateBrand = () => {
      const kb = getActiveKnowledge()
      if (kb && kb.profile && kb.profile.name) {
        setBrand({
          name: kb.profile.name,
          initials: kb.profile.name
            .split(' ')
            .map((n) => n[0])
            .join('')
            .toUpperCase(),
        })
      }
    }

    updateBrand()
    window.addEventListener('cms_knowledge_updated', updateBrand)
    window.addEventListener('storage', updateBrand)
    return () => {
      window.removeEventListener('cms_knowledge_updated', updateBrand)
      window.removeEventListener('storage', updateBrand)
    }
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
      const sections = navItems.map((item) => document.getElementById(item.id))
      const scrollPos = window.scrollY + 200

      sections.forEach((sec) => {
        if (!sec) return
        const top = sec.offsetTop
        const height = sec.offsetHeight
        if (scrollPos >= top && scrollPos < top + height) {
          setActive(sec.id)
        }
      })
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled ? 'py-3 backdrop-blur-md bg-slate-950/80 border-b border-white/5 shadow-lg' : 'py-5 bg-transparent'
      }`}
    >
      <nav className="mx-auto max-w-7xl px-5 sm:px-8 flex items-center justify-between">
        <a href="#home" className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-cyan-500 grid place-items-center font-bold text-white text-base shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform">
            {brand.initials}
          </div>
          <span className="font-bold text-white text-lg tracking-tight">
            {brand.name}
            <span className="text-cyan-400">.</span>
          </span>
        </a>

        <ul className="hidden md:flex items-center gap-6 text-sm">
          {navItems.map((item) => (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                className={`transition-colors font-medium ${
                  active === item.id ? 'text-cyan-400 font-semibold' : 'text-slate-400 hover:text-white'
                }`}
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="hidden md:flex items-center gap-3">
          <a
            href="#contact"
            className="inline-flex items-center gap-2 text-xs font-semibold text-white bg-gradient-to-r from-indigo-500 to-cyan-500 rounded-full px-5 py-2.5 shadow-lg shadow-indigo-500/25 hover:shadow-cyan-500/30 transition-all hover:-translate-y-0.5"
          >
            Contact Me <FaPaperPlane className="text-[10px]" />
          </a>
        </div>

        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden text-slate-300 hover:text-white p-2"
          aria-label="Toggle Navigation"
        >
          {isOpen ? <FaTimes className="text-xl" /> : <FaBars className="text-xl" />}
        </button>
      </nav>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-slate-950/95 border-b border-white/10 overflow-hidden px-6 py-4"
          >
            <ul className="flex flex-col gap-3 text-sm">
              {navItems.map((item) => (
                <li key={item.id}>
                  <a
                    href={`#${item.id}`}
                    onClick={() => setIsOpen(false)}
                    className="block py-1 text-slate-300 hover:text-cyan-400 font-medium"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
