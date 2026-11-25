'use client'

import { useMemo, useState } from 'react'
import { branchById } from '@/lib/sales-demo/data'
import { scopeName } from '@/lib/sales-demo/analysis'
import { dateRange, dateShort } from '@/lib/sales-demo/format'
import { PATTERN_END, PATTERN_START, PATTERN_WEEKS, findPatterns, type Pattern, type PatternKind } from '@/lib/sales-demo/patterns'
import { KIND_LABEL, describePattern } from '@/lib/sales-demo/patterns-text'
import { useDemo } from './store'
import { Card, Icon, btn } from './ui'

const KIND_STYLE: Record<PatternKind, { tag: string; size: string; icon: string }> = {
  weather: { tag: 'bg-[#E9F1FD] text-[#1A4E9B]', size: 'text-[#BF2A24]', icon: 'rain' },
  drift: { tag: 'bg-[#FFF1DF] text-[#874700]', size: 'text-[#BF2A24]', icon: 'alert' },
  underused: { tag: 'bg-surface text-charcoal', size: 'text-ink', icon: 'chart' },
  strength: { tag: 'bg-[#E9F5EB] text-[#0B6B22]', size: 'text-[#0B6B22]', icon: 'check' },
}

function Row({ p, open, onToggle, showBranch }: { p: Pattern; open: boolean; onToggle: () => void; showBranch: boolean }) {
  const d = useDemo()
  const t = useMemo(() => describePattern(p), [p])
  const style = KIND_STYLE[p.kind]
  const added = d.hasAgenda(t.check, p.example)
  const panel = `sd-pattern-${p.id}`
  return (
    <li className={`rounded-xl border ${open ? 'border-[#CBD0D7]' : 'border-line'} bg-white`}>
      <button type="button" aria-expanded={open} aria-controls={panel} onClick={onToggle} className="flex w-full items-center gap-3 px-3.5 py-3 text-left">
        <span className="min-w-0 flex-1">
          <span className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <span className={`inline-flex items-center gap-1 whitespace-nowrap rounded-md px-1.5 py-0.5 text-[12px] font-medium leading-5 ${style.tag}`}>
              <Icon name={style.icon} size={12} />
              {KIND_LABEL[p.kind]}
            </span>
            {showBranch && <span className="text-[12.5px] font-semibold text-charcoal">{branchById(p.branch).name}</span>}
          </span>
          <span className="mt-1 block text-[14px] font-semibold leading-6 text-ink">{t.title}</span>
        </span>
        <span className="shrink-0 text-right">
          <span className={`block whitespace-nowrap text-[15px] font-bold tabular-nums ${style.size}`}>{t.size}</span>
          <span className="block whitespace-nowrap text-[11.5px] text-warmgray">{t.sizeNote}</span>
        </span>
        <Icon name="down" size={16} className={`shrink-0 text-warmgray transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div id={panel} className="grid gap-4 border-t border-line px-3.5 py-3.5 md:grid-cols-2">
          <div>
            <h4 className="flex items-center justify-between gap-2 text-[12.5px] font-bold text-ink">
              수치로 확인한 내용
              <span className="rounded bg-surface px-1.5 py-0.5 text-[11.5px] font-medium text-charcoal">매출 자료</span>
            </h4>
            <ul className="mt-1.5 space-y-1.5 text-[13.5px] leading-6 text-charcoal">
              {t.details.map((x) => (
                <li key={x} className="flex gap-2">
                  <span aria-hidden="true" className="mt-[9px] h-1 w-1 shrink-0 rounded-full bg-[#9AA1AD]" />
                  <span>{x}</span>
                </li>
              ))}
            </ul>
            <p className="mt-2 text-[12px] leading-5 text-warmgray">{t.basis}</p>
          </div>
          <div>
            <h4 className="flex items-center justify-between gap-2 text-[12.5px] font-bold text-ink">
              해볼 만한 것
              <span className="rounded bg-[#F0EDFD] px-1.5 py-0.5 text-[11.5px] font-medium text-[#4A38AE]">제안 · 사실 아님</span>
            </h4>
            <ul className="mt-1.5 space-y-1.5 text-[13.5px] leading-6 text-charcoal">
              {t.ideas.map((x) => (
                <li key={x} className="flex gap-2">
                  <span aria-hidden="true" className="mt-[9px] h-1 w-1 shrink-0 rounded-full bg-[#9AA1AD]" />
                  <span>{x}</span>
                </li>
              ))}
            </ul>
            <div className="mt-3 rounded-lg bg-surface px-3 py-2.5">
              <p className="text-[12px] font-semibold text-charcoal">먼저 회의에서 확인할 것</p>
              <p className="mt-0.5 text-[13.5px] leading-6 text-ink">{t.check.question}</p>
              <div className="mt-2 flex flex-wrap gap-2">
                <button
                  type="button"
                  disabled={added}
                  onClick={() => d.addAgenda(t.check, p.example)}
                  className={added ? 'inline-flex items-center gap-1 px-1 py-1 text-[12.5px] font-medium text-[#0B6B22]' : `${btn.ghost} !py-1 !text-[12.5px]`}
                >
                  <Icon name={added ? 'check' : 'plus'} size={13} />
                  {added ? '안건에 추가됨' : '회의 안건에 추가'}
                </button>
                <button
                  type="button"
                  className={`${btn.ghost} !py-1 !text-[12.5px]`}
                  onClick={() => {
                    d.goto(p.branch, p.example)
                    d.scrollTo('sd-day')
                  }}
                >
                  예시 날짜 열기 · {dateShort(p.example)}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </li>
  )
}

/** 개선 기회 — 하루가 아니라 되풀이되는 차이. 기간 선택과 무관하게 최근 26주를 본다. */
export function PatternsCard() {
  const d = useDemo()
  const all = useMemo(() => findPatterns(d.scope), [d.scope])
  const [openId, setOpenId] = useState<string | null>(null)
  const [more, setMore] = useState(false)

  // 처음에는 관측된 차이 전부 + 비어 있는 여력 2건 + 잘되는 패턴 1건만 보여 준다
  const lead = useMemo(() => {
    const observed = all.filter((p) => p.kind === 'weather' || p.kind === 'drift')
    const underused = all.filter((p) => p.kind === 'underused').slice(0, 2)
    const strength = all.filter((p) => p.kind === 'strength').slice(0, 1)
    return [...observed, ...underused, ...strength]
  }, [all])
  const rest = all.filter((p) => !lead.includes(p))
  const shown = more ? [...lead, ...rest] : lead

  return (
    <Card id="sd-patterns" label="개선 기회" className="scroll-mt-20 px-5 py-4">
      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <h2 className="text-[15px] font-bold text-ink">개선 기회</h2>
        <p className="text-[12.5px] text-warmgray">
          {scopeName(d.scope)} · 하루가 아니라 되풀이되는 차이 · 최근 {PATTERN_WEEKS}주({dateRange(PATTERN_START, PATTERN_END)}) · 위 기간 선택과 무관
        </p>
      </div>
      {all.length === 0 ? (
        <p className="mt-3 rounded-xl bg-surface px-4 py-3 text-[13.5px] text-charcoal">최근 {PATTERN_WEEKS}주 동안 되풀이되는 큰 차이는 찾지 못했어요.</p>
      ) : (
        <>
          <ul className="mt-3 space-y-1.5">
            {shown.map((p) => (
              <Row key={p.id} p={p} open={openId === p.id} onToggle={() => setOpenId(openId === p.id ? null : p.id)} showBranch={d.scope === 'all'} />
            ))}
          </ul>
          <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1">
            {rest.length > 0 && (
              <button type="button" className={btn.quiet} onClick={() => setMore(!more)} aria-expanded={more}>
                {more ? '접기' : `${rest.length}건 더 보기`}
              </button>
            )}
            <p className="text-[12px] text-warmgray">금액은 관측된 차이이거나 가정을 밝힌 계산이에요. 원인을 확정한 것은 아니에요.</p>
          </div>
        </>
      )}
    </Card>
  )
}
