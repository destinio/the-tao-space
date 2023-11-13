import type { Metadata, ResolvingMetadata } from 'next'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

type Props = {
  params: { id: string }
  searchParams: { [key: string]: string | string[] | undefined }
}

export async function generateMetadata(
  { params, searchParams }: Props,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const id = params.id
  const supabase = createServerComponentClient({ cookies })
  const { data } = await supabase
    .from('chapters')
    .select('title')
    .eq('number', id)
    .single()
  return {
    title: `Tao Te Ching: Chapter ${data?.title}`,
  }
}

export default async function ChapterPage({
  params: { id },
}: {
  params: { id: string }
}) {
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
    .eq('number', id)
    .order('section_order', { foreignTable: 'sections' })
    .single()

  if (error) return <h2>No chapter with id {id}</h2>

  return (
    <>
      <header className='flex flex-col gap-4 border-b-2 py-4 mb-8 border-dotted'>
        <div className='flex gap-4 items-center'>
          <h3 className=' text-xl'>{chapter.number}</h3>
          <h2 className='text-2xl font-bold'>{chapter.title}</h2>
        </div>
        <nav className='flex gap-2'>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            fill='none'
            viewBox='0 0 24 24'
            strokeWidth={1.5}
            stroke='currentColor'
            className='w-6 h-6'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              d='M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z'
            />
          </svg>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            fill='none'
            viewBox='0 0 24 24'
            strokeWidth={1.5}
            stroke='currentColor'
            className='w-6 h-6'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              d='M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z'
            />
          </svg>
        </nav>
      </header>
      <div>
        {chapter.sections.map(s => {
          return (
            <p key={s.id} className='mb-8 text-lg'>
              {s.lines.map(l => {
                return (
                  <span key={l.id} className='block mb-2'>
                    {l.text}
                  </span>
                )
              })}
            </p>
          )
        })}
      </div>
    </>
  )
}
