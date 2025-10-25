import { BusinessHours, DayOfWeek } from '../types/booking';

export function formatYmd(date: Date, timeZone?: string): string {
  if (!timeZone) {
    const y = date.getUTCFullYear();
    const m = String(date.getUTCMonth() + 1).padStart(2, '0');
    const d = String(date.getUTCDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }
  const parts = new Intl.DateTimeFormat('en-CA', { timeZone, year: 'numeric', month: '2-digit', day: '2-digit' }).formatToParts(date);
  const y = parts.find(p => p.type === 'year')?.value ?? '0000';
  const m = parts.find(p => p.type === 'month')?.value ?? '01';
  const d = parts.find(p => p.type === 'day')?.value ?? '01';
  return `${y}-${m}-${d}`;
}

export function isPastYmd(ymd: string, timeZone?: string): boolean {
  const now = new Date();
  const todayYmd = formatYmd(now, timeZone);
  return ymd < todayYmd;
}

export function parseYmd(ymd: string): { year: number; month: number; day: number } {
  const [year, month, day] = ymd.split('-').map(n => parseInt(n, 10));
  return { year, month, day };
}

function getTimeZoneOffset(date: Date, timeZone: string): number {
  const locale = date.toLocaleString('en-US', { timeZone });
  const asLocal = new Date(locale);
  return asLocal.getTime() - date.getTime();
}

export function zonedDateTimeToUtc(ymd: string, hhmm: string, timeZone: string): Date {
  const { year, month, day } = parseYmd(ymd);
  const [hour, minute] = hhmm.split(':').map(v => parseInt(v, 10));
  const naiveUtc = new Date(Date.UTC(year, month - 1, day, hour, minute, 0, 0));
  const offset = getTimeZoneOffset(naiveUtc, timeZone);
  return new Date(naiveUtc.getTime() - offset);
}

export function utcToZonedIso(date: Date, timeZone: string): string {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  }).formatToParts(date);
  const y = parts.find(p => p.type === 'year')?.value ?? '0000';
  const m = parts.find(p => p.type === 'month')?.value ?? '01';
  const d = parts.find(p => p.type === 'day')?.value ?? '01';
  const h = parts.find(p => p.type === 'hour')?.value ?? '00';
  const min = parts.find(p => p.type === 'minute')?.value ?? '00';
  const s = parts.find(p => p.type === 'second')?.value ?? '00';
  return `${y}-${m}-${d}T${h}:${min}:${s}`;
}

export function addMinutes(date: Date, minutes: number): Date {
  return new Date(date.getTime() + minutes * 60 * 1000);
}

export function diffMinutes(a: Date, b: Date): number {
  return Math.round((b.getTime() - a.getTime()) / 60000);
}

export function getDayOfWeekFromYmd(ymd: string): DayOfWeek {
  const { year, month, day } = parseYmd(ymd);
  const d = new Date(Date.UTC(year, month - 1, day));
  const idx = d.getUTCDay();
  return ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'][idx] as DayOfWeek;
}

export function getBusinessHoursForDate(ymd: string, businessHours: BusinessHours): { open?: string; close?: string; timeZone: string } {
  const dow = getDayOfWeekFromYmd(ymd);
  const tz = businessHours.timezone || 'UTC';
  const dayBH = businessHours[dow];
  return { open: dayBH?.open, close: dayBH?.close, timeZone: tz };
}

export function generateCandidateStarts(
  ymd: string,
  businessHours: BusinessHours,
  slotIntervalMinutes: number
): Array<{ startUtc: Date; endUtc: Date; localLabel: string }> {
  const { open, close, timeZone } = getBusinessHoursForDate(ymd, businessHours);
  if (!open || !close) return [];

  const startUtc = zonedDateTimeToUtc(ymd, open, timeZone);
  const endUtc = zonedDateTimeToUtc(ymd, close, timeZone);

  const out: Array<{ startUtc: Date; endUtc: Date; localLabel: string }> = [];
  let cursor = new Date(startUtc);
  while (cursor < endUtc) {
    const end = addMinutes(cursor, slotIntervalMinutes);
    if (end > endUtc) break;
    const localLabel = new Intl.DateTimeFormat(undefined, {
      timeZone,
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    }).format(cursor);
    out.push({ startUtc: new Date(cursor), endUtc: end, localLabel });
    cursor = addMinutes(cursor, slotIntervalMinutes);
  }
  return out;
}

export function rangesOverlap(aStart: Date, aEnd: Date, bStart: Date, bEnd: Date): boolean {
  return aStart < bEnd && bStart < aEnd;
}
