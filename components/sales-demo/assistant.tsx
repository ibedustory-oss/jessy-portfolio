'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { conditionsLabel, suggestionsFor, type AnswerAction } from '@/lib/sales-demo/assistant'
import { BRANCH_IDS, branchById } from '@/lib/sales-demo/data'
import { eur } from '@/lib/sales-demo/format'
import { GUIDE_STEPS, useDemo, type ChatMessage } from './store'
import { Delta, Icon, btn } from './ui'

function Actions({ actions }: { actions: AnswerAction[] }) {
  const d = useDemo()
  if (actions.length === 0) return null
  return (
    <div className="mt-2.5 flex flex-wrap gap-1.5">
      {actions.map((a) => {
        if (a.kind === 'agenda') {
          const added = d.hasAgenda(a.item, a.date)
          return (
            <button key={a.label} type="button" className={btn.chip} disabled={added} onClick={() => d.addAgenda(a.item, a.date)}>
              <Icon name={added ? 'check' : 'plus'} size={13} />
              {added ? '안건에 추가됨' : a.label}
            </button>
          )
        }
        const run = () => {
          if (a.kind === 'ask') d.ask(a.text)
          else if (a.kind === 'evidence') {
            d.setEvidenceOpen(true)
            d.scrollTo('sd-evidence')
          } else if (a.kind === 'goto') {
            d.goto(a.scope, a.date)
            d.scrollTo('sd-day')
          } else if (a.kind === 'openAgenda') d.setTab('agenda')
        }
        return (
          <button key={a.label} type="button" className={btn.chip} onClick={run}>
            {a.label}
          </button>
        )
      })}
    </div>
  )
}

