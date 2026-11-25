/** ‘고쳐볼 만한 점’의 문장 — 화면 카드와 대화 답변이 같은 문장을 쓴다. 누구나 아는 말로 쓴다. */
import { branchById, type Meal } from './data'
import { dateRange, eur, eurCheck, eurDiff, pct, pctPlain } from './format'
import { PATTERN_END, PATTERN_START, type DayGroup, type Pattern, type PatternKind } from './patterns'
import type { CheckItem } from './analysis'

const MEAL: Record<Meal, string> = { lunch: '점심', dinner: '저녁' }
const GROUP: Record<DayGroup, string> = { weekday: '평일', weekend: '주말', sat: '토요일', sun: '일요일' }
const BEST_GROUP = ['평일', '토요일', '일요일']

export const KIND_LABEL: Record<PatternKind, string> = {
  weather: '비 오면 줄어요',
  drift: '조금씩 줄고 있어요',
  underused: '한가한 시간',
  strength: '잘되고 있어요',
}

export interface PatternText {
  /** ‘비 오는 날 점심 매출이 41% 적어요’ */
  title: string
  /** 오른쪽에 크게 보이는 금액 */
  size: string
  /** 그 금액이 무엇인지 */
  sizeNote: string
  details: string[]
  /** 언제, 며칠을, 어떻게 봤는지 */
  basis: string
  /** 해볼 만한 것 — 아이디어일 뿐 확인된 사실이 아니다 */
  ideas: string[]
  check: CheckItem
}

const people = (n: number): string => `${Math.round(n)}명`
export const PATTERN_PERIOD = `최근 6개월(${dateRange(PATTERN_START, PATTERN_END)})`

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
    title = `비 오는 날 ${meal} 매출이 ${pctPlain(Math.abs(p.rate))} ${down ? '적어요' : '많아요'}`
    size = `한 달에 약 ${eurDiff(p.monthly ?? 0)}`
    sizeNote = `6개월 동안 ${eurDiff(f.total)}`
    details = [
      `${meal}에 비가 온 ${p.n}일을, 같은 요일의 맑은 날과 비교했어요. 하루에 평균 ${eur(Math.abs(f.perDay))} ${down ? '적게' : '많이'} 벌었어요.`,
      Math.abs(f.check - f.expectedCheck) < f.expectedCheck * 0.03
        ? `손님이 평균 ${people(f.expectedGuests)}에서 ${people(f.guests)}으로 ${f.guests < f.expectedGuests ? '줄었어요' : '늘었어요'}. 1명당 쓴 돈은 ${eurCheck(f.check)}쯤으로 거의 같아요.`
        : `손님은 평균 ${people(f.expectedGuests)}에서 ${people(f.guests)}으로, 1명당 쓴 돈은 ${eurCheck(f.expectedCheck)}에서 ${eurCheck(f.check)}로 달라졌어요.`,
    ]
    basis = `${PATTERN_PERIOD} · 비 온 날 ${p.n}일을 같은 요일 맑은 날 평균과 비교했어요. 비와 매출이 같이 움직였다는 뜻이지, 비 때문이라고 확인된 건 아니에요.`
    if (down) {
      ideas =
        p.branch === 'marais'
          ? ['비 예보가 있는 날은 실내 자리부터 예약으로 채우기', '비 오는 날에만 파는 점심 포장 세트 알리기']
          : [`비 예보가 있는 날은 ${meal} 예약을 미리 받기`, '비 오는 날에만 파는 포장 메뉴 알리기']
      question = p.branch === 'marais' ? '비 오는 날 점심에 테라스와 실내 자리를 어떻게 쓰는지' : `비 오는 날 ${meal}에는 평소와 뭐가 다른지`
    } else {
      ideas = ['비 예보가 있는 날은 재료와 일손을 넉넉히 준비하기', '이 지점에서 잘 팔리는 메뉴를 다른 지점의 비 오는 날에 팔아 보기']
      question = '비 오는 날 재료가 일찍 떨어지거나 손님이 기다리지는 않는지'
    }
  } else if (p.kind === 'drift') {
    const grp = GROUP[p.group ?? 'weekday']
    title = `${grp} ${meal} 손님이 조금씩 줄고 있어요 (${pct(p.rate, 0)})`
    size = `한 달에 약 ${eurDiff(p.monthly ?? 0)}`
    sizeNote = '그 전 6주와 비교한 차이'
    details = [
      `최근 6주 ${grp} ${meal} 손님은 하루 평균 ${people(f.recentGuests)}이에요. 그 전 6주에는 ${people(f.priorGuests)}이었어요.`,
      `계절 탓이 아닌지 작년 같은 때와도 견줘 봤어요. 그래도 ${pct(p.rate)}예요. 비 온 ${Math.round(f.excludedRainy)}일은 빼고 계산했어요.`,
      '하루씩 보면 티가 안 나서 ‘평소와 달랐던 날’에는 잘 안 나와요.',
    ]
    basis = `최근 12주 · 비 안 온 ${grp} ${p.n}일(최근 6주)을 그 전 6주와 비교했어요.`
    ideas = ['그동안 바뀐 것(메뉴, 가격, 영업시간, 일하는 사람, 주변 가게)을 적어 보기', `${meal} 예약과 단골손님이 줄었는지 확인하기`]
    question = `최근 6주 사이에 ${grp} ${meal}에 달라진 게 있는지`
  } else {
    const grp = GROUP[p.group ?? 'weekday']
    const best = `${BEST_GROUP[f.bestGroup] ?? '평일'} ${f.bestIsLunch ? '점심' : '저녁'}`
    title = `${grp} ${meal} 손님은 가장 바쁠 때의 ${pctPlain(1 + p.rate)}예요`
    size = `한 달에 약 ${eurDiff(p.whatIfMonthly ?? 0)}`
    sizeNote = '손님이 하루 10명 늘면'
    details = [
      `${grp} ${meal} 손님은 하루 평균 ${people(f.guests)}이에요. 가장 바쁜 ${best}에는 평균 ${people(f.best)}이 와요.`,
      '줄어든 게 아니라 원래 한가한 시간이에요. 좌석 수 정보가 없어서 ‘가장 바쁠 때’와 비교했어요.',
      `손님 1명이 ${eurCheck(f.check)}쯤 쓰니까, 하루에 10명만 더 와도 한 달에 약 ${eur(p.whatIfMonthly ?? 0)}이에요. 예상이 아니라 계산해 본 값이에요.`,
    ]
    basis = `${PATTERN_PERIOD} · ${grp} ${p.n}일의 하루 평균 손님 수를, 이 지점의 다른 시간대와 비교했어요.`
    ideas = ['이 시간에만 파는 메뉴나 예약 혜택을 4주만 해 보기', '해 보기 전과 후를 같은 방식으로 다시 비교하기']
    question = `${grp} ${meal}에 손님을 더 받으려고 해 본 게 있는지, 그 시간에 몇 명이 일하는지`
  }

  return {
    title,
    size,
    sizeNote,
    details,
    basis,
    ideas,
    check: { branch: p.branch, question, summary: `${name} · 계속 반복되는 일 · ${title} · ${size}` },
  }
}
