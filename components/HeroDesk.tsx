'use client'

import Image from 'next/image'
import { useEffect, useState } from 'react'
import StrategySheet from '@/components/StrategySheet'

/* The hero as a desk after real work, not a demo: the finished sheet lies
   tilted at the corner, a red pen ring around the winning row, an arrow
   drawn to the shipped site. Plays once on load, then holds still. */
export default function HeroDesk({
  label,
  refNo,
  meta,
  hypLabel,
  rows,
  footer,
  page,
  img,
  alt,
  domain,
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
  domain: string
}) {
  const [on, setOn] = useState(false)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setOn(true)
      return
    }
    const t = setTimeout(() => setOn(true), 120)
    return () => clearTimeout(t)
  }, [])

  return (
    <div className={`hero-desk relative ${on ? 'is-on' : ''}`} aria-label={alt}>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -inset-x-16 -top-20 bottom-0 bg-[radial-gradient(closest-side_at_60%_35%,rgba(49,130,246,0.2),transparent_75%)] blur-2xl"
      />

      {/* the shipped site, in its own browser window */}
      <div className="hd-site relative ml-auto w-[90%] overflow-hidden rounded-[14px] bg-[#10151D] shadow-[0_50px_100px_-32px_rgba(0,0,0,0.85)] ring-1 ring-white/10 md:w-[88%]">
        <div className="flex items-center border-b border-white/10 bg-white/[0.04] px-3.5 py-2">
          <span aria-hidden="true" className="flex gap-1.5">
            <i className="h-[7px] w-[7px] rounded-full bg-white/20" />
            <i className="h-[7px] w-[7px] rounded-full bg-white/20" />
            <i className="h-[7px] w-[7px] rounded-full bg-white/20" />
          </span>
          <span className="mx-auto rounded-full bg-white/[0.06] px-4 py-0.5 font-mono text-[8.5px] tracking-[0.08em] text-white/40">
            {domain}
          </span>
        </div>
        <div className="relative h-[340px] sm:h-[420px] md:h-[500px]">
          <Image src={img} alt={alt} fill priority className="object-cover object-right-top" />
        </div>
      </div>

      {/* the pen's arrow: from the sheet up to the site */}
      <svg
        aria-hidden="true"
        viewBox="0 0 140 110"
        className="hd-arrow pointer-events-none absolute left-[46%] top-[38%] z-20 hidden w-[15%] md:block"
      >
        <path
          d="M10 100 C 22 58, 52 24, 116 18"
          fill="none"
          stroke="#D25A41"
          strokeWidth="2.4"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
          className="pen-stroke"
          opacity="0.9"
        />
        <path
          d="M100 6 L118 17 L102 32"
          fill="none"
          stroke="#D25A41"
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
          className="pen-stroke pen-stroke-2"
          opacity="0.9"
        />
      </svg>

      {/* the sheet itself, tilted the way paper actually sits */}
      <div className="hd-sheet relative z-10 mx-auto -mt-14 w-[92%] md:absolute md:-bottom-10 md:-left-8 md:mx-0 md:mt-0 md:w-[50%]">
        <StrategySheet
          label={label}
          refNo={refNo}
          meta={meta}
          hypLabel={hypLabel}
          rows={rows}
          footer={footer}
          page={page}
          pen
        />
      </div>
    </div>
  )
}
