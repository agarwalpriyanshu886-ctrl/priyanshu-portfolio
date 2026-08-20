import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  FaTimes,
  FaPaperPlane,
  FaMicrophone,
  FaVolumeUp,
  FaVolumeMute,
  FaArrowRight,
  FaExpandAlt,
  FaCompressAlt,
} from 'react-icons/fa'
import { PRIAIMessage, RobotState, RobotEmotion, PortfolioContext } from '../../lib/ai/aiTypes'
import { runPortfolioAgent } from '../../lib/ai/agentOrchestrator'
import { executeTool } from '../../lib/public-ai/toolRegistry'

export function ChatPanel({
  isOpen,
  onClose,
  context,
  onStateChange,
  onEmotionChange,
  isListening,
  toggleListening,
  isVoiceEnabled,
  toggleVoice,
  speak,
}: {
  isOpen: boolean
  onClose: () => void
  context: PortfolioContext
  onStateChange: (state: RobotState) => void
  onEmotionChange: (emotion: RobotEmotion) => void
  isListening: boolean
  toggleListening: () => void
  isVoiceEnabled: boolean
  toggleVoice: () => void
  speak: (text: string) => void
}) {
  const [messages, setMessages] = useState<PRIAIMessage[]>([
    {
      id: 'welcome',
      sender: 'pittu',
      text: `Hi! I'm **Pittu**, Priyanshu Agarwal's portfolio assistant. 🤖\n\nI can help you explore Priyanshu's **AI/ML & Full-Stack projects**, explain his **Academic Journey**, or navigate the portfolio website. What would you like to know?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      emotion: 'happy',
      suggestions: [
        'Who is Priyanshu?',
        'Tell me about Agarwals Chopati',
        'What is his Academic Journey?',
        'Show me his AI & Web skills',
      ],
    },
  ])
  const [input, setInput] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isProcessing])

  if (!isOpen) return null

  const handleSend = async (textToSend?: string) => {
    const query = textToSend || input
    if (!query.trim() || isProcessing) return

    const userMsg: PRIAIMessage = {
      id: String(Date.now()),
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }

    setMessages((prev) => [...prev, userMsg])
    if (!textToSend) setInput('')
    setIsProcessing(true)
    onStateChange('thinking')

    // Prepare multi-turn history
    const history = messages.map((m) => ({ sender: m.sender, text: m.text }))

    try {
      const response = await runPortfolioAgent(query, context, history)

      onEmotionChange(response.emotion)

      const botMsg: PRIAIMessage = {
        id: String(Date.now() + 1),
        sender: 'pittu',
        text: response.message,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        emotion: response.emotion,
        toolCall: response.toolCall,
        suggestions: response.suggestions,
      }

      setMessages((prev) => [...prev, botMsg])
      setIsProcessing(false)

      // Execute tool action if present
      if (response.toolCall) {
        executeTool(response.toolCall)
      }

      // Voice output if enabled
      if (isVoiceEnabled && response.message) {
        onStateChange('speaking')
        speak(response.message)
      } else {
        setTimeout(() => onStateChange('idle'), 800)
      }
    } catch {
      setIsProcessing(false)
      onStateChange('error')
      onEmotionChange('concerned')
      setMessages((prev) => [
        ...prev,
        {
          id: String(Date.now() + 1),
          sender: 'pittu',
          text: "I'm having trouble connecting to my response engine right now. Please try asking again in a moment.",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          emotion: 'concerned',
        },
      ])
      setTimeout(() => onStateChange('idle'), 1500)
    }
  }

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md">
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        style={{
          resize: 'both',
          overflow: 'hidden',
          minWidth: '340px',
          minHeight: '460px',
          maxWidth: '94vw',
          maxHeight: '94vh',
          width: isExpanded ? '92vw' : '680px',
          height: isExpanded ? '88vh' : '620px',
        }}
        className="bg-slate-900/95 border border-cyan-400/50 rounded-3xl shadow-[0_0_60px_rgba(34,211,238,0.35)] flex flex-col relative group transition-[width,height] duration-200"
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-white/10 bg-slate-950/80 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-slate-900 border border-cyan-400/50 overflow-hidden shrink-0 shadow-md">
              <img src="/robot-avatar.png" alt="Pittu AI 3D Robot" className="w-full h-full object-cover" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-white text-base">Pittu AI</h3>
                <span className="text-[10px] font-mono font-bold bg-cyan-400/20 text-cyan-300 border border-cyan-400/30 px-2 py-0.5 rounded-full">
                  v4.0 Resizable
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-mono flex items-center gap-1.5 mt-0.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" /> Active Context: {context.currentSection || 'Home'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Expand / Maximize Toggle */}
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              title={isExpanded ? 'Restore Size' : 'Maximize Window'}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/15 text-slate-400 hover:text-white border border-white/10 text-xs font-mono transition-all"
            >
              {isExpanded ? <FaCompressAlt /> : <FaExpandAlt />}
            </button>

            {/* Voice Toggle */}
            <button
              onClick={toggleVoice}
              title={isVoiceEnabled ? 'Mute Voice Output' : 'Enable Voice Output'}
              className={`p-2 rounded-xl border text-xs font-mono transition-all ${
                isVoiceEnabled
                  ? 'bg-cyan-400/20 text-cyan-300 border-cyan-400/40'
                  : 'bg-white/5 text-slate-400 border-white/10'
              }`}
            >
              {isVoiceEnabled ? <FaVolumeUp /> : <FaVolumeMute />}
            </button>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-white/5 hover:bg-white/15 text-slate-400 hover:text-white grid place-items-center transition-colors"
            >
              <FaTimes />
            </button>
          </div>
        </div>

        {/* Message Log */}
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
                {msg.sender === 'user' ? (
                  'U'
                ) : (
                  <img src="/robot-avatar.png" alt="Pittu AI" className="w-full h-full object-cover" />
                )}
              </div>

              <div className="space-y-2 max-w-[85%] sm:max-w-[75%]">
                <div
                  className={`p-4 rounded-2xl text-xs sm:text-sm leading-relaxed whitespace-pre-wrap ${
                    msg.sender === 'user'
                      ? 'bg-cyan-500 text-slate-950 font-medium rounded-tr-none'
                      : 'bg-slate-800/90 text-slate-100 border border-white/10 rounded-tl-none shadow-md'
                  }`}
                >
                  {msg.text}
                </div>

                {/* Tool Execution Feedback */}
                {msg.toolCall && (
                  <div className="inline-flex items-center gap-2 text-[11px] font-mono text-cyan-300 bg-cyan-400/10 border border-cyan-400/30 rounded-xl px-3 py-1.5">
                    <FaArrowRight className="text-[9px]" /> Action: {msg.toolCall.name}
                  </div>
                )}

                {/* Context-Aware Dynamic Suggestions */}
                {msg.suggestions && msg.suggestions.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-2">
                    {msg.suggestions.map((sug, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSend(sug)}
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

          {isProcessing && (
            <div className="flex items-center gap-2 text-xs font-mono text-cyan-400">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" /> Pittu is analyzing context...
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="p-3 sm:p-4 border-t border-white/10 bg-slate-950/80 flex items-center gap-3 shrink-0">
          {/* Speech Input */}
          <button
            type="button"
            onClick={toggleListening}
            title={isListening ? 'Stop Listening' : 'Speak via Microphone'}
            className={`w-11 h-11 rounded-xl border grid place-items-center text-sm transition-all ${
              isListening
                ? 'bg-rose-500 text-white border-rose-400 animate-pulse'
                : 'bg-white/5 text-slate-300 border-white/10 hover:border-cyan-400'
            }`}
          >
            <FaMicrophone className={isListening ? 'animate-bounce' : ''} />
          </button>

          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={isListening ? 'Listening via microphone...' : 'Ask Pittu about Priyanshu\'s skills, projects, education...'}
            className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs sm:text-sm text-white outline-none focus:border-cyan-400/50"
          />

          <button
            type="submit"
            disabled={!input.trim() || isProcessing}
            className="w-11 h-11 rounded-xl bg-gradient-to-r from-indigo-500 to-cyan-400 grid place-items-center text-slate-950 font-bold disabled:opacity-50 hover:scale-105 transition-all shrink-0"
          >
            <FaPaperPlane className="text-sm" />
          </button>
        </form>

        {/* Resizable Corner Grip Handle Indicator */}
        <div className="absolute bottom-1 right-1 pointer-events-none text-cyan-400/50 text-[10px] select-none font-mono">
          ◢
        </div>
      </motion.div>
    </div>
  )
}
