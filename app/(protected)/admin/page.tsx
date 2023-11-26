import { createServerActionClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export default async function AdminPage() {
  const supabase = createServerActionClient({ cookies })
  const { data } = await supabase.auth.getUser()

  if (!data || data.user?.email !== 'dleeinc@gmail.com') {
    redirect('/')
  }

  return <>admin</>
}
