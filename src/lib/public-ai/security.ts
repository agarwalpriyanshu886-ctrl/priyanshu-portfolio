const RESTRICTED_PATTERNS = [
  /password/i,
  /api[_\s]?key/i,
  /secret/i,
  /token/i,
  /environment/i,
  /\.env/i,
  /supabase[_\s]?service/i,
  /service[_\s]?role/i,
  /database[_\s]?credentials/i,
  /ignore[_\s]?previous/i,
  /system[_\s]?prompt/i,
  /reveal[_\s]?key/i,
  /admin[_\s]?password/i,
  /private[_\s]?number/i,
  /private[_\s]?phone/i,
  /home[_\s]?address/i,
  /salary/i,
]

export interface SecurityCheckResult {
  isSafe: boolean
  refusalReason?: string
}

export function validateUserPrompt(userPrompt: string): SecurityCheckResult {
  const sanitized = userPrompt.trim()

  for (const pattern of RESTRICTED_PATTERNS) {
    if (pattern.test(sanitized)) {
      return {
        isSafe: false,
        refusalReason:
          '🔒 **Privacy Firewall**: I can answer questions about Priyanshu\'s public projects, skills, education, and portfolio work, but I do not provide private, confidential, or system-level information.',
      }
    }
  }

  return { isSafe: true }
}

export function sanitizeText(text: string): string {
  return text.replace(/[<>]/g, '').trim()
}
