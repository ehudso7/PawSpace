# Testing Guide

## Overview

This guide covers testing strategies for the video generation and publishing system.

## Unit Testing

### Testing Video Generation

```typescript
import { renderHook, act } from '@testing-library/react-hooks';
import { useVideoExport } from '../hooks/useVideoExport';

describe('useVideoExport', () => {
  it('should generate video successfully', async () => {
    const { result } = renderHook(() => useVideoExport());

    await act(async () => {
      const url = await result.current.generateVideo({
        beforeImageUrl: 'https://example.com/before.jpg',
        afterImageUrl: 'https://example.com/after.jpg',
        transition: 'fade',
        duration: 6,
        textOverlays: [],
        fps: 30,
      });

      expect(url).toBeDefined();
      expect(url).toContain('cloudinary.com');
    });
  });

  it('should handle generation errors', async () => {
    const { result } = renderHook(() => useVideoExport());

    await act(async () => {
      try {
        await result.current.generateVideo({
          beforeImageUrl: 'invalid-url',
          afterImageUrl: 'invalid-url',
          transition: 'fade',
          duration: 6,
          textOverlays: [],
          fps: 30,
        });
      } catch (error) {
        expect(error).toBeDefined();
      }
    });
  });

  it('should track progress during generation', async () => {
    const { result } = renderHook(() => useVideoExport());

    expect(result.current.progress).toBe(0);

    act(() => {
      result.current.generateVideo({
        beforeImageUrl: 'https://example.com/before.jpg',
        afterImageUrl: 'https://example.com/after.jpg',
        transition: 'fade',
        duration: 6,
        textOverlays: [],
        fps: 30,
      });
    });

    // Progress should update
    await new Promise(resolve => setTimeout(resolve, 1000));
    expect(result.current.progress).toBeGreaterThan(0);
  });
});
```

### Testing Cloudinary Service

```typescript
import CloudinaryService from '../services/cloudinary';

describe('CloudinaryService', () => {
  let service: CloudinaryService;

  beforeEach(() => {
    service = new CloudinaryService({
      cloud_name: 'test-cloud',
      api_key: 'test-key',
      api_secret: 'test-secret',
    });
  });

  it('should upload image', async () => {
    const result = await service.uploadImage(
      'https://example.com/image.jpg',
      'test-folder'
    );

    expect(result.public_id).toBeDefined();
    expect(result.secure_url).toContain('cloudinary.com');
  });

  it('should create transformation video', async () => {
    const videoUrl = await service.createTransformationVideo({
      beforeImageUrl: 'https://example.com/before.jpg',
      afterImageUrl: 'https://example.com/after.jpg',
      transition: 'fade',
      duration: 6,
      textOverlays: [],
      fps: 30,
    });

    expect(videoUrl).toContain('cloudinary.com');
    expect(videoUrl).toContain('video/upload');
  });

  it('should generate thumbnail URL', () => {
    const thumbnailUrl = service.getThumbnailUrl('sample-video');

    expect(thumbnailUrl).toContain('cloudinary.com');
    expect(thumbnailUrl).toContain('.jpg');
  });
});
```

### Testing Social Sharing

```typescript
import { renderHook, act } from '@testing-library/react-hooks';
import { useSocialSharing } from '../hooks/useSocialSharing';

describe('useSocialSharing', () => {
  it('should share to Instagram', async () => {
    const { result } = renderHook(() => useSocialSharing());

    await act(async () => {
      await result.current.shareToInstagram(
        'https://cloudinary.com/video.mp4',
        {
          caption: 'Test caption',
          hashtags: ['#test'],
          isPrivate: false,
        }
      );
    });

    expect(result.current.isSharing).toBe(false);
  });

  it('should handle sharing errors', async () => {
    const { result } = renderHook(() => useSocialSharing());

    await act(async () => {
      try {
        await result.current.shareToInstagram('invalid-url', {
          caption: '',
          hashtags: [],
          isPrivate: false,
        });
      } catch (error) {
        expect(error).toBeDefined();
      }
    });
  });
});
```

## Integration Testing

