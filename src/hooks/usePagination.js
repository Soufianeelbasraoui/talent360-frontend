import { useState, useCallback } from 'react';
import { APP_CONFIG } from '@/constants/config';

/**
 * Custom hook to manage server-side pagination state.
 * @param {Object} [options]
 * @param {number} [options.initialPage=0]
 * @param {number} [options.initialSize=10]
 */
export function usePagination({
  initialPage = 0,
  initialSize = APP_CONFIG.DEFAULT_PAGE_SIZE,
} = {}) {
  const [page, setPage] = useState(initialPage);
  const [size, setSize] = useState(initialSize);

  const resetPage = useCallback(() => {
    setPage(0);
  }, []);

  const goToPage = useCallback((newPage) => {
    setPage(newPage);
  }, []);

  return {
    page,
    size,
    setPage: goToPage,
    setSize,
    resetPage,
  };
}
