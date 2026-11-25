import { format } from 'date-fns';
import type { Locale } from 'date-fns';
import type { NormalizedItem } from './items';
import { toDateKey } from './date';

export interface TimeLabels {
  /** `9:00 AM – 10:30 AM`, or `9:00 AM – Jun 5, 1:00 AM` across days. */
  timeLabel: string;
  /** `9:00 AM`. */
  startTimeLabel: string;
}

const NO_TIME: TimeLabels = { timeLabel: '', startTimeLabel: '' };

/**
 * Formats an item's time with `timePattern` (a date-fns format, default `p`).
 * All-day items have no time.
 */
export function formatItemTime(
  n: Pick<NormalizedItem, 'start' | 'end' | 'isAllDay'>,
  timePattern: string,
  locale?: Locale,
): TimeLabels {
  if (n.isAllDay) return NO_TIME;
  const startTimeLabel = format(n.start, timePattern, { locale });
  if (n.end.getTime() === n.start.getTime()) {
    return { timeLabel: startTimeLabel, startTimeLabel };
  }
  const endPattern =
    toDateKey(n.start) === toDateKey(n.end)
      ? timePattern
      : `MMM d, ${timePattern}`;
  const end = format(n.end, endPattern, { locale });
  return { timeLabel: `${startTimeLabel} – ${end}`, startTimeLabel };
}
