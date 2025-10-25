# System Architecture

## 📐 Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER INTERFACE                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │              PreviewScreen (Main Screen)                 │  │
│  │                                                          │  │
│  │  ┌────────────┐  ┌────────────┐  ┌──────────────────┐  │  │
│  │  │  Top Bar   │  │ VideoPlayer│  │ PublishBottomSheet│  │  │
│  │  │            │  │            │  │                   │  │  │
│  │  │ Back Share │  │ Play Pause │  │ Caption Hashtags │  │  │
│  │  └────────────┘  └────────────┘  └──────────────────┘  │  │
│  │                                                          │  │
│  │  ┌──────────────────────────────────────────────────┐   │  │
│  │  │           Action Buttons                         │   │  │
│  │  │  [Save to Device] [Post] [Share to Social]      │   │  │
│  │  └──────────────────────────────────────────────────┘   │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                        BUSINESS LOGIC                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────────────┐              ┌────────────────────┐      │
│  │  useVideoExport  │              │  useSocialSharing  │      │
│  │                  │              │                    │      │
│  │  - generateVideo │              │  - shareInstagram  │      │
│  │  - saveToDevice  │              │  - shareTikTok    │      │
│  │  - progress      │              │  - shareGeneric   │      │
│  │  - error         │              │  - sharePreview   │      │
│  └──────────────────┘              └────────────────────┘      │
│           │                                    │                │
│           │                                    │                │
└───────────┼────────────────────────────────────┼────────────────┘
            │                                    │
            │                                    │
            ▼                                    ▼
┌─────────────────────────────────────────────────────────────────┐
│                          SERVICES                               │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────────────────┐         ┌──────────────────────┐     │
│  │  CloudinaryService   │         │   PawSpaceAPI        │     │
│  │                      │         │                      │     │
│  │  - uploadImage       │         │  - publishVideo      │     │
│  │  - createVideo       │         │  - getVideos         │     │
│  │  - applyEffects      │         │  - deletePost        │     │
│  │  - getThumbnail      │         │  - updatePrivacy     │     │
│  │  - downloadVideo     │         │                      │     │
│  └──────────────────────┘         └──────────────────────┘     │
│           │                                    │                │
└───────────┼────────────────────────────────────┼────────────────┘
            │                                    │
            │                                    │
            ▼                                    ▼
┌─────────────────────────────────────────────────────────────────┐
│                     EXTERNAL SERVICES                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │  Cloudinary  │  │  PawSpace    │  │   Social     │         │
│  │     API      │  │   Backend    │  │   Platforms  │         │
│  │              │  │              │  │              │         │
│  │  Video Gen   │  │  Publishing  │  │  Instagram   │         │
│  │  Image Host  │  │  Storage     │  │  TikTok      │         │
│  │  Transform   │  │  API         │  │  Facebook    │         │
│  └──────────────┘  └──────────────┘  └──────────────┘         │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

## 🔄 Data Flow

### 1. Video Generation Flow

```
User Selects Images
        │
        ▼
PreviewScreen initializes
        │
        ▼
useVideoExport.generateVideo()
        │
        ├──> Upload before image ──┐
        │                           │
        └──> Upload after image  ───┤
                                    │
                                    ▼
                        CloudinaryService.createTransformationVideo()
                                    │
                                    ├──> Build transformation URL
                                    ├──> Add text overlays
                                    ├──> Apply transition
                                    └──> Generate video
                                    │
                                    ▼
                            Return video URL
                                    │
                                    ▼
                        VideoPlayer displays video
```

### 2. Save to Device Flow

```
User Clicks "Save to Device"
        │
        ▼
useVideoExport.saveToDevice()
        │
        ├──> Request permissions
        │
        ├──> Download video from URL
        │
        └──> Save to device storage
        │
        ▼
Show success message
```

### 3. Social Sharing Flow

```
User Clicks "Share to Social"
        │
        ▼
useSocialSharing.shareToInstagram()
        │
        ├──> Download video locally
        │
        ├──> Format caption + hashtags
        │
        ├──> Check if app installed
        │
        └──> Open Instagram with video
        │
        ▼
Instagram app opens
```

### 4. Publishing Flow

```
User Clicks "Post to PawSpace"
        │
        ▼
PublishBottomSheet opens
        │
        ├──> User enters caption
        ├──> User selects hashtags
        ├──> User sets privacy
        │
        ▼
User Clicks "Publish"
        │
        ▼
PawSpaceAPI.publishVideo()
        │
        ├──> Upload video metadata
        ├──> Create post on backend
        │
        ▼
Show success message
Navigate to feed
```

## 🗂️ Component Hierarchy

