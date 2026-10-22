import { useState, useEffect } from 'react';
import { APP_CONFIG } from '@/constants/config';

/**
 * Custom hook to debounce a value by a specified delay.
 * @template T
 * @param {T} value
 * @param {number} [delay=300]
 * @returns {T}
 */
export function useDebounce(value, delay = APP_CONFIG.DEBOUNCE_DELAY_MS) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}
