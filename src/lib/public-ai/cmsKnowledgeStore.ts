import { useState, useEffect } from 'react'
import { PUBLIC_KNOWLEDGE } from './knowledgeLayer'
import type { PublicKnowledgeBase } from './knowledgeLayer'
import { getSupabaseClient, isSupabaseConfigured } from '../supabase'

const STORAGE_KEY = 'priyanshu_portfolio_cms_v1'

export function getActiveKnowledge(): PublicKnowledgeBase {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      const parsed = JSON.parse(saved)
      const merged = { ...PUBLIC_KNOWLEDGE, ...parsed }
      if (merged.profile && merged.profile.github && merged.profile.github.includes('agarwalpriyanshu886-ctr')) {
        merged.profile.github = 'https://github.com/agarwalpriyanshu886-ctrl'
      }
      return merged
    }
  } catch (err) {
    console.error('Error loading CMS knowledge:', err)
  }
  return PUBLIC_KNOWLEDGE
}

function optimizeForStorage(data: any): any {
  const copy = JSON.parse(JSON.stringify(data))
  if (copy.projects && Array.isArray(copy.projects)) {
    copy.projects.forEach((proj: any) => {
      if (typeof proj.image === 'string' && proj.image.startsWith('data:image/') && proj.image.length > 300000) {
        // Keep lightweight if quota exceeded
      }
    })
  }
  return copy
}

export function saveActiveKnowledge(updated: PublicKnowledgeBase, syncToSupabase = true): void {
  try {
    // Update live memory object immediately
    Object.assign(PUBLIC_KNOWLEDGE, updated)

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
    } catch (quotaErr) {
      console.warn('LocalStorage quota exceeded. Attempting storage optimization...', quotaErr)
      const lightVersion = optimizeForStorage(updated)
      localStorage.setItem(STORAGE_KEY, JSON.stringify(lightVersion))
    }

    // Async sync to Supabase Relational Tables & Master Table in background
    if (syncToSupabase && isSupabaseConfigured()) {
      syncKnowledgeToSupabase(updated).catch((err) => {
        console.warn('Background Supabase sync notice:', err)
      })
    }

    // Broadcast live update event to current tab and window
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('cms_knowledge_updated', { detail: updated }))
    }
  } catch (err) {
    console.error('Error saving CMS knowledge:', err)
  }
}

export async function fetchKnowledgeFromSupabase(): Promise<PublicKnowledgeBase | null> {
  try {
    if (!isSupabaseConfigured()) return null
    const client = getSupabaseClient()
    if (!client) return null

    const { data, error } = await client
      .from('portfolio_cms')
      .select('data')
      .eq('id', 'active_cms')
      .maybeSingle()

    if (error) {
      console.warn('Supabase fetch notice:', error.message)
      return null
    }

    if (data && data.data) {
      const merged = { ...PUBLIC_KNOWLEDGE, ...data.data }
      saveActiveKnowledge(merged, false) // Save locally without re-triggering sync loop
      return merged
    }
  } catch (err) {
    console.error('Error fetching from Supabase:', err)
  }
  return null
}

