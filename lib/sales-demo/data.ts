/**
 * 서울식당 파리 — 가상 데모 데이터.
 *
 * 고정 시드로 시간대별 실적을 만든다. 같은 입력이면 어느 브라우저에서나
 * 같은 값이 나오도록 사칙연산과 정수 해시만 쓴다(초월함수 없음).
 * 화면·표·답변은 모두 metrics.ts의 집계 함수를 거쳐 이 원자료를 읽는다.
 */
import { addDays, dayNum, fromDayNum, parts, weekday, type ISODate } from './calendar'

/* ───────── 기준일과 범위 ───────── */

export const HISTORY_START: ISODate = '2024-11-01'
export const VIEW_START: ISODate = '2025-11-23'
export const VIEW_END: ISODate = '2026-11-22'
export const TODAY: ISODate = '2026-11-23'
export const DEFAULT_DATE: ISODate = '2026-11-21'

export const HOURS = [12, 13, 14, 18, 19, 20, 21] as const
export const LUNCH_HOURS = [12, 13, 14] as const
export const DINNER_HOURS = [18, 19, 20, 21] as const
export type Meal = 'lunch' | 'dinner'
export const mealOfHour = (h: number): Meal => (h < 15 ? 'lunch' : 'dinner')

/* ───────── 지점 ───────── */

export type BranchId = 'opera' | 'marais' | 'saintgermain' | 'montparnasse' | 'beaugrenelle'

export interface Branch {
  id: BranchId
  name: string
  area: string
  concept: string
  trait: string
  aliases: string[]
}

export const BRANCHES: Branch[] = [
  {
    id: 'opera',
    name: 'Opéra점',
    area: '파리 2구',
    concept: '직장인 대상 점심 정식',
    trait: '평일 점심 매출 비중이 높아요',
    aliases: ['opera', 'opéra', '오페라'],
  },
  {
    id: 'marais',
    name: 'Le Marais점',
    area: '파리 3구',
    concept: '테라스가 있는 한식 비스트로',
    trait: '토요일 점심은 날씨를 많이 타요',
    aliases: ['marais', 'le marais', '마레', '르마레', '르 마레'],
  },
  {
    id: 'saintgermain',
    name: 'Saint-Germain점',
    area: '파리 6구',
    concept: '삼겹살과 단체 식사',
    trait: '저녁에 1명당 쓰는 돈이 많아요',
    aliases: ['saint-germain', 'saint germain', 'germain', '생제르맹', '생제르망', '생 제르맹'],
  },
  {
    id: 'montparnasse',
    name: 'Montparnasse점',
    area: '파리 14구',
    concept: '역 인근 국밥·국수 전문점',
    trait: '역 유동 인구에 따라 움직여요',
    aliases: ['montparnasse', '몽파르나스', '몽빠르나스'],
  },
  {
    id: 'beaugrenelle',
    name: 'Beaugrenelle점',
    area: '파리 15구',
    concept: '가족 단골이 많은 동네 한식당',
    trait: '주말 이른 저녁에 손님이 몰려요',
    aliases: ['beaugrenelle', '보그르넬', '보그레넬'],
  },
]

export const BRANCH_IDS = BRANCHES.map((b) => b.id)
export const branchById = (id: BranchId): Branch => BRANCHES.find((b) => b.id === id)!
const branchIndex = (id: BranchId): number => BRANCH_IDS.indexOf(id)

/* ───────── 생성 모델 ───────── */

type DayType = 'weekday' | 'fri' | 'sat' | 'sun'
const dayTypeOf = (dow: number): DayType =>
  dow === 0 ? 'sun' : dow === 6 ? 'sat' : dow === 5 ? 'fri' : 'weekday'

interface Model {
  /** 시간대별 기준 방문객 수 — HOURS 순서 */
  guests: Record<DayType, number[]>
  /** 객단가(유로센트) */
  check: { lunch: number; dinner: number }
  /** 연 성장률(방문객) */
  growth: number
  /** 8월 계수 */
  august: number
  /** 비가 기록된 식사 시간대의 방문객 계수 */
  rain: { lunch: number; dinner: number }
}

