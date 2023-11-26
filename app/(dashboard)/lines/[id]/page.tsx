import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import Link from 'next/link'

export default async function SectionPage({
  params,
}: {
  params: { id: string }
}) {
  const supabase = createServerComponentClient({ cookies })
  const { data: line, error } = await supabase
    .from('lines')
    .select('*, sections(order:section_order), chapters(*)')
    .eq('id', params.id)

  if (!line || error) {
    console.log(error)
    return <h2>No sections</h2>
  }

  console.log(line)

  return (
    <div>
      <header>
        <nav>
          <Link href={`/sections/${line[0].section_id}`}>back</Link>
        </nav>
        <h2 className='text-3xl my-4 pb-4 border-b-2 border-dotted'>
          Chapter {line[0].chapters.number} section {line[0].sections.order}{' '}
          line {line[0].line_order}
        </h2>
      </header>
      <section className='text-xl'>
        <h3>{line[0].text}</h3>
      </section>
    </div>
  )
}