### Testing PreviewScreen

```typescript
import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { PreviewScreen } from '../screens/create/PreviewScreen';

describe('PreviewScreen', () => {
  const mockNavigation = {
    goBack: jest.fn(),
    navigate: jest.fn(),
  };

  const mockRoute = {
    params: {
      beforeImageUrl: 'https://example.com/before.jpg',
      afterImageUrl: 'https://example.com/after.jpg',
      provider: {
        name: 'Test Provider',
        link: 'https://example.com',
      },
    },
  };

  it('should render video player', async () => {
    const { getByTestId } = render(
      <PreviewScreen navigation={mockNavigation} route={mockRoute} />
    );

    await waitFor(() => {
      expect(getByTestId('video-player')).toBeDefined();
    });
  });

  it('should open bottom sheet on publish button press', async () => {
    const { getByText } = render(
      <PreviewScreen navigation={mockNavigation} route={mockRoute} />
    );

    const publishButton = getByText('Post to PawSpace');
    fireEvent.press(publishButton);

    await waitFor(() => {
      expect(getByText('Publish Video')).toBeDefined();
    });
  });

  it('should handle back button press', () => {
    const { getByTestId } = render(
      <PreviewScreen navigation={mockNavigation} route={mockRoute} />
    );

    const backButton = getByTestId('back-button');
    fireEvent.press(backButton);

    expect(mockNavigation.goBack).toHaveBeenCalled();
  });
});
```

### Testing PublishBottomSheet

```typescript
import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { PublishBottomSheet } from '../components/video/PublishBottomSheet';

describe('PublishBottomSheet', () => {
  const mockOnClose = jest.fn();
  const mockOnPublish = jest.fn();

  it('should render when visible', () => {
    const { getByText } = render(
      <PublishBottomSheet
        isVisible={true}
        onClose={mockOnClose}
        onPublish={mockOnPublish}
      />
    );

    expect(getByText('Publish Video')).toBeDefined();
  });

  it('should update caption', () => {
    const { getByPlaceholderText } = render(
      <PublishBottomSheet
        isVisible={true}
        onClose={mockOnClose}
        onPublish={mockOnPublish}
      />
    );

    const captionInput = getByPlaceholderText('Write a caption...');
    fireEvent.changeText(captionInput, 'Test caption');

    expect(captionInput.props.value).toBe('Test caption');
  });

  it('should toggle hashtags', () => {
    const { getByText } = render(
      <PublishBottomSheet
        isVisible={true}
        onClose={mockOnClose}
        onPublish={mockOnPublish}
      />
    );

    const hashtag = getByText('#petgrooming');
    fireEvent.press(hashtag);

    // Hashtag should be selected
    expect(hashtag.props.style).toContainEqual({ color: '#fff' });
  });

  it('should call onPublish with correct options', () => {
    const { getByText, getByPlaceholderText } = render(
      <PublishBottomSheet
        isVisible={true}
        onClose={mockOnClose}
        onPublish={mockOnPublish}
      />
    );

    const captionInput = getByPlaceholderText('Write a caption...');
    fireEvent.changeText(captionInput, 'Test caption');

    const hashtag = getByText('#petgrooming');
    fireEvent.press(hashtag);

    const publishButton = getByText('Publish');
    fireEvent.press(publishButton);

    expect(mockOnPublish).toHaveBeenCalledWith({
      caption: 'Test caption',
      hashtags: ['#petgrooming'],
      isPrivate: false,
      serviceTag: undefined,
      provider: undefined,
    });
  });
});
```

## E2E Testing

### Complete Video Generation Flow

```typescript
describe('Video Generation Flow', () => {
  it('should complete full video generation and publish flow', async () => {
    // Step 1: Navigate to preview screen
    await element(by.id('create-button')).tap();
    
    // Step 2: Wait for video to generate
    await waitFor(element(by.id('video-player')))
      .toBeVisible()
      .withTimeout(10000);

    // Step 3: Open publish bottom sheet
    await element(by.text('Post to PawSpace')).tap();
    await expect(element(by.text('Publish Video'))).toBeVisible();

    // Step 4: Enter caption
    await element(by.id('caption-input')).typeText('Amazing transformation!');

    // Step 5: Select hashtags
    await element(by.text('#petgrooming')).tap();
    await element(by.text('#beforeandafter')).tap();

    // Step 6: Publish
    await element(by.text('Publish')).tap();

    // Step 7: Verify success
    await expect(element(by.text('Published!'))).toBeVisible();
  });
});
```

