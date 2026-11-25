import { startOfHour } from 'date-fns';
import { MIN_ITEM_MINUTES, MOMENT_ITEM_MINUTES } from '../constants';
import type { CalendarItem, CalendarView, CellDisplayMode } from '../types';
import { minutesFrom, toDateKey, toDateTimeKey } from './date';
import { compareItems, isMultiDay, type NormalizedItem } from './items';

/* -------------------------------------------------------------------------- */
/* Timeline: WEEK_TIME and DAY                                                */
/* -------------------------------------------------------------------------- */

export interface TimeGridOptions {
  /** First visible hour. Default 0. */
  startHour?: number;
  /** Hour at which the grid ends, exclusive. Default 24. */
  endHour?: number;
  /** Shortest drawn duration in minutes, so short items stay readable. Default 20. */
  minDuration?: number;
  /**
   * Let side-by-side items overlap their right neighbour (later items are drawn on top),
   * which leaves more room for text, like Google Calendar. Default `true`.
   */
  overlap?: boolean;
}

export interface TimeGridSegment<T extends CalendarItem = CalendarItem> {
  n: NormalizedItem<T>;
  /** Minutes from the top of the grid. */
  top: number;
  /** Drawn height in minutes. */
  height: number;
  /** Column inside its overlap group, from 0. */
  column: number;
  /** Number of columns in its overlap group. */
  columns: number;
  /** Columns the item spans, at least 1: it grows into free columns on its right. */
  span: number;
  /** Left edge as a fraction of the day column, 0-1. */
  left: number;
  /**
   * Width as a fraction of the day column, 0-1. With `overlap`, an item that has a
   * neighbour on its right reaches under it, like the cascading items in Google Calendar.
   */
  width: number;
  /** The item started before this day or before `startHour`. */
  continuesBefore: boolean;
  /** The item continues after this day or after `endHour`. */
  continuesAfter: boolean;
}

/**
 * Positions the items of one day on an hour timeline, the way Google Calendar does:
 * overlapping items form a group, each takes the first free column of the group, and
 * then widens to the right over columns that are free during its time.
 */
export function layoutTimeGrid<T extends CalendarItem>(
  items: NormalizedItem<T>[],
  day: Date,
  options: TimeGridOptions = {},
): TimeGridSegment<T>[] {
  const startMin = (options.startHour ?? 0) * 60;
  const endMin = (options.endHour ?? 24) * 60;
  const minDuration = options.minDuration ?? MIN_ITEM_MINUTES;
  const overlap = options.overlap ?? true;

  const dayKey = toDateKey(day);
  const segments: TimeGridSegment<T>[] = [];
  for (const n of items) {
    // Cheap string check first; most items are on other days.
    if (n.lastKey < dayKey || n.firstKey > dayKey) continue;
    const from = minutesFrom(day, n.start);
    const to = minutesFrom(day, n.end);
    const isPoint = to === from;
    // A moment belongs to the day it is on; a range to every day it overlaps.
    const touches = isPoint
      ? from >= startMin && from < endMin
      : from < endMin && to > startMin;
    if (!touches) continue;

    const top = Math.max(from, startMin) - startMin;
    const bottom =
      Math.min(isPoint ? from + MOMENT_ITEM_MINUTES : to, endMin) - startMin;
    const height = Math.min(
      Math.max(bottom - top, minDuration),
      endMin - startMin - top,
    );
    segments.push({
      n,
      top,
      height,
      column: 0,
      columns: 1,
      span: 1,
      left: 0,
      width: 1,
      continuesBefore: from < startMin,
      continuesAfter: to > endMin,
    });
  }

  segments.sort(
    (a, b) => a.top - b.top || b.height - a.height || compareItems(a.n, b.n),
  );

  let group: TimeGridSegment<T>[] = [];
  let groupBottom = -Infinity;
  for (const segment of segments) {
    if (group.length && segment.top >= groupBottom) {
      packGroup(group, overlap);
      group = [];
      groupBottom = -Infinity;
    }
    group.push(segment);
    groupBottom = Math.max(groupBottom, segment.top + segment.height);
  }
  if (group.length) packGroup(group, overlap);

  return segments;
}

const overlaps = (
  a: { top: number; height: number },
  b: { top: number; height: number },
) => a.top < b.top + b.height && b.top < a.top + a.height;

/** How far an item may reach under its right neighbour, relative to its own width. */
const OVERLAP_FACTOR = 1.7;

function packGroup(group: TimeGridSegment[], overlap: boolean): void {
  const columnBottoms: number[] = [];
  for (const segment of group) {
    let column = columnBottoms.findIndex((bottom) => bottom <= segment.top);
    if (column === -1) column = columnBottoms.length;
    columnBottoms[column] = segment.top + segment.height;
    segment.column = column;
  }
  const columns = columnBottoms.length;
  for (const segment of group) {
    segment.columns = columns;
    let span = 1;
    for (let c = segment.column + 1; c < columns; c++) {
      const blocked = group.some(
        (other) => other.column === c && overlaps(other, segment),
      );
      if (blocked) break;
      span++;
    }
    segment.span = span;
    segment.left = segment.column / columns;
    const width = span / columns;
    const hasNeighbour = segment.column + span < columns;
    segment.width =
      overlap && hasNeighbour
        ? Math.min(width * OVERLAP_FACTOR, 1 - segment.left)
        : width;
  }
}

