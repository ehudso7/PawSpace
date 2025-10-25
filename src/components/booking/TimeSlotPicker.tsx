import React, { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, Text, View } from 'react-native';
import { BusinessHours, TimeSlot } from '../../types/booking';
import { getBusinessHoursForDate } from '../../utils/time';
import { getTimeSlots } from '../../services/bookings';
import { formatDuration } from '../../utils/format';

interface TimeSlotPickerProps {
  providerId: string;
  date: string | undefined; // 'YYYY-MM-DD'
  durationMinutes: number;
  selectedStartIso?: string;
  onSelectSlot?: (slot: TimeSlot) => void;
  businessHours?: BusinessHours;
}

export const TimeSlotPicker: React.FC<TimeSlotPickerProps> = ({
  providerId,
  date,
  durationMinutes,
  selectedStartIso,
  onSelectSlot,
  businessHours,
}) => {
  const [loading, setLoading] = useState(false);
  const [slots, setSlots] = useState<TimeSlot[]>([]);

  useEffect(() => {
    if (!date) return;
    let cancelled = false;
    async function load() {
      setLoading(true);
      try {
        const data = await getTimeSlots(providerId, date, durationMinutes);
        if (!cancelled) setSlots(data);
      } catch (e) {
        console.warn('TimeSlotPicker error', (e as Error).message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [providerId, date, durationMinutes]);

  const selectedIdx = useMemo(() => slots.findIndex((s) => s.start_time === selectedStartIso), [slots, selectedStartIso]);

  if (!date) {
    return (
      <View style={{ padding: 16 }}>
        <Text>Select a date to see times.</Text>
      </View>
    );
  }

  return (
    <View style={{ paddingVertical: 8 }}>
      {businessHours && date && (
        <View style={{ paddingHorizontal: 16, marginBottom: 6 }}>
          {(() => {
            const { open, close, timeZone } = getBusinessHoursForDate(date, businessHours);
            return (
              <Text style={{ color: '#6B7280' }}>
                Business hours: {open ?? '—'} - {close ?? '—'} ({timeZone})
              </Text>
            );
          })()}
        </View>
      )}
      {loading && (
        <View style={{ padding: 16 }}>
          <ActivityIndicator />
        </View>
      )}
      <FlatList
        data={slots}
        keyExtractor={(item) => item.start_time}
        horizontal
        contentContainerStyle={{ paddingHorizontal: 12, gap: 8 }}
        renderItem={({ item, index }) => {
          const isSelected = index === selectedIdx;
          const isDisabled = !item.is_available;
          return (
            <Pressable
              disabled={isDisabled}
              onPress={() => onSelectSlot?.(item)}
              style={{
                paddingHorizontal: 14,
                paddingVertical: 10,
                borderRadius: 24,
                borderWidth: 1,
                borderColor: isSelected ? '#0A84FF' : '#E5E7EB',
                backgroundColor: isSelected ? '#0A84FF' : isDisabled ? '#F3F4F6' : '#FFFFFF',
                opacity: isDisabled ? 0.6 : 1,
              }}
            >
              <Text style={{ color: isSelected ? '#fff' : '#111827', fontWeight: '600' }}>
                {new Date(item.start_time).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}
              </Text>
            </Pressable>
          );
        }}
        ListFooterComponent={() => (
          <View style={{ justifyContent: 'center', paddingHorizontal: 12 }}>
            <Text style={{ color: '#6B7280' }}>Duration: {formatDuration(durationMinutes)}</Text>
          </View>
        )}
      />
    </View>
  );
};

export default TimeSlotPicker;
