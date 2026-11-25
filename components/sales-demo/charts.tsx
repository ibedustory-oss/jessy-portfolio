'use client'

import { useState, type KeyboardEvent, type ReactNode } from 'react'
import { WEEKDAY_KO, parts, weekday, type ISODate } from '@/lib/sales-demo/calendar'
import { mealOfHour } from '@/lib/sales-demo/data'
import { count, dateFull, dateRangeWithYear, eur, eurAxis, eurCheck, eurDiff, monthFull, pct, tablesText } from '@/lib/sales-demo/format'
import { checkOf, perTable, rateOf, type HourComparison, type SeriesPoint } from '@/lib/sales-demo/metrics'
import { useWidth } from './ui'

/* 차트 색 — 한 계열은 한 색, 비교값은 중립 회색 선 */
export const C = {
  bar: '#519CED',
  barHover: '#257DE0',
  barSelected: '#0F4A96',
  barDay: '#257DE0',
  line: '#3D4654',
  grid: '#E9EBEF',
  axis: '#C5CAD1',
  tick: '#646D7B',
  ink: '#191F28',
  memo: '#D9A400',
  context: '#6A4CE2',
}

function niceScale(max: number, target = 4): { max: number; step: number } {
  if (max <= 0) return { max: 1, step: 1 }
  // 눈금이 target+1개를 넘지 않는 가장 촘촘한 깔끔한 간격
  const pow = Math.pow(10, Math.floor(Math.log10(max / (target + 1))))
  const step = [1, 2, 2.5, 5, 10, 20].map((m) => m * pow).find((c) => Math.ceil(max / c) <= target + 1) ?? 20 * pow
  return { step, max: Math.ceil(max / step) * step }
}

function topRounded(x: number, y: number, w: number, h: number, r: number): string {
  const rr = Math.max(0, Math.min(r, w / 2, h))
  return `M${x},${y + h}V${y + rr}Q${x},${y} ${x + rr},${y}H${x + w - rr}Q${x + w},${y} ${x + w},${y + rr}V${y + h}Z`
}

/** 가리키는 막대를 덮지 않도록 막대 옆에 놓는다 */
function Tooltip({ x, gap, width, children }: { x: number; gap: number; width: number; children: ReactNode }) {
  const W = 220
  const raw = x < width / 2 ? x + gap + 8 : x - gap - 8 - W
  const left = Math.min(Math.max(raw, 4), Math.max(4, width - W - 4))
  return (
    <div
      role="presentation"
      className="pointer-events-none absolute top-0 z-10 w-[220px] rounded-xl border border-line bg-white px-3 py-2.5 text-[12.5px] leading-5 text-charcoal shadow-[0_8px_24px_-8px_rgba(25,31,40,0.25)]"
      style={{ left }}
    >
      {children}
    </div>
  )
}

function TipRow({ label, value, mark }: { label: string; value: ReactNode; mark?: 'bar' | 'line' }) {
  return (
    <div className="flex items-baseline justify-between gap-3">
      <span className="inline-flex items-center gap-1.5 text-warmgray">
        {mark === 'bar' && <span className="inline-block h-2.5 w-2.5 rounded-[3px]" style={{ background: C.barDay }} />}
        {mark === 'line' && <span className="inline-block h-0.5 w-3 rounded" style={{ background: C.line }} />}
        {label}
      </span>
      <span className="font-semibold tabular-nums text-ink">{value}</span>
    </div>
  )
}

/* ───────── 기간별 매출 ───────── */

export interface PointMark {
  memo: boolean
  context: boolean
  labels: string[]
}

