import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

const schema = {
  type: "OBJECT",
  properties: {
    relevance_score: { type: "INTEGER", minimum: 1, maximum: 10 },
    confidence_score: { type: "INTEGER", minimum: 1, maximum: 10 },
    article_type: { type: "STRING", enum: ["Guideline", "Phase III Trial", "Phase II Trial", "Meta-analysis", "Systematic Review", "Retrospective Study", "Conference Abstract", "Technology / AI", "Consensus Statement", "Other"] },
    disease_site: { type: "STRING", enum: ["Breast", "Lung / Thoracic", "GI", "GU", "Gynecologic", "CNS", "Head and Neck", "Pediatrics", "Hematologic", "Miscellaneous"] },
    recommendation: { type: "STRING", enum: ["INCLUDE", "REVIEW", "REJECT"] },
    selection_rationale: { type: "STRING" },
    one_sentence_clinical_reason: { type: "STRING" }
  },
  required: ["relevance_score", "confidence_score", "article_type", "disease_site", "recommendation", "selection_rationale", "one_sentence_clinical_reason"]
}

export async function filterArticleWithGemini(title: string, journal: string, abstract: string | null, isConference = false) {
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" })

  const prompt = `
You are an experienced radiation oncologist serving as editor of a literature signal service.

Your task is NOT to summarize.

Your task is to determine whether a practicing radiation oncologist would want this paper highlighted in a weekly update.

SCORING RULES

10:
Practice-changing randomized evidence.

9:
Major guideline, phase III trial, landmark update.

8:
Strong prospective data likely to influence practice.

7:
Important findings that many radiation oncologists should know.

6:
Interesting but unlikely to change practice.

5:
Niche information.

4:
Low clinical importance.

1-3:
Not useful to practicing radiation oncologists.

AUTOMATIC REJECT:

- Workforce studies
- Healthcare infrastructure
- Country-specific service reports
- Crowdfunding
- Educational studies
- Surveys
- Administrative research
- Economics
- Access-to-care studies
- Dosimetric studies
- Planning studies
- QA studies
- Phantom studies
- Small retrospective studies with no clinical impact

Title:
${title}

Journal:
${journal}

Abstract:
${abstract || "No abstract available"}

Return JSON only.
`

  const result = await model.generateContent({
    contents: [{ role: "user", parts: [{ text: prompt }] }],
    generationConfig: {
      responseMimeType: "application/json",
      responseSchema: schema as any
    }
  })

  const text = result.response.text()
  return JSON.parse(text)
}