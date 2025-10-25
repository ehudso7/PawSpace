import React, { useMemo, useState } from 'react';
import { View, Text, Pressable, StyleSheet, ScrollView } from 'react-native';
import CalendarView from '../../components/booking/CalendarView';
import TimeSlotPicker from '../../components/booking/TimeSlotPicker';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { colors } from '../../theme/colors';
import { TimeSlot } from '../../types/booking';
import { clampToBusinessHours } from '../../utils/time';
import { getProviderProfile } from '../../services/providers';

// Navigation types are app-specific; we keep generic to avoid coupling

type Params = {
  providerId: string;
  service: {
    id: string;
    title: string;
    durationMinutes: number;
    priceCents: number;
    currency: string;
  };
};

export const BookingCalendarScreen: React.FC = () => {
  const route = useRoute<RouteProp<Record<string, Params>, string>>();
  const nav = useNavigation<any>();
  const { providerId, service } = route.params as Params;

  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
  const [businessHoursText, setBusinessHoursText] = useState<string | null>(null);

  React.useEffect(() => {
    let active = true;
    getProviderProfile(providerId).then((p) => {
      if (!active || !p) return;
      const today = new Date();
      const todayISO = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
      const window = clampToBusinessHours(todayISO, p.business_hours);
      if (window) {
        const open = new Date(window.start);
        const close = new Date(window.end);
        const fmt = (d: Date) => d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        setBusinessHoursText(`${fmt(open)} - ${fmt(close)}`);
      } else {
        setBusinessHoursText('Closed today');
      }
    });
    return () => { active = false; };
  }, [providerId]);

  const canContinue = useMemo(() => !!(selectedDate && selectedSlot), [selectedDate, selectedSlot]);

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={{ paddingBottom: 120 }}>
        <Text style={styles.header}>{service.title}</Text>

        <CalendarView providerId={providerId} selectedDate={selectedDate} onSelectDate={(d) => { setSelectedDate(d); setSelectedSlot(null); }} />

        <View style={{ paddingHorizontal: 16, paddingTop: 8 }}>
          <Text style={styles.sectionTitle}>Select a time</Text>
          {!!businessHoursText && (
            <Text style={{ color: colors.textMuted, marginTop: 4 }}>Business hours: {businessHoursText}</Text>
          )}
        </View>

        <TimeSlotPicker
          providerId={providerId}
          date={selectedDate}
          serviceDuration={service.durationMinutes}
          onSelect={setSelectedSlot}
          selectedSlot={selectedSlot}
        />

        <View style={{ paddingHorizontal: 16, paddingTop: 8 }}>
          <Text style={styles.sectionTitle}>Summary</Text>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Service</Text>
            <Text style={styles.summaryValue}>{service.title}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Duration</Text>
            <Text style={styles.summaryValue}>{service.durationMinutes} min</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Price</Text>
            <Text style={styles.summaryValue}>
              {new Intl.NumberFormat(undefined, { style: 'currency', currency: service.currency }).format(service.priceCents / 100)}
            </Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Date & Time</Text>
            <Text style={styles.summaryValue}>
              {selectedSlot ? new Date(selectedSlot.start_time).toLocaleString() : 'Select a date & time'}
            </Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.bottomBar}>
        <Pressable style={[styles.cta, { backgroundColor: canContinue ? colors.primary : colors.surface }]} disabled={!canContinue} onPress={() => {
          if (!selectedSlot) return;
          nav.navigate('BookingConfirmScreen' as never, {
            providerId,
            service,
            startTime: selectedSlot.start_time,
            endTime: selectedSlot.end_time,
          } as never);
        }}>
          <Text style={{ color: '#fff', fontWeight: '600' }}>Continue</Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { color: '#fff', fontSize: 18, fontWeight: '700', padding: 16 },
  sectionTitle: { color: '#fff', fontSize: 16, fontWeight: '600' },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  summaryLabel: { color: colors.textMuted },
  summaryValue: { color: '#fff' },
  bottomBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.card,
  },
  cta: {
    paddingVertical: 14,
    alignItems: 'center',
    borderRadius: 12,
  },
});

export default BookingCalendarScreen;
