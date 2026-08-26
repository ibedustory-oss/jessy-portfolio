import { CONTACT_EMAIL, type Dict, type Lang } from '@/lib/content'

export default function Footer({ lang, dict }: { lang: Lang; dict: Dict }) {
  return (
    <footer className="px-4 pb-6 pt-4">
      <div className="mx-auto max-w-6xl rounded-[28px] bg-surface px-7 py-10 md:px-12">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-base font-extrabold tracking-tight">Jessy Jung</p>
            <p className="mt-2 max-w-xs text-[13px] leading-relaxed text-warmgray">
              Independent Business &amp; Brand Builder — Strategy / Business / Brand / Web / Social
            </p>
          </div>
          <div className="flex flex-col gap-1.5 text-[13px] md:items-end">
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="font-semibold text-charcoal transition-colors hover:text-accent"
            >
              {CONTACT_EMAIL}
            </a>
            <p className="text-warmgray">© {new Date().getFullYear()} Jessy (Giyoung) Jung</p>
          </div>
        </div>
      </div>
    </footer>
  )
}
