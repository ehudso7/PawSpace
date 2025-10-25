import { getCloudinaryService } from '../services';
import { VideoParams, TextOverlay, TransitionType } from '../types';

/**
 * Generate a transformation video with default settings
 */
export const generateTransformationVideo = async (
  beforeImageUrl: string,
  afterImageUrl: string,
  options?: Partial<VideoParams>
): Promise<string> => {
  const cloudinaryService = getCloudinaryService();

  // Default text overlays
  const defaultTextOverlays: TextOverlay[] = [
    {
      text: 'BEFORE',
      position: { x: 10, y: 85 },
      style: {
        fontSize: 24,
        fontFamily: 'Arial',
        color: '#FFFFFF',
        backgroundColor: '#000000',
        bold: true
      },
      startTime: 0,
      duration: 1.5
    },
    {
      text: 'AFTER',
      position: { x: 10, y: 85 },
      style: {
        fontSize: 24,
        fontFamily: 'Arial',
        color: '#FFFFFF',
        backgroundColor: '#000000',
        bold: true
      },
      startTime: 1.5,
      duration: 1.5
    }
  ];

  const videoParams: VideoParams = {
    beforeImageUrl,
    afterImageUrl,
    transition: 'fade',
    duration: 3,
    fps: 30,
    textOverlays: defaultTextOverlays,
    ...options
  };

  const result = await cloudinaryService.createTransformationVideo(videoParams);
  return result.videoUrl;
};

/**
 * Create a quick transformation video with minimal options
 */
export const createQuickTransformation = async (
  beforeImageUrl: string,
  afterImageUrl: string,
  transition: TransitionType = 'fade'
): Promise<string> => {
  return generateTransformationVideo(beforeImageUrl, afterImageUrl, {
    transition,
    duration: 2,
    textOverlays: []
  });
};

/**
 * Create a professional transformation video with branding
 */
export const createProfessionalTransformation = async (
  beforeImageUrl: string,
  afterImageUrl: string,
  serviceName?: string
): Promise<string> => {
  const textOverlays: TextOverlay[] = [
    {
      text: 'TRANSFORMATION',
      position: { x: 50, y: 5 },
      style: {
        fontSize: 20,
        fontFamily: 'Arial',
        color: '#FFFFFF',
        bold: true
      },
      startTime: 0,
      duration: 3
    }
  ];

  if (serviceName) {
    textOverlays.push({
      text: serviceName,
      position: { x: 50, y: 90 },
      style: {
        fontSize: 16,
        fontFamily: 'Arial',
        color: '#4CAF50',
        backgroundColor: '#FFFFFF'
      },
      startTime: 0,
      duration: 3
    });
  }

  return generateTransformationVideo(beforeImageUrl, afterImageUrl, {
    transition: 'slide_left',
    duration: 4,
    textOverlays
  });
};