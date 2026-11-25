import type { Locale } from 'date-fns';
import type { CSSProperties, MouseEvent, ReactNode } from 'react';

/* -------------------------------------------------------------------------- */
/* Enums, kept for backward compatibility. Every prop also accepts the plain  */
/* string or number values.                                                   */
/* -------------------------------------------------------------------------- */

export enum CurrentView {
  MONTH = 'MONTH',
  WEEK = 'WEEK',
  WEEK_TIME = 'WEEK_TIME',
  DAY = 'DAY',
  DAY_REVERSE = 'DAY_REVERSE',
  WEEK_IN_PLACE = 'WEEK_IN_PLACE',
  DAY_IN_PLACE = 'DAY_IN_PLACE',
}

export enum CellDisplayModeState {
  ALL_COLLAPSED = 'ALL_COLLAPSED',
  ALL_EXPANDED = 'ALL_EXPANDED',
  CUSTOM = 'CUSTOM',
}

export enum WeekStartsOn {
  SUNDAY = 0,
  MONDAY = 1,
  TUESDAY = 2,
  WEDNESDAY = 3,
  THURSDAY = 4,
  FRIDAY = 5,
  SATURDAY = 6,
}

/** The seven views, as plain strings. */
export type CalendarView = `${CurrentView}`;
export type CellDisplayState = `${CellDisplayModeState}`;
export type WeekDay = 0 | 1 | 2 | 3 | 4 | 5 | 6;
export type CalendarTheme = 'light' | 'dark' | 'auto';

/* -------------------------------------------------------------------------- */
/* Data                                                                       */
/* -------------------------------------------------------------------------- */

/**
 * An item to show. The calendar reads `id`, `title`, `bgColor`, `textColor`,
 * `allDay` and the date fields named by `activeTimeDateField`; everything else
 * is passed back to you untouched.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type CalendarItem = Record<string, any>;

/** Information about a day, or an hour of a day, passed to callbacks. */
export interface DateInfo {
  isCurrentDay: boolean;
  isCurrentMonth?: boolean;
  /** `yyyy-MM-dd` */
  date: string;
  /** Day of the month, 1-31. */
  day: number;
  /** Month, 0-11. */
  month: number;
  year: number;
  /** Hour, 0-23, in hour-based cells. */
  hour?: number;
  /** Local key of the cell: `yyyy-MM-dd`, or `yyyy-MM-dd HH:mm:ss` in hour-based cells. */
  timeDate: string;
  /** The start of the cell as an ISO string. */
  timeDateUTC: string;
}

export interface ColorDot {
  color: string;
  text: string;
  /** `yyyy-MM-dd` */
  date: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

export interface TimeFormat {
  /** Weekday names. Default `'EEE'`. */
  day?: string;
  /** Weekday names in narrow calendars. Default `'EEEEE'`. */
  narrowDay?: string;
  /** Hour labels. Default `'h a'`. */
  hour?: string;
  /** Toolbar title. Default depends on the view. */
  monthYear?: string;
  /** Times shown inside items. Default `'p'` (the locale's short time). */
  time?: string;
}

export interface CellDisplayModeConfig {
  state: CellDisplayModeState | CellDisplayState;
  /** With `CUSTOM`: the collapsed cells, `yyyy-MM-dd` or `yyyy-MM-dd HH:mm:ss`. */
  inactiveCells?: string[];
}

/** Cells that show only their last item, per view. */
export type CellDisplayMode = Partial<
  Record<CalendarView, CellDisplayModeConfig>
>;

export interface CalendarLabels {
  today?: string;
  previous?: string;
  next?: string;
  allDay?: string;
  /** Text of the "+N more" link. */
  more?: (count: number) => string;
  /** Close button of the day list opened by "+N more". */
  close?: string;
  /** Accessible name of the view switcher. */
  viewSwitcher?: string;
  views?: Partial<Record<CalendarView, string>>;
}

/** `CalendarLabels` with every text filled in. */
export type ResolvedLabels = Required<Omit<CalendarLabels, 'views'>> & {
  views: Record<CalendarView, string>;
};

/* -------------------------------------------------------------------------- */
/* Render props                                                               */
/* -------------------------------------------------------------------------- */

/** Extra information passed as the last argument to item renderers. */
export interface ItemRenderInfo {
  start: Date;
  end: Date;
  view: CalendarView;
  /** Shown in the all-day row, or as a full-day bar. */
  isAllDay: boolean;
  /** Covers more than one day. */
  isMultiDay: boolean;
  /** This piece continues from an earlier day that is not part of it. */
  continuesBefore: boolean;
  /** This piece continues after its last day. */
  continuesAfter: boolean;
  /** The item is drawn small (short timeline item or narrow calendar). */
  isCompact: boolean;
  isHovered: boolean;
  /** The item's time, formatted, e.g. `9:00 AM – 10:30 AM`. Empty for all-day items. */
  timeLabel: string;
  /** The start time alone, e.g. `9:00 AM`. Empty for all-day items. */
  startTimeLabel: string;
}

export interface HeaderItemExtras extends ItemRenderInfo {
  /** CSS grid columns the item covers in the all-day row, e.g. `'2 / 5'`. */
  gridColumn: string;
  isFromPrevious?: boolean;
  isFromNext?: boolean;
}

export interface NavigationRenderProps {
  /** Formatted title of the visible period, e.g. `June 2025`. */
  title: string;
  currentDate: Date;
  view: CalendarView;
  /** First and last visible day. */
  range: { start: Date; end: Date };
  goToToday: () => void;
  goToPrevious: () => void;
  goToNext: () => void;
  /** `false` when `setCurrentDate` is not passed. */
  canNavigate: boolean;
  views: CalendarView[];
  onViewChange?: (view: CalendarView) => void;
  labels: ResolvedLabels;
}

export interface DayHeaderRenderProps {
  date: Date;
  dateInfo: DateInfo;
  /** Weekday name formatted with `timeDateFormat.day`. */
  weekdayLabel: string;
  dayNumber: number;
  isToday: boolean;
  view: CalendarView;
  colorDot?: ColorDot;
  /** Calls `onDayStringClick`, like the default weekday button. */
  onWeekdayClick: (event: MouseEvent<HTMLElement>) => void;
  /** Calls `onDayNumberClick`, like the default day number button. */
  onDayNumberClick: (event: MouseEvent<HTMLElement>) => void;
}

export interface DayNumberRenderProps {
  date: Date;
  dateInfo: DateInfo;
  dayNumber: number;
  isToday: boolean;
  isCurrentMonth: boolean;
  colorDot?: ColorDot;
}

export interface HourLabelRenderProps {
  hour: number;
  /** Formatted with `timeDateFormat.hour`. */
  label: string;
  view: CalendarView;
}

export interface MoreLinkRenderProps<T extends CalendarItem = CalendarItem> {
  count: number;
  date: Date;
  /** Every item on that day, including the visible ones. */
  items: T[];
}

export interface CellContentRenderProps<T extends CalendarItem = CalendarItem> {
  date: Date;
  dateInfo: DateInfo;
  items: T[];
  isToday: boolean;
  isCurrentMonth: boolean;
}

/* -------------------------------------------------------------------------- */
/* Props                                                                      */
/* -------------------------------------------------------------------------- */

type ClickHandler<V> = (value: V, event: MouseEvent<HTMLElement>) => void;

export interface CalendarProps<T extends CalendarItem = CalendarItem> {
  /** Items to show. The array is never mutated. */
  data?: T[];
  /** The field that positions items, or two fields joined by `-` for an interval. */
  activeTimeDateField?: string;
  /** Default `'MONTH'`. Lowercase names work too. */
  // `string & {}` accepts any string but keeps the view names in autocomplete.
  currentView?: CalendarView | CurrentView | (string & {});
  /** The date whose period is shown: `yyyy-MM-dd` or a `Date`. Default today. */
  currentDate?: string | Date;
  /** Shows the built-in navigation and receives the new date as `yyyy-MM-dd`. */
  setCurrentDate?: (date: string | Date) => void;
  /** Shows a view switcher in the toolbar. */
  onViewChange?: (view: CalendarView) => void;
  /** Views offered by the view switcher. Default all seven. */
  views?: CalendarView[];

