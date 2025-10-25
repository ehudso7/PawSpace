import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';

interface TimeSlot {
  time: string;
  available: boolean;
}

interface TimeSlotPickerProps {
  slots: TimeSlot[];
  selectedTime?: string;
  onTimeSelect?: (time: string) => void;
}

const TimeSlotPicker: React.FC<TimeSlotPickerProps> = ({ slots, selectedTime, onTimeSelect }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select a Time</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={styles.slotsContainer}>
          {slots.map((slot, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.slot,
                !slot.available && styles.slotDisabled,
                selectedTime === slot.time && styles.slotSelected,
              ]}
              onPress={() => slot.available && onTimeSelect?.(slot.time)}
              disabled={!slot.available}
            >
              <Text
                style={[
                  styles.slotText,
                  !slot.available && styles.slotTextDisabled,
                  selectedTime === slot.time && styles.slotTextSelected,
                ]}
              >
                {slot.time}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
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
  slotsContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  slot: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#DDD',
    backgroundColor: '#FFF',
  },
  slotDisabled: {
    backgroundColor: '#F5F5F5',
    borderColor: '#E0E0E0',
  },
  slotSelected: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  slotText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  slotTextDisabled: {
    color: '#999',
  },
  slotTextSelected: {
    color: '#FFF',
  },
});

export default TimeSlotPicker;
