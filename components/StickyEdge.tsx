'use client'

import { useEffect, useRef, useState } from 'react'

/* Toss-style sticky storytelling: heading pinned left, items scroll on the
   right — the one in the viewport middle is dark, the rest fade back. */
export default function StickyEdge({
  eyebrow,
  heading,
  items,
}: {
  eyebrow: string
  heading: string
  items: { title: string; body: string; proof: string }[]
}) {
  const [active, setActive] = useState(0)
  const refs = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((en) => {
          if (en.isIntersecting) {
            const i = refs.current.indexOf(en.target as HTMLDivElement)
            if (i > -1) setActive(i)
          }
        })
      },
      { rootMargin: '-42% 0px -42% 0px' }
    )
    refs.current.forEach((e) => e && io.observe(e))
    return () => io.disconnect()
  }, [])

  return (
    <div className="grid gap-14 md:grid-cols-12 md:gap-10">
      <div className="md:col-span-5 md:sticky md:top-36 md:self-start">
        <p className="text-[13px] font-bold tracking-wide text-accent">{eyebrow}</p>
        <h2 className="mt-4 break-keep text-[30px] font-extrabold leading-[1.16] tracking-tightest md:text-[44px]">
          {heading}
        </h2>
      </div>
      <div className="md:col-span-7">
        {items.map((it, i) => (
          <div
            key={it.title}
            ref={(el) => {
              refs.current[i] = el
            }}
            className={`flex flex-col justify-center border-t border-line py-14 transition-opacity duration-500 md:min-h-[46vh] md:py-0 ${
              i === active ? 'opacity-100' : 'md:opacity-25'
            }`}
          >
            <h3 className="text-2xl font-extrabold tracking-tight md:text-4xl">{it.title}</h3>
            <p className="mt-5 max-w-lg text-base leading-relaxed text-charcoal md:text-lg">
              {it.body}
            </p>
            <p className="mt-6 max-w-lg text-[13px] leading-relaxed text-warmgray">{it.proof}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