export function PeriodChart({
  points,
  granularity,
  selected,
  onPick,
  marks,
  prevLabel,
  ariaLabel,
}: {
  points: SeriesPoint[]
  granularity: 'day' | 'month'
  selected: ISODate
  onPick: (p: SeriesPoint) => void
  marks: Record<string, PointMark>
  prevLabel: string
  ariaLabel: string
}) {
  const [ref, width] = useWidth<HTMLDivElement>(760)
  const [active, setActive] = useState<number | null>(null)
  const n = points.length
  const H = 250
  const m = { l: 50, r: 10, t: 18, b: 50 }
  const iw = Math.max(40, width - m.l - m.r)
  const ih = H - m.t - m.b
  const maxV = Math.max(1, ...points.map((p) => Math.max(p.revenue ?? 0, p.prev ?? 0))) / 100
  const scale = niceScale(maxV)
  const compact = scale.max >= 10000
  const y = (cents: number) => m.t + ih - (cents / 100 / scale.max) * ih
  const slot = iw / n
  const barW = Math.max(2, Math.min(24, slot - (slot > 6 ? 2 : 1)))
  const cx = (i: number) => m.l + slot * i + slot / 2
  const ticks: number[] = []
  for (let v = 0; v <= scale.max + 1e-9; v += scale.step) ticks.push(v)

  const isSelected = (p: SeriesPoint) => selected >= p.start && selected <= p.end
  const showDots = n <= 31

  const label = (p: SeriesPoint, i: number): { top: string; bottom?: string } | null => {
    const d = parts(p.start)
    if (granularity === 'month') {
      if (slot < 30 && i % 2 === 1) return null
      return { top: `${d.m}월`, bottom: p.partial ? `${p.days}일치` : d.m === 1 ? `${d.y}` : undefined }
    }
    const dow = weekday(p.start)
    if (n <= 10) return { top: `${d.m}/${d.d}`, bottom: WEEKDAY_KO[dow] }
    if (n <= 31) return dow === 1 || i === 0 ? { top: `${d.m}/${d.d}`, bottom: i === 0 && dow !== 1 ? undefined : '월' } : null
    return d.d === 1 || d.d === 15 || i === 0 ? { top: `${d.m}/${d.d}` } : null
  }

  // 전년 선: 값이 있는 구간만 잇는다
  const segments: string[] = []
  let cur: string[] = []
  points.forEach((p, i) => {
    if (p.prev === null) {
      if (cur.length) segments.push(cur.join(' '))
      cur = []
    } else cur.push(`${cx(i)},${y(p.prev)}`)
  })
  if (cur.length) segments.push(cur.join(' '))

  const onKey = (e: KeyboardEvent<HTMLDivElement>) => {
    const start = active ?? Math.max(0, points.findIndex(isSelected))
    if (e.key === 'ArrowRight') setActive(Math.min(n - 1, start + (active === null ? 0 : 1)))
    else if (e.key === 'ArrowLeft') setActive(Math.max(0, start - (active === null ? 0 : 1)))
    else if (e.key === 'Home') setActive(0)
    else if (e.key === 'End') setActive(n - 1)
    else if (e.key === 'Enter' || e.key === ' ') {
      if (active !== null) onPick(points[active])
    } else if (e.key === 'Escape') setActive(null)
    else return
    e.preventDefault()
  }

  const ap = active !== null ? points[active] : null
  const title = (p: SeriesPoint) =>
    granularity === 'month'
      ? `${monthFull(p.key)}${p.partial ? ` · ${dateRangeWithYear(p.start, p.end).replace(/^\d+년 /, '')} (${p.days}일)` : ''}`
      : dateFull(p.start)
  const describe = (p: SeriesPoint) =>
    `${title(p)}, 매출 ${p.revenue === null ? '기록 없음' : eur(p.revenue)}, ${prevLabel} ${p.prev === null ? '기록 없음' : eur(p.prev)}`

  return (
    <div
      ref={ref}
      className="relative outline-none focus-visible:rounded-xl focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
      tabIndex={0}
      role="group"
      aria-label={`${ariaLabel}. 좌우 화살표로 옮기고 Enter로 고르세요.`}
      onKeyDown={onKey}
      onBlur={() => setActive(null)}
      onMouseLeave={() => setActive(null)}
    >
      <svg width={width} height={H} role="img" aria-label={ariaLabel} className="block select-none">
        <defs>
          <pattern id="sd-hatch" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <rect width="6" height="6" fill="#F3F5F7" />
            <rect width="2" height="6" fill="#C5CAD1" />
          </pattern>
        </defs>
        {ticks.map((t) => (
          <g key={t}>
            <line x1={m.l} x2={width - m.r} y1={y(t * 100)} y2={y(t * 100)} stroke={t === 0 ? C.axis : C.grid} strokeWidth={1} />
            <text x={m.l - 8} y={y(t * 100) + 4} textAnchor="end" fontSize={11.5} fill={C.tick} style={{ fontVariantNumeric: 'tabular-nums' }}>
              {eurAxis(t * 100, compact)}
            </text>
          </g>
        ))}
        {points.map((p, i) => {
          const sel = isSelected(p)
          const on = active === i
          const x = cx(i) - barW / 2
          const hasData = p.revenue !== null
          const closed = p.status === 'closed'
          const top = hasData ? y(p.revenue as number) : y(0)
          return (
            <g key={p.key}>
              {on && <rect x={m.l + slot * i} y={m.t - 6} width={slot} height={ih + 6} fill="#F3F5F7" />}
              {hasData && !closed && (p.revenue as number) > 0 && (
                <path d={topRounded(x, top, barW, y(0) - top, 4)} fill={sel ? C.barSelected : on ? C.barHover : C.bar} />
              )}
              {!hasData && <rect x={x} y={y(0) - 22} width={barW} height={22} fill="url(#sd-hatch)" rx={2} />}
              {closed && (
                <text x={cx(i)} y={y(0) - 5} textAnchor="middle" fontSize={10} fill={C.tick}>
                  {slot > 22 ? '쉼' : '·'}
                </text>
              )}
              {sel && hasData && <path d={`M${cx(i) - 4},${top - 10}h8l-4,5z`} fill={C.barSelected} />}
            </g>
          )
        })}
        {segments.map((s, i) => (
          <polyline key={i} points={s} fill="none" stroke={C.line} strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />
        ))}
        {points.map((p, i) =>
          p.prev !== null && (showDots || active === i) ? (
            <circle key={p.key} cx={cx(i)} cy={y(p.prev)} r={showDots ? 4 : 4.5} fill={C.line} stroke="#fff" strokeWidth={2} />
          ) : null,
        )}
        {points.map((p, i) => {
          const l = label(p, i)
          const sel = isSelected(p)
          const mk = marks[p.key]
          return (
            <g key={p.key}>
              {l && (
                <>
                  <text x={cx(i)} y={H - m.b + 16} textAnchor="middle" fontSize={11.5} fontWeight={sel ? 700 : 400} fill={sel ? C.ink : C.tick}>
                    {l.top}
                  </text>
                  {l.bottom && (
                    <text x={cx(i)} y={H - m.b + 30} textAnchor="middle" fontSize={11} fontWeight={sel ? 700 : 400} fill={sel ? C.ink : C.tick}>
                      {l.bottom}
                    </text>
                  )}
                </>
              )}
              {mk?.context && <path d={`M${cx(i)},${H - 13}l4,4l-4,4l-4,-4z`} fill={C.context} />}
              {mk?.memo && <circle cx={cx(i) + (mk.context ? 9 : 0)} cy={H - 9} r={3.5} fill={C.memo} />}
            </g>
          )
        })}
        {points.map((p, i) => (
          <rect
            key={p.key}
            x={m.l + slot * i}
            y={m.t - 6}
            width={slot}
            height={H - m.t + 6}
            fill="transparent"
            className="cursor-pointer"
            onMouseEnter={() => setActive(i)}
            onClick={() => onPick(p)}
          />
        ))}
      </svg>
      {ap && active !== null && (
        <Tooltip x={cx(active)} gap={Math.max(barW, 12) / 2 + 4} width={width}>
          <div className="mb-1 font-semibold text-ink">{title(ap)}</div>
          {ap.revenue === null ? (
            <div>이날은 매출 기록이 없어요</div>
          ) : (
            <>
              <TipRow mark="bar" label="매출" value={ap.status === 'closed' ? '쉬는 날 (€0)' : eur(ap.revenue)} />
              <TipRow mark="line" label={prevLabel} value={ap.prev === null ? '기록 없음' : eur(ap.prev)} />
              {ap.prev !== null && ap.status !== 'closed' && (
                <TipRow label="차이" value={`${eurDiff(ap.revenue - ap.prev)} (${pct(rateOf(ap.revenue, ap.prev))})`} />
              )}
            </>
          )}
          {granularity === 'day' && <div className="mt-1 text-[11.5px] text-warmgray">작년에 비교한 날 {dateFull(ap.prevStart)}</div>}
          {ap.status === 'partial' && <div className="mt-1 text-[11.5px] text-[#874700]">일부 지점이나 날짜의 기록이 빠져 있어요</div>}
          {marks[ap.key]?.labels.map((t) => (
            <div key={t} className="mt-1 text-[11.5px] text-charcoal">
              {t}
            </div>
          ))}
          <div className="mt-1.5 text-[11.5px] text-accent">{granularity === 'month' ? '누르면 날짜별로 볼 수 있어요' : '누르면 이날을 자세히 볼 수 있어요'}</div>
        </Tooltip>
      )}
      <div className="sr-only" aria-live="polite">
        {ap ? describe(ap) : ''}
      </div>
    </div>
  )
}

