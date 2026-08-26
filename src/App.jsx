import { useState, useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { PRIAIAgentContainer } from './components/ai/PRIAIAgentContainer'
import { ModeProvider } from './lib/mode/ModeContext'
import { getActiveKnowledge } from './lib/public-ai/cmsKnowledgeStore'
import Preloader from './components/Preloader'
import ScrollProgress from './components/ScrollProgress'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import About from './components/About'
import Skills from './components/Skills'
import Projects from './components/Projects'
import Experience from './components/Experience'
import Education from './components/Education'
import Certifications from './components/Certifications'
import GitHubSection from './components/GitHubSection'
import Contact from './components/Contact'
import Footer from './components/Footer'
import BackToTop from './components/BackToTop'
import NotFound from './pages/NotFound'
import AdminPage from './pages/AdminPage'

const sectionMap = {
  hero: Hero,
  about: About,
  skills: Skills,
  projects: Projects,
  experience: Experience,
  education: Education,
  certifications: Certifications,
  github: GitHubSection,
  contact: Contact,
}

function Home() {
  const [layout, setLayout] = useState(null)

  useEffect(() => {
    fetchKnowledgeFromSupabase().catch(() => {})

    const updateLayout = () => {
      const active = getActiveKnowledge()
      if (active && active.layoutConfig && active.layoutConfig.sections) {
        setLayout(active.layoutConfig)
      }
    }

    updateLayout()
    window.addEventListener('cms_knowledge_updated', updateLayout)
    window.addEventListener('storage', updateLayout)
    return () => {
      window.removeEventListener('cms_knowledge_updated', updateLayout)
      window.removeEventListener('storage', updateLayout)
    }
  }, [])

  const sectionsToRender = layout?.sections || [
    { id: 'hero', enabled: true },
    { id: 'about', enabled: true },
    { id: 'skills', enabled: true },
    { id: 'projects', enabled: true },
    { id: 'experience', enabled: true },
    { id: 'education', enabled: true },
    { id: 'certifications', enabled: true },
    { id: 'github', enabled: true },
    { id: 'contact', enabled: true },
  ]

  return (
    <main>
      {sectionsToRender.map((sec) => {
        if (!sec.enabled) return null
        const Component = sectionMap[sec.id]
        if (!Component) return null

        return (
          <div
            key={sec.id}
            style={{
              paddingTop: sec.paddingTopRem !== undefined ? `${sec.paddingTopRem}rem` : undefined,
              paddingBottom: sec.paddingBottomRem !== undefined ? `${sec.paddingBottomRem}rem` : undefined,
            }}
          >
            <Component />
          </div>
        )
      })}
      <Footer />
    </main>
  )
}

export default function App() {
  const location = useLocation()
  const isAdminRoute = location.pathname.startsWith('/admin')

  if (isAdminRoute) {
    return (
      <ModeProvider>
        <Routes>
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/admin/login" element={<AdminPage />} />
          <Route path="/admin/dashboard" element={<AdminPage />} />
          <Route path="/admin/*" element={<AdminPage />} />
        </Routes>
      </ModeProvider>
    )
  }

  return (
    <ModeProvider>
      <div className="relative min-h-screen">
        <Preloader />

        <ScrollProgress />
        <Navbar />

        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<Home />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AnimatePresence>

        <BackToTop />
        <PRIAIAgentContainer />
      </div>
    </ModeProvider>
  )
}
