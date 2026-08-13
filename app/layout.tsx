import type { Metadata } from 'next'
import { Inter_Tight, Instrument_Serif } from 'next/font/google'
import './globals.css'

const sans = Inter_Tight({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-sans',
  display: 'swap',
})

const serif = Instrument_Serif({
  subsets: ['latin'],
  weight: '400',
  style: ['normal', 'italic'],
  variable: '--font-serif',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Jessy (Giyoung) Jung — Independent Business & Brand Builder',
  description:
    'Business development, branding, web and social strategy by Jessy (Giyoung) Jung, U.S. CPA.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${sans.variable} ${serif.variable}`}>
      <body className="font-sans bg-paper text-ink">{children}</body>
    </html>
  )
}
