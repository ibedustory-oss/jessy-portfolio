'use client'

import { useEffect } from 'react'
import type { Lang } from '@/lib/content'

// Static export keeps a single root <html>; sync its lang attribute per locale.
export default function SetHtmlLang({ lang }: { lang: Lang }) {
  useEffect(() => {
    document.documentElement.lang = lang
  }, [lang])
  return null
}