function Message({ m }: { m: ChatMessage }) {
  const d = useDemo()
  if (m.role === 'user') {
    return (
      <li className="flex justify-end">
        <p className="max-w-[88%] whitespace-pre-wrap rounded-2xl rounded-br-md bg-ink px-3.5 py-2 text-[14px] leading-6 text-white">
          <span className="sr-only">내 질문: </span>
          {m.text}
        </p>
      </li>
    )
  }
  const a = m.answer
  return (
    <li className="flex">
      <div className="max-w-[94%] rounded-2xl rounded-bl-md border border-line bg-white px-3.5 py-3">
        <span className="sr-only">답변: </span>
        {a && (
          <p className="mb-1.5 inline-flex max-w-full items-center gap-1 rounded-md bg-surface px-1.5 py-0.5 text-[11.5px] font-medium leading-5 text-charcoal">
            <span className="truncate">{a.conditions}</span>
          </p>
        )}
        {m.text && <p className="text-[14px] leading-6 text-ink">{m.text}</p>}
        {a?.paragraphs.map((p, i) => (
          <p key={i} className={`text-[14px] leading-6 text-ink ${i > 0 ? 'mt-1.5' : ''}`}>
            {p}
          </p>
        ))}
        {a?.rows && (
          <div className="mt-2.5 overflow-hidden rounded-xl border border-line">
            <table className="w-full border-collapse text-[13px]">
              <caption className="bg-surface px-3 py-1.5 text-left text-[11.5px] text-warmgray">{a.rowsCaption}</caption>
              <tbody className="tabular-nums">
                {a.rows.map((r) => (
                  <tr key={r.branch} className={`border-t border-line ${r.highlight ? 'bg-tint' : ''}`}>
                    <th scope="row" className="px-3 py-1.5 text-left font-medium text-ink">
                      {r.name}
                      {r.highlight && <span className="ml-1.5 text-[11px] font-semibold text-accent">보던 지점</span>}
                    </th>
                    <td className="px-2 py-1.5 text-right text-charcoal">{r.revenue === null ? '누락' : eur(r.revenue)}</td>
                    <td className="px-3 py-1.5 text-right">{r.diff === null ? <span className="text-warmgray">–</span> : <Delta diff={r.diff} rate={r.rate} />}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {a?.preview && (
          <div className="mt-2.5 rounded-xl border border-accent/30 bg-tint px-3.5 py-3">
            <p className="text-[12px] font-medium text-accent">기본값 미리보기</p>
            <p className="mt-0.5 text-[14px] font-semibold leading-6 text-ink">{a.preview.label}</p>
            {a.preview.resolved && <p className="text-[12.5px] leading-5 text-charcoal">{a.preview.resolved}</p>}
            {m.save === 'pending' ? (
              <div className="mt-2.5 flex gap-2">
                <button type="button" className={btn.primary} onClick={() => d.confirmSave(m.id)}>
                  기본값으로 저장
                </button>
                <button type="button" className={btn.ghost} onClick={() => d.cancelSave(m.id)}>
                  취소
                </button>
              </div>
            ) : (
              <p className="mt-2 inline-flex items-center gap-1 text-[12.5px] font-semibold text-charcoal">
                <Icon name={m.save === 'saved' ? 'check' : 'x'} size={13} />
                {m.save === 'saved' ? '저장했어요' : '저장하지 않았어요'}
              </p>
            )}
          </div>
        )}
        {a && <Actions actions={a.actions} />}
        {a?.suggestions && (
          <div className="mt-2.5 flex flex-wrap gap-1.5">
            {a.suggestions.map((s) => (
              <button key={s} type="button" className={btn.chip} onClick={() => d.ask(s)}>
                {s}
              </button>
            ))}
          </div>
        )}
      </div>
    </li>
  )
}

function Agenda() {
  const d = useDemo()
  const groups = BRANCH_IDS.map((b) => ({ b, items: d.agenda.filter((a) => a.branch === b) })).filter((g) => g.items.length > 0)
  const copy = async () => {
    const text = [
      '서울식당 파리 · 점장 회의 안건',
      ...groups.flatMap((g) => ['', `■ ${branchById(g.b).name}`, ...g.items.flatMap((i) => [`- ${i.summary}`, `  확인: ${i.question}`])]),
    ].join('\n')
    try {
      await navigator.clipboard.writeText(text)
      d.notify('회의 안건을 복사했어요')
    } catch {
      d.notify('복사하지 못했어요. 브라우저 권한을 확인해 주세요')
    }
  }
  if (groups.length === 0) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center px-6 py-10 text-center">
        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-surface text-warmgray">
          <Icon name="list" size={20} />
        </div>
        <p className="mt-3 text-[14.5px] font-semibold text-ink">아직 안건이 없어요</p>
        <p className="mt-1 text-[13px] leading-6 text-charcoal">
          ‘분석 근거’의 추가로 확인할 점에서 <span className="font-semibold">+ 안건</span>을 누르면
          <br />
          다음 점장 회의에서 물어볼 질문이 지점별로 모여요.
        </p>
      </div>
    )
  }
  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="min-h-0 flex-1 space-y-4 overflow-y-auto px-4 py-4">
        {groups.map((g) => (
          <section key={g.b} aria-label={`${branchById(g.b).name} 안건`}>
            <h3 className="text-[13px] font-bold text-ink">{branchById(g.b).name}</h3>
            <ul className="mt-1.5 space-y-1.5">
              {g.items.map((i) => (
                <li key={i.id} className="flex items-start gap-2.5 rounded-xl border border-line bg-white px-3 py-2.5">
                  <input
                    type="checkbox"
                    checked={i.done}
                    onChange={() => d.toggleAgenda(i.id)}
                    aria-label={`확인 완료: ${i.question}`}
                    className="mt-1 h-4 w-4 shrink-0 accent-[#1B64DA]"
                  />
                  <button
                    type="button"
                    className="min-w-0 flex-1 text-left"
                    onClick={() => {
                      d.goto(i.branch, i.date)
                      d.scrollTo('sd-day')
                    }}
                    title="이 지점·날짜 열기"
                  >
                    <span className={`block text-[13.5px] font-medium leading-6 ${i.done ? 'text-warmgray line-through' : 'text-ink'}`}>{i.question}</span>
                    <span className="block text-[12px] leading-5 text-warmgray">{i.summary}</span>
                  </button>
                  <button type="button" className={`${btn.quiet} !px-1`} onClick={() => d.removeAgenda(i.id)} aria-label={`안건 삭제: ${i.question}`}>
                    <Icon name="x" size={14} />
                  </button>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
      <div className="border-t border-line px-4 py-3">
        <button type="button" className={`${btn.ghost} w-full`} onClick={copy}>
          <Icon name="copy" size={15} />
          안건 전체 복사 (메신저에 붙여넣기)
        </button>
      </div>
    </div>
  )
}

export function Assistant() {
  const d = useDemo()
  const listRef = useRef<HTMLDivElement>(null)
  const suggestions = useMemo(
    () => suggestionsFor({ scope: d.scope, date: d.date, mode: d.mode }, d.defaults),
    [d.scope, d.date, d.mode, d.defaults],
  )
  const conditions = useMemo(() => conditionsLabel({ scope: d.scope, date: d.date, mode: d.mode }), [d.scope, d.date, d.mode])

  useEffect(() => {
    const el = listRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [d.messages.length, d.tab])

  const open = d.agenda.filter((a) => !a.done).length

  return (
    <section
      id="sd-assistant"
      aria-label="매출에 대해 물어보세요"
      className="flex scroll-mt-16 flex-col overflow-hidden rounded-2xl border border-line bg-white lg:h-full"
    >
      <Guide placement="panel" />
      <div className="border-b border-line px-4 pt-3.5">
        <h2 className="text-[15px] font-bold text-ink">매출에 대해 물어보세요</h2>
        <div role="tablist" aria-label="질문과 회의 안건" className="mt-2 flex gap-4">
          {(
            [
              { id: 'ask', label: '질문' },
              { id: 'agenda', label: `회의 안건${d.agenda.length ? ` ${d.agenda.length}` : ''}` },
            ] as const
          ).map((t) => (
            <button
              key={t.id}
              type="button"
              role="tab"
              aria-selected={d.tab === t.id}
              onClick={() => d.setTab(t.id)}
              className={`-mb-px border-b-2 px-0.5 pb-2 text-[13.5px] font-semibold ${
                d.tab === t.id ? 'border-ink text-ink' : 'border-transparent text-warmgray hover:text-ink'
              }`}
            >
              {t.label}
              {t.id === 'agenda' && open > 0 && <span className="sr-only"> (확인 전 {open}건)</span>}
            </button>
          ))}
        </div>
      </div>

      {d.tab === 'agenda' ? (
        <Agenda />
      ) : (
        <>
          <div ref={listRef} className="max-h-[60vh] min-h-[220px] flex-1 overflow-y-auto bg-[#FAFBFC] px-3.5 py-4 lg:max-h-none lg:min-h-0">
            <ul className="space-y-3" aria-live="polite" aria-relevant="additions">
              {d.messages.map((m) => (
                <Message key={m.id} m={m} />
              ))}
            </ul>
          </div>
          <div className="border-t border-line px-3.5 pb-3 pt-2.5">
            <p className="mb-2 flex items-center gap-1.5 text-[12px] text-warmgray">
              <span className="shrink-0">지금 보는 조건</span>
              <span className="truncate rounded-md bg-surface px-1.5 py-0.5 font-medium text-charcoal">{conditions}</span>
            </p>
            <div className="-mx-0.5 mb-2 flex gap-1.5 overflow-x-auto px-0.5 pb-1" role="group" aria-label="추천 질문">
              {suggestions.map((s) => (
                <button key={s} type="button" className={`${btn.chip} shrink-0 whitespace-nowrap`} onClick={() => d.ask(s)}>
                  {s}
                </button>
              ))}
            </div>
            <form
              className="flex items-end gap-2"
              onSubmit={(e) => {
                e.preventDefault()
                d.ask(d.draft)
              }}
            >
              <label htmlFor="sd-question" className="sr-only">
                질문 입력
              </label>
              <textarea
                id="sd-question"
                ref={d.inputRef}
                value={d.draft}
                onChange={(e) => d.setDraft(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing) {
                    e.preventDefault()
                    d.ask(d.draft)
                  }
                }}
                rows={1}
                placeholder="예) 이날 매출이 왜 이렇게 낮았어?"
                className="block max-h-28 min-h-[42px] flex-1 resize-none rounded-xl border border-line bg-white px-3.5 py-2.5 text-[14px] leading-5 text-ink placeholder:text-[#9AA1AD] hover:border-[#CBD0D7]"
              />
              <button type="submit" disabled={!d.draft.trim()} aria-label="질문 보내기" className="flex h-[42px] w-[42px] shrink-0 items-center justify-center rounded-xl bg-accent text-white transition-colors hover:bg-accenthover disabled:bg-[#C5CAD1]">
                <Icon name="send" size={18} />
              </button>
            </form>
            <p className="mt-2 text-[11.5px] leading-4 text-warmgray">AI 분석은 예시 응답입니다. 데모 데이터의 집계 결과로만 답해요.</p>
          </div>
        </>
      )}
    </section>
  )
}

/* ───────── 3분 시연 가이드 ─────────
   PC에서는 질문 패널 맨 위에, 모바일에서는 화면 아래에 한 줄로 붙는다. */

export function Guide({ placement }: { placement: 'panel' | 'top' }) {
  const d = useDemo()
  const [expanded, setExpanded] = useState(false)
  if (!d.hydrated || !d.guideOpen) return null
  const next = GUIDE_STEPS.find((s) => !d.guideDone.includes(s.id))
  const act = () => {
    if (!next) return
    if (next.id === 1) {
      d.goto('all', '2026-11-21')
      d.scrollTo('sd-day')
    } else if (next.question) d.focusAsk(next.question)
  }
  return (
    <aside
      aria-label="3분 시연 가이드"
      className={placement === 'panel' ? 'border-b border-line bg-tint' : 'mb-4 rounded-2xl border border-[#CFE0FA] bg-tint lg:hidden'}
    >
      <div className="px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1 rounded-md bg-accent px-1.5 py-0.5 text-[11.5px] font-bold text-white">
            <Icon name="play" size={12} />
            3분 시연 <span className="tabular-nums">{d.guideDone.length}/6</span>
          </span>
          <button
            type="button"
            className="ml-auto inline-flex items-center gap-0.5 rounded-md px-1.5 py-0.5 text-[12px] font-medium text-charcoal hover:bg-white"
            aria-expanded={expanded}
            onClick={() => setExpanded(!expanded)}
          >
            전체 단계
            <Icon name="down" size={13} className={expanded ? 'rotate-180' : ''} />
          </button>
          <button type="button" className="rounded-md p-1 text-warmgray hover:bg-white hover:text-ink" onClick={() => d.setGuideOpen(false)} aria-label="시연 가이드 닫기">
            <Icon name="x" size={14} />
          </button>
        </div>
        {next ? (
          <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1.5">
            <p className="min-w-0 flex-1 basis-[200px] text-[13.5px] leading-5">
              <span className="font-semibold text-ink">
                {next.id}. {next.title}
              </span>
              <span className="block text-[12.5px] text-charcoal">
                {next.hint}
              </span>
            </p>
            <button type="button" className="shrink-0 rounded-lg border border-accent bg-white px-2.5 py-1.5 text-[12.5px] font-semibold text-accent hover:bg-tint" onClick={act}>
              {next.id === 1 ? '지점 비교표로 가기' : '질문 넣기'}
            </button>
          </div>
        ) : (
          <p className="mt-1.5 text-[13px] leading-5 text-charcoal">
            끝까지 해보셨어요. 저장한 기준으로는 평소 범위라서 ‘확인할 날’에서 Le Marais점 11월 21일이 빠졌어요. 새로고침해도 메모와 기본값은 남아요.
          </p>
        )}
        {expanded && (
          <ol className="mt-2.5 space-y-1 border-t border-line pt-2.5">
            {GUIDE_STEPS.map((s) => {
              const done = d.guideDone.includes(s.id)
              const current = next?.id === s.id
              return (
                <li key={s.id} className="flex items-start gap-2">
                  <span
                    className={`mt-0.5 flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full text-[11px] font-bold ${
                      done ? 'bg-[#0B6B22] text-white' : current ? 'bg-accent text-white' : 'bg-surface2 text-warmgray'
                    }`}
                  >
                    {done ? <Icon name="check" size={11} /> : s.id}
                  </span>
                  <span className={`text-[13px] leading-5 ${done ? 'text-warmgray' : current ? 'font-semibold text-ink' : 'text-charcoal'}`}>
                    {s.title}
                    {done && <span className="sr-only"> (완료)</span>}
                    {s.question && !done && <span className="block text-[12px] font-normal text-warmgray">“{s.question}”</span>}
                  </span>
                </li>
              )
            })}
          </ol>
        )}
      </div>
    </aside>
  )
}

export function Toast() {
  const d = useDemo()
  return (
    <div aria-live="polite" role="status" className="pointer-events-none fixed inset-x-0 bottom-5 z-50 flex justify-center px-4">
      {d.toast && (
        <p className="inline-flex items-center gap-2 rounded-xl bg-ink px-4 py-2.5 text-[13.5px] font-medium text-white shadow-[0_12px_32px_-8px_rgba(25,31,40,0.5)]">
          <Icon name="check" size={15} />
          {d.toast}
        </p>
      )}
    </div>
  )
}

export function AskFab() {
  const d = useDemo()
  const [near, setNear] = useState(false)
  // 질문 패널이 화면에 보이는 동안에는 버튼을 숨긴다
  useEffect(() => {
    const el = document.getElementById('sd-assistant')
    if (!el || typeof IntersectionObserver === 'undefined') return
    const io = new IntersectionObserver((entries) => setNear(entries[0]?.isIntersecting ?? false), { threshold: 0.15 })
    io.observe(el)
    return () => io.disconnect()
  }, [])
  if (near) return null
  return (
    <button
      type="button"
      onClick={() => d.focusAsk()}
      className="fixed bottom-4 right-4 z-40 inline-flex items-center gap-1.5 rounded-full bg-accent px-4 py-3 text-[14px] font-semibold text-white shadow-[0_12px_28px_-8px_rgba(27,100,218,0.6)] lg:hidden"
    >
      <Icon name="chat" size={17} />
      질문하기
    </button>
  )
}
