'use client'

import Link from 'next/link'
import { useState } from 'react'
import StrategySheet from '@/components/StrategySheet'
import type { FinderBlock } from '@/lib/service-extra'

function Choice({
  label,
  options,
  value,
  onPick,
}: {
  label: string
  options: string[]
  value: number | null
  onPick: (i: number) => void
}) {
  return (
    <fieldset>
      <legend className="font-mono text-[10px] uppercase tracking-[0.2em] text-warmgray">
        {label}
      </legend>
      <div className="mt-4 flex flex-wrap gap-x-7 gap-y-3.5">
        {options.map((o, i) => {
          const on = value === i
          return (
            <button
              key={o}
              type="button"
              aria-pressed={on}
              onClick={() => onPick(i)}
              className={`border-b-2 pb-1.5 text-left text-[14px] transition-colors duration-300 ${
                on
                  ? 'border-accent font-bold text-ink'
                  : 'border-transparent font-medium text-warmgray hover:border-line hover:text-ink'
              }`}
            >
              {o}
            </button>
          )
        })}
      </div>
    </fieldset>
  )
}

/* Two choices that write themselves onto a draft of the sheet. */
export default function Finder({ block, contact }: { block: FinderBlock; contact: string }) {
  const [size, setSize] = useState<number | null>(null)
  const [pain, setPain] = useState<number | null>(null)

  const s = size === null ? null : block.sizes[size]
  const p = pain === null ? null : block.pains[pain]

  const rows = [
    { k: block.rowYou, v: s?.label },
    { k: block.rowIssue, v: p?.label },
    { k: block.whatLabel, v: p?.what },
    { k: block.howLabel, v: s?.how },
    { k: block.weeksLabel, v: p?.weeks },
  ]

  return (
    <div className="grid items-start gap-12">
      <div className="space-y-8">
        <Choice
          label={block.sizeLead}
          options={block.sizes.map((v) => v.label)}
          value={size}
          onPick={setSize}
        />
        <Choice
          label={block.painLead}
          options={block.pains.map((v) => v.label)}
          value={pain}
          onPick={setPain}
        />
      </div>

      <div className="max-w-[26rem]">
        <StrategySheet
          label={block.sheetLabel}
          refNo={block.draftRef}
          rows={rows}
          onDark={false}
        />
      </div>

      <div className="flex flex-wrap items-center gap-x-7 gap-y-3">
          <Link
            href={contact}
            className={`inline-flex items-baseline gap-3 border-b pb-1 text-[14px] font-bold transition-colors duration-300 ${
              s && p
                ? 'border-ink/30 text-ink hover:border-ink'
                : 'pointer-events-none border-transparent text-warmgray'
            }`}
            aria-disabled={!(s && p)}
            tabIndex={s && p ? undefined : -1}
          >
            {block.cta}
          </Link>
          {(size !== null || pain !== null) && (
            <button
              type="button"
              onClick={() => {
                setSize(null)
                setPain(null)
              }}
              className="text-[13px] font-medium text-warmgray underline-offset-4 transition-colors hover:text-ink hover:underline"
            >
              {block.reset}
            </button>
          )}
      </div>
    </div>
  )
}
