import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export type CalendarViewProps = {
  month?: Date;
};

export default function CalendarView({ month }: CalendarViewProps): JSX.Element {
  return (
    <View style={styles.container}>
      <Text>CalendarView {month?.toDateString() ?? ''}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 12 },
});
