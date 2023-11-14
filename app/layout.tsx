import type { Metadata } from 'next'
import { Open_Sans } from 'next/font/google'
import './globals.css'
import NavBar from './components/NavBar'

const inter = Open_Sans({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'My Tao Blog',
  description:
    "Embark on a journey of modern understanding and timeless wisdom with our living translation of the Tao Te Ching. Immerse yourself in the profound teachings of Lao Tzu, reimagined for today's world.",
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
