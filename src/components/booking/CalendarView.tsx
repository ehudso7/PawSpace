import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface CalendarViewProps {
  selectedDate?: Date;
  onDateSelect: (date: Date) => void;
  availableDates: Date[];
}

const CalendarView: React.FC<CalendarViewProps> = ({
  selectedDate,
  onDateSelect,
  availableDates,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select Date</Text>
      {/* Calendar implementation would go here */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
});

export default CalendarView;