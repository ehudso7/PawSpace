import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { ProviderProfileScreen } from './src/screens/booking/ProviderProfileScreen';
import { BookingCalendarScreen } from './src/screens/booking/BookingCalendarScreen';
import { Service, BookingDetails } from './src/types/booking.types';

type Screen = 'profile' | 'calendar' | 'confirmation';

interface AppState {
  currentScreen: Screen;
  selectedService: Service | null;
}

export default function App() {
  const [appState, setAppState] = useState<AppState>({
    currentScreen: 'profile',
    selectedService: null,
  });

  // Example provider ID
  const providerId = 'provider-123';
  const providerName = 'Sarah Johnson';

  const handleBookService = (service: Service) => {
    setAppState({
      currentScreen: 'calendar',
      selectedService: service,
    });
  };

  const handleBackToProfile = () => {
    setAppState({
      currentScreen: 'profile',
      selectedService: null,
    });
  };

  const handleContinueBooking = (bookingDetails: BookingDetails) => {
    // In production, navigate to confirmation screen or create booking
    Alert.alert(
      'Booking Details',
      `Service: ${bookingDetails.service_title}\n` +
      `Date: ${bookingDetails.date}\n` +
      `Time: ${new Date(bookingDetails.start_time).toLocaleTimeString()}\n` +
      `Price: $${bookingDetails.service_price}`,
      [
        {
          text: 'Confirm',
          onPress: () => {
            // Create booking in Supabase
            console.log('Creating booking:', bookingDetails);
            handleBackToProfile();
          },
        },
        {
          text: 'Cancel',
          style: 'cancel',
        },
      ]
    );
  };

  const handleMessage = () => {
    Alert.alert('Message', 'Opening message screen...');
  };

  const handleShare = () => {
    Alert.alert('Share', 'Opening share dialog...');
  };

  return (
    <View style={styles.container}>
      {appState.currentScreen === 'profile' && (
        <ProviderProfileScreen
          providerId={providerId}
          onBookService={handleBookService}
          onMessage={handleMessage}
          onShare={handleShare}
        />
      )}

      {appState.currentScreen === 'calendar' && appState.selectedService && (
        <BookingCalendarScreen
          providerId={providerId}
          providerName={providerName}
          service={appState.selectedService}
          onContinue={handleContinueBooking}
          onBack={handleBackToProfile}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
});
