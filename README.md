# PawSpace Transformation Creator

A comprehensive before/after transformation creator for the PawSpace pet care app, built with React Native and Expo.

## Features

### 🖼️ Image Selection
- **Dual Upload Interface**: Side-by-side before/after image upload zones
- **Multiple Input Methods**: Camera capture, photo library selection
- **Smart Validation**: Automatic image size and format validation
- **Quality Optimization**: Built-in image compression and resizing

### ✨ Rich Editor
- **4 Transition Effects**: Fade, Slide, Swipe, and Split transitions
- **Text Overlays**: Customizable fonts, colors, sizes with drag & drop
- **Sticker System**: 20+ pet-themed stickers with categories
- **Background Music**: 15 curated audio tracks with volume control
- **Frame Styles**: 6 different border and frame options

### 🎨 Interactive Canvas
- **Gesture Controls**: Pan, pinch, rotate for all elements
- **Real-time Preview**: Live transition effects with 60fps animations
- **Multi-touch Support**: Simultaneous editing of multiple elements
- **Undo/Redo**: Full history management with 50-state buffer

## Architecture

### State Management
- **Zustand Store**: Centralized state management for editor
- **Immutable Updates**: Clean state transitions with history tracking
- **Optimistic UI**: Immediate feedback for all user interactions

### Component Structure
```
src/
├── screens/create/
│   ├── ImageSelectorScreen.tsx    # Image upload interface
│   └── EditorScreen.tsx           # Main editing interface
├── components/create/
│   ├── ImageComparer.tsx          # Before/after comparison
│   ├── TextOverlay.tsx            # Text editing components
│   ├── StickerPicker.tsx          # Sticker selection & canvas
│   ├── TransitionPreview.tsx      # Transition effects
│   ├── MusicPicker.tsx            # Audio selection
│   └── FramePicker.tsx            # Frame selection
├── store/
│   └── editorStore.ts             # Zustand state management
├── types/
│   └── transformation.ts          # TypeScript definitions
├── constants/
│   └── editor.ts                  # Static data & presets
└── utils/
    └── imageUtils.ts              # Image processing utilities
```

### Key Technologies
- **React Native Reanimated 3**: Smooth 60fps animations
- **React Native Gesture Handler**: Advanced touch interactions  
- **Expo Image Picker**: Cross-platform image selection
- **Expo AV**: Audio playback and management
- **TypeScript**: Full type safety throughout

## Installation

```bash
# Install dependencies
npm install

# Install iOS pods (if on macOS)
cd ios && pod install && cd ..

# Start development server
npm start
```

## Usage

### Basic Flow
1. **Image Selection**: Upload before/after photos via camera or library
2. **Transition Setup**: Choose from 4 transition effects with live preview
3. **Content Addition**: Add text overlays and stickers with drag & drop
4. **Audio & Styling**: Select background music and frame styles
5. **Preview & Export**: Real-time preview with export functionality

### Image Requirements
- **Minimum Size**: 800x800px
- **Maximum Size**: 4096x4096px  
- **File Size Limit**: 10MB
- **Supported Formats**: JPEG, PNG, WebP
- **Recommended**: Square aspect ratio for best results

### Gesture Controls
- **Single Tap**: Select element
- **Double Tap**: Edit text content
- **Drag**: Move elements around canvas
- **Pinch**: Scale elements up/down
- **Rotate**: Two-finger rotation for elements
- **Long Press**: Access context menu

## Performance Optimizations

### Image Handling
- **Lazy Loading**: Images loaded on-demand
- **Compression**: Automatic size optimization
- **Caching**: Efficient memory management
- **Thumbnails**: Preview generation for better UX

### Animation Performance
- **Native Driver**: All animations run on UI thread
- **Gesture Optimization**: Minimal re-renders during interactions
- **Memory Management**: Proper cleanup of animation resources

### State Efficiency
- **Selective Updates**: Only affected components re-render
- **History Pruning**: Automatic cleanup of old states
- **Debounced Saves**: Efficient persistence strategy

## Customization

### Adding New Stickers
```typescript
// In src/constants/editor.ts
export const STICKER_CATEGORIES: StickerCategory[] = [
  {
    id: 'custom',
    name: 'Custom',
    stickers: [
      { id: 'custom1', uri: 'path/to/sticker.png', name: 'Custom Sticker', category: 'custom' },
    ],
  },
];
```

### Adding New Fonts
```typescript
// In src/constants/editor.ts
export const FONTS: Font[] = [
  { id: 'custom-font', name: 'Custom Font', family: 'CustomFont-Regular' },
];
```

### Adding New Transitions
```typescript
// In src/components/create/TransitionPreview.tsx
// Add new case in renderTransition() method
case 'custom':
  return (
    <CustomTransitionComponent />
  );
```

## API Integration

The transformation creator is designed to integrate with backend services:

```typescript
// Export transformation data
const exportData = useEditorStore(state => state.getExportState());

// Save to backend
await saveTransformation({
  beforeImage: exportData.beforeImage,
  afterImage: exportData.afterImage,
  settings: {
    transition: exportData.transition,
    textOverlays: exportData.textOverlays,
    stickers: exportData.stickers,
    music: exportData.music,
    frame: exportData.frame,
  }
});
```

## Testing

```bash
# Run unit tests
npm test

# Run type checking
npx tsc --noEmit

# Run linting
npm run lint
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes with proper TypeScript types
4. Add tests for new functionality
5. Submit a pull request

## License

MIT License - see LICENSE file for details.

---

Built with ❤️ for pet care professionals using React Native and Expo.