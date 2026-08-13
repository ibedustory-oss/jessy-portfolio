import Link from 'next/link'
import { CONTACT_EMAIL, type Dict, type Lang } from '@/lib/content'

export default function Footer({ lang, dict }: { lang: Lang; dict: Dict }) {
  return (
    <footer className="border-t border-line">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-5 py-10 md:flex-row md:items-end md:justify-between md:px-8">
        <div>
          <p className="text-sm font-semibold tracking-[0.18em]">JESSY JUNG</p>
          <p className="mt-2 text-xs text-warmgray">
            Independent Business &amp; Brand Builder — Strategy / Business / Brand / Web / Social
          </p>
        </div>
        <div className="flex flex-col gap-1 text-xs text-warmgray md:items-end">
          <a href={`mailto:${CONTACT_EMAIL}`} className="transition-colors hover:text-ink">
            {CONTACT_EMAIL}
          </a>
          <p>© {new Date().getFullYear()} Jessy (Giyoung) Jung</p>
        </div>
      </div>
    </footer>
  )
}
