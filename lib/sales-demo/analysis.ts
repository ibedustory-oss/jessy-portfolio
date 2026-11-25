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

/* ───────── 비교 기준 이름 ───────── */

/** 메뉴에 쓰는 이름 (날짜의 요일만 반영) */
export function modeLabel(mode: CompareMode, date: ISODate): string {
  const w = weekdayName(date)
  switch (mode) {
    case 'recent8':
      return `최근 ${w} 8일 평균`
    case 'weather':
      return `날씨가 같았던 ${w} 평균`
    case 'lastYearWeekday':
      return '작년 같은 요일 (364일 전)'
    case 'lastYearDate':
      return '작년 같은 날짜'
  }
}

export function modeHint(mode: CompareMode): string {
  switch (mode) {
    case 'recent8':
      return '직전 8주의 같은 요일. 선택일은 평균에서 빼요.'
    case 'weather':
      return '최근 8일 중 점심(12~15시) 강수 여부가 선택일과 같은 날만.'
    case 'lastYearWeekday':
      return '요일이 같은 364일 전 하루.'
    case 'lastYearDate':
      return '달력 날짜가 같은 하루. 요일이 다를 수 있어요.'
  }
}

/** 실제로 적용된 기준의 이름 (표본 수와 날짜 포함) */
export function baseLabel(base: Baseline): string {
  const w = weekdayName(base.date)
  const n = base.days.length
  switch (base.mode) {
    case 'recent8':
      return `최근 ${w} ${n}일 평균`
    case 'weather':
      return base.rainyTarget ? `비 온 ${w} ${n}일 평균` : `비가 오지 않은 ${w} ${n}일 평균`
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
      return `최근 ${w} ${n}일 평균`
    case 'weather':
      return base.rainyTarget ? `비 온 ${w} ${n}일 평균` : `비가 오지 않은 ${w} ${n}일 평균`
    case 'lastYearWeekday':
      return n ? `작년 같은 요일(${dateFull(base.days[0].date)})` : '작년 같은 요일'
    case 'lastYearDate':
      return n ? `작년 같은 날짜(${dateFull(base.days[0].date)})` : '작년 같은 날짜'
  }
}

/** 저장 미리보기에 쓰는 규칙 이름: ‘Le Marais점 · 토요일 · 날씨가 같았던 토요일 평균’ */
export function ruleLabel(branch: BranchId, dow: number, mode: CompareMode): string {
  const w = `${'일월화수목금토'[dow]}요일`
  const name =
    mode === 'recent8'
      ? `최근 ${w} 8일 평균`
      : mode === 'weather'
        ? `날씨가 같았던 ${w} 평균`
        : mode === 'lastYearWeekday'
          ? '작년 같은 요일'
          : '작년 같은 날짜'
  return `${branchById(branch).name} · ${w} · ${name}`
}

/* ───────── 문장 조각 ───────── */

const direction = (diff: number): string => (diff < 0 ? '적었어요' : '많았어요')

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

/** ‘손님은 68명 → 44명, 객단가는 €16로 같았어요’ */
export function mealDriverSentence(m: MealComparison): string | null {
  if (!m.base || m.checkActual === null || m.checkBase === null) return null
  const label = MEAL_LABEL[m.meal]
  const g0 = Math.round(m.base.guests)
  const g1 = m.actual.guests
  const same = Math.round(m.checkActual) === Math.round(m.checkBase)
  const close = Math.abs(m.checkActual - m.checkBase) < m.checkBase * 0.03
  const guestPart =
    g0 === g1 ? `${label} 손님은 ${people(g1)}으로 같았고` : `${label} 손님은 평균 ${people(g0)}에서 ${people(g1)}으로 ${g1 < g0 ? '줄었고' : '늘었고'}`
  const checkPart = same
    ? `객단가는 ${eurCheck(m.checkActual)}로 같았어요.`
    : close
      ? `객단가는 ${eurCheck(m.checkBase)}에서 ${eurCheck(m.checkActual)}로 거의 같았어요.`
      : `객단가는 ${eurCheck(m.checkBase)}에서 ${eurCheck(m.checkActual)}로 ${m.checkActual < m.checkBase ? '내렸어요' : '올랐어요'}.`
  return `${guestPart}, ${checkPart}`
}

/* ───────── 근거 패널 ───────── */

export type BackgroundKind = 'weather' | 'event' | 'strike' | 'pattern' | 'memo'

export interface Background {
  kind: BackgroundKind
  text: string
  /** 출처 구분 표시 */
  source: string
  context?: ContextItem
}

export interface CheckItem {
  /** 확인할 질문 */
  question: string
  /** 회의 안건에 넣을 때 붙일 요약 */
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
  if (l > 0) out.push({ kind: 'weather', text: `점심 시간(12~15시)에 비가 기록됐어요 (합계 ${mm(l)}).`, source: '날씨 기록 · 시간별' })
  if (d > 0) out.push({ kind: 'weather', text: `저녁 시간(18~22시)에 비가 기록됐어요 (합계 ${mm(d)}).`, source: '날씨 기록 · 시간별' })
  return out
}

