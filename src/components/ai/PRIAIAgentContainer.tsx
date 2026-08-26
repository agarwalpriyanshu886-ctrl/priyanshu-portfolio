import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaStar } from 'react-icons/fa'
import { RobotScene } from './RobotScene'
import { ChatPanel } from './ChatPanel'
import { RobotState, RobotEmotion, PortfolioContext } from '../../lib/ai/aiTypes'
import { useVoiceInput } from '../../hooks/useVoiceInput'
import { useVoiceOutput } from '../../hooks/useVoiceOutput'
import { useDualMode } from '../../lib/mode/ModeContext'

export function PRIAIAgentContainer() {
  const { mode } = useDualMode()
  const [isOpen, setIsOpen] = useState(false)
  const [robotState, setRobotState] = useState<RobotState>('idle')
  const [robotEmotion, setRobotEmotion] = useState<RobotEmotion>('neutral')
  const [activeSection, setActiveSection] = useState('Home')

  // Context Awareness Scroll Observer
  useEffect(() => {
    const handleScroll = () => {
      const sections = ['home', 'about', 'skills', 'projects', 'education', 'portfolio', 'showreel', 'tools', 'contact']
      for (const sec of sections) {
        const elem = document.getElementById(sec)
        if (elem) {
          const rect = elem.getBoundingClientRect()
          if (rect.top <= 250 && rect.bottom >= 250) {
            setActiveSection(sec.charAt(0).toUpperCase() + sec.slice(1))
            break
          }
        }
      }
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Voice Hooks
  const { speak, stop: stopVoice, isVoiceEnabled, toggleVoice } = useVoiceOutput(
    () => setRobotState('speaking'),
    () => setRobotState('idle')
  )

  const { isListening, toggleListening } = useVoiceInput((transcript) => {
    setRobotState('thinking')
  })

  const portfolioContext: PortfolioContext = {
    currentPage: window.location.pathname,
    currentSection: activeSection,
    mode,
  }

  return (
    <>
      {/* FLOATING 3D ROBOT WIDGET */}
      <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-[9999] flex flex-col items-end pointer-events-auto">
        {/* Speech Bubble Badge */}
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.9 }}
            onClick={() => setIsOpen(true)}
            className="mb-2 bg-slate-900/90 border border-cyan-400/40 backdrop-blur-md text-white text-xs font-mono font-medium px-3 py-1.5 rounded-xl shadow-lg cursor-pointer hidden sm:flex items-center gap-2 hover:border-cyan-300 transition-all group"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
            </span>
            <span>Pittu AI 🤖</span>
            <FaStar className="text-cyan-400 text-[10px] group-hover:rotate-12 transition-transform" />
          </motion.div>
        </AnimatePresence>

        {/* 3D Robot Floating Canvas Button */}
        <motion.button
          type="button"
          aria-label="Toggle Pittu AI Assistant"
          animate={{ y: [0, -4, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          onClick={() => setIsOpen(true)}
          className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-slate-950/90 border border-cyan-400/40 shadow-xl cursor-pointer relative group overflow-hidden transition-all duration-300 hover:scale-105 hover:border-cyan-300"
          title="Click to interact with Pittu AI Robot Agent"
        >
          <RobotScene
            state={robotState}
            emotion={robotEmotion}
            onClick={() => setIsOpen(true)}
            className="w-full h-full"
          />
        </motion.button>
      </div>

      {/* CHAT PANEL MODAL */}
      <ChatPanel
        isOpen={isOpen}
        onClose={() => {
          setIsOpen(false)
          stopVoice()
          setRobotState('idle')
        }}
        context={portfolioContext}
        onStateChange={setRobotState}
        onEmotionChange={setRobotEmotion}
        isListening={isListening}
        toggleListening={toggleListening}
        isVoiceEnabled={isVoiceEnabled}
        toggleVoice={toggleVoice}
        speak={speak}
      />
    </>
  )
}
