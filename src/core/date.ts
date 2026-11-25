import {
  addDays,
  addMonths,
  addWeeks,
  differenceInCalendarDays,
  endOfMonth,
  endOfWeek,
  format,
  isValid,
  startOfDay,
  startOfMonth,
  startOfWeek,
} from 'date-fns';
import type { Locale } from 'date-fns';
import {
  CALENDAR_VIEWS,
  DAY_VIEWS,
  DEFAULT_VIEW,
  DEFAULT_WEEK_STARTS_ON,
  WEEK_VIEWS,
} from '../constants';
import type { CalendarView, DateInfo, WeekDay } from '../types';

const DATE_ONLY = /^(\d{4})-(\d{2})-(\d{2})$/;

/** `true` for strings like `2025-06-02`, without a time. */
export const isDateOnlyString = (value: unknown): value is string =>
  typeof value === 'string' && DATE_ONLY.test(value.trim());

/**
 * Turns a date value into a `Date`, or `null` when it is missing or invalid.
 *
 * Date-only strings (`2025-06-02`) are read as **local** midnight. `new Date()` reads
 * them as UTC midnight, which is the previous day in time zones west of UTC.
 */
export function toDate(value: unknown): Date | null {
  if (value === null || value === undefined || value === '') return null;
  if (value instanceof Date)
    return isValid(value) ? new Date(value.getTime()) : null;
  if (typeof value === 'number') {
    const date = new Date(value);
    return isValid(date) ? date : null;
  }
  if (typeof value === 'string') {
    const match = DATE_ONLY.exec(value.trim());
    if (match) {
      const [year, month, day] = match.slice(1).map(Number);
      const date = new Date(year, month - 1, day);
      // `new Date` rolls invalid days over (Feb 31 → Mar 3); reject them instead.
      return date.getMonth() === month - 1 && date.getDate() === day
        ? date
        : null;
    }
    const date = new Date(value);
    return isValid(date) ? date : null;
  }
  return null;
}

const pad = (n: number) => (n < 10 ? `0${n}` : String(n));

/** `yyyy-MM-dd` in local time. Hand-rolled: it runs for every item on every render. */
export const toDateKey = (date: Date): string =>
  `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;

/** `yyyy-MM-dd HH:mm:ss` in local time. */
export const toDateTimeKey = (date: Date): string =>
  `${toDateKey(date)} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;

export const MINUTE = 60_000;
export const DAY = 24 * 60 * MINUTE;

/**
 * Wall-clock minutes from local midnight of `day` to `date` (negative before it,
 * above 1440 on later days). Uses the clock time, like the hour labels do, so items
 * line up with the grid on daylight saving days too.
 */
export const minutesFrom = (day: Date, date: Date): number =>
  differenceInCalendarDays(date, day) * 1440 +
  date.getHours() * 60 +
  date.getMinutes() +
  date.getSeconds() / 60;

export const normalizeView = (view: unknown): CalendarView => {
  const value = String(view ?? '').toUpperCase();
  return (CALENDAR_VIEWS as string[]).includes(value)
    ? (value as CalendarView)
    : DEFAULT_VIEW;
};

export const normalizeWeekStartsOn = (value: unknown): WeekDay => {
  const n = Number(value);
  return Number.isInteger(n) && n >= 0 && n <= 6
    ? (n as WeekDay)
    : DEFAULT_WEEK_STARTS_ON;
};

/** The visible hours: `startHour` 0-23 and `endHour` (exclusive) after it, up to 24. */
export function normalizeHours(
  startHour: unknown,
  endHour: unknown,
): { startHour: number; endHour: number } {
  const toHour = (value: unknown, fallback: number) => {
    const n = Number(value);
    return value == null || !Number.isFinite(n) ? fallback : Math.round(n);
  };
  const start = Math.min(Math.max(toHour(startHour, 0), 0), 23);
  const end = Math.min(Math.max(toHour(endHour, 24), start + 1), 24);
  return { startHour: start, endHour: end };
}

export const isWeekView = (view: CalendarView) => WEEK_VIEWS.includes(view);
export const isDayView = (view: CalendarView) => DAY_VIEWS.includes(view);

export interface ViewRange {
  /** First visible day, at local midnight. */
  start: Date;
  /** Last visible day, at local midnight. */
  end: Date;
  /** Every visible day, at local midnight. */
  days: Date[];
}

/** The days a view shows for `date`. */
export function getViewRange(
  view: CalendarView,
  date: Date,
  weekStartsOn: WeekDay,
): ViewRange {
  let start: Date;
  let end: Date;
  if (view === 'MONTH') {
    start = startOfWeek(startOfMonth(date), { weekStartsOn });
    end = startOfDay(endOfWeek(endOfMonth(date), { weekStartsOn }));
  } else if (isWeekView(view)) {
    start = startOfWeek(date, { weekStartsOn });
    end = startOfDay(endOfWeek(date, { weekStartsOn }));
  } else {
    start = startOfDay(date);
    end = start;
  }
  const days: Date[] = [];
  for (let day = start; day <= end; day = addDays(day, 1)) days.push(day);
  return { start, end, days };
}

/** The date one period before (`-1`) or after (`1`) `date` in a view. */
export function shiftDate(
  view: CalendarView,
  date: Date,
  direction: 1 | -1,
): Date {
  if (view === 'MONTH') return addMonths(date, direction);
  if (isWeekView(view)) return addWeeks(date, direction);
  return addDays(date, direction);
}

/** Toolbar title for a view, e.g. `June 2025`, `Jun 30 – Jul 6, 2025` or `June 2, 2025`. */
export function getTitle(
  view: CalendarView,
  date: Date,
  range: ViewRange,
  locale: Locale | undefined,
  pattern?: string,
): string {
  if (pattern) return format(date, pattern, { locale });
  if (view === 'MONTH') return format(date, 'LLLL yyyy', { locale });
  if (isDayView(view)) return format(date, 'PPPP', { locale });
  const { start, end } = range;
  if (start.getFullYear() !== end.getFullYear())
    return `${format(start, 'PP', { locale })} – ${format(end, 'PP', { locale })}`;
  if (start.getMonth() !== end.getMonth())
    return `${format(start, 'LLL d', { locale })} – ${format(end, 'LLL d, yyyy', { locale })}`;
  return format(start, 'LLLL yyyy', { locale });
}

/** Builds the `DateInfo` passed to callbacks. */
export function createDateInfo(
  day: Date,
  options: { hour?: number; currentMonth?: number; today: Date },
): DateInfo {
  const { hour, currentMonth, today } = options;
  const start = new Date(
    day.getFullYear(),
    day.getMonth(),
    day.getDate(),
    hour ?? 0,
  );
  return {
    isCurrentDay: toDateKey(day) === toDateKey(today),
    isCurrentMonth:
      currentMonth === undefined ? undefined : day.getMonth() === currentMonth,
    date: toDateKey(day),
    day: day.getDate(),
    month: day.getMonth(),
    year: day.getFullYear(),
    ...(hour === undefined ? {} : { hour }),
    timeDate: hour === undefined ? toDateKey(day) : toDateTimeKey(start),
    timeDateUTC: start.toISOString(),
  };
}
