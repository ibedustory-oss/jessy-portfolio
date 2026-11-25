/**
 * 분석 문장 — 근거 패널과 대화 답변이 같은 비교 결과(compare)를 읽어 문장을 만든다.
 * 수치로 확인한 내용 / 가능한 배경 / 추가로 확인할 점을 섞지 않는다.
 */
import { weekday, type ISODate } from './calendar'
import {
  BRANCH_IDS,
  DINNER_HOURS,
  LUNCH_HOURS,
  branchById,
  contextFor,
  mealRainMm,
  type BranchId,
  type ContextItem,
  type Meal,
} from './data'
import {
  dateFull,
  dateMD,
  dateShort,
  eur,
  eurCheck,
  eurDiff,
  mm,
  pct,
  pctPlain,
  people,
  tablesText,
  weekdayName,
} from './format'
import {
  branchRanking,
  compare,
  weatherSplit,
  type Baseline,
  type CompareMode,
  type Comparison,
  type MealComparison,
  type Scope,
} from './metrics'

export const MEAL_LABEL: Record<Meal, string> = { lunch: '점심', dinner: '저녁' }
export const MEAL_HOURS: Record<Meal, string> = { lunch: '12~15시', dinner: '18~22시' }

export const scopeName = (scope: Scope): string => (scope === 'all' ? '전체 지점' : branchById(scope).name)

/* ───────── 비교 대상 이름 — 누구나 아는 말로 ───────── */

/** 고르는 메뉴에 쓰는 이름 */
export function modeLabel(mode: CompareMode, date: ISODate): string {
  const w = weekdayName(date)
  switch (mode) {
    case 'recent8':
      return `평소 ${w} (최근 8번 평균)`
    case 'weather':
      return `날씨가 비슷했던 ${w}`
    case 'lastYearWeekday':
      return '작년 이맘때 같은 요일'
    case 'lastYearDate':
      return '작년 같은 날짜'
  }
}

export function modeHint(mode: CompareMode): string {
  switch (mode) {
    case 'recent8':
      return '지난 8주의 같은 요일과 비교해요. 보고 있는 날은 평균에 넣지 않아요.'
    case 'weather':
      return '지난 8주 중 점심에 비가 왔는지가 같은 날끼리만 비교해요.'
    case 'lastYearWeekday':
      return '요일이 같도록 364일 전과 비교해요.'
    case 'lastYearDate':
      return '달력 날짜가 같은 날이에요. 요일은 다를 수 있어요.'
  }
}

/** 표와 칸에 쓰는 한 단어: 평소 / 작년 */
export function baseWord(mode: CompareMode): string {
  return mode === 'lastYearWeekday' || mode === 'lastYearDate' ? '작년' : '평소'
}

/** ‘평소와’ / ‘작년과’ */
export function baseWith(mode: CompareMode): string {
  return baseWord(mode) === '작년' ? '작년과' : '평소와'
}

/** 실제로 비교한 대상 (몇 번인지, 어느 날짜인지까지) */
export function baseLabel(base: Baseline): string {
  const w = weekdayName(base.date)
  const n = base.days.length
  switch (base.mode) {
    case 'recent8':
      return `평소 ${w} · 최근 ${n}번 평균`
    case 'weather':
      return base.rainyTarget ? `비 온 ${w} ${n}번 평균` : `비 안 온 ${w} ${n}번 평균`
    case 'lastYearWeekday':
      return n ? `작년 같은 요일 · ${dateFull(base.days[0].date)}` : '작년 같은 요일'
    case 'lastYearDate':
      return n ? `작년 같은 날짜 · ${dateFull(base.days[0].date)}` : '작년 같은 날짜'
  }
}

