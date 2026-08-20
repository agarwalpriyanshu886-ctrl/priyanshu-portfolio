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
      <div className="fixed bottom-6 right-6 z-[9999] flex flex-col items-end pointer-events-auto">
        {/* Speech Bubble Badge */}
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.9 }}
            onClick={() => setIsOpen(true)}
            className="mb-3 bg-slate-900/95 border border-cyan-400/50 backdrop-blur-xl text-white text-xs font-mono font-bold px-4 py-2 rounded-2xl shadow-[0_0_25px_rgba(34,211,238,0.4)] cursor-pointer flex items-center gap-2.5 hover:border-cyan-300 hover:scale-105 transition-all group"
          >
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-400" />
            </span>
            <span>Ask Pittu AI 🤖</span>
            <FaStar className="text-cyan-400 text-xs group-hover:rotate-12 transition-transform" />
          </motion.div>
        </AnimatePresence>

        {/* 3D Robot Floating Canvas Button */}
        <motion.div
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          onClick={() => setIsOpen(true)}
          className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-slate-950/90 border-2 border-cyan-400/60 shadow-[0_0_40px_rgba(34,211,238,0.5)] cursor-pointer relative group overflow-hidden transition-all duration-300 hover:scale-110 hover:border-cyan-300 hover:shadow-[0_0_60px_rgba(34,211,238,0.8)]"
          title="Click to interact with Pittu 3D AI Robot Agent"
        >
          <RobotScene
            state={robotState}
            emotion={robotEmotion}
            onClick={() => setIsOpen(true)}
            className="w-full h-full"
          />
        </motion.div>
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
