import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import Link from 'next/link'

export default async function TagByIDPage({
  params,
}: {
  params: { id: string }
}) {
  const supabase = createServerComponentClient({ cookies })
  const { data: tags, error } = await supabase
    .from('user_tags')
    .select(
      `
    user_tag_id:id, ...tags(tag_id, tag_text), ...chapters(chapter_id:id, chapter_number:number)
  `,
    )
    .eq('tag_id', params.id)

  if (!tags) {
    console.log(error)
    return <h2>No tag info</h2>
  }
  return (
    <div className='m-auto max-w-4xl p-8'>
      <h2 className='text-3xl mb-8'>{tags[0].tag_text}</h2>
      <div className='flex gap-2'>
        {tags.map(t => {
          return (
            <Link
              key={t.tag_text}
              href={`/chapters/${t.chapter_number}`}
              className=' border-b-2 border-dotted text-2xl'
            >
              {t.chapter_number}
            </Link>
          )
        })}
      </div>
    </div>
  )
}
