import React, { useMemo, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import CalendarView from '../../components/booking/CalendarView';
import TimeSlotPicker from '../../components/booking/TimeSlotPicker';
import { BookingServiceSummary, ProviderProfile, TimeSlot } from '../../types/booking';
import { formatCurrency, formatDuration } from '../../utils/format';

interface BookingCalendarScreenProps {
  provider: ProviderProfile;
  serviceSummary: BookingServiceSummary; // must include service
  onContinue: (payload: { providerId: string; serviceId: string; start: string; end: string }) => void;
}

export const BookingCalendarScreen: React.FC<BookingCalendarScreenProps> = ({ provider, serviceSummary, onContinue }) => {
  const [selectedDate, setSelectedDate] = useState<string | undefined>(undefined);
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | undefined>(undefined);

  const duration = serviceSummary.service.duration_minutes;

  const canContinue = !!(selectedDate && selectedSlot && selectedSlot.is_available);

  return (
    <View style={{ flex: 1 }}>
      <CalendarView
        providerId={provider.id}
        businessHours={provider.business_hours}
        selectedDate={selectedDate}
        onDateChange={(d) => {
          setSelectedDate(d);
          setSelectedSlot(undefined);
        }}
      />

      <TimeSlotPicker
        providerId={provider.id}
        date={selectedDate}
        durationMinutes={duration}
        selectedStartIso={selectedSlot?.start_time}
        onSelectSlot={setSelectedSlot}
        businessHours={provider.business_hours}
      />

      <View style={{ padding: 16, borderTopWidth: 1, borderTopColor: '#E5E7EB', backgroundColor: '#fff' }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 }}>
          <View style={{ flex: 1, paddingRight: 12 }}>
            <Text style={{ fontWeight: '700' }}>{serviceSummary.service.title}</Text>
            <Text style={{ color: '#6B7280', marginTop: 4 }}>{formatDuration(duration)}</Text>
            <Text style={{ color: '#6B7280', marginTop: 2 }}>{selectedDate || 'Select a date'}</Text>
            {selectedSlot && (
              <Text style={{ marginTop: 2 }}>
                {new Date(selectedSlot.start_time).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}
                {' - '}
                {new Date(selectedSlot.end_time).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}
              </Text>
            )}
          </View>
          <View style={{ alignItems: 'flex-end' }}>
            <Text style={{ fontWeight: '800' }}>{formatCurrency(serviceSummary.service.price_cents, serviceSummary.service.currency)}</Text>
          </View>
        </View>

        <Pressable
          disabled={!canContinue}
          onPress={() => {
            if (!selectedSlot) return;
            onContinue({
              providerId: provider.id,
              serviceId: serviceSummary.service.id,
              start: selectedSlot.start_time,
              end: selectedSlot.end_time,
            });
          }}
          style={{
            backgroundColor: canContinue ? '#0A84FF' : '#9CA3AF',
            paddingVertical: 14,
            borderRadius: 12,
            alignItems: 'center',
          }}
        >
          <Text style={{ color: '#fff', fontWeight: '700' }}>Continue</Text>
        </Pressable>
      </View>
    </View>
  );
};

export default BookingCalendarScreen;
