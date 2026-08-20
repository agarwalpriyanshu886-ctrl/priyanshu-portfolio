import { useState, useEffect, useRef } from 'react'

export function useVoiceInput(onTranscript: (text: string) => void) {
  const [isListening, setIsListening] = useState(false)
  const [isSupported, setIsSupported] = useState(false)
  const [transcript, setTranscript] = useState('')
  const recognitionRef = useRef<any>(null)

  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition

    if (SpeechRecognition) {
      setIsSupported(true)
      const instance = new SpeechRecognition()
      instance.continuous = false
      instance.interimResults = true
      instance.lang = 'en-US'

      instance.onresult = (event: any) => {
        let currentTranscript = ''
        for (let i = event.resultIndex; i < event.results.length; i++) {
          currentTranscript += event.results[i][0].transcript
        }
        setTranscript(currentTranscript)
        if (event.results[0].isFinal) {
          onTranscript(currentTranscript)
          setIsListening(false)
        }
      }

      instance.onerror = () => {
        setIsListening(false)
      }

      instance.onend = () => {
        setIsListening(false)
      }

      recognitionRef.current = instance
    } else {
      setIsSupported(false)
    }
  }, [onTranscript])

  const startListening = () => {
    if (recognitionRef.current && !isListening) {
      setTranscript('')
      setIsListening(true)
      try {
        recognitionRef.current.start()
      } catch {
        setIsListening(false)
      }
    }
  }

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop()
      setIsListening(false)
    }
  }

  const toggleListening = () => {
    if (isListening) stopListening()
    else startListening()
  }

  return {
    isListening,
    isSupported,
    transcript,
    startListening,
    stopListening,
    toggleListening,
  }
}
