import { useState, useRef, useEffect, FormEvent } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FaTimes,
  FaPaperPlane,
  FaRobot,
  FaUser,
  FaSparkles,
  FaShieldAlt,
  FaExclamationTriangle,
  FaCheckCircle,
  FaSpinner,
  FaDownload,
  FaExternalLinkAlt,
} from 'react-icons/fa'
import { cmsService } from '../../lib/services/cmsService'

export interface ChatMessage {
  id: string
  sender: 'user' | 'bot'
  text: string
  timestamp: string
  isUrgentTrigger?: boolean
  suggestions?: string[]
}

const initialMessages: ChatMessage[] = [
  {
    id: 'welcome-1',
    sender: 'bot',
    text: "Hi! I'm **PA-Bot**, Priyanshu Agarwal's 3D AI Assistant. 🤖\n\nI can answer questions about Priyanshu's **AI/ML & Full-Stack skills**, **Education timeline**, **Agarwals Chopati project**, **Graphic Design & Video editing**, or help you get in touch!",
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    suggestions: [
      'Tell me about Priyanshu',
      'What are his AI/ML & Web skills?',
      'Tell me about Agarwals Chopati',
      'What is his Academic Journey?',
      'How can I hire or contact him?',
    ],
  },
]

// Strict System Safety Guardrails
const RESTRICTED_KEYWORDS = [
  'password',
  'api key',
  'api_key',
  'secret',
  'database key',
  'supabase key',
  'admin token',
  'private key',
  'env',
  '.env',
  'credentials',
  'token',
]

