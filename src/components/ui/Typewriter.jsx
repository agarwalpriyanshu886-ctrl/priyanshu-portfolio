import { useEffect, useState } from 'react'

export default function Typewriter({ words, typingSpeed = 70, deletingSpeed = 40, pause = 1600 }) {
  const [wordIndex, setWordIndex] = useState(0)
  const [text, setText] = useState('')
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    const current = words[wordIndex % words.length]
    let timeout

    if (!deleting && text === current) {
      timeout = setTimeout(() => setDeleting(true), pause)
    } else if (deleting && text === '') {
      setDeleting(false)
      setWordIndex((i) => (i + 1) % words.length)
    } else {
      timeout = setTimeout(
        () => {
          setText(current.slice(0, text.length + (deleting ? -1 : 1)))
        },
        deleting ? deletingSpeed : typingSpeed,
      )
    }
    return () => clearTimeout(timeout)
  }, [text, deleting, wordIndex, words, typingSpeed, deletingSpeed, pause])

  return (
    <span>
      {text}
      <span className="inline-block w-[2px] h-[0.9em] align-middle bg-cyan-400 ml-1 animate-blink" />
    </span>
  )
}
