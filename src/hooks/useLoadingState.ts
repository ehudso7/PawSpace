/**
 * Loading State Hook
 * Custom hook for managing loading states with progress
 */

import { useState, useCallback } from 'react';
import type { VideoGenerationProgress } from '../types/transformation';

export interface LoadingState {
  isLoading: boolean;
  progress: VideoGenerationProgress | null;
  error: string | null;
}

export function useLoadingState() {
  const [state, setState] = useState<LoadingState>({
    isLoading: false,
    progress: null,
    error: null,
  });

  const startLoading = useCallback((message: string = 'Loading...') => {
    setState({
      isLoading: true,
      progress: {
        status: 'uploading',
        progress: 0,
        message,
      },
      error: null,
    });
  }, []);

  const updateProgress = useCallback((progress: VideoGenerationProgress) => {
    setState(prev => ({
      ...prev,
      progress,
    }));
  }, []);

  const setError = useCallback((error: string) => {
    setState({
      isLoading: false,
      progress: null,
      error,
    });
  }, []);

  const complete = useCallback(() => {
    setState({
      isLoading: false,
      progress: {
        status: 'completed',
        progress: 100,
        message: 'Complete!',
      },
      error: null,
    });
  }, []);

  const reset = useCallback(() => {
    setState({
      isLoading: false,
      progress: null,
      error: null,
    });
  }, []);

  return {
    ...state,
    startLoading,
    updateProgress,
    setError,
    complete,
    reset,
  };
}
