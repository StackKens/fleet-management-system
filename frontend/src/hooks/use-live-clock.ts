import { useCallback, useEffect, useState } from 'react';

// =============================================================================
// LIVE CLOCK
// =============================================================================
// WHAT IS THIS?
// ------------
// A single shared hook so every dashboard shows the REAL current date and time
// instead of a hard-coded placeholder. Previously the Fleet Manager dashboard
// shipped a literal `'09:14'`, which meant the "Updated" label was always wrong.
//
// WHY A HOOK INSTEAD OF INLINE CODE?
// ----------------------------------
// Four dashboards need the same clock. Keeping the formatting logic in one place
// means the format can be fixed once and all screens stay consistent.
//
// HOW OFTEN DOES IT UPDATE?
// ------------------------
// Every 30 seconds. The clock only displays minutes, so a 30s interval keeps the
// displayed minute in sync within half a minute of the real changeover without
// re-rendering more than necessary.
// =============================================================================

function formatTime(date: Date): string {
  return new Intl.DateTimeFormat('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(date);
}

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-GB', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(date);
}

function formatLongDate(date: Date): string {
  return new Intl.DateTimeFormat('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date);
}

function formatTimeZone(date: Date): string {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZoneName: 'short',
  }).formatToParts(date);
  return parts.find((part) => part.type === 'timeZoneName')?.value ?? '';
}

function resolveGreeting(date: Date): string {
  const hour = date.getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}

export type LiveClock = {
  /** "14:32" */
  time: string;
  /** "Wed 1 Oct 2026" */
  date: string;
  /** "Thursday, 1 October 2026" */
  longDate: string;
  /** "Wed 1 Oct 2026, 14:32" */
  dateTime: string;
  /** ISO string, handy for the <time dateTime> attribute. */
  iso: string;
  /** "EAT", "GMT+3", ... — the browser's actual zone, never assumed. */
  timeZone: string;
  /** "Good morning" / "Good afternoon" / "Good evening" */
  greeting: string;
};

function snapshot(): LiveClock {
  const now = new Date();
  return {
    time: formatTime(now),
    date: formatDate(now),
    longDate: formatLongDate(now),
    dateTime: `${formatDate(now)}, ${formatTime(now)}`,
    iso: now.toISOString(),
    timeZone: formatTimeZone(now),
    greeting: resolveGreeting(now),
  };
}

export type UseLiveClockResult = LiveClock & {
  /** Force an immediate resync, e.g. from a "Refresh" button. */
  refresh: () => void;
};

export function useLiveClock(intervalMs = 30000): UseLiveClockResult {
  const [clock, setClock] = useState<LiveClock>(snapshot);

  const sync = useCallback(() => setClock(snapshot()), []);

  useEffect(() => {
    const id = setInterval(sync, intervalMs);

    // The tab may have been backgrounded, so resync immediately on return
    // instead of waiting out the remaining interval.
    const onVisible = () => {
      if (document.visibilityState === 'visible') sync();
    };
    document.addEventListener('visibilitychange', onVisible);

    return () => {
      clearInterval(id);
      document.removeEventListener('visibilitychange', onVisible);
    };
  }, [sync, intervalMs]);

  return { ...clock, refresh: sync };
}