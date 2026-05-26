export interface FAQ {
  id: string;
  question: string;
  answer: string;
  keywords: string[];
  category?: string;
}

export function searchFAQs(query: string, faqs: FAQ[]): FAQ[] {
  const queryTerms = query
    .toLowerCase()
    .split(/\s+/)
    .filter((t) => t.length > 1);

  if (queryTerms.length === 0) return [];

  const scored = faqs.map((faq) => {
    let score = 0;
    const question = faq.question.toLowerCase();
    const answer = faq.answer.toLowerCase();
    const keywords = faq.keywords.map((k) => k.toLowerCase());

    queryTerms.forEach((term) => {
      if (question.includes(term)) score += 2;
      if (keywords.some((k) => k.includes(term))) score += 3;
      if (answer.includes(term)) score += 1;
    });

    return { faq, score };
  });

  return scored
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 5)
    .map((item) => item.faq);
}
