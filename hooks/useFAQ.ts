"use client";

import { useState, useCallback } from "react";
import apiClient from "../lib/api-client";

interface FAQResult {
  id: string;
  question: string;
  answer: string;
  category: string;
  relevanceScore: number;
}

export function useFAQ() {
  const [results, setResults] = useState<FAQResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const search = useCallback(async (query: string, limit = 5) => {
    if (query.trim().length < 2) {
      setResults([]);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const { data } = await apiClient.get<{ success: boolean; results: FAQResult[] }>(
        "/api/faqs/search",
        { params: { query, limit } }
      );
      setResults(data.results);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Search failed.");
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  function clear() {
    setResults([]);
    setError(null);
  }

  return { results, loading, error, search, clear };
}
