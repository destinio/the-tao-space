import { Database } from '@/supabase'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import Link from 'next/link'

export default async function UserPage() {
  const supabase = createServerComponentClient<Database>({ cookies })

  const {
    data: { session },
  } = await supabase.auth.getSession()

  const { data: chapters, error } = await supabase.from('favorites').select(`
    id, ...chapters(title, number) 
  `)

  const { data: tags } = await supabase.from('user_tags').select(`
    id, ...tags(tag_id, tag_text)
  `)

  let ordered_tags: any[] = []

  let uniq = new Set()

  tags?.forEach(t => {
    if (!uniq.has(t.tag_text)) {
      uniq.add(t.tag_text)
      ordered_tags.push(t)
    }
  })

  if (!chapters) {
    return <h2>No chapters</h2>
  }

  return (
    <>
      <div>
        <section className='m-auto max-w-4xl p-8'>
          <h2>{session?.user.email}</h2>
        </section>

        <section className='m-auto max-w-4xl p-8'>
          <h3 className='text-3xl mb-4 flex-wrap'>Tags</h3>
          <div className='flex gap-2 flex-wrap'>
            {ordered_tags
              ?.sort((a, b) => a.tag_text.localeCompare(b.tag_text))
              .map(t => {
                return (
                  <Link
                    href={`/tags/${t.tag_id}`}
                    className='p-2 bg-orange-600 rounded-md'
                    key={t.tag_text}
                  >
                    {t.tag_text}
                  </Link>
                )
              })}
          </div>
        </section>
        <section className='m-auto max-w-4xl p-8'>
          <h3 className='text-3xl mb-4'>favorites</h3>
          <div className='flex flex-wrap gap-2'>
            {chapters
              .sort((a, b) => a.number - b.number)
              .map(f => {
                return (
                  <Link
                    className='text-xl border-b border-dotted'
                    href={`/chapters/${String(f.number)}`}
                    key={f.id}
                  >
                    {String(f.number).padStart(2, '0')}
                  </Link>
                )
              })}
          </div>
        </section>
      </div>
    </>
  )
}
