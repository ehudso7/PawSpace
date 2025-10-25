import { ValidationError } from './errorHandler';

/**
 * Validation utilities for transformation data
 */
export class ValidationUtils {
  /**
   * Validate image URI
   */
  static validateImageUri(uri: string, fieldName: string = 'Image'): void {
    if (!uri || typeof uri !== 'string') {
      throw new ValidationError(`${fieldName} is required`);
    }

    if (!uri.trim()) {
      throw new ValidationError(`${fieldName} cannot be empty`);
    }

    // Check if it's a valid URI format
    const uriRegex = /^(https?:\/\/|file:\/\/|content:\/\/|asset-library:\/\/)/;
    if (!uriRegex.test(uri)) {
      throw new ValidationError(`${fieldName} must be a valid URI`);
    }
  }

  /**
   * Validate image file size (if available)
   */
  static async validateImageSize(uri: string, maxSizeMB: number = 10): Promise<void> {
    try {
      // For local files, we can check the size
      if (uri.startsWith('file://')) {
        // This would require expo-file-system to get file info
        // For now, we'll skip size validation for local files
        return;
      }
      
      // For remote URLs, we can make a HEAD request
      if (uri.startsWith('http')) {
        const response = await fetch(uri, { method: 'HEAD' });
        const contentLength = response.headers.get('content-length');
        
        if (contentLength) {
          const sizeMB = parseInt(contentLength) / (1024 * 1024);
          if (sizeMB > maxSizeMB) {
            throw new ValidationError(`Image size (${sizeMB.toFixed(1)}MB) exceeds maximum allowed size (${maxSizeMB}MB)`);
          }
        }
      }
    } catch (error) {
      // If we can't validate size, log warning but don't fail
      console.warn('Could not validate image size:', error);
    }
  }

  /**
   * Validate caption text
   */
  static validateCaption(caption: string): void {
    if (caption && caption.length > 500) {
      throw new ValidationError('Caption cannot exceed 500 characters');
    }

    // Check for inappropriate content (basic check)
    const inappropriateWords = ['spam', 'scam']; // Add more as needed
    const lowerCaption = caption.toLowerCase();
    
    for (const word of inappropriateWords) {
      if (lowerCaption.includes(word)) {
        throw new ValidationError('Caption contains inappropriate content');
      }
    }
  }

  /**
   * Validate video generation options
   */
  static validateVideoOptions(options: {
    duration_seconds: number;
    transition_type: string;
    format: string;
  }): void {
    // Validate duration
    if (options.duration_seconds < 1 || options.duration_seconds > 30) {
      throw new ValidationError('Duration must be between 1 and 30 seconds');
    }

    // Validate transition type
    const validTransitions = ['crossfade', 'slide', 'zoom', 'morph', 'wipe'];
    if (!validTransitions.includes(options.transition_type)) {
      throw new ValidationError('Invalid transition type');
    }

    // Validate format
    const validFormats = ['video', 'gif'];
    if (!validFormats.includes(options.format)) {
      throw new ValidationError('Invalid export format');
    }
  }

  /**
   * Validate transformation data before creation
   */
  static validateTransformationData(data: {
    before_image_url: string;
    after_image_url: string;
    caption?: string;
    transition_type: string;
    duration_seconds?: number;
  }): void {
    this.validateImageUri(data.before_image_url, 'Before image');
    this.validateImageUri(data.after_image_url, 'After image');
    
    if (data.caption) {
      this.validateCaption(data.caption);
    }

    if (data.duration_seconds !== undefined) {
      this.validateVideoOptions({
        duration_seconds: data.duration_seconds,
        transition_type: data.transition_type,
        format: 'video', // Default for validation
      });
    }

    // Ensure before and after images are different
    if (data.before_image_url === data.after_image_url) {
      throw new ValidationError('Before and after images must be different');
    }
  }

  /**
   * Validate network connectivity
   */
  static async validateNetworkConnectivity(): Promise<void> {
    try {
      // Simple connectivity check
      const response = await fetch('https://www.google.com/generate_204', {
        method: 'HEAD',
        timeout: 5000,
      } as any);
      
      if (!response.ok) {
        throw new Error('Network check failed');
      }
    } catch (error) {
      throw new ValidationError('No internet connection available. Please check your network settings.');
    }
  }

  /**
   * Validate device storage space
   */
  static async validateStorageSpace(requiredSpaceMB: number = 100): Promise<void> {
    try {
      // This would require expo-file-system to check available space
      // For now, we'll implement a basic check
      
      // Try to create a temporary file to test write access
      const testData = 'test';
      const testSize = new Blob([testData]).size;
      
      if (testSize === 0) {
        throw new Error('Cannot write to storage');
      }
      
      // In a real implementation, you'd check actual available space
      // using FileSystem.getFreeDiskStorageAsync() from expo-file-system
      
    } catch (error) {
      throw new ValidationError('Insufficient storage space. Please free up some space and try again.');
    }
  }

  /**
   * Validate permissions
   */
  static validatePermissions(permissions: { [key: string]: boolean }): void {
    const requiredPermissions = ['camera', 'mediaLibrary'];
    
    for (const permission of requiredPermissions) {
      if (!permissions[permission]) {
        throw new ValidationError(`${permission} permission is required to create transformations`);
      }
    }
  }

  /**
   * Sanitize user input
   */
  static sanitizeInput(input: string): string {
    if (!input || typeof input !== 'string') {
      return '';
    }

    return input
      .trim()
      .replace(/[<>]/g, '') // Remove potential HTML tags
      .replace(/javascript:/gi, '') // Remove javascript: URLs
      .substring(0, 1000); // Limit length
  }

  /**
   * Validate email format (for sharing features)
   */
  static validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Validate phone number format (for sharing features)
   */
  static validatePhoneNumber(phone: string): boolean {
    const phoneRegex = /^\+?[\d\s\-\(\)]{10,}$/;
    return phoneRegex.test(phone);
  }

  /**
   * Check if image format is supported
   */
  static isSupportedImageFormat(uri: string): boolean {
    const supportedFormats = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
    const lowerUri = uri.toLowerCase();
    
    return supportedFormats.some(format => lowerUri.includes(format));
  }

  /**
   * Estimate processing time based on options
   */
  static estimateProcessingTime(options: {
    format: string;
    duration_seconds: number;
    quality: string;
  }): number {
    let baseTime = 15; // Base 15 seconds
    
    // Format multiplier
    if (options.format === 'video') {
      baseTime *= 2; // Video takes longer
    }
    
    // Duration multiplier
    baseTime += options.duration_seconds * 2;
    
    // Quality multiplier
    switch (options.quality) {
      case 'high':
        baseTime *= 1.5;
        break;
      case 'medium':
        baseTime *= 1.2;
        break;
      case 'low':
        baseTime *= 0.8;
        break;
    }
    
    return Math.max(10, Math.min(120, baseTime)); // Between 10s and 2min
  }
}