function contextBackground(c: ContextItem): Background {
  return {
    kind: c.kind,
    text: `${c.title} — ${c.scope}, ${dateMD(c.start)}${c.end !== c.start ? `~${dateMD(c.end)}` : ''} ${c.hours}.`,
    source: c.kind === 'strike' ? '사회적 이슈 기록' : '지역 행사 기록',
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
    if (guestsDown && rained && branch === 'marais') add('비 오는 날 테라스 좌석을 어떻게 운영했는지')
    if (contexts.some((x) => x.kind === 'strike')) add('파업일 근무 인원과 포장 주문 대응이 어땠는지')
    if (guestsDown) add(`${label} 예약·노쇼와 대기 상황이 평소와 달랐는지`)
    if (checkDown) add('할인·세트 구성이 바뀌었거나 품절된 메뉴가 있었는지')
    if (!hasMemo) add('근무 인원과 영업시간이 평소와 같았는지')
  } else {
    if (contexts.some((x) => x.kind === 'event')) add('행사일 대기 시간과 재료 소진 상황이 어땠는지')
    if (guestsUp) add(`${label}에 손님이 몰렸을 때 좌석 회전과 인력은 충분했는지`)
    add('잘된 요인 중 다른 날에도 적용할 수 있는 것이 있는지')
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
      headline: hasDay ? `${name} 매출 ${eur(c.day.total.revenue)} · ${c.reason}` : (c.reason ?? '비교할 데이터가 없어요'),
      facts: hasDay ? [`하루 매출은 ${eur(c.day.total.revenue)}, 방문객은 ${people(c.day.total.guests)}이에요.`] : [],
      backgrounds: [],
      checks: [],
    }
  }

  const facts: string[] = []
  const base = c.base
  facts.push(
    `하루 매출 ${eur(c.actual.revenue)} — ${baseShort(base)} ${eur(base.total.revenue)}보다 ${eur(Math.abs(c.diff))} ${direction(c.diff)} (${pct(c.rate)}).`,
  )
  const dom = dominantMeal(c)
  const meaningful = Math.abs(c.diff) >= 3000 && c.rate !== null && Math.abs(c.rate) >= 0.05
  if (!meaningful) facts.push('차이가 5% 미만이에요. 시간대별로 나눠 볼 만큼 큰 차이는 없어요.')
  if (dom && meaningful) {
    const m = c.meals[dom.meal]
    if (dom.opposite) {
      facts.push(`점심은 ${eurDiff(c.meals.lunch.diff ?? 0)}, 저녁은 ${eurDiff(c.meals.dinner.diff ?? 0)}로 방향이 달랐어요.`)
    } else {
      facts.push(`차액의 ${pctPlain(dom.share)}(${eurDiff(m.diff ?? 0)})가 ${MEAL_LABEL[dom.meal]}(${MEAL_HOURS[dom.meal]})에서 나왔어요.`)
    }
    const driver = mealDriverSentence(m)
    if (driver) facts.push(driver)
    if (m.guestEffect !== null && m.checkEffect !== null) {
      facts.push(`${MEAL_LABEL[dom.meal]} 차액을 나누면 손님 수 변화가 ${eurDiff(m.guestEffect)}, 객단가 변화가 ${eurDiff(m.checkEffect)}예요.`)
    }
    const peak = peakHour(c)
    if (peak && scope !== 'all') facts.push(`차이가 가장 큰 시간은 ${peak.hour}시예요 (${eurDiff(peak.diff)}).`)
  }
  if (base.referenceOnly) facts.push(`비교한 날이 ${base.days.length}일뿐이라 참고용으로만 봐 주세요.`)

  const backgrounds: Background[] = [...rainBackgrounds(date)]
  for (const ctx of contextFor(scope, date)) backgrounds.push(contextBackground(ctx))

  let checks: CheckItem[] = []
  if (scope !== 'all') {
    const split = weatherSplit(scope, date)
    if ((mode === 'recent8' || mode === 'weather') && split.rainy.n >= 2 && split.dry.n >= 2 && split.rainy.avg !== null && split.dry.avg !== null) {
      const w = weekdayName(date)
      backgrounds.push({
        kind: 'pattern',
        text: `최근 ${w} 8일을 나눠 보면, 점심에 비가 온 ${split.rainy.n}일은 평균 ${eur(split.rainy.avg)}, 오지 않은 ${split.dry.n}일은 평균 ${eur(split.dry.avg)}였어요.`,
        source: '매출 자료 × 날씨 기록',
      })
    }
    if (memoText) backgrounds.push({ kind: 'memo', text: memoText, source: '점주 메모' })
    checks = branchChecks(scope, date, c, Boolean(memoText))
  } else {
    const rank = branchRanking(date, mode).filter((r) => r.comparable && r.diff !== null)
    const down = rank.filter((r) => (r.diff ?? 0) < 0)
    if (rank.length) {
      const worst = rank[0]
      const best = rank[rank.length - 1]
      facts.push(
        `5개 지점 중 ${down.length}곳이 비교 기준보다 낮았어요. 가장 많이 줄어든 곳은 ${scopeName(worst.day.scope)}(${eurDiff(worst.diff ?? 0)})${
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

  const headline = `${name} 매출 ${eur(c.actual.revenue)} · ${baseShort(base)} 대비 ${eurDiff(c.diff)} (${pct(c.rate)})`
  return { comparable: true, reason: null, headline, facts, backgrounds, checks }
}

export const BACKGROUND_CAVEAT = '같은 날 기록된 자료예요. 매출이 달라진 원인으로 확인된 것은 아니에요.'

export function weekdayOfDate(d: ISODate): number {
  return weekday(d)
}

export { BRANCH_IDS, LUNCH_HOURS, DINNER_HOURS }
