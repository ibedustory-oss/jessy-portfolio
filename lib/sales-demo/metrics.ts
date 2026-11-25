/**
 * 집계 함수 — 그래프, 표, 카드, 대화 답변이 모두 이 파일만 거쳐 수치를 얻는다.
 * 금액은 유로센트. 평균값은 소수일 수 있으며 표시 단계에서 반올림한다.
 */
import {
  addDays,
  dayNum,
  daysInMonth,
  makeDate,
  parts,
  rangeDates,
  sameDateLastYear,
  weekday,
  type ISODate,
} from './calendar'
import {
  BRANCH_IDS,
  HOURS,
  VIEW_END,
  VIEW_START,
  contextFor,
  dayStatus,
  hasHistory,
  hourRecords,
  isRainyLunch,
  mealOfHour,
  mealRainMm,
  statusReason,
  type BranchId,
  type ContextItem,
  type Meal,
} from './data'

export type Scope = BranchId | 'all'
export type CompareMode = 'recent8' | 'weather' | 'lastYearWeekday' | 'lastYearDate'
export const COMPARE_MODES: CompareMode[] = ['recent8', 'weather', 'lastYearWeekday', 'lastYearDate']

export interface Totals {
  revenue: number
  guests: number
}

export interface HourValue extends Totals {
  hour: number
}

const zero = (): Totals => ({ revenue: 0, guests: 0 })

/** 객단가 = 총매출 ÷ 총방문객 수. 방문객이 0이면 null */
export const checkOf = (t: Totals | null): number | null =>
  t && t.guests > 0 ? t.revenue / t.guests : null

/** 증감률 = (실적 − 비교값) ÷ 비교값. 분모가 0이거나 없으면 null */
export const rateOf = (actual: number, base: number | null): number | null =>
  base === null || base === 0 ? null : (actual - base) / base

/* ───────── 하루 실적 ───────── */

export type DataStatus = 'ok' | 'closed' | 'missing' | 'partial' | 'none'

export interface DayData {
  scope: Scope
  date: ISODate
  status: DataStatus
  /** 휴무·누락 사유 (단일 지점) */
  reason: string | null
  hours: HourValue[]
  lunch: Totals
  dinner: Totals
  total: Totals
  /** 전체 보기에서 자료가 없는 지점 */
  missingBranches: BranchId[]
}

function sumMeals(hours: HourValue[]): { lunch: Totals; dinner: Totals; total: Totals } {
  const lunch = zero()
  const dinner = zero()
  for (const h of hours) {
    const t = mealOfHour(h.hour) === 'lunch' ? lunch : dinner
    t.revenue += h.revenue
    t.guests += h.guests
  }
  return {
    lunch,
    dinner,
    total: { revenue: lunch.revenue + dinner.revenue, guests: lunch.guests + dinner.guests },
  }
}

const emptyHours = (): HourValue[] => HOURS.map((hour) => ({ hour, revenue: 0, guests: 0 }))

const dayCache = new Map<string, DayData>()

export function dayData(scope: Scope, date: ISODate): DayData {
  const key = `${scope}|${date}`
  const hit = dayCache.get(key)
  if (hit) return hit
  let out: DayData
  if (scope !== 'all') {
    const st = dayStatus(scope, date)
    const recs = hourRecords(scope, date)
    const hours = recs ? recs.map((r) => ({ ...r })) : emptyHours()
    out = {
      scope,
      date,
      status: st,
      reason: st === 'ok' ? null : st === 'none' ? '볼 수 있는 기간이 아니에요' : statusReason(scope, date),
      hours,
      ...sumMeals(hours),
      missingBranches: [],
    }
  } else {
    const hours = emptyHours()
    const missing: BranchId[] = []
    let open = 0
    for (const b of BRANCH_IDS) {
      const d = dayData(b, date)
      if (d.status === 'missing' || d.status === 'none') {
        missing.push(b)
        continue
      }
      if (d.status === 'ok') open += 1
      d.hours.forEach((h, i) => {
        hours[i].revenue += h.revenue
        hours[i].guests += h.guests
      })
    }
    const status: DataStatus =
      missing.length === BRANCH_IDS.length
        ? hasHistory(date)
          ? 'missing'
          : 'none'
        : missing.length > 0
          ? 'partial'
          : open === 0
            ? 'closed'
            : 'ok'
    out = { scope, date, status, reason: null, hours, ...sumMeals(hours), missingBranches: missing }
  }
  dayCache.set(key, out)
  return out
}

