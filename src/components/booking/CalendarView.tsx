import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { theme } from '@/constants/theme';

interface CalendarViewProps {
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
  availableDates: Date[];
}

const CalendarView: React.FC<CalendarViewProps> = ({
  selectedDate,
  onDateSelect,
  availableDates,
}) => {
  // TODO: Implement calendar component with date selection
  return (
    <View style={styles.container}>
      <Text style={styles.placeholder}>Calendar Component</Text>
      <Text style={styles.note}>TODO: Implement calendar with available dates</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
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