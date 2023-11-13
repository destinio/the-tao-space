import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import Link from 'next/link'

export default async function Home() {
  const supabase = createServerComponentClient({ cookies })

  const { data, error } = await supabase.from('chapters').select()

  if (error) return <h2>{error.message}</h2>
  return (
    <div className='flex flex-row flex-wrap gap-6 text-2xl justify-center pt-8'>
      {data.map(c => {
        return (
          <Link
            key={c.id}
            className='underline underline-offset-4 decoration-dotted'
            href={`/chapters/${c.id}`}
          >
            {String(c.number).padStart(2, '0')}
          </Link>
        )
      })}
    </div>
  )
}
