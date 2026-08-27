import { supabase, isSupabaseConfigured } from '../supabase'
import {
  SiteSettings,
  HomepageSection,
  AboutData,
  AboutProfile,
  Skill,
  SkillCategory,
  Project,
  Showreel,
  CreativeTool,
  ThreeDAsset,
  ThreeDScene,
  ThreeDSceneObject,
  ModeSettings,
  Experience,
  Education,
  Certification,
  Service,
  BlogPost,
  NavigationItem,
  SocialLink,
  ContactMessage,
  AuditLog,
  ModeType,
} from '../../types/database'

// Seed Fallbacks
import { site } from '../../data/site'
import { skills as defaultSkills } from '../../data/skills'
import { projects as defaultProjects } from '../../data/projects'
import { experience as defaultExperience } from '../../data/experience'
import { education as defaultEducation } from '../../data/education'
import { certifications as defaultCertifications } from '../../data/certifications'

let modeSettingsTableExists: boolean | null = null

export const cmsService = {
  // SITE SETTINGS
  async getSiteSettings(): Promise<SiteSettings | null> {
    if (!isSupabaseConfigured()) return this.getDefaultSiteSettings()
    try {
      const { data, error } = await supabase.from('site_settings').select('*').limit(1).single()
      if (error || !data) return this.getDefaultSiteSettings()
      return data
    } catch {
      return this.getDefaultSiteSettings()
    }
  },

  getDefaultSiteSettings(): SiteSettings {
    return {
      id: 'default',
      site_name: site.name,
      owner_name: site.name,
      site_title: site.role,
      site_description: site.shortDescription,
      email: site.email,
      phone: site.phone,
      location: site.location,
      github_username: site.socials.github.url.split('/').pop(),
      maintenance_mode: false,
      footer_config: {
        copyrightText: `© ${new Date().getFullYear()} Priyanshu Agarwal. All rights reserved.`,
        tagline: 'Building intelligent software & creating cinematic visuals.',
        showSocials: true,
      },
      updated_at: new Date().toISOString(),
    }
  },

  async updateSiteSettings(settings: Partial<SiteSettings>): Promise<void> {
    if (!isSupabaseConfigured()) return
    const current = await this.getSiteSettings()
    if (current && current.id !== 'default') {
      await supabase.from('site_settings').update(settings).eq('id', current.id)
    } else {
      await supabase.from('site_settings').insert(settings)
    }
  },

  // ABOUT PROFILES (Mode-Specific Biography)
  async getAboutProfile(mode: ModeType): Promise<AboutProfile | null> {
    if (!isSupabaseConfigured()) return this.getDefaultAboutProfile(mode)
    try {
      const { data } = await supabase
        .from('about_profiles')
        .select('*')
        .eq('mode', mode)
        .limit(1)
        .single()
      if (data) return data
      return this.getDefaultAboutProfile(mode)
    } catch {
      return this.getDefaultAboutProfile(mode)
    }
  },

  getDefaultAboutProfile(mode: ModeType): AboutProfile {
    if (mode === 'CREATIVE') {
      return {
        id: 'default-creative',
        mode: 'CREATIVE',
        headline: 'Visual Designer, Video Editor & Motion Artist',
        subheading: 'Turning raw concepts into cinematic visuals, motion graphics, and high-impact branding.',
        paragraphs: [
          'Alongside software engineering, I am a passionate graphic designer, video editor, and motion graphics artist.',
          'I craft visual identity systems, poster graphics, video showreels, and UI/UX visual directions that captivate audiences.',
        ],
        passions: ['Graphic Design', 'Video Editing', 'Motion Graphics', 'Visual Branding', 'Color Grading', '3D Composition'],
        is_published: true,
        updated_at: new Date().toISOString(),
      }
    }
    return {
      id: 'default-developer',
      mode: 'DEVELOPER',
      headline: 'AI/ML Engineer & Full-Stack Architect',
      subheading: 'Building intelligent software systems, scalable web applications, and data-driven solutions.',
      paragraphs: [
        'I am an engineering student pursuing an integrated B.Tech + M.Tech in Artificial Intelligence & Machine Learning at NIMS University, Jaipur (B.Tech: 2024–2028, M.Tech: 2028–2029).',
        'My work focuses on neural networks, computer vision, full-stack web applications, and robust backend engineering.',
      ],
      passions: ['Artificial Intelligence', 'Machine Learning', 'Full-Stack Development', 'Software Engineering', 'Database Systems'],
      is_published: true,
      updated_at: new Date().toISOString(),
    }
  },

  async saveAboutProfile(profile: Partial<AboutProfile>): Promise<void> {
    if (!isSupabaseConfigured()) return
    await supabase.from('about_profiles').upsert(profile, { onConflict: 'mode' })
  },

  // ABOUT LEGACY
  async getAbout(): Promise<AboutData | null> {
    const prof = await this.getAboutProfile('DEVELOPER')
    return {
      headline: prof?.headline || site.about.paragraphs[0],
      subheading: prof?.subheading || '',
      paragraphs: prof?.paragraphs || site.about.paragraphs,
      passions: prof?.passions || site.about.passions,
    }
  },

  // HOMEPAGE SECTIONS
  async getHomepageSections(): Promise<HomepageSection[]> {
    if (!isSupabaseConfigured()) return []
    try {
      const { data } = await supabase.from('homepage_sections').select('*').order('display_order', { ascending: true })
      return data || []
    } catch {
      return []
    }
  },

  // SKILLS
  async getSkills(modeFilter?: ModeType): Promise<Skill[]> {
    if (!isSupabaseConfigured()) {
      return defaultSkills.map((s, idx) => ({
        id: `skill-${idx}`,
        name: s.name,
        icon: s.icon,
        proficiency: s.level || 85,
        experience_level: 'Advanced',
        mode: 'DEVELOPER',
        is_featured: true,
        is_published: true,
        display_order: idx + 1,
      }))
    }
    try {
      let query = supabase.from('skills').select('*').order('display_order', { ascending: true })
      if (modeFilter) query = query.or(`mode.eq.${modeFilter},mode.eq.SHARED`)
      const { data } = await query
      return data || []
    } catch {
      return []
    }
  },

  async saveSkill(skill: Partial<Skill>): Promise<void> {
    if (!isSupabaseConfigured()) return
    if (skill.id) await supabase.from('skills').update(skill).eq('id', skill.id)
    else await supabase.from('skills').insert(skill)
  },

  async deleteSkill(id: string): Promise<void> {
    if (!isSupabaseConfigured()) return
    await supabase.from('skills').delete().eq('id', id)
  },

  // PROJECTS (Mode Filter & Hybrid Support)
  async getProjects(modeFilter?: ModeType): Promise<Project[]> {
    if (!isSupabaseConfigured()) {
      return defaultProjects.map((p, idx) => ({
        id: p.id,
        name: p.title,
        slug: p.id,
        category: p.category || 'Web Application',
        short_description: p.description,
        full_description: p.description,
        thumbnail_url: p.id.includes('chopati') ? '/projects/agarwals-chopati.png' : p.image?.url,
        live_demo_url: p.id.includes('chopati') ? 'https://agarwalschopati.vercel.app' : p.demo,
        technologies: p.tech || [],
        mode: p.id.includes('chopati') ? 'HYBRID' : 'DEVELOPER',
        developer_highlights: p.id.includes('chopati') ? ['React', 'Supabase', 'Auth RBAC', 'PostgreSQL'] : [],
        creative_highlights: p.id.includes('chopati') ? ['UI/UX Design', 'Branding', 'Motion Effects'] : [],
        is_featured: true,
        status: 'PUBLISHED',
        display_order: idx + 1,
        created_at: new Date().toISOString(),
      }))
    }
    try {
      let query = supabase.from('projects').select('*').order('display_order', { ascending: true })
      if (modeFilter) {
        query = query.or(`mode.eq.${modeFilter},mode.eq.HYBRID,mode.eq.SHARED`)
      }
      const { data } = await query
      return data || []
    } catch {
      return []
    }
  },

  async getProjectBySlug(slug: string): Promise<Project | null> {
    if (!isSupabaseConfigured()) {
      const list = await this.getProjects()
      return list.find((p) => p.slug === slug) || null
    }
    try {
      const { data } = await supabase.from('projects').select('*').eq('slug', slug).single()
      return data
    } catch {
      return null
    }
  },

  async saveProject(project: Partial<Project>): Promise<void> {
    if (!isSupabaseConfigured()) return
    if (project.id) await supabase.from('projects').update(project).eq('id', project.id)
    else await supabase.from('projects').insert(project)
  },

  async deleteProject(id: string): Promise<void> {
    if (!isSupabaseConfigured()) return
    await supabase.from('projects').delete().eq('id', id)
  },

  // SHOWREELS
  async getShowreels(): Promise<Showreel[]> {
    if (!isSupabaseConfigured()) {
      return [
        {
          id: 'default-showreel',
          title: 'Cinematic Motion & Video Reel 2026',
          category: 'Video Editing & Motion Graphics',
          description: 'A collection of commercial video edits, motion graphic intros, and brand animations.',
          video_source: 'YOUTUBE',
          video_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
          poster_image: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=800&q=80',
          is_featured: true,
          is_published: true,
          display_order: 1,
          created_at: new Date().toISOString(),
        },
      ]
    }
    try {
      const { data } = await supabase.from('showreels').select('*').order('display_order', { ascending: true })
      return data || []
    } catch {
      return []
    }
  },

  async saveShowreel(showreel: Partial<Showreel>): Promise<void> {
    if (!isSupabaseConfigured()) return
    if (showreel.id) await supabase.from('showreels').update(showreel).eq('id', showreel.id)
    else await supabase.from('showreels').insert(showreel)
  },

  async deleteShowreel(id: string): Promise<void> {
    if (!isSupabaseConfigured()) return
    await supabase.from('showreels').delete().eq('id', id)
  },

  // CREATIVE TOOLS
  async getCreativeTools(): Promise<CreativeTool[]> {
    if (!isSupabaseConfigured()) {
      return [
        { id: '1', name: 'Adobe Photoshop', category: 'Graphic Design', icon: 'SiAdobephotoshop', proficiency_level: 95, is_featured: true, is_published: true, display_order: 1, created_at: '' },
        { id: '2', name: 'Adobe Illustrator', category: 'Vector & Branding', icon: 'SiAdobeillustrator', proficiency_level: 90, is_featured: true, is_published: true, display_order: 2, created_at: '' },
        { id: '3', name: 'Adobe Premiere Pro', category: 'Video Editing', icon: 'SiAdobepremierepro', proficiency_level: 92, is_featured: true, is_published: true, display_order: 3, created_at: '' },
        { id: '4', name: 'Adobe After Effects', category: 'Motion Graphics', icon: 'SiAdobeaftereffects', proficiency_level: 88, is_featured: true, is_published: true, display_order: 4, created_at: '' },
        { id: '5', name: 'DaVinci Resolve', category: 'Color Grading', icon: 'SiDavinciresolve', proficiency_level: 85, is_featured: true, is_published: true, display_order: 5, created_at: '' },
        { id: '6', name: 'Figma', category: 'UI/UX Design', icon: 'SiFigma', proficiency_level: 95, is_featured: true, is_published: true, display_order: 6, created_at: '' },
        { id: '7', name: 'Blender', category: '3D Modeling', icon: 'SiBlender', proficiency_level: 80, is_featured: true, is_published: true, display_order: 7, created_at: '' },
      ]
    }
    try {
      const { data } = await supabase.from('creative_tools').select('*').order('display_order', { ascending: true })
      return data || []
    } catch {
      return []
    }
  },

  async saveCreativeTool(tool: Partial<CreativeTool>): Promise<void> {
    if (!isSupabaseConfigured()) return
    if (tool.id) await supabase.from('creative_tools').update(tool).eq('id', tool.id)
    else await supabase.from('creative_tools').insert(tool)
  },

  async deleteCreativeTool(id: string): Promise<void> {
    if (!isSupabaseConfigured()) return
    await supabase.from('creative_tools').delete().eq('id', id)
  },

  // HIERARCHICAL 3D STUDIO (Assets, Scenes, Scene Objects)
  async getThreeDAssets(): Promise<ThreeDAsset[]> {
    if (!isSupabaseConfigured()) return []
    try {
      const { data } = await supabase.from('three_d_assets').select('*').order('created_at', { ascending: false })
      return data || []
    } catch {
      return []
    }
  },

  async saveThreeDAsset(asset: Partial<ThreeDAsset>): Promise<void> {
    if (!isSupabaseConfigured()) return
    if (asset.id) await supabase.from('three_d_assets').update(asset).eq('id', asset.id)
    else await supabase.from('three_d_assets').insert(asset)
  },

  async deleteThreeDAsset(id: string): Promise<void> {
    if (!isSupabaseConfigured()) return
    await supabase.from('three_d_assets').delete().eq('id', id)
  },

  async getThreeDScenes(): Promise<ThreeDScene[]> {
    if (!isSupabaseConfigured()) return []
    try {
      const { data } = await supabase.from('three_d_scenes').select('*').order('created_at', { ascending: false })
      return data || []
    } catch {
      return []
    }
  },

  async saveThreeDScene(scene: Partial<ThreeDScene>): Promise<void> {
    if (!isSupabaseConfigured()) return
    if (scene.id) await supabase.from('three_d_scenes').update(scene).eq('id', scene.id)
    else await supabase.from('three_d_scenes').insert(scene)
  },

  async getThreeDSceneObjects(sceneId?: string): Promise<ThreeDSceneObject[]> {
    if (!isSupabaseConfigured()) return []
    try {
      let query = supabase.from('three_d_scene_objects').select('*').order('display_order', { ascending: true })
      if (sceneId) query = query.eq('scene_id', sceneId)
      const { data } = await query
      return data || []
    } catch {
      return []
    }
  },

  async saveThreeDSceneObject(obj: Partial<ThreeDSceneObject>): Promise<void> {
    if (!isSupabaseConfigured()) return
    if (obj.id) await supabase.from('three_d_scene_objects').update(obj).eq('id', obj.id)
    else await supabase.from('three_d_scene_objects').insert(obj)
  },

  // MODE SETTINGS
  async getModeSettings(): Promise<ModeSettings> {
    const defaultSettings: ModeSettings = {
      id: 'default',
      default_mode: 'DEVELOPER',
      enable_mode_persistence: true,
      intro_mode: 'FIRST_VISIT',
      transition_duration_ms: 1000,
    }
    if (!isSupabaseConfigured() || !supabase || modeSettingsTableExists === false) {
      return defaultSettings
    }
    try {
      const { data, error } = await supabase.from('mode_settings').select('*').limit(1).maybeSingle()
      if (error) {
        if (
          error.code === '42P01' ||
          error.message?.includes('schema cache') ||
          error.message?.includes('does not exist') ||
          error.message?.includes('404')
        ) {
          modeSettingsTableExists = false
        }
        return defaultSettings
      }
      if (!data) return defaultSettings
      modeSettingsTableExists = true
      return data
    } catch {
      modeSettingsTableExists = false
      return defaultSettings
    }
  },

  async saveModeSettings(settings: Partial<ModeSettings>): Promise<void> {
    if (!isSupabaseConfigured()) return
    const current = await this.getModeSettings()
    if (current && current.id !== 'default') {
      await supabase.from('mode_settings').update(settings).eq('id', current.id)
    } else {
      await supabase.from('mode_settings').insert(settings)
    }
  },

  // EDUCATION
  async getEducation(publishedOnly = false): Promise<Education[]> {
    if (!isSupabaseConfigured()) {
      return defaultEducation.map((e, idx) => ({
        id: e.id,
        degree: e.degree,
        institution: e.institution,
        field: e.field,
        location: e.location,
        start_date: e.startDate,
        end_date: e.endDate,
        current_status: e.duration,
        description: e.description,
        is_published: true,
        display_order: idx + 1,
      }))
    }
    try {
      let query = supabase.from('education').select('*').order('display_order', { ascending: true })
      if (publishedOnly) query = query.eq('is_published', true)
      const { data } = await query
      return data || []
    } catch {
      return []
    }
  },

  // EXPERIENCE
  async getExperience(publishedOnly = false): Promise<Experience[]> {
    if (!isSupabaseConfigured()) {
      return defaultExperience.map((e, idx) => ({
        id: e.id,
        company: e.company,
        position: e.role,
        location: 'Jaipur',
        employment_type: e.type || 'Full-time',
        start_date: e.startDate || '2024',
        end_date: e.endDate || 'Present',
        is_current: e.endDate === e.startDate ? true : false,
        description: e.points?.join(' ') || '',
        is_published: true,
        display_order: idx + 1,
      }))
    }
    try {
      let query = supabase.from('experience').select('*').order('display_order', { ascending: true })
      if (publishedOnly) query = query.eq('is_published', true)
      const { data } = await query
      return data || []
    } catch {
      return []
    }
  },

  // CERTIFICATIONS
  async getCertifications(publishedOnly = false): Promise<Certification[]> {
    if (!isSupabaseConfigured()) {
      return defaultCertifications.map((c, idx) => ({
        id: c.id,
        title: c.title,
        organization: c.organization,
        issue_date: c.date,
        credential_url: c.url,
        is_published: true,
      }))
    }
    try {
      let query = supabase.from('certifications').select('*').order('created_at', { ascending: false })
      if (publishedOnly) query = query.eq('is_published', true)
      const { data } = await query
      return data || []
    } catch {
      return []
    }
  },

  // SERVICES (Mode-Filtered)
  async getServices(modeFilter?: ModeType): Promise<Service[]> {
    if (!isSupabaseConfigured()) {
      if (modeFilter === 'CREATIVE') {
        return [
          { id: 'c1', title: 'Graphic Design & Branding', description: 'Visual identity, logo design, marketing posters, and brand guidelines.', mode: 'CREATIVE', is_published: true, display_order: 1 },
          { id: 'c2', title: 'Video Editing & Color Grading', description: 'Commercial edits, social media reels, color correction, and pacing.', mode: 'CREATIVE', is_published: true, display_order: 2 },
          { id: 'c3', title: 'Motion Graphics & Intros', description: '2D/3D motion design, animated typography, and title openers.', mode: 'CREATIVE', is_published: true, display_order: 3 },
          { id: 'c4', title: 'UI/UX Visual Design', description: 'User interface layouts, design systems, interactive prototypes.', mode: 'CREATIVE', is_published: true, display_order: 4 },
        ]
      }
      return [
        { id: 'd1', title: 'Full-Stack Web Development', description: 'Custom React, Vite, Node.js and Supabase web applications.', mode: 'DEVELOPER', is_published: true, display_order: 1 },
        { id: 'd2', title: 'AI/ML Engineering', description: 'Neural network training, computer vision models, and intelligent integrations.', mode: 'DEVELOPER', is_published: true, display_order: 2 },
        { id: 'd3', title: 'Database & CMS Systems', description: 'PostgreSQL schema design, enterprise CMS dashboards, and RBAC authentication.', mode: 'DEVELOPER', is_published: true, display_order: 3 },
      ]
    }
    try {
      let query = supabase.from('services').select('*').order('display_order', { ascending: true })
      if (modeFilter) query = query.or(`mode.eq.${modeFilter},mode.eq.SHARED`)
      const { data } = await query
      return data || []
    } catch {
      return []
    }
  },

  // NAVIGATION ITEMS (Mode-Filtered)
  async getNavigationItems(modeFilter?: ModeType): Promise<NavigationItem[]> {
    if (!isSupabaseConfigured()) {
      if (modeFilter === 'CREATIVE') {
        return [
          { id: '1', label: 'Home', url: '#home', mode: 'CREATIVE', is_visible: true, display_order: 1 },
          { id: '2', label: 'About', url: '#about', mode: 'CREATIVE', is_visible: true, display_order: 2 },
          { id: '3', label: 'Showreel', url: '#showreel', mode: 'CREATIVE', is_visible: true, display_order: 3 },
          { id: '4', label: 'Creative Work', url: '#portfolio', mode: 'CREATIVE', is_visible: true, display_order: 4 },
          { id: '5', label: 'Tools', url: '#tools', mode: 'CREATIVE', is_visible: true, display_order: 5 },
          { id: '6', label: 'Services', url: '#services', mode: 'CREATIVE', is_visible: true, display_order: 6 },
          { id: '7', label: 'Contact', url: '#contact', mode: 'CREATIVE', is_visible: true, display_order: 7 },
        ]
      }
      return [
        { id: '1', label: 'Home', url: '#home', mode: 'DEVELOPER', is_visible: true, display_order: 1 },
        { id: '2', label: 'About', url: '#about', mode: 'DEVELOPER', is_visible: true, display_order: 2 },
        { id: '3', label: 'Skills', url: '#skills', mode: 'DEVELOPER', is_visible: true, display_order: 3 },
        { id: '4', label: 'Projects', url: '#projects', mode: 'DEVELOPER', is_visible: true, display_order: 4 },
        { id: '5', label: 'Education', url: '#education', mode: 'DEVELOPER', is_visible: true, display_order: 5 },
        { id: '6', label: 'GitHub', url: '#github', mode: 'DEVELOPER', is_visible: true, display_order: 6 },
        { id: '7', label: 'Contact', url: '#contact', mode: 'DEVELOPER', is_visible: true, display_order: 7 },
      ]
    }
    try {
      let query = supabase.from('navigation_items').select('*').order('display_order', { ascending: true })
      if (modeFilter) query = query.or(`mode.eq.${modeFilter},mode.eq.SHARED`)
      const { data } = await query
      return data || []
    } catch {
      return []
    }
  },

  // SOCIAL LINKS
  async getSocialLinks(publishedOnly = false): Promise<SocialLink[]> {
    if (!isSupabaseConfigured()) {
      return [
        { id: '1', platform: 'GitHub', url: site.socials.github.url, is_visible: true },
        { id: '2', platform: 'LinkedIn', url: site.socials.linkedin.url, is_visible: true },
        { id: '3', platform: 'Instagram', url: site.socials.instagram.url, is_visible: true },
      ]
    }
    try {
      let query = supabase.from('social_links').select('*')
      if (publishedOnly) query = query.eq('is_visible', true)
      const { data } = await query
      return data || []
    } catch {
      return []
    }
  },

  // CONTACT MESSAGES
  async submitContactMessage(msg: { sender_name: string; sender_email: string; subject: string; message: string }) {
    if (!isSupabaseConfigured()) {
      return { success: true, message: 'Message logged locally.' }
    }
    try {
      const { error } = await supabase.from('contact_messages').insert({ ...msg, status: 'NEW' })
      if (error) throw error
      return { success: true }
    } catch (err: any) {
      return { success: false, error: err.message }
    }
  },

  async getContactMessages(): Promise<ContactMessage[]> {
    if (!isSupabaseConfigured()) return []
    try {
      const { data } = await supabase.from('contact_messages').select('*').order('created_at', { ascending: false })
      return data || []
    } catch {
      return []
    }
  },

  async updateMessageStatus(id: string, status: ContactMessage['status']): Promise<void> {
    if (!isSupabaseConfigured()) return
    await supabase.from('contact_messages').update({ status }).eq('id', id)
  },

  async deleteContactMessage(id: string): Promise<void> {
    if (!isSupabaseConfigured()) return
    await supabase.from('contact_messages').delete().eq('id', id)
  },

  // AUDIT LOGS
  async getAuditLogs(): Promise<AuditLog[]> {
    if (!isSupabaseConfigured()) return []
    try {
      const { data } = await supabase.from('audit_logs').select('*').order('created_at', { ascending: false })
      return data || []
    } catch {
      return []
    }
  },

  // ANALYTICS
  async recordAnalyticsEvent(event_type: string, path: string): Promise<void> {
    if (!isSupabaseConfigured()) return
    try {
      await supabase.from('analytics_events').insert({ event_type, path })
    } catch {}
  },
}
