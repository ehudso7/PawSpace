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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  title: {
    fontSize: 18,
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
