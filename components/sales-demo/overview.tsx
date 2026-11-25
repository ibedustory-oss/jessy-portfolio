'use client'

import { useMemo, useState } from 'react'
import { weekday } from '@/lib/sales-demo/calendar'
import { BRANCHES, BRANCH_IDS, TOURISM_INDEX, VIEW_END, contextFor, mealRainMm, tourismFor } from '@/lib/sales-demo/data'
import { defaultKey } from '@/lib/sales-demo/types'
import { MEAL_LABEL, baseLabel, scopeName } from '@/lib/sales-demo/analysis'
import {
  dateFull,
  dateRange,
  dateRangeWithYear,
  dateShort,
  eur,
  eurCheck,
  mm,
  monthFull,
  pctPlain,
  people,
} from '@/lib/sales-demo/format'
import { PERIODS, baseline, checkOf, findFlags, rangeSummary, rateOf, series, type Flag, type SeriesPoint } from '@/lib/sales-demo/metrics'
import { C, IndexStrip, PeriodChart, type PointMark } from './charts'
import { useDemo } from './store'
import { Card, Delta, Icon, RateDelta, Segmented, Tag, btn } from './ui'

/* ───────── 상단 ───────── */

export function Header() {
  const d = useDemo()
  return (
    <header className="border-b border-line bg-white">
      <div className="mx-auto flex max-w-[1480px] items-center gap-3 px-4 py-3 lg:px-6">
        <div aria-hidden="true" className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-ink text-[15px] font-bold text-white">
          서
        </div>
        <div className="min-w-0">
          <h1 className="truncate text-[15px] font-bold leading-5 text-ink">서울식당 파리</h1>
          <p className="truncate text-[12px] leading-4 text-warmgray">5개 지점 매출 브리핑</p>
        </div>
        <span className="shrink-0 rounded-md border border-line bg-surface px-1.5 py-0.5 text-[11.5px] font-semibold text-charcoal">데모 데이터</span>
        <div className="ml-auto flex items-center gap-1.5">
          <span className="mr-2 hidden text-[12.5px] text-warmgray xl:inline">자료 기준 {dateFull(VIEW_END)}까지 · 파리 시간</span>
          <button type="button" className={btn.ghost} onClick={() => d.setGuideOpen(!d.guideOpen)} aria-expanded={d.guideOpen}>
            <Icon name="play" size={15} />
            <span className="hidden sm:inline">3분 시연</span>
            <span className="tabular-nums text-warmgray">{d.guideDone.length}/6</span>
          </button>
          <button type="button" className={btn.ghost} onClick={d.resetDemo}>
            <Icon name="reset" size={15} />
            <span className="hidden sm:inline">데모 초기화</span>
            <span className="sr-only sm:hidden">데모 초기화</span>
          </button>
        </div>
      </div>
    </header>
  )
}

export function FilterBar() {
  const d = useDemo()
  const tabs: { id: 'all' | (typeof BRANCH_IDS)[number]; name: string; sub: string }[] = [
    { id: 'all', name: '전체 지점', sub: '5곳 합계' },
    ...BRANCHES.map((b) => ({ id: b.id, name: b.name, sub: b.concept })),
  ]
  return (
    <div className="sticky top-0 z-30 border-b border-line bg-[#F4F5F7]/95 backdrop-blur">
      <div className="mx-auto flex max-w-[1480px] flex-wrap items-center gap-x-4 gap-y-1.5 px-4 py-2 lg:px-6 lg:py-2.5">
        <nav aria-label="지점 선택" className="-mx-1 flex min-w-0 max-w-full gap-1 overflow-x-auto px-1 py-0.5">
          {tabs.map((t) => {
            const on = d.scope === t.id
            return (
              <button
                key={t.id}
                type="button"
                aria-pressed={on}
                title={t.sub}
                onClick={() => d.setScope(t.id)}
                className={`whitespace-nowrap rounded-lg px-3 py-1.5 text-[13px] font-semibold transition-colors sm:text-[13.5px] ${
                  on ? 'bg-ink text-white' : 'border border-line bg-white text-charcoal hover:border-[#CBD0D7] hover:text-ink'
                }`}
              >
                {t.name}
              </button>
            )
          })}
        </nav>
        <div className="flex w-full items-center justify-between gap-2 sm:ml-auto sm:w-auto sm:justify-end">
          <button
            type="button"
            onClick={() => d.scrollTo('sd-day')}
            className="inline-flex items-center gap-1.5 rounded-lg border border-line bg-white px-2.5 py-1.5 text-[13px] font-medium text-charcoal hover:border-[#CBD0D7]"
          >
            <span className="text-warmgray">선택일</span>
            <span className="font-semibold text-ink">{dateShort(d.date)}</span>
          </button>
          <Segmented
            label="기간"
            value={d.month ? ('' as never) : d.period}
            options={PERIODS.map((p) => ({ value: p.key, label: p.label, short: p.label.replace('최근 ', '') }))}
            onChange={(v) => d.setPeriod(v)}
          />
        </div>
      </div>
    </div>
  )
}

