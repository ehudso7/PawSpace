# PawSpace - Pet Service Booking App

A React Native mobile application for browsing and booking pet services like grooming, walking, vet care, and training.

## Features

### Service Browsing & Listing
- **Search**: Search by service name or provider name with 500ms debounced input
- **Filtering**: 
  - Service Type: All, Grooming, Walking, Vet Care, Training
  - Price Range: Quick select buttons ($0-$25, $25-$50, etc.)
  - Distance: Based on user location (requires location permission)
  - Availability: Today, This Week, Anytime
- **Sorting**: Nearest, Price (Low-High), Top Rated, Most Popular
- **Infinite Scroll**: Pagination with pull-to-refresh
- **Location-based**: Distance calculation using Haversine formula

### Service Cards
- Provider avatar and verification badge
- Service title, description, and type badge
- Star ratings and review count
- Price and duration display
- Distance from user location
- Image carousel (3-5 images per service)
- "Book Now" button

### Technical Features
- **Caching**: React Query for data caching and state management
- **Location Services**: Expo Location for GPS and distance calculations
- **Smooth Animations**: React Native Reanimated and loading skeletons
- **Error Handling**: Comprehensive error states and retry mechanisms
- **TypeScript**: Full type safety throughout the application

## Project Structure

```
src/
├── components/
│   └── booking/
│       ├── ServiceCard.tsx          # Individual service display card
│       ├── FilterChips.tsx          # Service type and availability filters
│       ├── PriceRangeSlider.tsx     # Price range selection
│       └── LoadingSkeleton.tsx      # Loading state animations
├── screens/
│   └── booking/
│       └── ServiceListScreen.tsx    # Main service browsing screen
├── services/
│   └── bookings.ts                  # API service functions
├── hooks/
│   ├── useServices.ts               # React Query hooks for services
│   ├── useLocation.ts               # Location permission and GPS
│   └── useDebounce.ts               # Search input debouncing
├── types/
│   └── booking.ts                   # TypeScript interfaces
├── utils/
│   └── distance.ts                  # Distance calculation utilities
└── providers/
    └── QueryProvider.tsx            # React Query client setup
```

## Installation & Setup

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Start the development server**:
   ```bash
   npm start
   ```

3. **Run on device/simulator**:
   ```bash
   npm run ios     # iOS Simulator
   npm run android # Android Emulator
   ```

## Key Dependencies

- **React Native**: 0.72.6
- **Expo**: ~49.0.15
- **React Navigation**: ^6.1.9 (Stack Navigator)
- **React Native Paper**: ^5.11.1 (Material Design components)
- **React Query**: ^5.8.4 (Data fetching and caching)
- **Expo Location**: ~16.1.0 (GPS and location services)
- **TypeScript**: ^5.1.3

## API Integration

The app includes a mock service layer (`src/services/bookings.ts`) with sample data. To integrate with a real API:

1. Replace the mock functions in `bookings.ts` with actual API calls
2. Update the `API_BASE_URL` constant
3. Add authentication headers as needed
4. Update error handling for your API's error format

## Location Services

The app requests location permission to:
- Calculate distances to service providers
- Sort services by proximity
- Filter services within a specified radius

Location permission is requested when the user taps "Enable Location" or when the app first loads.

## Performance Optimizations

- **Debounced Search**: 500ms delay prevents excessive API calls
- **Infinite Scroll**: Loads 10 services per page with automatic pagination
- **Image Optimization**: Lazy loading with proper sizing
- **React Query Caching**: 5-minute stale time, 10-minute cache time
- **Loading Skeletons**: Smooth loading states instead of spinners

## Future Enhancements

- [ ] Advanced filters (ratings, availability slots, provider verification)
- [ ] Map view with service locations
- [ ] Favorites and saved searches
- [ ] Push notifications for booking updates
- [ ] Offline support with local caching
- [ ] Social features (reviews, recommendations)

## Development Notes

- All components use React Native Paper for consistent Material Design
- TypeScript interfaces ensure type safety across the application
- Mock data includes realistic service providers in Austin, TX area
- Error boundaries and loading states provide robust user experience
- Responsive design works on various screen sizes