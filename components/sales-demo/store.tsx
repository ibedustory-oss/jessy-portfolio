'use client'

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { addDays, weekday, ymOf, type ISODate } from '@/lib/sales-demo/calendar'
import { DEFAULT_DATE, VIEW_END, VIEW_START, type BranchId } from '@/lib/sales-demo/data'
import { respond, targetKey, type Answer, type Effect } from '@/lib/sales-demo/assistant'
import { ruleLabel, type CheckItem } from '@/lib/sales-demo/analysis'
import { monthRange, periodRange, type CompareMode, type PeriodKey, type RangeSpec, type Scope } from '@/lib/sales-demo/metrics'
import { defaultKey, type AgendaItem, type Defaults, type Memo } from '@/lib/sales-demo/types'

const STORAGE_KEY = 'seoul-sikdang-demo:v1'

interface Persisted {
  memos: Memo[]
  defaults: Defaults
  agenda: AgendaItem[]
  guideDone: number[]
  guideOpen: boolean
}

const EMPTY: Persisted = { memos: [], defaults: {}, agenda: [], guideDone: [], guideOpen: true }

export interface ChatMessage {
  id: number
  role: 'user' | 'assistant'
  text?: string
  answer?: Answer
  /** 저장 미리보기의 진행 상태 */
  save?: 'pending' | 'saved' | 'cancelled'
}

interface Snapshot {
  scope: Scope
  period: PeriodKey
  month: string | null
  date: ISODate
}

export const GUIDE_STEPS: { id: number; title: string; hint: string; question?: string }[] = [
  { id: 1, title: '11월 21일에 가장 많이 줄어든 지점 찾기', hint: '지점별 표에서 가장 많이 줄어든 지점을 눌러 보세요.' },
  { id: 2, title: '왜 적게 벌었는지 물어보기', hint: '평소 말하듯 물어보면 돼요.', question: '이날 매출이 왜 이렇게 낮았어?' },
  { id: 3, title: '비 온 토요일끼리만 비교하기', hint: '그래프, 비교한 날, 차이가 같이 바뀌어요.', question: '비 온 토요일끼리만 비교하면?' },
  { id: 4, title: '다른 지점과 작년도 확인하기', hint: '이어서 “작년이랑 비교하면?”도 물어보세요.', question: '그날 다른 지점은 어땠어?' },
  { id: 5, title: '메모 남기기', hint: '예) 이날은 테라스를 열지 않았음', question: '메모: 이날은 테라스를 열지 않았음' },
  { id: 6, title: '토요일은 항상 이렇게 보도록 저장하기', hint: '비 온 토요일 비교로 돌아온 뒤 부탁하세요.', question: '이 지점은 토요일마다 이렇게 보여줘' },
]

interface DemoCtx {
  hydrated: boolean
  scope: Scope
  date: ISODate
  period: PeriodKey
  month: string | null
  range: RangeSpec
  mode: CompareMode
  /** 이 지점·요일에 저장된 기준 */
  savedMode: CompareMode | null
  /** 지금 저장된 기준이 그대로 적용 중인가 */
  usingSaved: boolean
  canBack: boolean
  setScope: (s: Scope) => void
  setDate: (d: ISODate, opts?: { push?: boolean }) => void
  stepDate: (n: number) => void
  setPeriod: (p: PeriodKey) => void
  drillMonth: (ym: string) => void
  back: () => void
  setMode: (m: CompareMode) => void
  goto: (s: Scope, d: ISODate) => void

  memos: Memo[]
  memoFor: (b: BranchId, d: ISODate) => Memo | null
  saveMemo: (b: BranchId, d: ISODate, text: string) => void
  deleteMemo: (b: BranchId, d: ISODate) => void

  defaults: Defaults
  saveDefault: (b: BranchId, dow: number, m: CompareMode) => void
  removeDefault: (b: BranchId, dow: number) => void

  agenda: AgendaItem[]
  addAgenda: (item: CheckItem, date: ISODate) => void
  hasAgenda: (item: CheckItem, date: ISODate) => boolean
  toggleAgenda: (id: string) => void
  removeAgenda: (id: string) => void

