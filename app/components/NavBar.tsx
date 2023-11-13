import Link from 'next/link'

export default function NavBar() {
  return (
    <div className='flex justify-between p-4 bg-blue-700 text-white'>
      <h1>Tao Space</h1>
      <nav className='flex gap-2'>
        <Link href={'/'}>home</Link>
        <Link href={'/chapters'}>chapters</Link>
      </nav>
    </div>
  )
}
