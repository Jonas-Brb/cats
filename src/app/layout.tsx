import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Script from 'next/script'
import './globals.css'
import Providers from './providers'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Cats - Infinite scroll of cat pictures',
  description: 'Infinite scroll of cat pictures',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <Script
          strategy="beforeInteractive"
          src="https://securepubads.g.doubleclick.net/tag/js/gpt.js"
        />
        <Script id="cats.gpt" strategy="beforeInteractive">
          {`
            window.googletag = window.googletag || { cmd: [] }
            googletag.cmd.push(() => {
              googletag.pubads().enableSingleRequest()
              googletag.enableServices()
            })

          `}
        </Script>
      </head>
      <body className={inter.className}>
        <main className="flex min-h-screen flex-col items-center justify-center gap-4 p-4">
          <Providers>{children}</Providers>
        </main>
      </body>
    </html>
  )
}
