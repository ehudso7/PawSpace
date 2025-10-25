import React from 'react';
import { View, Text, StyleSheet, ViewProps } from 'react-native';

export type TimeSlotPickerProps = ViewProps & {};

export const TimeSlotPicker: React.FC<TimeSlotPickerProps> = ({ style, ...rest }) => {
  return (
    <View style={[styles.container, style]} {...rest}>
      <Text>Time Slot Picker</Text>
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
