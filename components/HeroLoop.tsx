'use client'

import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import StrategySheet from '@/components/StrategySheet'

/* The service, playing itself: the sheet's lines are written one by one,
   then the site rises from it and the sheet docks in the corner. Loops.
   Behind the sheet, the rest of the dossier — a positioning map and a
   canvas page — reads as depth without needing to be readable. */

/* Annex page 2: positioning map — two axes, competitor dots, one marked. */
function MapPage({ className = '' }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={`rounded-[3px] bg-[#FCFBF7] p-3 shadow-[0_24px_50px_-20px_rgba(0,0,0,0.6)] ring-1 ring-black/[0.06] ${className}`}
    >
      <div className="flex items-baseline justify-between border-b border-ink/25 pb-1">
        <span className="font-mono text-[6.5px] uppercase tracking-[0.2em] text-ink/60">
          Positioning map
        </span>
        <span className="font-mono text-[6.5px] tracking-[0.14em] text-ink/35">4 / 12</span>
      </div>
      <svg viewBox="0 0 150 100" className="mt-1.5 w-full">
        <line x1="75" y1="6" x2="75" y2="94" stroke="#191F28" strokeOpacity="0.25" strokeWidth="0.7" />
        <line x1="6" y1="50" x2="144" y2="50" stroke="#191F28" strokeOpacity="0.25" strokeWidth="0.7" />
        {[
          [34, 30], [52, 68], [96, 26], [112, 62], [58, 22], [88, 78],
        ].map(([cx, cy]) => (
          <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="3" fill="#191F28" fillOpacity="0.22" />
        ))}
        <circle cx="118" cy="36" r="3.6" fill="#3182F6" />
        <circle cx="118" cy="36" r="7.5" fill="none" stroke="#3182F6" strokeWidth="0.9" strokeOpacity="0.5" strokeDasharray="2.5 2" />
        <path d="M118 36 C 104 30, 92 30, 80 40" fill="none" stroke="#3182F6" strokeWidth="0.8" strokeOpacity="0.45" />
        {[[10, 47], [138, 47], [71, 10], [71, 92]].map(([x, y], i) => (
          <rect key={i} x={x - 4} y={y - 2} width="12" height="3.5" rx="1" fill="#191F28" fillOpacity="0.14" />
        ))}
      </svg>
    </div>
  )
}

/* Annex page 3: the canvas — nine blocks, faint field strokes, one lit. */
function CanvasPage({ className = '' }: { className?: string }) {
  const bar = (w: number, k: number) => (
    <rect key={k} x="3" y={4 + k * 5} width={w} height="2" rx="1" fill="#191F28" fillOpacity="0.16" />
  )
  return (
    <div
      aria-hidden="true"
      className={`rounded-[3px] bg-[#FCFBF7] p-3 shadow-[0_24px_50px_-20px_rgba(0,0,0,0.6)] ring-1 ring-black/[0.06] ${className}`}
    >
      <div className="flex items-baseline justify-between border-b border-ink/25 pb-1">
        <span className="font-mono text-[6.5px] uppercase tracking-[0.2em] text-ink/60">
          Lean canvas
        </span>
        <span className="font-mono text-[6.5px] tracking-[0.14em] text-ink/35">7 / 12</span>
      </div>
      <svg viewBox="0 0 150 90" className="mt-1.5 w-full">
        {[0, 30, 60, 90, 120].map((x) => (
          <line key={x} x1={x || 0.5} y1="0" x2={x || 0.5} y2="60" stroke="#191F28" strokeOpacity="0.2" strokeWidth="0.6" />
        ))}
        <line x1="149.5" y1="0" x2="149.5" y2="90" stroke="#191F28" strokeOpacity="0.2" strokeWidth="0.6" />
        <line x1="0.5" y1="60" x2="0.5" y2="90" stroke="#191F28" strokeOpacity="0.2" strokeWidth="0.6" />
        <line x1="0" y1="0.5" x2="150" y2="0.5" stroke="#191F28" strokeOpacity="0.2" strokeWidth="0.6" />
        <line x1="0" y1="60" x2="150" y2="60" stroke="#191F28" strokeOpacity="0.2" strokeWidth="0.6" />
        <line x1="0" y1="89.5" x2="150" y2="89.5" stroke="#191F28" strokeOpacity="0.2" strokeWidth="0.6" />
        <line x1="75" y1="60" x2="75" y2="90" stroke="#191F28" strokeOpacity="0.2" strokeWidth="0.6" />
        <line x1="30" y1="30" x2="60" y2="30" stroke="#191F28" strokeOpacity="0.2" strokeWidth="0.6" />
        <line x1="90" y1="30" x2="120" y2="30" stroke="#191F28" strokeOpacity="0.2" strokeWidth="0.6" />
        <rect x="60.6" y="0.6" width="28.8" height="59" fill="#3182F6" fillOpacity="0.08" />
        {[[0, 0], [30, 0], [30, 30], [90, 0], [90, 30], [120, 0]].map(([x, y], i) => (
          <g key={i} transform={`translate(${x} ${y})`}>
            {[16, 22, 12].map((w, k) => bar(w, k))}
          </g>
        ))}
        <g transform="translate(60 0)">
          {[20, 24, 18, 22].map((w, k) => (
            <rect key={k} x="3" y={4 + k * 5} width={w} height="2" rx="1" fill="#3182F6" fillOpacity="0.5" />
          ))}
        </g>
        <g transform="translate(0 60)">{[40, 52].map((w, k) => bar(w, k))}</g>
        <g transform="translate(75 60)">{[44, 36].map((w, k) => bar(w, k))}</g>
      </svg>
    </div>
  )
}

