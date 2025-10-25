import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import { theme } from '@/constants/theme';

interface TimeSlot {
  id: string;
  time: string;
  available: boolean;
}

interface TimeSlotPickerProps {
  timeSlots: TimeSlot[];
  selectedSlot?: string;
  onSlotSelect: (slotId: string) => void;
}

const TimeSlotPicker: React.FC<TimeSlotPickerProps> = ({
  timeSlots,
  selectedSlot,
  onSlotSelect,
}) => {
  const renderTimeSlot = ({ item }: { item: TimeSlot }) => (
    <TouchableOpacity
      style={[
        styles.timeSlot,
        !item.available && styles.unavailable,
        selectedSlot === item.id && styles.selected,
      ]}
      onPress={() => item.available && onSlotSelect(item.id)}
      disabled={!item.available}
    >
      <Text
        style={[
          styles.timeText,
          !item.available && styles.unavailableText,
          selectedSlot === item.id && styles.selectedText,
        ]}
      >
        {item.time}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Available Time Slots</Text>
      <FlatList
        data={timeSlots}
        renderItem={renderTimeSlot}
        keyExtractor={(item) => item.id}
        numColumns={3}
        contentContainerStyle={styles.grid}
      />
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
    color: theme.colors.text,
    marginBottom: 16,
  },
  grid: {
    gap: 12,
  },
  timeSlot: {
    flex: 1,
    backgroundColor: theme.colors.background,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 8,
    alignItems: 'center',
    marginHorizontal: 4,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  selected: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  unavailable: {
    backgroundColor: theme.colors.disabled,
    borderColor: theme.colors.disabled,
  },
  timeText: {
    fontSize: 14,
    fontWeight: '500',
    color: theme.colors.text,
  },
  selectedText: {
    color: theme.colors.white,
  },
  unavailableText: {
    color: theme.colors.gray,
  },
});

export default TimeSlotPicker;