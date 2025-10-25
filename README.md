# Provider Profile & Booking Calendar System

A complete React Native implementation of a provider profile view and booking calendar system with smooth animations, loading states, and modern UI components.

## 📋 Features

### Provider Profile Screen
- **Parallax Header** with cover photo and avatar
- **Service Type Badges** displaying provider specializations
- **Action Buttons** for messaging and sharing
- **Tabbed Interface** with 4 sections:
  - **About**: Bio, location, contact info, business hours
  - **Services**: List of services with prices and durations
  - **Portfolio**: Before/after transformation grid
  - **Reviews**: Customer reviews with ratings
- **Service Selector** bottom sheet modal
- **Sticky Bottom Bar** with "Book Service" button

### Booking Calendar Screen
- **Month Calendar View** with availability indicators
- **Color-coded dates**:
  - Green: Many slots available
  - Yellow: Few slots available
  - Gray: Unavailable/past dates
- **Time Slot Picker** organized by morning/afternoon/evening
- **30-minute intervals** based on service duration
- **Real-time availability** checking
- **Booking Summary** with all details
- **Sticky Bottom Bar** with continue button

## 📁 Project Structure

```
/workspace
├── src/
│   ├── types/
│   │   └── booking.types.ts          # TypeScript interfaces
│   ├── services/
│   │   └── bookings.service.ts       # API/Supabase service layer
│   ├── components/
│   │   └── booking/
│   │       ├── CalendarView.tsx      # Calendar component
│   │       └── TimeSlotPicker.tsx    # Time slot selection
│   └── screens/
│       └── booking/
│           ├── ProviderProfileScreen.tsx
│           └── BookingCalendarScreen.tsx
├── App.tsx                            # Example usage
├── package.json
├── tsconfig.json
└── README.md
```

## 🚀 Installation

1. Install dependencies:
```bash
npm install
# or
yarn install
```

2. Install required peer dependencies:
```bash
npm install react-native-calendars
```

3. For iOS, install pods:
```bash
cd ios && pod install && cd ..
```

## 📝 Usage

### Basic Implementation

```typescript
import { ProviderProfileScreen } from './src/screens/booking/ProviderProfileScreen';
import { BookingCalendarScreen } from './src/screens/booking/BookingCalendarScreen';

// Provider Profile
<ProviderProfileScreen
  providerId="provider-123"
  onBookService={(service) => {
    // Navigate to calendar with selected service
  }}
  onMessage={() => {
    // Open messaging
  }}
  onShare={() => {
    // Share provider profile
  }}
/>

// Booking Calendar
<BookingCalendarScreen
  providerId="provider-123"
  providerName="Sarah Johnson"
  service={selectedService}
  onContinue={(bookingDetails) => {
    // Create booking
  }}
  onBack={() => {
    // Navigate back
  }}
/>
```

### Supabase Integration

Initialize the Supabase client in your app:

```typescript
import { createClient } from '@supabase/supabase-js';
import { initializeSupabase } from './src/services/bookings.service';

const supabase = createClient(
  'YOUR_SUPABASE_URL',
  'YOUR_SUPABASE_ANON_KEY'
);

initializeSupabase(supabase);
```

## 🗄️ Database Schema

