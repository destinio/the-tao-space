'use client'
import AuthForm from '@/app/components/AuthForm'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const router = useRouter()

  async function handleSignUp(email: string, password: string) {
    const supabase = createClientComponentClient()
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      console.log(error)
      router.push('/signup')
    }

    if (!error) {
      router.push('/chapters')
    }
  }
  return (
    <div>
      <div className='m-auto max-w-4xl p-4'>
        <h2 className='text-4xl mb-4'>Login</h2>
        <AuthForm handler={handleSignUp} buttonText='login' />
      </div>
    </div>
  )
}
