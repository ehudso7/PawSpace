# Integration Guide

This guide walks you through integrating the Provider Profile and Booking Calendar system into your existing React Native application.

## Quick Start

### 1. Install Dependencies

```bash
npm install react-native-calendars
# or
yarn add react-native-calendars
```

For iOS:
```bash
cd ios && pod install && cd ..
```

### 2. Set Up Supabase

```typescript
// app/config/supabase.ts
import { createClient } from '@supabase/supabase-js';
import { initializeSupabase } from '../src/services/bookings.service';

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Initialize the booking service
initializeSupabase(supabase);
```

### 3. Navigation Setup (React Navigation)

```typescript
// app/navigation/BookingStack.tsx
import { createStackNavigator } from '@react-navigation/stack';
import { ProviderProfileScreen } from '../src/screens/booking/ProviderProfileScreen';
import { BookingCalendarScreen } from '../src/screens/booking/BookingCalendarScreen';

const Stack = createStackNavigator();

export function BookingStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="ProviderProfile"
        component={ProviderProfileScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="BookingCalendar"
        component={BookingCalendarScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}
```

### 4. Screen Navigation

```typescript
// In your provider listing screen
import { useNavigation } from '@react-navigation/native';

const navigation = useNavigation();

const handleProviderPress = (providerId: string) => {
  navigation.navigate('ProviderProfile', { providerId });
};
```

## Database Setup

### Create Tables in Supabase

Run these SQL commands in your Supabase SQL editor:

```sql
-- Providers table
CREATE TABLE providers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id),
  full_name TEXT NOT NULL,
  avatar_url TEXT,
  cover_photo_url TEXT,
  bio TEXT,
  location JSONB,
  rating DECIMAL(2,1) DEFAULT 0,
  total_reviews INTEGER DEFAULT 0,
  total_bookings INTEGER DEFAULT 0,
  service_types TEXT[],
  business_hours JSONB,
  response_time TEXT,
  phone TEXT,
  email TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Services table
CREATE TABLE services (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  provider_id UUID REFERENCES providers(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  duration INTEGER NOT NULL, -- in minutes
  price DECIMAL(10,2) NOT NULL,
  category TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Bookings table
CREATE TABLE bookings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  provider_id UUID REFERENCES providers(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  service_id UUID REFERENCES services(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  start_time TIMESTAMP NOT NULL,
  end_time TIMESTAMP NOT NULL,
  status TEXT DEFAULT 'pending',
  total_price DECIMAL(10,2),
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  CONSTRAINT no_overlap EXCLUDE USING gist (
    provider_id WITH =,
    tsrange(start_time, end_time) WITH &&
  )
);

-- Portfolio items table
CREATE TABLE portfolio_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  provider_id UUID REFERENCES providers(id) ON DELETE CASCADE,
  before_image_url TEXT NOT NULL,
  after_image_url TEXT NOT NULL,
  description TEXT,
  display_order INTEGER,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Reviews table
CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  provider_id UUID REFERENCES providers(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  booking_id UUID REFERENCES bookings(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  images TEXT[],
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_services_provider ON services(provider_id);
CREATE INDEX idx_bookings_provider ON bookings(provider_id);
CREATE INDEX idx_bookings_user ON bookings(user_id);
CREATE INDEX idx_bookings_date ON bookings(date);
CREATE INDEX idx_portfolio_provider ON portfolio_items(provider_id);
CREATE INDEX idx_reviews_provider ON reviews(provider_id);

-- Enable Row Level Security
ALTER TABLE providers ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE portfolio_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- Create policies (adjust based on your needs)
-- Allow public read access to active providers
CREATE POLICY "Public can view active providers"
  ON providers FOR SELECT
  USING (is_active = true);

-- Allow public read access to active services
CREATE POLICY "Public can view active services"
  ON services FOR SELECT
  USING (is_active = true);

-- Users can view their own bookings
CREATE POLICY "Users can view their own bookings"
  ON bookings FOR SELECT
  USING (auth.uid() = user_id);

-- Users can create bookings
CREATE POLICY "Users can create bookings"
  ON bookings FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Allow public read access to portfolio items
CREATE POLICY "Public can view portfolio"
  ON portfolio_items FOR SELECT
  USING (true);

-- Allow public read access to reviews
CREATE POLICY "Public can view reviews"
  ON reviews FOR SELECT
  USING (true);
```

### Create Update Triggers

```sql
-- Trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_providers_updated_at BEFORE UPDATE ON providers
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_services_updated_at BEFORE UPDATE ON services
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_bookings_updated_at BEFORE UPDATE ON bookings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_reviews_updated_at BEFORE UPDATE ON reviews
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

### Update Provider Rating Trigger

```sql
-- Automatically update provider rating when reviews are added/updated
CREATE OR REPLACE FUNCTION update_provider_rating()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE providers
  SET 
    rating = (
      SELECT AVG(rating)::DECIMAL(2,1)
      FROM reviews
      WHERE provider_id = COALESCE(NEW.provider_id, OLD.provider_id)
    ),
    total_reviews = (
      SELECT COUNT(*)
      FROM reviews
      WHERE provider_id = COALESCE(NEW.provider_id, OLD.provider_id)
    )
  WHERE id = COALESCE(NEW.provider_id, OLD.provider_id);
  
  RETURN COALESCE(NEW, OLD);
