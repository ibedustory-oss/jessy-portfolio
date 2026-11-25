'use client'

import { useEffect, useMemo, useState } from 'react'
import { weekday } from '@/lib/sales-demo/calendar'
import {
  BRANCH_IDS,
  DEMO_SOURCE,
  TOURISM_INDEX,
  VIEW_END,
  VIEW_START,
  branchById,
  contextFor,
  mealRainMm,
  rainMm,
  tourismFor,
  type BranchId,
} from '@/lib/sales-demo/data'
import {
  BACKGROUND_CAVEAT,
  MEAL_HOURS,
  MEAL_LABEL,
  analyze,
  baseLabel,
  modeHint,
  modeLabel,
  ruleLabel,
  scopeName,
} from '@/lib/sales-demo/analysis'
import {
  dateFull,
  dateMD,
  dateShort,
  eur,
  eurCheck,
  mm,
  monthFull,
  people,
  weekdayName,
} from '@/lib/sales-demo/format'
import {
  COMPARE_MODES,
  branchRanking,
  checkOf,
  compare,
  type CompareMode,
  type Comparison,
  type MealComparison,
} from '@/lib/sales-demo/metrics'
import { C, HourlyChart, type HourMetric } from './charts'
import { useDemo } from './store'
import { Card, Delta, Icon, Segmented, Tag, TONE_BG, TONE_TEXT, btn, toneOf } from './ui'

/* ───────── 비교 기준 선택 ───────── */

