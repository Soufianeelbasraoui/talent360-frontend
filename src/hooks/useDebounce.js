import { useState, useEffect } from 'react';
import { APP_CONFIG } from '@/constants/config';

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
