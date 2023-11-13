import type { Metadata } from 'next'
import { Open_Sans } from 'next/font/google'
import './globals.css'
import NavBar from './components/NavBar'

const inter = Open_Sans({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Tao Space',
  description: 'A modern translation of the Tao Te Ching',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang='en'>
      <body className={`${inter.className} bg-slate-900 text-white`}>
        <NavBar />
        {children}
      </body>
    </html>
  )
}
