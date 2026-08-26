import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import SetHtmlLang from '@/components/SetHtmlLang'
import { getDict, isLang, langs, type Lang } from '@/lib/content'

export function generateStaticParams() {
  return langs.map((lang) => ({ lang }))
}

export function generateMetadata({ params }: { params: { lang: string } }): Metadata {
  const lang = isLang(params.lang) ? params.lang : 'en'
  const dict = getDict(lang)
  return {
    title: dict.meta.title,
    description: dict.meta.description,
    alternates: {
      languages: {
        ja: '/ja/',
        ko: '/ko/',
        en: '/en/',
      },
    },
    openGraph: {
      title: dict.meta.title,
      description: dict.meta.description,
      type: 'website',
      locale: lang === 'ja' ? 'ja_JP' : lang === 'ko' ? 'ko_KR' : 'en_US',
      images: ['https://ibedustory-oss.github.io/jessy-portfolio/images/og-portfolio.jpg'],
    },
    twitter: { card: 'summary_large_image' },
  }
}

export default function LangLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: { lang: string }
}) {
  if (!isLang(params.lang)) notFound()
  const lang = params.lang as Lang
  const dict = getDict(lang)

  return (
    <>
      <SetHtmlLang lang={lang} />
      <Header lang={lang} dict={dict} />
      {children}
      <Footer lang={lang} dict={dict} />
    </>
  )
}
