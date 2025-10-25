import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';

interface TimeSlotPickerProps {
  selectedTime?: string;
  onTimeSelect: (time: string) => void;
  availableSlots: string[];
}

const TimeSlotPicker: React.FC<TimeSlotPickerProps> = ({
  selectedTime,
  onTimeSelect,
  availableSlots,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select Time</Text>
      <FlatList
        data={availableSlots}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.slot,
              selectedTime === item && styles.selectedSlot,
            ]}
            onPress={() => onTimeSelect(item)}
          >
            <Text
              style={[
                styles.slotText,
                selectedTime === item && styles.selectedSlotText,
              ]}
            >
              {item}
            </Text>
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item}
        numColumns={3}
        contentContainerStyle={styles.list}
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
    fontWeight: 'bold',
    marginBottom: 16,
  },
  list: {
    paddingBottom: 16,
  },
  slot: {
    flex: 1,
    margin: 4,
    padding: 12,
    backgroundColor: '#F0F0F0',
    borderRadius: 8,
    alignItems: 'center',
  },
  selectedSlot: {
    backgroundColor: '#007AFF',
  },
  slotText: {
    fontSize: 14,
    color: '#333',
  },
  selectedSlotText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
});

export default TimeSlotPicker;