import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
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
} from 'react-icons/fa'
import { Link } from 'react-router-dom'
import { getActiveKnowledge, saveActiveKnowledge, resetCMSKnowledgeToDefault } from '../lib/public-ai/cmsKnowledgeStore'
import { isSupabaseConfigured } from '../lib/supabase'
import Typewriter from '../components/ui/Typewriter'

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [email, setEmail] = useState('admin@priyanshu.com')
  const [password, setPassword] = useState('')
  const [loginError, setLoginError] = useState('')

  // CMS State
  const [kb, setKb] = useState(getActiveKnowledge())
  const [activeTab, setActiveTab] = useState('hero')
  const [saveSuccess, setSaveSuccess] = useState(false)

  // Input states for adding new items
  const [newRoleString, setNewRoleString] = useState('')
  const [newSkillNames, setNewSkillNames] = useState({})
  const [newSkillLevels, setNewSkillLevels] = useState({})
  const [newCatLabel, setNewCatLabel] = useState('')
  const [newTechBadge, setNewTechBadge] = useState('')
  const [newCreativeBadge, setNewCreativeBadge] = useState('')
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

  // Ensure hero object is fully populated
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

  // 1. ADMIN LOGIN VIEW
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex flex-col justify-center items-center p-4 relative overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <Link
          to="/"
          className="absolute top-6 left-6 flex items-center gap-2 text-xs font-mono text-slate-400 hover:text-cyan-400 transition-colors bg-white/5 px-4 py-2 rounded-xl border border-white/10"
        >
          <FaArrowLeft /> Return to Portfolio
        </Link>

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          className="w-full max-w-md bg-slate-900/90 border border-cyan-500/40 rounded-3xl p-6 sm:p-8 shadow-[0_0_60px_rgba(34,211,238,0.2)] backdrop-blur-xl relative z-10"
        >
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-cyan-500 grid place-items-center mx-auto mb-4 text-2xl text-slate-950 font-bold shadow-lg">
              <FaShieldAlt />
            </div>
            <h2 className="text-2xl font-bold font-display text-white">Portfolio CMS Admin Portal</h2>
            <p className="text-xs text-slate-400 mt-1 font-mono">Priyanshu Agarwal • Full Systematic Suite</p>
          </div>

          {loginError && (
            <div className="mb-6 p-3 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs font-mono text-center">
              {loginError}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1">Admin Email</label>
              <div className="relative">
                <FaEnvelope className="absolute left-3.5 top-3.5 text-slate-500 text-sm" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white outline-none focus:border-cyan-400"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1">Password</label>
              <div className="relative">
                <FaLock className="absolute left-3.5 top-3.5 text-slate-500 text-sm" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="admin123"
                  className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white outline-none focus:border-cyan-400"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-cyan-400 text-slate-950 font-bold text-xs uppercase tracking-wider hover:opacity-90 transition-opacity mt-4 shadow-lg shadow-cyan-500/20"
            >
              Sign In to CMS Dashboard
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-white/10 text-center">
            <p className="text-[11px] font-mono text-slate-500">
              Demo Access Credentials: <br />
              <span className="text-cyan-400">admin@priyanshu.com</span> / <span className="text-cyan-400">admin123</span>
            </p>
          </div>
        </motion.div>
      </div>
    )
  }

  // 2. ADMIN CMS DASHBOARD VIEW
  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col font-sans">
      {/* Top Header Bar */}
      <header className="border-b border-white/10 bg-slate-900/90 backdrop-blur-md px-6 py-4 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-cyan-400 grid place-items-center text-slate-950 font-bold font-display text-sm shadow-md">
            PA
          </div>
          <div>
            <h1 className="font-bold text-white text-sm">Priyanshu Executive CMS Suite</h1>
            <p className="text-[11px] text-slate-400 font-mono flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" /> Systematic Content & Knowledge Engine
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {saveSuccess && (
            <span className="text-xs font-mono text-emerald-400 bg-emerald-400/20 border border-emerald-400/40 px-3 py-1.5 rounded-xl flex items-center gap-1.5 animate-pulse">
              <FaCheckCircle /> Saved & Updated Live!
            </span>
          )}

          <button
            onClick={handleSaveAll}
            className="flex items-center gap-2 text-xs font-mono font-bold text-slate-950 bg-gradient-to-r from-indigo-400 to-cyan-400 px-4 py-2.5 rounded-xl hover:opacity-90 transition-all shadow-md hover:shadow-cyan-500/20"
          >
            <FaSave /> Save All Changes
          </button>

          <button
            onClick={resetCMSKnowledgeToDefault}
            title="Reset all CMS data to default state"
            className="p-2.5 rounded-xl bg-white/5 hover:bg-white/15 text-slate-400 hover:text-white border border-white/10 text-xs font-mono transition-all"
          >
            <FaUndo />
          </button>

          <Link
            to="/"
            target="_blank"
            className="text-xs font-mono text-cyan-300 hover:text-white bg-cyan-400/10 border border-cyan-400/30 px-3 py-2.5 rounded-xl transition-all flex items-center gap-1.5"
          >
            View Live Site <FaExternalLinkAlt className="text-[10px]" />
          </Link>

          <button
            onClick={() => setIsAuthenticated(false)}
            className="flex items-center gap-1.5 text-xs font-mono text-rose-400 bg-rose-500/10 border border-rose-500/30 px-3 py-2.5 rounded-xl hover:bg-rose-500/20 transition-all"
          >
            <FaSignOutAlt /> Sign Out
          </button>
        </div>
      </header>

      <div className="flex-1 flex flex-col md:flex-row">
        {/* Left Sidebar Navigation */}
        <aside className="w-full md:w-64 border-r border-white/10 bg-slate-900/60 p-4 space-y-1.5 shrink-0">
          {[
            { id: 'hero', label: 'Hero Section CMS', badge: 'MAIN', icon: FaRocket },
            { id: 'profile', label: 'Profile & Contact', badge: null, icon: FaUser },
            { id: 'skills', label: 'Skills & Proficiency Bars', badge: kb.skillCategories?.length || 0, icon: FaSlidersH },
            { id: 'projects', label: 'Projects Catalog', badge: kb.projects?.length || 0, icon: FaProjectDiagram },
            { id: 'education', label: 'Education & SGPA', badge: kb.education?.length || 0, icon: FaGraduationCap },
            { id: 'experience', label: 'Work Experience', badge: kb.experience?.length || 0, icon: FaBriefcase },
            { id: 'pittu', label: 'Pittu AI Engine', badge: kb.faqs?.length || 0, icon: FaRobot },
            { id: 'database', label: 'Database & Infra', badge: null, icon: FaDatabase },
          ].map((tab) => {
            const Icon = tab.icon
            const isActive = activeTab === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-xs font-mono transition-all text-left ${
                  isActive
                    ? 'bg-gradient-to-r from-indigo-500/20 to-cyan-400/20 text-cyan-300 border border-cyan-400/40 font-bold shadow-md'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className="text-sm shrink-0" />
                  <span>{tab.label}</span>
                </div>
                {tab.badge !== null && (
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${isActive ? 'bg-cyan-400/30 text-cyan-200' : 'bg-white/10 text-slate-400'}`}>
                    {tab.badge}
                  </span>
                )}
              </button>
            )
          })}
        </aside>

        {/* Main Editor Panel */}
        <main className="flex-1 p-6 sm:p-8 space-y-6 overflow-y-auto max-h-[calc(100vh-73px)]">
          {/* TAB 0: HERO SECTION CMS */}
          {activeTab === 'hero' && (
            <div className="space-y-6 max-w-5xl">
              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <div>
                  <h2 className="text-xl font-bold font-display text-white">Hero Section CMS</h2>
                  <p className="text-xs font-mono text-slate-400 mt-1">Live edit homepage hero title, animated typewriter word strings, speed controls, and CTAs</p>
                </div>
                <button onClick={handleSaveAll} className="text-xs font-mono font-bold text-slate-950 bg-gradient-to-r from-indigo-400 to-cyan-400 px-4 py-2.5 rounded-xl hover:opacity-90 flex items-center gap-1.5 shadow-md">
                  <FaSave /> Save Hero Changes
                </button>
              </div>

              {/* Live Preview Card */}
              <div className="bg-slate-900/90 border border-cyan-500/30 rounded-2xl p-6 space-y-4 shadow-xl">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-cyan-300 bg-cyan-400/10 border border-cyan-400/30 px-3 py-1 rounded-full">
                    Live Hero Animated Preview
                  </span>
                  <span className="text-xs font-mono text-slate-400">
                    Cycling {hero.roles.length} animated roles
                  </span>
                </div>

                <div className="space-y-3 pt-2">
                  <span className="inline-block text-xs font-mono text-slate-300 bg-white/5 border border-white/10 px-3.5 py-1.5 rounded-full">
                    {hero.greetingPill}
                  </span>

                  <h3 className="text-3xl font-bold text-white font-display">
                    {hero.firstName} <span className="text-cyan-400">{hero.lastName}</span>
                  </h3>

                  {/* Live Typewriter Component Preview */}
                  <div className="text-xl font-bold text-cyan-300 font-display min-h-[36px] flex items-center bg-slate-950/80 border border-cyan-400/30 rounded-xl px-4 py-2">
                    <Typewriter
                      words={hero.roles.length > 0 ? hero.roles : ['Full-Stack Developer']}
                      typingSpeed={hero.typingSpeed || 70}
                      deletingSpeed={hero.deletingSpeed || 40}
                      pause={hero.pauseDuration || 1600}
                    />
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed max-w-xl">
                    {hero.shortDescription}
                  </p>

                  <div className="flex items-center gap-3 pt-2">
                    <span className="text-xs font-bold text-slate-950 bg-cyan-400 px-4 py-2 rounded-xl">
                      {hero.primaryCtaLabel}
                    </span>
                    <span className="text-xs font-bold text-white bg-indigo-600 px-4 py-2 rounded-xl">
                      {hero.secondaryCtaLabel}
                    </span>
                  </div>
                </div>
              </div>

              {/* IN-DEPTH ANIMATED TYPEWRITER ROLES EDITOR */}
              <div className="bg-slate-900/90 border border-white/10 rounded-2xl p-6 space-y-4 shadow-lg">
                <div className="flex items-center justify-between pb-3 border-b border-white/10">
                  <div>
                    <h3 className="font-bold text-white text-sm flex items-center gap-2">
                      <FaCode className="text-cyan-400" /> Animated Typewriter Word Strings ({hero.roles.length})
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">These animated words cycle continuously on the homepage hero section</p>
                  </div>
                </div>

                {/* Role Strings List */}
                <div className="space-y-3">
                  {hero.roles.map((roleStr, rIdx) => (
                    <div key={rIdx} className="flex items-center gap-3 bg-slate-950/70 border border-white/10 rounded-xl p-3">
                      <span className="w-6 h-6 rounded-lg bg-cyan-400/10 border border-cyan-400/30 text-cyan-300 grid place-items-center text-xs font-mono font-bold shrink-0">
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
                        className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white outline-none focus:border-cyan-400 font-semibold"
                      />
                      <button
                        onClick={() => {
                          const updatedRoles = hero.roles.filter((_, i) => i !== rIdx)
                          setKb({ ...kb, hero: { ...hero, roles: updatedRoles } })
                        }}
                        className="text-rose-400 hover:text-rose-300 p-1.5 text-xs rounded-lg bg-rose-500/10 border border-rose-500/30 shrink-0"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Add New Animated Role Word */}
                <div className="pt-3 border-t border-white/10 flex items-center gap-3">
                  <input
                    type="text"
                    placeholder="New Animated Word String (e.g. AI/ML Student, Programmer, Full-Stack)..."
                    value={newRoleString}
                    onChange={(e) => setNewRoleString(e.target.value)}
                    className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white outline-none focus:border-cyan-400"
                  />
                  <button
                    onClick={() => {
                      if (newRoleString.trim()) {
                        const updatedRoles = [...hero.roles, newRoleString.trim()]
                        setKb({ ...kb, hero: { ...hero, roles: updatedRoles } })
                        setNewRoleString('')
                      }
                    }}
                    className="bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold px-4 py-2.5 rounded-xl text-xs flex items-center gap-1.5 shrink-0"
                  >
                    <FaPlus /> Add Animated Word
                  </button>
                </div>

                {/* Typewriter Speed & Timing Controls */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-white/10">
                  <div>
                    <label className="block text-xs font-mono text-slate-400 mb-1">Typing Speed (ms)</label>
                    <input
                      type="number"
                      value={hero.typingSpeed || 70}
                      onChange={(e) => setKb({ ...kb, hero: { ...hero, typingSpeed: Number(e.target.value) } })}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-cyan-300 font-mono outline-none focus:border-cyan-400"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-slate-400 mb-1">Deleting Speed (ms)</label>
                    <input
                      type="number"
                      value={hero.deletingSpeed || 40}
                      onChange={(e) => setKb({ ...kb, hero: { ...hero, deletingSpeed: Number(e.target.value) } })}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-cyan-300 font-mono outline-none focus:border-cyan-400"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-slate-400 mb-1">Pause Duration (ms)</label>
                    <input
                      type="number"
                      value={hero.pauseDuration || 1600}
                      onChange={(e) => setKb({ ...kb, hero: { ...hero, pauseDuration: Number(e.target.value) } })}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-cyan-300 font-mono outline-none focus:border-cyan-400"
                    />
                  </div>
                </div>
              </div>

              {/* General Hero Form Controls */}
              <div className="bg-slate-900/90 border border-white/10 rounded-2xl p-6 space-y-4 shadow-lg">
                <div>
                  <label className="block text-xs font-mono text-slate-400 mb-1">Top Greeting Pill Text</label>
                  <input
                    type="text"
                    value={hero.greetingPill}
                    onChange={(e) => setKb({ ...kb, hero: { ...hero, greetingPill: e.target.value } })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white outline-none focus:border-cyan-400"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono text-slate-400 mb-1">First Name</label>
                    <input
                      type="text"
                      value={hero.firstName}
                      onChange={(e) => setKb({ ...kb, hero: { ...hero, firstName: e.target.value } })}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white outline-none focus:border-cyan-400 font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-slate-400 mb-1">Last Name (Gradient Highlighted)</label>
                    <input
                      type="text"
                      value={hero.lastName}
                      onChange={(e) => setKb({ ...kb, hero: { ...hero, lastName: e.target.value } })}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-cyan-300 outline-none focus:border-cyan-400 font-bold"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-400 mb-1">Hero Short Description</label>
                  <textarea
                    rows={3}
                    value={hero.shortDescription}
                    onChange={(e) => setKb({ ...kb, hero: { ...hero, shortDescription: e.target.value } })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-xs text-white outline-none focus:border-cyan-400 leading-relaxed"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-white/10">
                  <div>
                    <label className="block text-xs font-mono text-slate-400 mb-1">Primary CTA Button Label</label>
                    <input
                      type="text"
                      value={hero.primaryCtaLabel}
                      onChange={(e) => setKb({ ...kb, hero: { ...hero, primaryCtaLabel: e.target.value } })}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white outline-none focus:border-cyan-400"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-slate-400 mb-1">Secondary CTA Button Label</label>
                    <input
                      type="text"
                      value={hero.secondaryCtaLabel}
                      onChange={(e) => setKb({ ...kb, hero: { ...hero, secondaryCtaLabel: e.target.value } })}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white outline-none focus:border-cyan-400"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 1: PROFILE & CONTACT CMS */}
          {activeTab === 'profile' && (
            <div className="space-y-6 max-w-4xl">
              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <div>
                  <h2 className="text-xl font-bold font-display text-white">Profile & Contact Information</h2>
                  <p className="text-xs text-slate-400 mt-0.5 font-mono">Manage primary bio, role definitions, and public social channels</p>
                </div>
                <button onClick={handleSaveAll} className="text-xs font-mono font-bold text-slate-950 bg-cyan-400 px-4 py-2 rounded-xl hover:bg-cyan-300">
                  <FaSave className="inline mr-1.5" /> Save Profile
                </button>
              </div>

              <div className="bg-slate-900/90 border border-white/10 rounded-2xl p-6 space-y-4 shadow-lg">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono text-slate-400 mb-1">Full Name</label>
                    <input
                      type="text"
                      value={kb.profile.name}
                      onChange={(e) => setKb({ ...kb, profile: { ...kb.profile, name: e.target.value } })}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white outline-none focus:border-cyan-400 font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-slate-400 mb-1">Primary Title</label>
                    <input
                      type="text"
                      value={kb.profile.title}
                      onChange={(e) => setKb({ ...kb, profile: { ...kb.profile, title: e.target.value } })}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white outline-none focus:border-cyan-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-400 mb-1">Roles List (comma separated)</label>
                  <input
                    type="text"
                    value={kb.profile.roles.join(', ')}
                    onChange={(e) =>
                      setKb({ ...kb, profile: { ...kb.profile, roles: e.target.value.split(',').map((r) => r.trim()) } })
                    }
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-cyan-300 outline-none focus:border-cyan-400 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-400 mb-1">Authoritative Public Bio</label>
                  <textarea
                    rows={4}
                    value={kb.profile.bio}
                    onChange={(e) => setKb({ ...kb, profile: { ...kb.profile, bio: e.target.value } })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-xs text-white outline-none focus:border-cyan-400 leading-relaxed"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-white/10">
                  <div>
                    <label className="block text-xs font-mono text-slate-400 mb-1">Contact Email</label>
                    <input
                      type="email"
                      value={kb.profile.contactEmail}
                      onChange={(e) => setKb({ ...kb, profile: { ...kb.profile, contactEmail: e.target.value } })}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white outline-none focus:border-cyan-400"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-slate-400 mb-1">Location</label>
                    <input
                      type="text"
                      value={kb.profile.location}
                      onChange={(e) => setKb({ ...kb, profile: { ...kb.profile, location: e.target.value } })}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white outline-none focus:border-cyan-400"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-slate-400 mb-1">GitHub Profile URL</label>
                    <input
                      type="text"
                      value={kb.profile.github}
                      onChange={(e) => setKb({ ...kb, profile: { ...kb.profile, github: e.target.value } })}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-cyan-300 font-mono outline-none focus:border-cyan-400"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-slate-400 mb-1">Instagram Profile URL</label>
                    <input
                      type="text"
                      value={kb.profile.instagram}
                      onChange={(e) => setKb({ ...kb, profile: { ...kb.profile, instagram: e.target.value } })}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-pink-300 font-mono outline-none focus:border-cyan-400"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: SKILLS & PROFICIENCY BARS CMS */}
          {activeTab === 'skills' && (
            <div className="space-y-6 max-w-5xl">
              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <div>
                  <h2 className="text-xl font-bold font-display text-white">Categorized Skill Bars & Proficiency CMS</h2>
                  <p className="text-xs font-mono text-slate-400 mt-1">Live edit skill names, categories, and proficiency percentage sliders (0–100%)</p>
                </div>
                <button
                  onClick={handleSaveAll}
                  className="text-xs font-mono font-bold text-slate-950 bg-gradient-to-r from-indigo-400 to-cyan-400 px-4 py-2 rounded-xl hover:opacity-90 flex items-center gap-1.5 shadow-md"
                >
                  <FaSave /> Save Skill Edits
                </button>
              </div>

              {/* Categorized Skill Bars */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {(kb.skillCategories || []).map((cat, catIdx) => (
                  <div key={cat.id || catIdx} className="bg-slate-900/90 border border-white/10 rounded-2xl p-6 space-y-4 shadow-lg">
                    <div className="flex items-center justify-between pb-3 border-b border-white/10">
                      <div className="flex items-center gap-3 flex-1">
                        <span className="w-3 h-3 rounded-full" style={{ backgroundColor: cat.accent || '#6366f1' }} />
                        <input
                          type="text"
                          value={cat.label}
                          onChange={(e) => {
                            const updatedCats = [...(kb.skillCategories || [])]
                            updatedCats[catIdx].label = e.target.value
                            setKb({ ...kb, skillCategories: updatedCats })
                          }}
                          className="font-bold text-white text-base bg-white/5 border border-white/10 rounded-xl px-3 py-1 outline-none focus:border-cyan-400"
                        />
                      </div>
                      <button
                        onClick={() => {
                          const updatedCats = (kb.skillCategories || []).filter((_, i) => i !== catIdx)
                          setKb({ ...kb, skillCategories: updatedCats })
                        }}
                        className="text-rose-400 hover:text-rose-300 p-2 rounded-xl bg-rose-500/10 border border-rose-500/30 text-xs"
                      >
                        <FaTrash />
                      </button>
                    </div>

                    <div className="space-y-4 pt-1">
                      {cat.skills.map((skill, skillIdx) => (
                        <div key={skillIdx} className="bg-slate-950/60 border border-white/10 rounded-xl p-3.5 space-y-2">
                          <div className="flex items-center justify-between gap-3">
                            <input
                              type="text"
                              value={skill.name}
                              onChange={(e) => {
                                const updatedCats = [...(kb.skillCategories || [])]
                                updatedCats[catIdx].skills[skillIdx].name = e.target.value
                                setKb({ ...kb, skillCategories: updatedCats })
                              }}
                              className="text-xs font-bold text-white bg-white/5 border border-white/10 rounded-lg px-2.5 py-1 outline-none focus:border-cyan-400 flex-1"
                            />
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-mono font-bold text-cyan-300 w-10 text-right">{skill.level}%</span>
                              <button
                                onClick={() => {
                                  const updatedCats = [...(kb.skillCategories || [])]
                                  updatedCats[catIdx].skills = updatedCats[catIdx].skills.filter((_, i) => i !== skillIdx)
                                  setKb({ ...kb, skillCategories: updatedCats })
                                }}
                                className="text-rose-400 hover:text-rose-300 p-1 text-xs"
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
                              className="flex-1 accent-cyan-400 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
                            />
                          </div>
                          <div className="h-1.5 rounded-full bg-slate-800 overflow-hidden">
                            <div
                              className="h-full rounded-full transition-all duration-150"
                              style={{
                                width: `${skill.level}%`,
                                background: `linear-gradient(90deg, ${cat.accent || '#6366f1'}, #22d3ee)`,
                              }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="pt-3 border-t border-white/10 flex items-center gap-2">
                      <input
                        type="text"
                        placeholder="New skill name..."
                        value={newSkillNames[catIdx] || ''}
                        onChange={(e) => setNewSkillNames({ ...newSkillNames, [catIdx]: e.target.value })}
                        className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white outline-none focus:border-cyan-400"
                      />
                      <input
                        type="number"
                        min="0"
                        max="100"
                        placeholder="%"
                        value={newSkillLevels[catIdx] || 75}
                        onChange={(e) => setNewSkillLevels({ ...newSkillLevels, [catIdx]: Number(e.target.value) })}
                        className="w-16 bg-white/5 border border-white/10 rounded-xl px-2 py-1.5 text-xs text-cyan-300 font-mono outline-none focus:border-cyan-400"
                      />
                      <button
                        onClick={() => {
                          const name = (newSkillNames[catIdx] || '').trim()
                          const level = Number(newSkillLevels[catIdx] || 75)
                          if (name) {
                            const updatedCats = [...(kb.skillCategories || [])]
                            updatedCats[catIdx].skills.push({ name, level, icon: 'code' })
                            setKb({ ...kb, skillCategories: updatedCats })
                            setNewSkillNames({ ...newSkillNames, [catIdx]: '' })
                          }
                        }}
                        className="bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold px-3 py-1.5 rounded-xl text-xs flex items-center gap-1"
                      >
                        <FaPlus /> Add Skill
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-4 border-t border-white/10 flex items-center gap-3">
                <input
                  type="text"
                  placeholder="New Category Label (e.g. Cloud & DevOps)..."
                  value={newCatLabel}
                  onChange={(e) => setNewCatLabel(e.target.value)}
                  className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white outline-none focus:border-cyan-400"
                />
                <button
                  onClick={() => {
                    if (newCatLabel.trim()) {
                      const newCat = {
                        id: `cat_${Date.now()}`,
                        label: newCatLabel.trim(),
                        icon: 'code',
                        accent: '#a78bfa',
                        skills: [{ name: 'Sample Technology', level: 80, icon: 'code' }],
                      }
                      setKb({ ...kb, skillCategories: [...(kb.skillCategories || []), newCat] })
                      setNewCatLabel('')
                    }
                  }}
                  className="bg-gradient-to-r from-indigo-500 to-cyan-400 text-slate-950 font-bold px-5 py-2.5 rounded-xl text-xs flex items-center gap-1.5"
                >
                  <FaPlus /> Add New Category
                </button>
              </div>
            </div>
          )}

          {/* TAB 3: PROJECTS CATALOG CMS */}
          {activeTab === 'projects' && (
            <div className="space-y-6 max-w-5xl">
              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <div>
                  <h2 className="text-xl font-bold font-display text-white">Projects Catalog CMS</h2>
                  <p className="text-xs font-mono text-slate-400 mt-1">Manage project cards, live URLs, GitHub repos, and status flags</p>
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
                  className="text-xs font-mono text-slate-950 bg-gradient-to-r from-indigo-400 to-cyan-400 px-4 py-2.5 rounded-xl font-bold flex items-center gap-1.5 hover:opacity-90 shadow-md"
                >
                  <FaPlus /> Add New Project
                </button>
              </div>

              <div className="space-y-4">
                {kb.projects.map((proj, idx) => (
                  <div key={proj.id} className="bg-slate-900/90 border border-white/10 rounded-2xl p-6 space-y-4 shadow-lg">
                    <div className="flex items-center justify-between gap-4">
                      <input
                        type="text"
                        value={proj.title}
                        onChange={(e) => {
                          const updated = [...kb.projects]
                          updated[idx].title = e.target.value
                          setKb({ ...kb, projects: updated })
                        }}
                        className="font-bold text-white text-base bg-white/5 border border-white/10 rounded-xl px-3 py-2 flex-1 outline-none focus:border-cyan-400"
                      />
                      <select
                        value={proj.category}
                        onChange={(e) => {
                          const updated = [...kb.projects]
                          updated[idx].category = e.target.value
                          setKb({ ...kb, projects: updated })
                        }}
                        className="bg-slate-800 text-xs font-mono text-cyan-300 border border-cyan-400/40 rounded-xl px-3 py-2 outline-none font-bold"
                      >
                        <option value="HYBRID">HYBRID</option>
                        <option value="CODE">CODE</option>
                        <option value="DESIGN">DESIGN</option>
                        <option value="MOBILE">MOBILE</option>
                      </select>
                      <button
                        onClick={() => {
                          const updated = kb.projects.filter((p) => p.id !== proj.id)
                          setKb({ ...kb, projects: updated })
                        }}
                        className="text-rose-400 hover:text-rose-300 p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-xs"
                      >
                        <FaTrash /> Delete
                      </button>
                    </div>

                    <div>
                      <label className="block text-xs font-mono text-slate-400 mb-1">Short Description</label>
                      <input
                        type="text"
                        value={proj.shortDescription}
                        onChange={(e) => {
                          const updated = [...kb.projects]
                          updated[idx].shortDescription = e.target.value
                          setKb({ ...kb, projects: updated })
                        }}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white outline-none focus:border-cyan-400"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-mono text-slate-400 mb-1">Live Demo URL</label>
                        <input
                          type="text"
                          value={proj.demoUrl || ''}
                          onChange={(e) => {
                            const updated = [...kb.projects]
                            updated[idx].demoUrl = e.target.value
                            setKb({ ...kb, projects: updated })
                          }}
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-cyan-300 outline-none focus:border-cyan-400 font-mono"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-mono text-slate-400 mb-1">Tech Stack (comma separated)</label>
                        <input
                          type="text"
                          value={proj.techStack.join(', ')}
                          onChange={(e) => {
                            const updated = [...kb.projects]
                            updated[idx].techStack = e.target.value.split(',').map((t) => t.trim())
                            setKb({ ...kb, projects: updated })
                          }}
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-cyan-400"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: EDUCATION & SGPA */}
          {activeTab === 'education' && (
            <div className="space-y-6 max-w-5xl">
              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <div>
                  <h2 className="text-xl font-bold font-display text-white">Academic Journey & Education</h2>
                  <p className="text-xs font-mono text-slate-400 mt-1">Manage academic qualifications, schools, colleges, and SGPA performance</p>
                </div>
                <button
                  onClick={() => {
                    const newEdu = {
                      id: `edu_${Date.now()}`,
                      degree: 'New Certification / Degree',
                      field: 'Field of Study',
                      institution: 'University / Institute Name',
                      location: 'City, State',
                      duration: '1 Year',
                      years: '2025 – 2026',
                      badge: 'Academic Honor',
                      sgpa: '8.86 SGPA',
                      description: 'Overview of academic achievements',
                      highlights: ['Core Subject 1', 'Core Subject 2'],
                    }
                    setKb({ ...kb, education: [newEdu, ...kb.education] })
                  }}
                  className="text-xs font-mono text-slate-950 bg-gradient-to-r from-indigo-400 to-cyan-400 px-4 py-2.5 rounded-xl font-bold flex items-center gap-1.5 hover:opacity-90 shadow-md"
                >
                  <FaPlus /> Add New Education Entry
                </button>
              </div>

              <div className="space-y-4">
                {kb.education.map((edu, idx) => (
                  <div key={edu.id} className="bg-slate-900/90 border border-white/10 rounded-2xl p-6 space-y-4 shadow-lg relative">
                    <div className="flex items-center justify-between gap-4">
                      <input
                        type="text"
                        value={edu.degree}
                        onChange={(e) => {
                          const updated = [...kb.education]
                          updated[idx].degree = e.target.value
                          setKb({ ...kb, education: updated })
                        }}
                        className="font-bold text-white text-base bg-white/5 border border-white/10 rounded-xl px-3 py-2 flex-1 outline-none focus:border-cyan-400"
                      />
                      <button
                        onClick={() => {
                          const updated = kb.education.filter((e) => e.id !== edu.id)
                          setKb({ ...kb, education: updated })
                        }}
                        className="text-rose-400 hover:text-rose-300 p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-xs"
                      >
                        <FaTrash /> Delete
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-mono text-slate-400 mb-1">Field of Study</label>
                        <input
                          type="text"
                          value={edu.field}
                          onChange={(e) => {
                            const updated = [...kb.education]
                            updated[idx].field = e.target.value
                            setKb({ ...kb, education: updated })
                          }}
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-cyan-400"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-mono text-slate-400 mb-1">Institution Name</label>
                        <input
                          type="text"
                          value={edu.institution}
                          onChange={(e) => {
                            const updated = [...kb.education]
                            updated[idx].institution = e.target.value
                            setKb({ ...kb, education: updated })
                          }}
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-cyan-400"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs font-mono text-slate-400 mb-1">Location</label>
                        <input
                          type="text"
                          value={edu.location}
                          onChange={(e) => {
                            const updated = [...kb.education]
                            updated[idx].location = e.target.value
                            setKb({ ...kb, education: updated })
                          }}
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-cyan-400"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-mono text-slate-400 mb-1">Years / Duration</label>
                        <input
                          type="text"
                          value={edu.years}
                          onChange={(e) => {
                            const updated = [...kb.education]
                            updated[idx].years = e.target.value
                            setKb({ ...kb, education: updated })
                          }}
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-cyan-400"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-mono text-slate-400 mb-1">SGPA / Performance</label>
                        <input
                          type="text"
                          value={edu.sgpa || ''}
                          onChange={(e) => {
                            const updated = [...kb.education]
                            updated[idx].sgpa = e.target.value
                            setKb({ ...kb, education: updated })
                          }}
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-cyan-300 font-mono outline-none focus:border-cyan-400"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: WORK EXPERIENCE & INTERNSHIPS */}
          {activeTab === 'experience' && (
            <div className="space-y-6 max-w-5xl">
              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <div>
                  <h2 className="text-xl font-bold font-display text-white">Work Experience & Internships</h2>
                  <p className="text-xs font-mono text-slate-400 mt-1">Manage professional internships, roles, duration, and key bullet points</p>
                </div>
                <button
                  onClick={() => {
                    const newExp = {
                      id: `exp_${Date.now()}`,
                      role: 'New Internship / Role',
                      company: 'Company Name',
                      duration: '3 Months',
                      startDate: '2026',
                      endDate: '2026',
                      type: 'Internship',
                      points: ['Responsibility bullet point 1', 'Responsibility bullet point 2'],
                    }
                    setKb({ ...kb, experience: [newExp, ...kb.experience] })
                  }}
                  className="text-xs font-mono text-slate-950 bg-gradient-to-r from-indigo-400 to-cyan-400 px-4 py-2.5 rounded-xl font-bold flex items-center gap-1.5 hover:opacity-90 shadow-md"
                >
                  <FaPlus /> Add New Work Experience
                </button>
              </div>

              <div className="space-y-4">
                {kb.experience.map((exp, idx) => (
                  <div key={exp.id} className="bg-slate-900/90 border border-white/10 rounded-2xl p-6 space-y-4 shadow-lg relative">
                    <div className="flex items-center justify-between gap-4">
                      <input
                        type="text"
                        value={exp.role}
                        onChange={(e) => {
                          const updated = [...kb.experience]
                          updated[idx].role = e.target.value
                          setKb({ ...kb, experience: updated })
                        }}
                        placeholder="Role Title (e.g. Graphic Design Intern)"
                        className="font-bold text-white text-base bg-white/5 border border-white/10 rounded-xl px-3 py-2 flex-1 outline-none focus:border-cyan-400"
                      />
                      <input
                        type="text"
                        value={exp.company}
                        onChange={(e) => {
                          const updated = [...kb.experience]
                          updated[idx].company = e.target.value
                          setKb({ ...kb, experience: updated })
                        }}
                        placeholder="Company Name (e.g. JALDIRIDE CONNECT)"
                        className="font-bold text-cyan-300 text-sm bg-white/5 border border-white/10 rounded-xl px-3 py-2 flex-1 outline-none focus:border-cyan-400 font-mono"
                      />
                      <button
                        onClick={() => {
                          const updated = kb.experience.filter((e) => e.id !== exp.id)
                          setKb({ ...kb, experience: updated })
                        }}
                        className="text-rose-400 hover:text-rose-300 p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-xs shrink-0"
                      >
                        <FaTrash /> Delete
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-mono text-slate-400 mb-1">Duration & Dates</label>
                        <input
                          type="text"
                          value={`${exp.duration} (${exp.startDate} – ${exp.endDate})`}
                          onChange={(e) => {
                            const updated = [...kb.experience]
                            updated[idx].duration = e.target.value
                            setKb({ ...kb, experience: updated })
                          }}
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-cyan-400"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-mono text-slate-400 mb-1">Employment Type</label>
                        <input
                          type="text"
                          value={exp.type || 'Internship'}
                          onChange={(e) => {
                            const updated = [...kb.experience]
                            updated[idx].type = e.target.value
                            setKb({ ...kb, experience: updated })
                          }}
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-cyan-300 outline-none focus:border-cyan-400 font-mono"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-mono text-slate-400 mb-1">Key Responsibilities (one bullet per line)</label>
                      <textarea
                        rows={3}
                        value={(exp.points || []).join('\n')}
                        onChange={(e) => {
                          const updated = [...kb.experience]
                          updated[idx].points = e.target.value.split('\n').filter(Boolean)
                          setKb({ ...kb, experience: updated })
                        }}
                        className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-xs text-slate-300 outline-none focus:border-cyan-400 leading-relaxed font-mono"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 6: PITTU AI ENGINE & FAQS */}
          {activeTab === 'pittu' && (
            <div className="space-y-6 max-w-5xl">
              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <div>
                  <h2 className="text-xl font-bold font-display text-white">Pittu AI Knowledge & FAQ Engine</h2>
                  <p className="text-xs font-mono text-slate-400 mt-1">Configure allowed knowledge topics, privacy firewall boundaries, and Q&A facts</p>
                </div>
                <button onClick={handleSaveAll} className="text-xs font-mono font-bold text-slate-950 bg-cyan-400 px-4 py-2 rounded-xl hover:bg-cyan-300">
                  <FaSave className="inline mr-1.5" /> Save AI Engine
                </button>
              </div>

              <div className="bg-slate-900/90 border border-white/10 rounded-2xl p-6 space-y-4 shadow-lg">
                <h3 className="font-bold text-white text-sm flex items-center gap-2">
                  <FaQuestionCircle className="text-cyan-400" /> Pittu AI Grounded Q&A Pairs ({kb.faqs?.length || 0})
                </h3>

                <div className="space-y-3">
                  {(kb.faqs || []).map((faq, idx) => (
                    <div key={idx} className="bg-slate-950/60 border border-white/10 rounded-xl p-4 space-y-2">
                      <div className="flex items-center justify-between gap-3">
                        <input
                          type="text"
                          value={faq.question}
                          onChange={(e) => {
                            const updated = [...(kb.faqs || [])]
                            updated[idx].question = e.target.value
                            setKb({ ...kb, faqs: updated })
                          }}
                          className="font-bold text-xs text-cyan-300 bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 flex-1 outline-none focus:border-cyan-400"
                        />
                        <button
                          onClick={() => {
                            const updated = (kb.faqs || []).filter((_, i) => i !== idx)
                            setKb({ ...kb, faqs: updated })
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
                        className="w-full bg-white/5 border border-white/10 rounded-lg p-2.5 text-xs text-slate-300 outline-none focus:border-cyan-400"
                      />
                    </div>
                  ))}
                </div>

                <div className="pt-3 border-t border-white/10 space-y-3">
                  <input
                    type="text"
                    placeholder="New Question..."
                    value={newFaqQ}
                    onChange={(e) => setNewFaqQ(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-xs text-white outline-none focus:border-cyan-400"
                  />
                  <textarea
                    rows={2}
                    placeholder="New Answer..."
                    value={newFaqA}
                    onChange={(e) => setNewFaqA(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-xs text-white outline-none focus:border-cyan-400"
                  />
                  <button
                    onClick={() => {
                      if (newFaqQ.trim() && newFaqA.trim()) {
                        const newFaq = { question: newFaqQ.trim(), answer: newFaqA.trim(), category: 'GENERAL' }
                        setKb({ ...kb, faqs: [...(kb.faqs || []), newFaq] })
                        setNewFaqQ('')
                        setNewFaqA('')
                      }
                    }}
                    className="bg-cyan-400 text-slate-950 font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5"
                  >
                    <FaPlus /> Add FAQ Pair
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 7: DATABASE */}
          {activeTab === 'database' && (
            <div className="space-y-6 max-w-4xl">
              <h2 className="text-xl font-bold font-display text-white">Database & Infrastructure Overview</h2>

              <div className="bg-slate-900/90 border border-white/10 rounded-2xl p-6 space-y-4 shadow-lg">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-white text-sm">Supabase Service Connection</h3>
                  <span className="text-xs font-mono text-emerald-400 bg-emerald-400/10 border border-emerald-400/30 px-3 py-1 rounded-full">
                    {isSupabaseConfigured() ? 'Supabase Active' : 'Browser Storage + Local Memory'}
                  </span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  All changes made in this Executive CMS are saved immediately to Local Browser Storage and update the authoritative single source of truth across the live website and Pittu AI!
                </p>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
