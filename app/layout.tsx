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
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={sans.variable}>
      <body className="font-sans bg-paper text-ink">{children}</body>
    </html>
  )
}
