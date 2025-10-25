import { useState, useCallback } from 'react';
import { retryWithExponentialBackoff } from '@/utils/retry';

export interface UseRetryReturn {
  isRetrying: boolean;
  retryCount: number;
  executeWithRetry: <T>(fn: () => Promise<T>) => Promise<T | null>;
  reset: () => void;
}

export const useRetry = (maxAttempts: number = 3): UseRetryReturn => {
  const [isRetrying, setIsRetrying] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  const executeWithRetry = useCallback(async <T>(fn: () => Promise<T>): Promise<T | null> => {
    try {
      setIsRetrying(true);
      setRetryCount(0);

      const result = await retryWithExponentialBackoff(async () => {
        setRetryCount(prev => prev + 1);
        return await fn();
      }, maxAttempts);

      return result;
    } catch (error) {
      console.error('All retry attempts failed:', error);
      return null;
    } finally {
      setIsRetrying(false);
    }
  }, [maxAttempts]);

  const reset = useCallback(() => {
    setIsRetrying(false);
    setRetryCount(0);
  }, []);

  return {
    isRetrying,
    retryCount,
    executeWithRetry,
    reset,
  };
};