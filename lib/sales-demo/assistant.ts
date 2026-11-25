/**
 * 질문 처리 — 한국어 질문의 의도를 규칙으로 분류하고,
 * 현재 지점·날짜·비교 기준의 집계 결과(metrics)로만 답한다.
 * 데모 응답이며 외부 AI를 호출하지 않는다. 자료에 없는 수치는 만들지 않는다.
 */
import { addDays, daysInMonth, makeDate, parts, weekday, type ISODate } from './calendar'
import { BRANCHES, BRANCH_IDS, TODAY, VIEW_END, VIEW_START, contextFor, isRainyLunch, mealRainMm, type BranchId } from './data'
import {
  MEAL_LABEL,
  analyze,
  baseLabel,
  baseShort,
  baseWith,
  baseWord,
  dominantMeal,
  levers,
  mealDriverSentence,
  modeLabel,
  peakHour,
  ruleLabel,
  scopeName,
  type CheckItem,
} from './analysis'
import { dateFull, dateMD, dateRange, dateShort, eur, eurCheck, eurDiff, josa, mm, pct, people, tablesText, weekdayName, weekdayNameOf } from './format'
import {
  baseline,
  branchRanking,
  checkOf,
  compare,
  findFlags,
  inView,
  perTable,
  rangeSummary,
  rateOf,
  weatherSplit,
  type CompareMode,
  type RangeSpec,
  type Scope,
} from './metrics'
import { defaultKey, type Defaults, type Memo, type ViewState } from './types'
import { findPatterns } from './patterns'
import { describePattern } from './patterns-text'

export type Intent =
  | 'overview'
  | 'guestCheck'
  | 'weather'
  | 'others'
  | 'lastYear'
  | 'reset'
  | 'save'
  | 'unsave'
  | 'memo'
  | 'agenda'
  | 'summary'
  | 'patterns'
  | 'unsupported'

export type Effect =
  | { type: 'setScope'; scope: Scope }
  | { type: 'setDate'; date: ISODate }
  | { type: 'setMode'; mode: CompareMode }
  | { type: 'showBranches'; highlight: BranchId | null }
  | { type: 'saveMemo'; branch: BranchId; date: ISODate; text: string }
  | { type: 'addAgenda'; item: CheckItem; date: ISODate }
  | { type: 'openAgenda' }
  | { type: 'removeDefault'; branch: BranchId; dow: number }

export type AnswerAction =
  | { kind: 'ask'; label: string; text: string }
  | { kind: 'evidence'; label: string }
  | { kind: 'goto'; label: string; scope: Scope; date: ISODate }
  | { kind: 'agenda'; label: string; item: CheckItem; date: ISODate }
  | { kind: 'openAgenda'; label: string }
  | { kind: 'scroll'; label: string; target: string }

export interface AnswerRow {
  branch: BranchId
  name: string
  revenue: number | null
  diff: number | null
  rate: number | null
  highlight: boolean
}

export interface SavePreview {
  branch: BranchId
  dow: number
  mode: CompareMode
  /** ‘Le Marais점 · 토요일 · 날씨가 같았던 토요일 평균’ */
  label: string
  /** 선택일에 적용했을 때의 실제 기준 */
  resolved: string
}

export interface Answer {
  intent: Intent
  paragraphs: string[]
  caveat?: string
  rows?: AnswerRow[]
  rowsCaption?: string
  preview?: SavePreview
  actions: AnswerAction[]
  suggestions?: string[]
  /** 답변 당시의 조건 */
  conditions: string
  /** 이 답변이 가리키는 대상 */
  view: ViewState
  effects: Effect[]
}

export interface AssistantEnv {
  view: ViewState
  /** 직전 답변의 대상 (`scope|date`) */
  lastTarget: string | null
  defaults: Defaults
  memos: Memo[]
  /** 상단에서 보고 있는 기간 */
  range: RangeSpec
}

export const targetKey = (v: { scope: Scope; date: ISODate }): string => `${v.scope}|${v.date}`

export function conditionsLabel(v: ViewState): string {
  const base = baseline(v.scope, v.date, v.mode)
  return `${scopeName(v.scope)} · ${dateShort(v.date)} · ${base.available ? baseLabel(base) : modeLabel(v.mode, v.date)}`
}

/* ───────── 질문 해석 ───────── */

