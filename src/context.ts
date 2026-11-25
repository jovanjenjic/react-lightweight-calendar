import type { Locale } from 'date-fns';
import { createContext, useContext } from 'react';
import type { DEFAULT_FORMATS } from './constants';
import { formatItemTime } from './core/format';
import { isMultiDay, type NormalizedItem } from './core/items';
import type {
  CalendarItem,
  CalendarProps,
  CalendarView,
  ColorDot,
  ItemRenderInfo,
  ResolvedLabels,
  WeekDay,
} from './types';

/** Everything the parts of the calendar share, resolved once per render. */
export interface CalendarContextValue {
  props: CalendarProps<CalendarItem>;
  view: CalendarView;
  currentDate: Date;
  weekStartsOn: WeekDay;
  locale: Locale | undefined;
  labels: ResolvedLabels;
  formats: Record<keyof typeof DEFAULT_FORMATS, string>;
  now: Date;
  todayKey: string;
  startHour: number;
  endHour: number;
  colorDotsByDate: ReadonlyMap<string, ColorDot>;
  /** Cells (`yyyy-MM-dd` or `yyyy-MM-dd HH:mm:ss`) collapsed by `cellDisplayMode`. */
  collapsedCells: ReadonlySet<string>;
  hoveredKey: string | null;
  setHoveredKey: (key: string | null) => void;
  /** Opens the list of a day's items next to `anchor`. */
  openMore: (date: Date, anchor: HTMLElement) => void;
  /** `yyyy-MM-dd` of the period before (-1) or after (1) the current one. */
  shift: (direction: -1 | 1) => string;
}

export const CalendarContext = createContext<CalendarContextValue | null>(null);

export function useCalendar(): CalendarContextValue {
  const context = useContext(CalendarContext);
  if (!context) {
    throw new Error('Calendar parts must be rendered inside <Calendar>.');
  }
  return context;
}

/** How one drawn piece of an item looks; the rest of `info` comes from the item. */
export type ItemPiece = Pick<
  ItemRenderInfo,
  'isAllDay' | 'continuesBefore' | 'continuesAfter' | 'isCompact'
>;

/** The `info` argument of the item renderers. */
export function createItemInfo(
  n: NormalizedItem,
  ctx: CalendarContextValue,
  piece: ItemPiece,
): ItemRenderInfo {
  return {
    start: n.start,
    end: n.end,
    view: ctx.view,
    ...piece,
    isMultiDay: isMultiDay(n),
    isHovered: ctx.hoveredKey === n.key,
    ...formatItemTime(n, ctx.formats.time, ctx.locale),
  };
}
