'use client'

import { useEffect, useRef, useState, type ReactNode } from 'react'
import { eurDiff, pct } from '@/lib/sales-demo/format'

/* ───────── 아이콘 ───────── */

const PATHS: Record<string, ReactNode> = {
  left: <path d="M15 6l-6 6 6 6" />,
  right: <path d="M9 6l6 6-6 6" />,
  back: <path d="M19 12H5m6-6l-6 6 6 6" />,
  rain: (
    <>
      <path d="M7 15a4 4 0 01-.5-7.97A5.5 5.5 0 0117 8.5h.5a3.5 3.5 0 010 7" />
      <path d="M9 18l-1 2.5M13 18l-1 2.5M17 18l-1 2.5" />
    </>
  ),
  note: (
    <>
      <path d="M5 4h14v11l-5 5H5z" />
      <path d="M14 20v-5h5" />
    </>
  ),
  send: <path d="M12 19V5m-6 6l6-6 6 6" />,
  plus: <path d="M12 5v14M5 12h14" />,
  check: <path d="M5 12.5l4.5 4.5L19 7.5" />,
  x: <path d="M6 6l12 12M18 6L6 18" />,
  alert: (
    <>
      <path d="M12 4l9 16H3z" />
      <path d="M12 10v4m0 3v.01" />
    </>
  ),
  pin: (
    <>
      <path d="M12 21s7-6.2 7-11.5A7 7 0 005 9.5C5 14.8 12 21 12 21z" />
      <circle cx="12" cy="9.5" r="2.5" />
    </>
  ),
  table: (
    <>
      <rect x="4" y="5" width="16" height="14" rx="2" />
      <path d="M4 10h16M4 14.5h16M10 5v14" />
    </>
  ),
  chart: <path d="M5 20V10m7 10V4m7 16v-7" />,
  reset: (
    <>
      <path d="M4 12a8 8 0 108-8 8 8 0 00-6 2.7L4 9" />
      <path d="M4 4v5h5" />
    </>
  ),
  list: <path d="M9 6h11M9 12h11M9 18h11M4 6h.01M4 12h.01M4 18h.01" />,
  bookmark: <path d="M6 4h12v16l-6-4.5L6 20z" />,
  copy: (
    <>
      <rect x="9" y="9" width="11" height="11" rx="2" />
      <path d="M15 9V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7a2 2 0 002 2h3" />
    </>
  ),
  info: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 11v5m0-8v.01" />
    </>
  ),
  play: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M10 8.5v7l6-3.5z" />
    </>
  ),
  chat: <path d="M5 5h14a1 1 0 011 1v10a1 1 0 01-1 1h-7l-5 3.5V17H5a1 1 0 01-1-1V6a1 1 0 011-1z" />,
  down: <path d="M6 9l6 6 6-6" />,
  trash: <path d="M5 7h14M10 7V5h4v2m-7 0l1 13h8l1-13" />,
  edit: <path d="M4 20h4L19 9l-4-4L4 16zM13.5 6.5l4 4" />,
}

export function Icon({ name, size = 16, className = '' }: { name: keyof typeof PATHS | string; size?: number; className?: string }) {
  return (
    <svg
      aria-hidden="true"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.7}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`shrink-0 ${className}`}
    >
      {PATHS[name]}
    </svg>
  )
}

/* ───────── 증감 표시: 색에만 기대지 않도록 기호와 부호를 함께 쓴다 ───────── */

export type Tone = 'down' | 'up' | 'flat'

export function toneOf(diff: number | null): Tone {
  if (diff === null) return 'flat'
  const v = Math.round(diff / 100)
  return v < 0 ? 'down' : v > 0 ? 'up' : 'flat'
}

export const TONE_TEXT: Record<Tone, string> = {
  down: 'text-[#BF2A24]',
  up: 'text-[#0B6B22]',
  flat: 'text-warmgray',
}
export const TONE_BG: Record<Tone, string> = {
  down: 'bg-[#FDEEED]',
  up: 'bg-[#E9F5EB]',
  flat: 'bg-surface',
}
const TONE_MARK: Record<Tone, string> = { down: '▼', up: '▲', flat: '–' }
const TONE_WORD: Record<Tone, string> = { down: '감소', up: '증가', flat: '변동 없음' }

export function Delta({
  diff,
  rate,
  pill = false,
  className = '',
}: {
  diff: number | null
  rate?: number | null
  pill?: boolean
  className?: string
}) {
  if (diff === null) return <span className={`text-warmgray ${className}`}>비교 불가</span>
  const tone = toneOf(diff)
  return (
    <span
      className={`inline-flex items-baseline gap-1 whitespace-nowrap font-semibold tabular-nums ${TONE_TEXT[tone]} ${
        pill ? `rounded-md px-1.5 py-0.5 ${TONE_BG[tone]}` : ''
      } ${className}`}
    >
      <span aria-hidden="true" className="text-[0.72em]">
        {TONE_MARK[tone]}
      </span>
      <span className="sr-only">{TONE_WORD[tone]}</span>
      <span>{eurDiff(diff)}</span>
      {rate !== undefined && rate !== null && <span className="font-medium opacity-90">({pct(rate)})</span>}
    </span>
  )
}

