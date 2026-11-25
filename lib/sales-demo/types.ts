import type { ISODate } from './calendar'
import type { BranchId } from './data'
import type { CompareMode, Scope } from './metrics'

export interface Memo {
  branch: BranchId
  date: ISODate
  text: string
  /** 표시용 수정 시각 (Europe/Paris) */
  updatedAt: string
}

export interface AgendaItem {
  id: string
  branch: BranchId
  date: ISODate
  /** 수치 요약 */
  summary: string
  /** 회의에서 확인할 질문 */
  question: string
  done: boolean
}

/** 지점·요일별 비교 기준. 키는 `${branch}:${요일 0~6}` */
export type Defaults = Record<string, CompareMode>
export const defaultKey = (branch: BranchId, dow: number): string => `${branch}:${dow}`

export interface ViewState {
  scope: Scope
  date: ISODate
  mode: CompareMode
}
