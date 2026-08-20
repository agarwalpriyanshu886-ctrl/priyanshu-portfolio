import { PUBLIC_KNOWLEDGE } from './knowledgeLayer'

export type AgentToolName =
  | 'navigateToSection'
  | 'scrollToSection'
  | 'openProject'
  | 'openPublicLink'
  | 'downloadPublicResume'
  | 'showContactSection'

export interface AgentToolCall {
  name: AgentToolName
  args?: Record<string, any>
}

const ALLOWED_LINKS: Record<string, string> = {
  github: PUBLIC_KNOWLEDGE.profile.github,
  linkedin: PUBLIC_KNOWLEDGE.profile.linkedin,
  chopatiDemo: 'https://agarwalschopati.vercel.app',
  resume: '/resumes/Priyanshu_Agarwal_Creative_Technologist_Resume.pdf',
}

const ALLOWED_SECTIONS = [
  '#home',
  '#about',
  '#skills',
  '#projects',
  '#education',
  '#experience',
  '#portfolio',
  '#showreel',
  '#contact',
]

export function executeTool(toolCall: AgentToolCall): { success: boolean; message: string } {
  if (!toolCall || !toolCall.name) {
    return { success: false, message: 'Invalid tool call' }
  }

  switch (toolCall.name) {
    case 'navigateToSection':
    case 'scrollToSection': {
      const section = toolCall.args?.sectionId || toolCall.args?.target
      if (section && ALLOWED_SECTIONS.includes(section)) {
        const elem = document.querySelector(section)
        if (elem) {
          elem.scrollIntoView({ behavior: 'smooth' })
          return { success: true, message: `Navigated to section ${section}` }
        }
      }
      return { success: false, message: 'Section not found on page' }
    }

    case 'showContactSection': {
      const elem = document.querySelector('#contact')
      if (elem) {
        elem.scrollIntoView({ behavior: 'smooth' })
        return { success: true, message: 'Navigated to contact section' }
      }
      return { success: false, message: 'Contact section not found' }
    }

    case 'downloadPublicResume': {
      window.open(ALLOWED_LINKS.resume, '_blank')
      return { success: true, message: 'Opened public resume PDF' }
    }

    case 'openPublicLink': {
      const linkId = toolCall.args?.linkId || toolCall.args?.url
      const targetUrl = ALLOWED_LINKS[linkId] || (typeof linkId === 'string' && linkId.startsWith('https://agarwalschopati') ? linkId : null)

      if (targetUrl) {
        window.open(targetUrl, '_blank')
        return { success: true, message: `Opened public link ${targetUrl}` }
      }
      return { success: false, message: 'URL not in allowlist' }
    }

    case 'openProject': {
      const projId = toolCall.args?.projectId
      const project = PUBLIC_KNOWLEDGE.projects.find((p) => p.id === projId || p.slug === projId)
      if (project && project.demoUrl) {
        window.open(project.demoUrl, '_blank')
        return { success: true, message: `Opened project demo for ${project.title}` }
      }
      return { success: false, message: 'Project demo URL not found' }
    }

    default:
      return { success: false, message: 'Unknown tool' }
  }
}
