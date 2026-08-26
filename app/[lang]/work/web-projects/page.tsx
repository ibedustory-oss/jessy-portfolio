import Link from 'next/link'
import type { Metadata } from 'next'
import { getDict, isLang, langs, type Lang } from '@/lib/content'
import Redirect from './Redirect'

// The web service used to live here as a case study. It is its own page now
// (/[lang]/services/), so keep this URL alive for links already shared.
export function generateStaticParams() {
  return langs.map((lang) => ({ lang }))
}

export function generateMetadata({ params }: { params: { lang: string } }): Metadata {
  const lang = (isLang(params.lang) ? params.lang : 'en') as Lang
  return { title: getDict(lang).nav.services, robots: { index: false, follow: true } }
}

export default function MovedToServices({ params }: { params: { lang: string } }) {
  const lang = (isLang(params.lang) ? params.lang : 'en') as Lang
  const dict = getDict(lang)
  const href = `/${lang}/services/`

  return (
    <main className="flex min-h-screen items-center px-5 md:px-8">
      <Redirect href={href} />
      <div className="mx-auto w-full max-w-6xl">
        <Link href={href} className="group block max-w-xl rounded-[28px] bg-surface p-8">
          <p className="text-[13px] font-bold tracking-wide text-accent">301</p>
          <p className="mt-5 text-3xl font-extrabold tracking-tightest transition-colors group-hover:text-accent md:text-5xl">
            {dict.nav.services} →
          </p>
        </Link>
      </div>
    </main>
  )
}
