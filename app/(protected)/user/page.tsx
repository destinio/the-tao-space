import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import Link from 'next/link'

export default async function UserPage() {
  const supabase = createServerComponentClient({ cookies })

  const { data: favorites, error } = await supabase.from('favorites').select(`
    id, ...chapters(title, number) 
  `)

  // const { data: favorites, error } = await supabase.from('favorites').select(
  //   `
  //   id, chapters(id, number, title)
  // `,
  // )

  console.log(favorites)

  if (!favorites) {
    return <h2>No chapters</h2>
  }

  return (
    <>
      <div className='m-auto max-w-4xl'>
        <h3>favorites</h3>
        <div>
          {favorites.map(f => {
            // return (
            //   <Link href={`/chapters/${String(f.chapters.number)}`} key={f.id}>
            //     {f.chapters.title}
            //   </Link>
            // )
            return <pre>{JSON.stringify(f, null, 2)}</pre>
          })}
        </div>
      </div>
    </>
  )
}
