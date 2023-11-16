'use client'

import FavButton from '@/app/components/FavButton'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'

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
  const [tagging, setTagging] = useState(false)
  const [tags, setTags] = useState<any[]>(null!)

  const newTagInputRef = useRef<HTMLInputElement>(null!)

  async function getTags() {
    const supabase = createClientComponentClient()

    const { data, error: tags_error } = await supabase
      .from('user_tags')
      .select(`user_tag_id:id, tag_id, ...tags(tag_text)`)
      .eq('chapter_id', id)

    if (tags_error) {
      return []
    }

    if (!tags_error) {
      setTags(data)
    }
  }

  useEffect(() => {
    getTags()
  }, [])

  function handleStartTagging() {
    setTagging(p => {
      setTimeout(() => {
        if (newTagInputRef.current) {
          newTagInputRef.current.focus()
        }
      }, 500)
      return !p
    })
  }

  function normalizeTage(tag: string) {
    return tag.toLowerCase().trim()
  }

  function isInCurrentTags(tag: string) {
    const tagNames = tags.map(t => t.tag_text)

    return tagNames.includes(tag)
  }

  async function handleAddNewTag() {
    const newTag = newTagInputRef.current.value

    if (newTag.length <= 0) {
      return
    }
    const normTag = normalizeTage(newTag)

    if (isInCurrentTags(normTag)) {
      return
    }

    const supabase = createClientComponentClient()

    const { data, error } = await supabase.from('tags').select()

    const tagExists = data?.find(t => t.tag_text === normTag)

    if (tagExists) {
      const { error } = await supabase.from('user_tags').insert({
        tag_id: tagExists.tag_id,
        chapter_id: id,
      })

      if (error) {
        console.log(error)
        return
      }

      setTags(p => [...p, tagExists])
      return
    }

    if (!tagExists) {
      const { data, error } = await supabase
        .from('tags')
        .insert({ tag_text: normTag })
        .select()

      if (data) {
        const newT = data[0]
        const { tag_id } = newT

        const { data: ntt } = await supabase
          .from('user_tags')
          .insert({ chapter_id: id, tag_id })
          .select(`user_tag_id:id, tag_id, ...tags(tag_text)`)

        if (ntt) {
          setTags(p => [...p, ntt[0]])
          newTagInputRef.current.value = ''

          return
        }

        return
      }
    }
  }

  async function handleDeleteTag(id: string) {
    const supabase = createClientComponentClient()
    const { data, error } = await supabase
      .from('user_tags')
      .delete()
      .eq('id', id)
      .select()

    if (error) {
      console.error(error)
      return
    }

    if (data) {
      setTags(p => {
        return p.filter(t => {
          return t.user_tag_id !== data[0].id
        })
      })
    }
  }

  return (
    <>
      <header className='flex flex-col gap-8 border-b-2 py-4 mb-8 border-dotted'>
        <div className='flex flex-col justify-center'>
          <div className='flex items-end gap-2 mb-4'>
            <h3 className=' text-xl'>{String(number).padStart(2, '0')}</h3>
            <h2 className='text-3xl font-bold'>{title}</h2>
          </div>
          {session && tags && tags?.length > 0 && (
            <div className='flex gap-2 flex-wrap'>
              {tags?.map(t => {
                return (
                  <div key={t.tag_id} className='flex'>
                    {tagging && (
                      <button
                        className='pr-2 text-red-500'
                        title={`Delete tag: ${t.tag_text}`}
                        onClick={() => handleDeleteTag(t.user_tag_id)}
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
                            d='M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0'
                          />
                        </svg>
                      </button>
                    )}
                    <Link
                      className='p-1 rounded-md bg-orange-600'
                      href={`/tags/${t.tag_id}`}
                    >
                      {t.tag_text}
                    </Link>
                  </div>
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
            {session && (
              <svg
                xmlns='http://www.w3.org/2000/svg'
                fill='none'
                viewBox='0 0 24 24'
                strokeWidth={1.5}
                stroke='currentColor'
                className={`w-6 h-6 hover:text-yellow-400 ${
                  tagging && 'text-green-400'
                }`}
                aria-label='tag chapter'
                role='button'
                onClick={handleStartTagging}
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
        {tagging && (
          <div className='px-8 flex justify-center gap-2'>
            <input
              type='text'
              ref={newTagInputRef}
              className=' bg-transparent border border-green-400 rounded text-white p-2'
            />
            <button
              className=' border border-green-400 p-2 rounded text-2xl px-4'
              aria-label='submit new todo'
              onClick={handleAddNewTag}
            >
              +
            </button>
          </div>
        )}
      </header>
    </>
  )
}
