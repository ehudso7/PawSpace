<<<<<<< HEAD
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { theme } from '@/constants/theme';

interface CalendarViewProps {
  selectedDate: Date;
=======
<<<<<<< HEAD
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

interface CalendarViewProps {
  selectedDate?: Date;
  onDateSelect?: (date: Date) => void;
}

const CalendarView: React.FC<CalendarViewProps> = ({ selectedDate, onDateSelect }) => {
  const [currentMonth] = useState(new Date());

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select a Date</Text>
      <View style={styles.calendar}>
        <Text style={styles.placeholder}>Calendar component placeholder</Text>
      </View>
=======
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface CalendarViewProps {
  selectedDate?: Date;
>>>>>>> origin/main
  onDateSelect: (date: Date) => void;
  availableDates: Date[];
}

const CalendarView: React.FC<CalendarViewProps> = ({
  selectedDate,
  onDateSelect,
  availableDates,
}) => {
<<<<<<< HEAD
  // TODO: Implement calendar component with date selection
  return (
    <View style={styles.container}>
      <Text style={styles.placeholder}>Calendar Component</Text>
      <Text style={styles.note}>TODO: Implement calendar with available dates</Text>
=======
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select Date</Text>
      {/* Calendar implementation would go here */}
>>>>>>> origin/main
>>>>>>> origin/main
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
<<<<<<< HEAD
    backgroundColor: theme.colors.background,
    borderRadius: 8,
  },
  placeholder: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text,
    textAlign: 'center',
  },
  note: {
    fontSize: 14,
    color: theme.colors.gray,
    textAlign: 'center',
    marginTop: 8,
  },
});

export default CalendarView;
=======
  },
  title: {
    fontSize: 18,
<<<<<<< HEAD
    fontWeight: '600',
    marginBottom: 16,
    color: '#333',
  },
  calendar: {
    backgroundColor: '#F9F9F9',
    padding: 16,
    borderRadius: 8,
    minHeight: 300,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholder: {
    fontSize: 14,
    color: '#999',
  },
});

export default CalendarView;
=======
    fontWeight: 'bold',
    marginBottom: 16,
  },
});

export default CalendarView;
>>>>>>> origin/main
>>>>>>> origin/main