export default function HeroLoop({
  label,
  refNo,
  meta,
  hypLabel,
  rows,
  footer,
  page,
  img,
  alt,
}: {
  label: string
  refNo: string
  meta?: string
  hypLabel?: string
  rows: { k: string; v?: string; no?: string; key?: boolean; hyp?: boolean }[]
  footer?: string
  page?: string
  img: string
  alt: string
}) {
  const [written, setWritten] = useState(0)
  const [done, setDone] = useState(false)
  const reduced = useRef(false)

  useEffect(() => {
    reduced.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced.current) {
      setWritten(rows.length)
      setDone(true)
      return
    }
    let alive = true
    const timers: ReturnType<typeof setTimeout>[] = []
    const run = () => {
      if (!alive) return
      setWritten(0)
      setDone(false)
      rows.forEach((_, i) => {
        timers.push(setTimeout(() => alive && setWritten(i + 1), 700 + i * 950))
      })
      timers.push(setTimeout(() => alive && setDone(true), 700 + rows.length * 950 + 500))
      timers.push(setTimeout(run, 700 + rows.length * 950 + 500 + 6500))
    }
    run()
    return () => {
      alive = false
      timers.forEach(clearTimeout)
    }
  }, [rows])

  const shown = rows.map((r, i) => (i < written ? r : { k: r.k, no: r.no }))

  return (
    <div className="relative" aria-label={alt}>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -inset-x-16 -top-20 bottom-0 bg-[radial-gradient(closest-side_at_60%_35%,rgba(49,130,246,0.22),transparent_75%)] blur-2xl"
      />

      {/* the site: hidden while the sheet is being written, then it rises */}
      <div
        className={`relative ml-auto rounded-[18px] bg-white/[0.05] p-1.5 ring-1 ring-white/10 transition-all duration-1000 ease-swift md:w-[94%] ${
          done ? 'translate-y-0 opacity-100' : 'translate-y-5 opacity-[0.18]'
        }`}
      >
        <Image src={img} alt={alt} width={1500} height={1000} priority className="w-full rounded-[13px]" />
      </div>

      {/* the rest of the dossier, fanned out while the sheet is being written */}
      <div
        className={`absolute z-[5] w-[34%] transition-all duration-1000 ease-swift ${
          done
            ? '-bottom-6 left-[30%] -rotate-[5deg] opacity-0'
            : 'bottom-[56%] -left-[6%] -rotate-[7deg] opacity-90 md:-left-[4%]'
        }`}
      >
        <MapPage />
      </div>
      <div
        className={`absolute z-[5] w-[34%] transition-all duration-1000 ease-swift ${
          done
            ? 'bottom-0 left-[36%] rotate-[4deg] opacity-0'
            : 'bottom-[4%] right-[2%] rotate-[6deg] opacity-90 md:right-[4%]'
        }`}
      >
        <CanvasPage />
      </div>

      {/* the sheet: front and centre while writing, docked once the site is up */}
      <div
        className={`absolute z-10 transition-all duration-1000 ease-swift ${
          done
            ? '-bottom-10 -left-2 w-[62%] md:-bottom-12 md:-left-4 md:w-[54%]'
            : 'bottom-[8%] left-[7%] w-[80%] md:bottom-[10%] md:left-[10%] md:w-[68%]'
        }`}
      >
        <StrategySheet
          label={label}
          refNo={refNo}
          meta={meta}
          hypLabel={hypLabel}
          rows={shown}
          footer={footer}
          page={page}
          animateWrites
        />
      </div>
    </div>
  )
}
