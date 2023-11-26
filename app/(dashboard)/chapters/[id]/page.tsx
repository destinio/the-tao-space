import type { Metadata } from 'next'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies, headers } from 'next/headers'
import ChapterHeader from './ChapterHeader'
import Link from 'next/link'

type Props = {
  params: { id: string }
  searchParams: { [key: string]: string | string[] | undefined }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const id = params.id
  const supabase = createServerComponentClient({ cookies })
  const { data } = await supabase
    .from('chapters')
    .select('number')
    .eq('number', id)
    .single()
  return {
    title: `Tao Te Ching: Chapter ${data?.number}`,
  }
}

export default async function ChapterPage({
  params: { id },
  searchParams,
}: {
  params: { id: string }
  searchParams: { term: string }
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
      <ChapterHeader
        id={chapter.id}
        title={chapter.title}
        number={chapter.number}
        session={!!session}
        fav_id={chapter.favorites.length ? chapter.favorites[0].id : null}
      />
      <div>
        {chapter.sections.map(s => {
          return (
            <p key={s.id} className='mb-6 text-2xl p-2 hover:bg-blue-950'>
              {s.lines.map(l => {
                return (
                  <Link
                    href={`/sections/${s.id}`}
                    key={l.id}
                    className='mb-4 flex flex-wrap gap-1'
                  >
                    {String(l.text)
                      .split(' ')
                      .map(word => {
                        if (
                          searchParams.term &&
                          word.toLowerCase().includes(searchParams.term)
                        ) {
                          return (
                            <span
                              key={`${l.id}:${word}:${l.line_order}`}
                              className=' text-orange-500'
                            >
                              {word}
                            </span>
                          )
                        }
                        return (
                          <span key={`${l.id}:${word}:${l.line_order}`}>
                            {word}
                          </span>
                        )
                      })}
                  </Link>
                )
              })}
            </p>
          )
        })}
      </div>
    </>
  )
}