/* -------------------------------------------------------------------------- */
/* Rows of days: MONTH, WEEK and the all-day row                              */
/* -------------------------------------------------------------------------- */

export interface DayRowOptions {
  /** Lanes to show; items that need more lanes are counted as hidden. Default unlimited. */
  maxLanes?: number;
  /** Days (`yyyy-MM-dd`) that show only their last item, see `cellDisplayMode`. */
  collapsedDays?: ReadonlySet<string>;
}

export interface DayRowSegment<T extends CalendarItem = CalendarItem> {
  n: NormalizedItem<T>;
  /** First column, from 0. */
  startCol: number;
  /** Number of columns, at least 1. */
  span: number;
  lane: number;
  /** Drawn as a bar: an all-day or multi-day item. Others are single-day timed items. */
  isBar: boolean;
  continuesBefore: boolean;
  continuesAfter: boolean;
}

export interface DayRowLayout<T extends CalendarItem = CalendarItem> {
  segments: DayRowSegment<T>[];
  /** Lanes used by visible segments. */
  laneCount: number;
  /** Per column: items that did not fit in `maxLanes`. */
  hidden: NormalizedItem<T>[][];
  /** Per column: every item touching that day, in display order. */
  itemsByDay: NormalizedItem<T>[][];
}

/**
 * Lays out items over a row of consecutive days (a week of the month, the WEEK view or
 * the all-day row) in lanes, so bars spanning several days never overlap. Multi-day and
 * all-day items come first, like in Google Calendar.
 */
export function layoutDayRow<T extends CalendarItem>(
  items: NormalizedItem<T>[],
  days: Date[],
  options: DayRowOptions = {},
): DayRowLayout<T> {
  const keys = days.map(toDateKey);
  const firstKey = keys[0];
  const lastKey = keys[keys.length - 1];
  const collapsed = options.collapsedDays ?? new Set<string>();
  const maxLanes = options.maxLanes ?? Infinity;

  const itemsByDay: NormalizedItem<T>[][] = days.map(() => []);
  const indexOfKey = new Map(keys.map((key, i) => [key, i]));
  type Run = Omit<DayRowSegment<T>, 'lane'>;
  const runs: Run[] = [];

  for (const n of items) {
    const itemFirst = n.firstKey;
    const itemLast = n.lastKey;
    if (itemLast < firstKey || itemFirst > lastKey) continue;
    const first = itemFirst < firstKey ? 0 : (indexOfKey.get(itemFirst) ?? 0);
    const last =
      itemLast > lastKey
        ? keys.length - 1
        : (indexOfKey.get(itemLast) ?? keys.length - 1);
    const isBar = n.isAllDay || isMultiDay(n);

    for (let col = first; col <= last; col++) itemsByDay[col].push(n);

    // Collapsed days break a bar into runs around them.
    let runStart = -1;
    for (let col = first; col <= last + 1; col++) {
      const open = col <= last && !collapsed.has(keys[col]);
      if (open && runStart === -1) runStart = col;
      if (!open && runStart !== -1) {
        runs.push({
          n,
          startCol: runStart,
          span: col - runStart,
          isBar,
          continuesBefore: runStart > first || itemFirst < firstKey,
          continuesAfter: col - 1 < last || itemLast > lastKey,
        });
        runStart = -1;
      }
    }
  }

  // A collapsed day shows a single item: the last one on that day.
  keys.forEach((key, col) => {
    if (!collapsed.has(key) || !itemsByDay[col].length) return;
    const n = itemsByDay[col][itemsByDay[col].length - 1];
    runs.push({
      n,
      startCol: col,
      span: 1,
      isBar: n.isAllDay || isMultiDay(n),
      continuesBefore: n.firstKey < key,
      continuesAfter: n.lastKey > key,
    });
  });

  runs.sort(
    (a, b) =>
      Number(b.isBar) - Number(a.isBar) ||
      a.startCol - b.startCol ||
      b.span - a.span ||
      compareItems(a.n, b.n),
  );

  const lanes: boolean[][] = [];
  const segments: DayRowSegment<T>[] = [];
  const hidden: NormalizedItem<T>[][] = days.map(() => []);

  for (const run of runs) {
    let lane = 0;
    for (; ; lane++) {
      const row = lanes[lane];
      if (!row) break;
      let free = true;
      for (let c = run.startCol; c < run.startCol + run.span; c++) {
        if (row[c]) {
          free = false;
          break;
        }
      }
      if (free) break;
    }
    if (lane < maxLanes) {
      occupy(lanes, lane, run.startCol, run.span);
      segments.push({ ...run, lane });
      continue;
    }
    // No lane is free across the whole run: place the parts of it that fit on their
    // own days, so a bar stays visible where there is room, and hide the rest.
    placeInPieces(run, lanes, maxLanes, segments, hidden);
  }

  return { segments, laneCount: lanes.length, hidden, itemsByDay };
}

