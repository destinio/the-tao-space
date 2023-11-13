import Link from 'next/link'

export default function NavBar() {
  return (
    <div className='text-white bg-emerald-600 text-xl'>
      <div className='flex justify-between max-w-4xl p-4 m-auto'>
        <h1>Tao Space</h1>
        <nav className='flex gap-2'>
          <Link href={'/'}>home</Link>
          <Link href={'/chapters'}>chapters</Link>
        </nav>
      </div>
    </div>
  )
}
