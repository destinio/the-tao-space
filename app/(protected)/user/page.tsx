import { Database } from '@/supabase'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import Link from 'next/link'

export default async function UserPage() {
  const supabase = createServerComponentClient<Database>({ cookies })

  const { data, error } = await supabase.from('favorites').select(`
    id, ...chapters(title, number) 
  `)

  if (!data) {
    return <h2>No chapters</h2>
  }

  return (
    <>
      <div className='m-auto max-w-4xl'>
        <h3>favorites</h3>
        <div className='flex flex-col'>
          {data.map(f => {
            return (
              <Link href={`/chapters/${String(f.number)}`} key={f.id}>
                {f.title}
              </Link>
            )
          })}
        </div>
      </div>
    </>
  )
}