```
App
 │
 └── PreviewScreen
      ├── VideoPlayer
      │    ├── Video (expo-av)
      │    ├── Controls
      │    │    ├── Play/Pause Button
      │    │    ├── Mute Button
      │    │    ├── Loop Button
      │    │    └── Progress Bar
      │    └── Loading Indicator
      │
      ├── Top Bar
      │    ├── Back Button
      │    └── Share Button
      │
      ├── Action Buttons
      │    ├── Save to Device Button
      │    ├── Post to PawSpace Button
      │    └── Share to Social Button
      │
      └── PublishBottomSheet
           ├── Caption Input
           ├── Service Tag
           ├── Hashtag Suggestions
           ├── Privacy Toggle
           └── Publish Button
```

## 📦 Module Dependencies

```
┌──────────────────────┐
│   PreviewScreen      │
└──────────┬───────────┘
           │
           ├──> VideoPlayer
           ├──> PublishBottomSheet
           ├──> useVideoExport
           └──> useSocialSharing
                      │
                      ├──> CloudinaryService
                      ├──> PawSpaceAPI
                      └──> video.utils
                                │
                                └──> constants
```

## 🔐 Authentication Flow

```
App Start
    │
    ▼
Load auth token from storage
    │
    ├──> Token exists ──> Set in PawSpaceAPI
    │
    └──> No token ──> Redirect to login
```

## 💾 State Management

### PreviewScreen State
```typescript
{
  videoUrl: string | null,
  showBottomSheet: boolean,
  isVideoReady: boolean
}
```

### useVideoExport State
```typescript
{
  isGenerating: boolean,
  isExporting: boolean,
  progress: number (0-100),
  error: string | null,
  generatedVideoUrl: string | null
}
```

### useSocialSharing State
```typescript
{
  isSharing: boolean
}
```

### PublishBottomSheet State
```typescript
{
  caption: string,
  selectedHashtags: string[],
  isPrivate: boolean,
  serviceTag: string
}
```

## 🎯 Error Handling Strategy

```
Try/Catch at every level:

┌─────────────────────┐
│  User Action        │
└──────┬──────────────┘
       │
       ▼
┌─────────────────────┐
│  Hook (try/catch)   │
│  - Set error state  │
│  - Log error        │
└──────┬──────────────┘
       │
       ▼
┌─────────────────────┐
│  Service (try/catch)│
│  - Throw error      │
│  - Log details      │
└──────┬──────────────┘
       │
       ▼
┌─────────────────────┐
│  UI (useEffect)     │
│  - Show alert       │
│  - Display message  │
└─────────────────────┘
```

## 🚀 Performance Optimization

### 1. Server-Side Processing
- Video generation happens on Cloudinary servers
- No device CPU/memory load
- Faster processing
- Better quality

### 2. Lazy Loading
- Components load on demand
- Bottom sheet only renders when visible
- Video player only loads when ready

### 3. Memoization
- Use React.memo for expensive components
- useMemo for computed values
- useCallback for stable functions

### 4. Progress Tracking
- Real-time feedback to users
- Prevents UI blocking
- Better UX

## 🔄 Lifecycle

### Component Lifecycle

```
PreviewScreen mounts
    │
    ├──> Initialize hooks
    │
    ├──> Check if video URL provided
    │    │
    │    ├──> Yes: Load video
    │    │
    │    └──> No: Generate video
    │         │
    │         └──> Show loading state
    │              │
    │              └──> Video ready
    │                   │
    │                   └──> Show player
    │
    └──> User interacts
         │
         ├──> Save to device
         │
         ├──> Share to social
         │
         └──> Publish to PawSpace
```

## 📊 Type System

```
┌─────────────────────────┐
│   video.types.ts        │
├─────────────────────────┤
│ TransitionType          │
│ TextOverlay             │
│ Effect                  │
│ VideoParams             │
│ PublishOptions          │
│ ShareDestination        │
│ CloudinaryUploadResponse│
│ VideoMetadata           │
└─────────────────────────┘
         │
         ├──> Used by Services
         ├──> Used by Hooks
         ├──> Used by Components
         └──> Exported to consumers
```

## 🎨 Styling Architecture

```
┌────────────────────┐
│  Component         │
│  ├── styles        │
│  │   ├── container│
│  │   ├── text     │
│  │   └── button   │
│  └── colors       │
│      (from const) │
└────────────────────┘
```

## 🧩 Extension Points

The system is designed to be extensible:

1. **New Transitions**: Add to `TransitionType` enum
2. **New Effects**: Add to `Effect` interface
3. **New Platforms**: Extend `useSocialSharing`
4. **New Features**: Add to `FEATURES` constants
5. **Custom Overlays**: Extend `TextOverlay` interface

## 📱 Platform-Specific Code

```
Platform.select({
  ios: // iOS-specific code,
  android: // Android-specific code,
  web: // Web-specific code,
  default: // Fallback code
})
```

Used for:
- File system operations
- Permission requests
- Social sharing
- Download handling

## 🎯 Summary

This architecture provides:
- ✅ Clear separation of concerns
- ✅ Modular design
- ✅ Type safety
- ✅ Error handling
- ✅ Performance optimization
- ✅ Extensibility
- ✅ Cross-platform support
- ✅ Production readiness
