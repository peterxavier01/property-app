import { Alert } from "react-native";
import { useEffect, useState, useCallback, useMemo } from "react";

interface UseAppwriteOptions<T, P extends Record<string, string | number>> {
  fn: (params: P) => Promise<T>;
  params?: P;
  skip?: boolean;
}

interface UseAppwriteReturn<T, P> {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: (newParams: P) => Promise<void>;
}

export const useAppwrite = <T, P extends Record<string, string | number>>({
  fn,
  params = {} as P,
  skip = false,
}: UseAppwriteOptions<T, P>): UseAppwriteReturn<T, P> => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(!skip);
  const [error, setError] = useState<string | null>(null);

  // Memoize params to prevent unnecessary re-renders
  const memoizedParams = useMemo(() => params, [JSON.stringify(params)]);

  const fetchData = useCallback(
    async (fetchParams: P) => {
      setLoading(true);
      setError(null);

      try {
        const result = await fn(fetchParams);
        setData(result);
      } catch (err: unknown) {
        const errorMessage =
          err instanceof Error ? err.message : "An unknown error occurred";
        setError(errorMessage);
        // Only show alert for unexpected errors, not auth errors
        if (
          !errorMessage.includes("401") &&
          !errorMessage.includes("unauthorized")
        ) {
          Alert.alert("Error", errorMessage);
        }
        console.log("useAppwrite error:", errorMessage);
      } finally {
        setLoading(false);
      }
    },
    [fn]
  );

  // Memoize refetch function to prevent context re-renders
  const refetch = useCallback(
    async (newParams: P) => await fetchData(newParams),
    [fetchData]
  );

  useEffect(() => {
    if (!skip) {
      fetchData(memoizedParams);
    } else {
      setLoading(false);
    }
  }, [skip, fetchData, memoizedParams]);

  return { data, loading, error, refetch };
};
