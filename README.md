# PawSpace - Pet Grooming Transformation Video App

A React Native app for creating, editing, and sharing pet grooming transformation videos with professional video generation and social media integration.

## Features

### 🎥 Video Generation & Export
- **Cloudinary Integration**: Server-side video processing for high-quality transformations
- **Multiple Transitions**: Fade, slide, zoom, dissolve, and wipe effects
- **Text Overlays**: Customizable before/after labels and service branding
- **Export Options**: Save to device or share directly to social platforms

### 📱 Preview Screen
- **Full-Screen Video Player**: Immersive viewing experience with native controls
- **Playback Controls**: Play/pause, mute, loop, and progress tracking
- **Interactive UI**: Clean, modern interface optimized for mobile

### 🚀 Publishing & Sharing
- **Multi-Platform Sharing**: Instagram, TikTok, Twitter, and internal PawSpace platform
- **Smart Captions**: Platform-specific character limits and hashtag suggestions
- **Privacy Controls**: Public/private post options
- **Service Tagging**: Link transformations to grooming services

### 📲 Social Media Integration
- **Native App Detection**: Automatically detects installed social media apps
- **Fallback Support**: Web-based sharing when native apps aren't available
- **Platform-Specific Content**: Optimized captions and hashtags for each platform

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd pawspace
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Cloudinary**
   ```bash
   cp .env.example .env
   # Edit .env with your Cloudinary credentials
   ```

4. **Start the development server**
   ```bash
   npm start
   ```

## Configuration

### Cloudinary Setup

1. Sign up for a free account at [Cloudinary](https://cloudinary.com)
2. Get your credentials from the dashboard
3. Update your `.env` file:
   ```
   EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME=your-cloud-name
   EXPO_PUBLIC_CLOUDINARY_API_KEY=your-api-key
   EXPO_PUBLIC_CLOUDINARY_API_SECRET=your-api-secret
   ```

## Usage

### Basic Video Generation

```typescript
import { generateTransformationVideo } from './src/utils/videoGeneration';

const videoUrl = await generateTransformationVideo(
  'path/to/before-image.jpg',
  'path/to/after-image.jpg',
  {
    transition: 'fade',
    duration: 3,
    fps: 30
  }
);
```

### Professional Transformation

```typescript
import { createProfessionalTransformation } from './src/utils/videoGeneration';

const videoUrl = await createProfessionalTransformation(
  beforeImageUrl,
  afterImageUrl,
  'Paws & Claws Grooming'
);
```

### Social Media Sharing

```typescript
import { socialSharingService } from './src/services';

const results = await socialSharingService.shareToMultiplePlatforms(
  videoUrl,
  {
    caption: 'Amazing transformation! 🐾',
    hashtags: ['petgrooming', 'dogmakeover'],
    platforms: ['instagram', 'tiktok'],
    privacy: 'public'
  }
);
```

## Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── VideoPlayerControls.tsx
│   └── PublishingBottomSheet.tsx
├── screens/             # App screens
│   └── create/
│       └── PreviewScreen.tsx
├── services/            # Business logic and API integrations
│   ├── cloudinary.ts    # Video generation service
│   ├── videoExport.ts   # Device export functionality
│   └── socialSharing.ts # Social media integration
├── types/               # TypeScript type definitions
│   └── video.ts
├── config/              # App configuration
│   └── cloudinary.ts
└── utils/               # Utility functions
    └── videoGeneration.ts
```

## API Reference

### CloudinaryService

```typescript
class CloudinaryService {
  async uploadImage(uri: string, folder: string): Promise<string>
  async createTransformationVideo(params: VideoParams): Promise<VideoGenerationResult>
  async applyEffects(publicId: string, effects: Effect[]): Promise<string>
}
```

### VideoExportService

```typescript
class VideoExportService {
  async saveToDevice(videoUrl: string, filename?: string): Promise<string>
  async shareVideo(videoUrl: string, options: ShareOptions): Promise<void>
  async getVideoInfo(videoUrl: string): Promise<FileSystem.FileInfo>
}
```

### SocialSharingService

```typescript
class SocialSharingService {
  async shareToMultiplePlatforms(videoUrl: string, options: PublishingOptions): Promise<{[key in Platform]?: boolean}>
  async shareToInstagram(videoUrl: string, options: PublishingOptions): Promise<boolean>
  async shareToTikTok(videoUrl: string, options: PublishingOptions): Promise<boolean>
  async shareToTwitter(videoUrl: string, options: PublishingOptions): Promise<boolean>
}
```

## Supported Platforms

- **iOS**: Full native support with optimized sharing
- **Android**: Native sharing with fallback options
- **Web**: Limited functionality, primarily for development

## Dependencies

### Core
- **React Native**: Mobile app framework
- **Expo**: Development platform and build tools
- **React Navigation**: Screen navigation

### Video & Media
- **Expo AV**: Video playback and controls
- **Expo Camera**: Image capture functionality
- **Expo Media Library**: Device storage access
- **Cloudinary**: Server-side video processing

### UI & UX
- **Expo Vector Icons**: Icon library
- **React Native Gesture Handler**: Touch interactions
- **React Native Reanimated**: Smooth animations

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support and questions:
- Create an issue on GitHub
- Email: support@pawspace.app
- Documentation: [docs.pawspace.app](https://docs.pawspace.app)

---

Made with ❤️ for pet lovers and groomers worldwide 🐾