function occupy(lanes: boolean[][], lane: number, from: number, span: number) {
  lanes[lane] ??= [];
  for (let c = from; c < from + span; c++) lanes[lane][c] = true;
}

/** Lowest lane under `maxLanes` that is free in column `col`, or -1. */
function freeLaneAt(lanes: boolean[][], col: number, maxLanes: number) {
  for (let lane = 0; lane < maxLanes; lane++) {
    if (!lanes[lane]?.[col]) return lane;
  }
  return -1;
}

function placeInPieces<T extends CalendarItem>(
  run: Omit<DayRowSegment<T>, 'lane'>,
  lanes: boolean[][],
  maxLanes: number,
  segments: DayRowSegment<T>[],
  hidden: NormalizedItem<T>[][],
) {
  const end = run.startCol + run.span;
  let col = run.startCol;
  while (col < end) {
    const lane = freeLaneAt(lanes, col, maxLanes);
    if (lane === -1) {
      hidden[col].push(run.n);
      col++;
      continue;
    }
    let to = col + 1;
    while (to < end && !lanes[lane]?.[to]) to++;
    occupy(lanes, lane, col, to - col);
    segments.push({
      ...run,
      startCol: col,
      span: to - col,
      lane,
      continuesBefore: col > run.startCol || run.continuesBefore,
      continuesAfter: to < end || run.continuesAfter,
    });
    col = to;
  }
}

/* -------------------------------------------------------------------------- */
/* Horizontal day: DAY_REVERSE                                                */
/* -------------------------------------------------------------------------- */

export interface HorizontalSegment<T extends CalendarItem = CalendarItem> {
  n: NormalizedItem<T>;
  /** Minutes from the left edge of the grid. */
  left: number;
  /** Drawn width in minutes. */
  width: number;
  lane: number;
  continuesBefore: boolean;
  continuesAfter: boolean;
}

/** Lays out one day's items on a horizontal hour axis, in lanes that never overlap. */
export function layoutHorizontal<T extends CalendarItem>(
  items: NormalizedItem<T>[],
  day: Date,
  options: TimeGridOptions = {},
): { segments: HorizontalSegment<T>[]; laneCount: number } {
  // Items need room for a title when laid out horizontally.
  const vertical = layoutTimeGrid(items, day, {
    minDuration: MOMENT_ITEM_MINUTES,
    ...options,
  });
  // `layoutTimeGrid` returns the segments sorted by top, then by height.
  const laneEnds: number[] = [];
  const segments = vertical.map((s) => {
    let lane = laneEnds.findIndex((end) => end <= s.top);
    if (lane === -1) lane = laneEnds.length;
    laneEnds[lane] = s.top + s.height;
    return {
      n: s.n,
      left: s.top,
      width: s.height,
      lane,
      continuesBefore: s.continuesBefore,
      continuesAfter: s.continuesAfter,
    };
  });
  return { segments, laneCount: laneEnds.length };
}

/* -------------------------------------------------------------------------- */
/* In-place views: WEEK_IN_PLACE and DAY_IN_PLACE                             */
/* -------------------------------------------------------------------------- */

/**
 * Groups items by the hour in which they start, keyed `yyyy-MM-dd HH:mm:ss`. Only the
 * start counts; the duration is not drawn.
 */
export function groupByStartHour<T extends CalendarItem>(
  items: NormalizedItem<T>[],
): Map<string, NormalizedItem<T>[]> {
  const groups = new Map<string, NormalizedItem<T>[]>();
  for (const n of items) {
    const key = toDateTimeKey(startOfHour(n.start));
    const group = groups.get(key);
    if (group) group.push(n);
    else groups.set(key, [n]);
  }
  return groups;
}

/* -------------------------------------------------------------------------- */
/* cellDisplayMode                                                            */
/* -------------------------------------------------------------------------- */

/**
 * Keys of the collapsed cells of `view` on `days`: `yyyy-MM-dd` for day cells and
 * `yyyy-MM-dd HH:mm:ss` for the hour cells of the in-place views.
 */
export function getCollapsedCells(
  cellDisplayMode: CellDisplayMode | undefined,
  view: CalendarView,
  days: Date[],
): Set<string> {
  const mode = cellDisplayMode?.[view];
  if (mode?.state === 'CUSTOM') return new Set(mode.inactiveCells ?? []);
  if (mode?.state !== 'ALL_COLLAPSED') return new Set();
  const keys = new Set<string>();
  for (const day of days) {
    keys.add(toDateKey(day));
    for (let hour = 0; hour < 24; hour++) {
      keys.add(
        toDateTimeKey(
          new Date(day.getFullYear(), day.getMonth(), day.getDate(), hour),
        ),
      );
    }
  }
  return keys;
}
