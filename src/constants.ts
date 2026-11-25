import type { CalendarView, ResolvedLabels, WeekDay } from './types';

/** All views, in the order the view switcher shows them. */
export const CALENDAR_VIEWS: readonly CalendarView[] = [
  'MONTH',
  'WEEK',
  'WEEK_TIME',
  'DAY',
  'DAY_REVERSE',
  'WEEK_IN_PLACE',
  'DAY_IN_PLACE',
];

/** Views that show one week. */
export const WEEK_VIEWS: readonly CalendarView[] = [
  'WEEK',
  'WEEK_TIME',
  'WEEK_IN_PLACE',
];

/** Views that show one day. */
export const DAY_VIEWS: readonly CalendarView[] = [
  'DAY',
  'DAY_REVERSE',
  'DAY_IN_PLACE',
];

/** Default texts. Override any of them with the `labels` prop. */
export const DEFAULT_LABELS: ResolvedLabels = {
  today: 'Today',
  previous: 'Previous period',
  next: 'Next period',
  allDay: 'All day',
  close: 'Close',
  viewSwitcher: 'View',
  more: (count) => `+${count} more`,
  views: {
    MONTH: 'Month',
    WEEK: 'Week',
    WEEK_TIME: 'Week schedule',
    DAY: 'Day',
    DAY_REVERSE: 'Day timeline',
    WEEK_IN_PLACE: 'Week by hour',
    DAY_IN_PLACE: 'Day by hour',
  },
};

/** Default date-fns format strings, see `timeDateFormat`. */
export const DEFAULT_FORMATS = {
  /** Weekday names. */
  day: 'EEE',
  /** Weekday names in narrow calendars. */
  narrowDay: 'EEEEE',
  /** Hour labels. */
  hour: 'h a',
  /** Times inside items: the locale's short time. */
  time: 'p',
} as const;

export const DEFAULT_VIEW: CalendarView = 'MONTH';
export const DEFAULT_WEEK_STARTS_ON: WeekDay = 1;
/** Items per MONTH cell before "+N more". */
export const DEFAULT_DAY_MAX_ITEMS = 3;
/** Hour the timelines scroll to when today is not visible. */
export const DEFAULT_SCROLL_HOUR = 8;
/** Shortest drawn duration of a timeline item, in minutes. */
export const MIN_ITEM_MINUTES = 20;
/** Drawn duration of an item without an end, in minutes. */
export const MOMENT_ITEM_MINUTES = 30;
/** Timeline items shorter than this (minutes) are drawn on one line. */
export const COMPACT_ITEM_MINUTES = 45;
