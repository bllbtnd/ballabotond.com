// Calendar utility for parsing ICS feeds and determining availability
// Only shows availability status, not event details (privacy-focused)

import { toZonedTime } from 'date-fns-tz';

export interface TimeSlot {
  start: Date;
  end: Date;
}

export interface DayAvailability {
  date: Date;
  slots: TimeSlot[];
  isAvailable: boolean;
  isPast: boolean;
  hourlyAvailability?: boolean[]; // Index 0 = 6 AM, Index 16 = 10 PM
}

/**
 * Parse ICS/iCal format string into time slots
 * Only extracts DTSTART and DTEND, ignores all event details for privacy
 */
export function parseICS(icsContent: string): TimeSlot[] {
  const slots: TimeSlot[] = [];
  const events = icsContent.split('BEGIN:VEVENT');

  for (let i = 1; i < events.length; i++) {
    const event = events[i];
    const dtStartMatch = event.match(/DTSTART[;:]([^\r\n]+)/);
    const dtEndMatch = event.match(/DTEND[;:]([^\r\n]+)/);

    if (dtStartMatch && dtEndMatch) {
      const start = parseICSDate(dtStartMatch[1]);
      const end = parseICSDate(dtEndMatch[1]);
      
      if (start && end) {
        slots.push({ start, end });
      }
    }
  }

  return slots;
}

/**
 * Parse ICS date format (supports both YYYYMMDD and YYYYMMDDTHHmmss formats)
 * Converts all times to Budapest timezone (Europe/Budapest)
 */
function parseICSDate(dateStr: string): Date | null {
  // Remove TZID and VALUE parameters
  const cleanDate = dateStr.split(':').pop()?.trim();
  if (!cleanDate) return null;

  // Handle YYYYMMDDTHHMMSSZ format
  const match = cleanDate.match(/^(\d{4})(\d{2})(\d{2})T?(\d{2})?(\d{2})?(\d{2})?Z?$/);
  if (!match) return null;

  const [, year, month, day, hour = '00', minute = '00', second = '00'] = match;
  
  // Check if this is a UTC time (ends with Z)
  const isUTC = cleanDate.endsWith('Z');
  
  if (isUTC) {
    // Create a UTC date first
    const utcDate = new Date(Date.UTC(
      parseInt(year),
      parseInt(month) - 1,
      parseInt(day),
      parseInt(hour),
      parseInt(minute),
      parseInt(second)
    ));
    
    // Convert to Budapest timezone
    // This properly handles CET (UTC+1) in winter and CEST (UTC+2) in summer
    return toZonedTime(utcDate, 'Europe/Budapest');
  } else {
    // Non-UTC date - treat as local time (already in Budapest timezone)
    return new Date(
      parseInt(year),
      parseInt(month) - 1,
      parseInt(day),
      parseInt(hour),
      parseInt(minute),
      parseInt(second)
    );
  }
}

/**
 * Convert webcal:// URLs to https:// URLs for fetching
 */
function normalizeCalendarUrl(url: string): string {
  if (url.startsWith('webcal://')) {
    return url.replace('webcal://', 'https://');
  }
  return url;
}

/**
 * Fetch and parse multiple ICS feeds
 */
export async function fetchCalendars(urls: string[]): Promise<TimeSlot[]> {
  const allSlots: TimeSlot[] = [];

  for (const url of urls) {
    const normalizedUrl = normalizeCalendarUrl(url);
    try {
      const response = await fetch(normalizedUrl);
      if (!response.ok) continue;
      
      const icsContent = await response.text();
      const slots = parseICS(icsContent);
      allSlots.push(...slots);
    } catch (error) {
      console.error(`Failed to fetch calendar from ${normalizedUrl} (original: ${url}):`, error);
    }
  }

  return allSlots;
}

/**
 * Get availability for exactly N full weeks, starting from Monday of the current week
 */
