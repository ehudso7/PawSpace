import { BusinessHours } from "../types/booking";

/**
 * Utilities for working with dates/times without external deps.
 * NOTE: We keep everything as ISO strings in provider timezone when displayed,
 * and convert to UTC when checking conflicts with stored bookings.
 */

export function toISODate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function toTimeStringHHmm(date: Date): string {
  const h = String(date.getHours()).padStart(2, "0");
  const m = String(date.getMinutes()).padStart(2, "0");
  return `${h}:${m}`;
}

export function addMinutes(date: Date, minutes: number): Date {
  return new Date(date.getTime() + minutes * 60 * 1000);
}

export function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export function isPastDate(date: Date): boolean {
  const now = new Date();
  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);
  return endOfDay.getTime() < now.getTime();
}

export function combineDateAndTime(dateISO: string, timeHHmm: string): Date {
  // Use local timezone of the JS runtime; assume provider tz mapping handled externally
  const [year, month, day] = dateISO.split("-").map((s) => parseInt(s, 10));
  const [h, m] = timeHHmm.split(":").map((s) => parseInt(s, 10));
  return new Date(year, month - 1, day, h, m, 0, 0);
}

export function minutesBetween(a: Date, b: Date): number {
  return Math.round((b.getTime() - a.getTime()) / 60000);
}

export function getDayKey(date: Date): keyof BusinessHours {
  const day = date.getDay(); // 0 Sun - 6 Sat
  return ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"][
    day
  ] as keyof BusinessHours;
}

export function getBusinessWindowForDate(businessHours: BusinessHours, date: Date) {
  const key = getDayKey(date);
  return businessHours[key];
}

export function eachMinuteOfInterval(start: Date, end: Date, stepMinutes: number): Date[] {
  if (stepMinutes <= 0) return [];
  const result: Date[] = [];
  let cursor = new Date(start);
  while (cursor < end) {
    result.push(new Date(cursor));
    cursor = addMinutes(cursor, stepMinutes);
  }
  return result;
}

export function clampToBusinessHours(dateISO: string, businessHours: BusinessHours): { start: Date; end: Date } | null {
  const date = new Date(dateISO + "T00:00:00");
  const window = getBusinessWindowForDate(businessHours, date);
  if (!window) return null;
  const start = combineDateAndTime(toISODate(date), window.open);
  const end = combineDateAndTime(toISODate(date), window.close);
  if (end <= start) return null;
  return { start, end };
}

export function formatDisplayTime(date: Date): string {
  const h = date.getHours();
  const m = date.getMinutes();
  const suffix = h >= 12 ? "PM" : "AM";
  const hh = h % 12 === 0 ? 12 : h % 12;
  return `${hh}:${String(m).padStart(2, "0")} ${suffix}`;
}

export function toISO(date: Date): string {
  return date.toISOString();
}
