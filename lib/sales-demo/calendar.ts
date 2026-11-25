/**
 * 날짜는 Europe/Paris 현지 달력 날짜를 'YYYY-MM-DD' 문자열로 다룬다.
 * 브라우저 시간대에 영향을 받지 않도록 계산은 모두 UTC 일수로 한다.
 */
export type ISODate = string

const DAY_MS = 86_400_000

export function dayNum(d: ISODate): number {
  const y = Number(d.slice(0, 4))
  const m = Number(d.slice(5, 7))
  const day = Number(d.slice(8, 10))
  return Math.round(Date.UTC(y, m - 1, day) / DAY_MS)
}

export function fromDayNum(n: number): ISODate {
  const dt = new Date(n * DAY_MS)
  const y = dt.getUTCFullYear()
  const m = dt.getUTCMonth() + 1
  const d = dt.getUTCDate()
  return `${y}-${m < 10 ? '0' : ''}${m}-${d < 10 ? '0' : ''}${d}`
}

export function addDays(d: ISODate, n: number): ISODate {
  return fromDayNum(dayNum(d) + n)
}

/** 0 = 일요일 … 6 = 토요일 */
export function weekday(d: ISODate): number {
  return new Date(dayNum(d) * DAY_MS).getUTCDay()
}

export function parts(d: ISODate): { y: number; m: number; d: number } {
  return { y: Number(d.slice(0, 4)), m: Number(d.slice(5, 7)), d: Number(d.slice(8, 10)) }
}

export function ymOf(d: ISODate): string {
  return d.slice(0, 7)
}

export function daysInMonth(y: number, m: number): number {
  return new Date(Date.UTC(y, m, 0)).getUTCDate()
}

export function makeDate(y: number, m: number, d: number): ISODate {
  return `${y}-${m < 10 ? '0' : ''}${m}-${d < 10 ? '0' : ''}${d}`
}

/** 전년 같은 날짜. 2월 29일은 2월 28일로 맞춘다. */
export function sameDateLastYear(d: ISODate): ISODate {
  const p = parts(d)
  const dim = daysInMonth(p.y - 1, p.m)
  return makeDate(p.y - 1, p.m, Math.min(p.d, dim))
}

export function rangeDates(start: ISODate, end: ISODate): ISODate[] {
  const out: ISODate[] = []
  const a = dayNum(start)
  const b = dayNum(end)
  for (let n = a; n <= b; n++) out.push(fromDayNum(n))
  return out
}

export const WEEKDAY_KO = ['일', '월', '화', '수', '목', '금', '토'] as const
