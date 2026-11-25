/** 개선 기회의 문장 — 화면 카드와 대화 답변이 같은 문장을 쓴다. */
import { branchById, type Meal } from './data'
import { dateRange, eur, eurCheck, eurDiff, pct, pctPlain } from './format'
import { PATTERN_END, PATTERN_START, PATTERN_WEEKS, type DayGroup, type Pattern, type PatternKind } from './patterns'
import type { CheckItem } from './analysis'

const MEAL: Record<Meal, string> = { lunch: '점심', dinner: '저녁' }
const GROUP: Record<DayGroup, string> = { weekday: '평일', weekend: '주말', sat: '토요일', sun: '일요일' }
const BEST_GROUP = ['평일', '토요일', '일요일']

export const KIND_LABEL: Record<PatternKind, string> = {
  weather: '되풀이되는 차이',
  drift: '서서히 줄어드는 중',
  underused: '비어 있는 여력',
  strength: '잘되는 패턴',
}

export interface PatternText {
  /** ‘비 오는 날 점심 매출이 41% 낮아요’ */
  title: string
  /** 오른쪽에 크게 보이는 금액 */
  size: string
  /** 금액이 무엇인지 */
  sizeNote: string
  details: string[]
  /** 기간·표본·계산 방법 */
  basis: string
  /** 해볼 만한 것 — 제안이며 사실이 아니다 */
  ideas: string[]
  check: CheckItem
}

const people = (n: number): string => `${Math.round(n)}명`
const period = `최근 ${PATTERN_WEEKS}주(${dateRange(PATTERN_START, PATTERN_END)})`

export function describePattern(p: Pattern): PatternText {
  const meal = MEAL[p.meal]
  const name = branchById(p.branch).name
  const f = p.facts
  let title = ''
  let size = ''
  let sizeNote = ''
  let details: string[] = []
  let basis = ''
  let ideas: string[] = []
  let question = ''

  if (p.kind === 'weather' || p.kind === 'strength') {
    const down = p.kind === 'weather'
    title = `비 오는 날 ${meal} 매출이 ${pctPlain(Math.abs(p.rate))} ${down ? '낮아요' : '높아요'}`
    size = `월 약 ${eurDiff(p.monthly ?? 0)}`
    sizeNote = `26주 누적 ${eurDiff(f.total)}`
    details = [
      `${meal} 시간에 비가 온 ${p.n}일을 같은 요일의 맑은 날 평균과 비교했어요. 하루 평균 ${eur(Math.abs(f.perDay))} ${down ? '낮았어요' : '높았어요'}.`,
      Math.abs(f.check - f.expectedCheck) < f.expectedCheck * 0.03
        ? `손님은 평균 ${people(f.expectedGuests)}에서 ${people(f.guests)}으로 달라졌고, 객단가는 ${eurCheck(f.check)} 안팎으로 거의 같았어요.`
        : `손님은 평균 ${people(f.expectedGuests)}에서 ${people(f.guests)}으로, 객단가는 ${eurCheck(f.expectedCheck)}에서 ${eurCheck(f.check)}로 달라졌어요.`,
    ]
    basis = `${period} · 비 온 날 ${p.n}일 · 같은 요일 맑은 날 평균 대비. 날씨와 매출이 함께 움직였다는 뜻이고, 원인으로 확정한 것은 아니에요.`
    if (down) {
      ideas =
        p.branch === 'marais'
          ? ['비 예보가 있는 날은 실내 좌석부터 예약으로 채우기', '비 오는 날 전용 점심 포장 세트 알리기']
          : [`비 예보가 있는 날 ${meal} 예약을 미리 받기`, '비 오는 날 전용 포장 메뉴 알리기']
      question = p.branch === 'marais' ? '비 오는 날 점심에 테라스와 실내 좌석을 어떻게 운영하는지' : `비 오는 날 ${meal} 운영이 평소와 무엇이 다른지`
    } else {
      ideas = ['비 예보가 있는 날 재료와 인력을 넉넉히 준비하기', '이 지점에서 통하는 메뉴를 다른 지점의 비 오는 날에 시험해 보기']
      question = '비 오는 날 재료가 일찍 떨어지거나 대기가 생기지는 않는지'
    }
  } else if (p.kind === 'drift') {
    const grp = GROUP[p.group ?? 'weekday']
    title = `${grp} ${meal} 손님이 서서히 줄고 있어요 (${pct(p.rate, 0)})`
    size = `월 약 ${eurDiff(p.monthly ?? 0)}`
    sizeNote = '이전 6주 수준과의 차이'
    details = [
      `최근 6주 ${grp} ${meal} 손님은 하루 평균 ${people(f.recentGuests)}, 그 전 6주는 ${people(f.priorGuests)}이었어요.`,
      `작년 같은 시기의 흐름을 빼고 보면 ${pct(p.rate)}예요. 날씨 영향이 섞이지 않도록 비가 온 ${Math.round(f.excludedRainy)}일은 빼고 계산했어요.`,
      '하루씩 보면 평소 범위 안이라 ‘확인할 날’에는 잘 잡히지 않아요.',
    ]
    basis = `최근 12주 · 비가 없던 ${grp} ${p.n}일(최근 6주) · 작년 같은 요일 대비 증감률을 앞 6주와 비교.`
    ideas = ['이 기간에 바뀐 것(메뉴·가격·영업시간·인력·주변 가게)을 목록으로 만들기', `${meal} 예약 건수와 단골 재방문이 줄었는지 확인하기`]
    question = `최근 6주 사이 ${grp} ${meal}에 달라진 점이 있는지`
  } else {
    const grp = GROUP[p.group ?? 'weekday']
    const best = `${BEST_GROUP[f.bestGroup] ?? '평일'} ${f.bestIsLunch ? '점심' : '저녁'}`
    title = `${grp} ${meal}은 가장 바쁜 때의 ${pctPlain(1 + p.rate)} 수준이에요`
    size = `월 약 ${eurDiff(p.whatIfMonthly ?? 0)}`
    sizeNote = '하루 손님이 10명 늘 때 (가정)'
    details = [
      `${grp} ${meal} 손님은 하루 평균 ${people(f.guests)}이에요. 이 지점이 가장 바쁜 ${best}에는 평균 ${people(f.best)}을 받아요.`,
      `줄어든 것이 아니라 원래 비어 있는 시간이에요. 좌석 수 자료가 없어서 ‘가장 바빴던 때’를 기준으로 삼았어요.`,
      `객단가 ${eurCheck(f.check)} 기준으로, 하루 손님이 10명 늘면 월 약 ${eur(p.whatIfMonthly ?? 0)}에 해당해요. 예측이 아니라 가정 계산이에요.`,
    ]
    basis = `${period} · ${grp} ${p.n}일 · 지점 안에서 서비스별 하루 평균 방문객 비교.`
    ideas = ['이 시간대 전용 메뉴나 예약 혜택을 4주만 시험해 보기', '시험 전후를 같은 비교 기준으로 다시 보기']
    question = `${grp} ${meal}을 채우려고 해 본 것이 있는지, 그 시간 인력은 어떻게 두는지`
  }

  return {
    title,
    size,
    sizeNote,
    details,
    basis,
    ideas,
    check: { branch: p.branch, question, summary: `${name} · 반복 패턴 · ${title} · ${size}` },
  }
}