const MODELS: Record<BranchId, Model> = {
  opera: {
    guests: {
      weekday: [38, 46, 14, 8, 18, 20, 8],
      fri: [36, 44, 14, 10, 22, 24, 12],
      sat: [14, 20, 8, 8, 18, 20, 9],
      sun: [10, 15, 7, 6, 13, 13, 5],
    },
    check: { lunch: 1750, dinner: 2400 },
    growth: 0.02,
    august: 0.72,
    rain: { lunch: 0.97, dinner: 0.98 },
  },
  marais: {
    guests: {
      weekday: [13, 19, 10, 9, 17, 19, 10],
      fri: [15, 21, 11, 11, 21, 23, 13],
      sat: [26, 37, 19, 11, 22, 24, 13],
      sun: [23, 33, 18, 8, 15, 15, 7],
    },
    check: { lunch: 1600, dinner: 1900 },
    growth: 0.07,
    august: 1.04,
    rain: { lunch: 0.6, dinner: 0.92 },
  },
  saintgermain: {
    guests: {
      weekday: [8, 11, 6, 10, 23, 27, 15],
      fri: [9, 13, 7, 13, 30, 36, 21],
      sat: [11, 15, 8, 14, 31, 37, 22],
      sun: [10, 14, 7, 10, 20, 22, 10],
    },
    check: { lunch: 2200, dinner: 4200 },
    growth: 0.05,
    august: 0.9,
    rain: { lunch: 1.0, dinner: 1.0 },
  },
  montparnasse: {
    guests: {
      weekday: [30, 36, 19, 14, 22, 22, 12],
      fri: [32, 38, 20, 16, 25, 25, 14],
      sat: [28, 34, 19, 14, 22, 23, 13],
      sun: [24, 30, 17, 13, 20, 18, 9],
    },
    check: { lunch: 1450, dinner: 1550 },
    growth: 0.09,
    august: 0.94,
    rain: { lunch: 1.08, dinner: 1.05 },
  },
  beaugrenelle: {
    guests: {
      weekday: [10, 13, 7, 12, 16, 12, 5],
      fri: [11, 14, 8, 16, 21, 16, 7],
      sat: [19, 24, 12, 30, 30, 17, 8],
      sun: [21, 26, 13, 29, 28, 14, 6],
    },
    check: { lunch: 1800, dinner: 2600 },
    growth: 0.04,
    august: 0.86,
    rain: { lunch: 0.94, dinner: 0.97 },
  },
}

/** 월별 계절 계수 (1월~12월). 8월은 지점별 계수를 따로 쓴다. */
const SEASON = [0.92, 0.94, 0.98, 1.02, 1.05, 1.07, 1.02, 1.0, 1.04, 1.03, 1.0, 1.06]

/* ───────── 정수 해시 난수 (생성 순서와 무관) ───────── */

const SEED = 20261123

function hash32(a: number, b: number, c: number, d: number): number {
  let h = SEED ^ 0x9e3779b9
  h = Math.imul(h ^ a, 0x85ebca6b)
  h ^= h >>> 13
  h = Math.imul(h ^ b, 0xc2b2ae35)
  h ^= h >>> 16
  h = Math.imul(h ^ c, 0x27d4eb2f)
  h ^= h >>> 15
  h = Math.imul(h ^ d, 0x165667b1)
  h ^= h >>> 13
  h = Math.imul(h, 0x9e3779b1)
  h ^= h >>> 16
  return h >>> 0
}

/** [0, 1) 균등 난수 */
const uni = (a: number, b: number, c: number, d = 0): number => hash32(a, b, c, d) / 4294967296

/** 평균 0, 표준편차 약 1 — 균등 난수 네 개의 합 */
function noise(a: number, b: number, c: number): number {
  const s = uni(a, b, c, 1) + uni(a, b, c, 2) + uni(a, b, c, 3) + uni(a, b, c, 4)
  return (s - 2) * 1.7320508
}

/* ───────── 저장 구조 ───────── */

const START_NUM = dayNum(HISTORY_START)
const END_NUM = dayNum(VIEW_END)
export const DAY_COUNT = END_NUM - START_NUM + 1
const H = HOURS.length

export const dayIndex = (d: ISODate): number => dayNum(d) - START_NUM
export const hasHistory = (d: ISODate): boolean => {
  const i = dayIndex(d)
  return i >= 0 && i < DAY_COUNT
}

export type DayStatus = 'ok' | 'closed' | 'missing' | 'none'

