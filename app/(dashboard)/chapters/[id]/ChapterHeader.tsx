'use client'

import FavButton from '@/app/components/FavButton'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { error } from 'console'
import Link from 'next/link'
import { useEffect, useState } from 'react'

interface Tag {
  user_tag_id: string
  tag_id: string
  tag_text: string
}

export default function ChapterHeader({
  id,
  title,
  number,
  session,
  fav_id,
}: {
  id: string
  title: string
  number: number
  session: boolean
  fav_id: string | null
}) {
  const [tags, setTags] = useState<any[]>(null!)

  async function getTags() {
    const supabase = createClientComponentClient()

    const { data, error: tags_error } = await supabase
      .from('user_tags')
      .select(`user_tag_id:id, tag_id, ...tags(tag_text)`)
      .eq('chapter_id', id)

    if (tags_error) {
      console.log(tags_error)
      return []
    }

    if (!tags_error) {
      setTags(data)
    }
  }

  useEffect(() => {
    getTags()
  }, [])

  return (
    <>
      <header className='flex flex-col gap-8 border-b-2 py-4 mb-8 border-dotted'>
        <div className='flex flex-col justify-center'>
          <div className='flex items-end gap-2 mb-2'>
            <h3 className=' text-xl'>{String(number).padStart(2, '0')}</h3>
            <h2 className='text-3xl font-bold'>{title}</h2>
          </div>
          {tags && tags?.length > 0 && (
            <div className='flex gap-2 flex-wrap'>
              {tags?.map(t => {
                return (
                  <Link
                    className='p-1 rounded-md bg-orange-600'
                    href={`/tags/${t.tag_id}`}
                    key={t.tag_id}
                  >
                    {t.tag_text}
                  </Link>
                )
              })}
            </div>
          )}
        </div>
        <nav className='flex gap-2 justify-between'>
          {/* PREV */}
          <Link href={`/chapters/${number - 1}`} title='Previous Chapter'>
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
            {session && <FavButton chapter_id={id} fav_id={fav_id} />}
            {/* TAG BUTTON */}
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
                d='M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z'
              />
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                d='M6 6h.008v.008H6V6z'
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
          </div>
          {/* NEXT */}
          <Link href={`/chapters/${number + 1}`} title='next Chapter'>
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
    </>
  )
}
