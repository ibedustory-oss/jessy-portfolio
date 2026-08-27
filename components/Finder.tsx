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
      <div className="mt-3.5 flex flex-wrap gap-2">
        {options.map((o, i) => {
          const on = value === i
          return (
            <button
              key={o}
              type="button"
              aria-pressed={on}
              onClick={() => onPick(i)}
              className={`rounded-full border px-4 py-2.5 text-left text-[13px] transition duration-300 ease-swift ${
                on
                  ? 'border-ink bg-ink font-bold text-white'
                  : 'border-line bg-paper font-medium text-charcoal hover:border-ink hover:text-ink'
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
export default function Finder({
  block,
  sheetLabel,
  draftRef,
  contact,
}: {
  block: FinderBlock
  sheetLabel: string
  draftRef: string
  contact: string
}) {
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
    <div className="grid items-start gap-12 md:grid-cols-[minmax(0,1fr)_minmax(0,24rem)] md:gap-16">
      <div className="space-y-9">
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

        <div className="flex flex-wrap items-center gap-x-7 gap-y-3 pt-1">
          <Link
            href={contact}
            className={`rounded-full px-6 py-3 text-[13px] font-bold transition duration-300 ease-swift ${
              s && p
                ? 'bg-ink text-white hover:bg-accent'
                : 'pointer-events-none bg-surface2 text-warmgray'
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

      <StrategySheet
        label={sheetLabel}
        refNo={draftRef}
        rows={rows}
        onDark={false}
      />
    </div>
  )
}
