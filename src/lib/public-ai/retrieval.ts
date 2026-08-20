import { PUBLIC_KNOWLEDGE, ProjectMetadata, EducationMetadata } from './knowledgeLayer'

export interface RetrievedContext {
  profileBio?: string
  relevantProjects: ProjectMetadata[]
  relevantEducation: EducationMetadata[]
  relevantSkills: string[]
  websiteStack?: any
  publicContactMethods?: any
}

export function retrieveRelevantKnowledge(
  query: string,
  currentSection?: string
): RetrievedContext {
  const q = query.toLowerCase()
  const sec = (currentSection || '').toLowerCase()

  const result: RetrievedContext = {
    relevantProjects: [],
    relevantEducation: [],
    relevantSkills: [],
  }

  // Always include core profile bio
  result.profileBio = PUBLIC_KNOWLEDGE.profile.bio
  result.publicContactMethods = {
    email: PUBLIC_KNOWLEDGE.profile.contactEmail,
    linkedin: PUBLIC_KNOWLEDGE.profile.linkedin,
    github: PUBLIC_KNOWLEDGE.profile.github,
    contactForm: '#contact',
  }

  // 1. Projects Retrieval
  if (q.includes('project') || q.includes('chopati') || q.includes('app') || sec.includes('project')) {
    if (q.includes('chopati')) {
      result.relevantProjects = PUBLIC_KNOWLEDGE.projects.filter((p) => p.id.includes('chopati'))
    } else {
      result.relevantProjects = PUBLIC_KNOWLEDGE.projects
    }
  }

  // 2. Education Retrieval
  if (
    q.includes('education') ||
    q.includes('academic') ||
    q.includes('school') ||
    q.includes('nims') ||
    q.includes('resonance') ||
    sec.includes('education')
  ) {
    result.relevantEducation = PUBLIC_KNOWLEDGE.education
  }

  // 3. Skills Retrieval
  if (q.includes('skill') || q.includes('tech') || q.includes('creative') || sec.includes('skill')) {
    result.relevantSkills = [...PUBLIC_KNOWLEDGE.skills.tech, ...PUBLIC_KNOWLEDGE.skills.creative]
  }

  // 4. Website Stack Retrieval
  if (q.includes('website') || q.includes('stack') || q.includes('built with') || q.includes('how is this made')) {
    result.websiteStack = PUBLIC_KNOWLEDGE.websiteStack
  }

  return result
}