/* ───────── 기간 실적 ───────── */

function KpiTile({ label, value, children, hero = false }: { label: string; value: string; children: React.ReactNode; hero?: boolean }) {
  return (
    <div className="min-w-0 px-5 py-4">
      <div className="text-[13px] font-medium text-warmgray">{label}</div>
      <div className={`mt-1 font-bold tracking-tight text-ink ${hero ? 'text-[34px] leading-10' : 'text-[26px] leading-9'}`}>{value}</div>
      <div className="mt-1 space-y-0.5 text-[12.5px] leading-5 text-warmgray">{children}</div>
    </div>
  )
}

export function Kpis() {
  const d = useDemo()
  const s = useMemo(() => rangeSummary(d.scope, d.range), [d.scope, d.range])
  const check = checkOf(s.total)
  const py = s.prevYear
  const pp = s.prevPeriod
  const aligned = d.range.granularity === 'day' && d.range.month === null
  return (
    <Card label="기간 실적">
      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 border-b border-line px-5 py-3">
        <h2 className="text-[15px] font-bold text-ink">기간 실적</h2>
        <p className="text-[13px] text-charcoal">
          {scopeName(d.scope)} · {dateRangeWithYear(s.start, s.end)} ({s.days}일)
        </p>
        {s.missingDays > 0 && <Tag kind="strike">자료가 빠진 날 {s.missingDays}일 제외</Tag>}
      </div>
      <div className="grid divide-y divide-line sm:grid-cols-[1.25fr_1fr_1fr] sm:divide-x sm:divide-y-0">
        <KpiTile label="매출 (세금 포함)" value={eur(s.total.revenue)} hero>
          {py ? (
            <div>
              작년 같은 기간 대비 <Delta diff={s.total.revenue - py.total.revenue} rate={rateOf(s.total.revenue, py.total.revenue)} />
            </div>
          ) : (
            <div>작년 같은 기간: 비교할 데이터가 없어요</div>
          )}
          {pp && (
            <div>
              직전 {s.days}일 대비 <RateDelta rate={rateOf(s.total.revenue, pp.total.revenue)} />
            </div>
          )}
        </KpiTile>
        <KpiTile label="방문객 수" value={people(s.total.guests)}>
          {py && (
            <div>
              작년 대비 <RateDelta rate={rateOf(s.total.guests, py.total.guests)} /> · 작년 {people(py.total.guests)}
            </div>
          )}
          {pp && (
            <div>
              직전 {s.days}일 대비 <RateDelta rate={rateOf(s.total.guests, pp.total.guests)} />
            </div>
          )}
        </KpiTile>
        <KpiTile label="객단가" value={eurCheck(check)}>
          {py && check !== null && (
            <div>
              작년 대비 <RateDelta rate={rateOf(check, checkOf(py.total))} /> · 작년 {eurCheck(checkOf(py.total))}
            </div>
          )}
          <div>총매출 ÷ 총방문객 수</div>
        </KpiTile>
      </div>
      {py && (
        <p className="border-t border-line px-5 py-2 text-[12px] text-warmgray">
          작년 같은 기간: {dateRangeWithYear(py.start, py.end)}
          {aligned ? ' · 요일이 맞도록 364일 전과 비교해요' : ' · 같은 날짜끼리 비교해요'}
        </p>
      )}
    </Card>
  )
}

