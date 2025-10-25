import React, { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, Text, View } from 'react-native';
import { getTimeSlots } from '../../services/bookings';
import { TimeSlot } from '../../types/booking';
import { colors } from '../../theme/colors';
import { formatDisplayTime } from '../../utils/time';

interface TimeSlotPickerProps {
  providerId: string;
  date: string | null; // YYYY-MM-DD
  serviceDuration: number; // minutes
  onSelect: (slot: TimeSlot) => void;
  selectedSlot?: TimeSlot | null;
}

export const TimeSlotPicker: React.FC<TimeSlotPickerProps> = ({ providerId, date, serviceDuration, onSelect, selectedSlot }) => {
  const [loading, setLoading] = useState(false);
  const [slots, setSlots] = useState<TimeSlot[]>([]);

  useEffect(() => {
    let active = true;
    if (!date) {
      setSlots([]);
      return;
    }
    setLoading(true);
    getTimeSlots(providerId, date, serviceDuration)
      .then((s) => active && setSlots(s))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, [providerId, date, serviceDuration]);

  const renderItem = ({ item }: { item: TimeSlot }) => {
    const start = new Date(item.start_time);
    const end = new Date(item.end_time);
    const label = `${formatDisplayTime(start)} - ${formatDisplayTime(end)}`;
    const selected = selectedSlot?.start_time === item.start_time;
    const disabled = !item.is_available;

    return (
      <Pressable
        onPress={() => !disabled && onSelect(item)}
        disabled={disabled}
        style={{
          paddingVertical: 10,
          paddingHorizontal: 14,
          borderRadius: 10,
          margin: 6,
          backgroundColor: selected ? colors.primary : colors.surface,
          borderWidth: 1,
          borderColor: selected ? colors.primaryDark : colors.border,
          opacity: disabled ? 0.5 : 1,
        }}
      >
        <Text style={{ color: '#fff' }}>{label}</Text>
      </Pressable>
    );
  };

  if (!date) {
    return (
      <View style={{ padding: 16 }}>
        <Text style={{ color: colors.textMuted }}>Select a date to view availability</Text>
      </View>
    );
  }

  return (
    <View style={{ minHeight: 96 }}>
      {loading ? (
        <View style={{ paddingVertical: 8 }}>
          <ActivityIndicator color={colors.primary} />
        </View>
      ) : (
        <FlatList
          data={slots}
          keyExtractor={(item) => item.start_time}
          renderItem={renderItem}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 8, paddingBottom: 8 }}
        />
      )}
    </View>
  );
};

export default TimeSlotPicker;