### Providers Table
```sql
CREATE TABLE providers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  full_name TEXT NOT NULL,
  avatar_url TEXT,
  cover_photo_url TEXT,
  bio TEXT,
  location JSONB,
  rating DECIMAL(2,1),
  total_reviews INTEGER,
  total_bookings INTEGER,
  service_types TEXT[],
  business_hours JSONB,
  response_time TEXT,
  phone TEXT,
  email TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Services Table
```sql
CREATE TABLE services (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  provider_id UUID REFERENCES providers(id),
  title TEXT NOT NULL,
  description TEXT,
  duration INTEGER NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  category TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Bookings Table
```sql
CREATE TABLE bookings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  provider_id UUID REFERENCES providers(id),
  user_id UUID REFERENCES users(id),
  service_id UUID REFERENCES services(id),
  date DATE NOT NULL,
  start_time TIMESTAMP NOT NULL,
  end_time TIMESTAMP NOT NULL,
  status TEXT DEFAULT 'pending',
  total_price DECIMAL(10,2),
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Portfolio Items Table
```sql
CREATE TABLE portfolio_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  provider_id UUID REFERENCES providers(id),
  before_image_url TEXT NOT NULL,
  after_image_url TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Reviews Table
```sql
CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  provider_id UUID REFERENCES providers(id),
  user_id UUID REFERENCES users(id),
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  images TEXT[],
  created_at TIMESTAMP DEFAULT NOW()
);
```

## 🎨 Customization

### Colors
Update the color scheme in the StyleSheet objects:

```typescript
// Primary color
backgroundColor: '#6200EE'  // Purple

// Success/Price color
color: '#2E7D32'  // Green

// Text colors
color: '#000000'  // Primary text
color: '#666666'  // Secondary text
color: '#BDBDBD'  // Disabled text
```

### Animation Timing
Adjust scroll animations in ProviderProfileScreen:

```typescript
const HEADER_MAX_HEIGHT = 200;  // Cover photo height
const HEADER_MIN_HEIGHT = 60;   // Collapsed header height
```

### Time Slot Intervals
Change time slot intervals in bookings.service.ts:

```typescript
const slotInterval = 30; // Change to 15, 45, 60, etc.
```

## 🔧 Service Methods

### `getProviderProfile(providerId: string)`
Fetches complete provider profile including services, portfolio, and reviews.

### `getProviderAvailability(providerId: string, month: string)`
Returns availability for each day in the specified month.

### `getTimeSlots(providerId: string, date: string, duration: number)`
Generates available time slots for a specific date.

### `checkSlotAvailability(providerId: string, startTime: string, duration: number)`
Checks if a specific time slot is available.

### `createBooking(bookingDetails: BookingDetails)`
Creates a new booking in the database.

## 📱 Component Props

### ProviderProfileScreen

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `providerId` | string | Yes | Provider's unique ID |
| `onBookService` | (service: Service) => void | Yes | Callback when service is selected |
| `onMessage` | () => void | No | Callback for message button |
| `onShare` | () => void | No | Callback for share button |

### BookingCalendarScreen

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `providerId` | string | Yes | Provider's unique ID |
| `providerName` | string | Yes | Provider's display name |
| `service` | Service | Yes | Selected service object |
| `onContinue` | (details: BookingDetails) => void | Yes | Callback with booking details |
| `onBack` | () => void | No | Callback for back button |

### CalendarView

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `providerId` | string | Yes | Provider's unique ID |
| `selectedDate` | string | No | Currently selected date (YYYY-MM-DD) |
| `onDateSelect` | (date: string) => void | Yes | Callback when date is selected |

### TimeSlotPicker

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `providerId` | string | Yes | Provider's unique ID |
| `selectedDate` | string | Yes | Selected date (YYYY-MM-DD) |
| `serviceDuration` | number | Yes | Service duration in minutes |
| `selectedSlot` | TimeSlot | No | Currently selected time slot |
| `onSlotSelect` | (slot: TimeSlot) => void | Yes | Callback when slot is selected |

## 🎯 TypeScript Interfaces

### ProviderProfile
Complete provider information including services, portfolio, and reviews.

### Service
Service details with title, description, duration, and price.

### AvailabilitySlot
Date availability information with slot count.

### TimeSlot
Time slot with start/end times and availability status.

### BookingDetails
Complete booking information for confirmation.

## 🚦 Loading States

All components include loading states with:
- ActivityIndicator for async operations
- Skeleton screens where appropriate
- Error handling with retry options
- Empty states for no data

## ✨ Animations

- **Parallax scroll effect** on provider cover photo
- **Fade-in animations** for header elements
- **Scale animations** on cover photo during scroll
- **Smooth transitions** between tabs
- **Bottom sheet animations** for service selector

## 🔒 Best Practices

1. **Type Safety**: Full TypeScript coverage
2. **Error Handling**: Try-catch blocks with user feedback
3. **Loading States**: Clear feedback during async operations
4. **Accessibility**: Proper touch targets and labels
5. **Performance**: Optimized re-renders with proper state management
6. **Responsive**: Works on various screen sizes

## 📦 Dependencies

- `react`: ^18.2.0
- `react-native`: ^0.72.0
- `react-native-calendars`: ^1.1305.0

## 🤝 Contributing

When extending this system:
1. Follow the existing code style
2. Add TypeScript types for new features
3. Include loading and error states
4. Test on both iOS and Android
5. Update documentation

## 📄 License

MIT

## 👥 Support

For issues or questions, please contact the development team or open an issue in the repository.
