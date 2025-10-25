import { useCallback, useMemo, useRef, useState } from 'react';
import * as ImageManipulator from 'expo-image-manipulator';
import * as FileSystem from 'expo-file-system';
import { uploadImage, pollAssetReady, requestSlideshowVideo, buildCrossfadeTransformationUrl } from '../lib/cloudinary';
import { ProgressState, GenerationResult } from '../types/transformations';

export interface GenerateParams {
  beforeUri: string;
  afterUri: string;
  caption: string;
  transition?: 'crossfade' | 'slide' | 'zoom' | 'none';
  hasMusic?: boolean;
  preferGif?: boolean;
}

export const useVideoGeneration = () => {
  const [state, setState] = useState<ProgressState>({ status: 'idle', progress: 0 });
  const abortRef = useRef<{ aborted: boolean }>({ aborted: false });

  const update = useCallback((patch: Partial<ProgressState>) => {
    setState((s) => ({ ...s, ...patch }));
  }, []);

  const reset = useCallback(() => {
    abortRef.current.aborted = false;
    setState({ status: 'idle', progress: 0 });
  }, []);

  const cancel = useCallback(() => {
    abortRef.current.aborted = true;
  }, []);

  const ensureNotAborted = () => {
    if (abortRef.current.aborted) throw new Error('Operation cancelled');
  };

  const generateGifFallback = useCallback(async (beforeUri: string, afterUri: string): Promise<string> => {
    // Generate a simple crossfade using ImageManipulator frames, then store as a temporary GIF via Cloudinary upload of a GIF sequence
    // Note: ImageManipulator cannot encode GIF; we'll upload frames to Cloudinary to build a GIF via fetch URL
    const frames: string[] = [];
    const frameCount = 10;
    for (let i = 0; i <= frameCount; i++) {
      ensureNotAborted();
      const opacity = i / frameCount;
      const frame = await ImageManipulator.manipulateAsync(beforeUri, [
        { overlay: { uri: afterUri, opacity } as any },
      ], { compress: 1, format: ImageManipulator.SaveFormat.JPEG });
      frames.push(frame.uri);
      update({ status: 'generating', progress: 0.4 + (i / frameCount) * 0.3, message: 'Generating GIF frames' });
    }

    // Upload frames to Cloudinary
    const uploadedPublicIds: string[] = [];
    for (let i = 0; i < frames.length; i++) {
      ensureNotAborted();
      const res = await uploadImage(frames[i]);
      uploadedPublicIds.push(res.public_id);
      update({ status: 'uploading', progress: 0.7 + (i / frames.length) * 0.2, message: 'Uploading frames' });
    }

    // Build a GIF URL via fetch-style transformation joining frames
    // e_animate combines frames of an animated source; for multiple public IDs, we can layer in order then request gif format
    // We'll use a slideshow trick: e_slideshow with format gif
    const first = uploadedPublicIds[0];
    const rest = uploadedPublicIds.slice(1).map((id) => `l_${encodeURIComponent(id)}`).join('/');
    const totalDuration = 2; // seconds
    const width = 720; const height = 1280;
    const path = `video/upload/e_slideshow:w_${width},h_${height},du_${totalDuration},dl_${Math.round(100 / frames.length)},l_${encodeURIComponent(first)}/${rest}/vs_0.gif`;
    const url = `https://res.cloudinary.com/${(process as any)?.env?.EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME || (process as any)?.env?.CLOUDINARY_CLOUD_NAME}/${path}`;

    // Poll readiness for gif (Cloudinary serves as video/gif asset)
    const ready = await pollAssetReady(url.replace(/^https:\/\/res\.cloudinary\.com\/[^/]+\//, '').replace(/\.(mp4|gif|jpg)$/,'').replace(/^video\/upload\//,''), 'video', 'gif', { timeoutMs: 60_000 });
    return ready;
  }, [update]);

  const generate = useCallback(async (params: GenerateParams): Promise<GenerationResult> => {
    try {
      update({ status: 'uploading', progress: 0.05, message: 'Uploading images' });

      // Upload before/after
      const [beforeUp, afterUp] = await Promise.all([
        uploadImage(params.beforeUri),
        uploadImage(params.afterUri),
      ]);
      ensureNotAborted();

      const beforeId = beforeUp.public_id;
      const afterId = afterUp.public_id;

      if (params.preferGif) {
        update({ status: 'generating', progress: 0.3, message: 'Generating GIF' });
        const gifUrl = await generateGifFallback(params.beforeUri, params.afterUri);
        update({ status: 'done', progress: 1, message: 'GIF ready' });
        return { gifUrl, publicId: undefined };
      }

      update({ status: 'generating', progress: 0.35, message: 'Requesting video generation' });

      // Try server-backed slideshow first (higher reliability)
      let slideshowPublicId: string | undefined;
      const requested = await requestSlideshowVideo({
        beforePublicId: beforeId,
        afterPublicId: afterId,
        transition: params.transition || 'crossfade',
        durationSeconds: 3,
      });

      if (requested?.publicId) {
        slideshowPublicId = requested.publicId;
      } else {
        // Fallback: best-effort crossfade URL
        const url = buildCrossfadeTransformationUrl(beforeId, afterId, { format: 'mp4' });
        // Derive public id path after video/upload/
        slideshowPublicId = url.replace(/^https:\/\/res\.cloudinary\.com\/[^/]+\/video\/upload\//, '').replace(/\.(mp4|gif)$/,'');
      }

      update({ status: 'polling', progress: 0.6, message: 'Finalizing video' });
      const videoUrl = await pollAssetReady(slideshowPublicId!, 'video', 'mp4', { timeoutMs: 120_000, intervalMs: 3000 });

      update({ status: 'done', progress: 1, message: 'Video ready' });
      return { videoUrl, publicId: slideshowPublicId };
    } catch (e) {
      const msg = (e as Error).message || 'Unknown error';
      update({ status: 'error', progress: 1, error: msg, message: 'Failed to generate' });
      throw e;
    }
  }, [update, generateGifFallback]);

  return useMemo(() => ({ state, generate, reset, cancel }), [state, generate, reset, cancel]);
};
