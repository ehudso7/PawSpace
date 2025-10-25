# Transformation App

A React Native/Expo app for creating video transformations with Cloudinary integration, GIF fallback, and social sharing capabilities.

## Features

- **Video Generation**: Create video transformations using Cloudinary API
- **GIF Fallback**: Generate animated GIFs using expo-image-manipulator when video generation fails
- **Multiple Transition Effects**: Crossfade, slide, zoom, fade, and dissolve transitions
- **Social Sharing**: Share to Instagram, TikTok, and device share sheet
- **Export to Device**: Save transformations to device gallery
- **Draft System**: Save work in progress
- **Error Handling**: Comprehensive error handling with retry mechanisms
- **Loading States**: Progress indicators and loading screens

## Installation

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
cp .env.example .env
```

3. Configure your Cloudinary credentials in `.env`:
```
EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
EXPO_PUBLIC_CLOUDINARY_API_KEY=your_api_key
EXPO_PUBLIC_CLOUDINARY_API_SECRET=your_api_secret
```

4. Start the development server:
```bash
npm start
```

## Project Structure

```
src/
├── components/
│   ├── ErrorBoundary.tsx      # Error boundary component
│   ├── LoadingScreen.tsx      # Loading screen with progress
│   ├── PreviewScreen.tsx      # Preview and sharing screen
│   └── TransformationForm.tsx # Form for creating transformations
├── hooks/
│   ├── useRetry.ts           # Retry logic hook
│   └── useVideoGeneration.ts # Video generation hook
├── services/
│   ├── cloudinary.ts         # Cloudinary API service
│   ├── gifGenerator.ts       # GIF generation service
│   ├── sharing.ts            # Social sharing service
│   └── transformations.ts    # Transformations API service
├── types/
│   └── transformation.ts     # TypeScript type definitions
└── utils/
    └── retry.ts              # Retry utility functions
```

## Usage

### Creating a Transformation

1. Select before and after images
2. Choose a transition effect (crossfade, slide, zoom, fade, dissolve)
3. Add a caption
4. Configure settings (public/private, music)
5. Tap "Preview" to generate the transformation

### Video Generation Flow

1. **Upload**: Images are uploaded to Cloudinary
2. **Process**: Video transformation is generated with selected effects
3. **Fallback**: If video generation fails, GIF is generated as fallback
4. **Complete**: User can preview, share, or save the result

### Sharing Options

- **Save to Gallery**: Save to device photo library
- **Share Video**: Share via device share sheet
- **Share GIF**: Share animated GIF version
- **Instagram**: Deep link to Instagram Stories
- **TikTok**: Deep link to TikTok

## API Integration

The app integrates with Cloudinary for:
- Image uploads
- Video transformation generation
- GIF generation
- Progress polling

## Error Handling

- **Retry Logic**: Automatic retry with exponential backoff
- **Error Boundaries**: Catch and display React errors gracefully
- **Fallback Options**: GIF generation when video fails
- **User Feedback**: Clear error messages and retry options

## Dependencies

- **expo-image-manipulator**: Image manipulation and GIF generation
- **expo-media-library**: Save to device gallery
- **expo-sharing**: Device sharing capabilities
- **expo-linking**: Deep linking to social apps
- **cloudinary**: Cloud-based image and video processing

## Environment Variables

Required environment variables:
- `EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME`: Your Cloudinary cloud name
- `EXPO_PUBLIC_CLOUDINARY_API_KEY`: Your Cloudinary API key
- `EXPO_PUBLIC_CLOUDINARY_API_SECRET`: Your Cloudinary API secret
- `EXPO_PUBLIC_API_BASE_URL`: Your backend API URL (optional)

## Development

The app uses TypeScript for type safety and includes:
- Comprehensive error handling
- Loading states and progress indicators
- Retry mechanisms for failed operations
- Clean separation of concerns
- Reusable components and hooks

## License

MIT License