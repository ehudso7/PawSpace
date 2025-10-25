/**
 * Example Usage and Integration Guide
 * Complete video generation and sharing flow
 */

import React from 'react';
import { View, Button } from 'react-native';
import { PreviewScreen } from './screens/PreviewScreen';
import { videoGenerationService } from './services/videoGeneration';
import { sharingService } from './services/sharing';
import { transformationsService } from './services/transformations';
import { errorHandler } from './utils/errorHandler';
import type { TransitionType } from './types/transformation';

/**
 * EXAMPLE 1: Basic Usage - Generate and Preview Transformation
 */
export function TransformationExample() {
  const [showPreview, setShowPreview] = React.useState(false);

  const handlePreview = () => {
    setShowPreview(true);
  };

  return (
    <View>
      {showPreview ? (
        <PreviewScreen
          beforeImageUri="file:///path/to/before.jpg"
          afterImageUri="file:///path/to/after.jpg"
          caption="My amazing pet transformation! 🐶✨"
          transitionType="fade"
          isPublic={true}
          hasMusic={false}
          onComplete={() => {
            setShowPreview(false);
            // Navigate back or show success
          }}
          onCancel={() => setShowPreview(false)}
        />
      ) : (
        <Button title="Preview Transformation" onPress={handlePreview} />
      )}
    </View>
  );
}

/**
 * EXAMPLE 2: Manual Video Generation with Progress Tracking
 */
export async function generateVideoManually() {
  try {
    const result = await videoGenerationService.generateTransformation(
      'file:///path/to/before.jpg',
      'file:///path/to/after.jpg',
      {
        transitionType: 'crossfade',
        duration: 3,
        hasMusic: true,
        mode: 'video',
      },
      (progress) => {
        console.log(`Progress: ${progress.progress}%`);
        console.log(`Status: ${progress.message}`);
      }
    );

    console.log('Video URL:', result.videoUrl);
    return result;
  } catch (error) {
    errorHandler.handleError(error, 'video-generation');
    throw error;
  }
}

/**
 * EXAMPLE 3: Quick GIF Generation (Faster)
 */
export async function generateGifQuickly() {
  try {
    const result = await videoGenerationService.generateTransformation(
      'file:///path/to/before.jpg',
      'file:///path/to/after.jpg',
      {
        transitionType: 'fade',
        duration: 2,
        mode: 'gif',
      },
      (progress) => {
        console.log('Generating GIF:', progress.progress + '%');
      }
    );

    console.log('GIF URL:', result.gifUrl);
    return result;
  } catch (error) {
    errorHandler.showError(error, 'GIF Generation Failed');
    throw error;
  }
}

/**
 * EXAMPLE 4: Share to Instagram Stories
 */
export async function shareToInstagramStories(videoUrl: string) {
  try {
    await sharingService.shareToInstagram({
      videoUri: videoUrl,
      caption: 'Check out my transformation! #PawSpace',
      transformationId: 'transformation-123',
    });
  } catch (error) {
    errorHandler.showError(error, 'Share Failed');
  }
}

/**
 * EXAMPLE 5: Save to Device Gallery
 */
export async function saveToGallery(videoUrl: string) {
  try {
    await sharingService.saveToDevice(videoUrl);
    // Success alert is shown automatically
  } catch (error) {
    errorHandler.handleError(error, 'save-to-gallery', () => {
      // Retry
      saveToGallery(videoUrl);
    });
  }
}

/**
 * EXAMPLE 6: Post Transformation to Feed
 */
export async function postToFeed(videoUrl: string, beforeUrl: string, afterUrl: string) {
  try {
    const transformation = await transformationsService.createTransformation({
      before_image_url: beforeUrl,
      after_image_url: afterUrl,
      video_url: videoUrl,
      caption: 'Before and after grooming! 🐕',
      service_id: 'service-123',
      is_public: true,
      transition_type: 'fade',
      has_music: false,
    });

    console.log('Posted transformation:', transformation.id);
    return transformation;
  } catch (error) {
    errorHandler.showError(error, 'Post Failed');
    throw error;
  }
}

/**
 * EXAMPLE 7: Get Available Share Platforms
 */
export async function checkSharePlatforms() {
  const platforms = await sharingService.getAvailablePlatforms();
  console.log('Available platforms:', platforms);
  // ['instagram', 'tiktok', 'facebook']
  
  // Check specific platform
  const hasInstagram = await sharingService.isPlatformInstalled('instagram');
  console.log('Has Instagram:', hasInstagram);
}

/**
 * EXAMPLE 8: Complete Flow with Error Handling and Retry
 */
export async function completeTransformationFlow(
  beforeUri: string,
  afterUri: string,
  transitionType: TransitionType
) {
  let retryCount = 0;
  const maxRetries = 3;

  const attemptGeneration = async (): Promise<any> => {
    try {
      // Step 1: Generate video
      console.log('Starting generation...');
      const result = await videoGenerationService.generateTransformation(
        beforeUri,
        afterUri,
        {
          transitionType,
          duration: 3,
          hasMusic: false,
          mode: 'auto',
        },
        (progress) => {
          console.log(`${progress.message} - ${progress.progress}%`);
        }
      );

      // Step 2: Save to feed
      console.log('Posting to feed...');
      const transformation = await transformationsService.createTransformation({
        before_image_url: result.beforeImageUrl,
        after_image_url: result.afterImageUrl,
        video_url: result.videoUrl,
        gif_url: result.gifUrl,
        caption: 'My transformation!',
        is_public: true,
        transition_type: transitionType,
        has_music: false,
      });

      // Step 3: Save to device
      console.log('Saving to device...');
      if (result.videoUrl) {
        await sharingService.saveToDevice(result.videoUrl);
      }

      console.log('✅ Complete!');
      return transformation;
    } catch (error) {
      const appError = errorHandler.parseError(error);
      
      // Check if retryable
      if (errorHandler.isRetryable(appError) && retryCount < maxRetries) {
        retryCount++;
        console.log(`Retrying... (${retryCount}/${maxRetries})`);
        await new Promise(resolve => setTimeout(resolve, 2000));
        return attemptGeneration();
      }

      // Show error to user
      errorHandler.handleError(error, 'transformation-flow');
      throw error;
    }
  };

  return attemptGeneration();
}

/**
 * EXAMPLE 9: Draft Management
 */
export async function saveDraftAndRestore() {
  // Save draft
  const draft = await transformationsService.saveDraft({
    before_image_url: 'file:///before.jpg',
    after_image_url: 'file:///after.jpg',
    caption: 'Work in progress...',
    transition_type: 'fade',
    has_music: false,
  });

  console.log('Draft saved:', draft.id);

  // Get all drafts
  const drafts = await transformationsService.getDrafts();
  console.log('My drafts:', drafts.length);

  // Delete draft
  await transformationsService.deleteDraft(draft.id);
}

/**
 * EXAMPLE 10: Like and Share Interactions
 */
export async function interactWithTransformation(transformationId: string) {
  // Like transformation
  await transformationsService.likeTransformation(transformationId);

  // Share and track
  await transformationsService.shareToSocial(transformationId, 'instagram');

  // Get transformation details
  const transformation = await transformationsService.getTransformation(transformationId);
  console.log('Likes:', transformation.likes_count);
  console.log('Shares:', transformation.shares_count);
}
