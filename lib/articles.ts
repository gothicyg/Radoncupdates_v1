import { supabaseAdmin } from '@/lib/supabase/server'

export async function getRecentArticles(limit = 20) {
  const { data, error } = await supabaseAdmin
    .from('articles')
    .select('*')
    .eq('status', 'APPROVED')
    .order('publication_date', { ascending: false })
    .limit(limit)

  if (error) {
    throw error
  }

  return data
}

export async function getArticlesByDiseaseSite(
  diseaseSite: string
) {
  const { data, error } = await supabaseAdmin
    .from('articles')
    .select('*')
    .eq('disease_site', diseaseSite)
    .eq('status', 'APPROVED')
    .order('publication_date', {
      ascending: false,
    })

  if (error) {
    throw error
  }

  return data
}