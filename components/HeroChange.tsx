'use client'

import { useEffect, useState } from 'react'

/* The right half of the hero is a page, not a card: masthead at the top,
   three lines of the decision in the middle, the annex note and folio at
   the foot. No shadow, no tilt — it is printed, not placed. */

export default function HeroChange({
  lead,
  label,
  refNo,
  meta,
  rows,
  footer,
  page,
}: {
  lead: string
  label: string
  refNo: string
  meta?: string
  rows: { k: string; v: string; key?: boolean }[]
  footer?: string
  page?: string
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
    <figure className={`hero-change hc-card flex h-full flex-col ${on ? 'is-on' : ''}`}>
      <p className="mb-7 flex items-baseline gap-2.5 text-[13px] font-bold leading-snug text-ink sm:text-[14px]">
        <span aria-hidden="true" className="mt-[0.55em] h-px w-6 shrink-0 bg-pen" />
        {lead}
      </p>
      <figcaption className="flex items-baseline justify-between border-b-2 border-ink pb-3 font-mono text-[10px] uppercase tracking-[0.22em] text-ink sm:text-[11px]">
        <span>{label}</span>
        <span className="tracking-[0.12em] text-ink/40">{refNo}</span>
      </figcaption>
      {meta && <p className="mt-3 font-mono text-[9px] tracking-[0.08em] text-ink/45">{meta}</p>}

      <dl className="flex flex-1 flex-col justify-center py-6">
        {rows.map((r) => (
          <div
            key={r.k}
            className="grid grid-cols-[6.6rem_minmax(0,1fr)] items-baseline gap-x-4 border-b border-dashed border-ink/15 py-5 last:border-b-0 sm:grid-cols-[8.5rem_minmax(0,1fr)] sm:gap-x-7"
          >
            <dt className="break-keep font-mono text-[9.5px] uppercase tracking-[0.1em] text-ink/45 sm:text-[10px]">
              {r.k}
            </dt>
            <dd
              className={`text-[15px] leading-snug text-ink sm:text-[clamp(15px,1.42vw,19px)] ${
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
                    className="pointer-events-none absolute -left-4 top-1/2 h-[42px] w-[calc(100%+32px)] -translate-y-1/2"
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

      {(footer || page) && (
        <div className="flex items-baseline justify-between border-t border-ink/20 pt-3 font-mono text-[8.5px] tracking-[0.1em] text-ink/45">
          <span>{footer}</span>
          <span className="shrink-0">{page}</span>
        </div>
      )}
    </figure>
  )
}
