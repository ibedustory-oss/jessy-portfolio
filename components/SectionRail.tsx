'use client'

import { useEffect, useState } from 'react'

/* Toss-style fixed progress rail: one tick per [data-rail] section. */
export default function SectionRail() {
  const [count, setCount] = useState(0)
  const [active, setActive] = useState(0)

  useEffect(() => {
    const els = Array.from(document.querySelectorAll<HTMLElement>('[data-rail]'))
    setCount(els.length)
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((en) => {
          if (en.isIntersecting) setActive(els.indexOf(en.target as HTMLElement))
        })
      },
      { rootMargin: '-45% 0px -45% 0px' }
    )
    els.forEach((e) => io.observe(e))
    return () => io.disconnect()
  }, [])

  if (count === 0) return null
  return (
    <div
      aria-hidden="true"
      className="fixed left-6 top-1/2 z-40 hidden -translate-y-1/2 flex-col items-start gap-2.5 lg:flex"
    >
      {Array.from({ length: count }).map((_, i) => (
        <span
          key={i}
          className={`h-[2px] rounded-full transition-all duration-500 ease-swift ${
            i === active ? 'w-7 bg-ink' : 'w-3.5 bg-ink/20'
          }`}
        />
      ))}
    </div>
  )
}
