'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { langs, langLabels, type Lang, type Dict } from '@/lib/content'

export default function Header({ lang, dict }: { lang: Lang; dict: Dict }) {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  // Preserve the current page when switching languages: /ja/work/x -> /ko/work/x
  const pathFor = (target: Lang) => {
    const segments = pathname.split('/').filter(Boolean)
    segments[0] = target
    return `/${segments.join('/')}/`.replace(/\/+$/, '/')
  }

  const rememberLang = (target: Lang) => {
    try {
      window.localStorage.setItem('lang', target)
    } catch {}
    setOpen(false)
  }

  const nav = [
    { label: dict.nav.services, href: `/${lang}/services/` },
    { label: dict.nav.work, href: `/${lang}/#work` },
    { label: dict.nav.about, href: `/${lang}/about/` },
  ]

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-4 pt-3 md:pt-4">
      <div className="mx-auto max-w-4xl">
        <div className="flex items-center justify-between gap-2 rounded-full bg-white/85 py-2 pl-5 pr-2 shadow-island ring-1 ring-ink/[0.06] backdrop-blur-xl">
          <Link
            href={`/${lang}/`}
            onClick={() => setOpen(false)}
            className="text-[15px] font-extrabold tracking-tight"
          >
            Jessy Jung
          </Link>

          <nav className="hidden items-center gap-1 md:flex">
            {nav.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="rounded-full px-3.5 py-1.5 text-sm font-medium text-charcoal transition-colors duration-200 hover:bg-surface hover:text-ink"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-1.5">
            <div className="hidden items-center rounded-full bg-surface p-0.5 text-[11px] font-semibold md:flex">
              {langs.map((l) => (
                <Link
                  key={l}
                  href={pathFor(l)}
                  onClick={() => rememberLang(l)}
                  aria-current={l === lang ? 'true' : undefined}
                  className={`rounded-full px-2.5 py-1 transition-colors duration-200 ${
                    l === lang
                      ? 'bg-white text-ink shadow-[0_1px_3px_rgba(25,31,40,0.12)]'
                      : 'text-warmgray hover:text-ink'
                  }`}
                >
                  {langLabels[l]}
                </Link>
              ))}
            </div>

            <Link
              href={`/${lang}/#contact`}
              onClick={() => setOpen(false)}
              className="hidden rounded-full bg-accent px-4 py-2 text-sm font-semibold text-white transition-[background-color,transform] duration-200 ease-swift hover:bg-accenthover active:scale-[0.97] md:inline-block"
            >
              {dict.nav.contact}
            </Link>

            <button
              type="button"
              aria-label="Menu"
              aria-expanded={open}
              onClick={() => setOpen((v) => !v)}
              className="flex h-9 w-9 flex-col items-center justify-center gap-[5px] rounded-full transition-colors hover:bg-surface active:scale-95 md:hidden"
            >
              <span
                className={`block h-[1.5px] w-4 rounded-full bg-ink transition-transform duration-300 ease-swift ${open ? 'translate-y-[3.25px] rotate-45' : ''}`}
              />
              <span
                className={`block h-[1.5px] w-4 rounded-full bg-ink transition-transform duration-300 ease-swift ${open ? '-translate-y-[3.25px] -rotate-45' : ''}`}
              />
            </button>
          </div>
        </div>

        {/* Mobile sheet, dropping from the island. */}
        <div
          className={`mt-2 origin-top overflow-hidden rounded-[24px] bg-white shadow-lift ring-1 ring-ink/[0.06] transition-all duration-300 ease-swift md:hidden ${
            open ? 'visible scale-100 opacity-100' : 'invisible scale-[0.97] opacity-0'
          }`}
        >
          <nav className="p-2">
            {nav.map((item, i) => (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => setOpen(false)}
                style={{ transitionDelay: open ? `${60 + i * 40}ms` : '0ms' }}
                className={`block rounded-2xl px-4 py-3.5 text-base font-semibold transition-all duration-300 ease-swift hover:bg-surface ${
                  open ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0'
                }`}
              >
                {item.label}
              </Link>
            ))}
            <Link
              href={`/${lang}/#contact`}
              onClick={() => setOpen(false)}
              style={{ transitionDelay: open ? '180ms' : '0ms' }}
              className={`mt-1 block rounded-2xl bg-accent px-4 py-3.5 text-center text-base font-semibold text-white transition-all duration-300 ease-swift active:scale-[0.99] ${
                open ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0'
              }`}
            >
              {dict.nav.contact}
            </Link>
          </nav>
          <div className="flex items-center justify-center gap-1 border-t border-line px-4 py-3">
            {langs.map((l) => (
              <Link
                key={l}
                href={pathFor(l)}
                onClick={() => rememberLang(l)}
                className={`rounded-full px-3 py-1 text-xs font-semibold ${
                  l === lang ? 'bg-surface text-ink' : 'text-warmgray'
                }`}
              >
                {langLabels[l]}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </header>
  )
}
