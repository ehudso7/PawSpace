# PawSpace - Video Transformation App

A React Native/Expo app for creating stunning before/after transformation videos and GIFs with advanced sharing capabilities.

## 🎬 Features

### Video Generation Flow
- **Smart Upload**: Automatic image optimization and Cloudinary integration
- **Multiple Formats**: Generate both videos (MP4) and animated GIFs
- **Transition Effects**: Crossfade, slide, zoom, morph, and wipe transitions
- **Real-time Progress**: Live progress tracking with estimated completion times
- **Fallback Options**: Local GIF generation when cloud services are unavailable

### Sharing & Export
- **Native Sharing**: Integration with device share sheet
- **Social Media**: Direct sharing to Instagram Stories, TikTok, and Snapchat
- **Device Storage**: Save to photo library with proper album organization
- **Quality Options**: Auto, low, medium, and high quality exports

### User Experience
- **Loading States**: Beautiful progress indicators and status messages
- **Error Handling**: Comprehensive error recovery with user-friendly messages
- **Offline Support**: Local GIF generation when network is unavailable
- **Permission Management**: Graceful permission requests and fallbacks

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm/yarn
- Expo CLI: `npm install -g @expo/cli`
- iOS Simulator (Mac) or Android Studio (for testing)

### Installation

1. **Clone and install dependencies**
```bash
git clone <repository-url>
cd pawspace-transformations
npm install
```

2. **Configure environment variables**
Create a `.env` file in the root directory:
```env
EXPO_PUBLIC_API_URL=https://your-api-url.com/api
EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME=your-cloud-name
EXPO_PUBLIC_CLOUDINARY_API_KEY=your-api-key
EXPO_PUBLIC_CLOUDINARY_API_SECRET=your-api-secret
EXPO_PUBLIC_CLOUDINARY_UPLOAD_PRESET=your-upload-preset
```

3. **Start the development server**
```bash
npm start
```

4. **Run on device/simulator**
```bash
# iOS
npm run ios

# Android
npm run android
```

## 📱 Usage Examples

### Basic Video Generation

```typescript
import { useServices } from '@/services';
import { useVideoGeneration } from '@/hooks/useVideoGeneration';

const MyComponent = () => {
  const { transformationsService, gifGeneratorService } = useServices();
  const { generateVideo, isGenerating, progress, result } = useVideoGeneration(
    transformationsService,
    gifGeneratorService
  );

  const handleCreateVideo = async () => {
    await generateVideo(beforeImageUri, afterImageUri, {
      transition_type: 'crossfade',
      duration_seconds: 3,
      has_music: false,
      format: 'video',
      quality: 'auto',
    });
  };

  return (
    <View>
      <TouchableOpacity onPress={handleCreateVideo} disabled={isGenerating}>
        <Text>Create Video</Text>
      </TouchableOpacity>
      
      {isGenerating && progress && (
        <VideoGenerationProgress progress={progress} />
      )}
      
      {result?.success && (
        <Video source={{ uri: result.url }} />
      )}
    </View>
  );
};
```

### Sharing Functionality

```typescript
import { SharingService } from '@/services';

const sharingService = new SharingService();

// Share with native share sheet
await sharingService.shareTransformation(
  videoUri,
  'Check out my amazing transformation!'
);

// Share to specific platform
await sharingService.shareToSocial('instagram', videoUri, caption);

// Save to device
await sharingService.saveToDevice(videoUri);

// Show share options dialog
await sharingService.showShareOptions(videoUri, caption);
```

### Error Handling

```typescript
import { ErrorHandler, withErrorHandling } from '@/utils/errorHandler';

// Wrap async operations with error handling
const safeGenerateVideo = withErrorHandling(
  generateVideo,
  'video generation'
);

try {
  await safeGenerateVideo(beforeUri, afterUri, options);
} catch (error) {
  // Error is automatically handled and displayed to user
  console.log('Generation failed:', error.message);
}
```

## 🏗️ Architecture

### Service Layer
- **CloudinaryService**: Image upload and video generation via Cloudinary API
- **TransformationsService**: Backend API integration for saving/sharing transformations
- **GIFGeneratorService**: Local GIF generation using expo-image-manipulator
- **SharingService**: Cross-platform sharing and social media integration

