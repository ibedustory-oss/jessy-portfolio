'use client'

import { useEffect, useRef, useState } from 'react'

/* The pitch is one sentence; the braces hold the part that changes, so the
   owner reading it finds their own shop in the line. The slot is sized to
   the longest word up front, so nothing reflows as it cycles. */

export default function PitchSlot({ words }: { words: string[] }) {
  const [i, setI] = useState(0)
  const [out, setOut] = useState(false)
  const reduced = useRef(false)

  useEffect(() => {
    reduced.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced.current || words.length < 2) return
    let alive = true
    const timers: ReturnType<typeof setTimeout>[] = []
    const tick = () => {
      if (!alive) return
      setOut(true)
      timers.push(
        setTimeout(() => {
          if (!alive) return
          setI((n) => (n + 1) % words.length)
          setOut(false)
          timers.push(setTimeout(tick, 2200))
        }, 260)
      )
    }
    timers.push(setTimeout(tick, 2200))
    return () => {
      alive = false
      timers.forEach(clearTimeout)
    }
  }, [words])

  return (
    <span className="inline-flex items-baseline whitespace-nowrap">
      <span aria-hidden="true" className="mr-[0.28em] font-normal text-pen">
        {'{'}
      </span>
      <span className="inline-grid">
        {/* every option in the same cell, invisible, to hold the width open */}
        {words.map((w) => (
          <span key={w} aria-hidden="true" className="invisible col-start-1 row-start-1 hidden whitespace-nowrap sm:block">
            {w}
          </span>
        ))}
        <span
          className={`col-start-1 row-start-1 whitespace-nowrap transition-all duration-[260ms] ease-swift ${
            out ? 'translate-y-[-0.2em] opacity-0 blur-[3px]' : 'translate-y-0 opacity-100 blur-0'
          }`}
        >
          {words[i]}
        </span>
      </span>
      <span aria-hidden="true" className="ml-[0.28em] font-normal text-pen">
        {'}'}
      </span>
    </span>
  )
}
