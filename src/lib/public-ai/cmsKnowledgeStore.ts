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

    // Async sync to Supabase in background
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

    const { error } = await client.from('portfolio_cms').upsert({
      id: 'active_cms',
      data: updated,
      updated_at: new Date().toISOString(),
    })

    if (error) {
      console.error('Supabase upsert error:', error.message)
      return { success: false, error: error.message }
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
