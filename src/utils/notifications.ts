import { Alert, ToastAndroid, Platform } from 'react-native';

export type NotificationType = 'success' | 'error' | 'warning' | 'info';

/**
 * Cross-platform notification utilities
 */
export class NotificationUtils {
  /**
   * Show a toast message (Android) or alert (iOS)
   */
  static showToast(message: string, type: NotificationType = 'info', duration: 'short' | 'long' = 'short') {
    if (Platform.OS === 'android') {
      const toastDuration = duration === 'short' ? ToastAndroid.SHORT : ToastAndroid.LONG;
      ToastAndroid.show(message, toastDuration);
    } else {
      // For iOS, use a simple alert
      Alert.alert(this.getTypeTitle(type), message);
    }
  }

  /**
   * Show success message
   */
  static showSuccess(message: string, duration: 'short' | 'long' = 'short') {
    this.showToast(`✅ ${message}`, 'success', duration);
  }

  /**
   * Show error message
   */
  static showError(message: string, duration: 'short' | 'long' = 'long') {
    this.showToast(`❌ ${message}`, 'error', duration);
  }

  /**
   * Show warning message
   */
  static showWarning(message: string, duration: 'short' | 'long' = 'short') {
    this.showToast(`⚠️ ${message}`, 'warning', duration);
  }

  /**
   * Show info message
   */
  static showInfo(message: string, duration: 'short' | 'long' = 'short') {
    this.showToast(`ℹ️ ${message}`, 'info', duration);
  }

  /**
   * Show confirmation dialog
   */
  static showConfirmation(
    title: string,
    message: string,
    onConfirm: () => void,
    onCancel?: () => void,
    confirmText: string = 'Confirm',
    cancelText: string = 'Cancel'
  ) {
    Alert.alert(
      title,
      message,
      [
        {
          text: cancelText,
          style: 'cancel',
          onPress: onCancel,
        },
        {
          text: confirmText,
          style: 'default',
          onPress: onConfirm,
        },
      ]
    );
  }

  /**
   * Show loading message
   */
  static showLoading(message: string = 'Processing...') {
    // In a real app, you'd use a proper loading component
    this.showInfo(message);
  }

  /**
   * Show sharing success message
   */
  static showShareSuccess(platform?: string) {
    const message = platform 
      ? `Successfully shared to ${platform}!`
      : 'Successfully shared!';
    this.showSuccess(message);
  }

  /**
   * Show save success message
   */
  static showSaveSuccess(type: 'video' | 'gif' | 'transformation' = 'transformation') {
    const messages = {
      video: 'Video saved to your photo library!',
      gif: 'GIF saved to your photo library!',
      transformation: 'Transformation saved successfully!',
    };
    this.showSuccess(messages[type]);
  }

  /**
   * Show generation complete message
   */
  static showGenerationComplete(format: 'video' | 'gif') {
    const message = format === 'video' 
      ? '🎬 Video generation complete!'
      : '🎞️ GIF generation complete!';
    this.showSuccess(message);
  }

  /**
   * Show upload progress message
   */
  static showUploadProgress(progress: number) {
    if (progress === 100) {
      this.showSuccess('Upload complete!');
    } else {
      this.showInfo(`Uploading... ${progress}%`);
    }
  }

  /**
   * Show permission request message
   */
  static showPermissionRequest(
    permission: string,
    onGrant: () => void,
    onDeny?: () => void
  ) {
    const messages = {
      camera: 'This app needs camera access to take photos for your transformations.',
      photos: 'This app needs photo library access to save your transformations.',
      microphone: 'This app needs microphone access for video recording.',
    };

    const message = messages[permission as keyof typeof messages] || 
      `This app needs ${permission} permission to function properly.`;

    Alert.alert(
      'Permission Required',
      message,
      [
        {
          text: 'Not Now',
          style: 'cancel',
          onPress: onDeny,
        },
        {
          text: 'Allow',
          onPress: onGrant,
        },
      ]
    );
  }

  /**
   * Show network error message
   */
  static showNetworkError(onRetry?: () => void) {
    const buttons = [{ text: 'OK' }];
    
    if (onRetry) {
      buttons.unshift({
        text: 'Retry',
        onPress: onRetry,
      });
    }

    Alert.alert(
      'Connection Error',
      'Please check your internet connection and try again.',
      buttons
    );
  }

  /**
   * Show storage full message
   */
  static showStorageFullError() {
    Alert.alert(
      'Storage Full',
      'Your device is running low on storage space. Please free up some space and try again.',
      [{ text: 'OK' }]
    );
  }

  /**
   * Show generation timeout message
   */
  static showGenerationTimeout(onRetry?: () => void) {
    const buttons = [{ text: 'Cancel' }];
    
    if (onRetry) {
      buttons.push({
        text: 'Retry',
        onPress: onRetry,
      });
    }

    Alert.alert(
      'Generation Taking Too Long',
      'Video generation is taking longer than expected. This might be due to server load. Would you like to try again?',
      buttons
    );
  }

  /**
   * Show feature unavailable message
   */
  static showFeatureUnavailable(featureName: string, reason?: string) {
    const message = reason 
      ? `${featureName} is currently unavailable: ${reason}`
      : `${featureName} is currently unavailable. Please try again later.`;
    
    this.showWarning(message);
  }

  /**
   * Show update available message
   */
  static showUpdateAvailable(onUpdate: () => void, onLater?: () => void) {
    Alert.alert(
      'Update Available',
      'A new version of the app is available with improved features and bug fixes.',
      [
        {
          text: 'Later',
          style: 'cancel',
          onPress: onLater,
        },
        {
          text: 'Update',
          onPress: onUpdate,
        },
      ]
    );
  }

  /**
   * Get title for notification type
   */
  private static getTypeTitle(type: NotificationType): string {
    switch (type) {
      case 'success':
        return 'Success';
      case 'error':
        return 'Error';
      case 'warning':
        return 'Warning';
      case 'info':
      default:
        return 'Info';
    }
  }
}

/**
 * Feedback messages for different operations
 */
export const FeedbackMessages = {
  // Generation
  GENERATION_STARTED: 'Creating your transformation...',
  GENERATION_UPLOADING: 'Uploading images...',
  GENERATION_PROCESSING: 'Processing transformation...',
  GENERATION_COMPLETE: 'Transformation ready!',
  GENERATION_FAILED: 'Failed to create transformation',
  
  // Sharing
  SHARE_SUCCESS: 'Shared successfully!',
  SHARE_FAILED: 'Failed to share transformation',
  SAVE_SUCCESS: 'Saved to your device!',
  SAVE_FAILED: 'Failed to save to device',
  
  // Upload
  UPLOAD_STARTED: 'Uploading...',
  UPLOAD_COMPLETE: 'Upload complete!',
  UPLOAD_FAILED: 'Upload failed',
  
  // Network
  NETWORK_ERROR: 'Please check your internet connection',
  SERVER_ERROR: 'Server is temporarily unavailable',
  
  // Permissions
  CAMERA_PERMISSION: 'Camera access is required to take photos',
  PHOTOS_PERMISSION: 'Photo library access is required to save transformations',
  
  // Validation
  INVALID_IMAGE: 'Please select a valid image',
  IMAGES_REQUIRED: 'Both before and after images are required',
  CAPTION_TOO_LONG: 'Caption is too long (max 500 characters)',
  
  // General
  SOMETHING_WRONG: 'Something went wrong. Please try again.',
  FEATURE_COMING_SOON: 'This feature is coming soon!',
  OPERATION_CANCELLED: 'Operation was cancelled',
};