/* ───────── 시간대별 ───────── */

export type HourMetric = 'revenue' | 'guests'

export function HourlyChart({
  hours,
  metric,
  baseName,
  baseWord,
  rain,
  ariaLabel,
}: {
  hours: HourComparison[]
  metric: HourMetric
  baseName: string
  /** ‘평소’ 또는 ‘작년’ */
  baseWord: string
  /** 시각별 강수량(mm) — hours와 같은 순서 */
  rain: number[]
  ariaLabel: string
}) {
  const [ref, width] = useWidth<HTMLDivElement>(640)
  const [active, setActive] = useState<number | null>(null)
  const H = 286
  const m = { l: 50, r: 10, t: 26, b: 76 }
  const iw = Math.max(40, width - m.l - m.r)
  const ih = H - m.t - m.b
  const gap = Math.min(36, iw * 0.06)
  const slot = (iw - gap) / hours.length
  const cx = (i: number) => m.l + slot * i + slot / 2 + (mealOfHour(hours[i].hour) === 'dinner' ? gap : 0)
  const val = (t: { revenue: number; guests: number } | null): number | null =>
    t === null ? null : metric === 'revenue' ? t.revenue / 100 : t.guests
  const maxV = Math.max(1, ...hours.map((h) => Math.max(val(h.actual) ?? 0, val(h.base) ?? 0)))
  const scale = niceScale(maxV)
  const y = (v: number) => m.t + ih - (v / scale.max) * ih
  const ticks: number[] = []
  for (let v = 0; v <= scale.max + 1e-9; v += scale.step) ticks.push(v)
  const barW = Math.min(24, slot * 0.5)
  const hasBase = hours.some((h) => h.base !== null)
  const fmt = (v: number) => (metric === 'revenue' ? eurAxis(v * 100, false) : `${count(v)}`)

  const lineOf = (meal: 'lunch' | 'dinner') =>
    hours
      .map((h, i) => ({ h, i }))
      .filter((x) => mealOfHour(x.h.hour) === meal && x.h.base !== null)
      .map((x) => `${cx(x.i)},${y(val(x.h.base) as number)}`)
      .join(' ')

  // 차이가 가장 큰 시간 하나에만 값을 직접 적는다
  let peak = -1
  if (hasBase) {
    let best = 0
    hours.forEach((h, i) => {
      const d = Math.abs((val(h.actual) ?? 0) - (val(h.base) ?? 0))
      if (d > best) {
        best = d
        peak = i
      }
    })
    if (best < (metric === 'revenue' ? 20 : 2)) peak = -1
  }

  const firstDinner = hours.findIndex((h) => mealOfHour(h.hour) === 'dinner')
  const lunchMid = (cx(0) + cx(firstDinner - 1)) / 2
  const dinnerMid = (cx(firstDinner) + cx(hours.length - 1)) / 2

  const onKey = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'ArrowRight') setActive(active === null ? 0 : Math.min(hours.length - 1, active + 1))
    else if (e.key === 'ArrowLeft') setActive(active === null ? hours.length - 1 : Math.max(0, active - 1))
    else if (e.key === 'Escape') setActive(null)
    else return
    e.preventDefault()
  }

  const ah = active !== null ? hours[active] : null
  const describe = (h: HourComparison) =>
    `${h.hour}시, 매출 ${eur(h.actual.revenue)}, 손님 ${h.actual.guests}명${h.base ? `, ${baseWord} ${eur(h.base.revenue)}, 차이 ${eurDiff(h.diff ?? 0)}` : ''}`

  return (
    <div
      ref={ref}
      className="relative outline-none focus-visible:rounded-xl focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
      tabIndex={0}
      role="group"
      aria-label={`${ariaLabel}. 좌우 화살표로 시간대를 옮기세요.`}
      onKeyDown={onKey}
      onBlur={() => setActive(null)}
      onMouseLeave={() => setActive(null)}
    >
      <svg width={width} height={H} role="img" aria-label={ariaLabel} className="block select-none">
        {ticks.map((t) => (
          <g key={t}>
            <line x1={m.l} x2={width - m.r} y1={y(t)} y2={y(t)} stroke={t === 0 ? C.axis : C.grid} strokeWidth={1} />
            <text x={m.l - 8} y={y(t) + 4} textAnchor="end" fontSize={11.5} fill={C.tick} style={{ fontVariantNumeric: 'tabular-nums' }}>
              {fmt(t)}
            </text>
          </g>
        ))}
        {hours.map((h, i) => {
          const v = val(h.actual) ?? 0
          const top = y(v)
          return (
            <g key={h.hour}>
              {active === i && <rect x={cx(i) - slot / 2} y={m.t - 10} width={slot} height={ih + 10} fill="#F3F5F7" />}
              {v > 0 && <path d={topRounded(cx(i) - barW / 2, top, barW, y(0) - top, 4)} fill={active === i ? C.barSelected : C.barDay} />}
            </g>
          )
        })}
        {hasBase &&
          (['lunch', 'dinner'] as const).map((meal) => (
            <polyline key={meal} points={lineOf(meal)} fill="none" stroke={C.line} strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />
          ))}
        {hours.map((h, i) =>
          h.base !== null ? <circle key={h.hour} cx={cx(i)} cy={y(val(h.base) as number)} r={4.5} fill={C.line} stroke="#fff" strokeWidth={2} /> : null,
        )}
        {peak >= 0 &&
          (() => {
            const h = hours[peak]
            const a = val(h.actual) ?? 0
            const b = val(h.base) ?? 0
            const d = a - b
            const text = metric === 'revenue' ? eurDiff(d * 100) : `${d > 0 ? '+' : '−'}${count(Math.abs(d))}명`
            return (
              <text x={cx(peak)} y={y(Math.max(a, b)) - 12} textAnchor="middle" fontSize={12.5} fontWeight={700} fill={C.ink}>
                {text}
              </text>
            )
          })()}
        {hours.map((h, i) => (
          <g key={h.hour}>
            <text x={cx(i)} y={H - m.b + 17} textAnchor="middle" fontSize={12} fill={C.tick}>
              {h.hour}시
            </text>
            <text x={cx(i)} y={H - 10} textAnchor="middle" fontSize={11.5} fill={rain[i] > 0 ? '#1A4E9B' : '#9AA1AD'} fontWeight={rain[i] > 0 ? 600 : 400}>
              {rain[i] > 0 ? `☂ ${rain[i].toFixed(1)}` : '–'}
            </text>
          </g>
        ))}
        <text x={lunchMid} y={H - m.b + 35} textAnchor="middle" fontSize={11.5} fontWeight={600} fill={C.ink}>
          점심
        </text>
        <text x={dinnerMid} y={H - m.b + 35} textAnchor="middle" fontSize={11.5} fontWeight={600} fill={C.ink}>
          저녁
        </text>
        <line x1={cx(0) - slot / 2 + 6} x2={cx(firstDinner - 1) + slot / 2 - 6} y1={H - m.b + 22} y2={H - m.b + 22} stroke={C.grid} />
        <line x1={cx(firstDinner) - slot / 2 + 6} x2={cx(hours.length - 1) + slot / 2 - 6} y1={H - m.b + 22} y2={H - m.b + 22} stroke={C.grid} />
        <text x={m.l - 8} y={H - 10} textAnchor="end" fontSize={11} fill={C.tick}>
          비 mm
        </text>
        {hours.map((h, i) => (
          <rect
            key={h.hour}
            x={cx(i) - slot / 2}
            y={m.t - 10}
            width={slot}
            height={H - m.t + 10}
            fill="transparent"
            onMouseEnter={() => setActive(i)}
          />
        ))}
      </svg>
      {ah && active !== null && (
        <Tooltip x={cx(active)} gap={Math.max(barW, 12) / 2 + 4} width={width}>
          <div className="mb-1 font-semibold text-ink">
            {ah.hour}:00~{ah.hour}:59
          </div>
          <TipRow mark="bar" label="매출" value={eur(ah.actual.revenue)} />
          {ah.base && <TipRow mark="line" label={baseWord} value={eur(ah.base.revenue)} />}
          {ah.diff !== null && <TipRow label="차이" value={eurDiff(ah.diff)} />}
          <div className="my-1.5 border-t border-line" />
          <TipRow label="손님" value={`${ah.actual.guests}명${ah.base ? ` · ${baseWord} ${Math.round(ah.base.guests)}명` : ''}`} />
          <TipRow label="1명당" value={`${eurCheck(checkOf(ah.actual))}${ah.base ? ` · ${baseWord} ${eurCheck(checkOf(ah.base))}` : ''}`} />
          <TipRow label="테이블" value={`${tablesText(ah.actual.tables)}${ah.base ? ` · ${baseWord} ${tablesText(ah.base.tables)}` : ''}`} />
          <TipRow label="테이블당" value={`${eurCheck(perTable(ah.actual))}${ah.base ? ` · ${baseWord} ${eurCheck(perTable(ah.base))}` : ''}`} />
          {rain[active] > 0 && <div className="mt-1 text-[11.5px] text-[#1A4E9B]">비 {rain[active].toFixed(1)}mm</div>}
          {ah.base && <div className="mt-1 text-[11.5px] text-warmgray">{baseName}</div>}
        </Tooltip>
      )}
      <div className="sr-only" aria-live="polite">
        {ah ? describe(ah) : ''}
      </div>
    </div>
  )
}

