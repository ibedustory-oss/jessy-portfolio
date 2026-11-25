import { WEEKDAY_KO, parts, weekday, type ISODate } from './calendar'

const MINUS = '−'

function group(n: number): string {
  return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

/** €1,920 — 유로 단위로 반올림 */
export function eur(cents: number): string {
  const v = Math.round(cents / 100)
  return `${v < 0 ? MINUS : ''}€${group(Math.abs(v))}`
}

/** 차액: +€170 / −€480 / €0 */
export function eurDiff(cents: number): string {
  const v = Math.round(cents / 100)
  if (v === 0) return '€0'
  return `${v > 0 ? '+' : MINUS}€${group(Math.abs(v))}`
}

/** 객단가: €16 또는 €19.40 */
export function eurCheck(cents: number | null): string {
  if (cents === null) return '–'
  const r = Math.round(cents)
  if (r % 100 === 0) return `€${group(r / 100)}`
  return `€${group(Math.floor(r / 100))}.${String(r % 100).padStart(2, '0')}`
}

/** 축 눈금: 1만 유로 미만은 그대로, 이상이면 K */
export function eurAxis(cents: number, compact: boolean): string {
  const v = cents / 100
  if (!compact) return `€${group(Math.round(v))}`
  const k = v / 1000
  return `€${Number.isInteger(k) ? k : k.toFixed(1)}K`
}

/** −20.0% / +3.2% / 0.0% */
export function pct(rate: number | null, digits = 1): string {
  if (rate === null) return '–'
  const v = rate * 100
  const s = Math.abs(v).toFixed(digits)
  if (Number(s) === 0) return `${s}%`
  return `${v > 0 ? '+' : MINUS}${s}%`
}

export function pctPlain(rate: number, digits = 0): string {
  return `${(rate * 100).toFixed(digits)}%`
}

export function people(n: number): string {
  const r = Math.round(n)
  return `${group(r)}명`
}

export function count(n: number): string {
  return group(Math.round(n))
}

/** 2026년 11월 21일 (토) */
export function dateFull(d: ISODate): string {
  const p = parts(d)
  return `${p.y}년 ${p.m}월 ${p.d}일 (${WEEKDAY_KO[weekday(d)]})`
}

/** 11월 21일 (토) */
export function dateShort(d: ISODate): string {
  const p = parts(d)
  return `${p.m}월 ${p.d}일 (${WEEKDAY_KO[weekday(d)]})`
}

/** 11월 21일 */
export function dateMD(d: ISODate): string {
  const p = parts(d)
  return `${p.m}월 ${p.d}일`
}

/** 11/21 */
export function dateSlash(d: ISODate): string {
  const p = parts(d)
  return `${p.m}/${p.d}`
}

export function weekdayName(d: ISODate): string {
  return `${WEEKDAY_KO[weekday(d)]}요일`
}

export function weekdayNameOf(dow: number): string {
  return `${WEEKDAY_KO[dow]}요일`
}

/** 2026년 11월 */
export function monthFull(ym: string): string {
  return `${Number(ym.slice(0, 4))}년 ${Number(ym.slice(5, 7))}월`
}

/** 11월 16일~22일 / 2025년 11월 23일~2026년 11월 22일 */
export function dateRange(a: ISODate, b: ISODate): string {
  const pa = parts(a)
  const pb = parts(b)
  if (a === b) return dateShort(a)
  if (pa.y !== pb.y) return `${pa.y}년 ${pa.m}월 ${pa.d}일~${pb.y}년 ${pb.m}월 ${pb.d}일`
  if (pa.m !== pb.m) return `${pa.m}월 ${pa.d}일~${pb.m}월 ${pb.d}일`
  return `${pa.m}월 ${pa.d}일~${pb.d}일`
}

export function dateRangeWithYear(a: ISODate, b: ISODate): string {
  const pa = parts(a)
  const pb = parts(b)
  if (a === b) return dateFull(a)
  if (pa.y !== pb.y) return `${pa.y}년 ${pa.m}월 ${pa.d}일~${pb.y}년 ${pb.m}월 ${pb.d}일`
  if (pa.m !== pb.m) return `${pa.y}년 ${pa.m}월 ${pa.d}일~${pb.m}월 ${pb.d}일`
  return `${pa.y}년 ${pa.m}월 ${pa.d}일~${pb.d}일`
}

export function hourLabel(h: number): string {
  return `${h}시`
}

export function mm(v: number): string {
  return `${v.toFixed(1)}mm`
}

/** 받침 유무에 따라 조사를 고른다: josa('Le Marais점', '은', '는') */
export function josa(word: string, withFinal: string, withoutFinal: string): string {
  const ch = word.charCodeAt(word.length - 1)
  if (ch < 0xac00 || ch > 0xd7a3) return withFinal
  return (ch - 0xac00) % 28 === 0 ? withoutFinal : withFinal
}