/** 문장 안에 넣는 짧은 이름 */
export function baseShort(base: Baseline): string {
  const w = weekdayName(base.date)
  const n = base.days.length
  switch (base.mode) {
    case 'recent8':
      return `평소 ${w}`
    case 'weather':
      return base.rainyTarget ? `비 온 ${w} ${n}번 평균` : `비 안 온 ${w} ${n}번 평균`
    case 'lastYearWeekday':
      return n ? `작년 같은 요일(${dateFull(base.days[0].date)})` : '작년 같은 요일'
    case 'lastYearDate':
      return n ? `작년 같은 날짜(${dateFull(base.days[0].date)})` : '작년 같은 날짜'
  }
}

/** 저장할 때 보여 주는 이름: ‘Le Marais점 · 토요일 · 날씨가 비슷했던 토요일과 비교’ */
export function ruleLabel(branch: BranchId, dow: number, mode: CompareMode): string {
  const w = `${'일월화수목금토'[dow]}요일`
  const name =
    mode === 'recent8'
      ? `평소 ${w}과 비교`
      : mode === 'weather'
        ? `날씨가 비슷했던 ${w}과 비교`
        : mode === 'lastYearWeekday'
          ? '작년 같은 요일과 비교'
          : '작년 같은 날짜와 비교'
  return `${branchById(branch).name} · ${w} · ${name}`
}

/* ───────── 문장 조각 ───────── */

const direction = (diff: number): string => (diff < 0 ? '적어요' : '많아요')

export function dominantMeal(c: Comparison): { meal: Meal; share: number; opposite: boolean } | null {
  if (!c.comparable || c.diff === null) return null
  const l = c.meals.lunch.diff ?? 0
  const d = c.meals.dinner.diff ?? 0
  const meal: Meal = Math.abs(l) >= Math.abs(d) ? 'lunch' : 'dinner'
  const part = meal === 'lunch' ? l : d
  const opposite = l * d < 0
  const share = c.diff !== 0 ? part / c.diff : 0
  return { meal, share, opposite }
}

export function peakHour(c: Comparison): { hour: number; diff: number } | null {
  if (!c.comparable) return null
  let best: { hour: number; diff: number } | null = null
  for (const h of c.hours) {
    if (h.diff === null) continue
    if (!best || Math.abs(h.diff) > Math.abs(best.diff)) best = { hour: h.hour, diff: h.diff }
  }
  return best
}

/** ‘점심 손님이 68명에서 44명으로 줄었어요. 1명당 쓴 돈은 €16로 같아요.’ */
export function mealDriverSentence(m: MealComparison): string | null {
  if (!m.base || m.checkActual === null || m.checkBase === null) return null
  const label = MEAL_LABEL[m.meal]
  const g0 = Math.round(m.base.guests)
  const g1 = m.actual.guests
  const same = Math.round(m.checkActual) === Math.round(m.checkBase)
  const close = Math.abs(m.checkActual - m.checkBase) < m.checkBase * 0.03
  const guestPart =
    g0 === g1 ? `${label} 손님은 ${people(g1)}으로 같아요.` : `${label} 손님이 ${people(g0)}에서 ${people(g1)}으로 ${g1 < g0 ? '줄었어요' : '늘었어요'}.`
  const checkPart = same
    ? `1명당 쓴 돈은 ${eurCheck(m.checkActual)}로 같아요.`
    : close
      ? `1명당 쓴 돈은 ${eurCheck(m.checkBase)}에서 ${eurCheck(m.checkActual)}로 거의 같아요.`
      : `1명당 쓴 돈은 ${eurCheck(m.checkBase)}에서 ${eurCheck(m.checkActual)}로 ${m.checkActual < m.checkBase ? '줄었어요' : '늘었어요'}.`
  return `${guestPart} ${checkPart}`
}