/* ───────── 확인할 날 ───────── */

function FlagRow({ f }: { f: Flag }) {
  const d = useDemo()
  const memo = d.memoFor(f.branch, f.date)
  const on = d.scope === f.branch && d.date === f.date
  return (
    <li>
      <button
        type="button"
        onClick={() => {
          d.goto(f.branch, f.date)
          d.scrollTo('sd-day')
        }}
        aria-current={on ? 'true' : undefined}
        className={`group flex w-full items-start gap-3 rounded-xl border px-3 py-2.5 text-left transition-colors ${
          on ? 'border-ink bg-white' : 'border-line bg-white hover:border-[#CBD0D7]'
        }`}
      >
        <Delta diff={f.diff} rate={f.rate} pill className="mt-0.5 text-[13px]" />
        <span className="min-w-0 flex-1">
          <span className="block text-[13.5px] font-semibold text-ink">
            {scopeName(f.branch)} · {dateShort(f.date)}
          </span>
          <span className="mt-0.5 flex flex-wrap items-center gap-1.5 text-[12.5px] text-warmgray">
            <span>
              {f.mealShare >= 0.6 ? `${MEAL_LABEL[f.meal]}에 ${pctPlain(Math.min(1, f.mealShare))}` : '점심·저녁 모두'}
            </span>
            {f.mode !== 'recent8' && <Tag kind="saved">{baseLabel(baseline(f.branch, f.date, f.mode))}</Tag>}
            {f.rainyLunch && <Tag kind="rain">점심 비 {mm(mealRainMm(f.date, 'lunch'))}</Tag>}
            {f.contexts.map((c) => (
              <Tag key={c.id} kind={c.kind}>
                {c.title}
              </Tag>
            ))}
            {memo && <Tag kind="memo">메모</Tag>}
          </span>
        </span>
        <Icon name="right" size={16} className="mt-1 text-[#9AA1AD] group-hover:text-ink" />
      </button>
    </li>
  )
}

export function Flags() {
  const d = useDemo()
  const flags = useMemo(
    () => findFlags(d.scope, d.range.start, d.range.end, (b, date) => d.defaults[defaultKey(b, weekday(date))] ?? 'recent8'),
    [d.scope, d.range, d.defaults],
  )
  const drops = flags.drops.slice(0, 3)
  const rises = flags.rises.slice(0, 2)
  const total = flags.drops.length + flags.rises.length
  const savedCount = Object.keys(d.defaults).filter((k) => d.scope === 'all' || k.startsWith(`${d.scope}:`)).length
  return (
    <Card label="확인할 날" className="px-5 py-4">
      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <h2 className="text-[15px] font-bold text-ink">확인할 날</h2>
        <p className="text-[12.5px] text-warmgray">
          {dateRange(d.range.start, d.range.end)} · 비교 기준에서 12% 이상(€180 이상) 벗어난 날 {total}건
        </p>
        {savedCount > 0 && <Tag kind="saved">저장한 기준 {savedCount}개 반영</Tag>}
      </div>
      {total === 0 ? (
        <p className="mt-3 rounded-xl bg-surface px-4 py-3 text-[13.5px] text-charcoal">이 기간에는 비교 기준에서 크게 벗어난 날이 없어요.</p>
      ) : (
        <div className="mt-3 grid gap-4 md:grid-cols-2">
          <div>
            <h3 className="mb-1.5 text-[12.5px] font-semibold text-charcoal">평소보다 낮았던 날</h3>
            {drops.length ? (
              <ul className="space-y-1.5">
                {drops.map((f) => (
                  <FlagRow key={`${f.branch}${f.date}`} f={f} />
                ))}
              </ul>
            ) : (
              <p className="text-[13px] text-warmgray">없어요.</p>
            )}
            {flags.drops.length > drops.length && <p className="mt-1.5 text-[12px] text-warmgray">외 {flags.drops.length - drops.length}건은 차액이 더 작아요.</p>}
          </div>
          <div>
            <h3 className="mb-1.5 text-[12.5px] font-semibold text-charcoal">평소보다 높았던 날</h3>
            {rises.length ? (
              <ul className="space-y-1.5">
                {rises.map((f) => (
                  <FlagRow key={`${f.branch}${f.date}`} f={f} />
                ))}
              </ul>
            ) : (
              <p className="text-[13px] text-warmgray">없어요.</p>
            )}
            {flags.rises.length > rises.length && <p className="mt-1.5 text-[12px] text-warmgray">외 {flags.rises.length - rises.length}건은 차액이 더 작아요.</p>}
          </div>
        </div>
      )}
    </Card>
  )
}

