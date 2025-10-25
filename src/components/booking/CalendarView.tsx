import React from 'react';
import { View, Text, StyleSheet, ViewProps } from 'react-native';

export type CalendarViewProps = ViewProps & {};

export const CalendarView: React.FC<CalendarViewProps> = ({ style, ...rest }) => {
  return (
    <View style={[styles.container, style]} {...rest}>
      <Text>Calendar View</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12
  }
});
