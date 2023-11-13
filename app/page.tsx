import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import Link from 'next/link'

export default async function Home() {
  const supabase = createServerComponentClient({ cookies })

  const { data, error } = await supabase.from('chapters').select()

  if (error) return <h2>{error.message}</h2>
  return (
    <div>
      {data.map(c => {
        return (
          <div key={c.id}>
            <Link href={`/chapters/${c.id}`}>
              <h3>
                {c.number} - {c.title}
              </h3>
            </Link>
          </div>
        )
      })}
    </div>
  )
}
