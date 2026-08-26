import type { Metadata } from 'next'
import ServiceLayout from '@/components/ServiceLayout'
import { getDict, isLang, langs, type Lang } from '@/lib/content'
import { SERVICE } from '@/lib/service'

export function generateStaticParams() {
  return langs.map((lang) => ({ lang }))
}

export function generateMetadata({ params }: { params: { lang: string } }): Metadata {
  const lang = (isLang(params.lang) ? params.lang : 'en') as Lang
  const dict = getDict(lang)
  const s = SERVICE[lang]
  return {
    title: `${dict.nav.services} — ${dict.meta.title}`,
    description: s.sub,
    alternates: {
      languages: { ja: '/ja/services/', ko: '/ko/services/', en: '/en/services/' },
    },
  }
}

export default function Services({ params }: { params: { lang: string } }) {
  const lang = (isLang(params.lang) ? params.lang : 'en') as Lang
  return (
    <main className="pt-14 md:pt-16">
      <ServiceLayout lang={lang} />
    </main>
  )
}
