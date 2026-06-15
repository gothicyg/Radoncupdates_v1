import AdminActions from './AdminActions'
import { supabaseAdmin } from '@/lib/supabase/server'

export default async function AdminPage() {
  const { data: articles } = await supabaseAdmin
    .from('articles')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <main className="p-8">
      <h1 className="text-3xl font-bold mb-6">
        Admin Dashboard
      </h1>

      <div className="space-y-4">
        {articles?.map((article) => (
          <div
            key={article.id}
            className="border rounded p-4"
          >
            <h2 className="font-semibold">
              {article.title}
            </h2>

            <div>Status: {article.status}</div>

            <div>
              Disease Site: {article.disease_site}
            </div>

            <div>
              Recommendation:
              {' '}
              {article.recommendation}
            </div>

            <div>
              Relevance:
              {' '}
              {article.relevance_score}
            </div>
            <AdminActions id={article.id} />
          </div>
        ))}
      </div>
    </main>
  )
}