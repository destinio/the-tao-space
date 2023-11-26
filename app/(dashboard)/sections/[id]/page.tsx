import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import Link from 'next/link'

export default async function SectionPage({
  params,
}: {
  params: { id: string }
}) {
  const supabase = createServerComponentClient({ cookies })
  const { data: section, error } = await supabase
    .from('lines')
    .select('*, sections(order:section_order), chapters(*)')
    .eq('section_id', params.id)

  if (!section || error) {
    console.log(error)
    return <h2>No sections</h2>
  }

  return (
    <div>
      <header>
        <nav>
          <Link href={`/chapters/${section[0].chapters.number}`}>back</Link>
        </nav>
        <h2 className='text-3xl my-4 pb-4 border-b-2 border-dotted'>
          Chapter {section[0].chapters.number} section{' '}
          {section[0].sections.order}
        </h2>
      </header>
      <section className='text-xl'>
        {section.map(line => {
          console.log(line)
          return (
            <div key={line.id} className='mb-2'>
              <div>{line.text}</div>
            </div>
          )
        })}
      </section>
    </div>
  )
}
