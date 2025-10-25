import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Calendar, DateData } from 'react-native-calendars';
import { BookingService } from '../../services/bookingService';
import { AvailabilitySlot } from '../../types/booking';

interface CalendarViewProps {
  providerId: string;
  selectedDate: string;
  onDateSelect: (date: string) => void;
}

const CalendarView: React.FC<CalendarViewProps> = ({
  providerId,
  selectedDate,
  onDateSelect,
}) => {
  const [availability, setAvailability] = useState<AvailabilitySlot[]>([]);
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
      const availabilityData = await BookingService.getProviderAvailability(
        providerId,
        currentMonth
      );
      setAvailability(availabilityData);
    } catch (error) {
      console.error('Error loading availability:', error);
      Alert.alert('Error', 'Failed to load availability data');
    } finally {
      setLoading(false);
    }
  };

  const handleMonthChange = (month: DateData) => {
    const newMonth = month.dateString.slice(0, 7);
    if (newMonth !== currentMonth) {
      setCurrentMonth(newMonth);
    }
  };

  const handleDayPress = (day: DateData) => {
    const dateString = day.dateString;
    const today = new Date().toISOString().split('T')[0];
    
    // Don't allow selection of past dates
    if (dateString < today) {
      return;
    }

    // Check if the date is available
    const dateAvailability = availability.find(
      (slot) => slot.date === dateString
    );
    
    if (dateAvailability && dateAvailability.is_available) {
      onDateSelect(dateString);
    }
  };

  const getMarkedDates = () => {
    const markedDates: { [key: string]: any } = {};
    const today = new Date().toISOString().split('T')[0];

    // Mark selected date
    if (selectedDate) {
      markedDates[selectedDate] = {
        selected: true,
        selectedColor: '#007AFF',
        selectedTextColor: '#fff',
      };
    }

    // Mark availability
    availability.forEach((slot) => {
      if (slot.date < today) {
        // Past dates - disabled
        markedDates[slot.date] = {
          disabled: true,
          disableTouchEvent: true,
          textColor: '#ccc',
        };
      } else if (slot.is_available) {
        // Available dates
        markedDates[slot.date] = {
          marked: true,
          dotColor: '#4CAF50',
          activeOpacity: 0.7,
        };
      } else {
        // Unavailable dates
        markedDates[slot.date] = {
          disabled: true,
          disableTouchEvent: true,
          textColor: '#ccc',
        };
      }
    });

    return markedDates;
  };

  const getTheme = () => ({
    backgroundColor: '#ffffff',
    calendarBackground: '#ffffff',
    textSectionTitleColor: '#b6c1cd',
    selectedDayBackgroundColor: '#007AFF',
    selectedDayTextColor: '#ffffff',
    todayTextColor: '#007AFF',
    dayTextColor: '#2d4150',
    textDisabledColor: '#d9e1e8',
    dotColor: '#00adf5',
    selectedDotColor: '#ffffff',
    arrowColor: '#007AFF',
    disabledArrowColor: '#d9e1e8',
    monthTextColor: '#2d4150',
    indicatorColor: '#007AFF',
    textDayFontWeight: '500',
    textMonthFontWeight: 'bold',
    textDayHeaderFontWeight: '600',
    textDayFontSize: 16,
    textMonthFontSize: 18,
    textDayHeaderFontSize: 14,
  });

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="small" color="#007AFF" />
        <Text style={styles.loadingText}>Loading availability...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Calendar
        current={selectedDate || new Date().toISOString().split('T')[0]}
        onDayPress={handleDayPress}
        onMonthChange={handleMonthChange}
        markedDates={getMarkedDates()}
        theme={getTheme()}
        minDate={new Date().toISOString().split('T')[0]}
        maxDate={new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]} // 90 days from now
        enableSwipeMonths={true}
        hideExtraDays={true}
        firstDay={1} // Start week on Monday
        showWeekNumbers={false}
        disableMonthChange={false}
        disableArrowLeft={false}
        disableArrowRight={false}
        disableAllTouchEventsForDisabledDays={true}
        renderHeader={(date) => (
          <View style={styles.headerContainer}>
            <Text style={styles.headerText}>
              {date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </Text>
          </View>
        )}
      />
      
      {/* Legend */}
      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: '#4CAF50' }]} />
          <Text style={styles.legendText}>Available</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: '#007AFF' }]} />
          <Text style={styles.legendText}>Selected</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: '#ccc' }]} />
          <Text style={styles.legendText}>Unavailable</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#666',
  },
  headerContainer: {
    alignItems: 'center',
    paddingVertical: 10,
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  legend: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 16,
    paddingTop: 16,
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
    marginRight: 4,
  },
  legendText: {
    fontSize: 12,
    color: '#666',
  },
});

export default CalendarView;