/**
 * 검산 스크립트 — PRD 5장의 기준 수치가 원자료에서 그대로 재현되는지 확인한다.
 * 실행: npx tsx scripts/verify-sales-demo.ts
 */
import { BRANCH_IDS, VIEW_START, isRainyLunch, branchById } from '../lib/sales-demo/data'
import {
  baseline,
  branchRanking,
  compare,
  dayData,
  findFlags,
  periodRange,
  rangeSummary,
  series,
  weatherSplit,
} from '../lib/sales-demo/metrics'
import { eur, eurDiff, pct } from '../lib/sales-demo/format'
import { respond, type AssistantEnv } from '../lib/sales-demo/assistant'
import type { CompareMode } from '../lib/sales-demo/metrics'
import { findPatterns } from '../lib/sales-demo/patterns'
import { describePattern } from '../lib/sales-demo/patterns-text'

let failed = 0
function check(name: string, actual: unknown, expected: unknown) {
  const ok = actual === expected
  if (!ok) failed += 1
  console.log(`${ok ? '✓' : '✗'} ${name}: ${actual}${ok ? '' : `  (기대값 ${expected})`}`)
}

const D = '2026-11-21'
const day = dayData('marais', D)
check('당일 점심 매출', day.lunch.revenue, 70400)
check('당일 점심 방문객', day.lunch.guests, 44)
check('당일 저녁 매출', day.dinner.revenue, 121600)
check('당일 저녁 방문객', day.dinner.guests, 64)
check('당일 하루 매출', day.total.revenue, 192000)

const r8 = compare('marais', D, 'recent8')
check('직전 토요일 8일 — 표본', r8.base.days.length, 8)
check('직전 토요일 8일 평균 점심', r8.base.lunch.revenue, 108800)
check('직전 토요일 8일 평균 점심 방문객', r8.base.lunch.guests, 68)
check('직전 토요일 8일 평균 저녁', r8.base.dinner.revenue, 131200)
check('직전 토요일 8일 평균 하루', r8.base.total.revenue, 240000)
check('하루 차액', eurDiff(r8.diff!), '−€480')
check('하루 증감률', pct(r8.rate), '−20.0%')
check('점심 차액', eurDiff(r8.meals.lunch.diff!), '−€384')
check('점심 비중', r8.meals.lunch.diff! / r8.diff!, 0.8)
check('점심 객단가(당일)', r8.meals.lunch.checkActual, 1600)
check('점심 객단가(기준)', r8.meals.lunch.checkBase, 1600)
check('점심 손님 효과', r8.meals.lunch.guestEffect, -38400)
check('점심 객단가 효과', r8.meals.lunch.checkEffect, 0)

const w = compare('marais', D, 'weather')
check('비 온 토요일 — 표본', w.base.days.length, 3)
check('비 온 토요일 평균 점심', w.base.lunch.revenue, 73600)
check('비 온 토요일 평균 점심 방문객', w.base.lunch.guests, 46)
check('비 온 토요일 평균 저녁', w.base.dinner.revenue, 124800)
check('비 온 토요일 평균 하루', w.base.total.revenue, 198400)
check('비 온 토요일 대비 차액', eurDiff(w.diff!), '−€64')
check('비 온 토요일 대비 증감률', pct(w.rate), '−3.2%')
check('참고용 표시 여부(3일)', w.base.referenceOnly, false)

const ly = compare('marais', D, 'lastYearWeekday')
check('전년 같은 요일 날짜', ly.base.days[0].date, '2025-11-22')
check('전년 같은 요일 매출', ly.base.total.revenue, 200000)
check('전년 같은 요일 대비', pct(ly.rate), '−4.0%')
const ld = compare('marais', D, 'lastYearDate')
check('전년 같은 날짜', ld.base.days[0].date, '2025-11-21')

const split = weatherSplit('marais', D)
console.log(`  날씨별 평균: 비 온 날 ${split.rainy.n}일 ${eur(split.rainy.avg!)} / 비 안 온 날 ${split.dry.n}일 ${eur(split.dry.avg!)}`)

console.log('\n── 11월 21일 지점 비교 (차액 작은 순)')
const rank = branchRanking(D, 'recent8')
for (const c of rank) {
  console.log(`  ${branchById(c.day.scope as any).name.padEnd(16)} ${eur(c.actual.revenue).padStart(7)}  기준 ${eur(c.base.total.revenue).padStart(7)}  ${eurDiff(c.diff!).padStart(6)}  ${pct(c.rate)}`)
}
check('차액이 가장 작은 지점', rank[0].day.scope, 'marais')
check('다른 지점 차액은 모두 −€480보다 큼', rank.slice(1).every((c) => c.diff! > -48000), true)

