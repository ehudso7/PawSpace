import { supabase } from '../utils/supabase';
import { AvailabilitySlot, BusinessHours, ProviderProfile, TimeSlot } from '../types/booking';
import { addMinutes, formatYmd, generateCandidateStarts, rangesOverlap, zonedDateTimeToUtc } from '../utils/time';

async function fetchProviderBusinessHours(providerId: string): Promise<BusinessHours | undefined> {
  const { data, error } = await supabase
    .from('providers')
    .select('business_hours')
    .eq('id', providerId)
    .maybeSingle();
  if (error) {
    console.warn('fetchProviderBusinessHours error', error.message);
    return undefined;
  }
  return (data as unknown as { business_hours?: BusinessHours } | null)?.business_hours ?? undefined;
}

async function fetchProviderBookingsInRange(
  providerId: string,
  startIso: string,
  endIso: string
): Promise<Array<{ id: string; start_time: string; end_time: string; status?: string }>> {
  const { data, error } = await supabase
    .from('bookings')
    .select('id,start_time,end_time,status')
    .eq('provider_id', providerId)
    .neq('status', 'cancelled')
    .lt('start_time', endIso)
    .gt('end_time', startIso);

  if (error) {
    console.warn('fetchProviderBookingsInRange error', error.message);
    return [];
  }
  return (data as Array<{ id: string; start_time: string; end_time: string; status?: string }>) || [];
}

function getMonthStartEnd(month: string, timeZone: string) {
  // month: 'YYYY-MM' in provider TZ
  const [yearStr, monthStr] = month.split('-');
  const year = parseInt(yearStr, 10);
  const m = parseInt(monthStr, 10);
  const firstOfMonth = zonedDateTimeToUtc(`${year}-${String(m).padStart(2, '0')}-01`, '00:00', timeZone);
  const firstNextMonth = m === 12
    ? zonedDateTimeToUtc(`${year + 1}-01-01`, '00:00', timeZone)
    : zonedDateTimeToUtc(`${year}-${String(m + 1).padStart(2, '0')}-01`, '00:00', timeZone);
  return { startUtc: firstOfMonth, endUtc: firstNextMonth };
}

export async function getProviderAvailability(providerId: string, month: string): Promise<AvailabilitySlot[]> {
  const businessHours = (await fetchProviderBusinessHours(providerId)) || { timezone: 'UTC' } as BusinessHours;
  const timeZone = businessHours.timezone || 'UTC';
  const { startUtc, endUtc } = getMonthStartEnd(month, timeZone);
  const startIso = startUtc.toISOString();
  const endIso = endUtc.toISOString();

  const bookings = await fetchProviderBookingsInRange(providerId, startIso, endIso);

  // Build a map of day -> bookings
  const bookingsByDay = new Map<string, Array<{ start: Date; end: Date }>>();
  for (const b of bookings) {
    const start = new Date(b.start_time);
    const end = new Date(b.end_time);
    const ymd = formatYmd(start, timeZone);
    const arr = bookingsByDay.get(ymd) || [];
    arr.push({ start, end });
    bookingsByDay.set(ymd, arr);
  }

  // Iterate days of the month with 30-min slots for availability count
  const slots: AvailabilitySlot[] = [];
  const cursor = new Date(startUtc);
  while (cursor < endUtc) {
    const ymd = formatYmd(cursor, timeZone);
    const candidates = generateCandidateStarts(ymd, businessHours, 30);

    let availableCount = 0;
    if (candidates.length > 0) {
      const dayBookings = bookingsByDay.get(ymd) || [];
      for (const c of candidates) {
        const overlap = dayBookings.some((bk) => rangesOverlap(c.startUtc, c.endUtc, bk.start, bk.end));
        if (!overlap) availableCount += 1;
      }
    }

    slots.push({
      date: ymd,
      available_slots: availableCount,
      is_available: availableCount > 0,
    });

    // move to next day in provider TZ by adding 24h from provider midnight
    cursor.setUTCDate(cursor.getUTCDate() + 1);
  }

  return slots;
}

export async function getTimeSlots(
  providerId: string,
  dateYmd: string,
  durationMinutes: number
): Promise<TimeSlot[]> {
  const businessHours = (await fetchProviderBusinessHours(providerId)) || { timezone: 'UTC' } as BusinessHours;
  const timeZone = businessHours.timezone || 'UTC';

  const dayCandidates = generateCandidateStarts(dateYmd, businessHours, 30);
  if (dayCandidates.length === 0) return [];

  // Query bookings for the day
  const dayStartUtc = zonedDateTimeToUtc(dateYmd, '00:00', timeZone);
  const dayEndUtc = zonedDateTimeToUtc(dateYmd, '23:59', timeZone);
  const existing = await fetchProviderBookingsInRange(providerId, dayStartUtc.toISOString(), dayEndUtc.toISOString());
  const existingRanges = existing.map((b) => ({ start: new Date(b.start_time), end: new Date(b.end_time) }));

  const now = new Date();

  const slots: TimeSlot[] = dayCandidates.map((c) => {
    const end = addMinutes(c.startUtc, durationMinutes);
    const conflict = existingRanges.some((bk) => rangesOverlap(c.startUtc, end, bk.start, bk.end));
    const inPast = c.startUtc < now;
    return {
      start_time: c.startUtc.toISOString(),
      end_time: end.toISOString(),
      is_available: !conflict && !inPast,
    };
  });

  return slots;
}

export async function checkSlotAvailability(
  providerId: string,
  startTimeIso: string,
  durationMinutes: number
): Promise<boolean> {
  const start = new Date(startTimeIso);
  const end = addMinutes(start, durationMinutes);
  const { data, error } = await supabase
    .from('bookings')
    .select('id')
    .eq('provider_id', providerId)
    .neq('status', 'cancelled')
    .lt('start_time', end.toISOString())
    .gt('end_time', start.toISOString())
    .limit(1);

  if (error) {
    console.warn('checkSlotAvailability error', error.message);
    return false;
  }

  return !data || data.length === 0;
}

// Optional: helper to build marked dates for react-native-calendars
export function buildMarkedDates(
  availability: AvailabilitySlot[],
  selectedDate?: string,
  timeZone?: string
): Record<string, any> {
  const marked: Record<string, any> = {};
  const now = new Date();
  const todayYmd = formatYmd(now, timeZone);

  for (const a of availability) {
    const isPast = a.date < todayYmd;
    marked[a.date] = {
      disabled: isPast || !a.is_available,
      disableTouchEvent: isPast || !a.is_available,
      marked: a.available_slots > 0,
      dots: a.available_slots > 0 ? [{ color: '#34C759' }] : undefined,
    };
  }
  if (selectedDate) {
    marked[selectedDate] = {
      ...(marked[selectedDate] || {}),
      selected: true,
      selectedColor: '#0A84FF',
      selectedTextColor: '#fff',
    };
  }
  return marked;
}