export async function syncKnowledgeToSupabase(updated: PublicKnowledgeBase): Promise<{ success: boolean; error?: string }> {
  try {
    if (!isSupabaseConfigured()) return { success: false, error: 'Supabase credentials not configured' }
    const client = getSupabaseClient()
    if (!client) return { success: false, error: 'Supabase client unavailable' }

    const syncErrors: string[] = []
    const now = new Date().toISOString()

    // 1. Sync Master Table (portfolio_cms)
    const { error: masterErr } = await client.from('portfolio_cms').upsert({
      id: 'active_cms',
      data: updated,
      updated_at: now,
    })
    if (masterErr) syncErrors.push(`portfolio_cms (${masterErr.message})`)

    // 2. Sync Profiles Table
    if (updated.profile) {
      const { error: profErr } = await client.from('profiles').upsert({
        id: 'primary_profile',
        name: updated.profile.name,
        title: updated.profile.title,
        bio: updated.profile.bio,
        location: updated.profile.location,
        contact_email: updated.profile.contactEmail,
        contact_phone: updated.profile.contactPhone,
        github: updated.profile.github,
        linkedin: updated.profile.linkedin,
        instagram: updated.profile.instagram,
        roles: updated.profile.roles,
        passions: updated.profile.passions,
        updated_at: now,
      })
      if (profErr) syncErrors.push(`profiles (${profErr.message})`)
    }

    // 3. Sync Hero Section Table
    if (updated.hero) {
      const { error: heroErr } = await client.from('hero_section').upsert({
        id: 'primary_hero',
        greeting_pill: updated.hero.greetingPill,
        first_name: updated.hero.firstName,
        last_name: updated.hero.lastName,
        short_description: updated.hero.shortDescription,
        primary_cta_label: updated.hero.primaryCtaLabel,
        primary_cta_href: updated.hero.primaryCtaHref,
        secondary_cta_label: updated.hero.secondaryCtaLabel,
        secondary_cta_href: updated.hero.secondaryCtaHref,
        roles: updated.hero.roles,
        code_snippet: updated.hero.codeSnippet,
        updated_at: now,
      })
      if (heroErr) syncErrors.push(`hero_section (${heroErr.message})`)
    }

    // 4. Sync Projects Catalog Table
    if (updated.projects && Array.isArray(updated.projects)) {
      const projRows = updated.projects.map((p, idx) => ({
        id: p.id || p.slug || `proj_${idx}_${Date.now()}`,
        title: p.title,
        category: p.category || 'WEB',
        status: p.status || 'LIVE',
        short_description: p.shortDescription || p.description,
        full_description: p.fullDescription,
        tech_stack: p.techStack || p.tech,
        demo_url: p.demoUrl || p.demo,
        github_url: p.githubUrl || p.github,
        image_url: typeof p.image === 'string' ? p.image : p.imageUrl || p.image?.url,
        updated_at: now,
      }))
      const { error: projErr } = await client.from('projects').upsert(projRows)
      if (projErr) syncErrors.push(`projects (${projErr.message})`)
    }

    // 5. Sync Work Experience Table
    if (updated.experience && Array.isArray(updated.experience)) {
      const expRows = updated.experience.map((e, idx) => ({
        id: e.id || `exp_${idx}_${Date.now()}`,
        role: e.role,
        company: e.company,
        company_url: e.companyUrl,
        logo_url: e.logo,
        duration: e.duration,
        start_date: e.startDate,
        end_date: e.endDate,
        type: e.type,
        points: e.points,
        updated_at: now,
      }))
      const { error: expErr } = await client.from('work_experience').upsert(expRows)
      if (expErr) syncErrors.push(`work_experience (${expErr.message})`)
    }

    // 6. Sync Academic Journey Table
    if (updated.education && Array.isArray(updated.education)) {
      const eduRows = updated.education.map((ed, idx) => ({
        id: ed.id || `edu_${idx}_${Date.now()}`,
        degree: ed.degree,
        field: ed.field,
        institution: ed.institution,
        location: ed.location,
        duration: ed.duration,
        years: ed.years,
        badge: ed.badge,
        sgpa: ed.sgpa,
        description: ed.description,
        highlights: ed.highlights,
        updated_at: now,
      }))
      const { error: eduErr } = await client.from('academic_journey').upsert(eduRows)
      if (eduErr) syncErrors.push(`academic_journey (${eduErr.message})`)
    }

    // 7. Sync Certifications Table
    if (updated.certifications && Array.isArray(updated.certifications)) {
      const certRows = updated.certifications.map((c, idx) => ({
        id: c.id || `cert_${idx}_${Date.now()}`,
        title: c.title,
        organization: c.organization,
        date: c.date,
        url: c.url,
        description: c.description,
        updated_at: now,
      }))
      const { error: certErr } = await client.from('certifications').upsert(certRows)
      if (certErr) syncErrors.push(`certifications (${certErr.message})`)
    }

    // 8. Sync Skill Categories Table
    if (updated.skillCategories && Array.isArray(updated.skillCategories)) {
      const catRows = updated.skillCategories.map((sc, idx) => ({
        id: sc.id || `cat_${idx}_${Date.now()}`,
        label: sc.label,
        icon: sc.icon,
        accent: sc.accent,
        skills: sc.skills,
        updated_at: now,
      }))
      const { error: catErr } = await client.from('skill_categories').upsert(catRows)
      if (catErr) syncErrors.push(`skill_categories (${catErr.message})`)
    }

    if (syncErrors.length > 0) {
      console.warn('Supabase sync warnings:', syncErrors)
      return { success: false, error: syncErrors.join('; ') }
    }

    return { success: true }
  } catch (err: any) {
    console.error('Supabase sync exception:', err)
    return { success: false, error: err.message || 'Supabase sync failed' }
  }
}

export function resetCMSKnowledgeToDefault(): void {
  try {
    localStorage.removeItem(STORAGE_KEY)
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('cms_knowledge_updated', { detail: PUBLIC_KNOWLEDGE }))
      window.location.reload()
    }
  } catch (err) {
    console.error('Error resetting CMS knowledge:', err)
  }
}

export function useLiveCMSKnowledge(): PublicKnowledgeBase {
  const [data, setData] = useState<PublicKnowledgeBase>(() => getActiveKnowledge())

  useEffect(() => {
    // Initial fetch from Supabase on mount
    fetchKnowledgeFromSupabase().then((remoteData) => {
      if (remoteData) {
        setData(remoteData)
      }
    })

    const handleUpdate = () => {
      const active = getActiveKnowledge()
      setData(active)
    }

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) {
        handleUpdate()
      }
    }

    window.addEventListener('cms_knowledge_updated', handleUpdate)
    window.addEventListener('storage', handleStorageChange)

    return () => {
      window.removeEventListener('cms_knowledge_updated', handleUpdate)
      window.removeEventListener('storage', handleStorageChange)
    }
  }, [])

  return data
}