/** ‘점심 테이블이 28.4개에서 19개로 줄었어요. 테이블당 쓴 돈은 €38.34에서 €37.05로 거의 같아요.’ */
export function mealTableSentence(m: MealComparison): string | null {
  if (!m.base || m.base.tables <= 0 || m.actual.tables <= 0) return null
  const label = MEAL_LABEL[m.meal]
  const t0 = m.base.tables
  const t1 = m.actual.tables
  const p0 = m.base.revenue / t0
  const p1 = m.actual.revenue / t1
  const tablePart =
    Math.abs(t1 - t0) < 0.5 ? `${label} 테이블은 ${tablesText(t1)}로 같아요.` : `${label} 테이블이 ${tablesText(t0)}에서 ${tablesText(t1)}로 ${t1 < t0 ? '줄었어요' : '늘었어요'}.`
  const spendPart =
    Math.abs(p1 - p0) < p0 * 0.05
      ? `테이블당 쓴 돈은 ${eurCheck(p0)}에서 ${eurCheck(p1)}로 거의 같아요.`
      : `테이블당 쓴 돈은 ${eurCheck(p0)}에서 ${eurCheck(p1)}로 ${p1 < p0 ? '줄었어요' : '늘었어요'}.`
  return `${tablePart} ${spendPart}`
}

/**
 * 매출 = 테이블 수 × 한 테이블 인원 × 1명당 쓴 돈.
 * 차이를 이 세 가지로 나눈다. 세 값을 더하면 매출 차이와 같다.
 */
export function levers(m: MealComparison): { tables: number; party: number; check: number } | null {
  const b = m.base
  const a = m.actual
  if (!b || b.tables <= 0 || b.guests <= 0 || a.tables <= 0 || a.guests <= 0) return null
  const party0 = b.guests / b.tables
  const party1 = a.guests / a.tables
  const check0 = b.revenue / b.guests
  const check1 = a.revenue / a.guests
  return {
    tables: (a.tables - b.tables) * party0 * check0,
    party: a.tables * (party1 - party0) * check0,
    check: a.guests * (check1 - check0),
  }
}

/* ───────── ‘왜 이렇게 나왔나요?’ ───────── */

export type BackgroundKind = 'weather' | 'event' | 'strike' | 'pattern' | 'memo'

export interface Background {
  kind: BackgroundKind
  text: string
  /** 어디서 온 정보인지 */
  source: string
  context?: ContextItem
}

export interface CheckItem {
  /** 점장에게 물어볼 질문 */
  question: string
  /** 회의 목록에 같이 적을 한 줄 요약 */
  summary: string
  branch: BranchId
}

export interface Analysis {
  comparable: boolean
  reason: string | null
  headline: string
  facts: string[]
  backgrounds: Background[]
  checks: CheckItem[]
}

function rainBackgrounds(date: ISODate): Background[] {
  const out: Background[] = []
  const l = mealRainMm(date, 'lunch')
  const d = mealRainMm(date, 'dinner')
  if (l > 0) out.push({ kind: 'weather', text: `점심(12~15시)에 비가 왔어요. 모두 ${mm(l)}.`, source: '날씨 기록' })
  if (d > 0) out.push({ kind: 'weather', text: `저녁(18~22시)에 비가 왔어요. 모두 ${mm(d)}.`, source: '날씨 기록' })
  return out
}

function contextBackground(c: ContextItem): Background {
  return {
    kind: c.kind,
    text: `${c.title} — ${c.scope}, ${dateMD(c.start)}${c.end !== c.start ? `~${dateMD(c.end)}` : ''} ${c.hours}.`,
    source: c.kind === 'strike' ? '파업 기록' : '행사 기록',
    context: c,
  }
}

function summaryLine(branch: BranchId, date: ISODate, c: Comparison): string {
  const dom = dominantMeal(c)
  const head = `${branchById(branch).name} · ${dateShort(date)}`
  if (!c.comparable || c.diff === null || !dom) return head
  const m = c.meals[dom.meal]
  const g0 = m.base ? Math.round(m.base.guests) : null
  const guestPart = g0 !== null && g0 !== m.actual.guests ? ` · ${MEAL_LABEL[dom.meal]} 손님 ${g0}명 → ${m.actual.guests}명` : ''
  return `${head} · 매출 ${eurDiff(c.diff)} (${pct(c.rate)})${guestPart}`
}

