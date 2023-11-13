import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { ReactNode } from 'react'

export default async function AuthLayout({
  children,
}: {
  children: ReactNode
}) {
  const supabase = createServerComponentClient({ cookies })
  const { data } = await supabase.auth.getSession()

  if (data.session) {
    redirect('/')
  }

  return <div className=''>{children}</div>
}
