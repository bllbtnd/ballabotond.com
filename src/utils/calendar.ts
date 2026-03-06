// Calendar utility for parsing ICS feeds and determining availability
// Only shows availability status, not event details (privacy-focused)

import { toZonedTime } from 'date-fns-tz';

export interface TimeSlot {
  start: Date;
  end: Date;
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
  const cleanDate = dateStr.split(':').pop()?.trim();
  if (!cleanDate) return null;

  const match = cleanDate.match(/^(\d{4})(\d{2})(\d{2})T?(\d{2})?(\d{2})?(\d{2})?Z?$/);
  if (!match) return null;

  const [, year, month, day, hour = '00', minute = '00', second = '00'] = match;
  const isUTC = cleanDate.endsWith('Z');

  if (isUTC) {
    const utcDate = new Date(Date.UTC(
      parseInt(year),
      parseInt(month) - 1,
      parseInt(day),
      parseInt(hour),
      parseInt(minute),
      parseInt(second)
    ));
    return toZonedTime(utcDate, 'Europe/Budapest');
  } else {
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
    const separator = normalizedUrl.includes('?') ? '&' : '?';
    const urlWithCacheBuster = `${normalizedUrl}${separator}t=${Date.now()}`;
    try {
      const response = await fetch(urlWithCacheBuster, {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      });
      if (!response.ok) continue;

      const icsContent = await response.text();
      const slots = parseICS(icsContent);
      allSlots.push(...slots);
    } catch (error) {
      console.error(`Failed to fetch calendar from ${url}:`, error);
    }
  }

  return allSlots;
}

/**
 * Check if busy RIGHT NOW based on calendar slots.
 * Also considers night hours (22:00–08:00) and weekends as busy.
 * Returns serializable busy windows for the next 24h.
 */
export async function getCurrentAvailability(calendarUrls: string[]): Promise<{
  isBusyNow: boolean;
  busyWindows: { start: number; end: number }[];
}> {
  const nowBudapest = toZonedTime(new Date(), 'Europe/Budapest');
  const hour = nowBudapest.getHours();
  const day = nowBudapest.getDay(); // 0=Sun, 6=Sat

  // Night (22:00-08:00) and weekends are always busy
  const isNightOrWeekend = hour >= 22 || hour < 8 || day === 0 || day === 6;

  // Fetch calendar events
  let slots: TimeSlot[] = [];
  try {
    slots = await fetchCalendars(calendarUrls);
  } catch {
    // If calendars fail, fall back to time-only check
  }

  // Check if any event covers "now"
  const nowMs = Date.now();
  const isBusyByCalendar = slots.some(
    slot => slot.start.getTime() <= nowMs && slot.end.getTime() > nowMs
  );

  // Build busy windows for the next 24h (serializable as epoch ms)
  const windowEnd = nowMs + 24 * 60 * 60 * 1000;
  const busyWindows = slots
    .filter(slot => slot.end.getTime() > nowMs && slot.start.getTime() < windowEnd)
    .map(slot => ({
      start: Math.max(slot.start.getTime(), nowMs),
      end: Math.min(slot.end.getTime(), windowEnd),
    }));

  return {
    isBusyNow: isNightOrWeekend || isBusyByCalendar,
    busyWindows,
  };
}