/* ───────── 월별 지수: 매출과 축을 섞지 않고 따로 그린다 ───────── */

export function IndexStrip({ values, labels }: { values: (number | null)[]; labels: string[] }) {
  const [ref, width] = useWidth<HTMLDivElement>(760)
  const H = 64
  const m = { l: 50, r: 10, t: 10, b: 22 }
  const iw = Math.max(40, width - m.l - m.r)
  const nums = values.filter((v): v is number => v !== null)
  const lo = Math.min(...nums) - 6
  const hi = Math.max(...nums) + 6
  const slot = iw / values.length
  const cx = (i: number) => m.l + slot * i + slot / 2
  const y = (v: number) => m.t + (H - m.t - m.b) * (1 - (v - lo) / (hi - lo))
  const pts = values.map((v, i) => (v === null ? null : `${cx(i)},${y(v)}`)).filter(Boolean).join(' ')
  return (
    <div ref={ref}>
      <svg width={width} height={H} role="img" aria-label={`월별 관광객 지수: ${labels.map((l, i) => `${l} ${values[i] ?? '없음'}`).join(', ')}`} className="block">
        <polyline points={pts} fill="none" stroke="#9AA1AD" strokeWidth={1.5} />
        {values.map((v, i) =>
          v === null ? null : (
            <g key={i}>
              <circle cx={cx(i)} cy={y(v)} r={3} fill="#646D7B" stroke="#fff" strokeWidth={1.5} />
              <text x={cx(i)} y={H - 5} textAnchor="middle" fontSize={11.5} fill={C.tick} style={{ fontVariantNumeric: 'tabular-nums' }}>
                {v}
              </text>
            </g>
          ),
        )}
      </svg>
    </div>
  )
}
