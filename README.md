# PawSpace - Video Transformation & Sharing System

Complete implementation of video/GIF generation and sharing functionality for pet transformation showcases.

## 📁 Project Structure

```
src/
├── types/
│   └── transformation.ts          # TypeScript interfaces and types
├── config/
│   └── cloudinary.ts             # Cloudinary configuration
├── services/
│   ├── cloudinary.ts             # Cloudinary API integration
│   ├── gifGenerator.ts           # Local GIF generation (fallback)
│   ├── videoGeneration.ts        # Main video generation orchestrator
│   ├── transformations.ts        # CRUD API for transformations
│   └── sharing.ts                # Social media & device sharing
├── screens/
│   └── PreviewScreen.tsx         # Preview UI with progress tracking
├── hooks/
│   └── useLoadingState.ts        # Custom loading state hook
├── utils/
│   └── errorHandler.ts           # Centralized error handling
└── examples/
    └── usage.tsx                 # Usage examples and integration guide
```

## 🚀 Features

### 1. Video Generation Flow
- ✅ Upload before/after images to Cloudinary
- ✅ Generate transformation video with effects
- ✅ Poll for completion (30-60 seconds)
- ✅ Real-time progress tracking (0-100%)
- ✅ Multiple transition types (fade, slide, zoom, swipe)
- ✅ Estimated time remaining

### 2. GIF Generation (Fallback)
- ✅ Fast local processing using expo-image-manipulator
- ✅ Crossfade transition effect
- ✅ Frame-based animation (10 frames)
- ✅ Upload to Cloudinary for hosting

### 3. Sharing & Export
- ✅ Native share sheet (all platforms)
- ✅ Instagram Stories integration
- ✅ TikTok sharing
- ✅ Save to device gallery
- ✅ Platform availability detection
- ✅ Share tracking/analytics

### 4. Transformations API
- ✅ Create transformation
- ✅ Save draft
- ✅ Get my transformations (paginated)
- ✅ Get public feed
- ✅ Like/unlike
- ✅ Delete transformation
- ✅ Update transformation

### 5. UI Components
- ✅ Beautiful loading screen with gradient
- ✅ Circular progress indicator
- ✅ Progress bar
- ✅ Status messages
- ✅ Error states with retry
- ✅ Video/GIF preview
- ✅ Share buttons with icons

### 6. Error Handling
- ✅ Typed error codes
- ✅ User-friendly messages
- ✅ Retry logic
- ✅ Permission handling
- ✅ Error logging
- ✅ Alert dialogs

## 📦 Dependencies

```json
{
  "dependencies": {
    "expo": "^50.0.0",
    "expo-av": "~13.10.0",
    "expo-image": "~1.10.0",
    "expo-image-manipulator": "~11.8.0",
    "expo-sharing": "~11.10.0",
    "expo-media-library": "~15.9.0",
    "expo-file-system": "~16.0.0",
    "expo-linear-gradient": "~12.7.0",
    "react-native": "0.73.0"
  }
}
```

## 🔧 Configuration

### Environment Variables

Create `.env` file:

```bash
# Cloudinary Configuration
EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
EXPO_PUBLIC_CLOUDINARY_API_KEY=your_api_key
EXPO_PUBLIC_CLOUDINARY_API_SECRET=your_api_secret
EXPO_PUBLIC_CLOUDINARY_UPLOAD_PRESET=pawspace_transformations

# API Configuration
EXPO_PUBLIC_API_URL=https://api.pawspace.com
```

### Cloudinary Setup

1. Create Cloudinary account
2. Enable video transformations
3. Create upload preset: `pawspace_transformations`
4. Set folder structure: `/transformations/videos/`
5. Configure transformation templates

## 💡 Usage Examples

### Basic Preview Screen

```tsx
import { PreviewScreen } from './screens/PreviewScreen';

<PreviewScreen
  beforeImageUri="file:///path/to/before.jpg"
  afterImageUri="file:///path/to/after.jpg"
  caption="Amazing transformation! 🐶✨"
  transitionType="fade"
  isPublic={true}
  hasMusic={false}
  onComplete={() => console.log('Done!')}
  onCancel={() => console.log('Cancelled')}
/>
```

### Manual Video Generation

```tsx
import { videoGenerationService } from './services/videoGeneration';

const result = await videoGenerationService.generateTransformation(
  beforeUri,
  afterUri,
  {
    transitionType: 'crossfade',
    duration: 3,
    hasMusic: false,
    mode: 'auto', // 'video' | 'gif' | 'auto'
  },
  (progress) => {
    console.log(`${progress.message} - ${progress.progress}%`);
  }
);

console.log('Video URL:', result.videoUrl);
```

### Share to Instagram

```tsx
import { sharingService } from './services/sharing';

await sharingService.shareToInstagram({
  videoUri: result.videoUrl,
  caption: 'Check out my transformation! #PawSpace',
  transformationId: transformation.id,
});
```