## Manual Testing Checklist

### Video Generation
- [ ] Generate video with fade transition
- [ ] Generate video with slide transition
- [ ] Generate video with zoom transition
- [ ] Add text overlays
- [ ] Verify video duration
- [ ] Check video quality

### Save to Device
- [ ] Save video on iOS
- [ ] Save video on Android
- [ ] Save video on Web
- [ ] Verify permissions requested
- [ ] Check saved file in gallery

### Social Sharing
- [ ] Share to Instagram Stories
- [ ] Share to Instagram Reels
- [ ] Share to TikTok
- [ ] Share to Facebook
- [ ] Share to Twitter
- [ ] Generic share (SMS, Email, etc.)

### Publishing
- [ ] Enter caption
- [ ] Select hashtags
- [ ] Toggle privacy
- [ ] Add service tag
- [ ] Publish to PawSpace
- [ ] Verify post appears in feed

### Edge Cases
- [ ] No internet connection
- [ ] Invalid image URLs
- [ ] Permission denied
- [ ] Large file sizes
- [ ] Long captions
- [ ] Many hashtags
- [ ] Video generation timeout

## Performance Testing

### Metrics to Track

1. **Video Generation Time**
   - Target: < 10 seconds for 6-second video
   - Measure: Time from start to completion

2. **Upload Speed**
   - Target: < 5 seconds for typical images
   - Measure: Time to upload both images

3. **Memory Usage**
   - Target: < 200MB during generation
   - Measure: Peak memory usage

4. **Battery Impact**
   - Target: Minimal battery drain
   - Measure: Battery usage during generation

### Performance Testing Script

```typescript
describe('Performance', () => {
  it('should generate video in reasonable time', async () => {
    const startTime = Date.now();

    await generateVideo({
      beforeImageUrl: 'https://example.com/before.jpg',
      afterImageUrl: 'https://example.com/after.jpg',
      transition: 'fade',
      duration: 6,
      textOverlays: [],
      fps: 30,
    });

    const endTime = Date.now();
    const duration = endTime - startTime;

    expect(duration).toBeLessThan(10000); // < 10 seconds
  });
});
```

## Test Data

### Sample Images
- Before: `https://res.cloudinary.com/demo/image/upload/sample_dog_before.jpg`
- After: `https://res.cloudinary.com/demo/image/upload/sample_dog_after.jpg`

### Sample Captions
- "Amazing transformation! 🐾"
- "Before and after grooming at Paw Perfect!"
- "Look at this glow-up! ✨"

### Sample Hashtags
- #petgrooming
- #beforeandafter
- #dogsofinstagram
- #catsofinstagram
- #transformation

## CI/CD Integration

### GitHub Actions Example

```yaml
name: Test Video System

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm install
      - run: npm test
      - run: npm run test:e2e
```

## Troubleshooting Tests

### Common Issues

1. **Tests timeout**
   - Increase timeout in test configuration
   - Mock external API calls
   - Use test fixtures instead of real images

2. **Permission errors**
   - Mock permission requests
   - Use test helpers for permissions
   - Run on physical devices for permission tests

3. **Network errors**
   - Mock network calls
   - Use local test server
   - Test offline scenarios separately

## Best Practices

1. **Use Test Doubles**: Mock external services
2. **Test Edge Cases**: Invalid inputs, network errors
3. **Keep Tests Fast**: Use mocks where possible
4. **Test User Flows**: End-to-end scenarios
5. **Measure Coverage**: Aim for >80% coverage
6. **Run Tests Often**: On every commit
7. **Document Tests**: Clear test descriptions
8. **Clean Up**: Reset state after tests
