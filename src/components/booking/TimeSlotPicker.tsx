import React from 'react';
<<<<<<< HEAD
import { View, Text, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import { theme } from '@/constants/theme';

interface TimeSlot {
  id: string;
=======
<<<<<<< HEAD
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';

interface TimeSlot {
>>>>>>> origin/main
  time: string;
  available: boolean;
}

interface TimeSlotPickerProps {
<<<<<<< HEAD
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
=======
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
=======
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
>>>>>>> origin/main
