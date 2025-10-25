# PawSpace - Provider Profile & Booking Calendar System

A comprehensive React Native booking system with provider profiles, service selection, and calendar-based appointment scheduling.

## 🚀 Features

### Provider Profile Screen
- **Parallax Header**: Smooth scrolling cover photo with overlay effects
- **Provider Information**: Avatar, name, rating, service badges
- **Tabbed Interface**: About, Services, Portfolio, Reviews
- **Interactive Elements**: Message and Share buttons
- **Sticky Bottom Bar**: Quick access to booking

### Booking Calendar System
- **Monthly Calendar View**: Built with `react-native-calendars`
- **Availability Tracking**: Real-time slot availability
- **Time Slot Selection**: 30-minute interval booking slots
- **Business Hours Integration**: Respects provider schedules
- **Conflict Detection**: Prevents double bookings

### Service Selection
- **Bottom Sheet Modal**: Smooth slide-up service selector
- **Service Details**: Duration, pricing, descriptions
- **Category Filtering**: Organized by service types
- **Gesture Support**: Swipe to dismiss functionality

## 📱 Components

### Core Screens
- `ProviderProfileScreen.tsx` - Main provider profile with tabs
- `BookingCalendarScreen.tsx` - Calendar and time slot selection
- `BookingFlowExample.tsx` - Complete booking flow implementation

### Reusable Components
- `CalendarView.tsx` - Calendar with availability fetching
- `TimeSlotPicker.tsx` - Time slot selection interface
- `ServiceSelectorSheet.tsx` - Service selection modal
- `LoadingSpinner.tsx` - Animated loading components

### Services & Utilities
- `bookingService.ts` - Supabase integration for bookings
- `animations.ts` - Animation utilities and presets
- `booking.ts` - TypeScript type definitions

## 🛠 Installation

```bash
# Install dependencies
npm install

# iOS specific (if using iOS)
cd ios && pod install && cd ..

# Required peer dependencies
npm install react-native-calendars react-native-gesture-handler react-native-reanimated
```

## 📋 Required Dependencies

```json
{
  "react-native-calendars": "^1.1302.0",
  "react-native-gesture-handler": "^2.12.0",
  "react-native-reanimated": "^3.3.0",
  "@supabase/supabase-js": "^2.26.0"
}
```

## 🔧 Setup

### 1. Supabase Configuration

Replace the mock Supabase client in `bookingService.ts` with your actual configuration:

```typescript
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'YOUR_SUPABASE_URL';
const supabaseKey = 'YOUR_SUPABASE_ANON_KEY';

export const supabase = createClient(supabaseUrl, supabaseKey);
```

### 2. Database Schema

Required tables for the booking system:

```sql
-- Providers table
CREATE TABLE providers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT NOT NULL,
  avatar_url TEXT,
  cover_photo_url TEXT,
  bio TEXT,
  location JSONB,
  rating DECIMAL DEFAULT 0,
  total_reviews INTEGER DEFAULT 0,
  total_bookings INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Services table
CREATE TABLE services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_id UUID REFERENCES providers(id),
  title TEXT NOT NULL,
  description TEXT,
  duration INTEGER NOT NULL, -- in minutes
  price DECIMAL NOT NULL,
  category TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Provider schedules table
CREATE TABLE provider_schedules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_id UUID REFERENCES providers(id),
  day_of_week TEXT NOT NULL, -- 'monday', 'tuesday', etc.
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  is_available BOOLEAN DEFAULT true
);

-- Bookings table
CREATE TABLE bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_id UUID REFERENCES providers(id),
  service_id UUID REFERENCES services(id),
  user_id UUID, -- Reference to your users table
  date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT NOW()
);

-- Portfolio items table
CREATE TABLE portfolio_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_id UUID REFERENCES providers(id),
  before_image_url TEXT,
  after_image_url TEXT,
  description TEXT,
  service_type TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Reviews table
CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_id UUID REFERENCES providers(id),
  user_id UUID, -- Reference to your users table
  user_name TEXT,
  user_avatar TEXT,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  service_type TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
```

