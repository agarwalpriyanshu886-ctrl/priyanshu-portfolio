export type AgentActionType =
  | 'SCROLL_TO'
  | 'OPEN_PROJECT'
  | 'OPEN_RESUME'
  | 'OPEN_CONTACT'
  | 'OPEN_URL'
  | 'TOGGLE_MODE'
  | 'NONE'

export interface AgentAction {
  type: AgentActionType
  target?: string
  payload?: any
}

const WHITELISTED_URLS = [
  'https://agarwalschopati.vercel.app',
  'https://github.com/agarwalpriyanshu886-ctrl',
  'https://www.instagram.com/priyanshu0.112',
  '/resumes/Priyanshu_Agarwal_Creative_Technologist_Resume.pdf',
]

export function executeAgentAction(action: AgentAction, onToggleMode?: (mode: 'developer' | 'creative') => void) {
  if (!action || action.type === 'NONE') return

  switch (action.type) {
    case 'SCROLL_TO':
      if (action.target) {
        const elem = document.querySelector(action.target)
        if (elem) {
          elem.scrollIntoView({ behavior: 'smooth' })
        }
      }
      break

    case 'OPEN_CONTACT':
      const contactElem = document.querySelector('#contact')
      if (contactElem) {
        contactElem.scrollIntoView({ behavior: 'smooth' })
      }
      break

    case 'OPEN_RESUME':
      window.open('/resumes/Priyanshu_Agarwal_Creative_Technologist_Resume.pdf', '_blank')
      break

    case 'OPEN_URL':
      if (action.target && WHITELISTED_URLS.some((url) => action.target?.startsWith(url))) {
        window.open(action.target, '_blank')
      }
      break

    case 'TOGGLE_MODE':
      if (onToggleMode && (action.target === 'developer' || action.target === 'creative')) {
        onToggleMode(action.target)
      }
      break

    default:
      break
  }
}
