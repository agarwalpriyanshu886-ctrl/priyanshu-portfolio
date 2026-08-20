import { AgentToolCall } from '../public-ai/toolRegistry'

export type AgentIntent =
  | 'PROFILE'
  | 'SKILLS'
  | 'PROJECT'
  | 'EDUCATION'
  | 'NAVIGATION'
  | 'CONTACT'
  | 'RESUME'
  | 'WEBSITE_STACK'
  | 'GENERAL'
  | 'RESTRICTED'

export type UserPersona =
  | 'BEGINNER'
  | 'INTERMEDIATE'
  | 'TECHNICAL'
  | 'RECRUITER'
  | 'CLIENT'
  | 'GENERAL_VISITOR'

export type ConfidenceLevel = 'VERIFIED' | 'INFERRED' | 'UNKNOWN' | 'RESTRICTED'

export type RobotState =
  | 'idle'
  | 'listening'
  | 'thinking'
  | 'speaking'
  | 'happy'
  | 'confused'
  | 'concerned'
  | 'error'

export type RobotEmotion =
  | 'neutral'
  | 'happy'
  | 'thinking'
  | 'curious'
  | 'excited'
  | 'concerned'
  | 'confused'

export interface PRIAIMessage {
  id: string
  sender: 'user' | 'pittu'
  text: string
  timestamp: string
  emotion?: RobotEmotion
  toolCall?: AgentToolCall
  suggestions?: string[]
}

export interface PRIAIResponse {
  message: string
  emotion: RobotEmotion
  confidence: ConfidenceLevel
  toolCall?: AgentToolCall
  suggestions?: string[]
}

export interface PortfolioContext {
  currentPage: string
  currentSection: string
  currentProjectId?: string
  mode: 'developer' | 'creative'
}