const revenue: Int32Array[] = BRANCH_IDS.map(() => new Int32Array(DAY_COUNT * H))
const guests: Int32Array[] = BRANCH_IDS.map(() => new Int32Array(DAY_COUNT * H))
/** 0 = 정상, 1 = 휴무(매출 0), 2 = 자료 누락 */
const status: Uint8Array[] = BRANCH_IDS.map(() => new Uint8Array(DAY_COUNT))

/* ───────── 날씨 (파리 관측소 한 곳, 시간별 강수량) ───────── */

export const WEATHER_FIRST_HOUR = 8
export const WEATHER_LAST_HOUR = 22
const WH = WEATHER_LAST_HOUR - WEATHER_FIRST_HOUR + 1
/** 0.1mm 단위 */
const rainTenths = new Uint8Array(DAY_COUNT * WH)

const RAIN_DAY_PROB = [0.42, 0.4, 0.38, 0.36, 0.38, 0.32, 0.27, 0.27, 0.3, 0.38, 0.44, 0.44]
const BLOCKS: number[][] = [
  [8, 9, 10, 11],
  [12, 13, 14],
  [15, 16, 17],
  [18, 19, 20, 21, 22],
]

/** 검산용 고정 날씨 — 시각: 0.1mm. 적지 않은 시각은 0. */
const FORCED_WEATHER: Record<ISODate, Record<number, number>> = {
  '2025-11-22': {},
  '2026-09-26': {},
  '2026-10-03': { 12: 6, 13: 14, 14: 20, 15: 8 },
  '2026-10-10': {},
  '2026-10-17': {},
  '2026-10-24': { 20: 5, 21: 9 },
  '2026-10-31': { 11: 10, 12: 22, 13: 16, 14: 5 },
  '2026-11-07': {},
  '2026-11-14': { 12: 3, 13: 11, 14: 12, 18: 6, 19: 4 },
  '2026-11-16': {},
  '2026-11-17': { 19: 7, 20: 12, 21: 4 },
  '2026-11-18': {},
  '2026-11-19': {},
  '2026-11-20': { 9: 5, 10: 8 },
  '2026-11-21': { 10: 4, 11: 12, 12: 18, 13: 24, 14: 9 },
  '2026-11-22': {},
}

function generateWeather(): void {
  for (let i = 0; i < DAY_COUNT; i++) {
    const date = fromDayNum(START_NUM + i)
    const forced = FORCED_WEATHER[date]
    if (forced) {
      for (const [h, v] of Object.entries(forced)) rainTenths[i * WH + (Number(h) - WEATHER_FIRST_HOUR)] = v
      continue
    }
    const month = parts(date).m
    if (uni(900, i, 1) >= RAIN_DAY_PROB[month - 1]) continue
    BLOCKS.forEach((block, bi) => {
      if (uni(901, i, bi) >= 0.55) return
      let any = false
      block.forEach((h) => {
        if (uni(902, i, h) < 0.8) {
          const r = uni(903, i, h)
          rainTenths[i * WH + (h - WEATHER_FIRST_HOUR)] = 2 + Math.floor(r * r * 38)
          any = true
        }
      })
      if (!any) rainTenths[i * WH + (block[0] - WEATHER_FIRST_HOUR)] = 4
    })
  }
}

/** 해당 시각(시작 기준 1시간)의 강수량(mm). 관측 범위 밖이면 0. */
export function rainMm(d: ISODate, hour: number): number {
  if (!hasHistory(d) || hour < WEATHER_FIRST_HOUR || hour > WEATHER_LAST_HOUR) return 0
  return rainTenths[dayIndex(d) * WH + (hour - WEATHER_FIRST_HOUR)] / 10
}

export function mealRainMm(d: ISODate, meal: Meal): number {
  const hours = meal === 'lunch' ? LUNCH_HOURS : DINNER_HOURS
  let t = 0
  for (const h of hours) t += rainMm(d, h)
  return Math.round(t * 10) / 10
}

/** ‘비 온 날’의 정의: 점심 영업시간(12~15시)에 강수가 기록된 날 */
export const isRainyLunch = (d: ISODate): boolean => mealRainMm(d, 'lunch') > 0

/* ───────── 지역 행사·사회적 이슈 ───────── */