### Save to Gallery

```tsx
await sharingService.saveToDevice(result.videoUrl);
```

## 🎨 UI Customization

The `PreviewScreen` component includes:

- **Loading State**: Animated gradient background with progress circle
- **Preview State**: Video player with share options
- **Error State**: Retry button and user-friendly messages

Customize colors in `PreviewScreen.tsx`:

```tsx
// Loading gradient colors
<LinearGradient colors={['#667eea', '#764ba2']}>

// Primary button color
backgroundColor: '#667eea'
```

## 🔄 Video Generation Flow

```
1. User taps "Preview"
   ↓
2. Show loading screen: "Creating your transformation…"
   ↓
3. Upload before/after images to Cloudinary (0-20%)
   ↓
4. Generate video with transformations (20-50%)
   ↓
5. Poll for completion every 1 second (50-90%)
   ↓
6. Download video URL (90-100%)
   ↓
7. Display in PreviewScreen with share options
```

## 🎯 Transition Types

- **fade**: Smooth crossfade transition
- **slide**: Sliding reveal effect
- **zoom**: Zoom-in transition
- **swipe**: Wipe/swipe effect
- **crossfade**: Blended fade (same as fade)

## 📊 Progress Tracking

```tsx
interface VideoGenerationProgress {
  status: 'uploading' | 'processing' | 'completed' | 'failed';
  progress: number; // 0-100
  message: string;
  estimated_time_remaining?: number; // seconds
}
```

## 🛡️ Error Handling

```tsx
import { errorHandler, withRetry } from './utils/errorHandler';

// Automatic retry with backoff
const result = await withRetry(
  () => videoGenerationService.generateTransformation(...),
  3, // max attempts
  1000 // delay ms
);

// Manual error handling
try {
  await generateVideo();
} catch (error) {
  errorHandler.handleError(error, 'video-generation', () => {
    // Retry callback
  });
}
```

## 📱 Platform Support

- **iOS**: Full support for sharing, media library, camera
- **Android**: Full support for sharing, media library, camera
- **Web**: Limited (no media library, camera)

## 🔐 Permissions Required

```tsx
// Camera (for taking photos)
expo-camera

// Media Library (for saving to gallery)
expo-media-library

// Storage (Android)
android.permission.WRITE_EXTERNAL_STORAGE
```

## 🚦 API Endpoints

### Transformations Service

```
POST   /api/transformations           # Create transformation
GET    /api/transformations/me        # Get my transformations
GET    /api/transformations/feed      # Get public feed
GET    /api/transformations/:id       # Get single transformation
PATCH  /api/transformations/:id       # Update transformation
DELETE /api/transformations/:id       # Delete transformation
POST   /api/transformations/:id/like  # Like transformation
POST   /api/transformations/:id/share # Track share

POST   /api/transformations/drafts    # Save draft
GET    /api/transformations/drafts    # Get drafts
DELETE /api/transformations/drafts/:id # Delete draft
```

## 🎭 Testing

### Test Video Generation

```tsx
// Test with sample images
const testGeneration = async () => {
  const result = await videoGenerationService.generateTransformation(
    'https://example.com/before.jpg',
    'https://example.com/after.jpg',
    { transitionType: 'fade', duration: 2, mode: 'gif' },
    (p) => console.log(p.message)
  );
  console.log(result);
};
```

### Test Sharing

```tsx
// Test share availability
const testSharing = async () => {
  const platforms = await sharingService.getAvailablePlatforms();
  console.log('Available:', platforms);
  
  const hasIG = await sharingService.isPlatformInstalled('instagram');
  console.log('Instagram installed:', hasIG);
};
```

## 🐛 Troubleshooting

### Video Generation Timeout
- Increase poll timeout in `cloudinaryService.pollVideoStatus`
- Try GIF mode instead: `mode: 'gif'`

### Upload Failed
- Check file size (max 10MB recommended)
- Verify Cloudinary credentials
- Check network connection

### Share Not Working
- Verify app is installed (Instagram/TikTok)
- Check permissions granted
- Test with native share sheet first

## 📈 Performance Optimization

- **GIF Mode**: ~10 seconds (faster)
- **Video Mode**: ~30-60 seconds (better quality)
- **Auto Mode**: Chooses based on duration

### Tips
1. Use GIF for duration < 3 seconds
2. Compress images before upload
3. Cache generated videos
4. Show preview during generation

## 🔮 Future Enhancements

- [ ] Add music/audio tracks
- [ ] More transition effects
- [ ] Text overlays
- [ ] Filters and effects
- [ ] Batch processing
- [ ] Background processing
- [ ] Offline queue
- [ ] Video trimming

## 📝 License

MIT

---

**Built with ❤️ for PawSpace**
