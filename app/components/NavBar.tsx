import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import Link from 'next/link'
import LogOutButtom from './LogOutButtom'

export default async function NavBar() {
  const supabase = createServerComponentClient({ cookies })
  const { data, error } = await supabase.auth.getSession()

  if (error) {
    console.log(error)
  }

  return (
    <div className='text-white bg-emerald-600 text-xl'>
      <div className='flex justify-between items-center max-w-4xl p-2 px-8 m-auto'>
        <h1>Tao Space</h1>
        <nav className='flex gap-2 items-center'>
          <Link href={'/'}>home</Link>
          <Link href={'/chapters'}>chapters</Link>
          {data.session && <Link href={'/user'}>user</Link>}
          {!data.session ? (
            <Link
              href={'/login'}
              className='p-2 border-2 rounded hover:bg-white hover:text-black'
            >
              log in
            </Link>
          ) : (
            <LogOutButtom />
          )}
        </nav>
      </div>
    </div>
  )
}
