'use client'
import AuthForm from '@/app/components/AuthForm'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/navigation'

export default function SignUpPage() {
  const router = useRouter()
  async function handleSignUp(email: string, password: string) {
    const supabase = createClientComponentClient()
    const { error } = await supabase.auth.signUp({ email, password })

    if (error) {
      console.log(error)
    }

    if (!error) {
      router.push('/verify')
    }
  }
  return (
    <div>
      <div className='m-auto max-w-4xl'>
        <h2>Sign Up</h2>
        <AuthForm handler={handleSignUp} buttonText='sign up' />
      </div>
    </div>
  )
}
