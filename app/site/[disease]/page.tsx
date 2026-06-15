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
    <main className="p-8">
      <h1 className="text-3xl font-bold mb-6">
        {disease}
      </h1>

      <div className="space-y-4">
        {articles.map((article: any) => (
          <div
            key={article.id}
            className="border rounded p-4"
          >
            <h2 className="font-semibold">
              {article.title}
            </h2>
          </div>
        ))}
      </div>
    </main>
  )
}