const RE = {
  unsave: /(기본값|저장).*(해제|삭제|지워|없애|취소)/,
  save: /(앞으로|매번|항상|마다|계속).*(보여|해\s?줘|비교|이렇게|해줘)|기본값|기본으로/,
  memo: /^메모\s*[:：]?|메모.*(남겨|추가|적어|저장|기록)/,
  agenda: /회의|안건/,
  patterns: /개선|문제점|문제가|문제는|약점|기회|패턴|반복|되풀이|고칠|고쳐|손볼|어디가 약|새는/,
  unsupported: /예측|예상|내일|다음\s?(주|달)|메뉴|원가|이익|마진|리뷰|직원|인건비|배달|재고/,
  others: /다른\s?(지점|매장|곳|가게|점)|지점별|매장별|전\s?지점|모든\s?(지점|매장)|다섯\s?(지점|매장)|5개\s?(지점|매장)|어느\s?(지점|매장)|(지점|매장).*(비교|순위)/,
  lastYear: /작년|전년|지난해|1년\s?전/,
  sameDate: /같은\s?날짜|같은\s?날(?!씨)|날짜\s?(기준|로)/,
  weather: /비\s?(온|오는|왔|올|가\s?(온|오|왔))|비온|우천|날씨|맑은|강수/,
  reset: /원래|최근.*평균|평소(와|랑|대로|\s?토|\s?[일월화수목금]요일)|8일|8주|8번|처음\s?(기준|방식)/,
  guestCheck: /손님|방문객|객단가|고객\s?수|인원|덜\s?(써|쓰|썼)|1명당|한\s?명당|테이블|팀당|한\s?팀|일행|단가/,
  hour: /몇\s?시|시간대|언제/,
  summary: /지난\s?주|이번\s?주|주간|이번\s?달|요약|전체적|기간/,
  overview: /왜|이유|원인|낮|줄|떨어|감소|하락|높|늘|올랐|증가|어땠|어때|어떻|매출|실적/,
  lower: /낮|줄|떨어|감소|하락|적/,
  higher: /높|늘|올랐|증가|많/,
}

function findBranch(q: string): BranchId | null {
  for (const b of BRANCHES) {
    if (b.aliases.some((a) => q.includes(a))) return b.id
  }
  return null
}

const WEEKDAY_CHARS = '일월화수목금토'

function findWeekday(q: string): number | null {
  const m = q.match(/([일월화수목금토])요일/)
  return m ? WEEKDAY_CHARS.indexOf(m[1]) : null
}

function findDate(q: string, current: ISODate): ISODate | null | 'out' {
  const md = q.match(/(\d{1,2})\s*월\s*(\d{1,2})\s*일/) ?? q.match(/(\d{1,2})\/(\d{1,2})/)
  if (md) {
    const m = Number(md[1])
    const d = Number(md[2])
    if (m < 1 || m > 12 || d < 1 || d > 31) return 'out'
    for (const y of [2026, 2025]) {
      if (d > daysInMonth(y, m)) continue
      const date = makeDate(y, m, d)
      if (inView(date)) return date
    }
    return 'out'
  }
  const dOnly = q.match(/(?:^|[^\d])(\d{1,2})\s*일(?!\s*(평균|간|동안|로|만|뿐|중|을|이))/)
  if (dOnly) {
    const p = parts(current)
    const d = Number(dOnly[1])
    if (d >= 1 && d <= daysInMonth(p.y, p.m)) {
      const date = makeDate(p.y, p.m, d)
      return inView(date) ? date : 'out'
    }
  }
  if (/그저께|그제/.test(q)) return addDays(TODAY, -2)
  if (/어제/.test(q)) return addDays(TODAY, -1)
  const wk = q.match(/지난\s?(주\s?)?([일월화수목금토])요일/)
  if (wk) {
    const target = WEEKDAY_CHARS.indexOf(wk[2])
    let d = VIEW_END
    while (weekday(d) !== target) d = addDays(d, -1)
    return d
  }
  return null
}

function extractMemo(raw: string): string {
  const quoted = raw.match(/[“"‘'「]([^”"’'」]+)[”"’'」]/)
  if (quoted) return quoted[1].trim()
  const prefixed = raw.replace(/^\s*메모\s*[:：]?\s*/, '')
  if (prefixed !== raw) return prefixed.replace(/\s*(라고|이라고)?\s*(메모)?\s*(남겨|추가해|적어|저장해|기록해)\s?(줘|주세요)?[.!]?\s*$/, '').trim()
  return raw
    .replace(/\s*(라고|이라고)?\s*메모\s*(로|에)?\s*(남겨|추가해|적어|저장해|기록해)\s?(줘|주세요)?[.!]?\s*$/, '')
    .trim()
}

export const FALLBACK_TEXT = '이 데모에서는 매출, 손님 수, 1명당·테이블당 쓴 돈을 비교할 수 있어요. 무엇을 볼까요?'

/* ───────── 추천 질문 ───────── */

