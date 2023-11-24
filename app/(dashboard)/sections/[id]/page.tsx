import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

export default async function SectionPage({
  params,
}: {
  params: { id: string }
}) {
  const supabase = createServerComponentClient({ cookies })
  const { data, error } = await supabase
    .from('lines')
    .select('*')
    .eq('section_id', params.id)

  console.log(data)

  return <>{params.id}</>
}