/* ───────── 비교 기준 ───────── */

export interface BaselineDay {
  date: ISODate
  lunch: Totals
  dinner: Totals
  total: Totals
  lunchRainMm: number
  rainyLunch: boolean
}

export interface Baseline {
  scope: Scope
  date: ISODate
  mode: CompareMode
  available: boolean
  /** 평균에 쓴 날짜 */
  days: BaselineDay[]
  /** 후보였지만 평균에서 뺀 날짜와 이유 */
  excluded: { date: ISODate; reason: string }[]
  /** 조건 적용 전 후보 일수 (recent8·weather는 8) */
  candidates: number
  hours: HourValue[]
  lunch: Totals
  dinner: Totals
  total: Totals
  /** weather 모드: 선택일 점심에 비가 기록됐는지 */
  rainyTarget: boolean
  /** 표본이 1~2일이라 참고용으로만 봐야 하는 경우 */
  referenceOnly: boolean
  /** 전체 보기: 비교값을 만들 수 없던 지점 */
  unavailableBranches: BranchId[]
}

function candidateDates(date: ISODate, mode: CompareMode): ISODate[] {
  if (mode === 'lastYearWeekday') return [addDays(date, -364)]
  if (mode === 'lastYearDate') return [sameDateLastYear(date)]
  const out: ISODate[] = []
  for (let k = 1; k <= 8; k++) out.push(addDays(date, -7 * k))
  return out
}

const baseCache = new Map<string, Baseline>()

export function baseline(scope: Scope, date: ISODate, mode: CompareMode): Baseline {
  const key = `${scope}|${date}|${mode}`
  const hit = baseCache.get(key)
  if (hit) return hit
  const out = scope === 'all' ? baselineAll(date, mode) : baselineBranch(scope, date, mode)
  baseCache.set(key, out)
  return out
}

function baselineBranch(branch: BranchId, date: ISODate, mode: CompareMode): Baseline {
  const rainyTarget = isRainyLunch(date)
  const candidates = candidateDates(date, mode)
  const days: BaselineDay[] = []
  const excluded: Baseline['excluded'] = []
  for (const d of candidates) {
    if (mode === 'weather' && isRainyLunch(d) !== rainyTarget) continue
    const st = dayStatus(branch, d)
    if (st === 'none') excluded.push({ date: d, reason: '기록이 없는 기간' })
    else if (st === 'missing') excluded.push({ date: d, reason: '기록 없음' })
    else if (st === 'closed') excluded.push({ date: d, reason: statusReason(branch, d) ?? '쉬는 날' })
    else {
      const dd = dayData(branch, d)
      days.push({
        date: d,
        lunch: dd.lunch,
        dinner: dd.dinner,
        total: dd.total,
        lunchRainMm: mealRainMm(d, 'lunch'),
        rainyLunch: isRainyLunch(d),
      })
    }
  }
  const n = days.length
  const hours = emptyHours()
  // 정수 합계를 먼저 낸 뒤 한 번만 나눈다 (평균의 합으로 생기는 오차를 피한다).
  let meals = sumMeals(hours)
  if (n > 0) {
    for (const d of days) {
      dayData(branch, d.date).hours.forEach((h, i) => {
        hours[i].revenue += h.revenue
        hours[i].guests += h.guests
      })
    }
    const sums = sumMeals(hours)
    const avg = (t: Totals): Totals => ({ revenue: t.revenue / n, guests: t.guests / n })
    meals = { lunch: avg(sums.lunch), dinner: avg(sums.dinner), total: avg(sums.total) }
    for (const h of hours) {
      h.revenue /= n
      h.guests /= n
    }
  }
  return {
    scope: branch,
    date,
    mode,
    available: n > 0,
    days,
    excluded,
    candidates: candidates.length,
    hours,
    ...meals,
    rainyTarget,
    referenceOnly: mode === 'weather' && n > 0 && n <= 2,
    unavailableBranches: [],
  }
}

