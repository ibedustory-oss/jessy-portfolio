import type { Metadata } from 'next'
import './demo.css'

export const metadata: Metadata = {
  title: '서울식당 파리 — 5개 지점 매출 한눈에 보기 (데모)',
  description: '평소 말하듯 물어보면 매출이 왜 달랐는지, 어디를 고치면 좋을지 알려 주는 데모예요. 지점과 숫자는 모두 지어낸 거예요.',
  robots: { index: false, follow: false },
  openGraph: {
    title: '서울식당 파리 — 5개 지점 매출 한눈에 보기 (데모)',
    description: '지난주 매출은 어땠지? 부터 다음 회의 때 물어볼 것까지.',
    type: 'website',
    locale: 'ko_KR',
  },
}

export default function SalesDemoLayout({ children }: { children: React.ReactNode }) {
  return children
}
