import CloudinaryService from './cloudinary';
import TransformationsService from './transformations';
import GIFGeneratorService from './gifGenerator';
import SharingService from './sharing';
import { CloudinaryConfig } from '../types/api';

/**
 * Service configuration interface
 */
interface ServiceConfig {
  apiBaseUrl: string;
  cloudinary: CloudinaryConfig;
}

/**
 * Service container for dependency injection
 */
export class ServiceContainer {
  private static instance: ServiceContainer;
  
  public cloudinaryService: CloudinaryService;
  public transformationsService: TransformationsService;
  public gifGeneratorService: GIFGeneratorService;
  public sharingService: SharingService;

  private constructor(config: ServiceConfig) {
    // Initialize Cloudinary service
    this.cloudinaryService = new CloudinaryService(config.cloudinary);
    
    // Initialize transformations service with Cloudinary dependency
    this.transformationsService = new TransformationsService(
      config.apiBaseUrl,
      this.cloudinaryService
    );
    
    // Initialize other services
    this.gifGeneratorService = new GIFGeneratorService();
    this.sharingService = new SharingService();
  }

  /**
   * Initialize the service container (call once at app startup)
   */
  static initialize(config: ServiceConfig): ServiceContainer {
    if (!ServiceContainer.instance) {
      ServiceContainer.instance = new ServiceContainer(config);
    }
    return ServiceContainer.instance;
  }

  /**
   * Get the singleton instance
   */
  static getInstance(): ServiceContainer {
    if (!ServiceContainer.instance) {
      throw new Error('ServiceContainer not initialized. Call initialize() first.');
    }
    return ServiceContainer.instance;
  }

  /**
   * Clean up resources
   */
  async cleanup(): Promise<void> {
    await Promise.all([
      this.gifGeneratorService.cleanup(),
      this.sharingService.cleanup(),
    ]);
  }
}

/**
 * Default configuration (should be moved to environment variables in production)
 */
export const defaultConfig: ServiceConfig = {
  apiBaseUrl: process.env.EXPO_PUBLIC_API_URL || 'https://your-api-url.com/api',
  cloudinary: {
    cloud_name: process.env.EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME || 'your-cloud-name',
    api_key: process.env.EXPO_PUBLIC_CLOUDINARY_API_KEY || 'your-api-key',
    api_secret: process.env.EXPO_PUBLIC_CLOUDINARY_API_SECRET || 'your-api-secret',
    upload_preset: process.env.EXPO_PUBLIC_CLOUDINARY_UPLOAD_PRESET || 'your-upload-preset',
  },
};

/**
 * Hook to get services in React components
 */
export const useServices = () => {
  return ServiceContainer.getInstance();
};

// Export individual services for direct access if needed
export {
  CloudinaryService,
  TransformationsService,
  GIFGeneratorService,
  SharingService,
};