/** 전체 보기: 지점마다 같은 규칙으로 기준을 만든 뒤 합산한다. */
function baselineAll(date: ISODate, mode: CompareMode): Baseline {
  const hours = emptyHours()
  const meals = { lunch: zero(), dinner: zero(), total: zero() }
  const unavailable: BranchId[] = []
  const perDate = new Map<ISODate, BaselineDay>()
  const excluded: Baseline['excluded'] = []
  let any = false
  let minN = Infinity
  for (const b of BRANCH_IDS) {
    const base = baseline(b, date, mode)
    if (!base.available) {
      unavailable.push(b)
      continue
    }
    any = true
    minN = Math.min(minN, base.days.length)
    base.hours.forEach((h, i) => {
      hours[i].revenue += h.revenue
      hours[i].guests += h.guests
    })
    for (const k of ['lunch', 'dinner', 'total'] as const) {
      meals[k].revenue += base[k].revenue
      meals[k].guests += base[k].guests
    }
    for (const d of base.days) {
      const cur = perDate.get(d.date)
      if (!cur) {
        perDate.set(d.date, {
          ...d,
          lunch: { ...d.lunch },
          dinner: { ...d.dinner },
          total: { ...d.total },
        })
      } else {
        for (const k of ['lunch', 'dinner', 'total'] as const) {
          cur[k].revenue += d[k].revenue
          cur[k].guests += d[k].guests
        }
      }
    }
    for (const e of base.excluded) {
      if (!excluded.some((x) => x.date === e.date && x.reason === e.reason)) excluded.push(e)
    }
  }
  const days = Array.from(perDate.values()).sort((a, b) => (a.date < b.date ? 1 : -1))
  return {
    scope: 'all',
    date,
    mode,
    available: any,
    days,
    excluded,
    candidates: candidateDates(date, mode).length,
    hours,
    ...meals,
    rainyTarget: isRainyLunch(date),
    referenceOnly: mode === 'weather' && any && minN <= 2,
    unavailableBranches: unavailable,
  }
}

/* ───────── 실적과 기준의 비교 ───────── */

export interface MealComparison {
  meal: Meal
  actual: Totals
  base: Totals | null
  diff: number | null
  rate: number | null
  checkActual: number | null
  checkBase: number | null
  /** 손님 수 변화가 만든 매출 차이 = (손님 − 기준 손님) × 기준 객단가 */
  guestEffect: number | null
  /** 객단가 변화가 만든 매출 차이 = (객단가 − 기준 객단가) × 손님 */
  checkEffect: number | null
}

export interface HourComparison {
  hour: number
  actual: Totals
  base: Totals | null
  diff: number | null
}

export interface Comparison {
  day: DayData
  base: Baseline
  /** 비교가 가능한가 (실적과 기준이 모두 있는가) */
  comparable: boolean
  /** 비교할 수 없는 이유 */
  reason: string | null
  /** 비교에 쓴 실적 합계 (전체 보기에서 일부 지점이 빠질 수 있다) */
  actual: Totals
  diff: number | null
  rate: number | null
  meals: Record<Meal, MealComparison>
  hours: HourComparison[]
}

function mealCompare(meal: Meal, actual: Totals, base: Totals | null): MealComparison {
  const checkActual = checkOf(actual)
  const checkBase = checkOf(base)
  let guestEffect: number | null = null
  let checkEffect: number | null = null
  if (base && checkBase !== null) {
    guestEffect = (actual.guests - base.guests) * checkBase
    checkEffect = actual.revenue - base.revenue - guestEffect
  }
  return {
    meal,
    actual,
    base,
    diff: base ? actual.revenue - base.revenue : null,
    rate: base ? rateOf(actual.revenue, base.revenue) : null,
    checkActual,
    checkBase,
    guestEffect,
    checkEffect,
  }
}

