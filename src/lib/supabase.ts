import { createClient } from '@supabase/supabase-js'

const LOCAL_CRED_KEY = 'priyanshu_supabase_credentials'

export interface SupabaseCreds {
  url: string
  key: string
}

export function getSupabaseCredentials(): SupabaseCreds {
  try {
    const envUrl = import.meta.env.VITE_SUPABASE_URL || ''
    const envKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''
    if (envUrl && envKey) {
      return { url: envUrl, key: envKey }
    }

    if (typeof localStorage !== 'undefined') {
      const saved = localStorage.getItem(LOCAL_CRED_KEY)
      if (saved) {
        const parsed = JSON.parse(saved)
        if (parsed.url && parsed.key) {
          return { url: parsed.url, key: parsed.key }
        }
      }
    }
  } catch (err) {
    console.error('Error reading Supabase credentials:', err)
  }
  return { url: '', key: '' }
}

export function saveSupabaseCredentials(url: string, key: string): void {
  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(LOCAL_CRED_KEY, JSON.stringify({ url, key }))
    }
  } catch (err) {
    console.error('Error saving Supabase credentials:', err)
  }
}

export function clearSupabaseCredentials(): void {
  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem(LOCAL_CRED_KEY)
    }
  } catch (err) {
    console.error('Error clearing Supabase credentials:', err)
  }
}

export function isSupabaseConfigured(): boolean {
  const { url, key } = getSupabaseCredentials()
  return Boolean(url && key)
}

export function getSupabaseClient() {
  const { url, key } = getSupabaseCredentials()
  if (url && key) {
    return createClient(url, key)
  }
  return null
}

export const supabase = getSupabaseClient()
