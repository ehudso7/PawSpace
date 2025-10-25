import React from 'react';
<<<<<<< HEAD
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
=======
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
>>>>>>> origin/main
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  title: {
    fontSize: 18,
<<<<<<< HEAD
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
=======
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
>>>>>>> origin/main