const cmpCache = new Map<string, Comparison>()

export function compare(scope: Scope, date: ISODate, mode: CompareMode): Comparison {
  const key = `${scope}|${date}|${mode}`
  const hit = cmpCache.get(key)
  if (hit) return hit
  const day = dayData(scope, date)
  const base = baseline(scope, date, mode)

  let reason: string | null = null
  if (day.status === 'none') reason = '볼 수 있는 기간이 아니에요'
  else if (day.status === 'missing') reason = day.reason ?? '이날은 매출 기록이 없어요'
  else if (day.status === 'closed') reason = day.reason ?? '쉬는 날이에요'
  else if (!base.available) reason = '비교할 날이 없어요'
  const comparable = reason === null

  // 전체 보기에서 기준을 만들 수 없는 지점은 실적에서도 빼고 비교한다.
  let actualHours = day.hours
  if (comparable && scope === 'all' && (base.unavailableBranches.length > 0 || day.missingBranches.length > 0)) {
    actualHours = emptyHours()
    for (const b of BRANCH_IDS) {
      if (base.unavailableBranches.includes(b) || day.missingBranches.includes(b)) continue
      dayData(b, date).hours.forEach((h, i) => {
        actualHours[i].revenue += h.revenue
        actualHours[i].guests += h.guests
      })
    }
  }
  const actual = sumMeals(actualHours)

  const out: Comparison = {
    day,
    base,
    comparable,
    reason,
    actual: actual.total,
    diff: comparable ? actual.total.revenue - base.total.revenue : null,
    rate: comparable ? rateOf(actual.total.revenue, base.total.revenue) : null,
    meals: {
      lunch: mealCompare('lunch', actual.lunch, comparable ? base.lunch : null),
      dinner: mealCompare('dinner', actual.dinner, comparable ? base.dinner : null),
    },
    hours: actualHours.map((h, i) => ({
      hour: h.hour,
      actual: { revenue: h.revenue, guests: h.guests },
      base: comparable ? { revenue: base.hours[i].revenue, guests: base.hours[i].guests } : null,
      diff: comparable ? h.revenue - base.hours[i].revenue : null,
    })),
  }
  cmpCache.set(key, out)
  return out
}

/** 지점 비교표: 선택일 차액이 작은(가장 많이 줄어든) 순 */
export function branchRanking(date: ISODate, mode: CompareMode): Comparison[] {
  return BRANCH_IDS.map((b) => compare(b, date, mode)).sort((a, b) => {
    if (a.diff === null && b.diff === null) return 0
    if (a.diff === null) return 1
    if (b.diff === null) return -1
    return a.diff - b.diff
  })
}

/** 날씨 조건별 평균 — 최근 같은 요일 8일을 비 온 날과 아닌 날로 나눈다. */
export function weatherSplit(
  branch: BranchId,
  date: ISODate,
): { rainy: { n: number; avg: number | null }; dry: { n: number; avg: number | null } } {
  const all = baseline(branch, date, 'recent8').days
  const pick = (rainy: boolean) => {
    const ds = all.filter((d) => d.rainyLunch === rainy)
    return {
      n: ds.length,
      avg: ds.length ? ds.reduce((s, d) => s + d.total.revenue, 0) / ds.length : null,
    }
  }
  return { rainy: pick(true), dry: pick(false) }
}

/* ───────── 기간 ───────── */

export type PeriodKey = '7d' | '30d' | '90d' | '1y'
export const PERIODS: { key: PeriodKey; label: string; days: number }[] = [
  { key: '7d', label: '최근 7일', days: 7 },
  { key: '30d', label: '최근 30일', days: 30 },
  { key: '90d', label: '최근 90일', days: 90 },
  { key: '1y', label: '최근 1년', days: 365 },
]

export interface RangeSpec {
  start: ISODate
  end: ISODate
  granularity: 'day' | 'month'
  /** 월 상세로 들어온 경우 */
  month: string | null
}

