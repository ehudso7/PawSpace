import { useState, useCallback } from 'react';
import { VideoGenerationProgress, TransitionType } from '@/types/transformation';
import { TransformationsService } from '@/services/transformations';

export interface UseVideoGenerationReturn {
  isGenerating: boolean;
  progress: VideoGenerationProgress | null;
  error: string | null;
  generateVideo: (
    beforeImageUri: string,
    afterImageUri: string,
    transitionType?: TransitionType
  ) => Promise<{ videoUrl?: string; gifUrl?: string } | null>;
  reset: () => void;
}

export const useVideoGeneration = (): UseVideoGenerationReturn => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState<VideoGenerationProgress | null>(null);
  const [error, setError] = useState<string | null>(null);

  const generateVideo = useCallback(async (
    beforeImageUri: string,
    afterImageUri: string,
    transitionType: TransitionType = 'crossfade'
  ) => {
    try {
      setIsGenerating(true);
      setError(null);
      setProgress({
        status: 'uploading',
        progress: 0,
        message: 'Starting generation...',
      });

      const result = await TransformationsService.generateVideoTransformation(
        beforeImageUri,
        afterImageUri,
        transitionType,
        (progressUpdate) => {
          setProgress(progressUpdate);
        }
      );

      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      setProgress({
        status: 'failed',
        progress: 0,
        message: errorMessage,
      });
      return null;
    } finally {
      setIsGenerating(false);
    }
  }, []);

  const reset = useCallback(() => {
    setIsGenerating(false);
    setProgress(null);
    setError(null);
  }, []);

  return {
    isGenerating,
    progress,
    error,
    generateVideo,
    reset,
  };
};