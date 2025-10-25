# Provider Profile & Booking Calendar System

A comprehensive React Native booking system with provider profiles, service selection, calendar availability, and time slot booking.

## Features

### Provider Profile Screen
- **Parallax header** with cover photo and avatar
- **Provider information** including rating, reviews, and stats
- **Tabbed interface** with About, Services, Portfolio, and Reviews
- **Interactive map** showing provider location
- **Business hours** display
- **Service cards** with pricing and duration
- **Portfolio gallery** with before/after transformations
- **Review system** with ratings and comments
- **Sticky bottom bar** with "Book Service" button

### Service Selector Sheet
- **Bottom sheet modal** with smooth animations
- **Service list** with details (duration, price, category)
- **Easy selection** with visual feedback
- **Responsive design** for all screen sizes

### Booking Calendar Screen
- **Interactive calendar** with availability indicators
- **Month navigation** with smooth transitions
- **Available dates** highlighted in green
- **Past dates** disabled and grayed out
- **Time slot picker** with 30-minute intervals
- **Real-time availability** checking
- **Service summary** with pricing
- **Selected appointment** preview

### Calendar Components
- **CalendarView**: Handles availability fetching and date selection
- **TimeSlotPicker**: Displays available time slots in a grid
- **Availability management** with Supabase integration
- **Timezone handling** and conflict detection

### Booking Service
- **getProviderAvailability()**: Fetch monthly availability
- **getTimeSlots()**: Get available time slots for a date
- **checkSlotAvailability()**: Verify slot availability
- **createBooking()**: Create new booking

## Installation

1. Install dependencies:
```bash
npm install
```

2. Set up Supabase:
   - Create a Supabase project
   - Add your Supabase URL and anon key to `src/lib/supabase.ts`
   - Set up the required database tables (see Database Schema below)

3. Start the development server:
```bash
npm start
```

## Database Schema

### Required Tables

```sql
-- Providers table
CREATE TABLE providers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT NOT NULL,
  avatar_url TEXT,
  cover_photo_url TEXT,
  bio TEXT,
  location JSONB,
  rating DECIMAL(3,2) DEFAULT 0,
  total_reviews INTEGER DEFAULT 0,
  total_bookings INTEGER DEFAULT 0,
  business_hours JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Services table
CREATE TABLE services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_id UUID REFERENCES providers(id),
  title TEXT NOT NULL,
  description TEXT,
  duration INTEGER NOT NULL, -- in minutes
  price DECIMAL(10,2) NOT NULL,
  category TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Provider availability table
CREATE TABLE provider_availability (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_id UUID REFERENCES providers(id),
  date DATE NOT NULL,
  available_slots INTEGER DEFAULT 0,
  is_available BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(provider_id, date)
);

-- Bookings table
CREATE TABLE bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_id UUID REFERENCES providers(id),
  service_id UUID REFERENCES services(id),
  user_id UUID, -- reference to your users table
  date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  status TEXT DEFAULT 'pending', -- pending, confirmed, cancelled, completed
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Portfolio items table
CREATE TABLE portfolio_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_id UUID REFERENCES providers(id),
  title TEXT NOT NULL,
  description TEXT,
  before_image_url TEXT,
  after_image_url TEXT,
  category TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Reviews table
CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_id UUID REFERENCES providers(id),
  user_name TEXT NOT NULL,
  user_avatar_url TEXT,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  service_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## Usage

### Navigation Setup

```tsx
import { NavigationContainer } from '@react-navigation/native';
import BookingStack from './src/navigation/BookingStack';

export default function App() {
  return (
    <NavigationContainer>
      <BookingStack />
    </NavigationContainer>
  );
}
```

### Navigate to Provider Profile

```tsx
import { useNavigation } from '@react-navigation/native';

const navigation = useNavigation();

// Navigate to provider profile
navigation.navigate('BookingStack', {
  screen: 'ProviderProfile',
  params: { providerId: 'provider-123' }
});
```

### Customize Styling

All components use StyleSheet for styling and can be easily customized by modifying the styles object in each component file.

## Components

- `ProviderProfileScreen`: Main provider profile with tabs and booking flow
- `ServiceSelectorSheet`: Bottom sheet for service selection
- `BookingCalendarScreen`: Calendar and time slot selection
- `BookingConfirmScreen`: Final booking confirmation
- `CalendarView`: Calendar component with availability
- `TimeSlotPicker`: Time slot selection component

## Services

- `BookingService`: Handles all booking-related API calls
- Supabase integration for data persistence
- Real-time availability checking
- Conflict detection for overlapping bookings

## Features

- ✅ Parallax scrolling effects
- ✅ Smooth animations and transitions
- ✅ Loading states and error handling
- ✅ Responsive design
- ✅ Real-time availability checking
- ✅ Timezone handling
- ✅ Conflict detection
- ✅ Service selection
- ✅ Calendar integration
- ✅ Time slot management
- ✅ Booking confirmation
- ✅ Review system
- ✅ Portfolio gallery
- ✅ Business hours display
- ✅ Location mapping

## Dependencies

- React Native
- Expo
- React Navigation
- React Native Calendars
- React Native Maps
- Expo Linear Gradient
- Supabase
- TypeScript

## License

MIT