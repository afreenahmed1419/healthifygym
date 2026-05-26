import { getActiveFAQs } from "./SupabaseService";
import type { FAQ } from "../types";

export interface ScoredFAQ extends FAQ {
  relevanceScore: number;
}

export async function searchFAQs(query: string, limit = 5): Promise<ScoredFAQ[]> {
  const terms = query.toLowerCase().split(/\s+/).filter(Boolean);
  if (terms.length === 0) return [];

  const faqs = await getActiveFAQs();

  const scored: ScoredFAQ[] = faqs
    .map((faq) => {
      const question = faq.question.toLowerCase();
      const answer = faq.answer.toLowerCase();
      const keywords = faq.keywords.map((k) => k.toLowerCase());

      let score = 0;
      for (const term of terms) {
        if (question.includes(term)) score += 3;
        if (keywords.some((k) => k.includes(term))) score += 2;
        if (answer.includes(term)) score += 1;
      }

      // Normalise to 0–1 range (max possible = terms * 6)
      const maxScore = terms.length * 6;
      const relevanceScore = maxScore > 0 ? parseFloat((score / maxScore).toFixed(2)) : 0;

      return { ...faq, relevanceScore };
    })
    .filter((faq) => faq.relevanceScore > 0)
    .sort((a, b) => b.relevanceScore - a.relevanceScore)
    .slice(0, limit);

  return scored;
}
