import { NextResponse } from 'next/server'
import { fetchPubMedArticles } from '@/lib/pubmed'
import { filterArticleWithGemini } from '@/lib/gemini'
import { supabaseAdmin } from '@/lib/supabase/server'

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

async function runGeminiWithRetry(
  title: string,
  journal: string,
  abstract: string | null
) {
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      return await filterArticleWithGemini(
        title,
        journal,
        abstract
      )
    } catch (error) {
      console.log(
        `Gemini attempt ${attempt} failed for: ${title}`
      )

      if (attempt === 3) {
        throw error
      }

      await sleep(10000)
    }
  }
}

export async function GET() {
  try {
    const articles = await fetchPubMedArticles(60)

    const results = []

    for (const article of articles.slice(0, 5)) {
      const existing = await supabaseAdmin
        .from('articles')
        .select('id')
        .eq('pmid', article.pmid)
        .maybeSingle()

      if (existing.data) {
        results.push({
          title: article.title,
          inserted: false,
          error: 'Already exists',
          data: null,
        })

        continue
      }

      try {
        const ai = await runGeminiWithRetry(
          article.title,
          article.journal ?? '',
          article.abstract ?? null
        )

        const { data, error } = await supabaseAdmin
          .from('articles')
          .insert({
            title: article.title,
            journal: article.journal,
            publication_date: article.publication_date,
            pmid: article.pmid,
            abstract: article.abstract,
            disease_site: ai.disease_site,
            article_type: ai.article_type,
            relevance_score: ai.relevance_score,
            confidence_score: ai.confidence_score,
            recommendation: ai.recommendation,
            high_priority: ai.relevance_score >= 9,
            selection_rationale: ai.selection_rationale,
            one_sentence_clinical_reason:
              ai.one_sentence_clinical_reason,
            status: 'PENDING',
          })
          .select()

        results.push({
          title: article.title,
          inserted: !error,
          error: error?.message ?? null,
          data,
        })

        await sleep(15000)
      } catch (error) {
        results.push({
          title: article.title,
          inserted: false,
          error: String(error),
          data: null,
        })
      }
    }

    return NextResponse.json({
      success: true,
      processed: results.length,
      inserted: results.filter(
        (r) => r.inserted === true
      ).length,
      duplicates: results.filter(
        (r) => r.error === 'Already exists'
      ).length,
      failed: results.filter(
        (r) =>
          r.inserted === false &&
          r.error !== 'Already exists'
      ).length,
      results,
    })
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: String(error),
      },
      {
        status: 500,
      }
    )
  }
}