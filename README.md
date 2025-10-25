# PawSpace Transformation Creator

A React Native app for creating before/after pet transformation videos with advanced editing features.

## Features

### Image Selection
- Upload before and after photos from camera or library
- Image validation (minimum 800x800px, maximum 4096x4096px)
- Automatic image compression
- Square aspect ratio enforcement

### Editor Features
- **Transition Effects**: Fade, Slide, Swipe, Split
- **Text Overlays**: Draggable, resizable, rotatable text with multiple fonts and colors
- **Stickers**: Pet-themed stickers with search and categorization
- **Music**: Background music clips (coming soon)
- **Frames**: Border styles and colors (coming soon)

### Gesture Support
- Drag and drop for text overlays and stickers
- Pinch to zoom and pan for images
- Rotation gestures for text and stickers
- Real-time preview updates

## Tech Stack

- **React Native** with Expo
- **TypeScript** for type safety
- **Zustand** for state management
- **React Native Reanimated** for smooth animations
- **React Native Gesture Handler** for gesture support
- **Expo Image Picker** for camera/library access

## Project Structure

```
src/
├── components/create/          # Reusable editor components
│   ├── ImageComparer.tsx      # Before/after image comparison
│   ├── TextOverlay.tsx        # Draggable text overlay
│   ├── StickerPicker.tsx      # Sticker selection modal
│   └── TransitionPreview.tsx  # Animated transition preview
├── screens/create/            # Main screens
│   ├── ImageSelectorScreen.tsx # Image upload interface
│   └── EditorScreen.tsx       # Main editor interface
├── store/                     # State management
│   └── editorStore.ts         # Zustand store
├── types/                     # TypeScript definitions
│   └── index.ts              # Type definitions
├── utils/                     # Utility functions
│   ├── imageUtils.ts         # Image processing utilities
│   └── constants.ts          # App constants
└── assets/                   # Static assets
    ├── stickers/             # Sticker images
    └── music/                # Audio files
```

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm start
```

3. Run on device/simulator:
```bash
npm run ios
# or
npm run android
```

## Key Components

### ImageSelectorScreen
- Two upload zones for before/after images
- Camera and library access with permissions
- Image validation and compression
- Preview thumbnails

### EditorScreen
- Tabbed interface for different editing tools
- Real-time preview with gesture support
- Undo/redo functionality
- Save draft and preview options

### ImageComparer
- Side-by-side or overlay image display
- Gesture-based transition control
- Pinch to zoom and pan support
- Real-time transition preview

### TextOverlay
- Draggable, resizable, rotatable text
- Multiple font and color options
- Real-time editing with gesture support
- Delete functionality

### StickerPicker
- Grid-based sticker selection
- Search and category filtering
- Easy sticker addition to canvas

## State Management

The app uses Zustand for state management with the following structure:

```typescript
interface EditorState {
  beforeImage: string | null;
  afterImage: string | null;
  transition: TransitionType;
  textOverlays: TextOverlay[];
  stickers: Sticker[];
  music?: AudioTrack;
  frame?: FrameStyle;
  isProcessing: boolean;
}
```

## Permissions

The app requires the following permissions:
- Camera access for taking photos
- Photo library access for selecting images

## Future Enhancements

- Music integration with audio clips
- Frame styles and borders
- Export to video functionality
- Cloud storage integration
- Social sharing features
- Advanced text effects and animations