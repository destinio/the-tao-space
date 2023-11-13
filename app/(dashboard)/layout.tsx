import { ReactNode } from 'react'

export default function WelcomeLayout({ children }: { children: ReactNode }) {
  return <div className='m-auto max-w-4xl p-4'>{children}</div>
}
