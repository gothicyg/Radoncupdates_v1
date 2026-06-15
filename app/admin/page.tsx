import AdminActions from './AdminActions'
import { supabaseAdmin } from '@/lib/supabase/server'

export default async function AdminPage() {
  const { data: articles } = await supabaseAdmin
    .from('articles')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <main className="min-h-screen bg-[#F7F8FA]">
      <div className="max-w-5xl mx-auto px-6 py-12">

        <h1 className="text-4xl font-bold mb-10">
          Editorial Dashboard
        </h1>

        <div className="space-y-6">
          {articles?.map((article) => (
            <div
              key={article.id}
              className="bg-white border rounded-xl p-6"
            >
              <h2 className="text-xl font-semibold mb-3">
                {article.title}
              </h2>

              <div className="grid grid-cols-2 gap-2 text-sm text-gray-600 mb-4">
                <div>Status: {article.status}</div>
                <div>Site: {article.disease_site}</div>
                <div>Type: {article.article_type}</div>
                <div>Score: {article.relevance_score}/10</div>
              </div>

              <div className="text-gray-700 mb-5">
                {article.selection_rationale}
              </div>

              <AdminActions id={article.id} />
            </div>
          ))}
        </div>

      </div>
    </main>
  )
}