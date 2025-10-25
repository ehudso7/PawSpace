# PawSpace - Before/After Transformation Creator

A complete React Native transformation editor for creating beautiful before/after showcases of pet care work.

## 🎨 Features

### Image Selector Screen
- **Dual Upload Zones**: Side-by-side before/after image upload
- **Multiple Upload Options**: Camera, photo library, or recent transformations
- **Image Validation**: Automatic validation for min/max dimensions (800x800 - 4096x4096)
- **Smart Compression**: Automatically compresses large images while maintaining quality
- **Real-time Preview**: Shows thumbnail previews before proceeding to editor

### Editor Screen
- **Interactive Preview Area** (60% of screen)
  - Overlay mode with draggable slider
  - Side-by-side comparison mode
  - Pinch-to-zoom support
  - Pan gesture support for zoomed images

- **Comprehensive Toolbar** (40% of screen)
  - 5 editing tabs: Transition, Text, Stickers, Music, Frame
  - Undo/Redo functionality with 20-step history
  - Real-time preview playback

### Editing Features

#### 1. Transitions (4 types)
- **Fade**: Smooth opacity transition
- **Slide**: Horizontal slide effect
- **Swipe**: Push transition
- **Split**: Vertical reveal effect

#### 2. Text Overlays
- Drag, rotate, and resize text
- 5 font options
- 10 preset colors
- Adjustable size (12-72px)
- Position anywhere on canvas
- Edit on tap

#### 3. Stickers
- 20+ pet-themed stickers
- Categories: Paws, Hearts, Stars, Effects, Achievements, Emotions, Grooming
- Drag, pinch-to-scale, rotate
- Multiple stickers support

#### 4. Background Music
- 15 audio track options (10-15 seconds each)
- Preview playback
- Waveform visualization
- Volume control

#### 5. Frame Styles
- 3 frame types: Border, Rounded, Shadow
- 10 color options
- 6 width options (2-12px)
- Live preview

## 📁 Project Structure

```
src/
├── screens/
│   └── create/
│       ├── ImageSelectorScreen.tsx    # Image upload & selection
│       └── EditorScreen.tsx           # Main editor with toolbar
├── components/
│   └── create/
│       ├── ImageComparer.tsx          # Before/after comparison view
│       ├── TextOverlay.tsx            # Draggable text with editing
│       ├── StickerOverlay.tsx         # Draggable sticker element
│       ├── StickerPicker.tsx          # Sticker selection grid
│       ├── TransitionPreview.tsx      # Animated transition preview
│       ├── MusicPicker.tsx            # Audio track selector
│       └── FramePicker.tsx            # Frame style selector
├── store/
│   └── editorStore.ts                 # Zustand state management
├── types/
│   └── editor.ts                      # TypeScript definitions
└── index.ts                           # Main exports
```

## 🚀 Installation

```bash
npm install
```

### Required Dependencies

```json
{
  "react-native-gesture-handler": "^2.12.0",
  "react-native-reanimated": "^3.3.0",
  "expo-image-picker": "^14.3.0",
  "expo-image-manipulator": "^11.3.0",
  "expo-av": "^13.4.0",
  "@react-navigation/native": "^6.1.7",
  "zustand": "^4.4.0",
  "@expo/vector-icons": "^13.0.0"
}
```

## 💻 Usage

### Basic Setup

```tsx
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { ImageSelectorScreen, EditorScreen } from './src';

const Stack = createStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen 
          name="ImageSelector" 
          component={ImageSelectorScreen}
          options={{ title: 'Create Transformation' }}
        />
        <Stack.Screen 
          name="Editor" 
          component={EditorScreen}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
```

### Using the Editor Store

```tsx
import { useEditorStore } from './src/store/editorStore';

function MyComponent() {
  const {
    beforeImage,
    afterImage,
    transition,
    textOverlays,
    stickers,
    setTransition,
    addText,
    addSticker,
    undo,
    redo,
  } = useEditorStore();

  // Your component logic
}
```

### Adding Custom Transitions

```tsx
import { TransitionPreview } from './src/components/create/TransitionPreview';

<TransitionPreview
  beforeImage={beforeUri}
  afterImage={afterUri}
  transition="fade"
  isPlaying={true}
  duration={2000}
/>
```

## 🎯 Key Components

### ImageComparer
Interactive before/after comparison with draggable slider and zoom support.

```tsx
<ImageComparer
  beforeImage="uri://before.jpg"
  afterImage="uri://after.jpg"
  mode="overlay" // or "side-by-side"
/>
```