const all = compare('all', D, 'recent8')
const sumBranches = BRANCH_IDS.reduce((s, b) => s + dayData(b, D).total.revenue, 0)
check('전체 = 지점 합계 (선택일)', all.actual.revenue, sumBranches)
const sumBase = BRANCH_IDS.reduce((s, b) => s + baseline(b, D, 'recent8').total.revenue, 0)
check('전체 기준 = 지점 기준 합계', Math.abs(all.base.total.revenue - sumBase) < 1e-6, true)

console.log('\n── 첫 화면 (11월 16~22일)')
const range = periodRange('7d')
const sAll = rangeSummary('all', range)
const sSum = BRANCH_IDS.reduce((s, b) => s + rangeSummary(b, range).total.revenue, 0)
check('기간', `${range.start}~${range.end}`, '2026-11-16~2026-11-22')
check('전체 매출 = 5개 지점 합계', sAll.total.revenue, sSum)
console.log(`  전체 ${eur(sAll.total.revenue)} / 전년 ${eur(sAll.prevYear!.total.revenue)} (${sAll.prevYear!.start}~${sAll.prevYear!.end}) / 직전 ${eur(sAll.prevPeriod!.total.revenue)}`)
for (const b of BRANCH_IDS) {
  const s = rangeSummary(b, range)
  console.log(`  ${branchById(b).name.padEnd(16)} ${eur(s.total.revenue).padStart(8)}  전년 ${eur(s.prevYear!.total.revenue)}`)
}
for (const p of series('all', range)) console.log(`  ${p.key} ${eur(p.revenue!)} 전년(${p.prevStart}) ${eur(p.prev!)}`)

console.log('\n── 조회 시작일의 전년 비교 이력')
const first = compare('all', VIEW_START, 'lastYearWeekday')
check('조회 시작일 전년 같은 요일 비교 가능', first.comparable, true)
check('조회 시작일 전년 같은 날짜 비교 가능', compare('all', VIEW_START, 'lastYearDate').comparable, true)
check('조회 시작일 최근 8일 비교 가능', compare('all', VIEW_START, 'recent8').base.days.length, 8)

console.log('\n── 1년 월별')
const y = series('all', periodRange('1y'))
check('월 버킷 수', y.length, 13)
check('첫 달은 일부 집계', y[0].partial && y[0].start === '2025-11-23', true)
check('마지막 달은 일부 집계', y[12].partial && y[12].end === '2026-11-22', true)
check('월별 합계 = 1년 합계', y.reduce((s, p) => s + p.revenue!, 0), rangeSummary('all', periodRange('1y')).total.revenue)
for (const p of y) console.log(`  ${p.key} ${String(p.days).padStart(2)}일 ${eur(p.revenue!).padStart(9)} 전년 ${p.prev === null ? '없음' : eur(p.prev)}${p.missingDays ? ` · 누락 ${p.missingDays}일` : ''}`)

console.log('\n── 누락·휴무')
check('누락일 상태', dayData('montparnasse', '2026-09-08').status, 'missing')
check('누락일 비교 사유', compare('montparnasse', '2026-09-08', 'recent8').comparable, false)
check('휴무일 상태', dayData('opera', '2025-12-25').status, 'closed')
check('휴무일 매출 0', dayData('opera', '2025-12-25').total.revenue, 0)
check('누락일이 낀 전체 보기', dayData('all', '2026-09-08').status, 'partial')
const afterMissing = baseline('montparnasse', '2026-09-15', 'recent8')
check('누락일은 평균에서 제외', afterMissing.days.length, 7)

console.log('\n── 확인할 날 (7일)')
const flags = findFlags('all', range.start, range.end)
for (const f of [...flags.drops, ...flags.rises]) {
  console.log(`  ${f.date} ${branchById(f.branch).name.padEnd(16)} ${eurDiff(f.diff)} ${pct(f.rate)} ${f.meal} ${(f.mealShare * 100).toFixed(0)}% ${f.rainyLunch ? '비' : ''} ${f.contexts.map((c) => c.title).join(',')}`)
}
check('가장 큰 감소는 Le Marais 11/21', `${flags.drops[0]?.branch} ${flags.drops[0]?.date}`, 'marais 2026-11-21')

