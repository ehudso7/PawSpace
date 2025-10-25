# Video Generation, Export, and Publishing System

A complete system for generating, exporting, and publishing pet transformation videos for PawSpace.

## Features

### ✅ Video Generation
- Server-side video processing using Cloudinary
- Before/After image transitions
- Customizable text overlays
- Multiple transition effects (fade, slide, zoom, etc.)
- Audio track support
- Adjustable FPS and duration

### ✅ Video Preview
- Full-screen video player
- Playback controls (play/pause, mute, loop)
- Progress bar with timestamps
- Video loading states

### ✅ Export & Save
- Save to device storage (iOS/Android/Web)
- Permission handling
- Progress tracking
- Error handling with user feedback

### ✅ Social Sharing
- Instagram Reels integration
- TikTok sharing
- Generic sharing (Facebook, Twitter, etc.)
- Share preview functionality
- Platform-specific optimizations

### ✅ Publishing to PawSpace
- Caption input (280 character limit)
- Service tag for grooming providers
- Hashtag suggestions (#petgrooming, #doggrooming, etc.)
- Privacy toggle (Public/Private)
- Provider attribution

## Installation

```bash
npm install
```

### Required Dependencies

```bash
npm install expo-av expo-file-system expo-media-library expo-sharing cloudinary
```

## Configuration

### 1. Cloudinary Setup

Create a Cloudinary account at https://cloudinary.com and get your credentials:

1. Sign up for a free account
2. Go to Dashboard
3. Copy your `cloud_name`, `api_key`, and `api_secret`
4. Set up an upload preset named `pet_uploads` (unsigned upload)

Update `src/config/cloudinary.config.ts`:

```typescript
export const CLOUDINARY_CONFIG = {
  cloud_name: 'your-cloud-name',
  api_key: 'your-api-key',
  api_secret: 'your-api-secret',
};
```

### 2. Environment Variables

For production, use environment variables:

```bash
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

### 3. Permissions (iOS)

Add to `Info.plist`:

```xml
<key>NSPhotoLibraryAddUsageDescription</key>
<string>Save transformation videos to your photo library</string>
<key>NSPhotoLibraryUsageDescription</key>
<string>Access photos for video transformations</string>
```

### 4. Permissions (Android)

Add to `AndroidManifest.xml`:

```xml
<uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" />
<uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" />
```

## Usage

### Basic Implementation

```typescript
import { PreviewScreen } from './src/screens/create/PreviewScreen';

// Navigate to preview screen
navigation.navigate('Preview', {
  beforeImageUrl: 'https://example.com/before.jpg',
  afterImageUrl: 'https://example.com/after.jpg',
  provider: {
    name: 'Paw Perfect Grooming',
    link: 'https://example.com/provider'
  }
});
```

### Generate Video Programmatically

```typescript
import { useVideoExport } from './src/hooks/useVideoExport';

function MyComponent() {
  const { generateVideo, isGenerating, progress } = useVideoExport();

  const handleGenerate = async () => {
    const videoUrl = await generateVideo({
      beforeImageUrl: 'https://example.com/before.jpg',
      afterImageUrl: 'https://example.com/after.jpg',
      transition: 'fade',
      duration: 6,
      textOverlays: [
        {
          text: 'Before',
          position: 'top',
          fontSize: 40,
          color: 'white',
          timestamp: 0,
          duration: 2.5,
        },
        {
          text: 'After',
          position: 'top',
          fontSize: 40,
          color: 'white',
          timestamp: 3.5,
          duration: 2.5,
        },
      ],
      fps: 30,
    });

    console.log('Video generated:', videoUrl);
  };

  return (
    <Button onPress={handleGenerate} disabled={isGenerating}>
      {isGenerating ? `Generating... ${progress}%` : 'Generate Video'}
    </Button>
  );
}
```

### Save to Device

```typescript
import { useVideoExport } from './src/hooks/useVideoExport';

function MyComponent() {
  const { saveToDevice, isExporting } = useVideoExport();

  const handleSave = async () => {
    await saveToDevice('https://cloudinary.com/video.mp4');
  };

  return (
    <Button onPress={handleSave} disabled={isExporting}>
      Save to Device
    </Button>
  );
}
```

### Share to Social Media

```typescript
import { useSocialSharing } from './src/hooks/useSocialSharing';

function MyComponent() {
  const { shareToInstagram, shareToTikTok } = useSocialSharing();

  const handleShare = async () => {
    await shareToInstagram('https://cloudinary.com/video.mp4', {
      caption: 'Amazing transformation! 🐾',
      hashtags: ['#petgrooming', '#beforeandafter'],
      isPrivate: false,
    });
  };

  return <Button onPress={handleShare}>Share to Instagram</Button>;
}
```

## Architecture

### Services

#### CloudinaryService (`src/services/cloudinary.ts`)
- Handles all Cloudinary interactions
- Image uploads
- Video generation with transformations
- Effect application
- URL generation

### Hooks

#### useVideoExport (`src/hooks/useVideoExport.ts`)
- Video generation management
- Export to device functionality
- Progress tracking
- Error handling

#### useSocialSharing (`src/hooks/useSocialSharing.ts`)
- Instagram Reels sharing
- TikTok sharing
- Generic social sharing
- Platform detection and handling

### Components

#### VideoPlayer (`src/components/video/VideoPlayer.tsx`)
- Full-featured video player
- Playback controls
- Progress bar
- Loop and mute options

#### PublishBottomSheet (`src/components/video/PublishBottomSheet.tsx`)
- Caption input with character limit
- Service tag display
- Hashtag suggestions
- Privacy toggle
- Publish button

#### PreviewScreen (`src/screens/create/PreviewScreen.tsx`)
- Main preview interface
- Video player integration
- Action buttons (Save, Post, Share)
- Bottom sheet management
- Navigation handling

## API Reference

### VideoParams

```typescript
interface VideoParams {
  beforeImageUrl: string;        // URL or local URI
  afterImageUrl: string;         // URL or local URI
  transition: TransitionType;    // 'fade' | 'slide' | 'zoom' | 'dissolve' | 'wipe' | 'none'
  duration: number;              // Total duration in seconds
  textOverlays: TextOverlay[];   // Array of text overlays
  audioTrack?: string;           // Optional audio track URL
  fps: number;                   // Frames per second (e.g., 30)
}
```

### TextOverlay

```typescript
interface TextOverlay {
  text: string;                  // Text content
  position: 'top' | 'center' | 'bottom';
  fontFamily?: string;           // Default: 'Arial'
  fontSize?: number;             // Default: 40
  color?: string;                // Default: 'white'
  timestamp: number;             // When to show (in seconds)
  duration: number;              // How long to show (in seconds)
}
```

### PublishOptions

```typescript
interface PublishOptions {
  caption: string;               // Max 280 characters
  serviceTag?: string;           // Service provider attribution
  hashtags: string[];            // Array of hashtags
  isPrivate: boolean;            // Privacy setting
  provider?: {
    name: string;
    link: string;
  };
}
```

## Cloudinary Transformation Examples

### Basic Video Generation

```
https://res.cloudinary.com/demo/video/upload/
  fps_30,du_6/
  e_transition:fade:duration_2.0/
  l_text:Arial_40:Before/
  transformation_video.mp4
```

### With Effects

```
https://res.cloudinary.com/demo/video/upload/
  e_brightness:20,e_contrast:10/
  fps_30,du_6/
  transformation_video.mp4
```

## Troubleshooting

### Video Not Generating
1. Check Cloudinary credentials
2. Verify image URLs are accessible
3. Check network connectivity
4. Review Cloudinary dashboard for errors

### Save to Device Fails
1. Ensure permissions are granted
2. Check storage space
3. Verify file system access
4. Check platform-specific requirements

### Social Sharing Issues
1. Verify app is installed (Instagram/TikTok)
2. Check platform-specific URL schemes
3. Ensure file is accessible locally
4. Review platform sharing guidelines

## Performance Optimization

1. **Video Generation**: Done server-side for optimal performance
2. **Caching**: Videos are cached locally after download
3. **Progress Tracking**: Real-time updates during generation/export
4. **Error Recovery**: Automatic retry logic for network failures

## Security Considerations

1. **API Keys**: Never commit API keys to version control
2. **Permissions**: Request permissions just-in-time
3. **File Storage**: Clean up temporary files
4. **Privacy**: Respect user privacy settings

## Future Enhancements

- [ ] Multiple transition types
- [ ] Advanced effects (filters, stickers)
- [ ] Music library integration
- [ ] Batch video generation
- [ ] Video editing capabilities
- [ ] Draft saving
- [ ] Scheduled posting
- [ ] Analytics tracking

## License

MIT

## Support

For issues or questions, contact: support@pawspace.com