END;
$$ language 'plpgsql';

CREATE TRIGGER update_rating_on_review_insert
  AFTER INSERT ON reviews
  FOR EACH ROW EXECUTE FUNCTION update_provider_rating();

CREATE TRIGGER update_rating_on_review_update
  AFTER UPDATE ON reviews
  FOR EACH ROW EXECUTE FUNCTION update_provider_rating();

CREATE TRIGGER update_rating_on_review_delete
  AFTER DELETE ON reviews
  FOR EACH ROW EXECUTE FUNCTION update_provider_rating();
```

## Customizing the Service

### Replace Mock Data with Real Supabase Queries

Update `src/services/bookings.service.ts`:

```typescript
export const getProviderProfile = async (providerId: string): Promise<ProviderProfile> => {
  const { data, error } = await supabaseClient
    .from('providers')
    .select(`
      *,
      services(*),
      portfolio_items(*),
      reviews(*, user:users(full_name, avatar_url))
    `)
    .eq('id', providerId)
    .single();

  if (error) throw error;
  
  return {
    ...data,
    reviews: data.reviews.map((review: any) => ({
      ...review,
      user_name: review.user.full_name,
      user_avatar: review.user.avatar_url,
    })),
  };
};

export const getProviderAvailability = async (
  providerId: string,
  month: string
): Promise<AvailabilitySlot[]> => {
  const { data: businessHours } = await supabaseClient
    .from('providers')
    .select('business_hours')
    .eq('id', providerId)
    .single();

  const { data: bookings } = await supabaseClient
    .from('bookings')
    .select('date, start_time, end_time')
    .eq('provider_id', providerId)
    .gte('date', `${month}-01`)
    .lt('date', `${month}-32`);

  // Calculate availability based on business hours and existing bookings
  // Implementation details...
  
  return availability;
};
```

## Styling Customization

### Theme Configuration

Create a theme file:

```typescript
// app/config/theme.ts
export const theme = {
  colors: {
    primary: '#6200EE',
    secondary: '#03DAC6',
    success: '#2E7D32',
    error: '#D32F2F',
    background: '#FFFFFF',
    surface: '#F5F5F5',
    text: {
      primary: '#000000',
      secondary: '#666666',
      disabled: '#BDBDBD',
    },
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },
  borderRadius: {
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
  },
};
```

## Testing

### Unit Tests Example

```typescript
// __tests__/bookings.service.test.ts
import { getProviderProfile, getTimeSlots } from '../src/services/bookings.service';

describe('Bookings Service', () => {
  it('should fetch provider profile', async () => {
    const profile = await getProviderProfile('test-id');
    expect(profile).toBeDefined();
    expect(profile.services).toBeInstanceOf(Array);
  });

  it('should generate time slots', async () => {
    const slots = await getTimeSlots('test-id', '2024-12-01', 60);
    expect(slots).toBeInstanceOf(Array);
    expect(slots.length).toBeGreaterThan(0);
  });
});
```

## Performance Optimization

### 1. Memoization

```typescript
import { useMemo, useCallback } from 'react';

const markedDates = useMemo(() => getMarkedDates(), [availability, selectedDate]);

const handleDateSelect = useCallback((date: string) => {
  setSelectedDate(date);
}, []);
```

### 2. Image Optimization

```typescript
import FastImage from 'react-native-fast-image';

<FastImage
  source={{ uri: profile.cover_photo_url }}
  style={styles.coverPhoto}
  resizeMode={FastImage.resizeMode.cover}
/>
```

### 3. List Optimization

```typescript
<FlatList
  data={reviews}
  renderItem={renderReview}
  keyExtractor={(item) => item.id}
  removeClippedSubviews={true}
  maxToRenderPerBatch={10}
  windowSize={5}
/>
```

## Troubleshooting

### Common Issues

1. **Calendar not showing**: Ensure `react-native-calendars` is properly installed
2. **Dates not loading**: Check Supabase connection and RLS policies
3. **Animations stuttering**: Use `useNativeDriver: true` where possible
4. **Images not loading**: Verify image URLs and network permissions

## Support

For additional help:
- Check the README.md for API documentation
- Review examples in `examples/AdvancedUsage.tsx`
- Consult the Supabase documentation for database queries

## Next Steps

1. Add push notifications for booking confirmations
2. Implement payment integration
3. Add real-time availability updates with WebSockets
4. Create admin dashboard for providers
5. Add booking cancellation and rescheduling