export function suggestionsFor(view: ViewState, defaults: Defaults): string[] {
  const w = weekdayName(view.date)
  const rainy = isRainyLunch(view.date)
  const weatherQ = rainy ? `비 온 ${w}끼리만 비교하면?` : '날씨가 비슷했던 날끼리 비교하면?'
  if (view.scope === 'all') {
    return ['지난주 매출은 어땠어?', '고칠 점이 뭐야?', '이날 어느 지점이 가장 많이 줄었어?', weatherQ, '작년이랑 비교하면?']
  }
  const c = compare(view.scope, view.date, view.mode)
  const first =
    c.diff === null || c.rate === null || Math.abs(c.rate) < 0.03
      ? '이날 매출은 어땠어?'
      : c.diff < 0
        ? '이날 매출이 왜 이렇게 낮았어?'
        : '이날 매출이 왜 이렇게 높았어?'
  const out = [first, '손님이 줄어서야, 덜 써서야?', '테이블당 얼마 썼어?']
  if (view.mode !== 'weather') out.push(weatherQ)
  out.push('그날 다른 지점은 어땠어?')
  if (view.mode !== 'lastYearWeekday') out.push('작년이랑 비교하면?')
  out.push('이 지점에서 고칠 점이 뭐야?')
  const saved = defaults[defaultKey(view.scope, weekday(view.date))]
  if (view.mode !== 'recent8' && saved !== view.mode) out.push(`이 지점은 ${w}마다 이렇게 보여줘`)
  return out
}

/* ───────── 답변 ───────── */

function memoOf(env: AssistantEnv, scope: Scope, date: ISODate): string | null {
  if (scope === 'all') return null
  return env.memos.find((m) => m.branch === scope && m.date === date)?.text ?? null
}

function backgroundSentence(scope: Scope, date: ISODate, diff: number, memo: string | null): string {
  const bits: string[] = []
  const l = mealRainMm(date, 'lunch')
  const d = mealRainMm(date, 'dinner')
  if (l > 0) bits.push(`이날 점심에 비가 왔어요(${mm(l)}).`)
  if (d > 0) bits.push(`이날 저녁에 비가 왔어요(${mm(d)}).`)
  for (const c of contextFor(scope, date)) bits.push(`${c.scope}에 ${c.title}${josa(c.title, '이', '가')} 있었어요.`)
  if (memo) bits.push(`남겨 둔 메모가 있어요: “${memo}”`)
  if (bits.length === 0) return '이날은 비도, 행사도, 파업도 기록에 없어요.'
  return `${bits.join(' ')} 다만 이것 때문에 ${diff < 0 ? '줄었다고' : '늘었다고'} 확인된 건 아니에요.`
}

function overview(env: AssistantEnv, v: ViewState, q: string): Answer {
  const c = compare(v.scope, v.date, v.mode)
  const name = scopeName(v.scope)
  const actions: AnswerAction[] = []
  const paragraphs: string[] = []
  const base = c.base
  if (!c.comparable || c.diff === null) {
    const has = c.day.status === 'ok' || c.day.status === 'partial'
    paragraphs.push(
      has
        ? `${dateMD(v.date)} ${name} 매출은 ${eur(c.day.total.revenue)}예요. ${c.reason}`
        : `${dateMD(v.date)} ${name}: ${c.reason}`,
    )
    if (c.day.status === 'missing') paragraphs.push('기록이 없는 날의 매출은 짐작해서 채우지 않아요.')
    return finish('overview', v, paragraphs, actions)
  }
  const down = c.diff < 0
  const askedLower = RE.lower.test(q) && !RE.higher.test(q)
  const askedHigher = RE.higher.test(q) && !RE.lower.test(q)
  const small = c.rate !== null && Math.abs(c.rate) < 0.03
  let lead = ''
  if (!small && askedLower && !down) lead = `이날은 오히려 ${baseWord(v.mode)}보다 많이 벌었어요. `
  if (!small && askedHigher && down) lead = `이날은 오히려 ${baseWord(v.mode)}보다 적게 벌었어요. `
  let p1 = `${lead}${dateMD(v.date)} ${name} 매출은 ${eur(c.actual.revenue)}예요. ${baseShort(base)}(${eur(base.total.revenue)})보다 ${eur(Math.abs(c.diff))} ${down ? '적어요' : '많아요'} (${pct(c.rate)}).`
  if (small) p1 += ` ${baseWith(v.mode)} 거의 같아요.`
  const dom = dominantMeal(c)
  const notable = c.rate !== null && Math.abs(c.rate) >= 0.05 && Math.abs(c.diff) >= 3000
  if (!small && !notable) p1 += ` 차이가 5%도 안 돼서 ${baseWith(v.mode)} 비슷한 날이에요.`
  if (dom && notable) {
    const m = c.meals[dom.meal]
    if (dom.opposite) {
      p1 += ` 점심은 ${eurDiff(c.meals.lunch.diff ?? 0)}, 저녁은 ${eurDiff(c.meals.dinner.diff ?? 0)}로 서로 반대였어요.`
    } else if (dom.share >= 0.6) {
      p1 += down ? ` 줄어든 돈 중 ${eur(Math.abs(m.diff ?? 0))}가 ${MEAL_LABEL[dom.meal]}에서 빠졌어요.` : ` 늘어난 돈 중 ${eur(Math.abs(m.diff ?? 0))}가 ${MEAL_LABEL[dom.meal]}에서 나왔어요.`
    } else {
      p1 += ` 점심 ${eurDiff(c.meals.lunch.diff ?? 0)}, 저녁 ${eurDiff(c.meals.dinner.diff ?? 0)}로 나뉘어요.`
    }
    const driver = mealDriverSentence(m)
    if (driver) p1 += ` ${driver}`
  }
  paragraphs.push(p1)
  if (RE.hour.test(q) && v.scope !== 'all') {
    const peak = peakHour(c)
    if (peak) paragraphs.push(`가장 차이가 큰 시간은 ${peak.hour}시예요 (${eurDiff(peak.diff)}).`)
  }
  if (v.scope === 'all') {
    const rank = branchRanking(v.date, v.mode).filter((r) => r.diff !== null)
    if (rank.length) {
      const worst = rank[0]
      paragraphs.push(`가장 많이 줄어든 지점은 ${scopeName(worst.day.scope)}이에요 (${eurDiff(worst.diff ?? 0)}, ${pct(worst.rate)}).`)
      actions.push({ kind: 'goto', label: `${scopeName(worst.day.scope)} 보기`, scope: worst.day.scope, date: v.date })
    }
  }
  if (notable) paragraphs.push(backgroundSentence(v.scope, v.date, c.diff, memoOf(env, v.scope, v.date)))
  if (base.referenceOnly) paragraphs.push(`비교한 날이 ${base.days.length}번뿐이라 참고만 하세요.`)

  if (v.scope !== 'all' && v.mode !== 'weather' && isRainyLunch(v.date)) {
    const text = `비 온 ${weekdayName(v.date)}끼리만 비교하면?`
    actions.push({ kind: 'ask', label: text, text })
  }
  actions.push({ kind: 'evidence', label: '자세히 보기' })
  const check = v.scope !== 'all' ? analyze(v.scope, v.date, v.mode, memoOf(env, v.scope, v.date)).checks[0] : undefined
  if (check && notable) actions.push({ kind: 'agenda', label: '회의 때 물어보기', item: check, date: v.date })
  return finish('overview', v, paragraphs, actions)
}

