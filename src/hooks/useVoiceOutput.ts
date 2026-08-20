import { useState, useEffect, useRef } from 'react'

export function useVoiceOutput(onSpeechStart?: () => void, onSpeechEnd?: () => void) {
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const synthRef = useRef<SpeechSynthesis | null>(null)

  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      synthRef.current = window.speechSynthesis
    }
  }, [])

  const speak = (text: string) => {
    if (!isVoiceEnabled || !synthRef.current) return

    // Cancel ongoing speech
    synthRef.current.cancel()

    // Clean markdown symbols for natural speech
    const cleanText = text
      .replace(/[*#_`~]/g, '')
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
      .slice(0, 300) // Keep voice summary concise

    const utterance = new SpeechSynthesisUtterance(cleanText)
    utterance.rate = 1.0
    utterance.pitch = 1.05

    utterance.onstart = () => {
      setIsSpeaking(true)
      if (onSpeechStart) onSpeechStart()
    }

    utterance.onend = () => {
      setIsSpeaking(false)
      if (onSpeechEnd) onSpeechEnd()
    }

    utterance.onerror = () => {
      setIsSpeaking(false)
      if (onSpeechEnd) onSpeechEnd()
    }

    synthRef.current.speak(utterance)
  }

  const stop = () => {
    if (synthRef.current) {
      synthRef.current.cancel()
      setIsSpeaking(false)
      if (onSpeechEnd) onSpeechEnd()
    }
  }

  const toggleVoice = () => {
    if (isVoiceEnabled) {
      stop()
      setIsVoiceEnabled(false)
    } else {
      setIsVoiceEnabled(true)
    }
  }

  return {
    isVoiceEnabled,
    isSpeaking,
    speak,
    stop,
    toggleVoice,
  }
}
