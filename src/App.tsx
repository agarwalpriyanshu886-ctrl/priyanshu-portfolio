import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './lib/auth/AuthContext'
import { ModeProvider } from './lib/mode/ModeContext'
import { AdminLayout } from './admin/layout/AdminLayout'

// Public Pages
import PublicHomePage from './public/pages/PublicHomePage'
import ProjectDetailPage from './public/pages/ProjectDetailPage'
import BlogListPage from './public/pages/BlogListPage'
import BlogDetailPage from './public/pages/BlogDetailPage'
import NotFoundPage from './public/pages/NotFoundPage'

// Admin Pages
import LoginPage from './admin/pages/LoginPage'
import ForgotPasswordPage from './admin/pages/ForgotPasswordPage'
import ResetPasswordPage from './admin/pages/ResetPasswordPage'
import DashboardPage from './admin/pages/DashboardPage'
import HomepageCMSPage from './admin/pages/HomepageCMSPage'
import AboutCMSPage from './admin/pages/AboutCMSPage'
import SkillsCMSPage from './admin/pages/SkillsCMSPage'
import ProjectsCMSPage from './admin/pages/ProjectsCMSPage'
import ExperienceCMSPage from './admin/pages/ExperienceCMSPage'
import EducationCMSPage from './admin/pages/EducationCMSPage'
import CertificationsCMSPage from './admin/pages/CertificationsCMSPage'
import BlogCMSPage from './admin/pages/BlogCMSPage'
import ShowreelCMSPage from './admin/pages/ShowreelCMSPage'
import CreativeToolsCMSPage from './admin/pages/CreativeToolsCMSPage'
import ThreeDStudioCMSPage from './admin/pages/ThreeDStudioCMSPage'
import MediaLibraryPage from './admin/pages/MediaLibraryPage'
import MessagesPage from './admin/pages/MessagesPage'
import NavigationCMSPage from './admin/pages/NavigationCMSPage'
import SocialLinksCMSPage from './admin/pages/SocialLinksCMSPage'
import FooterCMSPage from './admin/pages/FooterCMSPage'
import SEOCMSPage from './admin/pages/SEOCMSPage'
import AppearanceCMSPage from './admin/pages/AppearanceCMSPage'
import AnalyticsPage from './admin/pages/AnalyticsPage'
import UsersCMSPage from './admin/pages/UsersCMSPage'
import RolesCMSPage from './admin/pages/RolesCMSPage'
import AuditLogsPage from './admin/pages/AuditLogsPage'
import SecurityPage from './admin/pages/SecurityPage'
import SettingsPage from './admin/pages/SettingsPage'

function ProtectedAdminRoute({ children }: { children: JSX.Element }) {
  const { user, loading, isConfigured } = useAuth()
  if (loading) {
    return <div className="min-h-screen bg-slate-900 text-white grid place-items-center">Verifying session...</div>
  }
  if (isConfigured && !user) {
    return <Navigate to="/admin/login" replace />
  }
  return <AdminLayout>{children}</AdminLayout>
}

export default function App() {
  return (
    <AuthProvider>
      <ModeProvider>
        <Routes>
          {/* PUBLIC DUAL IDENTITY PORTFOLIO ROUTES */}
          <Route path="/" element={<PublicHomePage />} />
          <Route path="/creative" element={<PublicHomePage />} />
          <Route path="/projects/:slug" element={<ProjectDetailPage />} />
          <Route path="/blog" element={<BlogListPage />} />
          <Route path="/blog/:slug" element={<BlogDetailPage />} />

          {/* ADMIN AUTH ROUTES */}
          <Route path="/admin/login" element={<LoginPage />} />
          <Route path="/admin/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/admin/reset-password" element={<ResetPasswordPage />} />

          {/* ADMIN PROTECTED CMS ROUTES */}
          <Route path="/admin/dashboard" element={<ProtectedAdminRoute><DashboardPage /></ProtectedAdminRoute>} />
          <Route path="/admin/homepage" element={<ProtectedAdminRoute><HomepageCMSPage /></ProtectedAdminRoute>} />
          <Route path="/admin/about" element={<ProtectedAdminRoute><AboutCMSPage /></ProtectedAdminRoute>} />
          <Route path="/admin/skills" element={<ProtectedAdminRoute><SkillsCMSPage /></ProtectedAdminRoute>} />
          <Route path="/admin/projects" element={<ProtectedAdminRoute><ProjectsCMSPage /></ProtectedAdminRoute>} />
          <Route path="/admin/experience" element={<ProtectedAdminRoute><ExperienceCMSPage /></ProtectedAdminRoute>} />
          <Route path="/admin/education" element={<ProtectedAdminRoute><EducationCMSPage /></ProtectedAdminRoute>} />
          <Route path="/admin/certifications" element={<ProtectedAdminRoute><CertificationsCMSPage /></ProtectedAdminRoute>} />
          <Route path="/admin/blog" element={<ProtectedAdminRoute><BlogCMSPage /></ProtectedAdminRoute>} />
          <Route path="/admin/showreels" element={<ProtectedAdminRoute><ShowreelCMSPage /></ProtectedAdminRoute>} />
          <Route path="/admin/creative-tools" element={<ProtectedAdminRoute><CreativeToolsCMSPage /></ProtectedAdminRoute>} />
          <Route path="/admin/3d-studio" element={<ProtectedAdminRoute><ThreeDStudioCMSPage /></ProtectedAdminRoute>} />
          <Route path="/admin/media" element={<ProtectedAdminRoute><MediaLibraryPage /></ProtectedAdminRoute>} />
          <Route path="/admin/messages" element={<ProtectedAdminRoute><MessagesPage /></ProtectedAdminRoute>} />
          <Route path="/admin/navigation" element={<ProtectedAdminRoute><NavigationCMSPage /></ProtectedAdminRoute>} />
          <Route path="/admin/social-links" element={<ProtectedAdminRoute><SocialLinksCMSPage /></ProtectedAdminRoute>} />
          <Route path="/admin/footer" element={<ProtectedAdminRoute><FooterCMSPage /></ProtectedAdminRoute>} />
          <Route path="/admin/seo" element={<ProtectedAdminRoute><SEOCMSPage /></ProtectedAdminRoute>} />
          <Route path="/admin/appearance" element={<ProtectedAdminRoute><AppearanceCMSPage /></ProtectedAdminRoute>} />
          <Route path="/admin/analytics" element={<ProtectedAdminRoute><AnalyticsPage /></ProtectedAdminRoute>} />
          <Route path="/admin/users" element={<ProtectedAdminRoute><UsersCMSPage /></ProtectedAdminRoute>} />
          <Route path="/admin/roles" element={<ProtectedAdminRoute><RolesCMSPage /></ProtectedAdminRoute>} />
          <Route path="/admin/audit-logs" element={<ProtectedAdminRoute><AuditLogsPage /></ProtectedAdminRoute>} />
          <Route path="/admin/security" element={<ProtectedAdminRoute><SecurityPage /></ProtectedAdminRoute>} />
          <Route path="/admin/settings" element={<ProtectedAdminRoute><SettingsPage /></ProtectedAdminRoute>} />

          {/* 404 NOT FOUND */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </ModeProvider>
    </AuthProvider>
  )
}