function guestCheck(env: AssistantEnv, v: ViewState): Answer {
  const c = compare(v.scope, v.date, v.mode)
  if (!c.comparable) return overview(env, v, '')
  const lines: string[] = []
  const sum = { tables: 0, party: 0, check: 0 }
  for (const meal of ['lunch', 'dinner'] as const) {
    const m = c.meals[meal]
    if (!m.base) continue
    const lv = levers(m)
    if (lv) {
      sum.tables += lv.tables
      sum.party += lv.party
      sum.check += lv.check
    }
    lines.push(
      `${MEAL_LABEL[meal]} (매출 ${eurDiff(m.diff ?? 0)}): 테이블 ${tablesText(m.base.tables)} → ${tablesText(m.actual.tables)}, 손님 ${people(m.base.guests)} → ${people(m.actual.guests)}. 테이블당 ${eurCheck(perTable(m.base))} → ${eurCheck(perTable(m.actual))}, 1명당 ${eurCheck(m.checkBase)} → ${eurCheck(m.checkActual)}.`,
    )
  }
  const parts: [string, number][] = [
    ['테이블 수', sum.tables],
    ['한 테이블 인원', sum.party],
    ['1명당 쓴 돈', sum.check],
  ]
  const total = parts.reduce((t, x) => t + Math.abs(x[1]), 0)
  const detail = parts.map(([name, val]) => `${name} 때문에 ${eurDiff(val)}`).join(', ')
  const top = [...parts].sort((x, y) => Math.abs(y[1]) - Math.abs(x[1]))[0]
  let verdict: string
  if (total < 3000) verdict = '테이블 수도, 한 테이블 인원도, 1명당 쓴 돈도 거의 같아요.'
  else if (Math.abs(top[1]) >= total * 0.6) verdict = `주로 ${top[0]}${josa(top[0], '이', '가')} 달라져서 생긴 차이예요. ${detail}예요.`
  else verdict = `여러 가지가 같이 달라졌어요. ${detail}예요.`
  return finish('guestCheck', v, [`${baseLabel(c.base)}과 비교했어요.`, ...lines, verdict, '테이블은 계산서 한 장을 한 테이블로 셌어요.'], [{ kind: 'evidence', label: '자세히 보기' }])
}

