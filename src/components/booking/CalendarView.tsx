import React, { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { Calendar, DateObject } from 'react-native-calendars';
import { AvailabilitySlot, BusinessHours } from '../../types/booking';
import { buildMarkedDates, getProviderAvailability } from '../../services/bookings';
import { formatYmd } from '../../utils/time';

interface CalendarViewProps {
  providerId: string;
  businessHours?: BusinessHours; // optional, if provided, use its timezone for past-date logic
  selectedDate?: string; // 'YYYY-MM-DD'
  onDateChange?: (date: string) => void;
}

export const CalendarView: React.FC<CalendarViewProps> = ({
  providerId,
  businessHours,
  selectedDate,
  onDateChange,
}) => {
  const timeZone = businessHours?.timezone || 'UTC';
  const [loading, setLoading] = useState(false);
  const [month, setMonth] = useState(() => formatYmd(new Date(), timeZone).slice(0, 7)); // 'YYYY-MM'
  const [availability, setAvailability] = useState<AvailabilitySlot[]>([]);
  const minDate = useMemo(() => formatYmd(new Date(), timeZone), [timeZone]);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      try {
        const data = await getProviderAvailability(providerId, month);
        if (!cancelled) setAvailability(data);
      } catch (e) {
        console.warn('CalendarView availability error', (e as Error).message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [providerId, month]);

  const marked = useMemo(() => buildMarkedDates(availability, selectedDate, timeZone), [availability, selectedDate, timeZone]);

  function handleMonthChange(d: DateObject) {
    setMonth(`${d.year}-${String(d.month).padStart(2, '0')}`);
  }

  return (
    <View>
      {loading && (
        <View style={{ position: 'absolute', top: 8, right: 8, zIndex: 10 }}>
          <ActivityIndicator />
        </View>
      )}
      <Calendar
        key={month}
        markedDates={marked}
        onDayPress={(day) => onDateChange?.(day.dateString)}
        onMonthChange={handleMonthChange}
        enableSwipeMonths
        minDate={minDate}
        disableAllTouchEventsForDisabledDays
        theme={{
          selectedDayBackgroundColor: '#0A84FF',
          todayTextColor: '#0A84FF',
          arrowColor: '#0A84FF',
        }}
      />
    </View>
  );
};

export default CalendarView;
