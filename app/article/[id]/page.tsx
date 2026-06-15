import Link from 'next/link'
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

  if (!article) notFound()

  return (
    <main className="min-h-screen bg-[#F7F8FA] text-black">
      <div className="max-w-3xl mx-auto px-6 py-12">

        <Link
          href="/"
          className="text-sm text-gray-500 hover:text-black"
        >
          ← Home
        </Link>

        <article className="mt-8">

          <h1 className="text-4xl font-bold leading-tight text-gray-900">
            {article.title}
          </h1>

          <div className="mt-4 text-gray-500">
            {article.journal}
            {article.publication_date &&
              ` • ${article.publication_date}`}
          </div>

          <div className="flex gap-5 mt-4 mb-10">
            <a
              href={`https://pubmed.ncbi.nlm.nih.gov/${article.pmid}/`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              PubMed
            </a>

            {article.doi && (
              <a
                href={`https://doi.org/${article.doi}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                DOI
              </a>
            )}
          </div>

          <div className="bg-white border rounded-xl p-8">
            <h2 className="text-xl font-semibold mb-5">
              Abstract
            </h2>

            <p className="leading-8 text-gray-700 whitespace-pre-wrap">
              {article.abstract || 'No abstract available'}
            </p>
          </div>

        </article>
      </div>
    </main>
  )
}