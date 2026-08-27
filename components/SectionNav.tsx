'use client'

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'

export interface NavItem {
  id: string
  label: string
}

/* A sticky section index. The filled pill slides to whichever section is in
   view, and clicking one scrolls there. */
export default function SectionNav({ items }: { items: NavItem[] }) {
  const [active, setActive] = useState(0)
  const [pill, setPill] = useState<{ x: number; w: number } | null>(null)
  const btns = useRef<(HTMLButtonElement | null)[]>([])
  const bar = useRef<HTMLDivElement>(null)

  const measure = useCallback(() => {
    const el = btns.current[active]
    if (!el) return
    setPill({ x: el.offsetLeft, w: el.offsetWidth })
    const strip = bar.current
    if (strip && strip.scrollWidth > strip.clientWidth) {
      const target = el.offsetLeft - (strip.clientWidth - el.offsetWidth) / 2
      strip.scrollTo({ left: Math.max(0, target), behavior: 'smooth' })
    }
  }, [active])

  useLayoutEffect(measure, [measure])

  useEffect(() => {
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [measure])

  useEffect(() => {
    const sections = items
      .map((it, i) => {
        const el = document.getElementById(it.id)
        return el ? { el, i } : null
      })
      .filter(Boolean) as { el: HTMLElement; i: number }[]
    if (!sections.length) return

    const onScroll = () => {
      // the section whose top has most recently passed the nav line
      const line = window.innerHeight * 0.32
      let next = 0
      sections.forEach(({ el, i }) => {
        if (el.getBoundingClientRect().top <= line) next = i
      })
      setActive(next)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [items])

  const go = (id: string) => {
    const el = document.getElementById(id)
    if (!el) return
    const top = el.getBoundingClientRect().top + window.scrollY - 108
    window.scrollTo({ top, behavior: 'smooth' })
  }

  return (
    <div className="sticky top-14 z-30 border-b border-line bg-paper md:top-16">
      <div
        ref={bar}
        className="mx-auto flex max-w-6xl gap-1 overflow-x-auto px-4 pb-0 pt-2.5 md:px-8 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        <div className="relative flex gap-2">
          {pill && (
            <span
              aria-hidden="true"
              className="absolute bottom-0 h-[2px] rounded-full bg-ink transition-[transform,width] duration-500 ease-swift"
              style={{ transform: `translateX(${pill.x}px)`, width: pill.w }}
            />
          )}
          {items.map((it, i) => (
            <button
              key={it.id}
              ref={(el) => {
                btns.current[i] = el
              }}
              type="button"
              onClick={() => go(it.id)}
              aria-current={i === active ? 'true' : undefined}
              className={`relative whitespace-nowrap px-2 pb-2 pt-1 text-[13px] transition-colors duration-300 md:px-3 ${
                i === active ? 'font-bold text-ink' : 'font-medium text-warmgray hover:text-ink'
              }`}
            >
              {it.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
