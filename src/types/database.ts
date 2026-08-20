export type ModeType = 'DEVELOPER' | 'CREATIVE' | 'HYBRID' | 'SHARED'

export interface Profile {
  id: string
  email: string
  full_name: string
  role: 'SUPER_ADMIN' | 'ADMIN' | 'EDITOR'
  avatar_url?: string
  created_at: string
}

export interface SiteSettings {
  id: string
  site_name: string
  owner_name: string
  site_title: string
  site_description: string
  email: string
  phone?: string
  location?: string
  github_username?: string
  maintenance_mode: boolean
  maintenance_message?: string
  footer_config?: FooterConfig
  appearance?: AppearanceConfig
  seo_title?: string
  seo_description?: string
  og_title?: string
  og_description?: string
  updated_at: string
}

export interface FooterConfig {
  copyrightText?: string
  tagline?: string
  showSocials?: boolean
}

export interface AppearanceConfig {
  theme?: string
  primaryColor?: string
  accentColor?: string
  glassEffect?: boolean
}

export interface HomepageSection {
  id: string
  section_key: string
  section_name: string
  mode: ModeType
  is_visible: boolean
  display_order: number
}

export interface AboutProfile {
  id: string
  mode: ModeType
  headline: string
  subheading?: string
  paragraphs: string[]
  passions: string[]
  avatar_url?: string
  is_published: boolean
  updated_at: string
}

export interface AboutData {
  id?: string
  headline: string
  subheading?: string
  paragraphs: string[]
  passions: string[]
  updated_at?: string
}

export interface SkillCategory {
  id: string
  name: string
  display_order: number
}

export interface Skill {
  id: string
  category_id?: string
  name: string
  icon?: string
  proficiency: number
  experience_level?: string
  mode: ModeType
  is_featured: boolean
  is_published: boolean
  display_order: number
}

export interface Project {
  id: string
  name: string
  slug: string
  category: string
  short_description: string
  full_description?: string
  thumbnail_url?: string
  github_url?: string
  live_demo_url?: string
  technologies: string[]
  mode: ModeType
  developer_highlights?: string[]
  creative_highlights?: string[]
  is_featured: boolean
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED'
  display_order: number
  created_at: string
}

export interface Showreel {
  id: string
  title: string
  category: string
  description?: string
  video_source: 'UPLOAD' | 'YOUTUBE' | 'VIMEO' | 'URL'
  video_url: string
  poster_image?: string
  is_featured: boolean
  is_published: boolean
  display_order: number
  created_at: string
}

export interface CreativeTool {
  id: string
  name: string
  category: string
  icon: string
  proficiency_level: number
  is_featured: boolean
  is_published: boolean
  display_order: number
  created_at: string
}

export interface ThreeDAsset {
  id: string
  name: string
  category: string
  file_url: string
  file_size: number
  preview_image?: string
  is_published: boolean
  created_at: string
}

export interface ThreeDScene {
  id: string
  name: string
  mode: ModeType
  section_key: string
  environment_preset: string
  light_intensity: number
  is_active: boolean
  created_at: string
}

export interface ThreeDSceneObject {
  id: string
  scene_id: string
  asset_id?: string
  position_x: number
  position_y: number
  position_z: number
  rotation_x: number
  rotation_y: number
  rotation_z: number
  scale_x: number
  scale_y: number
  scale_z: number
  animation_config?: Record<string, any>
  interaction_config?: Record<string, any>
  material_config?: Record<string, any>
  visibility: boolean
  display_order: number
}

export interface ModeSettings {
  id: string
  default_mode: ModeType
  enable_mode_persistence: boolean
  intro_mode: 'ALWAYS' | 'FIRST_VISIT' | 'DISABLED'
  transition_duration_ms: number
}

export interface Experience {
  id: string
  company: string
  position: string
  location?: string
  employment_type?: string
  start_date: string
  end_date: string
  is_current: boolean
  description?: string
  is_published: boolean
  display_order: number
}

export interface Education {
  id: string
  degree: string
  institution: string
  field: string
  location?: string
  start_date: string
  end_date: string
  current_status?: string
  grade_cgpa?: string
  description?: string
  is_published: boolean
  display_order: number
}

export interface Certification {
  id: string
  title: string
  organization: string
  issue_date: string
  credential_url?: string
  is_published: boolean
}

export interface Service {
  id: string
  title: string
  description: string
  icon?: string
  mode: ModeType
  is_published: boolean
  display_order: number
}

export interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt?: string
  content: string
  cover_image?: string
  author_name: string
  category_name: string
  reading_time_minutes: number
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED'
  is_featured: boolean
  created_at: string
}

export interface NavigationItem {
  id: string
  label: string
  url: string
  mode: ModeType
  is_visible: boolean
  display_order: number
}

export interface SocialLink {
  id: string
  platform: string
  url: string
  icon?: string
  is_visible: boolean
}

export interface ContactMessage {
  id: string
  sender_name: string
  sender_email: string
  subject: string
  message: string
  status: 'NEW' | 'READ' | 'REPLIED' | 'ARCHIVED' | 'SPAM'
  created_at: string
}

export interface AuditLog {
  id: string
  admin_email: string
  action: string
  module: string
  record_id?: string
  metadata?: Record<string, any>
  created_at: string
}
