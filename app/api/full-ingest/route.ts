import { NextResponse } from 'next/server'
import { fetchPubMedArticles } from '@/lib/pubmed'
import { filterArticleWithGemini } from '@/lib/gemini'
import { supabaseAdmin } from '@/lib/supabase/server'

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
export async function GET() {
  try {
    const articles = await fetchPubMedArticles(60)

    const results = []

    for (const article of articles.slice(0, 5)) {
      // Skip duplicates BEFORE Gemini call
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

      const ai = await filterArticleWithGemini(
        article.title,
        article.journal ?? '',
        article.abstract ?? null
      )
        // Avoid Gemini free-tier rate limits
      await sleep(15000)
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
          selection_rationale: ai.selection_rationale,
          one_sentence_clinical_reason:
            ai.one_sentence_clinical_reason,
          status: 'PENDING'
        })
        .select()

      results.push({
        title: article.title,
        inserted: !error,
        error: error?.message ?? null,
        data
      })
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
        (r) => r.inserted === false &&
          r.error !== 'Already exists'
      ).length,
      results
    })
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: String(error)
      },
      {
        status: 500
      }
    )
  }
}