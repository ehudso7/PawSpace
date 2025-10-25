import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export type TimeSlotPickerProps = {
  date?: Date;
};

export default function TimeSlotPicker({ date }: TimeSlotPickerProps): JSX.Element {
  return (
    <View style={styles.container}>
      <Text>TimeSlotPicker {date?.toLocaleDateString() ?? ''}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 12 },
});
