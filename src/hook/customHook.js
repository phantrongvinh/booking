import { useState, useEffect, useCallback, useRef, useMemo } from "react";

// ─────────────────────────────────────────────────────────────────────────────
// useFetch - GET data, hỗ trợ auto-fetch và manual trigger
//
// @param {Function} apiFn              - Hàm gọi API, trả về Promise
// @param {Object}   options
// @param {boolean}  options.immediate  - Tự fetch khi mount (default: true)
// @param {any}      options.initialData
// @param {Function} options.onSuccess
// @param {Function} options.onError
//
// @returns {{ data, loading, error, fetch, reset }}
// ─────────────────────────────────────────────────────────────────────────────
export const useFetch = (apiFn, options = {}) => {
  const { immediate = true, initialData = null, onSuccess, onError } = options;

  const [data, setData] = useState(initialData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const abortControllerRef = useRef(null);
  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
      abortControllerRef.current?.abort();
    };
  }, []);

  const execute = useCallback(
    async (...args) => {
      abortControllerRef.current?.abort();
      abortControllerRef.current = new AbortController();

      if (!apiFn) return;

      setLoading(true);
      setError(null);

      try {
        const result = await apiFn(...args);
        if (!isMountedRef.current) return;
        setData(result);
        onSuccess?.(result);
        return result;
      } catch (err) {
        if (!isMountedRef.current) return;
        if (err?.name === "AbortError" || err?.code === "ERR_CANCELED") return;
        setError(err);
        onError?.(err);
      } finally {
        if (isMountedRef.current) setLoading(false);
      }
    },
    [apiFn, onSuccess, onError],
  );

  useEffect(() => {
    if (immediate) execute();
  }, [execute, immediate]);

  const reset = useCallback(() => {
    setData(initialData);
    setError(null);
    setLoading(false);
  }, [initialData]);

  return { data, loading, error, fetch: execute, reset };
};

// ─────────────────────────────────────────────────────────────────────────────
// useFetchParams - GET data tự động re-fetch khi params thay đổi
// Dùng cho search / filter / pagination
//
// @param {Function} apiFn   - Nhận params, trả về Promise
// @param {Object}   params  - Object params, re-fetch khi thay đổi
// @param {Object}   options
// @param {any}      options.initialData
// @param {Function} options.onSuccess
// @param {Function} options.onError
//
// @returns {{ data, loading, error, fetch, reset }}
// ─────────────────────────────────────────────────────────────────────────────
export const useFetchParams = (apiFn, params, options = {}) => {
  const { initialData = null, onSuccess, onError } = options;

  const paramsKey = JSON.stringify(params);

  const wrappedFn = useMemo(
    () => () => apiFn(params),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [apiFn, paramsKey],
  );

  return useFetch(wrappedFn, {
    immediate: true,
    initialData,
    onSuccess,
    onError,
  });
};

// ─────────────────────────────────────────────────────────────────────────────
// useSubmit - POST / PUT / DELETE, chỉ chạy khi gọi submit()
//
// @param {Function} apiFn              - Hàm gọi API mutation
// @param {Object}   options
// @param {Function} options.onSuccess  - Nhận (result, payload)
// @param {Function} options.onError    - Nhận (error, payload)
// @param {Function} options.onSettled  - Chạy sau cả success lẫn error
//
// @returns {{ submit, loading, error, data, reset }}
// ─────────────────────────────────────────────────────────────────────────────
export const useSubmit = (apiFn, options = {}) => {
  const { onSuccess, onError, onSettled } = options;

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const submit = useCallback(
    async (payload) => {
      if (!apiFn) return;

      setLoading(true);
      setError(null);

      try {
        const result = await apiFn(payload);
        if (!isMountedRef.current) return;
        setData(result);
        onSuccess?.(result, payload);
        return result;
      } catch (err) {
        if (!isMountedRef.current) return;
        setError(err);
        onError?.(err, payload);
      } finally {
        if (isMountedRef.current) {
          setLoading(false);
          onSettled?.();
        }
      }
    },
    [apiFn, onSuccess, onError, onSettled],
  );

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setLoading(false);
  }, []);

  return { submit, loading, error, data, reset };
};
