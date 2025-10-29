/**
 * Advanced Usage Examples for Provider Profile & Booking System
 * 
 * This file demonstrates advanced patterns and integration scenarios
 */

import React, { useState, useCallback } from 'react';
import { View, Alert, Platform } from 'react-native';
import ProviderProfileScreen from '../src/screens/booking/ProviderProfileScreen';
import BookingCalendarScreen from '../src/screens/booking/BookingCalendarScreen';
import { Service, BookingDetails, CreateBookingData } from '../src/types/booking.types';
import { createBooking } from '../src/services/bookings';

// Example 1: Navigation Integration (React Navigation)
// ====================================================

interface NavigationProps {
  navigation: any;
  route: any;
}

export const ProviderProfileWithNavigation: React.FC<NavigationProps> = ({
  navigation,
  route,
}) => {
  const { providerId } = route.params;

  const handleBookService = useCallback((service: Service) => {
    navigation.navigate('BookingCalendar', {
      providerId,
      service,
    });
  }, [navigation, providerId]);

  const handleMessage = useCallback(() => {
    navigation.navigate('Chat', { providerId });
  }, [navigation, providerId]);

  const handleShare = useCallback(async () => {
    // Example: Share provider profile
    if (Platform.OS === 'ios' || Platform.OS === 'android') {
      // Use react-native-share or native Share API
      const shareUrl = `https://app.example.com/provider/${providerId}`;
      Alert.alert('Share', `Share URL: ${shareUrl}`);
    }
  }, [providerId]);

  return (
    <ProviderProfileScreen
      providerId={providerId}
      onBookService={handleBookService}
      onMessage={handleMessage}
      onShare={handleShare}
    />
  );
};

export const BookingCalendarWithNavigation: React.FC<NavigationProps> = ({
  navigation,
  route,
}) => {
  const { providerId, providerName, service } = route.params;

  const handleContinue = useCallback(async (bookingDetails: BookingDetails) => {
    navigation.navigate('BookingConfirmation', { bookingDetails });
  }, [navigation]);

  const handleBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  return (
    <BookingCalendarScreen
      providerId={providerId}
      providerName={providerName}
      service={service}
      onContinue={handleContinue}
      onBack={handleBack}
    />
  );
};


// Example 2: State Management Integration (Redux/Zustand)
// =======================================================

// interface _BookingState {
//   selectedProvider: string | null;
//   selectedService: Service | null;
//   bookingDetails: BookingDetails | null;
// }

// Zustand store example
/*
import create from 'zustand';

interface BookingStore extends BookingState {
  setSelectedProvider: (providerId: string) => void;
  setSelectedService: (service: Service) => void;
  setBookingDetails: (details: BookingDetails) => void;
  clearBooking: () => void;
}

export const useBookingStore = create<BookingStore>((set) => ({
  selectedProvider: null,
  selectedService: null,
  bookingDetails: null,
  setSelectedProvider: (providerId) => set({ selectedProvider: providerId }),
  setSelectedService: (service) => set({ selectedService: service }),
  setBookingDetails: (details) => set({ bookingDetails: details }),
  clearBooking: () => set({
    selectedProvider: null,
    selectedService: null,
    bookingDetails: null,
  }),
}));
*/


// Example 3: Analytics Integration
// =================================

interface AnalyticsEvent {
  event: string;
  properties?: Record<string, any>;
}

const logEvent = (event: AnalyticsEvent) => {
  console.log('[Analytics]', event);
  // Integration with Firebase Analytics, Mixpanel, etc.
  // analytics().logEvent(event.event, event.properties);
};

export const ProviderProfileWithAnalytics: React.FC<{ providerId: string }> = ({
  providerId,
}) => {
  const handleBookService = useCallback((service: Service) => {
    logEvent({
      event: 'service_selected',
      properties: {
        provider_id: providerId,
        service_id: service.id,
        service_title: service.title,
        service_price: service.price,
      },
    });
    // Navigate to calendar
  }, [providerId]);

  const handleMessage = useCallback(() => {
    logEvent({
      event: 'message_provider_clicked',
      properties: { provider_id: providerId },
    });
  }, [providerId]);

  const handleShare = useCallback(() => {
    logEvent({
      event: 'share_provider_clicked',
      properties: { provider_id: providerId },
    });
  }, [providerId]);

  return (
    <ProviderProfileScreen
      providerId={providerId}
      onBookService={handleBookService}
      onMessage={handleMessage}
      onShare={handleShare}
    />
  );
};


// Example 4: Error Boundary Integration
// =====================================

import { Component, ErrorInfo, ReactNode } from 'react';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

export class BookingErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Booking Error:', error, errorInfo);
    logEvent({
      event: 'booking_error',
      properties: {
        error_message: error.message,
        error_stack: error.stack,
      },
    });
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            {/* Error fallback UI */}
          </View>
        )
      );
    }

    return this.props.children;
  }
}


// Example 5: Custom Hook for Booking Flow
// =======================================

interface UseBookingFlowReturn {
  currentStep: 'profile' | 'calendar' | 'confirmation';
  selectedService: Service | null;
  bookingDetails: BookingDetails | null;
  selectService: (service: Service) => void;
  continueToCalendar: () => void;
  confirmBooking: (details: BookingDetails) => Promise<void>;
  goBack: () => void;
  reset: () => void;
}

