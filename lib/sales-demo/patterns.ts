/**
 * 개선 기회 — 하루가 아니라 되풀이되는 차이를 찾는다.
 * 최근 26주의 원자료만 쓰고, 금액은 관측된 차이이거나 가정을 밝힌 계산이다.
 * 원인을 단정하지 않는다. ‘해볼 만한 것’은 제안으로 따로 표시한다.
 */
import { addDays, rangeDates, weekday, type ISODate } from './calendar'
import { BRANCH_IDS, VIEW_END, branchById, mealRainMm, type BranchId, type Meal } from './data'
import { dayData, rateOf, type Scope, type Totals } from './metrics'

export const PATTERN_WEEKS = 26
export const PATTERN_END: ISODate = VIEW_END
export const PATTERN_START: ISODate = addDays(VIEW_END, -(PATTERN_WEEKS * 7 - 1))
const WEEKS_PER_MONTH = 4.345

export type PatternKind = 'weather' | 'drift' | 'underused' | 'strength'
export type DayGroup = 'weekday' | 'weekend' | 'sat' | 'sun'

export interface Pattern {
  id: string
  kind: PatternKind
  branch: BranchId
  meal: Meal
  group: DayGroup | null
  /** 비율 (−0.38 = 38% 낮음) */
  rate: number
  /** 관측된 차이의 월 환산 금액(유로센트). 관측할 수 없으면 null */
  monthly: number | null
  /** 가정에 따른 월 금액 (비어 있는 여력) */
  whatIfMonthly: number | null
  /** 표본 수 (일) */
  n: number
  /** 화면에서 열어 볼 예시 날짜 */
  example: ISODate
  /** 문장에 쓰는 수치 */
  facts: Record<string, number>
}

const ok = (b: BranchId, d: ISODate): boolean => dayData(b, d).status === 'ok'
const dates = rangeDates(PATTERN_START, PATTERN_END)
const groupOf = (dow: number): 'weekday' | 'sat' | 'sun' => (dow === 0 ? 'sun' : dow === 6 ? 'sat' : 'weekday')

/* ── A. 날씨: 비 온 날을 같은 요일의 맑은 날 평균과 비교 ── */

function weatherPatterns(branch: BranchId): Pattern[] {
  const out: Pattern[] = []
  for (const meal of ['lunch', 'dinner'] as Meal[]) {
    const dry: { rev: number; guests: number; n: number }[] = Array.from({ length: 7 }, () => ({ rev: 0, guests: 0, n: 0 }))
    const rainy: { date: ISODate; dow: number; t: Totals }[] = []
    for (const d of dates) {
      if (!ok(branch, d)) continue
      const t = dayData(branch, d)[meal]
      const dow = weekday(d)
      if (mealRainMm(d, meal) > 0) rainy.push({ date: d, dow, t })
      else {
        dry[dow].rev += t.revenue
        dry[dow].guests += t.guests
        dry[dow].n += 1
      }
    }
    let n = 0
    let actual = 0
    let expected = 0
    let guests = 0
    let expectedGuests = 0
    let example = rainy[rainy.length - 1]?.date ?? PATTERN_END
    for (const r of rainy) {
      const base = dry[r.dow]
      if (base.n < 4) continue
      n += 1
      actual += r.t.revenue
      expected += base.rev / base.n
      guests += r.t.guests
      expectedGuests += base.guests / base.n
      example = r.date
    }
    if (n < 8 || expected === 0) continue
    const rate = actual / expected - 1
    const monthly = ((actual - expected) / PATTERN_WEEKS) * WEEKS_PER_MONTH
    if (Math.abs(monthly) < 15_000) continue
    if (rate <= -0.08 || rate >= 0.06) {
      out.push({
        id: `weather-${branch}-${meal}`,
        kind: rate < 0 ? 'weather' : 'strength',
        branch,
        meal,
        group: null,
        rate,
        monthly,
        whatIfMonthly: null,
        n,
        example,
        facts: {
          total: actual - expected,
          perDay: (actual - expected) / n,
          guests: guests / n,
          expectedGuests: expectedGuests / n,
          check: guests ? actual / guests : 0,
          expectedCheck: expectedGuests ? expected / expectedGuests : 0,
        },
      })
    }
  }
  return out
}

/* ── B. 서서히 줄어드는 흐름: 최근 6주와 그 전 6주를, 작년 같은 시기의 흐름을 빼고 비교 ── */

const BLOCK_DAYS = 42

