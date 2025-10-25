# PawSpace - Service Browsing & Listing System

A complete React Native implementation of a service browsing and listing system for PawSpace, a pet services marketplace.

## Features

### ServiceListScreen
- **Search**: Real-time search with 500ms debouncing for service names and provider names
- **Filters**:
  - Service Type: All, Grooming, Walking, Vet Care, Training
  - Price Range: $0 - $200 (adjustable slider)
  - Distance: 0-50 miles (adjustable slider)
  - Availability: Today, This Week, Anytime
- **Sorting**: Nearest, Price (Low-High), Top Rated, Most Popular
- **Infinite Scroll**: Automatic pagination with pull-to-refresh
- **Empty States**: User-friendly messages when no services match
- **Loading Skeletons**: Smooth loading animations

### ServiceCard Component
- Provider avatar and verification badge
- Service title and description
- Star ratings with review count
- Service type badge with color coding
- Price and duration display
- Distance from user location
- Image carousel (3-5 images with pagination dots)
- "Book Now" button
- Smooth animations on scroll

### Bookings Service
- `getServices()`: Fetch services with filters and pagination
- `getServiceById()`: Get individual service details
- `searchServices()`: Search services by query
- Built-in caching mechanism (5-minute cache duration)
- Distance calculation using Haversine formula
- Error handling and retry logic

## Technology Stack

- **React Native**: 0.73.0
- **Expo**: ~50.0.0
- **React Native Paper**: UI components with Material Design
- **React Native Reanimated**: Smooth animations
- **Expo Location**: Geolocation services
- **TypeScript**: Type safety

## Installation

```bash
# Install dependencies
npm install

# Start the development server
npm start

# Run on iOS
npm run ios

# Run on Android
npm run android
```

## Project Structure

```
src/
├── components/
│   └── booking/
│       ├── ServiceCard.tsx          # Service card component
│       └── ServiceCardSkeleton.tsx  # Loading skeleton
├── screens/
│   └── booking/
│       └── ServiceListScreen.tsx    # Main service list screen
├── services/
│   └── bookings.ts                  # API service functions
├── types/
│   └── booking.ts                   # TypeScript interfaces
└── utils/
    ├── debounce.ts                  # Debouncing utilities
    └── geolocation.ts               # Distance calculations
```

## Type Definitions

### Service
```typescript
interface Service {
  id: string;
  provider_id: string;
  provider: ProviderProfile;
  title: string;
  description: string;
  service_type: 'grooming' | 'walking' | 'vet_care' | 'training';
  price: number;
  duration: number;
  location: { address: string; latitude: number; longitude: number };
  images: string[];
  rating: number;
  total_bookings: number;
  availability_slots: TimeSlot[];
  created_at: string;
}
```

### ServiceFilters
```typescript
interface ServiceFilters {
  service_type?: string;
  min_price?: number;
  max_price?: number;
  max_distance?: number;
  availability_date?: string;
  sort_by?: 'distance' | 'price' | 'rating' | 'popularity';
}
```

## Configuration

Set your API base URL in environment variables:

```bash
EXPO_PUBLIC_API_URL=https://your-api-url.com/api
```

## Features Implementation

### Geolocation
- Requests user location permissions on app start
- Calculates distances using Haversine formula
- Displays distance in miles for each service
- Filters services by maximum distance

### Debounced Search
- 500ms delay before triggering search
- Prevents excessive API calls
- Smooth user experience

### Caching
- 5-minute cache duration for service lists
- Reduces API load
- Cache invalidation on pull-to-refresh
- Separate cache keys for different filter combinations

### Animations
- Fade-in animations for service cards
- Staggered entrance with 100ms delays
- Smooth skeleton loading transitions
- Animated filter modal

### Error Handling
- Location permission errors
- Network error handling
- Empty state UI
- Loading states for all async operations

## Navigation

The app expects these navigation routes:
- `ProviderProfile`: Navigate to provider details
- `BookService`: Navigate to booking flow

Make sure to configure these in your navigation stack.

## API Integration

The service expects these API endpoints:

- `GET /api/services?[params]`: List services with filters
- `GET /api/services/:id`: Get service by ID
- `GET /api/services/search?q=query`: Search services

Adjust the `API_BASE_URL` in `src/services/bookings.ts` to match your backend.

## License

MIT
