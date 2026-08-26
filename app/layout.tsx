import type { Metadata } from 'next'
import { Plus_Jakarta_Sans } from 'next/font/google'
import './globals.css'

const sans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-sans',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Jessy (Giyoung) Jung — Independent Business & Brand Builder',
  description:
    'Business development, branding, web and social strategy by Jessy (Giyoung) Jung, U.S. CPA.',
  openGraph: {
    title: 'Jessy Jung — First the why. Then the website.',
    description: 'Strategy, brand, web and social. 한국어 · 日本語 · English · Français.',
    images: ['https://ibedustory-oss.github.io/jessy-portfolio/images/og-portfolio.jpg'],
    type: 'website',
  },
  twitter: { card: 'summary_large_image' },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={sans.variable}>
      <body className="font-sans bg-paper text-ink">{children}</body>
    </html>
  )
}
