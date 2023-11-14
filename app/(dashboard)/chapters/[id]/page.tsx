import type { Metadata, ResolvingMetadata } from 'next'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import FavButton from '@/app/components/FavButton'
import Link from 'next/link'
import ChapterHeader from './ChapterHeader'

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
    .select('number')
    .eq('number', id)
    .single()
  return {
    title: `Tao Te Ching: Chapter ${data?.number}`,
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

  const { data: tags, error: tags_error } = await supabase
    .from('user_tags')
    .select(`user_tag_id:id, tag_id, ...tags(tag_text)`)
    .eq('chapter_id', chapter?.id)

  console.log(tags)

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
