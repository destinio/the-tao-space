export const dynamic = 'force-dynamic'

import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

export default async function ChapterPage({
  params: { id },
}: {
  params: { id: string }
}) {
  console.log(id)
  const supabase = createServerComponentClient({ cookies })
  const { data: chapter, error } = await supabase
    .from('chapters')
    .select(
      `
      id,
      title,
      number,
      sections(id, section_order, lines(id, line_order, text)) 
    `,
    )
    .eq('id', id)
    .order('section_order', { foreignTable: 'sections' })
    .single()

  if (error) return <h2>No chapter with id {id}</h2>

  return (
    <>
      <header className='flex gap-2 py-4'>
        <h3 className=' text-xl'>{chapter.number}</h3>
        <h2 className='text-2xl font-bold'>{chapter.title}</h2>
      </header>
      <div>
        {chapter.sections.map(s => {
          return (
            <p key={s.id} className='mb-4 text-lg'>
              {s.lines.map(l => {
                return <span className='block'>{l.text}</span>
              })}
            </p>
          )
        })}
      </div>
    </>
  )
}