export const useBookingFlow = (_providerId: string): UseBookingFlowReturn => {
  const [currentStep, setCurrentStep] = useState<'profile' | 'calendar' | 'confirmation'>('profile');
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [bookingDetails, setBookingDetails] = useState<BookingDetails | null>(null);

  const selectService = useCallback((service: Service) => {
    setSelectedService(service);
    setCurrentStep('calendar');
  }, []);

  const continueToCalendar = useCallback(() => {
    setCurrentStep('calendar');
  }, []);

  const confirmBooking = useCallback(async (details: BookingDetails) => {
    try {
      const bookingData: CreateBookingData = {
        serviceId: details.service_id,
        providerId: details.provider_id,
        petId: 'pet-1', // This should come from the booking flow
        date: details.date,
        time: details.start_time,
        location: {
          address: '123 Main St',
          city: 'City',
          state: 'State',
          zip_code: '12345',
        },
        notes: 'Booking from AdvancedUsage example',
      };
      const result = await createBooking(bookingData);
      setBookingDetails(details);
      setCurrentStep('confirmation');
      
      logEvent({
        event: 'booking_created',
        properties: {
          booking_id: result.id,
          provider_id: details.provider_id,
          service_id: details.service_id,
          date: details.date,
          total_price: details.service_price,
        },
      });
      
      Alert.alert(
        'Success!',
        'Your booking has been confirmed.',
        [{ text: 'OK' }]
      );
    } catch (error) {
      console.error('Error creating booking:', error);
      Alert.alert(
        'Error',
        'Failed to create booking. Please try again.',
        [{ text: 'OK' }]
      );
      throw error;
    }
  }, []);

  const goBack = useCallback(() => {
    if (currentStep === 'calendar') {
      setCurrentStep('profile');
      setSelectedService(null);
    } else if (currentStep === 'confirmation') {
      setCurrentStep('calendar');
    }
  }, [currentStep]);

  const reset = useCallback(() => {
    setCurrentStep('profile');
    setSelectedService(null);
    setBookingDetails(null);
  }, []);

  return {
    currentStep,
    selectedService,
    bookingDetails,
    selectService,
    continueToCalendar,
    confirmBooking,
    goBack,
    reset,
  };
};


// Example 6: Testing Utilities
// ============================

/**
 * Mock provider profile data for testing
 */
export const mockProviderProfile = {
  id: 'test-provider-1',
  full_name: 'Test Provider',
  avatar_url: 'https://i.pravatar.cc/300',
  cover_photo_url: 'https://picsum.photos/400/200',
  bio: 'Test bio',
  location: {
    address: '123 Test St',
    city: 'Test City',
    state: 'TC',
    zip_code: '12345',
  },
  rating: 5.0,
  total_reviews: 100,
  total_bookings: 500,
  service_types: ['Test Service'],
  business_hours: {
    monday: { open: '09:00', close: '17:00' },
  },
  services: [
    {
      id: 'service-1',
      title: 'Test Service',
      description: 'Test description',
      duration: 60,
      price: 50,
      category: 'Test',
    },
  ],
  portfolio_items: [],
};

/**
 * Mock booking details for testing
 */
export const mockBookingDetails: BookingDetails = {
  provider_id: 'test-provider-1',
  service_id: 'service-1',
  date: '2024-12-01',
  start_time: '2024-12-01T10:00:00',
  end_time: '2024-12-01T11:00:00',
  service_title: 'Test Service',
  service_duration: 60,
  service_price: 50,
};


// Example 7: Accessibility Enhancements
// =====================================

/**
 * Example of adding accessibility props to components
 */
/*
<TouchableOpacity
  accessible={true}
  accessibilityLabel="Book service button"
  accessibilityHint="Double tap to select a service and book an appointment"
  accessibilityRole="button"
  onPress={handleBookService}
>
  <Text>Book Service</Text>
</TouchableOpacity>
*/


// Example 8: Internationalization (i18n)
// ======================================

/**
 * Example translations object
 */
export const translations = {
  en: {
    booking: {
      title: 'Book Appointment',
      selectDate: 'Select a Date',
      selectTime: 'Select a Time',
      continue: 'Continue',
      bookService: 'Book Service',
      back: 'Back',
      summary: 'Booking Summary',
      service: 'Service',
      date: 'Date',
      time: 'Time',
      duration: 'Duration',
      totalPrice: 'Total Price',
    },
  },
  es: {
    booking: {
      title: 'Reservar Cita',
      selectDate: 'Seleccionar Fecha',
      selectTime: 'Seleccionar Hora',
      continue: 'Continuar',
      bookService: 'Reservar Servicio',
      back: 'Volver',
      summary: 'Resumen de Reserva',
      service: 'Servicio',
      date: 'Fecha',
      time: 'Hora',
      duration: 'Duración',
      totalPrice: 'Precio Total',
    },
  },
};

// Usage with i18n library:
// import { useTranslation } from 'react-i18next';
// const { t } = useTranslation();
// <Text>{t('booking.title')}</Text>
