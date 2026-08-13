'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { isLang } from '@/lib/content'

/**
 * Root entry — detects the visitor's language once and redirects.
 * Saved choice (localStorage) wins over browser language.
 */
export default function RootRedirect() {
  const router = useRouter()

  useEffect(() => {
    const saved = window.localStorage.getItem('lang')
    if (saved && isLang(saved)) {
      router.replace(`/${saved}/`)
      return
    }
    const browser = (navigator.language || 'en').toLowerCase()
    const lang = browser.startsWith('ja') ? 'ja' : browser.startsWith('ko') ? 'ko' : 'en'
    router.replace(`/${lang}/`)
  }, [router])

  return (
    <main className="flex min-h-screen items-center justify-center">
      <p className="text-xs uppercase tracking-[0.3em] text-warmgray">JESSY JUNG</p>
    </main>
  )
}