/* ───────── 기간별 매출 ───────── */

export function PeriodCard() {
  const d = useDemo()
  const [view, setView] = useState<'chart' | 'table'>('chart')
  const points = useMemo(() => series(d.scope, d.range), [d.scope, d.range])
  const gran = d.range.granularity
  const prevLabel = gran === 'month' ? '작년 같은 달' : '작년 같은 요일'

  const marks = useMemo(() => {
    const out: Record<string, PointMark> = {}
    if (gran !== 'day') return out
    for (const p of points) {
      const ctx = contextFor(d.scope, p.start)
      const memos = d.memos.filter((m) => m.date === p.start && (d.scope === 'all' || m.branch === d.scope))
      if (ctx.length === 0 && memos.length === 0) continue
      out[p.key] = {
        context: ctx.length > 0,
        memo: memos.length > 0,
        labels: [...ctx.map((c) => `◆ ${c.title} · ${c.scope}`), ...memos.map((m) => `● 메모 (${scopeName(m.branch)})`)],
      }
    }
    return out
  }, [points, gran, d.scope, d.memos])

  const pick = (p: SeriesPoint) => {
    if (gran === 'month') {
      d.drillMonth(p.key)
      return
    }
    d.setDate(p.start, { push: true })
    const el = document.getElementById('sd-day')
    if (el && el.getBoundingClientRect().top > window.innerHeight * 0.75) d.scrollTo('sd-day')
  }

  const periodLabel = PERIODS.find((p) => p.key === d.period)?.label ?? ''
  const hasMissing = points.some((p) => p.revenue === null)

  return (
    <Card label="기간별 매출" className="px-5 py-4">
      <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
        <div className="min-w-0">
          <h2 className="text-[15px] font-bold text-ink">기간별 매출</h2>
          <p className="mt-0.5 flex flex-wrap items-center gap-1 text-[13px] text-charcoal">
            <span>{scopeName(d.scope)}</span>
            <span aria-hidden="true">·</span>
            {d.month ? (
              <>
                <span>{periodLabel}</span>
                <Icon name="right" size={13} className="text-[#9AA1AD]" />
                <span className="font-semibold text-ink">{monthFull(d.month)}</span>
                <span className="text-warmgray">({dateRange(d.range.start, d.range.end)})</span>
              </>
            ) : (
              <span>
                {periodLabel} · {gran === 'month' ? '월별' : '일별'} · {dateRangeWithYear(d.range.start, d.range.end)}
              </span>
            )}
          </p>
        </div>
        <div className="ml-auto flex items-center gap-2">
          {d.canBack && (
            <button type="button" className={btn.ghost} onClick={d.back}>
              <Icon name="back" size={15} />
              이전 화면
            </button>
          )}
          <Segmented
            label="보기 방식"
            size="sm"
            value={view}
            options={[
              { value: 'chart', label: '그래프', icon: 'chart' },
              { value: 'table', label: '표', icon: 'table' },
            ]}
            onChange={setView}
          />
        </div>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-[12.5px] text-charcoal">
        <span className="inline-flex items-center gap-1.5">
          <span className="inline-block h-2.5 w-2.5 rounded-[3px]" style={{ background: C.bar }} />
          매출
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="relative inline-block h-0.5 w-5 rounded" style={{ background: C.line }}>
            <span className="absolute left-1/2 top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full" style={{ background: C.line }} />
          </span>
          {gran === 'month' ? '작년 같은 달 (같은 날짜 범위)' : '작년 같은 요일 (364일 전)'}
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="inline-block h-0 w-0 border-x-4 border-t-[5px] border-x-transparent" style={{ borderTopColor: C.barSelected }} />
          선택일
        </span>
        {gran === 'day' && (
          <>
            <span className="inline-flex items-center gap-1.5">
              <span className="inline-block h-2 w-2 rotate-45" style={{ background: C.context }} />
              행사·이슈
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="inline-block h-2 w-2 rounded-full" style={{ background: C.memo }} />
              점주 메모
            </span>
          </>
        )}
        {hasMissing && (
          <span className="inline-flex items-center gap-1.5">
            <span className="inline-block h-2.5 w-2.5 rounded-[2px] bg-[repeating-linear-gradient(45deg,#C5CAD1_0_2px,#F3F5F7_2px_5px)]" />
            자료 누락 (매출 0과 다름)
          </span>
        )}
      </div>

      {view === 'chart' ? (
        <div className="mt-2">
          <PeriodChart
            points={points}
            granularity={gran}
            selected={d.date}
            onPick={pick}
            marks={marks}
            prevLabel={prevLabel}
            ariaLabel={`${scopeName(d.scope)} ${gran === 'month' ? '월별' : '일별'} 매출과 작년 실적`}
          />
          {gran === 'month' && (
            <div className="mt-1 border-t border-line pt-3">
              <div className="flex flex-wrap items-baseline gap-x-2 text-[12.5px]">
                <h3 className="font-semibold text-ink">{TOURISM_INDEX.name}</h3>
                <span className="text-warmgray">
                  월별 · {monthFull(TOURISM_INDEX.baseMonth)} = 100 · 출처: {TOURISM_INDEX.source}
                </span>
              </div>
              <IndexStrip values={points.map((p) => tourismFor(p.key))} labels={points.map((p) => monthFull(p.key))} />
              <p className="text-[12px] text-warmgray">월 단위 지표예요. 매출과 축을 따로 쓰고, 하루 매출이 달라진 원인으로는 쓰지 않아요.</p>
            </div>
          )}
        </div>
      ) : (
        <div className="mt-3 max-h-[340px] overflow-auto rounded-xl border border-line">
          <table className="w-full min-w-[520px] border-collapse text-[13px]">
            <caption className="sr-only">
              {scopeName(d.scope)} {gran === 'month' ? '월별' : '일별'} 매출 표
            </caption>
            <thead className="sticky top-0 bg-surface text-left text-[12px] text-warmgray">
              <tr>
                <th scope="col" className="px-3 py-2 font-semibold">
                  {gran === 'month' ? '월' : '날짜'}
                </th>
                <th scope="col" className="px-3 py-2 text-right font-semibold">
                  매출
                </th>
                <th scope="col" className="px-3 py-2 text-right font-semibold">
                  {prevLabel}
                </th>
                <th scope="col" className="px-3 py-2 text-right font-semibold">
                  차이
                </th>
              </tr>
            </thead>
            <tbody className="tabular-nums">
              {points.map((p) => {
                const sel = d.date >= p.start && d.date <= p.end
                return (
                  <tr key={p.key} className={`border-t border-line ${sel ? 'bg-tint' : ''}`}>
                    <th scope="row" className="px-3 py-1.5 text-left font-medium">
                      <button type="button" onClick={() => pick(p)} className="text-left text-ink underline-offset-2 hover:underline">
                        {gran === 'month' ? `${monthFull(p.key)}${p.partial ? ` (${dateRange(p.start, p.end)})` : ''}` : dateFull(p.start)}
                      </button>
                      {sel && <span className="ml-2 text-[11.5px] font-semibold text-accent">선택일</span>}
                    </th>
                    <td className="px-3 py-1.5 text-right text-ink">
                      {p.revenue === null ? '자료 누락' : p.status === 'closed' ? '휴무 (€0)' : eur(p.revenue)}
                    </td>
                    <td className="px-3 py-1.5 text-right text-charcoal">{p.prev === null ? '–' : eur(p.prev)}</td>
                    <td className="px-3 py-1.5 text-right">
                      {p.revenue === null || p.prev === null || p.status === 'closed' ? (
                        <span className="text-warmgray">–</span>
                      ) : (
                        <Delta diff={p.revenue - p.prev} rate={rateOf(p.revenue, p.prev)} />
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </Card>
  )
}
