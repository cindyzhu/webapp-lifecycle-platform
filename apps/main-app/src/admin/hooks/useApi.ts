import { useState, useEffect, useCallback } from 'react';
import type { ApiResponse } from '@wlp/shared';

export function useApi<T>(url: string) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tick, setTick] = useState(0);

  const refetch = useCallback(() => setTick((t) => t + 1), []);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    fetch(url)
      .then((r) => r.json() as Promise<ApiResponse<T>>)
      .then((json) => {
        if (cancelled) return;
        if (json.error) setError(json.error);
        else setData(json.data);
      })
      .catch((e: unknown) => {
        if (!cancelled) setError(String(e));
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [url, tick]);

  return { data, loading, error, refetch };
}

export async function apiMutate<T>(
  url: string,
  method: 'POST' | 'PUT' | 'DELETE',
  body?: unknown,
): Promise<ApiResponse<T>> {
  const res = await fetch(url, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (res.status === 204 || res.headers.get('content-length') === '0') {
    return { data: null, error: null };
  }
  return res.json() as Promise<ApiResponse<T>>;
}
