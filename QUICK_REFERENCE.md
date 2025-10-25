# Quick Reference Guide

## 🚀 Quick Start

```bash
npm install
cp .env.example .env
# Edit .env with your Cloudinary credentials
npm start
```

## 📝 Common Code Snippets

### Generate a Video

```typescript
import { useVideoExport } from './src/hooks/useVideoExport';

const { generateVideo, isGenerating, progress } = useVideoExport();

const videoUrl = await generateVideo({
  beforeImageUrl: 'https://example.com/before.jpg',
  afterImageUrl: 'https://example.com/after.jpg',
  transition: 'fade',
  duration: 6,
  textOverlays: [
    { text: 'Before', position: 'top', timestamp: 0, duration: 2.5 },
    { text: 'After', position: 'top', timestamp: 3.5, duration: 2.5 },
  ],
  fps: 30,
});
```

### Save to Device

```typescript
import { useVideoExport } from './src/hooks/useVideoExport';

const { saveToDevice, isExporting } = useVideoExport();

await saveToDevice(videoUrl);
```

### Share to Instagram

```typescript
import { useSocialSharing } from './src/hooks/useSocialSharing';

const { shareToInstagram, isSharing } = useSocialSharing();

await shareToInstagram(videoUrl, {
  caption: 'Amazing transformation! 🐾',
  hashtags: ['#petgrooming', '#beforeandafter'],
  isPrivate: false,
});
```

### Navigate to Preview Screen

```typescript
navigation.navigate('Preview', {
  beforeImageUrl: 'https://example.com/before.jpg',
  afterImageUrl: 'https://example.com/after.jpg',
  provider: {
    name: 'Paw Perfect Grooming',
    link: 'https://example.com',
  },
});
```

## 🎨 Customization Examples

### Custom Text Overlay

```typescript
textOverlays: [
  {
    text: '✨ Glow Up Time! ✨',
    position: 'center',
    fontFamily: 'Arial',
    fontSize: 48,
    color: '#FFD700',
    timestamp: 1,
    duration: 3,
  },
]
```

### Apply Effects

```typescript
import { getCloudinaryService } from './src/services/cloudinary';

const cloudinary = getCloudinaryService();
const videoUrl = await cloudinary.applyEffects(publicId, [
  { type: 'brightness', intensity: 20 },
  { type: 'contrast', intensity: 10 },
]);
```

### Different Transitions

```typescript
// Fade transition
transition: 'fade'

// Slide transition
transition: 'slide'

// Zoom transition
transition: 'zoom'

// Dissolve transition
transition: 'dissolve'

// Wipe transition
transition: 'wipe'

// No transition
transition: 'none'
```

## 🔧 Configuration

### Cloudinary Setup

```typescript
// src/config/cloudinary.config.ts
export const CLOUDINARY_CONFIG = {
  cloud_name: 'your-cloud-name',
  api_key: 'your-api-key',
  api_secret: 'your-api-secret',
};
```

### Initialize in App

```typescript
// App.tsx
import { initializeCloudinary } from './src/services/cloudinary';
import { CLOUDINARY_CONFIG } from './src/config/cloudinary.config';

initializeCloudinary(CLOUDINARY_CONFIG);
```

## 📱 Platform-Specific Code

### iOS Permissions

```xml
<!-- Info.plist -->
<key>NSPhotoLibraryAddUsageDescription</key>
<string>Save transformation videos</string>
```

### Android Permissions

```xml
<!-- AndroidManifest.xml -->
<uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" />
```

### Web Download

```typescript
// Automatically handled in useVideoExport hook
// Uses browser download API
```

## 🎯 Constants

### Video Settings

```typescript
import { VIDEO_SETTINGS } from './src/constants';

VIDEO_SETTINGS.MIN_DURATION // 3
VIDEO_SETTINGS.MAX_DURATION // 30
VIDEO_SETTINGS.DEFAULT_FPS  // 30
```

### Hashtags

```typescript
import { HASHTAG_SETTINGS } from './src/constants';

HASHTAG_SETTINGS.SUGGESTED // Array of suggested hashtags
```

### Colors

