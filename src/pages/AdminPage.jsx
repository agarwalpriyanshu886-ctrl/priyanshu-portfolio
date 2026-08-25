import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FaLock,
  FaEnvelope,
  FaShieldAlt,
  FaSignOutAlt,
  FaProjectDiagram,
  FaCode,
  FaGraduationCap,
  FaBriefcase,
  FaRobot,
  FaDatabase,
  FaCheckCircle,
  FaArrowLeft,
  FaPlus,
  FaTrash,
  FaSave,
  FaUndo,
  FaUser,
  FaSlidersH,
  FaExternalLinkAlt,
  FaQuestionCircle,
  FaRocket,
  FaChartBar,
  FaAward,
  FaEye,
  FaEyeSlash,
  FaArrowUp,
  FaArrowDown,
  FaLayerGroup,
  FaSearch,
  FaTimes,
  FaPalette,
  FaTachometerAlt,
  FaChevronRight,
} from 'react-icons/fa'
import { Link } from 'react-router-dom'
import { getActiveKnowledge, saveActiveKnowledge, resetCMSKnowledgeToDefault } from '../lib/public-ai/cmsKnowledgeStore'
import { isSupabaseConfigured } from '../lib/supabase'
import Typewriter from '../components/ui/Typewriter'
import { SkillIcon, CategoryIcon, AVAILABLE_SKILL_ICONS, AVAILABLE_CATEGORY_ICONS } from '../components/ui/SkillIcon'