export type ContextKind = 'event' | 'strike'

export interface ContextItem {
  id: string
  kind: ContextKind
  title: string
  description: string
  /** 영향 범위 설명 */
  scope: string
  /** 해당 지점. 비어 있으면 파리 전역 */
  branches: BranchId[]
  start: ISODate
  end: ISODate
  /** 표시용 시각 */
  hours: string
  source: string
  /** 생성 모델 계수 (화면에는 쓰지 않는다) */
  effect: Partial<Record<BranchId, { lunch?: number; dinner?: number }>>
}

export const DEMO_SOURCE = '가상 데모 자료'

export const CONTEXT_ITEMS: ContextItem[] = [
  {
    id: 'strike-2026-11-18',
    kind: 'strike',
    title: 'RATP·SNCF 파업',
    description: 'Montparnasse역 발착 열차와 지하철 4·6·12·13호선 운행이 크게 줄었어요.',
    scope: 'Montparnasse역 일대 (14·15구)',
    branches: ['montparnasse'],
    start: '2026-11-18',
    end: '2026-11-18',
    hours: '하루 종일',
    source: DEMO_SOURCE,
    effect: {},
  },
  {
    id: 'strike-2026-03-19',
    kind: 'strike',
    title: '전국 총파업',
    description: '대중교통 전 노선이 감축 운행됐어요.',
    scope: '파리 전역',
    branches: [],
    start: '2026-03-19',
    end: '2026-03-19',
    hours: '하루 종일',
    source: DEMO_SOURCE,
    effect: {
      opera: { lunch: 0.78, dinner: 0.86 },
      marais: { lunch: 0.9, dinner: 0.92 },
      saintgermain: { lunch: 0.92, dinner: 0.9 },
      montparnasse: { lunch: 0.66, dinner: 0.72 },
      beaugrenelle: { lunch: 0.95, dinner: 0.97 },
    },
  },
  {
    id: 'event-2026-10-17',
    kind: 'event',
    title: '마레 가을 벼룩시장',
    description: '매장 앞 거리에서 열린 주민 벼룩시장(vide-grenier)이에요.',
    scope: 'Le Marais (3·4구)',
    branches: ['marais'],
    start: '2026-10-17',
    end: '2026-10-17',
    hours: '10:00~18:00',
    source: DEMO_SOURCE,
    effect: {},
  },
  {
    id: 'event-2026-11-19',
    kind: 'event',
    title: '생제르맹 갤러리 야간 개장',
    description: '인근 갤러리 40여 곳이 밤 10시까지 문을 열었어요.',
    scope: 'Saint-Germain-des-Prés (6구)',
    branches: ['saintgermain'],
    start: '2026-11-19',
    end: '2026-11-19',
    hours: '18:00~22:00',
    source: DEMO_SOURCE,
    effect: {},
  },
  {
    id: 'event-2026-11-22',
    kind: 'event',
    title: '15구 겨울 마켓 개장일',
    description: 'Beaugrenelle 쇼핑센터 앞 광장에 겨울 마켓이 문을 열었어요.',
    scope: 'Beaugrenelle (15구)',
    branches: ['beaugrenelle'],
    start: '2026-11-22',
    end: '2026-11-22',
    hours: '14:00~20:00',
    source: DEMO_SOURCE,
    effect: {},
  },
  {
    id: 'event-2026-06-21',
    kind: 'event',
    title: '음악 축제 (Fête de la Musique)',
    description: '저녁부터 거리 공연이 이어졌어요.',
    scope: '파리 전역',
    branches: [],
    start: '2026-06-21',
    end: '2026-06-21',
    hours: '18:00~24:00',
    source: DEMO_SOURCE,
    effect: {
      opera: { dinner: 1.12 },
      marais: { dinner: 1.3 },
      saintgermain: { dinner: 1.18 },
      montparnasse: { dinner: 1.1 },
      beaugrenelle: { dinner: 1.05 },
    },
  },
]

export function contextFor(branch: BranchId | 'all', d: ISODate): ContextItem[] {
  return CONTEXT_ITEMS.filter(
    (c) =>
      d >= c.start &&
      d <= c.end &&
      (c.branches.length === 0 || branch === 'all' || c.branches.includes(branch)),
  )
}

/* ───────── 월별 관광 수요 지수 ───────── */

