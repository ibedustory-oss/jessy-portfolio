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
    { label: dict.nav.work, href: `/${lang}/#work` },
    { label: dict.nav.services, href: `/${lang}/#services` },
    { label: dict.nav.about, href: `/${lang}/#about` },
    { label: dict.nav.contact, href: `/${lang}/#contact` },
  ]

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-line bg-paper/90 backdrop-blur-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4 md:px-8">
        <Link
          href={`/${lang}/`}
          onClick={() => setOpen(false)}
          className="text-sm font-semibold tracking-[0.18em]"
        >
          JESSY JUNG
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {nav.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="text-sm text-charcoal transition-colors hover:text-accent"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-xs tracking-[0.08em]">
            {langs.map((l, i) => (
              <span key={l} className="flex items-center gap-2">
                {i > 0 && <span className="text-line">/</span>}
                <Link
                  href={pathFor(l)}
                  onClick={() => rememberLang(l)}
                  aria-current={l === lang ? 'true' : undefined}
                  className={
                    l === lang
                      ? 'font-semibold text-ink underline underline-offset-4'
                      : 'text-warmgray transition-colors hover:text-ink'
                  }
                >
                  {langLabels[l]}
                </Link>
              </span>
            ))}
          </div>

          <button
            type="button"
            aria-label="Menu"
            onClick={() => setOpen((v) => !v)}
            className="flex h-8 w-8 flex-col items-center justify-center gap-1.5 md:hidden"
          >
            <span
              className={`block h-px w-5 bg-ink transition-transform ${open ? 'translate-y-[3.5px] rotate-45' : ''}`}
            />
            <span
              className={`block h-px w-5 bg-ink transition-transform ${open ? '-translate-y-[3.5px] -rotate-45' : ''}`}
            />
          </button>
        </div>
      </div>

      {open && (
        <nav className="border-t border-line bg-paper md:hidden">
          {nav.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              onClick={() => setOpen(false)}
              className="block border-b border-line px-5 py-4 text-lg tracking-tight"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  )
}