function branchChecks(branch: BranchId, date: ISODate, c: Comparison, hasMemo: boolean): CheckItem[] {
  const out: CheckItem[] = []
  if (!c.comparable || c.diff === null) return out
  const summary = summaryLine(branch, date, c)
  const add = (question: string) => {
    if (!out.some((o) => o.question === question)) out.push({ question, summary, branch })
  }
  const dom = dominantMeal(c)
  const contexts = contextFor(branch, date)
  const small = c.rate !== null && Math.abs(c.rate) < 0.05
  if (small || !dom) {
    return out
  }
  const m = c.meals[dom.meal]
  const label = MEAL_LABEL[dom.meal]
  const guestsDown = m.base !== null && m.actual.guests < m.base.guests * 0.92
  const guestsUp = m.base !== null && m.actual.guests > m.base.guests * 1.08
  const checkDown = m.checkActual !== null && m.checkBase !== null && m.checkActual < m.checkBase * 0.96
  const rained = mealRainMm(date, dom.meal) > 0

  if (c.diff < 0) {
    if (guestsDown && rained && branch === 'marais') add('비 오는 날 테라스 자리를 어떻게 했는지')
    if (contexts.some((x) => x.kind === 'strike')) add('파업한 날 일한 사람 수와 포장 주문은 어땠는지')
    if (guestsDown) add(`${label} 예약이나 노쇼, 대기가 평소와 달랐는지`)
    if (checkDown) add('할인이나 세트가 바뀌었는지, 품절된 메뉴가 있었는지')
    if (!hasMemo) add('일한 사람 수와 영업시간이 평소와 같았는지')
  } else {
    if (contexts.some((x) => x.kind === 'event')) add('행사한 날 대기 시간과 재료는 괜찮았는지')
    if (guestsUp) add(`${label}에 손님이 몰릴 때 자리와 일손은 충분했는지`)
    add('잘된 이유 중 다른 날에도 쓸 수 있는 게 있는지')
  }
  return out.slice(0, 3)
}

