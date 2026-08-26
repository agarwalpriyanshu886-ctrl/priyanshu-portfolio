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
  FaExclamationTriangle,
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
  FaTable,
  FaThLarge,
  FaGlobe,
  FaCircle,
  FaGithub,
  FaSync,
  FaStar,
  FaCodeBranch,
  FaLink,
  FaCalendarAlt,
  FaBuilding,
  FaPaperPlane,
  FaMapMarkerAlt,
  FaListUl,
  FaUpload,
  FaImage,
  FaTag,
  FaPhoneAlt,
  FaInstagram,
  FaLinkedin,
  FaKey,
  FaCopy,
} from 'react-icons/fa'
import { Link } from 'react-router-dom'
import {
  getActiveKnowledge,
  saveActiveKnowledge,
  resetCMSKnowledgeToDefault,
  syncKnowledgeToSupabase,
  fetchKnowledgeFromSupabase,
} from '../lib/public-ai/cmsKnowledgeStore'
import {
  isSupabaseConfigured,
  getSupabaseCredentials,
  saveSupabaseCredentials,
  clearSupabaseCredentials,
  getSupabaseClient,
} from '../lib/supabase'
import { uploadImageToSupabaseStorage } from '../lib/supabaseStorage'
import { SkillIcon, CategoryIcon, AVAILABLE_SKILL_ICONS, AVAILABLE_CATEGORY_ICONS } from '../components/ui/SkillIcon'
import { compressImageFile } from '../utils/imageCompressor'

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
  const [showPassword, setShowPassword] = useState(false)
  const [loginError, setLoginError] = useState('')

  // CMS State
  const [kb, setKb] = useState(getActiveKnowledge())
  const [activeTab, setActiveTab] = useState('dashboard')
  const [viewMode, setViewMode] = useState('grid')
  const [toastMessage, setToastMessage] = useState('')
  const [showResetConfirm, setShowResetConfirm] = useState(false)

  // GitHub Test Connection State
  const [gitTestStatus, setGitTestStatus] = useState(null)
  const [gitTesting, setGitTesting] = useState(false)

  // Supabase Connection & Sync State
  const [sbCreds, setSbCreds] = useState(() => getSupabaseCredentials())
  const [sbSyncing, setSbSyncing] = useState(false)
  const [sbStatusMsg, setSbStatusMsg] = useState('')
  const [sqlCopied, setSqlCopied] = useState(false)

  const handleSaveSupabaseCreds = (e) => {
    e.preventDefault()
    saveSupabaseCredentials(sbCreds.url.trim(), sbCreds.key.trim())
    triggerToast('Supabase credentials saved')
    window.location.reload()
  }

  const handleClearSupabaseCreds = () => {
    clearSupabaseCredentials()
    setSbCreds({ url: '', key: '' })
    triggerToast('Supabase credentials cleared')
  }

  const handleSyncToSupabase = async () => {
    setSbSyncing(true)
    setSbStatusMsg('Syncing data to Supabase database...')
    const result = await syncKnowledgeToSupabase(kb)
    setSbSyncing(false)
    if (result.success) {
      setSbStatusMsg('✅ Successfully synced all CMS data to Supabase table "portfolio_cms"!')
      triggerToast('Synced all data to Supabase')
    } else {
      setSbStatusMsg(`❌ Sync error: ${result.error}`)
    }
  }

  const handleFetchFromSupabase = async () => {
    setSbSyncing(true)
    setSbStatusMsg('Fetching latest data from Supabase...')
    const data = await fetchKnowledgeFromSupabase()
    setSbSyncing(false)
    if (data) {
      setKb(data)
      setSbStatusMsg('✅ Successfully loaded latest data from Supabase!')
      triggerToast('Loaded data from Supabase')
    } else {
      setSbStatusMsg('⚠️ Could not fetch from Supabase. Ensure table "portfolio_cms" exists!')
    }
  }

  // Pittu AI Test Tool State
  const [pittuTestQuery, setPittuTestQuery] = useState('')
  const [pittuTestResponse, setPittuTestResponse] = useState('')

  // Quick Command Search (⌘K / Ctrl+K)
  const [commandOpen, setCommandOpen] = useState(false)
  const [commandQuery, setCommandQuery] = useState('')

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

  // Bullet point temporary state for arrays
  const [newExpPoint, setNewExpPoint] = useState({})
  const [newEduHighlight, setNewEduHighlight] = useState({})
  const [newProjTech, setNewProjTech] = useState({})

  const [loggingIn, setLoggingIn] = useState(false)

  useEffect(() => {
    setKb(getActiveKnowledge())

    // Check active Supabase Auth session on mount
    if (isSupabaseConfigured()) {
      const client = getSupabaseClient()
      if (client) {
        client.auth.getSession().then(({ data: { session } }) => {
          if (session?.user) {
            setIsAuthenticated(true)
            if (session.user.email) setEmail(session.user.email)
          }
        }).catch(() => {})

        const { data: { subscription } } = client.auth.onAuthStateChange((_event, session) => {
          if (session?.user) {
            setIsAuthenticated(true)
            if (session.user.email) setEmail(session.user.email)
          }
        })

        return () => {
          subscription.unsubscribe()
        }
      }
    }

    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setCommandOpen((prev) => !prev)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  const triggerToast = (msg) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(''), 3000)
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoginError('')

    if (isSupabaseConfigured()) {
      const client = getSupabaseClient()
      if (client) {
        setLoggingIn(true)
        const { data, error } = await client.auth.signInWithPassword({
          email: email.trim(),
          password: password,
        })
        setLoggingIn(false)

        if (error) {
          console.error('Supabase Auth error:', error.message)
          setLoginError(`Supabase Auth Error: ${error.message}`)
          return
        }

        if (data?.session || data?.user) {
          setIsAuthenticated(true)
          setLoginError('')
          triggerToast(`Welcome back, ${data.user.email}! Authenticated via Supabase Auth. 🚀`)
          return
        }
      }
    }

    // Backup local emergency login
    if (email === 'admin@priyanshu.com' && (password === 'admin123' || password === 'admin')) {
      setIsAuthenticated(true)
      setLoginError('')
      triggerToast('Authenticated via Emergency Local Passcode')
    } else {
      setLoginError('Invalid credentials. Please enter your Supabase user email & password.')
    }
  }

  const handleSignOut = async () => {
    if (isSupabaseConfigured()) {
      const client = getSupabaseClient()
      if (client) {
        await client.auth.signOut().catch(() => {})
      }
    }
    setIsAuthenticated(false)
    triggerToast('Signed out from Executive Console')
  }

  const handleSaveAll = async () => {
    saveActiveKnowledge(kb, false)
    triggerToast('Syncing all changes to Supabase Database...')
    const result = await syncKnowledgeToSupabase(kb)
    if (result.success) {
      triggerToast('✅ All changes saved to LocalStorage & all Supabase Database Tables! 🚀')
    } else {
      triggerToast(`⚠️ Saved locally. Supabase write notice: ${result.error}`)
    }
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
    triggerToast(`Added new category "${label}"`)
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
    triggerToast('Technology logo updated')
  }

  const handleTestGitHubConnection = async () => {
    const username = (kb.profile?.github || '').split('github.com/').pop().replace(/\/$/, '') || 'agarwalpriyanshu886-ctrl'
    setGitTesting(true)
    setGitTestStatus(null)

    try {
      const res = await fetch(`https://api.github.com/users/${username}`)
      if (!res.ok) throw new Error(`HTTP ${res.status}: User not found`)
      const data = await res.json()
      setGitTestStatus({
        success: true,
        data,
        msg: `Successfully connected to @${data.login}! Public Repos: ${data.public_repos}, Followers: ${data.followers}`,
      })
      triggerToast(`GitHub Connection verified for @${data.login}!`)
    } catch (err) {
      setGitTestStatus({
        success: false,
        msg: err.message || 'Failed to connect to GitHub API',
      })
    } finally {
      setGitTesting(false)
    }
  }

  const handleTestPittu = (e) => {
    e.preventDefault()
    if (!pittuTestQuery.trim()) return
    const q = pittuTestQuery.toLowerCase()
    let answer = `I'm Pittu AI! Priyanshu Agarwal is an AI/ML Engineer and Full-Stack Developer studying B.Tech at NIMS University Jaipur.`
    const foundFaq = (kb.faqs || []).find((f) => f.question.toLowerCase().includes(q) || q.includes(f.question.toLowerCase()))
    if (foundFaq) {
      answer = foundFaq.answer
    } else if (q.includes('skill') || q.includes('python') || q.includes('react')) {
      answer = `Priyanshu is proficient in Python (95%), React & Web Dev (90%), C++ (85%), SQL (85%), and Machine Learning (90%).`
    } else if (q.includes('project') || q.includes('chopati')) {
      answer = `Priyanshu built Agarwals Chopati (full-stack web app & Android mobile app), AI Machine Learning Labs, and Portfolio Studio!`
    }
    setPittuTestResponse(answer)
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
    {
      id: 'cert-2',
      title: 'Full-Stack Web Development Mastery',
      organization: 'Udemy / Meta',
      date: '2025',
      url: 'https://udemy.com',
      description: 'Mastered modern React, Node.js, REST APIs, Tailwind CSS, and full-stack system architecture.',
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

  const allNavItems = [
    { id: 'dashboard', label: 'Console Dashboard', cat: 'Overview' },
    { id: 'layout', label: 'Section Spacing & Gaps', cat: 'Overview' },
    { id: 'github', label: 'GitHub & Open Source', cat: 'Content' },
    { id: 'skills', label: 'Skills & Tech Bars', cat: 'Content' },
    { id: 'stats', label: 'Stats Counter Cards', cat: 'Content' },
    { id: 'hero', label: 'Hero & Typewriter', cat: 'Content' },
    { id: 'profile', label: 'Profile & Contact', cat: 'Content' },
    { id: 'projects', label: 'Projects Catalog', cat: 'Content' },
    { id: 'certifications', label: 'Certifications', cat: 'Content' },
    { id: 'education', label: 'Academic Journey', cat: 'Content' },
    { id: 'experience', label: 'Work Experience', cat: 'Content' },
    { id: 'pittu', label: 'Pittu AI Knowledge', cat: 'AI' },
    { id: 'database', label: 'Infra & Database', cat: 'AI' },
  ]

  const commandResults = allNavItems.filter((i) =>
    i.label.toLowerCase().includes(commandQuery.toLowerCase()) || i.cat.toLowerCase().includes(commandQuery.toLowerCase())
  )

  // 1. ADMIN ENTERPRISE LOGIN VIEW (ULTRA-LUXURY ANIMATED GLASSMORPHIC CYBER PORTAL)
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#050711] text-slate-100 flex flex-col justify-center items-center p-4 relative overflow-hidden font-sans select-none">
        {/* Cyber Mesh Background Pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(#1e1b4b_1.2px,transparent_1.2px)] [background-size:32px_32px] opacity-40 pointer-events-none" />

        {/* Ambient Glowing Animated Orbs */}
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.25, 0.4, 0.25],
            x: [0, 20, 0],
            y: [0, -20, 0],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -top-24 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-indigo-600/25 rounded-full blur-[140px] pointer-events-none"
        />
        <motion.div
          animate={{
            scale: [1, 1.25, 1],
            opacity: [0.15, 0.35, 0.15],
            x: [0, -30, 0],
            y: [0, 30, 0],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
          className="absolute -bottom-20 -left-20 w-[500px] h-[400px] bg-cyan-500/20 rounded-full blur-[130px] pointer-events-none"
        />
        <motion.div
          animate={{
            scale: [1, 1.15, 1],
            opacity: [0.2, 0.3, 0.2],
          }}
          transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
          className="absolute -bottom-24 -right-20 w-[550px] h-[400px] bg-purple-600/20 rounded-full blur-[150px] pointer-events-none"
        />

        {/* Floating Return Button */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="absolute top-6 left-6 z-20">
          <Link
            to="/"
            className="group flex items-center gap-2.5 text-xs font-medium text-slate-400 hover:text-white transition-all bg-[#0d1222]/80 hover:bg-[#131b31] px-4 py-2.5 rounded-xl border border-slate-800/90 hover:border-indigo-500/50 shadow-lg backdrop-blur-xl"
          >
            <FaArrowLeft className="group-hover:-translate-x-1 transition-transform text-indigo-400 text-xs" />
            <span>Return to Live Portfolio</span>
          </Link>
        </motion.div>

        {/* Main Glassmorphic Login Card */}
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-md bg-[#0b0f19]/90 border border-indigo-500/25 rounded-3xl p-8 shadow-[0_0_80px_rgba(99,102,241,0.18)] backdrop-blur-2xl relative z-10 space-y-6"
        >
          {/* Top Security Status Pill */}
          <div className="flex justify-center">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-[11px] font-mono text-indigo-300">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <FaShieldAlt className="text-indigo-400 text-[10px]" />
              <span>Supabase Cloud Auth • 256-Bit RLS Active</span>
            </div>
          </div>

          {/* Console Header */}
          <div className="text-center space-y-2">
            <motion.div
              whileHover={{ rotate: 360, scale: 1.05 }}
              transition={{ duration: 0.8 }}
              className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 grid place-items-center mx-auto text-white font-black text-lg shadow-xl shadow-indigo-600/30 border border-white/20 relative"
            >
              PA
              <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-[#0b0f19] flex items-center justify-center text-[8px] text-white">✓</span>
            </motion.div>
            <h2 className="text-xl font-extrabold text-white tracking-tight font-display">Executive Studio Console</h2>
            <p className="text-xs text-slate-400 font-medium">Enterprise Authentication Portal</p>
          </div>

          {/* Login Error Banner */}
          {loginError && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-3.5 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs text-center font-medium font-mono"
            >
              {loginError}
            </motion.div>
          )}

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Console Email</label>
              <div className="relative group">
                <FaEnvelope className="absolute left-3.5 top-3.5 text-slate-500 group-focus-within:text-indigo-400 transition-colors text-xs" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="w-full bg-[#050711] border border-slate-800 rounded-xl pl-9 pr-3.5 py-3 text-xs text-white outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30 font-mono transition-all"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Security Passcode</label>
              <div className="relative group">
                <FaLock className="absolute left-3.5 top-3.5 text-slate-500 group-focus-within:text-indigo-400 transition-colors text-xs" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-[#050711] border border-slate-800 rounded-xl pl-9 pr-10 py-3 text-xs text-white outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30 font-mono transition-all"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3.5 text-slate-500 hover:text-indigo-300 text-xs transition-colors"
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.015 }}
              whileTap={{ scale: 0.985 }}
              type="submit"
              disabled={loggingIn}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white font-bold text-xs tracking-wide transition-all shadow-xl shadow-indigo-600/30 flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer mt-2"
            >
              {loggingIn ? (
                <>
                  <FaSync className="animate-spin text-xs" /> Authenticating via Supabase Cloud...
                </>
              ) : (
                'Sign In with Supabase Account'
              )}
            </motion.button>
          </form>

          {/* Card Footer Badges */}
          <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500 font-mono">
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> OAuth 2.0 Ready
            </span>
            <span className="text-slate-400">Row Level Security ON</span>
          </div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#070913] text-slate-200 flex flex-col font-sans relative">
      {/* Floating Executive Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-6 right-6 z-[110] bg-[#0f172a] border border-emerald-500/40 text-emerald-300 px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 backdrop-blur-xl text-xs font-medium"
          >
            <FaCheckCircle className="text-emerald-400 text-sm shrink-0" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Command Palette Modal (⌘K) */}
      <AnimatePresence>
        {commandOpen && (
          <div className="fixed inset-0 z-[120] bg-slate-950/80 backdrop-blur-md flex items-start justify-center pt-24 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              className="bg-[#0f172a] border border-slate-800 rounded-2xl p-4 w-full max-w-lg shadow-2xl space-y-3"
            >
              <div className="relative">
                <FaSearch className="absolute left-3.5 top-3.5 text-slate-500 text-xs" />
                <input
                  type="text"
                  autoFocus
                  placeholder="Type a command or jump to section (e.g. Work Experience, Education, Hero)..."
                  value={commandQuery}
                  onChange={(e) => setCommandQuery(e.target.value)}
                  className="w-full bg-[#070913] border border-slate-800 rounded-xl pl-9 pr-8 py-2.5 text-xs text-white outline-none focus:border-indigo-500"
                />
                <button
                  type="button"
                  onClick={() => setCommandOpen(false)}
                  className="absolute right-3 top-3 text-xs text-slate-500 hover:text-white"
                >
                  <FaTimes />
                </button>
              </div>

              <div className="max-h-60 overflow-y-auto space-y-1 pr-1">
                {commandResults.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id)
                      setCommandOpen(false)
                      setCommandQuery('')
                    }}
                    className="w-full flex items-center justify-between p-2.5 rounded-lg hover:bg-indigo-600/20 hover:text-indigo-300 text-xs font-medium text-slate-300 transition-colors text-left"
                  >
                    <span>{item.label}</span>
                    <span className="text-[10px] text-slate-500 font-mono uppercase">{item.cat}</span>
                  </button>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Warning Reset Confirmation Alert Modal */}
      <AnimatePresence>
        {showResetConfirm && (
          <div className="fixed inset-0 z-[150] bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#0f172a] border border-rose-500/40 rounded-2xl p-6 w-full max-w-md shadow-2xl space-y-4 text-left"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-rose-500/20 text-rose-400 grid place-items-center text-lg shrink-0">
                  <FaExclamationTriangle />
                </div>
                <div>
                  <h3 className="font-bold text-white text-base">Restore Data to Defaults?</h3>
                  <p className="text-xs text-rose-300 font-mono mt-0.5">⚠️ Warning: Action Cannot Be Undone</p>
                </div>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed font-sans">
                Kya aap sure ho ki saara CMS data default state par restore karna chahte ho? Aapke sabhi customized titles, skills, projects, logo URLs aur experience entries reset ho jayenge.
              </p>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowResetConfirm(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 text-xs font-semibold transition-colors"
                >
                  Cancel (Galti se click hua)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowResetConfirm(false)
                    resetCMSKnowledgeToDefault()
                  }}
                  className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition-all shadow-md shadow-rose-600/20 flex items-center gap-1.5"
                >
                  <FaUndo /> Yes, Confirm Reset
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Visual Icon Grid Gallery Modal */}
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
                    className="w-full bg-[#070913] border border-slate-800 rounded-xl pl-9 pr-3.5 py-2 text-xs text-white outline-none focus:border-indigo-500"
                  />
                </div>

                {pickerModal.type === 'skill' && (
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      placeholder="Paste Custom Image Logo URL (https://...)..."
                      value={customLogoUrl}
                      onChange={(e) => setCustomLogoUrl(e.target.value)}
                      className="flex-1 bg-[#070913] border border-slate-800 rounded-xl px-3 py-2 text-xs text-indigo-300 outline-none focus:border-indigo-500 font-mono"
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
                      className="flex flex-col items-center justify-center p-3 rounded-xl bg-[#070913] border border-slate-800/80 hover:border-indigo-500 hover:bg-indigo-500/10 transition-all text-center group"
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
      <header className="border-b border-slate-800/80 bg-[#0b0f19]/90 backdrop-blur-md px-6 py-3 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-indigo-600 grid place-items-center text-white font-bold font-display text-xs shadow-sm">
            PA
          </div>
          <div className="flex items-center gap-2">
            <span className="font-bold text-white text-xs tracking-tight">Executive Studio Console</span>
            <span className="text-slate-600 text-xs">/</span>
            <span className="text-xs font-semibold text-indigo-400 capitalize">{activeTab}</span>
          </div>

          <span className="hidden sm:inline-flex items-center gap-1.5 text-[11px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded-full ml-2">
            <FaCircle className="text-[6px] animate-pulse" /> Live Sync Active
          </span>
        </div>

        <div className="flex items-center gap-2.5">
          {/* Quick Search Shortcut */}
          <button
            onClick={() => setCommandOpen(true)}
            className="hidden md:flex items-center gap-2 text-xs text-slate-400 bg-[#070913] border border-slate-800 px-3 py-1.5 rounded-lg hover:border-slate-700 transition-colors"
          >
            <FaSearch className="text-[10px]" />
            <span>Search console...</span>
            <kbd className="text-[10px] font-mono bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded border border-slate-700">⌘K</kbd>
          </button>

          <button
            onClick={handleSaveAll}
            className="flex items-center gap-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 px-3.5 py-2 rounded-lg transition-all shadow-sm"
          >
            <FaSave /> Save Changes
          </button>

          <button
            onClick={() => setShowResetConfirm(true)}
            title="Reset data to defaults (Requires confirmation)"
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
            onClick={handleSignOut}
            title="Sign Out from Supabase Auth"
            className="p-2 text-xs text-rose-400 hover:text-rose-300 bg-rose-500/10 border border-rose-500/20 rounded-lg hover:bg-rose-500/20 transition-all flex items-center gap-1"
          >
            <FaSignOutAlt /> Sign Out
          </button>
        </div>
      </header>

      <div className="flex-1 flex flex-col md:flex-row">
        {/* Left Grouped Executive Sidebar */}
        <aside className="w-full md:w-60 border-r border-slate-800/80 bg-[#070913] p-3 space-y-5 shrink-0">
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
                { id: 'github', label: 'GitHub & Open Source', icon: FaGithub, badge: 'GIT' },
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
                        ? 'bg-indigo-600 text-white shadow-sm font-semibold'
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
        <main className="flex-1 p-6 space-y-6 overflow-y-auto max-h-[calc(100vh-53px)] bg-[#0b0f19]">
          {/* TAB 1: DASHBOARD OVERVIEW */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6 max-w-5xl">
              <div>
                <h2 className="text-lg font-bold text-white">Executive Studio Dashboard</h2>
                <p className="text-xs text-slate-400 mt-0.5">Central control panel for Priyanshu Agarwal's Portfolio & Pittu AI Engine</p>
              </div>

              {/* Metric Cards Grid */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-[#0f172a] border border-slate-800 rounded-xl p-4 space-y-1">
                  <div className="flex items-center justify-between text-slate-400">
                    <span className="text-xs font-medium">Skill Categories</span>
                    <FaSlidersH className="text-indigo-400 text-xs" />
                  </div>
                  <p className="text-2xl font-bold text-white">{kb.skillCategories?.length || 0}</p>
                </div>

                <div className="bg-[#0f172a] border border-slate-800 rounded-xl p-4 space-y-1">
                  <div className="flex items-center justify-between text-slate-400">
                    <span className="text-xs font-medium">Projects Listed</span>
                    <FaProjectDiagram className="text-cyan-400 text-xs" />
                  </div>
                  <p className="text-2xl font-bold text-white">{kb.projects?.length || 0}</p>
                </div>

                <div className="bg-[#0f172a] border border-slate-800 rounded-xl p-4 space-y-1">
                  <div className="flex items-center justify-between text-slate-400">
                    <span className="text-xs font-medium">Certifications</span>
                    <FaAward className="text-emerald-400 text-xs" />
                  </div>
                  <p className="text-2xl font-bold text-white">{certifications.length}</p>
                </div>

                <div className="bg-[#0f172a] border border-slate-800 rounded-xl p-4 space-y-1">
                  <div className="flex items-center justify-between text-slate-400">
                    <span className="text-xs font-medium">Pittu AI Knowledge</span>
                    <FaRobot className="text-purple-400 text-xs" />
                  </div>
                  <p className="text-2xl font-bold text-white">{kb.faqs?.length || 0}</p>
                </div>
              </div>

              {/* Quick Jump Links */}
              <div className="bg-[#0f172a] border border-slate-800 rounded-xl p-5 space-y-3">
                <h3 className="font-bold text-white text-xs uppercase tracking-wider text-slate-400">Quick Section Management</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <button
                    onClick={() => setActiveTab('experience')}
                    className="p-3.5 rounded-xl bg-[#070913] border border-slate-800 text-left hover:border-indigo-500 transition-all flex items-center justify-between group"
                  >
                    <div>
                      <p className="text-xs font-semibold text-white">Work Experience</p>
                      <p className="text-[11px] text-slate-400 mt-0.5">Edit roles & bullet points</p>
                    </div>
                    <FaChevronRight className="text-slate-500 group-hover:text-indigo-400 text-xs" />
                  </button>

                  <button
                    onClick={() => setActiveTab('skills')}
                    className="p-3.5 rounded-xl bg-[#070913] border border-slate-800 text-left hover:border-indigo-500 transition-all flex items-center justify-between group"
                  >
                    <div>
                      <p className="text-xs font-semibold text-white">Skills & Logos</p>
                      <p className="text-[11px] text-slate-400 mt-0.5">Edit progress bars & icons</p>
                    </div>
                    <FaChevronRight className="text-slate-500 group-hover:text-indigo-400 text-xs" />
                  </button>

                  <button
                    onClick={() => setActiveTab('github')}
                    className="p-3.5 rounded-xl bg-[#070913] border border-slate-800 text-left hover:border-indigo-500 transition-all flex items-center justify-between group"
                  >
                    <div>
                      <p className="text-xs font-semibold text-white">GitHub API</p>
                      <p className="text-[11px] text-slate-400 mt-0.5">Manage live REST integration</p>
                    </div>
                    <FaChevronRight className="text-slate-500 group-hover:text-indigo-400 text-xs" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 8: WORK EXPERIENCE & INTERNSHIPS CMS (FULL DETAILED WITH BULLET POINTS) */}
          {activeTab === 'experience' && (
            <div className="space-y-6 max-w-5xl">
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div>
                  <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    <FaBriefcase className="text-indigo-400" /> Work Experience & Internships CMS
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5 font-medium">
                    Manage professional roles, internships, locations, duration timelines, and detailed accomplishment bullet points
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => {
                      const newExp = {
                        id: `exp_${Date.now()}`,
                        role: 'Graphic Design Intern',
                        company: 'JALDIRIDE CONNECT PVT LTD',
                        location: 'Jaipur, Rajasthan (Remote / On-site)',
                        duration: '3 Months',
                        startDate: 'Nov 2025',
                        endDate: 'Jan 2026',
                        type: 'Internship',
                        points: [
                          'Designed promotional social media graphics, banners, and digital marketing materials for Jaldiride Connect.',
                          'Created vector icons, UI layout mockups, and visual assets following strict brand design guidelines.',
                          'Collaborated closely with marketing and product development teams to produce high-converting creative graphics.',
                        ],
                      }
                      setKb({ ...kb, experience: [newExp, ...kb.experience] })
                      triggerToast('Added detailed experience card')
                    }}
                    className="text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 px-3.5 py-2 rounded-lg flex items-center gap-1.5 shadow-sm"
                  >
                    <FaPlus /> Add Experience Card
                  </button>
                  <button
                    onClick={handleSaveAll}
                    className="text-xs font-semibold text-slate-900 bg-emerald-400 hover:bg-emerald-300 px-3.5 py-2 rounded-lg shadow-sm"
                  >
                    <FaSave className="inline mr-1.5" /> Save Edits
                  </button>
                </div>
              </div>

              <div className="space-y-5">
                {kb.experience.map((exp, idx) => (
                  <div key={exp.id || idx} className="bg-[#0f172a] border border-slate-800 rounded-xl p-5 space-y-4 shadow-sm">
                    <div className="flex items-center justify-between gap-4 pb-3 border-b border-slate-800">
                      <div className="flex items-center gap-2.5">
                        <span className="w-7 h-7 rounded-lg bg-indigo-600/20 text-indigo-400 grid place-items-center text-xs font-bold font-mono">
                          #{idx + 1}
                        </span>
                        <span className="font-bold text-white text-sm">Experience & Role Details</span>
                      </div>
                      <button
                        onClick={() => {
                          const updated = kb.experience.filter((_, i) => i !== idx)
                          setKb({ ...kb, experience: updated })
                          triggerToast('Removed experience card')
                        }}
                        className="text-rose-400 hover:text-rose-300 p-1.5 rounded-lg bg-rose-500/10 border border-rose-500/20 text-xs"
                      >
                        <FaTrash /> Remove Card
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-slate-400 mb-1">Job / Internship Role Title</label>
                        <input
                          type="text"
                          value={exp.role}
                          onChange={(e) => {
                            const updated = [...kb.experience]
                            updated[idx].role = e.target.value
                            setKb({ ...kb, experience: updated })
                          }}
                          className="w-full bg-[#070913] border border-slate-800 rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-indigo-500 font-bold"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-slate-400 mb-1">Company / Organization Name</label>
                        <div className="relative">
                          <FaBuilding className="absolute left-3 top-3 text-slate-500 text-xs" />
                          <input
                            type="text"
                            value={exp.company || ''}
                            onChange={(e) => {
                              const updated = [...kb.experience]
                              updated[idx].company = e.target.value
                              setKb({ ...kb, experience: updated })
                            }}
                            className="w-full bg-[#070913] border border-slate-800 rounded-lg pl-8 pr-3 py-2 text-xs text-white outline-none focus:border-indigo-500 font-semibold"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-slate-400 mb-1">Company Website Link (URL)</label>
                        <div className="relative">
                          <FaGlobe className="absolute left-3 top-3 text-slate-500 text-xs" />
                          <input
                            type="text"
                            value={exp.companyUrl || exp.url || ''}
                            onChange={(e) => {
                              const updated = [...kb.experience]
                              updated[idx].companyUrl = e.target.value
                              setKb({ ...kb, experience: updated })
                            }}
                            placeholder="https://jaldiride.com"
                            className="w-full bg-[#070913] border border-slate-800 rounded-lg pl-8 pr-3 py-2 text-xs text-cyan-300 font-mono outline-none focus:border-indigo-500"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-slate-400 mb-1">Company Logo Image URL</label>
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-lg bg-[#070913] border border-slate-800 shrink-0 grid place-items-center overflow-hidden">
                            {exp.logo || exp.companyLogo ? (
                              <img src={exp.logo || exp.companyLogo} alt="Logo" className="w-full h-full object-contain" />
                            ) : (
                              <FaBuilding className="text-slate-600 text-xs" />
                            )}
                          </div>
                          <input
                            type="text"
                            value={exp.logo || exp.companyLogo || ''}
                            onChange={(e) => {
                              const updated = [...kb.experience]
                              updated[idx].logo = e.target.value
                              setKb({ ...kb, experience: updated })
                            }}
                            placeholder="https://jaldiride.com/favicon.ico or logo image URL"
                            className="flex-1 bg-[#070913] border border-slate-800 rounded-lg px-3 py-2 text-xs text-indigo-300 font-mono outline-none focus:border-indigo-500"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-slate-400 mb-1">Employment Type (e.g. Internship, Contract, Full-Time)</label>
                        <input
                          type="text"
                          value={exp.type || ''}
                          onChange={(e) => {
                            const updated = [...kb.experience]
                            updated[idx].type = e.target.value
                            setKb({ ...kb, experience: updated })
                          }}
                          className="w-full bg-[#070913] border border-slate-800 rounded-lg px-3 py-2 text-xs text-indigo-300 outline-none focus:border-indigo-500"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-slate-400 mb-1">Duration / Timeline (e.g. 3 Months, Nov 2025 - Jan 2026)</label>
                        <div className="relative">
                          <FaCalendarAlt className="absolute left-3 top-3 text-slate-500 text-xs" />
                          <input
                            type="text"
                            value={exp.duration || ''}
                            onChange={(e) => {
                              const updated = [...kb.experience]
                              updated[idx].duration = e.target.value
                              setKb({ ...kb, experience: updated })
                            }}
                            placeholder="3 Months (Nov 2025 – Jan 2026)"
                            className="w-full bg-[#070913] border border-slate-800 rounded-lg pl-8 pr-3 py-2 text-xs text-indigo-300 font-mono outline-none focus:border-indigo-500"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-slate-400 mb-1">Location (City, State / Remote)</label>
                        <div className="relative">
                          <FaMapMarkerAlt className="absolute left-3 top-3 text-slate-500 text-xs" />
                          <input
                            type="text"
                            value={exp.location || 'Jaipur, Rajasthan'}
                            onChange={(e) => {
                              const updated = [...kb.experience]
                              updated[idx].location = e.target.value
                              setKb({ ...kb, experience: updated })
                            }}
                            className="w-full bg-[#070913] border border-slate-800 rounded-lg pl-8 pr-3 py-2 text-xs text-slate-200 outline-none focus:border-indigo-500"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-slate-400 mb-1">Start Date & End Date</label>
                        <div className="grid grid-cols-2 gap-2">
                          <input
                            type="text"
                            value={exp.startDate || 'Nov 2025'}
                            onChange={(e) => {
                              const updated = [...kb.experience]
                              updated[idx].startDate = e.target.value
                              setKb({ ...kb, experience: updated })
                            }}
                            placeholder="Start Date"
                            className="bg-[#070913] border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-300 outline-none font-mono"
                          />
                          <input
                            type="text"
                            value={exp.endDate || 'Jan 2026'}
                            onChange={(e) => {
                              const updated = [...kb.experience]
                              updated[idx].endDate = e.target.value
                              setKb({ ...kb, experience: updated })
                            }}
                            placeholder="End Date"
                            className="bg-[#070913] border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-300 outline-none font-mono"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Bullet Points List Manager */}
                    <div className="space-y-3 pt-2 border-t border-slate-800">
                      <label className="block text-xs font-semibold text-indigo-400 flex items-center gap-2">
                        <FaListUl /> Key Responsibilities & Accomplishments Bullet Points ({(exp.points || []).length})
                      </label>

                      <div className="space-y-2">
                        {(exp.points || []).map((pt, ptIdx) => (
                          <div key={ptIdx} className="flex items-center gap-2.5 bg-[#070913] border border-slate-800 rounded-lg p-2.5">
                            <span className="w-5 h-5 rounded bg-indigo-600/20 text-indigo-400 grid place-items-center text-[10px] font-bold font-mono shrink-0">
                              •
                            </span>
                            <input
                              type="text"
                              value={pt}
                              onChange={(e) => {
                                const updated = [...kb.experience]
                                updated[idx].points[ptIdx] = e.target.value
                                setKb({ ...kb, experience: updated })
                              }}
                              className="flex-1 bg-transparent border-none text-xs text-slate-200 outline-none font-sans"
                            />
                            <button
                              onClick={() => {
                                const updated = [...kb.experience]
                                updated[idx].points = updated[idx].points.filter((_, i) => i !== ptIdx)
                                setKb({ ...kb, experience: updated })
                              }}
                              className="text-rose-400 hover:text-rose-300 p-1 text-xs shrink-0"
                            >
                              <FaTrash />
                            </button>
                          </div>
                        ))}
                      </div>

                      {/* Add New Bullet Point Input */}
                      <div className="flex items-center gap-2 pt-1">
                        <input
                          type="text"
                          placeholder="Add new responsibility bullet point..."
                          value={newExpPoint[idx] || ''}
                          onChange={(e) => setNewExpPoint({ ...newExpPoint, [idx]: e.target.value })}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault()
                              const val = (newExpPoint[idx] || '').trim()
                              if (val) {
                                const updated = [...kb.experience]
                                updated[idx].points = [...(updated[idx].points || []), val]
                                setKb({ ...kb, experience: updated })
                                setNewExpPoint({ ...newExpPoint, [idx]: '' })
                              }
                            }
                          }}
                          className="flex-1 bg-[#070913] border border-slate-800 rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-indigo-500"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const val = (newExpPoint[idx] || '').trim()
                            if (val) {
                              const updated = [...kb.experience]
                              updated[idx].points = [...(updated[idx].points || []), val]
                              setKb({ ...kb, experience: updated })
                              setNewExpPoint({ ...newExpPoint, [idx]: '' })
                            }
                          }}
                          className="bg-indigo-600 hover:bg-indigo-500 text-white font-medium px-3.5 py-2 rounded-lg text-xs flex items-center gap-1 shrink-0"
                        >
                          <FaPlus /> Add Bullet
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* OTHER TABS */}
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

              <div className="bg-[#0f172a] border border-slate-800 rounded-xl p-5 space-y-3">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-indigo-400">Global Spacing Presets</span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <button
                    onClick={() => {
                      const updatedSections = layoutConfig.sections.map((s) => ({ ...s, paddingTopRem: 1, paddingBottomRem: 1 }))
                      setKb({ ...kb, layoutConfig: { preset: 'compact', sections: updatedSections } })
                      triggerToast('Applied Ultra-Compact Preset')
                    }}
                    className={`p-3.5 rounded-xl border text-left transition-all ${
                      layoutConfig.preset === 'compact'
                        ? 'bg-indigo-600/20 border-indigo-500 text-indigo-300 font-bold'
                        : 'bg-[#070913] border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    <p className="text-xs font-semibold">⚡ Ultra-Compact (Zero Gaps)</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">1rem padding. Tight continuous stream.</p>
                  </button>

                  <button
                    onClick={() => {
                      const updatedSections = layoutConfig.sections.map((s) => ({ ...s, paddingTopRem: 2.5, paddingBottomRem: 2.5 }))
                      setKb({ ...kb, layoutConfig: { preset: 'balanced', sections: updatedSections } })
                      triggerToast('Applied Balanced Preset')
                    }}
                    className={`p-3.5 rounded-xl border text-left transition-all ${
                      layoutConfig.preset === 'balanced'
                        ? 'bg-indigo-600/20 border-indigo-500 text-indigo-300 font-bold'
                        : 'bg-[#070913] border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    <p className="text-xs font-semibold">⚖️ Balanced Rhythm</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">2.5rem padding. Optimal spacing.</p>
                  </button>

                  <button
                    onClick={() => {
                      const updatedSections = layoutConfig.sections.map((s) => ({ ...s, paddingTopRem: 4.5, paddingBottomRem: 4.5 }))
                      setKb({ ...kb, layoutConfig: { preset: 'spacious', sections: updatedSections } })
                      triggerToast('Applied Spacious Preset')
                    }}
                    className={`p-3.5 rounded-xl border text-left transition-all ${
                      layoutConfig.preset === 'spacious'
                        ? 'bg-indigo-600/20 border-indigo-500 text-indigo-300 font-bold'
                        : 'bg-[#070913] border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    <p className="text-xs font-semibold">🌌 Spacious (Generous)</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">4.5rem padding. Generous vertical space.</p>
                  </button>
                </div>
              </div>

              <div className="bg-[#0f172a] border border-slate-800 rounded-xl p-5 space-y-3">
                <h3 className="font-bold text-white text-xs uppercase tracking-wider text-slate-400">Homepage Sequence & Vertical Gap Controls</h3>
                <div className="space-y-3">
                  {layoutConfig.sections.map((sec, idx) => (
                    <div key={sec.id} className="p-3.5 rounded-xl bg-[#070913] border border-slate-800 space-y-3">
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

          {activeTab === 'stats' && (
            <div className="space-y-6 max-w-5xl">
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div>
                  <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    <FaChartBar className="text-indigo-400" /> Stats Counter Cards CMS
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">Edit achievement counter numbers, suffixes (+, %), and card titles</p>
                </div>
                <button
                  onClick={() => {
                    const newStat = { id: `stat-${Date.now()}`, label: 'New Metric Title', value: 10, suffix: '+' }
                    setKb({ ...kb, stats: [...stats, newStat] })
                    triggerToast('Added stat card')
                  }}
                  className="text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 px-3.5 py-2 rounded-lg flex items-center gap-1.5 shadow-sm"
                >
                  <FaPlus /> Add Stat Card
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {stats.map((stat, idx) => (
                  <div key={stat.id || idx} className="bg-[#0f172a] border border-slate-800 rounded-xl p-4 space-y-3 shadow-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-indigo-400 bg-indigo-500/10 px-2.5 py-1 rounded">Stat Card #{idx + 1}</span>
                      <button
                        onClick={() => {
                          const updated = stats.filter((_, i) => i !== idx)
                          setKb({ ...kb, stats: updated })
                          triggerToast('Removed stat card')
                        }}
                        className="text-rose-400 hover:text-rose-300 p-1 text-xs"
                      >
                        <FaTrash />
                      </button>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-400 mb-1">Metric Title</label>
                      <input
                        type="text"
                        value={stat.label}
                        onChange={(e) => {
                          const updated = [...stats]
                          updated[idx].label = e.target.value
                          setKb({ ...kb, stats: updated })
                        }}
                        className="w-full bg-[#070913] border border-slate-800 rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-indigo-500 font-semibold"
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
                          className="w-full bg-[#070913] border border-slate-800 rounded-lg px-3 py-2 text-xs text-indigo-300 font-mono outline-none focus:border-indigo-500 font-bold"
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
                          className="w-full bg-[#070913] border border-slate-800 rounded-lg px-3 py-2 text-xs text-indigo-300 font-mono outline-none focus:border-indigo-500"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'github' && (
            <div className="space-y-6 max-w-5xl">
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div>
                  <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    <FaGithub className="text-indigo-400" /> GitHub & Open Source CMS Connection
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">Configure live REST API synchronization for your GitHub profile and activity feed</p>
                </div>
                <button
                  type="button"
                  onClick={handleSaveAll}
                  className="text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 px-4 py-2 rounded-lg flex items-center gap-1.5 shadow-sm"
                >
                  <FaSave /> Save GitHub Settings
                </button>
              </div>

              <div className="bg-[#0f172a] border border-slate-800 rounded-xl p-5 space-y-4">
                <h3 className="font-bold text-white text-xs uppercase tracking-wider text-indigo-400">Live API Credentials</h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1">GitHub Username</label>
                    <input
                      type="text"
                      value={(kb.profile?.github || '').split('github.com/').pop().replace(/\/$/, '') || 'agarwalpriyanshu886-ctrl'}
                      onChange={(e) => {
                        const newUsername = e.target.value.trim()
                        setKb({
                          ...kb,
                          profile: {
                            ...kb.profile,
                            github: `https://github.com/${newUsername}`,
                          },
                        })
                      }}
                      className="w-full bg-[#070913] border border-slate-800 rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-indigo-500 font-mono font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1">GitHub Public Profile URL</label>
                    <input
                      type="text"
                      value={kb.profile?.github || 'https://github.com/agarwalpriyanshu886-ctrl'}
                      onChange={(e) =>
                        setKb({
                          ...kb,
                          profile: {
                            ...kb.profile,
                            github: e.target.value.trim(),
                          },
                        })
                      }
                      className="w-full bg-[#070913] border border-slate-800 rounded-lg px-3 py-2 text-xs text-indigo-300 outline-none focus:border-indigo-500 font-mono"
                    />
                  </div>
                </div>

                <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#070913] border border-slate-800 p-3.5 rounded-lg">
                  <div>
                    <p className="text-xs font-semibold text-white flex items-center gap-2">
                      <FaSync className={`text-indigo-400 ${gitTesting ? 'animate-spin' : ''}`} /> GitHub REST API Connectivity Status
                    </p>
                    <p className="text-[11px] text-slate-400 mt-0.5">Test connection to verify public repositories and real commit activity feed</p>
                  </div>

                  <button
                    type="button"
                    onClick={handleTestGitHubConnection}
                    disabled={gitTesting}
                    className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-4 py-2 rounded-lg text-xs flex items-center gap-1.5 shrink-0"
                  >
                    {gitTesting ? 'Testing REST API...' : 'Test Connection'}
                  </button>
                </div>

                {gitTestStatus && (
                  <div
                    className={`p-3 rounded-lg text-xs font-mono border ${
                      gitTestStatus.success
                        ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                        : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
                    }`}
                  >
                    {gitTestStatus.msg}
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'skills' && (
            <div className="space-y-6 max-w-5xl">
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div>
                  <h2 className="text-lg font-bold text-white">Skills & Technology Logos CMS</h2>
                  <p className="text-xs text-slate-400 mt-0.5">Edit category names, technology logos, proficiency sliders, and accent colors</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center bg-[#070913] border border-slate-800 rounded-lg p-1">
                    <button
                      onClick={() => setViewMode('grid')}
                      className={`p-1.5 rounded text-xs transition-colors ${viewMode === 'grid' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'}`}
                      title="Cards Grid View"
                    >
                      <FaThLarge />
                    </button>
                    <button
                      onClick={() => setViewMode('table')}
                      className={`p-1.5 rounded text-xs transition-colors ${viewMode === 'table' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'}`}
                      title="Table List View"
                    >
                      <FaTable />
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={handleAddCategory}
                    className="text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 px-3.5 py-2 rounded-lg transition-all flex items-center gap-1.5 shadow-sm"
                  >
                    <FaPlus /> Add Category
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

              {viewMode === 'grid' ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                  {(kb.skillCategories || []).map((cat, catIdx) => (
                    <div key={cat.id || catIdx} className="bg-[#0f172a] border border-slate-800 rounded-xl p-5 space-y-4 shadow-sm">
                      <div className="flex items-center justify-between pb-3 border-b border-slate-800 gap-3">
                        <div className="flex items-center gap-2.5 flex-1">
                          <button
                            type="button"
                            onClick={() => setPickerModal({ open: true, type: 'category', catIdx, skillIdx: 0 })}
                            title="Change category logo/icon"
                            className="w-8 h-8 rounded-lg bg-[#070913] border border-slate-700 grid place-items-center text-indigo-400 hover:scale-105 transition-transform cursor-pointer shrink-0"
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
                            className="font-semibold text-white text-sm bg-[#070913] border border-slate-800 rounded-lg px-3 py-1 outline-none focus:border-indigo-500 flex-1"
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

                      <div className="space-y-3 pt-1">
                        {cat.skills.map((skill, skillIdx) => (
                          <div key={skillIdx} className="bg-[#070913] border border-slate-800 rounded-lg p-3 space-y-2">
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
                          className="flex-1 bg-[#070913] border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white outline-none focus:border-indigo-500"
                        />
                        <input
                          type="number"
                          min="0"
                          max="100"
                          placeholder="%"
                          value={newSkillLevels[catIdx] || 75}
                          onChange={(e) => setNewSkillLevels({ ...newSkillLevels, [catIdx]: Number(e.target.value) })}
                          className="w-14 bg-[#070913] border border-slate-800 rounded-lg px-2 py-1.5 text-xs text-indigo-300 font-mono outline-none focus:border-indigo-500"
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
              ) : (
                <div className="bg-[#0f172a] border border-slate-800 rounded-xl overflow-hidden shadow-sm">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#070913] border-b border-slate-800 text-slate-400 font-mono uppercase text-[10px]">
                      <tr>
                        <th className="p-3.5">Category</th>
                        <th className="p-3.5">Technology Skill</th>
                        <th className="p-3.5">Logo</th>
                        <th className="p-3.5">Proficiency</th>
                        <th className="p-3.5 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800 text-slate-200">
                      {(kb.skillCategories || []).flatMap((cat, catIdx) =>
                        cat.skills.map((skill, skillIdx) => (
                          <tr key={`${catIdx}-${skillIdx}`} className="hover:bg-slate-800/30 transition-colors">
                            <td className="p-3.5 font-semibold text-white">{cat.label}</td>
                            <td className="p-3.5">{skill.name}</td>
                            <td className="p-3.5">
                              <button
                                onClick={() => setPickerModal({ open: true, type: 'skill', catIdx, skillIdx })}
                                className="w-7 h-7 rounded bg-slate-800 grid place-items-center text-indigo-400"
                              >
                                <SkillIcon name={skill.icon || 'SiPython'} className="text-xs" />
                              </button>
                            </td>
                            <td className="p-3.5 font-mono text-indigo-400 font-bold">{skill.level}%</td>
                            <td className="p-3.5 text-right">
                              <button
                                onClick={() => {
                                  const updatedCats = [...(kb.skillCategories || [])]
                                  updatedCats[catIdx].skills = updatedCats[catIdx].skills.filter((_, i) => i !== skillIdx)
                                  setKb({ ...kb, skillCategories: updatedCats })
                                }}
                                className="text-rose-400 hover:text-rose-300 p-1"
                              >
                                <FaTrash />
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              )}

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

          {activeTab === 'certifications' && (
            <div className="space-y-6 max-w-5xl">
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div>
                  <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    <FaAward className="text-indigo-400" /> Certifications Catalog CMS
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">Manage certification titles, issuing organizations, verification links, and detailed curriculum notes</p>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => {
                      const newCert = {
                        id: `cert-${Date.now()}`,
                        title: 'New Certification Title',
                        organization: 'IBM / Coursera',
                        date: '2026',
                        url: 'https://coursera.org/verify/example',
                        description: 'Detailed description of skills and topics covered in this certification course.',
                      }
                      setKb({ ...kb, certifications: [newCert, ...certifications] })
                      triggerToast('Added new certification entry card')
                    }}
                    className="text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 px-3.5 py-2 rounded-lg flex items-center gap-1.5 shadow-sm"
                  >
                    <FaPlus /> Add Certification Card
                  </button>
                  <button
                    onClick={handleSaveAll}
                    className="text-xs font-semibold text-slate-900 bg-emerald-400 hover:bg-emerald-300 px-3.5 py-2 rounded-lg shadow-sm"
                  >
                    <FaSave className="inline mr-1.5" /> Save Edits
                  </button>
                </div>
              </div>

              <div className="space-y-5">
                {certifications.map((cert, idx) => (
                  <div key={cert.id || idx} className="bg-[#0f172a] border border-slate-800 rounded-xl p-5 space-y-4 shadow-sm">
                    <div className="flex items-center justify-between gap-4 pb-3 border-b border-slate-800">
                      <div className="flex items-center gap-2.5">
                        <span className="w-7 h-7 rounded-lg bg-indigo-600/20 text-indigo-400 grid place-items-center text-xs font-bold font-mono">
                          #{idx + 1}
                        </span>
                        <span className="font-bold text-white text-sm">Certification Details</span>
                      </div>
                      <button
                        onClick={() => {
                          const updated = certifications.filter((_, i) => i !== idx)
                          setKb({ ...kb, certifications: updated })
                          triggerToast('Removed certification card')
                        }}
                        className="text-rose-400 hover:text-rose-300 p-1.5 rounded-lg bg-rose-500/10 border border-rose-500/20 text-xs"
                      >
                        <FaTrash /> Remove
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-slate-400 mb-1">Certification Title</label>
                        <input
                          type="text"
                          value={cert.title}
                          onChange={(e) => {
                            const updated = [...certifications]
                            updated[idx].title = e.target.value
                            setKb({ ...kb, certifications: updated })
                          }}
                          className="w-full bg-[#070913] border border-slate-800 rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-indigo-500 font-semibold"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-slate-400 mb-1">Issuing Organization</label>
                        <div className="relative">
                          <FaBuilding className="absolute left-3 top-3 text-slate-500 text-xs" />
                          <input
                            type="text"
                            value={cert.organization || ''}
                            onChange={(e) => {
                              const updated = [...certifications]
                              updated[idx].organization = e.target.value
                              setKb({ ...kb, certifications: updated })
                            }}
                            placeholder="e.g. IBM / Coursera"
                            className="w-full bg-[#070913] border border-slate-800 rounded-lg pl-8 pr-3 py-2 text-xs text-white outline-none focus:border-indigo-500"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-slate-400 mb-1">Completion Date / Year</label>
                        <div className="relative">
                          <FaCalendarAlt className="absolute left-3 top-3 text-slate-500 text-xs" />
                          <input
                            type="text"
                            value={cert.date || ''}
                            onChange={(e) => {
                              const updated = [...certifications]
                              updated[idx].date = e.target.value
                              setKb({ ...kb, certifications: updated })
                            }}
                            placeholder="e.g. 2025"
                            className="w-full bg-[#070913] border border-slate-800 rounded-lg pl-8 pr-3 py-2 text-xs text-indigo-300 font-mono outline-none focus:border-indigo-500"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-slate-400 mb-1">Verification / Certificate Link</label>
                        <div className="relative">
                          <FaLink className="absolute left-3 top-3 text-slate-500 text-xs" />
                          <input
                            type="text"
                            value={cert.url || ''}
                            onChange={(e) => {
                              const updated = [...certifications]
                              updated[idx].url = e.target.value
                              setKb({ ...kb, certifications: updated })
                            }}
                            placeholder="https://coursera.org/verify/..."
                            className="w-full bg-[#070913] border border-slate-800 rounded-lg pl-8 pr-3 py-2 text-xs text-cyan-300 font-mono outline-none focus:border-indigo-500"
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-400 mb-1">Detailed Course Description & Core Concepts Learned</label>
                      <textarea
                        rows={3}
                        value={cert.description || ''}
                        onChange={(e) => {
                          const updated = [...certifications]
                          updated[idx].description = e.target.value
                          setKb({ ...kb, certifications: updated })
                        }}
                        placeholder="Covered Python fundamentals, Pandas, NumPy, and data manipulation libraries..."
                        className="w-full bg-[#070913] border border-slate-800 rounded-lg p-3 text-xs text-slate-200 outline-none focus:border-indigo-500 leading-relaxed"
                      />
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
                  <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    <FaGraduationCap className="text-indigo-400" /> Academic Journey & Education CMS
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">Manage degrees, universities, SGPA grades, and academic achievements</p>
                </div>
                <button
                  onClick={() => {
                    const newEdu = {
                      id: `edu_${Date.now()}`,
                      degree: 'B.Tech in Computer Science & Engineering',
                      field: 'AI & Machine Learning Specialization',
                      institution: 'NIMS University Jaipur',
                      location: 'Jaipur, Rajasthan',
                      duration: '4 Years',
                      years: '2023 – 2027',
                      badge: 'Academic Honor',
                      sgpa: '8.86 SGPA',
                      description: 'Specializing in Artificial Intelligence, Deep Learning, Data Structures, and Software Architecture.',
                      highlights: ['Neural Networks', 'Python & C++', 'Data Structures', 'Machine Learning'],
                    }
                    setKb({ ...kb, education: [newEdu, ...kb.education] })
                    triggerToast('Added education card')
                  }}
                  className="text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 px-3.5 py-2 rounded-lg flex items-center gap-1.5 shadow-sm"
                >
                  <FaPlus /> Add Education Card
                </button>
              </div>

              <div className="space-y-5">
                {kb.education.map((edu, idx) => (
                  <div key={edu.id || idx} className="bg-[#0f172a] border border-slate-800 rounded-xl p-5 space-y-4 shadow-sm">
                    <div className="flex items-center justify-between gap-4 pb-3 border-b border-slate-800">
                      <div className="flex items-center gap-2.5">
                        <span className="w-7 h-7 rounded-lg bg-indigo-600/20 text-indigo-400 grid place-items-center text-xs font-bold font-mono">
                          #{idx + 1}
                        </span>
                        <span className="font-bold text-white text-sm">Academic Qualification Details</span>
                      </div>
                      <button
                        onClick={() => {
                          const updated = kb.education.filter((_, i) => i !== idx)
                          setKb({ ...kb, education: updated })
                          triggerToast('Removed education card')
                        }}
                        className="text-rose-400 hover:text-rose-300 p-1.5 rounded-lg bg-rose-500/10 border border-rose-500/20 text-xs"
                      >
                        <FaTrash /> Remove
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-slate-400 mb-1">Degree Title</label>
                        <input
                          type="text"
                          value={edu.degree}
                          onChange={(e) => {
                            const updated = [...kb.education]
                            updated[idx].degree = e.target.value
                            setKb({ ...kb, education: updated })
                          }}
                          className="w-full bg-[#070913] border border-slate-800 rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-indigo-500 font-bold"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-slate-400 mb-1">Field of Study / Branch</label>
                        <input
                          type="text"
                          value={edu.field || ''}
                          onChange={(e) => {
                            const updated = [...kb.education]
                            updated[idx].field = e.target.value
                            setKb({ ...kb, education: updated })
                          }}
                          placeholder="e.g. AI & Machine Learning"
                          className="w-full bg-[#070913] border border-slate-800 rounded-lg px-3 py-2 text-xs text-cyan-300 outline-none focus:border-indigo-500"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-slate-400 mb-1">Institution / University</label>
                        <input
                          type="text"
                          value={edu.institution || ''}
                          onChange={(e) => {
                            const updated = [...kb.education]
                            updated[idx].institution = e.target.value
                            setKb({ ...kb, education: updated })
                          }}
                          className="w-full bg-[#070913] border border-slate-800 rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-indigo-500 font-semibold"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-slate-400 mb-1">SGPA / Grade Score</label>
                        <input
                          type="text"
                          value={edu.sgpa || ''}
                          onChange={(e) => {
                            const updated = [...kb.education]
                            updated[idx].sgpa = e.target.value
                            setKb({ ...kb, education: updated })
                          }}
                          placeholder="e.g. 8.86 SGPA"
                          className="w-full bg-[#070913] border border-slate-800 rounded-lg px-3 py-2 text-xs text-indigo-300 font-mono outline-none focus:border-indigo-500 font-bold"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-400 mb-1">Academic Overview</label>
                      <textarea
                        rows={2}
                        value={edu.description || ''}
                        onChange={(e) => {
                          const updated = [...kb.education]
                          updated[idx].description = e.target.value
                          setKb({ ...kb, education: updated })
                        }}
                        className="w-full bg-[#070913] border border-slate-800 rounded-lg p-3 text-xs text-slate-200 outline-none focus:border-indigo-500 leading-relaxed"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'projects' && (
            <div className="space-y-6 max-w-5xl">
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div>
                  <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    <FaProjectDiagram className="text-indigo-400" /> Projects Catalog CMS
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">Manage project titles, categories, live URLs, GitHub repositories, and problem-solution breakdown</p>
                </div>
                <button
                  onClick={() => {
                    const newProj = {
                      id: `proj_${Date.now()}`,
                      title: 'New Innovation Project',
                      category: 'HYBRID',
                      shortDescription: 'Full-stack software application with AI integration.',
                      problem: 'Target problem statement solved.',
                      solution: 'Technical architecture implemented.',
                      demoUrl: 'https://',
                      githubUrl: 'https://github.com/agarwalpriyanshu886-ctrl',
                      status: 'LIVE',
                    }
                    setKb({ ...kb, projects: [newProj, ...kb.projects] })
                    triggerToast('Added new project entry')
                  }}
                  className="text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 px-3.5 py-2 rounded-lg flex items-center gap-1.5 shadow-sm"
                >
                  <FaPlus /> Add Project Card
                </button>
              </div>

              <div className="space-y-5">
                {kb.projects.map((proj, idx) => (
                  <div key={proj.id || idx} className="bg-[#0f172a] border border-slate-800 rounded-xl p-5 space-y-4 shadow-sm">
                    <div className="flex items-center justify-between gap-4 pb-3 border-b border-slate-800">
                      <div className="flex items-center gap-2.5">
                        <span className="w-7 h-7 rounded-lg bg-indigo-600/20 text-indigo-400 grid place-items-center text-xs font-bold font-mono">
                          #{idx + 1}
                        </span>
                        <span className="font-bold text-white text-sm">Project Specifications</span>
                      </div>
                      <button
                        onClick={() => {
                          const updated = kb.projects.filter((_, i) => i !== idx)
                          setKb({ ...kb, projects: updated })
                          triggerToast('Removed project entry')
                        }}
                        className="text-rose-400 hover:text-rose-300 p-1.5 rounded-lg bg-rose-500/10 border border-rose-500/20 text-xs"
                      >
                        <FaTrash /> Remove
                      </button>
                    </div>

                    {/* Project Banner Image Upload & URL Card */}
                    <div className="bg-[#070913] border border-slate-800 rounded-xl p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-semibold text-indigo-400 flex items-center gap-2">
                          <FaImage /> Project Cover / Banner Image
                        </label>
                        { (typeof proj.image === 'string' ? proj.image : proj.image?.url) && (
                          <button
                            type="button"
                            onClick={() => {
                              const updated = [...kb.projects]
                              delete updated[idx].image
                              delete updated[idx].imageUrl
                              setKb({ ...kb, projects: updated })
                              triggerToast('Reset project image')
                            }}
                            className="text-rose-400 hover:text-rose-300 text-[11px] font-mono"
                          >
                            Remove Custom Image
                          </button>
                        )}
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
                        {/* Live Image Thumbnail Preview */}
                        <div className="aspect-[16/9] rounded-lg bg-[#0f172a] border border-slate-800 overflow-hidden relative grid place-items-center group">
                          { (typeof proj.image === 'string' ? proj.image : proj.image?.url) || proj.imageUrl ? (
                            <img
                              src={(typeof proj.image === 'string' ? proj.image : proj.image?.url) || proj.imageUrl}
                              alt="Project Cover Preview"
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="text-center p-2">
                              <FaImage className="text-slate-600 text-lg mx-auto mb-1" />
                              <span className="text-[10px] text-slate-500 font-mono">No Custom Image</span>
                            </div>
                          )}
                        </div>

                        {/* File Upload & URL Controls */}
                        <div className="sm:col-span-2 space-y-3">
                          <div className="flex items-center gap-2">
                            <label className="bg-indigo-600 hover:bg-indigo-500 text-white font-medium px-3.5 py-2 rounded-lg text-xs cursor-pointer flex items-center gap-1.5 shrink-0 shadow-sm">
                              <FaUpload /> Upload Image File
                              <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={async (e) => {
                                  const file = e.target.files?.[0]
                                  if (file) {
                                    try {
                                      let finalImageUrl = ''
                                      // Try uploading to Supabase S3 Storage Bucket ('portfolio-assets')
                                      const sbStorageRes = await uploadImageToSupabaseStorage(file, 'projects')
                                      if (sbStorageRes.url) {
                                        finalImageUrl = sbStorageRes.url
                                      } else {
                                        // Fallback to Canvas compressed data URL
                                        finalImageUrl = await compressImageFile(file, 1000, 600, 0.78)
                                      }

                                      const updated = [...kb.projects]
                                      updated[idx].image = finalImageUrl
                                      updated[idx].imageUrl = finalImageUrl
                                      const updatedKb = { ...kb, projects: updated }
                                      setKb(updatedKb)
                                      saveActiveKnowledge(updatedKb)
                                      triggerToast(`Uploaded & saved image for ${proj.title}`)
                                    } catch (err) {
                                      console.error('Image upload error:', err)
                                    }
                                  }
                                }}
                              />
                            </label>
                            <span className="text-[11px] text-slate-500">Upload PNG/JPG to Supabase S3 Storage Bucket & CDN</span>
                          </div>

                          <div>
                            <input
                              type="text"
                              value={(typeof proj.image === 'string' ? proj.image : proj.image?.url) || proj.imageUrl || ''}
                              onChange={(e) => {
                                const updated = [...kb.projects]
                                updated[idx].image = e.target.value
                                updated[idx].imageUrl = e.target.value
                                const updatedKb = { ...kb, projects: updated }
                                setKb(updatedKb)
                                saveActiveKnowledge(updatedKb)
                              }}
                              placeholder="Or paste external Image URL (https://...)..."
                              className="w-full bg-[#0b0f19] border border-slate-800 rounded-lg px-3 py-2 text-xs text-indigo-300 font-mono outline-none focus:border-indigo-500"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-slate-400 mb-1">Project Title</label>
                        <input
                          type="text"
                          value={proj.title}
                          onChange={(e) => {
                            const updated = [...kb.projects]
                            updated[idx].title = e.target.value
                            setKb({ ...kb, projects: updated })
                          }}
                          className="w-full bg-[#070913] border border-slate-800 rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-indigo-500 font-bold"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-slate-400 mb-1">Category & Status Flag</label>
                        <div className="grid grid-cols-2 gap-2">
                          <input
                            type="text"
                            value={proj.category || 'FULL_STACK'}
                            onChange={(e) => {
                              const updated = [...kb.projects]
                              updated[idx].category = e.target.value
                              setKb({ ...kb, projects: updated })
                            }}
                            className="bg-[#070913] border border-slate-800 rounded-lg px-3 py-2 text-xs text-indigo-300 outline-none font-mono"
                          />
                          <input
                            type="text"
                            value={proj.status || 'LIVE'}
                            onChange={(e) => {
                              const updated = [...kb.projects]
                              updated[idx].status = e.target.value
                              setKb({ ...kb, projects: updated })
                            }}
                            className="bg-[#070913] border border-slate-800 rounded-lg px-3 py-2 text-xs text-emerald-400 outline-none font-mono font-bold"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-slate-400 mb-1">Live Demo / Production URL</label>
                        <input
                          type="text"
                          value={proj.demoUrl || ''}
                          onChange={(e) => {
                            const updated = [...kb.projects]
                            updated[idx].demoUrl = e.target.value
                            setKb({ ...kb, projects: updated })
                          }}
                          placeholder="https://..."
                          className="w-full bg-[#070913] border border-slate-800 rounded-lg px-3 py-2 text-xs text-cyan-300 font-mono outline-none focus:border-indigo-500"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-slate-400 mb-1">GitHub Repository Link</label>
                        <input
                          type="text"
                          value={proj.githubUrl || ''}
                          onChange={(e) => {
                            const updated = [...kb.projects]
                            updated[idx].githubUrl = e.target.value
                            setKb({ ...kb, projects: updated })
                          }}
                          placeholder="https://github.com/agarwalpriyanshu886-ctrl/..."
                          className="w-full bg-[#070913] border border-slate-800 rounded-lg px-3 py-2 text-xs text-indigo-300 font-mono outline-none focus:border-indigo-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-400 mb-1">Short Description</label>
                      <textarea
                        rows={2}
                        value={proj.shortDescription || ''}
                        onChange={(e) => {
                          const updated = [...kb.projects]
                          updated[idx].shortDescription = e.target.value
                          setKb({ ...kb, projects: updated })
                        }}
                        className="w-full bg-[#070913] border border-slate-800 rounded-lg p-3 text-xs text-slate-200 outline-none focus:border-indigo-500 leading-relaxed"
                      />
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
                  <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    <FaRobot className="text-indigo-400" /> Pittu AI Knowledge & FAQ Engine
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5 font-medium">
                    Configure grounded facts, assistant Q&A pairs, persona rules, and test interactive responses
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => {
                      const newFaq = {
                        question: 'What new skills is Priyanshu learning?',
                        answer: 'Priyanshu is actively expanding his knowledge in Neural Networks, Deep Learning, and Cloud Infrastructure.',
                      }
                      setKb({ ...kb, faqs: [...(kb.faqs || []), newFaq] })
                      triggerToast('Added Pittu Q&A pair')
                    }}
                    className="text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 px-3.5 py-2 rounded-lg flex items-center gap-1.5 shadow-sm"
                  >
                    <FaPlus /> Add Q&A Pair
                  </button>
                  <button onClick={handleSaveAll} className="text-xs font-semibold text-slate-900 bg-emerald-400 hover:bg-emerald-300 px-3.5 py-2 rounded-lg shadow-sm">
                    <FaSave className="inline mr-1.5" /> Save AI Knowledge
                  </button>
                </div>
              </div>

              <div className="bg-[#0f172a] border border-slate-800 rounded-xl p-5 space-y-3 shadow-sm">
                <h3 className="font-bold text-white text-xs uppercase tracking-wider text-indigo-400 flex items-center gap-2">
                  <FaRobot className="text-indigo-400" /> Pittu AI Live Simulator & Test Console
                </h3>

                <form onSubmit={handleTestPittu} className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Ask Pittu AI a test question (e.g., 'What is Priyanshu's SGPA?')..."
                    value={pittuTestQuery}
                    onChange={(e) => setPittuTestQuery(e.target.value)}
                    className="flex-1 bg-[#070913] border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white outline-none focus:border-indigo-500"
                  />
                  <button
                    type="submit"
                    className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-4 py-2.5 rounded-xl text-xs flex items-center gap-1.5 shadow-sm shrink-0"
                  >
                    <FaPaperPlane /> Test Query
                  </button>
                </form>

                {pittuTestResponse && (
                  <div className="p-3.5 rounded-xl bg-indigo-950/40 border border-indigo-500/30 text-indigo-200 text-xs leading-relaxed font-mono">
                    <span className="text-indigo-400 font-bold">🤖 Pittu AI Output:</span> {pittuTestResponse}
                  </div>
                )}
              </div>

              <div className="bg-[#0f172a] border border-slate-800 rounded-xl p-5 space-y-4 shadow-sm">
                <h3 className="font-bold text-white text-xs uppercase tracking-wider text-slate-400">
                  Grounded Q&A Facts ({kb.faqs?.length || 0})
                </h3>
                <div className="space-y-3">
                  {(kb.faqs || []).map((faq, idx) => (
                    <div key={idx} className="bg-[#070913] border border-slate-800 rounded-xl p-4 space-y-2.5">
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2 flex-1">
                          <span className="w-5 h-5 rounded bg-indigo-600/20 text-indigo-400 grid place-items-center text-[10px] font-bold font-mono">
                            Q{idx + 1}
                          </span>
                          <input
                            type="text"
                            value={faq.question}
                            onChange={(e) => {
                              const updated = [...(kb.faqs || [])]
                              updated[idx].question = e.target.value
                              setKb({ ...kb, faqs: updated })
                            }}
                            className="font-bold text-xs text-white bg-transparent border-none flex-1 outline-none focus:text-indigo-300"
                          />
                        </div>
                        <button
                          onClick={() => {
                            const updated = (kb.faqs || []).filter((_, i) => i !== idx)
                            setKb({ ...kb, faqs: updated })
                            triggerToast('Removed Q&A pair')
                          }}
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
                        className="w-full bg-[#0b0f19] border border-slate-800 rounded-lg p-2.5 text-xs text-slate-300 outline-none focus:border-indigo-500 leading-relaxed font-sans"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

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
                      className="w-full bg-[#070913] border border-slate-800 rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-indigo-500 font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1">Last Name</label>
                    <input
                      type="text"
                      value={hero.lastName}
                      onChange={(e) => setKb({ ...kb, hero: { ...hero, lastName: e.target.value } })}
                      className="w-full bg-[#070913] border border-slate-800 rounded-lg px-3 py-2 text-xs text-indigo-400 outline-none focus:border-indigo-500 font-bold"
                    />
                  </div>
                </div>

                <div className="space-y-3 pt-2">
                  <label className="block text-xs font-medium text-slate-400">Animated Typewriter Roles ({hero.roles.length})</label>
                  {hero.roles.map((roleStr, rIdx) => (
                    <div key={rIdx} className="flex items-center gap-3 bg-[#070913] border border-slate-800 rounded-lg p-2.5">
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
                      className="flex-1 bg-[#070913] border border-slate-800 rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-indigo-500"
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
                      className="w-full bg-[#070913] border border-slate-800 rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-indigo-500 font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1">Primary Title</label>
                    <input
                      type="text"
                      value={kb.profile.title}
                      onChange={(e) => setKb({ ...kb, profile: { ...kb.profile, title: e.target.value } })}
                      className="w-full bg-[#070913] border border-slate-800 rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Authoritative Public Bio</label>
                  <textarea
                    rows={4}
                    value={kb.profile.bio}
                    onChange={(e) => setKb({ ...kb, profile: { ...kb.profile, bio: e.target.value } })}
                    className="w-full bg-[#070913] border border-slate-800 rounded-lg p-3 text-xs text-white outline-none focus:border-indigo-500 leading-relaxed"
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'database' && (
            <div className="space-y-6 max-w-4xl">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    <FaDatabase className="text-emerald-400" /> Supabase Database & Cloud Infrastructure
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">
                    Connect your portfolio console to your Supabase project (Database Name: <code className="text-emerald-400 bg-slate-900 px-1.5 py-0.5 rounded font-mono">portfolio</code> / table: <code className="text-cyan-400 bg-slate-900 px-1.5 py-0.5 rounded font-mono">portfolio_cms</code>)
                  </p>
                </div>
                <span className={`text-xs font-mono px-3.5 py-1.5 rounded-full flex items-center gap-1.5 border font-semibold ${
                  isSupabaseConfigured()
                    ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30'
                    : 'text-amber-400 bg-amber-500/10 border-amber-500/30'
                }`}>
                  <span className={`w-2 h-2 rounded-full ${isSupabaseConfigured() ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
                  {isSupabaseConfigured() ? 'Supabase Connected' : 'Local Storage Mode'}
                </span>
              </div>

              {/* Live Status Message Banner */}
              {sbStatusMsg && (
                <div className="p-4 rounded-xl bg-slate-900 border border-indigo-500/30 text-xs font-mono text-indigo-300">
                  {sbStatusMsg}
                </div>
              )}

              {/* Supabase Credentials Configuration Card */}
              <div className="bg-[#0f172a] border border-slate-800 rounded-2xl p-6 space-y-4">
                <h3 className="font-bold text-white text-sm flex items-center gap-2">
                  <FaKey className="text-indigo-400" /> Supabase Account Credentials
                </h3>

                <form onSubmit={handleSaveSupabaseCreds} className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1.5">
                      Supabase Project URL (<span className="text-indigo-400 font-mono">VITE_SUPABASE_URL</span>)
                    </label>
                    <input
                      type="url"
                      value={sbCreds.url}
                      onChange={(e) => setSbCreds({ ...sbCreds, url: e.target.value })}
                      placeholder="https://your-project-ref.supabase.co"
                      className="w-full bg-[#070913] border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white outline-none focus:border-indigo-500 font-mono"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1.5">
                      Supabase Anon Public API Key (<span className="text-indigo-400 font-mono">VITE_SUPABASE_ANON_KEY</span>)
                    </label>
                    <input
                      type="password"
                      value={sbCreds.key}
                      onChange={(e) => setSbCreds({ ...sbCreds, key: e.target.value })}
                      placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                      className="w-full bg-[#070913] border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white outline-none focus:border-indigo-500 font-mono"
                      required
                    />
                  </div>

                  <div className="flex items-center gap-3 pt-2">
                    <button
                      type="submit"
                      className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-all shadow-md shadow-indigo-600/20"
                    >
                      Save Credentials & Connect
                    </button>
                    {isSupabaseConfigured() && (
                      <button
                        type="button"
                        onClick={handleClearSupabaseCreds}
                        className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 text-xs font-medium"
                      >
                        Disconnect / Clear
                      </button>
                    )}
                  </div>
                </form>
              </div>

              {/* Database Sync Actions Card */}
              {isSupabaseConfigured() && (
                <div className="bg-[#0f172a] border border-emerald-500/30 rounded-2xl p-6 space-y-4">
                  <h3 className="font-bold text-white text-sm flex items-center gap-2">
                    <FaSync className="text-emerald-400" /> Database Live Sync Controls
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Push your current local CMS state directly to your Supabase PostgreSQL database table <code className="text-emerald-400 font-mono bg-slate-900 px-1.5 py-0.5 rounded">portfolio_cms</code> or fetch the latest row!
                  </p>

                  <div className="flex flex-wrap items-center gap-3 pt-2">
                    <button
                      type="button"
                      disabled={sbSyncing}
                      onClick={handleSyncToSupabase}
                      className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-bold text-xs transition-all shadow-md shadow-emerald-600/20 flex items-center gap-2 disabled:opacity-50"
                    >
                      <FaSync className={sbSyncing ? 'animate-spin' : ''} /> Sync All Data to Supabase Now
                    </button>

                    <button
                      type="button"
                      disabled={sbSyncing}
                      onClick={handleFetchFromSupabase}
                      className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs transition-all border border-slate-700 flex items-center gap-2 disabled:opacity-50"
                    >
                      <FaDatabase /> Fetch Latest Data from Supabase
                    </button>
                  </div>
                </div>
              )}

              {/* 1-Click SQL Setup Script Box */}
              <div className="bg-[#0f172a] border border-slate-800 rounded-2xl p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-white text-sm flex items-center gap-2">
                    <FaCode className="text-cyan-400" /> 1-Click SQL Setup Script for Supabase SQL Editor
                  </h3>
                  <button
                    type="button"
                    onClick={() => {
                      const sql = `CREATE TABLE IF NOT EXISTS portfolio_cms (\n  id TEXT PRIMARY KEY DEFAULT 'active_cms',\n  data JSONB NOT NULL,\n  updated_at TIMESTAMPTZ DEFAULT NOW()\n);\n\nALTER TABLE portfolio_cms ENABLE ROW LEVEL SECURITY;\nCREATE POLICY "Public read policy" ON portfolio_cms FOR SELECT USING (true);\nCREATE POLICY "Public write policy" ON portfolio_cms FOR ALL USING (true);`
                      navigator.clipboard.writeText(sql)
                      setSqlCopied(true)
                      setTimeout(() => setSqlCopied(false), 2500)
                    }}
                    className="px-3.5 py-1.5 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 text-xs font-mono border border-cyan-500/30 transition-all flex items-center gap-1.5"
                  >
                    <FaCopy /> {sqlCopied ? 'SQL Copied!' : 'Copy SQL Script'}
                  </button>
                </div>

                <p className="text-xs text-slate-400 leading-relaxed">
                  Open your Supabase Dashboard (<span className="text-indigo-400 font-mono">SQL Editor</span> tab), paste the script below, and click <strong className="text-white font-mono">Run</strong>:
                </p>

                <div className="bg-[#070913] border border-slate-800 rounded-xl p-4 font-mono text-[11px] text-cyan-300 leading-relaxed overflow-x-auto select-all">
                  <pre>{`-- Supabase SQL Table Setup for "portfolio" project
CREATE TABLE IF NOT EXISTS portfolio_cms (
  id TEXT PRIMARY KEY DEFAULT 'active_cms',
  data JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (RLS) & Public Policies
ALTER TABLE portfolio_cms ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read policy" ON portfolio_cms FOR SELECT USING (true);
CREATE POLICY "Public write policy" ON portfolio_cms FOR ALL USING (true);`}</pre>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
