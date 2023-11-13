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
      <header className='flex gap-4 mt-4 mb-8 pb-4 items-end border-b-2 border-dotted'>
        <h3 className=' text-xl'>{chapter.number}</h3>
        <h2 className='text-2xl font-bold'>{chapter.title}</h2>
      </header>
      <div>
        {chapter.sections.map(s => {
          return (
            <p key={s.id} className='mb-8 text-lg'>
              {s.lines.map(l => {
                return <span className='block mb-2'>{l.text}</span>
              })}
            </p>
          )
        })}
      </div>
    </>
  )
}
