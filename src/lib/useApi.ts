import { useCallback, useEffect, useRef, useState } from 'react';
import { ApiError, api } from './api';

type State<T> = {
  data: T | null;
  loading: boolean;
  error: string | null;
  reload: () => void;
};

/**
 * GET a path and track loading/error state. `deps` behaves like a
 * useEffect dependency list — change them to refetch.
 */
export function useApi<T = unknown>(
  path: string | null,
  deps: unknown[] = [],
  query?: Record<string, string | number | boolean | undefined>,
): State<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(Boolean(path));
  const [error, setError] = useState<string | null>(null);
  const [nonce, setNonce] = useState(0);

  // Keep the latest query without making it a dependency (object identity churn).
  const queryRef = useRef(query);
  queryRef.current = query;

  useEffect(() => {
    if (!path) {
      setData(null);
      setLoading(false);
      return;
    }

    const controller = new AbortController();
    let active = true;

    setLoading(true);
    setError(null);

    api
      .get<T>(path, { query: queryRef.current, signal: controller.signal })
      .then((result) => {
        if (!active) return;
        setData(result);
        setError(null);
      })
      .catch((err: unknown) => {
        if (!active || controller.signal.aborted) return;
        setError(err instanceof ApiError ? err.message : 'Something went wrong.');
        setData(null);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
      controller.abort();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [path, nonce, ...deps]);

  const reload = useCallback(() => setNonce((n) => n + 1), []);

  return { data, loading, error, reload };
}

/**
 * Wrap a mutating call so components get consistent pending/error handling.
 */
export function useMutation<TArgs extends unknown[], TResult>(
  fn: (...args: TArgs) => Promise<TResult>,
) {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]> | null>(null);

  // `fn` is re-created every render and closes over current state. Keeping it
  // in a ref lets `run` stay referentially stable (safe in dependency lists)
  // while still calling the latest closure — memoising `run` over `fn` itself
  // would freeze the first render's state and submit stale values.
  const fnRef = useRef(fn);
  fnRef.current = fn;

  const run = useCallback(
    async (...args: TArgs): Promise<TResult | null> => {
      setPending(true);
      setError(null);
      setFieldErrors(null);
      try {
        return await fnRef.current(...args);
      } catch (err) {
        if (err instanceof ApiError) {
          setError(err.message);
          setFieldErrors(err.errors ?? null);
        } else {
          setError('Something went wrong. Please try again.');
        }
        return null;
      } finally {
        setPending(false);
      }
    },
    [],
  );

  return { run, pending, error, fieldErrors, setError };
}
