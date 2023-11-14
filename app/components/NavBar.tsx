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
        <h1>My Tao Blog</h1>
        <nav className='flex gap-2 items-center'>
          <Link href={'/'} title='home'>
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
          {data.session && (
            <Link href={'/user'} title='user info'>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                viewBox='0 0 24 24'
                fill='currentColor'
                className='w-6 h-6'
              >
                <path
                  fillRule='evenodd'
                  d='M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z'
                  clipRule='evenodd'
                />
              </svg>
            </Link>
          )}
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
