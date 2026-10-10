import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Inter, Geist_Mono } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin', 'latin-ext'], variable: '--font-inter' })
const geistMono = Geist_Mono({ subsets: ['latin'], variable: '--font-geist-mono' })

export const metadata: Metadata = {
  title: 'Meikai Digital — Uygulama, Oyun, Reklam ve Tasarım Stüdyosu',
  description:
    'Meikai Digital; mobil uygulamalar, oyunlar, reklam kampanyaları ve marka tasarımları üreten çok yönlü bir dijital stüdyodur.',
  generator: 'v0.app',
  icons: {
    icon: '/images/meikai-logo.jpeg',
    apple: '/images/meikai-logo.jpeg',
  },
}

export const viewport: Viewport = {
  colorScheme: 'dark',
  themeColor: '#0e0e0e',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="tr" className={`${inter.variable} ${geistMono.variable} bg-background`}>
      <body className="antialiased">
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
