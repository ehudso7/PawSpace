import { useState, useCallback, useRef } from 'react';
import {
  VideoGenerationProgress,
  VideoGenerationOptions,
  ExportResult,
  ExportFormat,
} from '../types/transformation';
import TransformationsService from '../services/transformations';
import GIFGeneratorService from '../services/gifGenerator';

interface UseVideoGenerationResult {
  isGenerating: boolean;
  progress: VideoGenerationProgress | null;
  result: ExportResult | null;
  error: string | null;
  generateVideo: (
    beforeImageUri: string,
    afterImageUri: string,
    options: VideoGenerationOptions
  ) => Promise<void>;
  generateGIF: (
    beforeImageUri: string,
    afterImageUri: string,
    options: VideoGenerationOptions
  ) => Promise<void>;
  reset: () => void;
  cancel: () => void;
}

export const useVideoGeneration = (
  transformationsService: TransformationsService,
  gifGeneratorService: GIFGeneratorService
): UseVideoGenerationResult => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState<VideoGenerationProgress | null>(null);
  const [result, setResult] = useState<ExportResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const cancelRef = useRef(false);

  const reset = useCallback(() => {
    setIsGenerating(false);
    setProgress(null);
    setResult(null);
    setError(null);
    cancelRef.current = false;
  }, []);

  const cancel = useCallback(() => {
    cancelRef.current = true;
    setIsGenerating(false);
    setProgress({
      stage: 'error',
      progress: 0,
      message: 'Generation cancelled',
    });
  }, []);

  const generateVideo = useCallback(
    async (
      beforeImageUri: string,
      afterImageUri: string,
      options: VideoGenerationOptions
    ) => {
      if (isGenerating) return;

      reset();
      setIsGenerating(true);
      cancelRef.current = false;

      try {
        const result = await transformationsService.generateTransformationMedia(
          beforeImageUri,
          afterImageUri,
          { ...options, format: 'video' },
          (progressUpdate) => {
            if (cancelRef.current) return;
            setProgress(progressUpdate);
          }
        );

        if (cancelRef.current) return;

        setResult(result);
        
        if (!result.success) {
          setError(result.error || 'Video generation failed');
        }
      } catch (err) {
        if (cancelRef.current) return;
        
        const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
        setError(errorMessage);
        setProgress({
          stage: 'error',
          progress: 0,
          message: errorMessage,
        });
      } finally {
        if (!cancelRef.current) {
          setIsGenerating(false);
        }
      }
    },
    [isGenerating, transformationsService, reset]
  );

  const generateGIF = useCallback(
    async (
      beforeImageUri: string,
      afterImageUri: string,
      options: VideoGenerationOptions
    ) => {
      if (isGenerating) return;

      reset();
      setIsGenerating(true);
      cancelRef.current = false;

      try {
        // Update progress manually for GIF generation
        setProgress({
          stage: 'processing',
          progress: 0,
          message: 'Preparing images...',
          estimated_time_remaining: 15,
        });

        if (cancelRef.current) return;

        const result = await gifGeneratorService.generateGIF(
          beforeImageUri,
          afterImageUri,
          { ...options, format: 'gif' },
          (progressValue) => {
            if (cancelRef.current) return;
            setProgress({
              stage: 'generating',
              progress: progressValue,
              message: 'Creating GIF animation...',
              estimated_time_remaining: Math.max(1, Math.round((100 - progressValue) * 0.15)),
            });
          }
        );

        if (cancelRef.current) return;

        setProgress({
          stage: 'complete',
          progress: 100,
          message: 'GIF created successfully!',
        });

        setResult(result);
        
        if (!result.success) {
          setError(result.error || 'GIF generation failed');
        }
      } catch (err) {
        if (cancelRef.current) return;
        
        const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
        setError(errorMessage);
        setProgress({
          stage: 'error',
          progress: 0,
          message: errorMessage,
        });
      } finally {
        if (!cancelRef.current) {
          setIsGenerating(false);
        }
      }
    },
    [isGenerating, gifGeneratorService, reset]
  );

  return {
    isGenerating,
    progress,
    result,
    error,
    generateVideo,
    generateGIF,
    reset,
    cancel,
  };
};