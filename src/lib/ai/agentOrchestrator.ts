import { PRIAIResponse, PortfolioContext, AgentIntent, UserPersona } from './aiTypes'
import { PUBLIC_KNOWLEDGE } from '../public-ai/knowledgeLayer'
import { validateUserPrompt } from '../public-ai/security'
import { retrieveRelevantKnowledge } from '../public-ai/retrieval'
import { answerGeneralQuestion } from './generalAI'
import { executeTool } from '../public-ai/toolRegistry'

export async function runPortfolioAgent(
  userQuery: string,
  context: PortfolioContext,
  history: Array<{ sender: string; text: string }> = []
): Promise<PRIAIResponse> {
  const q = userQuery.trim().toLowerCase()
  const turnCount = history.length

  // 1. PRIVACY FIREWALL & SECURITY CHECK
  const sec = validateUserPrompt(userQuery)
  if (!sec.isSafe) {
    return {
      message: sec.refusalReason || 'I can help with Priyanshu\'s public portfolio, but I cannot provide private, confidential, or system-level information.',
      emotion: 'concerned',
      confidence: 'RESTRICTED',
    }
  }

  // 2. UNVERIFIED PERSONAL FACTS CHECK (e.g. favorite actor, salary, home address)
  if (
    q.includes('favorite actor') ||
    q.includes('favorite movie') ||
    q.includes('girlfriend') ||
    q.includes('home address') ||
    q.includes('salary') ||
    q.includes('private phone')
  ) {
    return {
      message: "I don't have verified public information about that.",
      emotion: 'neutral',
      confidence: 'UNKNOWN',
    }
  }

  // 3. MULTI-TURN CONVERSATION RESOLUTION
  let resolvedQuery = q
  if (turnCount > 0) {
    const lastUserMsg = history.filter((m) => m.sender === 'user').slice(-1)[0]?.text.toLowerCase() || ''
    const lastBotMsg = history.filter((m) => m.sender === 'pittu').slice(-1)[0]?.text.toLowerCase() || ''

    if ((q.includes('which one') || q.includes('the second') || q.includes('explain that')) && (lastBotMsg.includes('python') || lastUserMsg.includes('technolog'))) {
      if (q.includes('best for ai') || q.includes('ai')) {
        return {
          message: 'Among the technologies Priyanshu uses, **Python** is the primary choice for Artificial Intelligence and Machine Learning due to its powerful ecosystem of libraries like PyTorch, TensorFlow, NumPy, and Scikit-Learn.',
          emotion: 'thinking',
          confidence: 'VERIFIED',
          suggestions: ['Show me his AI projects', 'What are his other skills?'],
        }
      }
    }

    if ((q.includes('that project') || q.includes('this one') || q.includes('explain it')) && lastBotMsg.includes('chopati')) {
      resolvedQuery = 'tell me about agarwals chopati'
    }
  }

  // 4. ROUTE CLASSIFICATION: PORTFOLIO vs HYBRID vs GENERAL
  const isExplicitPortfolioQuery =
    resolvedQuery.includes('priyanshu') ||
    resolvedQuery.includes('chopati') ||
    resolvedQuery.includes('resonance') ||
    resolvedQuery.includes('nims') ||
    resolvedQuery.includes('school') ||
    resolvedQuery.includes('resume') ||
    resolvedQuery.includes('portfolio') ||
    resolvedQuery.includes('academic') ||
    resolvedQuery.includes('his skill') ||
    resolvedQuery.includes('his project') ||
    resolvedQuery.includes('contact')

  const isGeneralTechQuery =
    resolvedQuery.includes('chatgpt') ||
    resolvedQuery.includes('chat gpt') ||
    resolvedQuery.includes('python') ||
    resolvedQuery.includes('react vs angular') ||
    resolvedQuery.includes('machine learning') ||
    resolvedQuery.includes('capital of india')

  // HYBRID ROUTE ("What is ChatGPT and has Priyanshu built an AI project?")
  if (isExplicitPortfolioQuery && isGeneralTechQuery) {
    const gen = answerGeneralQuestion(resolvedQuery)
    const proj = PUBLIC_KNOWLEDGE.projects[0]
    return {
      message: `${gen.text}\n\nIn Priyanshu's portfolio, he applies AI/ML concepts and full-stack development. For example, **${proj.title}** is a live hybrid application ([agarwalschopati.vercel.app](${proj.demoUrl})).`,
      emotion: 'happy',
      confidence: 'VERIFIED',
      suggestions: ['Tell me about Agarwals Chopati', 'What is ChatGPT used for?'],
    }
  }

  // GENERAL AI ROUTE ("What is ChatGPT?", "Python kya hota hai?")
  if (isGeneralTechQuery && !isExplicitPortfolioQuery) {
    const gen = answerGeneralQuestion(resolvedQuery)
    return {
      message: gen.text,
      emotion: 'thinking',
      confidence: 'VERIFIED',
      suggestions: gen.suggestions,
    }
  }

  // PORTFOLIO ROUTE ("Who is Priyanshu?", "Academic Journey", "Agarwals Chopati")
  if (isExplicitPortfolioQuery) {
    const retrieved = retrieveRelevantKnowledge(resolvedQuery, context.currentSection)

    if (resolvedQuery.includes('who is') || resolvedQuery.includes('bio')) {
      return {
        message: `${PUBLIC_KNOWLEDGE.profile.bio}\n\nHe works across AI/ML engineering, full-stack web development, and creative visual media (graphic design & video editing).`,
        emotion: 'happy',
        confidence: 'VERIFIED',
        suggestions: ['What are his skills?', 'Show me his featured projects', 'Academic Journey'],
      }
    }

    if (resolvedQuery.includes('skill') || resolvedQuery.includes('stack')) {
      const techList = PUBLIC_KNOWLEDGE.skills.tech.slice(0, 6).join(', ')
      const creativeList = PUBLIC_KNOWLEDGE.skills.creative.slice(0, 6).join(', ')
      return {
        message: `Priyanshu works across two core areas:\n\n💻 **Tech & Engineering**: ${techList}\n\n✦ **Creative Studio**: ${creativeList}`,
        emotion: 'curious',
        confidence: 'VERIFIED',
        toolCall: { name: 'scrollToSection', args: { sectionId: '#skills' } },
        suggestions: ['Which technology is best for AI?', 'Tell me about Agarwals Chopati'],
      }
    }

    if (resolvedQuery.includes('chopati') || resolvedQuery.includes('restaurant')) {
      const proj = retrieved.relevantProjects[0] || PUBLIC_KNOWLEDGE.projects[0]
      return {
        message: `**${proj.title}**:\n${proj.shortDescription}\n\n• **Stack**: ${proj.techStack.join(', ')}\n• **Live App**: [agarwalschopati.vercel.app](${proj.demoUrl})`,
        emotion: 'happy',
        confidence: 'VERIFIED',
        toolCall: { name: 'openPublicLink', args: { linkId: 'chopatiDemo' } },
        suggestions: ['Explain the architecture technically', 'What other projects does he have?'],
      }
    }

    if (resolvedQuery.includes('internship') || resolvedQuery.includes('jaldiride') || resolvedQuery.includes('work experience')) {
      const exp = PUBLIC_KNOWLEDGE.experience[0]
      return {
        message: `💼 **Work Experience & Internship**:\n\n• **Role**: ${exp.role}\n• **Company**: ${exp.company}\n• **Duration**: ${exp.duration} (${exp.startDate} – ${exp.endDate})\n\n${exp.points.map((p) => `• ${p}`).join('\n')}`,
        emotion: 'happy',
        confidence: 'VERIFIED',
        suggestions: ['What are his main skills?', 'Academic Journey'],
      }
    }

    if (resolvedQuery.includes('sgpa') || resolvedQuery.includes('marks') || resolvedQuery.includes('grade') || resolvedQuery.includes('percentile')) {
      return {
        message: `🎓 **Academic Performance**:\n\nPriyanshu earned an **8.86 SGPA** in Semester 1 of his integrated B.Tech + M.Tech in Artificial Intelligence & Machine Learning at NIMS University Jaipur.`,
        emotion: 'happy',
        confidence: 'VERIFIED',
        suggestions: ['Academic Journey', 'What subjects has he studied?'],
      }
    }

    if (resolvedQuery.includes('subject') || resolvedQuery.includes('coursework') || resolvedQuery.includes('dbms') || resolvedQuery.includes('java')) {
      return {
        message: `📚 **Engineering & CS Coursework**:\n\n• **Languages**: C Programming (Tokens, Structures, Unions), Java, Python\n• **Databases**: DBMS & SQL (Relational Schemas, Triggers, Views)\n• **Core CS**: Data Structures & Algorithms, PPS, BEE (Basic Electrical Engineering)`,
        emotion: 'thinking',
        confidence: 'VERIFIED',
        suggestions: ['What are his main skills?', 'Show me his featured projects'],
      }
    }

    if (resolvedQuery.includes('education') || resolvedQuery.includes('academic') || resolvedQuery.includes('school') || resolvedQuery.includes('nims') || resolvedQuery.includes('resonance')) {
      return {
        message: `🎓 **Priyanshu's Academic Journey**:\n\n1. **NIMS University Jaipur** (2028–2029): M.Tech in AI & Machine Learning Research.\n2. **NIMS University Jaipur** (2024–2028): B.Tech in AI & Machine Learning.\n3. **Resonance Jaipur** (2022–2024): 2-year IIT-JEE Foundation & Science Stream Coaching (Tonk Road).\n4. **Shree Vidhya Ashram International School** (2010–2024): Class 1st to 12th foundational schooling (Chimanpura, Shahpura).`,
        emotion: 'happy',
        confidence: 'VERIFIED',
        toolCall: { name: 'scrollToSection', args: { sectionId: '#education' } },
        suggestions: ['What are his skills?', 'Tell me about Agarwals Chopati'],
      }
    }

    if (resolvedQuery.includes('contact') || resolvedQuery.includes('email')) {
      return {
        message: `You can reach Priyanshu through his public contact options:\n\n📧 **Email**: \`${PUBLIC_KNOWLEDGE.profile.contactEmail}\`\n💻 **GitHub**: [github.com/agarwalpriyanshu886-ctrl](${PUBLIC_KNOWLEDGE.profile.github})\n📷 **Instagram**: [@priyanshu0.112](${PUBLIC_KNOWLEDGE.profile.instagram})\n\nOr scroll down to submit a direct message in the Contact section!`,
        emotion: 'neutral',
        confidence: 'VERIFIED',
        toolCall: { name: 'showContactSection' },
        suggestions: ['Download Resume', 'Who is Priyanshu?'],
      }
    }

    if (resolvedQuery.includes('resume')) {
      return {
        message: `Opening Priyanshu's official Creative Technologist Resume PDF.`,
        emotion: 'happy',
        confidence: 'VERIFIED',
        toolCall: { name: 'downloadPublicResume' },
      }
    }
  }

  // DYNAMIC GENERAL AI FALLBACK FOR NON-PORTFOLIO GENERAL QUESTIONS
  const genFallback = answerGeneralQuestion(userQuery)
  return {
    message: genFallback.text,
    emotion: 'neutral',
    confidence: 'VERIFIED',
    suggestions: genFallback.suggestions,
  }
}
