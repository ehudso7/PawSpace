import React, { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { getProviderAvailability } from '../../services/bookings';
import { AvailabilitySlot } from '../../types/booking';
import { colors } from '../../theme/colors';

type DateObject = { year: number; month: number; day: number; timestamp: number; dateString: string };
type MarkedDates = { [key: string]: any };

interface CalendarViewProps {
  providerId: string;
  selectedDate: string | null; // YYYY-MM-DD
  onSelectDate: (date: string) => void;
}

export const CalendarView: React.FC<CalendarViewProps> = ({ providerId, selectedDate, onSelectDate }) => {
  const [loading, setLoading] = useState(false);
  const [monthStr, setMonthStr] = useState<string>(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  });
  const [availability, setAvailability] = useState<AvailabilitySlot[]>([]);

  useEffect(() => {
    let active = true;
    setLoading(true);
    getProviderAvailability(providerId, monthStr)
      .then((slots) => {
        if (!active) return;
        setAvailability(slots);
      })
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, [providerId, monthStr]);

  const markedDates = useMemo<MarkedDates>(() => {
    const marks: MarkedDates = {};
    for (const slot of availability) {
      if (slot.is_available) {
        marks[slot.date] = {
          marked: true,
          dots: [{ key: 'available', color: colors.success }],
          disabled: false,
        } as any;
      } else {
        marks[slot.date] = { disabled: true, disableTouchEvent: true } as any;
      }
    }
    if (selectedDate) {
      marks[selectedDate] = {
        ...(marks[selectedDate] || {}),
        selected: true,
        selectedColor: colors.primary,
      } as any;
    }
    return marks;
  }, [availability, selectedDate]);

  const handleMonthChange = (m: DateObject) => {
    const newMonth = `${m.year}-${String(m.month).padStart(2, '0')}`;
    setMonthStr(newMonth);
  };

  return (
    <View>
      <Calendar
        current={selectedDate || undefined}
        onDayPress={(d: DateObject) => onSelectDate(d.dateString)}
        onMonthChange={handleMonthChange}
        markingType="multi-dot"
        markedDates={markedDates}
        theme={{
          backgroundColor: 'transparent',
          calendarBackground: 'transparent',
          dayTextColor: colors.text,
          monthTextColor: colors.text,
          textDisabledColor: colors.textMuted,
          textSectionTitleColor: colors.textMuted,
          selectedDayBackgroundColor: colors.primary,
          selectedDayTextColor: '#fff',
          todayTextColor: colors.primary,
          arrowColor: colors.text,
        }}
        hideExtraDays
        firstDay={1}
        enableSwipeMonths
      />
      {loading && (
        <View style={{ paddingVertical: 8 }}>
          <ActivityIndicator color={colors.primary} />
        </View>
      )}
    </View>
  );
};

export default CalendarView;
