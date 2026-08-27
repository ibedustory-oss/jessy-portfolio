'use client'

import Link from 'next/link'
import { useState } from 'react'
import type { FinderBlock } from '@/lib/service-extra'

function Caret() {
  return (
    <svg viewBox="0 0 10 6" className="pointer-events-none h-2 w-3 shrink-0 text-accent" aria-hidden="true">
      <path d="M1 1l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  )
}

function Slot({
  value,
  onChange,
  options,
  placeholder,
  label,
}: {
  value: number | null
  onChange: (v: number | null) => void
  options: string[]
  placeholder: string
  label: string
}) {
  return (
    <span className="relative inline-flex min-w-[9.5rem] items-center justify-between gap-2 border-b-2 border-accent/35 pb-1 focus-within:border-accent">
      <span className={value === null ? 'text-warmgray' : 'font-bold text-accent'}>
        {value === null ? placeholder : options[value]}
      </span>
      <Caret />
      <select
        aria-label={label}
        value={value === null ? '' : value}
        onChange={(e) => onChange(e.target.value === '' ? null : Number(e.target.value))}
        className="absolute inset-0 cursor-pointer opacity-0"
      >
        <option value="">{placeholder}</option>
        {options.map((o, i) => (
          <option key={o} value={i}>
            {o}
          </option>
        ))}
      </select>
    </span>
  )
}

/* Two choices, written as a sentence, that resolve into one recommendation. */
export default function Finder({
  block,
  contact,
}: {
  block: FinderBlock
  contact: string
}) {
  const [size, setSize] = useState<number | null>(null)
  const [pain, setPain] = useState<number | null>(null)
  const [shown, setShown] = useState(false)

  const ready = size !== null && pain !== null
  const result = shown && ready ? { s: block.sizes[size!], p: block.pains[pain!] } : null

  return (
    <div className="grid items-start gap-4 md:grid-cols-[minmax(0,1fr)_minmax(0,0.86fr)]">
      <div className="rounded-3xl border border-line bg-paper p-7 md:p-9">
        <p className="text-[17px] font-medium leading-[2.6] text-ink md:text-[21px] md:leading-[2.7]">
          {block.sizeLead}{' '}
          <Slot
            value={size}
            onChange={(v) => {
              setSize(v)
              setShown(false)
            }}
            options={block.sizes.map((s) => s.label)}
            placeholder={block.placeholder}
            label={block.sizeLead}
          />{' '}
          {block.sizeAfter}
          <br />
          {block.painLead}{' '}
          <Slot
            value={pain}
            onChange={(v) => {
              setPain(v)
              setShown(false)
            }}
            options={block.pains.map((p) => p.label)}
            placeholder={block.placeholder}
            label={block.painLead}
          />{' '}
          {block.painAfter}
        </p>

        <div className="mt-7 flex flex-wrap gap-2.5">
          <button
            type="button"
            disabled={!ready}
            onClick={() => setShown(true)}
            className="rounded-full bg-accent px-6 py-3 text-sm font-bold text-white transition duration-300 ease-swift hover:bg-accenthover disabled:cursor-not-allowed disabled:bg-surface2 disabled:text-warmgray"
          >
            {block.submit}
          </button>
          <button
            type="button"
            onClick={() => {
              setSize(null)
              setPain(null)
              setShown(false)
            }}
            className="rounded-full border border-line px-6 py-3 text-sm font-bold text-charcoal transition duration-300 hover:border-ink hover:text-ink"
          >
            {block.reset}
          </button>
        </div>
      </div>

      <div className="rounded-3xl border border-line bg-paper p-7 md:p-9">
        <p className="text-[13px] font-bold tracking-wide text-accent">{block.resultTitle}</p>

        {!result && (
          <p className="mt-6 text-sm leading-relaxed text-warmgray">{block.resultEmpty}</p>
        )}

        {result && (
          <div key={`${size}-${pain}`} className="finder-in mt-5">
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-accent">
              {block.whatLabel}
            </p>
            <p className="mt-2 text-[15px] font-medium leading-relaxed text-ink">
              {result.p.what}
            </p>

            <p className="mt-6 text-[11px] font-bold uppercase tracking-[0.18em] text-warmgray">
              {block.howLabel}
            </p>
            <p className="mt-2 text-[14px] leading-relaxed text-charcoal">{result.s.how}</p>

            <p className="mt-6 inline-flex items-baseline gap-2 rounded-full bg-surface px-3.5 py-1.5">
              <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-warmgray">
                {block.weeksLabel}
              </span>
              <span className="text-[13px] font-extrabold text-ink">{result.p.weeks}</span>
            </p>

            <Link
              href={contact}
              className="mt-7 flex items-center justify-center gap-2 rounded-full bg-ink px-5 py-3 text-[13px] font-bold text-white transition duration-300 ease-swift hover:bg-accent"
            >
              {block.cta}
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
