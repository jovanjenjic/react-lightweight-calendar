import { addDays, startOfDay } from 'date-fns';
import type { CalendarItem } from '../types';
import { DAY, isDateOnlyString, toDate, toDateKey } from './date';

/** An item with parsed dates, ready for layout. */
export interface NormalizedItem<T extends CalendarItem = CalendarItem> {
  /** The original object from `data`. */
  item: T;
  /** Unique and stable within one `data` array, also for missing or duplicate ids. */
  key: string;
  start: Date;
  /** Exclusive end. Equal to `start` for single moments. */
  end: Date;
  /** A whole-day item: `allDay: true`, or only dates without times. */
  isAllDay: boolean;
  /** Position in `data`, used to keep the order stable. */
  index: number;
  /** `yyyy-MM-dd` of the first day the item touches. */
  firstKey: string;
  /** `yyyy-MM-dd` of the last day the item touches. */
  lastKey: string;
}

/** Splits `startTime-endTime` into its two field names. */
export function parseActiveField(
  activeTimeDateField: string | undefined,
): [string, string] {
  const [startKey = '', endKey] = (activeTimeDateField ?? '')
    .split('-')
    .map((part) => part.trim());
  return [startKey, endKey || startKey];
}

/**
 * Reads `data` into items with real dates. Items without a valid start are left out.
 * The input array and its objects are never modified.
 */
export function normalizeItems<T extends CalendarItem>(
  data: readonly T[] | undefined,
  activeTimeDateField: string | undefined,
): NormalizedItem<T>[] {
  if (!data?.length) return [];
  const [startKey, endKey] = parseActiveField(activeTimeDateField);
  if (!startKey) return [];

  const seen = new Map<string, number>();
  const result: NormalizedItem<T>[] = [];

  data.forEach((item, index) => {
    if (!item) return;
    const rawStart = item[startKey];
    const rawEnd = item[endKey];
    let start = toDate(rawStart);
    if (!start) return;
    let end = toDate(rawEnd) ?? start;

    const isAllDay =
      item.allDay === true ||
      (isDateOnlyString(rawStart) &&
        (rawEnd == null || isDateOnlyString(rawEnd)));

    if (end < start) end = start;
    if (isAllDay) {
      // Whole days, from the first day's midnight to the midnight after the last day.
      // A date-only end is the last day itself; a timed end at midnight is exclusive
      // (`2025-06-05T00:00` ends on June 4), as calendar APIs export it.
      const lastDay =
        rawEnd == null || isDateOnlyString(rawEnd) || end <= start
          ? startOfDay(end)
          : startOfDay(new Date(end.getTime() - 1));
      start = startOfDay(start);
      end = addDays(lastDay, 1);
    }

    const baseKey =
      item.id === undefined || item.id === null || item.id === ''
        ? `#${index}`
        : String(item.id);
    const count = seen.get(baseKey) ?? 0;
    seen.set(baseKey, count + 1);

    const normalized = {
      item,
      key: count === 0 ? baseKey : `${baseKey}#${count}`,
      start,
      end,
      isAllDay,
      index,
      firstKey: '',
      lastKey: '',
    };
    normalized.firstKey = toDateKey(firstDayOf(normalized));
    normalized.lastKey = toDateKey(lastDayOf(normalized));
    result.push(normalized);
  });

  return result.sort(compareItems);
}

/** Earlier first; for the same start, longer first; then the order in `data`. */
export function compareItems(a: NormalizedItem, b: NormalizedItem): number {
  return (
    a.start.getTime() - b.start.getTime() ||
    b.end.getTime() -
      b.start.getTime() -
      (a.end.getTime() - a.start.getTime()) ||
    a.index - b.index
  );
}

type Range = Pick<NormalizedItem, 'start' | 'end'>;

/** First day the item touches, at local midnight. */
export const firstDayOf = (n: Range): Date => startOfDay(n.start);

/** Last day the item touches, at local midnight. An end exactly at midnight belongs to the day before. */
export const lastDayOf = (n: Range): Date =>
  n.end > n.start
    ? startOfDay(new Date(n.end.getTime() - 1))
    : startOfDay(n.start);

export const isMultiDay = (n: NormalizedItem): boolean =>
  n.firstKey !== n.lastKey;

/**
 * Goes in the all-day row of the timeline views: whole-day items and items of 24 hours
 * or more. Shorter items that cross midnight are split across their days instead.
 */
export const belongsToAllDayRow = (n: NormalizedItem): boolean =>
  n.isAllDay || n.end.getTime() - n.start.getTime() >= DAY;

/** Items that touch `day`. */
export const itemsOnDay = <T extends CalendarItem>(
  items: NormalizedItem<T>[],
  day: Date,
): NormalizedItem<T>[] => {
  const key = toDateKey(day);
  return items.filter((n) => n.firstKey <= key && n.lastKey >= key);
};