function weatherAnswer(v: ViewState): Answer {
  const c = compare(v.scope, v.date, 'weather')
  const w = weekdayName(v.date)
  const rainy = c.base.rainyTarget
  const kind = rainy ? '비 온' : '비 안 온'
  const paragraphs: string[] = []
  const actions: AnswerAction[] = []
  if (!c.base.available) {
    paragraphs.push(`지난 8주 ${w} 중에 점심에 ${kind} 날이 없어요. 그래서 비교할 날이 없어요.`)
    actions.push({ kind: 'ask', label: '평소와 비교로 돌아가기', text: '원래대로 돌아가 줘' })
    return finish('weather', v, paragraphs, actions)
  }
  if (!c.comparable || c.diff === null) {
    paragraphs.push(`${dateMD(v.date)} ${scopeName(v.scope)}: ${c.reason}`)
    return finish('weather', v, paragraphs, actions)
  }
  const n = c.base.days.length
  const lead = rainy ? `${kind} ${w} ${n}번만 놓고 보면` : `이날 점심에는 비가 안 왔어요. 그래서 ${kind} ${w} ${n}번과 비교했어요. 그날들의`
  paragraphs.push(
    `${lead} 평균 매출은 ${eur(c.base.total.revenue)}예요. 이날은 그보다 ${eur(Math.abs(c.diff))} ${c.diff < 0 ? '적어요' : '많아요'} (${pct(c.rate)}).`,
  )
  if (c.base.referenceOnly) paragraphs.push(`비교한 날이 ${n}번뿐이라 참고만 하세요.`)
  if (v.scope !== 'all') {
    const split = weatherSplit(v.scope, v.date)
    const other = rainy ? split.dry : split.rainy
    if (other.n > 0 && other.avg !== null) {
      paragraphs.push(`지난 8주 중 ${rainy ? '비 안 온' : '비 온'} ${w} ${other.n}번의 평균은 ${eur(other.avg)}예요.`)
    }
  }
  if (rainy) {
    paragraphs.push('점심에 비가 온 건 맞아요. 다만 비 때문에 손님이 달라졌다고 확인된 건 아니에요.')
  }
  actions.push({ kind: 'evidence', label: `비교한 날 ${n}일 보기` })
  return finish('weather', v, paragraphs, actions)
}

function othersAnswer(v: ViewState, origin: BranchId | null): Answer {
  const rank = branchRanking(v.date, v.mode)
  const rows: AnswerRow[] = rank.map((r) => ({
    branch: r.day.scope as BranchId,
    name: scopeName(r.day.scope),
    revenue: r.day.status === 'missing' || r.day.status === 'none' ? null : r.day.total.revenue,
    diff: r.diff,
    rate: r.rate,
    highlight: r.day.scope === origin,
  }))
  const ok = rank.filter((r) => r.diff !== null)
  const down = ok.filter((r) => (r.diff ?? 0) < 0)
  const up = ok.filter((r) => (r.diff ?? 0) > 0)
  const paragraphs: string[] = []
  if (ok.length === 0) {
    paragraphs.push(`${dateMD(v.date)}에는 비교할 날이 없어요.`)
  } else {
    const worst = ok[0]
    paragraphs.push(
      `${dateMD(v.date)}, 5개 지점 중 ${down.length}곳이 ${baseWord(v.mode)}보다 적게 벌었고 ${up.length}곳은 많이 벌었어요. 가장 많이 줄어든 곳은 ${scopeName(worst.day.scope)}이에요 (${eurDiff(worst.diff ?? 0)}).`,
    )
    if (isRainyLunch(v.date) && down.length > 0 && up.length > 0) {
      paragraphs.push('이날 점심에 비가 왔지만, 지점마다 결과가 달랐어요.')
    }
  }
  const actions: AnswerAction[] = []
  const worst = ok[0]
  if (worst && worst.day.scope !== origin && v.scope === 'all') {
    actions.push({ kind: 'goto', label: `${scopeName(worst.day.scope)} 보기`, scope: worst.day.scope, date: v.date })
  }
  const a = finish('others', v, paragraphs, actions)
  a.rows = rows
  a.rowsCaption = `${dateShort(v.date)} · 지점마다 ${modeLabel(v.mode, v.date)}${josa(modeLabel(v.mode, v.date), '과', '와')} 비교`
  a.effects.push({ type: 'showBranches', highlight: origin })
  return a
}

