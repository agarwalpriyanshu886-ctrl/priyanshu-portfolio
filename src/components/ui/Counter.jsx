import { useEffect, useState } from 'react'

export default function Counter({ value, suffix = '', duration = 2000 }) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    let start = 0
    const end = parseInt(value, 10)
    if (isNaN(end) || start === end) return

    const totalMiliseconds = duration
    const incrementTime = Math.max((totalMiliseconds / end) * 0.8, 10)
    const timer = setInterval(() => {
      start += 1
      setCount(start)
      if (start >= end) clearInterval(timer)
    }, incrementTime)

    return () => clearInterval(timer)
  }, [value, duration])

  return (
    <span>
      {count}
      {suffix}
    </span>
  )
}