export function analyze(scope: Scope, date: ISODate, mode: CompareMode, memoText: string | null): Analysis {
  const c = compare(scope, date, mode)
  const name = scopeName(scope)
  if (!c.comparable || c.diff === null) {
    const hasDay = c.day.status === 'ok' || c.day.status === 'partial'
    return {
      comparable: false,
      reason: c.reason,
      headline: hasDay ? `${name} 매출 ${eur(c.day.total.revenue)} · ${c.reason}` : (c.reason ?? '비교할 날이 없어요'),
      facts: hasDay ? [`하루 매출은 ${eur(c.day.total.revenue)}, 손님은 ${people(c.day.total.guests)}이에요.`] : [],
      backgrounds: [],
      checks: [],
    }
  }

  const facts: string[] = []
  const base = c.base
  facts.push(`하루 매출은 ${eur(c.actual.revenue)}예요. ${baseShort(base)}(${eur(base.total.revenue)})보다 ${eur(Math.abs(c.diff))} ${direction(c.diff)} (${pct(c.rate)}).`)
  const dom = dominantMeal(c)
  const meaningful = Math.abs(c.diff) >= 3000 && c.rate !== null && Math.abs(c.rate) >= 0.05
  if (!meaningful) facts.push(`차이가 5%도 안 돼요. ${baseWith(mode)} 비슷한 날이에요.`)
  if (dom && meaningful) {
    const m = c.meals[dom.meal]
    if (dom.opposite) {
      facts.push(`점심은 ${eurDiff(c.meals.lunch.diff ?? 0)}, 저녁은 ${eurDiff(c.meals.dinner.diff ?? 0)}로 서로 반대였어요.`)
    } else {
      facts.push(
        c.diff < 0
          ? `줄어든 돈의 ${pctPlain(dom.share)}(${eur(Math.abs(m.diff ?? 0))})가 ${MEAL_LABEL[dom.meal]}(${MEAL_HOURS[dom.meal]})에서 빠졌어요.`
          : `늘어난 돈의 ${pctPlain(dom.share)}(${eur(Math.abs(m.diff ?? 0))})가 ${MEAL_LABEL[dom.meal]}(${MEAL_HOURS[dom.meal]})에서 나왔어요.`,
      )
    }
    const driver = mealDriverSentence(m)
    if (driver) facts.push(driver)
    const tableLine = mealTableSentence(m)
    if (tableLine) facts.push(tableLine)
    const lv = levers(m)
    if (lv) {
      facts.push(`${MEAL_LABEL[dom.meal]} 차이를 나눠 보면, 테이블 수 때문에 ${eurDiff(lv.tables)}, 한 테이블 인원 때문에 ${eurDiff(lv.party)}, 1명당 쓴 돈 때문에 ${eurDiff(lv.check)}예요.`)
    } else if (m.guestEffect !== null && m.checkEffect !== null) {
      facts.push(`${MEAL_LABEL[dom.meal]} 차이를 나눠 보면, 손님 수 때문에 ${eurDiff(m.guestEffect)}, 1명당 쓴 돈 때문에 ${eurDiff(m.checkEffect)}예요.`)
    }
    const peak = peakHour(c)
    if (peak && scope !== 'all') facts.push(`가장 차이가 큰 시간은 ${peak.hour}시예요 (${eurDiff(peak.diff)}).`)
  }
  if (base.referenceOnly) facts.push(`비교한 날이 ${base.days.length}번뿐이라 참고만 하세요.`)

  const backgrounds: Background[] = [...rainBackgrounds(date)]
  for (const ctx of contextFor(scope, date)) backgrounds.push(contextBackground(ctx))

  let checks: CheckItem[] = []
  if (scope !== 'all') {
    const split = weatherSplit(scope, date)
    if ((mode === 'recent8' || mode === 'weather') && split.rainy.n >= 2 && split.dry.n >= 2 && split.rainy.avg !== null && split.dry.avg !== null) {
      const w = weekdayName(date)
      backgrounds.push({
        kind: 'pattern',
        text: `최근 ${w} 8번을 나눠 보면, 점심에 비 온 ${split.rainy.n}번은 평균 ${eur(split.rainy.avg)}, 비 안 온 ${split.dry.n}번은 평균 ${eur(split.dry.avg)}예요.`,
        source: '매출과 날씨를 같이 본 것',
      })
    }
    if (memoText) backgrounds.push({ kind: 'memo', text: memoText, source: '내 메모' })
    checks = branchChecks(scope, date, c, Boolean(memoText))
  } else {
    const rank = branchRanking(date, mode).filter((r) => r.comparable && r.diff !== null)
    const down = rank.filter((r) => (r.diff ?? 0) < 0)
    if (rank.length) {
      const worst = rank[0]
      const best = rank[rank.length - 1]
      facts.push(
        `5개 지점 중 ${down.length}곳이 ${baseWord(mode)}보다 적게 벌었어요. 가장 많이 줄어든 곳은 ${scopeName(worst.day.scope)}(${eurDiff(worst.diff ?? 0)})${
          (best.diff ?? 0) > 0 ? `, 가장 많이 늘어난 곳은 ${scopeName(best.day.scope)}(${eurDiff(best.diff ?? 0)})` : ''
        }이에요.`,
      )
      for (const r of rank) {
        if (r.rate !== null && Math.abs(r.rate) >= 0.1) {
          checks.push(...branchChecks(r.day.scope as BranchId, date, r, false).slice(0, 1))
        }
      }
      checks = checks.slice(0, 3)
    }
  }

  const headline = `${name} 매출 ${eur(c.actual.revenue)} · ${baseShort(base)}보다 ${eurDiff(c.diff)} (${pct(c.rate)})`
  return { comparable: true, reason: null, headline, facts, backgrounds, checks }
}

export const BACKGROUND_CAVEAT = '같은 날 있었던 일일 뿐이에요. 이것 때문에 매출이 달라졌다고 확인된 건 아니에요.'

export function weekdayOfDate(d: ISODate): number {
  return weekday(d)
}

export { BRANCH_IDS, LUNCH_HOURS, DINNER_HOURS }
