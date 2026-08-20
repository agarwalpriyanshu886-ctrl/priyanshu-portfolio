import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { PRIAIAgentContainer } from './components/ai/PRIAIAgentContainer'
import { ModeProvider } from './lib/mode/ModeContext'
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

function Home() {
  return (
    <>
      <Hero />
      <About />
      <Skills />
      <Projects />
      <Experience />
      <Education />
      <Certifications />
      <GitHubSection />
      <Contact />
      <Footer />
    </>
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
