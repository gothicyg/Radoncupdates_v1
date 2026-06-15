import { supabaseAdmin } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const { data: article } = await supabaseAdmin
    .from('articles')
    .select('*')
    .eq('id', id)
    .single()

  if (!article) {
    notFound()
  }

  return (
    <main className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">
        {article.title}
      </h1>

      <div className="text-gray-500 mb-4">
        {article.journal}
        {article.publication_date &&
          ` • ${article.publication_date}`}
      </div>

      <div className="flex gap-4 mb-8">
        <a
          href={`https://pubmed.ncbi.nlm.nih.gov/${article.pmid}/`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500 hover:underline"
        >
          PubMed
        </a>

        {article.doi && (
          <a
            href={`https://doi.org/${article.doi}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:underline"
          >
            DOI
          </a>
        )}
      </div>

      <h2 className="text-xl font-semibold mb-3">
        Abstract
      </h2>

      <p className="leading-7 whitespace-pre-wrap">
        {article.abstract || 'No abstract available'}
      </p>
    </main>
  )
}