export function getAvailability(
  busySlots: TimeSlot[],
  weeksAhead: number = 4
): DayAvailability[] {
  const availability: DayAvailability[] = [];
  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  
  // Find the Monday of the current week (Monday = 1, Sunday = 0)
  const dayOfWeek = startOfToday.getDay();
  const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek; // If Sunday, go back 6 days
  const monday = new Date(startOfToday);
  monday.setDate(monday.getDate() + mondayOffset);
  
  // Generate exactly weeksAhead * 7 days starting from Monday
  for (let i = 0; i < weeksAhead * 7; i++) {
    const date = new Date(monday);
    date.setDate(date.getDate() + i);
    
    const dayStart = new Date(date);
    const dayEnd = new Date(date);
    dayEnd.setHours(23, 59, 59, 999);
    
    // Find all busy slots for this day
    const daySlotsRaw = busySlots.filter(slot => {
      return (
        (slot.start >= dayStart && slot.start <= dayEnd) ||
        (slot.end >= dayStart && slot.end <= dayEnd) ||
        (slot.start <= dayStart && slot.end >= dayEnd)
      );
    });

    // Merge overlapping slots and trim to day boundaries
    const daySlots = mergeSlots(
      daySlotsRaw.map(slot => ({
        start: slot.start < dayStart ? dayStart : slot.start,
        end: slot.end > dayEnd ? dayEnd : slot.end
      }))
    );
    
    // Check if it's a weekend (Saturday = 6, Sunday = 0)
    const dayOfWeek = date.getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    
    // Calculate hourly availability from 6 AM (hour 6) to 10 PM (hour 22)
    const hourlyAvailability: boolean[] = [];
    for (let hour = 6; hour <= 22; hour++) {
      // Weekends are always busy
      if (isWeekend) {
        hourlyAvailability.push(false);
        continue;
      }
      
      const hourStart = new Date(date);
      hourStart.setHours(hour, 0, 0, 0);
      const hourEnd = new Date(date);
      hourEnd.setHours(hour, 59, 59, 999);
      
      // Check if this hour overlaps with any busy slot
      // An event must actually occupy time within the hour, not just touch its boundaries
      const isBusy = daySlots.some(slot => {
        return (
          (slot.start < hourEnd && slot.end > hourStart)
        );
      });
      
      hourlyAvailability.push(!isBusy);
    }
    
    // Consider a day unavailable if there are any busy slots or if it's a weekend
    const isAvailable = !isWeekend && daySlots.length === 0;
    const isPast = date < startOfToday;
    
    availability.push({
      date,
      slots: daySlots,
      isAvailable,
      isPast,
      hourlyAvailability
    });
  }

  return availability;
}

/**
 * Merge overlapping time slots
 */
function mergeSlots(slots: TimeSlot[]): TimeSlot[] {
  if (slots.length === 0) return [];
  
  const sorted = [...slots].sort((a, b) => a.start.getTime() - b.start.getTime());
  const merged: TimeSlot[] = [sorted[0]];
  
  for (let i = 1; i < sorted.length; i++) {
    const current = sorted[i];
    const last = merged[merged.length - 1];
    
    if (current.start <= last.end) {
      // Overlapping or adjacent - merge
      last.end = new Date(Math.max(last.end.getTime(), current.end.getTime()));
    } else {
      // Not overlapping - add as new slot
      merged.push(current);
    }
  }
  
  return merged;
}

/**
 * Get week number for a given date
 */
export function getWeekNumber(date: Date): number {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
}

/**
 * Group days by week
 */
export function groupByWeek(days: DayAvailability[]): DayAvailability[][] {
  const weeks: DayAvailability[][] = [];
  let currentWeek: DayAvailability[] = [];
  let currentWeekNum: number | null = null;

  for (const day of days) {
    const weekNum = getWeekNumber(day.date);
    
    if (currentWeekNum === null || weekNum !== currentWeekNum) {
      if (currentWeek.length > 0) {
        weeks.push(currentWeek);
      }
      currentWeek = [day];
      currentWeekNum = weekNum;
    } else {
      currentWeek.push(day);
    }
  }

  if (currentWeek.length > 0) {
    weeks.push(currentWeek);
  }

  return weeks;
}

/**
 * Filter out weekends from availability data (for calendar display)
 */
export function filterWeekdays(days: DayAvailability[]): DayAvailability[] {
  return days.filter(day => {
    const dayOfWeek = day.date.getDay();
    return dayOfWeek !== 0 && dayOfWeek !== 6; // Exclude Sunday (0) and Saturday (6)
  });
}
