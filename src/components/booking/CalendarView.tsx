import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { Calendar, DateData } from 'react-native-calendars';
import { AvailabilitySlot } from '../../types/booking.types';
import { getProviderAvailability } from '../../services/bookings.service';

interface CalendarViewProps {
  providerId: string;
  selectedDate?: string;
  onDateSelect: (date: string) => void;
}

export const CalendarView: React.FC<CalendarViewProps> = ({
  providerId,
  selectedDate,
  onDateSelect,
}) => {
  const [availability, setAvailability] = useState<Record<string, AvailabilitySlot>>({});
  const [loading, setLoading] = useState(true);
  const [currentMonth, setCurrentMonth] = useState(
    new Date().toISOString().slice(0, 7)
  );

  useEffect(() => {
    loadAvailability();
  }, [providerId, currentMonth]);

  const loadAvailability = async () => {
    try {
      setLoading(true);
      const slots = await getProviderAvailability(providerId, currentMonth);
      
      // Convert array to object for easier lookup
      const availabilityMap = slots.reduce((acc, slot) => {
        acc[slot.date] = slot;
        return acc;
      }, {} as Record<string, AvailabilitySlot>);
      
      setAvailability(availabilityMap);
    } catch (error) {
      console.error('Error loading availability:', error);
    } finally {
      setLoading(false);
    }
  };

  const getMarkedDates = () => {
    const marked: any = {};
    const today = new Date().toISOString().split('T')[0];

    Object.entries(availability).forEach(([date, slot]) => {
      const isPast = date < today;
      
      marked[date] = {
        disabled: isPast || !slot.is_available,
        disableTouchEvent: isPast || !slot.is_available,
        customStyles: {
          container: {
            backgroundColor: slot.is_available && !isPast
              ? slot.available_slots > 5
                ? '#E8F5E9' // Many slots available
                : slot.available_slots > 0
                ? '#FFF9C4' // Few slots available
                : '#FFEBEE' // No slots
              : '#F5F5F5', // Unavailable or past
            borderRadius: 8,
          },
          text: {
            color: isPast || !slot.is_available ? '#BDBDBD' : '#000000',
            fontWeight: '500' as any,
          },
        },
      };
    });

    // Mark selected date
    if (selectedDate && marked[selectedDate]) {
      marked[selectedDate] = {
        ...marked[selectedDate],
        selected: true,
        customStyles: {
          ...marked[selectedDate].customStyles,
          container: {
            ...marked[selectedDate].customStyles.container,
            borderWidth: 2,
            borderColor: '#6200EE',
          },
        },
      };
    } else if (selectedDate) {
      marked[selectedDate] = {
        selected: true,
        customStyles: {
          container: {
            backgroundColor: '#6200EE',
            borderRadius: 8,
          },
          text: {
            color: '#FFFFFF',
            fontWeight: 'bold' as any,
          },
        },
      };
    }

    return marked;
  };

  const onDayPress = (day: DateData) => {
    const slot = availability[day.dateString];
    const today = new Date().toISOString().split('T')[0];
    const isPast = day.dateString < today;

    if (!isPast && slot && slot.is_available) {
      onDateSelect(day.dateString);
    }
  };

  const onMonthChange = (month: DateData) => {
    setCurrentMonth(`${month.year}-${month.month.toString().padStart(2, '0')}`);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6200EE" />
        <Text style={styles.loadingText}>Loading availability...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Calendar
        current={currentMonth + '-01'}
        minDate={new Date().toISOString().split('T')[0]}
        markingType="custom"
        markedDates={getMarkedDates()}
        onDayPress={onDayPress}
        onMonthChange={onMonthChange}
        theme={{
          backgroundColor: '#FFFFFF',
          calendarBackground: '#FFFFFF',
          textSectionTitleColor: '#6200EE',
          selectedDayBackgroundColor: '#6200EE',
          selectedDayTextColor: '#FFFFFF',
          todayTextColor: '#6200EE',
          dayTextColor: '#000000',
          textDisabledColor: '#BDBDBD',
          monthTextColor: '#000000',
          textMonthFontWeight: 'bold',
          textDayFontSize: 14,
          textMonthFontSize: 18,
          textDayHeaderFontSize: 12,
        }}
        style={styles.calendar}
      />
      
      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: '#E8F5E9' }]} />
          <Text style={styles.legendText}>Many slots available</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: '#FFF9C4' }]} />
          <Text style={styles.legendText}>Few slots available</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: '#F5F5F5' }]} />
          <Text style={styles.legendText}>Unavailable</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  calendar: {
    borderRadius: 12,
  },
  loadingContainer: {
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#666666',
  },
  legend: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 4,
  },
  legendText: {
    fontSize: 11,
    color: '#666666',
  },
});
