import { useState, useEffect } from 'react'
import { PUBLIC_KNOWLEDGE } from './knowledgeLayer'
import type { PublicKnowledgeBase } from './knowledgeLayer'

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

export function saveActiveKnowledge(updated: PublicKnowledgeBase): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
    // Update live memory object
    Object.assign(PUBLIC_KNOWLEDGE, updated)

    // Broadcast live update event to current tab and window
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('cms_knowledge_updated', { detail: updated }))
    }
  } catch (err) {
    console.error('Error saving CMS knowledge:', err)
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
