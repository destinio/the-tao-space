'use client'
import Link from 'next/link'
import { useRef, useState } from 'react'

interface AuthFormProps {
  handler: (e: string, p: string) => void
  buttonText?: string
}

export default function AuthForm({
  handler,
  buttonText = 'submit',
}: AuthFormProps) {
  const emailRef = useRef<HTMLInputElement>(null!)
  const passRef = useRef<HTMLInputElement>(null!)
  const [loading, setLoading] = useState(false)

  function handleClick() {
    handler(emailRef.current.value, passRef.current.value)

    setLoading(true)
    emailRef.current.value = ''
    passRef.current.value = ''
  }

  return (
    <>
      <div className='flex flex-col gap-4 mb-4'>
        <input
          className='border bg-transparent text-white p-2'
          ref={emailRef}
          type='email'
          placeholder='email'
        />
        <input
          ref={passRef}
          className='border bg-transparent text-white p-2'
          type='password'
          placeholder='password'
        />
      </div>
      <div className='flex gap-2'>
        <button
          className='border-white border-2 rounded p-2'
          onClick={handleClick}
          disabled={loading}
        >
          {!loading ? buttonText : '...'}
        </button>
        {buttonText === 'login' ? (
          <Link href={'/signup'} className='border-white border-2 rounded p-2'>
            sign up
          </Link>
        ) : (
          <Link href={'/login'} className='border-white border-2 rounded p-2'>
            login
          </Link>
        )}
      </div>
    </>
  )
}
