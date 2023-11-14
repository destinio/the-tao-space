import type { Metadata, ResolvingMetadata } from 'next'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import FavButton from '@/app/components/FavButton'
import Link from 'next/link'

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
  const {
    data: { session },
  } = await supabase.auth.getSession()
  const { data: chapter, error } = await supabase
    .from('chapters')
    .select(
      `
      id,
      title,
      number,
      sections(id, section_order, lines(id, line_order, text)),
      favorites(id) 
    `,
    )
    .eq('number', id)
    .order('section_order', { foreignTable: 'sections' })
    .single()

  if (error) return <h2>No chapter with id {id}</h2>

  return (
    <>
      <header className='flex flex-col gap-8 border-b-2 py-4 mb-8 border-dotted'>
        <div className='flex gap-4 items-end'>
          <h3 className=' text-xl'>
            {String(chapter.number).padStart(2, '0')}
          </h3>
          <h2 className='text-3xl font-bold'>{chapter.title}</h2>
        </div>
        <nav className='flex gap-2 justify-between'>
          {/* PREV */}
          <Link
            href={`/chapters/${chapter?.number - 1}`}
            title='Previous Chapter'
          >
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
                d='M19.5 12h-15m0 0l6.75 6.75M4.5 12l6.75-6.75'
              />
            </svg>
          </Link>
          <div className='flex gap-2'>
            {session && (
              <FavButton
                chapter_id={chapter.id}
                fav_id={
                  chapter.favorites.length === 0
                    ? null
                    : chapter.favorites[0].id
                }
              />
            )}
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
          </div>
          {/* NEXT */}
          <Link href={`/chapters/${chapter.number + 1}`} title='next Chapter'>
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
                d='M4.5 12h15m0 0l-6.75-6.75M19.5 12l-6.75 6.75'
              />
            </svg>
          </Link>
        </nav>
      </header>
      <div>
        {chapter.sections.map(s => {
          return (
            <p key={s.id} className=' mb-12 text-2xl'>
              {s.lines.map(l => {
                return (
                  <span key={l.id} className='block mb-4'>
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