```typescript
import { COLORS } from './src/constants';

COLORS.primary           // '#4CAF50'
COLORS.text.primary      // '#333333'
COLORS.background.overlay // 'rgba(0, 0, 0, 0.5)'
```

## 🔍 Error Handling

### Try-Catch Pattern

```typescript
try {
  const videoUrl = await generateVideo({...});
  // Success
} catch (error) {
  console.error('Generation failed:', error);
  Alert.alert('Error', 'Failed to generate video');
}
```

### Error States

```typescript
const { error, clearError } = useVideoExport();

useEffect(() => {
  if (error) {
    Alert.alert('Error', error, [
      { text: 'OK', onPress: clearError },
    ]);
  }
}, [error]);
```

## 📊 Progress Tracking

```typescript
const { progress, isGenerating } = useVideoExport();

{isGenerating && (
  <Text>Generating... {progress}%</Text>
)}
```

## 🧪 Testing

### Test Video Generation

```typescript
it('should generate video', async () => {
  const { result } = renderHook(() => useVideoExport());
  
  await act(async () => {
    const url = await result.current.generateVideo({
      beforeImageUrl: 'test.jpg',
      afterImageUrl: 'test2.jpg',
      transition: 'fade',
      duration: 6,
      textOverlays: [],
      fps: 30,
    });
    
    expect(url).toBeDefined();
  });
});
```

## 🎬 Video Specs

### Recommended Settings

```typescript
{
  fps: 30,              // Frames per second
  duration: 6,          // Seconds
  resolution: '1080p',  // 1920x1080
  format: 'mp4',        // MP4 format
}
```

### File Size Estimates

```typescript
import { estimateVideoSize } from './src/utils/video.utils';

const size = estimateVideoSize(6, 30, '1080p'); // ~6 MB
```

## 🔗 Useful Links

- Cloudinary: https://cloudinary.com
- Expo AV: https://docs.expo.dev/versions/latest/sdk/av/
- Expo File System: https://docs.expo.dev/versions/latest/sdk/filesystem/
- Expo Media Library: https://docs.expo.dev/versions/latest/sdk/media-library/

## 💡 Tips

1. **Always initialize Cloudinary** before using video generation
2. **Use try-catch** for all async operations
3. **Check permissions** before saving to device
4. **Test on physical devices** for social sharing
5. **Compress images** before upload for faster processing
6. **Keep videos under 30 seconds** for better performance
7. **Use progress tracking** for better UX
8. **Handle errors gracefully** with user-friendly messages

## 🐛 Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| "Cloudinary not initialized" | Call `initializeCloudinary()` in App.tsx |
| "Upload failed" | Check credentials & upload preset |
| "Permission denied" | Grant storage permissions in device settings |
| "Instagram not opening" | Install Instagram app, test on real device |
| "Video not playing" | Check URL format and network connection |
| "Save failed" | Verify storage space and permissions |

## 📞 Support

For help:
1. Check README.md
2. Review SETUP.md
3. See TESTING.md
4. Check examples in `src/examples/`
5. Contact: support@pawspace.com

## 🎉 Quick Wins

### 1-Minute Demo

```typescript
import { useVideoExport } from './src/hooks/useVideoExport';

const Demo = () => {
  const { generateVideo } = useVideoExport();
  
  return (
    <Button
      title="Generate Video"
      onPress={async () => {
        const url = await generateVideo({
          beforeImageUrl: 'https://picsum.photos/400',
          afterImageUrl: 'https://picsum.photos/401',
          transition: 'fade',
          duration: 6,
          textOverlays: [],
          fps: 30,
        });
        console.log('Video:', url);
      }}
    />
  );
};
```

### 5-Minute Integration

1. Install dependencies: `npm install`
2. Add Cloudinary config
3. Import and use hooks
4. Done! ✨

## 📦 Export Everything

```typescript
// Import everything from one place
import {
  // Hooks
  useVideoExport,
  useSocialSharing,
  
  // Components
  VideoPlayer,
  PublishBottomSheet,
  PreviewScreen,
  
  // Services
  getCloudinaryService,
  getPawSpaceAPI,
  
  // Utils
  estimateVideoSize,
  formatDuration,
  
  // Constants
  VIDEO_SETTINGS,
  COLORS,
} from './src';
```
