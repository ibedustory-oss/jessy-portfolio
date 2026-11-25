'use client'

import { useMemo, useState } from 'react'
import { branchById } from '@/lib/sales-demo/data'
import { scopeName } from '@/lib/sales-demo/analysis'
import { dateShort } from '@/lib/sales-demo/format'
import { findPatterns, type Pattern, type PatternKind } from '@/lib/sales-demo/patterns'
import { KIND_LABEL, PATTERN_PERIOD, describePattern } from '@/lib/sales-demo/patterns-text'
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
              숫자로 확인한 것
              <span className="rounded bg-surface px-1.5 py-0.5 text-[11.5px] font-medium text-charcoal">매출 기록</span>
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
              <span className="rounded bg-[#F0EDFD] px-1.5 py-0.5 text-[11.5px] font-medium text-[#4A38AE]">아이디어 · 확인된 사실 아님</span>
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
              <p className="text-[12px] font-semibold text-charcoal">먼저 점장님께 물어볼 것</p>
              <p className="mt-0.5 text-[13.5px] leading-6 text-ink">{t.check.question}</p>
              <div className="mt-2 flex flex-wrap gap-2">
                <button
                  type="button"
                  disabled={added}
                  onClick={() => d.addAgenda(t.check, p.example)}
                  className={added ? 'inline-flex items-center gap-1 px-1 py-1 text-[12.5px] font-medium text-[#0B6B22]' : `${btn.ghost} !py-1 !text-[12.5px]`}
                >
                  <Icon name={added ? 'check' : 'plus'} size={13} />
                  {added ? '추가했어요' : '회의 때 물어보기'}
                </button>
                <button
                  type="button"
                  className={`${btn.ghost} !py-1 !text-[12.5px]`}
                  onClick={() => {
                    d.goto(p.branch, p.example)
                    d.scrollTo('sd-day')
                  }}
                >
                  이런 날 보기 · {dateShort(p.example)}
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
    <Card id="sd-patterns" label="고쳐볼 만한 점" className="scroll-mt-20 px-5 py-4">
      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <h2 className="text-[15px] font-bold text-ink">고쳐볼 만한 점</h2>
        <p className="text-[12.5px] text-warmgray">
          {scopeName(d.scope)} · 하루가 아니라 계속 반복되는 일이에요 · {PATTERN_PERIOD} · 위에서 고른 기간과 상관없어요
        </p>
      </div>
      {all.length === 0 ? (
        <p className="mt-3 rounded-xl bg-surface px-4 py-3 text-[13.5px] text-charcoal">최근 6개월 동안 계속 반복되는 큰 문제는 못 찾았어요.</p>
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
                {more ? '접기' : `${rest.length}개 더 보기`}
              </button>
            )}
            <p className="text-[12px] text-warmgray">금액은 실제로 난 차이이거나, 조건을 정해 계산해 본 값이에요. 이유까지 확인된 건 아니에요.</p>
          </div>
        </>
      )}
    </Card>
  )
}