function lastYearAnswer(v: ViewState): Answer {
  const c = compare(v.scope, v.date, v.mode)
  const name = scopeName(v.scope)
  const sameDate = v.mode === 'lastYearDate'
  const paragraphs: string[] = []
  const actions: AnswerAction[] = []
  const ref = c.base.days[0]?.date
  if (!c.comparable || c.diff === null || !ref) {
    paragraphs.push(`${sameDate ? '작년 같은 날짜' : '작년 같은 요일'}은 비교할 날이 없어요.${c.reason && c.reason !== '비교할 날이 없어요' ? ` ${c.reason}` : ''}`)
    for (const e of c.base.excluded) paragraphs.push(`${dateFull(e.date)}: ${e.reason}`)
    return finish('lastYear', v, paragraphs, actions)
  }
  paragraphs.push(
    `${sameDate ? '작년 같은 날짜는' : '작년 같은 요일은'} ${dateFull(ref)}이에요. 그날 ${name} 매출은 ${eur(c.base.total.revenue)}였어요. ${dateMD(v.date)}은 그보다 ${eur(Math.abs(c.diff))} ${c.diff < 0 ? '적어요' : '많아요'} (${pct(c.rate)}).`,
  )
  if (sameDate && weekday(ref) !== weekday(v.date)) {
    paragraphs.push(`요일이 달라요(${weekdayName(ref)} ↔ ${weekdayName(v.date)}). 요일이 달라서 생긴 차이도 섞여 있어요.`)
  }
  const g = c.meals
  const guests0 = Math.round((g.lunch.base?.guests ?? 0) + (g.dinner.base?.guests ?? 0))
  paragraphs.push(`손님은 ${people(guests0)}에서 ${people(c.actual.guests)}으로, 1명당 쓴 돈은 ${eurCheck(checkOf(c.base.total))}에서 ${eurCheck(checkOf(c.actual))}로 바뀌었어요.`)
  if (!sameDate) actions.push({ kind: 'ask', label: '작년 같은 날짜는?', text: '작년 같은 날짜는?' })
  actions.push({ kind: 'evidence', label: '자세히 보기' })
  return finish('lastYear', v, paragraphs, actions)
}

function summaryAnswer(env: AssistantEnv, v: ViewState): Answer {
  const s = rangeSummary(v.scope, env.range)
  const name = scopeName(v.scope)
  const paragraphs: string[] = []
  const actions: AnswerAction[] = []
  let p = `${dateRange(s.start, s.end)} ${name} 매출은 ${eur(s.total.revenue)}예요.`
  if (s.prevYear) {
    const diff = s.total.revenue - s.prevYear.total.revenue
    p += ` 작년 이맘때(${dateRange(s.prevYear.start, s.prevYear.end)})보다 ${eur(Math.abs(diff))} ${diff < 0 ? '적어요' : '많아요'} (${pct(rateOf(s.total.revenue, s.prevYear.total.revenue))}).`
  }
  p += ` 손님은 ${people(s.total.guests)}, 1명당 쓴 돈은 ${eurCheck(checkOf(s.total))}, 테이블당 쓴 돈은 ${eurCheck(perTable(s.total))}예요.`
  if (s.missingDays > 0) p += ` 기록이 없는 날이 ${s.missingDays}일 있어요.`
  paragraphs.push(p)
  if (v.scope === 'all') {
    const per = BRANCH_IDS.map((b) => ({ b, s: rangeSummary(b, env.range) }))
      .filter((x) => x.s.prevYear)
      .map((x) => ({ b: x.b, rate: rateOf(x.s.total.revenue, x.s.prevYear!.total.revenue) ?? 0 }))
      .sort((a, b) => b.rate - a.rate)
    if (per.length >= 2) {
      const top = per[0]
      const low = per[per.length - 1]
      paragraphs.push(`작년과 비교하면 ${scopeName(top.b)}이 가장 많이 늘었고(${pct(top.rate)}), ${scopeName(low.b)}이 가장 적게 늘었어요(${pct(low.rate)}).`)
    }
  }
  const flags = findFlags(v.scope, s.start, s.end, (b, d) => env.defaults[defaultKey(b, weekday(d))] ?? 'recent8')
  const drops = flags.drops.slice(0, 2)
  if (drops.length) {
    paragraphs.push(
      `평소보다 눈에 띄게 적게 번 날: ${drops.map((f) => `${scopeName(f.branch)} ${dateShort(f.date)} ${eurDiff(f.diff)}`).join(', ')}.`,
    )
    const f = drops[0]
    actions.push({ kind: 'goto', label: `${scopeName(f.branch)} · ${dateMD(f.date)} 보기`, scope: f.branch, date: f.date })
  } else {
    paragraphs.push('이 기간에는 평소보다 눈에 띄게 적게 번 날이 없어요.')
  }
  const a = finish('summary', v, paragraphs, actions)
  a.conditions = `${name} · ${dateRange(s.start, s.end)} · 작년 이맘때와 비교`
  return a
}

