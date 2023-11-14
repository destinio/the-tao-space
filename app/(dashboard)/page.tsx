import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { createKey } from 'next/dist/shared/lib/router/router'
import { cookies } from 'next/headers'
import Link from 'next/link'

export default async function Home() {
  const supabase = createServerComponentClient({ cookies })

  const { data, error } = await supabase.from('chapters').select(`
    *, favorites(id)
  `)

  if (error) return <h2>{error.message}</h2>
  return (
    <>
      <section className='m-auto max-w-2xl border-b-2 border-dotted p-4 pb-8'>
        <h2 className=' text-3xl mb-4'>Welcome</h2>
        <p>
          Embark on a journey of modern understanding and timeless wisdom with
          our living translation of the Tao Te Ching. Immerse yourself in the
          profound teachings of Lao Tzu, reimagined for today's world.
        </p>
      </section>
      <div className='flex justify-between items-center p-4 max-w-2xl m-auto'>
        <h3>Chapters</h3>
        <div className='flex items-center gap-2'>
          <span className=' text-yellow-400 text-4xl'>&#x2022;</span> favorites
        </div>
      </div>
      <div className='flex flex-row flex-wrap gap-6 text-2xl justify-center m-auto max-w-2xl'>
        {data.map(c => {
          return (
            <Link
              key={c.id}
              className={`${
                c.favorites.length > 0 && 'text-yellow-500'
              } underline underline-offset-4 decoration-dotted hover:text-green-500`}
              href={`/chapters/${c.number}`}
            >
              {String(c.number).padStart(2, '0')}
            </Link>
          )
        })}
      </div>
    </>
  )
}