const COLOR_ACCENTS = [
  { name: 'Indigo', code: '#6366f1' },
  { name: 'Cyan', code: '#22d3ee' },
  { name: 'Emerald', code: '#34d399' },
  { name: 'Purple', code: '#a78bfa' },
  { name: 'Amber', code: '#fbbf24' },
  { name: 'Rose', code: '#f43f5e' },
  { name: 'Pink', code: '#ec4899' },
]

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [email, setEmail] = useState('admin@priyanshu.com')
  const [password, setPassword] = useState('')
  const [loginError, setLoginError] = useState('')

  // CMS State
  const [kb, setKb] = useState(getActiveKnowledge())
  const [activeTab, setActiveTab] = useState('dashboard')
  const [saveSuccess, setSaveSuccess] = useState(false)

  // Icon / Logo Picker Modal State
  const [pickerModal, setPickerModal] = useState({
    open: false,
    type: 'skill',
    catIdx: 0,
    skillIdx: 0,
  })
  const [iconSearch, setIconSearch] = useState('')
  const [customLogoUrl, setCustomLogoUrl] = useState('')

  // Input states for adding new items
  const [newRoleString, setNewRoleString] = useState('')
  const [newSkillNames, setNewSkillNames] = useState({})
  const [newSkillLevels, setNewSkillLevels] = useState({})
  const [newCatLabel, setNewCatLabel] = useState('')
  const [newFaqQ, setNewFaqQ] = useState('')
  const [newFaqA, setNewFaqA] = useState('')

  useEffect(() => {
    setKb(getActiveKnowledge())
  }, [])

  const handleLogin = (e) => {
    e.preventDefault()
    if (email === 'admin@priyanshu.com' && (password === 'admin123' || password === 'admin' || password.length >= 4)) {
      setIsAuthenticated(true)
      setLoginError('')
    } else {
      setLoginError('Invalid credentials. Use admin@priyanshu.com / admin123')
    }
  }

  const handleSaveAll = () => {
    saveActiveKnowledge(kb)
    setSaveSuccess(true)
    setTimeout(() => setSaveSuccess(false), 2500)
  }

  const handleAddCategory = () => {
    const label = newCatLabel.trim() || `New Category ${(kb.skillCategories?.length || 0) + 1}`
    const newCat = {
      id: `cat_${Date.now()}`,
      label: label,
      icon: 'code',
      accent: '#a78bfa',
      skills: [
        { name: 'Sample Technology 1', level: 85, icon: 'SiPython' },
        { name: 'Sample Technology 2', level: 75, icon: 'SiReact' },
      ],
    }
    const updatedCategories = [...(kb.skillCategories || []), newCat]
    const updatedKb = { ...kb, skillCategories: updatedCategories }
    setKb(updatedKb)
    saveActiveKnowledge(updatedKb)
    setNewCatLabel('')
    setSaveSuccess(true)
    setTimeout(() => setSaveSuccess(false), 2000)
  }

  const handleSelectIcon = (iconId) => {
    const { type, catIdx, skillIdx } = pickerModal
    const updatedCats = [...(kb.skillCategories || [])]

    if (type === 'category') {
      updatedCats[catIdx].icon = iconId
    } else if (type === 'skill' && skillIdx !== undefined) {
      updatedCats[catIdx].skills[skillIdx].icon = iconId
    }

    const updatedKb = { ...kb, skillCategories: updatedCats }
    setKb(updatedKb)
    saveActiveKnowledge(updatedKb)
    setPickerModal({ ...pickerModal, open: false })
    setIconSearch('')
    setCustomLogoUrl('')
  }

  const hero = kb.hero || {
    greetingPill: '• Hi, I\'m Priyanshu Agarwal — Engineering student @ NIMS University Jaipur',
    firstName: 'Priyanshu',
    lastName: 'Agarwal',
    roles: ['AI/ML Student', 'Programmer', 'Full-Stack Developer', 'Graphic Designer', 'Video Editor', 'Visual Artist'],
    typingSpeed: 70,
    deletingSpeed: 40,
    pauseDuration: 1600,
    shortDescription: 'I build intelligent, scalable and visually impressive digital experiences using AI, modern web technologies and software engineering.',
    primaryCtaLabel: 'View My Projects',
    primaryCtaHref: '#projects',
    secondaryCtaLabel: 'Contact Me',
    secondaryCtaHref: '#contact',
    codeSnippet: 'def build(idea):\n    return ai + web',
  }

  const stats = kb.stats || [
    { id: 'stat-1', label: 'Projects Completed', value: 15, suffix: '+' },
    { id: 'stat-2', label: 'Technologies Learned', value: 20, suffix: '+' },
    { id: 'stat-3', label: 'Certifications', value: 8, suffix: '+' },
    { id: 'stat-4', label: 'Years of Learning', value: 3, suffix: '+' },
  ]

  const certifications = kb.certifications || [
    {
      id: 'cert-1',
      title: 'Python for Data Science & AI',
      organization: 'IBM / Coursera',
      date: '2024',
      url: 'https://coursera.org',
      description: 'Covered Python fundamentals, Pandas, NumPy, and data manipulation libraries for machine learning workflows.',
    },
  ]

  const layoutConfig = kb.layoutConfig || {
    preset: 'compact',
    sections: [
      { id: 'hero', name: 'Hero Section', enabled: true, paddingTopRem: 1, paddingBottomRem: 1 },
      { id: 'about', name: 'About & Stats Section', enabled: true, paddingTopRem: 2, paddingBottomRem: 2 },
      { id: 'skills', name: 'Technical Skills Section', enabled: true, paddingTopRem: 2, paddingBottomRem: 2 },
      { id: 'projects', name: 'Projects Catalog Section', enabled: true, paddingTopRem: 2, paddingBottomRem: 2 },
      { id: 'experience', name: 'Work Experience Section', enabled: true, paddingTopRem: 2, paddingBottomRem: 2 },
      { id: 'education', name: 'Academic Journey Section', enabled: true, paddingTopRem: 2, paddingBottomRem: 2 },
      { id: 'certifications', name: 'Certifications Section', enabled: true, paddingTopRem: 2, paddingBottomRem: 2 },
      { id: 'github', name: 'GitHub Activity Section', enabled: true, paddingTopRem: 2, paddingBottomRem: 2 },
      { id: 'contact', name: 'Contact Form Section', enabled: true, paddingTopRem: 2, paddingBottomRem: 2 },
    ],
  }

  const filteredIcons = (pickerModal.type === 'category' ? AVAILABLE_CATEGORY_ICONS : AVAILABLE_SKILL_ICONS).filter((item) =>
    item.name.toLowerCase().includes(iconSearch.toLowerCase()) || item.id.toLowerCase().includes(iconSearch.toLowerCase())
  )

  // 1. ADMIN LOGIN VIEW (Executive Minimalist Style)
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#070a12] text-slate-100 flex flex-col justify-center items-center p-4 relative overflow-hidden font-sans">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none" />

        <Link
          to="/"
          className="absolute top-6 left-6 flex items-center gap-2 text-xs font-medium text-slate-400 hover:text-white transition-colors bg-slate-900/80 px-3.5 py-2 rounded-lg border border-slate-800"
        >
          <FaArrowLeft /> Return to Live Portfolio
        </Link>

        <motion.div
          initial={{ opacity: 0, scale: 0.98, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          className="w-full max-w-sm bg-[#0f172a]/90 border border-slate-800 rounded-2xl p-7 shadow-2xl backdrop-blur-xl relative z-10"
        >
          <div className="text-center mb-6">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-cyan-500 grid place-items-center mx-auto mb-3.5 text-slate-950 font-bold text-lg shadow-md">
              PA
            </div>
            <h2 className="text-lg font-bold text-white tracking-tight">Executive Studio CMS</h2>
            <p className="text-xs text-slate-400 mt-1">Authorized Content Management Console</p>
          </div>

          {loginError && (
            <div className="mb-5 p-3 rounded-lg bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs text-center font-medium">
              {loginError}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">Account Email</label>
              <div className="relative">
                <FaEnvelope className="absolute left-3.5 top-3.5 text-slate-500 text-xs" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#070a12] border border-slate-800 rounded-xl pl-9 pr-3.5 py-2.5 text-xs text-white outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/40"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">Security Passcode</label>
              <div className="relative">
                <FaLock className="absolute left-3.5 top-3.5 text-slate-500 text-xs" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="admin123"
                  className="w-full bg-[#070a12] border border-slate-800 rounded-xl pl-9 pr-3.5 py-2.5 text-xs text-white outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/40"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs tracking-wide transition-all shadow-md mt-2"
            >
              Sign In to Console
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-slate-800/80 text-center">
            <p className="text-[11px] text-slate-500">
              Demo Console Access: <br />
              <span className="text-indigo-400 font-mono">admin@priyanshu.com</span> / <span className="text-indigo-400 font-mono">admin123</span>
            </p>
          </div>
        </motion.div>
      </div>
    )
  }

  // 2. ADMIN CMS DASHBOARD VIEW (Vercel/Linear Professional Style)
  return (
    <div className="min-h-screen bg-[#070a12] text-slate-200 flex flex-col font-sans relative">
      {/* Icon / Logo Selection Modal */}
      <AnimatePresence>
        {pickerModal.open && (
          <div className="fixed inset-0 z-[100] bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.97 }}
              className="bg-[#0f172a] border border-slate-800 rounded-2xl p-6 w-full max-w-xl max-h-[85vh] flex flex-col shadow-2xl"
            >
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div>
                  <h3 className="font-bold text-white text-sm flex items-center gap-2">
                    <FaPalette className="text-indigo-400" /> Choose {pickerModal.type === 'category' ? 'Category Icon' : 'Technology Logo'}
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">Click any logo icon to apply to your skill item</p>
                </div>
                <button
                  type="button"
                  onClick={() => setPickerModal({ ...pickerModal, open: false })}
                  className="p-2 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
                >
                  <FaTimes />
                </button>
              </div>

              {/* Search & Custom URL */}
              <div className="space-y-3 py-4">
                <div className="relative">
                  <FaSearch className="absolute left-3.5 top-3.5 text-slate-500 text-xs" />
                  <input
                    type="text"
                    placeholder="Search technology logo by name (Python, React, SQL)..."
                    value={iconSearch}
                    onChange={(e) => setIconSearch(e.target.value)}
                    className="w-full bg-[#070a12] border border-slate-800 rounded-xl pl-9 pr-3.5 py-2 text-xs text-white outline-none focus:border-indigo-500"
                  />
                </div>

                {pickerModal.type === 'skill' && (
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      placeholder="Paste Custom Image Logo URL (https://...)..."
                      value={customLogoUrl}
                      onChange={(e) => setCustomLogoUrl(e.target.value)}
                      className="flex-1 bg-[#070a12] border border-slate-800 rounded-xl px-3 py-2 text-xs text-indigo-300 outline-none focus:border-indigo-500 font-mono"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (customLogoUrl.trim()) handleSelectIcon(customLogoUrl.trim())
                      }}
                      className="bg-indigo-600 hover:bg-indigo-500 text-white font-medium px-3.5 py-2 rounded-xl text-xs"
                    >
                      Apply URL
                    </button>
                  </div>
                )}
              </div>

              {/* Grid Selector */}
              <div className="flex-1 overflow-y-auto pr-1 grid grid-cols-4 sm:grid-cols-5 gap-2.5">
                {filteredIcons.map((item) => {
                  const IconComp = item.icon
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => handleSelectIcon(item.id)}
                      className="flex flex-col items-center justify-center p-3 rounded-xl bg-[#070a12] border border-slate-800/80 hover:border-indigo-500 hover:bg-indigo-500/10 transition-all text-center group"
                    >
                      <IconComp className="text-xl text-indigo-400 group-hover:scale-110 transition-transform mb-1.5" />
                      <span className="text-[11px] font-medium text-slate-300 line-clamp-1">{item.name}</span>
                    </button>
                  )
                })}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Top Navbar Header */}
      <header className="border-b border-slate-800/80 bg-[#0b0f19]/90 backdrop-blur-md px-6 py-3.5 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 grid place-items-center text-white font-bold font-display text-xs shadow-sm">
            PA
          </div>
          <div className="flex items-center gap-2">
            <span className="font-bold text-white text-xs tracking-tight">Executive Studio Console</span>
            <span className="text-slate-600 text-xs">/</span>
            <span className="text-xs font-medium text-indigo-400 capitalize">{activeTab}</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {saveSuccess && (
            <span className="text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-lg flex items-center gap-1.5">
              <FaCheckCircle /> Saved & Updated Live
            </span>
          )}

          <button
            onClick={handleSaveAll}
            className="flex items-center gap-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 px-4 py-2 rounded-lg transition-all shadow-sm"
          >
            <FaSave /> Save Changes
          </button>

          <button
            onClick={resetCMSKnowledgeToDefault}
            title="Reset data to defaults"
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white text-xs border border-slate-700"
          >
            <FaUndo />
          </button>

          <Link
            to="/"
            target="_blank"
            className="text-xs text-slate-300 hover:text-white bg-slate-800/60 border border-slate-700 px-3 py-2 rounded-lg transition-all flex items-center gap-1.5"
          >
            Preview Site <FaExternalLinkAlt className="text-[10px]" />
          </Link>

          <button
            onClick={() => setIsAuthenticated(false)}
            className="p-2 text-xs text-rose-400 hover:text-rose-300 bg-rose-500/10 border border-rose-500/20 rounded-lg hover:bg-rose-500/20 transition-all"
          >
            <FaSignOutAlt />
          </button>
        </div>
      </header>

      <div className="flex-1 flex flex-col md:flex-row">
        {/* Left Grouped Executive Sidebar */}
        <aside className="w-full md:w-60 border-r border-slate-800/80 bg-[#070a12] p-3 space-y-5 shrink-0">
          {[
            {
              group: 'Overview & Layout',
              items: [
                { id: 'dashboard', label: 'Console Dashboard', icon: FaTachometerAlt, badge: null },
                { id: 'layout', label: 'Section Spacing & Gaps', icon: FaLayerGroup, badge: 'GAP' },
              ],
            },
            {
              group: 'Content Management',
              items: [
                { id: 'skills', label: 'Skills & Tech Bars', icon: FaSlidersH, badge: kb.skillCategories?.length || 0 },
                { id: 'stats', label: 'Stats Counter Cards', icon: FaChartBar, badge: stats.length },
                { id: 'hero', label: 'Hero & Typewriter', icon: FaRocket, badge: 'MAIN' },
                { id: 'profile', label: 'Profile & Contact', icon: FaUser, badge: null },
                { id: 'projects', label: 'Projects Catalog', icon: FaProjectDiagram, badge: kb.projects?.length || 0 },
                { id: 'certifications', label: 'Certifications', icon: FaAward, badge: certifications.length },
                { id: 'education', label: 'Academic Journey', icon: FaGraduationCap, badge: kb.education?.length || 0 },
                { id: 'experience', label: 'Work Experience', icon: FaBriefcase, badge: kb.experience?.length || 0 },
              ],
            },
            {
              group: 'AI & Systems',
              items: [
                { id: 'pittu', label: 'Pittu AI Knowledge', icon: FaRobot, badge: kb.faqs?.length || 0 },
                { id: 'database', label: 'Infra & Database', icon: FaDatabase, badge: null },
              ],
            },
          ].map((catGroup, gIdx) => (
            <div key={gIdx} className="space-y-1">
              <p className="px-3 text-[10px] font-semibold uppercase tracking-wider text-slate-500 mb-1">
                {catGroup.group}
              </p>
              {catGroup.items.map((tab) => {
                const Icon = tab.icon
                const isActive = activeTab === tab.id
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all text-left ${
                      isActive
                        ? 'bg-indigo-600 text-white shadow-sm'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className={`text-xs ${isActive ? 'text-white' : 'text-slate-400'}`} />
                      <span>{tab.label}</span>
                    </div>
                    {tab.badge !== null && (
                      <span className={`text-[10px] px-2 py-0.5 rounded-full ${isActive ? 'bg-white/20 text-white font-bold' : 'bg-slate-800 text-slate-400'}`}>
                        {tab.badge}
                      </span>
                    )}
                  </button>
                )
              })}
            </div>
          ))}
        </aside>

        {/* Main Content Workspace */}
        <main className="flex-1 p-6 space-y-6 overflow-y-auto max-h-[calc(100vh-57px)] bg-[#0b0f19]">
          {/* TAB: DASHBOARD OVERVIEW */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6 max-w-5xl">
              <div>
                <h2 className="text-lg font-bold text-white">Executive Studio Overview</h2>
                <p className="text-xs text-slate-400 mt-0.5">Manage single source of truth data across live portfolio website and Pittu AI</p>
              </div>

              {/* Metric Cards Grid */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-[#0f172a] border border-slate-800 rounded-xl p-4 space-y-1">
                  <p className="text-xs text-slate-400 font-medium">Skill Categories</p>
                  <p className="text-2xl font-bold text-white">{kb.skillCategories?.length || 0}</p>
                </div>

                <div className="bg-[#0f172a] border border-slate-800 rounded-xl p-4 space-y-1">
                  <p className="text-xs text-slate-400 font-medium">Projects Listed</p>
                  <p className="text-2xl font-bold text-white">{kb.projects?.length || 0}</p>
                </div>

                <div className="bg-[#0f172a] border border-slate-800 rounded-xl p-4 space-y-1">
                  <p className="text-xs text-slate-400 font-medium">Certifications</p>
                  <p className="text-2xl font-bold text-white">{certifications.length}</p>
                </div>

                <div className="bg-[#0f172a] border border-slate-800 rounded-xl p-4 space-y-1">
                  <p className="text-xs text-slate-400 font-medium">Pittu AI Knowledge FAQs</p>
                  <p className="text-2xl font-bold text-white">{kb.faqs?.length || 0}</p>
                </div>
              </div>

              {/* Quick Jump Links */}
              <div className="bg-[#0f172a] border border-slate-800 rounded-xl p-5 space-y-3">
                <h3 className="font-bold text-white text-xs uppercase tracking-wider text-slate-400">Quick Section Management</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <button
                    onClick={() => setActiveTab('skills')}
                    className="p-3 rounded-lg bg-[#070a12] border border-slate-800 text-left hover:border-indigo-500 transition-all flex items-center justify-between group"
                  >
                    <div>
                      <p className="text-xs font-semibold text-white">Skills & Logos</p>
                      <p className="text-[11px] text-slate-400 mt-0.5">Edit progress bars & icons</p>
                    </div>
                    <FaChevronRight className="text-slate-500 group-hover:text-indigo-400 text-xs" />
                  </button>

                  <button
                    onClick={() => setActiveTab('layout')}
                    className="p-3 rounded-lg bg-[#070a12] border border-slate-800 text-left hover:border-indigo-500 transition-all flex items-center justify-between group"
                  >
                    <div>
                      <p className="text-xs font-semibold text-white">Section Gaps</p>
                      <p className="text-[11px] text-slate-400 mt-0.5">Adjust padding & presets</p>
                    </div>
                    <FaChevronRight className="text-slate-500 group-hover:text-indigo-400 text-xs" />
                  </button>

                  <button
                    onClick={() => setActiveTab('stats')}
                    className="p-3 rounded-lg bg-[#070a12] border border-slate-800 text-left hover:border-indigo-500 transition-all flex items-center justify-between group"
                  >
                    <div>
                      <p className="text-xs font-semibold text-white">Stats Counters</p>
                      <p className="text-[11px] text-slate-400 mt-0.5">Edit achievement numbers</p>
                    </div>
                    <FaChevronRight className="text-slate-500 group-hover:text-indigo-400 text-xs" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: SKILLS & PROFICIENCY BARS CMS */}
          {activeTab === 'skills' && (
            <div className="space-y-6 max-w-5xl">
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div>
                  <h2 className="text-lg font-bold text-white">Skills & Technology Logos CMS</h2>
                  <p className="text-xs text-slate-400 mt-0.5">Edit category names, technology logos, proficiency sliders, and accent colors</p>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={handleAddCategory}
                    className="text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 px-3.5 py-2 rounded-lg transition-all flex items-center gap-1.5 shadow-sm"
                  >
                    <FaPlus /> Add New Category
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveAll}
                    className="text-xs font-semibold text-slate-900 bg-emerald-400 hover:bg-emerald-300 px-3.5 py-2 rounded-lg transition-all shadow-sm"
                  >
                    <FaSave className="inline mr-1.5" /> Save Edits
                  </button>
                </div>
              </div>

              {/* Categorized Skill Cards */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                {(kb.skillCategories || []).map((cat, catIdx) => (
                  <div key={cat.id || catIdx} className="bg-[#0f172a] border border-slate-800 rounded-xl p-5 space-y-4 shadow-sm">
                    {/* Header */}
                    <div className="flex items-center justify-between pb-3 border-b border-slate-800 gap-3">
                      <div className="flex items-center gap-2.5 flex-1">
                        <button
                          type="button"
                          onClick={() => setPickerModal({ open: true, type: 'category', catIdx, skillIdx: 0 })}
                          title="Change category logo/icon"
                          className="w-8 h-8 rounded-lg bg-[#070a12] border border-slate-700 grid place-items-center text-indigo-400 hover:scale-105 transition-transform cursor-pointer shrink-0"
                        >
                          <CategoryIcon name={cat.icon || 'code'} className="text-sm" />
                        </button>

                        <div className="flex items-center gap-1">
                          {COLOR_ACCENTS.map((col) => (
                            <button
                              key={col.code}
                              type="button"
                              onClick={() => {
                                const updatedCats = [...(kb.skillCategories || [])]
                                updatedCats[catIdx].accent = col.code
                                setKb({ ...kb, skillCategories: updatedCats })
                              }}
                              className={`w-3 h-3 rounded-full transition-transform ${
                                cat.accent === col.code ? 'scale-125 ring-2 ring-white' : 'opacity-50 hover:opacity-100'
                              }`}
                              style={{ backgroundColor: col.code }}
                              title={`Set ${col.name} Accent`}
                            />
                          ))}
                        </div>

                        <input
                          type="text"
                          value={cat.label}
                          onChange={(e) => {
                            const updatedCats = [...(kb.skillCategories || [])]
                            updatedCats[catIdx].label = e.target.value
                            setKb({ ...kb, skillCategories: updatedCats })
                          }}
                          className="font-semibold text-white text-sm bg-[#070a12] border border-slate-800 rounded-lg px-3 py-1 outline-none focus:border-indigo-500 flex-1"
                        />
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          const updatedCats = (kb.skillCategories || []).filter((_, i) => i !== catIdx)
                          const updatedKb = { ...kb, skillCategories: updatedCats }
                          setKb(updatedKb)
                          saveActiveKnowledge(updatedKb)
                        }}
                        className="text-rose-400 hover:text-rose-300 p-1.5 rounded-lg bg-rose-500/10 border border-rose-500/20 text-xs shrink-0 cursor-pointer"
                      >
                        <FaTrash />
                      </button>
                    </div>

                    {/* Skill List */}
                    <div className="space-y-3 pt-1">
                      {cat.skills.map((skill, skillIdx) => (
                        <div key={skillIdx} className="bg-[#070a12] border border-slate-800 rounded-lg p-3 space-y-2">
                          <div className="flex items-center justify-between gap-2.5">
                            <button
                              type="button"
                              onClick={() => setPickerModal({ open: true, type: 'skill', catIdx, skillIdx })}
                              title="Click to select tech logo for this skill"
                              className="w-7 h-7 rounded-md bg-slate-800/80 border border-slate-700 grid place-items-center text-indigo-400 hover:scale-105 hover:border-indigo-500 transition-all cursor-pointer shrink-0"
                            >
                              <SkillIcon name={skill.icon || 'SiPython'} className="text-xs" />
                            </button>

                            <input
                              type="text"
                              value={skill.name}
                              onChange={(e) => {
                                const updatedCats = [...(kb.skillCategories || [])]
                                updatedCats[catIdx].skills[skillIdx].name = e.target.value
                                setKb({ ...kb, skillCategories: updatedCats })
                              }}
                              className="text-xs font-semibold text-white bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1 outline-none focus:border-indigo-500 flex-1"
                            />

                            <div className="flex items-center gap-2">
                              <span className="text-xs font-mono text-indigo-300 font-bold w-9 text-right">{skill.level}%</span>
                              <button
                                type="button"
                                onClick={() => {
                                  const updatedCats = [...(kb.skillCategories || [])]
                                  updatedCats[catIdx].skills = updatedCats[catIdx].skills.filter((_, i) => i !== skillIdx)
                                  setKb({ ...kb, skillCategories: updatedCats })
                                }}
                                className="text-rose-400 hover:text-rose-300 p-1 text-xs cursor-pointer"
                              >
                                <FaTrash />
                              </button>
                            </div>
                          </div>

                          <div className="flex items-center gap-3">
                            <input
                              type="range"
                              min="0"
                              max="100"
                              value={skill.level}
                              onChange={(e) => {
                                const updatedCats = [...(kb.skillCategories || [])]
                                updatedCats[catIdx].skills[skillIdx].level = Number(e.target.value)
                                setKb({ ...kb, skillCategories: updatedCats })
                              }}
                              className="flex-1 accent-indigo-500 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
                            />
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Add Skill Row */}
                    <div className="pt-3 border-t border-slate-800 flex items-center gap-2">
                      <input
                        type="text"
                        placeholder="New skill name..."
                        value={newSkillNames[catIdx] || ''}
                        onChange={(e) => setNewSkillNames({ ...newSkillNames, [catIdx]: e.target.value })}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault()
                            const name = (newSkillNames[catIdx] || '').trim()
                            const level = Number(newSkillLevels[catIdx] || 75)
                            if (name) {
                              const updatedCats = [...(kb.skillCategories || [])]
                              updatedCats[catIdx].skills.push({ name, level, icon: 'SiPython' })
                              const updatedKb = { ...kb, skillCategories: updatedCats }
                              setKb(updatedKb)
                              saveActiveKnowledge(updatedKb)
                              setNewSkillNames({ ...newSkillNames, [catIdx]: '' })
                            }
                          }
                        }}
                        className="flex-1 bg-[#070a12] border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white outline-none focus:border-indigo-500"
                      />
                      <input
                        type="number"
                        min="0"
                        max="100"
                        placeholder="%"
                        value={newSkillLevels[catIdx] || 75}
                        onChange={(e) => setNewSkillLevels({ ...newSkillLevels, [catIdx]: Number(e.target.value) })}
                        className="w-14 bg-[#070a12] border border-slate-800 rounded-lg px-2 py-1.5 text-xs text-indigo-300 font-mono outline-none focus:border-indigo-500"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const name = (newSkillNames[catIdx] || '').trim()
                          const level = Number(newSkillLevels[catIdx] || 75)
                          if (name) {
                            const updatedCats = [...(kb.skillCategories || [])]
                            updatedCats[catIdx].skills.push({ name, level, icon: 'SiPython' })
                            const updatedKb = { ...kb, skillCategories: updatedCats }
                            setKb(updatedKb)
                            saveActiveKnowledge(updatedKb)
                            setNewSkillNames({ ...newSkillNames, [catIdx]: '' })
                          }
                        }}
                        className="bg-indigo-600 hover:bg-indigo-500 text-white font-medium px-3 py-1.5 rounded-lg text-xs flex items-center gap-1 cursor-pointer"
                      >
                        <FaPlus /> Add Skill
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Add New Category Input Footer */}
              <div className="pt-4 border-t border-slate-800 flex items-center gap-3">
                <input
                  type="text"
                  placeholder="New Category Label (e.g. Cloud & DevOps)..."
                  value={newCatLabel}
                  onChange={(e) => setNewCatLabel(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      handleAddCategory()
                    }
                  }}
                  className="flex-1 bg-[#0f172a] border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white outline-none focus:border-indigo-500 font-medium"
                />
                <button
                  type="button"
                  onClick={handleAddCategory}
                  className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-4 py-2.5 rounded-xl text-xs flex items-center gap-1.5 cursor-pointer shadow-sm"
                >
                  <FaPlus /> Add New Category
                </button>
              </div>
            </div>
          )}

          {/* TAB: ADVANCED LAYOUT & SECTION SPACING CMS */}
          {activeTab === 'layout' && (
            <div className="space-y-6 max-w-5xl">
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div>
                  <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    <FaLayerGroup className="text-indigo-400" /> Section Spacing & Gap Architecture
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">Control section padding/gaps, toggle section visibility (Show/Hide), and re-order homepage flow</p>
                </div>
                <button onClick={handleSaveAll} className="text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 px-4 py-2 rounded-lg shadow-sm flex items-center gap-1.5">
                  <FaSave /> Save Architecture
                </button>
              </div>

              {/* Presets */}
              <div className="bg-[#0f172a] border border-slate-800 rounded-xl p-5 space-y-3">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-indigo-400">Global Spacing Presets</span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <button
                    onClick={() => {
                      const updatedSections = layoutConfig.sections.map((s) => ({ ...s, paddingTopRem: 1, paddingBottomRem: 1 }))
                      setKb({ ...kb, layoutConfig: { preset: 'compact', sections: updatedSections } })
                    }}
                    className={`p-3.5 rounded-xl border text-left transition-all ${
                      layoutConfig.preset === 'compact'
                        ? 'bg-indigo-600/20 border-indigo-500 text-indigo-300 font-bold'
                        : 'bg-[#070a12] border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    <p className="text-xs font-semibold">⚡ Ultra-Compact (Zero Gaps)</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">1rem padding. Tight continuous stream.</p>
                  </button>

                  <button
                    onClick={() => {
                      const updatedSections = layoutConfig.sections.map((s) => ({ ...s, paddingTopRem: 2.5, paddingBottomRem: 2.5 }))
                      setKb({ ...kb, layoutConfig: { preset: 'balanced', sections: updatedSections } })
                    }}
                    className={`p-3.5 rounded-xl border text-left transition-all ${
                      layoutConfig.preset === 'balanced'
                        ? 'bg-indigo-600/20 border-indigo-500 text-indigo-300 font-bold'
                        : 'bg-[#070a12] border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    <p className="text-xs font-semibold">⚖️ Balanced Rhythm</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">2.5rem padding. Optimal spacing.</p>
                  </button>

                  <button
                    onClick={() => {
                      const updatedSections = layoutConfig.sections.map((s) => ({ ...s, paddingTopRem: 4.5, paddingBottomRem: 4.5 }))
                      setKb({ ...kb, layoutConfig: { preset: 'spacious', sections: updatedSections } })
                    }}
                    className={`p-3.5 rounded-xl border text-left transition-all ${
                      layoutConfig.preset === 'spacious'
                        ? 'bg-indigo-600/20 border-indigo-500 text-indigo-300 font-bold'
                        : 'bg-[#070a12] border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    <p className="text-xs font-semibold">🌌 Spacious (Generous)</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">4.5rem padding. Generous vertical space.</p>
                  </button>
                </div>
              </div>

              {/* Section Sequence */}
              <div className="bg-[#0f172a] border border-slate-800 rounded-xl p-5 space-y-3">
                <h3 className="font-bold text-white text-xs uppercase tracking-wider text-slate-400">Homepage Sequence & Sliders</h3>
                <div className="space-y-3">
                  {layoutConfig.sections.map((sec, idx) => (
                    <div key={sec.id} className="p-3.5 rounded-lg bg-[#070a12] border border-slate-800 space-y-3">
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <span className="w-6 h-6 rounded bg-indigo-600/20 text-indigo-300 grid place-items-center text-xs font-bold font-mono">
                            #{idx + 1}
                          </span>
                          <span className="font-bold text-xs text-white">{sec.name}</span>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              const updated = [...layoutConfig.sections]
                              updated[idx].enabled = !updated[idx].enabled
                              setKb({ ...kb, layoutConfig: { ...layoutConfig, sections: updated } })
                            }}
                            className={`flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-lg border ${
                              sec.enabled
                                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                                : 'bg-rose-500/10 border-rose-500/30 text-rose-400'
                            }`}
                          >
                            {sec.enabled ? <FaEye /> : <FaEyeSlash />}
                            {sec.enabled ? 'Visible' : 'Hidden'}
                          </button>

                          <button
                            disabled={idx === 0}
                            onClick={() => {
                              if (idx > 0) {
                                const updated = [...layoutConfig.sections]
                                const temp = updated[idx]
                                updated[idx] = updated[idx - 1]
                                updated[idx - 1] = temp
                                setKb({ ...kb, layoutConfig: { ...layoutConfig, sections: updated } })
                              }
                            }}
                            className="p-1.5 rounded bg-slate-800 text-slate-400 hover:text-white disabled:opacity-30 text-xs"
                          >
                            <FaArrowUp />
                          </button>
                          <button
                            disabled={idx === layoutConfig.sections.length - 1}
                            onClick={() => {
                              if (idx < layoutConfig.sections.length - 1) {
                                const updated = [...layoutConfig.sections]
                                const temp = updated[idx]
                                updated[idx] = updated[idx + 1]
                                updated[idx + 1] = temp
                                setKb({ ...kb, layoutConfig: { ...layoutConfig, sections: updated } })
                              }
                            }}
                            className="p-1.5 rounded bg-slate-800 text-slate-400 hover:text-white disabled:opacity-30 text-xs"
                          >
                            <FaArrowDown />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB: STATS COUNTER CARDS CMS */}
          {activeTab === 'stats' && (
            <div className="space-y-6 max-w-5xl">
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div>
                  <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    <FaChartBar className="text-indigo-400" /> Stats Counter Cards CMS
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">Edit counter numbers, suffixes, and card titles</p>
                </div>
                <button
                  onClick={() => {
                    const newStat = { id: `stat-${Date.now()}`, label: 'New Metric Title', value: 10, suffix: '+' }
                    setKb({ ...kb, stats: [...stats, newStat] })
                  }}
                  className="text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 px-3.5 py-2 rounded-lg flex items-center gap-1.5"
                >
                  <FaPlus /> Add Stat Card
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {stats.map((stat, idx) => (
                  <div key={stat.id || idx} className="bg-[#0f172a] border border-slate-800 rounded-xl p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-indigo-400 bg-indigo-500/10 px-2.5 py-1 rounded">Stat Card #{idx + 1}</span>
                      <button
                        onClick={() => setKb({ ...kb, stats: stats.filter((_, i) => i !== idx) })}
                        className="text-rose-400 hover:text-rose-300 p-1 text-xs"
                      >
                        <FaTrash />
                      </button>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-400 mb-1">Label Title</label>
                      <input
                        type="text"
                        value={stat.label}
                        onChange={(e) => {
                          const updated = [...stats]
                          updated[idx].label = e.target.value
                          setKb({ ...kb, stats: updated })
                        }}
                        className="w-full bg-[#070a12] border border-slate-800 rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-indigo-500 font-semibold"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-slate-400 mb-1">Value Number</label>
                        <input
                          type="number"
                          value={stat.value}
                          onChange={(e) => {
                            const updated = [...stats]
                            updated[idx].value = Number(e.target.value)
                            setKb({ ...kb, stats: updated })
                          }}
                          className="w-full bg-[#070a12] border border-slate-800 rounded-lg px-3 py-2 text-xs text-indigo-300 font-mono outline-none focus:border-indigo-500"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-slate-400 mb-1">Suffix (+, %)</label>
                        <input
                          type="text"
                          value={stat.suffix}
                          onChange={(e) => {
                            const updated = [...stats]
                            updated[idx].suffix = e.target.value
                            setKb({ ...kb, stats: updated })
                          }}
                          className="w-full bg-[#070a12] border border-slate-800 rounded-lg px-3 py-2 text-xs text-indigo-300 font-mono outline-none focus:border-indigo-500"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* OTHER TABS */}
          {activeTab === 'hero' && (
            <div className="space-y-6 max-w-5xl">
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div>
                  <h2 className="text-lg font-bold text-white">Hero Section & Typewriter CMS</h2>
                  <p className="text-xs text-slate-400 mt-0.5">Edit title, animated roles, typing speeds, and description</p>
                </div>
                <button onClick={handleSaveAll} className="text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 px-4 py-2 rounded-lg flex items-center gap-1.5 shadow-sm">
                  <FaSave /> Save Hero Changes
                </button>
              </div>

              <div className="bg-[#0f172a] border border-slate-800 rounded-xl p-5 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1">First Name</label>
                    <input
                      type="text"
                      value={hero.firstName}
                      onChange={(e) => setKb({ ...kb, hero: { ...hero, firstName: e.target.value } })}
                      className="w-full bg-[#070a12] border border-slate-800 rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-indigo-500 font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1">Last Name</label>
                    <input
                      type="text"
                      value={hero.lastName}
                      onChange={(e) => setKb({ ...kb, hero: { ...hero, lastName: e.target.value } })}
                      className="w-full bg-[#070a12] border border-slate-800 rounded-lg px-3 py-2 text-xs text-indigo-400 outline-none focus:border-indigo-500 font-bold"
                    />
                  </div>
                </div>

                {/* Animated Typewriter Roles */}
                <div className="space-y-3 pt-2">
                  <label className="block text-xs font-medium text-slate-400">Animated Typewriter Roles ({hero.roles.length})</label>
                  {hero.roles.map((roleStr, rIdx) => (
                    <div key={rIdx} className="flex items-center gap-3 bg-[#070a12] border border-slate-800 rounded-lg p-2.5">
                      <span className="w-6 h-6 rounded bg-indigo-600/20 text-indigo-300 grid place-items-center text-xs font-mono font-bold shrink-0">
                        {rIdx + 1}
                      </span>
                      <input
                        type="text"
                        value={roleStr}
                        onChange={(e) => {
                          const updatedRoles = [...hero.roles]
                          updatedRoles[rIdx] = e.target.value
                          setKb({ ...kb, hero: { ...hero, roles: updatedRoles } })
                        }}
                        className="flex-1 bg-transparent border-none text-xs text-white outline-none font-semibold"
                      />
                      <button
                        onClick={() => {
                          const updatedRoles = hero.roles.filter((_, i) => i !== rIdx)
                          setKb({ ...kb, hero: { ...hero, roles: updatedRoles } })
                        }}
                        className="text-rose-400 hover:text-rose-300 p-1 text-xs"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  ))}

                  <div className="flex items-center gap-2 pt-2">
                    <input
                      type="text"
                      placeholder="Add new animated role (e.g. Full-Stack Developer)..."
                      value={newRoleString}
                      onChange={(e) => setNewRoleString(e.target.value)}
                      className="flex-1 bg-[#070a12] border border-slate-800 rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-indigo-500"
                    />
                    <button
                      onClick={() => {
                        if (newRoleString.trim()) {
                          setKb({ ...kb, hero: { ...hero, roles: [...hero.roles, newRoleString.trim()] } })
                          setNewRoleString('')
                        }
                      }}
                      className="bg-indigo-600 hover:bg-indigo-500 text-white font-medium px-3.5 py-2 rounded-lg text-xs"
                    >
                      <FaPlus /> Add
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'profile' && (
            <div className="space-y-6 max-w-4xl">
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div>
                  <h2 className="text-lg font-bold text-white">Profile & Contact Information</h2>
                  <p className="text-xs text-slate-400 mt-0.5">Manage primary bio, role definitions, and public social channels</p>
                </div>
                <button onClick={handleSaveAll} className="text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 px-4 py-2 rounded-lg shadow-sm">
                  <FaSave /> Save Profile
                </button>
              </div>

              <div className="bg-[#0f172a] border border-slate-800 rounded-xl p-5 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1">Full Name</label>
                    <input
                      type="text"
                      value={kb.profile.name}
                      onChange={(e) => setKb({ ...kb, profile: { ...kb.profile, name: e.target.value } })}
                      className="w-full bg-[#070a12] border border-slate-800 rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-indigo-500 font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1">Primary Title</label>
                    <input
                      type="text"
                      value={kb.profile.title}
                      onChange={(e) => setKb({ ...kb, profile: { ...kb.profile, title: e.target.value } })}
                      className="w-full bg-[#070a12] border border-slate-800 rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Authoritative Public Bio</label>
                  <textarea
                    rows={4}
                    value={kb.profile.bio}
                    onChange={(e) => setKb({ ...kb, profile: { ...kb.profile, bio: e.target.value } })}
                    className="w-full bg-[#070a12] border border-slate-800 rounded-lg p-3 text-xs text-white outline-none focus:border-indigo-500 leading-relaxed"
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'projects' && (
            <div className="space-y-6 max-w-5xl">
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div>
                  <h2 className="text-lg font-bold text-white">Projects Catalog CMS</h2>
                  <p className="text-xs text-slate-400 mt-0.5">Manage project cards, live URLs, GitHub repos, and status flags</p>
                </div>
                <button
                  onClick={() => {
                    const newProj = {
                      id: `proj_${Date.now()}`,
                      slug: `new-project-${Date.now()}`,
                      title: 'New Project Title',
                      category: 'HYBRID',
                      shortDescription: 'Short project overview',
                      fullDescription: 'Detailed project breakdown',
                      problem: 'Target problem solved',
                      solution: 'Technical solution implemented',
                      techStack: ['React', 'Python'],
                      architecture: 'Full stack architecture',
                      features: ['Feature 1'],
                      status: 'IN_DEVELOPMENT',
                      demoUrl: 'https://',
                      githubUrl: 'https://github.com',
                    }
                    setKb({ ...kb, projects: [newProj, ...kb.projects] })
                  }}
                  className="text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 px-3.5 py-2 rounded-lg flex items-center gap-1.5 shadow-sm"
                >
                  <FaPlus /> Add Project
                </button>
              </div>

              <div className="space-y-4">
                {kb.projects.map((proj, idx) => (
                  <div key={proj.id} className="bg-[#0f172a] border border-slate-800 rounded-xl p-5 space-y-3">
                    <div className="flex items-center justify-between gap-4">
                      <input
                        type="text"
                        value={proj.title}
                        onChange={(e) => {
                          const updated = [...kb.projects]
                          updated[idx].title = e.target.value
                          setKb({ ...kb, projects: updated })
                        }}
                        className="font-bold text-white text-sm bg-[#070a12] border border-slate-800 rounded-lg px-3 py-1.5 flex-1 outline-none focus:border-indigo-500"
                      />
                      <button
                        onClick={() => setKb({ ...kb, projects: kb.projects.filter((p) => p.id !== proj.id) })}
                        className="text-rose-400 hover:text-rose-300 p-1.5 text-xs"
                      >
                        <FaTrash />
                      </button>
                    </div>

                    <div>
                      <input
                        type="text"
                        value={proj.shortDescription}
                        onChange={(e) => {
                          const updated = [...kb.projects]
                          updated[idx].shortDescription = e.target.value
                          setKb({ ...kb, projects: updated })
                        }}
                        placeholder="Short description"
                        className="w-full bg-[#070a12] border border-slate-800 rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-indigo-500"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'certifications' && (
            <div className="space-y-6 max-w-5xl">
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div>
                  <h2 className="text-lg font-bold text-white">Certifications Catalog CMS</h2>
                  <p className="text-xs text-slate-400 mt-0.5">Manage certification credentials, issuing organizations, and URLs</p>
                </div>
                <button
                  onClick={() => {
                    const newCert = {
                      id: `cert-${Date.now()}`,
                      title: 'New Certification Title',
                      organization: 'Organization Name',
                      date: '2026',
                      url: 'https://',
                    }
                    setKb({ ...kb, certifications: [...certifications, newCert] })
                  }}
                  className="text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 px-3.5 py-2 rounded-lg flex items-center gap-1.5 shadow-sm"
                >
                  <FaPlus /> Add Certification
                </button>
              </div>

              <div className="space-y-4">
                {certifications.map((cert, idx) => (
                  <div key={cert.id || idx} className="bg-[#0f172a] border border-slate-800 rounded-xl p-5 space-y-3">
                    <div className="flex items-center justify-between gap-4">
                      <input
                        type="text"
                        value={cert.title}
                        onChange={(e) => {
                          const updated = [...certifications]
                          updated[idx].title = e.target.value
                          setKb({ ...kb, certifications: updated })
                        }}
                        className="font-bold text-white text-sm bg-[#070a12] border border-slate-800 rounded-lg px-3 py-1.5 flex-1 outline-none focus:border-indigo-500"
                      />
                      <button
                        onClick={() => setKb({ ...kb, certifications: certifications.filter((_, i) => i !== idx) })}
                        className="text-rose-400 hover:text-rose-300 p-1.5 text-xs"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'education' && (
            <div className="space-y-6 max-w-5xl">
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div>
                  <h2 className="text-lg font-bold text-white">Academic Journey & Education</h2>
                  <p className="text-xs text-slate-400 mt-0.5">Manage academic qualifications, schools, colleges, and SGPA</p>
                </div>
                <button
                  onClick={() => {
                    const newEdu = {
                      id: `edu_${Date.now()}`,
                      degree: 'New Certification / Degree',
                      field: 'Field of Study',
                      institution: 'University Name',
                      location: 'City, State',
                      duration: '1 Year',
                      years: '2025 – 2026',
                      badge: 'Academic Honor',
                      sgpa: '8.86 SGPA',
                      description: 'Overview',
                      highlights: ['Core Subject 1'],
                    }
                    setKb({ ...kb, education: [newEdu, ...kb.education] })
                  }}
                  className="text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 px-3.5 py-2 rounded-lg flex items-center gap-1.5 shadow-sm"
                >
                  <FaPlus /> Add Education Entry
                </button>
              </div>

              <div className="space-y-4">
                {kb.education.map((edu, idx) => (
                  <div key={edu.id} className="bg-[#0f172a] border border-slate-800 rounded-xl p-5 space-y-3">
                    <div className="flex items-center justify-between gap-4">
                      <input
                        type="text"
                        value={edu.degree}
                        onChange={(e) => {
                          const updated = [...kb.education]
                          updated[idx].degree = e.target.value
                          setKb({ ...kb, education: updated })
                        }}
                        className="font-bold text-white text-sm bg-[#070a12] border border-slate-800 rounded-lg px-3 py-1.5 flex-1 outline-none focus:border-indigo-500"
                      />
                      <button
                        onClick={() => setKb({ ...kb, education: kb.education.filter((e) => e.id !== edu.id) })}
                        className="text-rose-400 hover:text-rose-300 p-1.5 text-xs"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'experience' && (
            <div className="space-y-6 max-w-5xl">
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div>
                  <h2 className="text-lg font-bold text-white">Work Experience & Internships</h2>
                  <p className="text-xs text-slate-400 mt-0.5">Manage professional internships, roles, and responsibilities</p>
                </div>
                <button
                  onClick={() => {
                    const newExp = {
                      id: `exp_${Date.now()}`,
                      role: 'New Role',
                      company: 'Company',
                      duration: '3 Months',
                      startDate: '2026',
                      endDate: '2026',
                      type: 'Internship',
                      points: ['Bullet 1'],
                    }
                    setKb({ ...kb, experience: [newExp, ...kb.experience] })
                  }}
                  className="text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 px-3.5 py-2 rounded-lg flex items-center gap-1.5 shadow-sm"
                >
                  <FaPlus /> Add Experience
                </button>
              </div>

              <div className="space-y-4">
                {kb.experience.map((exp, idx) => (
                  <div key={exp.id} className="bg-[#0f172a] border border-slate-800 rounded-xl p-5 space-y-3">
                    <div className="flex items-center justify-between gap-4">
                      <input
                        type="text"
                        value={exp.role}
                        onChange={(e) => {
                          const updated = [...kb.experience]
                          updated[idx].role = e.target.value
                          setKb({ ...kb, experience: updated })
                        }}
                        className="font-bold text-white text-sm bg-[#070a12] border border-slate-800 rounded-lg px-3 py-1.5 flex-1 outline-none focus:border-indigo-500"
                      />
                      <button
                        onClick={() => setKb({ ...kb, experience: kb.experience.filter((e) => e.id !== exp.id) })}
                        className="text-rose-400 hover:text-rose-300 p-1.5 text-xs"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'pittu' && (
            <div className="space-y-6 max-w-5xl">
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div>
                  <h2 className="text-lg font-bold text-white">Pittu AI Knowledge & FAQ Engine</h2>
                  <p className="text-xs text-slate-400 mt-0.5">Configure grounded facts and Q&A pairs</p>
                </div>
                <button onClick={handleSaveAll} className="text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 px-4 py-2 rounded-lg shadow-sm">
                  <FaSave /> Save AI Knowledge
                </button>
              </div>

              <div className="bg-[#0f172a] border border-slate-800 rounded-xl p-5 space-y-3">
                <h3 className="font-bold text-white text-xs uppercase tracking-wider text-slate-400">Pittu Q&A Pairs ({kb.faqs?.length || 0})</h3>
                <div className="space-y-3">
                  {(kb.faqs || []).map((faq, idx) => (
                    <div key={idx} className="bg-[#070a12] border border-slate-800 rounded-lg p-3 space-y-2">
                      <div className="flex items-center justify-between gap-3">
                        <input
                          type="text"
                          value={faq.question}
                          onChange={(e) => {
                            const updated = [...(kb.faqs || [])]
                            updated[idx].question = e.target.value
                            setKb({ ...kb, faqs: updated })
                          }}
                          className="font-semibold text-xs text-indigo-300 bg-transparent border-none flex-1 outline-none"
                        />
                        <button
                          onClick={() => setKb({ ...kb, faqs: (kb.faqs || []).filter((_, i) => i !== idx) })}
                          className="text-rose-400 hover:text-rose-300 text-xs p-1"
                        >
                          <FaTrash />
                        </button>
                      </div>
                      <textarea
                        rows={2}
                        value={faq.answer}
                        onChange={(e) => {
                          const updated = [...(kb.faqs || [])]
                          updated[idx].answer = e.target.value
                          setKb({ ...kb, faqs: updated })
                        }}
                        className="w-full bg-[#090d16] border border-slate-800 rounded-lg p-2 text-xs text-slate-300 outline-none focus:border-indigo-500"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'database' && (
            <div className="space-y-6 max-w-4xl">
              <h2 className="text-lg font-bold text-white">Database & Infrastructure Overview</h2>
              <div className="bg-[#0f172a] border border-slate-800 rounded-xl p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-white text-xs">Supabase Database Connection</h3>
                  <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full">
                    {isSupabaseConfigured() ? 'Supabase Active' : 'Browser Storage + Local Memory'}
                  </span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  All changes made in this Executive Console are saved immediately to Local Storage and update the authoritative single source of truth across the live portfolio website and Pittu AI!
                </p>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
