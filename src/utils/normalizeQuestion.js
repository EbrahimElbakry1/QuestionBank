// src/utils/normalizeQuestion.js
// Accepts API record: { question: string, options: string[4], answer?: string, answerIndex?: number }
// Returns: { question, choices: string[4], answerIndex: number }
export default function normalizeQuestion(rec) {
  const question = String(rec?.question ?? "");
  const options = Array.isArray(rec?.options) ? rec.options.slice(0, 4) : [];
  let answerIndex = Number.isInteger(rec?.answerIndex) ? rec.answerIndex : -1;

  if (answerIndex < 0 && typeof rec?.answer === "string") {
    const i = options.indexOf(rec.answer);
    answerIndex = i >= 0 ? i : -1;
  }

  if (!Number.isInteger(answerIndex) || answerIndex < 0 || answerIndex > 3) {
    answerIndex = 0; // safe fallback
  }

  return { question, choices: options, answerIndex };
}