export function periodRange(key: PeriodKey): RangeSpec {
  if (key === '1y') return { start: VIEW_START, end: VIEW_END, granularity: 'month', month: null }
  const days = PERIODS.find((p) => p.key === key)!.days
  return { start: addDays(VIEW_END, -(days - 1)), end: VIEW_END, granularity: 'day', month: null }
}

/** 조회 가능 범위 안으로 잘라 낸 한 달 */
export function monthRange(ym: string): RangeSpec {
  const y = Number(ym.slice(0, 4))
  const m = Number(ym.slice(5, 7))
  const first = makeDate(y, m, 1)
  const last = makeDate(y, m, daysInMonth(y, m))
  return {
    start: first < VIEW_START ? VIEW_START : first,
    end: last > VIEW_END ? VIEW_END : last,
    granularity: 'day',
    month: ym,
  }
}

export interface SeriesPoint {
  key: string
  start: ISODate
  end: ISODate
  days: number
  /** 달의 일부만 집계된 경우 */
  partial: boolean
  revenue: number | null
  guests: number | null
  status: DataStatus
  /** 자료가 빠진 날 수 (월별) */
  missingDays: number
  /** 전년 실적과 그 기간 */
  prev: number | null
  prevStart: ISODate
  prevEnd: ISODate
}

/** 전년 대응일: 일별은 요일을 맞춘 364일 전, 월별은 같은 날짜 */
const prevDay = (d: ISODate, aligned: boolean): ISODate => (aligned ? addDays(d, -364) : sameDateLastYear(d))

function sumRange(scope: Scope, dates: ISODate[]): { revenue: number; guests: number; missing: number; counted: number } {
  let revenue = 0
  let guests = 0
  let missing = 0
  let counted = 0
  for (const d of dates) {
    const dd = dayData(scope, d)
    if (dd.status === 'missing' || dd.status === 'none') {
      missing += 1
      continue
    }
    if (dd.status === 'partial') missing += 1
    counted += 1
    revenue += dd.total.revenue
    guests += dd.total.guests
  }
  return { revenue, guests, missing, counted }
}

export function series(scope: Scope, range: RangeSpec): SeriesPoint[] {
  if (range.granularity === 'day') {
    return rangeDates(range.start, range.end).map((d) => {
      const dd = dayData(scope, d)
      const has = dd.status !== 'missing' && dd.status !== 'none'
      const pd = prevDay(d, true)
      const p = dayData(scope, pd)
      const pHas = p.status !== 'missing' && p.status !== 'none'
      return {
        key: d,
        start: d,
        end: d,
        days: 1,
        partial: false,
        revenue: has ? dd.total.revenue : null,
        guests: has ? dd.total.guests : null,
        status: dd.status,
        missingDays: has ? 0 : 1,
        prev: pHas ? p.total.revenue : null,
        prevStart: pd,
        prevEnd: pd,
      }
    })
  }
  const out: SeriesPoint[] = []
  let cursor = range.start
  while (cursor <= range.end) {
    const p = parts(cursor)
    const monthEnd = makeDate(p.y, p.m, daysInMonth(p.y, p.m))
    const end = monthEnd > range.end ? range.end : monthEnd
    const dates = rangeDates(cursor, end)
    const cur = sumRange(scope, dates)
    const prevDates = dates.map((d) => prevDay(d, false))
    const prev = sumRange(scope, prevDates)
    out.push({
      key: cursor.slice(0, 7),
      start: cursor,
      end,
      days: dates.length,
      partial: dates.length < daysInMonth(p.y, p.m),
      revenue: cur.counted ? cur.revenue : null,
      guests: cur.counted ? cur.guests : null,
      status: cur.counted === 0 ? 'missing' : cur.missing > 0 ? 'partial' : 'ok',
      missingDays: cur.missing,
      prev: prev.counted ? prev.revenue : null,
      prevStart: prevDates[0],
      prevEnd: prevDates[prevDates.length - 1],
    })
    cursor = addDays(end, 1)
  }
  return out
}