  showBranches: boolean
  setShowBranches: (v: boolean) => void
  highlight: BranchId | null
  evidenceOpen: boolean
  setEvidenceOpen: (v: boolean) => void

  messages: ChatMessage[]
  ask: (text: string) => void
  confirmSave: (id: number) => void
  cancelSave: (id: number) => void
  draft: string
  setDraft: (s: string) => void
  focusAsk: (prefill?: string) => void
  inputRef: React.RefObject<HTMLTextAreaElement>
  tab: 'ask' | 'agenda'
  setTab: (t: 'ask' | 'agenda') => void

  guideDone: number[]
  guideOpen: boolean
  setGuideOpen: (v: boolean) => void

  toast: string | null
  notify: (s: string) => void
  resetDemo: () => void
  scrollTo: (id: string) => void
}

const Ctx = createContext<DemoCtx | null>(null)

export function useDemo(): DemoCtx {
  const c = useContext(Ctx)
  if (!c) throw new Error('DemoProvider가 필요해요')
  return c
}

const GREETING: ChatMessage = {
  id: 0,
  role: 'assistant',
  text: '지점과 날짜를 고르고, 평소 말하듯 물어보세요. 무엇과 비교할지 바꾸면 그래프도 같이 바뀌어요.',
}

const clampDate = (d: ISODate): ISODate => (d < VIEW_START ? VIEW_START : d > VIEW_END ? VIEW_END : d)

function nowLabel(): string {
  try {
    return new Intl.DateTimeFormat('ko-KR', {
      timeZone: 'Europe/Paris',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    }).format(new Date())
  } catch {
    return ''
  }
}

