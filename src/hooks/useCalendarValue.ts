import { useCallback, useEffect, useMemo, useState } from 'react';
import { DEFAULT_FORMATS, DEFAULT_LABELS } from '../constants';
import type { CalendarContextValue } from '../context';
import {
  getTitle,
  getViewRange,
  normalizeHours,
  normalizeView,
  normalizeWeekStartsOn,
  shiftDate,
  toDate,
  toDateKey,
} from '../core/date';
import { itemsOnDay, normalizeItems } from '../core/items';
import { getCollapsedCells } from '../core/layout';
import type {
  CalendarItem,
  CalendarLabels,
  CalendarProps,
  ColorDot,
  ResolvedLabels,
} from '../types';
import { useNow } from './useNow';

interface MoreState {
  date: Date;
  anchor: HTMLElement;
}

/**
 * Resolves the props of <Calendar> into the shared context value, the visible period
 * and its items, and the state of the "+N more" list.
 */
export function useCalendarValue<T extends CalendarItem>(
  props: CalendarProps<T>,
) {
  const view = normalizeView(props.currentView);
  const weekStartsOn = normalizeWeekStartsOn(props.weekStartsOn);
  const { startHour, endHour } = normalizeHours(props.startHour, props.endHour);
  const now = useNow();
  const todayKey = toDateKey(now);

  // Recompute when the prop changes, or at midnight when it defaults to today.
  const dateDependency =
    props.currentDate instanceof Date
      ? props.currentDate.getTime()
      : (props.currentDate ?? todayKey);
  const currentDate = useMemo(
    () => toDate(props.currentDate) ?? toDate(todayKey)!,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [dateDependency],
  );
  const range = useMemo(
    () => getViewRange(view, currentDate, weekStartsOn),
    [view, currentDate, weekStartsOn],
  );

  const allItems = useMemo(
    () => normalizeItems(props.data, props.activeTimeDateField),
    [props.data, props.activeTimeDateField],
  );
  const items = useMemo(() => {
    const first = toDateKey(range.start);
    const last = toDateKey(range.end);
    return allItems.filter((n) => n.firstKey <= last && n.lastKey >= first);
  }, [allItems, range]);

  const colorDotsByDate = useMemo(
    () =>
      new Map<string, ColorDot>(props.colorDots?.map((dot) => [dot.date, dot])),
    [props.colorDots],
  );
  const collapsedCells = useMemo(
    () => getCollapsedCells(props.cellDisplayMode, view, range.days),
    [props.cellDisplayMode, view, range],
  );

  const labels = useMemo(
    () => resolveLabels(props.labels, props.todayLabel),
    [props.labels, props.todayLabel],
  );
  const { day, narrowDay, hour, time, monthYear } = props.timeDateFormat ?? {};
  const formats = useMemo(
    () => ({
      day: day ?? DEFAULT_FORMATS.day,
      narrowDay: narrowDay ?? DEFAULT_FORMATS.narrowDay,
      hour: hour ?? DEFAULT_FORMATS.hour,
      time: time ?? DEFAULT_FORMATS.time,
    }),
    [day, narrowDay, hour, time],
  );

  const [hoveredKey, setHoveredKey] = useState<string | null>(null);

  // "+N more": the list is derived from the current items, so it follows data changes.
  const [more, setMore] = useState<MoreState | null>(null);
  const openMore = useCallback(
    (date: Date, anchor: HTMLElement) => setMore({ date, anchor }),
    [],
  );
  const closeMore = useCallback(
    (restoreFocus = false) => {
      // Back to the "+N more" link when closed with the keyboard or the close button.
      if (restoreFocus && more?.anchor.isConnected) more.anchor.focus();
      setMore(null);
    },
    [more],
  );
  const moreItems = useMemo(
    () => (more ? itemsOnDay(items, more.date) : []),
    [items, more],
  );
  // Closed when the period changes, or when its day has no items left.
  useEffect(() => setMore(null), [view, range]);
  useEffect(() => {
    if (more && !moreItems.length) setMore(null);
  }, [more, moreItems]);

  const value: CalendarContextValue = {
    props: props as CalendarProps<CalendarItem>,
    view,
    currentDate,
    weekStartsOn,
    locale: props.locale,
    labels,
    formats,
    now,
    todayKey,
    startHour,
    endHour,
    colorDotsByDate,
    collapsedCells,
    hoveredKey: props.disableHoverEffect ? null : hoveredKey,
    setHoveredKey,
    openMore,
    shift: (direction) => toDateKey(shiftDate(view, currentDate, direction)),
  };

  return {
    value,
    range,
    items,
    title: getTitle(view, currentDate, range, props.locale, monthYear),
    more: more && moreItems.length ? { ...more, items: moreItems } : null,
    closeMore,
  };
}

/** `labels` over the defaults; `undefined` values keep the default. */
function resolveLabels(
  labels: CalendarLabels = {},
  todayLabel: string | undefined,
): ResolvedLabels {
  return {
    ...DEFAULT_LABELS,
    ...definedOnly(labels),
    ...definedOnly({ today: todayLabel }),
    views: { ...DEFAULT_LABELS.views, ...definedOnly(labels.views ?? {}) },
  };
}

const definedOnly = <T extends object>(value: T): Partial<T> =>
  Object.fromEntries(
    Object.entries(value).filter(([, entry]) => entry !== undefined),
  ) as Partial<T>;
