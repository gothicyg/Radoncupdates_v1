import axios from 'axios'

function extractAbstract(xml: string, pmid: string): string | null {
  const articleMatch = xml.match(
    new RegExp(
      `<PubmedArticle>[\\s\\S]*?<PMID[^>]*>${pmid}</PMID>[\\s\\S]*?<Abstract>([\\s\\S]*?)</Abstract>[\\s\\S]*?</PubmedArticle>`
    )
  )

  if (!articleMatch) {
    return null
  }

  const abstractBlock = articleMatch[1]

  const textMatches = [
    ...abstractBlock.matchAll(
      /<AbstractText[^>]*>([\s\S]*?)<\/AbstractText>/g
    ),
  ]

  if (!textMatches.length) {
    return null
  }

  return textMatches
    .map((m) =>
      m[1]
        .replace(/<[^>]+>/g, '')
        .replace(/\s+/g, ' ')
        .trim()
    )
    .join(' ')
}

export async function fetchPubMedArticles(daysBack = 30) {
  const query =
      `(
    "int j radiat oncol biol phys"[journal]
    OR "radiother oncol"[journal]
    OR "pract radiat oncol"[journal]
    OR "j clin oncol"[journal]
    OR "lancet oncol"[journal]
  )
  AND
  (
    radiotherapy[Title/Abstract]
    OR radiation[Title/Abstract]
    OR SBRT[Title/Abstract]
    OR stereotactic[Title/Abstract]
    OR brachytherapy[Title/Abstract]
    OR IMRT[Title/Abstract]
    OR VMAT[Title/Abstract]
    OR proton[Title/Abstract]
    OR radiosurgery[Title/Abstract]
  )
  AND
  ("last ${daysBack} days"[dp])`
  const searchUrl =
    `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi` +
    `?db=pubmed&term=${encodeURIComponent(query)}` +
    `&retmax=10&retmode=json`

  const searchRes = await axios.get(searchUrl)

  const idList = searchRes.data.esearchresult.idlist

  if (!idList.length) {
    return []
  }

  const summaryUrl =
    `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi` +
    `?db=pubmed&id=${idList.join(',')}&retmode=json`

  const summaryRes = await axios.get(summaryUrl)

  const result = summaryRes.data.result

  const fetchUrl =
    `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi` +
    `?db=pubmed&id=${idList.join(',')}&retmode=xml`

  const fetchRes = await axios.get(fetchUrl)

  const xml = fetchRes.data

  const articles = []

  for (const id of idList) {
    const doc = result[id]

    if (!doc) continue
    articles.push({
      pmid: id,
      title: doc.title,
      journal: doc.fulljournalname,
      publication_date: doc.pubdate || null,
      abstract: extractAbstract(xml, id),

    })
  }

  return articles
}