  /** First day of the week, 0 (Sunday) to 6 (Saturday). Default 1. */
  weekStartsOn?: WeekStartsOn | WeekDay | number;
  locale?: Locale;
  timeDateFormat?: TimeFormat;
  /** Text of the "Today" button. Same as `labels.today`. */
  todayLabel?: string;
  labels?: CalendarLabels;

  /** First hour shown in hour-based views. Default 0. */
  startHour?: number;
  /** Hour at which hour-based views end, exclusive. Default 24. */
  endHour?: number;
  /** Hour to scroll hour-based views to, or `'now'`. Default `'now'` for today, otherwise 8. */
  scrollToHour?: number | 'now';
  /** Items per day before "+N more" in MONTH, or `'auto'` to fit the cell height. Default 3. */
  dayMaxItems?: number | 'auto';

  colorDots?: ColorDot[];
  /** Show the legend under the calendar when `colorDots` are set. Default `true`. */
  showColorDotsLegend?: boolean;
  cellDisplayMode?: CellDisplayMode;
  disableHoverEffect?: boolean;

  /** `'light'` (default), `'dark'`, or `'auto'` to follow the system setting. */
  theme?: CalendarTheme;
  className?: string;
  style?: CSSProperties;

  /* Item rendering */
  renderItem?: (item: T, isHovered: boolean, info: ItemRenderInfo) => ReactNode;
  renderItemText?: (item: T, info: ItemRenderInfo) => ReactNode;
  renderHeaderItem?: (item: T, extras: HeaderItemExtras) => ReactNode;
  renderHeaderItemText?: (item: T, info: ItemRenderInfo) => ReactNode;

  /* Part rendering */
  renderNavigation?: (props: NavigationRenderProps) => ReactNode;
  renderDayHeader?: (props: DayHeaderRenderProps) => ReactNode;
  renderDayNumber?: (props: DayNumberRenderProps) => ReactNode;
  renderHourLabel?: (props: HourLabelRenderProps) => ReactNode;
  renderMoreLink?: (props: MoreLinkRenderProps<T>) => ReactNode;
  renderCellContent?: (props: CellContentRenderProps<T>) => ReactNode;
  renderColorDot?: (dot: ColorDot) => ReactNode;
  renderLegend?: (dots: ColorDot[]) => ReactNode;

  /* Callbacks */
  onItemClick?: ClickHandler<T>;
  onCellClick?: ClickHandler<DateInfo>;
  onCellHeaderClick?: ClickHandler<DateInfo>;
  onDayNumberClick?: ClickHandler<string>;
  onDayStringClick?: ClickHandler<string | Date>;
  onHourClick?: ClickHandler<DateInfo | number>;
  onColorDotClick?: ClickHandler<ColorDot>;
  /** Called by "+N more". Without it, the calendar opens its own list of the day's items. */
  onMoreClick?: (
    date: Date,
    items: T[],
    event: MouseEvent<HTMLElement>,
  ) => void;
}