## 🎯 Usage

### Basic Implementation

```typescript
import React from 'react';
import { BookingFlowExample } from './src/screens/booking/BookingFlowExample';

export default function App() {
  return (
    <BookingFlowExample initialProviderId="your-provider-id" />
  );
}
```

### Individual Components

```typescript
// Provider Profile Screen
<ProviderProfileScreen
  providerId="provider-123"
  onBookService={(service) => console.log('Book service:', service)}
  onMessage={() => console.log('Message provider')}
  onShare={() => console.log('Share profile')}
/>

// Calendar Screen
<BookingCalendarScreen
  providerId="provider-123"
  service={selectedService}
  onContinue={(details) => console.log('Booking details:', details)}
  onBack={() => console.log('Go back')}
/>

// Service Selector
<ServiceSelectorSheet
  visible={true}
  services={providerServices}
  onClose={() => setVisible(false)}
  onSelectService={(service) => console.log('Selected:', service)}
/>
```

## 🎨 Customization

### Theming

Customize colors and styles by modifying the StyleSheet objects in each component:

```typescript
const styles = StyleSheet.create({
  // Modify primary color
  primaryColor: '#2196F3', // Change to your brand color
  
  // Customize spacing
  containerPadding: 16,
  
  // Typography
  headerFontSize: 24,
  bodyFontSize: 16,
});
```

### Animations

Use the `AnimationUtils` class for consistent animations:

```typescript
import { AnimationUtils } from './src/utils/animations';

// Fade in animation
AnimationUtils.fadeIn(animatedValue, 300).start();

// Spring animation
AnimationUtils.spring(animatedValue, 1).start();

// Staggered animations
AnimationUtils.stagger([
  AnimationUtils.fadeIn(value1),
  AnimationUtils.fadeIn(value2),
], 100).start();
```

## 📊 API Methods

### BookingService

```typescript
// Get provider availability for a month
const availability = await BookingService.getProviderAvailability(
  'provider-id',
  '2024-01'
);

// Get time slots for a specific date
const timeSlots = await BookingService.getTimeSlots(
  'provider-id',
  '2024-01-15',
  60 // duration in minutes
);

// Check if a specific slot is available
const isAvailable = await BookingService.checkSlotAvailability(
  'provider-id',
  '2024-01-15T10:00',
  60
);

// Get full provider profile
const profile = await BookingService.getProviderProfile('provider-id');

// Create a booking
const success = await BookingService.createBooking({
  provider_id: 'provider-id',
  service_id: 'service-id',
  date: '2024-01-15',
  start_time: '10:00',
  end_time: '11:00',
});
```

## 🔍 TypeScript Types

All components are fully typed. Key interfaces include:

```typescript
interface ProviderProfile {
  id: string;
  full_name: string;
  avatar_url?: string;
  cover_photo_url?: string;
  bio: string;
  location: Location;
  rating: number;
  total_reviews: number;
  total_bookings: number;
  services: Service[];
  business_hours: BusinessHours;
  portfolio_items: TransformationItem[];
  reviews: Review[];
  service_types: string[];
}

interface Service {
  id: string;
  title: string;
  description: string;
  duration: number;
  price: number;
  category: string;
}

interface TimeSlot {
  start_time: string;
  end_time: string;
  is_available: boolean;
}
```

## 🚀 Performance Optimizations

- **Lazy Loading**: Components load data on demand
- **Memoization**: React.memo used for expensive renders
- **Native Driver**: All animations use native driver
- **Efficient Queries**: Optimized Supabase queries with proper indexing
- **Image Caching**: Placeholder images for better UX

## 🧪 Testing

```bash
# Run tests
npm test

# Run with coverage
npm run test:coverage
```

## 📝 License

MIT License - see LICENSE file for details.

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📞 Support

For support and questions, please open an issue in the GitHub repository.