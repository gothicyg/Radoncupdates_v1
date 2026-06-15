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
You are a radiation oncology editor. Evaluate if this publication is a SIGNAL that a practicing clinician should know about.
Prioritize: practice-changing evidence, guidelines, landmark updates, major toxicity findings, important negative studies.
Down-rank: small retrospective, dosimetric, phantom, QA, basic science.

Title: ${title}
Journal: ${journal}
Abstract: ${abstract || "No abstract available"}
${isConference ? "This is a conference presentation – apply same rigorous signal criteria." : ""}

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