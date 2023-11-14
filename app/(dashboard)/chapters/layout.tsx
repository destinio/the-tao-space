import { ReactNode } from 'react'

export default function ChaptersLayout({ children }: { children: ReactNode }) {
  return (
    <div>
      <div className='m-auto max-w-4xl pt-2 px-4'>{children}</div>
    </div>
  )
}
