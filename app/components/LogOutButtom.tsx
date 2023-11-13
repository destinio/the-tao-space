'use client'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/navigation'

export default function LogOutButtom() {
  const router = useRouter()
  async function handleLogOut() {
    const supabase = createClientComponentClient()
    const { error } = await supabase.auth.signOut()

    if (error) {
      console.log(error)
    }

    if (!error) {
      router.refresh()
    }
  }

  return (
    <div
      onClick={handleLogOut}
      className='p-2 border-2 rounded hover:bg-white hover:text-black'
    >
      log out
    </div>
  )
}
