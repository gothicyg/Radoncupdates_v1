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
You are the editor of Radiation Oncology Signals.

Your role is to identify clinically meaningful publications for practicing radiation oncologists.

A SIGNAL is a publication that could:
- Change clinical practice
- Influence treatment decisions
- Influence toxicity management
- Influence patient counseling
- Introduce a major guideline update
- Introduce important new technology or AI workflow
- Report important positive or negative randomized evidence

SCORING FRAMEWORK

START AT 0.

Add points:

+5
Phase III randomized trial

+5
Major guideline (ASTRO, ESTRO, NCCN, ASCO, ESMO)

+4
Meta-analysis of high-quality studies

+4
Practice-changing prospective study

+3
Phase II trial with clinically meaningful findings

+3
Major toxicity or quality-of-life findings

+3
Important radiotherapy technology with direct clinical relevance

+2
AI application directly affecting radiation oncology workflow

Subtract points:

-5
Workforce study

-5
Infrastructure study

-5
Healthcare access study

-5
Country-specific service report

-5
Crowdfunding study

-4
Educational study

-4
Survey study

-4
Administrative study

-4
Economic analysis without clinical impact

-3
Dosimetric study

-3
Planning comparison

-3
QA study

-3
Phantom study

-2
Small retrospective study

Interpretation:

0-3 = REJECT
4-6 = REVIEW
7-8 = INCLUDE
9-10 = HIGH PRIORITY INCLUDE

Classify:

1. relevance_score (1-10)
2. confidence_score (1-10)
3. article_type
4. disease_site
5. recommendation
6. selection_rationale
7. one_sentence_clinical_reason

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