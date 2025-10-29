import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { TimeSlot } from '../../types/booking.types';
import { getTimeSlots } from '../../services/bookings.service';

interface TimeSlotPickerProps {
  providerId: string;
  selectedDate: string;
  serviceDuration: number;
  selectedSlot?: TimeSlot;
  onSlotSelect: (slot: TimeSlot) => void;
}

export const TimeSlotPicker: React.FC<TimeSlotPickerProps> = ({
  providerId,
  selectedDate,
  serviceDuration,
  selectedSlot,
  onSlotSelect,
}) => {
  const [slots, setSlots] = useState<TimeSlot[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadTimeSlots();
  }, [providerId, selectedDate, serviceDuration]);

  const loadTimeSlots = async () => {
    try {
      setLoading(true);
      setError(null);
      const availableSlots = await getTimeSlots(providerId, selectedDate, serviceDuration);
      setSlots(availableSlots);
    } catch (err) {
      console.error('Error loading time slots:', err);
      setError('Failed to load available time slots');
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (isoString: string): string => {
    const date = new Date(isoString);
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours % 12 || 12;
    return `${displayHours}:${minutes.toString().padStart(2, '0')} ${ampm}`;
  };

  const groupSlotsByPeriod = () => {
    const morning: TimeSlot[] = [];
    const afternoon: TimeSlot[] = [];
    const evening: TimeSlot[] = [];

    slots.forEach((slot) => {
      const hour = new Date(slot.start_time).getHours();
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

  const renderSlotGroup = (title: string, groupSlots: TimeSlot[]) => {
    if (groupSlots.length === 0) return null;

    return (
      <View style={styles.slotGroup}>
        <Text style={styles.groupTitle}>{title}</Text>
        <View style={styles.slotsContainer}>
          {groupSlots.map((slot, index) => {
            const isSelected =
              selectedSlot?.start_time === slot.start_time &&
              selectedSlot?.end_time === slot.end_time;
            const isDisabled = !slot.is_available;

            return (
              <TouchableOpacity
                key={`${slot.start_time}-${index}`}
                style={[
                  styles.slotButton,
                  isSelected && styles.slotButtonSelected,
                  isDisabled && styles.slotButtonDisabled,
                ]}
                onPress={() => !isDisabled && onSlotSelect(slot)}
                disabled={isDisabled}
              >
                <Text
                  style={[
                    styles.slotText,
                    isSelected && styles.slotTextSelected,
                    isDisabled && styles.slotTextDisabled,
                  ]}
                >
                  {formatTime(slot.start_time)}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6200EE" />
        <Text style={styles.loadingText}>Loading available times...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={loadTimeSlots}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (slots.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No available time slots for this date</Text>
        <Text style={styles.emptySubtext}>Please select another date</Text>
      </View>
    );
  }

  const { morning, afternoon, evening } = groupSlotsByPeriod();

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <Text style={styles.title}>Available Time Slots</Text>
        <Text style={styles.subtitle}>
          Select a time for your {serviceDuration}-minute appointment
        </Text>
      </View>

      {renderSlotGroup('Morning', morning)}
      {renderSlotGroup('Afternoon', afternoon)}
      {renderSlotGroup('Evening', evening)}

      <View style={styles.infoContainer}>
        <Text style={styles.infoText}>
          📅 All times are in your local timezone
        </Text>
        <Text style={styles.infoText}>
          ⏱️ Service duration: {serviceDuration} minutes
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  contentContainer: {
    padding: 16,
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#666666',
  },
  slotGroup: {
    marginBottom: 24,
  },
  groupTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  slotsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  slotButton: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    backgroundColor: '#FFFFFF',
    minWidth: 100,
    alignItems: 'center',
  },
  slotButtonSelected: {
    backgroundColor: '#6200EE',
    borderColor: '#6200EE',
  },
  slotButtonDisabled: {
    backgroundColor: '#F5F5F5',
    borderColor: '#E0E0E0',
  },
  slotText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#000000',
  },
  slotTextSelected: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  slotTextDisabled: {
    color: '#BDBDBD',
    textDecorationLine: 'line-through',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#666666',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  errorText: {
    fontSize: 16,
    color: '#D32F2F',
    textAlign: 'center',
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: '#6200EE',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 16,
    color: '#000000',
    textAlign: 'center',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#666666',
    textAlign: 'center',
  },
  infoContainer: {
    marginTop: 24,
    padding: 16,
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
  },
  infoText: {
    fontSize: 12,
    color: '#666666',
    marginBottom: 4,
  },
});

export default TimeSlotPicker;