export interface MonthlyIndex {
  ym: string
  value: number
}

export const TOURISM_INDEX = {
  name: '파리 관광객 지수',
  region: '파리 전역',
  unit: '기준이 되는 달을 100으로 본 숫자',
  granularity: '월별',
  baseMonth: '2025-11',
  source: DEMO_SOURCE,
}

const TOURISM_SHAPE = [86, 90, 101, 113, 121, 127, 131, 124, 122, 114, 100, 112]

export const TOURISM_SERIES: MonthlyIndex[] = (() => {
  const out: MonthlyIndex[] = []
  let y = 2024
  let m = 11
  while (y < 2026 || (y === 2026 && m <= 11)) {
    const ym = `${y}-${m < 10 ? '0' : ''}${m}`
    // 기준월(2025-11) 이전 12개월은 3% 낮게, 이후는 3% 높게
    const k = ym < '2025-11' ? 0.97 : ym === '2025-11' ? 1 : 1.03
    out.push({ ym, value: Math.round(TOURISM_SHAPE[m - 1] * k) })
    m += 1
    if (m > 12) {
      m = 1
      y += 1
    }
  }
  return out
})()

export const tourismFor = (ym: string): number | null =>
  TOURISM_SERIES.find((t) => t.ym === ym)?.value ?? null

/* ───────── 휴무와 누락 ───────── */

const OPERA_SUMMER_BREAK: [ISODate, ISODate][] = [
  ['2025-08-10', '2025-08-17'],
  ['2026-08-09', '2026-08-16'],
]

function closedReason(branch: BranchId, d: ISODate): string | null {
  const md = d.slice(5)
  if (md === '12-25') return '성탄절이라 쉬었어요'
  if (md === '01-01') return '새해 첫날이라 쉬었어요'
  if (branch === 'opera' && OPERA_SUMMER_BREAK.some(([a, b]) => d >= a && d <= b)) return '여름휴가로 쉬었어요'
  return null
}

const MISSING: Partial<Record<BranchId, Record<ISODate, string>>> = {
  montparnasse: { '2026-09-08': '계산대(POS)에서 매출 기록이 안 들어왔어요' },
}

export function statusReason(branch: BranchId, d: ISODate): string | null {
  return closedReason(branch, d) ?? MISSING[branch]?.[d] ?? null
}

/* ───────── 서서히 진행되는 변화 (하루 단위로는 눈에 띄지 않는다) ───────── */

/** Opéra점 평일 저녁: 9월 14일부터 10주에 걸쳐 방문객이 22%까지 줄어든다. */
const DRIFT_START = dayNum('2026-09-14')
const DRIFT_END = dayNum('2026-11-22')

function driftFactor(branch: BranchId, n: number, dow: number, meal: Meal): number {
  if (branch !== 'opera' || meal !== 'dinner' || dow === 0 || dow === 6 || n < DRIFT_START) return 1
  const t = Math.min(1, (n - DRIFT_START) / (DRIFT_END - DRIFT_START))
  return 1 - 0.22 * t
}

/* ───────── 생성 ───────── */

function generateSales(): void {
  BRANCH_IDS.forEach((id, bi) => {
    const model = MODELS[id]
    for (let i = 0; i < DAY_COUNT; i++) {
      const date = fromDayNum(START_NUM + i)
      if (closedReason(id, date)) {
        status[bi][i] = 1
        continue
      }
      if (MISSING[id]?.[date]) {
        status[bi][i] = 2
        continue
      }
      const month = parts(date).m
      const type = dayTypeOf(weekday(date))
      const years = (i - (DAY_COUNT - 1)) / 365
      const season = month === 8 ? model.august : SEASON[month - 1]
      const growth = 1 + model.growth * years
      const dayFactor = 1 + 0.045 * noise(bi + 1, i, 10)
      const priceGrowth = 1 + 0.03 * years
      const ctx = CONTEXT_ITEMS.filter((c) => date >= c.start && date <= c.end)

      for (const meal of ['lunch', 'dinner'] as Meal[]) {
        const rained = mealRainMm(date, meal) > 0
        let mealFactor = (rained ? model.rain[meal] : 1) * driftFactor(id, START_NUM + i, weekday(date), meal)
        for (const c of ctx) mealFactor *= c.effect[id]?.[meal] ?? 1
        const checkNoise = 1 + 0.02 * noise(bi + 1, i, meal === 'lunch' ? 20 : 21)
        // 객단가는 10센트 단위
        const check = Math.round((model.check[meal] * priceGrowth * checkNoise) / 10) * 10
        HOURS.forEach((h, hi) => {
          if (mealOfHour(h) !== meal) return
          const hourFactor = 1 + 0.06 * noise(bi + 1, i, 100 + h)
          const g = Math.max(
            0,
            Math.round(model.guests[type][hi] * season * growth * dayFactor * mealFactor * hourFactor),
          )
          guests[bi][i * H + hi] = g
          revenue[bi][i * H + hi] = g * check
        })
      }
    }
  })
}

