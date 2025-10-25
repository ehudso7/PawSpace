import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { TimeSlot } from '../../types/booking';
import { BookingService } from '../../services/bookingService';

const { width } = Dimensions.get('window');

interface TimeSlotPickerProps {
  providerId: string;
  selectedDate: string;
  serviceDuration: number; // in minutes
  onTimeSelect: (timeSlot: TimeSlot) => void;
  selectedTime?: string;
}

export const TimeSlotPicker: React.FC<TimeSlotPickerProps> = ({
  providerId,
  selectedDate,
  serviceDuration,
  onTimeSelect,
  selectedTime,
}) => {
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (selectedDate && providerId && serviceDuration) {
      fetchTimeSlots();
    }
  }, [selectedDate, providerId, serviceDuration]);

  const fetchTimeSlots = async () => {
    setLoading(true);
    try {
      const slots = await BookingService.getTimeSlots(
        providerId,
        selectedDate,
        serviceDuration
      );
      setTimeSlots(slots);
    } catch (error) {
      console.error('Error fetching time slots:', error);
      setTimeSlots([]);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const formatTimeRange = (startTime: string, endTime: string) => {
    return `${formatTime(startTime)} - ${formatTime(endTime)}`;
  };

  const groupSlotsByPeriod = () => {
    const morning: TimeSlot[] = [];
    const afternoon: TimeSlot[] = [];
    const evening: TimeSlot[] = [];

    timeSlots.forEach(slot => {
      const hour = parseInt(slot.start_time.split(':')[0]);
      if (hour < 12) {
        morning.push(slot);
      } else if (hour < 17) {
        afternoon.push(slot);
      } else {
        evening.push(slot);
      }
    });

    return { morning, afternoon, evening };
  };

  const renderTimeSlot = (slot: TimeSlot) => {
    const isSelected = selectedTime === slot.start_time;
    const isAvailable = slot.is_available;

    return (
      <TouchableOpacity
        key={slot.start_time}
        style={[
          styles.timeSlot,
          isSelected && styles.selectedTimeSlot,
          !isAvailable && styles.unavailableTimeSlot,
        ]}
        onPress={() => isAvailable && onTimeSelect(slot)}
        disabled={!isAvailable}
      >
        <Text
          style={[
            styles.timeSlotText,
            isSelected && styles.selectedTimeSlotText,
            !isAvailable && styles.unavailableTimeSlotText,
          ]}
        >
          {formatTime(slot.start_time)}
        </Text>
        {!isAvailable && (
          <Text style={styles.unavailableLabel}>Booked</Text>
        )}
      </TouchableOpacity>
    );
  };

  const renderTimePeriod = (title: string, slots: TimeSlot[]) => {
    if (slots.length === 0) return null;

    return (
      <View style={styles.timePeriod}>
        <Text style={styles.timePeriodTitle}>{title}</Text>
        <View style={styles.slotsGrid}>
          {slots.map(renderTimeSlot)}
        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2196F3" />
        <Text style={styles.loadingText}>Loading available times...</Text>
      </View>
    );
  }

  if (timeSlots.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyTitle}>No Available Times</Text>
        <Text style={styles.emptyMessage}>
          This provider has no available time slots for the selected date.
          Please choose a different date.
        </Text>
      </View>
    );
  }

  const { morning, afternoon, evening } = groupSlotsByPeriod();

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Available Times</Text>
        <Text style={styles.headerSubtitle}>
          {new Date(selectedDate).toLocaleDateString('en-US', {
            weekday: 'long',
            month: 'long',
            day: 'numeric',
          })}
        </Text>
      </View>

      {renderTimePeriod('Morning', morning)}
      {renderTimePeriod('Afternoon', afternoon)}
      {renderTimePeriod('Evening', evening)}

      {selectedTime && (
        <View style={styles.selectedTimeInfo}>
          <Text style={styles.selectedTimeTitle}>Selected Time</Text>
          <Text style={styles.selectedTimeText}>
            {(() => {
              const slot = timeSlots.find(s => s.start_time === selectedTime);
              return slot ? formatTimeRange(slot.start_time, slot.end_time) : '';
            })()}
          </Text>
          <Text style={styles.durationText}>
            Duration: {Math.floor(serviceDuration / 60)}h {serviceDuration % 60}m
          </Text>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
    backgroundColor: '#f8f9fa',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666666',
    fontWeight: '500',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
    backgroundColor: '#f8f9fa',
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 8,
  },
  emptyMessage: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
    lineHeight: 24,
  },
  header: {
    padding: 16,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#666666',
  },
  timePeriod: {
    backgroundColor: '#ffffff',
    marginTop: 12,
    paddingVertical: 16,
  },
  timePeriodTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 12,
    paddingHorizontal: 16,
  },
  slotsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 12,
  },
  timeSlot: {
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    margin: 4,
    minWidth: (width - 56) / 3, // 3 slots per row with margins
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedTimeSlot: {
    backgroundColor: '#2196F3',
    borderColor: '#1976D2',
  },
  unavailableTimeSlot: {
    backgroundColor: '#e0e0e0',
    opacity: 0.6,
  },
  timeSlotText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333333',
  },
  selectedTimeSlotText: {
    color: '#ffffff',
  },
  unavailableTimeSlotText: {
    color: '#999999',
  },
  unavailableLabel: {
    fontSize: 10,
    color: '#999999',
    marginTop: 2,
  },
  selectedTimeInfo: {
    backgroundColor: '#ffffff',
    margin: 16,
    padding: 16,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
  },
  selectedTimeTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 8,
  },
  selectedTimeText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2196F3',
    marginBottom: 4,
  },
  durationText: {
    fontSize: 14,
    color: '#666666',
  },
});