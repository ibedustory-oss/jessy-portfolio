'use client'

import { useState } from 'react'

export default function Faq({ items }: { items: { q: string; a: string }[] }) {
  const [open, setOpen] = useState<number | null>(0)

  return (
    <div className="divide-y divide-line border-y border-line">
      {items.map((it, i) => {
        const isOpen = open === i
        return (
          <div key={it.q}>
            <button
              type="button"
              onClick={() => setOpen(isOpen ? null : i)}
              aria-expanded={isOpen}
              className="flex w-full items-start justify-between gap-6 py-5 text-left"
            >
              <span
                className={`text-[15px] font-bold transition-colors duration-300 md:text-base ${
                  isOpen ? 'text-accent' : 'text-ink'
                }`}
              >
                {it.q}
              </span>
              <span
                aria-hidden="true"
                className={`relative mt-1 h-4 w-4 shrink-0 transition-transform duration-500 ease-swift ${
                  isOpen ? 'rotate-45' : ''
                }`}
              >
                <span
                  className={`absolute left-0 top-1/2 h-[1.5px] w-4 -translate-y-1/2 rounded-full transition-colors duration-300 ${
                    isOpen ? 'bg-accent' : 'bg-charcoal'
                  }`}
                />
                <span
                  className={`absolute left-1/2 top-0 h-4 w-[1.5px] -translate-x-1/2 rounded-full transition-colors duration-300 ${
                    isOpen ? 'bg-accent' : 'bg-charcoal'
                  }`}
                />
              </span>
            </button>
            <div
              className="grid transition-[grid-template-rows] duration-500 ease-swift"
              style={{ gridTemplateRows: isOpen ? '1fr' : '0fr' }}
            >
              <div className="overflow-hidden">
                <p className="pb-6 pr-10 text-sm leading-relaxed text-charcoal">{it.a}</p>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
