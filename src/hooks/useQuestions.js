import { useCallback, useEffect, useRef, useState } from "react";
import normalizeQuestion from "../utils/normalizeQuestion.js";
import MOCK from "../mocks/questions.js";

export default function useQuestions(subject) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(!!subject);
  const [error, setError] = useState(null);
  const abortRef = useRef(null);

  const fetchQuestions = useCallback(async () => {
    if (!subject) return;
    setLoading(true);
    setError(null);

    // cancel any old request
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const base = (import.meta.env.VITE_API_BASE_URL || "").replace(/\/+$/, "");
      if (!base) throw new Error("API base not configured");

      const url = `${base}/questions?subject=${encodeURIComponent(subject)}`;
      const res = await fetch(url, { signal: controller.signal });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const raw = await res.json();
      const normalized = (Array.isArray(raw) ? raw : []).map(normalizeQuestion);
      setData(normalized);
    } catch (e) {
      // If API fails → use mocks
      if (e.name !== "AbortError") {
        const mock = Array.isArray(MOCK[subject]) ? MOCK[subject] : [];
        setData(mock);
        setError(mock.length === 0 ? e : null); // only show error if no fallback
      }
    } finally {
      setLoading(false);
    }
  }, [subject]);

  useEffect(() => {
    if (!subject) return;
    fetchQuestions();
    return () => abortRef.current?.abort();
  }, [subject, fetchQuestions]);

  return { data, loading, error, refetch: fetchQuestions };
}
