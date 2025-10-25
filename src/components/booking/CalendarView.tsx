import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  StyleSheet,
  ActivityIndicator,
  Text,
  Dimensions,
} from 'react-native';
import { Calendar, DateData } from 'react-native-calendars';
import { AvailabilitySlot, CalendarMarking } from '../../types/booking';
import { BookingService } from '../../services/bookingService';

const { width } = Dimensions.get('window');

interface CalendarViewProps {
  providerId: string;
  onDateSelect: (date: string) => void;
  selectedDate?: string;
}

export const CalendarView: React.FC<CalendarViewProps> = ({
  providerId,
  onDateSelect,
  selectedDate,
}) => {
  const [availability, setAvailability] = useState<AvailabilitySlot[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentMonth, setCurrentMonth] = useState(
    new Date().toISOString().slice(0, 7) // YYYY-MM format
  );

  // Fetch availability when provider or month changes
  useEffect(() => {
    fetchAvailability();
  }, [providerId, currentMonth]);

  const fetchAvailability = async () => {
    setLoading(true);
    try {
      const slots = await BookingService.getProviderAvailability(providerId, currentMonth);
      setAvailability(slots);
    } catch (error) {
      console.error('Error fetching availability:', error);
    } finally {
      setLoading(false);
    }
  };

  // Generate calendar markings based on availability
  const markedDates = useMemo(() => {
    const markings: CalendarMarking = {};
    const today = new Date().toISOString().split('T')[0];

    availability.forEach(slot => {
      const isPast = slot.date < today;
      const isSelected = slot.date === selectedDate;
      
      markings[slot.date] = {
        marked: slot.is_available && !isPast,
        dotColor: slot.is_available && !isPast ? '#4CAF50' : undefined,
        selected: isSelected,
        selectedColor: isSelected ? '#2196F3' : undefined,
        selectedTextColor: isSelected ? '#FFFFFF' : undefined,
        disabled: !slot.is_available || isPast,
        disableTouchEvent: !slot.is_available || isPast,
      };
    });

    return markings;
  }, [availability, selectedDate]);

  const handleDayPress = (day: DateData) => {
    const slot = availability.find(s => s.date === day.dateString);
    if (slot?.is_available && day.dateString >= new Date().toISOString().split('T')[0]) {
      onDateSelect(day.dateString);
    }
  };

  const handleMonthChange = (month: DateData) => {
    const monthString = `${month.year}-${month.month.toString().padStart(2, '0')}`;
    setCurrentMonth(monthString);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2196F3" />
        <Text style={styles.loadingText}>Loading availability...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Calendar
        style={styles.calendar}
        theme={{
          backgroundColor: '#ffffff',
          calendarBackground: '#ffffff',
          textSectionTitleColor: '#666666',
          selectedDayBackgroundColor: '#2196F3',
          selectedDayTextColor: '#ffffff',
          todayTextColor: '#2196F3',
          dayTextColor: '#2d4150',
          textDisabledColor: '#d9e1e8',
          dotColor: '#4CAF50',
          selectedDotColor: '#ffffff',
          arrowColor: '#2196F3',
          disabledArrowColor: '#d9e1e8',
          monthTextColor: '#2d4150',
          indicatorColor: '#2196F3',
          textDayFontFamily: 'System',
          textMonthFontFamily: 'System',
          textDayHeaderFontFamily: 'System',
          textDayFontWeight: '400',
          textMonthFontWeight: '600',
          textDayHeaderFontWeight: '600',
          textDayFontSize: 16,
          textMonthFontSize: 18,
          textDayHeaderFontSize: 14,
        }}
        markedDates={markedDates}
        onDayPress={handleDayPress}
        onMonthChange={handleMonthChange}
        minDate={new Date().toISOString().split('T')[0]}
        maxDate={new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]} // 3 months ahead
        firstDay={0} // Sunday first
        showWeekNumbers={false}
        disableMonthChange={false}
        hideArrows={false}
        hideExtraDays={true}
        disableArrowLeft={false}
        disableArrowRight={false}
        enableSwipeMonths={true}
      />
      
      {/* Legend */}
      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: '#4CAF50' }]} />
          <Text style={styles.legendText}>Available</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: '#d9e1e8' }]} />
          <Text style={styles.legendText}>Unavailable</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: '#2196F3' }]} />
          <Text style={styles.legendText}>Selected</Text>
        </View>
      </View>

      {/* Availability info */}
      {selectedDate && (
        <View style={styles.availabilityInfo}>
          <Text style={styles.availabilityText}>
            {(() => {
              const slot = availability.find(s => s.date === selectedDate);
              if (!slot) return 'No availability information';
              if (!slot.is_available) return 'No slots available';
              return `${slot.available_slots} slot${slot.available_slots !== 1 ? 's' : ''} available`;
            })()}
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    margin: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
  },
  calendar: {
    borderRadius: 12,
    paddingBottom: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666666',
    fontWeight: '500',
  },
  legend: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  legendText: {
    fontSize: 12,
    color: '#666666',
    fontWeight: '500',
  },
  availabilityInfo: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    alignItems: 'center',
  },
  availabilityText: {
    fontSize: 14,
    color: '#2196F3',
    fontWeight: '600',
  },
});