export interface RangeSummary {
  start: ISODate
  end: ISODate
  days: number
  total: Totals
  missingDays: number
  /** 전년 같은 기간 */
  prevYear: { start: ISODate; end: ISODate; total: Totals } | null
  /** 바로 앞의 같은 길이 기간 */
  prevPeriod: { start: ISODate; end: ISODate; total: Totals } | null
}

export function rangeSummary(scope: Scope, range: RangeSpec): RangeSummary {
  const dates = rangeDates(range.start, range.end)
  const cur = sumRange(scope, dates)
  const aligned = range.granularity === 'day' && range.month === null
  const pyDates = dates.map((d) => prevDay(d, aligned))
  const py = sumRange(scope, pyDates)
  const ppEnd = addDays(range.start, -1)
  const ppStart = addDays(range.start, -dates.length)
  const pp = hasHistory(ppStart) ? sumRange(scope, rangeDates(ppStart, ppEnd)) : null
  return {
    start: range.start,
    end: range.end,
    days: dates.length,
    total: { revenue: cur.revenue, guests: cur.guests },
    missingDays: cur.missing,
    prevYear: py.counted
      ? { start: pyDates[0], end: pyDates[pyDates.length - 1], total: { revenue: py.revenue, guests: py.guests } }
      : null,
    prevPeriod: pp && pp.counted ? { start: ppStart, end: ppEnd, total: { revenue: pp.revenue, guests: pp.guests } } : null,
  }
}

/* ───────── 확인할 날 (평소와 크게 달랐던 날) ───────── */

export interface Flag {
  branch: BranchId
  date: ISODate
  diff: number
  rate: number
  actual: number
  base: number
  /** 차액이 가장 큰 식사 시간대와 그 비중 */
  meal: Meal
  mealShare: number
  rainyLunch: boolean
  contexts: ContextItem[]
  /** 판단에 쓴 비교 기준 */
  mode: CompareMode
}

/**
 * 비교 기준에서 12% 이상, €180 이상 벗어난 날.
 * 기준은 최근 같은 요일 8일 평균이고, 지점·요일에 저장한 기준이 있으면 그것을 쓴다.
 */
export const FLAG_RATE = 0.12
export const FLAG_AMOUNT = 18_000

export function findFlags(
  scope: Scope,
  start: ISODate,
  end: ISODate,
  modeOf?: (branch: BranchId, date: ISODate) => CompareMode,
): { drops: Flag[]; rises: Flag[] } {
  const branches = scope === 'all' ? BRANCH_IDS : [scope]
  const flags: Flag[] = []
  for (const b of branches) {
    for (const d of rangeDates(start, end)) {
      let mode: CompareMode = modeOf ? modeOf(b, d) : 'recent8'
      let c = compare(b, d, mode)
      if (!c.comparable && mode !== 'recent8') {
        mode = 'recent8'
        c = compare(b, d, mode)
      }
      if (!c.comparable || c.diff === null || c.rate === null) continue
      if (Math.abs(c.rate) < FLAG_RATE || Math.abs(c.diff) < FLAG_AMOUNT) continue
      const l = c.meals.lunch.diff ?? 0
      const dn = c.meals.dinner.diff ?? 0
      const meal: Meal = Math.abs(l) >= Math.abs(dn) ? 'lunch' : 'dinner'
      const share = c.diff !== 0 ? (meal === 'lunch' ? l : dn) / c.diff : 0
      flags.push({
        branch: b,
        date: d,
        diff: c.diff,
        rate: c.rate,
        actual: c.actual.revenue,
        base: c.base.total.revenue,
        meal,
        mealShare: share,
        rainyLunch: isRainyLunch(d),
        contexts: contextFor(b, d),
        mode,
      })
    }
  }
  return {
    drops: flags.filter((f) => f.diff < 0).sort((a, b) => a.diff - b.diff),
    rises: flags.filter((f) => f.diff > 0).sort((a, b) => b.diff - a.diff),
  }
}

export const inView = (d: ISODate): boolean => d >= VIEW_START && d <= VIEW_END
export const weekdayOf = weekday
export const dayDistance = (a: ISODate, b: ISODate): number => dayNum(b) - dayNum(a)