function patternsAnswer(v: ViewState): Answer {
  const list = findPatterns(v.scope)
  const name = scopeName(v.scope)
  if (list.length === 0) {
    const a = finish('patterns', v, [`최근 6개월 동안 ${name}에서 계속 반복되는 큰 문제는 못 찾았어요.`], [])
    a.conditions = `${name} · 최근 6개월 · 반복되는 일`
    return a
  }
  const top = list.filter((p) => p.kind !== 'strength').slice(0, 3)
  const good = list.find((p) => p.kind === 'strength')
  const paragraphs = ['하루가 아니라 최근 6개월 동안 계속 반복된 일을, 금액이 큰 것부터 보면 이래요.']
  top.forEach((p, i) => {
    const t = describePattern(p)
    paragraphs.push(`${i + 1}. ${v.scope === 'all' ? `${scopeName(p.branch)} — ` : ''}${t.title} · ${t.size}${p.monthly === null ? ` (${t.sizeNote})` : ''}`)
  })
  if (good) {
    const t = describePattern(good)
    paragraphs.push(`잘되는 것도 있어요: ${v.scope === 'all' ? `${scopeName(good.branch)} — ` : ''}${t.title}.`)
  }
  paragraphs.push('금액은 실제로 난 차이이거나, 조건을 정해 계산해 본 값이에요. 이유는 아직 몰라요. 회의에서 물어본 뒤 4주쯤 시험해 보세요.')
  const a = finish('patterns', v, paragraphs, [{ kind: 'scroll', label: '고쳐볼 만한 점 자세히 보기', target: 'sd-patterns' }])
  a.conditions = `${name} · 최근 6개월 · 반복되는 일`
  return a
}

function finish(intent: Intent, view: ViewState, paragraphs: string[], actions: AnswerAction[]): Answer {
  return { intent, paragraphs, actions, conditions: conditionsLabel(view), view, effects: [] }
}

function unsupported(env: AssistantEnv, v: ViewState, detail?: string): Answer {
  const a = finish('unsupported', v, detail ? [detail, FALLBACK_TEXT] : [FALLBACK_TEXT], [])
  a.suggestions = suggestionsFor(v, env.defaults).slice(0, 4)
  return a
}