export default function AIChatbotModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages)
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [showUrgentForm, setShowUrgentForm] = useState(false)
  const [urgentMessage, setUrgentMessage] = useState('')
  const [urgentContact, setUrgentContact] = useState('')
  const [urgentStatus, setUrgentStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, isTyping])

  if (!isOpen) return null

  // Generate Intelligent Bot Responses
  const generateBotReply = (userQuery: string): { replyText: string; isUrgent: boolean; suggestions?: string[] } => {
    const q = userQuery.toLowerCase().trim()

    // 1. Guardrail Security Check
    if (RESTRICTED_KEYWORDS.some((kw) => q.includes(kw))) {
      return {
        replyText:
          '🔒 **Security Guardrail Triggered**:\n\nI am programmed to protect Priyanshu\'s privacy. I cannot share internal credentials, API keys, passwords, or system secrets.\n\nFeel free to ask about his **skills, projects, education, or professional experience**!',
        isUrgent: false,
      }
    }

    // 2. High Priority / Hiring / Contact Query
    if (
      q.includes('hire') ||
      q.includes('job') ||
      q.includes('freelance') ||
      q.includes('project') ||
      q.includes('work together') ||
      q.includes('contact') ||
      q.includes('email') ||
      q.includes('phone') ||
      q.includes('urgent')
    ) {
      return {
        replyText:
          "⚡ **High Priority Inquiry Detected!**\n\nPriyanshu is open for AI/ML engineering, Full-Stack web builds, graphic design, and video editing contracts.\n\n📧 **Email**: `agarwalpriyanshu@gmail.com`  \n📞 **Phone**: `+91 75684 41942`  \n\nWould you like me to send a **Direct High-Priority Alert** straight to Priyanshu right now?",
        isUrgent: true,
        suggestions: ['Send Direct Alert to Priyanshu', 'Download Resume', 'View Projects'],
      }
    }

    // 3. Agarwals Chopati Project
    if (q.includes('chopati') || q.includes('agarwal chopati') || q.includes('restaurant')) {
      return {
        replyText:
          "🍽️ **Agarwals Chopati Project Case Study**:\n\nA full-stack modern restaurant web application & mobile system built with React, Vite, Supabase, and Custom UI design.\n\n👉 **Live Web App**: [agarwalschopati.vercel.app](https://agarwalschopati.vercel.app)  \n⚡ **Code & Design**: Combines full-stack database backend with custom brand identity.",
        isUrgent: false,
        suggestions: ['View Code Projects', 'Show Creative Work', 'Download Resume'],
      }
    }

    // 4. Education & Academic Journey
    if (q.includes('education') || q.includes('school') || q.includes('resonance') || q.includes('nims') || q.includes('academic') || q.includes('college')) {
      return {
        replyText:
          "🎓 **Priyanshu's Academic Journey**:\n\n1. **NIMS University Jaipur** (2028–2029): M.Tech in AI & Machine Learning Research.\n2. **NIMS University Jaipur** (2024–2028): B.Tech in AI & Machine Learning.\n3. **Resonance Jaipur** (2022–2024): Intensive 2-year IIT-JEE & Science Stream Coaching.\n4. **Shree Vidhya Ashram International School** (2010–2024): Class 1st to 12th foundational schooling.\n\nCheck out the horizontal timeline in the Academic section!",
        isUrgent: false,
        suggestions: ['What are his skills?', 'Tell me about Agarwals Chopati'],
      }
    }

    // 5. Skills & Dual Identity
    if (q.includes('skill') || q.includes('creative') || q.includes('developer') || q.includes('ai') || q.includes('ml') || q.includes('design') || q.includes('video')) {
      return {
        replyText:
          "⚡ **Dual Identity Skills**:\n\n💻 **Tech & Coding**: Python, React, Vite, Supabase, Node.js, AI/ML, Neural Networks, TensorFlow/PyTorch, PostgreSQL, Android (Kotlin).\n\n✦ **Creative Studio**: Graphic Design, Adobe Photoshop, Illustrator, Premiere Pro, After Effects, DaVinci Resolve, Motion Graphics, Branding.",
        isUrgent: false,
        suggestions: ['Tell me about Agarwals Chopati', 'How can I hire him?'],
      }
    }

    // Default Fallback
    return {
      replyText:
        "I'm PA-Bot! Priyanshu is an **AI/ML Engineer, Full-Stack Developer, and Creative Designer**. \n\nYou can ask me about his **projects, skills, education journey**, or send him a direct message!",
      isUrgent: false,
      suggestions: ['Tell me about Priyanshu', 'View Projects', 'How to contact?'],
    }
  }

  const handleSend = (textToSend?: string) => {
    const query = textToSend || input
    if (!query.trim()) return

    const userMsg: ChatMessage = {
      id: String(Date.now()),
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }

    setMessages((prev) => [...prev, userMsg])
    if (!textToSend) setInput('')
    setIsTyping(true)

    setTimeout(() => {
      const botResponse = generateBotReply(query)
      const botMsg: ChatMessage = {
        id: String(Date.now() + 1),
        sender: 'bot',
        text: botResponse.replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isUrgentTrigger: botResponse.isUrgent,
        suggestions: botResponse.suggestions,
      }

      setMessages((prev) => [...prev, botMsg])
      setIsTyping(false)
    }, 700)
  }

  const handleSendUrgentAlert = async (e: FormEvent) => {
    e.preventDefault()
    if (!urgentMessage.trim() || !urgentContact.trim()) return
    setUrgentStatus('loading')

    const res = await cmsService.submitContactMessage({
      sender_name: 'Portfolio AI Visitor',
      sender_email: urgentContact,
      subject: '⚡ HIGH-PRIORITY AI AGENT ALERT',
      message: `[URGENT INQUIRY FROM PORTFOLIO BOT]\nContact: ${urgentContact}\nMessage: ${urgentMessage}`,
    })

    if (res.success) {
      setUrgentStatus('success')
      setTimeout(() => {
        setShowUrgentForm(false)
        setUrgentStatus('idle')
        setUrgentMessage('')
        setUrgentContact('')
        setMessages((prev) => [
          ...prev,
          {
            id: String(Date.now()),
            sender: 'bot',
            text: '✅ **Direct Alert Sent!** Priyanshu has been notified of your message.',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          },
        ])
      }, 1500)
    } else {
      setUrgentStatus('error')
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md">
      {/* Container */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        className="w-full max-w-2xl bg-slate-900/95 border border-cyan-500/30 rounded-3xl shadow-[0_0_50px_rgba(34,211,238,0.25)] overflow-hidden flex flex-col h-[600px] max-h-[85vh] relative"
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-white/10 bg-slate-950/70 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-900 border border-cyan-400/40 overflow-hidden shrink-0 shadow-md">
              <img src="/robot-avatar.png" alt="PA-Bot AI" className="w-full h-full object-cover" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-white text-base">Priyanshu's AI Agent</h3>
                <span className="text-[10px] font-mono font-semibold bg-cyan-400/20 text-cyan-300 border border-cyan-400/30 px-2 py-0.5 rounded-full">
                  PA-Bot v3.0
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-mono flex items-center gap-1.5 mt-0.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" /> Online · Ask me anything
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/5 hover:bg-white/15 text-slate-400 hover:text-white grid place-items-center transition-colors"
          >
            <FaTimes />
          </button>
        </div>

        {/* Chat Messages Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}
            >
              <div
                className={`w-8 h-8 rounded-full overflow-hidden shrink-0 ${
                  msg.sender === 'user'
                    ? 'bg-cyan-500 text-slate-950 font-bold grid place-items-center'
                    : 'bg-slate-900 border border-cyan-400/40'
                }`}
              >
                {msg.sender === 'user' ? <FaUser /> : <img src="/robot-avatar.png" alt="PA-Bot" className="w-full h-full object-cover" />}
              </div>

              <div className={`space-y-2 max-w-[85%] sm:max-w-[75%]`}>
                <div
                  className={`p-4 rounded-2xl text-xs sm:text-sm leading-relaxed whitespace-pre-wrap ${
                    msg.sender === 'user'
                      ? 'bg-cyan-500 text-slate-950 font-medium rounded-tr-none'
                      : 'bg-slate-800/90 text-slate-100 border border-white/10 rounded-tl-none shadow-md'
                  }`}
                >
                  {msg.text}
                </div>

                {/* Urgent Trigger Button */}
                {msg.isUrgentTrigger && (
                  <button
                    onClick={() => setShowUrgentForm(true)}
                    className="mt-2 inline-flex items-center gap-2 text-xs font-bold text-slate-950 bg-gradient-to-r from-amber-400 to-amber-300 rounded-xl px-4 py-2 shadow-lg shadow-amber-400/20 hover:scale-105 transition-all"
                  >
                    ⚡ Send Direct Urgent Message
                  </button>
                )}

                {/* Suggestions Pills */}
                {msg.suggestions && msg.suggestions.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-2">
                    {msg.suggestions.map((sug, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          if (sug === 'Send Direct Alert to Priyanshu') setShowUrgentForm(true)
                          else handleSend(sug)
                        }}
                        className="text-[11px] font-mono text-cyan-300 bg-cyan-400/10 hover:bg-cyan-400/20 border border-cyan-400/30 rounded-lg px-2.5 py-1 transition-all text-left"
                      >
                        {sug}
                      </button>
                    ))}
                  </div>
                )}

                <span className="text-[10px] text-slate-500 font-mono block text-right">
                  {msg.timestamp}
                </span>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex items-center gap-2 text-xs font-mono text-cyan-400">
              <FaRobot className="animate-spin text-base" /> PA-Bot is thinking...
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="p-3 sm:p-4 border-t border-white/10 bg-slate-950/80 flex items-center gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask PA-Bot about Priyanshu's skills, projects, or education..."
            className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs sm:text-sm text-white outline-none focus:border-cyan-400/50"
          />
          <button
            type="submit"
            disabled={!input.trim()}
            className="w-11 h-11 rounded-xl bg-gradient-to-r from-indigo-500 to-cyan-400 grid place-items-center text-slate-950 font-bold disabled:opacity-50 hover:scale-105 transition-all shrink-0"
          >
            <FaPaperPlane className="text-sm" />
          </button>
        </form>

        {/* URGENT MESSAGE DIRECT ALERT FORM MODAL */}
        {showUrgentForm && (
          <div className="absolute inset-0 z-20 bg-slate-950/95 backdrop-blur-md p-6 flex flex-col justify-center space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h4 className="text-base font-bold text-white flex items-center gap-2">
                ⚡ Direct High-Priority Message to Priyanshu
              </h4>
              <button onClick={() => setShowUrgentForm(false)} className="text-slate-400 hover:text-white">
                <FaTimes />
              </button>
            </div>

            {urgentStatus === 'success' && (
              <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
                <FaCheckCircle className="shrink-0 text-base" />
                <span>Urgent Message Sent! Priyanshu will reply shortly.</span>
              </div>
            )}

            <form onSubmit={handleSendUrgentAlert} className="space-y-3">
              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1">Your Email or Phone Number</label>
                <input
                  type="text"
                  required
                  value={urgentContact}
                  onChange={(e) => setUrgentContact(e.target.value)}
                  placeholder="e.g. yourname@gmail.com or +91..."
                  className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-2.5 text-xs text-white outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1">Project Inquiry / Urgent Question</label>
                <textarea
                  rows={3}
                  required
                  value={urgentMessage}
                  onChange={(e) => setUrgentMessage(e.target.value)}
                  placeholder="Write your urgent message or project request here..."
                  className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-2.5 text-xs text-white outline-none focus:border-cyan-400"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowUrgentForm(false)}
                  className="px-4 py-2 rounded-xl bg-white/5 text-xs text-slate-300 hover:bg-white/10"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={urgentStatus === 'loading'}
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-amber-400 to-amber-300 text-xs font-bold text-slate-950 shadow-lg shadow-amber-400/20"
                >
                  {urgentStatus === 'loading' ? 'Sending Alert...' : 'Send Alert Now'}
                </button>
              </div>
            </form>
          </div>
        )}
      </motion.div>
    </div>
  )
}
