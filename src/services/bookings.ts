import { supabase } from "../lib/supabase";
import { AvailabilitySlot, TimeSlot, BusinessHours } from "../types/booking";
import { addMinutes, clampToBusinessHours, combineDateAndTime, eachMinuteOfInterval, isPastDate, minutesBetween, toISO, toISODate } from "../utils/time";

// Helpers to fetch business hours and bookings
async function fetchProviderBusinessHours(providerId: string): Promise<BusinessHours> {
  const { data, error } = await supabase
    .from("providers")
    .select("business_hours")
    .eq("id", providerId)
    .single();
  if (error) {
    console.error("fetchProviderBusinessHours", error);
    return {} as BusinessHours;
  }
  return (data?.business_hours ?? {}) as BusinessHours;
}

async function fetchExistingBookings(providerId: string, startISO: string, endISO: string) {
  const { data, error } = await supabase
    .from("bookings")
    .select("start_time,end_time,status")
    .eq("provider_id", providerId)
    .gte("start_time", startISO)
    .lt("start_time", endISO)
    .in("status", ["confirmed", "pending"]);
  if (error) {
    console.error("fetchExistingBookings", error);
    return [] as { start_time: string; end_time: string; status: string }[];
  }
  return (data || []) as { start_time: string; end_time: string; status: string }[];
}

function hasConflict(rangeStart: Date, rangeEnd: Date, bookings: { start_time: string; end_time: string }[]): boolean {
  for (const b of bookings) {
    const bStart = new Date(b.start_time);
    const bEnd = new Date(b.end_time);
    if (rangeStart < bEnd && rangeEnd > bStart) return true; // overlap
  }
  return false;
}

export async function getProviderAvailability(providerId: string, month: string): Promise<AvailabilitySlot[]> {
  // month format YYYY-MM
  const businessHours = await fetchProviderBusinessHours(providerId);

  const [year, monthNum] = month.split("-").map((s) => parseInt(s, 10));
  const firstDay = new Date(year, monthNum - 1, 1);
  const nextMonth = new Date(year, monthNum, 1);

  const days: Date[] = [];
  for (let d = new Date(firstDay); d < nextMonth; d.setDate(d.getDate() + 1)) {
    days.push(new Date(d));
  }

  const results: AvailabilitySlot[] = [];
  // We fetch bookings for the entire month once for efficiency
  const monthStartISO = new Date(firstDay.getTime());
  const monthEndISO = new Date(nextMonth.getTime());
  const bookings = await fetchExistingBookings(providerId, monthStartISO.toISOString(), monthEndISO.toISOString());

  for (const day of days) {
    const dateISO = toISODate(day);
    const window = clampToBusinessHours(dateISO, businessHours);
    if (!window || isPastDate(day)) {
      results.push({ date: dateISO, available_slots: 0, is_available: false });
      continue;
    }

    const slotCount = Math.max(0, Math.floor(minutesBetween(window.start, window.end) / 30));

    // Count how many 30-min slots are not overlapping existing bookings
    let available = 0;
    for (const start of eachMinuteOfInterval(window.start, window.end, 30)) {
      const end = addMinutes(start, 30);
      if (!hasConflict(start, end, bookings)) available += 1;
    }

    results.push({ date: dateISO, available_slots: available, is_available: available > 0 });
  }

  return results;
}

export async function getTimeSlots(providerId: string, date: string, duration: number): Promise<TimeSlot[]> {
  // duration in minutes
  const businessHours = await fetchProviderBusinessHours(providerId);
  const window = clampToBusinessHours(date, businessHours);
  if (!window) return [];

  const dayStartISO = window.start.toISOString();
  const dayEndISO = window.end.toISOString();
  const bookings = await fetchExistingBookings(providerId, dayStartISO, dayEndISO);

  const slots: TimeSlot[] = [];
  for (const start of eachMinuteOfInterval(window.start, window.end, 30)) {
    const end = addMinutes(start, duration);
    if (end > window.end) break;

    const conflict = hasConflict(start, end, bookings);
    slots.push({ start_time: toISO(start), end_time: toISO(end), is_available: !conflict });
  }

  return slots;
}

export async function checkSlotAvailability(providerId: string, startTime: string, duration: number): Promise<boolean> {
  const start = new Date(startTime);
  const end = addMinutes(start, duration);
  const bookings = await fetchExistingBookings(providerId, start.toISOString(), end.toISOString());
  return !hasConflict(start, end, bookings);
}
