import Link from 'next/link'
import { getRecentArticles } from '@/lib/articles'

export default async function HomePage() {
  const articles = await getRecentArticles()

  return (
    <main className="min-h-screen bg-[#F7F8FA]" style={{ fontFamily: "'Inter', sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=DM+Serif+Display&display=swap" rel="stylesheet" />

      <div className="max-w-4xl mx-auto px-6 py-12">

        <div className="mb-10 border-b border-gray-200 pb-8">
          <h1 style={{ fontFamily: "'DM Serif Display', serif" }} className="text-5xl text-gray-900 tracking-tight mb-2">
            Radiation Oncology Signals
          </h1>
          <p className="text-gray-400 text-sm font-medium tracking-widest uppercase">
            Curated literature · Updated weekly
          </p>
        </div>

        <div className="flex flex-wrap gap-2 mb-10">
          {[
            'Breast', 'GU', 'GI', 'Thoracic', 'Head and Neck',
            'Gynecologic', 'CNS', 'Pediatrics', 'Hematologic', 'Miscellaneous',
          ].map((site) => (
            <Link
              key={site}
              href={`/site/${encodeURIComponent(site)}`}
              className="text-xs font-semibold text-gray-500 hover:text-gray-900 tracking-wide uppercase transition-colors"
            >
              {site}
            </Link>
          ))}
        </div>

        <div className="space-y-5">
          {articles.map((article: any) => (
            <div key={article.id} className="group">
              <Link
                href={`/article/${article.id}`}
                className="text-lg font-semibold text-gray-900 leading-snug group-hover:text-blue-700 transition-colors"
              >
                {article.title}
              </Link>
              <div className="text-sm text-gray-400 mt-1 flex items-center gap-2">
                <span>{article.journal}</span>
                {article.publication_date && (
                  <><span className="text-gray-200">·</span><span>{article.publication_date}</span></>
                )}
                <span className="text-gray-200">·</span>
                <a href={`https://pubmed.ncbi.nlm.nih.gov/${article.pmid}/`} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-600 transition-colors">PubMed</a>
                {article.doi && (
                  <><span className="text-gray-200">·</span><a href={`https://doi.org/${article.doi}`} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-600 transition-colors">DOI</a></>
                )}
              </div>
            </div>
          ))}
        </div>

      </div>
    </main>
  )
}