/* ───────── 검산 기준 고정값: Le Marais점 토요일 ───────── */

interface MaraisPin {
  lunchGuests: number
  dinnerGuests: number
  /** 유로 */
  dinnerRevenue: number
}

/** 점심 객단가는 모두 €16. PRD 5장의 검산표를 그대로 재현한다. */
const MARAIS_PINS: Record<ISODate, MaraisPin> = {
  '2025-11-22': { lunchGuests: 50, dinnerGuests: 63, dinnerRevenue: 1200 },
  '2026-09-26': { lunchGuests: 78, dinnerGuests: 70, dinnerRevenue: 1330 },
  '2026-10-03': { lunchGuests: 43, dinnerGuests: 64, dinnerRevenue: 1210 },
  '2026-10-10': { lunchGuests: 80, dinnerGuests: 71, dinnerRevenue: 1349 },
  '2026-10-17': { lunchGuests: 84, dinnerGuests: 73, dinnerRevenue: 1387 },
  '2026-10-24': { lunchGuests: 83, dinnerGuests: 72, dinnerRevenue: 1368 },
  '2026-10-31': { lunchGuests: 49, dinnerGuests: 68, dinnerRevenue: 1300 },
  '2026-11-07': { lunchGuests: 81, dinnerGuests: 69, dinnerRevenue: 1318 },
  '2026-11-14': { lunchGuests: 46, dinnerGuests: 65, dinnerRevenue: 1234 },
  '2026-11-21': { lunchGuests: 44, dinnerGuests: 64, dinnerRevenue: 1216 },
}

const LUNCH_SPLIT = [0.32, 0.45, 0.23]
const DINNER_SPLIT = [0.16, 0.31, 0.34, 0.19]

/** 합계를 보존하면서 비율대로 정수 배분 (최대 잔여법) */
function splitInt(total: number, weights: number[]): number[] {
  const sum = weights.reduce((a, b) => a + b, 0)
  if (sum <= 0) return weights.map(() => 0)
  const raw = weights.map((w) => (total * w) / sum)
  const out = raw.map((r) => Math.floor(r))
  let rest = total - out.reduce((a, b) => a + b, 0)
  const order = raw
    .map((r, i) => ({ i, frac: r - Math.floor(r) }))
    .sort((a, b) => b.frac - a.frac || a.i - b.i)
  for (let k = 0; rest > 0; k++, rest--) out[order[k % order.length].i] += 1
  return out
}

function applyMaraisPins(): void {
  const bi = branchIndex('marais')
  for (const [date, pin] of Object.entries(MARAIS_PINS)) {
    const i = dayIndex(date)
    const lg = splitInt(pin.lunchGuests, LUNCH_SPLIT)
    const dg = splitInt(pin.dinnerGuests, DINNER_SPLIT)
    const dr = splitInt(pin.dinnerRevenue * 100, dg)
    lg.forEach((g, k) => {
      guests[bi][i * H + k] = g
      revenue[bi][i * H + k] = g * 1600
    })
    dg.forEach((g, k) => {
      guests[bi][i * H + 3 + k] = g
      revenue[bi][i * H + 3 + k] = dr[k]
    })
    status[bi][i] = 0
  }
}

/* ───────── 시나리오 고정값: 직전 같은 요일 8일 평균 대비 비율 ───────── */

interface RatioPin {
  branch: BranchId
  date: ISODate
  lunch: number
  dinner: number
  /** 시간대별 추가 계수 (HOURS 순서) */
  shape?: number[]
}

