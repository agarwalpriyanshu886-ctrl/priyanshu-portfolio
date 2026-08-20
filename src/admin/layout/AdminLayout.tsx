import { useState, useEffect, ReactNode } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../lib/auth/AuthContext'
import { cmsService } from '../../lib/services/cmsService'
import { CommandPalette } from '../components/CommandPalette'
import {
  LayoutDashboard,
  FileText,
  User,
  Sparkles,
  FolderKanban,
  Briefcase,
  GraduationCap,
  Award,
  Film,
  Palette,
  Box,
  Image,
  MessageSquare,
  Navigation,
  Share2,
  Search,
  Palette as PaletteIcon,
  BarChart3,
  Users,
  ShieldCheck,
  History,
  Lock,
  Settings,
  LogOut,
  ExternalLink,
  Power,
  Command,
  ChevronDown,
  Menu,
  X,
  LaptopCode,
  Brush,
} from 'lucide-react'

interface SidebarSection {
  title: string
  items: { label: string; href: string; icon: any; badge?: string }[]
}

const sidebarConfig: SidebarSection[] = [
  {
    title: 'Overview',
    items: [{ label: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard }],
  },
  {
    title: 'Developer CMS',
    items: [
      { label: 'Homepage', href: '/admin/homepage', icon: FileText },
      { label: 'About Developer', href: '/admin/about', icon: User },
      { label: 'Skills & Tech', href: '/admin/skills', icon: Sparkles },
      { label: 'Code Projects', href: '/admin/projects', icon: FolderKanban },
      { label: 'Experience', href: '/admin/experience', icon: Briefcase },
      { label: 'Education Timeline', href: '/admin/education', icon: GraduationCap },
      { label: 'Certifications', href: '/admin/certifications', icon: Award },
    ],
  },
  {
    title: 'Creative CMS',
    items: [
      { label: 'Showreels & Motion', href: '/admin/showreels', icon: Film },
      { label: 'Creative Tools', href: '/admin/creative-tools', icon: Palette },
    ],
  },
  {
    title: 'Media & 3D Studio',
    items: [
      { label: 'Media Library', href: '/admin/media', icon: Image },
      { label: '3D Studio & Intro', href: '/admin/3d-studio', icon: Box },
    ],
  },
  {
    title: 'Communications',
    items: [
      { label: 'Contact Messages', href: '/admin/messages', icon: MessageSquare },
      { label: 'Navigation Links', href: '/admin/navigation', icon: Navigation },
      { label: 'Social Links', href: '/admin/social-links', icon: Share2 },
      { label: 'Footer CMS', href: '/admin/footer', icon: LayoutDashboard },
    ],
  },
  {
    title: 'Platform & Security',
    items: [
      { label: 'SEO & Metadata', href: '/admin/seo', icon: Search },
      { label: 'Appearance & Theme', href: '/admin/appearance', icon: PaletteIcon },
      { label: 'Analytics', href: '/admin/analytics', icon: BarChart3 },
      { label: 'Users', href: '/admin/users', icon: Users },
      { label: 'Roles Matrix', href: '/admin/roles', icon: ShieldCheck },
      { label: 'Audit Logs', href: '/admin/audit-logs', icon: History },
      { label: 'Security', href: '/admin/security', icon: Lock },
      { label: 'Settings', href: '/admin/settings', icon: Settings },
    ],
  },
]

