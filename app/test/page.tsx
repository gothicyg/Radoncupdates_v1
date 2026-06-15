import { supabaseAdmin } from '@/lib/supabase/server'

export default async function TestPage() {
  const { data, error } = await supabaseAdmin
    .from('articles')
    .select('*')
    .limit(5)

  return (
    <pre>
      {JSON.stringify({ data, error }, null, 2)}
    </pre>
  )
}