const RATIO_PINS: RatioPin[] = [
  // 11월 21일(토): 비가 왔지만 지점마다 다르게 움직였다
  { branch: 'opera', date: '2026-11-21', lunch: 0.95, dinner: 0.99 },
  { branch: 'saintgermain', date: '2026-11-21', lunch: 1.0, dinner: 1.04 },
  { branch: 'montparnasse', date: '2026-11-21', lunch: 1.11, dinner: 1.02 },
  { branch: 'beaugrenelle', date: '2026-11-21', lunch: 0.9, dinner: 0.96 },
  // 11월 18일(수): Montparnasse역 일대 파업
  { branch: 'montparnasse', date: '2026-11-18', lunch: 0.78, dinner: 0.9 },
  // 11월 19일(목): 생제르맹 갤러리 야간 개장
  { branch: 'saintgermain', date: '2026-11-19', lunch: 1.0, dinner: 1.16, shape: [1, 1, 1, 0.9, 1, 1.05, 1.2] },
  // 11월 22일(일): 15구 겨울 마켓 개장일 — 이른 저녁에 몰림
  { branch: 'beaugrenelle', date: '2026-11-22', lunch: 1.04, dinner: 1.14, shape: [1, 1, 1, 1.18, 1.05, 0.9, 0.85] },
]

/**
 * 첫 화면 주간(11월 16~22일)의 나머지 지점·날짜는 평소 수준(±4% 안팎)으로 맞춘다.
 * 설계한 사건만 ‘확인할 날’에 올라오게 하기 위해서다.
 */
function demoWeekPins(): RatioPin[] {
  const out: RatioPin[] = []
  for (let n = dayNum('2026-11-16'); n <= dayNum('2026-11-22'); n++) {
    const date = fromDayNum(n)
    BRANCH_IDS.forEach((branch, bi) => {
      if (branch === 'marais' && MARAIS_PINS[date]) return
      if (RATIO_PINS.some((p) => p.branch === branch && p.date === date)) return
      out.push({
        branch,
        date,
        lunch: 0.97 + 0.07 * uni(700, n, bi, 1),
        dinner: 0.97 + 0.07 * uni(700, n, bi, 2),
      })
    })
  }
  return out
}

function applyRatioPins(): void {
  for (const pin of [...RATIO_PINS, ...demoWeekPins()]) {
    const bi = branchIndex(pin.branch)
    const i = dayIndex(pin.date)
    const refs: number[] = []
    for (let k = 1; k <= 8; k++) {
      const j = i - 7 * k
      if (j >= 0 && status[bi][j] === 0) refs.push(j)
    }
    if (refs.length === 0) continue
    HOURS.forEach((h, hi) => {
      let g = 0
      let r = 0
      for (const j of refs) {
        g += guests[bi][j * H + hi]
        r += revenue[bi][j * H + hi]
      }
      const ratio = (mealOfHour(h) === 'lunch' ? pin.lunch : pin.dinner) * (pin.shape?.[hi] ?? 1)
      const newGuests = Math.max(0, Math.round((g / refs.length) * ratio))
      const check = g > 0 ? Math.round(r / g / 10) * 10 : 0
      guests[bi][i * H + hi] = newGuests
      revenue[bi][i * H + hi] = newGuests * check
    })
  }
}

generateWeather()
generateSales()
applyMaraisPins()
applyRatioPins()

/* ───────── 원자료 접근 ───────── */

export interface HourRecord {
  hour: number
  /** 세금 포함 매출, 유로센트 */
  revenue: number
  guests: number
}

export function dayStatus(branch: BranchId, d: ISODate): DayStatus {
  if (!hasHistory(d)) return 'none'
  const s = status[branchIndex(branch)][dayIndex(d)]
  return s === 1 ? 'closed' : s === 2 ? 'missing' : 'ok'
}

/** 시간대별 원자료. 자료가 없으면 null (매출 0과 구분) */
export function hourRecords(branch: BranchId, d: ISODate): HourRecord[] | null {
  const st = dayStatus(branch, d)
  if (st === 'none' || st === 'missing') return null
  const bi = branchIndex(branch)
  const i = dayIndex(d)
  return HOURS.map((hour, hi) => ({
    hour,
    revenue: revenue[bi][i * H + hi],
    guests: guests[bi][i * H + hi],
  }))
}

export { addDays }