function driftPatterns(branch: BranchId): Pattern[] {
  const out: Pattern[] = []
  const recent = rangeDates(addDays(PATTERN_END, -(BLOCK_DAYS - 1)), PATTERN_END)
  const prior = rangeDates(addDays(PATTERN_END, -(2 * BLOCK_DAYS - 1)), addDays(PATTERN_END, -BLOCK_DAYS))
  for (const group of ['weekday', 'weekend'] as const) {
    for (const meal of ['lunch', 'dinner'] as Meal[]) {
      const sum = (ds: ISODate[]) => {
        let g = 0
        let gLY = 0
        let rev = 0
        let n = 0
        let rainyDays = 0
        let services = 0
        for (const d of ds) {
          const dow = weekday(d)
          const isWeekend = dow === 0 || dow === 6
          if ((group === 'weekend') !== isWeekend) continue
          const ly = addDays(d, -364)
          if (!ok(branch, d) || !ok(branch, ly)) continue
          services += 1
          // 날씨 영향이 섞이지 않도록 올해·작년 모두 비가 없던 날만 쓴다
          if (mealRainMm(d, meal) > 0 || mealRainMm(ly, meal) > 0) {
            rainyDays += 1
            continue
          }
          g += dayData(branch, d)[meal].guests
          gLY += dayData(branch, ly)[meal].guests
          rev += dayData(branch, d)[meal].revenue
          n += 1
        }
        return { g, gLY, rev, n, rainyDays, services }
      }
      const r = sum(recent)
      const p = sum(prior)
      if (r.n < 8 || p.n < 8 || !r.gLY || !p.gLY || !p.g) continue
      const rate = r.g / r.gLY / (p.g / p.gLY) - 1
      if (rate > -0.06) continue
      // 비가 없던 날의 하루 차이를 그 기간의 모든 영업일로 넓혀 월 금액으로 환산
      const perDay = (r.rev / r.n) * (1 / (1 + rate) - 1)
      const monthly = -((perDay * r.services) / 6) * WEEKS_PER_MONTH
      out.push({
        id: `drift-${branch}-${group}-${meal}`,
        kind: 'drift',
        branch,
        meal,
        group,
        rate,
        monthly,
        whatIfMonthly: null,
        n: r.n,
        example:
          [...recent].reverse().find((d) => {
            const dow = weekday(d)
            return (group === 'weekend') === (dow === 0 || dow === 6) && ok(branch, d)
          }) ?? PATTERN_END,
        facts: {
          recentGuests: r.g / r.n,
          priorGuests: p.g / p.n,
          excludedRainy: r.rainyDays + p.rainyDays,
          yoyRecent: rateOf(r.g, r.gLY) ?? 0,
          yoyPrior: rateOf(p.g, p.gLY) ?? 0,
        },
      })
    }
  }
  return out
}

/* ── C. 비어 있는 여력: 그 지점이 가장 바쁜 서비스와 비교 ── */

function underusedPatterns(branch: BranchId): Pattern[] {
  type Key = `${'weekday' | 'sat' | 'sun'}-${Meal}`
  const acc = new Map<Key, { g: number; rev: number; n: number; last: ISODate }>()
  for (const d of dates) {
    if (!ok(branch, d)) continue
    const grp = groupOf(weekday(d))
    for (const meal of ['lunch', 'dinner'] as Meal[]) {
      const key: Key = `${grp}-${meal}`
      const cur = acc.get(key) ?? { g: 0, rev: 0, n: 0, last: d }
      const t = dayData(branch, d)[meal]
      cur.g += t.guests
      cur.rev += t.revenue
      cur.n += 1
      cur.last = d
      acc.set(key, cur)
    }
  }
  let best = 0
  let bestKey: Key = 'weekday-lunch'
  acc.forEach((v, k) => {
    if (v.g / v.n > best) {
      best = v.g / v.n
      bestKey = k
    }
  })
  const out: Pattern[] = []
  const bestGroup = (bestKey as string).split('-')[0]
  const bestMeal = (bestKey as string).split('-')[1]
  for (const meal of ['lunch', 'dinner'] as Meal[]) {
    const low = (['weekday', 'sat', 'sun'] as const).filter((grp) => {
      const v = acc.get(`${grp}-${meal}`)
      return v && v.g / v.n < best * 0.45
    })
    if (low.length === 0) continue
    // 토·일이 함께 낮으면 ‘주말’로 묶는다
    const groups: { group: DayGroup; parts: ('weekday' | 'sat' | 'sun')[] }[] = []
    if (low.includes('sat') && low.includes('sun')) groups.push({ group: 'weekend', parts: ['sat', 'sun'] })
    else for (const g of low) if (g !== 'weekday') groups.push({ group: g, parts: [g] })
    if (low.includes('weekday')) groups.push({ group: 'weekday', parts: ['weekday'] })
    for (const grp of groups) {
      let g = 0
      let rev = 0
      let n = 0
      let last: ISODate = PATTERN_START
      for (const part of grp.parts) {
        const v = acc.get(`${part}-${meal}`)!
        g += v.g
        rev += v.rev
        n += v.n
        if (v.last > last) last = v.last
      }
      const perWeek = grp.group === 'weekday' ? 5 : grp.group === 'weekend' ? 2 : 1
      const check = g ? rev / g : 0
      out.push({
        id: `underused-${branch}-${grp.group}-${meal}`,
        kind: 'underused',
        branch,
        meal,
        group: grp.group,
        rate: g / n / best - 1,
        monthly: null,
        whatIfMonthly: 10 * check * perWeek * WEEKS_PER_MONTH,
        n,
        example: last,
        facts: {
          guests: g / n,
          best,
          check,
          bestIsLunch: bestMeal === 'lunch' ? 1 : 0,
          bestGroup: bestGroup === 'weekday' ? 0 : bestGroup === 'sat' ? 1 : 2,
        },
      })
    }
  }
  return out
}

const cache = new Map<BranchId, Pattern[]>()

function branchPatterns(branch: BranchId): Pattern[] {
  const hit = cache.get(branch)
  if (hit) return hit
  const out = [...weatherPatterns(branch), ...driftPatterns(branch), ...underusedPatterns(branch)]
  cache.set(branch, out)
  return out
}

/** 크기순: 관측된 차이(월 금액)가 큰 것부터, 그다음 가정 금액이 큰 것. 강점은 뒤에 둔다. */
export function findPatterns(scope: Scope): Pattern[] {
  const all = (scope === 'all' ? BRANCH_IDS : [scope]).flatMap(branchPatterns)
  const rank = (p: Pattern) => (p.kind === 'strength' ? 2 : p.monthly !== null ? 0 : 1)
  return [...all].sort((a, b) => {
    if (rank(a) !== rank(b)) return rank(a) - rank(b)
    const av = Math.abs(a.monthly ?? a.whatIfMonthly ?? 0)
    const bv = Math.abs(b.monthly ?? b.whatIfMonthly ?? 0)
    return bv - av
  })
}

export const patternBranchName = (p: Pattern): string => branchById(p.branch).name
