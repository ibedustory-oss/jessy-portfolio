'use client'

import { useEffect } from 'react'
import { AskFab, Assistant, Guide, Toast } from './assistant'
import { DayCard, EvidenceCard } from './day'
import { FilterBar, Flags, Header, Kpis, PeriodCard } from './overview'
import { PatternsCard } from './patterns'
import { DemoProvider } from './store'

/**
 * 서울식당 파리 — 5개 지점 매출 브리핑 데모.
 * 한 페이지 안에 기간 실적 → 확인할 날 → 개선 기회 → 기간별 매출 → 선택일 상세 → 분석 근거가 이어지고,
 * PC에서는 오른쪽에, 모바일에서는 상세 바로 아래에 질문 패널이 놓인다.
 */
export default function DemoApp() {
  useEffect(() => {
    const prev = document.documentElement.lang
    document.documentElement.lang = 'ko'
    return () => {
      document.documentElement.lang = prev
    }
  }, [])

  return (
    <DemoProvider>
      <div className="sd-root min-h-screen bg-[#F4F5F7] text-ink">
        <a href="#sd-main" className="sr-only focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:z-50 focus:rounded-lg focus:bg-ink focus:px-3 focus:py-2 focus:text-white">
          본문으로 건너뛰기
        </a>
        <Header />
        <FilterBar />
        <main id="sd-main" className="mx-auto max-w-[1480px] px-4 pb-24 pt-4 lg:px-6 lg:pb-10">
          <Guide placement="top" />
          <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_380px] xl:grid-cols-[minmax(0,1fr)_408px]">
            <div className="min-w-0 lg:col-start-1">
              <Kpis />
            </div>
            <div className="min-w-0 lg:col-start-1">
              <Flags />
            </div>
            <div className="min-w-0 lg:col-start-1">
              <PatternsCard />
            </div>
            <div className="min-w-0 lg:col-start-1">
              <PeriodCard />
            </div>
            <div className="min-w-0 lg:col-start-1">
              <DayCard />
            </div>
            <div className="min-w-0 lg:col-start-2 lg:row-span-6 lg:row-start-1">
              <div className="lg:sticky lg:top-[68px] lg:h-[calc(100vh-84px)]">
                <Assistant />
              </div>
            </div>
            <div className="min-w-0 lg:col-start-1">
              <EvidenceCard />
            </div>
          </div>
          <p className="mt-6 text-center text-[12px] leading-5 text-warmgray">
            데모 데이터 · 모든 지점과 수치는 가상이에요 · AI 분석은 예시 응답입니다 · 실제 POS·외부 API와 연결돼 있지 않아요
          </p>
        </main>
        <AskFab />
        <Toast />
      </div>
    </DemoProvider>
  )
}
