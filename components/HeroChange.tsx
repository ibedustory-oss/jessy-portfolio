'use client'

import { useEffect, useState } from 'react'

/* The document, at full size and nothing else. Thumbnails of the demo sites
   made the page look like a small portfolio; the sheet is the thing being
   sold, so it gets the room. */

export default function HeroChange({
  label,
  refNo,
  meta,
  rows,
}: {
  label: string
  refNo: string
  meta?: string
  rows: { k: string; v: string; key?: boolean; hyp?: boolean }[]
}) {
  const [on, setOn] = useState(false)
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setOn(true)
      return
    }
    const t = setTimeout(() => setOn(true), 140)
    return () => clearTimeout(t)
  }, [])

  return (
    <div className={`hero-change relative ${on ? 'is-on' : ''}`}>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -inset-x-10 -inset-y-8 bg-[radial-gradient(closest-side,rgba(255,255,255,0.09),transparent)]"
      />
      <figure className="hc-card relative -rotate-[1.1deg] rounded-[4px] bg-[#FCFBF7] px-7 pb-7 pt-6 shadow-[0_60px_110px_-30px_rgba(0,0,0,0.9)] ring-1 ring-black/[0.06] sm:px-9 sm:pb-9 sm:pt-8">
        <figcaption className="flex items-baseline justify-between border-b-2 border-ink pb-3 font-mono text-[10px] uppercase tracking-[0.22em] text-ink sm:text-[11px]">
          <span>{label}</span>
          <span className="tracking-[0.12em] text-ink/40">{refNo}</span>
        </figcaption>
        {meta && (
          <p className="mt-2.5 font-mono text-[9px] tracking-[0.08em] text-ink/45">{meta}</p>
        )}
        <dl className="mt-1">
          {rows.map((r) => (
            <div
              key={r.k}
              className="grid grid-cols-[6.6rem_minmax(0,1fr)] items-baseline gap-x-4 border-b border-dashed border-ink/15 py-3.5 last:border-b-0 sm:grid-cols-[8rem_minmax(0,1fr)] sm:gap-x-6"
            >
              <dt className="break-keep font-mono text-[9.5px] uppercase tracking-[0.1em] text-ink/45 sm:text-[10px]">
                {r.k}
              </dt>
              <dd
                className={`text-[14px] leading-snug text-ink sm:text-[16.5px] ${
                  r.key ? 'font-bold' : 'font-medium'
                }`}
              >
                <span className="relative inline-block">
                {r.v}
                {r.key && (
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 220 44"
                    preserveAspectRatio="none"
                    className="pointer-events-none absolute -left-4 top-1/2 h-[38px] w-[calc(100%+32px)] -translate-y-1/2"
                  >
                    <path
                      d="M14 21 C 28 5, 196 3, 209 17 C 216 32, 168 41, 74 39 C 30 38, 8 32, 16 19"
                      fill="none"
                      stroke="#D25A41"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                      vectorEffect="non-scaling-stroke"
                      className="pen-stroke"
                      opacity="0.82"
                    />
                  </svg>
                )}
                </span>
              </dd>
            </div>
          ))}
        </dl>
      </figure>
    </div>
  )
}