export function RateDelta({ rate, className = '' }: { rate: number | null; className?: string }) {
  if (rate === null) return <span className={`text-warmgray ${className}`}>비교 불가</span>
  const tone: Tone = Math.abs(rate) < 0.0005 ? 'flat' : rate < 0 ? 'down' : 'up'
  return (
    <span className={`inline-flex items-baseline gap-1 whitespace-nowrap font-semibold tabular-nums ${TONE_TEXT[tone]} ${className}`}>
      <span aria-hidden="true" className="text-[0.72em]">
        {TONE_MARK[tone]}
      </span>
      <span className="sr-only">{TONE_WORD[tone]}</span>
      {pct(rate)}
    </span>
  )
}

/* ───────── 태그 ───────── */

export type TagKind = 'rain' | 'event' | 'strike' | 'memo' | 'neutral' | 'saved'

const TAG_STYLE: Record<TagKind, string> = {
  rain: 'bg-[#E9F1FD] text-[#1A4E9B]',
  event: 'bg-[#F0EDFD] text-[#4A38AE]',
  strike: 'bg-[#FFF1DF] text-[#874700]',
  memo: 'bg-[#FFF6D6] text-[#6A5100]',
  neutral: 'bg-surface text-charcoal',
  saved: 'bg-tint text-accent',
}
const TAG_ICON: Partial<Record<TagKind, string>> = {
  rain: 'rain',
  event: 'pin',
  strike: 'alert',
  memo: 'note',
  saved: 'bookmark',
}

export function Tag({ kind, children, className = '' }: { kind: TagKind; children: ReactNode; className?: string }) {
  const icon = TAG_ICON[kind]
  return (
    <span className={`inline-flex items-center gap-1 whitespace-nowrap rounded-md px-1.5 py-0.5 text-[12px] font-medium leading-5 ${TAG_STYLE[kind]} ${className}`}>
      {icon && <Icon name={icon} size={12} />}
      {children}
    </span>
  )
}

/* ───────── 카드와 컨트롤 ───────── */

export function Card({ children, className = '', id, label }: { children: ReactNode; className?: string; id?: string; label?: string }) {
  return (
    <section id={id} aria-label={label} className={`rounded-2xl border border-line bg-white ${className}`}>
      {children}
    </section>
  )
}

export function Segmented<T extends string>({
  value,
  options,
  onChange,
  label,
  size = 'md',
}: {
  value: T
  options: { value: T; label: string; short?: string; icon?: string }[]
  onChange: (v: T) => void
  label: string
  size?: 'sm' | 'md'
}) {
  return (
    <div role="group" aria-label={label} className="inline-flex rounded-lg bg-surface p-0.5">
      {options.map((o) => {
        const on = o.value === value
        return (
          <button
            key={o.value}
            type="button"
            aria-pressed={on}
            onClick={() => onChange(o.value)}
            className={`inline-flex items-center gap-1 whitespace-nowrap rounded-md font-medium transition-colors ${
              size === 'sm' ? 'px-2.5 py-1 text-[12.5px]' : 'px-3 py-1.5 text-[13px]'
            } ${on ? 'bg-white text-ink shadow-[0_1px_2px_rgba(25,31,40,0.12)]' : 'text-warmgray hover:text-ink'}`}
          >
            {o.icon && <Icon name={o.icon} size={14} />}
            {o.short ? (
              <>
                <span className="sm:hidden">{o.short}</span>
                <span className="hidden sm:inline">{o.label}</span>
              </>
            ) : (
              o.label
            )}
          </button>
        )
      })}
    </div>
  )
}

export const btn = {
  primary:
    'inline-flex items-center justify-center gap-1.5 rounded-lg bg-accent px-3.5 py-2 text-[13.5px] font-semibold text-white transition-colors hover:bg-accenthover disabled:opacity-40',
  ghost:
    'inline-flex items-center justify-center gap-1.5 rounded-lg border border-line bg-white px-3 py-1.5 text-[13px] font-medium text-charcoal transition-colors hover:border-[#CBD0D7] hover:text-ink disabled:opacity-40',
  quiet:
    'inline-flex items-center justify-center gap-1 rounded-md px-2 py-1 text-[13px] font-medium text-warmgray transition-colors hover:bg-surface hover:text-ink disabled:opacity-40',
  chip: 'inline-flex items-center gap-1 rounded-full border border-line bg-white px-3 py-1.5 text-left text-[13px] font-medium text-charcoal transition-colors hover:border-accent hover:text-accent',
}

/** 컨테이너 너비를 따라가는 차트용 훅 */
export function useWidth<T extends HTMLElement>(initial = 720): [React.RefObject<T>, number] {
  const ref = useRef<T>(null)
  const [w, setW] = useState(initial)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const update = () => setW(Math.max(280, Math.floor(el.clientWidth)))
    update()
    const ro = new ResizeObserver(update)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])
  return [ref, w]
}
