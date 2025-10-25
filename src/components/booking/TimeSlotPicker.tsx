import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { TimeSlot } from '../../types/booking';

const { width } = Dimensions.get('window');
const SLOT_WIDTH = (width - 60) / 2; // 2 columns with padding

interface TimeSlotPickerProps {
  timeSlots: TimeSlot[];
  selectedTimeSlot: TimeSlot | null;
  onTimeSlotSelect: (timeSlot: TimeSlot) => void;
}

const TimeSlotPicker: React.FC<TimeSlotPickerProps> = ({
  timeSlots,
  selectedTimeSlot,
  onTimeSlotSelect,
}) => {
  const formatTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(':');
    const date = new Date();
    date.setHours(parseInt(hours), parseInt(minutes));
    
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  const formatDuration = (startTime: string, endTime: string) => {
    const start = new Date(`2000-01-01T${startTime}`);
    const end = new Date(`2000-01-01T${endTime}`);
    const durationMs = end.getTime() - start.getTime();
    const durationMinutes = Math.round(durationMs / (1000 * 60));
    
    if (durationMinutes < 60) {
      return `${durationMinutes} min`;
    }
    const hours = Math.floor(durationMinutes / 60);
    const minutes = durationMinutes % 60;
    return minutes > 0 ? `${hours}h ${minutes}m` : `${hours}h`;
  };

  const isSelected = (timeSlot: TimeSlot) => {
    return selectedTimeSlot?.start_time === timeSlot.start_time &&
           selectedTimeSlot?.end_time === timeSlot.end_time;
  };

  const handleTimeSlotPress = (timeSlot: TimeSlot) => {
    if (timeSlot.is_available) {
      onTimeSlotSelect(timeSlot);
    }
  };

  const getSlotStyle = (timeSlot: TimeSlot) => {
    if (!timeSlot.is_available) {
      return [styles.timeSlot, styles.timeSlotUnavailable];
    }
    if (isSelected(timeSlot)) {
      return [styles.timeSlot, styles.timeSlotSelected];
    }
    return [styles.timeSlot, styles.timeSlotAvailable];
  };

  const getSlotTextStyle = (timeSlot: TimeSlot) => {
    if (!timeSlot.is_available) {
      return [styles.timeSlotText, styles.timeSlotTextUnavailable];
    }
    if (isSelected(timeSlot)) {
      return [styles.timeSlotText, styles.timeSlotTextSelected];
    }
    return [styles.timeSlotText, styles.timeSlotTextAvailable];
  };

  if (timeSlots.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Ionicons name="time-outline" size={48} color="#ccc" />
        <Text style={styles.emptyTitle}>No Available Times</Text>
        <Text style={styles.emptyMessage}>
          There are no available time slots for this date. Please try selecting a different date.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.timeSlotsGrid}>
          {timeSlots.map((timeSlot, index) => (
            <TouchableOpacity
              key={`${timeSlot.start_time}-${timeSlot.end_time}`}
              style={getSlotStyle(timeSlot)}
              onPress={() => handleTimeSlotPress(timeSlot)}
              disabled={!timeSlot.is_available}
              activeOpacity={timeSlot.is_available ? 0.7 : 1}
            >
              <Text style={getSlotTextStyle(timeSlot)}>
                {formatTime(timeSlot.start_time)}
              </Text>
              <Text style={[styles.timeSlotDuration, getSlotTextStyle(timeSlot)]}>
                {formatDuration(timeSlot.start_time, timeSlot.end_time)}
              </Text>
              {!timeSlot.is_available && (
                <View style={styles.unavailableOverlay}>
                  <Ionicons name="close-circle" size={16} color="#ccc" />
                </View>
              )}
              {isSelected(timeSlot) && (
                <View style={styles.selectedOverlay}>
                  <Ionicons name="checkmark-circle" size={20} color="#007AFF" />
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
      
      {/* Info */}
      <View style={styles.infoContainer}>
        <View style={styles.infoItem}>
          <View style={[styles.infoDot, { backgroundColor: '#4CAF50' }]} />
          <Text style={styles.infoText}>Available</Text>
        </View>
        <View style={styles.infoItem}>
          <View style={[styles.infoDot, { backgroundColor: '#007AFF' }]} />
          <Text style={styles.infoText}>Selected</Text>
        </View>
        <View style={styles.infoItem}>
          <View style={[styles.infoDot, { backgroundColor: '#ccc' }]} />
          <Text style={styles.infoText}>Booked</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  scrollContent: {
    padding: 16,
  },
  timeSlotsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  timeSlot: {
    width: SLOT_WIDTH,
    height: 80,
    borderRadius: 12,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    position: 'relative',
  },
  timeSlotAvailable: {
    backgroundColor: '#f8f9fa',
    borderColor: '#e9ecef',
  },
  timeSlotSelected: {
    backgroundColor: '#e3f2fd',
    borderColor: '#007AFF',
  },
  timeSlotUnavailable: {
    backgroundColor: '#f5f5f5',
    borderColor: '#e0e0e0',
  },
  timeSlotText: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  timeSlotTextAvailable: {
    color: '#333',
  },
  timeSlotTextSelected: {
    color: '#007AFF',
  },
  timeSlotTextUnavailable: {
    color: '#999',
  },
  timeSlotDuration: {
    fontSize: 12,
    marginTop: 2,
    fontWeight: '400',
  },
  unavailableOverlay: {
    position: 'absolute',
    top: 4,
    right: 4,
  },
  selectedOverlay: {
    position: 'absolute',
    top: 4,
    right: 4,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyMessage: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
  },
  infoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 4,
  },
  infoText: {
    fontSize: 12,
    color: '#666',
  },
});

export default TimeSlotPicker;