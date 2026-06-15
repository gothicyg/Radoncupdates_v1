import Link from 'next/link'
import { getArticlesByDiseaseSite } from '@/lib/articles'

export default async function DiseasePage({
  params,
}: {
  params: Promise<{ disease: string }>
}) {
  const { disease } = await params

  const articles = await getArticlesByDiseaseSite(
    decodeURIComponent(disease)
  )

  return (
    <main className="min-h-screen bg-[#F7F8FA]">
      <div className="max-w-3xl mx-auto px-6 py-12">

        <Link
          href="/"
          className="text-sm text-gray-500 hover:text-black"
        >
          ← Home
        </Link>

        <h1 className="text-4xl font-bold mt-6 mb-10">
          {disease}
        </h1>

        <div className="space-y-6">
          {articles.map((article: any) => (
            <div
              key={article.id}
              className="bg-white border rounded-xl p-5"
            >
              <Link
                href={`/article/${article.id}`}
                className="text-lg font-semibold hover:text-blue-600"
              >
                {article.title}
              </Link>

              <div className="text-sm text-gray-500 mt-2">
                {article.journal}
              </div>
            </div>
          ))}
        </div>

      </div>
    </main>
  )
}