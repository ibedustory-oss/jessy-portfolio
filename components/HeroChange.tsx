'use client'

import Image from 'next/image'
import { useEffect, useState } from 'react'

/* The document is the product, so it sits in front. The sites it produced
   stay behind it and stay plural, or the page starts looking like one
   shop's website instead of the studio that makes them. */

function Win({
  img,
  domain,
  alt,
  className = '',
}: {
  img: string
  domain: string
  alt: string
  className?: string
}) {
  return (
    <div
      className={`overflow-hidden rounded-[11px] bg-[#10151D] shadow-[0_36px_70px_-28px_rgba(0,0,0,0.8)] ring-1 ring-white/10 ${className}`}
    >
      <div className="flex items-center border-b border-white/10 bg-white/[0.04] px-2.5 py-1.5">
        <span aria-hidden="true" className="flex gap-1">
          <i className="h-[5px] w-[5px] rounded-full bg-white/20" />
          <i className="h-[5px] w-[5px] rounded-full bg-white/20" />
          <i className="h-[5px] w-[5px] rounded-full bg-white/20" />
        </span>
        <span className="mx-auto font-mono text-[7px] tracking-[0.08em] text-white/35">{domain}</span>
      </div>
      <div className="relative h-[140px] sm:h-[185px] lg:h-[232px]">
        <Image src={img} alt={alt} fill sizes="(max-width:1024px) 40vw, 22vw" className="object-cover object-top" />
      </div>
    </div>
  )
}

export default function HeroChange({
  label,
  refNo,
  rows,
  shots,
}: {
  label: string
  refNo: string
  rows: { k: string; v: string; key?: boolean }[]
  shots: { img: string; domain: string; alt: string }[]
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
    <div className={`hero-change relative pb-14 ${on ? 'is-on' : ''}`}>
      <div className="hc-sites flex justify-end gap-3.5 pl-[10%] sm:pl-[26%]">
        {shots.map((sh) => (
          <Win key={sh.domain} img={sh.img} domain={sh.domain} alt={sh.alt} className="w-1/2" />
        ))}
      </div>

      <figure className="hc-card absolute bottom-0 left-0 w-[86%] max-w-[23rem] -rotate-[1.6deg] rounded-[3px] bg-[#FCFBF7] px-6 pb-5 pt-5 shadow-[0_40px_80px_-24px_rgba(0,0,0,0.8)] ring-1 ring-black/[0.06] sm:w-[54%]">
        <figcaption className="flex items-baseline justify-between border-b-2 border-ink pb-2.5 font-mono text-[9.5px] uppercase tracking-[0.2em] text-ink">
          <span>{label}</span>
          <span className="tracking-[0.1em] text-ink/40">{refNo}</span>
        </figcaption>
        <dl>
          {rows.map((r) => (
            <div
              key={r.k}
              className="grid grid-cols-[5.6rem_minmax(0,1fr)] items-baseline gap-x-3 border-b border-dashed border-ink/15 py-2.5 last:border-b-0"
            >
              <dt className="break-keep font-mono text-[9px] uppercase tracking-[0.1em] text-ink/45">{r.k}</dt>
              <dd className={`relative text-[13px] leading-snug text-ink ${r.key ? 'font-bold' : 'font-medium'}`}>
                {r.v}
                {r.key && (
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 220 44"
                    preserveAspectRatio="none"
                    className="pointer-events-none absolute -left-3 top-1/2 h-[30px] w-[calc(100%+24px)] -translate-y-1/2"
                  >
                    <path
                      d="M14 21 C 28 5, 196 3, 209 17 C 216 32, 168 41, 74 39 C 30 38, 8 32, 16 19"
                      fill="none"
                      stroke="#D25A41"
                      strokeWidth="2"
                      strokeLinecap="round"
                      vectorEffect="non-scaling-stroke"
                      className="pen-stroke"
                      opacity="0.8"
                    />
                  </svg>
                )}
              </dd>
            </div>
          ))}
        </dl>
      </figure>
    </div>
  )
}