export function DemoProvider({ children }: { children: ReactNode }) {
  const [hydrated, setHydrated] = useState(false)
  const [persisted, setPersisted] = useState<Persisted>(EMPTY)

  const [scope, setScopeState] = useState<Scope>('all')
  const [date, setDateState] = useState<ISODate>(DEFAULT_DATE)
  const [period, setPeriodState] = useState<PeriodKey>('7d')
  const [month, setMonth] = useState<string | null>(null)
  const [override, setOverride] = useState<CompareMode | null>(null)
  const [history, setHistory] = useState<Snapshot[]>([])
  const [showBranches, setShowBranchesState] = useState(false)
  const [highlight, setHighlight] = useState<BranchId | null>(null)
  const [evidenceOpen, setEvidenceOpen] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>([GREETING])
  const [draft, setDraft] = useState('')
  const [tab, setTab] = useState<'ask' | 'agenda'>('ask')
  const [toast, setToast] = useState<string | null>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const idRef = useRef(1)
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const seen = useRef({ others: false, lastYear: false })

  /* ── 저장소 ── */
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY)
      if (raw) setPersisted({ ...EMPTY, ...(JSON.parse(raw) as Partial<Persisted>) })
    } catch {
      /* 저장소를 쓸 수 없으면 기본 상태로 시작 */
    }
    setHydrated(true)
  }, [])

  useEffect(() => {
    if (!hydrated) return
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(persisted))
    } catch {
      /* 무시 */
    }
  }, [persisted, hydrated])

  const notify = useCallback((s: string) => {
    setToast(s)
    if (toastTimer.current) clearTimeout(toastTimer.current)
    toastTimer.current = setTimeout(() => setToast(null), 3200)
  }, [])

  /* ── 범위와 비교 기준 ── */
  const range = useMemo(() => (month ? monthRange(month) : periodRange(period)), [month, period])
  const savedMode = scope !== 'all' ? (persisted.defaults[defaultKey(scope, weekday(date))] ?? null) : null
  const mode: CompareMode = override ?? savedMode ?? 'recent8'
  const usingSaved = override === null && savedMode !== null

  const snapshot = useCallback((): Snapshot => ({ scope, period, month, date }), [scope, period, month, date])
  const push = useCallback(() => setHistory((h) => [...h.slice(-19), snapshot()]), [snapshot])

  /** 선택일이 지금 보는 범위 밖이면 그 날짜가 보이는 범위로 옮긴다 */
  const showRangeFor = useCallback(
    (d: ISODate) => {
      if (d >= range.start && d <= range.end) return
      const fit = (['7d', '30d', '90d'] as PeriodKey[]).find((p) => d >= periodRange(p).start)
      if (fit) {
        setPeriodState(fit)
        setMonth(null)
      } else {
        setPeriodState('1y')
        setMonth(ymOf(d))
      }
    },
    [range],
  )

  const setScope = useCallback(
    (s: Scope) => {
      if (s === scope) return
      setScopeState(s)
      setOverride(null)
      setHighlight(null)
    },
    [scope],
  )

  const setDate = useCallback(
    (d: ISODate, opts?: { push?: boolean }) => {
      const next = clampDate(d)
      if (next === date) return
      if (opts?.push) push()
      setDateState(next)
      setOverride(null)
      showRangeFor(next)
    },
    [date, push, showRangeFor],
  )

  const stepDate = useCallback((n: number) => setDate(addDays(date, n)), [date, setDate])

  const setPeriod = useCallback(
    (p: PeriodKey) => {
      if (p === period && month === null) return
      push()
      setPeriodState(p)
      setMonth(null)
      const r = periodRange(p)
      if (date < r.start || date > r.end) {
        setDateState(r.end)
        setOverride(null)
      }
    },
    [period, month, date, push],
  )

  const drillMonth = useCallback(
    (ym: string) => {
      push()
      setMonth(ym)
      const r = monthRange(ym)
      if (date < r.start || date > r.end) {
        setDateState(r.end)
        setOverride(null)
      }
    },
    [date, push],
  )

  const back = useCallback(() => {
    const prev = history[history.length - 1]
    if (!prev) return
    setScopeState(prev.scope)
    setPeriodState(prev.period)
    setMonth(prev.month)
    setDateState(prev.date)
    setOverride(null)
    setHistory(history.slice(0, -1))
  }, [history])

  const setMode = useCallback((m: CompareMode) => setOverride(m), [])

  const goto = useCallback(
    (s: Scope, d: ISODate) => {
      if (s !== scope) {
        setScopeState(s)
        setHighlight(null)
      }
      const next = clampDate(d)
      if (next !== date) {
        setDateState(next)
        showRangeFor(next)
      }
      setOverride(null)
    },
    [scope, date, showRangeFor],
  )

  /* ── 메모 ── */
  const memoFor = useCallback(
    (b: BranchId, d: ISODate) => persisted.memos.find((m) => m.branch === b && m.date === d) ?? null,
    [persisted.memos],
  )
  const saveMemo = useCallback((b: BranchId, d: ISODate, text: string) => {
    const t = text.trim()
    if (!t) return
    setPersisted((p) => ({
      ...p,
      memos: [...p.memos.filter((m) => !(m.branch === b && m.date === d)), { branch: b, date: d, text: t, updatedAt: nowLabel() }],
    }))
  }, [])
  const deleteMemo = useCallback((b: BranchId, d: ISODate) => {
    setPersisted((p) => ({ ...p, memos: p.memos.filter((m) => !(m.branch === b && m.date === d)) }))
  }, [])

  /* ── 기본값 ── */
  const saveDefault = useCallback(
    (b: BranchId, dow: number, m: CompareMode) => {
      setPersisted((p) => ({ ...p, defaults: { ...p.defaults, [defaultKey(b, dow)]: m } }))
      setOverride(null)
      notify(`저장했어요 · ${ruleLabel(b, dow, m)}`)
    },
    [notify],
  )
  const removeDefault = useCallback(
    (b: BranchId, dow: number) => {
      setPersisted((p) => {
        const next = { ...p.defaults }
        delete next[defaultKey(b, dow)]
        return { ...p, defaults: next }
      })
      notify('저장한 방식을 지웠어요')
    },
    [notify],
  )

  /* ── 회의 안건 ── */
  const agendaId = (item: CheckItem, d: ISODate) => `${item.branch}|${d}|${item.question}`
  const hasAgenda = useCallback(
    (item: CheckItem, d: ISODate) => persisted.agenda.some((a) => a.id === agendaId(item, d)),
    [persisted.agenda],
  )
  const addAgenda = useCallback(
    (item: CheckItem, d: ISODate) => {
      const id = agendaId(item, d)
      setPersisted((p) =>
        p.agenda.some((a) => a.id === id)
          ? p
          : { ...p, agenda: [...p.agenda, { id, branch: item.branch, date: d, summary: item.summary, question: item.question, done: false }] },
      )
      notify('회의 때 물어볼 것에 추가했어요')
    },
    [notify],
  )
  const toggleAgenda = useCallback((id: string) => {
    setPersisted((p) => ({ ...p, agenda: p.agenda.map((a) => (a.id === id ? { ...a, done: !a.done } : a)) }))
  }, [])
  const removeAgenda = useCallback((id: string) => {
    setPersisted((p) => ({ ...p, agenda: p.agenda.filter((a) => a.id !== id) }))
  }, [])

  /* ── 화면 이동 ── */
  const scrollTo = useCallback((id: string) => {
    window.requestAnimationFrame(() => {
      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      document.getElementById(id)?.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' })
    })
  }, [])

  const setShowBranches = useCallback((v: boolean) => {
    setShowBranchesState(v)
    if (v) seen.current.others = true
  }, [])

  const focusAsk = useCallback(
    (prefill?: string) => {
      setTab('ask')
      if (prefill !== undefined) setDraft(prefill)
      window.requestAnimationFrame(() => {
        const el = inputRef.current
        if (!el) return
        if (window.matchMedia('(max-width: 1023px)').matches) {
          document.getElementById('sd-assistant')?.scrollIntoView({ block: 'start' })
        }
        el.focus({ preventScroll: true })
      })
    },
    [],
  )

  /* ── 시연 가이드 ── */
  const mark = useCallback((step: number) => {
    setPersisted((p) => (p.guideDone.includes(step) ? p : { ...p, guideDone: [...p.guideDone, step].sort() }))
  }, [])
  const setGuideOpen = useCallback((v: boolean) => setPersisted((p) => ({ ...p, guideOpen: v })), [])

  const atScenario = scope === 'marais' && date === '2026-11-21'
  useEffect(() => {
    if (!hydrated) return
    if (atScenario) mark(1)
    if (atScenario && mode === 'weather') mark(3)
    if (mode === 'lastYearWeekday' || mode === 'lastYearDate') seen.current.lastYear = true
    if (seen.current.others && seen.current.lastYear) mark(4)
    if (persisted.memos.some((m) => m.branch === 'marais')) mark(5)
    if (persisted.defaults[defaultKey('marais', 6)]) mark(6)
  }, [hydrated, atScenario, mode, showBranches, persisted.memos, persisted.defaults, mark])

  /* ── 질문 ── */
  const applyEffects = useCallback(
    (effects: Effect[]) => {
      let nextScope: Scope | null = null
      let nextDate: ISODate | null = null
      let nextMode: CompareMode | null = null
      for (const e of effects) {
        if (e.type === 'setScope') nextScope = e.scope
        else if (e.type === 'setDate') nextDate = e.date
        else if (e.type === 'setMode') nextMode = e.mode
        else if (e.type === 'showBranches') {
          setShowBranches(true)
          setHighlight(e.highlight)
          if (window.matchMedia('(min-width: 1024px)').matches) scrollTo('sd-branches')
        } else if (e.type === 'saveMemo') {
          saveMemo(e.branch, e.date, e.text)
          setEvidenceOpen(true)
        } else if (e.type === 'addAgenda') addAgenda(e.item, e.date)
        else if (e.type === 'openAgenda') setTab('agenda')
        else if (e.type === 'removeDefault') removeDefault(e.branch, e.dow)
      }
      if (nextScope !== null || nextDate !== null) {
        if (nextScope !== null) {
          setScopeState(nextScope)
          setHighlight(null)
        }
        if (nextDate !== null) {
          setDateState(nextDate)
          showRangeFor(nextDate)
        }
        setOverride(nextMode)
      } else if (nextMode !== null) {
        setOverride(nextMode)
      }
    },
    [addAgenda, removeDefault, saveMemo, scrollTo, setShowBranches, showRangeFor],
  )

  const ask = useCallback(
    (text: string) => {
      const q = text.trim()
      if (!q) return
      const lastAnswer = [...messages].reverse().find((m) => m.answer)?.answer
      const answer = respond(q, {
        view: { scope, date, mode },
        lastTarget: lastAnswer ? targetKey(lastAnswer.view) : null,
        defaults: persisted.defaults,
        memos: persisted.memos,
        range,
      })
      applyEffects(answer.effects)
      if (answer.view.scope === 'marais' && answer.view.date === '2026-11-21' && answer.intent === 'overview') mark(2)
      if (answer.intent === 'others') seen.current.others = true
      const uid = idRef.current++
      const aid = idRef.current++
      setMessages((ms) => [
        ...ms,
        { id: uid, role: 'user', text: q },
        { id: aid, role: 'assistant', answer, save: answer.preview ? 'pending' : undefined },
      ])
      setDraft('')
      setTab('ask')
    },
    [messages, scope, date, mode, persisted.defaults, persisted.memos, range, applyEffects, mark],
  )

  const confirmSave = useCallback(
    (id: number) => {
      const msg = messages.find((m) => m.id === id)
      const pv = msg?.answer?.preview
      if (!pv) return
      saveDefault(pv.branch, pv.dow, pv.mode)
      const aid = idRef.current++
      setMessages((ms) => [
        ...ms.map((m) => (m.id === id ? { ...m, save: 'saved' as const } : m)),
        { id: aid, role: 'assistant', text: `저장했어요. 다음에 들어와도 이렇게 보여드려요: ${pv.label}. 다른 지점과 다른 요일은 그대로예요.` },
      ])
    },
    [messages, saveDefault],
  )

  const cancelSave = useCallback((id: number) => {
    setMessages((ms) => ms.map((m) => (m.id === id ? { ...m, save: 'cancelled' as const } : m)))
  }, [])

  const resetDemo = useCallback(() => {
    setPersisted(EMPTY)
    setScopeState('all')
    setDateState(DEFAULT_DATE)
    setPeriodState('7d')
    setMonth(null)
    setOverride(null)
    setHistory([])
    setShowBranchesState(false)
    setHighlight(null)
    setEvidenceOpen(false)
    setMessages([GREETING])
    setDraft('')
    setTab('ask')
    seen.current = { others: false, lastYear: false }
    notify('처음 상태로 되돌렸어요')
    window.scrollTo({ top: 0 })
  }, [notify])

  const value: DemoCtx = {
    hydrated,
    scope,
    date,
    period,
    month,
    range,
    mode,
    savedMode,
    usingSaved,
    canBack: history.length > 0,
    setScope,
    setDate,
    stepDate,
    setPeriod,
    drillMonth,
    back,
    setMode,
    goto,
    memos: persisted.memos,
    memoFor,
    saveMemo,
    deleteMemo,
    defaults: persisted.defaults,
    saveDefault,
    removeDefault,
    agenda: persisted.agenda,
    addAgenda,
    hasAgenda,
    toggleAgenda,
    removeAgenda,
    showBranches,
    setShowBranches,
    highlight,
    evidenceOpen,
    setEvidenceOpen,
    messages,
    ask,
    confirmSave,
    cancelSave,
    draft,
    setDraft,
    focusAsk,
    inputRef,
    tab,
    setTab,
    guideDone: persisted.guideDone,
    guideOpen: persisted.guideOpen,
    setGuideOpen,
    toast,
    notify,
    resetDemo,
    scrollTo,
  }

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}