function CompareControl({ c }: { c: Comparison }) {
  const d = useDemo()
  const [confirm, setConfirm] = useState(false)
  const dow = weekday(d.date)
  const w = weekdayName(d.date)
  const branch = d.scope === 'all' ? null : d.scope
  const startMode: CompareMode = d.savedMode ?? 'recent8'
  const canSave = branch !== null && d.mode !== startMode
  useEffect(() => setConfirm(false), [d.mode, d.scope, d.date])

  return (
    <div className="rounded-xl bg-surface px-3.5 py-3">
      <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
        <label htmlFor="sd-compare" className="text-[13px] font-semibold text-ink">
          비교 기준
        </label>
        <div className="relative">
          <select
            id="sd-compare"
            value={d.mode}
            onChange={(e) => d.setMode(e.target.value as CompareMode)}
            className="appearance-none rounded-lg border border-line bg-white py-1.5 pl-3 pr-8 text-[13.5px] font-medium text-ink hover:border-[#CBD0D7]"
          >
            {COMPARE_MODES.map((m) => (
              <option key={m} value={m}>
                {modeLabel(m, d.date)}
              </option>
            ))}
          </select>
          <Icon name="down" size={15} className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-warmgray" />
        </div>
        {d.usingSaved && branch && (
          <>
            <Tag kind="saved">
              {branchById(branch).name} {w} 기본값
            </Tag>
            <button type="button" className={btn.quiet} onClick={() => d.removeDefault(branch, dow)}>
              해제
            </button>
          </>
        )}
        {branch && d.savedMode && !d.usingSaved && d.mode !== d.savedMode && (
          <button type="button" className={btn.quiet} onClick={() => d.setMode(d.savedMode as CompareMode)}>
            저장된 기본값으로
          </button>
        )}
        {canSave && !confirm && (
          <button type="button" className={`${btn.ghost} ml-auto`} onClick={() => setConfirm(true)}>
            <Icon name="bookmark" size={14} />이 지점 {w} 기본값으로
          </button>
        )}
      </div>
      <p className="mt-1.5 text-[12.5px] leading-5 text-charcoal">
        {c.base.available ? (
          <>
            <span className="font-semibold text-ink">{baseLabel(c.base)}</span>
            {(d.mode === 'recent8' || d.mode === 'weather') && <> · 비교한 날 {c.base.days.length}일</>}
            {c.base.referenceOnly && <span className="ml-1.5 rounded bg-[#FFF1DF] px-1.5 py-0.5 text-[11.5px] font-semibold text-[#874700]">참고용</span>}
            <span className="text-warmgray"> · {modeHint(d.mode)}</span>
          </>
        ) : (
          <span className="font-semibold text-ink">비교할 데이터가 없어요</span>
        )}
        {d.scope === 'all' && c.base.available && <span className="text-warmgray"> 지점마다 같은 규칙을 적용해 합산했어요.</span>}
      </p>
      {confirm && branch && (
        <div className="mt-2.5 rounded-xl border border-accent/30 bg-white px-3.5 py-3">
          <p className="text-[12.5px] text-warmgray">기본값 미리보기</p>
          <p className="mt-0.5 text-[14px] font-semibold text-ink">{ruleLabel(branch, dow, d.mode)}</p>
          <p className="mt-0.5 text-[12.5px] text-charcoal">다시 들어와도 유지돼요. 다른 지점과 요일에는 적용되지 않아요.</p>
          <div className="mt-2.5 flex gap-2">
            <button
              type="button"
              className={btn.primary}
              onClick={() => {
                d.saveDefault(branch, dow, d.mode)
                setConfirm(false)
              }}
            >
              기본값으로 저장
            </button>
            <button type="button" className={btn.ghost} onClick={() => setConfirm(false)}>
              취소
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

/* ───────── 하루·점심·저녁 요약 ───────── */

function StatTile({ label, sub, revenue, diff, rate, guests, baseGuests, check, baseCheck }: {
  label: string
  sub?: string
  revenue: number
  diff: number | null
  rate: number | null
  guests: number
  baseGuests: number | null
  check: number | null
  baseCheck: number | null
}) {
  return (
    <div className="min-w-0 rounded-xl border border-line px-4 py-3">
      <div className="flex items-baseline gap-1.5 text-[12.5px]">
        <span className="font-semibold text-ink">{label}</span>
        {sub && <span className="text-warmgray">{sub}</span>}
      </div>
      <div className="mt-1 flex flex-wrap items-baseline gap-x-2">
        <span className="text-[24px] font-bold leading-8 tracking-tight text-ink">{eur(revenue)}</span>
        {diff !== null && <Delta diff={diff} rate={rate} className="text-[13px]" />}
      </div>
      <dl className="mt-1.5 grid grid-cols-[auto_1fr] gap-x-2 gap-y-0.5 text-[12.5px] leading-5 text-charcoal">
        <dt className="text-warmgray">방문객</dt>
        <dd className="tabular-nums">
          {people(guests)}
          {baseGuests !== null && <span className="text-warmgray"> · 비교 {people(baseGuests)}</span>}
        </dd>
        <dt className="text-warmgray">객단가</dt>
        <dd className="tabular-nums">
          {eurCheck(check)}
          {baseCheck !== null && <span className="text-warmgray"> · 비교 {eurCheck(baseCheck)}</span>}
        </dd>
      </dl>
    </div>
  )
}

function mealTile(m: MealComparison) {
  return (
    <StatTile
      label={MEAL_LABEL[m.meal]}
      sub={MEAL_HOURS[m.meal]}
      revenue={m.actual.revenue}
      diff={m.diff}
      rate={m.rate}
      guests={m.actual.guests}
      baseGuests={m.base ? m.base.guests : null}
      check={m.checkActual}
      baseCheck={m.checkBase}
    />
  )
}

/* ───────── 지점 비교표 ───────── */

function BranchTable({ ranking }: { ranking: Comparison[] }) {
  const d = useDemo()
  const maxAbs = Math.max(1, ...ranking.map((r) => Math.abs(r.diff ?? 0)))
  const total = compare('all', d.date, d.mode)
  return (
    <div className="overflow-x-auto rounded-xl border border-line">
      <table className="w-full border-collapse text-[13px]">
        <caption className="sr-only">
          {dateFull(d.date)} 지점별 매출과 비교 기준 대비 차액. 차액이 작은 순.
        </caption>
        <thead className="bg-surface text-left text-[12px] text-warmgray">
          <tr>
            <th scope="col" className="px-3 py-2 font-semibold">
              지점
            </th>
            <th scope="col" className="px-3 py-2 text-right font-semibold">
              매출
            </th>
            <th scope="col" className="hidden px-3 py-2 text-right font-semibold sm:table-cell">
              비교값
            </th>
            <th scope="col" className="px-3 py-2 text-right font-semibold" aria-sort="ascending">
              차액 ↑
            </th>
            <th scope="col" className="hidden w-[120px] px-3 py-2 font-semibold lg:table-cell">
              <span className="sr-only">차액 막대</span>
            </th>
            <th scope="col" className="hidden px-3 py-2 text-right font-semibold md:table-cell">
              방문객
            </th>
            <th scope="col" className="hidden px-3 py-2 text-right font-semibold md:table-cell">
              객단가
            </th>
            <th scope="col" className="hidden px-3 py-2 font-semibold sm:table-cell">
              기록
            </th>
          </tr>
        </thead>
        <tbody className="tabular-nums">
          {ranking.map((r) => {
            const id = r.day.scope as BranchId
            const b = branchById(id)
            const tone = toneOf(r.diff)
            const on = d.scope === id || d.highlight === id
            const memo = d.memoFor(id, d.date)
            const ctx = contextFor(id, d.date).filter((c) => c.branches.length > 0)
            const hasData = r.day.status === 'ok' || r.day.status === 'closed'
            const pctW = ((Math.abs(r.diff ?? 0) / maxAbs) * 50).toFixed(1)
            return (
              <tr key={id} className={`border-t border-line ${on ? 'bg-tint' : 'hover:bg-[#FAFBFC]'}`}>
                <th scope="row" className="px-3 py-2 text-left font-normal">
                  <button
                    type="button"
                    onClick={() => d.setScope(id)}
                    aria-current={d.scope === id ? 'true' : undefined}
                    className="group text-left"
                  >
                    <span className="block text-[13.5px] font-semibold text-ink underline-offset-2 group-hover:underline">{b.name}</span>
                    <span className="block text-[12px] text-warmgray">{b.concept}</span>
                  </button>
                </th>
                <td className="px-3 py-2 text-right font-semibold text-ink">
                  {!hasData ? <span className="font-normal text-warmgray">자료 누락</span> : r.day.status === 'closed' ? '휴무' : eur(r.day.total.revenue)}
                </td>
                <td className="hidden px-3 py-2 text-right text-charcoal sm:table-cell">{r.comparable ? eur(r.base.total.revenue) : '–'}</td>
                <td className="px-3 py-2 text-right">
                  {r.comparable ? <Delta diff={r.diff} rate={r.rate} /> : <span className="text-[12.5px] text-warmgray">비교할 데이터가 없어요</span>}
                </td>
                <td className="hidden px-3 py-2 lg:table-cell">
                  {r.comparable && (
                    <div aria-hidden="true" className="relative h-2.5 w-full">
                      <div className="absolute inset-y-[-3px] left-1/2 w-px bg-[#C5CAD1]" />
                      <div
                        className={`absolute inset-y-0 rounded-sm ${tone === 'down' ? 'bg-[#DC3C3D]' : tone === 'up' ? 'bg-[#0AAC23]' : 'bg-[#C5CAD1]'}`}
                        style={tone === 'down' ? { right: '50%', width: `${pctW}%` } : { left: '50%', width: `${pctW}%` }}
                      />
                    </div>
                  )}
                </td>
                <td className="hidden px-3 py-2 text-right text-charcoal md:table-cell">{hasData ? people(r.day.total.guests) : '–'}</td>
                <td className="hidden px-3 py-2 text-right text-charcoal md:table-cell">{hasData ? eurCheck(checkOf(r.day.total)) : '–'}</td>
                <td className="hidden px-3 py-2 sm:table-cell">
                  <span className="flex flex-wrap gap-1">
                    {ctx.map((c) => (
                      <Tag key={c.id} kind={c.kind}>
                        {c.title}
                      </Tag>
                    ))}
                    {memo && <Tag kind="memo">메모</Tag>}
                  </span>
                </td>
              </tr>
            )
          })}
        </tbody>
        <tfoot className="tabular-nums">
          <tr className="border-t border-[#CBD0D7] bg-surface">
            <th scope="row" className="px-3 py-2 text-left text-[13px] font-semibold text-ink">
              5개 지점 합계
            </th>
            <td className="px-3 py-2 text-right font-bold text-ink">{eur(total.day.total.revenue)}</td>
            <td className="hidden px-3 py-2 text-right text-charcoal sm:table-cell">{total.comparable ? eur(total.base.total.revenue) : '–'}</td>
            <td className="px-3 py-2 text-right">{total.comparable ? <Delta diff={total.diff} rate={total.rate} /> : '–'}</td>
            <td className="hidden lg:table-cell" />
            <td className="hidden px-3 py-2 text-right text-charcoal md:table-cell">{people(total.day.total.guests)}</td>
            <td className="hidden px-3 py-2 text-right text-charcoal md:table-cell">{eurCheck(checkOf(total.day.total))}</td>
            <td className="hidden sm:table-cell" />
          </tr>
        </tfoot>
      </table>
    </div>
  )
}

/* ───────── 시간대별 ───────── */

function HourlyTable({ c }: { c: Comparison }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-line">
      <table className="w-full min-w-[560px] border-collapse text-[13px]">
        <caption className="sr-only">시간대별 실적, 비교값, 차액</caption>
        <thead className="bg-surface text-left text-[12px] text-warmgray">
          <tr>
            {['시간', '매출', '비교값', '차액', '방문객', '비교', '객단가', '강수'].map((h, i) => (
              <th key={h} scope="col" className={`px-3 py-2 font-semibold ${i === 0 ? '' : 'text-right'}`}>
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="tabular-nums">
          {c.hours.map((h) => {
            const r = rainMm(c.day.date, h.hour)
            return (
              <tr key={h.hour} className="border-t border-line">
                <th scope="row" className="px-3 py-1.5 text-left font-medium text-ink">
                  {h.hour}시
                </th>
                <td className="px-3 py-1.5 text-right text-ink">{eur(h.actual.revenue)}</td>
                <td className="px-3 py-1.5 text-right text-charcoal">{h.base ? eur(h.base.revenue) : '–'}</td>
                <td className="px-3 py-1.5 text-right">{h.diff !== null ? <Delta diff={h.diff} /> : '–'}</td>
                <td className="px-3 py-1.5 text-right text-ink">{people(h.actual.guests)}</td>
                <td className="px-3 py-1.5 text-right text-charcoal">{h.base ? people(h.base.guests) : '–'}</td>
                <td className="px-3 py-1.5 text-right text-charcoal">{eurCheck(checkOf(h.actual))}</td>
                <td className="px-3 py-1.5 text-right text-charcoal">{r > 0 ? mm(r) : '–'}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

/* ───────── 선택일 상세 ───────── */

export function DayCard() {
  const d = useDemo()
  const [metric, setMetric] = useState<HourMetric>('revenue')
  const [view, setView] = useState<'chart' | 'table'>('chart')
  const c = useMemo(() => compare(d.scope, d.date, d.mode), [d.scope, d.date, d.mode])
  const ranking = useMemo(() => branchRanking(d.date, d.mode), [d.date, d.mode])
  const isAll = d.scope === 'all'
  const lunchRain = mealRainMm(d.date, 'lunch')
  const dinnerRain = mealRainMm(d.date, 'dinner')
  const ctx = contextFor(d.scope, d.date)
  const memo = !isAll ? d.memoFor(d.scope as BranchId, d.date) : null
  const hasDay = c.day.status === 'ok' || c.day.status === 'partial'
  const rain = c.hours.map((h) => rainMm(d.date, h.hour))
  const branchesOpen = isAll || d.showBranches

  const table = (
    <div id="sd-branches" className="scroll-mt-20">
      <div className="mb-2 flex flex-wrap items-center gap-x-3 gap-y-1">
        <h3 className="text-[14px] font-bold text-ink">{isAll ? '지점 비교' : '같은 날 다른 지점'}</h3>
        <p className="text-[12.5px] text-warmgray">
          {dateShort(d.date)} · 차액이 가장 큰 감소부터 · 지점마다 ‘{modeLabel(d.mode, d.date)}’ 적용
        </p>
        {!isAll && (
          <button type="button" className={`${btn.quiet} ml-auto`} onClick={() => d.setShowBranches(false)}>
            접기
          </button>
        )}
      </div>
      <BranchTable ranking={ranking} />
      {isAll && <p className="mt-1.5 text-[12.5px] text-warmgray">지점 이름을 누르면 그 지점의 시간대별 상세가 열려요.</p>}
    </div>
  )

  const hourly = (
    <div>
      <div className="mb-1 flex flex-wrap items-center gap-x-3 gap-y-2">
        <h3 className="text-[14px] font-bold text-ink">시간대별 {metric === 'revenue' ? '매출' : '방문객 수'}</h3>
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[12.5px] text-charcoal">
          <span className="inline-flex items-center gap-1.5">
            <span className="inline-block h-2.5 w-2.5 rounded-[3px]" style={{ background: C.barDay }} />
            {dateMD(d.date)} 실적
          </span>
          {c.comparable && (
            <span className="inline-flex items-center gap-1.5">
              <span className="relative inline-block h-0.5 w-5 rounded" style={{ background: C.line }}>
                <span className="absolute left-1/2 top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full" style={{ background: C.line }} />
              </span>
              {baseLabel(c.base)}
            </span>
          )}
        </div>
        <div className="ml-auto flex items-center gap-2">
          <Segmented
            label="지표"
            size="sm"
            value={metric}
            options={[
              { value: 'revenue', label: '매출' },
              { value: 'guests', label: '방문객 수' },
            ]}
            onChange={setMetric}
          />
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
      {view === 'chart' ? (
        <HourlyChart
          hours={c.hours}
          metric={metric}
          baseName={c.comparable ? baseLabel(c.base) : ''}
          rain={rain}
          ariaLabel={`${scopeName(d.scope)} ${dateFull(d.date)} 시간대별 ${metric === 'revenue' ? '매출' : '방문객 수'}와 비교값`}
        />
      ) : (
        <HourlyTable c={c} />
      )}
      <p className="mt-1 text-[12px] text-warmgray">영업 시간: 점심 12:00~14:59, 저녁 18:00~21:59 · 강수량은 파리 관측 지점의 시간별 기록 ({DEMO_SOURCE})</p>
    </div>
  )

  return (
    <Card id="sd-day" label="선택일 상세" className="scroll-mt-20 px-5 py-4">
      <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
        <div className="flex items-center gap-1">
          <button type="button" className={`${btn.ghost} !px-1.5`} onClick={() => d.stepDate(-1)} disabled={d.date <= VIEW_START} aria-label="이전 날">
            <Icon name="left" size={17} />
          </button>
          <h2 className="px-1.5 text-[17px] font-bold tracking-tight text-ink" aria-live="polite">
            {dateFull(d.date)}
          </h2>
          <button type="button" className={`${btn.ghost} !px-1.5`} onClick={() => d.stepDate(1)} disabled={d.date >= VIEW_END} aria-label="다음 날">
            <Icon name="right" size={17} />
          </button>
        </div>
        <span className="rounded-md bg-ink px-2 py-0.5 text-[12.5px] font-semibold text-white">{scopeName(d.scope)}</span>
        <div className="flex flex-wrap items-center gap-1.5">
          {lunchRain > 0 && <Tag kind="rain">점심 비 {mm(lunchRain)}</Tag>}
          {dinnerRain > 0 && <Tag kind="rain">저녁 비 {mm(dinnerRain)}</Tag>}
          {lunchRain === 0 && dinnerRain === 0 && <Tag kind="neutral">영업시간 강수 없음</Tag>}
          {ctx.map((x) => (
            <Tag key={x.id} kind={x.kind}>
              {x.title}
            </Tag>
          ))}
          {memo && <Tag kind="memo">점주 메모</Tag>}
        </div>
      </div>

      <div className="mt-3">
        <CompareControl c={c} />
      </div>

      {!hasDay ? (
        <div className="mt-4 rounded-xl border border-dashed border-[#CBD0D7] bg-surface px-4 py-6 text-center">
          <p className="text-[15px] font-semibold text-ink">{c.day.status === 'closed' ? '휴무일이에요' : '이 날짜의 매출 자료가 없어요'}</p>
          <p className="mt-1 text-[13px] text-charcoal">
            {c.reason}
            {c.day.status === 'closed' ? ' 매출은 €0으로 기록돼 있어요.' : ' 매출 0과는 다르게 다뤄요. 없는 수치는 채우지 않아요.'}
          </p>
        </div>
      ) : (
        <>
          {!c.comparable && (
            <p className="mt-3 rounded-xl bg-[#FFF1DF] px-3.5 py-2.5 text-[13px] font-medium text-[#874700]">비교할 데이터가 없어요. 실적만 보여드려요.</p>
          )}
          {c.day.status === 'partial' && (
            <p className="mt-3 rounded-xl bg-[#FFF1DF] px-3.5 py-2.5 text-[13px] font-medium text-[#874700]">
              {c.day.missingBranches.map((b) => branchById(b).name).join(', ')}의 자료가 없어 합계에서 뺐어요.
            </p>
          )}
          <div className="mt-3 grid gap-3 sm:grid-cols-3">
            <StatTile
              label="하루"
              revenue={c.actual.revenue}
              diff={c.diff}
              rate={c.rate}
              guests={c.actual.guests}
              baseGuests={c.comparable ? c.base.total.guests : null}
              check={checkOf(c.actual)}
              baseCheck={c.comparable ? checkOf(c.base.total) : null}
            />
            {mealTile(c.meals.lunch)}
            {mealTile(c.meals.dinner)}
          </div>
          <div className="mt-5 space-y-6">
            {isAll ? (
              <>
                {table}
                {hourly}
              </>
            ) : (
              <>
                {hourly}
                {branchesOpen ? (
                  table
                ) : (
                  <button type="button" id="sd-branches" className={`${btn.ghost} scroll-mt-20`} onClick={() => d.setShowBranches(true)}>
                    <Icon name="list" size={15} />
                    같은 날 다른 지점 보기
                  </button>
                )}
              </>
            )}
          </div>
        </>
      )}
    </Card>
  )
}

/* ───────── 분석 근거와 메모 ───────── */

const SOURCE_STYLE = 'rounded bg-surface px-1.5 py-0.5 text-[11.5px] font-medium text-charcoal'

function MemoEditor({ branch }: { branch: BranchId }) {
  const d = useDemo()
  const memo = d.memoFor(branch, d.date)
  const [editing, setEditing] = useState(false)
  const [text, setText] = useState('')
  useEffect(() => {
    setEditing(false)
    setText('')
  }, [branch, d.date])
  const id = `sd-memo-${branch}`

  if (memo && !editing) {
    return (
      <div className="rounded-xl bg-[#FFF8DC] px-4 py-3">
        <div className="flex items-center gap-2">
          <Tag kind="memo">점주 메모</Tag>
          <span className="text-[12px] text-[#6A5100]">
            {branchById(branch).name} · {dateShort(d.date)}
            {memo.updatedAt && ` · ${memo.updatedAt} 수정`}
          </span>
          <span className="ml-auto flex gap-1">
            <button
              type="button"
              className={btn.quiet}
              onClick={() => {
                setText(memo.text)
                setEditing(true)
              }}
            >
              <Icon name="edit" size={14} />
              수정
            </button>
            <button type="button" className={btn.quiet} onClick={() => d.deleteMemo(branch, d.date)}>
              <Icon name="trash" size={14} />
              삭제
            </button>
          </span>
        </div>
        <p className="mt-1.5 whitespace-pre-wrap text-[14px] leading-6 text-ink">{memo.text}</p>
        <p className="mt-1 text-[12px] text-[#6A5100]">점주가 남긴 기록이에요. 메모 내용으로 매출 손실액을 추정하지 않아요.</p>
      </div>
    )
  }
  return (
    <form
      className="rounded-xl border border-line px-4 py-3"
      onSubmit={(e) => {
        e.preventDefault()
        if (!text.trim()) return
        d.saveMemo(branch, d.date, text)
        d.notify('메모를 저장했어요')
        setEditing(false)
        setText('')
      }}
    >
      <label htmlFor={id} className="flex items-center gap-2 text-[13px] font-semibold text-ink">
        <Icon name="note" size={15} />
        매장 메모 · {branchById(branch).name} · {dateShort(d.date)}
      </label>
      <textarea
        id={id}
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={2}
        maxLength={300}
        placeholder="예) 이날은 테라스를 열지 않았음"
        className="mt-2 block w-full resize-y rounded-lg border border-line bg-white px-3 py-2 text-[14px] leading-6 text-ink placeholder:text-[#9AA1AD] hover:border-[#CBD0D7]"
      />
      <div className="mt-2 flex items-center gap-2">
        <button type="submit" className={btn.primary} disabled={!text.trim()}>
          메모 저장
        </button>
        {editing && (
          <button type="button" className={btn.ghost} onClick={() => setEditing(false)}>
            취소
          </button>
        )}
        <span className="text-[12px] text-warmgray">이 지점·날짜에만 표시되고, 새로고침해도 남아요.</span>
      </div>
    </form>
  )
}

function FactorRow({ title, kind, rows }: { title: string; kind: string; rows: [string, string][] }) {
  return (
    <details className="group rounded-xl border border-line">
      <summary className="flex cursor-pointer list-none items-center gap-2 px-3.5 py-2.5 text-[13.5px] font-medium text-ink">
        <span className={SOURCE_STYLE}>{kind}</span>
        <span className="min-w-0 flex-1 truncate">{title}</span>
        <Icon name="down" size={15} className="text-warmgray transition-transform group-open:rotate-180" />
      </summary>
      <dl className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 border-t border-line px-3.5 py-2.5 text-[12.5px] leading-5">
        {rows.map(([k, v]) => (
          <div key={k} className="contents">
            <dt className="text-warmgray">{k}</dt>
            <dd className="text-charcoal">{v}</dd>
          </div>
        ))}
      </dl>
    </details>
  )
}

export function EvidenceCard() {
  const d = useDemo()
  const isAll = d.scope === 'all'
  const memo = !isAll ? d.memoFor(d.scope as BranchId, d.date) : null
  const c = useMemo(() => compare(d.scope, d.date, d.mode), [d.scope, d.date, d.mode])
  const a = useMemo(() => analyze(d.scope, d.date, d.mode, memo?.text ?? null), [d.scope, d.date, d.mode, memo])
  const ctx = contextFor(d.scope, d.date)
  const ym = d.date.slice(0, 7)
  const tourism = tourismFor(ym)
  const lunchRain = mealRainMm(d.date, 'lunch')
  const dinnerRain = mealRainMm(d.date, 'dinner')
  const dayMemos = d.memos.filter((m) => m.date === d.date)
  const tone = toneOf(c.diff)

  return (
    <Card id="sd-evidence" label="분석 근거" className="scroll-mt-20 px-5 py-4">
      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <h2 className="text-[15px] font-bold text-ink">분석 근거</h2>
        <p className="text-[12.5px] text-warmgray">
          {scopeName(d.scope)} · {dateShort(d.date)} · {c.base.available ? baseLabel(c.base) : modeLabel(d.mode, d.date)}
        </p>
      </div>
      <p className={`mt-2 rounded-xl px-3.5 py-2.5 text-[14px] font-semibold ${TONE_BG[tone]} ${tone === 'flat' ? 'text-ink' : TONE_TEXT[tone]}`}>{a.headline}</p>

      <div className="mt-3 grid gap-3 lg:grid-cols-3">
        <div className="rounded-xl border border-line px-4 py-3">
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-[13.5px] font-bold text-ink">수치로 확인한 내용</h3>
            <span className={SOURCE_STYLE}>매출 자료</span>
          </div>
          {a.facts.length ? (
            <ul className="mt-2 space-y-1.5 text-[13.5px] leading-6 text-charcoal">
              {a.facts.map((f) => (
                <li key={f} className="flex gap-2">
                  <span aria-hidden="true" className="mt-[9px] h-1 w-1 shrink-0 rounded-full bg-[#9AA1AD]" />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-2 text-[13.5px] text-charcoal">확인할 수 있는 수치가 없어요.</p>
          )}
        </div>

        <div className="rounded-xl border border-line px-4 py-3">
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-[13.5px] font-bold text-ink">가능한 배경</h3>
            <span className={SOURCE_STYLE}>기록 자료 · 메모</span>
          </div>
          {a.backgrounds.length ? (
            <ul className="mt-2 space-y-2 text-[13.5px] leading-6 text-charcoal">
              {a.backgrounds.map((b) => (
                <li key={b.text}>
                  <Tag kind={b.kind === 'weather' ? 'rain' : b.kind === 'pattern' ? 'neutral' : b.kind}>{b.source}</Tag>
                  <span className="mt-0.5 block">{b.kind === 'memo' ? `“${b.text}”` : b.text}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-2 text-[13.5px] leading-6 text-charcoal">이 날짜·지점에 기록된 날씨, 행사, 이슈, 메모가 없어요.</p>
          )}
          <p className="mt-2 border-t border-line pt-2 text-[12px] leading-5 text-warmgray">{BACKGROUND_CAVEAT}</p>
        </div>

        <div className="rounded-xl border border-line px-4 py-3">
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-[13.5px] font-bold text-ink">추가로 확인할 점</h3>
            <span className={SOURCE_STYLE}>점장 회의용 질문</span>
          </div>
          {a.checks.length ? (
            <ul className="mt-2 space-y-2">
              {a.checks.map((k) => {
                const added = d.hasAgenda(k, d.date)
                return (
                  <li key={`${k.branch}${k.question}`} className="flex items-start gap-2">
                    <span className="min-w-0 flex-1 text-[13.5px] leading-6 text-charcoal">
                      {isAll && <span className="font-semibold text-ink">{branchById(k.branch).name} · </span>}
                      {k.question}
                    </span>
                    <button
                      type="button"
                      disabled={added}
                      onClick={() => d.addAgenda(k, d.date)}
                      className={`shrink-0 ${added ? 'inline-flex items-center gap-1 rounded-md px-2 py-1 text-[12.5px] font-medium text-[#0B6B22]' : btn.ghost + ' !px-2 !py-1 !text-[12.5px]'}`}
                      aria-label={`회의 안건에 추가: ${k.question}`}
                    >
                      <Icon name={added ? 'check' : 'plus'} size={13} />
                      {added ? '추가됨' : '안건'}
                    </button>
                  </li>
                )
              })}
            </ul>
          ) : (
            <p className="mt-2 text-[13.5px] leading-6 text-charcoal">안건으로 올릴 만한 차이가 없어요.</p>
          )}
          <p className="mt-2 border-t border-line pt-2 text-[12px] leading-5 text-warmgray">답이 아니라 확인할 질문이에요. 추가하면 ‘회의 안건’에 모여요.</p>
        </div>
      </div>

      <div className="mt-3">
        {isAll ? (
          dayMemos.length > 0 ? (
            <div className="rounded-xl bg-[#FFF8DC] px-4 py-3">
              <Tag kind="memo">점주 메모 {dayMemos.length}건</Tag>
              <ul className="mt-1.5 space-y-1 text-[13.5px] leading-6 text-ink">
                {dayMemos.map((m) => (
                  <li key={m.branch}>
                    <span className="font-semibold">{branchById(m.branch).name}</span> · “{m.text}”
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <p className="text-[12.5px] text-warmgray">매장 메모는 지점을 선택한 뒤 남길 수 있어요.</p>
          )
        ) : (
          <MemoEditor branch={d.scope as BranchId} />
        )}
      </div>

      <div className="mt-3 border-t border-line pt-3">
        <button
          type="button"
          className={btn.ghost}
          aria-expanded={d.evidenceOpen}
          aria-controls="sd-evidence-detail"
          onClick={() => d.setEvidenceOpen(!d.evidenceOpen)}
        >
          <Icon name="down" size={15} className={`transition-transform ${d.evidenceOpen ? 'rotate-180' : ''}`} />
          {d.evidenceOpen ? '근거 접기' : `근거 보기${c.base.available ? ` · 비교한 날짜 ${c.base.days.length}일` : ''}`}
        </button>
        {d.evidenceOpen && (
          <div id="sd-evidence-detail" className="mt-3 space-y-4">
            <div>
              <h3 className="text-[13.5px] font-bold text-ink">
                비교한 날짜 {c.base.days.length}일{c.base.available && ` — ${baseLabel(c.base)}`}
              </h3>
              {c.base.available ? (
                <div className="mt-2 overflow-x-auto rounded-xl border border-line">
                  <table className="w-full min-w-[520px] border-collapse text-[13px]">
                    <caption className="sr-only">비교에 사용한 날짜와 매출 내역</caption>
                    <thead className="bg-surface text-left text-[12px] text-warmgray">
                      <tr>
                        <th scope="col" className="px-3 py-2 font-semibold">
                          날짜
                        </th>
                        <th scope="col" className="px-3 py-2 font-semibold">
                          점심 강수
                        </th>
                        <th scope="col" className="px-3 py-2 text-right font-semibold">
                          하루 매출
                        </th>
                        <th scope="col" className="px-3 py-2 text-right font-semibold">
                          점심
                        </th>
                        <th scope="col" className="px-3 py-2 text-right font-semibold">
                          저녁
                        </th>
                        <th scope="col" className="px-3 py-2 text-right font-semibold">
                          방문객
                        </th>
                      </tr>
                    </thead>
                    <tbody className="tabular-nums">
                      <tr className="border-t border-line bg-tint font-semibold text-ink">
                        <th scope="row" className="px-3 py-1.5 text-left">
                          {dateFull(d.date)} <span className="ml-1 text-[11.5px] text-accent">선택일</span>
                        </th>
                        <td className="px-3 py-1.5">{lunchRain > 0 ? `비 ${mm(lunchRain)}` : '없음'}</td>
                        <td className="px-3 py-1.5 text-right">{eur(c.actual.revenue)}</td>
                        <td className="px-3 py-1.5 text-right">{eur(c.meals.lunch.actual.revenue)}</td>
                        <td className="px-3 py-1.5 text-right">{eur(c.meals.dinner.actual.revenue)}</td>
                        <td className="px-3 py-1.5 text-right">{people(c.actual.guests)}</td>
                      </tr>
                      {c.base.days.map((x) => {
                        const tags = contextFor(d.scope, x.date)
                        const hasMemo = d.memos.some((m) => m.date === x.date && (isAll || m.branch === d.scope))
                        return (
                          <tr key={x.date} className="border-t border-line text-charcoal">
                            <th scope="row" className="px-3 py-1.5 text-left font-normal">
                              <button type="button" className="text-ink underline-offset-2 hover:underline" onClick={() => d.setDate(x.date, { push: true })}>
                                {dateFull(x.date)}
                              </button>
                              {tags.map((t) => (
                                <Tag key={t.id} kind={t.kind} className="ml-1.5">
                                  {t.title}
                                </Tag>
                              ))}
                              {hasMemo && (
                                <Tag kind="memo" className="ml-1.5">
                                  메모
                                </Tag>
                              )}
                            </th>
                            <td className="px-3 py-1.5">{x.rainyLunch ? `비 ${mm(x.lunchRainMm)}` : '없음'}</td>
                            <td className="px-3 py-1.5 text-right text-ink">{eur(x.total.revenue)}</td>
                            <td className="px-3 py-1.5 text-right">{eur(x.lunch.revenue)}</td>
                            <td className="px-3 py-1.5 text-right">{eur(x.dinner.revenue)}</td>
                            <td className="px-3 py-1.5 text-right">{people(x.total.guests)}</td>
                          </tr>
                        )
                      })}
                      <tr className="border-t border-[#CBD0D7] bg-surface font-semibold text-ink">
                        <th scope="row" className="px-3 py-1.5 text-left">
                          {c.base.days.length > 1 ? `${c.base.days.length}일 평균` : '비교값'}
                        </th>
                        <td className="px-3 py-1.5" />
                        <td className="px-3 py-1.5 text-right">{eur(c.base.total.revenue)}</td>
                        <td className="px-3 py-1.5 text-right">{eur(c.base.lunch.revenue)}</td>
                        <td className="px-3 py-1.5 text-right">{eur(c.base.dinner.revenue)}</td>
                        <td className="px-3 py-1.5 text-right">{people(c.base.total.guests)}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="mt-2 text-[13.5px] text-charcoal">비교할 데이터가 없어요.</p>
              )}
              {c.base.excluded.length > 0 && (
                <p className="mt-1.5 text-[12.5px] text-warmgray">
                  평균에서 뺀 날: {c.base.excluded.map((e) => `${dateShort(e.date)} (${e.reason})`).join(', ')}
                </p>
              )}
              {d.mode === 'weather' && (
                <p className="mt-1.5 text-[12.5px] text-warmgray">
                  ‘비 온 날’은 점심 영업시간(12~15시)에 강수가 기록된 날이에요. 최근 {weekdayName(d.date)} 8일 중 선택일과 조건이 같은 날만 골랐어요.
                </p>
              )}
            </div>

            <div>
              <h3 className="text-[13.5px] font-bold text-ink">관련 자료</h3>
              <div className="mt-2 space-y-1.5">
                <FactorRow
                  kind="날씨"
                  title={lunchRain + dinnerRain > 0 ? `강수 기록 — 점심 ${mm(lunchRain)}, 저녁 ${mm(dinnerRain)}` : '영업시간 중 강수 기록 없음'}
                  rows={[
                    ['범위', '파리 관측 지점 한 곳 (다섯 지점 공통)'],
                    ['기간', `${dateFull(d.date)} 08~23시`],
                    ['단위', '시간별 강수량 (mm)'],
                    ['출처', DEMO_SOURCE],
                  ]}
                />
                {ctx.map((x) => (
                  <FactorRow
                    key={x.id}
                    kind={x.kind === 'strike' ? '사회적 이슈' : '지역 행사'}
                    title={x.title}
                    rows={[
                      ['내용', x.description],
                      ['범위', x.scope],
                      ['기간', `${dateFull(x.start)}${x.end !== x.start ? `~${dateFull(x.end)}` : ''} ${x.hours}`],
                      ['단위', x.kind === 'strike' ? '지역·기간별 기록' : '지점·일시별 기록'],
                      ['출처', x.source],
                    ]}
                  />
                ))}
                {tourism !== null && (
                  <FactorRow
                    kind="월별 지표"
                    title={`${TOURISM_INDEX.name} — ${monthFull(ym)} ${tourism}`}
                    rows={[
                      ['범위', TOURISM_INDEX.region],
                      ['기간', `${monthFull(ym)} (월 단위)`],
                      ['단위', `${TOURISM_INDEX.unit} · 기준월 ${monthFull(TOURISM_INDEX.baseMonth)}`],
                      ['출처', TOURISM_INDEX.source],
                      ['주의', '한 달에 값이 하나뿐이라, 하루 매출이 달라진 원인으로 쓰지 않아요.'],
                    ]}
                  />
                )}
              </div>
            </div>

            <div className="rounded-xl bg-surface px-4 py-3 text-[12.5px] leading-6 text-charcoal">
              <span className="font-semibold text-ink">계산 방식</span> · 금액은 세금 포함 유로 · 객단가 = 총매출 ÷ 총방문객 수 · 증감률 = (실적 − 비교값) ÷ 비교값 · 선택일은 평균에서 제외 · 휴무일과 자료 누락일도 평균에서 제외
              {BRANCH_IDS.length > 0 && ' · 날짜와 시간은 파리 기준'}
            </div>
          </div>
        )}
      </div>
    </Card>
  )
}