let rainySat = 0
for (const d of r8.base.days) if (isRainyLunch(d.date)) rainySat += 1
check('직전 토요일 8일 중 비 온 날', rainySat, 3)
check('당일 점심에 비', isRainyLunch(D), true)

console.log('\n── 질문과 비교 메뉴가 같은 결과를 내는지')
const env = (mode: CompareMode, defaults = {}): AssistantEnv => ({
  view: { scope: 'marais', date: D, mode },
  lastTarget: null,
  defaults,
  memos: [],
  range,
})
const a1 = respond('이날 매출이 왜 이렇게 낮았어?', env('recent8'))
check('왜 낮았어 → 점심 €384 집중', a1.paragraphs[0].includes('€384가 점심에 집중') && a1.paragraphs[0].includes('68명에서 44명'), true)
const a2 = respond('비 온 토요일끼리만 비교하면?', env('recent8'))
check('비 온 토요일 → weather 기준으로 전환', a2.view.mode, 'weather')
check('비 온 토요일 → −3.2%', a2.paragraphs[0].includes('€1,984') && a2.paragraphs[0].includes('−3.2%'), true)
const a3 = respond('작년이랑 비교하면?', env('weather'))
check('작년 → 같은 요일이 기본', a3.view.mode, 'lastYearWeekday')
check('작년 → −4.0%와 실제 날짜', a3.paragraphs[0].includes('2025년 11월 22일 (토)') && a3.paragraphs[0].includes('−4.0%'), true)
check('작년 같은 날짜를 명시하면 날짜 기준', respond('작년 같은 날짜는?', env('recent8')).view.mode, 'lastYearDate')
const a4 = respond('그날 다른 지점은 어땠어?', env('recent8'))
check('다른 지점 → 5곳, 보던 지점 강조', a4.rows?.length === 5 && a4.rows.find((r) => r.highlight)?.branch === 'marais', true)
const a5 = respond('이 지점은 토요일마다 이렇게 보여줘', env('weather'))
check('저장 미리보기', a5.preview?.label, 'Le Marais점 · 토요일 · 날씨가 같았던 토요일 평균')
const a6 = respond('메모: 이날은 테라스를 열지 않았음', env('recent8'))
check('메모 저장 효과만, 금액 추정 없음', a6.effects.some((e) => e.type === 'saveMemo') && !/€/.test(a6.paragraphs.join(' ')), true)
const a7 = respond('내일 매출 예측해줘', env('recent8'))
check('미지원 질문에 수치 없음', a7.intent === 'unsupported' && !/€\d/.test(a7.paragraphs.join(' ')), true)

console.log('\n── 저장한 기준이 ‘확인할 날’에 반영되는지')
const saved = findFlags('all', range.start, range.end, (b, d) => (b === 'marais' && d === D ? 'weather' : 'recent8'))
check('저장 후 Le Marais 11/21은 확인할 날에서 빠짐', saved.drops.some((f) => f.branch === 'marais' && f.date === D), false)

console.log('\n── 개선 기회 (최근 26주의 반복 패턴)')
const pats = findPatterns('all')
for (const p of pats) console.log(`  ${p.kind.padEnd(9)} ${branchById(p.branch).name.padEnd(16)} ${describePattern(p).title} · ${describePattern(p).size}`)
check('가장 큰 관측 차이 = Opéra점 평일 저녁 감소', `${pats[0].kind} ${pats[0].branch} ${pats[0].group} ${pats[0].meal}`, 'drift opera weekday dinner')
check('Le Marais점 비 오는 날 점심 패턴', pats.some((p) => p.kind === 'weather' && p.branch === 'marais' && p.meal === 'lunch'), true)
check('비 때문에 생긴 차이를 감소 추세로 잡지 않음', pats.filter((p) => p.kind === 'drift').length, 1)
check('Montparnasse점은 비 오는 날 점심이 강점', pats.some((p) => p.kind === 'strength' && p.branch === 'montparnasse'), true)
check('가정 계산은 관측 금액과 구분', pats.filter((p) => p.kind === 'underused').every((p) => p.monthly === null && p.whatIfMonthly !== null), true)
const a8 = respond('개선할 점이 뭐야?', { ...env('recent8'), view: { scope: 'all', date: D, mode: 'recent8' } })
check('“개선할 점이 뭐야?” → 반복 패턴 답변', a8.intent === 'patterns' && a8.paragraphs.some((x) => x.includes('Opéra점')), true)

console.log(failed === 0 ? '\n모든 검산 통과' : `\n실패 ${failed}건`)
process.exit(failed === 0 ? 0 : 1)
