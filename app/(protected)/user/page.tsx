import { Database } from '@/supabase'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import Link from 'next/link'

export default async function UserPage() {
  const supabase = createServerComponentClient<Database>({ cookies })

  const {
    data: { session },
  } = await supabase.auth.getSession()

  const { data, error } = await supabase.from('favorites').select(`
    id, ...chapters(title, number) 
  `)

  if (!data) {
    return <h2>No chapters</h2>
  }

  return (
    <>
      <div>
        <section className='m-auto max-w-4xl p-8'>
          <h2>{session?.user.email}</h2>
        </section>
        <section className='m-auto max-w-4xl p-8'>
          <h3 className='text-3xl mb-4'>favorites</h3>
          <div className='flex flex-col'>
            {data.map(f => {
              return (
                <Link href={`/chapters/${String(f.number)}`} key={f.id}>
                  {f.title}
                </Link>
              )
            })}
          </div>
        </section>
      </div>
    </>
  )
}
