'use client'

import { useEffect, useState } from 'react'

/* One line rolls up and out while the next rolls in from below, the way a
   split-flap does. The box is sized to the tallest option so the lines under
   it never move. */

export default function RollingLine({
  lines,
  className = '',
  hold = 2600,
}: {
  lines: { mark?: string; text: string }[]
  className?: string
  hold?: number
}) {
  const [i, setI] = useState(0)
  const [phase, setPhase] = useState<'in' | 'out'>('in')

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    if (lines.length < 2) return
    let alive = true
    const timers: ReturnType<typeof setTimeout>[] = []
    const run = () => {
      if (!alive) return
      setPhase('out')
      timers.push(
        setTimeout(() => {
          if (!alive) return
          setI((n) => (n + 1) % lines.length)
          setPhase('in')
          timers.push(setTimeout(run, hold))
        }, 430)
      )
    }
    timers.push(setTimeout(run, hold))
    return () => {
      alive = false
      timers.forEach(clearTimeout)
    }
  }, [lines, hold])

  return (
    <span className={`roll relative block overflow-hidden ${className}`}>
      {/* every line in the same cell, invisible, to hold the height open */}
      <span aria-hidden="true" className="grid">
        {lines.map((l) => (
          <span key={l.mark ?? l.text} className="invisible col-start-1 row-start-1 block">
            {l.mark}
            {l.text}
          </span>
        ))}
      </span>
      <span
        key={i}
        className={`absolute inset-0 block ${phase === 'out' ? 'roll-out' : 'roll-in'}`}
      >
        {lines[i].mark && <span className="text-pen">{lines[i].mark}</span>}
        {lines[i].text}
      </span>
    </span>
  )
}