export function AdminLayout({ children }: { children: ReactNode }) {
  const { user, signOut } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const [maintenanceMode, setMaintenanceMode] = useState(false)
  const [isCommandOpen, setIsCommandOpen] = useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [previewMode, setPreviewMode] = useState<'developer' | 'creative'>('developer')

  useEffect(() => {
    document.body.classList.add('admin-mode')
    return () => document.body.classList.remove('admin-mode')
  }, [])

  useEffect(() => {
    cmsService.getSiteSettings().then((s) => {
      if (s) setMaintenanceMode(s.maintenance_mode)
    })
  }, [])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setIsCommandOpen((prev) => !prev)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  const handleToggleMaintenance = async () => {
    const next = !maintenanceMode
    setMaintenanceMode(next)
    await cmsService.updateSiteSettings({ maintenance_mode: next })
  }

  return (
    <div className="admin-body min-h-screen flex bg-slate-100 text-slate-800 font-sans">
      {/* SIDEBAR */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-slate-900 text-slate-300 flex flex-col border-r border-slate-800 transition-transform duration-200 lg:translate-x-0 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600 grid place-items-center text-white font-bold text-sm">
              CMS
            </div>
            <div>
              <span className="font-bold text-white text-sm block">Priyanshu CMS</span>
              <span className="text-[10px] text-slate-400 font-mono">Enterprise v3.0</span>
            </div>
          </div>
          <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {sidebarConfig.map((section) => (
            <div key={section.title}>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2 px-2">
                {section.title}
              </p>
              <div className="space-y-1">
                {section.items.map((item) => {
                  const Icon = item.icon
                  const isActive = location.pathname === item.href
                  return (
                    <Link
                      key={item.href}
                      to={item.href}
                      onClick={() => setIsSidebarOpen(false)}
                      className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold transition-colors ${
                        isActive
                          ? 'bg-blue-600 text-white shadow-sm'
                          : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon className="w-4 h-4 shrink-0" />
                        <span>{item.label}</span>
                      </div>
                      {item.badge && (
                        <span className="px-1.5 py-0.5 rounded text-[10px] bg-slate-800 text-slate-300">
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  )
                })}
              </div>
            </div>
          ))}
        </div>

        <div className="p-4 border-t border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5 truncate">
            <div className="w-8 h-8 rounded-full bg-slate-800 grid place-items-center text-xs font-bold text-slate-200 shrink-0">
              PA
            </div>
            <div className="truncate">
              <p className="text-xs font-semibold text-white truncate">{user?.email || 'admin@priyanshu.dev'}</p>
              <p className="text-[10px] text-slate-500 font-mono">SUPER_ADMIN</p>
            </div>
          </div>
          <button
            onClick={() => signOut()}
            title="Sign Out"
            className="p-1.5 rounded hover:bg-slate-800 text-slate-400 hover:text-rose-400 transition-colors"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </aside>

      {/* MAIN CONTAINER */}
      <div className="flex-1 lg:pl-64 flex flex-col min-w-0">
        {/* HEADER BAR */}
        <header className="sticky top-0 z-30 h-16 bg-white border-b border-slate-200 px-4 sm:px-8 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-2 rounded-lg hover:bg-slate-100 text-slate-600"
            >
              <Menu className="w-5 h-5" />
            </button>

            <button
              onClick={() => setIsCommandOpen(true)}
              className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-100 border border-slate-200 text-slate-500 text-xs hover:bg-slate-200/70 transition-colors"
            >
              <Search className="w-3.5 h-3.5" />
              <span>Type command or search...</span>
              <kbd className="ml-4 font-mono text-[10px] bg-white border border-slate-300 rounded px-1.5 py-0.5 shadow-2xs">
                ⌘K
              </kbd>
            </button>
          </div>

          <div className="flex items-center gap-3">
            {/* Mode Preview Switcher */}
            <div className="flex items-center p-0.5 rounded-lg bg-slate-100 border border-slate-200 text-xs font-semibold">
              <button
                onClick={() => setPreviewMode('developer')}
                className={`px-2.5 py-1 rounded-md transition-all flex items-center gap-1.5 ${
                  previewMode === 'developer'
                    ? 'bg-blue-600 text-white shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <LaptopCode className="w-3.5 h-3.5" /> Dev Preview
              </button>
              <button
                onClick={() => setPreviewMode('creative')}
                className={`px-2.5 py-1 rounded-md transition-all flex items-center gap-1.5 ${
                  previewMode === 'creative'
                    ? 'bg-pink-600 text-white shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Brush className="w-3.5 h-3.5" /> Creative Preview
              </button>
            </div>

            {/* Maintenance Toggle Status */}
            <button
              onClick={handleToggleMaintenance}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors border ${
                maintenanceMode
                  ? 'bg-amber-50 text-amber-800 border-amber-300'
                  : 'bg-emerald-50 text-emerald-800 border-emerald-300'
              }`}
            >
              <Power className={`w-3.5 h-3.5 ${maintenanceMode ? 'text-amber-600' : 'text-emerald-600'}`} />
              <span className="hidden sm:inline">
                {maintenanceMode ? 'Maintenance Mode' : 'Website Online'}
              </span>
            </button>

            {/* Live Site Preview Link */}
            <a
              href={`/?mode=${previewMode}`}
              target="_blank"
              rel="noreferrer"
              className="admin-btn admin-btn-secondary text-xs"
            >
              <span>Live Site</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </header>

        {/* CONTENT */}
        <main className="flex-1 p-4 sm:p-8 max-w-7xl w-full mx-auto">{children}</main>
      </div>

      <CommandPalette isOpen={isCommandOpen} onClose={() => setIsCommandOpen(false)} />
    </div>
  )
}
