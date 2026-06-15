export interface Article {
  id: string
  title: string
  journal: string | null
  publication_date: string | null
  doi: string | null
  source_url: string | null
  disease_site: string
  article_type: string
  one_sentence_clinical_reason: string | null
  is_conference: boolean
  conference_name: string | null
  created_at: string
}