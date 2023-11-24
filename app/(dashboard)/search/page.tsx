'use client'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'

interface Chapter {
  number: number | any
  chapter_id: string | any
}

interface Line {
  id: string | any
  text: string | any
  chapters: Chapter | any
}

export default function page() {
  const searchRef = useRef<HTMLInputElement>(null!)
  const [lines, setLines] = useState<Line[]>(null!)

  async function handleSearch(term?: string) {
    const supabase = createClientComponentClient()
    const { data, error } = await supabase
      .from('lines')
      .select('id, text, chapters(number, chapter_id:id)')
      .textSearch('text', term || searchRef.current.value)

    if (data) {
      console.log(JSON.stringify(data[0]))
      setLines(data)
    }
  }

  useEffect(() => {
    // handleSearch('love')
    searchRef.current.focus()
  }, [])
  return (
    <div>
      <div className='p-4 mb-6 flex justify-center'>
        <input
          ref={searchRef}
          className='border bg-transparent p-2'
          type='text'
        />
        <button className='border p-2' onClick={() => handleSearch()}>
          search
        </button>
      </div>
      <section className='flex flex-col gap-2'>
        {lines &&
          lines.map(l => {
            return (
              <div className='flex gap-4 items-center py-4 border-b border-dotted border-gray-400'>
                <Link
                  className='text-2xl hover:text-orange-500 flex gap-2 flex-wrap items-center'
                  href={`/chapters/${
                    l.chapters.number
                  }?term=${searchRef.current.value.toLowerCase().trim()}`}
                >
                  <div className='text-lg'>{l.chapters.number}</div>
                  {String(l.text)
                    .split(' ')
                    .map(word => {
                      if (
                        word
                          .toLowerCase()
                          .includes(searchRef.current.value.toLowerCase())
                      ) {
                        return <span className=' text-orange-500'>{word}</span>
                      }
                      return <span>{word}</span>
                    })}
                </Link>
              </div>
            )
          })}
      </section>
    </div>
  )
}