### Component Structure
```
src/
├── components/           # Reusable UI components
│   └── VideoGenerationProgress.tsx
├── screens/             # Screen components
│   └── PreviewScreen.tsx
├── services/            # Business logic and API integration
│   ├── cloudinary.ts
│   ├── transformations.ts
│   ├── gifGenerator.ts
│   └── sharing.ts
├── hooks/               # Custom React hooks
│   └── useVideoGeneration.ts
├── types/               # TypeScript type definitions
│   ├── transformation.ts
│   └── api.ts
└── utils/               # Utility functions
    ├── errorHandler.ts
    ├── validation.ts
    └── notifications.ts
```

### State Management
- **Local State**: React hooks for component-level state
- **Service Container**: Dependency injection for service management
- **Error Boundaries**: Global error handling and recovery

## 🔧 Configuration

### Cloudinary Setup
1. Create a Cloudinary account at [cloudinary.com](https://cloudinary.com)
2. Get your cloud name, API key, and API secret from the dashboard
3. Create an upload preset for unsigned uploads
4. Configure video transformation settings in your Cloudinary console

### Backend API
The app expects a REST API with the following endpoints:

```
POST /transformations              # Create new transformation
GET  /transformations/me           # Get user's transformations
DELETE /transformations/:id        # Delete transformation
POST /transformations/:id/share    # Share transformation
POST /transformations/draft        # Save draft
```

### Environment Variables
```env
# API Configuration
EXPO_PUBLIC_API_URL=https://your-api.com/api

# Cloudinary Configuration
EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME=your-cloud-name
EXPO_PUBLIC_CLOUDINARY_API_KEY=your-api-key
EXPO_PUBLIC_CLOUDINARY_API_SECRET=your-api-secret
EXPO_PUBLIC_CLOUDINARY_UPLOAD_PRESET=your-preset

# Optional: Analytics and monitoring
EXPO_PUBLIC_SENTRY_DSN=your-sentry-dsn
EXPO_PUBLIC_ANALYTICS_KEY=your-analytics-key
```

## 📋 API Reference

### Video Generation Options
```typescript
interface VideoGenerationOptions {
  transition_type: 'crossfade' | 'slide' | 'zoom' | 'morph' | 'wipe';
  duration_seconds: number;        // 1-30 seconds
  has_music: boolean;
  format: 'video' | 'gif';
  quality: 'auto' | 'low' | 'medium' | 'high';
}
```

### Progress Tracking
```typescript
interface VideoGenerationProgress {
  stage: 'uploading' | 'processing' | 'generating' | 'finalizing' | 'complete' | 'error';
  progress: number;                // 0-100
  message: string;
  estimated_time_remaining?: number; // seconds
}
```

### Share Options
```typescript
interface ShareOptions {
  platform?: 'instagram' | 'tiktok' | 'snapchat';
  save_to_device: boolean;
  include_watermark: boolean;
  custom_caption?: string;
}
```

## 🧪 Testing

### Run Tests
```bash
# Unit tests
npm test

# E2E tests (requires detox setup)
npm run test:e2e

# Type checking
npm run type-check
```

### Test Coverage
- Service layer unit tests
- Component rendering tests
- Integration tests for video generation flow
- Error handling scenarios

## 🚀 Deployment

### Build for Production
```bash
# Create production build
expo build:ios
expo build:android

# Or using EAS Build (recommended)
eas build --platform all
```

### Environment Setup
1. **Staging**: Use test Cloudinary account and staging API
2. **Production**: Use production Cloudinary account and live API
3. **Analytics**: Configure Sentry for error tracking

## 🔒 Security Considerations

### API Security
- Never expose Cloudinary API secret in client code
- Use signed uploads for production
- Implement rate limiting on backend APIs
- Validate all user inputs

### Privacy
- Request minimal permissions required
- Clear temporary files after processing
- Respect user's sharing preferences
- Implement proper data deletion

## 🐛 Troubleshooting

### Common Issues

**Video generation fails**
- Check Cloudinary configuration and quotas
- Verify image formats are supported (JPG, PNG, WebP)
- Ensure stable internet connection

**Sharing not working**
- Verify app permissions for photo library
- Check if target social media apps are installed
- Test with different file formats

**Performance issues**
- Reduce image resolution before processing
- Use appropriate quality settings
- Clear temporary files regularly

### Debug Mode
Enable debug logging by setting:
```env
EXPO_PUBLIC_DEBUG=true
```

## 📄 License

MIT License - see LICENSE file for details

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes with tests
4. Submit a pull request

## 📞 Support

- 📧 Email: support@pawspace.com
- 📱 Discord: [PawSpace Community](https://discord.gg/pawspace)
- 🐛 Issues: [GitHub Issues](https://github.com/pawspace/transformations/issues)