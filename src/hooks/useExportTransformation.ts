import { useCallback, useMemo, useRef, useState } from 'react';
import * as ImageManipulator from 'expo-image-manipulator';
import * as FileSystem from 'expo-file-system';
import { uploadImage, requestVideoCrossfade, pollVideoStatus, generateGifFromFrames, VideoJobResponse, VideoStatusResponse } from '../services/cloudinary';
import { CreateTransformationData, TransitionType } from '../types/transformations';

export type ExportStatus =
  | 'idle'
  | 'uploading'
  | 'requesting'
  | 'polling'
  | 'gif_generating'
  | 'complete'
  | 'error';

export interface ExportProgress {
  status: ExportStatus;
  progress: number; // 0..1
  message?: string;
  videoUrl?: string;
  gifUrl?: string;
  error?: string;
}

export interface StartPreviewOptions {
  beforeUri: string;
  afterUri: string;
  caption: string;
  isPublic: boolean;
  transitionType?: TransitionType;
  hasMusic?: boolean;
  timeoutMs?: number; // default 60000
}

const DEFAULT_TIMEOUT_MS = 60000;

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function createCrossfadeFrames(beforeUri: string, afterUri: string, steps = 10) {
  const frames: string[] = [];
  for (let i = 0; i <= steps; i += 1) {
    const opacity = i / steps;
    const frame = await ImageManipulator.manipulateAsync(
      beforeUri,
      [
        // @ts-expect-error Expo ImageManipulator overlay undocumented typing
        { overlay: { uri: afterUri, opacity } },
      ],
      { compress: 1, format: ImageManipulator.SaveFormat.JPEG }
    );
    frames.push(frame.uri);
  }
  return frames;
}

async function readUrisAsBase64(uris: string[]): Promise<string[]> {
  const results: string[] = [];
  for (const uri of uris) {
    const b64 = await FileSystem.readAsStringAsync(uri, { encoding: FileSystem.EncodingType.Base64 });
    results.push(`data:image/jpeg;base64,${b64}`);
  }
  return results;
}

export function useExportTransformation() {
  const abortControllerRef = useRef<AbortController | null>(null);
  const [state, setState] = useState<ExportProgress>({ status: 'idle', progress: 0 });

  const cancel = useCallback(() => {
    abortControllerRef.current?.abort();
  }, []);

  const reset = useCallback(() => {
    abortControllerRef.current?.abort();
    abortControllerRef.current = null;
    setState({ status: 'idle', progress: 0 });
  }, []);

  const setProgress = useCallback((partial: Partial<ExportProgress>) => {
    setState((prev) => ({ ...prev, ...partial }));
  }, []);

  const startPreview = useCallback(async (opts: StartPreviewOptions) => {
    const { beforeUri, afterUri, caption, isPublic, transitionType = 'crossfade', hasMusic = false, timeoutMs = DEFAULT_TIMEOUT_MS } = opts;

    const abortController = new AbortController();
    abortControllerRef.current = abortController;

    try {
      setProgress({ status: 'uploading', progress: 0.1, message: 'Uploading images…' });

      // Upload both images in parallel
      const [beforeRes, afterRes] = await Promise.all([
        uploadImage(beforeUri, abortController.signal),
        uploadImage(afterUri, abortController.signal),
      ]);
      setProgress({ progress: 0.4, message: 'Images uploaded' });

      setProgress({ status: 'requesting', progress: 0.45, message: 'Requesting video generation…' });

      const videoReq: VideoJobResponse = await requestVideoCrossfade(
        {
          beforePublicId: beforeRes.public_id,
          afterPublicId: afterRes.public_id,
          transitionMs: transitionType === 'crossfade' ? 700 : 400,
          durationMs: 2500,
          hasMusic,
        },
        abortController.signal
      );

      const start = Date.now();
      let videoUrl: string | undefined;

      setProgress({ status: 'polling', progress: 0.5, message: 'Generating video…' });

      while (Date.now() - start < timeoutMs) {
        const status: VideoStatusResponse = await pollVideoStatus(videoReq.jobId, abortController.signal);
        if (status.status === 'completed' && status.url) {
          videoUrl = status.url;
          break;
        }
        if (status.status === 'failed') {
          throw new Error(status.error || 'Video generation failed');
        }
        const elapsed = Date.now() - start;
        const pct = 0.5 + Math.min(0.45, (elapsed / timeoutMs) * 0.45);
        setProgress({ progress: pct });
        await sleep(2000);
      }

      if (!videoUrl) {
        // Fallback: generate a lightweight GIF client-side + server compose
        setProgress({ status: 'gif_generating', progress: 0.6, message: 'Falling back to GIF…' });
        const frameUris = await createCrossfadeFrames(beforeUri, afterUri, 10);
        const framesBase64 = await readUrisAsBase64(frameUris);
        const gif = await generateGifFromFrames(framesBase64, abortController.signal);
        setProgress({ status: 'complete', progress: 1, gifUrl: gif.url, message: 'Preview ready' });
        return { videoUrl: undefined, gifUrl: gif.url } as const;
      }

      setProgress({ status: 'complete', progress: 1, videoUrl, message: 'Preview ready' });
      return { videoUrl, gifUrl: undefined } as const;
    } catch (e: any) {
      if (e?.name === 'AbortError') {
        setProgress({ status: 'idle', progress: 0, message: 'Cancelled' });
        return { cancelled: true } as const;
      }
      setProgress({ status: 'error', error: e?.message || 'Unknown error', message: 'Something went wrong' });
      return { error: e } as const;
    }
  }, [setProgress]);

  const api = useMemo(
    () => ({ state, startPreview, cancel, reset }),
    [state, startPreview, cancel, reset]
  );

  return api;
}
