"use client";

import { useState, useCallback } from "react";

interface Meta {
  total: number;
  page: number;
  limit: number;
}

export function usePagination(defaultLimit = 10) {
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState<Meta>({ total: 0, page: 1, limit: defaultLimit });

  const updateMeta = useCallback((newMeta: Meta) => {
    setMeta(newMeta);
  }, []);

  const goTo = useCallback((p: number) => {
    setPage(p);
  }, []);

  const reset = useCallback(() => {
    setPage(1);
  }, []);

  return { page, limit: defaultLimit, meta, updateMeta, goTo, reset };
}
