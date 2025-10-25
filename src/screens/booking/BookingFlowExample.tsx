import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { ProviderProfileScreen } from './ProviderProfileScreen';
import { BookingCalendarScreen } from './BookingCalendarScreen';
import { ServiceSelectorSheet } from '../../components/booking/ServiceSelectorSheet';
import { Service, TimeSlot, ProviderProfile } from '../../types/booking';

interface BookingFlowExampleProps {
  initialProviderId: string;
}

type FlowStep = 'profile' | 'calendar' | 'confirmation';

export const BookingFlowExample: React.FC<BookingFlowExampleProps> = ({
  initialProviderId,
}) => {
  const [currentStep, setCurrentStep] = useState<FlowStep>('profile');
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<TimeSlot | null>(null);
  const [showServiceSelector, setShowServiceSelector] = useState(false);
  const [provider, setProvider] = useState<ProviderProfile | null>(null);

  // Mock provider services for the service selector
  const mockServices: Service[] = [
    {
      id: '1',
      title: 'Dog Grooming - Full Service',
      description: 'Complete grooming package including bath, nail trim, ear cleaning, and styling',
      duration: 120,
      price: 75,
      category: 'Grooming',
    },
    {
      id: '2',
      title: 'Cat Grooming - Basic',
      description: 'Basic grooming with bath, brush, and nail trim',
      duration: 90,
      price: 55,
      category: 'Grooming',
    },
    {
      id: '3',
      title: 'Pet Training Session',
      description: 'One-on-one training session for behavioral improvement',
      duration: 60,
      price: 85,
      category: 'Training',
    },
    {
      id: '4',
      title: 'Dental Cleaning',
      description: 'Professional dental cleaning and oral health check',
      duration: 45,
      price: 95,
      category: 'Health',
    },
  ];

  const handleBookService = (service: Service) => {
    setSelectedService(service);
    setCurrentStep('calendar');
    setShowServiceSelector(false);
  };

  const handleShowServiceSelector = () => {
    setShowServiceSelector(true);
  };

  const handleMessage = () => {
    Alert.alert('Message', 'Opening message conversation...');
  };

  const handleShare = () => {
    Alert.alert('Share', 'Sharing provider profile...');
  };

  const handleCalendarContinue = (bookingDetails: {
    providerId: string;
    service: Service;
    date: string;
    timeSlot: TimeSlot;
  }) => {
    setSelectedDate(bookingDetails.date);
    setSelectedTimeSlot(bookingDetails.timeSlot);
    
    // Here you would navigate to the confirmation screen
    Alert.alert(
      'Booking Confirmation',
      `Service: ${bookingDetails.service.title}\nDate: ${bookingDetails.date}\nTime: ${bookingDetails.timeSlot.start_time} - ${bookingDetails.timeSlot.end_time}\nPrice: $${bookingDetails.service.price}`,
      [
        {
          text: 'Confirm Booking',
          onPress: () => {
            // Handle booking confirmation
            Alert.alert('Success', 'Your booking has been confirmed!');
            setCurrentStep('profile');
          },
        },
        {
          text: 'Back',
          style: 'cancel',
        },
      ]
    );
  };

  const handleBackToProfile = () => {
    setCurrentStep('profile');
    setSelectedService(null);
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 'profile':
        return (
          <ProviderProfileScreen
            providerId={initialProviderId}
            onBookService={handleShowServiceSelector}
            onMessage={handleMessage}
            onShare={handleShare}
          />
        );
      
      case 'calendar':
        if (!selectedService) {
          setCurrentStep('profile');
          return null;
        }
        return (
          <BookingCalendarScreen
            providerId={initialProviderId}
            service={selectedService}
            onContinue={handleCalendarContinue}
            onBack={handleBackToProfile}
          />
        );
      
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      {renderCurrentStep()}
      
      <ServiceSelectorSheet
        visible={showServiceSelector}
        services={mockServices}
        onClose={() => setShowServiceSelector(false)}
        onSelectService={handleBookService}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
});