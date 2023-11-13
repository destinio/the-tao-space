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
          <Link href={'/'}>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              fill='none'
              viewBox='0 0 24 24'
              strokeWidth={1.5}
              stroke='currentColor'
              className='w-6 h-6'
              aria-label='home'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                d='M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25'
              />
            </svg>
          </Link>
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
