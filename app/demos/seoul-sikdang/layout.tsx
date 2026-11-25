import type { Metadata } from 'next'
import './demo.css'

export const metadata: Metadata = {
  title: '서울식당 파리 — 5개 지점 매출 브리핑 (데모)',
  description: '평소 쓰는 말로 비교 기준을 바꾸고, 지점별 기본값으로 저장하는 매출 분석 데모. 모든 지점과 수치는 가상입니다.',
  robots: { index: false, follow: false },
  openGraph: {
    title: '서울식당 파리 — 5개 지점 매출 브리핑 (데모)',
    description: '지난주 매출은 어땠지? 에서 다음 점장 회의 안건까지.',
    type: 'website',
    locale: 'ko_KR',
  },
}

export default function SalesDemoLayout({ children }: { children: React.ReactNode }) {
  return children
}
