import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Calendar } from 'react-native-calendars';
import { Service, SelectedService, TimeSlot } from '../../types/booking';
import CalendarView from '../../components/booking/CalendarView';
import TimeSlotPicker from '../../components/booking/TimeSlotPicker';
import { BookingService } from '../../services/bookingService';

interface BookingCalendarScreenProps {
  route: {
    params: {
      providerId: string;
      service: Service;
    };
  };
  navigation: any;
}

const BookingCalendarScreen: React.FC<BookingCalendarScreenProps> = ({ route, navigation }) => {
  const { providerId, service } = route.params;
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<TimeSlot | null>(null);
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingTimeSlots, setLoadingTimeSlots] = useState(false);

  useEffect(() => {
    // Set initial date to today
    const today = new Date().toISOString().split('T')[0];
    setSelectedDate(today);
    loadTimeSlots(today);
  }, []);

  const loadTimeSlots = async (date: string) => {
    if (!date) return;
    
    try {
      setLoadingTimeSlots(true);
      const slots = await BookingService.getTimeSlots(providerId, date, service.duration);
      setTimeSlots(slots);
    } catch (error) {
      console.error('Error loading time slots:', error);
      Alert.alert('Error', 'Failed to load available time slots');
    } finally {
      setLoadingTimeSlots(false);
    }
  };

  const handleDateSelect = (date: string) => {
    setSelectedDate(date);
    setSelectedTimeSlot(null);
    loadTimeSlots(date);
  };

  const handleTimeSlotSelect = (timeSlot: TimeSlot) => {
    setSelectedTimeSlot(timeSlot);
  };

  const handleContinue = () => {
    if (!selectedTimeSlot) {
      Alert.alert('Please Select Time', 'Please select a time slot to continue.');
      return;
    }

    navigation.navigate('BookingConfirm', {
      providerId,
      service,
      selectedDate,
      selectedTimeSlot,
    });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatTime = (timeSlot: TimeSlot) => {
    const startTime = new Date(`2000-01-01T${timeSlot.start_time}`);
    const endTime = new Date(`2000-01-01T${timeSlot.end_time}`);
    
    return `${startTime.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    })} - ${endTime.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    })}`;
  };

  const formatDuration = (minutes: number) => {
    if (minutes < 60) {
      return `${minutes} min`;
    }
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Book Appointment</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Service Summary */}
        <View style={styles.serviceSummary}>
          <Text style={styles.serviceTitle}>{service.title}</Text>
          <View style={styles.serviceDetails}>
            <View style={styles.serviceDetail}>
              <Ionicons name="time-outline" size={16} color="#666" />
              <Text style={styles.serviceDetailText}>
                {formatDuration(service.duration)}
              </Text>
            </View>
            <View style={styles.serviceDetail}>
              <Ionicons name="pricetag-outline" size={16} color="#666" />
              <Text style={styles.serviceDetailText}>
                ${service.price}
              </Text>
            </View>
          </View>
        </View>

        {/* Calendar */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Select Date</Text>
          <CalendarView
            providerId={providerId}
            selectedDate={selectedDate}
            onDateSelect={handleDateSelect}
          />
        </View>

        {/* Time Slots */}
        {selectedDate && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              Available Times for {formatDate(selectedDate)}
            </Text>
            {loadingTimeSlots ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="small" color="#007AFF" />
                <Text style={styles.loadingText}>Loading time slots...</Text>
              </View>
            ) : (
              <TimeSlotPicker
                timeSlots={timeSlots}
                selectedTimeSlot={selectedTimeSlot}
                onTimeSlotSelect={handleTimeSlotSelect}
              />
            )}
          </View>
        )}

        {/* Selected Summary */}
        {selectedDate && selectedTimeSlot && (
          <View style={styles.selectedSummary}>
            <Text style={styles.summaryTitle}>Selected Appointment</Text>
            <View style={styles.summaryContent}>
              <View style={styles.summaryRow}>
                <Ionicons name="calendar-outline" size={20} color="#007AFF" />
                <Text style={styles.summaryText}>{formatDate(selectedDate)}</Text>
              </View>
              <View style={styles.summaryRow}>
                <Ionicons name="time-outline" size={20} color="#007AFF" />
                <Text style={styles.summaryText}>{formatTime(selectedTimeSlot)}</Text>
              </View>
              <View style={styles.summaryRow}>
                <Ionicons name="cut-outline" size={20} color="#007AFF" />
                <Text style={styles.summaryText}>{service.title}</Text>
              </View>
              <View style={styles.summaryRow}>
                <Ionicons name="pricetag-outline" size={20} color="#007AFF" />
                <Text style={styles.summaryText}>${service.price}</Text>
              </View>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Bottom Bar */}
      <View style={styles.bottomBar}>
        <View style={styles.priceContainer}>
          <Text style={styles.priceLabel}>Total</Text>
          <Text style={styles.priceValue}>${service.price}</Text>
        </View>
        <TouchableOpacity
          style={[
            styles.continueButton,
            (!selectedDate || !selectedTimeSlot) && styles.continueButtonDisabled,
          ]}
          onPress={handleContinue}
          disabled={!selectedDate || !selectedTimeSlot}
        >
          <Text style={styles.continueButtonText}>Continue</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
  },
  serviceSummary: {
    backgroundColor: '#f8f9fa',
    margin: 20,
    padding: 16,
    borderRadius: 12,
  },
  serviceTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  serviceDetails: {
    flexDirection: 'row',
  },
  serviceDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  serviceDetailText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 4,
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
  },
  loadingText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#666',
  },
  selectedSummary: {
    backgroundColor: '#f0f8ff',
    margin: 20,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#007AFF',
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  summaryContent: {
    gap: 8,
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  summaryText: {
    fontSize: 14,
    color: '#333',
    marginLeft: 8,
  },
  bottomBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    backgroundColor: '#fff',
  },
  priceContainer: {
    flex: 1,
  },
  priceLabel: {
    fontSize: 14,
    color: '#666',
  },
  priceValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  continueButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  continueButtonDisabled: {
    backgroundColor: '#ccc',
  },
  continueButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
});

export default BookingCalendarScreen;