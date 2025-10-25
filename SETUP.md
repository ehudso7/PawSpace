# Video Generation System - Setup Guide

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Cloudinary

1. Create account at https://cloudinary.com
2. Get your credentials from the dashboard
3. Create an upload preset named `pet_uploads`:
   - Go to Settings > Upload
   - Scroll to Upload presets
   - Click "Add upload preset"
   - Set preset name to `pet_uploads`
   - Set signing mode to "Unsigned"
   - Save

### 3. Configure Environment

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Edit `.env` with your Cloudinary credentials:

```
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

### 4. Test the System

Run the example:

```bash
npm start
```

## Features Checklist

✅ Video Generation
- [x] Before/After transitions
- [x] Text overlays
- [x] Multiple transition types
- [x] Custom FPS and duration

✅ Export
- [x] Save to device (iOS/Android/Web)
- [x] Permission handling
- [x] Progress tracking

✅ Sharing
- [x] Instagram integration
- [x] TikTok integration
- [x] Generic sharing

✅ Publishing
- [x] Caption input
- [x] Hashtag suggestions
- [x] Privacy settings
- [x] Service tags

## Platform-Specific Setup

### iOS

1. Add permissions to `Info.plist`:

```xml
<key>NSPhotoLibraryAddUsageDescription</key>
<string>Save videos to photo library</string>
<key>NSPhotoLibraryUsageDescription</key>
<string>Access photos for transformations</string>
```

2. Install pods:

```bash
cd ios && pod install && cd ..
```

### Android

1. Add permissions to `AndroidManifest.xml`:

```xml
<uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" />
<uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" />
```

2. Update `build.gradle` if needed:

```gradle
minSdkVersion 21
targetSdkVersion 33
```

### Web

No additional setup required. Note: Some features like Instagram/TikTok sharing may not work on web.

## Testing

### Test Video Generation

```typescript
import { useVideoExport } from './src/hooks/useVideoExport';

const { generateVideo } = useVideoExport();

await generateVideo({
  beforeImageUrl: 'https://example.com/before.jpg',
  afterImageUrl: 'https://example.com/after.jpg',
  transition: 'fade',
  duration: 6,
  textOverlays: [],
  fps: 30,
});
```

### Test Save to Device

```typescript
import { useVideoExport } from './src/hooks/useVideoExport';

const { saveToDevice } = useVideoExport();

await saveToDevice('https://cloudinary.com/video.mp4');
```

### Test Social Sharing

```typescript
import { useSocialSharing } from './src/hooks/useSocialSharing';

const { shareToInstagram } = useSocialSharing();

await shareToInstagram('https://cloudinary.com/video.mp4', {
  caption: 'Test video',
  hashtags: ['#test'],
  isPrivate: false,
});
```

## Troubleshooting

### Issue: "Cloudinary service not initialized"
**Solution**: Call `initializeCloudinary()` in your App.tsx:

```typescript
import { initializeCloudinary } from './src/services/cloudinary';
import { CLOUDINARY_CONFIG } from './src/config/cloudinary.config';

initializeCloudinary(CLOUDINARY_CONFIG);
```

### Issue: "Upload failed"
**Solution**: 
1. Check your Cloudinary credentials
2. Verify upload preset exists and is unsigned
3. Check image URLs are accessible

### Issue: "Permission denied" when saving
**Solution**:
1. Grant storage permissions in device settings
2. Check permission handling code
3. Verify Info.plist / AndroidManifest.xml

### Issue: Instagram/TikTok not opening
**Solution**:
1. Ensure app is installed
2. Check URL scheme permissions
3. Test on physical device (not simulator)

## Performance Tips

1. **Optimize Images**: Compress images before upload
2. **Cache Videos**: Cache generated videos locally
3. **Limit Duration**: Keep videos under 30 seconds
4. **Use Appropriate FPS**: 24-30 fps is sufficient

## Security Best Practices

1. Never commit `.env` file
2. Use environment variables in production
3. Implement rate limiting on API calls
4. Validate user inputs
5. Handle errors gracefully

## Next Steps

1. Customize text overlay styles
2. Add more transition effects
3. Implement video editing features
4. Add music library
5. Create video templates

## Support

For help:
- Check the full README.md
- Review example code in `/src/examples`
- Contact: support@pawspace.com
