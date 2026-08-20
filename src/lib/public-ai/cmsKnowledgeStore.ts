import { PUBLIC_KNOWLEDGE } from './knowledgeLayer'
import type { PublicKnowledgeBase } from './knowledgeLayer'

const STORAGE_KEY = 'priyanshu_portfolio_cms_v1'

export function getActiveKnowledge(): PublicKnowledgeBase {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      const parsed = JSON.parse(saved)
      return { ...PUBLIC_KNOWLEDGE, ...parsed }
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
  } catch (err) {
    console.error('Error saving CMS knowledge:', err)
  }
}

export function resetCMSKnowledgeToDefault(): void {
  try {
    localStorage.removeItem(STORAGE_KEY)
    window.location.reload()
  } catch (err) {
    console.error('Error resetting CMS knowledge:', err)
  }
}
