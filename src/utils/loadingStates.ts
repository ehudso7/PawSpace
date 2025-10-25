import { useState, useCallback } from 'react';

export interface LoadingState {
  isLoading: boolean;
  error: string | null;
  data: any;
}

export const useLoadingState = <T = any>(initialData: T = null as T) => {
  const [state, setState] = useState<LoadingState>({
    isLoading: false,
    error: null,
    data: initialData,
  });

  const setLoading = useCallback((isLoading: boolean) => {
    setState(prev => ({ ...prev, isLoading, error: isLoading ? null : prev.error }));
  }, []);

  const setError = useCallback((error: string | null) => {
    setState(prev => ({ ...prev, error, isLoading: false }));
  }, []);

  const setData = useCallback((data: T) => {
    setState(prev => ({ ...prev, data, error: null, isLoading: false }));
  }, []);

  const reset = useCallback(() => {
    setState({
      isLoading: false,
      error: null,
      data: initialData,
    });
  }, [initialData]);

  const execute = useCallback(async (
    asyncFunction: () => Promise<T>,
    options: {
      onSuccess?: (data: T) => void;
      onError?: (error: string) => void;
      showError?: boolean;
    } = {}
  ) => {
    const { onSuccess, onError, showError = true } = options;
    
    try {
      setLoading(true);
      setError(null);
      
      const result = await asyncFunction();
      
      setData(result);
      onSuccess?.(result);
      
      return result;
    } catch (error: any) {
      const errorMessage = error.message || 'An unexpected error occurred';
      setError(errorMessage);
      onError?.(errorMessage);
      
      if (showError) {
        // You can integrate with your error handling system here
        console.error('Async operation failed:', error);
      }
      
      throw error;
    }
  }, [setLoading, setError, setData]);

  return {
    ...state,
    setLoading,
    setError,
    setData,
    reset,
    execute,
  };
};

export const useMultipleLoadingStates = <T extends Record<string, any>>(
  initialState: T
) => {
  const [states, setStates] = useState<T>(initialState);

  const setLoading = useCallback((key: keyof T, isLoading: boolean) => {
    setStates(prev => ({
      ...prev,
      [key]: { ...prev[key], isLoading, error: isLoading ? null : prev[key].error }
    }));
  }, []);

  const setError = useCallback((key: keyof T, error: string | null) => {
    setStates(prev => ({
      ...prev,
      [key]: { ...prev[key], error, isLoading: false }
    }));
  }, []);

  const setData = useCallback((key: keyof T, data: any) => {
    setStates(prev => ({
      ...prev,
      [key]: { ...prev[key], data, error: null, isLoading: false }
    }));
  }, []);

  const reset = useCallback((key?: keyof T) => {
    if (key) {
      setStates(prev => ({
        ...prev,
        [key]: { isLoading: false, error: null, data: null }
      }));
    } else {
      setStates(initialState);
    }
  }, [initialState]);

  return {
    states,
    setLoading,
    setError,
    setData,
    reset,
  };
};

export const createLoadingState = <T = any>(data: T = null as T): LoadingState => ({
  isLoading: false,
  error: null,
  data,
});

export const withLoadingState = <T extends any[], R>(
  asyncFunction: (...args: T) => Promise<R>
) => {
  return async (...args: T): Promise<{ data: R | null; error: string | null; isLoading: boolean }> => {
    try {
      const data = await asyncFunction(...args);
      return { data, error: null, isLoading: false };
    } catch (error: any) {
      return { 
        data: null, 
        error: error.message || 'An unexpected error occurred', 
        isLoading: false 
      };
    }
  };
};