/** 질문 하나를 처리한다. 화면에 적용할 변화는 effects로 돌려준다. */
export function respond(raw: string, env: AssistantEnv): Answer {
  const q = raw.trim().toLowerCase()
  const effects: Effect[] = []
  let view: ViewState = { ...env.view }

  /* 메모는 본문에 다른 단어가 섞여 있어도 메모로만 다룬다 */
  if (RE.memo.test(q)) {
    const branch = view.scope === 'all' ? findBranch(q) : view.scope
    if (!branch) {
      return unsupported(env, view, '메모는 지점마다 남겨요. 먼저 지점을 골라 주세요.')
    }
    const text = extractMemo(raw.trim())
    if (!text) {
      return finish('memo', view, ['메모 내용도 같이 적어 주세요. 예) 메모: 이날은 테라스를 열지 않았음'], [])
    }
    const a = finish(
      'memo',
      { ...view, scope: branch },
      [
        `${scopeName(branch)} · ${dateShort(view.date)}에 메모를 남겼어요: “${text}”`,
        '메모는 직접 남긴 기록으로만 보여드려요. 메모만 보고 얼마를 손해 봤는지 계산하지는 않아요.',
      ],
      [{ kind: 'evidence', label: '메모 보기' }],
    )
    a.effects.push({ type: 'saveMemo', branch, date: view.date, text })
    return a
  }

  /* 대상 바꾸기: 지점·날짜가 질문에 들어 있으면 먼저 옮긴다 */
  const namedBranch = findBranch(q)
  const wantsOthers = RE.others.test(q)
  if (namedBranch && namedBranch !== view.scope && !wantsOthers) {
    view = { ...view, scope: namedBranch }
    effects.push({ type: 'setScope', scope: namedBranch })
  }
  const isSave = RE.save.test(q) || RE.unsave.test(q)
  const date = isSave ? null : findDate(q, view.date)
  if (date === 'out') {
    return unsupported(env, view, `볼 수 있는 기간은 ${dateFull(VIEW_START)}부터 ${dateFull(VIEW_END)}까지예요.`)
  }
  if (date && date !== view.date) {
    view = { ...view, date }
    effects.push({ type: 'setDate', date })
  }
  const moved = effects.length > 0
  if (moved) {
    // 지점·날짜가 바뀌면 그 지점·요일의 저장된 기준(없으면 최근 평균)에서 다시 시작한다
    const saved = view.scope !== 'all' ? env.defaults[defaultKey(view.scope, weekday(view.date))] : undefined
    view = { ...view, mode: saved ?? 'recent8' }
  }

  const wrap = (a: Answer): Answer => {
    a.effects = [...effects, ...a.effects]
    const changed = env.lastTarget !== null && env.lastTarget !== targetKey(a.view)
    if ((moved || changed) && a.intent !== 'overview' && a.intent !== 'summary' && a.intent !== 'memo' && a.intent !== 'patterns') {
      a.paragraphs = [`${scopeName(a.view.scope)}, ${dateShort(a.view.date)} 이야기예요.`, ...a.paragraphs]
    }
    return a
  }

  if (RE.unsave.test(q)) {
    if (view.scope === 'all') return wrap(unsupported(env, view, '보는 방식은 지점마다 저장해요. 먼저 지점을 골라 주세요.'))
    const dow = findWeekday(q) ?? weekday(view.date)
    const key = defaultKey(view.scope, dow)
    if (!env.defaults[key]) return wrap(finish('unsave', view, [`${scopeName(view.scope)}의 ${weekdayNameOf(dow)}에는 저장한 방식이 없어요.`], []))
    const a = finish('unsave', view, [`${scopeName(view.scope)}의 ${weekdayNameOf(dow)}에 저장한 방식을 지웠어요. 다시 평소 ${weekdayNameOf(dow)}과 비교해요.`], [])
    a.effects.push({ type: 'removeDefault', branch: view.scope, dow })
    return wrap(a)
  }

  if (RE.save.test(q)) {
    if (view.scope === 'all') return wrap(unsupported(env, view, '보는 방식은 지점마다 저장해요. 먼저 지점을 골라 주세요.'))
    const branch: BranchId = view.scope
    let mode = view.mode
    if (RE.weather.test(q)) mode = 'weather'
    else if (RE.lastYear.test(q)) mode = RE.sameDate.test(q) ? 'lastYearDate' : 'lastYearWeekday'
    const dow = findWeekday(q) ?? weekday(view.date)
    const saved = env.defaults[defaultKey(view.scope, dow)]
    if (saved === mode) {
      return wrap(finish('save', view, [`이미 이렇게 저장돼 있어요: ${ruleLabel(view.scope, dow, mode)}`], []))
    }
    if (mode === 'recent8' && !saved) {
      const a = finish('save', view, [`지금 보는 ‘${modeLabel('recent8', view.date)}’은 원래 처음에 나오는 방식이에요. 다른 방식으로 바꾼 다음 저장해 주세요.`], [])
      a.suggestions = [isRainyLunch(view.date) ? `비 온 ${weekdayName(view.date)}끼리만 비교하면?` : '날씨가 비슷했던 날끼리 비교하면?', '작년이랑 비교하면?']
      return wrap(a)
    }
    if (mode !== view.mode) {
      view = { ...view, mode }
      effects.push({ type: 'setMode', mode })
    }
    const base = baseline(view.scope, view.date, mode)
    const a = finish('save', view, [`${scopeName(view.scope)}의 ${weekdayNameOf(dow)}은 앞으로 이렇게 보여드릴까요?`], [])
    a.preview = {
      branch,
      dow,
      mode,
      label: ruleLabel(branch, dow, mode),
      resolved: dow === weekday(view.date) && base.available ? `${dateMD(view.date)}이라면: ${baseLabel(base)}` : '',
    }
    return wrap(a)
  }

  if (RE.agenda.test(q)) {
    if (/보여|열어|목록|뭐/.test(q)) {
      const a = finish('agenda', view, ['회의 때 물어볼 것을 열었어요.'], [])
      a.effects.push({ type: 'openAgenda' })
      return wrap(a)
    }
    if (view.scope === 'all') return wrap(unsupported(env, view, '물어볼 것은 지점마다 추가해요. 먼저 지점을 골라 주세요.'))
    const check = analyze(view.scope, view.date, view.mode, memoOf(env, view.scope, view.date)).checks[0]
    if (!check) return wrap(finish('agenda', view, ['이날은 따로 물어볼 만큼 큰 차이가 없어요.'], []))
    const a = finish('agenda', view, [`회의 때 물어볼 것에 추가했어요: ${check.question}`], [{ kind: 'openAgenda', label: '목록 보기' }])
    a.effects.push({ type: 'addAgenda', item: check, date: view.date })
    return wrap(a)
  }

  if (RE.patterns.test(q)) return wrap(patternsAnswer(view))

  if (RE.unsupported.test(q)) {
    return wrap(unsupported(env, view, '그 질문에 답할 기록이 이 데모에는 없어요. 없는 숫자는 지어내지 않아요.'))
  }

  if (wantsOthers) {
    const origin = view.scope === 'all' ? namedBranch : view.scope
    return wrap(othersAnswer(view, origin))
  }

  if (RE.lastYear.test(q)) {
    const mode: CompareMode = RE.sameDate.test(q) ? 'lastYearDate' : 'lastYearWeekday'
    view = { ...view, mode }
    effects.push({ type: 'setMode', mode })
    return wrap(lastYearAnswer(view))
  }

  if (RE.weather.test(q)) {
    view = { ...view, mode: 'weather' }
    effects.push({ type: 'setMode', mode: 'weather' })
    return wrap(weatherAnswer(view))
  }

  if (RE.reset.test(q)) {
    view = { ...view, mode: 'recent8' }
    effects.push({ type: 'setMode', mode: 'recent8' })
    return wrap(overview(env, view, q))
  }

  if (RE.guestCheck.test(q)) return wrap(guestCheck(env, view))
  if (RE.summary.test(q) && !date) return wrap(summaryAnswer(env, view))
  if (RE.overview.test(q) || RE.hour.test(q) || moved) return wrap(overview(env, view, q))

  return wrap(unsupported(env, view))
}
