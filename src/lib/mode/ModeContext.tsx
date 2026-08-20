import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { useSearchParams } from 'react-router-dom'
import { cmsService } from '../services/cmsService'

export type DualMode = 'developer' | 'creative'

interface ModeContextType {
  mode: DualMode
  setMode: (m: DualMode) => void
  toggleMode: () => void
  isTransitioning: boolean
  showIntro: boolean
  dismissIntro: () => void
}

const ModeContext = createContext<ModeContextType | undefined>(undefined)

export function ModeProvider({ children }: { children: ReactNode }) {
  const [searchParams, setSearchParams] = useSearchParams()
  const [mode, setModeState] = useState<DualMode>('developer')
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [showIntro, setShowIntro] = useState(false)

  useEffect(() => {
    // 1. Determine Initial Mode Priority: URL Param -> LocalStorage -> Default
    const urlMode = searchParams.get('mode')?.toLowerCase()
    const storedMode = localStorage.getItem('priyanshu_portfolio_mode')?.toLowerCase()

    let initialMode: DualMode = 'developer'
    if (urlMode === 'developer' || urlMode === 'creative') {
      initialMode = urlMode as DualMode
    } else if (storedMode === 'developer' || storedMode === 'creative') {
      initialMode = storedMode as DualMode
    }

    setModeState(initialMode)
    localStorage.setItem('priyanshu_portfolio_mode', initialMode)

    // 2. Check Intro Sequence Frequency Setting
    cmsService.getModeSettings().then((settings) => {
      if (settings.intro_mode === 'DISABLED') {
        setShowIntro(false)
      } else if (settings.intro_mode === 'ALWAYS') {
        setShowIntro(true)
      } else {
        // FIRST_VISIT
        const visited = localStorage.getItem('priyanshu_portfolio_visited')
        if (!visited) {
          setShowIntro(true)
          localStorage.setItem('priyanshu_portfolio_visited', 'true')
        }
      }
    })
  }, [])

  const setMode = (newMode: DualMode) => {
    if (newMode === mode || isTransitioning) return
    setIsTransitioning(true)

    // Update LocalStorage and URL search params cleanly
    localStorage.setItem('priyanshu_portfolio_mode', newMode)
    setSearchParams((prev) => {
      prev.set('mode', newMode)
      return prev
    })

    // Cinematic 3D Portal Transition timing (1000ms)
    setTimeout(() => {
      setModeState(newMode)
    }, 400)

    setTimeout(() => {
      setIsTransitioning(false)
    }, 1100)
  }

  const toggleMode = () => {
    setMode(mode === 'developer' ? 'creative' : 'developer')
  }

  const dismissIntro = () => {
    setShowIntro(false)
  }

  return (
    <ModeContext.Provider
      value={{
        mode,
        setMode,
        toggleMode,
        isTransitioning,
        showIntro,
        dismissIntro,
      }}
    >
      {children}
    </ModeContext.Provider>
  )
}

export function useDualMode() {
  const context = useContext(ModeContext)
  if (!context) {
    throw new Error('useDualMode must be used within a ModeProvider')
  }
  return context
}
