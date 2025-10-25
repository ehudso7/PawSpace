# PawSpace Video Generation & Publishing System

A comprehensive video generation, export, and publishing system for pet transformation videos built with React Native and Expo.

## Features

### 🎥 Video Generation
- **Cloudinary Integration**: Server-side video processing for complex transformations
- **Multiple Transition Effects**: Fade, slide, zoom, dissolve, and wipe transitions
- **Text Overlays**: Customizable text with positioning, timing, and styling
- **Audio Support**: Optional audio track integration
- **Effect Processing**: Blur, brightness, contrast, saturation, vintage, and sepia effects

### 📱 Preview Screen
- **Full-Screen Video Player**: Immersive video playback experience
- **Playback Controls**: Play/pause, mute, loop, and seek functionality
- **Progress Tracking**: Real-time video generation progress with status updates
- **Responsive Design**: Optimized for various screen sizes

### 📝 Publishing Features
- **Caption Input**: 280-character limit with real-time counter
- **Hashtag Suggestions**: Smart hashtag recommendations with categories
- **Privacy Controls**: Public/private visibility options
- **Service Tags**: Integration with grooming service providers
- **Multi-Platform Sharing**: Instagram, TikTok, YouTube, Facebook, Twitter

### 💾 Export Options
- **Device Storage**: Save videos directly to device gallery
- **Quality Settings**: Multiple quality and resolution options
- **Format Support**: MP4, MOV, AVI formats
- **Compression Control**: Adjustable compression levels

## Installation

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
# Create .env file
EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
EXPO_PUBLIC_CLOUDINARY_API_KEY=your_api_key
EXPO_PUBLIC_CLOUDINARY_API_SECRET=your_api_secret
```

3. Start the development server:
```bash
npm start
```

## Project Structure

```
src/
├── components/
│   ├── ActionButtons.tsx          # Share and export action buttons
│   ├── BottomSheet.tsx            # Animated bottom sheet component
│   ├── CaptionInput.tsx           # Caption input with character counter
│   ├── HashtagSuggestions.tsx     # Hashtag recommendation system
│   ├── PrivacyToggle.tsx          # Privacy settings toggle
│   └── VideoControls.tsx          # Video player controls
├── screens/
│   └── create/
│       └── PreviewScreen.tsx      # Main preview and publishing screen
├── services/
│   └── cloudinary.ts              # Cloudinary video processing service
└── types/
    └── video.ts                   # TypeScript interfaces and types
```

## Usage

### Basic Video Generation

```typescript
import CloudinaryService from './src/services/cloudinary';

const cloudinaryService = new CloudinaryService({
  cloud_name: 'your_cloud_name',
  api_key: 'your_api_key',
  api_secret: 'your_api_secret',
});

// Generate transformation video
const videoUrl = await cloudinaryService.createTransformationVideo({
  beforeImageUrl: 'https://example.com/before.jpg',
  afterImageUrl: 'https://example.com/after.jpg',
  transition: 'fade',
  duration: 5,
  textOverlays: [{
    text: 'Before',
    position: 'top',
    fontSize: 40,
    color: 'white',
    fontFamily: 'Arial',
    startTime: 0,
    endTime: 2.5
  }],
  fps: 30
});
```

### Preview Screen Integration

```typescript
import PreviewScreen from './src/screens/create/PreviewScreen';

// Navigate to preview screen with transformation data
navigation.navigate('Preview', {
  beforeImageUri: 'file://path/to/before.jpg',
  afterImageUri: 'file://path/to/after.jpg',
  transition: 'fade',
  duration: 5,
  textOverlays: [...],
  effects: [...]
});
```

## API Reference

### CloudinaryService

#### Methods

- `uploadImage(uri: string, folder?: string): Promise<string>`
  - Uploads an image to Cloudinary
  - Returns the secure URL of the uploaded image

- `createTransformationVideo(params: VideoParams): Promise<string>`
  - Generates a transformation video from before/after images
  - Returns the video URL

- `applyEffects(publicId: string, effects: Effect[]): Promise<string>`
  - Applies visual effects to a video
  - Returns the processed video URL

- `generateThumbnail(videoUrl: string, timeOffset?: number): Promise<string>`
  - Generates a thumbnail from a video
  - Returns the thumbnail URL

### VideoParams Interface

```typescript
interface VideoParams {
  beforeImageUrl: string;        // URL of the before image
  afterImageUrl: string;         // URL of the after image
  transition: TransitionType;    // Transition effect type
  duration: number;              // Video duration in seconds
  textOverlays: TextOverlay[];   // Array of text overlays
  audioTrack?: string;           // Optional audio track URL
  fps: number;                   // Frames per second
}
```

### TextOverlay Interface

```typescript
interface TextOverlay {
  text: string;                  // Text content
  position: 'top' | 'center' | 'bottom';  // Vertical position
  fontSize: number;              // Font size in pixels
  color: string;                 // Text color (hex or named)
  fontFamily: string;            // Font family name
  startTime: number;             // Start time in seconds
  endTime: number;               // End time in seconds
}
```

## Dependencies

- **expo-av**: Video playback and recording
- **expo-file-system**: File system operations
- **expo-sharing**: Native sharing functionality
- **expo-media-library**: Access to device media library
- **react-native-gesture-handler**: Gesture handling for bottom sheet
- **react-native-reanimated**: Smooth animations
- **cloudinary**: Cloud-based video processing

## Environment Variables

Required environment variables for Cloudinary integration:

```bash
EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
EXPO_PUBLIC_CLOUDINARY_API_KEY=your_api_key
EXPO_PUBLIC_CLOUDINARY_API_SECRET=your_api_secret
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.