### TextOverlay
Draggable, rotatable text with inline editing.

```tsx
<TextOverlay
  overlay={{
    id: 'text-1',
    text: 'Amazing transformation!',
    font: 'System',
    color: '#FFFFFF',
    size: 24,
    position: { x: 100, y: 100 },
    rotation: 0,
  }}
  isSelected={true}
  onSelect={() => console.log('Selected')}
  containerWidth={375}
  containerHeight={600}
/>
```

### StickerOverlay
Interactive stickers with drag, pinch-to-scale, and rotate gestures.

```tsx
<StickerOverlay
  sticker={{
    id: 'sticker-1',
    uri: 'paw-icon',
    position: { x: 150, y: 200 },
    scale: 1,
    rotation: 0,
  }}
  isSelected={false}
  onSelect={() => console.log('Selected')}
/>
```

## 🎨 State Management

The editor uses Zustand for state management with the following features:

- **Undo/Redo**: 20-step history
- **Automatic History**: Saves state after each edit
- **Type-safe**: Full TypeScript support
- **Performant**: Minimal re-renders

## 📱 Gesture Handling

All gestures use `react-native-gesture-handler` and `react-native-reanimated` for 60fps animations:

- **Pan**: Move elements around canvas
- **Pinch**: Scale stickers and zoom images
- **Rotation**: Rotate text and stickers
- **Tap**: Select and edit elements

## 🎬 Animation System

Smooth animations powered by `react-native-reanimated`:

- Transition previews loop seamlessly
- Text and sticker movements are fluid
- Zoom and pan gestures feel natural
- All animations run on the UI thread for 60fps

## 🔧 Customization

### Adding New Transitions

Edit `src/types/editor.ts`:

```typescript
export type TransitionType = 'fade' | 'slide' | 'swipe' | 'split' | 'zoom';
```

Then implement in `TransitionPreview.tsx`.

### Adding Custom Stickers

Edit the `STICKERS` array in `StickerPicker.tsx`:

```typescript
const STICKERS = [
  { id: 's1', uri: 'your-sticker-uri', icon: 'paw', category: 'paws' },
  // Add more...
];
```

### Custom Fonts

Add fonts to `src/types/editor.ts`:

```typescript
export const FONTS = [
  'System',
  'YourCustomFont-Bold',
  // Add more...
] as const;
```

## 📸 Image Requirements

- **Minimum Size**: 800x800 pixels
- **Maximum Size**: 4096x4096 pixels
- **Format**: JPEG, PNG
- **Aspect Ratio**: Square images recommended
- **Automatic Compression**: Images > 4096px are automatically resized

## 🎵 Audio Support

The music picker supports:
- Preview playback
- Volume control
- 15 pre-loaded tracks (10-15 seconds)
- Waveform visualization (placeholder)

**Note**: Audio playback requires `expo-av` and proper permissions.

## 🔐 Permissions Required

```typescript
// iOS (Info.plist)
<key>NSCameraUsageDescription</key>
<string>We need camera access to take before/after photos</string>
<key>NSPhotoLibraryUsageDescription</key>
<string>We need photo library access to select images</string>
<key>NSMicrophoneUsageDescription</key>
<string>We need microphone access for audio</string>

// Android (AndroidManifest.xml)
<uses-permission android:name="android.permission.CAMERA" />
<uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" />
<uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" />
```

## 🎯 Performance Tips

1. **Image Optimization**: Large images are automatically compressed
2. **Gesture Handling**: All gestures run on UI thread
3. **State Management**: Zustand provides efficient updates
4. **History Limit**: Capped at 20 steps to prevent memory issues
5. **Lazy Loading**: Components only render when tab is active

## 🐛 Troubleshooting

### Images not loading
- Check image URIs are valid
- Ensure proper permissions granted
- Verify image size meets requirements

### Gestures not working
- Ensure `react-native-gesture-handler` is properly installed
- Wrap app with `GestureHandlerRootView`
- Check reanimated is configured correctly

### Animations stuttering
- Enable Hermes engine
- Check for unnecessary re-renders
- Ensure using `useSharedValue` for animations

## 📄 License

MIT License - feel free to use in your projects!

## 🤝 Contributing

Contributions welcome! Please follow the existing code style and add tests for new features.

## 🎉 Credits

Built with ❤️ for the PawSpace pet care community.

---

For questions or support, please open an issue on GitHub.
