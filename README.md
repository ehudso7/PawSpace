# PawSpace

A React Native app for booking pet care services with integrated Stripe payment processing.

## Features

- **Service Discovery**: Browse and search for pet care services
- **Booking System**: Complete booking flow with date/time selection
- **Stripe Integration**: Secure payment processing with Stripe
- **Booking Management**: View, manage, and cancel bookings
- **Provider Profiles**: Detailed provider information and ratings
- **Pet Management**: Add and manage multiple pets
- **Real-time Updates**: Booking status updates and notifications

## Screens Implemented

### Booking Flow
- **BookingConfirmScreen**: Service summary, pet selection, payment method, and confirmation
- **BookingSuccessScreen**: Animated success screen with booking details
- **MyBookingsScreen**: Tabbed view of upcoming, past, and cancelled bookings
- **BookingDetailScreen**: Detailed booking view with QR code, map, and actions

### Supporting Screens
- **HomeScreen**: Welcome screen with navigation to main features
- **ServiceListScreen**: Browse available pet care services
- **ServiceDetailScreen**: Detailed service information and booking initiation

## Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- React Native CLI
- iOS Simulator (for iOS development)
- Android Studio and emulator (for Android development)

### Installation

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Install iOS Dependencies** (iOS only)
   ```bash
   cd ios && pod install && cd ..
   ```

3. **Configure Stripe**
   - Replace `STRIPE_PUBLISHABLE_KEY` in `App.tsx` and `src/services/stripe.ts` with your actual Stripe publishable key
   - Set up your backend API endpoints in `src/services/stripe.ts` and `src/services/booking.ts`

4. **Configure API Endpoints**
   - Update `API_BASE_URL` in `src/services/booking.ts` and `src/services/stripe.ts` with your backend URL

### Running the App

#### iOS
```bash
npm run ios
```

#### Android
```bash
npm run android
```

#### Development Server
```bash
npm start
```

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Button.tsx
│   └── LoadingSpinner.tsx
├── navigation/          # Navigation configuration
│   └── RootNavigator.tsx
├── screens/            # Screen components
│   ├── booking/        # Booking-related screens
│   │   ├── BookingConfirmScreen.tsx
│   │   ├── BookingSuccessScreen.tsx
│   │   ├── MyBookingsScreen.tsx
│   │   └── BookingDetailScreen.tsx
│   ├── HomeScreen.tsx
│   ├── ServiceListScreen.tsx
│   └── ServiceDetailScreen.tsx
├── services/           # API and business logic
│   ├── booking.ts
│   └── stripe.ts
└── types/             # TypeScript type definitions
    ├── booking.ts
    └── navigation.ts
```

## Key Features Implemented

### Stripe Payment Integration
- Secure payment processing with Stripe Payment Sheet
- Payment method management
- Payment intent creation and confirmation
- Error handling and user feedback

### Booking Management
- Complete booking lifecycle (create, view, cancel)
- Status tracking (pending, confirmed, completed, cancelled)
- Booking filtering and sorting
- Cancellation policy enforcement

### User Experience
- Smooth animations and transitions
- Loading states and error handling
- Responsive design for different screen sizes
- Intuitive navigation flow

## Backend Requirements

The app expects the following API endpoints:

### Stripe Integration
- `POST /create-payment-intent` - Create payment intent
- `GET /payment-methods` - Get saved payment methods
- `POST /payment-methods` - Save new payment method

### Booking Management
- `POST /bookings` - Create new booking
- `GET /bookings/my` - Get user's bookings
- `GET /bookings/:id` - Get booking details
- `POST /bookings/:id/cancel` - Cancel booking
- `PUT /bookings/:id/status` - Update booking status

### Data Management
- `GET /pets/my` - Get user's pets
- `GET /services/:id` - Get service details
- `GET /providers/:id` - Get provider details

## Configuration

### Environment Variables
Create a `.env` file with:
```
STRIPE_PUBLISHABLE_KEY=pk_test_your_key_here
API_BASE_URL=https://your-api-url.com
```

### Stripe Configuration
1. Create a Stripe account at https://stripe.com
2. Get your publishable key from the Stripe dashboard
3. Set up webhooks for payment confirmation
4. Configure your backend to handle Stripe payment intents

## Testing

```bash
# Run tests
npm test

# Run linting
npm run lint

# Type checking
npm run type-check
```

## Deployment

### iOS
1. Configure signing in Xcode
2. Build for release: `npm run build:ios`
3. Submit to App Store

### Android
1. Generate signed APK: `npm run build:android`
2. Upload to Google Play Console

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details